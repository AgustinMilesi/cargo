<div align="center">

# 🚢 VOUT Cargo
### International Freight Forwarding, Customs Clearance & Vessel Tracking OS

[![VOUT Ecosystem](https://img.shields.io/badge/VOUT-Ecosystem-C6F827?style=for-the-badge&logoColor=black&labelColor=0A0E14)](https://github.com/AgustinMilesi)
[![VOUT ID](https://img.shields.io/badge/VOUT_ID-Unified_Pass-C6F827?style=for-the-badge&logo=shield&logoColor=black&labelColor=0A0E14)](https://cargo-am.vercel.app/portal)
[![Live Demo](https://img.shields.io/badge/Live_Demo-cargo--am.vercel.app-C6F827?style=for-the-badge&logo=vercel&logoColor=black&labelColor=0A0E14)](https://cargo-am.vercel.app)
[![1-Click Demo](https://img.shields.io/badge/1--Click_Demo-Guest_Access-10b981?style=for-the-badge&logoColor=white&labelColor=0A0E14)](https://cargo-am.vercel.app/demo)

</div>

---

## 🎯 Overview

**VOUT Cargo** is a full-scale logistics operating system built for freight forwarders, customs brokers, and cargo dispatchers managing international import/export operations.
- 🚢 **Multimodal Tracking:** Full shipment lifecycles for ocean Bill of Lading (B/L), Air Waybills (AWB), and container telemetry.
- 🚦 **Customs & Demurrage Alerts:** Color-coded customs channels (Green/Orange/Red) and free-day counters to avoid port demurrage penalties.
- 🗺️ **Visual Route Maps:** Real-time interactive international route tracking with coordinates and milestone progress.
- 📑 **Multimodal Rate Calculator:** Fast quotes for FCL, LCL, and Air freight with profit margins and 1-click active shipment creation.
- 🔑 **Cuenta VOUT (VOUT ID):** Importer portal lookup integrated with VOUT Pocket for expense and shipment cost tracking.

---

## ⚡ Core Modules

| Module | Route | Capabilities |
|---|---|---|
| **Shipments** | `/shipments` | Comprehensive cargo files, container tracking, shipping lines & document vault. |
| **Quotes** | `/quotes` | Multimodal rate generator, buy/sell breakdown & 1-click shipment conversion. |
| **Satellite Tracker** | `/tracking` | Public tracking by container or B/L with interactive map and milestones. |
| **Client Portal** | `/portal` | Importer self-service lookup authenticated via Cuenta VOUT. |
| **Finances** | `/finances` | Freight billing statuses (`PENDING`, `INVOICED`, `PAID`) & net profit balances. |

---

## 🛠️ Stack

`Next.js 16` • `React 19` • `TypeScript` • `PostgreSQL Serverless (Neon)` • `Prisma ORM` • `Tailwind CSS v4` • `Multi-language (EN/ES/PT/ZH)`

---

## 🚀 Quickstart

```bash
# Clone and enter directory
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo

# Install dependencies & start
npm install
npx prisma generate
npm run dev
```

---

### ⚡ The VOUT Software Ecosystem
- [📱 VOUT Pocket](https://github.com/AgustinMilesi/expenses) — Mobile cost, subscription & micro-spending tracker.
- [💳 VOUT Retail](https://github.com/AgustinMilesi/retail) — Cloud point of sale, atomic stock control, and cash drawer audits.
- [📥 VOUT Inbox](https://github.com/AgustinMilesi/inbox) — Multi-tenant customer feedback & embeddable forms.
- [📬 VOUT Connect](https://github.com/AgustinMilesi/contact) — High-conversion contact portal with anti-spam protection.
