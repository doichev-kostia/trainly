import { CreateStationBodySchema } from "./create-station-body.schema.js";
import { type z } from "zod";

export const UpdateStationBodySchema = CreateStationBodySchema.omit({
	address: true,
}).partial();

export type UpdateStationBody = z.infer<typeof UpdateStationBodySchema>;
