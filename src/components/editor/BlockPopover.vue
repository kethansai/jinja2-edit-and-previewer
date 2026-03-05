<template>
  <div
    v-if="popover.visible"
    class="ve-spacing-popover"
    :class="{ dark }"
    @mousedown.prevent
  >
    <div class="ve-spacing-header-row">
      <span class="ve-spacing-header">{{
        popover.isHR ? "Divider" : "Block"
      }}</span>
      <div class="ve-spacing-header-actions" @mousedown.stop.prevent>
        <button
          class="ve-spacing-icon-btn"
          title="Insert block above"
          @click="$emit('insert-above')"
        >
          <IconInsertAbove :size="14" />
        </button>
        <button
          class="ve-spacing-icon-btn"
          title="Insert block below"
          @click="$emit('insert-below')"
        >
          <IconInsertBelow :size="14" />
        </button>
        <button
          v-if="!popover.isHR"
          class="ve-spacing-icon-btn"
          title="Insert child block inside"
          @click="$emit('insert-inside')"
        >
          <IconInsertInside :size="14" />
        </button>
        <button
          class="ve-spacing-icon-btn ve-spacing-icon-btn-danger"
          title="Delete block"
          @click="$emit('delete-block')"
        >
          <IconTrash :size="14" />
        </button>
      </div>
    </div>
    <div class="ve-spacing-scroll-area">
      <!-- Text alignment (not for HR) -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Horizontal Align</div>
        <div class="ve-spacing-align-row">
          <button
            v-for="a in alignOptions"
            :key="a.value"
            class="ve-spacing-align-btn"
            :class="{ active: popover.textAlign === a.value }"
            :title="a.title"
            @click="$emit('text-align', a.value)"
          >
            <component :is="a.icon" :size="14" :stroke-width="1.5" />
          </button>
        </div>
      </div>

      <!-- Vertical alignment (not for HR) -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Vertical Align</div>
        <div class="ve-spacing-align-row">
          <button
            v-for="a in verticalAlignOptions"
            :key="a.value"
            class="ve-spacing-align-btn"
            :class="{ active: popover.verticalAlign === a.value }"
            :title="a.title"
            @click="$emit('vertical-align', a.value)"
          >
            <component :is="a.icon" :size="14" :stroke-width="1.5" />
          </button>
        </div>
      </div>

      <!-- Display & Layout (not for HR) -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Layout</div>
        <div class="ve-figma-row">
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Display"
          >
            <select
              class="ve-figma-select"
              :value="popover.display"
              @change="$emit('display-change', $event.target.value)"
              @mousedown.stop
            >
              <option value="">Default</option>
              <option value="block">Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="inline">Inline</option>
              <option value="inline-block">Inline-Block</option>
              <option value="inline-flex">Inline-Flex</option>
              <option value="inline-grid">Inline-Grid</option>
              <option value="none">None</option>
            </select>
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Position"
          >
            <select
              class="ve-figma-select"
              :value="popover.position"
              @change="$emit('position-change', $event.target.value)"
              @mousedown.stop
            >
              <option value="">Default</option>
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
              <option value="fixed">Fixed</option>
              <option value="sticky">Sticky</option>
              <option value="static">Static</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Flex options -->
      <div v-if="!popover.isHR && isFlex" class="ve-spacing-section">
        <div class="ve-spacing-label">Flex</div>
        <div class="ve-figma-row">
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Direction"
          >
            <select
              class="ve-figma-select"
              :value="popover.flexDirection"
              @change="
                $emit('layout-prop', 'flexDirection', $event.target.value)
              "
              @mousedown.stop
            >
              <option value="row">Row</option>
              <option value="row-reverse">Row-Rev</option>
              <option value="column">Column</option>
              <option value="column-reverse">Col-Rev</option>
            </select>
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Wrap"
          >
            <select
              class="ve-figma-select"
              :value="popover.flexWrap"
              @change="$emit('layout-prop', 'flexWrap', $event.target.value)"
              @mousedown.stop
            >
              <option value="nowrap">No Wrap</option>
              <option value="wrap">Wrap</option>
              <option value="wrap-reverse">Wrap-Rev</option>
            </select>
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Justify content"
          >
            <select
              class="ve-figma-select"
              :value="popover.justifyContent"
              @change="
                $emit('layout-prop', 'justifyContent', $event.target.value)
              "
              @mousedown.stop
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Between</option>
              <option value="space-around">Around</option>
              <option value="space-evenly">Evenly</option>
            </select>
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Align items"
          >
            <select
              class="ve-figma-select"
              :value="popover.alignItems"
              @change="$emit('layout-prop', 'alignItems', $event.target.value)"
              @mousedown.stop
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div class="ve-figma-field" title="Gap (px)">
            <span class="ve-figma-icon"><IconGap :size="10" /></span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.gap"
              @change="$emit('gap-change', $event)"
              @input="$emit('gap-change', $event)"
              @mousedown.stop
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Grid options -->
      <div v-if="!popover.isHR && isGrid" class="ve-spacing-section">
        <div class="ve-spacing-label">Grid</div>
        <div class="ve-figma-row">
          <div
            class="ve-figma-field ve-figma-field-wide-full"
            title="Grid columns (e.g. 1fr 1fr, repeat(3, 1fr))"
          >
            <span class="ve-figma-icon"><IconGridColumns :size="10" /></span>
            <input
              class="ve-figma-input"
              type="text"
              :value="popover.gridTemplateColumns"
              @change="$emit('grid-columns', $event)"
              @mousedown.stop
              placeholder="e.g. 1fr 1fr 1fr"
            />
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div class="ve-figma-field" title="Gap (px)">
            <span class="ve-figma-icon"><IconGap :size="10" /></span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.gap"
              @change="$emit('gap-change', $event)"
              @input="$emit('gap-change', $event)"
              @mousedown.stop
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Block Size: width & height (not for HR) -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Size</div>
        <div class="ve-figma-row">
          <div class="ve-figma-field" title="Width">
            <span class="ve-figma-icon">W</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="parsedWidth.num"
              @input="
                $emit(
                  'block-width',
                  buildSizeVal($event.target.value, parsedWidth.unit),
                )
              "
              @mousedown.stop
              placeholder="auto"
            />
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-unit-select"
            title="Width unit"
          >
            <select
              class="ve-figma-select"
              :value="parsedWidth.unit"
              @change="
                $emit(
                  'block-width',
                  buildSizeVal(parsedWidth.num, $event.target.value),
                )
              "
              @mousedown.stop
            >
              <option v-for="u in sizeUnits" :key="u" :value="u">
                {{ u }}
              </option>
            </select>
          </div>
          <div class="ve-figma-field" title="Height">
            <span class="ve-figma-icon">H</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="parsedHeight.num"
              @input="
                $emit(
                  'block-height',
                  buildSizeVal($event.target.value, parsedHeight.unit),
                )
              "
              @mousedown.stop
              placeholder="auto"
            />
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-unit-select"
            title="Height unit"
          >
            <select
              class="ve-figma-select"
              :value="parsedHeight.unit"
              @change="
                $emit(
                  'block-height',
                  buildSizeVal(parsedHeight.num, $event.target.value),
                )
              "
              @mousedown.stop
            >
              <option v-for="u in sizeUnits" :key="u" :value="u">
                {{ u }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- HR-specific: width & height -->
      <template v-if="popover.isHR">
        <div class="ve-spacing-section">
          <div class="ve-spacing-label">Size</div>
          <div class="ve-spacing-hr-size">
            <div class="ve-spacing-hr-field">
              <label class="ve-spacing-hr-lbl">W</label>
              <input
                class="ve-spacing-input ve-spacing-input-wide"
                type="text"
                :value="popover.hrWidth"
                @change="$emit('hr-size', $event, 'width')"
                @mousedown.stop
                title="Width (e.g. 100%, 200px)"
                placeholder="auto"
              />
            </div>
            <div class="ve-spacing-hr-field">
              <label class="ve-spacing-hr-lbl">H</label>
              <input
                class="ve-spacing-input"
                type="number"
                min="1"
                :value="popover.hrHeight"
                @change="$emit('hr-size', $event, 'height')"
                @mousedown.stop
                title="Height in px"
                placeholder="1"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Padding (not for HR) -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Padding (px)</div>
        <div class="ve-figma-row">
          <div
            v-for="s in paddingFields"
            :key="s.prop"
            class="ve-figma-field"
            :title="s.title"
          >
            <span class="ve-figma-icon">{{ s.label }}</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover[s.prop]"
              @input="$emit('spacing-drag', $event, s.prop)"
              @mousedown.stop
              @change="$emit('spacing-change', $event, s.prop)"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Border -->
      <div class="ve-spacing-section">
        <div class="ve-spacing-label">Border</div>
        <div class="ve-figma-row">
          <div class="ve-figma-field" title="Border top width (px)">
            <span class="ve-figma-icon" style="font-size: 8px">T</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.bwT"
              @change="$emit('border-change', $event, 'bwT')"
              @input="$emit('border-change', $event, 'bwT')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border right width (px)">
            <span class="ve-figma-icon" style="font-size: 8px">R</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.bwR"
              @change="$emit('border-change', $event, 'bwR')"
              @input="$emit('border-change', $event, 'bwR')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border bottom width (px)">
            <span class="ve-figma-icon" style="font-size: 8px">B</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.bwB"
              @change="$emit('border-change', $event, 'bwB')"
              @input="$emit('border-change', $event, 'bwB')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border left width (px)">
            <span class="ve-figma-icon" style="font-size: 8px">L</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.bwL"
              @change="$emit('border-change', $event, 'bwL')"
              @input="$emit('border-change', $event, 'bwL')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div
            class="ve-figma-field ve-figma-field-select"
            title="Border style"
          >
            <select
              class="ve-figma-select"
              :value="popover.borderStyle"
              @change="$emit('border-style', $event)"
              @mousedown.stop
            >
              <option value="none">None</option>
              <option value="solid">━━━</option>
              <option value="dashed">╶ ╶ ╶</option>
              <option value="dotted">·····</option>
              <option value="double">═══</option>
              <option value="groove">▓░▓</option>
              <option value="ridge">░▓░</option>
              <option value="inset">▼ In</option>
              <option value="outset">▲ Out</option>
            </select>
          </div>
          <div class="ve-figma-field ve-figma-field-color" title="Border color">
            <div
              class="ve-figma-color-swatch"
              :style="{ backgroundColor: popover.borderColor }"
              @click="$refs.borderColorInput?.click()"
            ></div>
            <input
              ref="borderColorInput"
              type="color"
              class="ve-figma-color-hidden"
              :value="popover.borderColor"
              @input="$emit('border-color', $event)"
              @mousedown.stop
            />
          </div>
        </div>
        <div class="ve-spacing-label" style="margin-top: 4px">Radius</div>
        <div class="ve-figma-row">
          <div class="ve-figma-field" title="Border radius top-left (px)">
            <span class="ve-figma-icon" style="font-size: 8px">TL</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.borderTL"
              @change="$emit('border-change', $event, 'borderTL')"
              @input="$emit('border-change', $event, 'borderTL')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border radius top-right (px)">
            <span class="ve-figma-icon" style="font-size: 8px">TR</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.borderTR"
              @change="$emit('border-change', $event, 'borderTR')"
              @input="$emit('border-change', $event, 'borderTR')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border radius bottom-right (px)">
            <span class="ve-figma-icon" style="font-size: 8px">BR</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.borderBR"
              @change="$emit('border-change', $event, 'borderBR')"
              @input="$emit('border-change', $event, 'borderBR')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
          <div class="ve-figma-field" title="Border radius bottom-left (px)">
            <span class="ve-figma-icon" style="font-size: 8px">BL</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              :value="popover.borderBL"
              @change="$emit('border-change', $event, 'borderBL')"
              @input="$emit('border-change', $event, 'borderBL')"
              @mousedown.stop
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Background Image -->
      <div v-if="!popover.isHR" class="ve-spacing-section">
        <div class="ve-spacing-label">Background Image</div>
        <div class="ve-figma-row">
          <div
            class="ve-figma-field ve-figma-field-wide-full"
            title="Image URL"
          >
            <span class="ve-figma-icon" style="font-size: 8px">URL</span>
            <input
              class="ve-figma-input"
              type="text"
              :value="popover.bgImage"
              @change="$emit('bg-image', $event.target.value)"
              @mousedown.stop
              placeholder="https://..."
            />
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Background size"
          >
            <select
              class="ve-figma-select"
              :value="popover.bgSize"
              @change="$emit('bg-size', $event.target.value)"
              @mousedown.stop
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="auto">Auto</option>
              <option value="100% 100%">Stretch</option>
            </select>
          </div>
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Background position"
          >
            <select
              class="ve-figma-select"
              :value="popover.bgPosition"
              @change="$emit('bg-position', $event.target.value)"
              @mousedown.stop
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
            </select>
          </div>
        </div>
        <div class="ve-figma-row" style="margin-top: 4px">
          <div
            class="ve-figma-field ve-figma-field-select ve-figma-field-wide"
            title="Background repeat"
          >
            <select
              class="ve-figma-select"
              :value="popover.bgRepeat"
              @change="$emit('bg-repeat', $event.target.value)"
              @mousedown.stop
            >
              <option value="no-repeat">No Repeat</option>
              <option value="repeat">Repeat</option>
              <option value="repeat-x">Repeat X</option>
              <option value="repeat-y">Repeat Y</option>
            </select>
          </div>
          <div class="ve-figma-field" title="Opacity (0-1)">
            <span class="ve-figma-icon" style="font-size: 7px">Op</span>
            <input
              class="ve-figma-input"
              type="number"
              min="0"
              max="1"
              step="0.05"
              :value="popover.bgOpacity"
              @input="$emit('bg-opacity', $event.target.value)"
              @mousedown.stop
              placeholder="1"
            />
          </div>
        </div>
        <div
          v-if="popover.bgImage"
          class="ve-figma-row"
          style="margin-top: 4px"
        >
          <button
            class="ve-spacing-reset-btn"
            style="width: 100%; font-size: 10px; padding: 3px 6px"
            @click="$emit('bg-remove')"
          >
            Remove Background
          </button>
        </div>
      </div>

      <!-- Margin -->
      <div class="ve-spacing-section">
        <div class="ve-spacing-label">Margin (px)</div>
        <div class="ve-figma-row">
          <div
            v-for="s in marginFields"
            :key="s.prop"
            class="ve-figma-field"
            :title="s.title"
          >
            <span class="ve-figma-icon">{{ s.label }}</span>
            <input
              class="ve-figma-input"
              type="number"
              :value="popover[s.prop]"
              @input="$emit('spacing-drag', $event, s.prop)"
              @mousedown.stop
              @change="$emit('spacing-change', $event, s.prop)"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div class="ve-spacing-actions">
        <button class="ve-spacing-reset-btn" @click="$emit('reset')">
          Reset All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, markRaw } from "vue";
import {
  IconInsertAbove,
  IconInsertBelow,
  IconInsertInside,
  IconTrash,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
  IconAlignTop,
  IconAlignMiddle,
  IconAlignBottom,
  IconGap,
  IconGridColumns,
} from "../../assets/icons";

const props = defineProps({
  popover: { type: Object, required: true },
  dark: { type: Boolean, default: false },
});

defineEmits([
  "insert-above",
  "insert-below",
  "insert-inside",
  "delete-block",
  "text-align",
  "vertical-align",
  "display-change",
  "position-change",
  "layout-prop",
  "gap-change",
  "grid-columns",
  "hr-size",
  "block-width",
  "block-height",
  "spacing-change",
  "spacing-drag",
  "border-change",
  "border-style",
  "border-color",
  "bg-image",
  "bg-size",
  "bg-position",
  "bg-repeat",
  "bg-opacity",
  "bg-remove",
  "reset",
]);

const isFlex = computed(
  () =>
    props.popover.display === "flex" || props.popover.display === "inline-flex",
);
const isGrid = computed(
  () =>
    props.popover.display === "grid" || props.popover.display === "inline-grid",
);

const sizeUnits = ["px", "%", "vh", "vw", "em", "rem"];

function parseSizeValue(val) {
  if (!val || val === "auto") return { num: "", unit: "px" };
  const match = String(val).match(/^([\d.]+)\s*(px|%|vh|vw|em|rem)?$/);
  if (match) return { num: match[1], unit: match[2] || "px" };
  return { num: "", unit: "px" };
}

function buildSizeVal(num, unit) {
  const n = String(num).trim();
  if (!n || n === "0") return "";
  return n + (unit || "px");
}

const parsedWidth = computed(() => parseSizeValue(props.popover.blockWidth));
const parsedHeight = computed(() => parseSizeValue(props.popover.blockHeight));

const alignOptions = [
  { value: "left", title: "Align left", icon: markRaw(IconAlignLeft) },
  { value: "center", title: "Align center", icon: markRaw(IconAlignCenter) },
  { value: "right", title: "Align right", icon: markRaw(IconAlignRight) },
  { value: "justify", title: "Justify", icon: markRaw(IconAlignJustify) },
];

const verticalAlignOptions = [
  { value: "top", title: "Align top", icon: markRaw(IconAlignTop) },
  { value: "middle", title: "Align middle", icon: markRaw(IconAlignMiddle) },
  { value: "bottom", title: "Align bottom", icon: markRaw(IconAlignBottom) },
];

const paddingFields = [
  { prop: "pt", label: "T", title: "Padding top" },
  { prop: "pr", label: "R", title: "Padding right" },
  { prop: "pb", label: "B", title: "Padding bottom" },
  { prop: "pl", label: "L", title: "Padding left" },
];

const marginFields = [
  { prop: "mt", label: "T", title: "Margin top" },
  { prop: "mr", label: "R", title: "Margin right" },
  { prop: "mb", label: "B", title: "Margin bottom" },
  { prop: "ml", label: "L", title: "Margin left" },
];
</script>
