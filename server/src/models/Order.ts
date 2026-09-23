import { Schema, model, type InferSchemaType } from 'mongoose';

export const ORDER_STATUSES = ['placed', 'confirmed', 'in-making', 'shipped', 'delivered', 'cancelled'] as const;
export const PAYMENT_STATUSES = ['pending', 'awaiting-verification', 'paid', 'failed', 'refunded'] as const;

const OrderItemSchema = new Schema(
  {
    kind: { type: String, enum: ['product', 'combo'], required: true },
    productId: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: String, enum: ['small', 'medium', 'large'] },
    color: { type: String, required: true },
    customColor: { type: String, maxlength: 80 },
    notes: { type: String, maxlength: 500 },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      email: { type: String, trim: true, lowercase: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },
    items: { type: [OrderItemSchema], required: true },
    pricing: {
      subtotal: { type: Number, required: true },
      collectionDiscount: { type: Number, default: 0 },
      couponCode: String,
      couponDiscount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      gst: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentMethod: { type: String, enum: ['cod', 'upi', 'online'], required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'pending' },
    status: { type: String, enum: ORDER_STATUSES, default: 'placed', index: true },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

OrderSchema.index({ createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof OrderSchema>;
export const OrderModel = model('Order', OrderSchema);
