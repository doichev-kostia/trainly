<script lang="ts">
	import { cn } from "$lib/cn";

	export let component = "span";

	const classes = cn("font-roboto", $$props.class);
</script>

<svelte:element this={component} {...$$props} class={classes}><slot /></svelte:element>
