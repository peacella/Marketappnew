import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream flex items-center justify-center"
    >
      <div className="text-center px-4">
        <h1 className="text-8xl font-display text-brand-orange mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-brand-charcoal mb-2">Page Not Found</h2>
        <p className="text-brand-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
