import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const floatingEmojis = [
  { emoji: '🥦', x: '10%', y: '20%', duration: 3 },
  { emoji: '🍎', x: '85%', y: '15%', duration: 4 },
  { emoji: '🌽', x: '15%', y: '70%', duration: 3.5 },
  { emoji: '🥬', x: '80%', y: '65%', duration: 2.8 },
  { emoji: '🍳', x: '50%', y: '10%', duration: 3.2 },
  { emoji: '🍌', x: '90%', y: '40%', duration: 3.8 },
  { emoji: '🥕', x: '5%', y: '45%', duration: 4.2 },
  { emoji: '🍊', x: '70%', y: '80%', duration: 3.1 },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-orange via-amber-500 to-brand-green">
      {floatingEmojis.map((item, i) => (
        <motion.span
          key={i}
          className="absolute text-4xl md:text-6xl opacity-20 pointer-events-none select-none"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: item.duration, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item.emoji}
        </motion.span>
      ))}

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight"
        >
          Fresh Groceries,<br />Delivered with Love
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
        >
          Discover the finest African foods, fresh produce, and pantry staples delivered to your door
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/shop">
            <Button variant="white" size="lg" className="w-full sm:w-auto">
              Shop Now
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outlineWhite" size="lg" className="w-full sm:w-auto">
              View Categories
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
