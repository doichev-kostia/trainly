import { type Handler } from "~/utils/types.js";
import { Option as O } from "effect";

export const stripeHandler: Handler<any> = async function stripeHanlder(request, reply) {
	const event = this.parseStripeEvent(request);

	if (O.isNone(event)) {
		request.log.error("Invalid Stripe Event");
		reply.status(this.httpStatus.BAD_REQUEST);
		return;
	}

	// if (event.value.type !== "") {
	// 	return reply.status(this.httpStatus.OK);
	// }
	//
	// const metadata = event.value.object.metadata;

	// update booking and seats
};
