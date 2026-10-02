import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark shadow-md hover:shadow-lg',
  outline: 'border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white',
  ghost: 'text-brand-charcoal hover:bg-gray-100',
  white: 'bg-white text-brand-orange hover:bg-gray-50 shadow-md',
  outlineWhite: 'border-2 border-white text-white hover:bg-white hover:text-brand-orange',
  green: 'bg-brand-green text-white hover:bg-brand-green-dark shadow-md',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
