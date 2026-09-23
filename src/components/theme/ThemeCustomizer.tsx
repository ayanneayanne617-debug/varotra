import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreTheme } from '../../types';
import {
  Palette,
  Image,
  Type,
  Layout,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Send,
} from 'lucide-react';

export const ThemeCustomizer: React.FC = () => {
  const { activeStore, updateActiveStore, setViewMode } = useApp();

  const [theme, setTheme] = useState<StoreTheme>({ ...activeStore.theme });
  const [logoUrl, setLogoUrl] = useState(activeStore.logo);
  const [storeName, setStoreName] = useState(activeStore.name);
  const [description, setDescription] = useState(activeStore.description);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active slide editing (slide 0)
  const currentSlide = theme.bannerSlides[0] || {
    id: 's1',
    categoryBadge: 'Artisanat & Gastronomie',
    title: 'Artisanat Malagasy & Vanille',
    description: 'Boutique d’exception...',
    buttonText: 'Découvrir la boutique',
    imageUrl:
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
  };

  const handleUpdateSlide = (field: string, val: string) => {
    const updatedSlides = [...theme.bannerSlides];
    if (updatedSlides.length === 0) {
      updatedSlides.push({ ...currentSlide, [field]: val });
    } else {
      updatedSlides[0] = { ...updatedSlides[0], [field]: val };
    }
    setTheme({ ...theme, bannerSlides: updatedSlides });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateActiveStore({
      ...activeStore,
      name: storeName.trim(),
      description: description.trim(),
      logo: logoUrl.trim(),
      theme,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Personnalisation du Thème & Identité
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Modifiez la bannière, votre logo, le texte d'annonce et le style de votre boutique
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('storefront')}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            <Eye className="w-4 h-4" />
            <span>Aperçu boutique</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Enregistré !</span>
              </>
            ) : (
              <span>Publier les modifications</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Logo & Store Identity */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Identité & Logo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom de la boutique</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL du Logo (carré)</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slogan / Description courte
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Announcement Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span>Barre d'Annonce Supérieure</span>
              </h3>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.announcementEnabled}
                  onChange={(e) =>
                    setTheme({ ...theme, announcementEnabled: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Activer l'annonce</span>
              </label>
            </div>

            <input
              type="text"
              value={theme.announcementText}
              onChange={(e) => setTheme({ ...theme, announcementText: e.target.value })}
              placeholder="Ex: ✨ Vente flash : Livraison offerte dès 150 000 Ar !"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Section 3: Main Hero Banner */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
              <Image className="w-4 h-4 text-orange-600" />
              <span>Bannière Principale (Slide 1)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge de catégorie</label>
                <input
                  type="text"
                  value={currentSlide.categoryBadge}
                  onChange={(e) => handleUpdateSlide('categoryBadge', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Texte du bouton d'action</label>
                <input
                  type="text"
                  value={currentSlide.buttonText}
                  onChange={(e) => handleUpdateSlide('buttonText', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Grand Titre de la Bannière</label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => handleUpdateSlide('title', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Texte descriptif</label>
              <textarea
                rows={2}
                value={currentSlide.description}
                onChange={(e) => handleUpdateSlide('description', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">URL de l'image de fond</label>
              <input
                type="url"
                value={currentSlide.imageUrl}
                onChange={(e) => handleUpdateSlide('imageUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Livraison Offerte Seuil */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Seuil de Livraison Gratuite</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant seuil (MGA)</label>
                <input
                  type="number"
                  value={theme.freeShippingThreshold}
                  onChange={(e) =>
                    setTheme({ ...theme, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Texte affiché</label>
                <input
                  type="text"
                  value={theme.freeShippingPromoText}
                  onChange={(e) =>
                    setTheme({ ...theme, freeShippingPromoText: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card on Desktop */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 sticky top-28">
            <h3 className="font-extrabold text-base text-[#0F172A] flex items-center justify-between">
              <span>Aperçu en Direct</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Palette : Blanc • Vert • Orange
              </span>
            </h3>

            {/* Mini preview frame */}
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 p-2 shadow-xs space-y-2">
              {/* Mini header */}
              <div className="bg-white p-2 rounded-xl flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <img src={logoUrl} alt="" className="w-5 h-5 rounded-md object-cover" />
                  <span className="font-bold text-slate-900 truncate max-w-[100px]">
                    {storeName}
                  </span>
                </div>
                <span className="bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded">
                  🛒 Panier
                </span>
              </div>

              {/* Mini Banner */}
              <div className="relative rounded-xl overflow-hidden aspect-video flex items-center p-3 text-white">
                <img
                  src={currentSlide.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover -z-10 brightness-50"
                />
                <div className="space-y-1">
                  <span className="bg-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                    {currentSlide.categoryBadge}
                  </span>
                  <div className="font-extrabold text-xs leading-tight">{currentSlide.title}</div>
                  <button className="bg-orange-600 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1">
                    {currentSlide.buttonText}
                  </button>
                </div>
              </div>

              {/* Mini category capsules */}
              <div className="flex gap-1 overflow-x-hidden pt-1">
                <span className="bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                  Tous les produits
                </span>
                <span className="bg-white text-slate-700 text-[8px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                  Vanille & Épices
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs"
            >
              Enregistrer les changements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
