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
      <ServicesSection />
    </div>
  );
}
