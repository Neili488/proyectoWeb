import { ref } from 'vue'
import { defineStore } from 'pinia'
import projectsService from '@/services/projects.service'

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Ocurrió un error inesperado. Intenta nuevamente.'
  )
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchProjects(filters = {}) {
    loading.value = true
    error.value = ''

    try {
      const response = await projectsService.getAll(filters)
      projects.value = response.data
      return response
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectById(id) {
    loading.value = true
    error.value = ''

    try {
      const response = await projectsService.getById(id)
      currentProject.value = response.data
      return response.data
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadProject(formData) {
    loading.value = true
    error.value = ''

    try {
      const response = await projectsService.create(formData)
      const created = response.data
      projects.value = [created, ...projects.value]
      return created
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitReview(projectId, reviewData) {
    loading.value = true
    error.value = ''

    try {
      const response = await projectsService.addReview(projectId, reviewData)
      applyReview(projectId, response.data, reviewData?.estado)
      return response.data
    } catch (err) {
      error.value = getErrorMessage(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function applyReview(projectId, review, estado) {
    const id = Number(projectId)

    const update = (project) => {
      if (!project || project.id !== id) return
      if (!project.revisiones.some((item) => item.id === review.id)) {
        project.revisiones.push(review)
      }
      if (estado) {
        project.estado = estado
      }
    }

    update(currentProject.value)
    update(projects.value.find((project) => project.id === id))
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    uploadProject,
    submitReview,
  }
})
