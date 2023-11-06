<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Button from "~/components/Button.svelte";
	import Route from "./Journey.svelte";

	export let data: PageData;
</script>

<section>
	<header class="container py-2">
		<div class="flex flex-col gap-y-3">
			{#if data.backlink}
				<a href={data.backlink} class="text-primary text-2xl">
					<ArrowLeftIcon />
				</a>
			{/if}
			<Typography variant="h2" class="text-xl">Ticket options</Typography>
		</div>
	</header>

	<div class="container mb-4 py-2">
		<Route
			destination={data.journey.destination}
			origin={data.journey.origin}
			startDate={data.journey.startDate}
			endDate={data.journey.endDate}
		/>
	</div>

	<form method="POST">
		<div class="container mb-4 py-2">
			<div
				class="bg-card text-card-foreground flex items-center gap-x-5 rounded-md p-4 shadow-md"
			>
				<div class="flex items-center">
					<input
						id="first-class-ticket"
						type="radio"
						value="first"
						name="ticketClass"
						checked
						class="accent-primary h-4 w-4"
					/>
					<label for="first-class-ticket" class="ml-2 text-sm font-medium"
						>First class</label
					>
				</div>
				<div class="flex items-center">
					<input
						id="second-class-ticket"
						type="radio"
						value="second"
						name="ticketClass"
						class="accent-primary h-4 w-4"
					/>
					<label for="second-class-ticket" class="ml-2 text-sm font-medium"
						>Second class</label
					>
				</div>
			</div>
		</div>

		<div class="container py-2">
			<Button type="submit" class="w-full">Continue</Button>
		</div>
	</form>
</section>
