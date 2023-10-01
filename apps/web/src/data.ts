export type Route = {
	id: string;
	platform: number;
	startDate: Date;
	endDate: Date;
	origin: string;
	destination: string;
};

export const routes: Route[] = [
	{
		id: "1a2b3c4d-5e6f-7g8h-9i0j",
		platform: 1,
		startDate: new Date("2023-10-01T09:00:00"),
		endDate: new Date("2023-10-01T11:00:00"),
		origin: "New York",
		destination: "Boston",
	},
	{
		id: "2b3c4d5e-6f7g-8h9i-0j1k",
		platform: 2,
		startDate: new Date("2023-10-02T12:00:00"),
		endDate: new Date("2023-10-02T14:00:00"),
		origin: "Chicago",
		destination: "Detroit",
	},
	{
		id: "3c4d5e6f-7g8h-9i0j-1k2l",
		platform: 3,
		startDate: new Date("2023-10-03T15:00:00"),
		endDate: new Date("2023-10-03T17:00:00"),
		origin: "San Francisco",
		destination: "Los Angeles",
	},
	{
		id: "4d5e6f7g-8h9i-0j1k-2l3m",
		platform: 4,
		startDate: new Date("2023-10-04T18:00:00"),
		endDate: new Date("2023-10-04T20:00:00"),
		origin: "Seattle",
		destination: "Portland",
	},
	{
		id: "5e6f7g8h-9i0j-1k2l-3m4n",
		platform: 5,
		startDate: new Date("2023-10-05T21:00:00"),
		endDate: new Date("2023-10-05T23:00:00"),
		origin: "Miami",
		destination: "Orlando",
	},
];


export type Ticket = {
	id: string;
	price: number; // in cents
	name: string;
	description: string;
}

export const tickets: Ticket[] = [
	{
		id: "1a2b3c4d-5e6f-7g8h-9i0j",
		price: 1000,
		name: "Standard",
		description: "Standard ticket",
	},
	{
		id: "2b3c4d5e-6f7g-8h9i-0j1k",
		price: 500,
		name: "Kids",
		description: "Kids ticket",
	}
];
