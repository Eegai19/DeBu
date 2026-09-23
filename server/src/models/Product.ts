import { Schema, model, type InferSchemaType } from 'mongoose';

export const COLOR_KEYS = ['red', 'green', 'blue', 'pink', 'maroon', 'yellow', 'gold'] as const;
export const PRODUCT_CATEGORIES = ['bangles', 'necklaces', 'earrings', 'forehead-pendants', 'wire-bags'] as const;
export const ART_KINDS = ['bangle', 'necklace', 'earring', 'tikka', 'wirebag', 'combo'] as const;

const SizeSchema = new Schema(
  {
    size: { type: String, enum: ['small', 'medium', 'large'], required: true },
    price: { type: Number, required: true, min: 0 },
    dimensions: { type: String, default: '' },
  },
  { _id: false },
);

const ArtSchema = new Schema(
  {
    kind: { type: String, enum: ART_KINDS, required: true },
    variant: { type: Number, default: 0 },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: ['jewellery', 'wire-bag'], required: true, index: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    sizes: {
      type: [SizeSchema],
      default: undefined,
      validate: {
        validator(this: { type?: string }, v?: unknown[]) {
          return this.type !== 'wire-bag' || (Array.isArray(v) && v.length === 3);
        },
        message: 'Wire bags must define Small, Medium and Large sizes',
      },
    },
    description: { type: String, required: true, maxlength: 2000 },
    highlights: { type: [String], default: [] },
    colors: { type: [String], enum: COLOR_KEYS, default: [...COLOR_KEYS] },
    defaultColor: { type: String, enum: COLOR_KEYS, required: true },
    art: { type: ArtSchema, required: true },
    images: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    reviews: { type: Number, min: 0, default: 0 },
    tags: { type: [String], default: [], index: true },
    badge: String,
    featured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    customizationNotes: String,
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret._id;
        delete ret.isActive;
        return ret;
      },
    },
  },
);

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, price: 1 });

export type ProductDoc = InferSchemaType<typeof ProductSchema>;
export const ProductModel = model('Product', ProductSchema);
