import { PrismaClient, ServiceType } from "@prisma/client";

const prisma = new PrismaClient();

const packages: {
  serviceType: ServiceType;
  name: string;
  description: string;
  price: number;
  depositPercent: number;
  isCustomQuote: boolean;
}[] = [
  // Event decor
  {
    serviceType: "EVENT_DECOR",
    name: "Basic",
    description: "Essential styling for intimate gatherings — focal table, entrance accent, cohesive palette.",
    price: 850,
    depositPercent: 30,
    isCustomQuote: false,
  },
  {
    serviceType: "EVENT_DECOR",
    name: "Premium",
    description: "Layered decor with custom signage, floral coordination points, and full room atmosphere.",
    price: 1850,
    depositPercent: 35,
    isCustomQuote: false,
  },
  {
    serviceType: "EVENT_DECOR",
    name: "Luxury",
    description: "Full transformation: multiple stations, premium materials, day-of styling lead.",
    price: 4200,
    depositPercent: 40,
    isCustomQuote: false,
  },
  {
    serviceType: "EVENT_DECOR",
    name: "Custom Quote",
    description: "Large venues, corporate events, or fully bespoke concepts — we’ll tailor scope and pricing.",
    price: 0,
    depositPercent: 0,
    isCustomQuote: true,
  },
  // Christmas tree
  {
    serviceType: "CHRISTMAS_TREE",
    name: "Basic",
    description: "Tree styling with coordinated ribbon and ornaments in your chosen palette.",
    price: 275,
    depositPercent: 25,
    isCustomQuote: false,
  },
  {
    serviceType: "CHRISTMAS_TREE",
    name: "Premium",
    description: "Layered depth, specialty picks, tree topper, and subtle lighting accents.",
    price: 550,
    depositPercent: 30,
    isCustomQuote: false,
  },
  {
    serviceType: "CHRISTMAS_TREE",
    name: "Luxury",
    description: "Designer tree with premium florals, bespoke ribbonwork, and full home coordination.",
    price: 1200,
    depositPercent: 35,
    isCustomQuote: false,
  },
  {
    serviceType: "CHRISTMAS_TREE",
    name: "Custom Quote",
    description: "Multiple trees, commercial spaces, or full-home holiday installs.",
    price: 0,
    depositPercent: 0,
    isCustomQuote: true,
  },
  // Bouquet / flowers
  {
    serviceType: "BOUQUET_FLOWERS",
    name: "Basic",
    description: "Seasonal bouquet or centerpiece in a soft, elegant palette.",
    price: 95,
    depositPercent: 50,
    isCustomQuote: false,
  },
  {
    serviceType: "BOUQUET_FLOWERS",
    name: "Premium",
    description: "Larger arrangement with premium blooms and refined composition.",
    price: 185,
    depositPercent: 50,
    isCustomQuote: false,
  },
  {
    serviceType: "BOUQUET_FLOWERS",
    name: "Luxury",
    description: "Statement arrangement or full tablescapes with rare blooms and editorial styling.",
    price: 450,
    depositPercent: 40,
    isCustomQuote: false,
  },
  {
    serviceType: "BOUQUET_FLOWERS",
    name: "Custom Quote",
    description: "Wedding party flowers, full event florals, or recurring corporate deliveries.",
    price: 0,
    depositPercent: 0,
    isCustomQuote: true,
  },
  // Chocolate treats
  {
    serviceType: "CHOCOLATE_TREATS",
    name: "Basic",
    description: "Classic chocolate-covered strawberries box — perfect for gifting.",
    price: 48,
    depositPercent: 100,
    isCustomQuote: false,
  },
  {
    serviceType: "CHOCOLATE_TREATS",
    name: "Premium",
    description: "Larger gift box with assorted dipped treats and ribbon finish.",
    price: 95,
    depositPercent: 100,
    isCustomQuote: false,
  },
  {
    serviceType: "CHOCOLATE_TREATS",
    name: "Luxury",
    description: "Luxury gift presentation, custom flavors, and seasonal embellishments.",
    price: 185,
    depositPercent: 50,
    isCustomQuote: false,
  },
  {
    serviceType: "CHOCOLATE_TREATS",
    name: "Custom Quote",
    description: "Corporate orders, branded boxes, or large event favors — we’ll quote to your needs.",
    price: 0,
    depositPercent: 0,
    isCustomQuote: true,
  },
];

const u = (id: string) =>
  `https://images.unsplash.com/${id}?w=2000&auto=format&fit=max&q=90`;

const galleryItems = [
  {
    title: "Soft blush tablescape",
    category: "event",
    imageUrl: u("photo-1519225421980-715cb0215aed"),
    description: "Candlelit tables and florals in warm blush tones.",
  },
  {
    title: "Holiday crimson floral",
    category: "christmas",
    imageUrl: u("photo-1520763185298-1b434c919102"),
    description: "Festive depth and saturated blooms for seasonal storytelling.",
  },
  {
    title: "Garden of roses tableau",
    category: "flowers",
    imageUrl: u("photo-1520763185298-1b434c919102"),
    description: "Romantic rose study in the Umie palette.",
  },
  {
    title: "Editorial gifting story",
    category: "treats",
    imageUrl: u("photo-1526047932273-341f2a7631f9"),
    description: "Luxury gifting mood — pair with your treat and favor photography.",
  },
  {
    title: "Scarlet studio narrative",
    category: "event",
    imageUrl: u("photo-1526047932273-341f2a7631f9"),
    description: "High-contrast editorial florals against a deep backdrop.",
  },
  {
    title: "Crimson runway bouquet",
    category: "flowers",
    imageUrl: u("photo-1519225421980-715cb0215aed"),
    description: "Tablescape-forward florals for lookbooks and seasonal campaigns.",
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.servicePackage.deleteMany();

  for (const p of packages) {
    await prisma.servicePackage.create({
      data: {
        serviceType: p.serviceType,
        name: p.name,
        description: p.description,
        price: p.price,
        depositPercent: p.depositPercent,
        isCustomQuote: p.isCustomQuote,
        isActive: true,
      },
    });
  }

  for (const g of galleryItems) {
    await prisma.galleryItem.create({ data: g });
  }

  console.log("Seed complete:", packages.length, "packages,", galleryItems.length, "gallery items");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
