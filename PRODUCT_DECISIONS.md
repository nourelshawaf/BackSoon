# BackSoon — Product Decisions

Running log. Nothing moves into **Confirmed** without explicit approval.

Last updated: 16 September 2026

---

## Confirmed

| # | Decision | Approved |
|---|---|---|
| 1 | The MVP is temporary **student shift coverage only**. Rooms, pets and childcare are future expansion, not part of the product. | 15 Sep 2026 |
| 2 | Two user types only: **students / temporary workers** and **businesses / employers**. | 15 Sep 2026 |
| 3 | The **employer has final control** over who is accepted for a shift. | 15 Sep 2026 |
| 4 | Core flow: post → apply → review candidates → select → confirmed → completed → rating. | 15 Sep 2026 |
| 5 | **Demo data only**, clearly labelled. No real companies, users, reviews, partnerships or validation numbers. | 15 Sep 2026 |
| 6 | The pitch deck is the source of truth; keep the concept and its terminology. | 15 Sep 2026 |
| 7 | Both sides of the marketplace share **one app state**, so applying, selecting, completing and rating are visible from the other role. | 16 Sep 2026 |
| 8 | A **shift completion + rating step** is part of the MVP. | 16 Sep 2026 |
| 9 | Code published to a **public GitHub repository**; site deployed on **Vercel**. | 16 Sep 2026 |

---

## Recommended (not yet approved)

- Reframe the deck's "one platform, four needs" as sequenced expansion — one need first.
- State the employment constraint openly as a trust feature: the business stays the employer; BackSoon finds and verifies the candidate.
- Keep the narrative landing page; it is the main thing separating this from a template job board.
- Merge the original 18 screens down to ~11 (shift detail absorbs applicants + selection; profile absorbs availability).
- Decide one tagline and use it everywhere.

---

## Open questions

1. **Who posts the shift?** Business only / the departing worker requests cover and the manager approves / business posts with an optional "covering for —" field.
2. **Market and currency** — keep Budapest + HUF, or switch to Debrecen or elsewhere?
3. **Brand** — deck's maroon + pink house logo, or the site's navy + electric blue return-arc logo? They currently disagree.
4. **Match score** — keep the transparent score (current implementation), replace with plain reason chips, or remove?
5. **Trust badges** — which to show: student verified, ID verified, business verified, star rating, completed shifts?
6. **Money** — hourly rate only, or also show a BackSoon service fee so judges can see the revenue model?
7. **Ratings** — business rates student only, or both directions?
8. **Story character** — keep "Nadeen" as the guide, or a neutral persona?

---

## Assumptions (inherited from the existing build — NOT approved)

- Setting is **Budapest, Hungary**, pay in **HUF per hour**, students from Hungarian universities.
- Palette is navy `#0A1A33` / electric blue `#2E52FF` / warm orange `#FF6B3D`; logo is the return-arc mark.
- The **match score** is shown to both sides. It is computed transparently from: skills the shift asks for (up to 55 pts), same district (15), availability fits the shift (15), verified student (10), rating (5). Every screen that shows a score can explain it — there is no hidden model and no AI.
- Shift categories are Hospitality, Retail, Food & Beverage, Events, Other.
- The demo student is Anna Kovács; the demo business is Kávé & Kő.
- **"Simulate incoming applications (demo)"** button on an empty shift, so a freshly posted shift can be taken through the full loop during a presentation. Labelled as a demo aid on screen.
- Ratings currently run **business → student** only.

---

## Explicitly out of scope for the MVP

Messaging/chat · in-app payments · subscriptions · contracts or invoicing · background checks · multi-city · rooms, pets, childcare · any AI feature.
