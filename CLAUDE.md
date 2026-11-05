# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (type-check is part of the build)
- `npm run lint` — ESLint over the repo
- `npm test` — Vitest in watch mode (jsdom, globals enabled, setup in `src/test/setup.ts`)
- `npx vitest run` — single non-watch run; `npx vitest run src/components/button/Button.test.tsx` for one file, add `-t "<name>"` for one test

The README is the unmodified Vite template and has no project-specific information. The pre-commit hook (husky) runs `lint-staged`, which calls `prettier`, but prettier is not a dependency and has no config, so that step depends on a global install.

## Architecture

Task/project tracker (package name `tody`, UI text is in Russian) built with React 18 + TypeScript + Vite, using Firebase Auth and Firestore as the backend. There is no server code.

**Data flow.** Firestore is the source of truth and the Zustand store is a read-through cache:
- `src/services/firestore.ts` is the only module that talks to Firestore. It has one collection, `boards`, where each document is a `BoardType` plus a `userId` field. **Tasks are not a separate collection**; they are embedded in `board.tasks`.
- `src/components/StoreInitializer.tsx` (mounted in `main.tsx`) subscribes with `onSnapshot` for the signed-in user and pushes results into `useBoardsStore` (`src/store/boards.store.ts`). It also creates a default "first-board" when a user's first snapshot is empty.
- Store actions (`addBoard`, `updateBoard`, `removeBoard`, `updateTask`, `removeTask`) do **not** mutate local state. They write to Firestore, and the snapshot listener updates `boards`. Task changes read the board's `tasks` array from the store, modify it, and write the whole array back (`saveTasks`), so concurrent edits to the same board's tasks can overwrite each other. `updateBoard` only writes `title`/`description`; never write `tasks` from board edits.
- Only `addBoard` takes `userId` (from `useAuth().currentUser.uid`); it is stored on the document and is what Firestore rules and the subscription query filter on.
- Forms and handlers do not `await` writes before navigating (the promise never settles offline); they `.catch` and log instead. `setBoards` keeps object references for unchanged boards/tasks so `memo` components skip re-renders.
- Security rules live in `firestore.rules` (deploy with `firebase deploy --only firestore:rules`); they are not applied automatically.

**Auth.** `src/context/auth.context.tsx` wraps Firebase Auth in a React context (`useAuth`). `AuthProvider` renders nothing until the first `onAuthStateChanged` fires. Routes are guarded in `src/routes/__root.tsx` (`beforeLoad` redirects to `/signin` when `auth.currentUser` is empty; it reads Firebase directly rather than React state to avoid a race right after login), and `AuthWatcher` (rendered inside the root route, because it needs `useRouter()`) re-runs the guard when the user changes. App bootstrap is split into `src/router.tsx` (`createAppRouter`, router defaults), `src/App.tsx` (provider tree) and `src/main.tsx` (mounting only), so `src/test/App.test.tsx` can render the whole app with a memory history.

**Routing.** TanStack Router with file-based routes in `src/routes/`. The Vite plugin (`tanstackRouter`, `autoCodeSplitting: true`) regenerates `src/routeTree.gen.ts` automatically. Do not edit that file by hand. Never put test or helper files inside `src/routes/`: the plugin treats every file there as a route (tests live in `src/test/` or next to components). Routes are thin and just render a component from `src/components/` (e.g. `/boards/$boardId` renders `<Tasks boardId=... />`). `*.lazy.tsx` files hold the lazily loaded part of a route. `/tasks/add` and `/tasks/edit/$taskId` take `boardId` via search params, validated in the non-lazy `add.tsx` / `edit.$taskId.tsx` route files (the `.lazy.tsx` files hold only the component). `main.tsx` sets the router-wide not-found, error and pending components.

**Domain types** (`BoardType`, `TaskType`, `TaskVariants`, etc.) and some UI copy config live in `src/utils/constants.ts`. Task estimates are strings like `1w 2d 3h 4m` (1w = 5 working days, 1d = 8h), converted with `estimation-to-minutes` / `minutes-to-estimation` in `src/utils/`.

## Conventions

- Each component is a folder `src/components/<kebab-name>/` with `<PascalName>.tsx`, `<kebab-name>.styles.css`, and an `index.ts` that default-exports the component. Import the folder (`import Tasks from '../../components/tasks'`), not the file. (Some `index.ts` files default-export the named component, as `button/index.ts` does.)
- Styling is plain CSS with BEM class names, not CSS modules or Tailwind. Modifiers go through `getMod(base, 'mod1 mod2')` from `src/utils/get-mod.ts`, which yields `base--mod1 base--mod2`. Design tokens (colors as `--*-color-prop` RGB triplets, radii, etc.) are CSS variables in `src/index.css`.
- Small shared components (Button, Input, icons, ...) are imported statically; only route-level code splitting (done by the router plugin) is used, not `React.lazy`.
- Tests mock `services/firestore` and `context/auth.context` with factory mocks (`vi.mock(path, factory)`) because importing `src/firebase.ts` initializes Firebase; shared router/auth mocks are in `src/test/mocks.tsx`.
- TypeScript is `strict` with `noUnusedLocals` and `noUnusedParameters`, so unused imports and variables fail `npm run build`.
- Existing files mix tabs and 2-space indentation and single/double quotes; match the file you are editing.

## Environment

Firebase config is read from `VITE_FIREBASE_*` variables in `.env` (gitignored; keys are listed in `src/firebase.ts`). The local `.env` currently defines `VITE_MESSAGING_SENDER_ID`, but `src/firebase.ts` reads `VITE_FIREBASE_MESSAGING_SENDER_ID`, so the sender ID is `undefined` unless the variable name is fixed.
