<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="2"
      y1="8"
      x2="14"
      y2="8"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
    <path
      d="M10.5 5.5a2.5 2.5 0 00-5 0c0 1.5 1.5 2 3 2.5s3 1 3 2.5a2.5 2.5 0 01-5 0"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
