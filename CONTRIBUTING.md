# Guía de Contribución a DailyFlow 🚀

¡Gracias por tu interés en contribuir a **DailyFlow**! Toda aportación, desde la corrección de un error tipográfico hasta una mejora importante en la arquitectura o interfaz de usuario, es altamente valorada.

Para mantener una base de código limpia, mantenible y colaborativa, por favor revisa las siguientes directrices antes de enviar una contribución.

---

## 📌 Tabla de Contenidos

1. [Código de Conducta](#-código-de-conducta)
2. [¿Cómo puedo contribuir?](#-cómo-puedo-contribuir)
   - [Reportar Errores (Bugs)](#reportar-errores-bugs)
   - [Proponer Nuevas Funcionalidades](#proponer-nuevas-funcionalidades)
3. [Flujo de Trabajo para Desarrollo](#-flujo-de-trabajo-para-desarrollo)
   - [1. Fork y Clonación](#1-fork-y-clonación)
   - [2. Configuración del Entorno](#2-configuración-del-entorno)
   - [3. Creación de Ramas](#3-creación-de-ramas)
4. [Convención de Commits](#-convención-de-commits)
5. [Estándares de Código](#-estándares-de-código)
6. [Envío de Pull Requests (PR)](#-envío-de-pull-requests-pr)
7. [Licencia de las Contribuciones](#-licencia-de-las-contribuciones)

---

## 🤝 Código de Conducta

Al participar en este proyecto, aceptas cumplir con nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Por favor, léelo para comprender las expectativas respecto a la interacción en la comunidad.

---

## 💡 ¿Cómo puedo contribuir?

### Reportar Errores (Bugs)

Antes de abrir un nuevo *Issue*, verifica si el error ya ha sido reportado en la pestaña de [Issues](https://github.com/elpeakyblinder/DailyFlow/issues). Si no existe:

1. Crea un issue con el título claro y conciso: `[BUG] Descripción corta del error`.
2. Incluye:
   - **Pasos para reproducir** el problema.
   - **Comportamiento esperado vs. Comportamiento obtenido**.
   - **Capturas de pantalla o logs de consola** si aplica.
   - **Información del entorno** (versión de Node, navegador, sistema operativo).

### Proponer Nuevas Funcionalidades

Las sugerencias son bienvenidas. Antes de comenzar a escribir código para una característica grande:

1. Abre un issue de tipo `[FEATURE] Nombre de la propuesta`.
2. Explica el caso de uso, por qué aporta valor y cuál sería la solución ideal propuesta.
3. Espera retroalimentación del mantenedor principal (**Guijosa Dev**) antes de implementar cambios a gran escala.

---

## 🛠️ Flujo de Trabajo para Desarrollo

### 1. Fork y Clonación

1. Haz un **Fork** del repositorio en tu cuenta de GitHub.
2. Clona tu fork localmente:
   ```bash
   git clone https://github.com/<tu-usuario>/DailyFlow.git
   cd DailyFlow
   ```
3. Agrega el repositorio principal como `upstream`:
   ```bash
   git remote add upstream https://github.com/elpeakyblinder/DailyFlow.git
   ```

### 2. Configuración del Entorno

1. Asegúrate de tener **Node.js 20+** y **pnpm** instalados.
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Copia el archivo de variables de entorno de ejemplo:
   ```bash
   cp .env.example .env.local
   ```
4. Configura tus credenciales locales (ver [README.md](README.md) para más detalles sobre Neon PostgreSQL y Vercel Blob).

### 3. Creación de Ramas

Crea siempre una rama descriptiva a partir de la rama principal (`main`):

```bash
git checkout -b <tipo>/<nombre-descriptivo>
```

Prefijos recomendados:
* `feat/` — Nuevas funcionalidades (ej. `feat/report-export-excel`)
* `fix/` — Correcciones de errores (ej. `fix/image-upload-preview`)
* `docs/` — Cambios o mejoras en la documentación (ej. `docs/update-readme`)
* `refactor/` — Reestructuración de código sin alterar comportamiento
* `perf/` — Mejoras de rendimiento
* `test/` — Adición o corrección de pruebas

---

## 📝 Convención de Commits

Seguimos la especificación de **[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)**. Esto garantiza un historial claro y automatizable.

### Estructura del Commit:
```text
<tipo>(<alcance opcional>): <descripción breve en imperativo>
```

### Ejemplos válidos:
* `feat(reports): add drag and drop support for image uploads`
* `fix(auth): resolve session expiration redirect loop`
* `docs(readme): add installation guide for local postgres`
* `refactor(pdf): optimize base64 conversion pipeline`

---

## 🎨 Estándares de Código

* **TypeScript:** Escribe código fuertemente tipado. Evita el uso de `any` a menos que sea estrictamente necesario y esté justificado.
* **Componentes:** Sigue el paradigma de React Server Components (RSC) y utiliza `"use client"` únicamente en componentes que requieran interactividad del navegador (estado, eventos, hooks de cliente).
* **Estilos:** Emplea utilidades de Tailwind CSS acordes al sistema de diseño existente.
* **Linter:** Ejecuta `pnpm lint` antes de realizar commit para asegurar que no haya violaciones de estilo ni errores de sintaxis.

---

## 🚀 Envío de Pull Requests (PR)

Cuando tu solución esté lista:

1. Asegúrate de que el código compila sin errores:
   ```bash
   pnpm build
   pnpm lint
   ```
2. Mantén tu rama actualizada con `upstream/main`:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```
3. Haz push a tu fork:
   ```bash
   git push origin <tu-rama>
   ```
4. Abre un **Pull Request** hacia la rama `main` del repositorio oficial.
5. En la descripción del PR:
   - Explica detalladamente qué problema resuelve o qué agrega.
   - Vincula el Issue correspondiente (ej. `Closes #12`).
   - Incluye capturas de pantalla o GIFs si hubo cambios en la interfaz gráfica.

---

## ⚖️ Licencia de las Contribuciones

Al contribuir al repositorio **DailyFlow**, aceptas que todo código y documentación aportados queden bajo los términos de la [Licencia del Proyecto](LICENSE) (Uso No Comercial / Source-Available).

---

¡Gracias por ser parte de DailyFlow! Construido con ❤️ por [Guijosa Dev](https://github.com/elpeakyblinder) ([devcharlying@gmail.com](mailto:devcharlying@gmail.com)).
