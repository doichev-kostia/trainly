<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import ArrowLeftIcon from "~/icons/ArrowLeftIcon.svelte";
	import Route from "./Journey.svelte";
	import { SeatClass, SeatStatus } from "@trainly/contracts/seats";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

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
		console.log(chosenSeats);
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
		<div class="flex items-center gap-x-3">
			<aside>
				<button on:click={prev} disabled={!data.hasPrevious}>P</button>
			</aside>
			<section
				class="bg-card text-card-foreground flex-1 rounded-lg border px-3 py-2 shadow-md"
			>
				<ul class="grid grid-flow-col grid-rows-2 gap-4">
					{#each data.seats.items as seat (seat.id)}
						<li>
							<label for={seat.id}>
								{seat.number + 1}
							</label>
							<input
								id={seat.id}
								type="checkbox"
								value={seat.id}
								disabled={seat.status !== SeatStatus.available}
								on:change={updateSeats}
								checked={chosenSeats.includes(seat.id)}
							/>
						</li>
					{/each}
				</ul>
			</section>
			<aside>
				<button on:click={next} disabled={!data.hasNext}>N</button>
			</aside>
		</div>
	</div>

	<div class="container py-2">
		<a href={nextPage}>Continue</a>
	</div>
</section>
