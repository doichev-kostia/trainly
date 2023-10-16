import { migrate } from "../migrate.js";

migrate()
	.then(() => {
		console.log("Migration completed");
		process.exit(0);
	})
	.catch((err) => {
		console.error("Migration failed", err);
		process.exit(1);
	});
