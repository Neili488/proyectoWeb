<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

function goToLogin() {
  authStore.logout()
  router.push('/login')
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
        <RouterLink class="btn btn-secondary" to="/login">
          Ir al inicio
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
