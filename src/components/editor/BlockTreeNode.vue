<template>
  <div class="ve-tree-node">
    <div
      class="ve-tree-node-row"
      :class="{
        selected: node.el === selectedEl,
        'has-children': node.children.length > 0,
      }"
      :style="{ paddingLeft: depth * 14 + 6 + 'px' }"
      @click.stop="handleClick"
    >
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
    </div>
    <div v-if="expanded && node.children.length > 0" class="ve-tree-children">
      <BlockTreeNode
        v-for="(child, i) in node.children"
        :key="i"
        :node="child"
        :depth="depth + 1"
        :selected-el="selectedEl"
        @select="(el) => $emit('select', el)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  selectedEl: { type: Object, default: null },
});

const emit = defineEmits(["select"]);

const expanded = ref(true);

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

function handleClick() {
  emit("select", props.node.el);
}
</script>
