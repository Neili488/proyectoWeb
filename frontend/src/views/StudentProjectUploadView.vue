<script setup>
import { reactive, ref } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

const projectStore = useProjectStore()

const carreras = ['Sistemas', 'Civil', 'Industrial', 'Mecánica', 'Eléctrica']
const modalidades = ['Tesis de Grado', 'Proyecto de Grado', 'Trabajo Dirigido']

const form = reactive({
  titulo: '',
  resumen: '',
  carrera: '',
  modalidad: '',
  archivo: null,
})

const errors = reactive({})
const fileInput = ref(null)
const successMessage = ref('')

function isPdf(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key])
}

function validate() {
  clearErrors()

  if (!form.titulo.trim()) errors.titulo = 'El título es obligatorio.'
  if (!form.resumen.trim()) errors.resumen = 'El resumen es obligatorio.'
  if (!form.carrera) errors.carrera = 'Selecciona una carrera.'
  if (!form.modalidad) errors.modalidad = 'Selecciona una modalidad.'
  if (!form.archivo) {
    errors.archivo = 'Adjunta el archivo PDF del proyecto.'
  } else if (!isPdf(form.archivo)) {
    errors.archivo = 'El archivo debe estar en formato PDF.'
  }

  return Object.keys(errors).length === 0
}

function onFileChange(event) {
  const file = event.target.files?.[0] ?? null
  form.archivo = file
  successMessage.value = ''

  if (file && !isPdf(file)) {
    errors.archivo = 'El archivo debe estar en formato PDF.'
  } else {
    delete errors.archivo
  }
}

function resetForm() {
  form.titulo = ''
  form.resumen = ''
  form.carrera = ''
  form.modalidad = ''
  form.archivo = null
  successMessage.value = ''

  if (fileInput.value) fileInput.value.value = ''
  clearErrors()
}

async function handleSubmit() {
  successMessage.value = ''

  if (!validate()) return

  const formData = new FormData()
  formData.append('titulo', form.titulo.trim())
  formData.append('resumen', form.resumen.trim())
  formData.append('carrera', form.carrera)
  formData.append('modalidad', form.modalidad)
  formData.append('archivo', form.archivo)

  try {
    await projectStore.uploadProject(formData)
    successMessage.value = 'Proyecto registrado correctamente.'
    resetForm()
  } catch {
    // El store expone el mensaje en projectStore.error
  }
}
</script>

<template>
  <main class="page">
    <div class="upload-wrap stack">
      <header class="stack">
        <span class="badge">FNI · UTO</span>
        <h1>Registro de proyecto de grado</h1>
        <p class="muted">
          Completa los datos y adjunta tu proyecto en formato PDF.
        </p>
      </header>

      <form class="card card-pad stack" novalidate @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label" for="titulo">Título</label>
          <input
            id="titulo"
            v-model="form.titulo"
            class="form-control"
            type="text"
            placeholder="Título del proyecto"
          />
          <p v-if="errors.titulo" class="form-error">{{ errors.titulo }}</p>
        </div>

        <div class="form-group">
          <label class="form-label" for="resumen">Resumen / Descripción</label>
          <textarea
            id="resumen"
            v-model="form.resumen"
            class="form-control"
            rows="5"
            placeholder="Describe brevemente el proyecto"
          ></textarea>
          <p v-if="errors.resumen" class="form-error">{{ errors.resumen }}</p>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="carrera">Carrera</label>
            <select id="carrera" v-model="form.carrera" class="form-control">
              <option value="" disabled>Selecciona una carrera</option>
              <option v-for="carrera in carreras" :key="carrera" :value="carrera">
                {{ carrera }}
              </option>
            </select>
            <p v-if="errors.carrera" class="form-error">{{ errors.carrera }}</p>
          </div>

          <div class="form-group">
            <label class="form-label" for="modalidad">Modalidad</label>
            <select id="modalidad" v-model="form.modalidad" class="form-control">
              <option value="" disabled>Selecciona una modalidad</option>
              <option v-for="modalidad in modalidades" :key="modalidad" :value="modalidad">
                {{ modalidad }}
              </option>
            </select>
            <p v-if="errors.modalidad" class="form-error">{{ errors.modalidad }}</p>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="archivo">Archivo PDF del proyecto</label>
          <input
            id="archivo"
            ref="fileInput"
            class="form-control"
            type="file"
            accept="application/pdf,.pdf"
            @change="onFileChange"
          />
          <p v-if="form.archivo" class="muted file-name">{{ form.archivo.name }}</p>
          <p v-if="errors.archivo" class="form-error">{{ errors.archivo }}</p>
        </div>

        <p v-if="projectStore.error" class="form-error">{{ projectStore.error }}</p>

        <div v-if="successMessage" class="feedback">
          <span class="badge badge-success">{{ successMessage }}</span>
        </div>

        <div class="row-between">
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="projectStore.loading"
            @click="resetForm"
          >
            Limpiar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="projectStore.loading">
            {{ projectStore.loading ? 'Enviando…' : 'Registrar proyecto' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.upload-wrap {
  max-width: 720px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.file-name {
  font-size: 0.8125rem;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
