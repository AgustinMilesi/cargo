# 🌐 VOUT Cargo — Logistics & Freight Operating System

An international freight forwarding, customs clearance, and real-time cargo tracking platform. Engineered for freight forwarders, cargo dispatchers, and customs brokers to manage multimodal shipments, GPS container tracking, customs clearance channels (SIM/SEDI), demurrage deadlines, and financial settlements.

<p align="left">
  <a href="https://cargo-am.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-cargo--am.vercel.app-00E599?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo" /></a>
  <a href="https://cargo-am.vercel.app/demo"><img src="https://img.shields.io/badge/1--Click%20Demo%20Access-Guest%20Mode-10b981?style=for-the-badge&logo=shield" alt="1-Click Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-20232a?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00E599?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

---

## 🎯 What is it for?

- **End-to-end shipment control**: Manage ocean Bill of Lading (B/L), Air Waybills (AWB), container numbers, carriers, vessels, ports of loading/discharge, and document vaults.
- **Customs & demurrage deadlines**: Color-coded customs channels (Green, Orange, Red) and free-day counters (*Demurrage & Detention*) to prevent costly port storage fees.
- **Live satellite GPS tracking**: Visual international route map with real-time location, speed telemetry, and milestone timelines (*Booking*, *Departure*, *Customs*, *Final Delivery*).
- **Multimodal freight quotes**: Fast quotes for FCL, LCL, and Air freight with automatic profit margin calculations and 1-click conversion into an active shipment.
- **Protected customer portal**: Importers track containers by Tax ID or B/L number without exposing the agency's internal carrier buy rates.

---

## ✨ Core Modules

| Module | Route | Capabilities |
|---|---|---|
| **Shipments & Imports** | `/shipments` | Comprehensive cargo files, container tracking, shipping lines, and document vault. |
| **Multimodal Quotes** | `/quotes` | Rate generator, buy/sell breakdown, profit margins, and 1-click shipment conversion. |
| **Live Satellite Tracker** | `/tracking` | Secure public tracking by container or B/L with route maps and milestone events. |
| **Customer Portal** | `/portal` | Client self-service lookup protected against data leaks. |
| **Freight Finances** | `/finances` | Shipment billing statuses (`PENDING`, `INVOICED`, `PAID`) and net profitability balances. |
| **Client Directory** | `/clients` | Directory of importing companies, tax IDs, and historical cargo volume. |

---

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router, Server Actions) + React 19
- **Language**: TypeScript (strict mode throughout)
- **Styling**: Tailwind CSS 4 with a **Frosted Glassmorphism** design system
- **Database**: PostgreSQL Serverless (Neon, AWS São Paulo region)
- **ORM**: Prisma ORM with safe atomic transactions
- **Security**: Strict OWASP headers and data isolation
- **Customization**: Dark / Light mode, 6 accent themes, and 4 languages (EN, ES, PT, ZH)

---

## ⚡ Quick Test (No Registration Needed)

Explore the full logistics dashboard in live demo mode:
- **[1-Click Demo Access](https://cargo-am.vercel.app/demo)** (enters the dashboard with preloaded shipments).
- Or click the demo badge in the top bar of the application.

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Generate Prisma client & start development server
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### ⚡ The VOUT Software Ecosystem
- [📱 VOUT Pocket](https://github.com/AgustinMilesi/expenses) — Mobile cost, subscription, and micro-spending tracker with React Native.
- [💳 VOUT Retail](https://github.com/AgustinMilesi/retail) — Cloud point of sale, atomic stock control, and cash drawer audits.
- [📥 VOUT Inbox](https://github.com/AgustinMilesi/inbox) — Multi-tenant customer inquiry inbox and embeddable forms.
- [📬 VOUT Connect](https://github.com/AgustinMilesi/contact) — Minimalist contact form and lead gateway with Zod validation.
