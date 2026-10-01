import {
  Store,
  Product,
  Order,
  Customer,
  Category,
  DeliveryZone,
  PromoCode,
  PaymentMethodConfig,
  PlatformSettings,
  StockMovement,
  SubscriptionPlan,
  ShippingAutomationRule,
  MarketingCampaign,
  LoyaltyTier,
} from '../types';

const STORAGE_KEYS = {
  STORES: 'varotra_stores_v1',
  ACTIVE_STORE_ID: 'varotra_active_store_id_v1',
  PRODUCTS: 'varotra_products_v1',
  CATEGORIES: 'varotra_categories_v1',
  ORDERS: 'varotra_orders_v1',
  CUSTOMERS: 'varotra_customers_v1',
  DELIVERY_ZONES: 'varotra_delivery_zones_v1',
  PROMO_CODES: 'varotra_promo_codes_v1',
  PAYMENTS: 'varotra_payments_v1',
  STOCK_MOVEMENTS: 'varotra_stock_movements_v1',
  PLATFORM_SETTINGS: 'varotra_platform_settings_v1',
  CART: 'varotra_cart_v1',
  WISHLIST: 'varotra_wishlist_v1',
};

// Initial Seed Data: Artisanat Malagasy & Vanille
const INITIAL_STORES: Store[] = [
  {
    id: 'store-artisanat-01',
    name: 'Artisanat Malagasy & Vanille',
    slug: 'artisanat-malagasy',
    subdomain: 'artisanal.varotra.mg',
    logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=160&q=80',
    verified: true,
    description: "Boutique d'artisanat d'exception, vanille Bourbon, paniers en raphia et produits malgaches.",
    category: 'Artisanat & Gastronomie',
    country: 'Madagascar',
    currency: 'MGA',
    address: 'Avenue de l’Indépendance, Analakely, Antananarivo',
    phone: '+261 34 22 845 90',
    email: 'contact@artisanal.varotra.mg',
    planId: 'PRO',
    status: 'active',
    commissionRate: 0.05,
    theme: {
      primaryColor: '#059669', // Emerald green
      accentColor: '#EA580C', // Deep vivid orange
      textColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      announcementText: '✨ Vente flash : Livraison offerte dès 150 000 Ar sur toute la boutique !',
      announcementEnabled: true,
      bannerSlides: [
        {
          id: 'slide-1',
          categoryBadge: 'Artisanat & Gastronomie',
          title: 'Artisanat Malagasy & Vanille',
          description: "Boutique d'artisanat d'exception, vanille Bourbon, paniers en raphia et produits malgaches.",
          buttonText: 'Découvrir la boutique',
          imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
        },
        {
          id: 'slide-2',
          categoryBadge: 'Vanille Bourbon de Sambava',
          title: 'Arômes Purs & Épices Rares',
          description: 'Récolte certifiée de la côte Est : vanille grasse, poivre sauvage et cannelle parfumée.',
          buttonText: 'Voir les épices',
          imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
        },
        {
          id: 'slide-3',
          categoryBadge: 'Tressage Traditionnel',
          title: 'Maroantsetra & Raphia',
          description: 'Paniers et accessoires durables façonnés à la main par nos maîtresses artisanes.',
          buttonText: 'Acheter un panier',
          imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80',
        },
      ],
      freeShippingPromoText: '🚚 Livraison offerte dès 150 000 Ar',
      freeShippingThreshold: 150000,
      footerBio: 'Fièrement propulsé par Varotra. Soutenons les producteurs et artisans malgaches.',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        whatsapp: '+261342284590',
      },
    },
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'store-tech-02',
    name: 'Tech Mada Direct',
    slug: 'tech-mada',
    subdomain: 'techmada.varotra.mg',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=160&q=80',
    verified: true,
    description: 'Smartphones, gadgets high-tech et accessoires informatiques au meilleur prix à Madagascar.',
    category: 'High-Tech & Électronique',
    country: 'Madagascar',
    currency: 'MGA',
    address: 'La City Ivandry, Antananarivo',
    phone: '+261 32 89 123 45',
    email: 'hello@techmada.varotra.mg',
    planId: 'BASIC',
    status: 'active',
    commissionRate: 0.05,
    theme: {
      primaryColor: '#0284C7',
      accentColor: '#EA580C',
      textColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      announcementText: '⚡ Nouveaux écouteurs sans fil avec réduction de bruit active arrivés !',
      announcementEnabled: true,
      bannerSlides: [
        {
          id: 'slide-tech-1',
          categoryBadge: 'Innovation & Mobilité',
          title: 'Accessoires Premium & Haute Fiabilité',
          description: 'Rechargez rapidement et écoutez votre musique avec nos appareils garantis 1 an.',
          buttonText: 'Voir le catalogue Tech',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        },
      ],
      freeShippingPromoText: '🚚 Livraison offerte dès 200 000 Ar',
      freeShippingThreshold: 200000,
      footerBio: 'Tech Mada - Votre partenaire high-tech officiel à Antananarivo.',
      socialLinks: {
        facebook: 'https://facebook.com',
        whatsapp: '+261328912345',
      },
    },
    createdAt: '2026-02-01T09:00:00.000Z',
  },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', storeId: 'store-artisanat-01', name: 'Tous les produits', slug: 'all' },
  { id: 'cat-2', storeId: 'store-artisanat-01', name: 'Vanille & Épices', slug: 'vanille-epices' },
  { id: 'cat-3', storeId: 'store-artisanat-01', name: 'Paniers & Raphia', slug: 'paniers-raphia' },
  { id: 'cat-4', storeId: 'store-artisanat-01', name: 'Artisanat d’Art', slug: 'artisanat-art' },
  { id: 'cat-5', storeId: 'store-artisanat-01', name: 'Soie & Textiles', slug: 'soie-textiles' },
  { id: 'cat-6', storeId: 'store-artisanat-01', name: 'Bien-être & Huiles', slug: 'bien-etre-huiles' },

  // For Tech Mada
  { id: 'cat-tech-1', storeId: 'store-tech-02', name: 'Tous les produits', slug: 'all' },
  { id: 'cat-tech-2', storeId: 'store-tech-02', name: 'Audio & Écouteurs', slug: 'audio' },
  { id: 'cat-tech-3', storeId: 'store-tech-02', name: 'Chargeurs & Powerbanks', slug: 'energie' },
  { id: 'cat-tech-4', storeId: 'store-tech-02', name: 'Accessoires PC & Mac', slug: 'pc-mac' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    storeId: 'store-artisanat-01',
    name: 'Poivre Sauvage Voatsiperifery',
    description: 'Poivre sauvage rare récolté en lianes dans les forêts primaires de Madagascar (150g). Notes florales, boisées et légèrement citronnées uniques.',
    category: 'Vanille & Épices',
    price: 32000,
    originalPrice: 40000,
    costPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 45,
    lowStockAlert: 10,
    sku: 'VOATSI-150G',
    tags: ['épices', 'bio', 'sauvage', 'madagascar'],
    rating: 4.9,
    reviewCount: 28,
    featured: true,
    hasVariants: false,
    createdAt: '2026-02-10T11:00:00.000Z',
    reviews: [
      {
        id: 'rev-1',
        author: 'Noro R.',
        rating: 5,
        comment: 'Arôme incomparable ! Parfait pour les viandes rouges et sauces au foie gras.',
        date: '2026-02-14',
        verified: true,
      },
      {
        id: 'rev-2',
        author: 'Jean-Marc D.',
        rating: 5,
        comment: 'Très belle qualité, conditionnement soigné et parfum extraordinaire.',
        date: '2026-02-18',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-02',
    storeId: 'store-artisanat-01',
    name: 'Gousses de Vanille Bourbon Gourmet',
    description: 'Tube hermétique de 10 gousses de vanille Bourbon de Sambava (16-18 cm). Noires, grasses, souples avec un taux d’humidité optimal de 33%.',
    category: 'Vanille & Épices',
    price: 95000,
    originalPrice: 110000,
    costPrice: 60000,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 18,
    lowStockAlert: 8,
    sku: 'VAN-BOUR-10',
    tags: ['vanille', 'sambava', 'gourmet'],
    rating: 5.0,
    reviewCount: 42,
    featured: true,
    hasVariants: false,
    createdAt: '2026-02-11T08:00:00.000Z',
  },
  {
    id: 'prod-03',
    storeId: 'store-artisanat-01',
    name: 'Panier Rabane & Raphia Tressé Main',
    description: 'Grand panier cabas traditionnel en fibres végétales de raphia naturel avec anses en cuir véritable renforcé. Solide, élégant et écoresponsable.',
    category: 'Paniers & Raphia',
    price: 45000,
    originalPrice: 55000,
    costPrice: 24000,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 22,
    lowStockAlert: 5,
    sku: 'PAN-RAPH-01',
    tags: ['panier', 'raphia', 'mode', 'artisanal'],
    rating: 4.8,
    reviewCount: 19,
    featured: true,
    hasVariants: true,
    variants: [
      { id: 'var-1', name: 'Taille M - Naturel', size: 'M', color: 'Blanc', price: 45000, stock: 12, sku: 'PAN-M-NAT' },
      { id: 'var-2', name: 'Taille L - Vert Émeraude', size: 'L', color: 'Vert', price: 52000, stock: 6, sku: 'PAN-L-VERT' },
      { id: 'var-3', name: 'Taille L - Orange Soleil', size: 'L', color: 'Orange', price: 52000, stock: 4, sku: 'PAN-L-ORA' },
    ],
    createdAt: '2026-02-12T14:30:00.000Z',
  },
  {
    id: 'prod-04',
    storeId: 'store-artisanat-01',
    name: 'Écharpe en Soie Sauvage (Landibe)',
    description: 'Écharpe haut de gamme en pure soie sauvage de vers à soie endémiques (Landibe) filée et tissée sur métier traditionnel à Arivonimamo.',
    category: 'Soie & Textiles',
    price: 135000,
    originalPrice: 160000,
    costPrice: 85000,
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 8,
    lowStockAlert: 5,
    sku: 'SOIE-LAND-01',
    tags: ['soie', 'landibe', 'luxe', 'textile'],
    rating: 4.9,
    reviewCount: 15,
    featured: true,
    hasVariants: true,
    variants: [
      { id: 'var-soie-1', name: 'Vert Forêt Profond', color: 'Vert', price: 135000, stock: 3, sku: 'SOIE-VERT' },
      { id: 'var-soie-2', name: 'Orange Terre Cuite', color: 'Orange', price: 135000, stock: 3, sku: 'SOIE-ORA' },
      { id: 'var-soie-3', name: 'Écru Naturel', color: 'Blanc', price: 135000, stock: 2, sku: 'SOIE-BLANC' },
    ],
    createdAt: '2026-02-13T09:15:00.000Z',
  },
  {
    id: 'prod-05',
    storeId: 'store-artisanat-01',
    name: 'Miel Pur d’Eucalyptus des Hautes Terres',
    description: 'Pot de 500g de miel brut monofloral d’eucalyptus récolté dans la région d’Ambatolampy. Saveur boisée et bienfaits respiratoires reconnus.',
    category: 'Vanille & Épices',
    price: 28000,
    originalPrice: 32000,
    costPrice: 15000,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 35,
    lowStockAlert: 8,
    sku: 'MIEL-EUC-500',
    tags: ['miel', 'bio', 'santé', 'terroir'],
    rating: 4.7,
    reviewCount: 22,
    hasVariants: false,
    createdAt: '2026-02-14T16:00:00.000Z',
  },
  {
    id: 'prod-06',
    storeId: 'store-artisanat-01',
    name: 'Huile Essentielle de Ravintsara Bio (30ml)',
    description: 'Cinnamomum camphora 100% pure et chémotypée à 1,8-cinéole. Le bouclier antiviral et immunitaire emblématique de Madagascar.',
    category: 'Bien-être & Huiles',
    price: 38000,
    originalPrice: 45000,
    costPrice: 20000,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 50,
    lowStockAlert: 12,
    sku: 'HE-RAVINT-30',
    tags: ['aromatherapie', 'bio', 'santé'],
    rating: 4.9,
    reviewCount: 34,
    hasVariants: false,
    createdAt: '2026-02-15T10:30:00.000Z',
  },
  {
    id: 'prod-07',
    storeId: 'store-artisanat-01',
    name: 'Statuette Baobab Sculptée en Bois Noble',
    description: 'Pièce décorative sculptée à la main dans du palissandre et bois d’ébène par les maîtres sculpteurs d’Ambositra.',
    category: 'Artisanat d’Art',
    price: 85000,
    originalPrice: 100000,
    costPrice: 48000,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 4, // low stock!
    lowStockAlert: 5,
    sku: 'SCULP-BAOBAB',
    tags: ['sculpture', 'bois', 'ambositra'],
    rating: 5.0,
    reviewCount: 9,
    hasVariants: false,
    createdAt: '2026-02-16T12:00:00.000Z',
  },
  {
    id: 'prod-08',
    storeId: 'store-artisanat-01',
    name: 'Chocolat Noir 70% Terroir Sambirano',
    description: 'Tablette grand cru 100g fabriquée avec les fèves criollo et trinitario de la vallée du Sambirano. Notes d’agrumes et de fruits rouges.',
    category: 'Vanille & Épices',
    price: 18000,
    originalPrice: 22000,
    costPrice: 9500,
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 60,
    lowStockAlert: 15,
    sku: 'CHOC-SAMB-70',
    tags: ['chocolat', 'gourmet', 'sambirano'],
    rating: 4.8,
    reviewCount: 51,
    hasVariants: false,
    createdAt: '2026-02-17T15:20:00.000Z',
  },

  // Tech Mada Products (Isolated to store-tech-02)
  {
    id: 'prod-tech-01',
    storeId: 'store-tech-02',
    name: 'Écouteurs Sans Fil SoundPro ANC',
    description: 'Écouteurs intra-auriculaires Bluetooth 5.3 avec réduction active du bruit ambiant et autonomie 32h avec boîtier.',
    category: 'Audio & Écouteurs',
    price: 145000,
    originalPrice: 175000,
    costPrice: 90000,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 24,
    lowStockAlert: 5,
    sku: 'TECH-ANC-01',
    tags: ['audio', 'bluetooth', 'musique'],
    rating: 4.7,
    reviewCount: 16,
    hasVariants: false,
    createdAt: '2026-02-18T10:00:00.000Z',
  },
  {
    id: 'prod-tech-02',
    storeId: 'store-tech-02',
    name: 'Powerbank Solaire Robuste 20 000 mAh',
    description: 'Batterie externe étanche avec panneau solaire intégré, lampe torche LED puissante et 3 sorties USB haute vitesse.',
    category: 'Chargeurs & Powerbanks',
    price: 110000,
    originalPrice: 130000,
    costPrice: 65000,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 15,
    lowStockAlert: 4,
    sku: 'TECH-SOLAR-20K',
    tags: ['powerbank', 'energie', 'solaire'],
    rating: 4.9,
    reviewCount: 23,
    hasVariants: false,
    createdAt: '2026-02-19T11:00:00.000Z',
  },
];

const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-1',
    storeId: 'store-artisanat-01',
    name: 'Antananarivo Ville (Intra-muros)',
    price: 5000,
    freeAboveAmount: 150000,
    estimatedDeliveryTime: '24h à 48h',
    enabled: true,
  },
  {
    id: 'zone-2',
    storeId: 'store-artisanat-01',
    name: 'Périphérie Antananarivo (Ambohimangakely, Ivato, Tanjombato)',
    price: 10000,
    freeAboveAmount: 150000,
    estimatedDeliveryTime: '24h à 72h',
    enabled: true,
  },
  {
    id: 'zone-3',
    storeId: 'store-artisanat-01',
    name: 'Grandes Villes de Province (Tamatave, Majunga, Diego, Tuléar)',
    price: 25000,
    freeAboveAmount: 350000,
    estimatedDeliveryTime: '3 à 5 jours ouvrés',
    enabled: true,
  },
  {
    id: 'zone-tech-1',
    storeId: 'store-tech-02',
    name: 'Grand Antananarivo Express',
    price: 8000,
    freeAboveAmount: 200000,
    estimatedDeliveryTime: 'Même jour si avant 13h',
    enabled: true,
  },
];

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    storeId: 'store-artisanat-01',
    code: 'VAROTRA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 50000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 200,
    currentUses: 34,
    active: true,
  },
  {
    id: 'promo-2',
    storeId: 'store-artisanat-01',
    code: 'BIENVENUE',
    discountType: 'fixed',
    discountValue: 15000,
    minOrderAmount: 100000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    maxUses: 100,
    currentUses: 12,
    active: true,
  },
];

const INITIAL_PAYMENTS: PaymentMethodConfig[] = [
  {
    id: 'pay-mvola',
    name: 'Mvola',
    enabled: true,
    accountNumber: '034 22 845 90',
    accountName: 'Artisanat Malagasy SARL',
    instructions: 'Transférez le montant par Mvola au 034 22 845 90 puis entrez la référence de validation SMS.',
  },
  {
    id: 'pay-orange',
    name: 'Orange Money',
    enabled: true,
    accountNumber: '032 44 912 30',
    accountName: 'Artisanat Malagasy SARL',
    instructions: 'Envoyez via Orange Money au 032 44 912 30.',
  },
  {
    id: 'pay-airtel',
    name: 'Airtel Money',
    enabled: true,
    accountNumber: '033 19 874 12',
    accountName: 'Artisanat Malagasy SARL',
    instructions: 'Paiement Airtel Money au 033 19 874 12.',
  },
  {
    id: 'pay-cod',
    name: 'Paiement à la livraison',
    enabled: true,
    instructions: 'Réglez directement en espèces ou par mobile money lors de la remise de votre colis par le livreur.',
  },
  {
    id: 'pay-card',
    name: 'Carte bancaire',
    enabled: true,
    instructions: 'Paiement sécurisé par carte Visa ou Mastercard (passerelle Stripe / BNI).',
  },
  {
    id: 'pay-paypal',
    name: 'PayPal',
    enabled: false,
    instructions: 'Règlement en ligne via votre compte PayPal international.',
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    storeId: 'store-artisanat-01',
    name: 'Harilala Randriamahaleo',
    phone: '+261 34 56 789 01',
    email: 'harilala.r@gmail.com',
    address: 'Lot IVK 23 Bis, Ankadifotsy',
    city: 'Antananarivo',
    totalOrders: 4,
    totalSpent: 428000,
    lastOrderDate: '2026-03-20T14:10:00.000Z',
    createdAt: '2026-01-20T09:00:00.000Z',
  },
  {
    id: 'cust-2',
    storeId: 'store-artisanat-01',
    name: 'Sarah Razafindrakoto',
    phone: '+261 32 11 223 34',
    email: 'sarah.razaf@yahoo.fr',
    address: 'Résidence Flamboyant, Ivandry',
    city: 'Antananarivo',
    totalOrders: 2,
    totalSpent: 195000,
    lastOrderDate: '2026-03-22T10:45:00.000Z',
    createdAt: '2026-02-05T15:00:00.000Z',
  },
  {
    id: 'cust-3',
    storeId: 'store-artisanat-01',
    name: 'Marc Lefebvre',
    phone: '+261 33 99 887 76',
    email: 'marc.lefebvre@outremer.mg',
    address: 'Bazar Be, Boulevard Augagneur',
    city: 'Tamatave',
    totalOrders: 1,
    totalSpent: 154000,
    lastOrderDate: '2026-03-23T08:20:00.000Z',
    createdAt: '2026-03-01T11:20:00.000Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#ORD-2026-0101',
    storeId: 'store-artisanat-01',
    customerName: 'Harilala Randriamahaleo',
    customerPhone: '+261 34 56 789 01',
    customerEmail: 'harilala.r@gmail.com',
    customerAddress: 'Lot IVK 23 Bis, Ankadifotsy',
    city: 'Antananarivo',
    items: [
      {
        productId: 'prod-01',
        productName: 'Poivre Sauvage Voatsiperifery (150g)',
        productImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        quantity: 2,
        unitPrice: 32000,
        totalPrice: 64000,
      },
      {
        productId: 'prod-02',
        productName: 'Gousses de Vanille Bourbon Gourmet (10 gousses)',
        productImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        unitPrice: 95000,
        totalPrice: 95000,
      },
    ],
    subtotal: 159000,
    discountAmount: 15900,
    promoCode: 'VAROTRA10',
    shippingFee: 0, // Free > 150000
    total: 143100,
    paymentMethod: 'Mvola',
    paymentReference: 'MV-98471203',
    status: 'Livrée',
    notes: 'Déposer chez le gardien si absent',
    createdAt: '2026-03-18T10:15:00.000Z',
    updatedAt: '2026-03-19T14:30:00.000Z',
  },
  {
    id: 'ord-1002',
    orderNumber: '#ORD-2026-0102',
    storeId: 'store-artisanat-01',
    customerName: 'Sarah Razafindrakoto',
    customerPhone: '+261 32 11 223 34',
    customerEmail: 'sarah.razaf@yahoo.fr',
    customerAddress: 'Résidence Flamboyant, Ivandry',
    city: 'Antananarivo',
    items: [
      {
        productId: 'prod-03',
        productName: 'Panier Rabane & Raphia Tressé Main',
        productImage: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
        variantName: 'Taille L - Vert Émeraude',
        quantity: 1,
        unitPrice: 52000,
        totalPrice: 52000,
      },
      {
        productId: 'prod-04',
        productName: 'Écharpe en Soie Sauvage (Landibe)',
        productImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
        variantName: 'Vert Forêt Profond',
        quantity: 1,
        unitPrice: 135000,
        totalPrice: 135000,
      },
    ],
    subtotal: 187000,
    discountAmount: 0,
    shippingFee: 0,
    total: 187000,
    paymentMethod: 'Orange Money',
    paymentReference: 'OM-23849102',
    status: 'Expédiée',
    notes: 'Appeler 15 min avant l’arrivée',
    createdAt: '2026-03-21T11:40:00.000Z',
    updatedAt: '2026-03-22T09:00:00.000Z',
  },
  {
    id: 'ord-1003',
    orderNumber: '#ORD-2026-0103',
    storeId: 'store-artisanat-01',
    customerName: 'Marc Lefebvre',
    customerPhone: '+261 33 99 887 76',
    customerEmail: 'marc.lefebvre@outremer.mg',
    customerAddress: 'Bazar Be, Boulevard Augagneur',
    city: 'Tamatave',
    items: [
      {
        productId: 'prod-07',
        productName: 'Statuette Baobab Sculptée en Bois Noble',
        productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        unitPrice: 85000,
        totalPrice: 85000,
      },
      {
        productId: 'prod-06',
        productName: 'Huile Essentielle de Ravintsara Bio (30ml)',
        productImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        quantity: 1,
        unitPrice: 38000,
        totalPrice: 38000,
      },
    ],
    subtotal: 123000,
    discountAmount: 0,
    shippingFee: 25000, // Province
    total: 148000,
    paymentMethod: 'Paiement à la livraison',
    status: 'Préparation',
    notes: 'Livraison transporteur Cotisse',
    createdAt: '2026-03-23T08:20:00.000Z',
    updatedAt: '2026-03-23T08:25:00.000Z',
  },
];

const INITIAL_PLATFORM_SETTINGS: PlatformSettings = {
  defaultCommissionRate: 0.05,
  fixedFeePerOrder: 500, // 500 MGA per transaction
  subscriptionPlans: [
    {
      id: 'FREE',
      name: 'Gratuit',
      priceMonthly: 0,
      priceMonthlyMGA: 0,
      productLimit: 10,
      orderLimitMonthly: 30,
      staffLimit: 1,
      storageMb: 100,
      customDomainAllowed: false,
      commissionRate: 0.07, // 7%
      features: ['Jusqu’à 10 produits', 'Sous-domaine .varotra.mg', 'Paiements Mobile Money', 'Support communautaire'],
    },
    {
      id: 'BASIC',
      name: 'Basic',
      priceMonthly: 12,
      priceMonthlyMGA: 55000,
      productLimit: 50,
      orderLimitMonthly: 200,
      staffLimit: 2,
      storageMb: 1000,
      customDomainAllowed: true,
      commissionRate: 0.05, // 5%
      features: ['50 produits', 'Statistiques détaillées', 'Codes promo illimités', 'Gestion du stock avancée', 'Domaine personnalisé'],
    },
    {
      id: 'PRO',
      name: 'Pro',
      priceMonthly: 29,
      priceMonthlyMGA: 140000,
      productLimit: 500,
      orderLimitMonthly: 1500,
      staffLimit: 5,
      storageMb: 5000,
      customDomainAllowed: true,
      commissionRate: 0.03, // 3%
      features: ['500 produits', 'Support prioritaire 7j/7', 'Personnalisation du thème complète', 'Import / Export CSV', 'Commission réduite à 3%'],
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      priceMonthly: 79,
      priceMonthlyMGA: 380000,
      productLimit: 10000,
      orderLimitMonthly: 50000,
      staffLimit: 25,
      storageMb: 50000,
      customDomainAllowed: true,
      commissionRate: 0.015, // 1.5%
      features: ['Produits illimités', 'Comptes employés illimités', 'Gestionnaire de compte dédié', 'API & Webhooks', 'Commission minimale 1.5%'],
    },
  ],
};

// Safe LocalStorage helpers
export const getStored = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
};

export const setStored = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed saving ${key}`, e);
  }
};

// Service API
export const StorageService = {
  // Stores
  getStores(): Store[] {
    const stores = getStored<Store[]>(STORAGE_KEYS.STORES, []);
    if (!stores || stores.length === 0) {
      setStored(STORAGE_KEYS.STORES, INITIAL_STORES);
      return INITIAL_STORES;
    }
    return stores;
  },

  saveStores(stores: Store[]) {
    setStored(STORAGE_KEYS.STORES, stores);
  },

  getActiveStoreId(): string {
    const active = getStored<string>(STORAGE_KEYS.ACTIVE_STORE_ID, '');
    if (active) return active;
    const stores = this.getStores();
    const id = stores[0]?.id || 'store-artisanat-01';
    setStored(STORAGE_KEYS.ACTIVE_STORE_ID, id);
    return id;
  },

  setActiveStoreId(id: string) {
    setStored(STORAGE_KEYS.ACTIVE_STORE_ID, id);
  },

  getActiveStore(): Store {
    const activeId = this.getActiveStoreId();
    const stores = this.getStores();
    return stores.find((s) => s.id === activeId) || stores[0] || INITIAL_STORES[0];
  },

  updateStore(updated: Store) {
    const stores = this.getStores();
    const index = stores.findIndex((s) => s.id === updated.id);
    if (index >= 0) {
      stores[index] = updated;
    } else {
      stores.push(updated);
    }
    this.saveStores(stores);
  },

  createStore(newStore: Partial<Store>): Store {
    const stores = this.getStores();
    const id = `store-${Date.now()}`;
    const slug = newStore.name
      ? newStore.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      : 'ma-boutique';

    const fullStore: Store = {
      id,
      name: newStore.name || 'Ma Nouvelle Boutique',
      slug,
      subdomain: `${slug}.varotra.mg`,
      logo: newStore.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=160&q=80',
      verified: false,
      description: newStore.description || 'Bienvenue dans ma nouvelle boutique sur Varotra !',
      category: newStore.category || 'Commerce général',
      country: newStore.country || 'Madagascar',
      currency: newStore.currency || 'MGA',
      address: newStore.address || 'Antananarivo, Madagascar',
      phone: newStore.phone || '+261 34 00 000 00',
      email: newStore.email || 'contact@boutique.mg',
      planId: 'FREE',
      status: 'active',
      commissionRate: 0.05,
      theme: {
        primaryColor: '#059669',
        accentColor: '#EA580C',
        textColor: '#0F172A',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Plus Jakarta Sans',
        announcementText: 'Bienvenue dans notre boutique en ligne !',
        announcementEnabled: true,
        bannerSlides: [
          {
            id: 'slide-def-1',
            categoryBadge: newStore.category || 'Nouveautés',
            title: newStore.name || 'Notre Sélection Exclusivité',
            description: newStore.description || 'Découvrez nos produits de qualité disponibles dès aujourd’hui.',
            buttonText: 'Acheter maintenant',
            imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
          },
        ],
        freeShippingPromoText: '🚚 Livraison offerte dès 150 000 Ar',
        freeShippingThreshold: 150000,
        footerBio: 'Boutique hébergée avec passion sur Varotra.',
        socialLinks: {},
      },
      createdAt: new Date().toISOString(),
      ...newStore,
    };

    stores.push(fullStore);
    this.saveStores(stores);
    this.setActiveStoreId(fullStore.id);

    // Seed initial category for the new store
    const categories = this.getCategories('all');
    categories.push({
      id: `cat-${Date.now()}`,
      storeId: fullStore.id,
      name: 'Tous les produits',
      slug: 'all',
    });
    setStored(STORAGE_KEYS.CATEGORIES, categories);

    return fullStore;
  },

  // Products
  getProducts(storeId?: string): Product[] {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (!products || products.length === 0) {
      setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      if (storeId) {
        return INITIAL_PRODUCTS.filter((p) => p.storeId === storeId);
      }
      return INITIAL_PRODUCTS;
    }
    if (storeId) {
      return products.filter((p) => p.storeId === storeId);
    }
    return products;
  },

  saveProducts(products: Product[]) {
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },

  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const all = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newProduct);
    this.saveProducts(all);

    // Log stock movement
    this.addStockMovement({
      storeId: newProduct.storeId,
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'Entrée',
      quantity: newProduct.stock,
      previousStock: 0,
      newStock: newProduct.stock,
      reason: 'Création initiale du produit',
    });

    return newProduct;
  },

  updateProduct(updated: Product) {
    const all = this.getProducts();
    const index = all.findIndex((p) => p.id === updated.id);
    if (index >= 0) {
      const prevStock = all[index].stock;
      if (prevStock !== updated.stock) {
        this.addStockMovement({
          storeId: updated.storeId,
          productId: updated.id,
          productName: updated.name,
          type: updated.stock > prevStock ? 'Entrée' : 'Correction',
          quantity: updated.stock - prevStock,
          previousStock: prevStock,
          newStock: updated.stock,
          reason: 'Ajustement manuel du stock',
        });
      }
      all[index] = updated;
      this.saveProducts(all);
    }
  },

  deleteProduct(id: string) {
    const all = this.getProducts();
    const filtered = all.filter((p) => p.id !== id);
    this.saveProducts(filtered);
  },

  duplicateProduct(id: string): Product | null {
    const all = this.getProducts();
    const target = all.find((p) => p.id === id);
    if (!target) return null;
    const duplicated: Product = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copie)`,
      sku: `${target.sku}-COPY`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(duplicated);
    this.saveProducts(all);
    return duplicated;
  },

  bulkAddProducts(
    products: Omit<Product, 'id' | 'createdAt'>[],
    mode: 'add_new' | 'update_sku' = 'add_new'
  ): { added: number; updated: number } {
    const all = this.getProducts();
    let added = 0;
    let updated = 0;
    const now = Date.now();

    products.forEach((p, idx) => {
      const existingIndex =
        mode === 'update_sku' && p.sku
          ? all.findIndex(
              (x) => x.storeId === p.storeId && x.sku.trim().toLowerCase() === p.sku.trim().toLowerCase()
            )
          : -1;

      if (existingIndex >= 0) {
        all[existingIndex] = {
          ...all[existingIndex],
          ...p,
        };
        updated++;
      } else {
        const newProduct: Product = {
          ...p,
          id: `prod-${now}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        };
        all.unshift(newProduct);
        added++;

        // Add initial stock movement
        this.addStockMovement({
          storeId: newProduct.storeId,
          productId: newProduct.id,
          productName: newProduct.name,
          type: 'Entrée',
          quantity: newProduct.stock,
          previousStock: 0,
          newStock: newProduct.stock,
          reason: 'Importation massive CSV',
        });
      }
    });

    this.saveProducts(all);
    return { added, updated };
  },

  // Categories
  getCategories(storeId: string): Category[] {
    const all = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    if (!all || all.length === 0) {
      setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      return storeId === 'all' ? INITIAL_CATEGORIES : INITIAL_CATEGORIES.filter((c) => c.storeId === storeId);
    }
    if (storeId === 'all') return all;
    return all.filter((c) => c.storeId === storeId);
  },

  saveCategories(categories: Category[]) {
    setStored(STORAGE_KEYS.CATEGORIES, categories);
  },

  addCategory(storeId: string, name: string): Category {
    const all = this.getCategories('all');
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      storeId,
      name,
      slug,
    };
    all.push(newCat);
    this.saveCategories(all);
    return newCat;
  },

  // Orders
  getOrders(storeId?: string): Order[] {
    const all = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    if (!all || all.length === 0) {
      setStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
      return storeId ? INITIAL_ORDERS.filter((o) => o.storeId === storeId) : INITIAL_ORDERS;
    }
    if (storeId) {
      return all.filter((o) => o.storeId === storeId);
    }
    return all;
  },

  saveOrders(orders: Order[]) {
    setStored(STORAGE_KEYS.ORDERS, orders);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const all = this.getOrders();
    const orderNumber = `#ORD-${new Date().getFullYear()}-${String(all.length + 101).padStart(4, '0')}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(newOrder);
    this.saveOrders(all);

    // Deduct stock for each item
    const products = this.getProducts();
    orderData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        const prev = prod.stock;
        prod.stock = Math.max(0, prod.stock - item.quantity);
        this.addStockMovement({
          storeId: orderData.storeId,
          productId: prod.id,
          productName: prod.name,
          type: 'Vente',
          quantity: -item.quantity,
          previousStock: prev,
          newStock: prod.stock,
          reason: `Commande ${orderNumber}`,
        });
      }
    });
    this.saveProducts(products);

    // Update or create customer
    this.recordCustomerOrder(orderData.storeId, {
      name: orderData.customerName,
      phone: orderData.customerPhone,
      email: orderData.customerEmail,
      address: orderData.customerAddress,
      city: orderData.city,
      spent: orderData.total,
    });

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    const all = this.getOrders();
    const order = all.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.saveOrders(all);
    }
  },

  // Customers
  getCustomers(storeId?: string): Customer[] {
    const all = getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    const source = (!all || all.length === 0) ? INITIAL_CUSTOMERS : all;
    
    // Enrich with default loyalty points and tiers if missing
    const enriched = source.map((c) => {
      const points = c.loyaltyPoints !== undefined ? c.loyaltyPoints : Math.floor(c.totalSpent / 1000);
      const tier: LoyaltyTier = c.loyaltyTier || (points >= 600 ? 'Platine' : points >= 300 ? 'Or' : points >= 100 ? 'Argent' : 'Bronze');
      return {
        ...c,
        loyaltyPoints: points,
        loyaltyTier: tier,
      };
    });

    if (!all || all.length === 0) {
      setStored(STORAGE_KEYS.CUSTOMERS, enriched);
    }

    if (storeId) {
      return enriched.filter((c) => c.storeId === storeId);
    }
    return enriched;
  },

  updateCustomerLoyalty(customerId: string, pointsDelta: number): Customer | null {
    const all = this.getCustomers();
    const customer = all.find((c) => c.id === customerId);
    if (!customer) return null;

    const currentPoints = customer.loyaltyPoints || 0;
    const newPoints = Math.max(0, currentPoints + pointsDelta);
    const newTier: LoyaltyTier =
      newPoints >= 600 ? 'Platine' : newPoints >= 300 ? 'Or' : newPoints >= 100 ? 'Argent' : 'Bronze';

    customer.loyaltyPoints = newPoints;
    customer.loyaltyTier = newTier;
    setStored(STORAGE_KEYS.CUSTOMERS, all);
    return customer;
  },

  recordCustomerOrder(
    storeId: string,
    data: { name: string; phone: string; email: string; address: string; city: string; spent: number }
  ) {
    const customers = this.getCustomers();
    const existing = customers.find(
      (c) => c.storeId === storeId && (c.phone === data.phone || (data.email && c.email.toLowerCase() === data.email.toLowerCase()))
    );

    const earnedPoints = Math.floor(data.spent / 1000);

    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += data.spent;
      existing.loyaltyPoints = (existing.loyaltyPoints || 0) + earnedPoints;
      existing.loyaltyTier = existing.loyaltyPoints >= 600 ? 'Platine' : existing.loyaltyPoints >= 300 ? 'Or' : existing.loyaltyPoints >= 100 ? 'Argent' : 'Bronze';
      existing.lastOrderDate = new Date().toISOString();
      existing.address = data.address || existing.address;
      existing.city = data.city || existing.city;
    } else {
      const newPoints = earnedPoints;
      customers.push({
        id: `cust-${Date.now()}`,
        storeId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        totalOrders: 1,
        totalSpent: data.spent,
        loyaltyPoints: newPoints,
        loyaltyTier: newPoints >= 600 ? 'Platine' : newPoints >= 300 ? 'Or' : newPoints >= 100 ? 'Argent' : 'Bronze',
        lastOrderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },

  // Delivery Zones
  getDeliveryZones(storeId: string): DeliveryZone[] {
    const all = getStored<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, []);
    if (!all || all.length === 0) {
      setStored(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
      return INITIAL_DELIVERY_ZONES.filter((z) => z.storeId === storeId);
    }
    return all.filter((z) => z.storeId === storeId);
  },

  saveDeliveryZones(storeId: string, zones: DeliveryZone[]) {
    const all = getStored<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
    const otherZones = all.filter((z) => z.storeId !== storeId);
    setStored(STORAGE_KEYS.DELIVERY_ZONES, [...otherZones, ...zones]);
  },

  // Promo Codes
  getPromoCodes(storeId: string): PromoCode[] {
    const all = getStored<PromoCode[]>(STORAGE_KEYS.PROMO_CODES, []);
    if (!all || all.length === 0) {
      setStored(STORAGE_KEYS.PROMO_CODES, INITIAL_PROMO_CODES);
      return INITIAL_PROMO_CODES.filter((p) => p.storeId === storeId);
    }
    return all.filter((p) => p.storeId === storeId);
  },

  savePromoCodes(storeId: string, codes: PromoCode[]) {
    const all = getStored<PromoCode[]>(STORAGE_KEYS.PROMO_CODES, INITIAL_PROMO_CODES);
    const otherCodes = all.filter((p) => p.storeId !== storeId);
    setStored(STORAGE_KEYS.PROMO_CODES, [...otherCodes, ...codes]);
  },

  // Payments
  getPaymentMethods(storeId?: string): PaymentMethodConfig[] {
    const key = `${STORAGE_KEYS.PAYMENTS}_${storeId || 'default'}`;
    const methods = getStored<PaymentMethodConfig[]>(key, []);
    if (!methods || methods.length === 0) {
      setStored(key, INITIAL_PAYMENTS);
      return INITIAL_PAYMENTS;
    }
    return methods;
  },

  savePaymentMethods(storeId: string, methods: PaymentMethodConfig[]) {
    const key = `${STORAGE_KEYS.PAYMENTS}_${storeId || 'default'}`;
    setStored(key, methods);
  },

  // Stock movements
  getStockMovements(storeId: string): StockMovement[] {
    const all = getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    return all.filter((m) => m.storeId === storeId);
  },

  addStockMovement(movement: Omit<StockMovement, 'id' | 'date'>) {
    const all = getStored<StockMovement[]>(STORAGE_KEYS.STOCK_MOVEMENTS, []);
    all.unshift({
      ...movement,
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
    });
    setStored(STORAGE_KEYS.STOCK_MOVEMENTS, all.slice(0, 100)); // keep last 100
  },

  // Platform Settings (Admin)
  getPlatformSettings(): PlatformSettings {
    return getStored<PlatformSettings>(STORAGE_KEYS.PLATFORM_SETTINGS, INITIAL_PLATFORM_SETTINGS);
  },

  getSubscriptionPlans(): SubscriptionPlan[] {
    return this.getPlatformSettings().subscriptionPlans;
  },

  savePlatformSettings(settings: PlatformSettings) {
    setStored(STORAGE_KEYS.PLATFORM_SETTINGS, settings);
  },

  // Shipping Automation Rules
  getShippingRules(storeId: string): ShippingAutomationRule[] {
    const defaultRules: ShippingAutomationRule[] = [
      {
        id: 'rule-1',
        storeId,
        title: 'Dispatch Express Antananarivo',
        description: 'Attribuer automatiquement les livraisons intramuros à Antananarivo Express (Livreur Moto).',
        triggerEvent: 'destination_city',
        action: 'assign_carrier',
        carrierName: 'Antananarivo Express Moto',
        active: true,
      },
      {
        id: 'rule-2',
        storeId,
        title: 'Notification SMS / WhatsApp automatique',
        description: 'Envoyer instantanément un message WhatsApp ou SMS avec le lien de suivi dès le passage en Expédiée.',
        triggerEvent: 'order_paid',
        action: 'send_tracking_sms',
        active: true,
      },
      {
        id: 'rule-3',
        storeId,
        title: 'Mise en préparation immédiate',
        description: 'Passer la commande en "Préparation" dès validation du paiement Mobile Money.',
        triggerEvent: 'order_paid',
        action: 'mark_in_preparation',
        active: true,
      },
    ];
    return getStored<ShippingAutomationRule[]>(`varotra_shipping_rules_${storeId}`, defaultRules);
  },

  saveShippingRules(storeId: string, rules: ShippingAutomationRule[]) {
    setStored(`varotra_shipping_rules_${storeId}`, rules);
  },

  // Marketing Automation Campaigns
  getMarketingCampaigns(storeId: string): MarketingCampaign[] {
    const defaultCampaigns: MarketingCampaign[] = [
      {
        id: 'camp-1',
        storeId,
        title: 'Relance Paniers Abandonnés (WhatsApp)',
        type: 'abandoned_cart',
        channel: 'whatsapp',
        status: 'active',
        messageTemplate: 'Bonjour {{nom}} ! Vos articles vous attendent sur {{boutique}}. Bénéficiez de 10% de remise immédiate avec le code REVIENS10 !',
        triggerCondition: '1 heure après abandon du panier',
        sentCount: 38,
        conversionRate: 23.7,
        createdAt: '2026-02-01',
      },
      {
        id: 'camp-2',
        storeId,
        title: 'Bienvenue & Cadeau Premier Achat',
        type: 'welcome_offer',
        channel: 'sms',
        status: 'active',
        messageTemplate: 'Bienvenue chez {{boutique}} ! Profitez de la livraison offerte dès 50 000 Ar sur votre premier achat avec le code BIENVENUE.',
        triggerCondition: 'Création de compte client',
        sentCount: 114,
        conversionRate: 31.5,
        createdAt: '2026-01-20',
      },
      {
        id: 'camp-3',
        storeId,
        title: 'Récompense Palier Fidélité (Or & VIP)',
        type: 'loyalty_reward',
        channel: 'whatsapp',
        status: 'active',
        messageTemplate: 'Félicitations {{nom}} ! Vous avez atteint le statut VIP Or. Votre bon d’achat fidélité de 20 000 Ar est utilisable immédiatement !',
        triggerCondition: 'Dépassement de 300 points de fidélité',
        sentCount: 19,
        conversionRate: 68.4,
        createdAt: '2026-02-15',
      },
      {
        id: 'camp-4',
        storeId,
        title: 'Vente Flash Weekend (Spécial Épices)',
        type: 'flash_sale',
        channel: 'sms',
        status: 'active',
        messageTemplate: '⚡ Flash Weekend : -15% sur toutes les gousses de vanille et poivre sauvage jusqu’à dimanche minuit ! Code : FLASHMADA.',
        triggerCondition: 'Déclenchement instantané ou programmé',
        sentCount: 240,
        conversionRate: 18.2,
        createdAt: '2026-03-01',
      },
    ];
    return getStored<MarketingCampaign[]>(`varotra_marketing_campaigns_${storeId}`, defaultCampaigns);
  },

  saveMarketingCampaigns(storeId: string, campaigns: MarketingCampaign[]) {
    setStored(`varotra_marketing_campaigns_${storeId}`, campaigns);
  },
};
