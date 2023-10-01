<script>
	import "../reset.css";
	import "../app.css";
	import Header from "~/components/layout/Header.svelte";
</script>

<div class="flex flex-col min-h-screen relative">
	<Header />
	<main>
		<slot />
	</main>
</div>
