<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z"
      stroke="currentColor"
      stroke-width="1.3"
      fill="none"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
