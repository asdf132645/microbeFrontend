<template>
  <div class="contentLeft" v-show="props.isClass">
    <Execute @initDataChangeText="initDataChangeText" />
    <ProcessInfo :parsedData="props.parsedData" :pb100aCassette="pb100aCassette"/>
    <orderList :parsedData="props.parsedData" :startStatus="props.startStatus" :pb100aCassette="pb100aCassette"/>
  </div>
  <div class="contentRight" v-show="props.isClass">
    <workingView  :initValData="initValData" :parsedData="props.parsedData" :pb100aCassette="pb100aCassette" class="contentRightChild" />
    <RealTimeProcess  class="contentRightChild realtime"/>
    <div class="contentBottom">
      <FoundingCells :parsedData="props.parsedData" :pb100aCassette="pb100aCassette"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProcessInfo from '@/views/analysis/commponent/processInfo.vue';
import Execute from '@/views/analysis/commponent/execute.vue';
import workingView from '@/views/analysis/commponent/workingView.vue';
import orderList from './commponent/orderList.vue';
import wbcclassification from './commponent/classInfoification.vue';
import rbcclassification from './commponent/rbcclassification.vue';
import FoundingCells from "@/views/analysis/commponent/foundingCells.vue";
import {defineEmits, defineProps, onMounted, ref, onBeforeMount, computed, watch} from "vue";
import router from "@/router";
import {useStore} from "vuex";
import RealTimeProcess from "@/views/analysis/commponent/realTimeProcess.vue";
const emits = defineEmits();

const store = useStore();
const props = defineProps(['parsedData','isClass', 'startStatus', 'pb100aCassette']);
const initValData = ref(false);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);

onBeforeMount(async () => {
  if (viewerCheck.value === 'viewer') {
    router.push('/database')
  }
});



const classInfoUpdate = (data: any) => {
  emits('classAppUpdateLast', data);
}

const initDataChangeText = (val: any) => {
  store.dispatch('commonModule/setCommonInfo', {initValData: val});
}

</script>

<style lang="css" scoped src="@/assets/css/layout.css">
</style>
