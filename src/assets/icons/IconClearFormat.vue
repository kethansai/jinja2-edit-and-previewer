<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 3l10 10M6 3h6l-2 5"
      stroke="currentColor"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <line
      x1="4"
      y1="13"
      x2="9"
      y2="13"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
