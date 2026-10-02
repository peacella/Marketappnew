import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useToast } from './Toast';

const ProductCard = ({ product }) => {
  const { addToCart, items, updateQuantity } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-2xl shadow-md overflow-hidden group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            ★ Featured
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-brand-charcoal">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-brand-charcoal text-sm line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs text-brand-muted">{product.rating}</span>
          <span className="text-xs text-brand-muted">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-brand-orange">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-brand-muted">{product.unit}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-red-500' : 'bg-brand-green'}`} />
          <span className={`text-xs font-medium ${outOfStock ? 'text-red-500' : 'text-brand-green'}`}>
            {outOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        {inCart ? (
          <div className="flex items-center justify-between mt-3 bg-brand-cream rounded-xl p-1">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-semibold text-brand-charcoal">{cartItem.quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
