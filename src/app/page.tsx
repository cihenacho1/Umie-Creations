import { Navbar } from "@/components/Navbar";
import { RoseScrollHero } from "@/components/RoseScrollHero";
import { ServicesSection } from "@/components/ServicesSection";
import { FeaturedGallery } from "@/components/marketing/FeaturedGallery";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-static";

export default async function HomePage() {
  const items = await prisma.galleryItem.findMany({ take: 7, orderBy: { createdAt: "desc" } });

  return (
    <div className="w-full relative bg-[#FAF7F2] flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <Navbar />
      
      {/* 2. Original RoseScrollHero Animation */}
      <RoseScrollHero />
      
      {/* Lower Page Shared Canvas */}
      <div 
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#DDCAB5] via-[#EFE0CF] to-[#FAF7F2] -mt-32 z-20"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 128px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 128px)',
        }}
      >
        {/* Soft Fabric Background Texture Shared Across All Lower Sections */}
        <div 
          className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/champagne_fabric_texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            backgroundRepeat: "repeat-y",
            mixBlendMode: "multiply",
            filter: "blur(2px)"
          }}
        />

        {/* 3. Services Section */}
        <ServicesSection />
        
        {/* 4. Gallery Section */}
        <section className="relative z-10 w-full py-20 px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <FeaturedGallery items={items} />
          </div>
        </section>
      </div>
    </div>
  );
}
