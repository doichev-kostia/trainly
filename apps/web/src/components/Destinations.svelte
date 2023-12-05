<script lang="ts">
	import Typography from "~/components/Typography.svelte";

	type Destination = {
		name: string;
		href: string;
		img: string;
	};

	export let destinations: Destination[];
</script>

<section>
	<div class="container max-w-7xl py-8">
		<Typography component="h2" class="mb-6 text-2xl">Destinations</Typography>

		<ul class="flex flex-wrap justify-center gap-6">
			{#each destinations as destination}
				<li class="min-w-[200px] max-w-[30%]">
					<div>
						<picture class="mb-3 block rounded-lg">
							<img src={destination.img} alt={destination.name} class="max-w-full rounded-lg" />
						</picture>
						<Typography
							component="a"
							href={destination.href}
							class="text-foreground text-xl underline underline-offset-4">{destination.name}</Typography
						>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>
