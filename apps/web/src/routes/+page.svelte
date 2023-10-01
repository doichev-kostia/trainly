<script lang="ts">
	import type { PageData } from "./$types";
	import Typography from "~/components/Typography.svelte";
	import Button from "~/components/Button.svelte";

	export let data: PageData;

	let from = data.from ?? "";
	let to = data.to ?? "";
	let date = data.date ?? "";

	$: console.log(from, to, date);
</script>

<section class="pt-8">
	<Typography component="h2" class="text-2xl font-semibold text-foreground pl-2">
		My journey
	</Typography>
	<div>
		<form method="GET" action="/book" class="p-4">
			<div class="mb-3 flex flex-col">
				<div class="flex flex-col gap-y-3 mb-4">
					<input value={from} placeholder="From" class="w-full" name="from" />
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
</section>
