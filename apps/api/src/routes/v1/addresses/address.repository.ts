import { type Address, addresses, type AddressesTable } from "@trainly/db/schema/addresses";
import { eq, type InferInsertModel } from "@trainly/db";
import assert from "node:assert";
import { stripValues } from "~/utils/db.js";
import { db } from "~/configs/db.js";

type CreateAddressValues = Omit<InferInsertModel<AddressesTable>, "id" | "createdAt" | "updatedAt" | "stationId">;

export class AddressRepository {
	private static instance: AddressRepository | undefined;

	public static getInstance() {
		if (!AddressRepository.instance) {
			AddressRepository.instance = new AddressRepository();
		}

		return AddressRepository.instance;
	}

	public async createAddress(stationId: string, values: CreateAddressValues): Promise<Address> {
		const data = {
			...values,
			stationId,
		};

		const [result] = await db.insert(addresses).values(data).returning();

		assert.ok(result, "Failed to create address");

		return result;
	}

	public async retrieveAddress(id: string): Promise<Address | undefined> {
		const data = await db.query.addresses.findFirst({
			where: eq(addresses.id, id),
		});

		return data;
	}

	public async updateAddress(id: string, values: Partial<CreateAddressValues>): Promise<Address> {
		const data = stripValues(values) as InferInsertModel<AddressesTable>;

		data.updatedAt = new Date();

		const [result] = await db.update(addresses).set(data).where(eq(addresses.id, id)).returning();

		assert.ok(result, "Failed to update address");

		return result;
	}

	public async deleteAddress(id: string): Promise<{ affectedRows: number }> {
		const result = await db.delete(addresses).where(eq(addresses.id, id));

		return {
			affectedRows: result.rowCount ?? 0,
		};
	}
}
