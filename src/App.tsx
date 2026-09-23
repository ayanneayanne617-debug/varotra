import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { MerchantHeader } from './components/navigation/MerchantHeader';

// Storefront components
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { HeroBanner } from './components/storefront/HeroBanner';
import { CategoryFilter } from './components/storefront/CategoryFilter';
import { ProductGrid } from './components/storefront/ProductGrid';
import { StoreFooter } from './components/storefront/StoreFooter';
import { ProductModal } from './components/storefront/ProductModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { WishlistDrawer } from './components/storefront/WishlistDrawer';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';

// Merchant sub-views
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsManager } from './components/products/ProductsManager';
import { OrdersManager } from './components/orders/OrdersManager';
import { ThemeCustomizer } from './components/theme/ThemeCustomizer';
import { CustomersManager } from './components/customers/CustomersManager';
import { InventoryManager } from './components/inventory/InventoryManager';
import { ShippingManager } from './components/shipping/ShippingManager';
import { PaymentsManager } from './components/payments/PaymentsManager';
import { PromotionsManager } from './components/promotions/PromotionsManager';

// SaaS platform views
import { StoreCreationWizard } from './components/wizard/StoreCreationWizard';
import { SuperAdminPanel } from './components/admin/SuperAdminPanel';

const AppContent: React.FC = () => {
  const { viewMode, merchantTab } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex flex-col selection:bg-emerald-500 selection:text-white font-sans antialiased">
      {/* Top Universal Bar (Store Switcher, Role Picker) */}
      <TopBar />

      {/* Main Content Area depending on viewMode */}
      <main className="flex-1">
        {viewMode === 'storefront' && (
          <div className="space-y-4">
            <StorefrontHeader />
            <HeroBanner />
            <CategoryFilter />
            <ProductGrid />
            <StoreFooter />
          </div>
        )}

        {viewMode === 'merchant' && (
          <div>
            <MerchantHeader />
            <div className="pt-2">
              {merchantTab === 'dashboard' && <DashboardView />}
              {merchantTab === 'products' && <ProductsManager />}
              {merchantTab === 'orders' && <OrdersManager />}
              {merchantTab === 'theme' && <ThemeCustomizer />}
              {merchantTab === 'customers' && <CustomersManager />}
              {merchantTab === 'inventory' && <InventoryManager />}
              {merchantTab === 'shipping' && <ShippingManager />}
              {merchantTab === 'payments' && <PaymentsManager />}
              {merchantTab === 'promotions' && <PromotionsManager />}
            </div>
          </div>
        )}

        {viewMode === 'wizard' && <StoreCreationWizard />}

        {viewMode === 'superadmin' && <SuperAdminPanel />}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
      <OrderTrackingModal />

      {/* Fixed Bottom Navigation (Mobile & Tablet) */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
