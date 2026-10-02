import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';
import LoadingSkeleton from '../ui/LoadingSkeleton';

const FeaturedProducts = ({ products, loading }) => {
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display text-brand-charcoal">Featured Products</h2>
            <p className="text-brand-muted mt-1">Handpicked favorites just for you</p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1 text-brand-orange font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {featured.map((product) => (
              <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="sm:hidden text-center mt-6">
          <Link to="/shop" className="text-brand-orange font-medium flex items-center justify-center gap-1">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
