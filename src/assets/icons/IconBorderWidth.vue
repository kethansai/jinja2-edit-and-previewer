<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 10 } });
</script>
