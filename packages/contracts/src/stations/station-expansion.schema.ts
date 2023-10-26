import { z } from "zod";

export const StationExpansionSchema = z.enum(["address", "platforms"]);

export type StationExpansion = z.infer<typeof StationExpansionSchema>;
