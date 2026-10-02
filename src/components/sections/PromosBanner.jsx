import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const PromosBanner = () => {
  return (
    <section className="py-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-plum to-brand-orange rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display mb-4">
            Free Delivery on Orders Over ₦15,000
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Stock up on your favorite groceries and enjoy free delivery straight to your doorstep. No hidden fees, no surprises.
          </p>
          <Link to="/shop">
            <Button variant="white" size="lg">
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PromosBanner;
