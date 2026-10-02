import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart, Truck, ChevronDown, Star } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../utils/formatCurrency';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/ui/Toast';
import ProductCard from '../components/ui/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import Button from '../components/ui/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);

          const relatedQuery = query(
            collection(db, 'products'),
            where('category', '==', data.category)
          );
          const relatedSnap = await getDocs(relatedQuery);
          const relatedData = relatedSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((p) => p.id !== id)
            .slice(0, 4);
          setRelated(relatedData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    showToast(`${product.name} added to cart!`, 'success');
  };

  const accordions = [
    { title: 'Nutritional Info', content: 'This product is rich in essential vitamins and nutrients. Consult packaging for detailed nutritional information.' },
    { title: 'Storage Tips', content: 'Store in a cool, dry place. Refrigerate after opening. Consume within recommended timeframe for best quality.' },
    { title: 'About the Seller', content: 'P-ELLA Market sources directly from local Nigerian farmers and trusted suppliers to ensure the freshest products reach your table.' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-display text-brand-charcoal mb-4">{error || 'Product not found'}</h2>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-brand-muted mb-6">
          <Link to="/" className="hover:text-brand-orange">Home</Link> /{' '}
          <Link to="/shop" className="hover:text-brand-orange">Shop</Link> /{' '}
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-orange">{product.category}</Link> /{' '}
          <span className="text-brand-charcoal">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-md">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-brand-orange' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-brand-cream-dark text-brand-orange text-xs font-medium rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl font-display text-brand-charcoal mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-brand-muted">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-brand-orange">{formatCurrency(product.price)}</span>
              <span className="text-brand-muted">{product.unit}</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-brand-green' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-brand-green' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-brand-muted leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-white rounded-xl p-2 border border-gray-200">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  <Plus size={16} />
                </button>
              </div>
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-brand-green/10 rounded-xl text-sm text-brand-green-dark mb-6">
              <Truck size={18} />
              Free delivery on orders over ₦10,000
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              {accordions.map((acc, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm hover:bg-gray-50"
                  >
                    {acc.title}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openAccordion === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-3 text-sm text-brand-muted">{acc.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display text-brand-charcoal mb-6">You might also like</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {related.map((p) => (
                <div key={p.id} className="min-w-[240px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetail;
