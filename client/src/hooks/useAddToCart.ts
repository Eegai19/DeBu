'use client';

import { useState } from 'react';
import type { BagSize, ColorKey, Combo, Product } from '@debu/shared';
import { useCart } from '@/store/cart';
import { useUi } from '@/store/ui';
import { colorLabel, sizeLabel } from '@/lib/format';

/** Option state (colour, custom colour, size, quantity, notes) + add-to-cart for one product or combo. */
export function useProductOptions(item: Product | Combo) {
  const isCombo = item.type === 'combo';
  const sizes = !isCombo ? (item as Product).sizes : undefined;
  const [color, setColor] = useState<ColorKey>(item.defaultColor);
  const [customColor, setCustomColor] = useState('');
  const [size, setSize] = useState<BagSize>(sizes?.[0]?.size ?? 'small');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string>();
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const toast = useUi((s) => s.toast);

  const unitPrice = sizes ? (sizes.find((s) => s.size === size)?.price ?? item.price) : item.price;

  const changeColor = (c: ColorKey) => {
    setColor(c);
    setError(undefined);
  };
  const changeCustom = (v: string) => {
    setCustomColor(v);
    if (v.trim().length > 1) setError(undefined);
  };

  const addToCart = () => {
    if (color === 'custom' && customColor.trim().length < 2) {
      setError('Please describe the colour you would like.');
      return false;
    }
    add({
      kind: isCombo ? 'combo' : 'product',
      productId: item.id,
      slug: item.slug,
      name: item.name,
      category: item.category,
      unitPrice,
      quantity,
      color,
      customColor: color === 'custom' ? customColor.trim() : undefined,
      size: sizes ? size : undefined,
      notes: notes.trim() || undefined,
      art: item.art,
      image: item.images?.[0],
      defaultColor: item.defaultColor,
    });
    toast({
      title: `${item.name} added to cart`,
      description: [sizes && sizeLabel(size), colorLabel(color, customColor), `Qty ${quantity}`].filter(Boolean).join(' · '),
      action: { label: 'View cart', href: '/cart' },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    return true;
  };

  return {
    color,
    setColor: changeColor,
    customColor,
    setCustomColor: changeCustom,
    size,
    setSize,
    sizes,
    quantity,
    setQuantity,
    notes,
    setNotes,
    unitPrice,
    error,
    added,
    addToCart,
  };
}
