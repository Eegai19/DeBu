import { CONTACTS, type ContactLine } from '@debu/shared';

export type ContactKey = keyof typeof CONTACTS;

export const formatPhone = (phone: string) => `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;

export const telLink = (phone: string) => `tel:+91${phone}`;

export function whatsappLink(phone: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/91${phone}${text}`;
}

export function contactFor(key: ContactKey): ContactLine {
  return CONTACTS[key];
}
