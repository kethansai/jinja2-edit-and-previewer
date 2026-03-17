<template>
  <div class="ve-tree-node">
    <div
      class="ve-tree-node-row"
      :class="{
        selected: selectedEls.has(node.el),
        'multi-selected': selectedEls.has(node.el) && selectedEls.size > 1,
        'has-children': node.children.length > 0,
        'drag-over-before': dragState === 'before',
        'drag-over-after': dragState === 'after',
        'drag-over-inside': dragState === 'inside',
      }"
      :style="{ paddingLeft: depth * 14 + 6 + 'px' }"
      :draggable="true"
      @click.stop="handleClick"
      @dragstart.stop="onDragStart"
      @dragover.stop.prevent="onDragOver"
      @dragleave.stop="onDragLeave"
      @drop.stop.prevent="onDrop"
      @dragend.stop="onDragEnd"
    >
      <span class="ve-tree-drag-grip" title="Drag to reorder">⠿</span>
      <button
        v-if="node.children.length > 0"
        class="ve-tree-toggle"
        @click.stop="expanded = !expanded"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          :style="{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }"
        >
          <path
            d="M3 1 L7 5 L3 9"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span v-else class="ve-tree-toggle-spacer"></span>
      <span class="ve-tree-tag">{{ tagDisplay }}</span>
      <span v-if="labelText" class="ve-tree-label">{{ labelText }}</span>
      <button
        class="ve-tree-add-btn"
        title="Add block below"
        @click.stop="$emit('add-block', node.el)"
        @mousedown.stop
      >
        +
      </button>
      <button
        class="ve-tree-delete-btn"
        title="Delete block"
        @click.stop="$emit('delete', node.el)"
        @mousedown.stop
      >
        ×
      </button>
    </div>
    <div v-if="expanded && node.children.length > 0" class="ve-tree-children">
      <BlockTreeNode
        v-for="(child, i) in node.children"
        :key="i"
        :node="child"
        :depth="depth + 1"
        :selected-els="selectedEls"
        @select="(el, e) => $emit('select', el, e)"
        @delete="(el) => $emit('delete', el)"
        @add-block="(el) => $emit('add-block', el)"
        @drag-drop="(payload) => $emit('drag-drop', payload)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  selectedEls: { type: Set, default: () => new Set() },
});

const emit = defineEmits(["select", "delete", "add-block", "drag-drop"]);

const expanded = ref(true);
const dragState = ref(null); // 'before' | 'after' | 'inside' | null

const tagDisplay = computed(() => {
  const raw = props.node.label || props.node.tag.toLowerCase();
  const dashIdx = raw.indexOf(" — ");
  return dashIdx > -1 ? raw.slice(0, dashIdx) : raw;
});

const labelText = computed(() => {
  const raw = props.node.label || "";
  const dashIdx = raw.indexOf(" — ");
  return dashIdx > -1 ? raw.slice(dashIdx + 3) : "";
});

function handleClick(e) {
  emit("select", props.node.el, e);
}

function onDragStart(e) {
  // Store the dragged element reference via a global (dataTransfer can't hold DOM refs)
  window.__veTreeDragEl = props.node.el;
  window.__veTreeDragSelected = props.selectedEls.has(props.node.el)
    ? new Set(props.selectedEls)
    : new Set([props.node.el]);
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", "tree-drag");
}

function onDragOver(e) {
  if (!window.__veTreeDragEl) return;
  // Don't allow dropping onto self
  if (window.__veTreeDragSelected?.has(props.node.el)) {
    dragState.value = null;
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const h = rect.height;
  if (y < h * 0.25) {
    dragState.value = "before";
  } else if (y > h * 0.75) {
    dragState.value = "after";
  } else {
    dragState.value = "inside";
  }
}

function onDragLeave() {
  dragState.value = null;
}

function onDrop() {
  if (!window.__veTreeDragEl || !dragState.value) return;
  if (window.__veTreeDragSelected?.has(props.node.el)) return;
  emit("drag-drop", {
    draggedEls: [...(window.__veTreeDragSelected || [window.__veTreeDragEl])],
    targetEl: props.node.el,
    position: dragState.value,
  });
  dragState.value = null;
  window.__veTreeDragEl = null;
  window.__veTreeDragSelected = null;
}

function onDragEnd() {
  dragState.value = null;
  window.__veTreeDragEl = null;
  window.__veTreeDragSelected = null;
}
</script>
