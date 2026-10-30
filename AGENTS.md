# AGENTS.md

## Proyecto
Aplicación web para la FNI (Facultad Nacional de Ingeniería, UTO): los estudiantes suben sus proyectos de grado y los docentes los revisan. Se construye **frontend primero con datos simulados**; el backend se implementa después. JWT simple (localStorage, ~8 h), CSS propio.

## Estado actual
- `frontend/`: setup completo + router con guards por rol, auth mock y vistas de estudiante (`StudentProjectsView`, `StudentProjectUploadView`) y docente (`DocenteReviewView`) funcionando con mocks.
- `backend/`: **aún no existe**; planificado con Node + Express + MySQL (`backend/`, puerto 4000).

## Comandos (ejecutar desde `frontend/`)
- `npm run dev` — Vite en `http://localhost:5173`
- `npm run build` — build de producción
- `npm run preview` — servir el build
- No hay tests, lint ni typecheck configurados. No añadir TypeScript: el proyecto es JavaScript (`main.js`, `<script setup>`), `build` es solo `vite build`.

## Frontend
- Vue 3 + Vite 8 + Vue Router + Pinia + Axios.
- Alias `@` → `frontend/src` (definido en `vite.config.js`).
- Entrada: `src/main.js` → `src/App.vue` → `src/router/index.js`.
- Responsabilidades: `views/` páginas, `components/` reutilizables, `layouts/` estructura, `stores/` Pinia, `services/` acceso a datos, `mocks/` datos simulados, `composables/`, `utils/`.
- Estilos: CSS plano con tokens en `src/style.css`. **No** Tailwind ni librería de componentes. Clases base: `.page`, `.card`, `.card-pad`, `.stack`, `.row-between`, `.form-group`, `.form-label`, `.form-control`, `.form-error`, `.table`, `.badge`, `.btn`.
- Al añadir vistas, registra la ruta en `router/index.js` **antes** del catch-all `/:pathMatch(.*)*`.

## Rutas y roles
- Públicas: `/login`. Protegidas: `/estudiante/proyectos` y `/projects/upload` (`estudiante`), `/docente/revisiones` (`docente`), `/admin/usuarios` (`admin`). `/sin-acceso` muestra el 403; el catch-all usa `NotFoundView`.
- `router/index.js` define `meta.requiresAuth` y `meta.role`, y usa `useAuthStore` (`stores/authStore.js`) en `beforeEach`: sin sesión → `/login?redirect=...`; rol incorrecto → `/sin-acceso`. Las vistas se cargan con `() => import(...)`.
- `authStore` persiste `token` y `auth_user` en localStorage. El login (`LoginView`) es mock: correo/contraseña cualquiera + selector de rol hasta integrar el backend.

## Datos y API
- `VITE_USE_MOCKS=true` (por defecto) usa la capa simulada; poner `false` al integrar el backend.
- `VITE_API_URL=http://localhost:4000/api`. `.env` está ignorado por git: mantener también `.env.example`.
- Servicio API: `services/projects.service.js` expone `getAll`, `getById`, `create`, `updateStatus`, `addReview`. Usa Axios con `VITE_API_URL` (que ya incluye `/api`); con `VITE_USE_MOCKS=true` resuelve desde `mocks/projectsMock.js`.
- Store: `stores/projectStore.js` (`useProjectStore`) con `projects`, `currentProject`, `loading`, `error` y acciones `fetchProjects`, `fetchProjectById`, `uploadProject(FormData)`, `submitReview(id, reviewData)`.
- Subida con `FormData`: campos `titulo`, `resumen`, `carrera`, `modalidad`, `archivo`. Endpoints: `GET /projects`, `GET /projects/:id`, `POST /projects`, `PUT /projects/:id/status`, `POST /projects/:id/reviews`.
- Datos simulados de proyectos: `src/mocks/projectsMock.js` exporta `projectsMock` (8 proyectos), `PROJECT_ESTADOS` y `getProjectsMock({ page, limit, search, carrera, estado })` → `{ data, meta }`.
- Esquema de proyecto mock: `id`, `titulo`, `resumen`, `carrera`, `modalidad`, `estudianteId`, `estudiante`, `docenteId`, `docenteRevisor`, `estado`, `archivoUrl`, `createdAt`, `revisiones[]` (`{ id, docente, comentario, fecha }`).
- Estados en mayúsculas: `PENDIENTE`, `EN_REVISION`, `OBSERVADO`, `APROBADO`. Modalidades: `Tesis de Grado`, `Proyecto de Grado`, `Trabajo Dirigido`, `PET`.
- Valores fijos en la vista de subida: carreras `Sistemas, Civil, Industrial, Mecánica, Eléctrica`; modalidades `Tesis de Grado, Proyecto de Grado, Trabajo Dirigido`.
- Token en `Authorization: Bearer`; ante 401 cerrar sesión y redirigir a login.

## Gotchas
- Node 22.12 genera avisos `EBADENGINE` (dependencias transitivas piden ≥22.18). El build funciona; no perseguir el warning salvo que se actualice Node.
- MySQL y Docker **no están instalados**: la fase backend requiere instalar MySQL Community Server.
- El directorio raíz **no es un repositorio git**.
