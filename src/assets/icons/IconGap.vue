<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="8"
      y1="2"
      x2="8"
      y2="14"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-dasharray="2 2"
    />
    <line
      x1="3"
      y1="2"
      x2="3"
      y2="14"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <line
      x1="13"
      y1="2"
      x2="13"
      y2="14"
      stroke="currentColor"
      stroke-width="1.5"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 10 } });
</script>
