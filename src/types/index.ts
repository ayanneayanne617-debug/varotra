export type Currency = 'MGA' | 'USD' | 'EUR';
export type Language = 'fr' | 'en' | 'mg';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Taille: L, Couleur: Vert"
  size?: 'S' | 'M' | 'L' | 'XL' | 'Unique';
  color?: string; // "Noir", "Blanc", "Vert", "Orange", etc.
  price: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number; // in base store currency (usually MGA)
  originalPrice?: number; // for discount display
  costPrice?: number; // for profit calculation
  images: string[];
  stock: number;
  reservedStock?: number;
  lowStockAlert: number;
  sku: string;
  barcode?: string;
  weightKg?: number;
  tags: string[];
  hasVariants?: boolean;
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  featured?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  icon?: string;
  productCount?: number;
}

export type OrderStatus =
  | 'Nouvelle'
  | 'Paiement en attente'
  | 'Payée'
  | 'Préparation'
  | 'Expédiée'
  | 'Livrée'
  | 'Annulée'
  | 'Remboursée';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #ORD-2026-0042
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  promoCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'Mvola' | 'Orange Money' | 'Airtel Money' | 'Paiement à la livraison' | 'Carte bancaire' | 'PayPal';
  paymentReference?: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoyaltyTier = 'Bronze' | 'Argent' | 'Or' | 'Platine';

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints?: number;
  loyaltyTier?: LoyaltyTier;
  lastOrderDate?: string;
  createdAt: string;
}

export interface ShippingAutomationRule {
  id: string;
  storeId: string;
  title: string;
  description: string;
  triggerEvent: 'order_paid' | 'order_confirmed' | 'destination_city';
  action: 'assign_carrier' | 'send_tracking_sms' | 'mark_in_preparation';
  carrierName?: string;
  active: boolean;
}

export interface MarketingCampaign {
  id: string;
  storeId: string;
  title: string;
  type: 'abandoned_cart' | 'loyalty_reward' | 'welcome_offer' | 'flash_sale';
  channel: 'whatsapp' | 'sms' | 'email';
  status: 'active' | 'paused' | 'draft';
  messageTemplate: string;
  triggerCondition: string;
  sentCount: number;
  conversionRate: number;
  createdAt: string;
}

export interface DeliveryZone {
  id: string;
  storeId?: string;
  name: string; // e.g. "Antananarivo Ville", "Grandes Provinces", "International"
  price: number;
  freeAboveAmount?: number; // e.g. 150000
  estimatedDeliveryTime: string;
  enabled: boolean;
}

export interface PromoCode {
  id: string;
  storeId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 10000 for 10,000 MGA
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  currentUses: number;
  active: boolean;
  enabled?: boolean;
  maxUsage?: number;
  currentUsage?: number;
}

export interface PaymentMethodConfig {
  id: string;
  name: 'Mvola' | 'Orange Money' | 'Airtel Money' | 'Paiement à la livraison' | 'Carte bancaire' | 'PayPal';
  enabled: boolean;
  instructions: string;
  accountNumber?: string;
  accountName?: string;
  apiKey?: string;
  type?: 'mobile_money' | 'cash_on_delivery' | 'card' | 'paypal';
}

export interface BannerSlide {
  id: string;
  categoryBadge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  imageUrl: string;
  subtitle?: string;
}

export interface StoreTheme {
  primaryColor: string; // Default Green (#059669 / #10B981)
  accentColor: string; // Default Orange (#F97316 / #EA580C)
  textColor: string; // Default Black (#0F172A)
  backgroundColor: string; // Default White (#FFFFFF)
  fontFamily: string;
  announcementText: string;
  announcementEnabled: boolean;
  bannerSlides: BannerSlide[];
  freeShippingPromoText: string;
  freeShippingThreshold: number;
  footerBio: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface StockMovement {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  type: 'Entrée' | 'Sortie' | 'Correction' | 'Vente' | 'Retour';
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
}

export type SubscriptionPlanId = 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  priceMonthly: number; // in MGA or USD
  priceMonthlyMGA: number;
  priceMGA?: number;
  productLimit: number;
  maxProducts?: number;
  orderLimitMonthly: number;
  staffLimit: number;
  storageMb: number;
  customDomainAllowed: boolean;
  commissionRate: number; // e.g. 5%
  features: string[];
}

export interface Store {
  id: string;
  name: string;
  slug: string; // e.g. "artisanat-malagasy"
  subdomain: string; // e.g. "artisanal.varotra.mg"
  logo: string;
  verified: boolean;
  description: string;
  category: string;
  country: string;
  currency: Currency;
  address: string;
  city?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  planId: SubscriptionPlanId;
  plan?: string;
  ownerId?: string;
  coverImage?: string;
  language?: Language;
  status: 'active' | 'suspended';
  commissionRate: number; // custom or plan default
  theme: StoreTheme;
  createdAt: string;
}

export interface PlatformSettings {
  defaultCommissionRate: number; // 5%
  fixedFeePerOrder: number;
  subscriptionPlans: SubscriptionPlan[];
}
