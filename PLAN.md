# Plan: Modernize PostcardPop to Bun + Vite

## Context

PostcardPop is a React 19 TypeScript digital postcard app currently built on **Create React App (react-scripts 5.0.1)** — an unmaintained, legacy build tool. The project has multiple lock files (package-lock.json, pnpm-lock.yaml, bun.lock), outdated CI workflows, unused files, and inconsistent dependencies. The goal is to migrate to **Bun** as the package manager/runtime and **Vite** as the build tool, fix inconsistencies, and modernize the codebase.

## Key Issues Found

### Build & Tooling

- **react-scripts (CRA) is unmaintained** — no updates since 2022, deprecated by React team
- **3 lock files** exist: `package-lock.json`, `pnpm-lock.yaml`, `bun.lock` (should only have `bun.lock`)
- **Mixed package manager usage** in CI — all workflows use `npm ci --legacy-peer-deps`
- **`@types/react-leaflet` is in `dependencies`** but `react-leaflet` is in `devDependencies` — these are swapped
- **`@types/jest`** is a runtime dependency but should be dev
- **`styled-components`** is listed as a devDependency but doesn't appear to be used anywhere in the code
- **`@testing-library/*` packages** are in `dependencies` — should all be `devDependencies`
- **`react-scripts`** is in `dependencies` — should be `devDependencies`
- **`typescript`** is in `dependencies` — should be `devDependencies`
- Missing `homepage` field in package.json (mentioned in README for GitHub Pages)
- Empty `cypress.json` (no config)
- Missing `logo192.png` and `logo512.png` in `public/` (referenced in manifest.json) — have `android-chrome-*` instead

### Code Issues

- **`serviceWorker.ts`** — full CRA service worker file but never imported/used in `index.tsx`
- **`src/index.css`** has generic CRA boilerplate that conflicts with `App.css` (both set body styles)
- **`src/logo.svg`** — unused CRA default logo
- **`src/react-app-env.d.ts`** — CRA-specific type reference, needs replacement for Vite
- **`public/manifest.json`** references missing `logo192.png` and `logo512.png`
- **Duplicate manifests**: `manifest.json` and `site.webmanifest` with conflicting data
- **Google Analytics** uses old UA tracking ID (deprecated — GA4 migration needed or removal)
- **`<meta property="og:*">` tags in React component body** — these don't work; OG tags must be in `<head>`

### CI/CD

- All 4 GitHub Actions workflows use `npm ci --legacy-peer-deps` — should use `bun`
- Cypress test uses hardcoded `localhost:3000`
- Lighthouse CI URL is hardcoded to `github-pages-react-actions` (old repo name?)

## Approach

### 1. Migrate from CRA to Vite + Bun

Replace `react-scripts` with Vite, which is the recommended migration path for CRA projects. Vite is dramatically faster, well-maintained, and works natively with Bun.

**Key changes:**

- Remove `react-scripts`
- Add `vite`, `@vitejs/plugin-react` as dev dependencies
- Create `vite.config.ts`
- Move `index.html` from `public/` to project root (Vite convention)
- Replace `%PUBLIC_URL%` placeholders in HTML with Vite's base path handling
- Update `tsconfig.json` for Vite compatibility
- Replace `react-app-env.d.ts` with `vite-env.d.ts`
- Update package.json scripts (`dev`, `build`, `preview`)
- Use `vitest` instead of Jest for tests

### 2. Clean up dependencies

Move all type/test/build packages to `devDependencies`. Remove unused packages (`styled-components`, `@types/jest`). Fix the react-leaflet type package location.

### 3. Remove dead code & files

- Remove `serviceWorker.ts` (unused)
- Remove `src/logo.svg` (unused)
- Remove `src/index.css` (boilerplate that conflicts with App.css; fold any needed styles into `App.css`)
- Consolidate manifests into one correct file
- Fix `manifest.json` to reference actual icon files
- Remove duplicate lock files (keep only `bun.lock`)

### 4. Modernize CI/CD

- Switch all GitHub Actions workflows to use `oven-sh/setup-bun` action
- Replace `npm ci` with `bun install`
- Replace `npm run` with `bun run`
- Update Cypress base URL
- Remove `--legacy-peer-deps` flag (Bun doesn't need it)

### 5. Fix bugs

- Move OG meta tags to `index.html` with proper `%` template handling
- Add proper `homepage` field to `package.json`
- Clean up Google Analytics (remove deprecated UA or update to GA4)

## Files to Modify

| File                               | Action                                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| `package.json`                     | Rewrite: Bun scripts, Vite deps, fix dep types, add `homepage` |
| `tsconfig.json`                    | Update for Vite (module, types, paths)                         |
| `vite.config.ts`                   | **Create** — Vite config with React plugin                     |
| `src/vite-env.d.ts`                | **Create** — Vite client types                                 |
| `src/react-app-env.d.ts`           | **Delete** — CRA-specific                                      |
| `public/index.html`                | **Move** to root, remove `%PUBLIC_URL%`                        |
| `src/index.tsx`                    | Remove index.css import                                        |
| `src/App.tsx`                      | Move OG meta tags; clean up                                    |
| `src/App.css`                      | Absorb any needed styles from `index.css`                      |
| `src/index.css`                    | **Delete**                                                     |
| `src/serviceWorker.ts`             | **Delete** (unused)                                            |
| `src/logo.svg`                     | **Delete** (unused)                                            |
| `public/manifest.json`             | Fix icon references                                            |
| `public/site.webmanifest`          | **Delete** (duplicate)                                         |
| `src/setupTests.ts`                | Update for Vitest                                              |
| `src/App.test.tsx`                 | Update mocks for Vitest compatibility                          |
| `cypress/integration/home_spec.js` | Keep as-is (Cypress is separate)                               |
| `.github/workflows/ci.yml`         | Use Bun                                                        |
| `.github/workflows/cypress.yml`    | Use Bun                                                        |
| `.github/workflows/lighthouse.yml` | Use Bun                                                        |
| `.github/workflows/pr-test.yml`    | Use Bun                                                        |
| `.gitignore`                       | Add Bun-specific entries, remove npm/yarn entries              |
| `bun.lock`                         | Regenerate with `bun install`                                  |
| `package-lock.json`                | **Delete**                                                     |
| `pnpm-lock.yaml`                   | **Delete**                                                     |
| `lighthouserc.json`                | Update staticDistDir if needed                                 |

## Reuse

- **Vite's built-in handling** replaces: react-scripts, Babel config, webpack config, ESLint CRA integration
- **Vitest** replaces Jest — compatible API, no config changes needed for most tests
- **`@testing-library/react`** — keep, still the standard for React testing
- **`react-leaflet` / `leaflet`** — keep, compatible with Vite
- **Cypress** — keep as-is, runs independently of the build tool
- **GitHub Actions structure** — keep, just swap npm commands for bun

## Steps

- [ ] 1. Create `vite.config.ts` with React plugin and GitHub Pages base path
- [ ] 2. Create `src/vite-env.d.ts`
- [ ] 3. Update `tsconfig.json` for Vite (add vite/client types, update module resolution)
- [ ] 4. Move `public/index.html` → root `index.html`, replace `%PUBLIC_URL%` with `/`, fix OG tags
- [ ] 5. Rewrite `package.json`: Vite scripts (`dev`/`build`/`preview`), move deps to correct sections, remove unused, add Vite packages
- [ ] 6. Delete dead files: `serviceWorker.ts`, `logo.svg`, `index.css`, `react-app-env.d.ts`, `site.webmanifest`
- [ ] 7. Absorb needed `index.css` styles into `App.css`
- [ ] 8. Update `src/index.tsx` — remove `index.css` import
- [ ] 9. Update `src/App.tsx` — remove inline OG meta tags (moved to HTML head)
- [ ] 10. Fix `public/manifest.json` icon references to actual files
- [ ] 11. Update `src/setupTests.ts` for Vitest (use `@vitest/coverage-v8`)
- [ ] 12. Update `src/App.test.tsx` — replace `jest.mock` with `vi.mock`
- [ ] 13. Delete `package-lock.json` and `pnpm-lock.yaml`
- [ ] 14. Run `bun install` to regenerate `bun.lock`
- [ ] 15. Update `.gitignore` for Bun
- [ ] 16. Update all 4 `.github/workflows/*.yml` to use Bun
- [ ] 17. Update `cypress.json` with proper config (baseUrl)
- [ ] 18. Update `lighthouserc.json` if needed
- [ ] 19. Verify build works: `bun run build`
- [ ] 20. Verify tests work: `bun run test`
- [ ] 21. Verify dev server works: `bun run dev`

## Verification

1. **Build**: `bun run build` should produce a `dist/` folder with working production bundle
2. **Dev server**: `bun run dev` should start Vite dev server with HMR
3. **Tests**: `bun run test` should pass (Vitest)
4. **Linting**: No TypeScript errors from `bunx tsc --noEmit`
5. **Manual check**: Open the built site, verify postcard flipping, map rendering, share link generation
6. **CI**: All GitHub Actions workflows run successfully with Bun
