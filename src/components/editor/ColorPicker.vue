<template>
  <div class="ve-color-picker" :class="{ dark }" @mousedown.prevent>
    <button
      class="ve-color-picker-btn"
      :class="btnClass"
      :title="title"
      @click.stop="togglePanel"
    >
      <slot>
        <span
          class="ve-color-picker-swatch-icon"
          :style="{ backgroundColor: modelValue }"
        ></span>
      </slot>
    </button>
    <div v-if="open" class="ve-color-picker-panel" :class="panelPosition">
      <div class="ve-color-picker-grid">
        <button
          v-for="(preset, i) in presets"
          :key="i"
          class="ve-color-picker-preset"
          :class="{ active: modelValue === preset.color, transparent: preset.color === 'transparent' }"
          :style="preset.color !== 'transparent' ? { backgroundColor: preset.color } : {}"
          :title="preset.title"
          @click.stop="selectColor(preset.color)"
        ></button>
      </div>
      <div class="ve-color-picker-custom">
        <label class="ve-color-picker-custom-label">
          Custom:
          <input
            ref="customInput"
            type="color"
            class="ve-color-picker-custom-input"
            :value="modelValue"
            @input="selectColor($event.target.value)"
          />
        </label>
        <span class="ve-color-picker-hex">{{ modelValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { colorPresets } from "../../data/colorPresets.js";

const props = defineProps({
  modelValue: { type: String, default: "#000000" },
  title: { type: String, default: "Pick color" },
  dark: { type: Boolean, default: false },
  btnClass: { type: String, default: "" },
  panelPosition: { type: String, default: "below" },
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const presets = colorPresets;

function togglePanel() {
  open.value = !open.value;
}

function selectColor(color) {
  emit("update:modelValue", color);
  open.value = false;
}

function onDocClick(e) {
  if (open.value) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocClick, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick, true);
});
</script>

<style>
.ve-color-picker {
  position: relative;
  display: inline-flex;
}

.ve-color-picker-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ve-color-picker-swatch-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1.5px solid rgba(0, 0, 0, 0.15);
}

.ve-color-picker-panel {
  position: absolute;
  z-index: 10000;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  width: 248px;
}

.ve-color-picker-panel.below {
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
}

.ve-color-picker-panel.above {
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
}

.ve-color-picker-panel.below-left {
  top: calc(100% + 4px);
  right: 0;
}

.ve-color-picker-panel.below-right {
  top: calc(100% + 4px);
  left: 0;
}

.dark .ve-color-picker-panel {
  background: #1e1e2e;
  border-color: #444;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.ve-color-picker-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 3px;
  margin-bottom: 8px;
}

.ve-color-picker-preset {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s, box-shadow 0.1s;
}

.ve-color-picker-preset:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px rgba(10, 130, 118, 0.4);
  z-index: 1;
}

.ve-color-picker-preset.active {
  box-shadow: 0 0 0 2px #0a8276;
  transform: scale(1.15);
}

.ve-color-picker-preset.transparent {
  background: linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%
    ),
    linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%
    );
  background-size: 8px 8px;
  background-position: 0 0, 4px 4px;
}

.dark .ve-color-picker-preset {
  border-color: rgba(255, 255, 255, 0.1);
}

.ve-color-picker-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid #eee;
}

.dark .ve-color-picker-custom {
  border-top-color: #444;
}

.ve-color-picker-custom-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #666;
  cursor: pointer;
  white-space: nowrap;
}

.dark .ve-color-picker-custom-label {
  color: #aaa;
}

.ve-color-picker-custom-input {
  width: 24px;
  height: 20px;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  background: none;
}

.ve-color-picker-custom-input::-webkit-color-swatch-wrapper {
  padding: 1px;
}

.ve-color-picker-custom-input::-webkit-color-swatch {
  border: none;
  border-radius: 2px;
}

.ve-color-picker-hex {
  font-size: 10px;
  font-family: monospace;
  color: #999;
  margin-left: auto;
}

.dark .ve-color-picker-hex {
  color: #777;
}
</style>
