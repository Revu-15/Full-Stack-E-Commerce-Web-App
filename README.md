<p align="center">
  <h1 align="center">🛒 LuxeCart</h1>
  <p align="center">Production Full Stack E-Commerce Web Application</p>
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript" />
    <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql" />
    <img src="https://img.shields.io/badge/Express.js-4-green?style=for-the-badge&logo=express" />
  </p>
</p>

---

## ✨ Overview

LuxeCart is a **production-grade, full-stack e-commerce platform** built with a modern, scalable technology stack. It follows **Clean Architecture**, **SOLID principles**, and **MVC patterns** throughout.

> **Status:** 🚧 Phase 1 Complete — Backend Foundation & Auth API

---

## 🏗️ Tech Stack

| Layer | Technology |
| :---- | :--------- |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| **State** | Redux Toolkit, RTK Query |
| **Backend** | Express.js, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Neon Serverless) |
| **Auth** | JWT (access + refresh tokens), Google OAuth 2.0, bcrypt |
| **Payments** | Stripe, Razorpay |
| **Storage** | Cloudinary |
| **Email** | Nodemailer (Gmail SMTP) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Deployment** | Vercel (frontend), Render (backend), Neon (database) |

---

## 📁 Project Structure

```
luxecart/
├── apps/
│   ├── backend/              # Express REST API (Phase 1 ✅)
│   │   ├── prisma/           # Schema + migrations + seed
│   │   └── src/
│   │       ├── config/       # Env, database
│   │       ├── controllers/  # Route handlers
│   │       ├── middlewares/  # Auth, rate limit, error, validate
│   │       ├── repositories/ # Prisma data access layer
│   │       ├── routes/       # Express routers
│   │       ├── services/     # Business logic
│   │       ├── types/        # TypeScript augmentations
│   │       ├── utils/        # JWT, email, logger, AppError
│   │       ├── validators/   # Zod schemas
│   │       └── app.ts        # Entry point
│   └── frontend/             # Next.js 15 App (Phase 3 🔜)
└── packages/
    └── shared/               # Shared TypeScript types
```

---

## 🔐 Auth API Endpoints

| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `POST` | `/api/v1/auth/register` | Register + email verification |
| `POST` | `/api/v1/auth/login` | Login → JWT cookies |
| `POST` | `/api/v1/auth/logout` | Clear auth cookies |
| `POST` | `/api/v1/auth/refresh` | Rotate access token |
| `GET` | `/api/v1/auth/me` | Get current user |
| `GET` | `/api/v1/auth/verify-email/:token` | Verify email |
| `POST` | `/api/v1/auth/forgot-password` | Send reset email |
| `POST` | `/api/v1/auth/reset-password/:token` | Reset password |
| `GET` | `/api/v1/auth/google/init` | Google OAuth |

📚 **Full Swagger docs**: `http://localhost:5000/api-docs`

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- PostgreSQL database ([neon.tech](https://neon.tech) — free)

### 1. Clone & Install

```bash
git clone https://github.com/Revu-15/Full-Stack-E-Commerce-Web-App.git
cd Full-Stack-E-Commerce-Web-App
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example apps/backend/.env
# Edit apps/backend/.env — add your DATABASE_URL and secrets
```

### 3. Database Setup

```bash
# Run from project root using cmd (Windows)
cd apps/backend
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

**Seed credentials:**
| Role | Email | Password |
| :--- | :---- | :------- |
| Admin | `admin@luxecart.com` | `Admin@123456` |
| Customer | `customer@luxecart.com` | `Customer@123` |

### 4. Start Backend

```bash
cd apps/backend
npx tsx src/app.ts
```

Server runs at: `http://localhost:5000`
Swagger UI at: `http://localhost:5000/api-docs`

---

## 🗄️ Database Schema

15 entities: `User`, `Address`, `Category`, `Brand`, `Product`, `ProductVariant`, `Review`, `Cart`, `CartItem`, `Wishlist`, `Coupon`, `Order`, `OrderItem`, `OrderStatusLog`, `Payment`, `Banner`

---

## 📋 Development Roadmap

| Phase | Status | Description |
| :---- | :----- | :---------- |
| **Phase 1** | ✅ Complete | Backend foundation, Auth API, Prisma schema |
| **Phase 2** | 🔜 Next | Products, Cart, Orders, Payments, Admin APIs |
| **Phase 3** | 🔜 | Next.js 15 frontend setup + design system |
| **Phase 4** | 🔜 | Shopping UI (catalog, cart, checkout) |
| **Phase 5** | 🔜 | Account pages, order tracking, wishlist |
| **Phase 6** | 🔜 | Admin dashboard + analytics |
| **Phase 7** | 🔜 | Testing, SEO, Lighthouse optimization |
| **Phase 8** | 🔜 | Deployment: Vercel + Render + CI/CD |

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **CORS** — Origin whitelist with credentials
- **Rate Limiting** — Tiered (Global/Auth/Strict)
- **bcrypt** — Password hashing (12 rounds)
- **JWT** — HTTP-only cookies, token versioning
- **Zod** — Runtime schema validation on all inputs
- **Anti-enumeration** — Consistent responses on sensitive endpoints

---

## 📄 License

MIT © [Revu-15](https://github.com/Revu-15)
