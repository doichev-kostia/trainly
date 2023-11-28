import { type CreateCustomerBodySchema, type CustomerResponseSchema } from "@trainly/contracts/customers";
import { type ZodHandler } from "~/utils/types.js";
import { CustomerRepository } from "../customer.repository.js";
import { StatusCodes } from "#constants";

type Schema = {
	body: typeof CreateCustomerBodySchema;
	response: {
		"2xx": typeof CustomerResponseSchema;
	};
};

export const createCustomer: ZodHandler<Schema> = async function createCustomer(request, reply) {
	const alreadyExists = await CustomerRepository.getInstance().checkExists(request.body.email);

	if (alreadyExists) {
		throw this.httpErrors.conflict("Customer already exists");
	}

	const customer = await CustomerRepository.getInstance().create({
		email: request.body.email,
		firstName: request.body.firstName,
		lastName: request.body.lastName,
	});

	if (!customer) {
		request.log.error("Failed to create customer", { email: request.body.email });
		throw this.httpErrors.internalServerError("Failed to create a customer");
	}

	reply.code(StatusCodes.CREATED);

	return customer;
};
