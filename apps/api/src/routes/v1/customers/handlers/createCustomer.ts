import { db } from "@trainly/db";
import {
	type CreateCustomerBodySchema,
	type CustomerResponseSchema,
} from "@trainly/contracts/customers";
import { type Handler } from "~/utils/types.js";

type Schema = {
	body: typeof CreateCustomerBodySchema;
	response: {
		200: typeof CustomerResponseSchema;
	};
};

export const createCustomer: Handler<Schema> = async function createCustomer(request, reply) {
	const existingCustomer = await db
		.selectFrom("customer")
		.select("id")
		.where("email", "=", request.body.email)
		.executeTakeFirst();

	if (existingCustomer) {
		throw this.httpErrors.conflict("Customer already exists");
	}

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
		throw this.httpErrors.internalServerError("Failed to create a customer");
	}

	reply.code(this.httpStatus.CREATED);

	return customer;
};
