import { Schema, model, type InferSchemaType } from 'mongoose';

export const BOOKING_SERVICES = ['blouse-alteration', 'mehandi'] as const;
export const BOOKING_STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const;

const BookingSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    service: { type: String, enum: BOOKING_SERVICES, required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    /** Blouse alteration: the requirement. Mehandi: the event type. */
    requirement: { type: String, trim: true },
    eventType: { type: String, trim: true },
    date: { type: Date, required: true },
    message: { type: String, trim: true, maxlength: 1000 },
    status: { type: String, enum: BOOKING_STATUSES, default: 'new', index: true },
  },
  { timestamps: true, toJSON: { versionKey: false } },
);

BookingSchema.index({ date: 1 });

export type BookingDoc = InferSchemaType<typeof BookingSchema>;
export const BookingModel = model('Booking', BookingSchema);
