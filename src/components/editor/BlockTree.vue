<template>
  <div class="ve-block-tree" :class="{ dark }">
    <div class="ve-block-tree-header">
      <span class="ve-block-tree-title">Layers</span>
      <button
        class="ve-block-tree-refresh"
        title="Refresh tree"
        @click="$emit('refresh')"
      >
        ↻
      </button>
    </div>
    <div class="ve-block-tree-body">
      <div v-if="!treeNodes.length" class="ve-block-tree-empty">No blocks</div>
      <BlockTreeNode
        v-for="(node, i) in treeNodes"
        :key="i"
        :node="node"
        :depth="0"
        :selected-el="selectedEl"
        @select="(el) => $emit('select-block', el)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import BlockTreeNode from "./BlockTreeNode.vue";

const props = defineProps({
  editorEl: { type: Object, default: null },
  contentVersion: { type: Number, default: 0 },
  selectedEl: { type: Object, default: null },
  dark: { type: Boolean, default: false },
});

defineEmits(["select-block", "refresh"]);

const treeNodes = ref([]);

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
    // Skip editor-internal elements
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

    // Recursively build children for container-like elements
    if (child.children.length > 0 && tag !== "IMG" && tag !== "HR") {
      node.children = buildTree(child);
    }

    // Only include block-level tags or elements with block children
    if (BLOCK_TAGS.has(tag) || node.children.length > 0) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getNodeLabel(el) {
  const tag = el.tagName.toLowerCase();

  // For images, show a short label
  if (el.tagName === "IMG") {
    const alt = el.getAttribute("alt");
    if (alt) return `img — ${truncate(alt, 16)}`;
    const src = el.getAttribute("src") || "";
    const filename = src.split("/").pop().split("?")[0];
    if (filename) return `img — ${truncate(filename, 16)}`;
    return "img";
  }

  // For HRs
  if (el.tagName === "HR") return "hr";

  // For links
  if (el.tagName === "A") {
    const text = el.textContent.trim();
    return `a — ${truncate(text || el.href || "", 16)}`;
  }

  // For other elements, show tag + short text preview
  const text = getDirectText(el).trim();
  if (text) return `${tag} — ${truncate(text, 20)}`;

  // If has an id or class, show that
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
}

watch(
  () => props.contentVersion,
  () => {
    nextTick(refresh);
  },
);

watch(
  () => props.editorEl,
  () => {
    nextTick(refresh);
  },
);

defineExpose({ refresh });
</script>
