import {
	eq,
	getTableName,
	type InferInsertModel,
	type InferSelectModel,
	type PostgresJsDatabase,
	sql,
	type Table,
} from "@trainly/db";
import { type ListOptions, relations, stripValues } from "~/utils/db.js";

type CreateValues<T extends Table> = Omit<InferSelectModel<T>, "id" | "createdAt" | "updatedAt">;
type Selectable<T extends Table> = InferSelectModel<T>;

export class BaseRepository<T extends Table, DB extends PostgresJsDatabase<Record<string, any>>> {
	protected _db: DB;
	protected _table: T;

	constructor(table: T, db: DB) {
		this._table = table;
		this._db = db;
	}

	public get db() {
		return this._db;
	}

	public get table() {
		return this._table;
	}

	public async create(values: CreateValues<T>): Promise<Selectable<T> | undefined> {
		const data = {
			...values,
			updatedAt: new Date(),
		} as InferInsertModel<T>;

		const [result] = await this._db.insert(this._table).values(data).returning();

		return result;
	}

	public async list(options: ListOptions = {}): Promise<Selectable<T>[]> {
		const { pagination, expansion = [] } = options;

		const name = getTableName(this._table);

		// @ts-ignore
		const data = await this._db.query[name].findMany({
			with: relations(expansion),
			offset: pagination?.offset,
			limit: pagination?.limit,
		});

		return data as Selectable<T>[];
	}

	public async count(): Promise<number | undefined> {
		const rows = await this._db
			.select({
				count: sql<string>`count(*)`,
			})
			.from(this._table)
			.limit(1);

		const res = rows[0];

		return Number(res?.count);
	}

	public async retrieve(id: string, expand: string[] = []): Promise<Selectable<T> | undefined> {
		const name = getTableName(this._table);

		// @ts-ignore
		const data = await this._db.query[name].findFirst({
			with: relations(expand),
			where: eq((this._table as any).id, id),
		});

		return data as Selectable<T> | undefined;
	}

	public async update(
		id: string,
		values: Partial<CreateValues<T>>,
	): Promise<Selectable<T> | undefined> {
		const data = stripValues(values) as InferInsertModel<T> & {
			updatedAt: Date;
		};

		data.updatedAt = new Date();

		const [result] = await this._db
			.update(this._table)
			.set(data)
			.where(eq((this._table as any).id, id))
			.returning();

		return result;
	}

	public async del(id: string): Promise<{ affectedRows: number }> {
		const result = await this._db.delete(this._table).where(eq((this._table as any).id, id));

		return {
			affectedRows: result.length,
		};
	}
}
