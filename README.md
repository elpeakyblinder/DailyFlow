<div align="center">

  <img src="public/logo/completedLogoDailyFlow.webp" alt="DailyFlow Logo" width="480" />

  <p align="center">
    <strong>Plataforma integral para la gestión, seguimiento y centralización de reportes diarios de trabajo ("Daily Standups") en equipos de alto rendimiento.</strong>
  </p>

  <p align="center">
    <a href="#-características-principales">Características</a> •
    <a href="#-stack-tecnológico">Stack</a> •
    <a href="#-guía-de-inicio-rápido">Instalación</a> •
    <a href="#-esquema-de-base-de-datos">Base de Datos</a> •
    <a href="#-contribución">Contribuir</a> •
    <a href="#-licencia-y-uso-comercial">Licencia</a> •
    <a href="#-autor-y-contacto">Contacto</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon Postgres" />
    <img src="https://img.shields.io/badge/License-Non--Commercial-orange?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📖 Acerca de DailyFlow

**DailyFlow** es una solución corporativa moderna diseñada para resolver la fricción en la comunicación diaria de equipos de trabajo y áreas operativas. Facilita la dinámica de **Daily Standups asíncronos**, permitiendo a los colaboradores documentar avances, adjuntar evidencia fotográfica o técnica y transparentar bloqueos en cuestión de minutos.

Al mismo tiempo, dota a los líderes y administradores de paneles de visualización consolidada por áreas/equipos, historial cronológico y un motor de **exportación de reportes semanales en formato PDF ejecutivo**, listo para su presentación a directivos.

---

## ✨ Características Principales

### 👨‍💻 Para Colaboradores (Employee Dashboard)
* **Creación Ágil de Reportes Diarios:** Redacción limpia e intuitiva de actividades realizadas.
* **Gestión de Estado de Ánimo y Bloqueos (Mood Tracker):**
  * 🟢 **Éxito (Success):** Jornada completada sin fricciones.
  * 🟡 **Neutral (Neutral):** Avances regulares.
  * 🔴 **Bloqueado (Blocked):** Alerta inmediata de dependencias o problemas que impiden el avance.
* **Carga Multimedia Avanzada:**
  * Soporte para arrastrar y soltar (**Drag & Drop**).
  * Soporte para **pegar imágenes directamente desde el portapapeles** (`Ctrl+V` / `Cmd+V`).
  * **Compresión en cliente** previa a la subida con `browser-image-compression` para optimizar ancho de banda.
* **Historial Personal:** Consulta y revisión de reportes previos con estado y fecha/hora exacta.

### 🛡️ Para Administradores y Líderes (Admin Dashboard)
* **Gestión de Estructura Organizacional:** Supervisión segmentada por **Áreas** y **Equipos de Trabajo**.
* **Supervisión en Tiempo Real:** Monitoreo del último reporte emitido por cada colaborador del equipo.
* **Auditoría e Inspección Detallada:** Visualización individual de cada reporte con galería de evidencias fotográficas.
* **Control de Accesos Basado en Roles (RBAC):** Separación estricta de rutas y permisos entre `admin` y `employee` mediante middleware y autenticación en servidor.

### 📑 Exportación Ejecutiva en PDF
* **Motor `@react-pdf/renderer` Integrado:** Generación de resúmenes semanales consolidados por área.
* **Pipeline de Imágenes a Base64:** Garantiza que los PDFs incorporen las capturas de evidencia de forma nativa sin fallos de renderizado remoto.
* **Formato Corporativo:** Agrupado cronológicamente por colaborador, área y semana laboral (Lunes a Viernes).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Framework Fullstack** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React Server Components) |
| **Biblioteca UI** | [React 19](https://react.dev/) |
| **Lenguaje** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (iconos) + [Sonner](https://sonner.emilkowal.ski/) (toasts) |
| **Base de Datos** | [Neon Database](https://neon.tech/) (PostgreSQL Serverless con Connection Pooling) |
| **Almacenamiento Cloud** | [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) |
| **Autenticación** | [NextAuth.js v5 Beta](https://authjs.dev/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Generación de PDFs** | [@react-pdf/renderer](https://react-pdf.org/) |
| **Procesamiento Multimedia** | [Sharp](https://sharp.pixelplumbing.com/) + [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) |

---

## 📂 Arquitectura del Proyecto

```text
DailyFlow/
├── public/                     # Recursos estáticos y branding (logos, iconos)
│   └── logo/
│       ├── completedLogoDailyFlow.webp
│       └── onlyLogoDailyFlow.webp
├── src/
│   ├── actions/                # Server Actions para mutaciones seguras
│   │   ├── auth-actions.ts     # Flujo de login y logout en servidor
│   │   └── report-actions.ts   # Creación y persistencia transaccional de reportes
│   ├── app/                    # Rutas de Next.js App Router
│   │   ├── admin/              # Vistas y paneles exclusivos para administradores
│   │   │   ├── dashboard/      # Métricas y resumen de áreas/equipos
│   │   │   ├── employees/      # Listado y detalle por colaborador
│   │   │   └── reports/        # Historial e inspección de reportes
│   │   ├── api/                # Endpoints de API (REST/Handlers)
│   │   │   ├── reports/export-weekly/ # Generación y streaming del reporte PDF
│   │   │   └── upload-images-FormReport/ # Subida segura a Vercel Blob
│   │   ├── auth/               # Páginas de inicio de sesión y autenticación
│   │   ├── components/         # Componentes UI reutilizables (ReportForm, etc.)
│   │   └── employee/           # Vistas exclusivas para colaboradores
│   │       └── dashboard/      # Panel principal, nuevo reporte e historial
│   ├── auth.ts                 # Configuración central de NextAuth v5
│   ├── lib/                    # Lógica de base de datos, PDF y utilidades core
│   │   ├── admin.ts            # Consultas de agregación para el panel de administración
│   │   ├── data.ts             # Consultas de reportes y perfiles
│   │   ├── db.ts               # Conexión al pool de Neon PostgreSQL
│   │   └── pdf/                # Plantillas y conversión de imágenes para PDF
│   ├── middleware.ts           # Protección de rutas y verificación de roles
│   ├── types/                  # Definiciones de tipos TypeScript globales
│   └── utils/                  # Funciones auxiliares de formateo (fechas, etc.)
├── .env.example                # Plantilla documentada de variables de entorno
├── schema.sql                  # Script DDL para inicializar la base de datos
├── CONTRIBUTING.md             # Guía de contribución para la comunidad
├── CODE_OF_CONDUCT.md          # Código de conducta para colaboradores
├── LICENSE                     # Términos de la Licencia No Comercial
└── package.json                # Dependencias y scripts de ejecución
```

---

## 🚀 Guía de Inicio Rápido

### Prerrequisitos

* [Node.js](https://nodejs.org/) `>= 20.x`
* [pnpm](https://pnpm.io/) `>= 9.x` (o gestor de tu preferencia: npm, yarn, bun)
* Una instancia activa de [PostgreSQL](https://www.postgresql.org/) (se recomienda crear un proyecto gratuito en [Neon.tech](https://neon.tech/))
* Una cuenta de [Vercel](https://vercel.com/) para el almacenamiento en [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/elpeakyblinder/DailyFlow.git
cd DailyFlow
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Copia el archivo de plantilla `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Abre `.env.local` y especifica tus credenciales:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | Cadena de conexión PostgreSQL (con soporte SSL) | `postgresql://user:pass@ep-pooler.region.neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | Secreto para cifrado de tokens NextAuth (mín. 32 car.) | Ejecutar: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL base de la aplicación | `http://localhost:3000` |
| `BLOB_READ_WRITE_TOKEN` | Token de lectura y escritura de Vercel Blob | `vercel_blob_rw_xxxxxxxxxxxxxxxx` |

### 4. Inicializar la Base de Datos

Ejecuta el script SQL provisto en [`schema.sql`](schema.sql) dentro de tu consola SQL de Neon o cliente PostgreSQL (DBeaver, pgAdmin, etc.). Esto creará las tablas:
* `areas`
* `teams`
* `users`
* `profiles`
* `daily_reports`
* `report_images`

### 5. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la aplicación.

---

## 📜 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

| Comando | Acción |
| :--- | :--- |
| `pnpm dev` | Inicia el servidor de desarrollo en modo hot-reload. |
| `pnpm build` | Compila la aplicación para producción optimizando bundles. |
| `pnpm start` | Inicia el servidor de producción tras haber ejecutado `build`. |
| `pnpm lint` | Ejecuta ESLint para analizar la calidad y estilo del código. |

---

## 🗄️ Esquema de Base de Datos

La arquitectura de datos está diseñada sobre PostgreSQL relacional optimizado para alta concurrencia y consultas agregadas en tiempo real:

```mermaid
erDiagram
    AREAS ||--o{ USERS : "pertenece a"
    TEAMS ||--o{ USERS : "es miembro de"
    USERS ||--|| PROFILES : "tiene un"
    USERS ||--o{ DAILY_REPORTS : "genera"
    DAILY_REPORTS ||--o{ REPORT_IMAGES : "contiene evidencias"

    AREAS {
        uuid id PK
        varchar name
        timestamptz created_at
    }

    TEAMS {
        uuid id PK
        varchar name
        text description
        uuid owner_id FK
        timestamptz created_at
    }

    USERS {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar role
        uuid team_id FK
        uuid area_id FK
        boolean is_active
        timestamptz created_at
    }

    PROFILES {
        uuid id PK
        uuid user_id FK
        varchar full_name
        varchar job_title
        timestamptz created_at
    }

    DAILY_REPORTS {
        uuid id PK
        uuid user_id FK
        varchar title
        text content
        varchar mood
        timestamptz created_at
    }

    REPORT_IMAGES {
        uuid id PK
        uuid report_id FK
        text image_url
        timestamptz created_at
    }
```

---

## 🤝 Contribución

¡Las contribuciones de la comunidad son bienvenidas! Si deseas sugerir una nueva funcionalidad, reportar un bug o enviar una mejora técnica:

1. Lee nuestro [Código de Conducta](CODE_OF_CONDUCT.md).
2. Revisa la [Guía de Contribución](CONTRIBUTING.md) para conocer el flujo de trabajo de Git y las convenciones de commit.
3. Abre un Issue o un Pull Request en el repositorio.

---

## ⚖️ Licencia y Uso Comercial

Este proyecto está bajo una **Licencia de Código Fuente No Comercial (Source-Available Non-Commercial License)**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

> [!WARNING]
> ### 🚫 Prohibición Estricta de Comercialización No Autorizada
> El uso del código de este repositorio para fines comerciales directos o indirectos (incluyendo, entre otros: venta de software, servicios SaaS monetizados, uso en entornos de producción de empresas privadas lucrativas o integración en productos de pago) **está terminantemente prohibido** sin la autorización expresa y por escrito del autor.

### 💼 ¿Deseas adquirir una Licencia Comercial?

Si representas a una empresa, startup o deseas desplegar DailyFlow con fines comerciales u operativos privados, es necesario solicitar una **Licencia Comercial Oficial**:

* **Autor:** Guijosa Dev
* **Contacto:** **devcharlying** *(GitHub: [@elpeakyblinder](https://github.com/elpeakyblinder) / contacto devcharlying)*
* **Asunto del mensaje:**  
  `Dailyflow comercializar`  
  o alternativamente:  
  `[DailyFlow] Solicitud de Licencia Comercial - <Tu Empresa / Nombre>`

---

## 👤 Autor y Contacto

Desarrollado y mantenido con dedicación por **Guijosa Dev** (`devcharlying`).

* GitHub: [@elpeakyblinder](https://github.com/elpeakyblinder)
* Proyecto: [https://github.com/elpeakyblinder/DailyFlow](https://github.com/elpeakyblinder/DailyFlow)

---

<div align="center">
  <sub>DailyFlow © 2024-present Guijosa Dev. Todos los derechos reservados.</sub>
</div>
