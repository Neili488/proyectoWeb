<script setup>
import { ESTADO_BADGE_CLASS, ESTADO_LABELS } from '@/utils/constants'

defineProps({
  estado: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span class="badge" :class="ESTADO_BADGE_CLASS[estado]">
    {{ ESTADO_LABELS[estado] ?? estado }}
  </span>
</template>
