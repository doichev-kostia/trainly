<script>
	import Logo from "~/icons/LogoIcon.svelte";
	import AccountIcon from "~/icons/AccountIcon.svelte";
	import Typography from "~/components/Typography.svelte";
</script>

<header class="bg-background/95 border-border border-b border-solid py-2 backdrop-blur">
	<div class="container flex justify-between gap-x-4">
		<div>
			<a href="/" class="text-primary flex items-center gap-x-2">
				<Logo />
				<Typography component="h3" class="text-primary text-lg font-bold">trainly</Typography>
			</a>
		</div>
		<div>
			<button class="flex select-none items-center justify-center rounded-full border border-solid p-1 text-base">
				<AccountIcon />
			</button>
		</div>
	</div>
</header>
