import { clsx } from 'clsx';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/constants';

const CategoryFilter = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
            selected === cat
              ? 'bg-brand-orange text-white shadow-md'
              : 'bg-white text-brand-charcoal hover:bg-brand-cream-dark border border-gray-200'
          )}
        >
          {cat !== 'All' && <span>{CATEGORY_ICONS[cat]}</span>}
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
