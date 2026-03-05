<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <circle cx="3" cy="4" r="1.2" fill="currentColor" />
    <circle cx="3" cy="8" r="1.2" fill="currentColor" />
    <circle cx="3" cy="12" r="1.2" fill="currentColor" />
    <line
      x1="6"
      y1="4"
      x2="14"
      y2="4"
      stroke="currentColor"
      stroke-width="1.3"
    />
    <line
      x1="6"
      y1="8"
      x2="14"
      y2="8"
      stroke="currentColor"
      stroke-width="1.3"
    />
    <line
      x1="6"
      y1="12"
      x2="14"
      y2="12"
      stroke="currentColor"
      stroke-width="1.3"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
