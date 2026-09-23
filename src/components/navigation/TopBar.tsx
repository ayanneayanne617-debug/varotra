import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store as StoreIcon,
  LayoutDashboard,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    stores,
    activeStore,
    setActiveStore,
    viewMode,
    setViewMode,
    setMerchantTab,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${activeStore.subdomain}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0F172A] text-white border-b border-slate-800 text-xs sm:text-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Store Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-emerald-500 to-orange-500 flex items-center justify-center font-black text-white text-xs shadow-sm">
              V
            </span>
            <span className="hidden sm:inline font-extrabold tracking-tight">VAROTRA</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Store Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-full text-xs font-medium transition"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="max-w-[120px] sm:max-w-[180px] truncate font-semibold">
                {activeStore.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 mt-1.5 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mes Boutiques ({stores.length})
                </div>
                {stores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStore(s)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      s.id === activeStore.id ? 'bg-emerald-50 text-emerald-700 font-semibold' : ''
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate font-medium">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.subdomain}</div>
                    </div>
                    {s.id === activeStore.id && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => setViewMode('wizard')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Créer une nouvelle boutique
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Subdomain chip & Copy */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800/40 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700/50">
            <span>{activeStore.subdomain}</span>
            <button
              onClick={handleCopyLink}
              title="Copier le lien public"
              className="text-slate-400 hover:text-emerald-400 transition ml-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Client (Storefront) */}
          <button
            onClick={() => setViewMode('storefront')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition ${
              viewMode === 'storefront'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-300" />
            <span className="hidden xs:inline">Vue</span> Client
          </button>

          {/* Mode Marchand (Gestion) */}
          <button
            onClick={() => {
              setViewMode('merchant');
              setMerchantTab('dashboard');
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition ${
              viewMode === 'merchant'
                ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
            <span>Gestion Vendeur</span>
          </button>

          {/* Super Admin Platform */}
          <button
            onClick={() => setViewMode('superadmin')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              viewMode === 'superadmin'
                ? 'bg-purple-600 text-white ring-2 ring-purple-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Panneau Administrateur Plateforme SaaS"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Admin SaaS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
