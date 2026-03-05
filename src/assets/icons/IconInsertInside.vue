<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <!-- Outer block -->
    <rect
      x="2"
      y="2"
      width="12"
      height="12"
      rx="1.5"
      stroke="currentColor"
      stroke-width="1.5"
      fill="none"
    />
    <!-- Inner block (plus sign) -->
    <line
      x1="8"
      y1="5.5"
      x2="8"
      y2="10.5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
    <line
      x1="5.5"
      y1="8"
      x2="10.5"
      y2="8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 14 } });
</script>
