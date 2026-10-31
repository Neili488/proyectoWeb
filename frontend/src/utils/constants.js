export const ESTADOS = {
  PENDIENTE: 'PENDIENTE',
  EN_REVISION: 'EN_REVISION',
  OBSERVADO: 'OBSERVADO',
  APROBADO: 'APROBADO',
}

export const PROJECT_ESTADOS = Object.values(ESTADOS)

export const ESTADO_LABELS = {
  [ESTADOS.PENDIENTE]: 'Pendiente',
  [ESTADOS.EN_REVISION]: 'En Revisión',
  [ESTADOS.OBSERVADO]: 'Observado',
  [ESTADOS.APROBADO]: 'Aprobado',
}

export const ESTADO_BADGE_CLASS = {
  [ESTADOS.PENDIENTE]: '',
  [ESTADOS.EN_REVISION]: 'badge-warning',
  [ESTADOS.OBSERVADO]: 'badge-danger',
  [ESTADOS.APROBADO]: 'badge-success',
}

export const ESTADO_OPTIONS = PROJECT_ESTADOS.map((value) => ({
  value,
  label: ESTADO_LABELS[value],
}))

export const REVISION_ESTADO_OPTIONS = [
  ESTADOS.OBSERVADO,
  ESTADOS.APROBADO,
  ESTADOS.EN_REVISION,
].map((value) => ({
  value,
  label: ESTADO_LABELS[value],
}))

export const CARRERAS_SUBIDA = [
  'Sistemas',
  'Civil',
  'Industrial',
  'Mecánica',
  'Eléctrica',
]

export const CARRERAS = [...CARRERAS_SUBIDA, 'Metalurgia', 'Química']

export const MODALIDADES = [
  'Tesis de Grado',
  'Proyecto de Grado',
  'Trabajo Dirigido',
]

export const ROLES = {
  ESTUDIANTE: 'estudiante',
  DOCENTE: 'docente',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  [ROLES.ESTUDIANTE]: 'Estudiante',
  [ROLES.DOCENTE]: 'Docente',
  [ROLES.ADMIN]: 'Administrador',
}

export const ROLE_OPTIONS = Object.values(ROLES).map((value) => ({
  value,
  label: ROLE_LABELS[value],
}))

export const ROLE_HOME = {
  [ROLES.ESTUDIANTE]: '/estudiante/proyectos',
  [ROLES.DOCENTE]: '/docente/revisiones',
  [ROLES.ADMIN]: '/admin/usuarios',
}

export function getRoleHome(role) {
  return ROLE_HOME[role] ?? '/login'
}
