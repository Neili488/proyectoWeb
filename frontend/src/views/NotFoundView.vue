<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getRoleHome } from '@/utils/constants'

const authStore = useAuthStore()

const homePath = computed(() => getRoleHome(authStore.role))
const homeLabel = computed(() =>
  authStore.isAuthenticated ? 'Volver a mi panel' : 'Ir al inicio',
)
</script>

<template>
  <main class="page centered">
    <section class="card card-pad stack" style="max-width: 480px">
      <h1>404</h1>
      <p class="muted">La página que buscas no existe.</p>
      <RouterLink class="btn btn-primary" :to="homePath">
        {{ homeLabel }}
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.centered {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
</style>
