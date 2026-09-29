---
name: url-shortener-logic-guidelines
description: Guidelines for working inside libs/engine (@url-shortener/engine), the URL shortener domain-logic library — its scope, folder structure, how the web app (or any outside consumer) uses it through the public API, and how to test it. Use whenever creating, changing, reviewing, or testing anything under libs/engine/, adding a use case or port for shortening/resolving URLs, changing what the engine exports, or when the web app needs new URL shortener behavior.
---

# URL Shortener Engine Guidelines

`libs/engine` (`@url-shortener/engine`) is the domain-logic library of the URL shortener. For architecture and code formats follow `domain-driven-design`; for test conventions follow `testing-practices`. This skill only covers what is specific to this package.

## 1. Scope

**Owns:** all URL shortener business logic — validating a URL, generating and guaranteeing unique short codes, storing and resolving shortened URLs, what happens for an unknown code, building the public short link.

**Does not own:** anything UI, routing, HTTP or other delivery concerns. The engine is consumer-agnostic: a web app, an API, a CLI or a worker can all use it. If a rule answers "what does shortening a URL mean?", it belongs here, not in the consuming app (a route, a controller, a CLI command).

Constraints that follow from that:

- **Framework-free.** No React, React Router, Vite or any UI/HTTP-framework import. It must run in plain Node.
- **No DOM types.** `lib` is `ES2022` with only `@types/node`; don't use `window`, `document`, etc.
- **Unaware of the delivery mechanism.** No routes, requests, cookies, status codes or HTML. Use cases return `Response` objects and throw domain errors; each consumer decides how to present them.
- **Generated values come from the caller.** Short codes, ids and dates are generated outside the engine and passed in the use case `Query`, never produced with `Math.random()` or `Date` in domain/application code. Env-based configuration is read only in `src/config.ts` (see Config).
- **Business rules live once, here.** If validation shows up in a consumer, move it into a use case.

## 2. Structure

```
libs/engine/
  src/
    index.ts                      # public API only
    config.ts                     # Configuration parameters + env vars parsed
    modules/
      <context>/                  # start with one, e.g. shortened-url
        domain/                   # entities, repository/generator ports, domain errors
        application/              # use cases + their Query/Response types
        infrastructure/<kind>/    # adapters (e.g. persistence/in-memory)
        services.ts               # wiring: adapters → use cases
      shared/{domain,infrastructure}/ + services.ts
  tests/                          # mirrors src/, never tests inside src/
```

Imports inside the engine use the path aliases from `tsconfig.json`: `@src/*` for `src/` and `@tests/*` for `tests/`, with the `.js` extension (e.g. `import { ShortLink } from '@src/modules/shortened-url/domain/ShortLink.js'`). Never use relative imports (`../`, `./`).

## 3. Config

All configuration lives in `src/config.ts`.

The config file exports a single frozen object, `config`. Its properties are either:

- **Constants**: fixed defaults and limits that are safe to commit (e.g. default page limit).
- **Env-derived values**: anything environment-specific or sensitive, read from an env variable (e.g. API keys, connection strings, URLs).

Example of a config object format
```ts
import * as process from "node:process";

export default Object.freeze({
  databaseUrl: process.env.DATABASE_URL,
  defaultPageLimit: 5,
});
```

- **One place for env reads.** `process.env` is accessed only in `config.ts`; nothing else in the engine touches it.
- **Who imports it.** Only infrastructure adapters and `services.ts` wiring import `config`, and pass values to adapters/use cases via constructor arguments. Domain and application code never import it.
- **Adding a parameter.** Add a property (camelCase name, `UPPER_SNAKE_CASE` env var), and document the env var in the root `.env.example`.
- **Missing values.** `process.env.X` is `string | undefined`. Parse and validate in `config.ts`, and fail fast with a clear error for required values rather than passing `undefined` downstream.
- **Consumers own the environment.** The engine only reads env vars; setting them is up to whichever app runs it.

## 4. How to use from outside

The engine is consumer-agnostic: any app (web, API, CLI, worker) uses it the same way, and `src/index.ts` is the only door.

- Import from the package name: `import { … } from "@url-shortener/engine"`. Never deep-import (`@url-shortener/engine/src/...`); the `exports` map forbids it.
- Export the **wired use cases** (from each context's `services.ts`) and their `Query` / `Response` types. Don't export entities, repositories, adapters, schemas or config; that leaks internals to consumers.
- A consumer calls a use case with a `Query`, gets a `Response`, and maps domain errors to its own output (HTTP status, exit code, message). It holds no business logic.
- Nothing in the engine may assume a particular consumer.
- Removing or renaming an export requires updating every consumer in the same change; `pnpm typecheck` at the root must pass.

## 5. Database

Data is persisted in a PostgreSQL database, accessed through [Prisma](https://www.prisma.io/) (with the `@prisma/adapter-pg` driver adapter).

- **Schema:** `libs/engine/prisma/schema.prisma` is the single source of truth for the data model. Prisma config (schema path, migrations path, `DATABASE_URL`) lives in `libs/engine/prisma.config.ts`.
- **Generated code:** the Prisma client is generated into `libs/engine/src/generated/prisma`. Never edit it by hand; regenerate it instead.
- **Usage:** Prisma is an infrastructure detail. Only repository adapters in the infrastructure layer may use the generated client; domain and application layers never import it, and it is not exported from `src/index.ts`.
- **Commands** (run from `libs/engine`, with `DATABASE_URL` set):
  - `pnpm db:generate` regenerates the Prisma client after any change to `schema.prisma`.
  - `pnpm db:push` pushes the schema to the database (no migration files).
  - After changing the schema, run both: `pnpm db:push && pnpm db:generate`.


## 6. Tests

- The tests related to url shortener logic are located in `libs/engine/tests`.
- When writing tests, follow the guidelines defined in `testing-practices`.
