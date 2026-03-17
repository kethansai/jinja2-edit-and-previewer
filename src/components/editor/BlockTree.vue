<template>
  <div class="ve-block-tree" :class="{ dark }">
    <div class="ve-block-tree-header">
      <span class="ve-block-tree-title">Layers</span>
      <div class="ve-block-tree-header-actions">
        <span v-if="selectedEls.size > 1" class="ve-tree-selection-badge">
          {{ selectedEls.size }}
        </span>
        <button
          v-if="selectedEls.size > 0"
          class="ve-block-tree-btn ve-block-tree-btn-danger"
          :title="
            selectedEls.size > 1
              ? `Delete ${selectedEls.size} blocks`
              : 'Delete block'
          "
          @click="deleteSelected"
        >
          🗑
        </button>
        <button
          v-if="selectedEls.size > 1"
          class="ve-block-tree-btn"
          title="Group selected into a wrapper div"
          @click="groupSelected"
        >
          ⊞
        </button>
        <button
          class="ve-block-tree-btn"
          title="Select all blocks"
          @click="selectAll"
        >
          ☰
        </button>
        <button
          class="ve-block-tree-btn"
          title="Refresh tree"
          @click="$emit('refresh')"
        >
          ↻
        </button>
      </div>
    </div>
    <div class="ve-block-tree-body" @click.self="clearSelection">
      <div v-if="!treeNodes.length" class="ve-block-tree-empty">No blocks</div>
      <BlockTreeNode
        v-for="(node, i) in treeNodes"
        :key="i"
        :node="node"
        :depth="0"
        :selected-els="selectedEls"
        @select="onNodeSelect"
        @delete="onNodeDelete"
        @add-block="onAddBlock"
        @drag-drop="onDragDrop"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, reactive } from "vue";
import BlockTreeNode from "./BlockTreeNode.vue";

const props = defineProps({
  editorEl: { type: Object, default: null },
  contentVersion: { type: Number, default: 0 },
  selectedEl: { type: Object, default: null },
  dark: { type: Boolean, default: false },
});

const emit = defineEmits([
  "select-block",
  "delete-blocks",
  "move-blocks",
  "group-blocks",
  "add-block",
  "refresh",
]);

const treeNodes = ref([]);
const selectedEls = ref(new Set());

// Keep the "primary" selection in sync with VisualEditor's spacingPopover.el
watch(
  () => props.selectedEl,
  (el) => {
    if (el && !selectedEls.value.has(el)) {
      // External single-select from the editor — reset multi-select
      selectedEls.value = new Set([el]);
    }
  },
);

const BLOCK_TAGS = new Set([
  "P",
  "DIV",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BLOCKQUOTE",
  "PRE",
  "UL",
  "OL",
  "LI",
  "TABLE",
  "THEAD",
  "TBODY",
  "TFOOT",
  "TR",
  "TD",
  "TH",
  "SECTION",
  "ARTICLE",
  "HEADER",
  "FOOTER",
  "HR",
  "IMG",
  "A",
  "SPAN",
  "FIGURE",
  "FIGCAPTION",
  "NAV",
  "MAIN",
  "ASIDE",
]);

function buildTree(container) {
  if (!container) return [];
  const nodes = [];
  for (const child of container.children) {
    if (
      child.classList.contains("ve-img-resize-wrap") ||
      child.classList.contains("ve-img-handle") ||
      child.classList.contains("ve-block-toolbar")
    )
      continue;

    const tag = child.tagName;
    const node = {
      tag,
      el: child,
      label: getNodeLabel(child),
      children: [],
    };

    if (child.children.length > 0 && tag !== "IMG" && tag !== "HR") {
      node.children = buildTree(child);
    }

    if (BLOCK_TAGS.has(tag) || node.children.length > 0) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Flatten tree to get ordered list of all element refs
function flattenTree(nodes) {
  const result = [];
  for (const n of nodes) {
    result.push(n.el);
    if (n.children.length) {
      result.push(...flattenTree(n.children));
    }
  }
  return result;
}

function getNodeLabel(el) {
  const tag = el.tagName.toLowerCase();
  if (el.tagName === "IMG") {
    const alt = el.getAttribute("alt");
    if (alt) return `img — ${truncate(alt, 16)}`;
    const src = el.getAttribute("src") || "";
    const filename = src.split("/").pop().split("?")[0];
    if (filename) return `img — ${truncate(filename, 16)}`;
    return "img";
  }
  if (el.tagName === "HR") return "hr";
  if (el.tagName === "A") {
    const text = el.textContent.trim();
    return `a — ${truncate(text || el.href || "", 16)}`;
  }
  const text = getDirectText(el).trim();
  if (text) return `${tag} — ${truncate(text, 20)}`;
  if (el.id) return `${tag}#${el.id}`;
  const cls = el.className
    .toString()
    .replace(/ve-block-selected|ve-block-child/g, "")
    .trim();
  if (cls) return `${tag}.${cls.split(/\s+/)[0]}`;
  return tag;
}

function getDirectText(el) {
  let text = "";
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  }
  return text;
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
}

function refresh() {
  if (!props.editorEl) {
    treeNodes.value = [];
    return;
  }
  treeNodes.value = buildTree(props.editorEl);
  // Prune selectedEls that are no longer in the tree
  if (selectedEls.value.size) {
    const allEls = new Set(flattenTree(treeNodes.value));
    for (const el of selectedEls.value) {
      if (!allEls.has(el)) selectedEls.value.delete(el);
    }
  }
}

// --- Selection ---
function onNodeSelect(el, event) {
  if (!el) return;
  const ctrl = event?.ctrlKey || event?.metaKey;
  const shift = event?.shiftKey;

  if (ctrl) {
    // Toggle individual selection
    const newSet = new Set(selectedEls.value);
    if (newSet.has(el)) {
      newSet.delete(el);
    } else {
      newSet.add(el);
    }
    selectedEls.value = newSet;
    // Emit the last-clicked as primary
    emit("select-block", el);
  } else if (shift && selectedEls.value.size > 0) {
    // Range selection
    const allEls = flattenTree(treeNodes.value);
    const lastSelected = [...selectedEls.value].pop();
    const startIdx = allEls.indexOf(lastSelected);
    const endIdx = allEls.indexOf(el);
    if (startIdx !== -1 && endIdx !== -1) {
      const low = Math.min(startIdx, endIdx);
      const high = Math.max(startIdx, endIdx);
      const newSet = new Set(selectedEls.value);
      for (let i = low; i <= high; i++) {
        newSet.add(allEls[i]);
      }
      selectedEls.value = newSet;
    }
    emit("select-block", el);
  } else {
    // Simple click — single select
    selectedEls.value = new Set([el]);
    emit("select-block", el);
  }
}

function clearSelection() {
  selectedEls.value = new Set();
}

function selectAll() {
  const allEls = flattenTree(treeNodes.value);
  selectedEls.value = new Set(allEls);
}

// --- Delete ---
function onNodeDelete(el) {
  emit("delete-blocks", [el]);
}

function deleteSelected() {
  if (selectedEls.value.size === 0) return;
  emit("delete-blocks", [...selectedEls.value]);
  selectedEls.value = new Set();
}

// --- Add Block ---
function onAddBlock(el) {
  emit("add-block", el);
}

// --- Drag & Drop ---
function onDragDrop(payload) {
  emit("move-blocks", payload);
}

// --- Group ---
function groupSelected() {
  if (selectedEls.value.size < 2) return;
  emit("group-blocks", [...selectedEls.value]);
  selectedEls.value = new Set();
}

watch(
  () => props.contentVersion,
  () => {
    nextTick(refresh);
  },
  { immediate: true },
);

watch(
  () => props.editorEl,
  () => {
    nextTick(refresh);
  },
);

defineExpose({ refresh });
</script>
