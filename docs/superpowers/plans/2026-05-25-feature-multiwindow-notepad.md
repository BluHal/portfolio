# Multi-window Support + Notepad — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the desktop from single-window to multi-window: multiple windows can be open simultaneously, each with its own z-index and drag position. Windows appear in the taskbar. Add a Notepad component as a first example. 

**Important merge note:** This plan modifies `src/components/Taskbar.svelte`. If the `2026-05-25-feature-taskbar` plan has already been merged, read the current state of that file before editing — do NOT overwrite the clock and Start Menu code.

**Tech Stack:** Svelte 5 runes (`$state`, `$derived`, `$props`), TypeScript, Tailwind CSS 3. Never use Svelte 4 stores.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/windows.svelte.ts` | Create | Shared state for open windows (Desktop → Taskbar) |
| `src/components/Window.svelte` | Modify | Add `zIndex`, `onFocus`, `minimized` props |
| `src/components/Desktop.svelte` | Rewrite | Multi-window array; writes to shared windows state |
| `src/components/Taskbar.svelte` | Modify | Read shared state; render taskbar buttons per window |
| `src/components/Notepad.svelte` | Create | Simple editable text window |

---

## Task 1: Create shared windows state

**File:** `src/lib/windows.svelte.ts`

This module follows the same pattern as `src/lib/theme.svelte.ts`. Desktop writes to it; Taskbar reads from it.

- [ ] **Step 1: Create the file**

```typescript
export interface WindowEntry {
  id: number;
  title: string;
  minimized: boolean;
  focused: boolean;
}

export const windowsState = $state<{ list: WindowEntry[] }>({ list: [] });
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/windows.svelte.ts
git commit -m "feat: add shared windows state for taskbar integration"
```

---

## Task 2: Update Window.svelte

**File:** `src/components/Window.svelte`

Read the current file before editing. Add three new optional props without removing any existing props or behavior.

- [ ] **Step 1: Extend the Props interface**

Add to the existing `interface Props`:

```typescript
zIndex?: number;       // applied as CSS z-index on the root div
onFocus?: () => void;  // called when user clicks anywhere on the window
minimized?: boolean;   // hides the window without removing it from DOM
```

With defaults in `$props()`:

```typescript
let {
  // ...existing props...,
  zIndex = 100,
  onFocus = () => {},
  minimized = false,
}: Props = $props();
```

- [ ] **Step 2: Apply zIndex and minimized to the root div**

Update the root `<div>` style attribute to include `z-index: {zIndex}` and apply `display: none` when `minimized` is true:

```svelte
<div
  role="dialog"
  aria-label={title}
  aria-hidden={!show || minimized}
  inert={!show || minimized}
  style="z-index: {zIndex}; display: {minimized ? 'none' : ''}; left: {fullscreen ? '0px' : `${left}px`}; top: {fullscreen ? '0px' : `${top}px`}; --modal-x: calc({x}px - {WINDOW_DEFAULTS.left}px); --modal-y: calc({y}px - {WINDOW_DEFAULTS.top}px);"
  class="draggable bg-windows-grey {fullscreen ? 'w-full h-[calc(100%-27px)]' : 'w-[700px] h-[500px]'} window modal-content"
  class:open={show}
  onmousedown={() => { onFocus(); }}
>
```

Note: the existing `onmousedown={onMouseDown}` on the `<header>` stays as-is for drag logic. The root div `onmousedown` only calls `onFocus()` — this ensures clicking anywhere on the window brings it to front, while drag still only works via the header.

- [ ] **Step 3: Check**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Window.svelte
git commit -m "feat: add zIndex, onFocus, minimized props to Window"
```

---

## Task 3: Rewrite Desktop.svelte for multi-window

**File:** `src/components/Desktop.svelte`

- [ ] **Step 1: Replace state**

Replace the single-window state with a windows array. The desktop icon layout (HTML) does NOT change — only the `<script>` block and the `<Window>` rendering change.

```typescript
import type { Component } from 'svelte';
import { onMount, onDestroy } from 'svelte';
import { windowsState } from '$lib/windows.svelte.js';
import Window from './Window.svelte';
import MonitorSettings from './MonitorSettings.svelte';
import MyWebSite from './MyWebSite.svelte';
import Projects from './Projects.svelte';
import Notepad from './Notepad.svelte';

interface WindowInstance {
  id: number;
  content: Component;
  title: string;
  fullscreen: boolean;
  minimized: boolean;
  focused: boolean;
  spawnX: number;
  spawnY: number;
  zIndex: number;
}

let windows = $state<WindowInstance[]>([]);
let nextId = $state(0);
let topZ = $state(100);

function sync() {
  windowsState.list = windows.map(w => ({
    id: w.id,
    title: w.title,
    minimized: w.minimized,
    focused: w.focused,
  }));
}

function openWindow(event: MouseEvent, content: Component, title: string, fullscreen: boolean) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const id = nextId++;
  topZ++;
  windows.forEach(w => (w.focused = false));
  windows.push({
    id, content, title, fullscreen,
    minimized: false,
    focused: true,
    spawnX: rect.left + rect.width / 2,
    spawnY: rect.top + rect.height / 2,
    zIndex: topZ,
  });
  sync();
}

function closeWindow(id: number) {
  windows = windows.filter(w => w.id !== id);
  sync();
}

function minimizeWindow(id: number) {
  const w = windows.find(w => w.id === id);
  if (w) { w.minimized = true; w.focused = false; sync(); }
}

function focusWindow(id: number) {
  const w = windows.find(w => w.id === id);
  if (!w) return;
  topZ++;
  windows.forEach(win => (win.focused = false));
  w.zIndex = topZ;
  w.minimized = false;
  w.focused = true;
  sync();
}

function handleTaskbarFocus(e: Event) {
  focusWindow((e as CustomEvent<{ id: number }>).detail.id);
}

onMount(() => window.addEventListener('taskbar-focus', handleTaskbarFocus));
onDestroy(() => window.removeEventListener('taskbar-focus', handleTaskbarFocus));
```

- [ ] **Step 2: Update the template**

Keep the desktop icons div unchanged. Replace the single `<Window ... />` at the bottom with an `{#each}` loop:

```svelte
{#each windows as win (win.id)}
  <Window
    title={win.title}
    show={!win.minimized}
    minimized={win.minimized}
    content={win.content}
    fullscreen={win.fullscreen}
    x={win.spawnX}
    y={win.spawnY}
    zIndex={win.zIndex}
    close={() => closeWindow(win.id)}
    minimize={() => minimizeWindow(win.id)}
    onFocus={() => focusWindow(win.id)}
  />
{/each}
```

- [ ] **Step 3: Add Notepad icon to the desktop icons grid**

After the existing 3 icons (About Me, Projects, Settings), add:

```svelte
<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
  <button
    class="relative cursor-pointer"
    aria-label="Open Notepad"
    onclick={(e) => openWindow(e, Notepad, 'Notepad — README.TXT', false)}
  >
    <img class="w-8 h-8" src="/icons/about-me.png" alt="" />
    <span class="text-[8px] text-white">Notepad</span>
  </button>
</div>
```

- [ ] **Step 4: Check**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Desktop.svelte
git commit -m "feat: multi-window desktop with z-index management and taskbar sync"
```

---

## Task 4: Add taskbar window buttons

**File:** `src/components/Taskbar.svelte`

**Read the current file first.** Do NOT remove existing code (clock, Start Menu). Only add the import and the window buttons section.

- [ ] **Step 1: Add import**

At the top of `<script lang="ts">`, add:

```typescript
import { windowsState } from '$lib/windows.svelte.js';
```

- [ ] **Step 2: Add window buttons between Start button and clock**

Inside the `.task-bar` div, between the start button wrapper and the clock display, add:

```svelte
<div class="window-buttons">
  {#each windowsState.list as win (win.id)}
    <button
      class="window-button taskbar-win-btn"
      class:active={win.focused && !win.minimized}
      onclick={() => window.dispatchEvent(new CustomEvent('taskbar-focus', { detail: { id: win.id } }))}
      title={win.title}
    >
      {win.title.length > 16 ? win.title.slice(0, 15) + '…' : win.title}
    </button>
  {/each}
</div>
```

- [ ] **Step 3: Add styles**

Add to the `<style>` block (without removing existing styles):

```css
.window-buttons {
  display: flex;
  gap: 2px;
  align-items: center;
  margin-left: 4px;
  flex: 1;
  overflow: hidden;
}

.taskbar-win-btn {
  min-width: 80px;
  max-width: 140px;
  height: 22px;
  font-size: 11px;
  font-family: 'px_sans_nouveaux', sans-serif;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.taskbar-win-btn.active {
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  border-right: 2px solid #efefef;
  border-bottom: 2px solid #efefef;
}
```

- [ ] **Step 4: Check and build**

```bash
npm run check && npm run build
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Taskbar.svelte
git commit -m "feat: add open-window buttons to taskbar"
```

---

## Task 5: Create Notepad component

**File:** `src/components/Notepad.svelte`

- [ ] **Step 1: Create the component**

```svelte
<script lang="ts">
  const defaultText = `README.TXT — Sistema di Nicola
════════════════════════════════════

Ciao! Sono Nicola, developer e
creatore di questo strano sistema.

PROGRAMMI INSTALLATI:
  About Me ............. [IE icon]
  Projects ............. [Folder]
  Display Settings ..... [Gear]
  Minesweeper .......... [💣]
  Notepad .............. [questo]

SPECIFICHE DI SISTEMA:
  OS  : Windows 95.svelte
  RAM : ∞ MB di passione
  CPU : Procrastination 9000™
  GPU : CRT Phosphor Glow Engine

EASTER EGG:
  Prova il codice Konami.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ありがとうございます
このポートフォリオを見てくれて
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  let text = $state(defaultText);
</script>

<div class="notepad-wrapper">
  <div class="notepad-menu">
    <span>File</span>
    <span>Edit</span>
    <span>Format</span>
  </div>
  <textarea
    bind:value={text}
    class="notepad-area"
    spellcheck="false"
    aria-label="Notepad text area"
  ></textarea>
</div>

<style>
  .notepad-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--win-grey);
  }

  .notepad-menu {
    height: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 8px;
    border-bottom: 1px solid var(--win-dark-grey);
    font-size: 10px;
    font-family: 'px_sans_nouveaux', sans-serif;
  }

  .notepad-menu span {
    cursor: pointer;
  }

  .notepad-menu span:hover {
    text-decoration: underline;
  }

  .notepad-area {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: #fff;
    color: #000;
    border: none;
    outline: none;
    resize: none;
    flex: 1;
    width: 100%;
    padding: 8px;
    -webkit-font-smoothing: none;
    box-sizing: border-box;
  }
</style>
```

- [ ] **Step 2: Check and build**

```bash
npm run check && npm run build
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Notepad.svelte
git commit -m "feat: add Notepad component with pre-filled README"
```

---

## Task 6: Final verification

- [ ] Multiple windows can be open simultaneously (open About Me, then Projects — both visible)
- [ ] Clicking a window brings it to front (z-index increases)
- [ ] Clicking the minimize button hides the window (does NOT close it)
- [ ] Each open window shows a button in the taskbar
- [ ] Clicking a taskbar button restores and focuses the window
- [ ] Active/focused window button appears pressed in taskbar
- [ ] Closing a window removes its taskbar button
- [ ] Notepad icon appears on desktop, opens an editable text window
- [ ] Notepad text is editable
- [ ] Taskbar clock and Start Menu still work (not broken by this change)
- [ ] `npm run build` passes with 0 errors
