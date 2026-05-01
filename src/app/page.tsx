import { Navbar } from "@/components/Navbar";
import { RoseScrollHero } from "@/components/RoseScrollHero";
import { ServicesSection } from "@/components/ServicesSection";
import { FeaturedGallery } from "@/components/marketing/FeaturedGallery";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export default async function HomePage() {
  const items = await prisma.galleryItem.findMany({ take: 7, orderBy: { createdAt: "desc" } });

  return (
    <div className="w-full relative bg-[#070304] flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <Navbar />
      
      {/* 2. Original RoseScrollHero Animation */}
      <RoseScrollHero />
      
      {/* 3. Services Section */}
      <ServicesSection />
      
      {/* 4. Gallery Section */}
      <section className="w-full bg-cream-100 py-20 px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <FeaturedGallery items={items} />
        </div>
      </section>
    </div>
  );
}
