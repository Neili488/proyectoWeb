import axios from 'axios'
import { getProjectsMock, projectsMock } from '@/mocks/projectsMock'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const MOCK_DELAY = 400

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toFormData(payload) {
  if (payload instanceof FormData) return payload

  const formData = new FormData()
  Object.entries(payload ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value)
    }
  })
  return formData
}

function findMockProject(id) {
  const project = projectsMock.find((item) => item.id === Number(id))
  if (!project) {
    throw new Error('Proyecto no encontrado.')
  }
  return project
}

async function getAll(params = {}) {
  if (USE_MOCKS) {
    await delay()
    return getProjectsMock(params)
  }

  const { data } = await http.get('/projects', { params })
  return data
}

async function getById(id) {
  if (USE_MOCKS) {
    await delay()
    return { data: findMockProject(id) }
  }

  const { data } = await http.get(`/projects/${id}`)
  return data
}

async function create(projectFormData) {
  if (USE_MOCKS) {
    await delay()
    const formData = toFormData(projectFormData)
    const archivo = formData.get('archivo')

    const created = {
      id: Date.now(),
      titulo: formData.get('titulo') ?? '',
      resumen: formData.get('resumen') ?? '',
      carrera: formData.get('carrera') ?? '',
      modalidad: formData.get('modalidad') ?? '',
      estudianteId: 0,
      estudiante: 'Estudiante',
      docenteId: null,
      docenteRevisor: '',
      estado: 'PENDIENTE',
      archivoUrl: archivo?.name ? `/docs/proyectos/${archivo.name}` : '',
      createdAt: new Date().toISOString(),
      revisiones: [],
    }

    projectsMock.unshift(created)
    return { data: created }
  }

  const { data } = await http.post('/projects', projectFormData)
  return data
}

async function updateStatus(id, estado) {
  if (USE_MOCKS) {
    await delay()
    const project = findMockProject(id)
    project.estado = estado
    return { data: project }
  }

  const { data } = await http.put(`/projects/${id}/status`, { estado })
  return data
}

async function addReview(projectId, reviewData) {
  if (USE_MOCKS) {
    await delay()
    const project = findMockProject(projectId)

    const review = {
      id: Date.now(),
      docente: reviewData?.docente || project.docenteRevisor || 'Docente revisor',
      comentario: reviewData?.comentario || '',
      fecha: new Date().toISOString(),
    }

    project.revisiones.push(review)
    if (reviewData?.estado) {
      project.estado = reviewData.estado
    }

    return { data: review }
  }

  const { data } = await http.post(`/projects/${projectId}/reviews`, reviewData)
  return data
}

export const projectsService = {
  getAll,
  getById,
  create,
  updateStatus,
  addReview,
}

export default projectsService
