<div align="center">

# 🚢 VOUT Cargo
### Managed Global Freight Forwarding, Customs Clearance & Telemetry OS

[![VOUT Ecosystem](https://img.shields.io/badge/VOUT-Managed_Cloud-C6F827?style=for-the-badge&logoColor=black&labelColor=0A0E14)](https://github.com/AgustinMilesi)
[![SLA](https://img.shields.io/badge/SLA-99.9%25_Uptime-C6F827?style=for-the-badge&logo=shield&logoColor=black&labelColor=0A0E14)](https://cargo-am.vercel.app/legal)
[![Live Demo](https://img.shields.io/badge/Live_Service-cargo--am.vercel.app-C6F827?style=for-the-badge&logo=vercel&logoColor=black&labelColor=0A0E14)](https://cargo-am.vercel.app)
[![1-Click Demo](https://img.shields.io/badge/1--Click_Demo-Acceso_Invitado-10b981?style=for-the-badge&logoColor=white&labelColor=0A0E14)](https://cargo-am.vercel.app/portal)

<p align="center">
  <strong>Sistema operativo gestionado en la nube para transitarios, despachantes de aduana y logística internacional.</strong>
</p>

</div>

---

## 🎯 Modelo de Servicio Administrado (Managed SaaS)

**VOUT Cargo** opera como infraestructura cloud administrada de misión crítica para el comercio exterior:
- 🚀 **Zero-DevOps:** Plataforma completamente hospedada y supervisada 24/7/365 con alta redundancia.
- 🚢 **Rastreo Multimodal:** Ciclo de vida completo para conocimientos de embarque marítimo (B/L), guías aéreas (AWB) y telemetría de contenedores.
- 🚦 **Canales de Aduana & Control de Demurrage:** Semáforo aduanero (Verde, Naranja, Rojo) y contador de días libres de contenedor (*Free Time*) para prevenir sobreestadías.
- 🗺️ **Mapa Satelital Interactivo:** Visualización en vivo de buques, puertos de origen (POL), trasbordos y puertos de destino (POD).
- 📑 **Calculador de Tarifas & Cotizador:** Generación rápida de propuestas FCL, LCL y Aéreas con cálculo de margen neto y conversión a carpetas operativas en 1 clic.
- 🌐 **Soporte Cuatrilingüe:** Interfaz nativa completa en 4 idiomas: Español (ES), Inglés (EN), Portugués (PT) y Chino (ZH).

---

## ⚡ Módulos Operativos

| Módulo | Ruta | Funcionalidad |
|---|---|---|
| **Carpetas de Importación** | `/shipments` | Expedientes digitales de carga, números de contenedor, navieras y bóveda documental. |
| **Tarifarios & Cotizaciones** | `/quotes` | Cotizador multimodal, desglose de costos de compra/venta y aprobación directa. |
| **Tracker Satelital** | `/tracking` | Seguimiento interactivo por número de contenedor o B/L con hitos portuarios. |
| **Portal del Cliente** | `/portal` | Auto-consulta transparente para importadores autenticada con Cuenta VOUT. |
| **Finanzas & Balances** | `/finances` | Liquidaciones de fletes, estados de facturación y rentabilidad neta por proceso. |
| **Marco Legal & SLA** | `/legal` | Contrato de servicio administrado, SLA 99.9% y política de privacidad. |

---

## 🛠️ Stack Tecnológico

`Next.js 16` • `React 19` • `TypeScript` • `PostgreSQL Serverless (Neon)` • `Prisma ORM` • `Tailwind CSS v4` • `Multi-Language (ES/EN/PT/ZH)`

---

## ⚙️ Operación & Mantenimiento Interno

```bash
# Verificación de compilación y tipado
npm run typecheck

# Inicialización de esquema y datos de prueba
npx prisma db push
npm run db:seed
```

---

<div align="center">
  <p>© 2026 VOUT Cargo · Managed Freight & Logistics Infrastructure.</p>
</div>
