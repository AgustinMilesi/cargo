# 🌐 OneCargo — Logistics & Import Operating System

An enterprise-grade freight forwarding, customs clearance, and real-time logistics tracking platform (**OneCargo**). Engineered for international freight forwarders, cargo dispatchers, customs brokers (*despachantes de aduana*), and importers to manage end-to-end import operations: multi-modal quotes, container tracking, customs channels (SIM/SEDI), demurrage deadlines, financial settlements, and customer self-service portals.

Built with a high-performance **Frosted Glassmorphism Design System** (Dark & Light Mode), multi-language localization (4 languages), cloud persistence on **Neon PostgreSQL**, and continuous deployment on **Vercel**.

![Production Status](https://img.shields.io/badge/Status-Live%20in%20Production-success?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20Serverless-00E599?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM%206-2D3748?style=for-the-badge&logo=prisma)
[![GitHub stars](https://img.shields.io/github/stars/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=gold)](https://github.com/AgustinMilesi/cargo/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/AgustinMilesi/cargo?style=for-the-badge&logo=github&color=blue)](https://github.com/AgustinMilesi/cargo/network/members)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-cargo--am.vercel.app-00E599?style=for-the-badge&logo=vercel&logoColor=black)](https://cargo-am.vercel.app)

🌐 **Live Demo:** [https://cargo-am.vercel.app](https://cargo-am.vercel.app)

---

## 🌐 Complete Commercial Ecosystem Suite

This logistics platform represents the freight forwarding and supply chain management tier of Agustin Milesi's unified commercial ecosystem:

| Tier | Repository | Live Deployment | Role & Operational Focus |
|---|---|---|---|
| **Retail Engine & POS** | [AgustinMilesi/retail](https://github.com/AgustinMilesi/retail) | [milesi-erp.vercel.app](https://milesi-erp.vercel.app) | Cloud retail ERP, atomic inventory ledger, cashier shifts, and thermal ticket printing. |
| **Customer Inbox Platform** | [AgustinMilesi/inbox](https://github.com/AgustinMilesi/inbox) | [saas-am.vercel.app](https://saas-am.vercel.app) | Multi-tenant customer inquiry inbox, embeddable contact forms, contact directory, and CRM leads bridge. |
| **Contact Portal** | [AgustinMilesi/contact](https://github.com/AgustinMilesi/contact) | [agustinmilesi-contact.vercel.app](https://agustinmilesi-contact.vercel.app) | High-intent lead generation portal, anti-spam validation gateway, and email delivery dispatch. |
| **OneCargo (Freight Logistics OS)** | [AgustinMilesi/cargo](https://github.com/AgustinMilesi/cargo) | [cargo-am.vercel.app](https://cargo-am.vercel.app) | International freight forwarding, container GPS milestones, customs dispatch, and rate settlements. *(This Repository)* |

---

## 🚀 Key Modules & Capabilities

### 1. 📦 Carpetas de Importación & Embarques (`/shipments`)
- **Gestión Integral de Cargas**: Control de Bill of Lading (B/L) marítimo y guías aéreas (AWB), número de contenedor (ej. MSCU7654321), naviera/transportista, buque, puerto de origen (POL) y destino (POD).
- **Despacho Aduanero**: Número de despacho SIM/SEDI y canales aduaneros con semáforo cromático:
  - 🟢 **Canal Verde**: Liberación directa de mercadería.
  - 🟠 **Canal Naranja**: Revisión documental.
  - 🔴 **Canal Rojo**: Aforo físico e inspección aduanera obligatoria.
- **Control de Demoras & Días Libres (*Demurrage & Detention*)**: Monitoreo de días libres otorgados por naviera y fecha límite de devolución para prevenir sobrecostos de depósito y multas portuarias.
- **Bóveda Documental**: Enlace y verificación de Bill of Lading, Factura Comercial Exterior (*Commercial Invoice*) y Lista de Empaque (*Packing List*).

### 2. 💬 Cotizaciones & Tarifas Multimodal (`/quotes`)
- **Cotizador Rápido de Fletes**: Modos FCL 20', FCL 40' HC, LCL y Aéreo Express.
- **Cálculo Transparente de Rentabilidad**: Desglose automático de Tarifa de Compra (*Buy Rate*), Tarifa de Venta (*Sell Rate*), Gastos Locales de Destino y Margen Neto de Utilidad (*Profit*).
- **Conversión en 1 Clic a Embarque Operativo**: Transforma automáticamente una cotización aprobada en una carpeta de importación activa, asigna referencia única y genera el primer hito de booking con la naviera dentro de una transacción atómica segura.

### 3. 📍 Live Tracker & Telemetría Satelital (`/tracking`)
- **Monitoreo GPS / AIS**: Mapa vectorial con ruta internacional entre origen y destino, posicionamiento satelital en vivo y reporte de velocidad y estado.
- **Línea de Tiempo de Hitos (*Milestones*)**: Registro cronológico de eventos de transporte (*Booking confirmado*, *Zarpado en tránsito internacional*, *Arribo a terminal*, *Despacho aduanero*, *Entrega final*).

### 4. 🛡️ Portal de Autogestión del Cliente (`/portal`)
- **Acceso Exclusivo para Importadores**: Vista protegida donde los clientes consultan el estado en tiempo real de sus contenedores ingresando su CUIT, Razón Social o número de B/L.
- **Blindaje Comercial**: Oculta automáticamente los costos de compra y márgenes de intermediación de la agencia, exponiendo únicamente datos logísticos, canales de aduana y documentación oficial.
- **Zero-Leakage Guarantee**: Protección estricta que previene la visualización accidental de cargas de terceros ante búsquedas vacías.

### 5. 💰 Finanzas & Cuentas Corrientes (`/finances`)
- **Control de Flujo de Fondos**: Estado de facturación por embarque (`PENDING`, `INVOICED`, `PAID`) con actualización en tiempo real.
- **Balances Consolidados**: Total facturado a clientes, costo adeudado a transportistas marítimos/aéreos y rentabilidad operativa neta.

### 6. 🏢 Directorio de Empresas & Clientes (`/clients`)
- **Padrón de Importadores y Proveedores**: Registro de clientes, razón social, CUIT/Tax ID, email de operaciones y conteo dinámico de operaciones activas e históricas.

### 7. 🎨 Diseño Glassmorphism & Sistema de Preferencias
- **Efecto Frosted Glass de Alta Refracción**: Tarjetas ultratranslúcidas con desenfoque óptico (`backdrop-filter: blur(28px) saturate(210%)`), biseles superiores con reflejo especular y halos de luz ambiental en `z-0`.
- **Barra de Navegación Estática**: Barra lateral anclada al viewport (`sticky top-0 md:h-screen`), garantizando acceso inmediato a las secciones mientras el contenido se desplaza con fluidez.
- **Menú de Preferencias Flotante**:
  - 🌓 **Modo Oscuro / Modo Claro** con persistencia local sin parpadeos (*zero-flicker*).
  - 🎨 **6 Paletas Cromáticas de Acento**: Ámbar Vibrante, Bronce Marítimo, Índigo Ultramar, Carmesí, Esmeralda y Cian Portuario.
  - 🌐 **Soporte Multilingüe en 4 Idiomas**: Español (ES), English (EN), Português (PT) y 中文 (ZH).

---

## 🛡️ Arquitectura & Seguridad

1. **🔒 Protección de Datos & Cero Fugas**: Las búsquedas públicas en `/tracking` y `/portal` requieren un identificador válido (mínimo 2 caracteres). Las cargas de terceros nunca son listadas de forma abierta o indiscriminada.
2. **⚡ Transacciones Atómicas ACID (`db.$transaction`)**: La creación de embarques con sus hitos de booking iniciales y la conversión de cotizaciones se ejecutan en transacciones atómicas. Si la red falla a medio camino, se realiza un rollback automático garantizando consistencia total.
3. **🔁 Idempotencia en Acciones del Servidor**: Los flujos de conversión de cotizaciones verifican el estado previo del registro para impedir conversiones duplicadas en caso de doble clic.
4. **🛡️ Cabeceras HTTP de Seguridad (OWASP)**:
   - `X-Frame-Options: DENY` (prevención de Clickjacking).
   - `X-Content-Type-Options: nosniff` (mitigación de MIME sniffing).
   - `Strict-Transport-Security` (forzado HTTPS).
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
   - `Referrer-Policy: strict-origin-when-cross-origin`.
5. **🔢 Parsers de Tipos Seguros**: Conversión controlada de fechas (`parseSafeDate` que previene excepciones fatales de serialización `Invalid Date` en PostgreSQL) y números flotantes/enteros sin riesgo de `NaN`.
6. **🛑 Barrera Global de Errores (`app/error.tsx`)**: Captura controlada de excepciones en cliente con opción de reintento interactivo.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Descripción |
|---|---|---|
| **Framework** | Next.js 16.4 (App Router) | Motor Turbopack, React 19 Server Components, Server Actions |
| **Lenguaje** | TypeScript 5.0 | Tipado estricto extremo, sin tipos `any` ni casts `as string` inseguros |
| **Estilos** | Tailwind CSS 4 | Variables CSS semánticas, variantes oscuras nativas, efectos de vidrio |
| **Base de Datos** | Neon PostgreSQL | PostgreSQL serverless con pooler PgBouncer en AWS São Paulo (`sa-east-1`) |
| **ORM** | Prisma ORM 6 | Conexión pooled (`DATABASE_URL`) y directa para migraciones (`DIRECT_URL`) |
| **Plataforma Cloud** | Vercel | Pipeline CI/CD automatizado activado por commits en la rama `main` |

---

## 🔌 API REST v1 para Integraciones

OneCargo incluye endpoints REST listos para conectar sistemas ERP externos, agentes de aduana o plataformas de comercio exterior:

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/v1/shipments?status=...` | Listado de embarques con hitos ordenados (filtro opcional por estado) |
| `POST` | `/api/v1/shipments` | Creación atómica de un nuevo embarque con hito de booking inicial |
| `GET` | `/api/v1/quotes` | Consulta de cotizaciones y tarifas registradas |
| `POST` | `/api/v1/quotes` | Emisión de una nueva cotización multimodal |
| `GET` | `/api/v1/tracking/:query` | Rastreo público seguro por contenedor, B/L o referencia |

#### Ejemplo de Solicitud de Rastreo

```http
GET /api/v1/tracking/MSCU7654321 HTTP/1.1
Host: cargo-am.vercel.app
Accept: application/json
```

---

## 🚀 Instalación y Puesta en Marcha Local

### Prerrequisitos
- **Node.js** v20.9.0 o superior
- **npm** v10 o superior
- Base de datos **PostgreSQL** (se recomienda una instancia gratuita en [Neon.tech](https://neon.tech))

### 1. Clonar el Repositorio

```bash
git clone https://github.com/AgustinMilesi/cargo.git
cd cargo
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear el archivo `.env` en la raíz del proyecto tomando como base `.env.example`:

```env
# Neon Serverless PostgreSQL Database URLs
DATABASE_URL="postgresql://user:password@ep-your-pooler-endpoint.sa-east-1.aws.neon.tech/cargo?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-your-direct-endpoint.sa-east-1.aws.neon.tech/cargo?sslmode=require"
APP_URL="http://localhost:3000"
```

### 4. Sincronizar Base de Datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Sincronizar el esquema con la base de datos
npx prisma db push
```

### 5. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Acceder a **[http://localhost:3000](http://localhost:3000)** en el navegador.

---

## 🧪 Pruebas y Control de Calidad

```bash
# Comprobación estricta de TypeScript (0 errores)
npm run typecheck

# Compilación de producción (Next.js 16 + Prisma)
npm run build

# Análisis de código con linter
npm run lint
```

---

## 📁 Estructura del Código

```text
├── app/
│   ├── actions.ts                  # Server Actions atómicas (crear embarque, cotización, estados)
│   ├── layout.tsx                  # Root layout con orbes ambientales y PreferencesProvider
│   ├── globals.css                 # Tokens CSS de glassmorphism, temas de color y estilos base
│   ├── error.tsx                   # Boundary global de excepciones en cliente
│   ├── page.tsx                    # Dashboard principal con métricas y estado inicial limpio
│   ├── shipments/                  # Listado de carpetas de importación y detalle [id]
│   ├── quotes/                     # Cotizaciones multimodales con conversión a flete
│   ├── tracking/                   # Live GPS Tracker y telemetría satelital
│   ├── portal/                     # Portal protegido de autogestión para clientes
│   ├── finances/                   # Balance financiero, costos de flete y márgenes
│   ├── clients/                    # Directorio de importadores y exportadores
│   ├── preferences/                # Centro de personalización de temas e idiomas
│   └── api/v1/                     # Rutas REST (shipments, quotes, tracking)
├── components/
│   ├── Sidebar.tsx                 # Barra de navegación estática (sticky md:h-screen)
│   ├── TopBar.tsx                  # Barra superior de títulos y acciones rápidas
│   ├── PreferencesDropdown.tsx     # Selector de tema (Dark/Light), 6 acentos y 4 idiomas
│   ├── PreferencesProvider.tsx     # Contexto de preferencias con hidratación sin parpadeos
│   ├── DeliveringMap.tsx           # Gráfico SVG vectorial de ruta y telemetría
│   └── InvoiceStatusSelect.tsx     # Selector rápido de estado contable (PENDING/INVOICED/PAID)
├── lib/
│   └── db.ts                       # Singleton seguro de PrismaClient
└── prisma/
    └── schema.prisma               # Modelos relacionales Shipment, Milestone, Quote, Client
```

---

## ⭐ Apoya este Proyecto

Si este sistema o su arquitectura te resulta útil, dale una **Estrella (Star)** al repositorio en GitHub para apoyar su desarrollo continuo:

[![Star on GitHub](https://img.shields.io/static/v1?label=Star%20Repo&message=%E2%AD%90&color=yellow&style=for-the-badge&logo=github)](https://github.com/AgustinMilesi/cargo)

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
