import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search products...', className }) => {
  return (
    <div className={`relative ${className || ''}`}>
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
