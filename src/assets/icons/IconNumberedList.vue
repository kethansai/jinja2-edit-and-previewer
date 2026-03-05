<template>
  <svg :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <text x="2" y="5.5" font-size="6" fill="currentColor" font-weight="600">
      1
    </text>
    <text x="2" y="9.5" font-size="6" fill="currentColor" font-weight="600">
      2
    </text>
    <text x="2" y="13.5" font-size="6" fill="currentColor" font-weight="600">
      3
    </text>
    <line
      x1="6"
      y1="4"
      x2="14"
      y2="4"
      stroke="currentColor"
      stroke-width="1.3"
    />
    <line
      x1="6"
      y1="8"
      x2="14"
      y2="8"
      stroke="currentColor"
      stroke-width="1.3"
    />
    <line
      x1="6"
      y1="12"
      x2="14"
      y2="12"
      stroke="currentColor"
      stroke-width="1.3"
    />
  </svg>
</template>
<script setup>
defineProps({ size: { type: [Number, String], default: 16 } });
</script>
