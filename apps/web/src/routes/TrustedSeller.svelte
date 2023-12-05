<script>
	import Typography from "~/components/Typography.svelte";
</script>

<section class="bg-gray-200 py-8">
	<div class="container max-w-7xl">
		<Typography component="h3" class="mb-4 text-2xl">Trips all around the world</Typography>
		<div class="flex flex-wrap justify-between gap-6">
			<div class="min-w-[200px] flex-1">
				<Typography component="p" class="text-lg">
					Embark on unforgettable journeys with our train ticket booking app, your gateway to exploring the
					world's most stunning destinations. From serene countryside excursions to vibrant city adventures,
					book your train tickets effortlessly and make every trip a story worth telling.
				</Typography>
			</div>
			<div class="min-w-[300px] flex-1">
				<img
					src="/travel-around-the-world.webp"
					alt="the train is on the bridge and a kid is looking out"
					class="mt-4 w-full rounded-lg shadow-lg"
				/>
			</div>
		</div>
	</div>
</section>
