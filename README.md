# next-starter

> A minimal starter kit for Next.js.

Here's the foundation of basically every Next.js project I've ever made, which comes with a considerable amount of boilerplate already written so you can focus on building out your ideas.

## Features

I did my best to include building blocks into this template while keeping things minimal so you can add/or remove things as you desire.

- Next.js 15 (React + TypeScript)
- Tailwind CSS + shadcn/ui
- PostgreSQL + Drizzle ORM
- Self-hosted credentials authentication
- Type safe environment variables
- Object validation with Zod
- Prettier + ESLint

## Getting Started

There aren't many _mandatory_ prerequisites other than **npm**.

1. Download, fork, or template this repository.
2. Download dependencies via `npm i`.
3. Create and populate a `.env.local` file based off of `.env.example`.
4. Push the database schema to your database via `npm run db:push`.
5. Start a local development server via `npm run dev`.

If at any point you want to view/manage the contents of your database, you can do easily through Drizzle Studio via `npm run db:studio`.

You should avoid directly modifying your production database. I tend to use PostgreSQL, and it's really easy to [set up locally with Docker](https://orm.drizzle.team/docs/guides/postgresql-local-setup).

## Going to Production

To prevent panic attacks when applying schema changes to your production database, use migrations that are automatically applied via GitHub Actions.

You can generate a migration file via `npm run db:generate`.

If at any point you want to delete a migration file, use `npm run db:drop`. **This does not rollback changes to your database, it just safely deletes the SQL migration script.**

You will want to automate migrations via CI/CD, the easiest being GitHub Actions. Depending on where you deploy your application, there may quite a few moving parts to this—I recommend taking the time to research this yourself.

## License

Licensed under the [MIT License](LICENSE), Copyright © 2024
