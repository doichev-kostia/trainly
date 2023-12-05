<script>
	import "../reset.css";
	import "../app.css";
	import Header from "~/components/layout/Header.svelte";
	import Head from "~/components/Head.svelte";
	import { page } from "$app/stores";
	import Footer from "~/components/layout/Footer.svelte";

	const defaultTitle = "Trainly: Search, Compare and Buy Cheap Train Tickets";
	$: title = $page?.data?.title ? `${$page.data.title} | ${defaultTitle}` : defaultTitle;
</script>

<div class="relative flex min-h-screen flex-col">
	<Head {title} />
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>
