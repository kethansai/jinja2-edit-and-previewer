<template>
  <div
    v-if="tooltip.visible"
    class="ve-link-tooltip"
    :class="{ dark }"
    :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }"
    @mousedown.prevent
  >
    <a
      class="ve-link-tooltip-url"
      :href="tooltip.url"
      target="_blank"
      rel="noopener"
      @click.stop
      >{{ tooltip.url }}</a
    >
    <button
      class="ve-link-tooltip-btn"
      title="Edit link"
      @click="$emit('edit')"
    >
      <IconPencil :size="14" />
    </button>
    <button
      class="ve-link-tooltip-btn ve-link-tooltip-btn-danger"
      title="Remove link"
      @click="$emit('remove')"
    >
      <IconUnlink :size="14" />
    </button>
  </div>
</template>

<script setup>
import { IconPencil, IconUnlink } from "../../assets/icons";

defineProps({
  tooltip: { type: Object, required: true },
  dark: { type: Boolean, default: false },
});

defineEmits(["edit", "remove"]);
</script>
