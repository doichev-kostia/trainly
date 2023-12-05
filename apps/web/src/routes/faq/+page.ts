import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
	return {
		meta: {
			title: "Frequently Asked Questions",
			description:
				"Find answers to all your questions on the Trainly's FAQ page. Get detailed information about booking, payment options, ticket changes, and our privacy policies. Simplify your train ticket booking experience with our comprehensive guide to frequently asked questions.",
		},
	};
};
