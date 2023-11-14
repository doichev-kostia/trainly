<script>
	import Typography from "~/components/Typography.svelte";
	import Check from "~/icons/Check.svelte";
	import Community from "~/icons/Community.svelte";
	import MapPin from "~/icons/MapPin.svelte";
	import Support from "~/icons/Support.svelte";

	const data = [
		{
			icon: Check,
			text: "Compare cheap prices for train",
		},
		{
			icon: MapPin,
			text: "Travel thousands of destinations",
		},
		{
			icon: Community,
			text: "Join millions of people who use us every day",
		},
		{
			icon: Support,
			text: "Customer service on hand every step of the way",
		},
	];
</script>

<section class="container max-w-7xl py-8">
	<ul class="flex justify-center gap-x-5">
		{#each data as item}
			<li class="text-muted-foreground flex flex-col items-center text-center">
				<svelte:component this={item.icon} />
				<Typography variant="body2" class="text-foreground mt-2">{item.text}</Typography>
			</li>
		{/each}
	</ul>
</section>
