<script lang="ts">
	import type { Seat } from "./types.js";
	import Typography from "~/components/Typography.svelte";

	export let seat: Seat;
	export let idx: number;

	const price = (seat.price / 100).toFixed(2);

	function getSeatName(name: string) {
		return `seats[${idx}][${name}]`;
	}

	function getPassengerName(name: string) {
		return `${getSeatName("passenger")}[${name}]`;
	}

	const names = {
		id: getSeatName("id"),
		firstName: getPassengerName("firstName"),
		lastName: getPassengerName("lastName"),
	};
	// eslint-disable-next-line
	const pattern = `[A-Za-z \'\\-]{1,32}`;
</script>

<div class="bg-card text-card-foreground rounded-lg border px-3 py-2 shadow-md">
	<input type="text" hidden readonly name={names.id} value={seat.id} />
	<div class="mb-4">
		<div>
			<Typography component="span" class="text-muted-foreground">Class:</Typography>
			<Typography component="span">{seat.class}</Typography>
		</div>
		<div>
			<Typography component="span" class="text-muted-foreground">Seat:</Typography>
			<Typography component="span">{seat.number + 1}</Typography>
		</div>
		<div>
			<Typography component="span" class="text-muted-foreground">Price:</Typography>
			<Typography component="span">{price} €</Typography>
		</div>
	</div>

	<Typography component="h3" class="mb-3 text-lg">Passenger details</Typography>

	<div class="mb-3">
		<label for="firstName" class="mb-2 block text-sm font-medium">First name</label>
		<input
			type="text"
			name={names.firstName}
			id={names.firstName}
			required
			min="1"
			{pattern}
			autocomplete="given-name"
			title="First name should only contain letters, spaces, hyphens, and apostrophes."
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		/>
	</div>

	<div class="mb-3">
		<label for="lastName" class="mb-2 block text-sm font-medium">Last name</label>
		<input
			type="text"
			name={names.lastName}
			id={names.lastName}
			required
			min="1"
			{pattern}
			autocomplete="family-name"
			title="Last name should only contain letters, spaces, hyphens, and apostrophes."
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
		/>
	</div>
</div>
