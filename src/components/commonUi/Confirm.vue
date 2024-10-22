<template>
  <Teleport to="body">
    <div v-if="isVisible" class="alert" :class="typeClass">
      <p class="mb1">
        {{ message }}
      </p>
      <button class="alertButton" @click="okConfirm">{{ typeConvertConfirmText(type) || 'OK' }}</button>
      <button class="alertCloseButton" @click="hideConfirm">{{ typeConvertCloseText(type) || 'CLOSE' }}</button>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { MESSAGES } from "@/common/defines/constFile/constantMessageText";

const props = defineProps(['isVisible', 'type', 'message']);
const typeClass = computed(() => `confirm-${props.type}`);
const emit = defineEmits(['okConfirm']);

const typeConvertConfirmText = type => {
  switch (type) {
    case MESSAGES.SETTING:
      return MESSAGES.SAVE;
    case MESSAGES.DELETE:
      return MESSAGES.DELETE;
    default:
      return MESSAGES.OK;
  }
}

const typeConvertCloseText = (type) => {
  switch (type) {
    case MESSAGES.SETTING:
      return MESSAGES.LEAVE;
    case MESSAGES.DELETE:
      return MESSAGES.CLOSE;
    default:
      return MESSAGES.CLOSE;
  }
}

const hideConfirm = () => {
  emit('hide');
};

const okConfirm = () => {
  emit('okConfirm');
}
</script>
