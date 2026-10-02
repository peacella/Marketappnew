import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useToast } from './Toast';

const CartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      showToast('Please sign in to checkout', 'info');
      signInWithGoogle().catch(() => {});
      return;
    }
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={closeDrawer}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-[9999] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-brand-cream-dark rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={40} className="text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-2">Your cart is empty</h3>
                <p className="text-brand-muted text-sm mb-6">Looks like you haven't added anything yet.</p>
                <Button onClick={() => { closeDrawer(); navigate('/shop'); }}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-brand-cream rounded-xl p-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-brand-charcoal truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-brand-muted">{item.product.category}</p>
                        <p className="text-sm font-bold text-brand-orange mt-1">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-1 bg-white rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-gray-100 px-6 py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Delivery</span>
                    <span className="text-brand-muted">Calculated at checkout</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                  <button
                    onClick={closeDrawer}
                    className="w-full text-center text-sm text-brand-muted hover:text-brand-orange transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
