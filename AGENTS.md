# AGENTS.md

## Stack

Vite + React 18 + React Router 7 + Tailwind v4 (CSS-first config, no `tailwind.config.js`) + shadcn/Radix UI components. No test suite, no `tsconfig.json` (no standalone `tsc` typecheck step) — verification is `npm run build` (catches syntax/type errors that break the Vite/esbuild bundle) plus manual/browser QA.

## Commands

- `npm run dev` — start the dev server (Vite picks a free port starting at 5173).
- `npm run build` — production build; also the closest thing to a typecheck in this repo.

## Design system notes (gamification layer)

- `PRODUCT.md` at the repo root has the product register, users, brand personality and design principles — read it before further design work.
- `src/styles/theme.css` — base design tokens (OKLCH). `--primary`/`--accent`/etc. drive shadcn components everywhere (including admin/teacher screens) via `@theme inline`. Keep `--accent` a **neutral** hover color — it's wired into every ghost/outline hover state across the app by the shadcn components in `src/app/components/ui/`.
- `src/styles/game.css` — the "arcade" utilities (`[data-game-panel]`, `.glow-*`, `.text-glow-*`, shimmer/flame/pulse keyframes). Every animation has a `prefers-reduced-motion` fallback here — don't remove those when adding new ones.
- `src/app/data/gamification.ts` — rank ladder (`LEVELS`, 5 tiers) and badges (`BADGES`, 4 rarities). Each level has a `neon` key (`lime | cyan | violet | magenta | gold`) resolved to Tailwind classes via `src/app/components/game/gameStyles.ts` (`NEON_STYLES`, `RARITY_STYLES`, `CONFETTI_HEX`).
- `src/app/components/game/` — reusable gamification UI: `RankBadge`, `XPBar`, `StreakFlame`, `BadgeTile`, `LevelUpCelebration` (mounted once in `Layout.tsx`, detects rank-up by watching `user.points`), `xpToast` (styled sonner toast for "+N XP" moments).
- Design rule of thumb: the neon tokens (`text-neon-*`, `bg-neon-*`, `.glow-*`) are calibrated for the dark `[data-game-panel]` surfaces. On light/white cards, use standard saturated Tailwind colors (e.g. `text-amber-600`, `text-fuchsia-700`) instead — the raw neon colors are too light/desaturated for text contrast on white. Components with a `tone` prop (e.g. `StreakFlame`) expose a `'light'` variant for this.
- High-contrast mode (`html.high-contrast`, toggled from the accessibility bar in `Layout.tsx`) and font-size scaling (`html.fs-large`/`fs-xlarge`) are pre-existing accessibility features — any new gamification surface should keep working under both (see the `html.high-contrast [data-game-panel]` overrides in `theme.css`).
