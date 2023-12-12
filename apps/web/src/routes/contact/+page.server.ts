import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const body = Object.fromEntries(data.entries());

		console.log(body);
	},
} satisfies Actions;
