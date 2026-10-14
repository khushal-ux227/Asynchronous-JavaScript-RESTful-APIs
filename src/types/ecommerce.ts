export type ProductCategory = 'all' | 'furniture' | 'lighting' | 'tableware' | 'objects';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  material: string;
  colorName: string;
  hexColor: string;
  priceDelta: number;
  inStock: boolean;
  inventoryCount: number;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  designer: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  inventoryCount: number;
  leadTime: string;
  description: string;
  shortDescription: string;
  dimensions: {
    widthCm: number;
    depthCm: number;
    heightCm: number;
    weightKg: number;
  };
  materials: string[];
  careInstructions: string;
  images: {
    hero: string;
    detail: string;
    ambient?: string;
  };
  features: string[];
  variants: ProductVariant[];
  badge?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  addedAt: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export type PaymentMethodType = 'credit_card' | 'apple_pay' | 'cash_on_delivery';

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  status: 'confirmed' | 'packaging' | 'shipped' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}

export interface CatalogFilterState {
  search: string;
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name';
  material: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier relative to USD
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}
