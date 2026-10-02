# P-ELLA Market — Full-Stack Web App Build Prompt

## PROJECT OVERVIEW

Build **P-ELLA Market**, a fully functional food & grocery e-commerce web application. The app must be production-ready, beautifully designed, and deployable on Netlify with only environment variable population required before going live.

**Core Technologies:**

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS v3 + Framer Motion (animations)
- **Database:** Firebase Firestore (Google Cloud)
- **Authentication:** Firebase Auth with Google Sign-In (OAuth via Google Cloud Console)
- **Payments:** Paystack (inline popup, NGN currency)
- **Emails:** Mailgun (via Netlify Functions — never expose secret keys in frontend)
- **Hosting:** Netlify (with Netlify Functions for all server-side secret operations)

---

## CRITICAL RULES

1. **NEVER expose secret API keys in frontend code.** All secret keys (`PAYSTACK_SECRET_KEY`, `MAILGUN_API_KEY`) must ONLY be used inside `netlify/functions/`. Frontend code may only use `VITE_` prefixed public keys.
2. All `VITE_` prefixed env vars are referenced as `import.meta.env.VITE_KEY_NAME` in React code.
3. Netlify Function env vars (non-`VITE_` prefixed) are accessed via `process.env.KEY_NAME` inside `netlify/functions/`.
4. The app must be fully functional without any seed data already in Firestore — include a seed script and instructions.
5. Every page must be fully responsive (mobile-first).
6. All empty/loading/error states must be handled gracefully with beautiful UI feedback.
7. Do NOT use `create-react-app`. Use `npm create vite@latest` with the React template.

---

## COMPLETE FILE/FOLDER STRUCTURE

```
p-ella-market/
├── public/
│   ├── _redirects                  # Netlify SPA redirect: /* /index.html 200
│   └── favicon.ico
├── netlify/
│   └── functions/
│       ├── process-order.js        # Verify Paystack + save order to Firestore + trigger email
│       └── send-confirmation.js    # Send Mailgun HTML email receipt
├── src/
│   ├── assets/
│   │   └── logo.svg                # P-ELLA Market logo (create inline SVG)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx          # Sticky navbar, cart badge, auth button, mobile menu
│   │   │   └── Footer.jsx          # Links, social, copyright
│   │   ├── ui/
│   │   │   ├── Button.jsx          # Reusable button variants (primary, outline, ghost)
│   │   │   ├── ProductCard.jsx     # Product card with hover zoom, add to cart
│   │   │   ├── CartDrawer.jsx      # Slide-in cart drawer from right side
│   │   │   ├── CategoryFilter.jsx  # Horizontal pill/chip category selector
│   │   │   ├── SearchBar.jsx       # Live search input with icon
│   │   │   ├── Toast.jsx           # Animated toast notification system
│   │   │   ├── LoadingSkeleton.jsx # Skeleton card for loading states
│   │   │   ├── EmptyState.jsx      # Empty cart/results state with illustration
│   │   │   └── Modal.jsx           # Reusable modal wrapper
│   │   └── sections/
│   │       ├── HeroSection.jsx     # Bold hero with gradient, CTA button, animated text
│   │       ├── FeaturedProducts.jsx # Horizontal scroll row of featured items
│   │       ├── CategorySection.jsx  # Grid of category cards with icons/images
│   │       └── PromosBanner.jsx    # Promotional banner strip
│   ├── pages/
│   │   ├── Home.jsx                # Hero + FeaturedProducts + CategorySection + PromosBanner
│   │   ├── Shop.jsx                # Full catalogue: search + CategoryFilter + product grid + pagination
│   │   ├── ProductDetail.jsx       # Product image, description, reviews placeholder, add to cart
│   │   ├── Checkout.jsx            # Shipping form + order summary + Paystack trigger
│   │   ├── OrderSuccess.jsx        # Animated success page with order details
│   │   └── Account.jsx             # User profile info + order history (protected route)
│   ├── context/
│   │   ├── CartContext.jsx         # Cart state, persistence in localStorage + Firestore sync if logged in
│   │   └── AuthContext.jsx         # Firebase auth state, Google sign-in/out helpers
│   ├── hooks/
│   │   ├── useCart.js              # Convenience hook wrapping CartContext
│   │   ├── useAuth.js              # Convenience hook wrapping AuthContext
│   │   └── useProducts.js         # Firestore product queries with real-time updates
│   ├── lib/
│   │   ├── firebase.js             # Firebase app init, Firestore and Auth exports
│   │   └── paystack.js             # Paystack inline script loader and initializePayment helper
│   ├── utils/
│   │   ├── formatCurrency.js       # Format numbers as ₦1,234.00
│   │   ├── generateOrderId.js      # Generate short readable order IDs like PELLA-XXXX
│   │   └── constants.js            # App-wide constants (categories list, etc.)
│   ├── data/
│   │   └── seedProducts.js         # Array of 24+ realistic food/grocery products with Unsplash image URLs
│   ├── App.jsx                     # Router setup, auth-protected routes, global layout
│   ├── main.jsx                    # Vite entry point, context providers
│   └── index.css                   # Tailwind directives + custom global styles + CSS variables
├── scripts/
│   └── seedFirestore.js            # Node script to seed Firestore with products from seedProducts.js
├── .env.example                    # All required env keys with empty values and comments
├── .gitignore                      # Include .env, node_modules, dist
├── netlify.toml                    # Build settings + functions directory
├── vite.config.js                  # Vite config
├── tailwind.config.js              # Tailwind config with custom colors
└── package.json                    # All dependencies listed
```

---

## ENVIRONMENT VARIABLES

Create a `.env.example` file with these exact keys (empty values, with a comment above each):

```env
# Firebase Configuration (from Firebase Console > Project Settings > Your Apps)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Paystack (Public key is safe in frontend — get from Paystack Dashboard > Settings > API Keys)
VITE_PAYSTACK_PUBLIC_KEY=

# Paystack Secret Key — ONLY used in Netlify Functions, NEVER in frontend
PAYSTACK_SECRET_KEY=

# Mailgun — ONLY used in Netlify Functions, NEVER in frontend
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MAILGUN_FROM_EMAIL=

# App URL (your Netlify domain, e.g. https://p-ella-market.netlify.app)
VITE_APP_URL=
```

---

## DETAILED COMPONENT & FEATURE SPECIFICATIONS

### 1. COLOR PALETTE & DESIGN SYSTEM (tailwind.config.js)

Use this exact palette in `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  brand: {
    orange: '#E8531A',       // Primary CTA, buttons
    'orange-light': '#F97316',
    'orange-dark': '#C2410C',
    green: '#16A34A',        // Success states, freshness badge
    'green-dark': '#15803D',
    plum: '#7E22CE',         // Accent, highlights
    cream: '#FFFBF5',        // Page background
    'cream-dark': '#FEF3C7',
    charcoal: '#1C1917',     // Primary text
    muted: '#78716C',        // Secondary text
  }
}
```

Also extend fonts:

```js
fontFamily: {
  sans: ['Poppins', 'sans-serif'],
  display: ['DM Serif Display', 'serif'],
}
```

Load both fonts from Google Fonts in `index.html`.

### 2. NAVBAR (Navbar.jsx)

- Sticky at top with `backdrop-blur-md` + slight semi-transparent background
- Left: P-ELLA Market logo/wordmark (bold, brand-orange + plum)
- Center (desktop): Navigation links — Home, Shop, Categories
- Right: Search icon, Cart icon with animated badge count, Google Sign-In button (or user avatar dropdown if logged in)
- Mobile: Hamburger menu → slide-down mobile menu with Framer Motion
- Cart badge: bright brand-orange circle with white number, animates (scale bounce) when items are added
- Google Sign-In button: shows Google logo + "Sign in" text; when signed in, shows user's photo (circular) + name, with dropdown showing "My Account" and "Sign Out"

### 3. HERO SECTION (HeroSection.jsx)

- Full-width, min-height 90vh
- Bold gradient background: `from-brand-orange via-amber-500 to-brand-green` diagonal
- Large display headline: "Fresh Groceries, Delivered with Love" — use `font-display`, white, text-5xl md:text-7xl
- Subtext: "Discover the finest African foods, fresh produce, and pantry staples delivered to your door"
- Two CTA buttons: "Shop Now" (white bg, brand-orange text) + "View Categories" (outline white)
- Animated floating food emoji/icons around the background using Framer Motion (🥦 🍎 🌽 🥬 🍳 floating up and down)
- Scroll indicator at bottom

### 4. PRODUCT CARD (ProductCard.jsx)

Props: `{ product, onAddToCart }`

- White card, rounded-2xl, shadow-md
- Product image: aspect-square, object-cover, with `group-hover:scale-105` zoom transition (0.3s ease)
- Top-right: Category badge pill (e.g. "Vegetables", "Beverages")
- If `product.featured === true`: Gold "★ Featured" ribbon on top-left corner
- Product name: font-semibold, 1-2 lines with line-clamp
- Price: large, brand-orange, ₦ formatted with `formatCurrency()`
- Stock indicator: "In Stock" (green dot) or "Out of Stock" (red, disable add button)
- Add to Cart button: full-width, brand-orange, with cart+ icon; on click shows brief checkmark animation and triggers toast "Added to cart!"
- Quantity controls appear inline if the item is already in the cart (- qty +)

### 5. CART DRAWER (CartDrawer.jsx)

- Slides in from the right, 400px wide on desktop, full-screen on mobile
- Dark semi-transparent overlay behind it
- Header: "Your Cart (X items)" with X button to close
- Cart items list: each item shows image, name, category, price, quantity controls (+/-/remove)
- Subtotal, delivery estimate line
- "Proceed to Checkout" button (brand-orange, full-width) — if not logged in, triggers Google Sign-In modal first
- "Continue Shopping" link
- Empty state: cute illustration (SVG) + "Your cart is empty" + Shop Now button
- Total updates in real time as quantities change
- Framer Motion: slide-in/out animation for the drawer

### 6. SHOP PAGE (Shop.jsx)

- Page title: "Fresh Market" with breadcrumb
- Sticky filter bar (below navbar):
  - Search bar (left)
  - Category filter pills: All, Fruits & Vegetables, Grains & Staples, Beverages, Snacks, Dairy & Eggs, Condiments & Spices, Frozen Foods
  - Sort dropdown: Featured, Price: Low to High, Price: High to Low, Newest
- Product grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` gap-4
- Loading state: show 8 skeleton cards while Firestore data loads
- Empty state: "No products found" with search illustration
- Product count: "Showing X of Y products"
- Pagination or "Load More" button at bottom (load 12 at a time)
- All filtering/searching happens client-side after initial Firestore fetch

### 7. PRODUCT DETAIL PAGE (ProductDetail.jsx)

Route: `/product/:id`

- Breadcrumb: Home > Shop > [Category] > [Product Name]
- Left column: Large product image (aspect-ratio 1:1, rounded-2xl); if multiple images, show thumbnail strip below
- Right column:
  - Category badge
  - Product name (text-3xl, font-display)
  - Price (text-4xl, brand-orange, bold)
  - Stock status badge
  - Short description paragraph
  - Quantity selector (- qty +) with current quantity shown
  - "Add to Cart" button (large, brand-orange, full-width on mobile)
  - Delivery info strip: "🚚 Free delivery on orders over ₦10,000"
  - Product details accordion: Nutritional Info, Storage Tips, About the Seller
- Below: "You might also like" — horizontal scroll of 4 related products from the same category

### 8. CHECKOUT PAGE (Checkout.jsx)

- Two-column layout (desktop): left = form, right = order summary
- **Order Summary (right panel):**
  - Cart items list (compact): image, name, qty, price
  - Subtotal
  - Delivery fee: ₦1,000 (flat rate; free if order > ₦15,000)
  - Total in large bold text
  - Paystack logo + "Secure Checkout" badge
- **Shipping & Contact Form (left panel):**
  - Full Name (required)
  - Email Address (required, pre-filled if Google-authed)
  - Phone Number (required, Nigerian format hint)
  - Delivery Address (required)
  - City (required)
  - State dropdown (all 36 Nigerian states + FCT)
  - Additional Notes (optional textarea)
- **"Pay ₦[TOTAL] Securely"** button — large, brand-orange, full-width; shows Paystack lock icon
- On click: validate form → call `initializePayment()` from `paystack.js` with the total amount and user email
- Paystack popup opens; user completes payment
- On Paystack `onSuccess` callback: call `/.netlify/functions/process-order` with payment reference + cart data + shipping details
- Show loading spinner while Netlify Function processes
- On success: navigate to `/order-success?orderId=PELLA-XXXX`
- On failure: show error toast with retry option

### 9. ORDER SUCCESS PAGE (OrderSuccess.jsx)

- Large animated checkmark (Framer Motion draw animation, brand-green)
- "Order Confirmed! 🎉" heading
- "Your order **PELLA-XXXX** has been placed successfully."
- "We've sent a confirmation email to [email]."
- Order summary table: item, qty, price
- Total paid
- Delivery address recap
- Two buttons: "Continue Shopping" and "View My Orders" (goes to Account page)
- Confetti animation using `canvas-confetti` package

### 10. ACCOUNT PAGE (Account.jsx) — Protected Route

- If not logged in: redirect to Home with a sign-in modal prompt
- User profile card: avatar, name, email, Google account indicator
- **Order History section:**
  - Fetch orders from Firestore where `userId == currentUser.uid`, sorted by `createdAt` descending
  - Each order shown as a card: order ID, date, total, status badge (Paid/Processing/Delivered), item count
  - Expandable to show items in the order
  - Empty state: "No orders yet. Start shopping!"

---

## FIREBASE SETUP (src/lib/firebase.js)

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

---

## FIRESTORE DATA SCHEMA

### Collection: `products`

```
{
  id: auto-generated,
  name: string,            // e.g. "Roma Tomatoes (500g)"
  description: string,     // 2-3 sentences
  price: number,           // in NGN kobo? No — store as whole NGN, e.g. 2500
  category: string,        // "Fruits & Vegetables" | "Grains & Staples" | "Beverages" | "Snacks" | "Dairy & Eggs" | "Condiments & Spices" | "Frozen Foods"
  image: string,           // Unsplash URL or placeholder
  images: string[],        // array of image URLs
  stock: number,           // quantity in stock
  featured: boolean,       // show in featured section
  unit: string,            // "per kg" | "per pack" | "per bunch" | "500ml" etc
  rating: number,          // 3.5 - 5.0
  reviewCount: number,     // e.g. 24
  createdAt: timestamp,
}
```

### Collection: `orders`

```
{
  id: string,              // PELLA-XXXX format
  userId: string,          // Firebase Auth UID
  items: [
    {
      productId: string,
      name: string,
      image: string,
      price: number,
      quantity: number,
    }
  ],
  shipping: {
    fullName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    notes: string,
  },
  subtotal: number,
  deliveryFee: number,
  total: number,
  paystackReference: string,
  status: 'paid' | 'processing' | 'shipped' | 'delivered',
  createdAt: timestamp,
}
```

### Collection: `users`

```
{
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: timestamp,
  lastLogin: timestamp,
}
```

---

## NETLIFY FUNCTIONS

### `netlify/functions/process-order.js`

This function must:

1. Receive POST body: `{ reference, cartItems, shipping, total, userId }`
2. Verify the Paystack payment using `PAYSTACK_SECRET_KEY`:
   - GET `https://api.paystack.co/transaction/verify/${reference}`
   - Header: `Authorization: Bearer ${process.env.PAYSTACK_SECRET_KEY}`
3. Check response: `data.status === 'success'` and `data.amount === total * 100` (Paystack uses kobo)
4. If verified:
   - Generate order ID: `PELLA-${Date.now().toString(36).toUpperCase().slice(-4)}`
   - Save order document to Firestore using Firebase Admin SDK
   - Call the send-confirmation function internally (or inline the email logic)
5. Return `{ success: true, orderId }` or `{ success: false, error }` with appropriate HTTP status codes
6. Use `firebase-admin` package for Firestore writes from server side
7. Firebase Admin init: use `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT_KEY` env vars (add these to .env.example with instructions)

**Add to .env.example:**

```
# Firebase Admin SDK (for Netlify Functions — get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=  # paste the full JSON as a single-line string
```

### `netlify/functions/send-confirmation.js`

This function must:

1. Receive POST body: `{ to, orderId, items, total, shipping }`
2. Use Mailgun API to send a beautiful HTML email:
   - API endpoint: `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`
   - Auth: Basic auth with `api:${process.env.MAILGUN_API_KEY}`
   - From: `process.env.MAILGUN_FROM_EMAIL` (e.g. "P-ELLA Market <orders@yourdomain.com>")
3. HTML email template must include:
   - P-ELLA Market header with orange branding
   - "Order Confirmed! 🎉" heading
   - Order ID and date
   - Itemized list of products ordered (name, qty, price)
   - Subtotal, delivery fee, total
   - Delivery address
   - "We'll notify you when your order ships" footer
   - Inline CSS only (email clients don't support external CSS)
4. Return `{ success: true }` or `{ success: false, error }`
5. Use the `form-data` and `node-fetch` npm packages (or built-in fetch in Node 18+)

---

## PAYSTACK INTEGRATION (src/lib/paystack.js)

```js
// Load Paystack inline script
export const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const initializePayment = async ({
  email,
  amount,
  onSuccess,
  onClose,
}) => {
  await loadPaystackScript();
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100, // Paystack uses kobo (multiply NGN by 100)
    currency: "NGN",
    ref: `PELLA-${Date.now()}`,
    metadata: {
      custom_fields: [
        { display_name: "Shop", variable_name: "shop", value: "P-ELLA Market" },
      ],
    },
    callback: onSuccess,
    onClose,
  });
  handler.openIframe();
};
```

---

## SEED DATA (src/data/seedProducts.js)

Provide an array of at least 24 realistic Nigerian food & grocery products covering all 7 categories. Each product should have:

- Realistic Nigerian food names (e.g. "Indomie Chicken Noodles 70g", "Titus Sardines in Tomato Sauce", "Peak Full Cream Milk Powder 400g", "Ewa Agoyin Beans (500g)", "Ugu Leaf (Fluted Pumpkin) Bunch", "Golden Penny Semolina 1kg", etc.)
- Real Unsplash image URLs (use generic food photos with `https://images.unsplash.com/photo-XXXXXXX?w=400&h=400&fit=crop`)
- Prices in NGN (e.g. Indomie pack: 550, Sardines: 1200, Premium Olive Oil: 4500)
- Realistic ratings and stock numbers

The `scripts/seedFirestore.js` script should:

- Use `firebase-admin` to connect to Firestore using a service account JSON file
- Read from `src/data/seedProducts.js`
- Batch-write all products to the `products` collection
- Log progress and confirm completion
- Include instructions at the top as comments on how to run it: `node scripts/seedFirestore.js`

---

## CART CONTEXT (src/context/CartContext.jsx)

State managed:

- `items`: array of `{ product, quantity }`
- `isDrawerOpen`: boolean

Functions exposed:

- `addToCart(product)` — add item or increment quantity
- `removeFromCart(productId)` — remove entirely
- `updateQuantity(productId, qty)` — set specific quantity (0 = remove)
- `clearCart()` — empty cart
- `openDrawer()` / `closeDrawer()`
- `cartTotal` — computed total price
- `cartCount` — total number of items

Persistence:

- Always sync to `localStorage` under key `pella_cart`
- On mount, load from `localStorage`
- If user is authenticated, also sync to Firestore under `users/{uid}/cart` (subcollection or field)

---

## AUTH CONTEXT (src/context/AuthContext.jsx)

State managed:

- `user`: Firebase user object or null
- `loading`: boolean while auth state is being determined

Functions exposed:

- `signInWithGoogle()` — calls `signInWithPopup(auth, googleProvider)`; on new user, creates user doc in Firestore `users` collection
- `signOut()` — calls Firebase `signOut(auth)`

On auth state change:

- Update user doc in Firestore with `lastLogin: serverTimestamp()`

---

## ROUTING (App.jsx)

Use `react-router-dom` v6.

Routes:

```
/           → <Home />
/shop       → <Shop />
/product/:id → <ProductDetail />
/checkout   → <Checkout /> (protected — redirect to / if not signed in, show sign-in modal)
/order-success → <OrderSuccess />
/account    → <Account /> (protected — redirect to / if not signed in)
*           → 404 page (simple, with "Go Home" button)
```

Wrap the app in:

1. `<AuthProvider>`
2. `<CartProvider>`
3. `<BrowserRouter>`
4. `<ToastProvider>`

---

## ANIMATIONS (Framer Motion usage)

Apply these specific animations:

1. **Page transitions:** Wrap each page in `<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>`. Use `<AnimatePresence>` in App.jsx.

2. **Product card hover:** `whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}` on the card wrapper.

3. **Cart drawer:** `initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}` with spring transition.

4. **Cart badge pop:** `animate={{ scale: [1, 1.3, 1] }}` when cart count changes.

5. **Hero floating emojis:** Each emoji in an infinite `animate={{ y: [-10, 10, -10] }}` loop with different durations.

6. **Button click:** `whileTap={{ scale: 0.97 }}` on all interactive buttons.

7. **Toast notifications:** Slide in from top-right with `initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}`.

8. **Order success checkmark:** Draw a checkmark SVG using Framer Motion `pathLength` animation.

---

## PACKAGE.JSON DEPENDENCIES

Include these exact packages (use latest stable versions):

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "framer-motion": "^11.3.0",
    "firebase": "^10.13.0",
    "canvas-confetti": "^1.9.3",
    "lucide-react": "^0.438.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.10",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45"
  }
}
```

And in `netlify/functions/` package.json or root:

```json
{
  "firebase-admin": "^12.4.0",
  "node-fetch": "^3.3.2",
  "form-data": "^4.0.0"
}
```

---

## NETLIFY.TOML

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## TOAST NOTIFICATION SYSTEM (src/components/ui/Toast.jsx)

Implement a self-contained toast system:

- `ToastContext` with `showToast(message, type)` function (types: `success`, `error`, `info`)
- Toasts stack in top-right corner
- Auto-dismiss after 3 seconds
- Manual dismiss with X button
- Color coded: success = green, error = red, info = brand-orange
- Framer Motion slide-in/out animation

Usage: `const { showToast } = useToast();` then `showToast('Added to cart!', 'success')`

---

## RESPONSIVE BREAKPOINTS

All pages must work perfectly at:

- Mobile: 320px – 639px
- Tablet: 640px – 1023px
- Desktop: 1024px+

Specific requirements:

- Navbar: hamburger on mobile, full nav on desktop
- Product grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Checkout: single column mobile, two-column desktop
- Cart drawer: full-screen mobile overlay, 400px sidebar on desktop

---

## LOADING & ERROR STATES

Every data-fetching operation must have:

1. **Loading:** Skeleton cards (animated pulse) matching the grid layout
2. **Error:** Friendly error card with retry button and error message
3. **Empty:** Illustrated empty state with helpful CTA

---

## FIRESTORE SECURITY RULES

Include a `firestore.rules` file:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: anyone can read, nobody can write from client
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    // Orders: authenticated users can create; can only read their own
    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    // Users: authenticated users can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## FINAL DELIVERABLE CHECKLIST

The completed project must satisfy ALL of the following:

- [ ] `npm install && npm run dev` runs without errors
- [ ] `npm run build` produces a clean `dist/` folder
- [ ] The app works end-to-end once `.env` is populated (no code changes needed)
- [ ] Google Sign-In button works when `VITE_FIREBASE_*` keys are set
- [ ] Products load from Firestore when Firebase is configured
- [ ] Paystack popup opens when "Pay Now" is clicked with a valid `VITE_PAYSTACK_PUBLIC_KEY`
- [ ] After successful payment, Netlify Function verifies and saves the order
- [ ] Mailgun confirmation email is sent after successful order
- [ ] Cart persists in localStorage between sessions
- [ ] All 7 pages are functional and fully responsive
- [ ] All animations are smooth and performant
- [ ] No console errors or warnings
- [ ] `.env` file is in `.gitignore` and `.env.example` has all keys documented
- [ ] `public/_redirects` or `netlify.toml` has the SPA redirect rule
- [ ] `scripts/seedFirestore.js` runs and populates the database
- [ ] `firestore.rules` file is present

---

## SETUP INSTRUCTIONS TO INCLUDE IN README.md

The README must include clear step-by-step setup instructions:

1. Clone and install: `npm install`
2. Copy `.env.example` to `.env`
3. How to create a Firebase project and get the config keys
4. How to enable Google Sign-In in Firebase Console
5. How to run the Firestore seed script
6. How to get Paystack API keys
7. How to get Mailgun API keys and set up a domain
8. How to deploy to Netlify and add environment variables in the Netlify dashboard
9. Firestore security rules: how to deploy with `firebase deploy --only firestore:rules`

---

_Build the complete app exactly as specified. Every feature, every file, every animation. The result should be a stunning, production-ready grocery marketplace._
