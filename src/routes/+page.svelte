<script lang="ts">
	import { onMount } from 'svelte';
	import Taskbar from '../components/Taskbar.svelte';
	import Desktop from '../components/Desktop.svelte';
	let selectedWallpaper = 'monocolor-wallpaper.png';

	onMount(() => {
		document.documentElement.style.backgroundImage = `url('/images/${selectedWallpaper}')`;
		document.documentElement.style.backgroundSize = `cover`;
		document.documentElement.style.backgroundRepeat = `no-repeat`;
	});
</script>

<Desktop />
<Taskbar />
