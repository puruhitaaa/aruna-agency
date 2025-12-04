# 🚀 Next.js + Elysia + Better-Auth + Drizzle Starter

Welcome to the **ultimate modern web development starter kit**! This project is a powerhouse combination of the fastest, most ergonomic, and type-safe tools available today. Built for speed, scalability, and developer experience.

## ⚡ Tech Stack

This project leverages a cutting-edge stack to give you the best development experience:

- **[Next.js 16](https://nextjs.org/)**: The React Framework for the Web (App Router).
- **[ElysiaJS](https://elysiajs.com/)**: Ergonomic Framework for Humans. High-performance backend.
- **[Better-Auth](https://better-auth.com/)**: The most comprehensive authentication library for TypeScript.
- **[Drizzle ORM](https://orm.drizzle.team/)**: Lightweight and type-safe ORM for PostgreSQL.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Biome](https://biomejs.dev/)**: A fast formatter and linter for the modern web.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed JavaScript for fewer bugs.

## 🌟 Features

- **Full-Stack Type Safety**: End-to-end type safety from your database to your frontend.
- **Modern Auth**: Secure and flexible authentication with Better-Auth.
- **High Performance**: Powered by Next.js and Elysia for blazing fast responses.
- **Developer Experience**: Biome for instant linting/formatting and Drizzle Kit for easy database management.
- **Ready-to-Scale**: Built on top of PostgreSQL and robust architecture.

## 🛠️ Getting Started

Follow these steps to get your project up and running in no time.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd aruna-agency
npm install
# or
pnpm install
# or
bun install
```

### 2. Environment Setup

Copy the example environment file and configure your secrets:

```bash
cp .env.example .env
```

Update `.env` with your database credentials and other necessary secrets.

### 3. Database Setup

Initialize your database schema using Drizzle Kit:

```bash
# Generate migrations
npm run db:generate

# Push schema to the database
npm run db:push
```

### 4. Run Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Checks for linting errors using Biome.
- `npm run format`: Formats the code using Biome.
- `npm run db:generate`: Generates Drizzle migrations.
- `npm run db:migrate`: Runs Drizzle migrations.
- `npm run db:push`: Pushes schema changes directly to the database (prototyping).
- `npm run ba:generate`: Generates Better-Auth schema/client code.

## 📂 Project Structure

```
├── src
│   ├── app          # Next.js App Router pages and layouts
│   ├── server       # Backend logic (Elysia, Drizzle, Better-Auth)
│   │   ├── better-auth # Auth configuration
│   │   ├── db       # Database schema and connection
│   │   └── index.ts # Elysia app entry point
│   ├── lib          # Shared utilities
│   └── proxy.ts     # Proxy configuration
├── drizzle          # Drizzle migrations
├── public           # Static assets
└── ...config files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
