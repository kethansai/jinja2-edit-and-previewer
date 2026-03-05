<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="2"
      y1="8"
      x2="4"
      y2="8"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-dasharray="1 1"
    />
    <rect
      x="5"
      y="5.5"
      width="6"
      height="5"
      rx="0.5"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      fill="none"
    />
    <line
      x1="12"
      y1="8"
      x2="14"
      y2="8"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-dasharray="1 1"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 16 },
  strokeWidth: { type: Number, default: 1.5 },
});
</script>
