import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Store,
  Product,
  Order,
  Customer,
  Category,
  Currency,
  Language,
  OrderItem,
  DeliveryZone,
  PromoCode,
  PaymentMethodConfig,
  PlatformSettings,
} from '../types';
import { StorageService } from '../services/storage';
import { translations, getTranslation } from '../translations';

export type AppViewMode = 'storefront' | 'merchant' | 'superadmin' | 'wizard';
export type MerchantTab =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'theme'
  | 'customers'
  | 'inventory'
  | 'shipping'
  | 'payments'
  | 'promotions';

export interface CartItem extends OrderItem {
  stock: number;
}

interface AppContextType {
  // Store & Tenants
  stores: Store[];
  allStores: Store[];
  activeStore: Store;
  setActiveStore: (store: Store) => void;
  switchStore: (id: string) => void;
  refreshStores: () => void;
  refreshAllStores: () => void;
  updateActiveStore: (updated: Store) => void;

  // View & Nav
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  merchantTab: MerchantTab;
  setMerchantTab: (tab: MerchantTab) => void;

  // Localization & Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: typeof translations.fr;

  // Products & Categories (Isolated to activeStore)
  products: Product[];
  categories: Category[];
  refreshProducts: () => void;
  refreshCategories: () => void;
  selectedCategory: string; // 'all' or category name
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variantName?: string, variantPrice?: number) => void;
  removeFromCart: (productId: string, variantName?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  discountAmount: number;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  trackingOrderNumber: string | null;
  setTrackingOrderNumber: (num: string | null) => void;

  // Orders
  orders: Order[];
  refreshOrders: () => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Delivery Zones, Payments & Promo Codes
  deliveryZones: DeliveryZone[];
  updateDeliveryZones: (zones: DeliveryZone[]) => void;
  paymentConfigs: PaymentMethodConfig[];
  updatePaymentConfigs: (configs: PaymentMethodConfig[]) => void;
  promoCodes: PromoCode[];
  updatePromoCodes: (codes: PromoCode[]) => void;
  refreshSettings: () => void;

  // Super Admin
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: PlatformSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Localization & Currency
  const [language, setLanguage] = useState<Language>('fr');
  const [currency, setCurrency] = useState<Currency>('MGA');
  const t = getTranslation(language);

  // Store Management
  const [stores, setStores] = useState<Store[]>(() => StorageService.getStores());
  const [activeStore, setActiveStoreState] = useState<Store>(() => StorageService.getActiveStore());

  // Views & Routing
  const [viewMode, setViewMode] = useState<AppViewMode>('storefront');
  const [merchantTab, setMerchantTab] = useState<MerchantTab>('dashboard');

  // Active Store Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentMethodConfig[]>([]);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() =>
    StorageService.getPlatformSettings()
  );

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('varotra_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('varotra_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() =>
    StorageService.getPromoCodes(activeStore.id)
  );

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string | null>(null);

  // Reload data whenever active store changes
  const reloadStoreData = (storeId: string) => {
    const prods = StorageService.getProducts(storeId);
    setProducts(prods);

    const cats = StorageService.getCategories(storeId);
    setCategories(cats);

    const ords = StorageService.getOrders(storeId);
    setOrders(ords);

    const zones = StorageService.getDeliveryZones(storeId);
    setDeliveryZones(zones);

    const pays = StorageService.getPaymentMethods(storeId);
    setPaymentConfigs(pays);

    const promos = StorageService.getPromoCodes(storeId);
    setPromoCodes(promos);

    setSelectedCategory('all');
    setSearchQuery('');
    setAppliedPromo(null);
  };

  useEffect(() => {
    reloadStoreData(activeStore.id);
  }, [activeStore.id]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('varotra_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('varotra_wishlist', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  const setActiveStore = (store: Store) => {
    StorageService.setActiveStoreId(store.id);
    setActiveStoreState(store);
    // Clear cart if switching stores to maintain strict tenant isolation
    setCart([]);
  };

  const switchStore = (id: string) => {
    StorageService.setActiveStoreId(id);
    const target = StorageService.getActiveStore();
    setActiveStoreState(target);
    setCart([]);
  };

  const refreshStores = () => {
    const list = StorageService.getStores();
    setStores(list);
    const curr = StorageService.getActiveStore();
    setActiveStoreState(curr);
  };

  const refreshAllStores = refreshStores;

  const updateActiveStore = (updated: Store) => {
    StorageService.updateStore(updated);
    setActiveStoreState(updated);
    refreshStores();
  };

  const refreshProducts = () => {
    setProducts(StorageService.getProducts(activeStore.id));
  };

  const refreshCategories = () => {
    setCategories(StorageService.getCategories(activeStore.id));
  };

  const refreshOrders = () => {
    setOrders(StorageService.getOrders(activeStore.id));
  };

  const refreshSettings = () => {
    setDeliveryZones(StorageService.getDeliveryZones(activeStore.id));
    setPaymentConfigs(StorageService.getPaymentMethods(activeStore.id));
    setPromoCodes(StorageService.getPromoCodes(activeStore.id));
  };

  const updateDeliveryZones = (zones: DeliveryZone[]) => {
    StorageService.saveDeliveryZones(activeStore.id, zones);
    setDeliveryZones(zones);
  };

  const updatePaymentConfigs = (configs: PaymentMethodConfig[]) => {
    StorageService.savePaymentMethods(activeStore.id, configs);
    setPaymentConfigs(configs);
  };

  const updatePromoCodes = (codes: PromoCode[]) => {
    StorageService.savePromoCodes(activeStore.id, codes);
    setPromoCodes(codes);
  };

  const updatePlatformSettings = (settings: PlatformSettings) => {
    StorageService.savePlatformSettings(settings);
    setPlatformSettings(settings);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variantName?: string, variantPrice?: number) => {
    const price = variantPrice !== undefined ? variantPrice : product.price;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantName === variantName
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * price,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            productImage: product.images[0] || '',
            variantName,
            quantity,
            unitPrice: price,
            totalPrice: price * quantity,
            stock: product.stock,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId: string, variantName?: string) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.variantName === variantName)));
  };

  const updateCartQuantity = (productId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantName === variantName) {
          const clamped = Math.min(quantity, item.stock);
          return {
            ...item,
            quantity: clamped,
            totalPrice: clamped * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Promo Code Application
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const storePromos = StorageService.getPromoCodes(activeStore.id);
    const promo = storePromos.find((p) => p.code.toUpperCase() === clean && p.active);

    if (!promo) {
      return { success: false, message: 'Code promo introuvable ou expiré.' };
    }
    if (promo.minOrderAmount && cartSubtotal < promo.minOrderAmount) {
      return {
        success: false,
        message: `Montant minimum requis de ${promo.minOrderAmount.toLocaleString('fr-FR')} Ar.`,
      };
    }

    setAppliedPromo(promo);
    return { success: true, message: `Code ${promo.code} appliqué avec succès !` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === 'percentage'
      ? Math.round((cartSubtotal * appliedPromo.discountValue) / 100)
      : Math.min(cartSubtotal, appliedPromo.discountValue)
    : 0;

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const newOrder = StorageService.createOrder(orderData);
    refreshOrders();
    refreshProducts();
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    StorageService.updateOrderStatus(orderId, status);
    refreshOrders();
  };

  return (
    <AppContext.Provider
      value={{
        stores,
        allStores: stores,
        activeStore,
        setActiveStore,
        switchStore,
        refreshStores,
        refreshAllStores,
        updateActiveStore,

        viewMode,
        setViewMode,
        merchantTab,
        setMerchantTab,

        language,
        setLanguage,
        currency,
        setCurrency,
        t,

        products,
        categories,
        refreshProducts,
        refreshCategories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        discountAmount,

        wishlistIds,
        toggleWishlist,
        isWishlisted,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        selectedProductForModal,
        setSelectedProductForModal,
        trackingOrderNumber,
        setTrackingOrderNumber,

        orders,
        refreshOrders,
        createOrder,
        updateOrderStatus,

        deliveryZones,
        updateDeliveryZones,
        paymentConfigs,
        updatePaymentConfigs,
        promoCodes,
        updatePromoCodes,
        refreshSettings,

        platformSettings,
        updatePlatformSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
