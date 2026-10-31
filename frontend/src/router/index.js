import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppLayout from '@/layouts/AppLayout.vue'
import { ROLE_HOME, ROLES } from '@/utils/constants'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar sesión' },
  },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        redirect: () => {
          const authStore = useAuthStore()
          return authStore.checkSession()
            ? ROLE_HOME[authStore.role] ?? '/login'
            : '/login'
        },
      },
      {
        path: 'estudiante/proyectos',
        name: 'student-projects',
        component: () => import('@/views/StudentProjectsView.vue'),
        meta: {
          title: 'Mis proyectos',
          role: ROLES.ESTUDIANTE,
        },
      },
      {
        path: 'projects/upload',
        name: 'project-upload',
        component: () => import('@/views/StudentProjectUploadView.vue'),
        meta: {
          title: 'Subir proyecto',
          role: ROLES.ESTUDIANTE,
        },
      },
      {
        path: 'docente/revisiones',
        name: 'docente-reviews',
        component: () => import('@/views/DocenteReviewView.vue'),
        meta: {
          title: 'Revisión de proyectos',
          role: ROLES.DOCENTE,
        },
      },
      {
        path: 'admin/usuarios',
        name: 'admin-users',
        component: () => import('@/views/AdminUsersView.vue'),
        meta: {
          title: 'Gestión de usuarios',
          role: ROLES.ADMIN,
        },
      },
    ],
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
  const hasSession = authStore.checkSession()

  if (to.meta.requiresAuth && !hasSession) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'login' && hasSession && ROLE_HOME[authStore.role]) {
    return { name: 'home' }
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
