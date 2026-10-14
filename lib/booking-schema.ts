import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email address"),
  event: z.string().trim().min(1, "Choose an event"),
  date: z.string().min(1, "Choose a date"),
  tickets: z.coerce.number().int().min(1).max(8),
});

export type BookingInput = z.infer<typeof bookingSchema>;
