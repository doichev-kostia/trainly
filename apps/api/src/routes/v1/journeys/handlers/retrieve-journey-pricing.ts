import { type IdParamsSchema } from "@trainly/contracts";
import {
	type JourneyPricingResponse,
	type JourneyPricingResponseSchema,
} from "@trainly/contracts/journeys";
import { type Handler } from "~/utils/types.js";
import { db, eq } from "@trainly/db";
import { trains } from "@trainly/db/schema/trains";
import { routes } from "@trainly/db/schema/routes";
import { journeys } from "@trainly/db/schema/journeys";
import { type SeatClassEnum } from "@trainly/contracts/seats";

type Schema = {
	params: typeof IdParamsSchema;
	response: {
		"2xx": typeof JourneyPricingResponseSchema;
	};
};

export const retrieveJourneyPricing: Handler<Schema> = async function retrieveJourneyPricing(
	request,
	reply,
) {
	const { id } = request.params;

	const [route] = await db
		.select({
			pricing: routes.pricing,
		})
		.from(routes)
		.innerJoin(journeys, eq(journeys.routeId, routes.id))
		.where(eq(journeys.id, id));

	const pricing = route.pricing as any as Record<SeatClassEnum, string>;

	const response: Record<SeatClassEnum, number> = {};

	for (const key in pricing) {
		const priceId = pricing[key as SeatClassEnum];
		const price = await this.stripe.prices.retrieve(priceId);

		response[key as SeatClassEnum] = price.unit_amount!;
	}

	return response;
};
