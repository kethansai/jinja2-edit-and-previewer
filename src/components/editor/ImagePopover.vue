<template>
  <div
    v-if="popover.visible"
    class="ve-img-popover"
    :class="{ dark }"
    :style="{ top: popover.top + 'px', left: popover.left + 'px' }"
    @mousedown.stop
  >
    <!-- Size controls -->
    <div class="ve-img-size-group">
      <div class="ve-img-inputs">
        <label class="ve-img-input-label">W</label>
        <input
          class="ve-img-input"
          type="number"
          :value="popover.unit === '%' ? popover.widthPct : popover.width"
          min="1"
          :max="popover.unit === '%' ? 100 : undefined"
          @change="$emit('set-width', $event)"
          @keydown.enter.prevent="$emit('set-width', $event)"
          :title="'Width in ' + (popover.unit === '%' ? 'percent' : 'pixels')"
        />
        <button
          class="ve-img-btn ve-img-lock-btn"
          :class="{ active: popover.lockRatio }"
          :title="
            popover.lockRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'
          "
          @mousedown.prevent
          @click="$emit('toggle-lock')"
        >
          <IconLockClosed v-if="popover.lockRatio" :size="13" />
          <IconLockOpen v-else :size="13" />
        </button>
        <label class="ve-img-input-label">H</label>
        <input
          class="ve-img-input"
          type="number"
          :value="popover.unit === '%' ? popover.heightPct : popover.height"
          min="1"
          :max="popover.unit === '%' ? 100 : undefined"
          @change="$emit('set-height', $event)"
          @keydown.enter.prevent="$emit('set-height', $event)"
          :title="'Height in ' + (popover.unit === '%' ? 'percent' : 'pixels')"
        />
        <button
          class="ve-img-btn ve-img-unit-btn"
          title="Toggle unit (px / %)"
          @mousedown.prevent
          @click="$emit('toggle-unit')"
        >
          {{ popover.unit || "px" }}
        </button>
      </div>
    </div>

    <span class="ve-img-divider"></span>

    <!-- Alignment -->
    <button
      v-for="a in alignOptions"
      :key="a.value"
      class="ve-img-btn"
      :class="{ active: popover.align === a.value }"
      :title="a.title"
      @mousedown.prevent
      @click="$emit('set-align', a.value)"
    >
      <component :is="a.icon" :size="14" />
    </button>

    <span class="ve-img-divider"></span>

    <!-- Replace & Delete -->
    <button
      class="ve-img-btn"
      title="Replace image"
      @mousedown.prevent
      @click="$emit('replace')"
    >
      <IconImage :size="14" />
    </button>
    <button
      class="ve-img-btn ve-img-btn-danger"
      title="Delete image"
      @mousedown.prevent
      @click="$emit('delete')"
    >
      <IconTrashAlt :size="14" />
    </button>
  </div>
</template>

<script setup>
import { markRaw } from "vue";
import {
  IconFloatLeft,
  IconFloatCenter,
  IconFloatRight,
  IconImage,
  IconTrashAlt,
  IconLockClosed,
  IconLockOpen,
} from "../../assets/icons";

defineProps({
  popover: { type: Object, required: true },
  dark: { type: Boolean, default: false },
});

defineEmits([
  "set-width",
  "set-height",
  "set-align",
  "replace",
  "delete",
  "toggle-lock",
  "toggle-unit",
]);

const alignOptions = [
  { value: "left", title: "Float left", icon: markRaw(IconFloatLeft) },
  { value: "center", title: "Center", icon: markRaw(IconFloatCenter) },
  { value: "right", title: "Float right", icon: markRaw(IconFloatRight) },
];
</script>
