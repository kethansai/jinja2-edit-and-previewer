<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="1"
      y="2"
      width="4"
      height="12"
      rx="1"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
    <rect
      x="6"
      y="2"
      width="4"
      height="12"
      rx="1"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
    <rect
      x="11"
      y="2"
      width="4"
      height="12"
      rx="1"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 10 } });
</script>
