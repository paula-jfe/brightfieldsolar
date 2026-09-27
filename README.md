# Brightfield Solar — Phoenix city page

**Case 09** · City page for a residential solar installer, designed in Figma and built with Next.js (App Router).

| | |
|---|---|
| Time spent | _TODO: fill in_ |
| Live page | _TODO: add URL_ |
| Design (Figma) | https://www.figma.com/design/ZjORunM647LzvOgmrM5Y6o |
| Video walkthrough | _TODO: add URL_ |
| Commit to evaluate | _TODO: add full hash_ |

Brightfield Solar is a fictional company created for this exercise. Nothing on the page is a real offer.

---

## Contents

1. [Running the project](#running-the-project)
2. [What the page does](#what-the-page-does)
3. [How it is built](#how-it-is-built)
4. [Two decisions, investigated](#two-decisions-investigated)
5. [Other technical decisions](#other-technical-decisions)
6. [Assumptions](#assumptions)
7. [Tests and what they protect](#tests-and-what-they-protect)
8. [Accessibility](#accessibility)
9. [Security](#security)
10. [How AI was used and verified](#how-ai-was-used-and-verified)
11. [What is pending](#what-is-pending)

---

## Running the project

**Requirements:** Node.js 20.9 or newer (developed on Node 22) and npm.

```bash
npm install          # install dependencies
npm run dev          # development server at http://localhost:3000
```

`/` redirects to `/phoenix-az`, the Phoenix page.

Production build:

```bash
npm run build
npm start            # serves the static build at http://localhost:3000
```

Unit and component tests:

```bash
npm test             # Vitest + React Testing Library
```

End-to-end tests (Playwright + axe):

```bash
npx playwright install --with-deps chromium   # once per machine
npm run test:e2e                              # builds the app, starts it on port 3100 and runs the suite
```

- The install step downloads the browser Playwright drives (it does not use your own Chrome). `--with-deps` also installs the system libraries the browser needs on Linux and CI (it may ask for `sudo`); on macOS and Windows it only downloads the browser. Only Chromium is needed, so there is no need to install Firefox or WebKit.
- Run it inside the project folder, so the browser matches the project's Playwright version. An error like `Executable doesn't exist at .../ms-playwright/...` means this step is missing or was run for another Playwright version.
- To watch the tests run:

  ```bash
  npx playwright test --ui                       # interactive UI: pick a test, watch it, step back through each action
  npx playwright test --headed --project=desktop # opens a real browser window (desktop only, instead of all three viewports)
  npx playwright test --debug                    # pauses before each step
  ```

  Any of these can be slowed down with `SLOWMO` (milliseconds between actions), e.g. `SLOWMO=800 npx playwright test --headed --project=desktop --workers=1`.

- If a server is already running on port 3100, the suite reuses it instead of building again. Stop it first if it is serving an old build.

Type check:

```bash
npx tsc --noEmit
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Unit and component tests, single run |
| `npm run test:watch` | Same, in watch mode |
| `npm run test:e2e` | End-to-end tests against the production build, on mobile, tablet and desktop viewports |
| `npm run test:e2e-ui` | Same tests in Playwright's interactive UI, slowed down (800 ms between actions) so you can follow them. Tick "Show browser" to watch them live. |

No environment variables, accounts or external services are needed.

---

## What the page does

One page, six sections, in the order the brief asks for. Each one answers a question a visitor has at that point:

1. **Hero** — *"Is this for me?"* The promise ("Make the most of Phoenix sunshine") and one call to action that scrolls to the simulator, because the brief says the savings simulation is what most often leads to a site-visit request. Three stat cards (installations, rating, local crews) give trust at a glance, which matters because the link is often forwarded to whoever decides with the visitor.
2. **Simulator** — *"What would I save?"* Monthly bill and coverage sliders, four household profiles as shortcuts, and a live result: panel count, cost after the federal credit, monthly savings and payback, plus a bar that splits the bill into what solar saves and what is left to pay.
3. **How it works** — *"What happens next?"* Three steps, with the Phoenix permit time pulled from the data file.
4. **Social proof** — *"Who will be on my roof?"* Local crews and customer testimonials, both as swipeable carousels.
5. **FAQ** — The six questions from the data file in an accordion. Answers stay in the HTML even when collapsed, so search engines and AI assistants can read them.
6. **Final call to action** — A lead form (name, email, phone, consent) and the phone number as a `tel:` link.

The page is mobile-first (a lot of traffic is someone on their phone, standing in the yard looking at their roof), with a tablet step from 768px and the desktop layout from 1024px (see [Responsive behaviour](#responsive-behaviour)).

### The simulator

The whole calculation lives in one pure function, `calculateSolarEstimate` in [`src/lib/calculator.ts`](src/lib/calculator.ts), and follows the brief's formula step by step using only values from the data file. The three rules and how the page explains each one:

| Rule | In the code | What the visitor sees |
|---|---|---|
| Panels are whole units | `Math.ceil`, and cost and generation use the rounded count | Nothing extra; the count is simply whole |
| Minimum panels per installation | `Math.max(rounded, minPanels)`, flag `isMinPanelsApplied` | A note: *"Every installation has an 8-panel minimum, so your system stays at 8 panels even if you lower your coverage. Your usage alone would call for fewer."* It also explains the last two rows of the brief's example, where lowering coverage changes nothing. |
| Savings never exceed the bill | `Math.min(rawSavings, bill)`, flags `isSavingsCapped` and `excessCreditValue` | A note: *"This system generates more than your bill covers. Savings are capped at your monthly bill. The extra $1.73/month becomes a utility credit, not cash back."* The savings bar turns fully yellow. |

Both notes can appear together (for example, a $60 bill).

**Why payback is usually 6.9 years.** Cost and savings both scale with the panel count, so their ratio is constant: $866.25 per panel after the credit ÷ $126.36 of savings per panel per year = 6.86 years. The figure only moves when savings are capped by the bill (for example, a $60 bill gives 9.6 years). This is the brief's formula working as specified, not a frozen value.

---

## How it is built

```
src/
  app/
    [city]/page.tsx      the city page: static params, metadata, the six sections
    page.tsx             "/" → redirects to the default city
    layout.tsx           fonts, <html lang="en">, global styles
    globals.css          design tokens (mirroring Figma variables), animations, slider styles
    icon.svg, favicon.ico, apple-icon.png
  components/            one folder per section, plus ui/ (Button, Logo, Loader, Container)
  data/
    cities/phoenix-az.json   all per-city content
    cities.ts                registry of cities
    types.ts                 the data schema (CityData)
  lib/
    calculator.ts        the savings formula (pure function)
    format.ts            currency, percent, years, panel-count formatting
    lead-form.ts         form validation rules
    public-asset.ts      checks an optional image exists before rendering it
  tests/
    lib/, data/, components/   unit, component and data-contract tests (Vitest)
    e2e/                       end-to-end tests (Playwright)
```

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4. No UI library and no runtime dependencies beyond Next and React.

### One template, one data file per city

Everything that changes between cities comes from `src/data/cities/<slug>.json`, typed by `CityData` in `types.ts`. The page reads only from that object: city name, rates, profiles, crews, testimonials, FAQ, phone, permit days, stats.

To add a city:

1. Add `src/data/cities/tucson-az.json` following the same schema.
2. Import it and add one line to the map in `src/data/cities.ts`.

`generateStaticParams` picks it up and `/tucson-az` is prerendered at build time. No component changes. A data-contract test (see [Tests](#tests-and-what-they-protect)) runs against every registered city, so a typo in a new file fails the build pipeline instead of the live page.

### Rendering

Every city page is **statically generated** at build time (`generateStaticParams`), so it is served as plain HTML from a CDN: fast on a phone on a weak connection, and fully readable by search engines and AI assistants without running JavaScript. `generateMetadata` sets a per-city title, description, Open Graph and Twitter tags, so a forwarded link previews with the city name and stats. Unknown slugs return a 404.

Only the parts that need state are Client Components: the simulator, the lead form, the FAQ accordion, the carousels and the mobile menu. City data is passed to them as props from the server, so there is no client-side data fetching.

### Responsive behaviour

Three steps, using Tailwind's default breakpoints consistently:

| | Mobile (base) | Tablet (`md`, 768px+) | Desktop (`lg`, 1024px+) |
|---|---|---|---|
| Layout | One column | One column, roomier | Two or three columns, as in the Figma desktop frame |
| Header | Menu button | Menu button | Full navigation and CTA |
| Hero title | 36px | 42px | 48px |
| "Estimate your savings" | 28px | 34px | 40px |
| Monthly savings figure | 40px | 48px | 56px |
| Card titles | 18px | 20px | 24px |
| Section spacing | 56px | 80px | 96px |
| Card radius | 16px | 16px | 24px |
| Side padding | 20px | 40px | 64px |

Mobile (390px) and desktop (1440px) match the Figma frames. The tablet values were interpolated between them in code, then documented on the Figma **Tablet** page (home plus the simulator and form states at 768px). Layout, radius and the final type size all switch together at 1024px, because a two-column simulator or a full navigation bar does not fit comfortably below that. A few details depend on the available width rather than the device:

- The hero stat cards are compact wherever the image is narrow (phones, and 1024–1279px, where the square image is about 355px wide) and regular elsewhere, so they never overlap.
- The profile icons are hidden on phones and between 1024 and 1279px, where each card is only about 200px wide.
- On very short screens, such as a phone held sideways, the header stops being sticky, so it does not take a quarter of the height.

Checked at 16 widths from 320 to 1920px for horizontal overflow, clipped text and overlapping elements, plus a landscape phone.

### Design system in code

The Figma file has variable collections (primitives such as `Mirage/950`, and semantic tokens such as `text/accent-on-light`). `globals.css` mirrors them one to one as CSS custom properties, exposed to Tailwind through `@theme inline`, so components use semantic classes (`bg-bg-dark`, `text-text-on-light-muted`) instead of raw hex values. When a colour changed for accessibility, it changed in both places under the same name.

Fonts (Hanken Grotesk for display, Inter for body) are variable fonts loaded with `next/font/google`: Next.js downloads them at build time and serves them from the site itself, so visitors never make a request to Google and there is no layout shift. The build therefore needs internet access.

---

## Two decisions, investigated

### 1. What happens to coverage when a household profile is selected

**What I wanted to check.** The brief says selecting a profile "fills in the typical bill", but not what happens to the coverage slider. The worked example goes from 100% coverage (row 3) straight to selecting the apartment profile (row 4), so the answer changes the result.

**How I investigated.** I ran row 4 through the calculator both ways:

| Coverage after selecting "Apartment" ($90) | Panels | Cost after credit | Monthly savings | Payback |
|---|---|---|---|---|
| Kept at 100% | 9 | $7,796.25 | $90.00 (capped) | 7.2 years |
| Reset to 80% | **8** | **$6,930.00** | **$84.24** | **6.9 years** |
| Brief's expected row 4 | 8 | $6,930.00 | $84.24 | 6.9 years |

The brief also says that at this step "the calculation would ask for 7 panels". At 80% the raw count is 6.84, which rounds up to 7, below the minimum of 8. At 100% it would be 8.55, rounding up to 9, and the minimum would never come into play.

**What I concluded.** Only resetting coverage to the 80% default reproduces the brief's numbers, so selecting a profile sets the bill **and** resets coverage to 80%. It also makes product sense: a profile is a fresh starting point. The other rules follow from the same idea: moving the bill slider by hand deselects the profile (the bill no longer matches it), while moving coverage keeps it selected (coverage is not part of a profile). A component test clicks through all six rows of the brief's example in the real UI; when I removed the reset on purpose, that test failed at row 4, so it guards this decision.

### 2. The accent blue failed contrast, and what replaced it

**What I wanted to check.** Whether the design met WCAG 2.2 AA, the usual market baseline, before calling it done.

**How I investigated.** Three passes:

1. **axe-core** in Playwright, on desktop and mobile, in every state: initial, mobile menu open, simulator notes plus form errors, and the confirmation.
2. **Contrast ratios computed** for every colour pair the page uses, because axe cannot measure text over the hero's gradients.
3. **A keyboard walk**, tabbing forwards and backwards through the page and recording which element had focus, whether its focus ring was visible, and whether the sticky header covered it.

The main finding was the brand's sky blue `#4EBBE2`. It marked the selected household profile and the focus rings, and measured **2.2:1** on white, below the **3:1** that WCAG 1.4.11 requires for anything that shows a state. Form field borders (1.4:1) and inactive carousel dots (1.9:1) failed the same rule.

**What I concluded.**

- **Navy:** passed easily (16:1), but it made selected and focused elements look heavy and off-brand, so it was rejected.
- **A lighter blue close to the original (`#27A3D0`):** measured 2.9:1, still failing.
- **Chosen: `Seagull/500` (`#2599C3`),** a slightly deeper shade from the brand's own palette, at 3.3:1. It keeps the look of the design and passes. It became the `accent/sky` token in Figma and in code, so the selected state, hover and every focus ring moved together.
- **Field and checkbox borders:** moved to a new `border/control` token (`#76889F`, 3.6:1). Decorative card borders stayed light on purpose.
- **Carousel dots:** inactive dots moved to `Mirage/300` (8.3:1), with 24px touch targets.

The E2E suite now runs axe with the WCAG 2.2 AA rules and fails on any violation, so this cannot silently regress.

---

## Other technical decisions

- **One page, not a multi-step flow.** Early sketches split the simulator into steps. A single page with the simulator second keeps the path to an estimate short for paid-ad visitors, keeps all content indexable for search visitors, and gives a forwarded link one complete story.
- **Initial state: $220 at 80% coverage.** Kept as the brief suggests. It matches the "Three-bedroom house, no pool" profile, which is shown as selected on load, so the first thing a visitor sees is a realistic, labelled scenario instead of an abstract number.
- **Result notes are always in the flow.** The notes appear in the dark result card right where the numbers change, instead of in a tooltip, so a visitor on a phone sees them without extra taps.
- **The state incentive note sits outside the card, under the estimate.** The data file's sentence ended with "not included in the estimate below". Once the note moved below the result, "below" was wrong, so it now reads "It is not included in this estimate."
- **Hero animation in pure CSS.** The night-to-day scene plays once and stays on day. The stat cards float independently of it. There is no JavaScript and no animation library, and everything stops under `prefers-reduced-motion`.
- **Carousels built on native scroll-snap.** Swipe works natively on mobile. Dots are clickable and track the visible card. Desktop arrows enable themselves only when the cards overflow: at 1440px Phoenix's three cards fit, so they are disabled, but a city with more crews gets working arrows with no change. When the track overflows, it can also be scrolled with the keyboard.
- **Lead form without a backend.** The brief allows the CTA to go nowhere, so a 1.2s simulated request shows the loading state (the brand's sun loader) and then a confirmation that replaces the form in place, centred as one self-contained message. After 7 seconds the form resets and focus returns to the first field. The data is never sent or stored.
- **Form validation designed to be calm:**
  - Clicking into a field and leaving it empty is not an error, only submitting is.
  - A field with something typed in it is checked when the visitor leaves it, then re-checked live as they fix it.
  - The consent error appears only on submit, never for simply toggling the box.
  - Submitting focuses the first invalid field.
  - Rules are strict but realistic: US phone numbers (NANP), properly formed emails with a non-blocking "Did you mean gmail.com?" suggestion, and names with letters, spaces, hyphens and apostrophes.
  - The phone formats itself as `(602) 555-0100` while typing.
- **Images:** crew photos (paths come from the data file) live in `public/images`. The hero art is imported statically from `src/assets`, so Next.js fingerprints it and knows its size at build time. Both go through `next/image` for responsive sizes and lazy loading. A missing crew photo falls back to a neutral block instead of a broken image.

---

## Assumptions

The brief leaves some points open on purpose. How each one was resolved:

1. **Selecting a profile resets coverage to 80%.** See [Decision 1](#1-what-happens-to-coverage-when-a-household-profile-is-selected). Moving the bill slider deselects the profile; moving coverage keeps it.
2. **The data schema was extended, additively.** Three optional fields were added to the Phoenix file, and the page falls back gracefully if a city omits them:
   - `shortLabel` on profiles, a shorter label for narrow screens
   - `icon` on profiles, an illustrative icon on desktop
   - `photo` on crews
   
   Every field the brief defines is unchanged.
3. **One sentence of copy was edited.** In `stateIncentiveNote`, "the estimate below" became "this estimate", because the note sits under the result.
4. **Testimonials and FAQ answers are used verbatim** from the brief, including the FAQ figures, which match the calculator (17 panels, $14,726 and about 7 years for the default home).
5. **Money is shown in whole dollars** in the results ($14,726, $179/mo), which is easier to scan. The only exception is the utility credit, shown to the cent ($1.73), because rounding it would read as $2.
6. **Payback is shown to one decimal** ("6.9 years"), as in the brief.
7. **The CTA has no backend** (allowed by the brief). The form simulates sending and then confirms.
8. **Phone validation is US-only (NANP),** since the business installs in the United States. The fictional `555` numbers are accepted.
9. **Crew photos are AI-generated** (allowed by the brief), with no company logos, showing US-style residential roofs.
10. **Three data fields are not displayed yet:** `utilityName`, `metroArea` and `popularNeighborhoods`. They stay in the data file for the next iteration (see [Pending](#what-is-pending)).
11. **`/` redirects to `/phoenix-az`,** so there is exactly one URL per city page and one place that renders it.
12. **Tablet sizes are interpolated** between the mobile (390px) and desktop (1440px) designs, then documented on the Figma Tablet page. See [Responsive behaviour](#responsive-behaviour).

---

## Tests and what they protect

The brief does not require tests. These exist because the simulator's rules are exactly the kind of logic that breaks silently. There are three layers:

**1. Logic (Vitest)**
- `calculator.test.ts`: **the brief's worked example, all six rows**, as the acceptance test. It covers the three situations the brief highlights:
  - the savings cap on row 3, with the $1.73 credit
  - the 8-panel minimum on row 4, with a raw count of 7
  - rows 5 and 6, where lowering coverage changes nothing
  
  It also covers rounding up, pricing on the final panel count, and the slider extremes.
- `lead-form.test.ts`: validation rules with lists of valid and invalid names, emails and phones, plus phone formatting and email typo suggestions.
- `format.test.ts`: currency, percent, years and panel-count formatting.

**2. Components (Vitest + React Testing Library)**
- `Simulator.test.tsx`: **clicks through the brief's example in the real UI** and checks the displayed numbers and which notes appear at each step, so it protects the coverage-reset decision. It also checks the savings bar split.
- `LeadForm.test.tsx`: when errors appear, focus moving to the first invalid field, phone auto-format, the email suggestion, the consent rule, and the full send → confirm → reset cycle, including focus returning to the form.
- `Header.test.tsx`: the mobile menu's state, and Escape returning focus to the menu button.
- `FaqList.test.tsx`: the first answer open, answers present in the HTML, and items opening independently.

**3. Data contract (Vitest)**
- `city-contract.test.ts`: runs against **every registered city**. It checks:
  - rates within range
  - every profile's bill a value the slider can actually show (within 40–600 and on the $10 step)
  - icons that exist
  - crew photos that exist in `public/`
  - valid testimonial dates
  - non-empty FAQ
  
  It protects the promise that a new city is just a data file.

**4. End-to-end (Playwright, on mobile, tablet and desktop)**
- `/` redirects, the title is correct, and the six sections are in order.
- An unknown city returns 404.
- A visitor picks a profile, sees the minimum-panels note and sends the form.
- The confirmation replaces the form and gives it back.
- **axe-core finds no WCAG 2.2 AA violations.**

Async Server Components (the page itself) are covered by E2E rather than unit tests, because Jest and Vitest do not support them yet, as the Next.js testing guide notes.

**Why Vitest rather than Jest:** same API and the same React Testing Library, but TypeScript and path aliases work without Babel or SWC configuration, and it is the more common choice for new projects.

---

## Accessibility

Target: **WCAG 2.2 AA**. Checked with axe-core in every page state, computed contrast ratios, a keyboard walk and zoom/reflow at 320px. There are currently **zero axe violations** on mobile, tablet and desktop.

Highlights:
- **Focus is always visible.** The ring is blue on light surfaces and yellow on dark ones.
- **Focus never ends up hidden** behind the sticky header (`scroll-padding-top`).
- **A "Skip to content" link** appears for keyboard users.
- **Sliders announce their values** as "$220" and "80%", and the savings figure is announced when it changes.
- **Profile buttons use their visible text as their accessible name,** so voice-control users can say what they see.
- **Form errors are tied to their fields** (`aria-describedby`). The sending state and the confirmation are announced. Focus is managed when the confirmation appears and disappears.
- **Touch targets are at least 24px,** usually 44px.
- **The mobile menu** closes with Escape and returns focus to its button.
- **`prefers-reduced-motion`** turns off every animation.

Known trade-offs, chosen deliberately:
- **The hero stat cards float in an infinite loop.** WCAG 2.2.2 asks for a way to pause motion that runs longer than 5 seconds. The loop was slowed down (5–7s per movement) so it reads as ambient, and it stops entirely for anyone who asks the OS for reduced motion, but there is no pause button. This keeps a design feature at the cost of strict conformance on this one criterion.
- **The confirmation message disappears after 7 seconds.** It is announced to screen readers and receives focus, and focus returns to the form afterwards. A timed message is a grey area under WCAG 2.2.1 and is kept as a design choice.

---

## Security

The attack surface is small: a static page with no backend, authentication, database or third-party scripts, and a form that never sends data anywhere. Checks performed:
- **Dependencies:** `npm audit` reports 0 vulnerabilities, for production and development dependencies.
- **Secrets:** no secrets in the code or git history, and no `.env` files.
- **Code:** no `dangerouslySetInnerHTML`, `eval` or `innerHTML`. React escapes all text, and query parameters are never reflected into the page.
- **Images:** crew photos and hero art carry no EXIF or GPS metadata.
- **Build:** no production source maps.

**HTTP headers**, set in [`next.config.ts`](next.config.ts):
- `Content-Security-Policy`: the "without nonces" variant from the Next.js CSP guide, since the pages are static and nonces would force dynamic rendering. Scripts, styles, images and fonts come from the site's own origin only, and `frame-ancestors 'none'` blocks clickjacking.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`, which turns off camera, microphone, geolocation, payment and USB
- The `X-Powered-By` header is disabled.
- HSTS is left to the host; Vercel sets it on its domains.

**If a real backend is added for the form:** validate on the server as well (the rules in `lib/lead-form.ts` can be reused), rate-limit submissions, add a honeypot field against spam, and keep personal data out of logs.

---

## How AI was used and verified

I used **Claude (Anthropic)** throughout, as a pair designer and engineer. I made the design and product decisions and reviewed every change before it landed. Claude edited the Figma file through the Figma MCP server and edited the code in a local copy of the repository.

**How it helped**
- **Design:** turning my hand-drawn low-fidelity sketches into Figma components and screens. That included the variable collections and tokens, component variants (Profile Option, Solar Estimate states, Lead Form states, Floating Stat, Carousel Dots) and prototype interactions.
- **Code:** implementing the Figma design in Next.js, the calculator and the form validation, and writing the tests.
- **Audits:** reviews against the brief, an accessibility audit (axe-core plus manual checks), a security review and a dead-code sweep.

**What I kept, changed or rejected (examples)**
- **Navy for the selected state:** Claude proposed it to fix contrast. I rejected it as too heavy and we settled on a deeper shade of the brand blue that still passes ([Decision 2](#2-the-accent-blue-failed-contrast-and-what-replaced-it)).
- **Floating stat cards:** Claude proposed stopping them after 5 seconds for strict WCAG conformance. I kept them infinite but slower, and documented the trade-off. I also tried a smaller amplitude and reverted it because the motion became barely visible.
- **Form validation:** I found the first version too weak and asked for strict rules. I then corrected its behaviour: no error for tabbing through an empty field, and the consent error only on submit.
- **Confirmation layout:** I compared left-aligned, icon-beside-title and centred versions from real screenshots before choosing the centred one.
- **Tests:** I asked to remove an E2E assertion that checked element positions, because the test should check that things are on screen, not pixel layout.
- **Figma:** I rejected text variants per phrase in favour of component text properties. I also corrected the implementation where it drifted from the Figma file.

**How the output was verified**
- **The brief's worked example is an automated test,** both at the formula level and clicked through the UI. When a behaviour mattered, I checked the test would fail without it; for example, removing the coverage reset makes the simulator test fail at row 4.
- **Every visual change was checked in a real browser (Playwright/Chromium)** at mobile, tablet and desktop sizes, compared against the Figma frames, and proposed design changes were shown as before/after screenshots before being applied.
- **Accessibility:** axe-core, computed contrast ratios and keyboard walks. Security: `npm audit`, header inspection and code scans.
- **Lint, type-check, all unit, component and E2E tests,** and a production build were run after each change.
- **No dependency was added without my approval,** and I install packages myself.

---

## What is pending

Ordered by impact on the business goals in the brief:

1. **Campaign attribution.** On Mondays the campaign team needs to know which ads generated simulations. The page does not track anything yet. Next step:
   - capture UTM parameters on landing
   - fire an analytics event the first time a visitor interacts with the simulator, and on lead submission, carrying those UTMs and the city slug
   
   This would work with GA4, Segment or similar, behind a consent banner if required.
2. **Richer share preview.** The link is often forwarded to a partner. There is per-city Open Graph text, but no share image yet. A generated `opengraph-image` with the city name, rating and install count would make the preview look trustworthy.
3. **Structured data for search and AI assistants.** Add JSON-LD `FAQPage` for the FAQ, and `LocalBusiness`/`Service` with the phone and rating, generated from the data file. Also add a `sitemap.xml` and `robots.txt` that list every city.
4. **Unused data fields.** `utilityName`, `metroArea` and `popularNeighborhoods` could feed local-SEO copy, for example "serving Arcadia, Ahwatukee…" or "credits from Arizona Public Service".
5. **A real lead endpoint** with server-side validation, rate limiting and spam protection (see [Security](#security)).
6. **More cities.** The template and the data contract are ready. A second real city file would be the true test of the "one template, 120 cities" goal.
7. **Minor cleanup.** A few component options are kept to match Figma but unused on this page: the large `Loader`, the light `Logo` tone, and a `Button` component next to `LinkButton`.
