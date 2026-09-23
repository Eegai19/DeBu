'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BLOUSE_SERVICES, CONTACTS, MEHANDI_EVENTS, PATTERNS } from '@debu/shared';
import { ApiRequestError, ApiUnavailableError, postJson } from '@/lib/api';
import { formatPhone, whatsappLink } from '@/lib/contact';
import { formatDate } from '@/lib/format';
import { useMounted } from '@/hooks/useMounted';
import { Button, ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

type Service = 'blouse-alteration' | 'mehandi';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
    .refine((v) => PATTERNS.phone.test(v), 'Enter a valid 10-digit mobile number'),
  option: z.string().min(1, 'Please choose an option'),
  requirement: z.string().trim().max(500).optional(),
  date: z
    .string()
    .min(1, 'Please pick a date')
    .refine((v) => v >= today(), 'Please pick today or a future date'),
  message: z.string().trim().max(1000).optional(),
});

type Values = z.input<typeof schema>;
type Parsed = z.output<typeof schema>;

export function BookingForm({ service }: { service: Service }) {
  const mehandi = service === 'mehandi';
  const phone = CONTACTS.services.phone;
  const mounted = useMounted();
  const [result, setResult] = useState<{ reference?: string; whatsapp: string; date: string; offline: boolean } | null>(null);
  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values, unknown, Parsed>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', option: '', requirement: '', date: '', message: '' },
  });

  const onSubmit = async (v: Parsed) => {
    setServerError(undefined);
    const requirement = mehandi ? v.option : [v.option, v.requirement].filter(Boolean).join(' — ');
    const whatsappText = mehandi
      ? `Hi DeBu! I'd like to book a mehandi artist.\nName: ${v.name}\nPhone: ${v.phone}\nEvent: ${v.option}\nDate: ${formatDate(v.date)}\n${v.message ? `Message: ${v.message}` : ''}`
      : `Hi DeBu! I'd like to book a blouse alteration.\nName: ${v.name}\nPhone: ${v.phone}\nRequirement: ${requirement}\nPreferred date: ${formatDate(v.date)}\n${v.message ? `Notes: ${v.message}` : ''}`;
    const whatsapp = whatsappLink(phone, whatsappText.trim());

    const payload = mehandi
      ? { service, name: v.name, phone: v.phone, eventType: v.option, eventDate: v.date, message: v.message || undefined }
      : { service, name: v.name, phone: v.phone, requirement, preferredDate: v.date, message: v.message || undefined };

    try {
      const res = await postJson<{ data: { reference: string } }>('/bookings', payload);
      setResult({ reference: res.data.reference, whatsapp, date: v.date, offline: false });
      reset();
    } catch (err) {
      if (err instanceof ApiUnavailableError) {
        setResult({ whatsapp, date: v.date, offline: true });
        return;
      }
      if (err instanceof ApiRequestError) {
        const map: Record<string, keyof Values> = { eventType: 'option', eventDate: 'date', preferredDate: 'date', requirement: 'option' };
        err.details?.forEach((d) => setError(map[d.field] ?? (d.field as keyof Values), { message: d.message }));
        setServerError(err.message);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-gold-300 sm:p-8">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
            <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
              <CheckCircle2 className="mx-auto size-16 text-leaf-500" />
            </motion.div>
            <h3 className="mt-4 text-3xl font-semibold text-maroon-900">{result.offline ? 'Almost done!' : 'Booking request received!'}</h3>
            {result.reference && (
              <p className="mt-2 text-maroon-900/70">
                Reference: <b className="font-accent tracking-wider text-maroon-900">{result.reference}</b>
              </p>
            )}
            <p className="mx-auto mt-3 max-w-sm text-sm text-maroon-900/65">
              {result.offline
                ? 'Tap below to send your booking details to us on WhatsApp — we’ll confirm your slot right away.'
                : `We’ll call you to confirm your slot for ${formatDate(result.date)}. For quick assistance, WhatsApp us.`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href={result.whatsapp} variant="whatsapp">
                <WhatsAppIcon /> {result.offline ? 'Send on WhatsApp' : 'WhatsApp Us'}
              </ButtonLink>
              <Button type="button" variant="outline" onClick={() => setResult(null)}>
                New booking
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gold-sheen text-maroon-900 shadow-glow">
                <CalendarHeart className="size-6" />
              </span>
              <div>
                <h3 className="text-3xl leading-tight font-semibold text-maroon-900">{mehandi ? 'Book Your Mehandi Artist Today' : 'Book an Alteration'}</h3>
                <p className="text-sm text-maroon-900/60">We reply within a few hours · {formatPhone(phone)}</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Name *</span>
                <input className="field-input" autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} {...register('name')} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">Phone Number *</span>
                <input className="field-input" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" aria-invalid={!!errors.phone} {...register('phone')} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">{mehandi ? 'Event Type *' : 'Requirement *'}</span>
                <select className="field-input" aria-invalid={!!errors.option} {...register('option')}>
                  <option value="">{mehandi ? 'Select event type' : 'Select a service'}</option>
                  {(mehandi ? MEHANDI_EVENTS : BLOUSE_SERVICES).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {errors.option && <p className="field-error">{errors.option.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">{mehandi ? 'Event Date *' : 'Preferred Date *'}</span>
                <input className="field-input" type="date" min={mounted ? today() : undefined} aria-invalid={!!errors.date} {...register('date')} />
                {errors.date && <p className="field-error">{errors.date.message}</p>}
              </label>
            </div>
            {!mehandi && (
              <label className="block">
                <span className="field-label">Describe your requirement</span>
                <input className="field-input" placeholder="e.g. Tighten by 1 inch, change to elbow sleeves" {...register('requirement')} />
              </label>
            )}
            <label className="block">
              <span className="field-label">{mehandi ? 'Message' : 'Additional notes'}</span>
              <textarea
                className="field-input min-h-24 resize-y"
                placeholder={mehandi ? 'Number of people, venue, design preferences…' : 'Pickup preference, fabric details…'}
                {...register('message')}
              />
            </label>
            {serverError && <p className="rounded-xl bg-rani-50 px-4 py-2 text-sm text-rani-700">{serverError}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
              {isSubmitting ? 'Sending…' : mehandi ? 'Book Mehandi' : 'Book Alteration'}
            </Button>
            <p className="text-center text-sm text-maroon-900/60">Call or WhatsApp us for quick assistance.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
