import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SearchBar from '../components/ui/SearchBar';
import CategoryFilter from '../components/ui/CategoryFilter';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../utils/constants';

const PAGE_SIZE = 12;

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

const Shop = () => {
  const { products, loading, error, refetch } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, category, search, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setVisibleCount(PAGE_SIZE);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-brand-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-brand-muted">Home / Shop</p>
          <h1 className="text-3xl font-display text-brand-charcoal mt-1">Fresh Market</h1>
        </div>

        <div className="sticky top-16 z-40 bg-brand-cream/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setVisibleCount(PAGE_SIZE); }} className="flex-1" />
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted" />
            </div>
          </div>
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>

        <div className="mt-4 mb-4 text-sm text-brand-muted">
          Showing {visible.length} of {filtered.length} products
        </div>

        {loading ? (
          <LoadingSkeleton count={8} />
        ) : error ? (
          <EmptyState
            title="Failed to load products"
            description={error}
            actionLabel="Try Again"
            onAction={refetch}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your search or filter to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => { setSearch(''); setCategory('All'); }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-brand-orange transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Shop;
