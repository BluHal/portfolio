<script lang="ts">
	import { themeState, getWallpaperStyle, type WallpaperType } from '$lib/theme.svelte.js';

	const wallpapers: { type: WallpaperType; label: string }[] = [
		{ type: 'teal', label: 'Teal' },
		{ type: 'dots', label: 'Dots' },
		{ type: 'bricks', label: 'Bricks' },
		{ type: 'plaid', label: 'Plaid' },
		{ type: 'waves', label: 'Waves' }
	];

	let urlInput = $state(themeState.wallpaperUrl);

	function applyUrl() {
		themeState.wallpaper = 'custom';
		themeState.wallpaperUrl = urlInput;
	}
</script>

<div class="p-3 h-full overflow-auto bg-windows-grey text-xs">
	<section>
		<p class="font-bold mb-2">Background</p>
		<div class="flex gap-2 flex-wrap mb-2">
			{#each wallpapers as wp}
				<button
					style={getWallpaperStyle(wp.type, '')}
					class="w-12 h-10 border-2 {themeState.wallpaper === wp.type
						? 'border-windows-blue'
						: 'border-windows-dark-grey'}"
					aria-label={wp.label}
					aria-pressed={themeState.wallpaper === wp.type}
					onclick={() => {
						themeState.wallpaper = wp.type;
					}}
				></button>
			{/each}
		</div>
		<div class="flex gap-1 mt-1">
			<input
				type="url"
				placeholder="Wallpaper URL..."
				bind:value={urlInput}
				class="border border-windows-dark-grey px-1 py-0.5 flex-1 bg-white text-black"
				aria-label="Custom wallpaper URL"
			/>
			<button class="window-button px-2 py-0.5" onclick={applyUrl}>Apply</button>
		</div>
	</section>

	<hr class="my-3 border-windows-dark-grey" />

	<section>
		<p class="font-bold mb-2">Appearance</p>
		<div class="flex gap-2">
			<button
				class="window-button px-3 py-1 {themeState.theme === 'classic' ? 'font-bold' : ''}"
				aria-pressed={themeState.theme === 'classic'}
				onclick={() => {
					themeState.theme = 'classic';
				}}
			>
				Classic
			</button>
			<button
				class="window-button px-3 py-1 {themeState.theme === 'dark' ? 'font-bold' : ''}"
				aria-pressed={themeState.theme === 'dark'}
				onclick={() => {
					themeState.theme = 'dark';
				}}
			>
				Dark
			</button>
		</div>
	</section>
</div>
