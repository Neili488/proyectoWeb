<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="page centered">
    <section class="card card-pad stack" style="max-width: 480px">
      <h1>404</h1>
      <p class="muted">La página que buscas no existe.</p>
      <RouterLink class="btn btn-primary" to="/">Volver al inicio</RouterLink>
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
