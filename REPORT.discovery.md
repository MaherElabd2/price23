## Discovery Report (Phase 0)

### Summary
- TypeScript: 0 errors (tsc --noEmit)
- ESLint: Not run – missing config (no eslint.config.*). Needs setup.
- Next build: Compiled with warnings – multiple attempted import errors from `@/utils/startup-calculations`.

### Diagnostics Details
- TypeScript (npx tsc --noEmit)
  - No errors printed.

- ESLint (npx eslint . --ext .ts,.tsx --max-warnings=0)
  - Blocked: ESLint v9 requires `eslint.config.js` (flat config). No config present.
  - Action for Phase 1: add ESLint flat config and run lint to enumerate issues.

- Next Build (npx next build)
  - Build completed with warnings.
  - Repeated attempted import errors from `@/utils/startup-calculations` used by startup steps:
    - Missing exports referenced: `inferDifferentiationLevel`, `getRecommendedStrategy` (aliased as `getRecStrategy`), `getRecommendedMargin`, `calculatePriceByStrategy`, `calculateFinalPrice`, `sectorBenchmarks`, `parseStartupMinPercent`, `computeProductCosts`.
  - Impact: Affected files include:
    - `components/steps/startup/step-6-strategic-goals.tsx`
    - `components/steps/startup/step-8-final-outputs.tsx`
    - `components/branches/startup-branch.tsx`
    - `components/pricing-wizard.tsx`
    - `app/page.tsx` (via imports)

### Route Inventory (App Router)
- `app/layout.tsx`: Root layout
- `app/page.tsx`: `/` – Home/pricing wizard entry
- `app/services/page.tsx`: `/services`

No routing changes performed. No proposals yet; see “Potential Route Changes” if any arise later.

### Shared Modules Inventory
- Components (`components/`):
  - Core: `header.tsx`, `footer.tsx`, `language-switcher.tsx`, `pricing-wizard.tsx`, `navigation-buttons.tsx`, `progress-bar.tsx`, `wizard-step.tsx`, `theme-provider.tsx`
  - Branches: `components/branches/startup-branch.tsx`
  - Steps: `components/steps/step-0-basic-info.tsx` through `step-12-results.tsx` and startup sub-steps
  - UI: `components/ui/...` (not exhaustively listed)
- Hooks (`hooks/`): `use-local-storage.ts`, `use-mobile.ts`, `use-toast.ts`
- Utils (`utils/`): `startup-calculations.ts`, `calculations.ts`, `product-cost.ts`, `allocation.ts`, `fixed-cost-helpers.ts`, `input-helpers.ts`, `assert.ts`
- Contexts (`contexts/`): `language-context.tsx`
- Lib (`lib/`): exports, PDF and CSV generators, `validation(.*)`, `cost-allocation.ts`, `pricing-recommendation.ts`, translations helpers
- Types (`types/`): `startup.ts`, `lucide-react.d.ts`
- Public assets (`public/`): placeholder images

### i18n / Translations
- Found translation helpers/files in `lib/startup-translations.ts` and `lib/translations.ts`.
- UI strings appear mixed: many components likely contain hardcoded Arabic/English. Phase 1 will route all user-facing text through `t(...)` per policy.

### Mismatch: utils/startup-calculations exports vs imports
- Actual exports in `utils/startup-calculations.ts` include:
  - `calculateMonthlyQuantity`, `calculateUnitVariableCost`, `calculateAdditionalCosts`, `calculateBreakEven`, `validateQuantityRealistic`, `calculateLTV`, `calculateCAC`, `calculateLTVCACRatio`, `calculateBurnRate`, `calculateContributionMargin`, `calculateSuggestedPrice`.
- Referenced but missing (causing build warnings):
  - `inferDifferentiationLevel`, `getRecommendedStrategy`, `getRecommendedMargin`, `calculatePriceByStrategy`, `calculateFinalPrice`, `sectorBenchmarks`, `parseStartupMinPercent`, `computeProductCosts`.
- Next steps (Phase 1): either implement and export these utilities in `utils/startup-calculations.ts` or adjust imports to existing utilities if equivalents exist elsewhere (without changing routing).

### Unused / Large / Duplicate Candidates
- Root installers/binaries likely unrelated to app runtime:
  - `7z2501-x64.exe`, `ChromeSetup.exe`, `CursorUserSetup-x64-1.5.9.exe`, `node-v24.7.0-x64.msi`
  - Reason: Development tools/installers not required for Next.js app; increase repo size and noise.
  - Recommendation: Exclude from repo or move outside workspace; mark as deletion candidates after confirmation.
- Public placeholder assets have multiple variants (`placeholder-*`), likely OK; keep unless proven unused.

### Potential Route Changes (Proposals Only, NOT applied)
- None identified in Phase 0. Current routes are minimal and consistent.

### Decisions
- ESLint is not configured; will add flat config in Phase 1 to enable linting and auto-fixes.
- i18n centralization will be enforced in Phase 1; no key renames unless necessary and will be documented.

### Next
1) Implement Phase 1 safe fixes without altering routing:
   - Add ESLint flat config and scripts; run lint and typecheck.
   - Fix missing exports/imports in `utils/startup-calculations.ts` vs startup steps.
   - Centralize hardcoded strings to translations and ensure `t(...)` usage via header language switcher.
   - Prepare `REPORT.fix-safe.md` with resolved issues and deletion candidates list.
