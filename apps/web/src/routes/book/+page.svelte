<script lang="ts">
	import type { PageServerData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import Button from "~/components/Button.svelte";
	import { onMount } from "svelte";
	import Route from "~/routes/book/Journey.svelte";
	import ArrowRightIcon from "~/icons/ArrowRightIcon.svelte";
	import type { JourneyResponse } from "@trainly/contracts/journeys";

	export let data: PageServerData;

	const formatter = new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const from = data.from;
	const to = data.to;
	const date = data.date;

	if (!from || !to || !date) {
		throw new Error("Missing parameters");
	}

	type Epoch = number;
	const journeyGroups = new Map<Epoch, { id: string; startDate: string; endDate: string }[]>();

	for (const journey of data.journeys) {
		const startDate = new Date(journey.startDate);
		const hash = new Date(
			startDate.getUTCFullYear(),
			startDate.getUTCMonth(),
			startDate.getUTCDate(),
		).getTime();

		const journeys = journeyGroups.get(hash);
		if (journeys) {
			journeys.push(journey);
		} else {
			journeyGroups.set(hash, [journey]);
		}
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
			{#each journeyGroups as [epoch, group]}
				<li class="flex flex-col gap-y-1">
					<Typography component="h3" class="mb-2 text-lg">
						{formatter.format(new Date(epoch))}
					</Typography>
					<ul class="flex flex-col gap-y-1">
						{#each group as journey}
							<Route
								id={journey.id}
								startDate={new Date(journey.startDate)}
								endDate={new Date(journey.endDate)}
							/>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</div>
</section>
