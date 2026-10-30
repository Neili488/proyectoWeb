import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar sesión' },
  },
  {
    path: '/estudiante/proyectos',
    name: 'student-projects',
    component: () => import('@/views/StudentProjectsView.vue'),
    meta: {
      title: 'Mis proyectos',
      requiresAuth: true,
      role: 'estudiante',
    },
  },
  {
    path: '/projects/upload',
    name: 'project-upload',
    component: () => import('@/views/StudentProjectUploadView.vue'),
    meta: {
      title: 'Subir proyecto',
      requiresAuth: true,
      role: 'estudiante',
    },
  },
  {
    path: '/docente/revisiones',
    name: 'docente-reviews',
    component: () => import('@/views/DocenteReviewView.vue'),
    meta: {
      title: 'Revisión de proyectos',
      requiresAuth: true,
      role: 'docente',
    },
  },
  {
    path: '/admin/usuarios',
    name: 'admin-users',
    component: () => import('@/views/AdminUsersView.vue'),
    meta: {
      title: 'Gestión de usuarios',
      requiresAuth: true,
      role: 'admin',
    },
  },
  {
    path: '/sin-acceso',
    name: 'forbidden',
    component: () => import('@/views/SinAccesoView.vue'),
    meta: { title: 'Sin acceso' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'No encontrado' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.role && authStore.role !== to.meta.role) {
    return { name: 'forbidden' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · Proyectos de Grado FNI`
    : 'Proyectos de Grado FNI'
})

export default router
