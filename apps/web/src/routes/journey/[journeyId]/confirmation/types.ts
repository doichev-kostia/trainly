import type { SeatClassEnum } from "@trainly/contracts/seats";

export type Seat = {
	id: string;
	class: SeatClassEnum;
	price: number;
	number: number;
};
