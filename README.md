# 🌐 OneCargo — Logistics & Freight Operating System

An enterprise-grade freight forwarding and real-time logistics tracking platform inspired by modern high-density transport dashboards (**OneCargo**). Engineered for international freight forwarders, cargo dispatchers, and shippers to track loads, delivery milestones, transit distances, vehicle expenses, and freight profitability settlements.

Featuring a native **Dark & Light Mode design system**, cloud persistence powered by **Neon PostgreSQL**, and automated deployment pipeline on **Vercel**.

![Status](https://img.shields.io/badge/Status-Production%20Cloud%20Ready-success?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-00E599?style=for-the-badge&logo=postgresql)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20Edge%20Platform-black?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM%206-2D3748?style=for-the-badge&logo=prisma)
[![GitHub stars](https://img.shields.io/github/stars/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=gold)](https://github.com/AgustinMilesi/cargo/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=blue)](https://github.com/AgustinMilesi/cargo/network/members)

🌐 **Live Demo:** [cargo-am.vercel.app](https://cargo-am.vercel.app)

---

## ✨ Key Features & Architecture

1. **🎨 OneCargo Design System (Dark & Light Mode):**
   - High-density dark dashboard aesthetic (`#0f1015`, `#181920`) with persistent one-click toggle to a crisp modern light mode (`#f5f6fa`, `#ffffff`).
   - Zero-flicker client hydration with local storage persistence.

2. **📊 Total Expenses & Cost Breakdown:**
   - Visual multi-segment progress allocation tracking operational costs: **Fuel** (Purple), **Highway Tolls** (Blue), **Logistics Fees** (Green), and **Resting Stops** (Amber).

3. **🗺️ Delivering Process & Live GPS Map:**
   - Real-time dark transit route vector map with transit lines, regional boundaries, highway telemetry, speed sensors, and pulsating GPS location waypoints.

4. **📍 Monthly Travel Distance & Route Cards:**
   - Distance odometer tracking monthly mileage, delivery route segments, and metrics.

5. **🕒 Delivery Informations & Milestones Timeline:**
   - Chronological vertical timeline with glowing green checkpoint pins, arrival timestamps, and "Good Condition" verification badges.

6. **📋 Past Delivery Record & Weight Filters:**
   - Interactive shipment ledger with instant weight segmentation tabs (**All Weight**, **Heavy Weight**, **Medium Weight**) and direct container tracking links.

7. **⚡ Cloud Database (Neon Serverless PostgreSQL):**
   - Configured with pooled connection strings (`DATABASE_URL`) and direct migration strings (`DIRECT_URL`) on AWS São Paulo (`sa-east-1`).
   - Automated build-time schema sync via `prisma db push` on Vercel.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Turbopack engine, React 19 Server Components, Server Actions |
| **Language** | TypeScript 5 | Strict typing across frontend, API actions, and database models |
| **Styling** | Tailwind CSS 4 | Custom CSS custom variants, semantic theme tokens, responsive cards |
| **Database** | Neon PostgreSQL | Serverless cloud PostgreSQL with connection pooling |
| **ORM** | Prisma Client 6 | Direct and pooled URLs, relational schema with milestones & clients |
| **Deployment** | Vercel | Automatic CI/CD deployments triggered on push to `main` |

---

## 🚀 Running It Locally

### 1. Clone & Install

```bash
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo
npm install
```

### 2. Configure Environment

Create or update `.env` in the root:

```env
DATABASE_URL="postgresql://neondb_owner:npg_IV8UGqCybo5N@ep-holy-art-b6g983wj-pooler.c-2.sa-east-1.aws.neon.tech/cargo?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://neondb_owner:npg_IV8UGqCybo5N@ep-holy-art-b6g983wj.c-2.sa-east-1.aws.neon.tech/cargo?sslmode=require&channel_binding=require"
```

### 3. Sync Database & Seed Data

```bash
# Push schema to Neon PostgreSQL
npm run db:push

# Seed realistic shipments, clients, and milestones
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Core Navigation

- `/`: **Dashboard** — Expenses breakdown, Delivering Process map, Monthly travel distance, Delivery informations timeline, and Past delivery records.
- `/finances`: **Monthly Report** — Freight purchasing costs, customer billing settlements, and net revenue margins.
- `/tracking`: **Working Tracker** — Live container & Bill of Lading GPS tracking with milestone telemetry.
- `/clients`: **Company Division** — Shipper, consignee, and partner forwarder account directory.
- `/shipments`: **Approval Letter** — Complete freight manifests with status and equipment filters.
- `/shipments/new`: **New Load** — Comprehensive booking and rate settlement creation wizard.

---

## 🌐 Complete Commercial Ecosystem Suite

This logistics platform represents the freight forwarding and supply chain management tier of Agustin Milesi's unified commercial ecosystem:

| Component | Repository | Live Deployment | Role & Focus |
|---|---|---|---|
| **Retail Engine & POS** | [AgustinMilesi/retail](https://github.com/AgustinMilesi/retail) | [milesi-erp.vercel.app](https://milesi-erp.vercel.app) | Cloud retail ERP, atomic inventory ledger, cashier shifts, and thermal ticket printing. |
| **Customer Inbox Platform** | [AgustinMilesi/inbox](https://github.com/AgustinMilesi/inbox) | [saas-am.vercel.app](https://saas-am.vercel.app) | Multi-tenant customer inquiry inbox, embeddable contact forms, contact directory, and CRM leads bridge. |
| **Contact Portal** | [AgustinMilesi/contact](https://github.com/AgustinMilesi/contact) | [agustinmilesi-contact.vercel.app](https://agustinmilesi-contact.vercel.app) | High-intent lead generation portal, anti-spam validation gateway, and email delivery dispatch. |
| **Logistics & Freight OS** | [AgustinMilesi/cargo](https://github.com/AgustinMilesi/cargo) | [cargo-am.vercel.app](https://cargo-am.vercel.app) | International freight forwarding, container GPS milestones, vehicle expenses, and billing settlements. *(This Repository)* |

---

## ⭐ Show Your Support

If you find this project useful, please star the repository on GitHub!

[![Star on GitHub](https://img.shields.io/static/v1?label=Star%20Repo&message=%E2%AD%90&color=yellow&style=for-the-badge&logo=github)](https://github.com/AgustinMilesi/cargo)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
