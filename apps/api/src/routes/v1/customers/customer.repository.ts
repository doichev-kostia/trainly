import { db, eq, ilike, type InferInsertModel, sql } from "@trainly/db";
import { type Customer, customers, type CustomersTable } from "@trainly/db/schema/customers";
import assert from "node:assert";
import { stripValues } from "~/utils/db.js";
import { type CustomerExpansion, type ListCustomerQuery } from "@trainly/contracts/customers";
import { type Booking, bookings } from "@trainly/db/schema/bookings";
import { type ListResponse } from "@trainly/contracts";

type CreateCustomerValues = Omit<
	InferInsertModel<CustomersTable>,
	"id" | "createdAt" | "updatedAt"
>;

type RetrievedCustomer = Customer & {
	bookings?: Booking[];
};

export class CustomerRepository {
	private static instance: CustomerRepository | undefined;

	public static getInstance() {
		if (!CustomerRepository.instance) {
			CustomerRepository.instance = new CustomerRepository();
		}

		return CustomerRepository.instance;
	}

	public async checkExists(email: string): Promise<boolean> {
		const rows = await db
			.select({
				id: customers.id,
			})
			.from(customers)
			.where(eq(customers.email, email))
			.limit(1);

		return rows.length > 0;
	}

	public async createCustomer(values: CreateCustomerValues): Promise<Customer> {
		const data = {
			...values,
			updatedAt: new Date(),
		} satisfies InferInsertModel<CustomersTable>;

		const [result] = await db.insert(customers).values(data).returning();

		assert.ok(result, "Failed to create customer");

		return result;
	}

	public async listCustomers(
		params?: ListCustomerQuery,
	): Promise<ListResponse<RetrievedCustomer>> {
		const { email, limit, expand, offset } = params ?? {};
		const data = await db.query.customers.findMany({
			with: {
				bookings: expand?.includes("bookings") as true | undefined,
			},
			where: ilike(customers.email, `%${email}%`),
			offset,
			limit,
		});

		const rows = await db
			.select({ count: sql<number>`count(*)` })
			.from(customers)
			.where(ilike(customers.email, `%${email}%`));

		const res = rows[0];
		assert.ok(res, "Failed to count customers");

		return {
			items: data,
			count: res.count,
		};
	}

	public async retrieveCustomer(
		id: string,
		expansion?: CustomerExpansion[],
	): Promise<RetrievedCustomer | undefined> {
		const data = await db.query.customers.findFirst({
			with: {
				bookings: expansion?.includes("bookings") as true | undefined,
			},
			where: eq(customers.id, id),
		});

		return data;
	}

	public async updateCustomer(
		id: string,
		values: Partial<CreateCustomerValues>,
	): Promise<Customer> {
		const data = stripValues(values) as InferInsertModel<CustomersTable>;

		data.updatedAt = new Date();

		const [result] = await db
			.update(customers)
			.set(data)
			.where(eq(customers.id, id))
			.returning();

		assert.ok(result, "Failed to update customer");

		return result;
	}

	public async deleteCustomer(id: string): Promise<{ affectedRows: number }> {
		const result = await db.delete(customers).where(eq(customers.id, id));

		return {
			affectedRows: result.length,
		};
	}
}
