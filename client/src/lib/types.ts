import type { BagSize, ColorKey, Combo, Product } from '@debu/shared';

export type Sellable = Product | Combo;

export interface CartItem {
  /** Unique per product + options combination. */
  key: string;
  kind: 'product' | 'combo';
  productId: string;
  slug: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  color: ColorKey;
  customColor?: string;
  size?: BagSize;
  notes?: string;
  art: Product['art'];
  image?: string;
  defaultColor: Product['defaultColor'];
}

export type NewCartItem = Omit<CartItem, 'key' | 'quantity'> & { quantity?: number };

export interface PlacedOrder {
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    email?: string;
  };
  items: {
    name: string;
    size?: BagSize;
    color: string;
    customColor?: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  pricing: {
    subtotal: number;
    collectionDiscount: number;
    couponCode?: string;
    couponDiscount: number;
    shipping: number;
    gst: number;
    total: number;
  };
  paymentMethod: 'cod' | 'upi' | 'online';
  /** True when the API was unreachable and the order was captured locally. */
  offline?: boolean;
}
