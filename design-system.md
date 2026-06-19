# SIGNAL_LOSS // DESIGN SYSTEM v1.0

> Aesthetic: SIGINT terminal repurposed for Solana darkpool intelligence.
> Voice: Declassified military technical manual × Solana degen.
> Rule: If it looks like it could be on Product Hunt, rebuild it.

---

## 1. DESIGN TOKENS

### 1.1 Color Palette (Strict — 6 colors, no others)

```css
:root {
  /* Phosphor Amber — primary accent, active state, primary CTA */
  --sl-amber:    #FFB000;
  --sl-amber-dim:#B37D00;

  /* CRT Green — success, active signal, live data */
  --sl-green:    #33FF00;
  --sl-green-dim:#1F9900;

  /* Alarm Red — failure, expired, slashed, error */
  --sl-red:      #FF2200;
  --sl-red-dim:  #991500;

  /* Bone White — primary text, foreground */
  --sl-bone:     #E0E0E0;
  --sl-bone-dim: #8A8A8A;

  /* Noise Black — primary background, deepest void */
  --sl-void:     #050505;
  --sl-void-2:   #0A0A0A;

  /* Grid Gray — borders, dividers, inactive surfaces */
  --sl-grid:     #1A1A1A;
  --sl-grid-2:   #2A2A2A;
}
```

**Color usage rules:**
- Amber is the ONLY color used for primary CTAs, active prompts, the cursor.
- Green ONLY for live/active signal states. Never as general text.
- Red ONLY for error, expired, slashed, failed. Never decorative.
- Bone White for body text. Dim for secondary/metadata.
- All other UI elements use black/grid gray. Color = data = meaning.

### 1.2 Typography

```css
@import url('https://fonts.googleapis.com/css2?family=VT323&family=IBM+Plex+Mono:wght@300;400;500;600&family=Share+Tech+Mono&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --font-display: 'VT323', 'Courier New', monospace;       /* Headlines, hero, big numbers */
  --font-body:    'IBM Plex Mono', 'Courier New', monospace; /* Body, paragraphs, copy */
  --font-data:    'JetBrains Mono', 'Courier New', monospace; /* Numbers, hashes, addresses */
  --font-accent:  'Share Tech Mono', 'Courier New', monospace; /* Labels, eyebrows, metadata */
}
```

**Type scale:**

| Token | Size | Use |
|-------|------|-----|
| `--text-7xl` | clamp(4rem, 10vw, 8rem) | Hero display, hero status |
| `--text-5xl` | clamp(2.5rem, 5vw, 4rem) | Section headers |
| `--text-3xl` | 1.875rem | Pane headers |
| `--text-xl`  | 1.25rem | Subhead |
| `--text-base`| 1rem | Body |
| `--text-sm`  | 0.875rem | Data, metadata |
| `--text-xs`  | 0.75rem | Labels, eyebrows (uppercase, +0.1em tracking) |
| `--text-mono-tiny` | 0.625rem | Hash fragments, slot numbers |

**Casing rules:**
- Labels, eyebrows, metadata: ALWAYS UPPERCASE.
- Body: Title Case only for proper nouns, otherwise sentence case.
- Commands, system output: UPPERCASE.
- Never use italic for emphasis. Use weight or color.

### 1.3 Spacing & Grid

```css
:root {
  --space-unit: 0.25rem; /* 4px base */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

**Grid rules:**
- 1px borders EVERYWHERE. Borders are the dominant divider.
- Gap between grid sections: 1px (use `gap-px` with contrasting backgrounds).
- Pane padding: 16px (`p-4`).
- Internal section padding: 8px (`p-2`).

### 1.4 Radii

```css
:root {
  --radius: 0px; /* Hard rule: every element is 0px radius */
}
```

**Tailwind override:**
```js
theme: { borderRadius: { none: '0', DEFAULT: '0' } }
```

### 1.5 Effects

```css
/* Scanline overlay — applied globally at root */
.sl-scanlines::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 176, 0, 0.03) 0px,
    rgba(255, 176, 0, 0.03) 1px,
    transparent 1px,
    transparent 3px
  );
  mix-blend-mode: overlay;
}

/* CRT flicker — subtle, 0.1s pulse */
@keyframes sl-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.97; }
}
.sl-flicker { animation: sl-flicker 0.1s infinite; }

/* Cursor blink — 1s interval, block cursor */
@keyframes sl-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.sl-cursor { animation: sl-blink 1s steps(1) infinite; }

/* Text decode scramble — 600ms on load */
@keyframes sl-decode {
  0% { filter: blur(2px); opacity: 0; }
  100% { filter: blur(0); opacity: 1; }
}
.sl-decode { animation: sl-decode 0.6s steps(20) forwards; }

/* Scan on row hover */
.sl-row-scan::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 176, 0, 0.08) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 0.4s linear;
  pointer-events: none;
}
.sl-row-scan:hover::before { transform: translateX(100%); }
```

---

## 2. COMPONENT SPECS

### 2.1 Button (`<TerminalButton>`)

```tsx
<button className="
  font-mono uppercase tracking-wider
  px-4 py-2
  border border-amber text-amber
  bg-transparent
  hover:bg-amber hover:text-void
  active:translate-y-px
  disabled:border-grid-2 disabled:text-grid-2 disabled:hover:bg-transparent
  transition-colors duration-75
">
  EXECUTE
</button>
```

Variants:
- `primary` — amber border, amber text, amber fill on hover
- `danger` — red border, red text, red fill on hover
- `ghost` — grid border, bone text, amber border on hover
- `success` — green border, green text, green fill on hover

### 2.2 Input (`<TerminalInput>`)

```tsx
<input className="
  font-mono text-bone
  bg-void border border-grid
  px-3 py-2
  focus:border-amber focus:outline-none
  placeholder:text-grid-2 placeholder:uppercase placeholder:tracking-wider
  caret-amber
  selection:bg-amber selection:text-void
"/>
```

### 2.3 Pane (`<TerminalPane>`)

```tsx
<section className="
  relative
  border border-grid
  bg-void-2
  flex flex-col
  overflow-hidden
">
  <header className="
    flex items-center justify-between
    px-4 py-2
    border-b border-grid
    bg-void
    text-amber
    font-mono text-xs uppercase tracking-widest
  ">
    <span>// PANE_ID</span>
    <span className="text-grid-2">[STATUS]</span>
  </header>
  <div className="flex-1 overflow-y-auto p-4">
    {children}
  </div>
</section>
```

### 2.4 Cursor (`<Cursor>`)

```tsx
<span className="
  inline-block w-[0.6em] h-[1em]
  bg-amber align-middle
  sl-cursor
"/>
```

### 2.5 Divider (ASCII)

```tsx
<div className="font-mono text-grid-2 text-xs tracking-widest select-none">
  ----+----+----+----+----+
</div>
```

### 2.6 Data Row (table)

```tsx
<div className="
  grid grid-cols-[140px_120px_1fr_80px_80px] gap-2
  font-mono text-xs
  border-b border-grid
  py-2 px-2
  hover:bg-void
  sl-row-scan relative overflow-hidden
  cursor-pointer
">
  <span className="text-grid-2">1781896083</span>
  <span className="text-amber">0xA7F2E9C1</span>
  <span>SOL/USDC</span>
  <span className="text-green">94.2%</span>
  <span className="text-bone-dim">ACTIVE</span>
</div>
```

---

## 3. ASCII ART ASSETS

### 3.1 Brand Mark

```
   _____ ___ _   _ _    ___  __   ____   ___  __  __ ___ ____
  / ____|_ _| \ | | |  / _ \/  | / ___| / _ \|  \/  |_ _/ ___|
 | (___  | ||  \| | | | | | | | \___ \| | | | |\/| || | |
  \___ \ | || |\  | | | | | | |  ___) | |_| | |  | || | |___
  ____) | | || | | | |__| |_| | |____/ \___/|_|  |_|___\____|
 |_____/|___|_| |_|_|_____\___/        SOLANA DARKPOOL
```

### 3.2 Status Banners

**OK:**
```
[ SIGNAL_LOCKED ] // 0xA7F2E9C1...4B
```

**FAIL:**
```
!! SIGNAL_LOST !! // RETRYING_INTERCEPT
```

**WAIT:**
```
... AWAITING_TRANSMISSION ...
```

### 3.3 Frame Brackets

```
┌─[ SIGNAL_FEED ]────────────────┐
│ ...                            │
└─[ 12 ACTIVE / 3 EXPIRED ]──────┘
```

### 3.4 Dotted Paths

```
TX_0xA7F....4B ──▶ JITO_BUNDLE ──▶ EXECUTED
```

---

## 4. TYPOGRAPHY RULES (HARD)

1. NEVER use italic.
2. NEVER use display font (VT323) for body — only for hero/big numbers.
3. NEVER use Tailwind defaults for font-family. Always `font-mono` Tailwind class which maps to our token.
4. Tracking: `-0.02em` for headlines, `0` for body, `+0.1em` for UPPERCASE labels.
5. Tabular numbers (`font-variant-numeric: tabular-nums`) for ALL data tables.

---

## 5. COLOR USAGE TABLE

| Element | Color | Token |
|---------|-------|-------|
| Background (root) | Noise Black | `--sl-void` |
| Background (pane) | Noise Black 2 | `--sl-void-2` |
| Border | Grid Gray | `--sl-grid` |
| Text primary | Bone White | `--sl-bone` |
| Text secondary | Bone Dim | `--sl-bone-dim` |
| Cursor | Phosphor Amber | `--sl-amber` |
| Active signal | CRT Green | `--sl-green` |
| Failed signal | Alarm Red | `--sl-red` |
| Primary CTA border | Phosphor Amber | `--sl-amber` |
| Selected row | Bone + amber border | `--sl-bone` + `--sl-amber` |
| Hash/data value | Bone White | `--sl-bone` |
| Error text | Alarm Red | `--sl-red` |

---

## 6. ANTI-PATTERNS (NEVER SHIP)

- ❌ Border-radius > 0px
- ❌ Linear or radial gradient backgrounds
- ❌ Backdrop-filter / glassmorphism
- ❌ Box-shadow except for `0 0 0 1px amber` glow on critical focus
- ❌ Emoji in any UI text
- ❌ Drop shadows under text
- ❌ 3D illustrations or "futuristic" vector art
- ❌ Lottie animations or stock motion graphics
- ❌ Purple/blue gradient (the AI tell)
- ❌ Inter / Roboto / DM Sans / system-ui fonts
- ❌ Intercom-style help widgets
- ❌ "Connect Wallet" buttons (use `> AUTHENTICATE_SECURE_CHANNEL`)
- ❌ Bright, friendly, or encouraging copy

---

## 7. VOICE & COPY EXAMPLES

| Generic | SIGNAL_LOSS |
|---------|-------------|
| Connect Wallet | `> AUTHENTICATE_SECURE_CHANNEL` |
| Swap | `EXECUTE_SIGNAL` |
| Slippage | `TOLERANCE_THRESHOLD` |
| Loading | `ACQUIRING_SIGNAL_LOCK...` |
| Success | `TRANSMISSION_CONFIRMED. SIGNAL_LOCKED.` |
| Error | `SIGNAL_LOST. RETRYING_INTERCEPT.` |
| Balance | `WAR_CHEST` |
| Stake | `COMMIT_RESOURCES` |
| Withdraw | `EXFILTRATE_FUNDS` |
| Empty state | `NO_SIGNALS_DETECTED. NOISE_FLOOR_NORMAL.` |
| Pending | `AWAITING_TRANSMISSION...` |
| Failed | `AGENT_MALFUNCTION. PURGING_AND_RESTARTING.` |
| Settings | `CALIBRATION` |
| Logout | `TERMINATE_LINK` |
| Profile | `OPERATIVE_FILE` |
| Notifications | `INCOMING_TRANSMISSIONS` |

---

## 8. GRID & LAYOUT

### 8.1 Landing (Boot Sequence)
- Full viewport (`h-screen`, `bg-void`)
- Centered boot log, max-width 720px
- Scanline overlay, subtle flicker
- Boot text appears line by line with type delay

### 8.2 Dashboard (Three-Pane Terminal)
- Full viewport, no scroll on root
- Top bar: 48px (`h-12`) — brand + clock + status
- Below: grid `grid-cols-[280px_1fr_360px]` for three panes
- Mobile: stacked/swipe between panes, fixed bottom command bar

### 8.3 Pane Ratios (Desktop)
- Left (SIGNAL_FEED): 280px fixed
- Center (EXECUTION_TERMINAL): 1fr
- Right (STACK_MONITOR): 360px fixed

### 8.4 Mobile Breakpoint
- < 768px: panes collapse to single visible pane
- Swipe gesture or nav arrows to switch
- Bottom command bar: 64px fixed

---

## 9. ICONOGRAPHY (ASCII ONLY)

No icon library. Use ASCII characters as glyphs:

| Symbol | Use |
|--------|-----|
| `>` | Prompt cursor, primary nav |
| `>>>` | Active loading, async |
| `...` | Pending state |
| `[ ]` | Empty checkbox, frame |
| `[X]` | Active checkbox, locked |
| `\|` | Pipe divider |
| `+` | Join, plus |
| `=` | Equal, separator |
| `#` | Comment, anchor link |
| `!` | Warning |
| `!!` | Critical |
| `<>` | Wrapper, container |
| `{}` | JSON, config |
| `()` | Group, optional |
| `*` | Highlight |
| `/` | Path, divider |
| `-` | Em-dash replacement, range |

---

## 10. STATE MACHINE (Boot Sequence)

```
IDLE
  ↓ (page load)
INITIALIZING
  ↓ (typing complete)
CONNECTING_TO_SOLANA
  ↓ (RPC probe ok)
SYNCING_BLOCK_HEIGHT
  ↓ (slot > 0)
AWAITING_AUTH
  ↓ (click AUTHENTICATE)
DASHBOARD_READY
```

Each transition = type new line above previous, with 200-400ms delay.

---

END DESIGN SYSTEM v1.0
