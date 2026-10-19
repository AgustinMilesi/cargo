# 🌐 OneCargo — Logistics & Freight Operating System

Plataforma de gestión logística internacional, despacho aduanero y seguimiento de carga en tiempo real. Diseñada para freight forwarders, agencias de carga y despachantes de aduana para gestionar embarques multimodales, monitoreo satelital GPS de contenedores, semáforos aduaneros (SIM/SEDI) y liquidaciones financieras.

<p align="left">
  <a href="https://cargo-am.vercel.app"><img src="https://img.shields.io/badge/Demo%20en%20Vivo-cargo--am.vercel.app-00E599?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo" /></a>
  <a href="https://cargo-am.vercel.app/demo"><img src="https://img.shields.io/badge/Acceso%20Demo%201--Click-Invitado-10b981?style=for-the-badge&logo=shield" alt="1-Click Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3-20232a?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00E599?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
</p>

---

## 🎯 ¿Para qué sirve?

- **Control de carpetas de importación**: Seguimiento integral de Bill of Lading (B/L), guías aéreas (AWB), números de contenedor, navieras, buques y puertos de origen/destino.
- **Gestión aduanera y plazos**: Monitoreo de canales de aduana (Verde, Naranja, Rojo) y control de días libres (*Demurrage & Detention*) para evitar sobrecostos portuarios.
- **Rastreo satelital en vivo**: Mapa interactivo con ruta marítima/aérea, posición satelital y cronología de hitos (*Booking*, *Zarpado*, *Arribo*, *Despacho*).
- **Cotizador multimodal**: Cotizaciones rápidas en FCL, LCL y Aéreo con cálculo automático de margen de utilidad (*profit*) y conversión directa a embarque en 1 clic.
- **Portal de clientes protegido**: Espacio donde los importadores rastrean sus cargas por CUIT o B/L sin ver los márgenes de compra de la agencia.

---

## ✨ Módulos Principales

| Módulo | Ruta | Funcionalidad |
|---|---|---|
| **Embarques e Importación** | `/shipments` | Carpetas de carga, control de contenedores, navieras y bóveda documental. |
| **Cotizaciones Multimodal** | `/quotes` | Emisión de tarifas, desglose de compra/venta y conversión automática a carga activa. |
| **Live Tracker Satelital** | `/tracking` | Rastreador público seguro con mapa de ruta, velocidad e historial de hitos. |
| **Portal del Cliente** | `/portal` | Búsqueda privada de contenedores para importadores protegida contra fugas de datos. |
| **Finanzas Operativas** | `/finances` | Control de facturación por embarque, balances con navieras y rentabilidad neta. |
| **Directorio de Clientes** | `/clients` | Padrón de empresas importadoras, CUIT y volumen operativo histórico. |

---

## 🛠️ Stack Tecnológico

- **Frontend & Backend**: Next.js 16 (App Router, Server Actions) + React 19
- **Lenguaje**: TypeScript (tipado estricto extremo)
- **Estilos**: Tailwind CSS 4 con sistema de diseño **Frosted Glassmorphism**
- **Base de Datos**: PostgreSQL Serverless en Neon (AWS São Paulo)
- **ORM**: Prisma ORM con transacciones atómicas seguras
- **Seguridad**: Cabeceras OWASP estrictas y sanitización contra inyecciones
- **Personalización**: Modo oscuro/claro, 6 paletas de acento y 4 idiomas (ES, EN, PT, ZH)

---

## ⚡ Prueba Rápida (Sin Registro)

Podés explorar el sistema completo en vivo con **1-Click**:
- **[Entrar como Invitado en Modo Demo](https://cargo-am.vercel.app/demo)** (accede directamente al panel con datos de prueba).
- O desde cualquier vista pública tocando el badge superior de demo.

---

## 🚀 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar Prisma y arrancar el servidor
npx prisma generate
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

### 🔗 Otros Proyectos
- [💳 Retail Engine & POS](https://github.com/AgustinMilesi/retail) — Punto de venta, arqueo ciego de caja y control de inventario.
- [📥 Customer Inbox SaaS](https://github.com/AgustinMilesi/inbox) — Bandeja de entrada multi-inquilino y formularios embebibles.
- [📬 Contact Portal](https://github.com/AgustinMilesi/contact) — Portal de contacto y captura de leads con validación Zod.
