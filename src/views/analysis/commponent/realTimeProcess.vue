<template>
  <div>
    <h3 class="titleText">Real Time Process</h3>
  </div>
</template>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";

const props = defineProps(['parsedData']);

const moClassList = ref(0);

onMounted(() => {
  updateDataArray(1)
})

watch(() => props.parsedData, (newVal) => {
  //
})

const updateDataArray = async (newSlotInfo: any) => {
  //
}

</script>