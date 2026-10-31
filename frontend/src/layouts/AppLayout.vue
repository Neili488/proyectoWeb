<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ROLE_HOME, ROLE_LABELS, ROLES } from '@/utils/constants'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuOpen = ref(false)
const headerRef = ref(null)
const mobileQuery = window.matchMedia('(max-width: 760px)')

const navItems = computed(() => {
  switch (authStore.role) {
    case ROLES.ESTUDIANTE:
      return [
        { label: 'Mis proyectos', to: '/estudiante/proyectos' },
        { label: 'Subir proyecto', to: '/projects/upload' },
      ]
    case ROLES.DOCENTE:
      return [{ label: 'Revisiones', to: '/docente/revisiones' }]
    case ROLES.ADMIN:
      return [{ label: 'Usuarios', to: '/admin/usuarios' }]
    default:
      return []
  }
})

const homePath = computed(() => ROLE_HOME[authStore.role] ?? '/login')
const roleLabel = computed(() => ROLE_LABELS[authStore.role] ?? '')
const userName = computed(() => authStore.user?.name || 'Usuario')
const userEmail = computed(() => authStore.user?.email || '')

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleKeydown(event) {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu()
  }
}

function handleDocumentClick(event) {
  if (!menuOpen.value) return

  if (headerRef.value && !headerRef.value.contains(event.target)) {
    closeMenu()
  }
}

function handleViewportChange(event) {
  if (!event.matches) {
    closeMenu()
  }
}

function handleLogout() {
  closeMenu()
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleDocumentClick)
  mobileQuery.addEventListener('change', handleViewportChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleDocumentClick)
  mobileQuery.removeEventListener('change', handleViewportChange)
})
</script>

<template>
  <div class="app-shell">
    <header ref="headerRef" class="app-header">
      <div class="app-header-inner">
        <RouterLink class="brand" :to="homePath" @click="closeMenu">
          <span class="brand-mark">FNI</span>
          <span class="brand-text">
            <strong>Proyectos de Grado</strong>
            <small>UTO</small>
          </span>
        </RouterLink>

        <nav class="app-nav" aria-label="Navegación principal">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <div class="app-user">
          <div class="user-meta">
            <strong>{{ userName }}</strong>
            <span>{{ roleLabel }}</span>
          </div>
          <button
            class="btn btn-secondary btn-sm"
            type="button"
            @click="handleLogout"
          >
            Cerrar sesión
          </button>
        </div>

        <button
          class="btn btn-ghost menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="toggleMenu"
        >
          <span
            class="menu-toggle-icon"
            :class="{ 'is-open': menuOpen }"
            aria-hidden="true"
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      <Transition name="mobile-menu">
        <div v-if="menuOpen" id="mobile-menu" class="mobile-menu">
          <nav class="mobile-nav" aria-label="Navegación principal móvil">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-link"
              @click="closeMenu"
            >
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="mobile-user">
            <div class="user-meta">
              <strong>{{ userName }}</strong>
              <span v-if="userEmail">{{ userEmail }}</span>
              <span>{{ roleLabel }}</span>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              type="button"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header-inner {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-3) var(--space-6);
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: inherit;
}

.brand:hover {
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-text strong {
  font-size: 0.9375rem;
}

.brand-text small {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-4);
}

.nav-link {
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--color-surface-alt);
  color: var(--color-text);
  text-decoration: none;
}

.nav-link.router-link-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.app-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: right;
}

.user-meta strong {
  font-size: 0.875rem;
}

.user-meta span {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  margin-left: auto;
}

.menu-toggle-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 18px;
}

.menu-toggle-icon span {
  display: block;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.menu-toggle-icon.is-open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-toggle-icon.is-open span:nth-child(2) {
  opacity: 0;
}

.menu-toggle-icon.is-open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-menu {
  display: none;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.app-content {
  flex: 1;
}

@media (max-width: 760px) {
  .app-header-inner {
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
  }

  .app-nav,
  .app-user {
    display: none;
  }

  .menu-toggle {
    display: inline-flex;
  }

  .mobile-menu {
    display: block;
    padding: var(--space-3) var(--space-4) var(--space-4);
    border-top: 1px solid var(--color-border);
    background: var(--color-surface);
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .mobile-nav .nav-link {
    padding: var(--space-3);
  }

  .mobile-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
  }

  .brand-text strong {
    font-size: 0.875rem;
  }
}
</style>
