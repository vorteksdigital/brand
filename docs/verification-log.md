# Verification log

## 2026-07-26

Environment: macOS, Node 25.7.0, npm 11.10.1, pnpm 10.33.2, Payload 3.86.0,
Next 16.2.12. Initial repository was empty.

| Command | Result | Notes |
|---|---|---|
| required four `skills use` commands | 3 pass, 1 expected failure | `payload-cms` absent upstream; documented fallback |
| `npx skills add JuliusBrussee/caveman` | Pass | Seven local skills installed |
| `pnpm payload:generate-types` | Pass | Generated `src/payload-types.ts` |
| `pnpm payload:generate-importmap` | Pass | Import map current |
| `pnpm lint` | Pass | No errors |
| `pnpm typecheck` | Pass | Strict TypeScript, no emit |
| `pnpm test:unit` | Pass | 3 tests |
| `pnpm test:integration` | Pass | 1 Payload Local API test |
| `pnpm test:e2e` | Pass | 6 Chromium tests; Admin, frontend, Axe |
| `pnpm test:a11y` | Pass | 2 routes, WCAG A/AA Axe tags |
| `pnpm build` | Pass | Next production build and sitemap generation |
| clean `pnpm payload:migrate` | Pass | Baseline applied to isolated `vrtks_migration_test` database |
| `pnpm audit --prod --audit-level high` | Pass | 0 high/critical; 2 low, 2 moderate |
| `pnpm audit --audit-level high` | Assessed warning | One dev-only high advisory; see `security.md` |
| production smoke | Pass | `/`, `/admin`, `/posts`, robots, feed, both sitemaps 200; unknown route 404 |
| `pnpm verify` | Pass | Generation, lint, types, unit/integration, production build |

Warnings: no production email adapter is configured, so development email logs
to console. Browser tests cover Admin page creation and official preview-related
rendering foundations; final editorial Page/Post live-update acceptance still
requires manual content editing across all preview widths.

## 2026-07-28

Homepage hero recreation and temporary-reference cleanup.

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Clean after reference directory deletion |
| `pnpm typecheck` | Pass | New hero, shader, and simulation files pass strict TypeScript |
| `pnpm test:unit` | Pass | 3 tests |
| `pnpm test:e2e` | Pass | Initial run: 6 Chromium tests, including homepage and Axe checks |
| `CI=1 pnpm test:e2e` | Pass | Final clean-server run: 6 tests using the repository's serialized CI configuration |
| `pnpm build` | Pass | Next production build and sitemap generation |
| `pnpm verify` | Pass | Types/import map, lint, types, unit/integration, and build |
| Playwright desktop/tablet/mobile/reduced-motion audit | Pass | 1440, 768, 390, and 320 px; no overflow or browser errors; local film loaded; reduced motion disabled pin, fluid simulation, and playback |
| stale reference search after directory removal | Pass | No temporary-directory or original CDN URL references |

The full verification run emitted only the existing development warning about
the missing production email adapter. Before cleanup, lint also reported a
warning inside the temporary reference shader; final lint is clean after the
requested directory deletion. Two later local parallel E2E reruns hit a
Payload/Next development overlay on the final Admin navigation (`Cannot assign
to read only property 'i18n'`); that unrelated test passed in isolation, and the
complete serialized CI run passed on a clean server.

### Supplied hero styling integration

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Scoped hero CSS module and updated component |
| `pnpm typecheck` | Pass | Accessible visual-heading structure remains strictly typed |
| `pnpm build` | Pass | Production CSS and client bundles compiled |
| `CI=1 pnpm test:e2e` | Pass | 6 tests, including homepage accessible-name assertion and Axe |
| Playwright visual audit | Pass | 1440, 768, 390, and 320 px; no overflow; difference trail and 1288×724 expanded 16:9 film verified |

### Full-viewport scroll sequence

| Command | Result | Notes |
|---|---|---|
| `pnpm verify` | Pass | Generated artifacts, clean lint, strict types, 3 unit tests, 1 integration test, and production build |
| `CI=1 pnpm test:e2e` | Pass | 6 serialized Chromium tests, including homepage and Axe |
| Production HTTP asset check | Pass | `/`, `/hero/brand-film.mp4`, and `/hero/brand-film-poster.webp` returned 200 |
| Eight-viewport Playwright audit | Pass | 320×568 through 2560×1080 plus short landscape; hero/video matched viewport bounds and no horizontal overflow |
| Scroll lifecycle audit | Pass | All 3 messages, forward/reverse transitions, unpin/content reachability, and one trigger after route remount |
| Resize/reduced-motion audit | Pass | Portrait-to-landscape spacer recalculated; reduced motion used no pin, paused film, and exposed all messages statically |

### Original design restoration

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Restored hero and scoped measurement changes are lint-clean |
| `pnpm typecheck` | Pass | Strict TypeScript with typed refs and cleanup callbacks |
| `pnpm build` | Pass | Production compilation and sitemap generation |
| `CI=1 pnpm test:e2e` | Pass with flaky retry | Homepage and Axe passed; existing Payload Admin `i18n` development-overlay test passed after retries |
| Production HTTP asset check | Pass | `/` and the unchanged `/hero/brand-film.mp4` returned 200 |
| Eight-viewport visual audit | Pass | Original desktop composition restored; 320×568 through 2560×1080 had no horizontal overflow |
| Animation lifecycle audit | Pass | Original pill bounds reverse exactly, target covers hero, 160% pin releases, remount leaves one trigger |
| Rotation/reduced-motion audit | Pass | Spacer recalculated from 2423 to 1118 px; reduced motion creates no pin and hides the fluid canvas |

## 2026-07-30

Pre-push verification for the homepage hero.

| Command | Result | Notes |
|---|---|---|
| `pnpm verify` | Blocked by generated artifact | Initial lint scanned the ignored `playwright-report/trace` bundle and reported 150 errors in Playwright's minified third-party JavaScript |
| Move ignored Playwright report outside the workspace | Pass | Existing report preserved under `/tmp`; no project source was removed |
| `pnpm verify` | Pass | Generated types/import map, lint, strict types, 3 unit tests, 1 integration test, production build, and sitemap generation |
| `CI=1 pnpm test:e2e` | Pass | 6 serialized Chromium tests, including homepage and Axe coverage |

### Open lower edge and dynamic film pill

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Removed divider styles and pointer interaction are lint-clean |
| `pnpm typecheck` | Pass | GSAP quick setters and ScrollTrigger callback pass strict TypeScript |
| `pnpm test:unit` | Pass | 3 tests |
| `git diff --check` | Pass | No whitespace errors |
| Direct Playwright invocation | Invocation error | Bypassed the package script's TypeScript loader, so collection stopped at the existing extensionless `next/cache` import; no tests ran |
| Package script with an extra `--` separator | Invocation error | Playwright interpreted `--workers=1` as a test filter; no tests ran |
| `pnpm exec cross-env 'NODE_OPTIONS=--no-deprecation --import=tsx/esm' playwright test --config=playwright.config.ts --workers=1` | Pass | 6 Chromium tests reused the active development server |
| Live Playwright interaction probe | Pass | No divider element; desktop pill moved about 149 px in either horizontal direction and returned to a zero transform during scroll |
| Live desktop screenshot review | Pass | Open white lower edge and pointer-shifted pill rendered without overflow |
| Move generated Playwright report outside the workspace | Pass | Report preserved under `/tmp` so later lint runs do not scan its bundled JavaScript |

The active `pnpm dev` process on port 3000 was reused and remained running.
A production build was intentionally not started because it would share Next's
output directory with that active process.

The pointer-following interpretation was subsequently removed. The film pill
again remains in its measured text slot until the existing scroll expansion
begins; the lower divider removal remains.

| Follow-up command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Pointer handlers and GSAP quick setters removed cleanly |
| `pnpm typecheck` | Pass | Strict TypeScript passes after restoration |
| `git diff --check` | Pass | No whitespace errors |
| Live Playwright pointer probe | Pass | Pointer movement changed the pill by 0 px on both axes; no divider element remained |

### Responsive pill remeasurement

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Function-based GSAP values are lint-clean |
| `pnpm typecheck` | Pass | Responsive `fromTo` timeline passes strict TypeScript |
| `pnpm test:unit` | Pass | 3 tests |
| `git diff --check` | Pass | No whitespace errors |
| Live Playwright resize probe | Pass | At 1440×900, 900×700, and 390×844 the pill re-aligned with its slot after resize; maximum difference was 0.4 px from subpixel rounding |
| `pnpm exec cross-env 'NODE_OPTIONS=--no-deprecation --import=tsx/esm' playwright test --config=playwright.config.ts --workers=1` | Pass | 6 Chromium tests reused the active development server |
| Move generated Playwright report outside the workspace | Pass | Report preserved under `/tmp` to keep later lint runs scoped to project files |

### Resend email adapter

| Command | Result | Notes |
|---|---|---|
| `pnpm add @payloadcms/email-resend@3.86.0` | Pass | Adapter version matches Payload 3.86.0 |
| `pnpm lint` | Pass | Email configuration and environment checks are lint-clean |
| `pnpm typecheck` | Pass | Adapter options and environment declarations pass strict TypeScript |
| `pnpm test:unit` | Pass | 3 tests |
| `pnpm test:integration` | Pass | 1 database-backed Payload test; expected log-only warning while Resend variables are absent |
| `git diff --check` | Pass | No whitespace errors |
| Partial Resend environment probe | Pass | API key without sender address was rejected |
| Complete Resend environment probe | Pass | Adapter configured with non-secret test values |
| `GET /admin/login` | Pass | 200 from the active development server |
| `pnpm dlx vercel@latest whoami` | Pass | Authenticated Vercel CLI access confirmed |
| `pnpm dlx vercel@latest env ls production` | Pass | Existing production variables present; Resend variables intentionally absent until the real key is added |

No real API key was written to the repository, and no delivery attempt was made
with test credentials. Add the real key and verified sender locally and in the
deployment environment before testing password-reset delivery.

### GitHub and Vercel deployment

| Command | Result | Notes |
|---|---|---|
| `git push origin development` | Pass | Resend adapter commit `60b9f4b` pushed |
| First `pnpm dlx vercel@latest deploy --prod --yes` | Superseded | Build passed and reached `READY`, but Vercel reported a local `.env` file in the upload |
| Add `.vercelignore` and `git push origin development` | Pass | Security fix `abfc5cc` excludes local environment files and generated artifacts |
| Final `pnpm dlx vercel@latest deploy --prod --yes` | Pass | Production deployment `dpl_57UhmvX4YFZuLrH6MSRgMLicZFu5` reached `READY`; no `.env` detection warning |
| Production alias health checks | Pass | `/`, `/admin/login`, `/api/users/me`, and `/sitemap.xml` returned 200 |
| Custom-domain health check | Blocked by external configuration | `vorteksdigital.co.za` exists in the Vercel account but is not assigned to this project and returns Vercel 404 |

The final Vercel build passed production compilation, strict TypeScript, static
generation, and sitemap generation. Existing documented warnings remain for
Sharp being disabled and the missing persistent upload storage adapter.

## 2026-07-31

Resend production environment activation.

| Command | Result | Notes |
|---|---|---|
| Add `RESEND_API_KEY` to Vercel production | Pass | Value transferred from ignored local environment through stdin and stored as sensitive |
| Add `RESEND_FROM_ADDRESS` and `RESEND_FROM_NAME` to Vercel production | Pass | Both stored as sensitive production variables |
| `pnpm dlx vercel@latest deploy --prod --yes` | Pass | Deployment `dpl_CrGh9bjMu7wCkF5eYTV1D2DZg57c` reached `READY` |
| Production `/` and `/admin/login` health checks | Pass | Both returned 200 |
| Production forgot-password delivery test | Blocked by external configuration | Resend returned 403 because `vorteksdigital.co.za` is not verified in the Resend account |

No secret value was printed or committed. Verify the sender domain in Resend
before retrying delivery; no application redeploy is required after domain
verification.

### Canonical production domain correction

| Command | Result | Notes |
|---|---|---|
| First Vercel environment update attempt | No change | CLI required explicit `--yes` confirmation |
| Update production `NEXT_PUBLIC_SERVER_URL` | Pass | Corrected to `https://vorteksdigital.co.za` |
| Initial production redeploy | Superseded | Canonical metadata was correct, but an uploaded local generated sitemap still contained `localhost` URLs |
| Exclude generated sitemap/robots files and push `f3d0108` | Pass | Vercel upload now omits local generated SEO artifacts |
| Final `pnpm dlx vercel@latest deploy --prod --yes` | Pass | Deployment `dpl_FGKAAQwaXnK8HEYqXYPueNnPkHXv` reached `READY` and was aliased to the custom domain |
| Live canonical, sitemap, `www`, and Admin checks | Pass | Homepage metadata and sitemap use `https://vorteksdigital.co.za`; `www` redirects to apex; Admin returns 200 |

### Custom-domain coming-soon gate

| Command | Result | Notes |
|---|---|---|
| `pnpm lint` | Pass | Standalone route, proxy, and utility are lint-clean |
| `pnpm typecheck` | Pass | Hostname routing and page metadata pass strict TypeScript |
| `pnpm test:unit` | Pass | 15 tests, including custom-domain gating and infrastructure bypass cases |
| `git diff --check` | Pass | No whitespace errors |
| Local host-header probes | Pass | Custom-domain `/` rendered coming soon; localhost `/` retained the full homepage; custom-domain Admin and API returned their normal responses |
| Desktop and mobile Playwright review | Pass | 1440×900 and 390×844 rendered without horizontal overflow; reduced-motion presentation reviewed |
| Standalone Axe audit | Pass | 0 WCAG A/AA violations on the coming-soon page |
| `git push origin development` | Pass | Feature commit `abd936f` pushed to GitHub |
| `pnpm dlx vercel@latest deploy --prod --yes` | Pass | Deployment `dpl_EvKHCPRBd44Z3AaawBRsf7G4Hw9i` compiled, typechecked, generated 14 routes, reached `READY`, and was aliased to the custom domain |
| Live custom-domain checks | Pass | Apex, `/posts`, and redirected `www` render the noindex coming-soon page; Admin and API bypass the gate with 200 responses |
| Authenticated deployment-host check | Pass | Protected Vercel deployment URL renders the full CMS homepage for private review |

The active development server on port 3000 was reused and left running. A local
production build was not started because it would share Next's output directory
with that process; the Vercel production build supplies the production compile
check for this release. The stable Vercel production alias redirects to the
custom domain; use the protected deployment URL to review the full site.

### Supplied header integration

| Command | Result | Notes |
|---|---|---|
| Initial `pnpm lint` | Expected failure | The untracked reference JSX violated current React effect rules; it was removed after its behavior was ported |
| Remove `delete-once-implemented` | Pass | All three supplied reference files and the now-empty directory were deleted after implementation |
| `pnpm lint` | Pass | Typed header component and scoped CSS are lint-clean |
| `pnpm typecheck` | Pass | Payload navigation, dialog refs, timers, and theme integration pass strict TypeScript |
| `pnpm test:unit` | Pass | 19 tests, including Cape Town time, reference URLs, and active-route behavior |
| Temporary isolated development server | Pass with fallback | Turbopack rejected the intentionally external `node_modules` symlink; the temporary copy ran with webpack on port 3100 without touching the active port-3000 process |
| Desktop/mobile Playwright review | Pass | Fixed blended desktop header, full-width mobile drawer, 390×844 reflow, theme persistence, Escape/focus return, scroll lock, and breakpoint cleanup verified |
| Closed/open drawer Axe audit | Pass | 0 WCAG A/AA violations in either mobile state |
| Initial focused header E2E runs | Failed, fixed | Chromium returned focus to the click target after an immediate focus request; a guarded delayed request made focus placement deterministic |
| Final frontend E2E | Pass | 3 Chromium tests cover homepage rendering and both responsive header flows |
| `CI=1 pnpm test:e2e` | Pass | 8 serialized Chromium tests, including Admin, frontend, Axe, and responsive header coverage |
| `git diff --check` | Pass | No whitespace errors |
| `git push origin development` | Pass | Header commit `60bb4f0` pushed to GitHub |
| `pnpm dlx vercel@latest deploy --prod --yes` | Pass | Deployment `dpl_BnehymkxV9J3srf8egxhPAi9pUXN` compiled, typechecked, generated 14 routes, and reached `READY` |
| Production route checks | Pass | Custom domain and `www` retain the noindex coming-soon page; Admin and API return 200; authenticated deployment hostname contains the new VRTKS header |

The isolated test copy and its copied environment files were deleted after use.
Generated Playwright reports were preserved under `/tmp`. The original active
development server on port 3000 remains running.
