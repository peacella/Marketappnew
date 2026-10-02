import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  title = 'Nothing here yet',
  description = 'Check back later or try a different search.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-24 h-24 bg-brand-cream-dark rounded-full flex items-center justify-center mb-6">
        {icon || (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-orange">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-brand-charcoal mb-2">{title}</h3>
      <p className="text-brand-muted mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
