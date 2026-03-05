<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <path
      d="M6.5 9.5l3-3M5.5 7.5L4 9a2.12 2.12 0 003 3l1.5-1.5M10.5 8.5L12 7a2.12 2.12 0 00-3-3L7.5 5.5"
      stroke="currentColor"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({
  size: { type: [Number, String], default: 16 },
  strokeWidth: { type: [Number, String], default: 1.3 },
});
</script>
