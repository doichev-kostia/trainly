import { z } from "zod";

export const CustomerExpansionSchema = z.enum(["bookings"]);

export type CustomerExpansion = z.infer<typeof CustomerExpansionSchema>;
