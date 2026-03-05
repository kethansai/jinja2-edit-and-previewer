<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <line
      x1="9.5"
      y1="2.5"
      x2="6.5"
      y2="13.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <line
      x1="7"
      y1="2.5"
      x2="12"
      y2="2.5"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
    <line
      x1="4"
      y1="13.5"
      x2="9"
      y2="13.5"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
