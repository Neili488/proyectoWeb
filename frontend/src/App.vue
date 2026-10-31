<script setup>
import { watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

watch(
  () => authStore.sessionExpired,
  (expired) => {
    if (!expired || route.name === 'login') return

    const redirect = route.meta.requiresAuth ? route.fullPath : undefined

    router.replace({
      name: 'login',
      ...(redirect ? { query: { redirect } } : {}),
    })
  },
)
</script>

<template>
  <RouterView />
</template>
