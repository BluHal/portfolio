<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let title = '';
	export let show = false;
	export let close = () => {};
	export let minimize = () => {};
	export let content: typeof SvelteComponent | null = null;
	export let x = 0;
	export let y = 0;
	export let fullscreen = false;

	let moving = false;
	let left = 400;
	let top = 150;

	function onMouseDown() {
		if (fullscreen) return;
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
<div
	style="left: {fullscreen ? '0px' : `${left}px`}; top: {fullscreen
		? '0px'
		: `${top}px`}; --modal-x: calc({x}px - 400px); --modal-y: calc({y}px - 150px);"
	class="draggable bg-windows-grey {fullscreen
		? 'w-full h-[calc(100%-27px)]'
		: 'w-[700px] h-[500px]'} window modal-content"
	class:open={show}
>
	<header
		class="block h-[25px] relative text-left text-white bg-windows-blue px-3 py-1 pr-1 window-header line-h {fullscreen
			? ''
			: 'cursor-move'} mx-[3px] mt-[2px]"
		on:mouseup={onMouseUp}
		on:mousemove={onMouseMove}
		on:mousedown={onMouseDown}
	>
		<span>{title}</span>
		<button
			class="window-button block relative font-bold text-black bg-[silver] float-right h-4 w-4 z-20 p-0"
			on:click={() => {
				left = 400;
				top = 150;
				close();
			}}
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
	<svelte:component this={content} />
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.modal-content {
		transition: opacity 0.3s ease-in-out;
		opacity: 0;
		transform-origin: var(--modal-x) var(--modal-y);
		transform: scale(0);
		transition: transform 0.3s ease-in-out;
	}

	.modal-content.open {
		transform: scale(1);
		opacity: 1;
	}
</style>
