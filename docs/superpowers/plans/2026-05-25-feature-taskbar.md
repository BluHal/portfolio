# Taskbar Clock + Start Menu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live clock to the taskbar's right corner and a functional Start Menu popup that opens above the taskbar when clicking the Start button.

**Aesthetic:** Windows 95 faithful in border/layout structure, with retro-futuristic Japanese 90s accents — neon cyan/pink glows, deep purple gradients, katakana as decorative text. Reference the existing `MyWebSite.svelte` which already uses katakana labels (`フロント`, `バックエンド`).

**Tech Stack:** Svelte 5 runes (`$state`, `$derived`, `$props`), TypeScript, Tailwind CSS 3. Never use Svelte 4 stores.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Taskbar.svelte` | Modify | Only file touched — adds clock and Start Menu |

---

## Task 1: Taskbar Clock

**File:** `src/components/Taskbar.svelte`

- [ ] **Step 1: Add clock state and lifecycle**

At the top of the `<script lang="ts">` block, add:

```typescript
import { onMount, onDestroy } from 'svelte';

let time = $state('00:00');
let timer: ReturnType<typeof setInterval>;

onMount(() => {
  const tick = () => {
    time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  timer = setInterval(tick, 1000);
});

onDestroy(() => clearInterval(timer));
```

- [ ] **Step 2: Add clock element to the taskbar div**

Inside the `.task-bar` div, after the start button wrapper, add the clock. It must be absolutely positioned to the right. Add inside the existing `<div class="... task-bar ...">`:

```svelte
<div class="clock-display window-button" aria-label="System clock" role="status">
  {time}
</div>
```

- [ ] **Step 3: Add clock styles to the `<style>` block**

```css
.clock-display {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px 8px;
  font-family: 'px_sans_nouveaux', sans-serif;
  font-size: 11px;
  min-width: 60px;
  text-align: center;
  color: #000;
  text-shadow: 0 0 5px #00FFFF, 0 0 10px #00FFFF66;
}
```

Note: `.window-button` class from `src/app.css` provides the Win95 sunken border effect automatically.

- [ ] **Step 4: Verify**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Taskbar.svelte
git commit -m "feat: add live clock to taskbar with neon glow"
```

---

## Task 2: Start Menu Popup

**File:** `src/components/Taskbar.svelte`

- [ ] **Step 1: Add menu state**

In `<script lang="ts">`, add after the clock state:

```typescript
let menuOpen = $state(false);
let menuEl = $state<HTMLElement | null>(null);

function handleOutsideClick(e: MouseEvent) {
  if (menuOpen && menuEl && !menuEl.contains(e.target as Node)) {
    menuOpen = false;
  }
}
```

- [ ] **Step 2: Add the Start Menu HTML**

Replace the existing `<button class="start-button-wrapper">` with:

```svelte
<svelte:window onclick={handleOutsideClick} />

<button
  class="start-button-wrapper"
  class:pressed={menuOpen}
  aria-label="Start"
  aria-expanded={menuOpen}
  onclick={() => (menuOpen = !menuOpen)}
>
  <div
    class="bg-no-repeat w-[45px] h-[14px]"
    style="background-image: url(/icons/start-button.png);"
  ></div>
</button>

{#if menuOpen}
  <div class="start-menu" bind:this={menuEl} role="menu" aria-label="Start Menu">
    <!-- Sidebar -->
    <div class="start-menu-sidebar">
      <span class="sidebar-text">ウィンドウズ 95</span>
      <img src="/icons/windows.png" width="20" height="20" alt="Windows logo" />
    </div>

    <!-- Items -->
    <div class="start-menu-items">
      <button class="menu-item" role="menuitem" onclick={() => (menuOpen = false)}>
        <img src="/icons/folder.png" width="16" height="16" alt="" />
        Programs
      </button>
      <button class="menu-item" role="menuitem" onclick={() => (menuOpen = false)}>
        <img src="/icons/ie.png" width="16" height="16" alt="" />
        Documents
      </button>
      <button class="menu-item" role="menuitem" onclick={() => (menuOpen = false)}>
        <img src="/icons/monitor_gear.png" width="16" height="16" alt="" />
        Settings
      </button>
      <hr class="menu-separator" />
      <button class="menu-item shutdown" role="menuitem" onclick={() => (menuOpen = false)}>
        Shut Down...
      </button>
    </div>
  </div>
{/if}
```

- [ ] **Step 3: Add Start Menu styles**

Add to the `<style>` block:

```css
.pressed {
  border-top: 2px solid #000;
  border-left: 2px solid #000;
  border-right: 2px solid #efefef;
  border-bottom: 2px solid #efefef;
}

.start-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 200px;
  display: flex;
  flex-direction: row;
  z-index: 200;
  border-top: 2px solid #efefef;
  border-left: 2px solid #efefef;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  animation: menu-open 0.12s ease-out;
}

@keyframes menu-open {
  from { transform: scaleY(0); opacity: 0; transform-origin: bottom left; }
  to   { transform: scaleY(1); opacity: 1; transform-origin: bottom left; }
}

.start-menu-sidebar {
  width: 30px;
  background: linear-gradient(to top, #000080, #1a0040);
  box-shadow: inset -2px 0 0 #FF00AA;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 8px;
  gap: 6px;
  flex-shrink: 0;
}

.sidebar-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: white;
  font-size: 9px;
  letter-spacing: 3px;
  opacity: 0.9;
  font-family: 'px_sans_nouveaux', sans-serif;
}

.start-menu-items {
  flex: 1;
  background: var(--win-grey);
  padding: 4px 0;
  border-left: 1px solid #888;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 3px 12px 3px 8px;
  font-size: 11px;
  font-family: 'px_sans_nouveaux', sans-serif;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
}

.menu-item:hover {
  background: var(--win-blue);
  color: white;
  text-shadow: 0 0 4px #00FFFF, 0 0 8px #00FFFF66;
}

.menu-item.shutdown {
  color: #880000;
}

.menu-item.shutdown:hover {
  color: white;
  text-shadow: 0 0 4px #FF4444;
}

.menu-separator {
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
  margin: 3px 4px;
}
```

- [ ] **Step 4: Full check and build**

```bash
npm run check && npm run build
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Taskbar.svelte
git commit -m "feat: add Start Menu popup with sidebar, neon hover, and katakana branding"
```

---

## Task 3: Final verification

- [ ] Start button click toggles menu open/closed
- [ ] Menu appears above taskbar, anchored left
- [ ] Clicking outside the menu closes it
- [ ] Start button border inverts when menu is open (pressed state)
- [ ] Sidebar shows gradient from navy → deep purple with hot-pink right border
- [ ] "ウィンドウズ 95" text is vertical, rotated, white
- [ ] Menu item hover shows blue background with cyan neon glow
- [ ] Clock shows correct HH:MM in bottom-right, updates every second
- [ ] Clock has cyan glow visible
- [ ] `npm run build` passes with 0 errors
