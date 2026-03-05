<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 2.5v5a4 4 0 008 0v-5"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
      stroke-linecap="round"
    />
    <line
      x1="3"
      y1="14"
      x2="13"
      y2="14"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
