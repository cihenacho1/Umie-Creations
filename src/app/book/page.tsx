import Image from "next/image";
import { ServiceType } from "@prisma/client";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getMarketingHeroImage } from "@/lib/brand-images";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const sp = await searchParams;
  const raw = sp.service;
  const initialServiceType =
    raw && (Object.values(ServiceType) as string[]).includes(raw)
      ? (raw as ServiceType)
      : undefined;

  const hero = getMarketingHeroImage();

  return (
    <div id="book" className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="relative mx-auto mb-10 h-44 max-w-2xl overflow-hidden rounded-2xl bg-cream-200 shadow-card md:h-52">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          className="object-cover object-[center_35%]"
          sizes="(max-width: 768px) 100vw, 42rem"
          priority
        />
      </div>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-blush-500">
        Booking
      </p>
      <h1 className="mt-2 text-center font-serif text-4xl font-semibold text-cocoa-700">
        Reserve your date
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-cocoa-600">
        Five quick steps — then secure checkout with Stripe for deposits or
        full payments. Custom quotes submit as inquiries without charge.
      </p>
      <div className="mt-10">
        <BookingWizard initialServiceType={initialServiceType ?? null} />
      </div>
    </div>
  );
}
