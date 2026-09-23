import { Diya } from '@/components/art/decor';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <Diya size={72} />
      <p className="font-script text-3xl text-maroon-700">Lighting things up…</p>
    </div>
  );
}
