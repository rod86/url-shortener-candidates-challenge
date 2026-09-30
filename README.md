# URL Shortener

## Tech Stack

```
url-shortener/
├── applications/web/    # React + React Router v7
└── libs/engine/         # Domain logic
```

| Technology                                    | Description                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [pnpm](https://pnpm.io/)                      | Fast, disk-efficient package manager with built-in monorepo support via workspaces                |
| [Turbo](https://turbo.build/)                 | High-performance build system for monorepos. Runs tasks in parallel and caches results            |
| [React](https://react.dev/)                   | Library for building user interfaces with components                                              |
| [React Router v7](https://reactrouter.com/)   | Full-stack React framework. Handles routing, data loading (loaders), mutations (actions), and SSR |
| [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript for catching errors at compile time                                  |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first CSS framework for rapid UI development                                              |
| [Vite](https://vite.dev/)                     | Fast build tool and dev server with hot module replacement                                        |


## Requirements

- Node version 20.20.2 (for dev environment)
- Docker and Docker compose

> *NOTE*: Older Docker versions use a hyphenated command. Run `docker-compose` instead of `docker compose`.
>
> ```bash
> docker compose version   # newer syntax (Docker Compose v2+)
> docker-compose version   # older syntax (v1, standalone binary)
> ```

## Setup development environment

The app runs on your machine with `turbo dev`; only Postgres runs in docker.

- Install [Node Version Manager](https://github.com/nvm-sh/nvm).

- Install and switch to node version.
```shell
nvm install & nvm use
```

- Install dependencies.
```bash
pnpm install
```

- Configure a `.env.dev` file from `.env.example` and set `DATABASE_PASSWORD` (and the password inside `DATABASE_URL`).
```bash
cp .env.example .env.dev
```

> *NOTE*: `DATABASE_URL` in `.env.dev` must point to `localhost`, since the app runs outside docker.

- Start Postgres.
```bash
docker compose --env-file .env.dev up -d postgres
```

- Setup database schema and prisma generated code.
```bash
pnpm db:setup
```

- Start the dev servers. `pnpm dev` loads `.env.dev` and passes it to every turbo task.
```bash
pnpm dev
```

- Open http://localhost:5173

> *NOTE*: Use `pnpm dev` instead of a bare `turbo dev`, otherwise `.env.dev` is not loaded.


## Setup production environment

- Configure a `.env` file from `.env.example`.
```bash
cp .env.example .env
```

- Build and start docker.
```bash
docker compose up -d --build
```

- Setup database schema and prisma generated code.
```bash
docker compose exec --workdir /app/libs/engine web pnpm run db:push
docker compose exec --workdir /app/libs/engine web pnpm run db:generate
```

- Open http://localhost:3000

## Testing

Tests load `.env.dev`, so run them from the host with Postgres up (see *Setup development environment*). Engine integration tests use the database.

### All workspaces (from the repository root)

- `pnpm test`: Run all tests
- `pnpm test:unit`: Run unit tests
- `pnpm test:integration`: Run integration tests

### libs/engine

- `pnpm --filter engine test`: Run all tests
- `pnpm --filter engine test:unit`: Run unit tests
- `pnpm --filter engine test:integration`: Run integration tests

### applications/web

- `pnpm --filter web test`: Run all tests
- `pnpm --filter web test:unit`: Run unit tests
- `pnpm --filter web test:integration`: Run integration tests

### Coverage

- The coverage treshold is **80%*.
- Coverage reports files are output in ``coverage/`` directory in the respective engine and web directories.
  - web: ``applications/web/coverage``
  - engine: ``libs/engine/coverage``
- The coverage formats are:
    - *text*: See coverage info in terminal.
    - *html*: See coverage details in browser. Open ``coverage/index.html``.
    - *json-summary*: Generates a ``coverage/coverage-summary.json`` (per-file totals).
    - *lcov*: Generates a `coverage/lcov.info` (line/branch detail).

> Formats **json-summary** and **lcov** are used by AI. When you ask AI "Explain why the statement "throw new ClickCreationError" (after creation) in @libs/engine/src/modules/click/application/RegisterClickUseCase.ts appears as uncovered",
> AI will use the JSON and lcov files to see the coverage info and analyze the case.