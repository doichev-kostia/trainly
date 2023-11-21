<script lang="ts">
	import { onMount } from "svelte";

	const defaultTitle = "Trainly";
	const url = "https://trainly.doichevkostia.dev";
	let canonicalURL = new URL(url);

	onMount(() => {
		canonicalURL = new URL(window.location.pathname, url);
	});

	export let title: string = defaultTitle;
	const locale = "en_GB";
	const image = {
		src: "/logo.png",
		alt: "Trainly Logo",
	};

	const description =
		"Discover the easiest way to book train journeys with Trainly! Our user-friendly app simplifies train ticket bookings, offering instant access to schedules, seat availability, and exclusive deals. Whether you're planning a daily commute or a scenic railway adventure, Trainly connects you to your destination with comfort and convenience.";

	const og = {
		title,
		description,
		type: "website",
		image,
		url,
		locale,
	};

	const twitter = {
		title,
		description,
		card: "summary_large_image",
		image,
		locale,
		handle: "@TrainlyApp",
	};
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width" />
	<meta name="theme-color" content="hsla(142.1 76.2% 36.3%)" />

	<title>{title}</title>

	<link rel="canonical" href={canonicalURL.toString()} />
	<meta name="generator" content="SvelteKit" />
	<meta name="description" content={description} />

	<meta property="og:title" content={og.title} />
	<meta property="og:description" content={og.description} />
	<meta property="og:type" content={og.type} />
	<meta property="og:image" content={og.image.src} />
	<meta property="og:image:alt" content={og.image.alt} />
	<meta property="og:url" content={og.url} />
	<meta property="og:locale" content={og.locale} />
	<meta property="og:site_name" content={defaultTitle} />

	<meta name="twitter:title" content={twitter.title} />
	<meta name="twitter:description" content={twitter.description} />
	<meta name="twitter:card" content={twitter.card} />
	<meta name="twitter:image" content={twitter.image.src} />
	<meta name="twitter:image:alt" content={twitter.image.alt} />
	<meta name="twitter:site" content={twitter.handle} />

	<link rel="apple-touch-icon" sizes="192x192" href={image.src} />
	<link rel="mask-icon" href="favicon.svg" color="#16a34a" />
</svelte:head>
