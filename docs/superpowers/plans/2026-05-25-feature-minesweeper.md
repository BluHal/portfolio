# Minesweeper Game — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fully playable Minesweeper (9×9, 10 mines) as a new desktop icon and window component.

**Aesthetic:** Windows 95 cell borders preserved. Number colors replaced with neon palette (cyan, hot pink, purple) with CSS glow effects — the structural Win95 authenticity stays in the borders, the retro-futuristic Japanese 90s vibe lives in the colors and typography.

**Tech Stack:** Svelte 5 runes (`$state`, `$derived`, `$props`), TypeScript, Tailwind CSS 3. Never use Svelte 4 stores.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Minesweeper.svelte` | Create | Full game logic and UI |
| `src/components/Desktop.svelte` | Modify | Add Minesweeper desktop icon |

---

## Task 1: Create Minesweeper component

**File:** `src/components/Minesweeper.svelte`

### Types and constants

- [ ] **Step 1: Define types and constants in `<script lang="ts">`**

```typescript
import { onMount, onDestroy } from 'svelte';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINE_COUNT = 10;

const NUMBER_COLORS: Record<number, string> = {
  1: '#00FFFF',
  2: '#FF00AA',
  3: '#FF4400',
  4: '#8800FF',
  5: '#FF6600',
  6: '#00FFAA',
  7: '#FFFFFF',
  8: '#888888',
};

const NUMBER_GLOWS: Record<number, string> = {
  1: '0 0 4px #00FFFF',
  2: '0 0 4px #FF00AA',
  3: '0 0 4px #FF4400',
  4: '0 0 4px #8800FF',
  5: '0 0 3px #FF6600',
  6: '0 0 3px #00FFAA',
  7: 'none',
  8: 'none',
};
```

### State

- [ ] **Step 2: Add game state**

```typescript
let board = $state<Cell[][]>([]);
let gameStatus = $state<'idle' | 'playing' | 'won' | 'lost'>('idle');
let minesLeft = $state(MINE_COUNT);
let timeElapsed = $state(0);
let firstClick = $state(true);
let timer: ReturnType<typeof setInterval> | null = null;
```

### Board initialization

- [ ] **Step 3: Implement `initBoard()`**

```typescript
function initBoard() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
  gameStatus = 'idle';
  minesLeft = MINE_COUNT;
  timeElapsed = 0;
  firstClick = true;
  if (timer) { clearInterval(timer); timer = null; }
}
```

### Mine placement

- [ ] **Step 4: Implement `placeMines(safeRow, safeCol)`**

Places `MINE_COUNT` mines randomly, never on `(safeRow, safeCol)`. After placement, computes `adjacentMines` for every cell.

```typescript
function placeMines(safeRow: number, safeCol: number) {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if ((r === safeRow && c === safeCol) || board[r][c].isMine) continue;
    board[r][c].isMine = true;
    placed++;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
}
```

### Reveal logic

- [ ] **Step 5: Implement `reveal(row, col)` with flood fill**

```typescript
function reveal(row: number, col: number) {
  if (gameStatus === 'won' || gameStatus === 'lost') return;
  if (board[row][col].isRevealed || board[row][col].isFlagged) return;

  if (firstClick) {
    firstClick = false;
    placeMines(row, col);
    gameStatus = 'playing';
    timer = setInterval(() => {
      if (timeElapsed < 999) timeElapsed++;
    }, 1000);
  }

  const cell = board[row][col];
  if (cell.isMine) {
    cell.isRevealed = true;
    gameStatus = 'lost';
    if (timer) { clearInterval(timer); timer = null; }
    // reveal all mines
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (board[r][c].isMine) board[r][c].isRevealed = true;
    return;
  }

  const stack: [number, number][] = [[row, col]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    if (board[r][c].isRevealed || board[r][c].isFlagged) continue;
    board[r][c].isRevealed = true;
    if (board[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !board[nr][nc].isRevealed)
            stack.push([nr, nc]);
        }
    }
  }

  checkWin();
}
```

### Flag and win

- [ ] **Step 6: Implement `toggleFlag` and `checkWin`**

```typescript
function toggleFlag(row: number, col: number, e: MouseEvent) {
  e.preventDefault();
  if (gameStatus === 'won' || gameStatus === 'lost') return;
  if (board[row][col].isRevealed) return;
  board[row][col].isFlagged = !board[row][col].isFlagged;
  minesLeft += board[row][col].isFlagged ? -1 : 1;
}

function checkWin() {
  const won = board.every(row =>
    row.every(cell => cell.isMine || cell.isRevealed)
  );
  if (won) {
    gameStatus = 'won';
    if (timer) { clearInterval(timer); timer = null; }
  }
}

function reset() { initBoard(); }

onMount(initBoard);
onDestroy(() => { if (timer) clearInterval(timer); });
```

### Template

- [ ] **Step 7: Write the component template**

```svelte
<div class="flex flex-col items-center justify-start pt-4 h-full bg-windows-grey select-none overflow-auto">

  <!-- Header panel -->
  <div class="window-content-wrapper flex items-center justify-between px-3 py-1 gap-8">
    <!-- Mines counter -->
    <span class="counter">{String(Math.max(0, minesLeft)).padStart(3, '0')}</span>

    <!-- Smiley reset -->
    <button class="window-button smiley-btn" onclick={reset} aria-label="New game">
      {gameStatus === 'lost' ? '😵' : gameStatus === 'won' ? '😎' : '😊'}
    </button>

    <!-- Timer -->
    <span class="counter">{String(Math.min(999, timeElapsed)).padStart(3, '0')}</span>
  </div>

  <!-- Grid -->
  <div class="board" role="grid" aria-label="Minesweeper board">
    {#each board as row, r}
      <div class="board-row" role="row">
        {#each row as cell, c}
          <button
            role="gridcell"
            class="cell"
            class:revealed={cell.isRevealed}
            class:mine-hit={cell.isRevealed && cell.isMine}
            aria-label="Row {r + 1}, column {c + 1}"
            onclick={() => reveal(r, c)}
            oncontextmenu={(e) => toggleFlag(r, c, e)}
            style={cell.isRevealed && cell.adjacentMines > 0 && !cell.isMine
              ? `color: ${NUMBER_COLORS[cell.adjacentMines]}; text-shadow: ${NUMBER_GLOWS[cell.adjacentMines]}`
              : ''}
          >
            {#if cell.isFlagged && !cell.isRevealed}
              <span style="color: #FF00AA; text-shadow: 0 0 4px #FF00AA">⚑</span>
            {:else if cell.isRevealed && cell.isMine}
              💣
            {:else if cell.isRevealed && cell.adjacentMines > 0}
              {cell.adjacentMines}
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>

  <!-- Status overlay -->
  {#if gameStatus === 'won' || gameStatus === 'lost'}
    <div class="status-overlay" onclick={reset} role="button" tabindex="0"
         onkeydown={(e) => e.key === 'Enter' && reset()}>
      {#if gameStatus === 'lost'}
        <div class="status-text lost">「GAME OVER」</div>
      {:else}
        <div class="status-text won">「YOU WIN」</div>
      {/if}
      <div class="status-sub">クリックでリセット</div>
    </div>
  {/if}
</div>
```

- [ ] **Step 8: Add styles**

```css
<style>
  .counter {
    font-family: 'Courier New', monospace;
    font-size: 20px;
    font-weight: bold;
    color: #FF0000;
    background: #000;
    padding: 2px 6px;
    letter-spacing: 4px;
    text-shadow: 0 0 6px #FF000088;
    min-width: 50px;
    display: inline-block;
    text-align: right;
  }

  .smiley-btn {
    width: 28px;
    height: 26px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .board {
    border-top: 2px solid #808080;
    border-left: 2px solid #808080;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    margin-top: 8px;
  }

  .board-row {
    display: flex;
  }

  .cell {
    width: 20px;
    height: 20px;
    font-size: 11px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
    border-right: 2px solid #808080;
    border-bottom: 2px solid #808080;
    background: var(--win-grey);
    font-family: 'px_sans_nouveaux', sans-serif;
  }

  .cell.revealed {
    border: 1px solid #808080;
    background: #b8b8b8;
    cursor: default;
  }

  .cell.mine-hit {
    background: #ff0000;
  }

  .status-overlay {
    margin-top: 12px;
    text-align: center;
    cursor: pointer;
  }

  .status-text {
    font-family: 'px_sans_nouveaux', sans-serif;
    font-size: 18px;
  }

  .status-text.lost {
    color: #FF0000;
    text-shadow: 0 0 8px #FF0000;
  }

  .status-text.won {
    color: #00FFFF;
    text-shadow: 0 0 8px #00FFFF;
  }

  .status-sub {
    color: #888;
    font-size: 10px;
    margin-top: 4px;
    font-family: 'px_sans_nouveaux', sans-serif;
  }
</style>
```

- [ ] **Step 9: Check**

```bash
npm run check
```

Expected: 0 errors on the new file.

- [ ] **Step 10: Commit**

```bash
git add src/components/Minesweeper.svelte
git commit -m "feat: add Minesweeper component with neon number colors"
```

---

## Task 2: Add Minesweeper icon to Desktop

**File:** `src/components/Desktop.svelte`

- [ ] **Step 1: Import Minesweeper**

At the top of the `<script lang="ts">` block, after the existing imports, add:

```typescript
import Minesweeper from './Minesweeper.svelte';
```

- [ ] **Step 2: Add desktop icon**

Inside the existing `<div class="h-full grid grid-rows-12 grid-flow-col ...">`, add a 4th icon following the EXACT same pattern as the existing 3 icons:

```svelte
<div class="text-justify align-top w-20 h-12 leading-3 m-0 py-2 px-[1px]">
  <button
    class="relative cursor-pointer"
    aria-label="Open Minesweeper"
    onclick={(e) => openWindow(e, Minesweeper, 'Minesweeper', false)}
  >
    <span style="font-size: 28px; display: block; text-align: center; line-height: 1.1">💣</span>
    <span class="text-[8px] text-white">Minesweeper</span>
  </button>
</div>
```

- [ ] **Step 3: Check and build**

```bash
npm run check && npm run build
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Desktop.svelte
git commit -m "feat: add Minesweeper icon to desktop"
```

---

## Task 3: Final verification

- [ ] Minesweeper icon appears on the desktop
- [ ] Clicking the icon opens the Minesweeper window
- [ ] Grid renders as 9×9 cells with Win95 outset borders
- [ ] Left click reveals cells; flood fill works on empty cells
- [ ] Right click toggles flag (⚑ in neon pink)
- [ ] Numbers show in neon colors with glow
- [ ] Timer starts on first click, counts up
- [ ] Mines counter decrements on flag
- [ ] Smiley shows 😊 idle, 😵 on loss, 😎 on win
- [ ] GAME OVER text shows in red glow; YOU WIN in cyan glow
- [ ] クリックでリセット subtext visible after game over
- [ ] Clicking the status overlay or smiley resets the game
- [ ] `npm run build` passes with 0 errors
