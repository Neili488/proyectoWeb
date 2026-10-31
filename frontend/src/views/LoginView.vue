<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ROLE_HOME, ROLE_OPTIONS, ROLES } from '@/utils/constants'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  role: ROLES.ESTUDIANTE,
})

const error = ref('')

function handleSubmit() {
  error.value = ''

  if (!form.email.trim() || !form.password.trim()) {
    error.value = 'Ingresa tu correo y contraseña.'
    return
  }

  const email = form.email.trim()
  authStore.login({
    token: `mock-token-${Date.now()}`,
    user: {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      role: form.role,
    },
  })

  const roleHome = ROLE_HOME[form.role] ?? '/login'
  const redirect =
    typeof route.query.redirect === 'string' ? route.query.redirect : ''

  if (redirect) {
    const target = router.resolve(redirect)
    const targetRole = target.meta.role

    if (target.name !== 'not-found' && (!targetRole || targetRole === form.role)) {
      router.push(redirect)
      return
    }
  }

  router.push(roleHome)
}
</script>

<template>
  <main class="page auth-page">
    <section class="card card-pad stack auth-card">
      <header class="stack auth-heading">
        <span class="badge">FNI · UTO</span>
        <h1>Proyectos de Grado</h1>
        <p class="muted">Inicia sesión para continuar.</p>
      </header>

      <form class="stack" novalidate @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="email">Correo</label>
          <input
            id="email"
            v-model="form.email"
            class="form-control"
            type="email"
            placeholder="nombre.apellido@sistemas.edu.bo"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            class="form-control"
            type="password"
            placeholder="••••••"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="role">Rol (demo)</label>
          <select id="role" v-model="form.role" class="form-control">
            <option v-for="role in ROLE_OPTIONS" :key="role.value" :value="role.value">
              {{ role.label }}
            </option>
          </select>
        </div>

        <p v-if="error" class="form-error">{{ error }}</p>

        <button class="btn btn-primary" type="submit">Ingresar</button>

        <p class="muted auth-hint">
          Demo: cualquier correo y contraseña. El rol determina la vista
          disponible.
        </p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

.auth-card {
  width: min(420px, 100%);
}

.auth-heading {
  gap: var(--space-2);
}

.auth-hint {
  font-size: 0.8125rem;
}
</style>
