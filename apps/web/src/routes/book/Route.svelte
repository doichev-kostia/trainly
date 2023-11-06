<script lang="ts">
	import type { Route } from "~/data";
	import { formatter, getFormattedTimeDifference } from "./formatter";
	import Typography from "~/components/Typography.svelte";
	import ArrowRightIcon from "~/icons/ArrowRightIcon.svelte";
	import { onMount } from "svelte";

	export let id: string;
	export let startDate: Date;
	export let endDate: Date;

	const start = formatter.format(startDate);
	const end = formatter.format(endDate);

	const diff = getFormattedTimeDifference(endDate, startDate);

	let path = `/route/${id}`;

	onMount(() => {
		const url = new URL(path, window.location.origin);
		url.search = window.location.search;
		url.searchParams.set("backlink", window.location.pathname);
		path = url.toString();
	});
</script>

<li class="bg-card text-card-foreground hover:bg-accent rounded-lg border px-3 py-2 shadow-md">
	<a href={path}>
		<div class="flex items-center justify-between">
			<time>{start}</time>
			<Typography component="span"><ArrowRightIcon /></Typography>
			<time>{end}</time>
		</div>
		<div class="flex justify-end gap-x-4">
			<time>{diff}</time>
		</div>
	</a>
</li>
