<template>
  <div v-for="category in moInfo" :key="category.classNm" class="w-full flex-justify-center mb14">
    <p class="ml40" style="width: 340px;">{{ category.classNm }}</p>
    <input
        type="checkbox"
        :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        v-model="category[`${databaseDetailBeforeAfterStatus}Grade`]"
        true-value="Exist"
        false-value="None"
        @click="handleClickGrade"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, defineEmits, watch, ref} from "vue";
import { useStore } from "vuex";
import { beforeAfterStatus, moCategory } from "@/common/defines/constFile/dataBase";

const store = useStore();
const emits = defineEmits();
const props = defineProps(['moInfo']);
const showingMoInfo = ref(props.moInfo);

const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

watch(() => props.moInfo, (newMoInfo) => {
  showingMoInfo.value = newMoInfo;
})

const handleClickGrade = () => {
  emits('handleClickGrade', showingMoInfo.value);
}

</script>