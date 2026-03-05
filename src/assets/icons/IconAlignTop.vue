<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="2"
      y1="2"
      x2="14"
      y2="2"
      stroke="currentColor"
      :stroke-width="strokeWidth + 0.5"
    />
    <rect
      x="5"
      y="4"
      width="6"
      height="4"
      rx="0.5"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      fill="none"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 16 },
  strokeWidth: { type: Number, default: 1.5 },
});
</script>
