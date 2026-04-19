<script lang="ts">
	import { themeState, getWallpaperStyle } from '$lib/theme.svelte.js';
	import Taskbar from '../components/Taskbar.svelte';
	import Desktop from '../components/Desktop.svelte';
</script>

<div
	class="w-dvw h-dvh overflow-hidden"
	style={getWallpaperStyle(themeState.wallpaper, themeState.wallpaperUrl)}
>
	<Desktop />
	<Taskbar />
</div>
