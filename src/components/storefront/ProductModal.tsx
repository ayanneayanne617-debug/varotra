import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { ProductVariant, Review } from '../../types';
import {
  X,
  Star,
  Check,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Share2,
  ChevronRight,
  User,
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    currency,
    addToCart,
    toggleWishlist,
    isWishlisted,
    t,
  } = useApp();

  const product = selectedProductForModal;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(product?.reviews || []);

  if (!product) return null;

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = activeStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      product,
      quantity,
      selectedVariant?.name,
      selectedVariant?.price
    );
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setSelectedProductForModal(null);
    }, 900);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentInput.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      rating: ratingInput,
      comment: commentInput.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setAuthorName('');
    setCommentInput('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{product.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-[#0F172A] font-bold truncate max-w-[200px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
              title="Copier le lien du produit"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedProductForModal(null)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Photos & Gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition active:scale-90"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                    }`}
                  />
                </button>
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                        idx === selectedImageIndex
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase Options */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="font-mono">SKU: {product.sku}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating || 5.0}</span>
                    <span className="text-slate-400 font-normal">({reviewsList.length} avis)</span>
                  </div>
                </div>
              </div>

              {/* Pricing in GREEN */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {formatPrice(activePrice, currency)}
                </span>
                {product.originalPrice && product.originalPrice > activePrice && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
              </div>

              {/* Stock Status (Green badge) */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {t.outOfStock}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {t.inStock} ({activeStock} unités disponibles)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Variants Picker if any */}
              {product.hasVariants && product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Sélectionnez votre option :
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl text-left border text-xs transition flex items-center justify-between ${
                          selectedVariant?.id === v.id
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-bold ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{v.name}</div>
                          <div className="text-[10px] text-slate-500">Stock: {v.stock}</div>
                        </div>
                        <span className="font-bold text-emerald-600">
                          {formatPrice(v.price, currency)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 font-bold text-xs sm:text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                    disabled={quantity >= activeStock}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold transition disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Orange Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 font-extrabold text-sm py-3 px-5 rounded-2xl transition duration-150 active:scale-95 shadow-lg shadow-orange-600/20 cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-orange-600 hover:bg-orange-500 text-white'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>{t.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>{t.addToCart} au panier</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Livraison express à Madagascar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Produit 100% garanti authentique</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#0F172A] flex items-center justify-between">
              <span>Avis clients ({reviewsList.length})</span>
              <span className="text-xs text-slate-500 font-normal">Évaluations vérifiées</span>
            </h3>

            {/* Add Review form */}
            <form
              onSubmit={handleAddReview}
              className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3"
            >
              <div className="text-xs font-bold text-slate-700">Laisser votre avis :</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-500">Note :</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="text-amber-400 hover:scale-110 transition p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= ratingInput ? 'fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Partagez votre expérience avec ce produit..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 resize-none h-16"
                required
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Publier mon avis
              </button>
            </form>

            {/* Reviews list */}
            <div className="space-y-2.5">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                          Achat vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  <div className="text-[10px] text-slate-400 mt-1">{rev.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
