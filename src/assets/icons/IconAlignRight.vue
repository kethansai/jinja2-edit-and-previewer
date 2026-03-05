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
      x1="6"
      y1="6.3"
      x2="14"
      y2="6.3"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <line
      x1="4"
      y1="9.6"
      x2="14"
      y2="9.6"
      stroke="currentColor"
      :stroke-width="strokeWidth"
    />
    <line
      x1="8"
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
  size: { type: [Number, String], default: 16 },
  strokeWidth: { type: [Number, String], default: 1.3 },
});
</script>
