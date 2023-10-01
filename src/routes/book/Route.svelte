<script lang="ts">
	import type { Route } from "~/routes/book/+page.js";
	import { formatter, getFormattedTimeDifference } from "./formatter";
	import Typography from "~/components/Typography.svelte";
	import ArrowRightIcon from "~/icons/ArrowRightIcon.svelte";
	import { onMount } from "svelte";

	export let route: Route;

	const startDate = formatter.format(route.startDate);
	const endDate = formatter.format(route.endDate);

	const diff = getFormattedTimeDifference(route.endDate, route.startDate);

	let path = `/route/${route.id}`;

	onMount(() => {
		const url = new URL(path, window.location.origin);
		url.search = window.location.search;
		url.searchParams.set("backlink", window.location.pathname);
		path = url.toString();
	})
</script>

<li class="px-3 py-2 rounded-lg border bg-card text-card-foreground shadow-md hover:bg-accent">
	<a href={path}>
		<div class="flex justify-between items-center">
			<time>{startDate}</time>
			<Typography component="span"><ArrowRightIcon /></Typography>
			<time>{endDate}</time>
		</div>
		<div class="flex justify-between gap-x-4">
			<Typography>Platform {route.platform}</Typography>
			<time>{diff}</time>
		</div>
	</a>
</li>
