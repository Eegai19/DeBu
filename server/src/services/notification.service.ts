import { CONTACTS } from '@debu/shared';

/**
 * Hook point for business notifications. Wire this up to WhatsApp Business
 * API, SMS (e.g. MSG91 / Twilio) or email (e.g. Resend / SES) in production.
 */
export const notifier = {
  async orderPlaced(order: { orderNumber: string; customer: { name: string; phone: string }; pricing: { total: number } }) {
    console.info(
      `🛍️  New order ${order.orderNumber} from ${order.customer.name} (${order.customer.phone}) — ₹${order.pricing.total}. ` +
        `Notify ${CONTACTS.products.phone}.`,
    );
  },

  async bookingCreated(booking: { reference: string; service: string; name: string; phone: string }) {
    console.info(
      `📅 New ${booking.service} booking ${booking.reference} from ${booking.name} (${booking.phone}). ` +
        `Notify ${CONTACTS.services.phone}.`,
    );
  },

  async contactReceived(message: { name: string; phone: string; topic: string }) {
    console.info(`✉️  New ${message.topic} enquiry from ${message.name} (${message.phone}).`);
  },
};
