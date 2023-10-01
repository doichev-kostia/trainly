<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Button from "~/components/Button.svelte";
	import Route from "../Route.svelte";

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
				Choose your ticket
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

	
</section>

