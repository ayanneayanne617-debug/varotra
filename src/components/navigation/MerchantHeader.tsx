import React from 'react';
import { useApp, MerchantTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Package,
  FileText,
  Palette,
  Users,
  Boxes,
  Truck,
  CreditCard,
  Tag,
  ExternalLink,
} from 'lucide-react';

export const MerchantHeader: React.FC = () => {
  const { activeStore, merchantTab, setMerchantTab, setViewMode, orders } = useApp();

  const tabs: { id: MerchantTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'orders', label: 'Commandes', icon: FileText },
    { id: 'customers', label: 'Clients', icon: Users },
    { id: 'inventory', label: 'Stock', icon: Boxes },
    { id: 'theme', label: 'Thème', icon: Palette },
    { id: 'shipping', label: 'Livraison', icon: Truck },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'promotions', label: 'Promotions', icon: Tag },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[41px] z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                Espace Vendeur
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                {activeStore.name}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              URL Boutique : {activeStore.subdomain}
            </p>
          </div>

          <button
            onClick={() => setViewMode('storefront')}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition"
          >
            <span>Voir la boutique en ligne</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = merchantTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMerchantTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#0F172A] hover:bg-slate-100 hover:text-emerald-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
