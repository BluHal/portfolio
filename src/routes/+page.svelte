<script lang="ts">
	import { themeState, getWallpaperStyle } from '$lib/theme.svelte.js';
	import Taskbar from '../components/Taskbar.svelte';
	import Desktop from '../components/Desktop.svelte';

	const wallpaperStyle = $derived(
		getWallpaperStyle(themeState.wallpaper, themeState.wallpaperUrl)
	);
</script>

<div
	class="w-dvw h-dvh overflow-hidden"
	style={wallpaperStyle}
>
	<Desktop />
	<Taskbar />
</div>
