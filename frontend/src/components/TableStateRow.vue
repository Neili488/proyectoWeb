<script setup>
defineProps({
  colspan: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <tr>
    <td :colspan="colspan" class="table-empty">{{ message }}</td>
  </tr>
</template>
