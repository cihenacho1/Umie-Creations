import type { ServiceType } from "@prisma/client";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  EVENT_DECOR: "Event decor",
  CHRISTMAS_TREE: "Christmas tree decor",
  BOUQUET_FLOWERS: "Bouquet & flower arrangement",
  CHOCOLATE_TREATS: "Chocolate-covered treats",
};

export const SERVICE_DESCRIPTIONS: Record<ServiceType, string> = {
  EVENT_DECOR:
    "Weddings, birthdays, proposals, showers, and intimate celebrations — styled to feel effortless and unforgettable.",
  CHRISTMAS_TREE:
    "Editorial tree styling and seasonal magic for your home or hospitality space.",
  BOUQUET_FLOWERS:
    "Luxury florals for gifts, milestones, and statement moments.",
  CHOCOLATE_TREATS:
    "Hand-finished chocolate-covered strawberries and curated gift boxes — made to impress.",
};

/** URL/query param keys for deep-linking into booking */
export const SERVICE_QUERY_MAP: Record<string, ServiceType> = {
  event: "EVENT_DECOR",
  christmas: "CHRISTMAS_TREE",
  flowers: "BOUQUET_FLOWERS",
  treats: "CHOCOLATE_TREATS",
};

export const ALL_SERVICE_TYPES: ServiceType[] = [
  "EVENT_DECOR",
  "CHRISTMAS_TREE",
  "BOUQUET_FLOWERS",
  "CHOCOLATE_TREATS",
];

export const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-3500", label: "$1,500 – $3,500" },
  { value: "3500-8000", label: "$3,500 – $8,000" },
  { value: "8000-plus", label: "$8,000+" },
  { value: "flexible", label: "Flexible / discuss" },
] as const;
