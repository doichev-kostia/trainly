<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Route from "../Journey.svelte";

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
			<Typography variant="h2" class="text-xl">Choose your ticket</Typography>
		</div>
	</header>

	<div class="container mb-4 py-2">
		<Route
			destination={data.route.destination}
			origin={data.route.origin}
			startDate={data.route.startDate}
			endDate={data.route.endDate}
		/>
	</div>
</section>
