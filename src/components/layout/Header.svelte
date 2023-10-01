<script>
	import Logo from "~/icons/LogoIcon.svelte";
	import AccountIcon from "~/icons/AccountIcon.svelte";
	import Typography from "~/components/Typography.svelte";
</script>

<header class="py-2 bg-background/95 backdrop-blur border-b border-solid border-border">
	<div class="flex justify-between gap-x-4 container">
		<div>
			<a href="/" class="flex gap-x-2 items-center text-primary">
				<Logo />
				<Typography component="h1" class="text-lg text-primary font-bold"
					>trainly</Typography
				>
			</a>
		</div>
		<div>
			<button
				class="rounded-full border border-solid p-1 flex items-center justify-center text-base select-none"
			>
				<AccountIcon />
			</button>
		</div>
	</div>
</header>
