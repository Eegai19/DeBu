import { Schema, model, type InferSchemaType } from 'mongoose';

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    topic: {
      type: String,
      enum: ['silk-thread-jewellery', 'wire-bags', 'blouse-alteration', 'mehandi', 'general'],
      default: 'general',
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ['new', 'replied', 'closed'], default: 'new', index: true },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

export type ContactMessageDoc = InferSchemaType<typeof ContactMessageSchema>;
export const ContactMessageModel = model('ContactMessage', ContactMessageSchema);
