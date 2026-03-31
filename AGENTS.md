# AGENTS.md

## Overview & Agent Coding Goals

This file distills code conventions, build/test/run instructions, and style guidelines for agentic developers (e.g., AI agents) working in this repository. **Follow these to maximize success, avoid stylistic churn, and ensure your changes integrate seamlessly.**

---

## Project Structure Summary

- **Monorepo**: Root with `/client` (React App with TanStack Start), `/server`, `/scripts` (Bun, Drizzle ORM, etc.)
- **TypeScript-first** (strict mode, JSX for both client/server, see `tsconfig.json`)
- **Biome**: Used as both formatter and linter (see `/biome.json`)
- **No .eslintrc, no Prettier:** Biome configuration is authoritative.
- **Tailwind CSS** for styles (see `/client/src/styles.css`)

---

## Build, Lint, and Test Commands

### At Root
- **Install dependencies:**
  ```sh
  bun install
  ```
- **Start full stack (dev mode):**
  ```sh
  bun run dev
  # or
  bun run client   # client only
  bun run server   # server only
  ```
- **Database:**
  ```sh
  bun run db:up         # Start DB (docker compose)
  bun run db:generate   # Drizzle codegen
  bun run db:migrate    # Run migrations
  bun run db:push       # Push schema
  bun run db:studio     # DB admin UI
  bun run db:seed       # Seed local DB
  ```

### In /client
- **Dev mode (Vite):**
  ```sh
  bun --bun run dev
  # or
  cd client && bun run dev
  ```
- **Build for production:**
  ```sh
  bun --bun run build
  ```
- **Run all tests:**
  ```sh
  bun --bun run test
  # or (inside client)
  bun run test
  ```
- **Run a single test file (Vitest):**
  ```sh
  bun --bun run test path/to/file.test.ts
  ```
- **Run a single test by name:**
  ```sh
  bun --bun run test -t "<test name>"
  ```
- **Run a test by file and line number:**
  ```sh
  bun --bun run test path/to/file.test.ts:LINE
  # E.g.
  bun --bun run test src/some.test.ts:45
  ```

#### Useful Vitest references
- [Vitest Test Filtering Guide](https://vitest.dev/guide/filtering.html)
- `.only` and `.skip` are respected.

---

## Code Style Guidelines

### General
- **Strict TypeScript everywhere.** All files are in strict mode. Do not introduce `any`.
- **Tabs** for indentation (see `biome.json`), not spaces.
- **Double quotes** for strings (see `biome.json`).
- **All code should be formatted and linted by Biome** before PRs or automated commits.
  - Format all files:
    ```sh
    biome format .
    biome lint .
    ```

### Imports
- **Group imports:**
  1. Node/built-in modules
  2. Third-party dependencies
  3. Absolute project imports (using aliases like `#/*` or `@/*`)
  4. Relative imports (`./`, `../`)
- **Unsued imports:** Remove them. Biome linter will flag.
- **Auto-organize imports:** Biome will do this (see `organizeImports` is `on`).
- **Type-only imports:** Use `import type { X } from ...` for types.

### Formatting
- Use Biome for consistent formatting. If you edit a file, **run** `biome format <file>`!
- No trailing whitespace, newline at end of files.
- Tabs for indent. Double quotes, comma-dangle as autofixed by Biome.

### Naming
- **Types:** `PascalCase` (e.g., `UserSession`, `SigninData`).
- **Functions/Vars:** `camelCase` (`getTodos`, `handleLogin`)
- **Components:** `PascalCase` (`TodoItem`, `TodoList`)
- **Constants (file-scope):** Prefer `UPPER_SNAKE_CASE` only for true constants.

### Types & Annotations
- Use explicit types for all exported functions, component props, and server handlers.
- Use inline `zod` schemas for form and API validation.
- Keep types in `.ts` files, not `.d.ts` unless you must augment (never clutter the project root with global type hacks).
- Avoid `as any` casts; use proper Zod/typesafety or refactor.

### Error Handling
- **Always handle errors:** Use `try/catch` around async calls, both client and server.
- **Log descriptive errors:** Use `console.error(error)` with context, and surface user-friendly messages to the UI.
- **API/server errors:**
  - Always return JSON with a clear `error` property and status (see `/server/routes/todos.route.ts`), e.g.:
    ```ts
    return c.json({ error: "failed to fetch todos" }, 500);
    ```
- **Client errors:**
  - Inform users visually of errors, always sanitize error messages before displaying.

### React/Components
- Use **function components** (no classes).
- Props interfaces/types must be explicit.
- Use [TanStack Start](https://tanstack.com/start) idioms (file-based routing, server functions, loader pattern, etc).
- Hooks must be *top-level only*; custom hooks in `/hook/`.
- Always supply `key` for map-rendered elements.
- Handle loading and error states in components.
- Use `zod` for validation schemas.

### Tailwind & CSS
- Favor utility classes directly in JSX (`className`).
- Global modifications belong in `/client/src/styles.css`.

### Server Code
- Use Hono patterns: chainable `.get`, `.post`, `.patch`, proper use of `c.get()`, `c.req.valid()` (see `/server/routes/todos.route.ts`).
- Always validate and check auth in handlers (middleware).
- No hardcoded unvalidated inputs/params.
- Always provide HTTP status codes with JSON error/object.

---

## Further Suggestions for Agents
- Check for updates in `biome.json` if unsure of style.
- Keep code DRY: extract helpers, avoid copy-paste across files.
- **Do not create rules or configs not already present** (e.g., ESLint, Prettier, Cursor or Copilot rules) unless explicitly directed.

---

## Reference
- [Biome Docs](https://biomejs.dev/docs/)
- [Vitest Test Filtering Guide](https://vitest.dev/guide/filtering.html)
- [TanStack Start Docs](https://tanstack.com/start)
- [Tailwind Docs](https://tailwindcss.com/docs)

_Keep this document updated as config and conventions evolve!_
