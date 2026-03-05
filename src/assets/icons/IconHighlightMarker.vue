<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="2"
      width="12"
      height="9"
      rx="1.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <rect x="2" y="12.5" width="12" height="2.5" rx="0.5" fill="#ffe066" />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 15 } });
</script>
