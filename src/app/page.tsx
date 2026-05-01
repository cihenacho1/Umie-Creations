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
      
      {/* 3. Services Section */}
      <ServicesSection />
      
      {/* 4. Gallery Section */}
      <section className="relative w-full overflow-hidden bg-[#FAF7F2] py-20 px-4 md:px-6">
        {/* Soft Fabric Background Texture */}
        <div 
          className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/champagne_fabric_texture.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "multiply",
            filter: "blur(2px)"
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <FeaturedGallery items={items} />
        </div>
      </section>
    </div>
  );
}
