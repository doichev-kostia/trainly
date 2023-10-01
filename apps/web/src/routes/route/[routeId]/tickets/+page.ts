import type { PageLoad } from "./$types";
import { type Ticket, tickets } from "~/data";

const coeff = {
	"first": 1.5,
	"second": 1,
};

export const load: PageLoad = async (event): Promise<{
	tickets: Ticket[],
	backlink: string | null;
	from: string;
	to: string;
	date: string;
	ticketType: string;
	ticketClass: string;
}> => {
	const from = event.url.searchParams.get("from");
	const to = event.url.searchParams.get("to");
	const date = event.url.searchParams.get("date");
	const ticketType = event.url.searchParams.get("ticketType");
	const ticketClass = event.url.searchParams.get("ticketClass");

	if (!from || !to || !date || !ticketType || !ticketClass) {
		throw new Error("Invalid parameters");
	}


	const routeTickets = tickets.map((ticket) => {
		return {
			...ticket,
			price: ticket.price * (coeff[ticketClass as keyof typeof coeff] ?? 1),
		}
	});

	let backlink = event.url.searchParams.get("backlink");

	if (backlink) {
		const url = new URL(backlink, event.url.origin);
		url.searchParams.set("from", from || "");
		url.searchParams.set("to", to || "");
		url.searchParams.set("date", date || "");
		url.searchParams.set("ticketType", ticketType || "");
		url.searchParams.set("ticketClass", ticketClass || "");
		backlink = url.toString();
	}


	return {
		tickets: routeTickets,
		backlink,
		from,
		to,
		date,
		ticketType,
		ticketClass,
	}
}
