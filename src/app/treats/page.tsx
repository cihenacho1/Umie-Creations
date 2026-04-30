import Image from "next/image";
import Link from "next/link";
import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function TreatsPage() {
  const heroImg = BRAND_EDITORIAL[1]!;
  const galleryImg1 = BRAND_EDITORIAL[0]!;
  const galleryImg2 = BRAND_EDITORIAL[2]!;

  return (
    <div className="w-full bg-cream-50">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-cocoa-900 pt-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image src={heroImg.src} alt="Chocolate treats hero" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070304] via-[#070304]/40 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush-200">Gifting & Indulgence</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-tight drop-shadow-xl">
            A Feast for the Senses
          </h1>
          <p className="mt-6 text-lg md:text-xl text-cream-100/90 font-light max-w-2xl mx-auto drop-shadow-md">
            Hand-finished chocolate-covered strawberries and curated gift presentations—crafted to elevate your most meaningful moments.
          </p>
          <div className="mt-10">
            <Link href="/book?service=CHOCOLATE_TREATS" className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-8 py-3.5 text-sm font-semibold text-[#140608] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,182,193,0.2)] ring-1 ring-white/20">
              Order Custom Treats
            </Link>
          </div>
        </div>
      </section>

      {/* The Umie Standard */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cocoa-700">The Art of Indulgence</h2>
            <p className="mt-6 text-lg text-cocoa-600 leading-relaxed">
              Every strawberry is meticulously hand-selected, dipped in premium artisan chocolate, and finished with delicate details like edible gold leaf, custom drizzles, and soft florals. 
            </p>
            <p className="mt-6 text-lg text-cocoa-600 leading-relaxed">
              Ideal for anniversaries, bridal showers, corporate appreciation, or intimate &quot;thank yous&quot;, our boxes are designed not just to be eaten, but to be experienced.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
             <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <Image src={galleryImg1.src} alt="Detail" fill className="object-cover transition-transform duration-700 hover:scale-105" />
             </div>
             <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card mt-8 sm:mt-12">
                <Image src={galleryImg2.src} alt="Detail" fill className="object-cover transition-transform duration-700 hover:scale-105" />
             </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-cream-100 py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-cocoa-700">Curated Collections</h2>
            <p className="mt-4 text-cocoa-600 text-lg">Available in standard dozen boxes or expansive dessert table displays.</p>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "The Classic", desc: "Premium milk, dark, or white chocolate dips with elegant signature drizzles and light sprinkles.", price: "From $45" },
              { title: "The Signature", desc: "Includes crushed nuts, coconut flakes, marbled chocolate, and delicate piping for a textured finish.", price: "From $65" },
              { title: "The Luxury", desc: "Gold leaf accents, custom color palettes, fondant details, and fresh floral box integrations.", price: "From $95" }
            ].map(tier => (
               <div key={tier.title} className="flex flex-col bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-cream-200 text-center transition-all hover:-translate-y-1 hover:shadow-card">
                 <h3 className="font-serif text-2xl text-cocoa-700">{tier.title}</h3>
                 <p className="mt-4 text-sm leading-relaxed text-cocoa-600 flex-1">{tier.desc}</p>
                 <div className="mt-8 pt-6 border-t border-cream-100">
                    <p className="font-semibold tracking-wide text-blush-500">{tier.price}</p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
         <h2 className="font-serif text-4xl text-cocoa-700">Ready to Gift?</h2>
         <p className="mt-4 text-lg text-cocoa-600 max-w-xl mx-auto">
           Request a customized box through our booking portal. We happily accommodate specific color themes and dietary requests upon consultation.
         </p>
         <Link href="/book?service=CHOCOLATE_TREATS" className="mt-10 inline-block rounded-full bg-cocoa-600 px-10 py-4 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 active:scale-95 hover:bg-cocoa-700">
           Start Your Order
         </Link>
      </section>
    </div>
  );
}
