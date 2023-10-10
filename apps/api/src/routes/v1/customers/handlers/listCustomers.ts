import { type Handler } from "~/utils/types.js";
import { type DB, db, type customer } from "@trainly/db";
import { type ListResponseSchema } from "@trainly/contracts";
import {
	type CustomerResponseSchema,
	type ListCustomerQuerySchema,
	type ListCustomerQuery,
	type CustomerExpansion,
} from "@trainly/contracts/customers";
import { type Selectable, type SelectQueryBuilder } from "kysely";

type Schema = {
	querystring: typeof ListCustomerQuerySchema;
	response: {
		200: ReturnType<typeof ListResponseSchema<typeof CustomerResponseSchema>>;
	};
};

export const listCustomers: Handler<Schema> = async function listCustomers(request, reply) {
	const { offset, limit, email, expand } = request.query;
	let queryBuilder = db.selectFrom("customer").selectAll().limit(limit).offset(offset);

	if (email) {
		queryBuilder = queryBuilder.where("email", "=", email);
	}

	if (Array.isArray(expand)) {
		queryBuilder = expandQuery(expand, queryBuilder);
	}

	const rows = await queryBuilder.execute();

	return {
		items: rows,
		count: rows.length,
	};
};

function expandQuery(
	expand: CustomerExpansion,
	qb: SelectQueryBuilder<DB, "customer", Selectable<customer>>,
) {
	let queryBuilder = qb;

	if (expand.includes("bookings")) {
		queryBuilder = queryBuilder.innerJoin("booking", "booking.customerId", "customer.id");
	}

	return queryBuilder;
}
