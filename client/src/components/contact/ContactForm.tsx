'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CONTACTS, PATTERNS } from '@debu/shared';
import { ApiRequestError, ApiUnavailableError, postJson } from '@/lib/api';
import { whatsappLink } from '@/lib/contact';
import { Button, ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

const TOPICS = [
  { id: 'silk-thread-jewellery', label: 'Silk Thread Jewellery', line: 'products' },
  { id: 'wire-bags', label: 'Wire Bags', line: 'products' },
  { id: 'blouse-alteration', label: 'Blouse Alteration', line: 'services' },
  { id: 'mehandi', label: 'Mehandi', line: 'services' },
  { id: 'general', label: 'Something else', line: 'products' },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, '').replace(/^(\+91|0)/, ''))
    .refine((v) => PATTERNS.phone.test(v), 'Enter a valid 10-digit mobile number'),
  email: z.union([z.literal(''), z.email('Enter a valid email')]),
  topic: z.enum(TOPICS.map((t) => t.id) as [string, ...string[]]),
  message: z.string().trim().min(5, 'Please write a short message').max(2000),
});
type Values = z.input<typeof schema>;
type Parsed = z.output<typeof schema>;

export function ContactForm() {
  const [done, setDone] = useState<{ offline: boolean; whatsapp: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values, unknown, Parsed>({ resolver: zodResolver(schema), defaultValues: { name: '', phone: '', email: '', topic: 'silk-thread-jewellery', message: '' } });

  const onSubmit = async (v: Parsed) => {
    const topic = TOPICS.find((t) => t.id === v.topic)!;
    const whatsapp = whatsappLink(CONTACTS[topic.line].phone, `Hi DeBu! (${topic.label})\n${v.message}\n— ${v.name}, ${v.phone}`);
    try {
      await postJson('/contact', { ...v, email: v.email || undefined });
      setDone({ offline: false, whatsapp });
      reset();
    } catch (err) {
      if (err instanceof ApiUnavailableError) return setDone({ offline: true, whatsapp });
      if (err instanceof ApiRequestError) err.details?.forEach((d) => setError(d.field as keyof Values, { message: d.message }));
    }
  };

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-card ring-1 ring-gold-300 sm:p-8">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <CheckCircle2 className="mx-auto size-16 text-leaf-500" />
            <h3 className="mt-4 text-3xl font-semibold text-maroon-900">{done.offline ? 'One last step!' : 'Message sent!'}</h3>
            <p className="mx-auto mt-2 max-w-sm text-maroon-900/65">
              {done.offline ? 'Send your message to us on WhatsApp and we’ll reply right away.' : 'Thank you! We’ll get back to you very soon.'}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <ButtonLink href={done.whatsapp} variant="whatsapp">
                <WhatsAppIcon /> {done.offline ? 'Send on WhatsApp' : 'Chat on WhatsApp'}
              </ButtonLink>
              <Button type="button" variant="outline" onClick={() => setDone(null)}>
                New message
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <h2 className="text-3xl font-semibold text-maroon-900">Send us a message</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Name *</span>
                <input className="field-input" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">Phone *</span>
                <input className="field-input" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register('phone')} />
                {errors.phone && <p className="field-error">{errors.phone.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">Email</span>
                <input className="field-input" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </label>
              <label className="block">
                <span className="field-label">Topic</span>
                <select className="field-input" {...register('topic')}>
                  {TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="field-label">Message *</span>
              <textarea className="field-input min-h-32 resize-y" aria-invalid={!!errors.message} {...register('message')} />
              {errors.message && <p className="field-error">{errors.message.message}</p>}
            </label>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />} Send Message
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
