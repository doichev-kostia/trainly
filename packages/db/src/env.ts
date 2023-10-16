import { z } from "zod";
import { parseEnv } from "@trainly/utils";

const schema = z.object({
	DB_HOST: z.string().optional(),
	DB_PORT: z.coerce.number().optional(),
	DB_NAME: z.string().optional(),
	DB_USERNAME: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_URL: z.string().optional(),
});

export const env = parseEnv(schema);
