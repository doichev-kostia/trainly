<script lang="ts">
	import type { PageData } from "./$types";
	import Ticket from "~/routes/journey/[journeyId]/confirmation/Ticket.svelte";
	import Button from "~/components/Button.svelte";

	export let data: PageData;
</script>

<section>
	<header>
		<h2>Passenger details</h2>
	</header>

	<form action="" method="post">
		<label for="email">Email confirmation to</label>
		<input type="email" name="email" id="email" required />

		{#each data.seats as seat (seat.id)}
			<Ticket {seat} />
		{/each}

		<div>
			<p>Total: {data.totalPrice}</p>
		</div>

		<div>
			<Button type="submit" class="w-full text-lg">Checkout</Button>
		</div>
	</form>
</section>
