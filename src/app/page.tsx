import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { ServicesSection } from "@/components/ServicesSection";

/** Stay static-only so `/` cannot accidentally opt into dynamic rendering. */
export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      <div className="w-full min-h-[60vh] md:min-h-[35vh] bg-gradient-to-b from-black via-[#070304] to-cream-100" aria-hidden="true" />
      <ServicesSection />
    </div>
  );
}
