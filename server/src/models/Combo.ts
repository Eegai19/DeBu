import { Schema, model, type InferSchemaType } from 'mongoose';
import { COLOR_KEYS } from './Product.js';

const ComboItemSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const ComboSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    itemSlugs: { type: [String], required: true },
    items: { type: [ComboItemSchema], required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    savings: { type: Number, required: true, min: 0 },
    colors: { type: [String], enum: COLOR_KEYS, default: [...COLOR_KEYS] },
    defaultColor: { type: String, enum: COLOR_KEYS, required: true },
    art: {
      kind: { type: String, default: 'combo' },
      variant: { type: Number, default: 0 },
    },
    images: { type: [String], default: [] },
    badge: String,
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.isActive;
        ret.type = 'combo';
        ret.category = 'combos';
        return ret;
      },
    },
  },
);

export type ComboDoc = InferSchemaType<typeof ComboSchema>;
export const ComboModel = model('Combo', ComboSchema);
