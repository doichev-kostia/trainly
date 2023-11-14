<script lang="ts">
	import type { PageData } from "./$types";
	import Button from "~/components/Button.svelte";
	import Typography from "~/components/Typography.svelte";
	import Advantages from "~/routes/Advantages.svelte";

	export let data: PageData;

	let from = data.from ?? "";
	let to = data.to ?? "";
	let date = data.date ?? "";

	$: console.log(from, to, date);
</script>

<section>
	<div class="hero relative">
		<div class="mx-auto max-w-5xl px-4 pb-4 pt-8">
			<div class="relative z-10 flex gap-x-5">
				<div class="flex-third">
					<div
						class="bg-card text-card-foreground min-w-[280px] max-w-sm rounded-lg border p-4 shadow-sm"
					>
						<form method="GET" action="/book">
							<div class="mb-3 flex flex-col">
								<div class="mb-4 flex flex-col gap-y-3">
									<input
										value={from}
										placeholder="From"
										class="w-full"
										name="from"
									/>
									<input value={to} placeholder="To" class="w-full" name="to" />
								</div>
								<div>
									<input value={date} type="date" name="date" />
								</div>
							</div>
							<div>
								<Button type="submit" class="w-full text-lg">Find tickets</Button>
							</div>
						</form>
					</div>
				</div>
				<div class="flex-two-third hidden md:block">
					<Typography component="h2" class="text-accent pl-2 text-3xl ">
						Explore the world effortlessly
					</Typography>
				</div>
			</div>
		</div>
	</div>
</section>
<Advantages />

<style>
	.hero {
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: url("/hero-bg.webp");
			background-size: cover;
			background-position: center;
			filter: brightness(0.5);
		}
	}

	.flex-third {
		flex: 1 1 33%;
	}

	.flex-two-third {
		flex: 1 1 66%;
	}
</style>
