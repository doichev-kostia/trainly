<script>
	import Typography from "~/components/Typography.svelte";
	import Check from "~/icons/Check.svelte";
	import Community from "~/icons/Community.svelte";
	import MapPin from "~/icons/MapPin.svelte";
	import Support from "~/icons/Support.svelte";

	const data = [
		{
			icon: Check,
			text: "Compare cheap prices for train tickets",
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
	<ul class="flex flex-wrap justify-center gap-x-5 gap-y-3">
		{#each data as item}
			<li
				class="text-muted-foreground flex min-w-[200px] max-w-xs flex-1 flex-col items-center text-center"
			>
				<svelte:component this={item.icon} />
				<Typography variant="body2" class="text-foreground balance mt-2"
					>{item.text}</Typography
				>
			</li>
		{/each}
	</ul>
</section>

<style>
	.balance {
		text-wrap: balance;
	}
</style>
