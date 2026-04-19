<script lang="ts">
	import type { Component } from 'svelte';
	import { WINDOW_DEFAULTS } from '$lib/constants.js';

	interface Props {
		title?: string;
		show?: boolean;
		close?: () => void;
		minimize?: () => void;
		content?: Component | null;
		x?: number;
		y?: number;
		fullscreen?: boolean;
	}

	let {
		title = '',
		show = false,
		close = () => {},
		minimize = () => {},
		content = null,
		x = 0,
		y = 0,
		fullscreen = false
	}: Props = $props();

	let moving = $state(false);
	let left = $state(WINDOW_DEFAULTS.left);
	let top = $state(WINDOW_DEFAULTS.top);

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

	function handleClose() {
		left = WINDOW_DEFAULTS.left;
		top = WINDOW_DEFAULTS.top;
		close();
	}
</script>

<div
	role="dialog"
	aria-label={title}
	aria-hidden={!show}
	inert={!show}
	style="left: {fullscreen ? '0px' : `${left}px`}; top: {fullscreen
		? '0px'
		: `${top}px`}; --modal-x: calc({x}px - {WINDOW_DEFAULTS.left}px); --modal-y: calc({y}px - {WINDOW_DEFAULTS.top}px);"
	class="draggable bg-windows-grey {fullscreen
		? 'w-full h-[calc(100%-27px)]'
		: 'w-[700px] h-[500px]'} window modal-content"
	class:open={show}
>
	<header
		role="toolbar"
		tabindex="0"
		aria-label="Window controls"
		class="block h-[25px] relative text-left text-white bg-windows-blue px-3 py-1 pr-1 window-header line-h {fullscreen
			? ''
			: 'cursor-move'} mx-[3px] mt-[2px]"
		onmousedown={onMouseDown}
	>
		<span>{title}</span>
		<button
			class="window-button block relative font-bold text-black bg-[silver] float-right h-4 w-4 z-20 p-0"
			aria-label="Close"
			onclick={handleClose}
		>
			<img class="absolute left-[1px] top-0" src="/icons/close-icon.png" alt="" />
		</button>
		<button
			class="window-button block relative font-bold text-black bg-[silver] float-right h-4 w-4 z-20 p-0 mr-1"
			aria-label="Minimize"
			onclick={minimize}
		>
			<img class="absolute left-[1px] top-0" src="/icons/minimize-icon.png" alt="" />
		</button>
	</header>
	{#if content}
		{@const DynamicComponent = content}
		<DynamicComponent />
	{/if}
</div>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<style>
	.modal-content {
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
