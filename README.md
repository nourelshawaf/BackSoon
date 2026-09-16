# BackSoon

**Going away? Your shift doesn't have to.**

BackSoon connects local businesses with verified students who can temporarily cover work shifts when regular workers are away or unavailable.

This repository is the MVP prototype built for a startup competition demo.

> **The product screens run on demo data.** Businesses, students, ratings and reviews inside the app are fictional and exist only to demonstrate the flow.
>
> **The evidence section on the landing page is real** — every figure carries its source (see `PRODUCT_DECISIONS.md`).

---

## The demo loop

1. **Business** posts a shift it needs covered.
2. **Students** see it ranked by match and apply.
3. **Business** reviews candidates — verification, rating, track record, and why each one matches.
4. **Business** selects one. The shift becomes confirmed; other applicants are told.
5. **Student** sees the confirmed shift in their dashboard.
6. After the shift, the business marks it completed and rates the student.

Both roles read and write the same state, so every step is visible from the other side. Use the demo bar at the bottom of the screen to switch roles and to reset everything to the starting state.

## The match score

No black box, no AI. A candidate is scored on four things the business can already see on the profile:

| Signal | Weight |
|---|---|
| Skills the shift asks for | up to 55 |
| Same district | 15 |
| Availability fits the shift | 15 |
| Verified student | 10 |
| Rating | 5 |

Every screen showing a score can explain it — see `matchScore()` in [`src/store.tsx`](src/store.tsx).

## Running locally

```bash
pnpm install
pnpm dev
```

Requires Node 22 and pnpm (see `.mise.toml`).

## Project structure

- `src/App.tsx` — view routing and role state
- `src/store.tsx` — shared demo state, match scoring, localStorage persistence
- `src/data.ts` — seed demo data
- `src/pages/Landing.tsx` — the narrative landing page
- `src/pages/StudentScreens.tsx`, `src/pages/BusinessScreens.tsx` — the two sides of the marketplace
- `PRODUCT_DECISIONS.md` — running log of what is confirmed, recommended, open and assumed

## Status

Prototype. Not a production system: no backend, no real verification, no payments, no accounts.
