# proyectoWeb

Proyecto para la revisión de trabajos
Plan para completar el frontend — Proyectos de Grado FNI

1. Diagnóstico
   Ya existe una base funcional: login mock, guards por rol, layout mínimo, vistas de estudiante (listado y subida) y docente (revisión con modal), store de proyectos, servicio con mocks y 8 proyectos simulados.
   Faltan piezas para considerarlo un frontend completo:

- No hay layout compartido ni navegación entre vistas; App.vue solo renderiza RouterView.
- / siempre redirige a /login, incluso con sesión activa; HomeView existe pero no está ruteada.
- El listado de estudiante muestra todos los proyectos, no solo los del estudiante.
- El docente ve todos los proyectos, no solo los asignados a él.
- No hay detalle del proyecto para el estudiante ni historial de revisiones visible.
- No hay búsqueda, paginación ni uso de meta aunque el mock ya lo soporta.
- AdminUsersView es solo un placeholder.
- No hay servicios/mocks de usuarios ni de autenticación.
- No hay expiración de sesión (~8 h) ni manejo global de 401.
- updateStatus existe en el servicio pero no se expone en el store.
- Las URLs de PDF mock (/docs/proyectos/...) no existen → descarga 404.
- Hay lógica duplicada de estados, badges y fechas en varias vistas.
- Bug: el mensaje de éxito de subida se borra inmediatamente en StudentProjectUploadView.vue:82-83 porque resetForm() limpia successMessage.
- index.html y package.json conservan el nombre genérico "Panel de Administración".

2. Objetivo
   Completar el frontend con datos simulados, los tres roles operativos y sin dependencia del backend, dejando la capa de servicios lista para cambiar VITE_USE_MOCKS=false.
3. Fases de trabajo
   Fase 0 — Correcciones base y utilidades (0.5 día)

- Corregir el mensaje de éxito en la subida.
- Centralizar constantes en src/utils/constants.js: estados, etiquetas, carreras, modalidades, roles, clases de badge.
- Centralizar formatos en src/utils/format.js: fechas, tamaño de archivo.
- Refactorizar las vistas para usar esas utilidades y eliminar duplicación.
- Actualizar index.html (título) y package.json (nombre).
- Verificar que npm run build sigue funcionando.
  Fase 1 — Layout, navegación y guards (1 día)
- Crear src/layouts/AppLayout.vue:
- Cabecera con marca FNI, navegación según rol, usuario actual y botón de cerrar sesión.
- Menú adaptable a móvil.
- Reestructurar router/index.js con rutas anidadas bajo el layout; login, 403 y 404 fuera.
- Redirección por rol:
- / → panel correspondiente si hay sesión; /login si no.
- /login con sesión activa → panel del rol.
- Ajustar SinAccesoView y NotFoundView para volver al panel correcto.
- Decidir si HomeView se elimina o pasa a ser una landing pública.
- Añadir comprobación de expiración de token en authStore.
  Archivos: App.vue, router/index.js, layouts/AppLayout.vue, authStore.js, vistas de error.
  Fase 2 — Componentes y composables compartidos (1 día)
  Crear en src/components/:
- StatusBadge.vue — estado del proyecto con color y etiqueta.
- BaseModal.vue — teleport, cierre con Escape/overlay, foco atrapado, aria-modal.
- PaginationBar.vue — página anterior/siguiente y total.
- EmptyState.vue — sin resultados / sin datos.
- LoadingState.vue — carga de tablas y tarjetas.
- ConfirmDialog.vue — confirmar aprobación, eliminación o desactivación.
- ToastHost.vue + composables/useToast.js — notificaciones de éxito/error.
- ProjectTimeline.vue — historial de revisiones reutilizable.
- FileLink.vue — enlace/descarga con fallback si el archivo no existe.
  Refactorizar las vistas existentes para usarlos.
  Fase 3 — Módulo estudiante (1.5 días)
- Listado /estudiante/proyectos:
- Filtrar por estudianteId === authStore.user.id.
- Búsqueda por título, filtro por estado, paginación.
- Tabla en escritorio y tarjetas en móvil.
- Acción "Ver detalle".
- Nueva vista /estudiante/proyectos/:id:
- Datos del proyecto, estado actual, resumen, archivo y timeline de observaciones.
- Subida /projects/upload:
- Validar tamaño máximo (ej. 10 MB), tipo PDF y campos obligatorios.
- Corregir el flujo de éxito: toast y redirección o mensaje persistente.
- Evitar doble envío y advertir si se abandona el formulario con datos.
- Enlace de regreso a "Mis proyectos".
  Fase 4 — Módulo docente (1.5 días)
- Filtrar por docenteId === authStore.user.id (proyectos asignados).
- Añadir búsqueda, paginación y contadores por estado.
- Refactorizar el modal de revisión con BaseModal:
- Historial de observaciones con ProjectTimeline.
- Enlace al PDF con manejo de error.
- Confirmación antes de marcar APROBADO.
- Toast de éxito y actualización del listado.
- Acciones rápidas opcionales: pasar a EN_REVISION u OBSERVADO.
  Fase 5 — Módulo administrador (1.5 días)
- Crear src/mocks/usersMock.js con estudiantes, docentes y administradores.
- Crear src/services/users.service.js y src/stores/usersStore.js con el mismo patrón de mocks.
- Implementar AdminUsersView:
- Búsqueda y filtros por rol/estado.
- Tabla paginada.
- Crear/editar usuario en modal.
- Activar/desactivar y eliminar con confirmación.
- Validaciones: correo obligatorio/único, rol válido, nombre obligatorio.
- Toasts y estados de carga/error/vacío.
  Fase 6 — Autenticación y capa de datos (1 día)
- Crear src/services/auth.service.js mock y preparado para el backend.
- El login debe asignar identidades demo coherentes con los mocks:
- Estudiante → id 101, docente → id 501, admin → id 1.
- Mantener la posibilidad de escribir cualquier correo/contraseña.
- Implementar expiración de sesión (~8 h) y limpieza de localStorage.
- Interceptor Axios 401: cerrar sesión y redirigir a login.
- Ampliar projectStore:
- meta de paginación y filtros.
- Acción updateStatus.
- Reset de estado al cambiar de vista.
- Extender getProjectsMock para filtrar por estudianteId y docenteId.
- Resolver los PDFs de ejemplo:
- Opción A: añadir un PDF demo en public/docs/proyectos/ y apuntar todos los mocks allí.
- Opción B: mostrar "documento no disponible en modo demo" sin enlace roto.
  Fase 7 — Pulido y QA manual (1 día)
- Revisar responsive en 360, 768 y 1280 px.
- Accesibilidad: foco, Escape, etiquetas, aria-live para errores/éxito.
- Estados de carga, vacío y error en todas las vistas.
- Revisar títulos de página y consistencia visual.
- Ejecutar npm run build y corregir errores.
- Matriz de pruebas manual:
- Rutas protegidas sin sesión.
- Acceso cruzado entre roles.
- Persistencia tras recargar.
- Subida, revisión y cambio de estado.
- CRUD de usuarios.
- Comportamiento con VITE_USE_MOCKS=false (debe fallar de forma controlada sin backend).

4. Orden y estimación
   Fase
5. Base y utilidades
6. Layout y guards
7. Componentes compartidos
8. Estudiante
9. Docente
10. Administrador
11. Auth y datos
12. QA y pulido
    Las fases 3, 4 y 5 pueden ejecutarse en paralelo una vez cerradas 1, 2 y 6.
13. Criterios de aceptación

- Cada rol llega a su panel desde / y desde el login.
- Un estudiante solo ve sus proyectos y su historial de revisiones.
- Un docente solo ve los proyectos asignados y puede registrar revisión.
- El administrador puede listar, crear, editar y desactivar usuarios.
- La subida valida PDF/tamaño y confirma el éxito de forma visible.
- Búsqueda, filtros y paginación funcionan en los tres módulos.
- Cerrar sesión y expirar token redirigen correctamente.
- No hay enlaces rotos a PDFs en modo mock.
- npm run build termina sin errores.
- No se añade TypeScript, Tailwind ni librerías de componentes.

6. Decisiones a confirmar
1. ¿El detalle del proyecto del estudiante será una vista propia (/estudiante/proyectos/:id) o un modal como el del docente? Recomiendo vista propia.
1. ¿Se implementa el CRUD completo de usuarios o se mantiene el placeholder hasta el backend? Recomiendo CRUD completo con mocks.
1. ¿Añadimos PDFs de ejemplo en public/docs/proyectos/ para que las descargas funcionen? Recomiendo sí, un único PDF demo reutilizado.
1. ¿El login mantiene el selector de rol con cualquier correo o pasa a identidades demo predefinidas? Recomiendo mantener cualquier correo, pero asignando la identidad mock según el rol.
1. ¿Se incluye un dashboard con contadores por estado? Recomiendo añadir contadores simples en las vistas existentes, sin una vista nueva.
   No realicé cambios: el plan queda listo para ejecutarse cuando lo confirmes.
