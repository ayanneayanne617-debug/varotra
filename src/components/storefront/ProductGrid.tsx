import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../../utils/currency';
import { Truck, Sparkles, FilterX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    currency,
    activeStore,
    t,
  } = useApp();

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      selectedCategory === 'Tous les produits' ||
      p.category === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const freeShippingThreshold = activeStore.theme.freeShippingThreshold || 150000;

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Header Row: Title with product count + Free delivery promo badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {t.catalog}
            </h2>
            <span className="bg-slate-100 text-[#0F172A] text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredProducts.length} {t.productsCount}
            </span>
          </div>
          {selectedCategory !== 'all' && (
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Catégorie active : {selectedCategory}
            </p>
          )}
        </div>

        {/* Free Shipping Banner Badge (as requested: "🚚 Livraison offerte dès 150 000 Ar") */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {activeStore.theme.freeShippingPromoText ||
              `Livraison offerte dès ${formatPrice(freeShippingThreshold, currency)}`}
          </span>
        </div>
      </div>

      {/* Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-slate-200 my-4 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <FilterX className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Aucun produit ne correspond à votre recherche
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Essayez de réinitialiser vos filtres ou de chercher un autre mot-clé.
          </p>
        </div>
      )}
    </section>
  );
};
