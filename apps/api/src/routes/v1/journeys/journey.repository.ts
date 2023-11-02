import { type Journey } from "@trainly/db/schema/journeys";
import { type Route } from "@trainly/db/schema/routes";
import { type JourneyStop } from "@trainly/db/schema/journey-stops";
import { type Seat } from "@trainly/db/schema/seats";

type RetrievedJourney = Journey & {
	route?: Route;
	stops?: JourneyStop[];
	seats?: Seat[];
};
export class JourneyRepository {
	private static instance: JourneyRepository | undefined;

	public static getInstance() {
		if (!JourneyRepository.instance) {
			JourneyRepository.instance = new JourneyRepository();
		}
	}
}
