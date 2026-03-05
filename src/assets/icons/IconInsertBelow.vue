<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="8"
      y1="6"
      x2="8"
      y2="14"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <polyline
      points="5,11 8,14 11,11"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="3"
      y1="2"
      x2="13"
      y2="2"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
