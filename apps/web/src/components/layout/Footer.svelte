<script>
	import Typography from "~/components/Typography.svelte";
</script>

<footer class="bg-foreground py-8 text-white">
	<div class="container">
		<div class="mb-5 flex gap-x-4 md:gap-x-16">
			<div>
				<Typography component="h5" class="mb-3">Navigation</Typography>
				<ul class="flex flex-col gap-2">
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/">Home</Typography>
					</li>
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/about">About</Typography>
					</li>
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/contact">
							Contact
						</Typography>
					</li>
				</ul>
			</div>
			<div>
				<Typography component="h5" class="mb-3">Popular destinations</Typography>
				<ul class="flex flex-col gap-2">
					<li>
						<Typography
							component="a"
							class="underline underline-offset-1"
							href="/destinations/brussels-paris">Brussels - Paris</Typography
						>
					</li>
					<li>
						<Typography
							component="a"
							class="underline underline-offset-1"
							href="/destinations/amsterdam-london">Amsterdam - London</Typography
						>
					</li>
					<li>
						<Typography
							component="a"
							class="underline underline-offset-1"
							href="/destinations/berlin-prague">Berlin - Prague</Typography
						>
					</li>
				</ul>
			</div>
			<div>
				<Typography component="h5" class="mb-3">FAQ</Typography>
				<ul class="flex flex-col gap-2">
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/faq#booking">
							Booking
						</Typography>
					</li>
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/faq#payment">
							Payment
						</Typography>
					</li>
					<li>
						<Typography component="a" class="underline underline-offset-1" href="/faq#privacy">
							Privacy Policy
						</Typography>
					</li>
				</ul>
			</div>
		</div>
		<div class="text-center">
			<Typography class="text-white">
				Copyright © 2023 Trainly Limited and its affiliated companies. All rights reserved
			</Typography>
		</div>
	</div>
</footer>
