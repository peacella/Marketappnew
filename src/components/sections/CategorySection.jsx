import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/constants';

const CategorySection = () => {
  const categories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display text-brand-charcoal">Shop by Category</h2>
          <p className="text-brand-muted mt-2">Find exactly what you need</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-3 p-6 bg-brand-cream rounded-2xl hover:bg-brand-cream-dark transition-colors group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="text-sm font-medium text-brand-charcoal text-center">
                  {cat}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
