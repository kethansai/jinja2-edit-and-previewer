<template>
  <div class="visual-editor" :class="{ dark }">
    <!-- Toolbar -->
    <EditorToolbar
      :active-formats="activeFormats"
      :current-font-size="currentFontSize"
      :current-font-family="currentFontFamily"
      :fg-color="currentFgColor"
      :bg-color="currentBgColor"
      :block-bg-color="currentBlockBgColor"
      :spacing-active="spacingPopover.visible"
      @exec-cmd="execCmd"
      @block-format="onBlockFormatValue"
      @font-family="onFontFamilyValue"
      @font-size="onFontSizeValue"
      @fg-color="handleFgColor"
      @bg-color="handleBgColor"
      @block-bg-color="handleBlockBgColor"
      @toggle-spacing="toggleSpacingPopover"
      @insert-link="insertLink"
      @insert-image="insertImage"
      @insert-hr="execCmd('insertHorizontalRule')"
      @insert-table="insertTable"
    />

    <!-- Editor body: tree + content + sidebar -->
    <div class="ve-editor-body">
      <!-- Block Tree Panel (left) -->
      <BlockTree
        v-if="treeVisible"
        ref="blockTreeRef"
        :editor-el="editableRef"
        :content-version="contentVersion"
        :selected-el="spacingPopover.el"
        :dark="dark"
        @select-block="onTreeSelectBlock"
        @refresh="refreshTree"
      />

      <!-- Editable area -->
      <div
        ref="editableRef"
        class="ve-content"
        contenteditable="true"
        spellcheck="false"
        @input="onInput"
        @keyup="onKeyUp"
        @keydown="onKeyDown"
        @mouseup="handleMouseUp"
        @paste="onPaste"
        @click="handleContentClick"
        @scroll="handleContentScroll"
      ></div>

      <!-- Image edit icon (appears on image click, before full editing) -->
      <button
        v-if="imgEditIcon.visible"
        class="ve-img-edit-icon"
        :style="{ top: imgEditIcon.top + 'px', left: imgEditIcon.left + 'px' }"
        title="Edit image"
        @mousedown.stop.prevent="activateImageEdit"
      >
        <IconPencil :size="14" />
      </button>

      <!-- Block action toolbar (appears on selected block) -->
      <div
        ref="dragHandleRef"
        class="ve-block-toolbar"
        :class="{ visible: dragHandle.visible }"
        :style="{ top: dragHandle.top + 'px', left: dragHandle.left + 'px' }"
      >
        <button
          class="ve-block-toolbar-btn"
          title="Insert block above"
          @mousedown.stop.prevent="insertBlockAboveFromToolbar"
        >
          <IconInsertAbove :size="11" />
        </button>
        <button
          class="ve-block-toolbar-btn"
          title="Insert block below"
          @mousedown.stop.prevent="insertBlockBelowFromToolbar"
        >
          <IconInsertBelow :size="11" />
        </button>
        <button
          v-if="spacingPopover.el && spacingPopover.el.tagName !== 'HR'"
          class="ve-block-toolbar-btn"
          title="Insert child block inside"
          @mousedown.stop.prevent="insertBlockInsideFromToolbar"
        >
          <IconInsertInside :size="11" />
        </button>
        <button
          class="ve-block-toolbar-btn"
          title="Wrap with parent block"
          @mousedown.stop.prevent="insertBlockAtParentFromToolbar"
        >
          <IconInsertParent :size="11" />
        </button>
        <button
          class="ve-block-toolbar-btn ve-block-toolbar-drag"
          title="Drag to reorder"
          @mousedown.stop.prevent="startBlockDragFromHandle"
        >
          <IconDragHandle :size="11" />
        </button>
        <button
          class="ve-block-toolbar-btn ve-block-toolbar-btn-danger"
          title="Delete block"
          @mousedown.stop.prevent="deleteSelectedBlock"
        >
          <IconTrash :size="11" />
        </button>
      </div>

      <!-- Block Spacing Sidebar -->
      <BlockPopover
        :popover="spacingPopover"
        :dark="dark"
        @insert-above="insertBlockAbove"
        @insert-below="insertBlockBelow"
        @insert-inside="insertBlockInside"
        @delete-block="deleteSelectedBlock"
        @text-align="onTextAlignChange"
        @vertical-align="onVerticalAlignChange"
        @display-change="onDisplayChange"
        @position-change="onPositionChange"
        @layout-prop="onLayoutPropChange"
        @gap-change="onGapChange"
        @grid-columns="onGridColumnsChange"
        @hr-size="onHRSizeChange"
        @spacing-change="onSpacingChange"
        @spacing-drag="onSpacingDrag"
        @border-change="onBorderChange"
        @border-style="onBorderStyleChange"
        @border-color="onBorderColorChange"
        @block-width="onBlockWidthChange"
        @block-height="onBlockHeightChange"
        @bg-image="onBgImageChange"
        @bg-size="onBgSizeChange"
        @bg-position="onBgPositionChange"
        @bg-repeat="onBgRepeatChange"
        @bg-opacity="onBgOpacityChange"
        @bg-remove="onBgRemove"
        @reset="resetSpacing"
      />
    </div>

    <!-- Floating Selection Popover -->
    <SelectionPopover
      :popover="selPopover"
      :active-formats="activeFormats"
      :current-font-size="currentFontSize"
      :dark="dark"
      @cmd="popoverCmd"
      @insert-link="popoverInsertLink"
      @font-size-up="popoverFontSizeUp"
      @font-size-down="popoverFontSizeDown"
      @highlight="popoverHighlight"
    />

    <!-- Link Tooltip -->
    <LinkTooltip
      :tooltip="linkTooltip"
      :dark="dark"
      @edit="editLinkFromTooltip"
      @remove="removeLinkFromTooltip"
    />

    <!-- Image Popover -->
    <ImagePopover
      :popover="imgPopover"
      :dark="dark"
      @resize="imgResize"
      @set-width="imgSetExactWidth"
      @set-height="imgSetExactHeight"
      @set-width-pct="imgSetWidth"
      @set-align="imgSetAlign"
      @replace="imgReplace"
      @delete="imgDelete"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick, reactive } from "vue";
import { openModal } from "../composables/useModal";
import {
  EditorToolbar,
  BlockPopover,
  SelectionPopover,
  LinkTooltip,
  ImagePopover,
  BlockTree,
} from "./editor";
import {
  IconDragHandle,
  IconInsertAbove,
  IconInsertBelow,
  IconInsertInside,
  IconInsertParent,
  IconTrash,
  IconPencil,
} from "../assets/icons";

const props = defineProps({
  modelValue: { type: String, default: "" },
  dark: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const editableRef = ref(null);
const dragHandleRef = ref(null);
const blockTreeRef = ref(null);
const contentVersion = ref(0);
const treeVisible = ref(true);
const currentFgColor = ref("#000000");
const currentBgColor = ref("#ffff00");
const currentBlockBgColor = ref("#ffffff");
const currentFontSize = ref("");
const currentFontFamily = ref("");
const isInternalUpdate = ref(false);

// Custom undo/redo stack for operations that bypass execCommand (e.g., image resize)
const undoStack = ref([]);
const redoStack = ref([]);
const MAX_UNDO = 100;

// Block spacing popover state
const spacingPopover = reactive({
  visible: false,
  pt: 0,
  pr: 0,
  pb: 0,
  pl: 0,
  mt: 0,
  mr: 0,
  mb: 0,
  ml: 0,
  el: null, // the specific block element being edited
  isHR: false,
  hrWidth: "",
  hrHeight: 1,
  // Border properties
  bwT: 0,
  bwR: 0,
  bwB: 0,
  bwL: 0,
  borderStyle: "none",
  borderColor: "#000000",
  borderTL: 0,
  borderTR: 0,
  borderBR: 0,
  borderBL: 0,
  // Text alignment
  textAlign: "left",
  verticalAlign: "",
  // Display & layout
  display: "",
  position: "",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexWrap: "nowrap",
  gap: 0,
  gridTemplateColumns: "",
  // Block size
  blockWidth: "",
  blockHeight: "",
  // Background image
  bgImage: "",
  bgSize: "cover",
  bgPosition: "center",
  bgRepeat: "no-repeat",
  bgOpacity: 1,
});

// Hover drag handle state
const dragHandle = reactive({
  visible: false,
  top: 0,
  left: 0,
  el: null, // currently hovered block
});

// Floating selection popover state
const selPopover = reactive({
  visible: false,
  top: 0,
  left: 0,
});

// Link tooltip state
const linkTooltip = reactive({
  visible: false,
  url: "",
  top: 0,
  left: 0,
  anchor: null,
});

// Image edit icon state (shown on image click before entering full edit)
const imgEditIcon = reactive({
  visible: false,
  top: 0,
  left: 0,
  el: null, // the image element
});

// Image popover state
const imgPopover = reactive({
  visible: false,
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  widthPct: 0,
  align: "",
  lockRatio: false,
  el: null,
});

const activeFormats = reactive({
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
});

// Sync external model → contenteditable
watch(
  () => props.modelValue,
  (val) => {
    if (isInternalUpdate.value) return;
    if (editableRef.value && val !== editableRef.value.innerHTML) {
      editableRef.value.innerHTML = val || "";
    }
  },
);

onMounted(() => {
  if (editableRef.value) {
    editableRef.value.innerHTML = props.modelValue || "";
  }
  // Initial tree build after DOM is ready
  nextTick(() => {
    contentVersion.value++;
  });
});

function execCmd(cmd, value = null) {
  if (cmd === "undo") {
    if (undoStack.value.length > 0) {
      customUndo();
    } else {
      document.execCommand("undo", false, null);
    }
    editableRef.value?.focus();
    emitContent();
    updateActiveFormats();
    return;
  }
  if (cmd === "redo") {
    if (redoStack.value.length > 0) {
      customRedo();
    } else {
      document.execCommand("redo", false, null);
    }
    editableRef.value?.focus();
    emitContent();
    updateActiveFormats();
    return;
  }
  document.execCommand(cmd, false, value);
  editableRef.value?.focus();
  emitContent();
  updateActiveFormats();
}

function onBlockFormat(e) {
  const tag = e.target.value;
  if (tag) {
    document.execCommand("formatBlock", false, `<${tag}>`);
  } else {
    document.execCommand("formatBlock", false, "<div>");
  }
  e.target.value = "";
  editableRef.value?.focus();
  emitContent();
}

// Wrapper: toolbar emits the value directly (not the DOM event)
function onBlockFormatValue(tag) {
  if (tag) {
    document.execCommand("formatBlock", false, `<${tag}>`);
  } else {
    document.execCommand("formatBlock", false, "<div>");
  }
  editableRef.value?.focus();
  emitContent();
}

function onFontFamilyValue(family) {
  if (!family) return;
  document.execCommand("fontName", false, family);
  editableRef.value?.focus();
  emitContent();
}

function onFontSize(e) {
  const size = e.target.value;
  if (size) {
    // Use fontSize command with a placeholder value, then replace with exact pt size
    document.execCommand("fontSize", false, "7");
    const fontElements = editableRef.value?.querySelectorAll('font[size="7"]');
    if (fontElements) {
      fontElements.forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = size + "pt";
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
    }
  }
  currentFontSize.value = size || "";
  editableRef.value?.focus();
  emitContent();
}

// Wrapper: toolbar emits the size value directly (not the DOM event)
function onFontSizeValue(size) {
  if (size) {
    document.execCommand("fontSize", false, "7");
    const fontElements = editableRef.value?.querySelectorAll('font[size="7"]');
    if (fontElements) {
      fontElements.forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = size + "pt";
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
    }
  }
  currentFontSize.value = size || "";
  editableRef.value?.focus();
  emitContent();
}

// Handlers for toolbar color events (toolbar emits color value)
function handleFgColor(color) {
  currentFgColor.value = color;
  applyFgColor();
}

function handleBgColor(color) {
  currentBgColor.value = color;
  applyBgColor();
}

function handleBlockBgColor(color) {
  currentBlockBgColor.value = color;
  applyBlockBgColor();
}

function applyFgColor() {
  document.execCommand("foreColor", false, currentFgColor.value);
  editableRef.value?.focus();
  emitContent();
}

function applyBgColor() {
  document.execCommand("hiliteColor", false, currentBgColor.value);
  editableRef.value?.focus();
  emitContent();
}

// --- Block background color ---
function getBlockElement() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node = sel.anchorNode;
  if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  // Walk up to find the block-level element inside our editor
  const blockTags = [
    "TD",
    "TH",
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
    "LI",
    "UL",
    "OL",
    "TABLE",
    "SECTION",
    "ARTICLE",
    "HEADER",
    "FOOTER",
  ];
  while (node && node !== editableRef.value) {
    if (blockTags.includes(node.tagName)) return node;
    node = node.parentElement;
  }
  return null;
}

function applyBlockBgColor() {
  const block = getBlockElement();
  if (block) {
    saveSnapshot();
    block.style.backgroundColor = currentBlockBgColor.value;
    emitContent();
  }
  editableRef.value?.focus();
}

// --- Block Spacing ---
function findBlockFromNode(node) {
  if (!node || node === editableRef.value) return null;
  // HR is a void element — if the click target IS the HR, return it directly
  if (node.tagName === "HR") return node;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  const blockTags = [
    "TD",
    "TH",
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
    "LI",
    "UL",
    "OL",
    "TABLE",
    "SECTION",
    "ARTICLE",
    "HEADER",
    "FOOTER",
    "HR",
  ];
  while (node && node !== editableRef.value) {
    if (blockTags.includes(node.tagName)) return node;
    node = node.parentElement;
  }
  return null;
}

function selectBlock(block) {
  // Deselect previous block
  deselectBlock();
  spacingPopover.el = block;
  spacingPopover.isHR = block.tagName === "HR";
  block.classList.add("ve-block-selected");
  // Highlight immediate child blocks (1 level down)
  highlightChildBlocks(block);
  detectBlockSpacing(block);
  spacingPopover.visible = true;
  // Show drag handle on the selected block
  dragHandle.el = block;
  positionDragHandle(block);
  dragHandle.visible = true;
}

function deselectBlock() {
  if (spacingPopover.el) {
    spacingPopover.el.classList.remove("ve-block-selected");
    clearChildBlockHighlights();
  }
  spacingPopover.el = null;
}

const childBlockTags = new Set([
  "TD",
  "TH",
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
  "LI",
  "UL",
  "OL",
  "TABLE",
  "SECTION",
  "ARTICLE",
  "HEADER",
  "FOOTER",
  "HR",
  "TR",
  "THEAD",
  "TBODY",
  "TFOOT",
]);

function highlightChildBlocks(block) {
  for (const child of block.children) {
    if (childBlockTags.has(child.tagName)) {
      child.classList.add("ve-block-child");
    }
  }
}

function clearChildBlockHighlights() {
  if (!editableRef.value) return;
  editableRef.value
    .querySelectorAll(".ve-block-child")
    .forEach((el) => el.classList.remove("ve-block-child"));
}

function hideSpacingPopover() {
  deselectBlock();
  spacingPopover.visible = false;
  dragHandle.visible = false;
  dragHandle.el = null;
}

// --- Block tree panel ---
function onTreeSelectBlock(el) {
  if (!el || !editableRef.value?.contains(el)) return;
  deselectImage();
  hideImgEditIcon();
  hideLinkTooltip();
  hideSelPopover();
  selectBlock(el);
  // Scroll the element into view in the editor
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function refreshTree() {
  contentVersion.value++;
}

function toggleSpacingPopover() {
  if (spacingPopover.visible) {
    hideSpacingPopover();
    return;
  }
  const block = getBlockElement();
  if (!block) return;
  selectBlock(block);
}

function detectBlockSpacing(block) {
  if (!block) block = spacingPopover.el;
  if (!block) return;
  const cs = window.getComputedStyle(block);
  spacingPopover.pt = parseInt(cs.paddingTop) || 0;
  spacingPopover.pr = parseInt(cs.paddingRight) || 0;
  spacingPopover.pb = parseInt(cs.paddingBottom) || 0;
  spacingPopover.pl = parseInt(cs.paddingLeft) || 0;
  spacingPopover.mt = parseInt(cs.marginTop) || 0;
  spacingPopover.mr = parseInt(cs.marginRight) || 0;
  spacingPopover.mb = parseInt(cs.marginBottom) || 0;
  spacingPopover.ml = parseInt(cs.marginLeft) || 0;
  // Border properties
  spacingPopover.bwT = parseInt(cs.borderTopWidth) || 0;
  spacingPopover.bwR = parseInt(cs.borderRightWidth) || 0;
  spacingPopover.bwB = parseInt(cs.borderBottomWidth) || 0;
  spacingPopover.bwL = parseInt(cs.borderLeftWidth) || 0;
  spacingPopover.borderStyle = cs.borderTopStyle || "none";
  spacingPopover.borderColor = rgbToHex(cs.borderTopColor) || "#000000";
  spacingPopover.borderTL = parseInt(cs.borderTopLeftRadius) || 0;
  spacingPopover.borderTR = parseInt(cs.borderTopRightRadius) || 0;
  spacingPopover.borderBR = parseInt(cs.borderBottomRightRadius) || 0;
  spacingPopover.borderBL = parseInt(cs.borderBottomLeftRadius) || 0;
  // Text alignment
  spacingPopover.textAlign = cs.textAlign || "left";
  // Normalize "start" to "left" and "end" to "right"
  if (spacingPopover.textAlign === "start") spacingPopover.textAlign = "left";
  if (spacingPopover.textAlign === "end") spacingPopover.textAlign = "right";
  // Vertical alignment
  const tag = block.tagName;
  if (tag === "TD" || tag === "TH") {
    // Table cells use native vertical-align
    spacingPopover.verticalAlign =
      block.style.verticalAlign || cs.verticalAlign || "";
  } else {
    // For regular blocks, detect from flex justify-content if we set it for valign
    const va = block.getAttribute("data-valign");
    spacingPopover.verticalAlign = va || "";
  }
  // Display & layout
  spacingPopover.display = block.style.display || "";
  spacingPopover.position = block.style.position || "";
  const dv = spacingPopover.display;
  if (dv === "flex" || dv === "inline-flex") {
    spacingPopover.flexDirection = block.style.flexDirection || "row";
    spacingPopover.justifyContent = block.style.justifyContent || "flex-start";
    spacingPopover.alignItems = block.style.alignItems || "stretch";
    spacingPopover.flexWrap = block.style.flexWrap || "nowrap";
    spacingPopover.gap = parseInt(cs.gap) || 0;
  } else if (dv === "grid" || dv === "inline-grid") {
    spacingPopover.gridTemplateColumns = block.style.gridTemplateColumns || "";
    spacingPopover.gap = parseInt(cs.gap) || 0;
  } else {
    spacingPopover.flexDirection = "row";
    spacingPopover.justifyContent = "flex-start";
    spacingPopover.alignItems = "stretch";
    spacingPopover.flexWrap = "nowrap";
    spacingPopover.gap = 0;
    spacingPopover.gridTemplateColumns = "";
  }
  // Block size (not HR)
  if (block.tagName !== "HR") {
    spacingPopover.blockWidth = block.style.width || "";
    spacingPopover.blockHeight = block.style.height || "";
  }
  // HR-specific
  if (block.tagName === "HR") {
    spacingPopover.hrWidth = block.style.width || "";
    spacingPopover.hrHeight =
      parseInt(cs.height) || parseInt(cs.borderTopWidth) || 1;
  }
  // Background image (read from CSS custom properties)
  const bgVar = block.style.getPropertyValue("--bg-image") || "";
  if (bgVar) {
    const urlMatch = bgVar.match(/url\(["']?(.+?)["']?\)/);
    spacingPopover.bgImage = urlMatch ? urlMatch[1] : "";
  } else {
    spacingPopover.bgImage = "";
  }
  spacingPopover.bgSize = block.style.getPropertyValue("--bg-size") || "cover";
  spacingPopover.bgPosition =
    block.style.getPropertyValue("--bg-position") || "center";
  spacingPopover.bgRepeat =
    block.style.getPropertyValue("--bg-repeat") || "no-repeat";
  const opacityVar = block.style.getPropertyValue("--bg-opacity");
  spacingPopover.bgOpacity =
    opacityVar !== "" ? parseFloat(opacityVar) || 1 : 1;
}

function onSpacingChange(e, prop) {
  const val = Math.max(0, parseInt(e.target.value) || 0);
  applySpacingProp(prop, val);
}

function onSpacingDrag(e, prop) {
  const val = Math.max(0, parseInt(e.target.value) || 0);
  applySpacingProp(prop, val);
}

function applySpacingProp(prop, val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const map = {
    pt: "paddingTop",
    pr: "paddingRight",
    pb: "paddingBottom",
    pl: "paddingLeft",
    mt: "marginTop",
    mr: "marginRight",
    mb: "marginBottom",
    ml: "marginLeft",
  };
  block.style[map[prop]] = val + "px";
  spacingPopover[prop] = val;
  emitContent();
}

function resetSpacing() {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.padding = "";
  block.style.margin = "";
  block.style.border = "";
  block.style.borderTopWidth = "";
  block.style.borderRightWidth = "";
  block.style.borderBottomWidth = "";
  block.style.borderLeftWidth = "";
  block.style.borderRadius = "";
  block.style.borderTopLeftRadius = "";
  block.style.borderTopRightRadius = "";
  block.style.borderBottomRightRadius = "";
  block.style.borderBottomLeftRadius = "";
  block.style.textAlign = "";
  block.style.verticalAlign = "";
  block.removeAttribute("data-valign");
  block.style.display = "";
  block.style.position = "";
  block.style.flexDirection = "";
  block.style.justifyContent = "";
  block.style.alignItems = "";
  block.style.flexWrap = "";
  block.style.gap = "";
  block.style.gridTemplateColumns = "";
  block.style.width = "";
  block.style.height = "";
  block.style.removeProperty("--bg-image");
  block.style.removeProperty("--bg-size");
  block.style.removeProperty("--bg-position");
  block.style.removeProperty("--bg-repeat");
  block.style.removeProperty("--bg-opacity");
  block.classList.remove("ve-has-bg");
  detectBlockSpacing(block);
  emitContent();
}

// --- Background image handlers ---
function onBgImageChange(url) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  if (url && url.trim()) {
    block.style.setProperty("--bg-image", `url('${url.trim()}')`);
    block.classList.add("ve-has-bg");
  } else {
    block.style.removeProperty("--bg-image");
    block.classList.remove("ve-has-bg");
  }
  spacingPopover.bgImage = url ? url.trim() : "";
  emitContent();
}

function onBgSizeChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.setProperty("--bg-size", val);
  spacingPopover.bgSize = val;
  emitContent();
}

function onBgPositionChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.setProperty("--bg-position", val);
  spacingPopover.bgPosition = val;
  emitContent();
}

function onBgRepeatChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.setProperty("--bg-repeat", val);
  spacingPopover.bgRepeat = val;
  emitContent();
}

function onBgOpacityChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const opacity = Math.max(0, Math.min(1, parseFloat(val) || 1));
  block.style.setProperty("--bg-opacity", String(opacity));
  spacingPopover.bgOpacity = opacity;
  emitContent();
}

function onBgRemove() {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.removeProperty("--bg-image");
  block.style.removeProperty("--bg-size");
  block.style.removeProperty("--bg-position");
  block.style.removeProperty("--bg-repeat");
  block.style.removeProperty("--bg-opacity");
  block.classList.remove("ve-has-bg");
  spacingPopover.bgImage = "";
  spacingPopover.bgSize = "cover";
  spacingPopover.bgPosition = "center";
  spacingPopover.bgRepeat = "no-repeat";
  spacingPopover.bgOpacity = 1;
  emitContent();
}

function onTextAlignChange(align) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.textAlign = align;
  spacingPopover.textAlign = align;
  emitContent();
}

function onVerticalAlignChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const tag = block.tagName;
  if (tag === "TD" || tag === "TH") {
    // Table cells: use native vertical-align
    block.style.verticalAlign = val;
  } else {
    // Regular blocks: use flex to vertically align content
    const justifyMap = {
      top: "flex-start",
      middle: "center",
      bottom: "flex-end",
    };
    if (val && justifyMap[val]) {
      block.style.display = "flex";
      block.style.flexDirection = "column";
      block.style.justifyContent = justifyMap[val];
      block.setAttribute("data-valign", val);
    } else {
      // Clear vertical alignment flex
      block.removeAttribute("data-valign");
      block.style.display = "";
      block.style.flexDirection = "";
      block.style.justifyContent = "";
    }
  }
  spacingPopover.verticalAlign = val;
  emitContent();
}

function onDisplayChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.display = val;
  spacingPopover.display = val;
  // Reset flex/grid props when switching display mode
  if (val !== "flex" && val !== "inline-flex") {
    block.style.flexDirection = "";
    block.style.justifyContent = "";
    block.style.alignItems = "";
    block.style.flexWrap = "";
  }
  if (val !== "grid" && val !== "inline-grid") {
    block.style.gridTemplateColumns = "";
  }
  if (
    val !== "flex" &&
    val !== "inline-flex" &&
    val !== "grid" &&
    val !== "inline-grid"
  ) {
    block.style.gap = "";
  }
  detectBlockSpacing(block);
  emitContent();
}

function onPositionChange(val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.position = val;
  spacingPopover.position = val;
  emitContent();
}

function onLayoutPropChange(prop, val) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style[prop] = val;
  spacingPopover[prop] = val;
  emitContent();
}

function onGapChange(e) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const val = Math.max(0, parseInt(e.target.value) || 0);
  block.style.gap = val + "px";
  spacingPopover.gap = val;
  emitContent();
}

function onGridColumnsChange(e) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  block.style.gridTemplateColumns = e.target.value;
  spacingPopover.gridTemplateColumns = e.target.value;
  emitContent();
}

function onBorderChange(e, prop) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const val = Math.max(0, parseInt(e.target.value) || 0);
  const borderWidthMap = {
    bwT: "borderTopWidth",
    bwR: "borderRightWidth",
    bwB: "borderBottomWidth",
    bwL: "borderLeftWidth",
  };
  if (borderWidthMap[prop]) {
    // If setting width > 0 and style is none, default to solid
    // but first zero out all sides so they don't get browser default (3px)
    if (
      val > 0 &&
      (spacingPopover.borderStyle === "none" || !block.style.borderStyle)
    ) {
      block.style.borderStyle = "solid";
      spacingPopover.borderStyle = "solid";
      // Zero all sides first to prevent browser default medium (3px)
      block.style.borderTopWidth = "0px";
      block.style.borderRightWidth = "0px";
      block.style.borderBottomWidth = "0px";
      block.style.borderLeftWidth = "0px";
      spacingPopover.bwT = 0;
      spacingPopover.bwR = 0;
      spacingPopover.bwB = 0;
      spacingPopover.bwL = 0;
    }
    block.style[borderWidthMap[prop]] = val + "px";
    spacingPopover[prop] = val;
  } else if (prop === "borderTL") {
    block.style.borderTopLeftRadius = val + "px";
    spacingPopover.borderTL = val;
  } else if (prop === "borderTR") {
    block.style.borderTopRightRadius = val + "px";
    spacingPopover.borderTR = val;
  } else if (prop === "borderBR") {
    block.style.borderBottomRightRadius = val + "px";
    spacingPopover.borderBR = val;
  } else if (prop === "borderBL") {
    block.style.borderBottomLeftRadius = val + "px";
    spacingPopover.borderBL = val;
  }
  emitContent();
}

function onBorderStyleChange(e) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const val = e.target.value;
  block.style.borderStyle = val;
  spacingPopover.borderStyle = val;
  // If changing to a visible style and width is 0, set a default width
  if (
    val !== "none" &&
    spacingPopover.bwT === 0 &&
    spacingPopover.bwR === 0 &&
    spacingPopover.bwB === 0 &&
    spacingPopover.bwL === 0
  ) {
    block.style.borderWidth = "1px";
    spacingPopover.bwT = 1;
    spacingPopover.bwR = 1;
    spacingPopover.bwB = 1;
    spacingPopover.bwL = 1;
  }
  // If changing to none, clear border width
  if (val === "none") {
    block.style.borderWidth = "";
    block.style.borderStyle = "";
    spacingPopover.bwT = 0;
    spacingPopover.bwR = 0;
    spacingPopover.bwB = 0;
    spacingPopover.bwL = 0;
  }
  emitContent();
}

function onBorderColorChange(e) {
  const block = spacingPopover.el;
  if (!block) return;
  saveSnapshot();
  const val = e.target.value;
  block.style.borderColor = val;
  spacingPopover.borderColor = val;
  // If setting color and style is none, default to solid with 1px
  if (
    spacingPopover.borderStyle === "none" ||
    (spacingPopover.bwT === 0 &&
      spacingPopover.bwR === 0 &&
      spacingPopover.bwB === 0 &&
      spacingPopover.bwL === 0)
  ) {
    if (spacingPopover.borderWidth === 0) {
      block.style.borderWidth = "1px";
      spacingPopover.borderWidth = 1;
    }
    if (spacingPopover.borderStyle === "none") {
      block.style.borderStyle = "solid";
      spacingPopover.borderStyle = "solid";
    }
  }
  emitContent();
}

function onHRSizeChange(e, dim) {
  const block = spacingPopover.el;
  if (!block || block.tagName !== "HR") return;
  saveSnapshot();
  const val = e.target.value.trim();
  if (dim === "width") {
    block.style.width = val || "";
    spacingPopover.hrWidth = val;
  } else {
    const px = Math.max(1, parseInt(val) || 1);
    // Use border-based height for HR
    block.style.border = "none";
    block.style.height = px + "px";
    block.style.backgroundColor = block.style.backgroundColor || "currentColor";
    spacingPopover.hrHeight = px;
  }
  emitContent();
}

function onBlockWidthChange(val) {
  const block = spacingPopover.el;
  if (!block || block.tagName === "HR") return;
  saveSnapshot();
  block.style.width = val || "";
  spacingPopover.blockWidth = val;
  emitContent();
}

function onBlockHeightChange(val) {
  const block = spacingPopover.el;
  if (!block || block.tagName === "HR") return;
  saveSnapshot();
  block.style.height = val || "";
  spacingPopover.blockHeight = val;
  emitContent();
}

function insertBlockAbove() {
  const block = spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;
  saveSnapshot();
  const div = document.createElement("div");
  div.innerHTML = "<br>";
  block.parentNode.insertBefore(div, block);
  emitContent();
  // Auto-select the new block
  nextTick(() => selectBlock(div));
}

function insertBlockBelow() {
  const block = spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;
  saveSnapshot();
  const div = document.createElement("div");
  div.innerHTML = "<br>";
  if (block.nextSibling) {
    block.parentNode.insertBefore(div, block.nextSibling);
  } else {
    block.parentNode.appendChild(div);
  }
  emitContent();
  // Auto-select the new block
  nextTick(() => selectBlock(div));
}

function insertBlockInside() {
  const block = spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;
  if (block.tagName === "HR") return;
  saveSnapshot();
  const child = document.createElement("div");
  child.innerHTML = "<br>";
  block.appendChild(child);
  emitContent();
  // Auto-select the new child block
  nextTick(() => selectBlock(child));
}

function insertBlockAtParent() {
  const block = spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;
  saveSnapshot();
  // Wrap the selected block inside a new div (the new div becomes its parent)
  const wrapper = document.createElement("div");
  block.parentNode.insertBefore(wrapper, block);
  wrapper.appendChild(block);
  emitContent();
  // Auto-select the new wrapper block
  nextTick(() => selectBlock(wrapper));
}

// Toolbar button wrappers (prevent toolbar from stealing focus)
function insertBlockAboveFromToolbar() {
  insertBlockAbove();
}
function insertBlockBelowFromToolbar() {
  insertBlockBelow();
}
function insertBlockInsideFromToolbar() {
  insertBlockInside();
}
function insertBlockAtParentFromToolbar() {
  insertBlockAtParent();
}

// ---- Block Drag & Drop ----
function startBlockDrag(e, dragBlock) {
  const block = dragBlock || spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;

  e.preventDefault();
  e.stopPropagation();
  saveSnapshot();

  const editable = editableRef.value;
  const startX = e.clientX;
  const startY = e.clientY;
  let isDragging = false;

  // Ghost element (transparent clone follows cursor)
  let ghost = null;
  // Drop indicator line
  let indicator = null;
  // Current drop target info
  let dropTarget = null; // { ref: element, position: 'before' | 'after' | 'inside' }

  // Block tags that can be drop targets
  const blockTags = new Set([
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
    "LI",
    "UL",
    "OL",
    "TABLE",
    "SECTION",
    "ARTICLE",
    "HEADER",
    "FOOTER",
    "HR",
  ]);

  function createGhost() {
    ghost = block.cloneNode(true);
    ghost.className = "ve-drag-ghost";
    ghost.style.cssText =
      "position:fixed;z-index:10000;pointer-events:none;opacity:0.6;" +
      "width:" +
      block.offsetWidth +
      "px;" +
      "max-height:80px;overflow:hidden;" +
      "border:2px solid #3b5bdb;border-radius:6px;background:#fff;" +
      "box-shadow:0 8px 24px rgba(0,0,0,0.18);transform:scale(0.95);";
    document.body.appendChild(ghost);
  }

  function createIndicator() {
    indicator = document.createElement("div");
    indicator.className = "ve-drop-indicator";
    document.body.appendChild(indicator);
  }

  function findDropTarget(clientX, clientY) {
    // Temporarily hide ghost and overlay so elementFromPoint can reach content
    if (ghost) ghost.style.display = "none";
    overlay.style.display = "none";
    let el = document.elementFromPoint(clientX, clientY);
    if (ghost) ghost.style.display = "";
    overlay.style.display = "";

    if (!el || !editable.contains(el)) return null;
    // Walk up to find a block-level element
    while (el && el !== editable) {
      if (
        el.nodeType === Node.ELEMENT_NODE &&
        blockTags.has(el.tagName) &&
        el !== block &&
        !block.contains(el)
      ) {
        break;
      }
      el = el.parentElement;
    }
    if (!el || el === editable || el === block || block.contains(el))
      return null;

    const rect = el.getBoundingClientRect();
    const relY = clientY - rect.top;
    const height = rect.height;

    // Divide into 3 zones: top 25% = before, bottom 25% = after, middle 50% = inside
    // For HR or void elements, just before/after (50/50)
    const isVoid = el.tagName === "HR" || el.tagName === "TABLE";
    if (isVoid) {
      return {
        ref: el,
        position: relY < height / 2 ? "before" : "after",
        rect,
      };
    }
    if (relY < height * 0.25) {
      return { ref: el, position: "before", rect };
    } else if (relY > height * 0.75) {
      return { ref: el, position: "after", rect };
    } else {
      return { ref: el, position: "inside", rect };
    }
  }

  function updateIndicator(dt) {
    if (!indicator) return;
    if (!dt) {
      indicator.style.display = "none";
      return;
    }
    indicator.style.display = "block";
    const r = dt.rect;
    if (dt.position === "before") {
      indicator.style.cssText =
        "position:fixed;z-index:9999;height:3px;border-radius:2px;" +
        "background:#3b5bdb;pointer-events:none;transition:all 0.1s ease;" +
        "left:" +
        r.left +
        "px;top:" +
        (r.top - 2) +
        "px;width:" +
        r.width +
        "px;";
    } else if (dt.position === "after") {
      indicator.style.cssText =
        "position:fixed;z-index:9999;height:3px;border-radius:2px;" +
        "background:#3b5bdb;pointer-events:none;transition:all 0.1s ease;" +
        "left:" +
        r.left +
        "px;top:" +
        (r.bottom - 1) +
        "px;width:" +
        r.width +
        "px;";
    } else {
      // inside — outline the target
      indicator.style.cssText =
        "position:fixed;z-index:9999;border:2px dashed #3b5bdb;border-radius:4px;" +
        "pointer-events:none;transition:all 0.1s ease;background:rgba(59,91,219,0.06);" +
        "left:" +
        r.left +
        "px;top:" +
        r.top +
        "px;" +
        "width:" +
        r.width +
        "px;height:" +
        r.height +
        "px;";
    }
  }

  // Overlay to prevent contenteditable interference
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9998;cursor:grabbing;";
  document.body.appendChild(overlay);

  function onMove(ev) {
    ev.preventDefault();
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    // Start dragging after a small threshold
    if (!isDragging && Math.abs(dx) + Math.abs(dy) > 5) {
      isDragging = true;
      createGhost();
      createIndicator();
      block.style.opacity = "0.3";
      hideSpacingPopover();
    }

    if (!isDragging) return;

    // Move ghost
    ghost.style.left = ev.clientX + 12 + "px";
    ghost.style.top = ev.clientY - 20 + "px";

    // Find & show drop target
    dropTarget = findDropTarget(ev.clientX, ev.clientY);
    updateIndicator(dropTarget);
  }

  function onUp() {
    document.removeEventListener("mousemove", onMove, true);
    document.removeEventListener("mouseup", onUp, true);
    overlay.remove();

    if (ghost) ghost.remove();
    if (indicator) indicator.remove();
    block.style.opacity = "";

    if (isDragging && dropTarget && dropTarget.ref !== block) {
      const target = dropTarget.ref;
      const pos = dropTarget.position;

      // Remove block from current position
      block.classList.remove("ve-block-selected");

      if (pos === "before") {
        target.parentNode.insertBefore(block, target);
      } else if (pos === "after") {
        if (target.nextSibling) {
          target.parentNode.insertBefore(block, target.nextSibling);
        } else {
          target.parentNode.appendChild(block);
        }
      } else if (pos === "inside") {
        target.appendChild(block);
      }

      // Re-select the moved block
      nextTick(() => {
        selectBlock(block);
      });
      emitContent();
    } else if (!isDragging) {
      // Wasn't a real drag, just a click — no-op
    }
  }

  document.addEventListener("mousemove", onMove, true);
  document.addEventListener("mouseup", onUp, true);
}

function deleteSelectedBlock() {
  const block = spacingPopover.el;
  if (!block || !editableRef.value?.contains(block)) return;
  saveSnapshot();
  const next = block.nextElementSibling || block.previousElementSibling;
  block.remove();
  hideSpacingPopover();
  // If editor is empty, ensure at least one paragraph
  if (!editableRef.value.innerHTML.trim()) {
    editableRef.value.innerHTML = "<p><br></p>";
  }
  // Move cursor to sibling
  if (next && editableRef.value.contains(next)) {
    const range = document.createRange();
    range.setStart(next, 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  emitContent();
}

// --- Custom Undo/Redo snapshot system ---
function getCleanHTML() {
  if (!editableRef.value) return "";
  const clone = editableRef.value.cloneNode(true);
  clone.querySelectorAll(".ve-img-resize-wrap").forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (img) {
      img.classList.remove("ve-img-selected");
      wrap.parentNode?.insertBefore(img, wrap);
    }
    wrap.remove();
  });
  clone.querySelectorAll(".ve-img-handle").forEach((h) => h.remove());
  clone
    .querySelectorAll("img.ve-img-selected")
    .forEach((img) => img.classList.remove("ve-img-selected"));
  clone
    .querySelectorAll(".ve-block-selected")
    .forEach((el) => el.classList.remove("ve-block-selected"));
  return clone.innerHTML;
}

function saveSnapshot() {
  const html = getCleanHTML();
  // Avoid pushing duplicate consecutive states
  if (
    undoStack.value.length > 0 &&
    undoStack.value[undoStack.value.length - 1] === html
  )
    return;
  undoStack.value.push(html);
  if (undoStack.value.length > MAX_UNDO) undoStack.value.shift();
  // Clear redo stack on new action
  redoStack.value = [];
}

function customUndo() {
  if (undoStack.value.length === 0) return;
  // Save current state to redo
  const currentHTML = getCleanHTML();
  redoStack.value.push(currentHTML);
  // Restore previous state
  const prevHTML = undoStack.value.pop();
  deselectImage();
  isInternalUpdate.value = true;
  editableRef.value.innerHTML = prevHTML;
  emit("update:modelValue", prevHTML);
  nextTick(() => {
    isInternalUpdate.value = false;
    detectBlockBgColor();
  });
}

function customRedo() {
  if (redoStack.value.length === 0) return;
  // Save current state to undo
  const currentHTML = getCleanHTML();
  undoStack.value.push(currentHTML);
  // Restore redo state
  const nextHTML = redoStack.value.pop();
  deselectImage();
  isInternalUpdate.value = true;
  editableRef.value.innerHTML = nextHTML;
  emit("update:modelValue", nextHTML);
  nextTick(() => {
    isInternalUpdate.value = false;
    detectBlockBgColor();
  });
}

async function insertLink() {
  // Save the selection before opening the modal
  const sel = window.getSelection();
  let savedRange = null;
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }
  const selectedText = sel ? sel.toString() : "";

  const result = await openModal({
    title: "Insert Link",
    fields: [
      {
        key: "url",
        label: "URL",
        placeholder: "https://example.com",
        type: "url",
      },
      {
        key: "text",
        label: "Display Text",
        placeholder: "Link text",
        defaultValue: selectedText,
      },
    ],
  });
  if (result && result.url) {
    editableRef.value?.focus();
    // Restore selection
    if (savedRange) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(savedRange);
    }
    const linkText = result.text || result.url;
    const html = `<a href="${result.url}" target="_blank" title="${result.url}" style="color:#3b5bdb;text-decoration:underline;cursor:pointer;">${linkText}</a>`;
    document.execCommand("insertHTML", false, html);
    emitContent();
  }
}

async function editLink(anchor) {
  const currentUrl = anchor.getAttribute("href") || "";
  const currentText = anchor.textContent || "";

  const result = await openModal({
    title: "Edit Link",
    fields: [
      {
        key: "url",
        label: "URL",
        placeholder: "https://example.com",
        defaultValue: currentUrl,
        type: "url",
      },
      {
        key: "text",
        label: "Display Text",
        placeholder: "Link text",
        defaultValue: currentText,
      },
    ],
  });
  if (result) {
    if (result.url) {
      anchor.setAttribute("href", result.url);
      anchor.setAttribute("title", result.url);
      if (result.text) anchor.textContent = result.text;
    } else {
      // If URL cleared, unwrap the link
      const textNode = document.createTextNode(anchor.textContent);
      anchor.replaceWith(textNode);
    }
    emitContent();
  }
}

async function insertImage() {
  const sel = window.getSelection();
  let savedRange = null;
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }

  const result = await openModal({
    title: "Insert Image",
    fields: [
      {
        key: "url",
        label: "Image URL",
        placeholder: "https://example.com/image.png",
        type: "url",
      },
    ],
  });
  if (result && result.url) {
    editableRef.value?.focus();
    if (savedRange) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(savedRange);
    }
    document.execCommand("insertImage", false, result.url);
    emitContent();
  }
}

async function insertTable() {
  const sel = window.getSelection();
  let savedRange = null;
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }

  const result = await openModal({
    title: "Insert Table",
    fields: [
      {
        key: "rows",
        label: "Number of Rows",
        placeholder: "3",
        defaultValue: "3",
        type: "number",
      },
      {
        key: "cols",
        label: "Number of Columns",
        placeholder: "3",
        defaultValue: "3",
        type: "number",
      },
    ],
  });
  if (result && result.rows > 0 && result.cols > 0) {
    editableRef.value?.focus();

    // Restore saved range, but collapse it so we insert *at* the cursor
    // instead of replacing any selected content (e.g. a selected block)
    if (savedRange) {
      savedRange.collapse(false); // collapse to end
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(savedRange);
    }

    // If the selection is not inside the editor, place cursor at the end
    const sel2 = window.getSelection();
    if (
      !sel2 ||
      sel2.rangeCount === 0 ||
      !editableRef.value?.contains(sel2.anchorNode)
    ) {
      const range = document.createRange();
      range.selectNodeContents(editableRef.value);
      range.collapse(false);
      sel2?.removeAllRanges();
      sel2?.addRange(range);
    }

    let html =
      '<table style="border-collapse:collapse;width:100%;margin:8px 0;">';
    for (let r = 0; r < result.rows; r++) {
      html += "<tr>";
      for (let c = 0; c < result.cols; c++) {
        const tag = r === 0 ? "th" : "td";
        const style = "border:1px solid #ccc;padding:6px 10px;";
        const bg = r === 0 ? "background:#f0f0f0;font-weight:600;" : "";
        html += `<${tag} style="${style}${bg}">${r === 0 ? "Header" : "Cell"}</${tag}>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    document.execCommand("insertHTML", false, html);
    emitContent();
  }
}

function onPaste(e) {
  e.preventDefault();
  const html = e.clipboardData.getData("text/html");
  const text = e.clipboardData.getData("text/plain");
  if (html) {
    document.execCommand("insertHTML", false, html);
  } else {
    document.execCommand("insertText", false, text);
  }
  emitContent();
}

function onInput() {
  // Auto-convert <div> to <p> when typing if it has no child block elements
  convertDivToP();
  emitContent();
  updateActiveFormats();
  // Hide popover when text is modified and selection collapses
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) {
    selPopover.visible = false;
  }
}

const CHILD_BLOCK_SET = new Set([
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
  "SECTION",
  "ARTICLE",
  "HEADER",
  "FOOTER",
  "HR",
  "THEAD",
  "TBODY",
  "TFOOT",
  "TR",
  "TD",
  "TH",
]);

function convertDivToP() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  let node = sel.anchorNode;
  if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  // Walk up to find the nearest DIV inside the editor
  while (node && node !== editableRef.value) {
    if (node.tagName === "DIV") {
      // Only convert if the div has no child block elements
      let hasChildBlock = false;
      for (const child of node.children) {
        if (CHILD_BLOCK_SET.has(child.tagName)) {
          hasChildBlock = true;
          break;
        }
      }
      if (!hasChildBlock) {
        // Replace div with p, preserving content and attributes
        const p = document.createElement("p");
        // Copy attributes
        for (const attr of node.attributes) {
          p.setAttribute(attr.name, attr.value);
        }
        // Move children
        while (node.firstChild) {
          p.appendChild(node.firstChild);
        }
        node.parentNode.replaceChild(p, node);
        // Restore cursor position inside the new <p>
        const newSel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(p);
        range.collapse(false);
        newSel.removeAllRanges();
        newSel.addRange(range);
        // Update selected block reference if it was this div
        if (spacingPopover.el === node) {
          spacingPopover.el = p;
          p.classList.add("ve-block-selected");
        }
      }
      return;
    }
    node = node.parentElement;
  }
}

function onKeyUp() {
  updateActiveFormats();
  // Update or hide popover based on current selection
  const sel = window.getSelection();
  if (sel && !sel.isCollapsed && sel.toString().trim()) {
    showSelectionPopover();
  } else {
    selPopover.visible = false;
  }
}

function onKeyDown(e) {
  // Intercept Ctrl+Z / Ctrl+Y when custom undo/redo stack has entries
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
    if (undoStack.value.length > 0) {
      e.preventDefault();
      customUndo();
      emitContent();
    }
  } else if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "y" || (e.shiftKey && e.key === "z"))
  ) {
    if (redoStack.value.length > 0) {
      e.preventDefault();
      customRedo();
      emitContent();
    }
  }

  // Handle Backspace to remove <br> elements that the browser fails to delete
  if (e.key === "Backspace" && !e.ctrlKey && !e.metaKey) {
    const sel = window.getSelection();
    if (sel && sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const { startContainer, startOffset } = range;

      // Cursor is inside an element node — check if the node before cursor is a <br>
      if (startContainer.nodeType === Node.ELEMENT_NODE) {
        const prevNode = startContainer.childNodes[startOffset - 1];
        if (prevNode && prevNode.nodeName === "BR") {
          e.preventDefault();
          saveSnapshot();
          prevNode.remove();
          emitContent();
          return;
        }
      }

      // Cursor is at the start of a text node — check if previous sibling is a <br>
      if (startContainer.nodeType === Node.TEXT_NODE && startOffset === 0) {
        const prevSib = startContainer.previousSibling;
        if (prevSib && prevSib.nodeName === "BR") {
          e.preventDefault();
          saveSnapshot();
          prevSib.remove();
          emitContent();
          return;
        }
      }
    }
  }
}

function emitContent() {
  if (!editableRef.value) return;
  isInternalUpdate.value = true;
  // Clone the content and strip resize artifacts before emitting
  const clone = editableRef.value.cloneNode(true);
  // Unwrap resize containers
  clone.querySelectorAll(".ve-img-resize-wrap").forEach((wrap) => {
    const img = wrap.querySelector("img");
    if (img) {
      img.classList.remove("ve-img-selected");
      wrap.parentNode?.insertBefore(img, wrap);
    }
    wrap.remove();
  });
  // Remove any stray handles
  clone.querySelectorAll(".ve-img-handle").forEach((h) => h.remove());
  // Remove selection class from images
  clone
    .querySelectorAll("img.ve-img-selected")
    .forEach((img) => img.classList.remove("ve-img-selected"));
  // Remove block selection class
  clone
    .querySelectorAll(".ve-block-selected")
    .forEach((el) => el.classList.remove("ve-block-selected"));
  // Remove child block highlight class
  clone
    .querySelectorAll(".ve-block-child")
    .forEach((el) => el.classList.remove("ve-block-child"));
  emit("update:modelValue", clone.innerHTML);
  contentVersion.value++;
  nextTick(() => {
    isInternalUpdate.value = false;
  });
}

const fontFamilyOptions = [
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "'Times New Roman', serif",
  "Georgia, serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "'Trebuchet MS', sans-serif",
  "'Courier New', monospace",
  "'Lucida Console', monospace",
  "Impact, sans-serif",
  "'Comic Sans MS', cursive",
  "'Segoe UI', sans-serif",
  "Roboto, sans-serif",
  "'Open Sans', sans-serif",
];

function matchFontFamily(rawFamily) {
  if (!rawFamily) return "";
  // Normalize: remove quotes and trim
  const normalized = rawFamily.replace(/['"]/g, "").trim().toLowerCase();
  for (const opt of fontFamilyOptions) {
    // Extract primary font name from option (before the comma)
    const primary = opt.split(",")[0].replace(/['"]/g, "").trim().toLowerCase();
    if (normalized.startsWith(primary)) {
      return opt;
    }
  }
  return "";
}

function updateActiveFormats() {
  activeFormats.bold = document.queryCommandState("bold");
  activeFormats.italic = document.queryCommandState("italic");
  activeFormats.underline = document.queryCommandState("underline");
  activeFormats.strikeThrough = document.queryCommandState("strikeThrough");

  // Detect current font size from selection
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    let node = sel.anchorNode;
    if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (node && editableRef.value?.contains(node)) {
      const computed = window.getComputedStyle(node);
      const pxSize = parseFloat(computed.fontSize);
      // Convert px to pt (1pt = 1.333px)
      const ptSize = Math.round(pxSize * 0.75);
      // Match to nearest available size in dropdown
      const sizes = [
        8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
      ];
      const closest = sizes.reduce((prev, curr) =>
        Math.abs(curr - ptSize) < Math.abs(prev - ptSize) ? curr : prev,
      );
      currentFontSize.value = String(closest);

      // Detect current font family
      const rawFamily = computed.fontFamily;
      currentFontFamily.value = matchFontFamily(rawFamily);
    } else {
      currentFontSize.value = "";
      currentFontFamily.value = "";
    }
  }

  // Detect current block background color
  detectBlockBgColor();

  // Refresh spacing popover values if open
  if (spacingPopover.visible) {
    detectBlockSpacing();
  }
}

function detectBlockBgColor() {
  const block = getBlockElement();
  if (block) {
    const bg = block.style.backgroundColor;
    if (bg) {
      // Convert rgb(r,g,b) to hex
      currentBlockBgColor.value = rgbToHex(bg);
    } else {
      currentBlockBgColor.value = "#ffffff";
    }
  } else {
    currentBlockBgColor.value = "#ffffff";
  }
}

function rgbToHex(color) {
  if (!color) return "#ffffff";
  // Already hex
  if (color.startsWith("#")) return color;
  // Parse rgb(r, g, b)
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return "#ffffff";
}

// --- Link handling ---
function findAnchorFromNode(node) {
  while (node && node !== editableRef.value) {
    if (node.tagName === "A") return node;
    node = node.parentElement;
  }
  return null;
}

function handleContentClick(e) {
  const target = e.target;
  // Handle image click — show edit icon instead of immediately editing
  if (target.tagName === "IMG" && editableRef.value?.contains(target)) {
    e.preventDefault();
    // If this image already has the edit icon, do nothing
    if (imgEditIcon.visible && imgEditIcon.el === target) return;
    // If another image is being fully edited, deselect it
    deselectImage();
    hideImgEditIcon();
    showImgEditIcon(target);
    hideLinkTooltip();
    hideSelPopover();
    hideSpacingPopover();
    return;
  }
  // Handle HR click directly (void element, no children)
  if (target.tagName === "HR" && editableRef.value?.contains(target)) {
    e.preventDefault();
    deselectImage();
    hideLinkTooltip();
    hideSelPopover();
    selectBlock(target);
    return;
  }
  // Deselect image and hide edit icon if clicking elsewhere
  deselectImage();
  hideImgEditIcon();

  // Prevent default link navigation in contenteditable
  const anchor = findAnchorFromNode(e.target);
  if (anchor) {
    e.preventDefault();
    showLinkTooltip(anchor);
    hideSpacingPopover();
  } else {
    hideLinkTooltip();
    // Show spacing popover for clicked block
    const block = findBlockFromNode(target);
    if (block && block !== editableRef.value) {
      selectBlock(block);
    } else {
      hideSpacingPopover();
    }
  }
}

// --- Selected block drag handle ---
function handleContentScroll() {
  // Reposition drag handle if visible (block moved due to scroll)
  if (dragHandle.visible && dragHandle.el) {
    positionDragHandle(dragHandle.el);
  }
  // Reposition image edit icon if visible
  if (imgEditIcon.visible && imgEditIcon.el) {
    positionImgEditIcon(imgEditIcon.el);
  }
}

function positionDragHandle(block) {
  if (!block || !editableRef.value) return;
  const blockRect = block.getBoundingClientRect();
  const editorRect = editableRef.value.getBoundingClientRect();
  const toolbarWidth = dragHandleRef.value?.offsetWidth || 130;
  // Position toolbar just above the block, right-aligned to block's right edge
  let top = blockRect.top - 30;
  let left = blockRect.right - toolbarWidth;
  // If toolbar would go above the editor area, place it at the block's top edge
  if (top < editorRect.top) {
    top = editorRect.top + 2;
  }
  // Keep toolbar within viewport horizontally
  if (left < editorRect.left) {
    left = editorRect.left + 2;
  }
  if (left + toolbarWidth > window.innerWidth - 10) {
    left = window.innerWidth - toolbarWidth - 10;
  }
  dragHandle.top = top;
  dragHandle.left = left;
}

function startBlockDragFromHandle(e) {
  const block = dragHandle.el;
  if (!block) return;
  // Select the block first
  selectBlock(block);
  // Hide drag handle during drag
  dragHandle.visible = false;
  // Delegate to the existing startBlockDrag
  startBlockDrag(e, block);
}

function handleMouseUp(e) {
  updateActiveFormats();
  // If not clicking a link, hide tooltip
  const anchor = findAnchorFromNode(e.target);
  if (!anchor) {
    hideLinkTooltip();
  }
  // Show/hide selection popover
  nextTick(() => showSelectionPopover());
}

function showSelectionPopover() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) {
    selPopover.visible = false;
    return;
  }
  const range = sel.getRangeAt(0);
  // Only show if selection is inside our editor
  if (!editableRef.value?.contains(range.commonAncestorContainer)) {
    selPopover.visible = false;
    return;
  }
  const rect = range.getBoundingClientRect();
  const editorRect = editableRef.value.getBoundingClientRect();
  // Position above the selection, centered
  const popoverWidth = 340;
  let left = rect.left + rect.width / 2 - popoverWidth / 2;
  // Clamp to editor bounds
  left = Math.max(
    editorRect.left + 4,
    Math.min(left, editorRect.right - popoverWidth - 4),
  );
  selPopover.top = rect.top - 44;
  selPopover.left = left;
  selPopover.visible = true;
}

function hideSelPopover() {
  selPopover.visible = false;
}

function popoverCmd(cmd) {
  document.execCommand(cmd, false, null);
  editableRef.value?.focus();
  emitContent();
  updateActiveFormats();
  nextTick(() => showSelectionPopover());
}

async function popoverInsertLink() {
  hideSelPopover();
  await insertLink();
}

function popoverHighlight() {
  document.execCommand("hiliteColor", false, "#ffe066");
  editableRef.value?.focus();
  emitContent();
  nextTick(() => showSelectionPopover());
}

const fontSizeSteps = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

function popoverFontSizeUp() {
  const current = parseInt(currentFontSize.value) || 12;
  const nextSize =
    fontSizeSteps.find((s) => s > current) ||
    fontSizeSteps[fontSizeSteps.length - 1];
  applyFontSizePt(nextSize);
}

function popoverFontSizeDown() {
  const current = parseInt(currentFontSize.value) || 12;
  let prevSize = fontSizeSteps[0];
  for (let i = fontSizeSteps.length - 1; i >= 0; i--) {
    if (fontSizeSteps[i] < current) {
      prevSize = fontSizeSteps[i];
      break;
    }
  }
  applyFontSizePt(prevSize);
}

function applyFontSizePt(pt) {
  document.execCommand("fontSize", false, "7");
  const fontElements = editableRef.value?.querySelectorAll('font[size="7"]');
  if (fontElements) {
    fontElements.forEach((el) => {
      const span = document.createElement("span");
      span.style.fontSize = pt + "pt";
      span.innerHTML = el.innerHTML;
      el.replaceWith(span);
    });
  }
  currentFontSize.value = String(pt);
  editableRef.value?.focus();
  emitContent();
  updateActiveFormats();
  nextTick(() => showSelectionPopover());
}

function showLinkTooltip(anchor) {
  const rect = anchor.getBoundingClientRect();
  linkTooltip.url = anchor.getAttribute("href") || "";
  linkTooltip.anchor = anchor;
  linkTooltip.top = rect.bottom + 6;
  linkTooltip.left = rect.left;
  linkTooltip.visible = true;
}

function hideLinkTooltip() {
  linkTooltip.visible = false;
  linkTooltip.anchor = null;
}

async function editLinkFromTooltip() {
  const anchor = linkTooltip.anchor;
  hideLinkTooltip();
  if (anchor) {
    await editLink(anchor);
  }
}

function removeLinkFromTooltip() {
  const anchor = linkTooltip.anchor;
  hideLinkTooltip();
  if (anchor) {
    const textNode = document.createTextNode(anchor.textContent);
    anchor.replaceWith(textNode);
    emitContent();
  }
}

// Hide link tooltip and selection popover when clicking outside
if (typeof document !== "undefined") {
  document.addEventListener("mousedown", (e) => {
    // Hide selection popover if clicking outside it
    if (selPopover.visible) {
      const popover = document.querySelector(".ve-sel-popover");
      if (popover && !popover.contains(e.target)) {
        hideSelPopover();
      }
    }
    if (linkTooltip.visible) {
      const tooltip = document.querySelector(".ve-link-tooltip");
      if (tooltip && !tooltip.contains(e.target)) {
        const anchor = findAnchorFromNode(e.target);
        if (!anchor) hideLinkTooltip();
      }
    }
    // Hide image popover if clicking outside it and not on the selected image
    if (imgPopover.visible) {
      const pop = document.querySelector(".ve-img-popover");
      if (pop && !pop.contains(e.target) && e.target !== imgPopover.el) {
        deselectImage();
      }
    }
    // Hide image edit icon if clicking outside it and not on an image
    if (imgEditIcon.visible) {
      const editBtn = e.target.closest(".ve-img-edit-icon");
      if (!editBtn && e.target !== imgEditIcon.el) {
        hideImgEditIcon();
      }
    }
    // Hide spacing popover if clicking outside it and not on a block in the editor
    if (spacingPopover.visible) {
      const sp = document.querySelector(".ve-spacing-popover");
      if (sp && !sp.contains(e.target)) {
        const btn = e.target.closest('.ve-btn[title="Block padding & margin"]');
        // Don't hide if clicking inside editor (handleContentClick will manage)
        const inEditor = editableRef.value?.contains(e.target);
        if (!btn && !inEditor) hideSpacingPopover();
      }
    }
  });
}

// --- Image edit icon ---
function showImgEditIcon(img) {
  if (!img || !editableRef.value) return;
  imgEditIcon.el = img;
  positionImgEditIcon(img);
  imgEditIcon.visible = true;
}

function hideImgEditIcon() {
  imgEditIcon.visible = false;
  imgEditIcon.el = null;
}

function positionImgEditIcon(img) {
  if (!img) return;
  const rect = img.getBoundingClientRect();
  // Position at top-right corner outside the image
  imgEditIcon.top = rect.top - 4;
  imgEditIcon.left = rect.right - 4;
}

function activateImageEdit() {
  const img = imgEditIcon.el;
  if (!img) return;
  hideImgEditIcon();
  selectImage(img);
}

// --- Image controls ---
function selectImage(img) {
  // Deselect previous
  deselectImage();
  imgPopover.el = img;
  img.classList.add("ve-img-selected");
  updateImgPopover();
  imgPopover.visible = true;

  // Add resize handles
  addResizeHandles(img);
}

function deselectImage() {
  if (imgPopover.el) {
    imgPopover.el.classList.remove("ve-img-selected");
    removeResizeHandles(imgPopover.el);
  }
  imgPopover.visible = false;
  imgPopover.el = null;
  hideImgEditIcon();
}

function updateImgPopover() {
  const img = imgPopover.el;
  if (!img) return;
  const rect = img.getBoundingClientRect();
  const editorRect = editableRef.value?.getBoundingClientRect();
  if (!editorRect) return;

  const popoverWidth = 420;
  let left = rect.left + rect.width / 2 - popoverWidth / 2;
  left = Math.max(
    editorRect.left + 4,
    Math.min(left, editorRect.right - popoverWidth - 4),
  );

  // Position below the image
  imgPopover.top = rect.bottom + 8;
  imgPopover.left = left;
  imgPopover.width = Math.round(img.offsetWidth);
  imgPopover.height = Math.round(img.offsetHeight);

  // Calculate width percentage relative to editor content
  const contentWidth = editableRef.value?.clientWidth - 48; // subtract padding
  if (contentWidth > 0) {
    const pct = Math.round((img.offsetWidth / contentWidth) * 100);
    imgPopover.widthPct =
      [25, 50, 75, 100].find((p) => Math.abs(p - pct) <= 3) || 0;
  }

  // Detect alignment
  const style = img.style;
  if (style.float === "left") imgPopover.align = "left";
  else if (style.float === "right") imgPopover.align = "right";
  else if (
    style.display === "block" &&
    style.marginLeft === "auto" &&
    style.marginRight === "auto"
  )
    imgPopover.align = "center";
  else imgPopover.align = "";
}

function imgResize(delta) {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  let newW = Math.max(30, img.offsetWidth + delta);
  img.style.width = newW + "px";
  img.removeAttribute("width");
  img.removeAttribute("height");
  updateImgPopover();
  refreshHandles(img);
  emitContent();
}

function imgSetExactWidth(e) {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  const newW = Math.max(10, parseInt(e.target.value) || 10);
  img.style.width = newW + "px";
  img.removeAttribute("width");
  img.removeAttribute("height");
  nextTick(() => {
    updateImgPopover();
    refreshHandles(img);
  });
  emitContent();
}

function imgSetExactHeight(e) {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  const newH = Math.max(10, parseInt(e.target.value) || 10);
  img.style.height = newH + "px";
  img.removeAttribute("width");
  img.removeAttribute("height");
  nextTick(() => {
    updateImgPopover();
    refreshHandles(img);
  });
  emitContent();
}

function imgSetWidth(pct) {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  img.style.width = pct + "%";
  img.style.height = "auto";
  img.removeAttribute("width");
  img.removeAttribute("height");
  nextTick(() => {
    updateImgPopover();
    refreshHandles(img);
  });
  emitContent();
}

function imgSetAlign(align) {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  // Reset alignment styles
  img.style.float = "";
  img.style.display = "";
  img.style.marginLeft = "";
  img.style.marginRight = "";

  if (align === "left") {
    img.style.float = "left";
    img.style.marginRight = "12px";
    img.style.marginBottom = "8px";
  } else if (align === "right") {
    img.style.float = "right";
    img.style.marginLeft = "12px";
    img.style.marginBottom = "8px";
  } else if (align === "center") {
    img.style.display = "block";
    img.style.marginLeft = "auto";
    img.style.marginRight = "auto";
  }
  nextTick(() => {
    updateImgPopover();
    refreshHandles(img);
  });
  emitContent();
}

async function imgReplace() {
  const img = imgPopover.el;
  if (!img) return;
  saveSnapshot();
  const currentUrl = img.getAttribute("src") || "";
  const result = await openModal({
    title: "Replace Image",
    fields: [
      {
        key: "url",
        label: "Image URL",
        placeholder: "https://example.com/image.png",
        defaultValue: currentUrl,
        type: "url",
      },
    ],
  });
  if (result && result.url) {
    img.setAttribute("src", result.url);
    nextTick(() => {
      updateImgPopover();
      refreshHandles(img);
    });
    emitContent();
  }
}

function imgDelete() {
  const img = imgPopover.el;
  saveSnapshot();
  deselectImage();
  if (img) {
    img.remove();
    emitContent();
  }
}

// --- Corner & edge drag resize handles ---
function refreshHandles(img) {
  removeResizeHandles(img);
  addResizeHandles(img);
}

function addResizeHandles(img) {
  if (!img || !editableRef.value?.contains(img)) return;

  // Wrap image in a relative container if not already
  let container = img._resizeContainer;
  if (!container) {
    container = document.createElement("span");
    container.className = "ve-img-resize-wrap";
    container.setAttribute("contenteditable", "false");
    container.style.cssText =
      "display:inline-block;position:relative;line-height:0;";
    // Copy alignment from image
    if (img.style.float) {
      container.style.float = img.style.float;
      if (img.style.marginRight)
        container.style.marginRight = img.style.marginRight;
      if (img.style.marginLeft)
        container.style.marginLeft = img.style.marginLeft;
      if (img.style.marginBottom)
        container.style.marginBottom = img.style.marginBottom;
    }
    if (img.style.display === "block") {
      container.style.display = "block";
      container.style.marginLeft = img.style.marginLeft || "";
      container.style.marginRight = img.style.marginRight || "";
    }
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);
    img._resizeContainer = container;
  }

  // Create 8 handles: 4 corners + 4 edges
  const handles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  const corners = parseClipPath(img);
  handles.forEach((dir) => {
    const handle = document.createElement("div");
    handle.className = `ve-img-handle ve-img-handle-${dir}`;
    handle.setAttribute("contenteditable", "false");
    // Position corner handles at their clip-path position
    if (dir === "nw" || dir === "ne" || dir === "se" || dir === "sw") {
      const ci = dir === "nw" ? 0 : dir === "ne" ? 1 : dir === "se" ? 2 : 3;
      handle.style.position = "absolute";
      handle.style.left = `calc(${corners[ci][0]}% - 5px)`;
      handle.style.top = `calc(${corners[ci][1]}% - 5px)`;
      // Clear any default positioning from CSS
      handle.style.right = "auto";
      handle.style.bottom = "auto";
    }
    handle.addEventListener(
      "mousedown",
      (e) => {
        startImgResize(e, img, dir);
      },
      { capture: true },
    );
    container.appendChild(handle);
  });
}

function removeResizeHandles(img) {
  const container = img?._resizeContainer;
  if (container) {
    container.querySelectorAll(".ve-img-handle").forEach((h) => h.remove());
    // Unwrap
    container.parentNode?.insertBefore(img, container);
    container.remove();
    img._resizeContainer = null;
  }
}

function startImgResize(e, img, dir) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  saveSnapshot();

  const startX = e.clientX;
  const startY = e.clientY;
  const startW = img.offsetWidth;
  const startH = img.offsetHeight;

  // Determine which axes this handle controls
  const resizeW = dir.includes("e") || dir.includes("w");
  const resizeH = dir.includes("n") || dir.includes("s");
  const isCorner = resizeW && resizeH;
  const flipX = dir.includes("w"); // invert dx for west handles
  const flipY = dir.includes("n"); // invert dy for north handles

  // For corner handles: use clip-path to move only that corner
  // Parse existing clip-path or default to full rectangle
  let corners = null;
  if (isCorner) {
    corners = parseClipPath(img);
  }

  // Add overlay to prevent contenteditable interference
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:99999;cursor:" + getCursorForDir(dir) + ";";
  document.body.appendChild(overlay);

  function onMove(ev) {
    ev.preventDefault();
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;

    if (isCorner && corners) {
      // Convert pixel delta to percentage of image dimensions
      const pctX = (dx / startW) * 100;
      const pctY = (dy / startH) * 100;

      // Clone corners and update only the dragged corner
      const c = corners.map((p) => [...p]);
      if (dir === "nw") {
        c[0][0] = clampPct(corners[0][0] + pctX);
        c[0][1] = clampPct(corners[0][1] + pctY);
      } else if (dir === "ne") {
        c[1][0] = clampPct(corners[1][0] + pctX);
        c[1][1] = clampPct(corners[1][1] + pctY);
      } else if (dir === "se") {
        c[2][0] = clampPct(corners[2][0] + pctX);
        c[2][1] = clampPct(corners[2][1] + pctY);
      } else if (dir === "sw") {
        c[3][0] = clampPct(corners[3][0] + pctX);
        c[3][1] = clampPct(corners[3][1] + pctY);
      }
      img.style.clipPath = buildClipPath(c);
    } else if (resizeW) {
      // Edge: width only
      const edx = dx * (flipX ? -1 : 1);
      const newW = Math.max(30, startW + edx);
      img.style.width = Math.round(newW) + "px";
    } else if (resizeH) {
      // Edge: height only
      const edy = dy * (flipY ? -1 : 1);
      const newH = Math.max(30, startH + edy);
      img.style.height = Math.round(newH) + "px";
    }
    img.removeAttribute("width");
    img.removeAttribute("height");
    updateImgPopover();
  }

  function onUp() {
    document.removeEventListener("mousemove", onMove, true);
    document.removeEventListener("mouseup", onUp, true);
    overlay.remove();
    emitContent();
    nextTick(() => {
      updateImgPopover();
      refreshHandles(img);
    });
  }

  document.addEventListener("mousemove", onMove, true);
  document.addEventListener("mouseup", onUp, true);
}

// Parse clip-path polygon from image, default to full rectangle
function parseClipPath(img) {
  const cp = img.style.clipPath || "";
  const match = cp.match(
    /polygon\(\s*([\d.]+)%\s+([\d.]+)%\s*,\s*([\d.]+)%\s+([\d.]+)%\s*,\s*([\d.]+)%\s+([\d.]+)%\s*,\s*([\d.]+)%\s+([\d.]+)%\s*\)/,
  );
  if (match) {
    return [
      [parseFloat(match[1]), parseFloat(match[2])],
      [parseFloat(match[3]), parseFloat(match[4])],
      [parseFloat(match[5]), parseFloat(match[6])],
      [parseFloat(match[7]), parseFloat(match[8])],
    ];
  }
  // Default: full rectangle [TL, TR, BR, BL]
  return [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ];
}

function buildClipPath(corners) {
  return `polygon(${corners.map((c) => `${round2(c[0])}% ${round2(c[1])}%`).join(", ")})`;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function clampPct(v) {
  return Math.max(-20, Math.min(120, v));
}

function getCursorForDir(dir) {
  const map = {
    nw: "nwse-resize",
    n: "ns-resize",
    ne: "nesw-resize",
    e: "ew-resize",
    se: "nwse-resize",
    s: "ns-resize",
    sw: "nesw-resize",
    w: "ew-resize",
  };
  return map[dir] || "nwse-resize";
}
</script>

<style>
@import "./VisualEditor.css";
</style>
