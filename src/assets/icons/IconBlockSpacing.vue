<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="1"
      width="14"
      height="14"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      stroke-dasharray="2 1.5"
    />
    <rect
      x="4"
      y="4"
      width="8"
      height="8"
      rx="1"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <line
      x1="8"
      y1="1"
      x2="8"
      y2="4"
      stroke="currentColor"
      stroke-width="0.8"
      stroke-dasharray="1 1"
    />
    <line
      x1="8"
      y1="12"
      x2="8"
      y2="15"
      stroke="currentColor"
      stroke-width="0.8"
      stroke-dasharray="1 1"
    />
    <line
      x1="1"
      y1="8"
      x2="4"
      y2="8"
      stroke="currentColor"
      stroke-width="0.8"
      stroke-dasharray="1 1"
    />
    <line
      x1="12"
      y1="8"
      x2="15"
      y2="8"
      stroke="currentColor"
      stroke-width="0.8"
      stroke-dasharray="1 1"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
