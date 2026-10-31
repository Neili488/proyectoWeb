<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import StatusBadge from '@/components/StatusBadge.vue'
import TableStateRow from '@/components/TableStateRow.vue'
import {
  CARRERAS,
  ESTADO_OPTIONS,
  REVISION_ESTADO_OPTIONS,
} from '@/utils/constants'
import { formatDateTime } from '@/utils/format'

const projectStore = useProjectStore()

const estadoFiltro = ref('')
const carreraFiltro = ref('')
const reviewOpen = ref(false)
const successMessage = ref('')
const reviewErrors = reactive({})

const estadosFiltro = [{ value: '', label: 'Todos' }, ...ESTADO_OPTIONS]

const review = reactive({
  comentario: '',
  estado: '',
})

const revisiones = computed(() => projectStore.currentProject?.revisiones ?? [])

async function loadProjects() {
  try {
    await projectStore.fetchProjects({
      carrera: carreraFiltro.value,
      estado: estadoFiltro.value,
    })
  } catch {
    return
  }
}

watch([estadoFiltro, carreraFiltro], loadProjects, { immediate: true })

function clearReviewErrors() {
  Object.keys(reviewErrors).forEach((key) => delete reviewErrors[key])
}

async function openReview(project) {
  successMessage.value = ''
  review.comentario = ''
  review.estado = ''
  clearReviewErrors()

  try {
    await projectStore.fetchProjectById(project.id)
    reviewOpen.value = true
    window.removeEventListener('keydown', onKeydown)
    window.addEventListener('keydown', onKeydown)
  } catch {
    return
  }
}

function closeReview() {
  reviewOpen.value = false
  window.removeEventListener('keydown', onKeydown)
}

function onKeydown(event) {
  if (event.key === 'Escape') closeReview()
}

function validateReview() {
  clearReviewErrors()

  if (!review.comentario.trim()) {
    reviewErrors.comentario = 'Escribe una observación o corrección.'
  }
  if (!review.estado) {
    reviewErrors.estado = 'Selecciona el nuevo estado del proyecto.'
  }

  return Object.keys(reviewErrors).length === 0
}

async function handleSubmitReview() {
  successMessage.value = ''

  if (!validateReview()) return

  try {
    await projectStore.submitReview(projectStore.currentProject.id, {
      comentario: review.comentario.trim(),
      estado: review.estado,
      docente: projectStore.currentProject.docenteRevisor,
    })

    successMessage.value = 'Revisión registrada correctamente.'
    review.comentario = ''
    review.estado = ''
    await loadProjects()
  } catch {
    return
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <main class="page stack">
    <header class="stack">
      <span class="badge">FNI · Docentes</span>
      <h1>Revisión de proyectos de grado</h1>
      <p class="muted">
        Revisa los proyectos asignados, consulta el documento y registra tus
        observaciones.
      </p>
    </header>

    <section class="card card-pad filters">
      <div class="form-group">
        <label class="form-label" for="filtro-estado">Estado</label>
        <select id="filtro-estado" v-model="estadoFiltro" class="form-control">
          <option
            v-for="estado in estadosFiltro"
            :key="estado.value"
            :value="estado.value"
          >
            {{ estado.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="filtro-carrera">Carrera</label>
        <select id="filtro-carrera" v-model="carreraFiltro" class="form-control">
          <option value="">Todas</option>
          <option v-for="carrera in CARRERAS" :key="carrera" :value="carrera">
            {{ carrera }}
          </option>
        </select>
      </div>

      <div class="row-between filter-actions">
        <span class="muted">{{ projectStore.projects.length }} proyecto(s)</span>
        <button
          class="btn btn-secondary"
          type="button"
          :disabled="projectStore.loading"
          @click="loadProjects"
        >
          Actualizar
        </button>
      </div>
    </section>

    <p v-if="projectStore.error && !reviewOpen" class="form-error">
      {{ projectStore.error }}
    </p>

    <section class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Título del proyecto</th>
            <th>Carrera</th>
            <th>Estado</th>
            <th class="text-right">Acción</th>
          </tr>
        </thead>
        <tbody>
          <TableStateRow
            v-if="projectStore.loading"
            :colspan="5"
            message="Cargando proyectos…"
          />
          <TableStateRow
            v-else-if="projectStore.projects.length === 0"
            :colspan="5"
            message="No hay proyectos que coincidan con los filtros."
          />
          <template v-else>
            <tr v-for="project in projectStore.projects" :key="project.id">
              <td>{{ project.estudiante }}</td>
              <td>{{ project.titulo }}</td>
              <td>{{ project.carrera }}</td>
              <td>
                <StatusBadge :estado="project.estado" />
              </td>
              <td class="text-right">
                <button
                  class="btn btn-primary btn-sm"
                  type="button"
                  @click="openReview(project)"
                >
                  Revisar
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <Teleport to="body">
      <div
        v-if="reviewOpen && projectStore.currentProject"
        class="modal-overlay"
        @click.self="closeReview"
      >
        <section
          class="modal card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-title"
        >
          <header class="row-between card-header">
            <div class="stack modal-heading">
              <h2 id="review-title">Revisión del proyecto</h2>
              <p class="muted">{{ projectStore.currentProject.titulo }}</p>
            </div>
            <button
              class="btn btn-ghost btn-sm"
              type="button"
              aria-label="Cerrar"
              @click="closeReview"
            >
              ×
            </button>
          </header>

          <div class="modal-body stack">
            <div class="detail-grid">
              <div>
                <span class="detail-label">Estudiante</span>
                <p>{{ projectStore.currentProject.estudiante }}</p>
              </div>
              <div>
                <span class="detail-label">Carrera</span>
                <p>{{ projectStore.currentProject.carrera }}</p>
              </div>
              <div>
                <span class="detail-label">Modalidad</span>
                <p>{{ projectStore.currentProject.modalidad }}</p>
              </div>
              <div>
                <span class="detail-label">Estado actual</span>
                <p>
                  <StatusBadge :estado="projectStore.currentProject.estado" />
                </p>
              </div>
            </div>

            <div class="stack">
              <h3>Resumen</h3>
              <p>{{ projectStore.currentProject.resumen }}</p>
            </div>

            <a
              class="btn btn-secondary"
              :href="projectStore.currentProject.archivoUrl"
              target="_blank"
              rel="noopener"
            >
              Ver / descargar PDF
            </a>

            <div class="stack">
              <h3>Historial de observaciones</h3>
              <p v-if="revisiones.length === 0" class="muted">
                Aún no hay observaciones registradas.
              </p>
              <ul v-else class="revision-list">
                <li
                  v-for="revision in revisiones"
                  :key="revision.id"
                  class="revision-item"
                >
                  <div class="row-between">
                    <strong>{{ revision.docente }}</strong>
                    <span class="muted">{{ formatDateTime(revision.fecha) }}</span>
                  </div>
                  <p>{{ revision.comentario }}</p>
                </li>
              </ul>
            </div>

            <form class="stack" novalidate @submit.prevent="handleSubmitReview">
              <h3>Nueva revisión</h3>

              <div class="form-group">
                <label class="form-label" for="comentario">
                  Observación o corrección
                </label>
                <textarea
                  id="comentario"
                  v-model="review.comentario"
                  class="form-control"
                  rows="4"
                  placeholder="Escribe tu observación"
                ></textarea>
                <p v-if="reviewErrors.comentario" class="form-error">
                  {{ reviewErrors.comentario }}
                </p>
              </div>

              <div class="form-group">
                <label class="form-label" for="estado">Cambio de estado</label>
                <select id="estado" v-model="review.estado" class="form-control">
                  <option value="" disabled>Selecciona un estado</option>
                  <option
                    v-for="estado in REVISION_ESTADO_OPTIONS"
                    :key="estado.value"
                    :value="estado.value"
                  >
                    {{ estado.label }}
                  </option>
                </select>
                <p v-if="reviewErrors.estado" class="form-error">
                  {{ reviewErrors.estado }}
                </p>
              </div>

              <p v-if="projectStore.error" class="form-error">
                {{ projectStore.error }}
              </p>
              <p v-if="successMessage" class="badge badge-success">
                {{ successMessage }}
              </p>

              <div class="row-between">
                <button
                  class="btn btn-secondary"
                  type="button"
                  :disabled="projectStore.loading"
                  @click="closeReview"
                >
                  Cerrar
                </button>
                <button
                  class="btn btn-primary"
                  type="submit"
                  :disabled="projectStore.loading"
                >
                  {{ projectStore.loading ? 'Guardando…' : 'Guardar Revisión' }}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 220px)) 1fr;
  gap: var(--space-4);
  align-items: end;
}

.filter-actions {
  justify-content: flex-end;
}

.text-right {
  text-align: right;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  background: rgba(15, 23, 42, 0.55);
}

.modal {
  width: min(760px, 100%);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-heading {
  gap: var(--space-1);
}

.modal-body {
  padding: var(--space-5);
  overflow-y: auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.detail-label {
  display: block;
  margin-bottom: var(--space-1);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.revision-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  list-style: none;
  margin: 0;
  padding: 0;
}

.revision-item {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

@media (max-width: 720px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    justify-content: space-between;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
