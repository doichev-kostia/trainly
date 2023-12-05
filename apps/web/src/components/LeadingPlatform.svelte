<script>
	import Typography from "~/components/Typography.svelte";
	import MagnifyingGlass from "~/icons/MagnifyingGlass.svelte";
	import Ticket from "~/icons/Ticket.svelte";
	import CircleCheck from "~/icons/CircleCheck.svelte";
</script>

<section class="bg-gray-100 py-8">
	<div class="container text-center">
		<Typography component="h2" class="mb-4 text-2xl">
			Trainly is the world's leading platform for train tickets.
		</Typography>

		<div class="mx-auto max-w-xl">
			<ul class="flex flex-wrap justify-between gap-x-6">
				<li class="text-foreground flex-1">
					<div>
						<div class="mb-2 text-center">
							<MagnifyingGlass class="mx-auto h-8 w-8" />
						</div>
						<Typography component="h3" class="text-xl">1. Find a journey</Typography>
					</div>
				</li>
				<li class="text-foreground flex-1">
					<div>
						<div class="mb-2 text-center">
							<Ticket class="mx-auto h-8 w-8" />
						</div>
						<Typography component="h3" class="text-xl">2. Reserve a ticket</Typography>
					</div>
				</li>
				<li class="text-foreground flex-1">
					<div>
						<div class="mb-2 text-center">
							<CircleCheck class="mx-auto h-8 w-8" />
						</div>
						<Typography component="h3" class="text-xl">3. Enjoy the ride</Typography>
					</div>
				</li>
			</ul>
		</div>
	</div>
</section>
