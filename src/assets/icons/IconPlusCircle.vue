<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <circle
      cx="8"
      cy="8"
      r="6.5"
      stroke="currentColor"
      stroke-width="1.3"
      fill="none"
    />
    <line
      x1="5"
      y1="8"
      x2="11"
      y2="8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <line
      x1="8"
      y1="5"
      x2="8"
      y2="11"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
