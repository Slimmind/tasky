# Investigation: Bun dev startup issue

## Hand-off Brief

1. **What happened.** `bun run dev` reaches Vite ready, then TanStack Router's code-splitter throws on ordinary modules such as `/src/main.tsx`.
2. **Where the case stands.** Concluded; the failure is traced to the dev transform filter path between Vite 5.4.6 and unplugin 2.3.5.
3. **What's needed next.** Align Vite/unplugin/Rollup versions, then verify `/src/main.tsx` returns HTTP 200; no dependency edits were made, and Vite regenerated the route tree during startup.

## Case Info

| Field            | Value |
| ---------------- | ----- |
| Ticket           | N/A |
| Date opened      | 2026-11-05 |
| Status           | Concluded |
| System           | macOS; Bun 1.4.0; Node.js 22.23.4; Vite 5.4.6; Rollup 4.53.3; unplugin 2.3.5 |
| Evidence sources | User report; browser page; local HTTP response; package/config files; git status |

## Problem Statement

User report (verbatim): “у нас проблемы запуска проекта через bun run dev” (“we have problems starting the project with `bun run dev`”). This is a symptom description; the exact expected and observed behavior is not yet known.

## Evidence Inventory

| Source | Status | Notes |
| ------ | ------ | ----- |
| User report | Available | Names `bun run dev`, but provides no terminal output or exact symptom. |
| Browser page | Available | Tasky page at `http://localhost:5173/`; recent browser events report three HTTP 500 resource failures. |
| User's terminal output | Available | `bun run dev` starts Vite, then logs the same split-value error for `src/main.tsx`, Vite's client module, and React Refresh. |
| Local HTTP response | Available | `GET /src/main.tsx` returns HTTP 500 with a TanStack Router code-splitter error. |
| Runtime/package config | Available | Bun 1.4.0; package script is `dev: vite`; `bun run dev -- --help` invokes Vite 5.4.6 successfully. |
| Source/config | Available | `vite.config.ts` enables `autoCodeSplitting`; the generated route tree does not include `src/routes/__root.test.ts`. |
| Isolated reproduction | Available | Node Vite CLI copies of the source/config return HTTP 500 even without the route test; programmatic Vite API copies returned HTTP 200. This distinguishes the CLI dev transform path. |
| Same-root reproduction | Available | A fresh `bun run dev` in the workspace returns HTTP 500 for `/src/main.tsx`; restarting with Vite `--force` also returns HTTP 500. |
| Version control | Partial | Working tree contains many pre-existing/unrelated modifications, including `vite.config.ts`, `src/main.tsx`, and `src/routeTree.gen.ts`; no changes were made during this investigation. |

## Investigation Backlog

| # | Path to Explore | Priority | Status | Notes |
| - | --------------- | -------- | ------ | ----- |
| 1 | Align Vite, unplugin, and Rollup versions so the TanStack code-split filter is honored in the dev server | High | Open | No source change made; after dependency alignment, validate `/src/main.tsx` returns HTTP 200. |

## Timeline of Events

| Time | Event | Source | Confidence |
| ---- | ----- | ------ | ---------- |
| 2026-11-05 17:12:11 UTC | Browser records three failed resource loads with HTTP 500. | Browser page event history | Confirmed |
| 2026-11-05 17:14:50 UTC | `GET /src/main.tsx` returns HTTP 500: “The split value for the virtual route .../src/main.tsx was not found.” The reported stack begins in `@tanstack/router-plugin`'s code-splitter plugin. | Local HTTP response | Confirmed |
| 2026-11-05 | `bun run dev -- --help` resolves the package script to Vite 5.4.6 and exits successfully. | Local command output | Confirmed |
| 2026-11-05 17:12:11 UTC | The user's `bun run dev` logs the test-file route warning, generates a route tree, reaches Vite ready, then reports split-value errors for `src/main.tsx`, Vite's client module, and React Refresh. | User-provided terminal output | Confirmed |
| 2026-11-05 | Disposable copies of the source and exact `vite.config.ts` return HTTP 200 for `/src/main.tsx`. Tests with splitting on, splitting off, and splitting on while ignoring `*.test.*` all return HTTP 200; the route-file warning appears in the non-ignored copy. | Isolated local reproduction | Confirmed |
| 2026-11-05 17:23 UTC | A fresh `bun run dev` in the workspace reaches Vite ready; requesting `/src/main.tsx` returns HTTP 500 with the same missing split-value error. A second run with `--force` on port 5174 also returns HTTP 500. | Local reproduction | Confirmed |
| 2026-11-05 17:27 UTC | With `TSR_VITE_DEBUG=true`, a normal `/src/main.tsx` request logs `Splitting Route: .../src/main.tsx` before the split-value error. A Node Vite CLI copy also returns HTTP 500 even after removing `src/routes/__root.test.ts`. | Local source trace and isolation | Confirmed |
| 2026-11-05 | `bun --bun run dev -- --port 5179` also reaches Vite ready and returns HTTP 500 for `/src/main.tsx`. A programmatic Node Vite API copy returns HTTP 200, highlighting the difference between the CLI dev transform and the API probes. | Local reproduction | Confirmed |

## Confirmed Findings

### Finding 1: The current Vite server fails to transform the application entry module

**Evidence:** The user's terminal output and the local response for `/src/main.tsx` both report HTTP 500. The error message is `The split value for the virtual route "/Users/Pavlo_Siroshtan/Sites/tasky/src/main.tsx" was not found.` The stack points to `node_modules/@tanstack/router-plugin/dist/esm/core/router-code-splitter-plugin.js` and identifies plugin `tanstack-router:code-splitter:compile-virtual-file`.

**Detail:** This confirms a module-transform failure in the current dev server. It does not yet establish that starting the server with `bun run dev` itself fails; that command's `--help` path succeeds and the current server is serving HTTP.

### Finding 2: Automatic code splitting is enabled and activates the Router code-splitter plugin

**Evidence:** `vite.config.ts:10` sets `autoCodeSplitting: true`. In installed `@tanstack/router-plugin` 1.125.0, `router-composed-plugin.js` adds the route code-splitter plugin when that option is enabled; its virtual-file transform expects a `tsr-split` search parameter (`router-code-splitter-plugin.js`).

**Detail:** This ties the configured feature to the plugin named in the error. The expected split metadata is still untraced.

### Finding 3: The route scanner warns about the route-guard test, but the generated route tree excludes it

**Evidence:** The user's terminal output says `src/routes/__root.test.ts` does not export a route piece. That test file is present under `src/routes/`, while `src/routeTree.gen.ts:13-20` imports only route modules and does not import the test file.

**Detail:** The warning is real, but current evidence does not establish that it causes the split-value errors.

### Finding 4: Vite CLI and programmatic API reproductions differ

**Evidence:** A disposable copy run through the Node Vite CLI returns HTTP 500 for `/src/main.tsx`, even after removing `src/routes/__root.test.ts`. Programmatic Vite API copies returned HTTP 200, including with automatic code splitting enabled.

**Detail:** The CLI behavior reproduces outside the project root and does not depend on the route-test file. The successful programmatic API probes did not exercise the same CLI startup path and are not evidence that the reported command is healthy.

### Finding 5: The failure persists in a fresh server and after forced dependency re-optimization

**Evidence:** A new `bun run dev` process in the actual workspace reaches Vite ready, then `/src/main.tsx` returns HTTP 500 with the missing split-value message. Repeating with `bun run dev -- --force --port 5174` and `bun --bun run dev -- --port 5179` produces the same result.

**Detail:** This confirms the failure is reproducible in the actual workspace and weakens a stale running-process or optimized-dependency-cache explanation.

### Finding 6: Vite's dev transform invokes the code-splitter handler without applying its ID filter

**Evidence:** The code-splitter declares an ID filter for `/tsr-split/` at `node_modules/@tanstack/router-plugin/dist/esm/core/router-code-splitter-plugin.js:182-184`, then throws if the split query is absent at `:90-93`. With `TSR_VITE_DEBUG=true`, requesting `/src/main.tsx` logs `Splitting Route: /Users/Pavlo_Siroshtan/Sites/tasky/src/main.tsx` immediately before the error. Vite 5's dev container extracts `hook.handler` at `node_modules/vite/dist/node/chunks/dep-DyBnyoVI.js:48667` and invokes each transform handler at `:49031` without evaluating a filter. The installed Vite exposes Rollup 4.53.3 (`:16765`, `:48813`); `unplugin` 2.3.5 skips its fallback filter when Rollup is at least 4.40 (`node_modules/unplugin/dist/index.js:1510-1526`).

**Detail:** The runtime trace and source establish the failure mechanism: the virtual-file handler runs for the ordinary entry module, then fails because it has no `tsr-split` value. The incompatibility is in Vite's dev transform-hook filtering, not Bun startup, test discovery, or the Vite dependency cache.

## Deduced Conclusions

### Deduction 1: The issue is at least partly a route-plugin transform failure

**Based on:** Confirmed Findings 1, 2, 5, and 6.

**Reasoning:** Fresh Vite CLI runs in the workspace and in a disposable copy fail on the same transform. Debug logging shows the code-splitter handling the ordinary entry ID; Vite's dev container invokes hook handlers without checking filters, and unplugin skips its fallback filter for the installed Rollup version.

**Conclusion:** `bun run dev` successfully starts Vite; the subsequent failure is a Vite 5 dev-transform/unplugin filter compatibility issue. The route-test warning and Bun itself are not the cause.

## Hypothesized Paths

### Hypothesis 1: Original-project Vite state or generated split metadata is inconsistent

**Status:** Refuted

**Theory:** The original project root or its active Vite/cache state causes a virtual-module request to reach the code-splitter without a split value.

**Supporting indicators:** The error occurs only when the code-splitter sees an ordinary module ID without a split value.

**Would confirm:** A same-root fresh reproduction and plugin/request trace identify project-root-specific metadata as the cause.

**Would refute:** The same error occurs in a disposable Vite CLI copy and source tracing identifies a general plugin-filtering problem.

**Resolution:** A disposable Vite CLI copy also fails, even without the route test, and the Vite/unplugin source path explains why the handler runs on a normal entry module.

### Hypothesis 2: The route-guard test under `src/routes/` interferes with route discovery

**Status:** Refuted as a sufficient cause

**Theory:** The route generator treats `src/routes/__root.test.ts` as a route candidate, and this discovery behavior may disrupt automatic split metadata generation.

**Supporting indicators:** The user's Vite log says the file does not export a route piece.

**Would confirm:** Excluding or relocating only this test makes route discovery clean and the split-value failure disappears in a controlled comparison.

**Would refute:** The same split-value error persists when the test file is excluded, or inspection shows the warning has no effect on split metadata.

**Resolution:** In a disposable copy, the same test-file warning occurs with code splitting enabled but `/src/main.tsx` still transforms with HTTP 200. Ignoring the test file also yields HTTP 200, so the warning alone is not sufficient to explain the reported failure.

### Hypothesis 3: `autoCodeSplitting` alone is the root cause

**Status:** Refuted

**Theory:** Enabling automatic code splitting, independent of how Vite runs its dev transform pipeline, causes the missing split-value error.

**Supporting indicators:** The stack is inside TanStack Router's code-splitter plugin, and `vite.config.ts:10` enables automatic code splitting.

**Would confirm:** The exact config consistently fails in a clean disposable copy.

**Would refute:** The exact config and source transform successfully with automatic code splitting enabled.

**Resolution:** Programmatic API copies with `autoCodeSplitting: true` returned HTTP 200; the failing mechanism requires the CLI's Vite dev transform path and the installed filter-handling combination.

### Hypothesis 4: A stale Vite optimized-dependency cache causes the missing split value

**Status:** Refuted

**Theory:** The failing transform is caused by stale Vite dependency-optimization output.

**Supporting indicators:** The error occurs in a long-lived workspace whose current transformed output differs from a disposable copy.

**Would confirm:** Starting Vite with forced dependency re-optimization clears the error.

**Would refute:** The same error persists after forced re-optimization.

**Resolution:** A fresh `bun run dev -- --force --port 5174` still returns HTTP 500 for `/src/main.tsx`.

### Hypothesis 5: Vite 5 dev transform filtering is incompatible with the installed unplugin/Rollup filter detection

**Status:** Confirmed

**Theory:** Vite's dev transform pipeline invokes the TanStack virtual-file hook for ordinary module IDs, while unplugin skips its own filter because the exposed Rollup version is at least 4.40; the handler then throws because the ordinary ID has no `tsr-split` value.

**Supporting indicators:** Vite 5.4.6's dev container invokes only each hook's `handler`; Vite exposes Rollup 4.53.3; unplugin 2.3.5 uses a 4.40 threshold before bypassing its fallback filter; the live debug log shows the virtual-file handler running on `/src/main.tsx`.

**Would confirm:** The installed source/version chain and live transform trace agree on the filter being bypassed for the ordinary entry ID.

**Would refute:** The virtual-file handler is shown to receive a matching `tsr-split` query or the Vite dev container applies the declared hook filter.

**Resolution:** Confirmed by the source chain and the reproducible `/src/main.tsx` transform failure.

## Missing Evidence

| Gap | Impact | How to Obtain |
| --- | ------ | ------------- |
| Dependency-alignment verification | Confirms the proposed version fix. | After selecting compatible Vite/unplugin/Rollup versions, rerun the dev CLI and request `/src/main.tsx`. |

## Source Code Trace

| Element | Detail |
| ------- | ------ |
| Error origin | `node_modules/@tanstack/router-plugin/dist/esm/core/router-code-splitter-plugin.js:90-93`, `handleCompilingVirtualFile`. |
| Trigger | Vite 5 dev request to transform `/src/main.tsx`. |
| Condition | The dev plugin container calls the virtual-file transform without applying its `/tsr-split/` filter; unplugin skips its fallback because Vite exposes Rollup 4.53.3. |
| Related files | `vite.config.ts:10`, `node_modules/unplugin/dist/index.js:1510-1526`, `node_modules/vite/dist/node/chunks/dep-DyBnyoVI.js:48667,49031`. |

## Conclusion

**Confidence:** High

Confirmed: fresh Vite CLI runs reach ready and then fail when transforming `/src/main.tsx`; `--force` does not help, and removing the route test in a disposable CLI copy does not help. Vite's dev transform loop invokes the TanStack virtual-file handler for an unfiltered entry ID. Its filter is bypassed by unplugin 2.3.5's native-filter detection for the installed Rollup 4.53.3, which Vite 5.4.6's dev container does not honor. This explains the missing `tsr-split` error. Confidence is High; the fix direction is dependency-version alignment.

## Recommended Next Steps

### Fix direction

No application-code change is needed. Align dependency versions so the Vite dev transform honors the filter, then rerun the dev server and verify `/src/main.tsx` returns HTTP 200.

### Diagnostic

Select a compatible Vite/unplugin/Rollup combination. Candidate directions are a Vite version whose dev container supports transform-hook filters, or a compatible Rollup version below unplugin's 4.40 native-filter threshold (subject to Vite's peer range). After aligning, start the actual CLI and confirm `/src/main.tsx` returns HTTP 200 without the split-value error.

## Reproduction Plan

1. Run `bun run dev` in the repository.
2. Request `http://localhost:5173/src/main.tsx` (or the port printed by Vite).
3. Check whether the response is HTTP 500 and whether it contains the missing split-value error.
4. Compare with the user's terminal output to determine whether startup or subsequent module transformation is failing.

## Side Findings

- The working tree was already heavily modified before this investigation; no manual edits were made to its existing source changes.
- Vite regenerated the already-dirty `src/routeTree.gen.ts` during the requested startup reproductions; no other source files were intentionally edited.
