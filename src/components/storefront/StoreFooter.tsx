import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { activeStore, setTrackingOrderNumber, setViewMode } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 pb-24 sm:pb-12 text-[#0F172A]">
      {/* Values banner */}
      <div className="border-b border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Livraison Garantie</div>
              <div className="text-slate-500 text-[11px]">Sur tout Madagascar</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Paiement Sécurisé</div>
              <div className="text-slate-500 text-[11px]">Mvola, OM, CB & Espèces</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Qualité Certifiée</div>
              <div className="text-slate-500 text-[11px]">Produits artisanaux & testés</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Service Client Direct</div>
              <div className="text-slate-500 text-[11px]">Réponse rapide 7j/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Store Profile */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              src={activeStore.logo}
              alt=""
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                {activeStore.name}
              </h4>
              <p className="text-xs font-mono text-emerald-700">{activeStore.subdomain}</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
            {activeStore.theme.footerBio || activeStore.description}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 text-xs text-slate-600">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Contact & Localisation
          </h4>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{activeStore.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <a href={`tel:${activeStore.phone}`} className="hover:text-emerald-700 font-semibold">
              {activeStore.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <a href={`mailto:${activeStore.email}`} className="hover:text-emerald-700">
              {activeStore.email}
            </a>
          </div>
        </div>

        {/* Quick Links & SaaS platform banner */}
        <div className="space-y-3 text-xs">
          <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
            Services & Suivi
          </h4>
          <ul className="space-y-2 text-slate-600">
            <li>
              <button
                onClick={() => setTrackingOrderNumber('#ORD-2026-0101')}
                className="hover:text-emerald-600 font-semibold flex items-center gap-1.5"
              >
                <span>📦 Suivre l'état de ma commande</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setViewMode('wizard')}
                className="hover:text-orange-600 font-bold text-orange-700 flex items-center gap-1.5"
              >
                <span>🚀 Créer ma propre boutique sur Varotra</span>
              </button>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Propulsé par la technologie Varotra SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
