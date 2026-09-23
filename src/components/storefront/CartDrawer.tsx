import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Ticket,
  Truck,
  Check,
  AlertCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    discountAmount,
    activeStore,
    currency,
    deliveryZones,
    t,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  // Calculate default delivery fee
  const defaultZone = deliveryZones[0];
  const freeThreshold = defaultZone?.freeAboveAmount || activeStore.theme.freeShippingThreshold || 150000;
  const isFreeShipping = cartSubtotal >= freeThreshold;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : defaultZone?.price || 5000;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput.trim());
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#0F172A]">{t.yourCart}</h2>
              <p className="text-xs text-slate-500">
                {cart.length} {cart.length > 1 ? 'articles différents' : 'article'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {isFreeShipping ? '🎉 Livraison offerte !' : 'Livraison offerte à 150 000 Ar'}
            </span>
            <span>{isFreeShipping ? '100%' : `${Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100))}%`}</span>
          </div>
          <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (cartSubtotal / freeThreshold) * 100)}%` }}
            />
          </div>
          {!isFreeShipping && cartSubtotal > 0 && (
            <p className="text-[11px] text-emerald-700 mt-1">
              Ajoutez encore {formatPrice(freeThreshold - cartSubtotal, currency)} pour bénéficier de la livraison gratuite !
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800">{t.emptyCart}</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">{t.emptyCartSubtitle}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.variantName || 'default'}`}
                className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex gap-3 items-center"
              >
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] leading-tight line-clamp-1">
                    {item.productName}
                  </h4>
                  {item.variantName && (
                    <p className="text-[11px] text-emerald-700 font-medium">{item.variantName}</p>
                  )}
                  <p className="text-xs font-bold text-emerald-600 mt-0.5">
                    {formatPrice(item.unitPrice, currency)}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity - 1, item.variantName)
                        }
                        className="p-1 text-slate-500 hover:bg-slate-200 rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity + 1, item.variantName)
                        }
                        className="p-1 text-slate-500 hover:bg-slate-200 rounded-r"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.variantName)}
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Ticket className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.promoCodePlaceholder}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 uppercase placeholder:normal-case outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                {t.apply}
              </button>
            </form>

            {promoMessage && (
              <div
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  promoMessage.isError ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {promoMessage.isError ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{promoMessage.text}</span>
              </div>
            )}

            {appliedPromo && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-bold text-emerald-800">
                  🎉 Code {appliedPromo.code} (-{appliedPromo.discountValue}
                  {appliedPromo.discountType === 'percentage' ? '%' : ' Ar'})
                </span>
                <button
                  onClick={removePromoCode}
                  className="text-slate-400 hover:text-rose-600 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-800">
                  {formatPrice(cartSubtotal, currency)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>{t.discount}</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{t.shippingFee}</span>
                <span className="font-bold text-slate-800">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 uppercase font-black text-[11px]">
                      {t.freeShipping}
                    </span>
                  ) : (
                    formatPrice(shippingFee, currency)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#0F172A] pt-2 border-t border-slate-200">
                <span>{t.total}</span>
                <span className="text-emerald-600 font-black">
                  {formatPrice(finalTotal, currency)}
                </span>
              </div>
            </div>

            {/* ORANGE Checkout Button */}
            <button
              onClick={handleGoToCheckout}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-600/25 transition cursor-pointer"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
