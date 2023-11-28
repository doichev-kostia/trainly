import { type IdParamsSchema } from "@trainly/contracts";
import { type JourneyPricingResponseSchema } from "@trainly/contracts/journeys";
import { type ZodHandler } from "~/utils/types.js";
import { eq } from "@trainly/db";
import { routes } from "@trainly/db/schema/routes";
import { journeys } from "@trainly/db/schema/journeys";
import { type SeatClassEnum } from "@trainly/contracts/seats";
import { db } from "~/configs/db.js";
import { ServiceContainer } from "~/configs/services.js";
import * as O from "effect/Option";

type Schema = {
	params: typeof IdParamsSchema;
	response: {
		"2xx": typeof JourneyPricingResponseSchema;
	};
};

export const retrieveJourneyPricing: ZodHandler<Schema> = async function retrieveJourneyPricing(request, reply) {
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
		const price = await ServiceContainer.get("payment").retrievePrice(priceId);

		if (O.isNone(price)) {
			throw this.httpErrors.internalServerError("Invalid price id");
		}

		response[key as SeatClassEnum] = price.value;
	}

	return response;
};
