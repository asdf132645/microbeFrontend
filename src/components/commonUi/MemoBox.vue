<template>
  <div
      v-if="showMemoModal"
      class="memoModal"
      @mousedown.self="startDrag"
      ref="memoModalRef"
      :style="modalStyle"
  >
    <textarea v-model="memo"></textarea>
    <button class="memoModalBtn" @click="handleMemoSave">OK</button>
    <button class="memoModalBtn" @click="handleCloseMemo">CLOSE</button>
  </div>
</template>

<script setup lang="ts">

import {ref, onUnmounted, defineProps, defineEmits, computed, onMounted, StyleValue } from "vue";
import {useClickOutside} from "@/common/lib/utils/useClickOutside";

const memo = defineModel<string>('memo');
const props = defineProps({ showMemoModal: Boolean })
const emits = defineEmits(['closeMemo', 'saveMemo']);
const memoModalRef = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const currentModalPos = ref({
  currentX: 0,
  currentY: 0,
  offsetX: 0,
  offsetY: 0,
})
const modalStyle = computed<StyleValue>(() => ({
  left: `${currentModalPos.value.currentX}px`,
  top: `${currentModalPos.value.currentY}px`,
  position: 'fixed'
}))

onMounted(() => {
  currentModalPos.value.currentX = 460;
  currentModalPos.value.currentY = 340;
})

const startDrag = (e: MouseEvent) => {
  if (!memoModalRef.value) return

  isDragging.value = true
  const rect = memoModalRef.value?.getBoundingClientRect()
  currentModalPos.value.offsetX = e.clientX - rect.left
  currentModalPos.value.offsetY = e.clientY - rect.top

  // Add event listeners
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

// Drag method
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  currentModalPos.value.currentX = e.clientX - currentModalPos.value.offsetX
  currentModalPos.value.currentY = e.clientY - currentModalPos.value.offsetY
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
})

const handleCloseMemo = () => {
  emits('closeMemo');
  currentModalPos.value.currentX = 460;
  currentModalPos.value.currentY = 340;
}

const handleMemoSave = () => {
  emits('saveMemo', memo.value);
}

useClickOutside(memoModalRef, handleCloseMemo)

</script>