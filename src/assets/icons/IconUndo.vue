<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 7h7a3 3 0 010 6H8"
      stroke="currentColor"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
    />
    <polyline
      points="6,5 4,7 6,9"
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
