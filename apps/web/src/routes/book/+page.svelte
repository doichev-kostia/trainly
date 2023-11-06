<script lang="ts">
	import type { PageServerData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import Button from "~/components/Button.svelte";
	import { onMount } from "svelte";
	import Route from "~/routes/book/Route.svelte";
	import ArrowRightIcon from "~/icons/ArrowRightIcon.svelte";

	export let data: PageServerData;

	const from = data.from;
	const to = data.to;
	const date = data.date;

	if (!from || !to || !date) {
		throw new Error("Missing parameters");
	}

	const searchParams = new URLSearchParams();
	searchParams.set("from", from);
	searchParams.set("to", to);
	searchParams.set("date", date);

	let backlink: URL | undefined = undefined;

	onMount(() => {
		backlink = new URL("/", window.location.origin);
		backlink.search = searchParams.toString();
	});
</script>

<section>
	<header class="container mb-3 flex items-center justify-between gap-x-3">
		<div class="flex items-center gap-x-0.5 text-xl">
			<Typography component="h2" class="capitalize">{from}</Typography>
			<Typography component="span">
				<ArrowRightIcon />
			</Typography>
			<Typography component="h2" class="capitalize">{to}</Typography>
		</div>
		<div>
			<Button component="a" variant="link" href={backlink ? backlink.toString() : "/"}
				>Edit
			</Button>
		</div>
	</header>

	<div class="container">
		<ul class="flex w-full flex-col gap-y-3">
			{#each data.routes as route (route.id)}
				<Route
					id={route.id}
					startDate={new Date(route.startDate)}
					endDate={new Date(route.endDate)}
				/>
			{/each}
		</ul>
	</div>
</section>
