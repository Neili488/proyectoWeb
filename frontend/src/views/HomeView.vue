<script setup>
const stack = ['Vue 3', 'Vite', 'Vue Router', 'Pinia', 'Axios']
</script>

<template>
  <main class="page centered">
    <section class="card card-pad stack" style="max-width: 560px">
      <span class="badge badge-success">Fase 1 completada</span>
      <h1>Panel de Administración</h1>
      <p class="muted">
        Base del frontend lista. A continuación se construyen los datos simulados
        y las vistas.
      </p>
      <ul class="chips">
        <li v-for="item in stack" :key="item" class="chip">{{ item }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.centered {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.chip {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--color-surface-alt);
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>
