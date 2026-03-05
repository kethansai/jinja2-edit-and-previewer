<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modalVisible" class="custom-modal-overlay" @mousedown.self="cancelModal">
        <Transition name="modal-scale" appear>
          <div class="custom-modal" :class="{ dark }">
            <!-- Header -->
            <div class="custom-modal-header">
              <h3 class="custom-modal-title">{{ modalState.title }}</h3>
              <button class="custom-modal-close" @click="cancelModal" title="Close">
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="custom-modal-body">
              <div
                v-for="(field, idx) in modalState.fields"
                :key="field.key"
                class="custom-modal-field"
              >
                <label class="custom-modal-label">{{ field.label }}</label>
                <input
                  :ref="el => { if (idx === 0) firstInputRef = el }"
                  class="custom-modal-input"
                  :type="field.type || 'text'"
                  :placeholder="field.placeholder || ''"
                  v-model="field.value"
                  @keydown.enter="confirmModal"
                  @keydown.escape="cancelModal"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="custom-modal-footer">
              <button class="custom-modal-btn custom-modal-btn-cancel" @click="cancelModal">
                Cancel
              </button>
              <button class="custom-modal-btn custom-modal-btn-confirm" @click="confirmModal">
                Confirm
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useModal } from '../composables/useModal'

defineProps({
  dark: { type: Boolean, default: false },
})

const { modalVisible, modalState, confirmModal, cancelModal } = useModal()
const firstInputRef = ref(null)

// Auto-focus first input when modal opens
watch(modalVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      nextTick(() => {
        firstInputRef.value?.focus()
        firstInputRef.value?.select()
      })
    })
  }
})
</script>

<style>
/* Overlay */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Modal card */
.custom-modal {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06);
  width: 420px;
  max-width: 92vw;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.custom-modal.dark {
  background: #1e1e2e;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* Header */
.custom-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 0;
}

.custom-modal-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #1a1a2e;
  letter-spacing: -0.01em;
}
.custom-modal.dark .custom-modal-title {
  color: #e0e0f0;
}

.custom-modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}
.custom-modal-close:hover {
  background: #f0f0f5;
  color: #444;
}
.custom-modal.dark .custom-modal-close:hover {
  background: #2e2e42;
  color: #ccc;
}

/* Body */
.custom-modal-body {
  padding: 18px 22px 6px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.custom-modal-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.custom-modal-label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
}
.custom-modal.dark .custom-modal-label {
  color: #aaa;
}

.custom-modal-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1.5px solid #d8dce6;
  border-radius: 10px;
  background: #f8f9fb;
  color: #1a1a2e;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}
.custom-modal-input:focus {
  border-color: #5b8def;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.12);
}
.custom-modal-input::placeholder {
  color: #aab0c0;
}
.custom-modal.dark .custom-modal-input {
  background: #28283c;
  border-color: #444460;
  color: #e0e0f0;
}
.custom-modal.dark .custom-modal-input:focus {
  border-color: #6b8def;
  background: #2a2a40;
  box-shadow: 0 0 0 3px rgba(107, 141, 239, 0.15);
}
.custom-modal.dark .custom-modal-input::placeholder {
  color: #666680;
}

/* Footer */
.custom-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px 20px;
}

.custom-modal-btn {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: -0.01em;
}

.custom-modal-btn-cancel {
  background: #f0f1f5;
  color: #555;
}
.custom-modal-btn-cancel:hover {
  background: #e4e5ea;
}
.custom-modal.dark .custom-modal-btn-cancel {
  background: #2e2e42;
  color: #aaa;
}
.custom-modal.dark .custom-modal-btn-cancel:hover {
  background: #3a3a50;
}

.custom-modal-btn-confirm {
  background: linear-gradient(135deg, #5b8def, #4b6dd8);
  color: #fff;
  box-shadow: 0 2px 8px rgba(75, 109, 216, 0.25);
}
.custom-modal-btn-confirm:hover {
  background: linear-gradient(135deg, #6b9bff, #5b7de8);
  box-shadow: 0 4px 12px rgba(75, 109, 216, 0.35);
  transform: translateY(-0.5px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-leave-active {
  transition: all 0.15s ease-in;
}
.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
