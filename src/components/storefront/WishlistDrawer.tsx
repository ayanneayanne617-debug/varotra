import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistIds,
    toggleWishlist,
    products,
    addToCart,
    currency,
    setSelectedProductForModal,
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#0F172A]">Mes Favoris</h2>
              <p className="text-xs text-slate-500">{wishlistedProducts.length} articles enregistrés</p>
            </div>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-800">Aucun coup de cœur pour l'instant</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Cliquez sur l'icône cœur sur les fiches produits pour retrouver facilement vos articles préférés !
              </p>
            </div>
          ) : (
            wishlistedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex gap-3 items-center group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h4
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProductForModal(prod);
                    }}
                    className="font-bold text-xs sm:text-sm text-[#0F172A] leading-tight line-clamp-1 cursor-pointer hover:text-emerald-600 transition"
                  >
                    {prod.name}
                  </h4>
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    {formatPrice(prod.price, currency)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Ajouter au panier</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
