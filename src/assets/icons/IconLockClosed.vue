<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <rect
      x="3"
      y="7"
      width="10"
      height="7"
      rx="1.5"
      stroke="currentColor"
      stroke-width="1.3"
      fill="none"
    />
    <path
      d="M5 7V5a3 3 0 016 0v2"
      stroke="currentColor"
      stroke-width="1.3"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 12 } });
</script>
