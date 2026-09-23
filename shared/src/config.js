// Store-wide configuration shared by the storefront and the API.
// Change values here and both sides pick them up.

export const BRAND = {
  name: 'DeBu',
  tagline: 'Handcrafted Elegance for Every Celebration',
  email: 'hello@debu.in',
  city: 'Chennai, Tamil Nadu',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  youtube: 'https://youtube.com/',
};

/** Two contact lines: one for products, one for services. */
export const CONTACTS = {
  products: {
    key: 'products',
    label: 'Silk Thread Jewellery & Wire Bags',
    phone: '8344688688',
  },
  services: {
    key: 'services',
    label: 'Blouse Alteration & Mehandi',
    phone: '9786488488',
  },
};

export const CURRENCY = { code: 'INR', symbol: '₹', locale: 'en-IN' };

/** Preset silk-thread colours. `custom` lets the customer type any colour. */
export const COLORS = {
  red: { label: 'Red', hex: '#c8102e', shade: '#8e0b20' },
  green: { label: 'Green', hex: '#1f8a4c', shade: '#11552d' },
  blue: { label: 'Blue', hex: '#1f4fb8', shade: '#122f73' },
  pink: { label: 'Pink', hex: '#e84a8a', shade: '#a82a5f' },
  maroon: { label: 'Maroon', hex: '#7a1030', shade: '#4a0719' },
  yellow: { label: 'Yellow', hex: '#f5c518', shade: '#b98f06' },
  gold: { label: 'Gold', hex: '#d4a017', shade: '#8a6508' },
  custom: { label: 'Custom Color Request', hex: '#ffffff', shade: '#999999' },
};

export const PRESET_COLORS = ['red', 'green', 'blue', 'pink', 'maroon', 'yellow', 'gold'];

export const JEWELLERY_CATEGORIES = [
  { slug: 'bangles', name: 'Bangles', blurb: 'Silk-wrapped bangles studded with kundan and zari.' },
  { slug: 'necklaces', name: 'Necklaces', blurb: 'Statement necklaces for brides, haldi and sangeet.' },
  { slug: 'earrings', name: 'Earrings', blurb: 'Jhumkas, chandbalis and studs in every hue.' },
  { slug: 'forehead-pendants', name: 'Forehead Pendants', blurb: 'Maang tikkas that crown every celebration.' },
];

export const BAG_SIZES = [
  { size: 'small', label: 'Small' },
  { size: 'medium', label: 'Medium' },
  { size: 'large', label: 'Large' },
];

/** "Complete Collection" — buy Small + Medium + Large of the same bag. */
export const WIRE_BAG_COLLECTION = {
  discount: 75,
  label: 'Complete Collection Combo',
  message: 'Get ₹75 OFF when purchasing all three sizes',
};

export const GST = {
  enabled: true,
  rate: 0.03,
  label: 'GST (3%)',
};

export const SHIPPING = {
  flatRate: 80,
  freeAbove: 1499,
};

export const COUPONS = [
  {
    code: 'DEBU10',
    type: 'percent',
    value: 10,
    minOrder: 500,
    maxDiscount: 300,
    description: '10% off on orders above ₹500 (up to ₹300)',
  },
  {
    code: 'FESTIVE150',
    type: 'flat',
    value: 150,
    minOrder: 1500,
    description: '₹150 off on orders above ₹1,500',
  },
  {
    code: 'WELCOME50',
    type: 'flat',
    value: 50,
    minOrder: 299,
    description: '₹50 off on your first order above ₹299',
  },
];

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay in cash when your order arrives.' },
  { id: 'upi', label: 'UPI', description: 'GPay, PhonePe, Paytm or any UPI app.' },
  { id: 'online', label: 'Online Payment', description: 'Cards, net banking & wallets.' },
];

export const MEHANDI_EVENTS = [
  'Bridal Mehandi',
  'Engagement Mehandi',
  'Festival Mehandi',
  'Family Function',
  'Wedding Event',
  'Other',
];

export const BLOUSE_SERVICES = [
  'Blouse Alteration',
  'Fitting Correction',
  'Sleeve Modification',
  'Neck Design Alteration',
  'Bridal Blouse Adjustments',
  'Other',
];

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export const PATTERNS = {
  phone: /^[6-9]\d{9}$/,
  pincode: /^[1-9]\d{5}$/,
};
