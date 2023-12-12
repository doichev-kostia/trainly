<script lang="ts">
	import Typography from "~/components/Typography.svelte";
	import Button from "~/components/Button.svelte";

	// eslint-disable-next-line
	const pattern = `[A-Za-z \'\\-]{1,32}`;
</script>

<section>
	<div class="container max-w-7xl py-8">
		<header class="mb-4">
			<Typography component="h2" class="text-2xl">Contact Us</Typography>
		</header>

		<div>
			<form method="post" class="max-w-xl">
				<div class="mb-3">
					<label for="email" class="mb-2 block text-sm font-medium"> Email </label>
					<input
						type="email"
						name="email"
						id="email"
						required
						autocomplete="email"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div class="mb-3">
					<label for="firstName" class="mb-2 block text-sm font-medium"> First name </label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						required
						{pattern}
						autocomplete="given-name"
						title="First name should only contain letters, spaces, hyphens, and apostrophes."
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div class="mb-3">
					<label for="lastName" class="mb-2 block text-sm font-medium"> Last name </label>
					<input
						type="text"
						name="lastName"
						id="lastName"
						required
						{pattern}
						autocomplete="family-name"
						title="Last name should only contain letters, spaces, hyphens, and apostrophes."
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div class="mb-3">
					<label for="message" class="mb-2 block text-sm font-medium text-gray-900">Your message</label>
					<textarea
						id="message"
						rows="4"
						required
						name="message"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						placeholder="Write your thoughts here..."
					></textarea>
				</div>

				<div>
					<Button type="submit" class="w-full text-lg">Submit</Button>
				</div>
			</form>
		</div>
	</div>
</section>
