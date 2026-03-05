<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M12 7H5a3 3 0 000 6h3"
      stroke="currentColor"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
    />
    <polyline
      points="10,5 12,7 10,9"
      stroke="currentColor"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
