import type { RequestHandler } from 'express';
import { BookingModel, ContactMessageModel } from '../models/index.js';
import { notifier } from '../services/notification.service.js';
import type { BookingInput } from '../validators/booking.js';
import { generateReference } from '../utils/reference.js';

export const createBooking: RequestHandler = async (_req, res) => {
  const input = res.locals.body as BookingInput;
  const booking = await BookingModel.create(
    input.service === 'mehandi'
      ? {
          reference: generateReference('MEH'),
          service: input.service,
          name: input.name,
          phone: input.phone,
          eventType: input.eventType,
          date: input.eventDate,
          message: input.message,
        }
      : {
          reference: generateReference('BLS'),
          service: input.service,
          name: input.name,
          phone: input.phone,
          requirement: input.requirement,
          date: input.preferredDate,
          message: input.message,
        },
  );
  void notifier.bookingCreated(booking);
  res.status(201).json({
    success: true,
    message: 'Booking request received! We will call you shortly to confirm.',
    data: { reference: booking.reference, service: booking.service, date: booking.date },
  });
};

export const createContactMessage: RequestHandler = async (_req, res) => {
  const message = await ContactMessageModel.create(res.locals.body);
  void notifier.contactReceived(message);
  res.status(201).json({ success: true, message: 'Thank you! We will get back to you soon.' });
};
