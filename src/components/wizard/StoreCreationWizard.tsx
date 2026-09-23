import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { Store } from '../../types';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Store as StoreIcon,
  Upload,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Package,
  CreditCard,
  Truck,
  Globe,
  Share2,
} from 'lucide-react';

const STEPS = [
  'Nom',
  'Logo',
  'Activité',
  'Slogan',
  'Devise',
  'Langue',
  'Contact',
  '1er Produit',
  'Livraison',
  'Paiement',
  'Thème',
  'Lancement',
];

export const StoreCreationWizard: React.FC = () => {
  const { switchStore, setViewMode, refreshAllStores } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [logo, setLogo] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80'
  );
  const [businessType, setBusinessType] = useState('Artisanat & Fait-main');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<'MGA' | 'EUR' | 'USD'>('MGA');
  const [language, setLanguage] = useState<'fr' | 'en' | 'mg'>('fr');

  // Contact
  const [phone, setPhone] = useState('+261 34 11 222 33');
  const [whatsapp, setWhatsapp] = useState('+261 34 11 222 33');
  const [email, setEmail] = useState('contact@maboutique.mg');
  const [address, setAddress] = useState('Analakely, Antananarivo');
  const [city, setCity] = useState('Antananarivo');

  // 1st Product
  const [productName, setProductName] = useState('Mon Premier Article');
  const [productPrice, setProductPrice] = useState(25000);
  const [productStock, setProductStock] = useState(15);
  const [productCategory, setProductCategory] = useState('Général');

  // Shipping & Payment defaults
  const [deliveryMethod, setDeliveryMethod] = useState('Express Antananarivo (5 000 Ar)');
  const [paymentOption, setPaymentOption] = useState('Mvola (Telma)');

  // Final created store ref
  const [createdStore, setCreatedStore] = useState<Store | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleNext = () => {
    if (step < 11) {
      setStep(step + 1);
    } else if (step === 11) {
      // Create the store in storage!
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `boutique-${Date.now()}`;

      const newStore = StorageService.createStore({
        name: name.trim() || 'Ma Nouvelle Boutique',
        slug,
        subdomain: `${slug}.varotra.mg`,
        description: description.trim() || 'Boutique en ligne officielle sur Varotra',
        logo,
        coverImage:
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
        category: businessType,
        currency,
        language,
        phone,
        whatsapp,
        email,
        address,
        city,
        country: 'Madagascar',
        ownerId: 'owner-current',
        plan: 'Starter',
        planId: 'BASIC',
        theme: {
          primaryColor: '#059669',
          accentColor: '#ea580c',
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          fontFamily: 'Plus Jakarta Sans',
          announcementText: `✨ Bienvenue chez ${name || 'notre boutique'} ! Livraison offerte dès 150 000 Ar`,
          announcementEnabled: true,
          freeShippingThreshold: 150000,
          freeShippingPromoText: 'Livraison offerte dès 150 000 Ar',
          footerBio: `Boutique officielle ${name || ''} propulsée par Varotra`,
          socialLinks: {
            whatsapp: phone,
          },
          bannerSlides: [
            {
              id: 'slide-1',
              imageUrl:
                'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
              title: `Bienvenue chez ${name || 'notre boutique'}`,
              subtitle: businessType,
              description: description || 'Découvrez nos nouveautés artisanales de Madagascar',
              buttonText: 'Voir le catalogue',
              categoryBadge: businessType,
            },
          ],
        },
      });

      // Add 1st product to this store
      StorageService.addProduct({
        storeId: newStore.id,
        name: productName.trim() || 'Premier Produit',
        description: `Produit exceptionnel de la boutique ${newStore.name}`,
        category: productCategory,
        price: Number(productPrice),
        costPrice: Math.round(Number(productPrice) * 0.6),
        stock: Number(productStock),
        lowStockAlert: 3,
        sku: 'ART-001',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        ],
        tags: ['nouveau', 'exclusif'],
      });

      setCreatedStore(newStore);
      refreshAllStores();
      setStep(12);
    }
  };

  const handleFinishAndOpen = (destination: 'storefront' | 'merchant') => {
    if (createdStore) {
      switchStore(createdStore.id);
      setViewMode(destination);
    }
  };

  const copyStoreUrl = () => {
    if (createdStore) {
      navigator.clipboard.writeText(`https://${createdStore.subdomain}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-28">
      {/* Top Banner */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Assistant de Création en 12 Étapes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
          Lancez votre boutique en ligne à Madagascar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sans compétences techniques, personnalisée selon l'identité moderne Varotra
        </p>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span className="text-emerald-700">
            Étape {step} sur 12 : {STEPS[step - 1]}
          </span>
          <span>{Math.round((step / 12) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 12) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Step 1: Store Name */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">1. Quel est le nom de votre boutique ?</h3>
            <p className="text-xs text-slate-500">
              Choisissez un nom mémorable. Une adresse web personnalisée lui sera automatiquement attribuée.
            </p>
            <input
              type="text"
              autoFocus
              placeholder="Ex: Soalandy Artisanat, Mada Bio Epices..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base font-bold text-slate-900 outline-none focus:border-emerald-500"
            />
            {name && (
              <div className="text-xs text-emerald-700 font-mono bg-emerald-50 p-3 rounded-xl">
                Adresse générée : {name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.varotra.mg
              </div>
            )}
          </div>
        )}

        {/* Step 2: Logo */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">2. Ajoutez votre Logo de marque</h3>
            <p className="text-xs text-slate-500">
              Collez l'URL de votre logo ou utilisez notre visuel de démonstration par défaut.
            </p>
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt=""
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-sm"
              />
              <div className="flex-1">
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Business Type */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">3. Quel est votre secteur d'activité ?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Artisanat & Fait-main',
                'Épices & Gastronomie',
                'Mode & Vêtements',
                'High-Tech & Mobiles',
                'Beauté & Soins',
                'Maison & Décoration',
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBusinessType(type)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition text-left ${
                    businessType === type
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Slogan */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">4. Rédigez un court slogan pour vos clients</h3>
            <textarea
              rows={3}
              placeholder="Ex: Le meilleur du savoir-faire malagasy livré chez vous à Antananarivo et en province."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Step 5: Currency */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">5. Devise par défaut de la boutique</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'MGA', label: 'Ariary (MGA)', sub: 'Madagascar' },
                { id: 'EUR', label: 'Euro (€)', sub: 'International' },
                { id: 'USD', label: 'Dollar ($)', sub: 'Export' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrency(c.id as any)}
                  className={`p-4 rounded-2xl border text-center transition ${
                    currency === c.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-base font-black">{c.label}</div>
                  <div className="text-xs text-slate-500">{c.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Language */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">6. Langue principale d'affichage</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'fr', label: 'Français', flag: '🇫🇷' },
                { id: 'mg', label: 'Malagasy', flag: '🇲🇬' },
                { id: 'en', label: 'English', flag: '🇬🇧' },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id as any)}
                  className={`p-4 rounded-2xl border text-center transition ${
                    language === l.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{l.flag}</div>
                  <div className="text-sm font-bold">{l.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Contact Info */}
        {step === 7 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-lg font-black text-[#0F172A]">7. Coordonnées de votre commerce</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 8: First Product */}
        {step === 8 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-lg font-black text-[#0F172A]">8. Ajoutez votre premier article</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prix (Ar)</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-emerald-600 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Stock initial</label>
                <input
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Shipping */}
        {step === 9 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">9. Mode d'expédition favori</h3>
            <div className="space-y-2 text-xs font-bold">
              {[
                'Livraison express Antananarivo (5 000 Ar)',
                'Livraison gratuite dès 150 000 Ar',
                'Expédition Taxi-brousse / Provinces',
                'Retrait en point relais / Boutique',
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDeliveryMethod(m)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    deliveryMethod === m
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{m}</span>
                  {deliveryMethod === m && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 10: Payment */}
        {step === 10 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">10. Mode d'encaissement prioritaire</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              {[
                'Mvola (Telma)',
                'Orange Money',
                'Airtel Money',
                'Paiement à la livraison (Espèces)',
              ].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPaymentOption(p)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    paymentOption === p
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{p}</span>
                  {paymentOption === p && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 11: Confirmation of Theme (White, Green, Orange, Black) */}
        {step === 11 && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-[#0F172A]">
              11. Validation de l'Identité Visuelle
            </h3>
            <p className="text-xs text-slate-600">
              Votre boutique adopte la charte graphique moderne Varotra :
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-xs text-slate-800">Vert Émeraude</div>
                <div className="text-[10px] text-slate-400">Navigation & Prix</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border-2 border-orange-500 text-center">
                <div className="w-8 h-8 rounded-full bg-orange-600 mx-auto mb-2" />
                <div className="font-bold text-xs text-slate-800">Orange Vif</div>
                <div className="text-[10px] text-slate-400">Boutons & Panier</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-800 text-center">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] mx-auto mb-2" />
                <div className="font-bold text-xs text-slate-800">Noir Ardoise</div>
                <div className="text-[10px] text-slate-400">Textes & Titres</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 12: Success & Link Generation */}
        {step === 12 && createdStore && (
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-black">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#0F172A]">
                Félicitations ! Votre boutique est en ligne
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Votre boutique <span className="font-bold text-slate-800">{createdStore.name}</span> est prête à recevoir ses premières commandes.
              </p>
            </div>

            {/* Link Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between gap-2">
              <div className="text-left font-mono text-xs font-bold text-emerald-800 truncate">
                https://{createdStore.subdomain}
              </div>
              <button
                onClick={copyStoreUrl}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

            {/* Two Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <button
                onClick={() => handleFinishAndOpen('storefront')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <span>Visiter la boutique en ligne</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFinishAndOpen('merchant')}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xs transition"
              >
                Accéder au Dashboard vendeur
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        {step < 12 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !name.trim()}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 transition cursor-pointer"
            >
              <span>{step === 11 ? 'Générer ma boutique' : 'Étape suivante'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
