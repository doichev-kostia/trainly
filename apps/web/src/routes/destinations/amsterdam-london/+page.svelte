<script lang="ts">
	import Button from "~/components/Button.svelte";
	import Typography from "~/components/Typography.svelte";
	import LeadingPlatform from "~/components/LeadingPlatform.svelte";
	import { destinations } from "~/data";
	import Destinations from "~/components/Destinations.svelte";

	let from = "Amsterdam";
	let to = "London";

	const dest = destinations.filter((d) => !d.name.includes(from));
</script>

<section>
	<div class="hero relative">
		<div class="mx-auto max-w-5xl px-4 pb-4 pt-8">
			<div class="relative z-10 flex gap-x-5">
				<div class="flex-1">
					<div
						class="bg-card text-card-foreground mx-auto min-w-[280px] max-w-sm rounded-lg border p-4 shadow-sm"
					>
						<form method="GET" action="/book">
							<div class="mb-3 flex flex-col">
								<div class="mb-4 flex flex-col gap-y-3">
									<div>
										<label for="from" class="mb-2 block text-sm font-medium text-gray-900"
											>From:
										</label>
										<select
											bind:value={from}
											class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
											name="from"
											id="from"
											required
										>
											<option>{from}</option>
										</select>
									</div>
									<div>
										<label for="to" class="mb-2 block text-sm font-medium text-gray-900"
											>To:
										</label>
										<select
											bind:value={to}
											class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
											name="to"
											id="to"
											required
										>
											<option>{to}</option>
										</select>
									</div>
								</div>
								<div>
									<div class="relative max-w-sm">
										<div
											class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5"
										>
											<svg
												class="h-4 w-4 text-gray-500 dark:text-gray-400"
												aria-hidden="true"
												xmlns="http://www.w3.org/2000/svg"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
												/>
											</svg>
										</div>
										<input
											name="date"
											required
											type="date"
											class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
											placeholder="Select date"
										/>
									</div>
								</div>
							</div>
							<div>
								<Button type="submit" class="w-full text-lg">Find tickets</Button>
							</div>
						</form>
					</div>
				</div>
				<div class="flex-two-third hidden md:block">
					<Typography component="h1" class="text-accent pl-2 text-3xl ">
						{from} to {to}. <br />
						<span class="text-accent">From €9.99</span>
					</Typography>
				</div>
			</div>
		</div>
	</div>
</section>
<LeadingPlatform />
<Destinations destinations={dest} />

<style>
	.hero {
		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-image: url("/london.webp");
			background-size: cover;
			background-position-y: 84%;
			filter: brightness(0.5);
		}
	}

	.flex-two-third {
		flex: 1 1 66%;
	}
</style>
