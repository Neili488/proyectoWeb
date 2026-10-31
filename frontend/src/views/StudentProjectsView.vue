<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import StatusBadge from '@/components/StatusBadge.vue'
import TableStateRow from '@/components/TableStateRow.vue'
import { formatDate } from '@/utils/format'

const authStore = useAuthStore()
const projectStore = useProjectStore()

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
          <TableStateRow
            v-if="projectStore.loading"
            :colspan="5"
            message="Cargando proyectos…"
          />
          <TableStateRow
            v-else-if="projectStore.projects.length === 0"
            :colspan="5"
            message="Todavía no registraste proyectos."
          />
          <template v-else>
            <tr v-for="project in projectStore.projects" :key="project.id">
              <td>{{ project.titulo }}</td>
              <td>{{ project.carrera }}</td>
              <td>{{ project.modalidad }}</td>
              <td>
                <StatusBadge :estado="project.estado" />
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

@media (max-width: 640px) {
  .page-heading {
    flex-direction: column;
  }
}
</style>
