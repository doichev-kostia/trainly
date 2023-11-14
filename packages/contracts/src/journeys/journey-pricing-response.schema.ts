import { z } from "zod";
import { seatClassSchema } from "../seats/enums.js";

export const JourneyPricingResponseSchema = z.record(seatClassSchema, z.number());

export type JourneyPricingResponse = z.infer<typeof JourneyPricingResponseSchema>;
