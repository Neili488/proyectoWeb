<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getRoleHome } from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()

const homePath = computed(() => getRoleHome(authStore.role))
const homeLabel = computed(() =>
  authStore.isAuthenticated ? 'Volver a mi panel' : 'Ir al inicio',
)

function goToLogin() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="page forbidden-page">
    <section class="card card-pad stack forbidden-card">
      <span class="badge badge-danger">403</span>
      <h1>Sin acceso</h1>
      <p class="muted">
        Tu rol no tiene permisos para acceder a esta sección.
      </p>
      <div class="row">
        <RouterLink class="btn btn-secondary" :to="homePath">
          {{ homeLabel }}
        </RouterLink>
        <button class="btn btn-ghost" type="button" @click="goToLogin">
          Cerrar sesión
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.forbidden-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

.forbidden-card {
  width: min(460px, 100%);
}
</style>
