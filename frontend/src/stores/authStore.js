import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const TOKEN_KEY = 'token'
const USER_KEY = 'auth_user'
const EXPIRES_AT_KEY = 'auth_expires_at'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000
const CLOCK_INTERVAL_MS = 30 * 1000

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readStoredExpiry() {
  const value = Number(localStorage.getItem(EXPIRES_AT_KEY))
  return Number.isFinite(value) && value > 0 ? value : 0
}

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(EXPIRES_AT_KEY)
}

function resolveStoredExpiry(hasToken) {
  if (!hasToken) return 0

  const storedExpiry = readStoredExpiry()
  if (storedExpiry) return storedExpiry

  const fallbackExpiry = Date.now() + SESSION_DURATION_MS
  localStorage.setItem(EXPIRES_AT_KEY, String(fallbackExpiry))
  return fallbackExpiry
}

export const useAuthStore = defineStore('auth', () => {
  const storedToken = localStorage.getItem(TOKEN_KEY) || ''
  const storedUser = storedToken ? readStoredUser() : null
  const initialExpiry = resolveStoredExpiry(Boolean(storedToken))
  const expiredOnLoad = Boolean(storedToken) && initialExpiry <= Date.now()
  const hasValidSession = Boolean(storedToken) && Boolean(storedUser) && !expiredOnLoad

  const token = ref(hasValidSession ? storedToken : '')
  const user = ref(hasValidSession ? storedUser : null)
  const expiresAt = ref(hasValidSession ? initialExpiry : 0)
  const now = ref(Date.now())
  const sessionExpired = ref(expiredOnLoad)

  if (!hasValidSession) {
    clearStoredSession()
  }

  const isExpired = computed(
    () => Boolean(expiresAt.value) && expiresAt.value <= now.value,
  )
  const isAuthenticated = computed(
    () => Boolean(token.value) && !isExpired.value,
  )
  const role = computed(() => user.value?.role ?? '')

  function login({
    token: nextToken,
    user: nextUser,
    expiresAt: nextExpiresAt,
  } = {}) {
    const nextExpiry = Number(nextExpiresAt) || Date.now() + SESSION_DURATION_MS

    token.value = nextToken || `mock-token-${Date.now()}`
    user.value = nextUser ?? null
    expiresAt.value = nextExpiry
    now.value = Date.now()
    sessionExpired.value = false

    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    localStorage.setItem(EXPIRES_AT_KEY, String(nextExpiry))
  }

  function logout() {
    token.value = ''
    user.value = null
    expiresAt.value = 0
    clearStoredSession()
  }

  function expireSession() {
    sessionExpired.value = true
    logout()
  }

  function checkSession() {
    now.value = Date.now()

    if (token.value && expiresAt.value <= now.value) {
      logout()
      return false
    }

    return Boolean(token.value)
  }

  if (typeof window !== 'undefined') {
    window.setInterval(() => {
      now.value = Date.now()

      if (token.value && expiresAt.value <= now.value) {
        expireSession()
      }
    }, CLOCK_INTERVAL_MS)
  }

  return {
    token,
    user,
    expiresAt,
    sessionExpired,
    isExpired,
    isAuthenticated,
    role,
    login,
    logout,
    checkSession,
  }
})
