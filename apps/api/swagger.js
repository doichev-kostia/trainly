import './env.js';
import { generateSwagger, stop } from 'fastify-cli/generate-swagger.js';
import fs from 'node:fs';

const argv = process.argv.slice(2);

const yaml = argv.some((arg) => arg === '--yaml');

const file = yaml ? 'openapi.yaml' : 'openapi.json';

generateSwagger(argv)
	.then((schema) => {
		console.info(`Swagger schema generated successfully`);
		fs.writeFileSync(file, schema);
		stop();
	})
	.catch((error) => {
		console.error(`Error generating Swagger schema: ${error}`);
		stop(error);
	});
