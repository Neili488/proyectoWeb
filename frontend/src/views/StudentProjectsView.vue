<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'

const authStore = useAuthStore()
const projectStore = useProjectStore()

const estadoLabels = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En Revisión',
  OBSERVADO: 'Observado',
  APROBADO: 'Aprobado',
}

function estadoLabel(estado) {
  return estadoLabels[estado] ?? estado
}

function estadoBadgeClass(estado) {
  return {
    'badge-success': estado === 'APROBADO',
    'badge-danger': estado === 'OBSERVADO',
    'badge-warning': estado === 'EN_REVISION',
  }
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('es-BO', { dateStyle: 'medium' })
}

onMounted(async () => {
  try {
    await projectStore.fetchProjects()
  } catch {
    return
  }
})
</script>

<template>
  <main class="page stack">
    <header class="row-between page-heading">
      <div class="stack heading">
        <span class="badge">FNI · Estudiantes</span>
        <h1>Mis proyectos de grado</h1>
        <p class="muted">
          Hola, {{ authStore.user?.name }}. Este es el estado de tus proyectos.
        </p>
      </div>
      <RouterLink class="btn btn-primary" to="/projects/upload">
        Subir proyecto
      </RouterLink>
    </header>

    <p v-if="projectStore.error" class="form-error">{{ projectStore.error }}</p>

    <section class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Carrera</th>
            <th>Modalidad</th>
            <th>Estado</th>
            <th>Registrado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="projectStore.loading">
            <td colspan="5" class="empty">Cargando proyectos…</td>
          </tr>
          <tr v-else-if="projectStore.projects.length === 0">
            <td colspan="5" class="empty">Todavía no registraste proyectos.</td>
          </tr>
          <template v-else>
            <tr v-for="project in projectStore.projects" :key="project.id">
              <td>{{ project.titulo }}</td>
              <td>{{ project.carrera }}</td>
              <td>{{ project.modalidad }}</td>
              <td>
                <span class="badge" :class="estadoBadgeClass(project.estado)">
                  {{ estadoLabel(project.estado) }}
                </span>
              </td>
              <td>{{ formatDate(project.createdAt) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </main>
</template>

<style scoped>
.page-heading {
  align-items: flex-start;
}

.heading {
  gap: var(--space-2);
}

.table-wrap {
  overflow-x: auto;
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-6);
}

@media (max-width: 640px) {
  .page-heading {
    flex-direction: column;
  }
}
</style>
