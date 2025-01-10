<template>
  <div
      v-if="isVisible"
      :class="`tooltip-container tooltip-pos-${position} ${className}`"
  >
    <pre :style="{ color: color }">{{ message }}</pre>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface PropsType {
  isVisible: boolean;
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  color?: string;
}

const props = withDefaults(defineProps<PropsType>(), {
  position: 'top',
  color: 'white',
});

</script>