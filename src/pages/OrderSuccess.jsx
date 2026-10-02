import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        // Error
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E8531A', '#16A34A', '#7E22CE', '#F97316'],
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream py-16"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6"
        >
          <svg viewBox="0 0 52 52" className="w-full h-full">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M14 27l8 8 16-16"
              fill="none"
              stroke="#16A34A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 className="text-4xl font-display text-brand-charcoal mb-3">Order Confirmed!</h1>
        <p className="text-brand-muted text-lg mb-2">
          Your order <span className="font-bold text-brand-orange">{orderId}</span> has been placed successfully.
        </p>
        {order?.shipping?.email && (
          <p className="text-brand-muted mb-8">
            We've sent a confirmation email to <span className="font-medium">{order.shipping.email}</span>.
          </p>
        )}

        {order && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-left mb-8">
            <h3 className="font-semibold text-brand-charcoal mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-brand-charcoal">{item.name} x{item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span className="text-brand-orange">{formatCurrency(order.total)}</span>
              </div>
            </div>
            {order.shipping && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-brand-charcoal">Delivery Address</p>
                <p className="text-sm text-brand-muted">
                  {order.shipping.address}, {order.shipping.city}, {order.shipping.state}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/shop">
            <Button variant="outline" size="lg">Continue Shopping</Button>
          </Link>
          <Link to="/account">
            <Button size="lg">View My Orders</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
