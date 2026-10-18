# 🚢 SAP Cargo — Freight Forwarding & Logistics OS

An enterprise-grade freight forwarding management and container tracking platform inspired by **KipinTOCH (KipinCARGO / KipinTRACK)**. Engineered for international cargo agents, logistics operators, and customs brokers to manage ocean/air shipments, live container tracking milestones, customer invoicing, and freight profitability settlements.

Runs **100% locally** with an embedded zero-configuration SQLite database (no external cloud accounts or database provisioning required).

![Status](https://img.shields.io/badge/Status-Full--Stack%20Ready-success?style=for-the-badge)
![Environment](https://img.shields.io/badge/Environment-Local%20SQLite%20Engine-blue?style=for-the-badge&logo=sqlite)
![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
[![GitHub stars](https://img.shields.io/github/stars/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=gold)](https://github.com/AgustinMilesi/cargo/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=blue)](https://github.com/AgustinMilesi/cargo/network/members)

---

## 🎯 What Does This System Do?

This system delivers complete operational control for international freight operations:

1. **📊 Operational Dashboard (`/`):** Live operational KPIs tracking active bookings, containers in ocean/air transit, customs clearances, USD gross profit margins, and container search.
2. **🚢 Shipment Management (`/shipments`):** Operations ledger supporting **Maritime (FCL/LCL)**, **Air Cargo**, and **Ground Transportation** with carrier lines (MSC, Maersk, CMA CGM, LATAM Cargo), vessels, route pairs (POL ➔ POD), and dates (ETD / ETA).
3. **📍 Live Container Tracking (`/tracking`):** Tracking portal inspired by **KipinTRACK**. Search by Container ID (e.g. `MSCU7654321`) or Bill of Lading (B/L) to inspect status, current vessel location, and operational milestones.
4. **💵 Financial Settlements (`/finances`):** Real-time freight profit calculations comparing Buy Rates (carrier costs), Sell Rates (customer pricing), and Local THC/Documentation charges with invoicing status toggles (`PENDING`, `INVOICED`, `PAID`).
5. **🏢 Client & Agent Directory (`/clients`):** Consignees, shippers, tax IDs (CUIT/RUT), and active operations tally.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Turbopack, React Server Components, Server Actions |
| **Language** | TypeScript 5 | Strict typing throughout frontend and backend |
| **UI & Styling** | Tailwind CSS 4 | Custom dark mode palette (`#0a0f1d`), crisp cyan logistics accents |
| **Database** | SQLite (`dev.db`) | Local serverless file-based database (Zero external setup) |
| **ORM** | Prisma Client 6 | Auto-migrated schema with realistic seed data |

---

## 🚀 Running It Locally

Everything is pre-configured and ready to run with realistic international freight data:

```bash
# 1. Clone the repository
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo

# 2. Install dependencies
npm install

# 3. Synchronize database and seed demo data
npm run db:push
npm run db:seed

# 4. Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📂 Core Routes

- `/`: Operational Dashboard with live metrics, profit overview, and quick search.
- `/shipments`: Complete shipments catalog with modality and status filters.
- `/shipments/new`: Step-by-step form to register new bookings, carriers, and rates.
- `/shipments/:id`: In-depth shipment file with operational event history and quick status updates.
- `/tracking`: Live tracking search (KipinTRACK) with milestone timelines.
- `/finances`: Freight billing settlement matrix and net profit tracking.
- `/clients`: Importers, exporters, and foreign forwarding directory.

---

## 🌐 Complete Ecosystem Suite

This logistics platform represents the freight forwarding and supply chain management tier of a unified 4-tier commercial software suite:

| Component | Repository | Live Deployment | Role & Focus |
|---|---|---|---|
| **Retail Engine & POS** | [AgustinMilesi/retail](https://github.com/AgustinMilesi/retail) | [milesi-erp.vercel.app](https://milesi-erp.vercel.app) | Cloud retail ERP, atomic inventory ledger, cashier shifts, thermal ticket printing, and cashier POS. |
| **Customer Inbox Platform** | [AgustinMilesi/inbox](https://github.com/AgustinMilesi/inbox) | [saas-am.vercel.app](https://saas-am.vercel.app) | Multi-tenant customer inquiry inbox, embeddable contact forms, contact directory, and CRM leads bridge. |
| **Contact Portal** | [AgustinMilesi/contact](https://github.com/AgustinMilesi/contact) | [agustinmilesi-contact.vercel.app](https://agustinmilesi-contact.vercel.app) | High-intent lead generation portal, anti-spam validation gateway, and email delivery dispatch. |
| **Freight Logistics OS** | [AgustinMilesi/cargo](https://github.com/AgustinMilesi/cargo) | *Local SQLite Engine* | Freight forwarding, container tracking milestones, international shipping routes, and freight billing settlements. *(This Repository)* |

---

## ⭐ Show Your Support

If you find this project useful or interesting, please give it a **Star** on GitHub! It helps more developers discover the ecosystem.

[![Star on GitHub](https://img.shields.io/static/v1?label=Star%20Repo&message=%E2%AD%90&color=yellow&style=for-the-badge&logo=github)](https://github.com/AgustinMilesi/cargo)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
