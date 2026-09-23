import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { Heart, ShoppingCart, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    currency,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProductForModal,
    t,
  } = useApp();

  const [addedAnimation, setAddedAnimation] = useState(false);

  // Calculate discount percentage if original price is provided
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Stock status badge
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockAlert;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      // If variants exist, open modal for choice
      setSelectedProductForModal(product);
      return;
    }
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div
      onClick={() => setSelectedProductForModal(product)}
      className="group bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative cursor-pointer"
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge (-20%) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[11px] sm:text-xs px-2 py-0.5 rounded-full shadow-sm">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Badge (Green or amber) */}
        <div className="absolute bottom-2.5 left-2.5">
          {isOutOfStock ? (
            <span className="bg-rose-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t.outOfStock}
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              {t.lowStock} ({product.stock})
            </span>
          ) : (
            <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              {t.inStock}
            </span>
          )}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition active:scale-90"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="truncate font-medium text-emerald-700">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
                <Star className="w-3 h-3 fill-amber-400" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-extrabold text-sm sm:text-base text-[#0F172A] leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {/* Subtitle / Variant hint if any */}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {product.hasVariants && product.variants
              ? `${product.variants.length} variantes disponibles`
              : product.sku}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
          <div className="flex flex-col">
            {/* Current price in GREEN */}
            <span className="text-sm sm:text-base font-extrabold text-emerald-600 tracking-tight">
              {formatPrice(product.price, currency)}
            </span>
            {/* Old slashed price in GRAY */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Action Button: ORANGE */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 font-bold text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-xl transition duration-150 active:scale-95 shadow-xs cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-500/20'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                <span className="hidden xs:inline">{t.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
