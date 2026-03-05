<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="2"
      y1="3"
      x2="14"
      y2="3"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <line
      x1="2"
      y1="6.5"
      x2="14"
      y2="6.5"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <line
      x1="2"
      y1="10"
      x2="14"
      y2="10"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <line
      x1="2"
      y1="13"
      x2="14"
      y2="13"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
  </svg>
</template>
<script setup>
defineProps({
  size: { type: [Number, String], default: 14 },
  strokeWidth: { type: [Number, String], default: 1.5 },
});
</script>
