# Submission

## What I Did

I did the backend library and the frontend. I prioritized code over UI design and styling.

I followed Test Driven Development methodology to build backend and frontend. I included unit, integration tests and coverage report.

The backend is structured with a basic DDD structure.

The frontend logic is just handlers using services that use the backend library.

I have done the following:

- Modified environment and docker to have 2 environments with their respective env files (``.env`` for production, ``.env.dev`` for development).
- Configured ``package.json`` scripts to run tests and setup database.
- Added a ```.nvmrc``` file to lock Node version in development environment.
- Setup alias in tsconfig.
- Configured ESLint with basic linting rules (only in backend library).

## What I Would Do With More Time

I would improve the project with:

- *Better separated environments*: Current environments are not well separated and I would separate them better like reusable commands (database setup,...) for both environments.
- *Exhaustive ESLint setup*: At the moment, ESLint is only setup in the backend lib with basic rules. I would setup a more strict ESLint ruleset.
- *Verify commited code with pre-commit hook*: Use [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to lint staged code. 
- *AI skills*: Setup more AI skills (clean code, react project structure, ...) to reduce hallucination and get accurate responses aligned with project.
- *Adopt Spec-driven Development*: Add spec-driven development skills and commands to plan and implement features.
- *Functional tests*: Have some basic functional tests to ensure application works and see errors not caught by other tests (bad configured services, missing configuration parameters, ...).
- *Proper validation*: Validate with [Zod](https://zod.dev/) data from ``process.env`` or other sources like handlers requests.
- *Components styling*: Use a components library like shadcn.
- *Database connection*: Better database connection management. Close connection at the end.
- *Schema migrations*: Use migrations instead of pushing the schema to database.

## AI Usage

I used Claude for developing and generate the design.

The design has been generated with Claude Design Tool. I uploaded a screenshot of the legacy app and I asked for a new UI design with Tailwind CSS version 4. (See attached screenshot)

For development, I used Claude CLI with the following skills:
- ``.claude/skills/domain-driven-design``: Basic Domain Driven Design structure guidelines.
- ``.claude/skills/testing-practices``: Write maintainable and readable tests.
- ``libs/engine/.claude/skills/url-shortener-logic-guidelines``: Rules for working with ``libs/engine`` (project structure, Prisma, how to use it from outside).

**Example of a AI development flow**:

- I send the prompt: 

```
I want to create the CreateShortlinkHandler to create short links from a long url.

Create a test case to test that handler returns a shortcode. 

- I send a url (use a object type, not plain type) and I get an object containing the shortCode
- I expect to call a function to generate a uuid
- I expect to call a function to get current date
- I expect to call the CreateShortLinkUseCase to obtain a shortcode

Only write the unit test.
```

- I verify the generated code and I edit it manually (if necessary)
- I run the test to see it failing (TDD red stage).
- I send the prompt: ```Write the code to pass the test```.
- I run the test to see it pass (TDD green stage).
- I verify the code and refactor it manually without breaking tests (TDD refactor stage).

## Feedback

The challenge instructions were easy and clear to follow.

This was a good challenge. I've mainly used React Router as a routing library, not as a full framework.
It was my first time with Turborepo and Prisma ORM. I am used to work with [Drizzle ORM](https://orm.drizzle.team/).
I learned these libraries on the fly.

For the future, I suggest locking the node version used for executions outside docker. I recommend using the library NVM for that.
