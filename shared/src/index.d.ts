// Type declarations for @debu/shared.

export type ColorKey = 'red' | 'green' | 'blue' | 'pink' | 'maroon' | 'yellow' | 'gold' | 'custom';
export type PresetColorKey = Exclude<ColorKey, 'custom'>;
export type JewelleryCategory = 'bangles' | 'necklaces' | 'earrings' | 'forehead-pendants';
export type ProductCategory = JewelleryCategory | 'wire-bags';
export type ProductType = 'jewellery' | 'wire-bag';
export type BagSize = 'small' | 'medium' | 'large';
export type ArtKind = 'bangle' | 'necklace' | 'earring' | 'tikka' | 'wirebag' | 'combo';
export type PaymentMethod = 'cod' | 'upi' | 'online';

export interface ArtSpec {
  kind: ArtKind;
  variant: number;
}

export interface SizeOption {
  size: BagSize;
  price: number;
  dimensions: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  type: ProductType;
  category: ProductCategory;
  /** Base price in INR. For wire bags this is the Small price. */
  price: number;
  compareAtPrice?: number;
  sizes?: SizeOption[];
  description: string;
  highlights: string[];
  colors: PresetColorKey[];
  defaultColor: PresetColorKey;
  art: ArtSpec;
  images: string[];
  rating: number;
  reviews: number;
  tags: string[];
  badge?: string;
  featured?: boolean;
  inStock: boolean;
  customizationNotes?: string;
}

export interface ComboItem {
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
}

export interface Combo {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: 'combo';
  category: 'combos';
  itemSlugs: string[];
  items: ComboItem[];
  price: number;
  originalPrice: number;
  savings: number;
  colors: PresetColorKey[];
  defaultColor: PresetColorKey;
  art: ArtSpec;
  images: string[];
  badge?: string;
  inStock: boolean;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}

export interface ContactLine {
  key: 'products' | 'services';
  label: string;
  phone: string;
}

export interface PricingLine {
  kind: 'product' | 'combo';
  productId: string;
  name: string;
  size?: BagSize;
  unitPrice: number;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  collections: { productId: string; name: string; sets: number }[];
  collectionDiscount: number;
  coupon: { code: string; description: string } | null;
  couponMessage: string | null;
  couponDiscount: number;
  discountedSubtotal: number;
  shipping: number;
  gst: number;
  gstRate: number;
  total: number;
  freeShippingRemaining: number;
}

export interface CouponEvaluation {
  valid: boolean;
  discount: number;
  coupon?: Coupon;
  message: string;
}

export declare const BRAND: {
  name: string;
  tagline: string;
  email: string;
  city: string;
  instagram: string;
  facebook: string;
  youtube: string;
};
export declare const CONTACTS: { products: ContactLine; services: ContactLine };
export declare const CURRENCY: { code: string; symbol: string; locale: string };
export declare const COLORS: Record<ColorKey, { label: string; hex: string; shade: string }>;
export declare const PRESET_COLORS: PresetColorKey[];
export declare const JEWELLERY_CATEGORIES: { slug: JewelleryCategory; name: string; blurb: string }[];
export declare const BAG_SIZES: { size: BagSize; label: string }[];
export declare const WIRE_BAG_COLLECTION: { discount: number; label: string; message: string };
export declare const GST: { enabled: boolean; rate: number; label: string };
export declare const SHIPPING: { flatRate: number; freeAbove: number };
export declare const COUPONS: Coupon[];
export declare const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[];
export declare const MEHANDI_EVENTS: string[];
export declare const BLOUSE_SERVICES: string[];
export declare const INDIAN_STATES: string[];
export declare const PATTERNS: { phone: RegExp; pincode: RegExp };

export declare const products: Product[];
export declare const combos: Combo[];

export declare function formatINR(amount: number): string;
export declare function findCoupon(code: string | null | undefined): Coupon | undefined;
export declare function evaluateCoupon(code: string | null | undefined, amount: number): CouponEvaluation;
export declare function wireBagCollections(lines: PricingLine[]): CartTotals['collections'];
export declare function computeTotals(lines: PricingLine[], couponCode?: string | null): CartTotals;
