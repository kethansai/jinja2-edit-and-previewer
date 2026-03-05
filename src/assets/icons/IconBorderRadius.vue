<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 10V6a4 4 0 014-4h4"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 10 } });
</script>
