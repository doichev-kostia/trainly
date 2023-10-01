<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Button from "~/components/Button.svelte";
	import Route from "./Route.svelte";

	export let data: PageData;

</script>


<section>
	<header class="container py-2">
		<div class="flex flex-col gap-y-3">

			{#if data.backlink}
				<a href={data.backlink} class="text-2xl text-primary">
					<ArrowLeftIcon />
				</a>
			{/if}
			<Typography variant="h2" class="text-xl">
				Ticket options
			</Typography>
		</div>
	</header>

	<div class="container py-2 mb-4">
		<Route
			destination={data.route.destination}
			origin={data.route.origin}
			startDate={data.route.startDate}
			endDate={data.route.endDate}
		/>
	</div>

	<form method="POST">
		<div class="container py-2 mb-4">
			<div class="bg-card text-card-foreground shadow-md p-4 rounded-md flex items-center gap-x-5">
				<div class="flex items-center">
					<input id="first-class-ticket" type="radio" value="first" name="ticketClass" checked
								 class="accent-primary w-4 h-4">
					<label for="first-class-ticket" class="ml-2 text-sm font-medium">First class</label>
				</div>
				<div class="flex items-center">
					<input id="second-class-ticket" type="radio" value="second" name="ticketClass"
								 class="accent-primary w-4 h-4">
					<label for="second-class-ticket" class="ml-2 text-sm font-medium">Second class</label>
				</div>
			</div>
		</div>

		<div class="container py-2 mb-4">
			<div class="bg-card text-card-foreground shadow-md p-4 rounded-md">
				<div class="flex items-center gap-x-5">
					<div class="flex items-center">
						<input id="single-ticket" type="radio" value="single" name="ticketType" checked
									 class="accent-primary w-4 h-4">
						<label for="single-ticket" class="ml-2 text-sm font-medium">Single</label>
					</div>
					<div class="flex items-center">
						<input id="return-ticket" type="radio" value="return" name="ticketType"
									 class="accent-primary w-4 h-4">
						<label for="return-ticket" class="ml-2 text-sm font-medium">Return</label>
					</div>
				</div>
			</div>
		</div>

		<div class="container py-2">
			<Button type="submit" class="w-full">
				Continue
			</Button>
		</div>
	</form>
</section>

