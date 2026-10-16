import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email address"),
  quantity: z.coerce.number().int().min(1).max(10),
});

export type BookingInput = z.infer<typeof bookingSchema>;
