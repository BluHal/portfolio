<script lang="ts">
	import '../app.css';
	import { themeState } from '$lib/theme.svelte.js';

	let { children } = $props();

	$effect(() => {
		document.documentElement.setAttribute('data-theme', themeState.theme);
	});
</script>

{@render children()}
