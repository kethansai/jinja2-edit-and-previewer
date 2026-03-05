<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 4h10l-.8 9.2a1 1 0 01-1 .8H4.8a1 1 0 01-1-.8L3 4z"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
    <line
      x1="2"
      y1="4"
      x2="14"
      y2="4"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
    <path
      d="M6 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4"
      stroke="currentColor"
      stroke-width="1.1"
      fill="none"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
