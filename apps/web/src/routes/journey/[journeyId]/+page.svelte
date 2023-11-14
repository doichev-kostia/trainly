<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Route from "./Journey.svelte";
	import { SeatClass, SeatStatus } from "@trainly/contracts/seats";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";
	import ChevronLeft from "~/icons/ChevronLeft.svelte";
	import ChevronRight from "~/icons/ChevronRight.svelte";
	import Button from "~/components/Button.svelte";

	export let data: PageData;

	let seatClass = data.seatClass;

	let chosenSeats = $page.url.searchParams.getAll("seat");

	const updateSeats = (event: Event) => {
		const { checked, value } = event.target as HTMLInputElement;
		if (checked) {
			chosenSeats = [...chosenSeats, value];
		} else {
			chosenSeats = chosenSeats.filter((seat) => seat !== value);
		}
	};

	$: {
		$page.url.searchParams.delete("seat");
		for (const seat of chosenSeats) {
			$page.url.searchParams.append("seat", seat);
		}

		if (browser) {
			goto(`?${$page.url.searchParams.toString()}`);
		}
	}

	const prev = () => {
		if (!data.hasPrevious) return;
		const carriage = data.carriage - 1;
		$page.url.searchParams.set("carriage", carriage.toString());
		goto(`?${$page.url.searchParams.toString()}`);
	};

	const next = () => {
		if (!data.hasNext) return;
		const carriage = data.carriage + 1;
		$page.url.searchParams.set("carriage", carriage.toString());
		goto(`?${$page.url.searchParams.toString()}`);
	};

	$: {
		$page.url.searchParams.set("seatClass", seatClass);
		if (browser) {
			goto(`?${$page.url.searchParams.toString()}`);
		}
	}

	let nextPage = `/journey/${data.journey.id}/confirmation`;

	console.log(data.seats);

	$: {
		nextPage = `/journey/${data.journey.id}/confirmation?${$page.url.searchParams.toString()}`;
	}
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

	<div class="container mb-4 py-2">
		<div
			role="radiogroup"
			class="bg-card text-card-foreground flex items-center gap-x-5 rounded-md p-4 shadow-md"
		>
			<div class="flex items-center">
				<input
					id="first-class-ticket"
					type="radio"
					value={SeatClass.premium}
					name="seatClass"
					class="accent-primary h-4 w-4"
					bind:group={seatClass}
				/>
				<label for="first-class-ticket" class="ml-2 text-sm font-medium">First class</label>
			</div>
			<div class="flex items-center">
				<input
					id="second-class-ticket"
					type="radio"
					value={SeatClass.standard}
					name="ticketClass"
					class="accent-primary h-4 w-4"
					bind:group={seatClass}
				/>
				<label for="second-class-ticket" class="ml-2 text-sm font-medium"
					>Second class</label
				>
			</div>
		</div>
	</div>

	<div class="container mb-4 py-2">
		<p class="mb-4">Carriage: {data.carriage + 1}</p>
		<div class="flex gap-x-3">
			<aside class="flex items-center">
				<Button on:click={prev} disabled={!data.hasPrevious} variant="link" class="p-0">
					<ChevronLeft />
				</Button>
			</aside>
			<section
				class="bg-card text-card-foreground flex-1 overflow-x-auto rounded-lg border px-4 py-3 shadow-md"
			>
				<ul class="grid grid-flow-col grid-rows-2 gap-x-5 gap-y-8">
					{#each data.seats.items as seat (seat.id)}
						<li class="flex items-center">
							<input
								id={seat.id}
								type="checkbox"
								value={seat.id}
								disabled={seat.status !== SeatStatus.available}
								on:change={updateSeats}
								checked={chosenSeats.includes(seat.id)}
								class="accent-primary text-primary h-5 w-5 rounded border-gray-300 bg-gray-100 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
							<label for={seat.id} class="ml-2 text-sm font-medium">
								{seat.number + 1}
							</label>
						</li>
					{/each}
				</ul>
			</section>
			<aside class="flex items-center">
				<Button on:click={next} disabled={!data.hasNext} variant="link" class="p-0">
					<ChevronRight />
				</Button>
			</aside>
		</div>
	</div>

	<div class="container py-2 text-right">
		<Button component="a" href={nextPage}>Continue</Button>
	</div>
</section>
