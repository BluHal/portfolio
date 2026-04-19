# Svelte 5 Refactoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio from Svelte 4 to Svelte 5 runes, add a11y, implement a Settings window with wallpaper (CSS patterns + URL) and 2-theme support (classic/dark).

**Architecture:** Shared reactive state lives in `src/lib/theme.svelte.ts` using Svelte 5 `$state`. CSS custom properties in `app.css` handle theme colors via `[data-theme]` on `<html>`. All components migrate from `export let` / `on:event` to `$props()` / `onevent` runes syntax.

**Tech Stack:** Svelte 5, SvelteKit 2, TypeScript, Tailwind CSS 3, Vite 5.

---

## File Map

| File                                    | Action    | Responsibility                                                         |
| --------------------------------------- | --------- | ---------------------------------------------------------------------- |
| `package.json`                          | Modify    | Upgrade svelte, vite-plugin-svelte, svelte-check, eslint-plugin-svelte |
| `src/lib/constants.ts`                  | Create    | Window default positions/sizes                                         |
| `src/lib/theme.svelte.ts`               | Create    | Shared `$state` for theme + wallpaper                                  |
| `src/app.css`                           | Modify    | CSS custom properties for both themes                                  |
| `tailwind.config.js`                    | Modify    | Colors reference CSS vars; fix trailing `;` bug                        |
| `src/routes/+layout.svelte`             | Modify    | `slot` → `{@render children()}`, apply `data-theme` effect             |
| `src/routes/+page.svelte`               | Modify    | Apply wallpaper via reactive style; remove `onMount` DOM hack          |
| `src/components/Window.svelte`          | Modify    | Full runes migration + a11y (role, aria-hidden, inert)                 |
| `src/components/Desktop.svelte`         | Modify    | Full runes migration; wire Settings button                             |
| `src/components/MonitorSettings.svelte` | Rewrite   | Settings content: wallpaper picker + theme toggle                      |
| `src/components/Taskbar.svelte`         | No change | Already minimal, no script                                             |
| `src/components/Projects.svelte`        | No change | No script                                                              |
| `src/components/MyWebSite.svelte`       | No change | No script                                                              |

---

## Task 1: Upgrade packages to Svelte 5

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Update devDependencies**

Replace the entire `devDependencies` block in `package.json`:

```json
"devDependencies": {
  "@sveltejs/adapter-auto": "^3.0.0",
  "@sveltejs/kit": "^2.0.0",
  "@sveltejs/vite-plugin-svelte": "^4.0.0",
  "@types/eslint": "^9.6.0",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.0.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-svelte": "^2.46.0",
  "globals": "^15.0.0",
  "postcss": "^8.4.41",
  "prettier": "^3.1.1",
  "prettier-plugin-svelte": "^3.1.2",
  "svelte": "^5.0.0",
  "svelte-check": "^4.0.0",
  "tailwindcss": "^3.4.7",
  "typescript": "^5.0.0",
  "typescript-eslint": "^8.0.0",
  "vite": "^5.0.3"
}
```

- [ ] **Step 2: Install**

```bash
npm install
```

Expected: no errors. If peer dependency warnings appear, they are non-blocking for Svelte 5 compatible packages.

- [ ] **Step 3: Verify Svelte version**

```bash
node -e "const s = require('./node_modules/svelte/package.json'); console.log(s.version)"
```

Expected: `5.x.x`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade to Svelte 5"
```

---

## Task 2: Create constants

**Files:**

- Create: `src/lib/constants.ts`

- [ ] **Step 1: Write constants file**

```typescript
export const WINDOW_DEFAULTS = {
	left: 400,
	top: 150,
	width: 700,
	height: 500
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add window layout constants"
```

---

## Task 3: Create shared theme state

**Files:**

- Create: `src/lib/theme.svelte.ts`

Note: the `.svelte.ts` extension is required for Svelte 5 runes to work in plain TypeScript files.

- [ ] **Step 1: Write theme state module**

```typescript
export type Theme = 'classic' | 'dark';
export type WallpaperType = 'teal' | 'dots' | 'bricks' | 'plaid' | 'waves' | 'custom';

export const themeState = $state<{
	theme: Theme;
	wallpaper: WallpaperType;
	wallpaperUrl: string;
}>({
	theme: 'classic',
	wallpaper: 'teal',
	wallpaperUrl: ''
});

/** Returns a CSS `background` shorthand string for the given wallpaper type. */
export function getWallpaperStyle(wallpaper: WallpaperType, url: string): string {
	switch (wallpaper) {
		case 'teal':
			return 'background: #008080';
		case 'dots':
			return 'background: radial-gradient(circle, #005050 1px, transparent 1px) 0 0 / 12px 12px #008080';
		case 'bricks':
			return [
				'background:',
				'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,.15) 20px, rgba(0,0,0,.15) 22px),',
				'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,.15) 10px, rgba(0,0,0,.15) 12px)',
				'#008080'
			].join(' ');
		case 'plaid':
			return [
				'background:',
				'repeating-linear-gradient(45deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 1px, transparent 0, transparent 50%) 0 0 / 8px 8px,',
				'repeating-linear-gradient(-45deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 1px, transparent 0, transparent 50%) 0 0 / 8px 8px',
				'#008080'
			].join(' ');
		case 'waves':
			return 'background: repeating-radial-gradient(circle at 0 0, transparent 0, #006666 5px) 0 0 / 20px 20px, #008080';
		case 'custom':
			return url ? `background: url('${url}') center / cover no-repeat` : 'background: #008080';
	}
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run check
```

Expected: 0 errors on the new file (warnings from old Svelte 4 components are expected and will be fixed in later tasks).

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme.svelte.ts
git commit -m "feat: add shared theme state with wallpaper helpers"
```

---

## Task 4: Add CSS custom properties and dark theme

**Files:**

- Modify: `src/app.css`

- [ ] **Step 1: Add theme variables after `@tailwind utilities;`**

Replace the entire `src/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
	font-family: 'px_sans_nouveaux';
	src: url('/fonts/px_sans_nouveaux.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}

:root {
	--win-grey: #c6c6c6;
	--win-blue: #000080;
	--win-dark-grey: #404040;
}

[data-theme='dark'] {
	--win-grey: #2d2d2d;
	--win-blue: #4a0080;
	--win-dark-grey: #888888;
}

body {
	font-family: 'px_sans_nouveaux', sans-serif;
	font-weight: 400;
	font-style: normal;
	width: 100dvw;
	height: 100dvh;
	overflow: hidden;
	padding: 0;
	margin: 0;
	image-rendering: pixelated;
}

.draggable {
	user-select: none;
	position: absolute;
}

.window {
	font-weight: 400;
	letter-spacing: 0.025em;
	border-top: 2px solid #efefef;
	border-left: 2px solid #efefef;
	border-right: 2px solid #000;
	border-bottom: 2px solid #000;
	font-family: arial, sans-serif;
	-webkit-font-smoothing: none;
	font-size: 12px;
}

.window-header {
	line-height: 1.4;
	border-top: 1px solid silver;
	border-left: 1px solid silver;
	border-right: 2px solid silver;
	border-bottom: 1px solid silver;
}

.window-content-wrapper {
	border-top: 2px solid #000;
	border-left: 2px solid #000;
	border-right: 2px solid silver;
	border-bottom: 2px solid silver;
}

.window-button {
	-moz-appearance: none;
	appearance: none;
	letter-spacing: 0.05em;
	border-left: 2px solid #ededed;
	border-top: 2px solid #ededed;
	border-right: 2px solid #404040;
	border-bottom: 2px solid #404040;
	z-index: 10;
}

.window-button:active {
	border-top: 2px solid #000;
	border-left: 2px solid #000;
	border-right: 2px solid #efefef;
	border-bottom: 2px solid #efefef;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app.css
git commit -m "feat: add CSS custom properties for classic and dark themes"
```

---

## Task 5: Update Tailwind config to use CSS vars

**Files:**

- Modify: `tailwind.config.js`

- [ ] **Step 1: Update colors**

Replace the entire `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'windows-grey': 'var(--win-grey)',
				'windows-dark-grey': 'var(--win-dark-grey)',
				'windows-blue': 'var(--win-blue)'
			}
		}
	},
	plugins: []
};
```

Note: fixes the trailing `;` bug in `'#000080;'` by replacing hardcoded values with CSS vars.

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "fix: use CSS vars in Tailwind config; fix trailing semicolon bug"
```

---

## Task 6: Migrate +layout.svelte

**Files:**

- Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Replace slot with Svelte 5 render syntax + theme effect**

Replace the entire `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	import { themeState } from '$lib/theme.svelte.js';

	let { children } = $props();

	$effect(() => {
		document.documentElement.setAttribute('data-theme', themeState.theme);
	});
</script>

{@render children()}
```

- [ ] **Step 2: Run check**

```bash
npm run check
```

Expected: no errors on this file.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "refactor: migrate layout to Svelte 5 runes"
```

---

## Task 7: Migrate +page.svelte

**Files:**

- Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Replace onMount DOM manipulation with reactive wallpaper style**

Replace the entire `src/routes/+page.svelte`:

```svelte
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
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "refactor: migrate page to Svelte 5; replace onMount wallpaper hack with reactive style"
```

---

## Task 8: Migrate Window.svelte to Svelte 5 + a11y

**Files:**

- Modify: `src/components/Window.svelte`

- [ ] **Step 1: Rewrite Window.svelte**

Replace the entire `src/components/Window.svelte`:

```svelte
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
		aria-label="Window controls"
		class="block h-[25px] relative text-left text-white bg-windows-blue px-3 py-1 pr-1 window-header line-h {fullscreen
			? ''
			: 'cursor-move'} mx-[3px] mt-[2px]"
		onmouseup={onMouseUp}
		onmousemove={onMouseMove}
		onmousedown={onMouseDown}
	>
		<span id="win-title-{title}">{title}</span>
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
	<svelte:component this={content} />
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
```

- [ ] **Step 2: Run check**

```bash
npm run check
```

Expected: 0 errors on Window.svelte.

- [ ] **Step 3: Commit**

```bash
git add src/components/Window.svelte
git commit -m "refactor: migrate Window.svelte to Svelte 5 runes; add a11y roles"
```

---

## Task 9: Migrate Desktop.svelte to Svelte 5 + wire Settings

**Files:**

- Modify: `src/components/Desktop.svelte`

- [ ] **Step 1: Rewrite Desktop.svelte**

Replace the entire `src/components/Desktop.svelte`:

```svelte
<script lang="ts">
	import type { Component } from 'svelte';
	import Window from '../components/Window.svelte';
	import MonitorSettings from './MonitorSettings.svelte';
	import MyWebSite from './MyWebSite.svelte';
	import Projects from './Projects.svelte';

	let showWindow = $state(false);
	let x = $state(0);
	let y = $state(0);
	let currentContent = $state<Component | null>(null);
	let windowTitle = $state('');
	let fullscreen = $state(false);

	function openWindow(
		event: MouseEvent,
		content: Component,
		title: string,
		openFullScreen: boolean
	) {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		x = rect.left + rect.width / 2;
		y = rect.top + rect.height / 2;
		currentContent = content;
		showWindow = true;
		windowTitle = title;
		fullscreen = openFullScreen;
	}

	function closeWindow() {
		showWindow = false;
		currentContent = null;
	}
</script>

<div class="h-full grid grid-rows-12 grid-flow-col gap-1 px-6 py-6">
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button
			class="relative cursor-pointer"
			aria-label="Open About Me"
			onclick={(e) => openWindow(e, MyWebSite, 'My Web Site', true)}
		>
			<img class="w-8 h-8" src="/icons/ie.png" alt="" />
			<span class="text-[8px] text-white">About Me</span>
		</button>
	</div>
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button
			class="relative cursor-pointer"
			aria-label="Open Projects"
			onclick={(e) => openWindow(e, Projects, 'My Projects', false)}
		>
			<img class="w-8 h-8" src="/icons/folder.png" alt="" />
			<span class="text-[8px] text-white">Projects</span>
		</button>
	</div>
	<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
		<button
			class="relative cursor-pointer"
			aria-label="Open Settings"
			onclick={(e) => openWindow(e, MonitorSettings, 'Display Properties', false)}
		>
			<img class="w-8 h-8" src="/icons/monitor_gear.png" alt="" />
			<span class="text-[8px] text-white">Settings</span>
		</button>
	</div>
</div>

<Window
	show={showWindow}
	close={closeWindow}
	content={currentContent}
	title={windowTitle}
	{fullscreen}
	{x}
	{y}
/>
```

- [ ] **Step 2: Run check**

```bash
npm run check
```

Expected: 0 errors on Desktop.svelte.

- [ ] **Step 3: Commit**

```bash
git add src/components/Desktop.svelte
git commit -m "refactor: migrate Desktop.svelte to Svelte 5 runes; wire up Settings button"
```

---

## Task 10: Rewrite MonitorSettings.svelte as Settings content

**Files:**

- Modify: `src/components/MonitorSettings.svelte`

This component is now rendered _inside_ the generic `Window` chrome (just like `Projects` and `MyWebSite`). It must NOT include its own window chrome.

- [ ] **Step 1: Rewrite MonitorSettings.svelte**

Replace the entire `src/components/MonitorSettings.svelte`:

```svelte
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
```

- [ ] **Step 2: Run full check**

```bash
npm run check
```

Expected: 0 errors across all files.

- [ ] **Step 3: Commit**

```bash
git add src/components/MonitorSettings.svelte
git commit -m "feat: implement Settings window with wallpaper picker and theme toggle"
```

---

## Task 11: Final verification

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no errors. If Prettier reformats, run `npm run format` then recommit.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 3: Manual smoke test**

```bash
npm run dev
```

Open `http://localhost:5173` and verify:

- [ ] Desktop icons render
- [ ] "About Me" opens fullscreen window
- [ ] "Projects" opens normal window with drag
- [ ] "Settings" opens Display Properties window
- [ ] Wallpaper buttons change desktop background live
- [ ] Custom URL field applies wallpaper when clicking Apply
- [ ] Classic/Dark toggle changes window header color live
- [ ] Close button resets window position

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup after Svelte 5 migration"
```
