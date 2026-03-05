<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="1.5"
      y="2.5"
      width="13"
      height="11"
      rx="1.5"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
    <circle cx="5" cy="6" r="1.3" fill="currentColor" />
    <polyline
      points="2,13 6,8 9,11 11,9 14,12"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
