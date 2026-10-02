import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { initializePayment } from '../lib/paystack';
import { formatCurrency } from '../utils/formatCurrency';
import { NIGERIAN_STATES, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../utils/constants';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    notes: '',
  });

  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!form.phone.trim()) return 'Phone number is required';
    if (!form.address.trim()) return 'Delivery address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.state) return 'State is required';
    return null;
  };

  const handlePay = () => {
    const error = validate();
    if (error) {
      showToast(error, 'error');
      return;
    }

    setProcessing(true);

    initializePayment({
      email: form.email,
      amount: total,
      onSuccess: async (reference) => {
        try {
          const response = await fetch('/.netlify/functions/process-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: reference.reference,
              cartItems: items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                quantity: item.quantity,
              })),
              shipping: form,
              total,
              userId: user.uid,
            }),
          });

          const data = await response.json();

          if (data.success) {
            clearCart();
            navigate(`/order-success?orderId=${data.orderId}`);
          } else {
            showToast(data.error || 'Payment verification failed', 'error');
            setProcessing(false);
          }
        } catch (err) {
          showToast('Network error. Please try again.', 'error');
          setProcessing(false);
        }
      },
      onClose: () => {
        setProcessing(false);
        showToast('Payment cancelled', 'info');
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display text-brand-charcoal mb-8">Checkout</h1>
          <EmptyState
            title="Your cart is empty"
            description="Add some products to your cart before checking out."
            actionLabel="Browse Products"
            onAction={() => navigate('/shop')}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display text-brand-charcoal mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-brand-charcoal mb-6">Shipping & Contact</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">Full Name *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="0801 234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">City *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="Lagos"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">Delivery Address *</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="123 Main Street, Ikeja"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">State *</label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  >
                    <option value="">Select a state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-brand-charcoal mb-1">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-brand-charcoal mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-charcoal truncate">{item.product.name}</p>
                      <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-charcoal">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-muted">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-brand-green font-medium' : 'font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand-orange">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay {formatCurrency(total)} Securely
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-brand-muted">
                <Lock size={12} />
                Secured by Paystack
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
