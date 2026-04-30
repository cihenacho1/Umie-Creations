import { z } from "zod";
import { PaymentOption } from "@prisma/client";

export const createBookingSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phone: z.string().min(7),
  servicePackageId: z.string().min(1),
  eventDate: z.string().min(1), // ISO date
  eventTime: z.string().min(1),
  address: z.string().min(5),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  inspirationImageUrl: z
    .string()
    .optional()
    .refine((s) => !s || /^https?:\/\/.+/.test(s), "Must be a valid URL"),
  paymentOption: z.nativeEnum(PaymentOption),
});

export type CreateBookingBody = z.infer<typeof createBookingSchema>;

export const checkoutSchema = z.object({
  bookingId: z.string().min(1),
});
