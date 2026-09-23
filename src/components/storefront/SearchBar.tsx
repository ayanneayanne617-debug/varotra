import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Store as StoreIcon, Tag, Package } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    products,
    categories,
    stores,
    activeStore,
    setActiveStore,
    setSelectedProductForModal,
    setSelectedCategory,
    t,
  } = useApp();

  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();

  // Search Results across products, categories, stores
  const matchingProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    : [];

  const matchingCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query) && c.slug !== 'all')
    : [];

  const matchingStores = query
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.subdomain.toLowerCase().includes(query)
      )
    : [];

  const hasResults =
    matchingProducts.length > 0 || matchingCategories.length > 0 || matchingStores.length > 0;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3 sm:px-6 py-3 relative z-30">
      <div className="relative">
        {/* Large Input Box */}
        <div className="relative flex items-center">
          {/* Green Search Icon as requested */}
          <div className="absolute left-4 pointer-events-none text-emerald-600 flex items-center justify-center">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpenDropdown(true);
            }}
            onFocus={() => {
              if (query) setIsOpenDropdown(true);
            }}
            placeholder={t.searchPlaceholder || 'Rechercher un produit, catégorie, boutique...'}
            className="w-full bg-white text-[#0F172A] font-medium text-sm sm:text-base pl-12 sm:pl-14 pr-11 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200/90 hover:border-emerald-500/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition shadow-xs placeholder-slate-400 outline-none"
          />

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsOpenDropdown(false);
              }}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isOpenDropdown && query.length >= 2 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[70vh] overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Products results */}
            {matchingProducts.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Produits trouvés ({matchingProducts.length})</span>
                </div>
                <div className="space-y-1">
                  {matchingProducts.slice(0, 5).map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductForModal(prod);
                        setIsOpenDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-emerald-600 truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{prod.category}</span>
                          <span className="font-extrabold text-emerald-600">
                            {prod.price.toLocaleString('fr-FR')} Ar
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories results */}
            {matchingCategories.length > 0 && (
              <div className="p-3 bg-slate-50/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Catégories</span>
                </div>
                <div className="flex flex-wrap gap-2 px-1">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsOpenDropdown(false);
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 transition shadow-2xs"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stores results */}
            {matchingStores.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  <StoreIcon className="w-3.5 h-3.5 text-orange-500" />
                  <span>Boutiques sur Varotra</span>
                </div>
                <div className="space-y-1">
                  {matchingStores.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        setActiveStore(st);
                        setIsOpenDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/60 text-left transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={st.logo}
                          alt={st.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">{st.name}</div>
                          <div className="text-[10px] text-slate-500">{st.subdomain}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded-full">
                        {st.id === activeStore.id ? 'Boutique actuelle' : 'Visiter'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="p-8 text-center text-slate-500 text-xs sm:text-sm">
                Aucun résultat trouvé pour « <span className="font-semibold">{searchQuery}</span> »
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
