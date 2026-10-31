const LOCALE = 'es-BO'
const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

function parseDate(value) {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = parseDate(value)
  if (!date) return value ? String(value) : ''

  return date.toLocaleDateString(LOCALE, { dateStyle: 'medium' })
}

export function formatDateTime(value) {
  const date = parseDate(value)
  if (!date) return value ? String(value) : ''

  return date.toLocaleString(LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === '') return ''

  const size = Number(bytes)
  if (!Number.isFinite(size) || size < 0) return ''
  if (size === 0) return '0 B'

  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  )
  const value = size / 1024 ** index
  const formatted =
    index === 0 ? String(Math.round(value)) : value.toFixed(1).replace('.', ',')

  return `${formatted} ${FILE_SIZE_UNITS[index]}`
}
