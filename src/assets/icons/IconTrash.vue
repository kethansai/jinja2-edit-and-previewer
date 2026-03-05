<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.5 2h5M2 4h12M3.5 4l.7 9.1a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4L12.5 4"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="6.5"
      y1="7"
      x2="6.5"
      y2="12"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
    <line
      x1="9.5"
      y1="7"
      x2="9.5"
      y2="12"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
