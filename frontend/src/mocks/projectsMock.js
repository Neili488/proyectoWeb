export { PROJECT_ESTADOS } from '@/utils/constants'

export const projectsMock = [
  {
    id: 1,
    titulo: 'Sistema web de seguimiento académico para la FNI',
    resumen:
      'Desarrollo de una plataforma web que centraliza el seguimiento de proyectos de grado, permitiendo a estudiantes y docentes gestionar avances, observaciones y estados de revisión.',
    carrera: 'Sistemas',
    modalidad: 'Tesis de Grado',
    estudianteId: 101,
    estudiante: 'Ana Quispe Mamani',
    docenteId: 501,
    docenteRevisor: 'Ing. Carlos Condori',
    estado: 'APROBADO',
    archivoUrl: '/docs/proyectos/sistema-seguimiento-academico.pdf',
    createdAt: '2026-02-12T14:30:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Carlos Condori',
        comentario:
          'El documento cumple con la estructura solicitada y las pruebas del sistema están correctamente documentadas.',
        fecha: '2026-03-04T10:15:00.000Z',
      },
    ],
  },
  {
    id: 2,
    titulo: 'Diseño de puente peatonal con estructura metálica',
    resumen:
      'Propuesta de diseño estructural para un puente peatonal en la zona norte de Oruro, incluyendo memoria de cálculo, planos y análisis de cargas.',
    carrera: 'Civil',
    modalidad: 'Proyecto de Grado',
    estudianteId: 102,
    estudiante: 'Luis Fernando Choque',
    docenteId: 502,
    docenteRevisor: 'Ing. María Fernández',
    estado: 'PENDIENTE',
    archivoUrl: '/docs/proyectos/puente-peatonal-metalico.pdf',
    createdAt: '2026-05-18T09:00:00.000Z',
    revisiones: [],
  },
  {
    id: 3,
    titulo: 'Optimización de procesos en una planta de lácteos',
    resumen:
      'Análisis de tiempos y movimientos para reducir desperdicios en la línea de producción, con propuesta de redistribución de planta y estimación de ahorros.',
    carrera: 'Industrial',
    modalidad: 'Trabajo Dirigido',
    estudianteId: 103,
    estudiante: 'Rosa Elena Apaza',
    docenteId: 503,
    docenteRevisor: 'Ing. Jorge Villarroel',
    estado: 'OBSERVADO',
    archivoUrl: '/docs/proyectos/optimizacion-planta-lacteos.pdf',
    createdAt: '2026-04-02T16:45:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Jorge Villarroel',
        comentario:
          'Falta detallar la metodología de muestreo y adjuntar los formatos utilizados en la medición de tiempos.',
        fecha: '2026-04-20T11:30:00.000Z',
      },
      {
        id: 2,
        docente: 'Ing. Jorge Villarroel',
        comentario:
          'Se recomienda incluir indicadores de productividad antes y después de la propuesta.',
        fecha: '2026-05-06T08:20:00.000Z',
      },
    ],
  },
  {
    id: 4,
    titulo: 'Mantenimiento predictivo en bombas centrífugas',
    resumen:
      'Estudio de vibraciones y análisis de aceite para anticipar fallas en bombas centrífugas de una planta de tratamiento de agua.',
    carrera: 'Mecánica',
    modalidad: 'Tesis de Grado',
    estudianteId: 104,
    estudiante: 'Marco Antonio Nina',
    docenteId: 504,
    docenteRevisor: 'Ing. Silvia Rojas',
    estado: 'EN_REVISION',
    archivoUrl: '/docs/proyectos/mantenimiento-predictivo-bombas.pdf',
    createdAt: '2026-06-01T13:10:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Silvia Rojas',
        comentario:
          'Revisar la calibración de los sensores y presentar el histórico completo de vibraciones.',
        fecha: '2026-06-15T09:40:00.000Z',
      },
    ],
  },
  {
    id: 5,
    titulo: 'Dimensionamiento de una instalación fotovoltaica',
    resumen:
      'Cálculo y simulación de una instalación solar fotovoltaica conectada a red para el edificio de laboratorios de la FNI.',
    carrera: 'Eléctrica',
    modalidad: 'Proyecto de Grado',
    estudianteId: 105,
    estudiante: 'Gabriela Torrez',
    docenteId: 505,
    docenteRevisor: 'Ing. Rubén Cáceres',
    estado: 'OBSERVADO',
    archivoUrl: '/docs/proyectos/instalacion-fotovoltaica-fni.pdf',
    createdAt: '2026-03-25T10:00:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Rubén Cáceres',
        comentario:
          'El dimensionamiento no considera las pérdidas por sombreado. Incluir un análisis de sombras.',
        fecha: '2026-04-11T15:00:00.000Z',
      },
      {
        id: 2,
        docente: 'Ing. Rubén Cáceres',
        comentario:
          'Actualizar los precios de los paneles y verificar el retorno de inversión con la tarifa vigente.',
        fecha: '2026-04-28T12:25:00.000Z',
      },
    ],
  },
  {
    id: 6,
    titulo: 'Recuperación de metales a partir de relaves mineros',
    resumen:
      'Evaluación de procesos hidrometalúrgicos para recuperar cobre y zinc de relaves, con pruebas de laboratorio y balance metalúrgico.',
    carrera: 'Metalurgia',
    modalidad: 'Tesis de Grado',
    estudianteId: 106,
    estudiante: 'Diego Armando Flores',
    docenteId: 506,
    docenteRevisor: 'Ing. Patricia Loza',
    estado: 'APROBADO',
    archivoUrl: '/docs/proyectos/recuperacion-metales-relaves.pdf',
    createdAt: '2026-01-15T08:30:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Patricia Loza',
        comentario:
          'Los ensayos y el balance metalúrgico son consistentes. Se aprueba el proyecto.',
        fecha: '2026-02-27T17:05:00.000Z',
      },
    ],
  },
  {
    id: 7,
    titulo: 'Aprovechamiento de residuos orgánicos para biogás',
    resumen:
      'Caracterización de residuos orgánicos del mercado central y estimación del potencial de generación de biogás mediante digestión anaerobia.',
    carrera: 'Química',
    modalidad: 'PET',
    estudianteId: 107,
    estudiante: 'Valeria Condori',
    docenteId: 507,
    docenteRevisor: 'Ing. Fernando Gutiérrez',
    estado: 'PENDIENTE',
    archivoUrl: '/docs/proyectos/biogas-residuos-organicos.pdf',
    createdAt: '2026-06-20T11:55:00.000Z',
    revisiones: [],
  },
  {
    id: 8,
    titulo: 'Aplicación móvil para el control de inventarios',
    resumen:
      'Desarrollo de una aplicación móvil con sincronización en la nube para el control de inventarios de pequeños comercios de Oruro.',
    carrera: 'Sistemas',
    modalidad: 'Trabajo Dirigido',
    estudianteId: 108,
    estudiante: 'Javier Poma',
    docenteId: 508,
    docenteRevisor: 'Ing. Carlos Condori',
    estado: 'EN_REVISION',
    archivoUrl: '/docs/proyectos/app-control-inventarios.pdf',
    createdAt: '2026-05-30T18:20:00.000Z',
    revisiones: [
      {
        id: 1,
        docente: 'Ing. Carlos Condori',
        comentario:
          'Agregar el diagrama de arquitectura y detallar el mecanismo de sincronización offline.',
        fecha: '2026-06-12T10:50:00.000Z',
      },
    ],
  },
]

export function getProjectsMock({
  page = 1,
  limit = 10,
  search = '',
  carrera = '',
  estado = '',
} = {}) {
  const term = search.trim().toLowerCase()

  const filtered = projectsMock.filter((project) => {
    const matchesSearch =
      !term ||
      project.titulo.toLowerCase().includes(term) ||
      project.estudiante.toLowerCase().includes(term)
    const matchesCarrera = !carrera || project.carrera === carrera
    const matchesEstado = !estado || project.estado === estado

    return matchesSearch && matchesCarrera && matchesEstado
  })

  const start = (page - 1) * limit

  return {
    data: filtered.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: filtered.length,
    },
  }
}

export default projectsMock
