<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 2.5h4.5a3 3 0 011.8 5.4A3.2 3.2 0 019.5 13.5H4V2.5z"
      stroke="currentColor"
      stroke-width="1.6"
      fill="none"
    />
    <line x1="4" y1="8" x2="9" y2="8" stroke="currentColor" stroke-width="1" />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
