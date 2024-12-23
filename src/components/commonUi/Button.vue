<template>
  <button :class="className" @click="handleClickBtn">{{ text }}</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps({
  className: String,
  handleClick: Function,
  text: String,
})
const emits = defineEmits(['handleClickBtn']);

const handleClickBtn = () => {
  emits('handleClickBtn');
}

</script>