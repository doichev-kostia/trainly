import { z } from "zod";

export const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	API_KEY: z.string(),
	ADMIN_API_KEY: z.string(),
	STRIPE_API_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	PORT: z.string().default("8080"),
});

export type Env = z.infer<typeof EnvSchema>;
