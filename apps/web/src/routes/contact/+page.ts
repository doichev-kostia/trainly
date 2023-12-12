import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
	return {
		meta: {
			title: "Contact",
			description: "Contact us for more information.",
			keywords: ["contact", "information", "email", "phone"],
		},
	};
};
