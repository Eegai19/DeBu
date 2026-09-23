import { COLORS, JEWELLERY_CATEGORIES, type ColorKey } from '@debu/shared';

export { formatINR } from '@debu/shared';

export function colorLabel(color: ColorKey | string, customColor?: string) {
  if (color === 'custom') return customColor ? `Custom: ${customColor}` : 'Custom colour';
  return COLORS[color as ColorKey]?.label ?? color;
}

export function categoryName(slug: string) {
  if (slug === 'wire-bags') return 'Wire Bags';
  if (slug === 'combos') return 'Combos';
  return JEWELLERY_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function sizeLabel(size?: string) {
  return size ? size.charAt(0).toUpperCase() + size.slice(1) : '';
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
