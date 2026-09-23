import React from 'react';
import { useApp, MerchantTab } from '../../context/AppContext';
import {
  Store as StoreIcon,
  LayoutDashboard,
  Package,
  FileText,
  Palette,
  Users,
  Boxes,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { viewMode, setViewMode, merchantTab, setMerchantTab, orders } = useApp();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Nouvelle' || o.status === 'Préparation'
  ).length;

  const handleNavClick = (tab: 'storefront' | MerchantTab) => {
    if (tab === 'storefront') {
      setViewMode('storefront');
    } else {
      setViewMode('merchant');
      setMerchantTab(tab);
    }
  };

  const isStoreActive = viewMode === 'storefront';
  const isDashboardActive = viewMode === 'merchant' && merchantTab === 'dashboard';
  const isProductsActive = viewMode === 'merchant' && merchantTab === 'products';
  const isOrdersActive = viewMode === 'merchant' && merchantTab === 'orders';
  const isThemeActive = viewMode === 'merchant' && merchantTab === 'theme';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-1.5 px-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 🏠 Boutique */}
        <button
          onClick={() => handleNavClick('storefront')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 relative cursor-pointer ${
            isStoreActive
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'text-[#0F172A] hover:text-emerald-700 font-medium'
          }`}
        >
          <StoreIcon className={`w-5 h-5 ${isStoreActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Boutique</span>
          {isStoreActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* ▦ Dashboard */}
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 relative cursor-pointer ${
            isDashboardActive
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'text-[#0F172A] hover:text-emerald-700 font-medium'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${isDashboardActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Dashboard</span>
          {isDashboardActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* ▣ Produits */}
        <button
          onClick={() => handleNavClick('products')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 relative cursor-pointer ${
            isProductsActive
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'text-[#0F172A] hover:text-emerald-700 font-medium'
          }`}
        >
          <Package className={`w-5 h-5 ${isProductsActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Produits</span>
          {isProductsActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* ▤ Commandes */}
        <button
          onClick={() => handleNavClick('orders')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 relative cursor-pointer ${
            isOrdersActive
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'text-[#0F172A] hover:text-emerald-700 font-medium'
          }`}
        >
          <div className="relative">
            <FileText className={`w-5 h-5 ${isOrdersActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-orange-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {pendingOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Commandes</span>
          {isOrdersActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>

        {/* 🎨 Thème */}
        <button
          onClick={() => handleNavClick('theme')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 relative cursor-pointer ${
            isThemeActive
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'text-[#0F172A] hover:text-emerald-700 font-medium'
          }`}
        >
          <Palette className={`w-5 h-5 ${isThemeActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Thème</span>
          {isThemeActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
