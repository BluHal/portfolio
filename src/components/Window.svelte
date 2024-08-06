<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let title = 'My Projects';
	export let show = false;
	export let close = () => {};
	export let minimize = () => {};
	export let content: typeof SvelteComponent | null = null;

	let moving = false;
	let left = 400;
	let top = 150;

	function onMouseDown() {
		moving = true;
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			left += e.movementX;
			top += e.movementY;
		}
	}

	function onMouseUp() {
		moving = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if show}
	<div
		style="left: {left}px; top: {top}px;"
		class="draggable bg-windows-grey w-[700px] h-[500px] window"
	>
		<header
			class="block h-[25px] relative text-left text-white bg-windows-blue px-3 py-1 pr-1 window-header line-h cursor-move mx-[3px] mt-[2px]"
			on:mouseup={onMouseUp}
			on:mousemove={onMouseMove}
			on:mousedown={onMouseDown}
		>
			<span>{title}</span>
			<button
				class="window-button block relative font-bold text-black bg-[silver] float-right h-4 w-4 z-20 p-0"
				on:click={close}
			>
				<img class="absolute left-[1px] top-0" src="/icons/close-icon.png" alt="" />
			</button>
			<button
				class="window-button block relative font-bold text-black bg-[silver] float-right h-4 w-4 z-20 p-0 mr-1"
				on:click={minimize}
			>
				<img class="absolute left-[1px] top-0" src="/icons/minimize-icon.png" alt="" />
			</button>
		</header>
		<div class="p-1 pb-8 w-full h-full">
			<div class="bg-white w-full h-full window-content-wrapper">
				<svelte:component this={content} />
			</div>
		</div>
	</div>
{/if}

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
</style>
