import { Phone } from 'lucide-react';
import { CONTACTS } from '@debu/shared';
import { cn } from '@/lib/utils';
import { formatPhone, telLink, whatsappLink, type ContactKey } from '@/lib/contact';
import { ButtonLink } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

/** "Call Now" + "WhatsApp Now" pair for the products or services line. */
export function ContactButtons({
  line,
  message,
  size = 'md',
  tone = 'light',
  showNumber = false,
  className,
}: {
  line: ContactKey;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
  showNumber?: boolean;
  className?: string;
}) {
  const { phone } = CONTACTS[line];
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <ButtonLink href={telLink(phone)} size={size} variant={tone === 'dark' ? 'light' : 'maroon'} aria-label={`Call ${formatPhone(phone)}`}>
        <Phone className="size-4" />
        {showNumber ? formatPhone(phone) : 'Call Now'}
      </ButtonLink>
      <ButtonLink href={whatsappLink(phone, message ?? 'Hi DeBu! I would like to know more.')} size={size} variant="whatsapp">
        <WhatsAppIcon className="size-5" />
        WhatsApp Now
      </ButtonLink>
    </div>
  );
}
