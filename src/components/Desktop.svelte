<script lang="ts">
	import Window from '../components/Window.svelte';
	import MonitorSettings from './MonitorSettings.svelte';
	import Projects from './Projects.svelte';

	let showWindow = false;
	let currentContent: any = null;
	let windowTitle: string = '';

	function openWindow(content: any, title: string) {
		currentContent = content;
		showWindow = true;
		windowTitle = title;
	}

	function closeWindow() {
		showWindow = false;
		currentContent = null;
	}
</script>

<div class="h-full grid grid-rows-12 grid-flow-col gap-1 px-6 py-6">
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button class="relative cursor-pointer" on:click={() => openWindow(null, 'My Web Site')}>
			<img class="w-8 h-8" src="/icons/ie.png" alt="" />
			<span class="text-[8px] text-white">About Me</span>
		</button>
	</div>
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button class="relative cursor-pointer" on:click={() => openWindow(Projects, 'My Projects')}>
			<img class="w-8 h-8" src="/icons/folder.png" alt="" />
			<span class="text-[8px] text-white">Projects</span>
		</button>
	</div>
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button class="relative cursor-pointer">
			<img class="w-8 h-8" src="/icons/monitor_gear.png" alt="" />
			<span class="text-[8px] text-white">Settings</span>
		</button>
	</div>
</div>

<Window show={showWindow} close={closeWindow} content={currentContent} title={windowTitle} />
<MonitorSettings show={showWindow} close={closeWindow} content={currentContent} title={windowTitle} />
