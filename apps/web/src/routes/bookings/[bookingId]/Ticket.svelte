<script lang="ts">
	import Typography from "~/components/Typography.svelte";
	import type { Seat } from "@trainly/contracts/seats";
	import type { Passenger } from "@trainly/contracts/passengers";

	export let seat: Seat;
	export let passenger: Passenger;
</script>

<div class="bg-card text-card-foreground rounded-lg border px-3 py-2 shadow-md">
	<div class="mb-4">
		<div>
			<Typography component="span" class="text-muted-foreground">Class:</Typography>
			<Typography component="span">{seat.class}</Typography>
		</div>
		<div>
			<Typography component="span" class="text-muted-foreground">Seat:</Typography>
			<Typography component="span">{seat.number + 1}</Typography>
		</div>
		<div>
			<Typography component="span" class="text-muted-foreground">Passenger:</Typography>
			<Typography component="span">{passenger.firstName} {passenger.lastName}</Typography>
		</div>
	</div>
</div>
