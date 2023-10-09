import fp from "fastify-plugin";
import { CreateCustomerBodySchema, CustomerResponseSchema } from "@trainly/contracts/customers";
import { ListResponseSchema } from "@trainly/contracts";
import { db } from "@trainly/db";
import { type FastifyBaseLogger, type FastifyInstance, type RawServerDefault } from "fastify";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { type FastifyPluginAsyncZod } from "~/utils/types.js";

const customerRoutes: FastifyPluginAsyncZod = fp(
	async function customerRoutes(
		fastify: FastifyInstance<
			RawServerDefault,
			IncomingMessage,
			ServerResponse<IncomingMessage>,
			FastifyBaseLogger,
			ZodTypeProvider
		>,
	): Promise<void> {
		fastify.addHook("onRequest", fastify.verifyAuthToken);

		fastify.post(
			"/",
			{
				schema: {
					body: CreateCustomerBodySchema,
					response: {
						200: CustomerResponseSchema,
					},
				},
			},
			async function createCustomer(request, reply) {
				const customer = await db
					.insertInto("customer")
					.values({
						firstName: request.body.firstName,
						lastName: request.body.lastName,
						email: request.body.email,
						updatedAt: new Date(),
					})
					.returningAll()
					.executeTakeFirst();

				if (!customer) {
					request.log.error("Failed to create customer", { email: request.body.email });
					throw fastify.httpErrors.internalServerError();
				}

				reply.code(fastify.httpStatus.CREATED);

				return customer;
			},
		);

		fastify.get(
			"/",
			{
				schema: {
					response: {
						200: ListResponseSchema(CustomerResponseSchema),
					},
				},
			},
			async function listCustomers(request, reply) {
				const rows = await db.selectFrom("customer").selectAll().execute();

				return {
					items: rows,
					count: rows.length,
				};
			},
		);
	},
	{
		encapsulate: true,
		dependencies: ["authentication-plugin"],
	},
);

export default customerRoutes;
