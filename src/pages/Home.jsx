import { motion } from 'framer-motion';
import HeroSection from '../components/sections/HeroSection';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import CategorySection from '../components/sections/CategorySection';
import PromosBanner from '../components/sections/PromosBanner';
import { useProducts } from '../hooks/useProducts';

const Home = () => {
  const { products, loading } = useProducts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      <FeaturedProducts products={products} loading={loading} />
      <CategorySection />
      <PromosBanner />
    </motion.div>
  );
};

export default Home;
