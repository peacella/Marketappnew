import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const CART_STORAGE_KEY = 'pella_cart';
// Last cart state known to match Firestore. Persisted so logout/login
// and app restarts never double-count already-synced quantities.
const CART_SYNCED_KEY = 'pella_cart_synced';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const isValidItem = (c) =>
  !!c &&
  !!c.product &&
  typeof c.product.id !== 'undefined' &&
  Number.isFinite(c.quantity) &&
  c.quantity > 0;

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
};

const writeLocal = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage full/blocked: cart still works in memory for this session
  }
};

const hasStoredBaseline = () => {
  try {
    return localStorage.getItem(CART_SYNCED_KEY) !== null;
  } catch {
    return false;
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Bumped whenever connectivity returns, to retry a pending initial sync.
  const [syncAttempt, setSyncAttempt] = useState(0);

  // Bookkeeping refs (never rendered, so no re-render loops):
  // - syncedRef: cloud writes stay DISABLED until the initial server
  //   read + merge for the current user has completed. This is what stops
  //   an empty local cart from wiping a real Firestore cart on app open.
  // - baselineRef: last cart state known to match Firestore. Used to
  //   compute genuine local additions (avoids double-counting on re-login).
  // - runIdRef: invalidates stale async sync runs (e.g. logout mid-fetch).
  const syncedRef = useRef(false);
  const baselineRef = useRef([]);
  const runIdRef = useRef(0);

  // Mount: restore local cart + sync baseline. Works fully offline.
  useEffect(() => {
    setItems(readLocal(CART_STORAGE_KEY));
    baselineRef.current = readLocal(CART_SYNCED_KEY);
  }, []);

  // Always persist locally (offline-first: cart is viewable without internet).
  useEffect(() => {
    writeLocal(CART_STORAGE_KEY, items);
  }, [items]);

  // Retry the initial sync when connectivity returns.
  useEffect(() => {
    const retry = () => setSyncAttempt((n) => n + 1);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  // Initial sync on sign-in: server read -> delta-merge -> enable cloud writes.
  useEffect(() => {
    if (!user) {
      syncedRef.current = false;
      return;
    }
    if (syncedRef.current) return; // already in sync this session
    const runId = ++runIdRef.current;
    (async () => {
      // Force a SERVER read: a cache read could be stale, and blindly
      // writing afterwards is exactly what used to clobber cloud carts.
      let cloud = [];
      try {
        const snap = await getDocFromServer(doc(db, 'users', user.uid));
        const data = snap.data()?.cart;
        if (Array.isArray(data)) cloud = data.filter(isValidItem);
      } catch {
        // Offline/unreachable: stay unsynced, keep serving the local cart.
        // The 'online' listener above will retry this effect.
        return;
      }
      if (runId !== runIdRef.current) return; // superseded (e.g. logged out mid-fetch)

      // Re-read local storage NOW (user may have added items while fetching).
      const local = readLocal(CART_STORAGE_KEY);
      const baseline = baselineRef.current;
      const baseQty = new Map(baseline.map((b) => [b.product.id, b.quantity]));
      const legacy = !hasStoredBaseline();

      // Start from the cloud cart, then fold in genuine local additions.
      const byId = new Map();
      for (const c of cloud) {
        byId.set(c.product.id, { product: c.product, quantity: c.quantity });
      }
      for (const l of local) {
        const inCloud = byId.get(l.product.id);
        if (legacy) {
          // First run after this fix ships: no baseline exists, so sum
          // semantics can't apply safely yet. Take the max for shared items
          // (prevents a one-time doubling), keep local-only items whole.
          // Baseline is written below, so this path runs exactly once.
          if (inCloud) {
            if (l.quantity > inCloud.quantity) {
              byId.set(l.product.id, { product: inCloud.product, quantity: l.quantity });
            }
          } else {
            byId.set(l.product.id, { product: l.product, quantity: l.quantity });
          }
        } else {
          // Normal path: only quantities added SINCE the last sync are new.
          // Example: cloud eggs x3 + offline-added eggs x2 -> eggs x7.
          const added = Math.max(0, l.quantity - (baseQty.get(l.product.id) ?? 0));
          if (added === 0) continue;
          if (inCloud) {
            byId.set(l.product.id, {
              product: inCloud.product,
              quantity: inCloud.quantity + added,
            });
          } else {
            byId.set(l.product.id, { product: l.product, quantity: added });
          }
        }
      }

      const merged = [...byId.values()];
      if (runId !== runIdRef.current) return;
      syncedRef.current = true;
      baselineRef.current = merged;
      writeLocal(CART_SYNCED_KEY, merged);
      setItems(merged);
      // The gated save effect below persists `merged` to Firestore,
      // propagating any offline additions to the cloud.
    })();
  }, [user, syncAttempt]);

  // Cloud writes: GATED — never fire before the initial merge completes.
  // This single guard is what stops empty local carts wiping Firestore.
  useEffect(() => {
    if (!user || !syncedRef.current) return;
    baselineRef.current = items;
    writeLocal(CART_SYNCED_KEY, items);
    const cartRef = doc(db, 'users', user.uid);
    setDoc(cartRef, { cart: items }, { merge: true }).catch(() => {});
  }, [items, user]);

  const addToCart = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    isDrawerOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openDrawer,
    closeDrawer,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
