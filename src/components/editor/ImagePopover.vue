<template>
  <div
    v-if="popover.visible"
    class="ve-img-popover"
    :class="{ dark }"
    :style="{ top: popover.top + 'px', left: popover.left + 'px' }"
    @mousedown.prevent
  >
    <!-- Size controls -->
    <div class="ve-img-size-group">
      <button
        class="ve-img-btn"
        title="Decrease size"
        @click="$emit('resize', -10)"
      >
        <IconMinusCircle :size="14" />
      </button>
      <div class="ve-img-inputs">
        <label class="ve-img-input-label">W</label>
        <input
          class="ve-img-input"
          type="number"
          :value="popover.width"
          min="10"
          @change="$emit('set-width', $event)"
          @keydown.enter.prevent="$emit('set-width', $event)"
          title="Width in pixels"
        />
        <label class="ve-img-input-label">H</label>
        <input
          class="ve-img-input"
          type="number"
          :value="popover.height"
          min="10"
          @change="$emit('set-height', $event)"
          @keydown.enter.prevent="$emit('set-height', $event)"
          title="Height in pixels"
        />
      </div>
      <button
        class="ve-img-btn"
        title="Increase size"
        @click="$emit('resize', 10)"
      >
        <IconPlusCircle :size="14" />
      </button>
    </div>

    <span class="ve-img-divider"></span>

    <!-- Preset sizes -->
    <button
      v-for="pct in [25, 50, 75, 100]"
      :key="pct"
      class="ve-img-btn ve-img-btn-text"
      :class="{ active: popover.widthPct === pct }"
      :title="pct + '% width'"
      @click="$emit('set-width-pct', pct)"
    >
      {{ pct }}%
    </button>

    <span class="ve-img-divider"></span>

    <!-- Alignment -->
    <button
      v-for="a in alignOptions"
      :key="a.value"
      class="ve-img-btn"
      :class="{ active: popover.align === a.value }"
      :title="a.title"
      @click="$emit('set-align', a.value)"
    >
      <component :is="a.icon" :size="14" />
    </button>

    <span class="ve-img-divider"></span>

    <!-- Replace & Delete -->
    <button class="ve-img-btn" title="Replace image" @click="$emit('replace')">
      <IconImage :size="14" />
    </button>
    <button
      class="ve-img-btn ve-img-btn-danger"
      title="Delete image"
      @click="$emit('delete')"
    >
      <IconTrashAlt :size="14" />
    </button>
  </div>
</template>

<script setup>
import { markRaw } from "vue";
import {
  IconMinusCircle,
  IconPlusCircle,
  IconFloatLeft,
  IconFloatCenter,
  IconFloatRight,
  IconImage,
  IconTrashAlt,
} from "../../assets/icons";

defineProps({
  popover: { type: Object, required: true },
  dark: { type: Boolean, default: false },
});

defineEmits([
  "resize",
  "set-width",
  "set-height",
  "set-width-pct",
  "set-align",
  "replace",
  "delete",
]);

const alignOptions = [
  { value: "left", title: "Float left", icon: markRaw(IconFloatLeft) },
  { value: "center", title: "Center", icon: markRaw(IconFloatCenter) },
  { value: "right", title: "Float right", icon: markRaw(IconFloatRight) },
];
</script>
