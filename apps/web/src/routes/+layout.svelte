<script>
	import "../reset.css";
	import "../app.css";
	import Header from "~/components/layout/Header.svelte";
	import Head from "~/components/Head.svelte";
	import { page } from "$app/stores";
	import Footer from "~/components/layout/Footer.svelte";

	const defaultTitle = "Trainly: Search, Compare and Buy Cheap Train Tickets";
	const defaultDescription =
		"Trainly is a website for selling train tickets. Discover the easiest way to book train journeys with Trainly! Our user-friendly app simplifies train ticket bookings, offering instant access to schedules, seat availability, and exclusive deals. Whether you're planning a daily commute or a scenic railway adventure, Trainly connects you to your destination with comfort and convenience.";

	$: title = $page?.data?.meta?.title ? `${$page.data?.meta.title} | ${defaultTitle}` : defaultTitle;
	$: description = $page?.data?.meta?.description || defaultDescription;
	$: keywords = $page?.data?.meta?.keywords || ["Train tickets", "Trainly"];
</script>

<div class="relative flex min-h-screen flex-col">
	<Head {title} {description} {keywords} />
	<Header />
	<main>
		<slot />
	</main>
	<Footer />
</div>
