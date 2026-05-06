<script lang="ts">
	interface Props {
		data: object;
	}

	let { data }: Props = $props();

	// Escape `<` so a stray closing tag inside string values can't break out of the JSON-LD block.
	// Closing tag is built from fragments so source never contains a literal closing script tag
	// (otherwise both Svelte's compiler and prettier choke).
	const json = $derived(JSON.stringify(data).replace(/</g, '\\u003c'));
	const tag = $derived('<script type="application/ld+json">' + json + '<' + '/script>');
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html tag}
</svelte:head>
