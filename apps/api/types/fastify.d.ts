import fastify from 'fastify';

declare module 'fastify-cli/helper.js' {
	export function build(argv: string | Array<string>, config?: Object, serverOptions?: Object): ReturnType<typeof fastify>;
}

