<script lang="ts">
	import type { Seat } from "./types.js";

	export let seat: Seat;

	const price = (seat.price / 100).toFixed(2);
</script>

<div>
	<input type="text" hidden readonly name="id" value={seat.id} />
	<div>
		<p>Class</p>
		<p>{seat.class}</p>
		<p>Number</p>
		<p>{seat.number + 1}</p>
	</div>

	<p>{price} €</p>

	<h3>Passenger details</h3>
	<label for="firstName">First name</label>
	<input type="text" name="firstName" id="firstName" required min="1" />

	<label for="lastName">Last name</label>
	<input type="text" name="lastName" id="lastName" required min="1" />
</div>
