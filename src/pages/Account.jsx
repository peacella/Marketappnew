import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Package, Mail, User as UserIcon } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const statusColors = {
  paid: 'bg-green-100 text-green-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-brand-green/10 text-brand-green-dark',
};

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display text-brand-charcoal mb-8">My Account</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center">
                <UserIcon size={28} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-brand-charcoal">{user.displayName}</h2>
              <div className="flex items-center gap-2 text-sm text-brand-muted">
                <Mail size={14} />
                {user.email}
              </div>
              <span className="inline-block mt-1 text-xs bg-brand-plum/10 text-brand-plum px-2 py-0.5 rounded-full">
                Google Account
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-brand-charcoal mb-4">Order History</h2>

        {ordersLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Start shopping and your orders will appear here!"
            actionLabel="Browse Products"
            onAction={() => navigate('/shop')}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-brand-charcoal">{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-brand-muted">
                      {order.createdAt?.toDate?.().toLocaleDateString() || 'Recent'} • {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-orange">{formatCurrency(order.total)}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                        <div className="space-y-2 mb-4">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-brand-charcoal">{item.name} x{item.quantity}</span>
                              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        {order.shipping && (
                          <p className="text-sm text-brand-muted">
                            Delivering to: {order.shipping.address}, {order.shipping.city}, {order.shipping.state}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Account;
