<template>
  <div
      v-if="showMemoModal"
      class="memoModal"
      @mousedown="startDrag"
      ref="memoModalRef"
      :style="modalStyle"
  >
    <div class="memoModal-top"></div>
    <div>
      <textarea @mousedown.stop v-model="memo"></textarea>
      <div class="memoModalBtn-wrapper">
        <Button @mousedown.stop className="memoModalBtn" @handleClickBtn="handleMemoSave" text="OK" />
        <Button @mousedown.stop className="memoModalBtn" @handleClickBtn="handleCloseMemo" text="CLOSE" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import {ref, onUnmounted, defineProps, defineEmits, computed, onMounted, StyleValue } from "vue";
import {useClickOutside} from "@/common/lib/utils/useClickOutside";
import Button from "@/components/commonUi/Button.vue";

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

  const modalWidth = memoModalRef.value?.offsetWidth || 420;
  const modalHeight = memoModalRef.value?.offsetHeight || 280;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const currentX = Math.min(Math.max(e.clientX - currentModalPos.value.offsetX, 0), screenWidth - modalWidth);
  const currentY = Math.min(Math.max(e.clientY - currentModalPos.value.offsetY, 0), screenHeight - modalHeight);

  currentModalPos.value.currentX = currentX;
  currentModalPos.value.currentY = currentY;
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