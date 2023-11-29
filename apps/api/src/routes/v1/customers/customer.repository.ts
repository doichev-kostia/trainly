import { eq, ilike, type InferInsertModel, sql } from "@trainly/db";
import { type Customer, customers, type CustomersTable } from "@trainly/db/schema/customers";
import { relations } from "~/utils/db.js";
import { type ListCustomerQuery } from "@trainly/contracts/customers";
import { type Booking } from "@trainly/db/schema/bookings";
import { type ListResponse } from "@trainly/contracts";
import { BaseRepository } from "#base-repository";
import { InternalError } from "~/errors/domain/InternalError.js";
import { db } from "~/configs/db.js";

type CreateCustomerValues = Omit<InferInsertModel<CustomersTable>, "id" | "createdAt" | "updatedAt">;

type RetrievedCustomer = Customer & {
	bookings?: Booking[];
};

export class CustomerRepository {
	private static instance: CustomerRepository | undefined;
	private base: BaseRepository<typeof customers, typeof db>;

	private constructor(database: typeof db, table: typeof customers) {
		this.base = new BaseRepository(table, database);
	}
	public static getInstance() {
		if (!CustomerRepository.instance) {
			CustomerRepository.instance = new CustomerRepository(db, customers);
		}

		return CustomerRepository.instance;
	}

	public async checkExists(email: string): Promise<boolean> {
		const rows = await this.base.db
			.select({
				id: this.base.table.id,
			})
			.from(this.base.table)
			.where(eq(this.base.table.email, email))
			.limit(1);

		return rows.length > 0;
	}

	public async create(values: CreateCustomerValues): Promise<Customer> {
		const result = await this.base.create(values);

		if (!result) {
			throw new InternalError("Failed to create customer");
		}

		return result;
	}

	public async list(params?: ListCustomerQuery): Promise<ListResponse<RetrievedCustomer>> {
		const { email, limit, expand, offset } = params ?? {};
		const data = await this.base.db.query.customers.findMany({
			with: relations(expand ?? []),
			where: ilike(this.base.table.email, `%${email}%`),
			offset,
			limit,
		});

		const rows = await this.base.db
			.select({ count: sql<number>`count(*)` })
			.from(this.base.table)
			.where(ilike(this.base.table.email, `%${email}%`));

		const res = rows[0];

		if (!res) {
			throw new InternalError("Failed to count customers");
		}

		return {
			items: data,
			count: Number(res.count),
		};
	}

	public async retrieve(id: string, expansion?: string[]): Promise<RetrievedCustomer | undefined> {
		const data = await this.base.retrieve(id, expansion);

		return data;
	}

	public async update(id: string, values: Partial<CreateCustomerValues>): Promise<Customer> {
		const result = await this.base.update(id, values);

		if (!result) {
			throw new InternalError("Failed to update customer");
		}

		return result;
	}

	public async del(id: string): Promise<{ affectedRows: number }> {
		const result = await this.base.del(id);

		return result;
	}
}
