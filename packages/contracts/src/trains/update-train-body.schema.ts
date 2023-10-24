import { CreateTrainBodySchema } from "./create-train-body.schema.js";
import { type z } from "zod";

export const UpdateTrainBodySchema = CreateTrainBodySchema.partial();

export type UpdateTrainBody = z.infer<typeof UpdateTrainBodySchema>;
