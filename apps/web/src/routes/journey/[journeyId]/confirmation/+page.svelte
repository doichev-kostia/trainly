<script lang="ts">
	import type { PageData } from "./$types";
	import Ticket from "~/routes/journey/[journeyId]/confirmation/Ticket.svelte";
	import Button from "~/components/Button.svelte";
	import Typography from "~/components/Typography.svelte";

	export let data: PageData;

	const price = (data.totalPrice / 100).toFixed(2);
</script>

<section class="container pt-8">
	<header class="mb-4">
		<Typography component="h2" class="text-2xl">Confirmation</Typography>
	</header>

	<form method="post" class="max-w-xl">
		<div class="mb-4">
			<label for="email" class="mb-2 block text-sm font-medium">
				Email confirmation to
			</label>
			<input
				type="email"
				name="email"
				id="email"
				required
				autocomplete="email"
				placeholder="Email"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
			/>
		</div>

		<ul class="mb-6 flex flex-col gap-5">
			{#each data.seats as seat, idx (seat.id)}
				<li>
					<Ticket {seat} {idx} />
				</li>
			{/each}
		</ul>

		<div class="mb-5">
			<Typography component="p">Total: {price} €</Typography>
		</div>

		<div>
			<Button type="submit" class="w-full text-lg">Checkout</Button>
		</div>
	</form>
</section>
