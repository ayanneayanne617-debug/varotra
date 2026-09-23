import React from 'react';
import { useApp } from '../../context/AppContext';

export const CategoryFilter: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, products } = useApp();

  // Helper to count products in category
  const getProductCount = (categoryName: string) => {
    if (categoryName === 'all' || categoryName === 'Tous les produits') {
      return products.length;
    }
    return products.filter((p) => p.category === categoryName).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map((cat) => {
          const isActive =
            (cat.slug === 'all' && (selectedCategory === 'all' || selectedCategory === 'Tous les produits')) ||
            selectedCategory === cat.name;

          const count = getProductCount(cat.name);

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug === 'all' ? 'all' : cat.name)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition duration-150 shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-600/30'
                  : 'bg-white text-[#0F172A] border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
