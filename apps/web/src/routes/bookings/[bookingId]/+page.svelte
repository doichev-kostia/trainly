<script lang="ts">
	import type { PageServerData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import Ticket from "~/routes/bookings/[bookingId]/Ticket.svelte";

	export let data: PageServerData;
</script>

<section class="container py-8">
	<header class="mb-5">
		<Typography component="h2" class="text-2xl">Booking information</Typography>
	</header>

	<div>
		<div>
			<Typography component="span" class="text-muted-foreground">Email:</Typography>
			<Typography component="span">{data.booking.email}</Typography>
		</div>
		<div>
			<Typography component="span" class="text-muted-foreground">Departure</Typography>
			<Typography component="span">{data.departureStation.name}</Typography>
		</div>
		<div class="mb-4">
			<Typography component="span" class="text-muted-foreground">Arrival</Typography>
			<Typography component="span">{data.arrivalStation.name}</Typography>
		</div>

		<Typography component="p" class="mb-4">Tickets</Typography>

		<ul class="flex flex-col gap-4">
			{#each data.booking.tickets ?? [] as ticket (ticket.id)}
				<li>
					<Ticket seat={ticket.seat} passenger={ticket.passenger} />
				</li>
			{/each}
		</ul>
	</div>
</section>
