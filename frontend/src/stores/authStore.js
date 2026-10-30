import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'token'
const USER_KEY = 'auth_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const user = ref(readStoredUser())

  const isAuthenticated = computed(() => Boolean(token.value))
  const role = computed(() => user.value?.role ?? '')

  function login({ token: nextToken, user: nextUser }) {
    token.value = nextToken || `mock-token-${Date.now()}`
    user.value = nextUser
    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    user,
    isAuthenticated,
    role,
    login,
    logout,
  }
})
