import type { ArtSpec, PresetColorKey } from '@debu/shared';
import type { MehandiStyle, Neckline } from '@/components/art/services';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/silk-thread-jewellery', label: 'Silk Thread Jewellery' },
  { href: '/wire-bags', label: 'Wire Bags' },
  { href: '/blouse-alteration', label: 'Blouse Alteration' },
  { href: '/mehandi', label: 'Mehandi' },
  { href: '/contact', label: 'Contact Us' },
] as const;

export type Visual =
  | { type: 'product'; art: ArtSpec; color: PresetColorKey; view?: 0 | 1 | 2 | 3 }
  | { type: 'mehandi'; style: MehandiStyle }
  | { type: 'blouse'; color: string; neckline: Neckline; embellished?: boolean; fitted?: boolean };

export interface CategoryCard {
  title: string;
  subtitle: string;
  href: string;
  visual: Visual;
  accent: string;
}

export const FEATURED_CATEGORIES: CategoryCard[] = [
  {
    title: 'Bangles',
    subtitle: 'Kundan, pearl & bridal chuda',
    href: '/silk-thread-jewellery/bangles',
    visual: { type: 'product', art: { kind: 'bangle', variant: 0 }, color: 'maroon' },
    accent: 'from-maroon-700/90',
  },
  {
    title: 'Necklaces',
    subtitle: 'Haars, chokers & temple sets',
    href: '/silk-thread-jewellery/necklaces',
    visual: { type: 'product', art: { kind: 'necklace', variant: 0 }, color: 'pink' },
    accent: 'from-rani-700/90',
  },
  {
    title: 'Earrings',
    subtitle: 'Jhumkas & chandbalis',
    href: '/silk-thread-jewellery/earrings',
    visual: { type: 'product', art: { kind: 'earring', variant: 0 }, color: 'green' },
    accent: 'from-leaf-600/90',
  },
  {
    title: 'Forehead Pendants',
    subtitle: 'Maang tikkas & passas',
    href: '/silk-thread-jewellery/forehead-pendants',
    visual: { type: 'product', art: { kind: 'tikka', variant: 0 }, color: 'red' },
    accent: 'from-maroon-800/90',
  },
  {
    title: 'Wire Bags',
    subtitle: 'Custom colours in 3 sizes',
    href: '/wire-bags',
    visual: { type: 'product', art: { kind: 'wirebag', variant: 1 }, color: 'blue' },
    accent: 'from-[#122f73]/90',
  },
  {
    title: 'Blouse Alteration',
    subtitle: 'Perfect fit, every time',
    href: '/blouse-alteration',
    visual: { type: 'blouse', color: '#d42a67', neckline: 'sweetheart' },
    accent: 'from-rani-800/90',
  },
  {
    title: 'Mehandi',
    subtitle: 'Bridal & festive artistry',
    href: '/mehandi',
    visual: { type: 'mehandi', style: 'bridal' },
    accent: 'from-henna-700/90',
  },
];

export const WHY_CHOOSE_US = [
  { icon: 'hand', title: 'Handmade Products', text: 'Every bead is wound and every bag is woven by hand — no two pieces are exactly alike.' },
  { icon: 'palette', title: 'Fully Customizable Designs', text: 'Match any saree, lehenga or theme. Tell us the colour and we will create it for you.' },
  { icon: 'indian-rupee', title: 'Affordable Pricing', text: 'Grand, festive looks at honest home-business prices, with combo savings on top.' },
  { icon: 'heart', title: 'Made with Love', text: 'Crafted with the same care we put into jewellery for our own family celebrations.' },
  { icon: 'home', title: 'Home Business Support', text: 'Every order directly supports a woman-led home business and local artisans.' },
  { icon: 'gift', title: 'Personalized Orders', text: 'Bulk return gifts, name initials, bridal sets — personal touches are our speciality.' },
] as const;

export const STATS = [
  { value: 2500, suffix: '+', label: 'Happy customers' },
  { value: 450, suffix: '+', label: 'Brides adorned' },
  { value: 60, suffix: '+', label: 'Colour shades' },
  { value: 4.9, suffix: '★', label: 'Average rating', decimals: 1 },
];

export const TESTIMONIALS = [
  {
    name: 'Priya Raghavan',
    city: 'Chennai',
    role: 'Bride',
    quote:
      'My bridal combo matched my Kanjeevaram saree perfectly. The jhumkas got so many compliments — and they were so light I wore them all night!',
    rating: 5,
  },
  {
    name: 'Ananya Sharma',
    city: 'Bengaluru',
    role: 'Mehandi booking',
    quote:
      'The bridal mehandi was intricate, dark and done on time for all 20 guests. Such a warm and professional artist.',
    rating: 5,
  },
  {
    name: 'Lakshmi Narayanan',
    city: 'Coimbatore',
    role: 'Return gifts',
    quote:
      'Ordered 60 wire bags as return gifts for my daughter’s housewarming. Beautiful colours and delivered before the function!',
    rating: 5,
  },
  {
    name: 'Meera Iyer',
    city: 'Madurai',
    role: 'Blouse alteration',
    quote:
      'My old silk blouse fits like new. They redid the sleeves and neckline beautifully in just two days.',
    rating: 5,
  },
  {
    name: 'Fathima Begum',
    city: 'Trichy',
    role: 'Haldi set',
    quote:
      'The haldi combo in bright yellow was stunning in photos. Great quality for the price and lovely packaging.',
    rating: 5,
  },
];

export const MARQUEE_WORDS = ['Weddings', 'Haldi', 'Mehandi', 'Sangeet', 'Engagement', 'Diwali', 'Pongal', 'Navratri', 'Baby Shower', 'Housewarming'];

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  visual: Visual;
  tall?: boolean;
}

export const GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Rani Haar in Maroon', caption: 'Bridal necklace', visual: { type: 'product', art: { kind: 'necklace', variant: 0 }, color: 'maroon', view: 2 }, tall: true },
  { id: 'g2', title: 'Bridal Mehandi', caption: 'Full-hand bridal design', visual: { type: 'mehandi', style: 'bridal' } },
  { id: 'g3', title: 'Haldi Bangle Stack', caption: 'Mirror-work bangles', visual: { type: 'product', art: { kind: 'bangle', variant: 1 }, color: 'yellow', view: 3 } },
  { id: 'g4', title: 'Grand Jhumkas', caption: 'Silk thread jhumkas', visual: { type: 'product', art: { kind: 'earring', variant: 0 }, color: 'green', view: 2 }, tall: true },
  { id: 'g5', title: 'Bridal Blouse', caption: 'Zari-finished alteration', visual: { type: 'blouse', color: '#7a1030', neckline: 'sweetheart' } },
  { id: 'g6', title: 'Diamond Weave Tote', caption: 'Custom wire bag', visual: { type: 'product', art: { kind: 'wirebag', variant: 1 }, color: 'pink', view: 3 } },
  { id: 'g7', title: 'Arabic Mehandi', caption: 'Engagement design', visual: { type: 'mehandi', style: 'arabic' }, tall: true },
  { id: 'g8', title: 'Kundan Maang Tikka', caption: 'Forehead pendant', visual: { type: 'product', art: { kind: 'tikka', variant: 0 }, color: 'blue', view: 0 } },
  { id: 'g9', title: 'Bridal Combo', caption: 'Complete bridal set', visual: { type: 'product', art: { kind: 'combo', variant: 0 }, color: 'red', view: 0 } },
  { id: 'g10', title: 'Festival Mehandi', caption: 'Diwali special', visual: { type: 'mehandi', style: 'festival' } },
  { id: 'g11', title: 'Chandbalis', caption: 'Festive earrings', visual: { type: 'product', art: { kind: 'earring', variant: 1 }, color: 'pink', view: 3 }, tall: true },
  { id: 'g12', title: 'Return Gift Bags', caption: 'Bulk order', visual: { type: 'product', art: { kind: 'wirebag', variant: 2 }, color: 'yellow', view: 0 } },
];

export const BLOUSE_SERVICE_DETAILS = [
  {
    title: 'Blouse Alteration',
    text: 'Loosen, tighten or resize any readymade or tailored blouse for a flattering, comfortable fit.',
    price: 'From ₹150',
    neckline: 'round' as Neckline,
    color: '#d42a67',
  },
  {
    title: 'Fitting Correction',
    text: 'Fix gaping necklines, riding-up backs and pulling seams with precise measurement-led corrections.',
    price: 'From ₹200',
    neckline: 'square' as Neckline,
    color: '#1f8a4c',
  },
  {
    title: 'Sleeve Modification',
    text: 'Convert to elbow, puff, cap or sleeveless styles, or add sheer and designer sleeves.',
    price: 'From ₹250',
    neckline: 'boat' as Neckline,
    color: '#1f4fb8',
  },
  {
    title: 'Neck Design Alteration',
    text: 'Reshape to sweetheart, boat, V or deep back designs with piping, latkans and lace finishes.',
    price: 'From ₹300',
    neckline: 'v' as Neckline,
    color: '#e06a0b',
  },
  {
    title: 'Bridal Blouse Adjustments',
    text: 'Delicate handling of heavy zardosi and aari-work bridal blouses — fitted perfectly for your big day.',
    price: 'From ₹500',
    neckline: 'sweetheart' as Neckline,
    color: '#7a1030',
  },
];

export const BLOUSE_STEPS = [
  { title: 'Book or call', text: 'Share your requirement by form, call or WhatsApp.' },
  { title: 'Measure & discuss', text: 'We take measurements and discuss the changes with you.' },
  { title: 'Careful alteration', text: 'Expert hands work on your blouse — even heavy bridal pieces.' },
  { title: 'Trial & delivery', text: 'Try it on, request tweaks, and take home a perfect fit.' },
];

export const MEHANDI_SERVICES: { title: string; text: string; price: string; style: MehandiStyle; duration: string }[] = [
  { title: 'Bridal Mehandi', text: 'Full hands and feet with intricate storytelling motifs, names and portraits.', price: 'From ₹3,500', style: 'bridal', duration: '4–6 hrs' },
  { title: 'Engagement Mehandi', text: 'Elegant Arabic and Indo-Arabic designs that photograph beautifully.', price: 'From ₹1,500', style: 'arabic', duration: '2–3 hrs' },
  { title: 'Festival Mehandi', text: 'Quick, pretty designs for Karva Chauth, Teej, Eid, Diwali and more.', price: 'From ₹300', style: 'festival', duration: '20–40 min' },
  { title: 'Family Functions', text: 'Group bookings for sangeets, baby showers and family get-togethers.', price: 'From ₹250 / person', style: 'minimal', duration: 'Flexible' },
  { title: 'Wedding Events', text: 'A team of artists for the bride, family and guests on the mehandi night.', price: 'Custom package', style: 'bridal', duration: 'Full event' },
];

export const FAQS = [
  { q: 'Can I get jewellery in a colour not listed?', a: 'Absolutely. Choose "Custom Color Request" and describe the shade — or send a photo of your saree on WhatsApp and we will match it.' },
  { q: 'How long does a custom order take?', a: 'Most ready designs ship in 2–3 days. Custom colours and bridal sets take 3–7 days. Bulk orders are scheduled on request.' },
  { q: 'Do you deliver across India?', a: 'Yes, we ship pan-India. Orders above ₹1,499 ship free.' },
  { q: 'Is the mehandi natural?', a: 'We use freshly prepared, chemical-free natural henna for a deep, long-lasting stain.' },
];
