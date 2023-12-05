export type Route = {
	id: string;
	startDate: Date;
	endDate: Date;
	origin: string;
	destination: string;
};

type Destination = {
	name: string;
	href: string;
	img: string;
};
export const destinations: Destination[] = [
	{
		name: "Amsterdam - London",
		href: "/destinations/amsterdam-london",
		img: "/london.webp",
	},
	{
		name: "Brussels - Paris",
		href: "/destinations/brussels-paris",
		img: "/paris.webp",
	},
	{
		name: "Berlin - Prague",
		href: "/destinations/berlin-prague",
		img: "/prague.webp",
	},
];
