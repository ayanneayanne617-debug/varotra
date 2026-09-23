import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Currency, Language } from '../../types';
import {
  CheckCircle2,
  Truck,
  ShoppingCart,
  Heart,
  Globe,
  Coins,
  ChevronDown,
  Clock,
  MapPin,
} from 'lucide-react';

export const StorefrontHeader: React.FC = () => {
  const {
    activeStore,
    currency,
    setCurrency,
    language,
    setLanguage,
    cartCount,
    wishlistIds,
    setIsCartOpen,
    setIsWishlistOpen,
    deliveryZones,
  } = useApp();

  const [showDeliveryTooltip, setShowDeliveryTooltip] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-[41px] z-40 shadow-xs">
      {/* Top Announcement Bar if enabled */}
      {activeStore.theme.announcementEnabled && activeStore.theme.announcementText && (
        <div className="bg-emerald-600 text-white text-[11px] sm:text-xs font-semibold py-1.5 px-3 text-center tracking-wide flex items-center justify-center gap-1.5 shadow-inner">
          <span>{activeStore.theme.announcementText}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Store Logo & Title & Subdomain */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeStore.logo}
                alt={activeStore.name}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl object-cover border-2 border-emerald-500/20 p-0.5 bg-white shadow-xs"
              />
              {activeStore.verified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold text-[#0F172A] truncate tracking-tight">
                  {activeStore.name}
                </h1>
                {activeStore.verified && (
                  <span className="hidden sm:inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-emerald-700 hover:underline truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {activeStore.subdomain}
              </p>
            </div>
          </div>

          {/* Controls: [MGA/EUR/USD] [FR/EN/MG] [🚚] [🛒] */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowLangDropdown(false);
                }}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-bold text-xs px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 transition"
                title="Changer la devise"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCurrencyDropdown && (
                <div
                  className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in"
                  onClick={() => setShowCurrencyDropdown(false)}
                >
                  {(['MGA', 'EUR', 'USD'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 ${
                        currency === curr ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {currency === curr && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowCurrencyDropdown(false);
                }}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-[#0F172A] font-bold text-xs px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 transition"
                title="Changer la langue"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangDropdown && (
                <div
                  className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in"
                  onClick={() => setShowLangDropdown(false)}
                >
                  <button
                    onClick={() => setLanguage('fr')}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                      language === 'fr' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    🇫🇷 Français (FR)
                  </button>
                  <button
                    onClick={() => setLanguage('mg')}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                      language === 'mg' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    🇲🇬 Malagasy (MG)
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 ${
                      language === 'en' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    🇬🇧 English (EN)
                  </button>
                </div>
              )}
            </div>

            {/* Delivery Info Icon [🚚] */}
            <div className="relative">
              <button
                onClick={() => setShowDeliveryTooltip(!showDeliveryTooltip)}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-emerald-700 hover:text-emerald-600 transition"
                title="Zones & délais de livraison"
              >
                <Truck className="w-4.5 h-4.5" />
              </button>

              {showDeliveryTooltip && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Zones de Livraison
                    </h3>
                    <button
                      onClick={() => setShowDeliveryTooltip(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {deliveryZones.map((z) => (
                      <div key={z.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="font-semibold text-slate-800 flex items-center justify-between">
                          <span>{z.name}</span>
                          <span className="text-emerald-600 font-bold">
                            {z.price.toLocaleString('fr-FR')} Ar
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Délai : {z.estimatedDeliveryTime}</span>
                        </div>
                        {z.freeAboveAmount && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-1">
                            ✨ Gratuite dès {z.freeAboveAmount.toLocaleString('fr-FR')} Ar
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button [❤️] */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              title="Mes favoris"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistIds.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button [🛒] */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
              title="Ouvrir le panier"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden xs:inline">Panier</span>
              {cartCount > 0 && (
                <span className="bg-white text-orange-600 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
