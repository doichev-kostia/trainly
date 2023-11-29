import fp from "fastify-plugin";

export default fp(
	async function (fastify, options) {
		const plugin = await import("@fastify/sensible");
		fastify.register(plugin.fastifySensible);
	},
	{
		name: "sensible",
	},
);
