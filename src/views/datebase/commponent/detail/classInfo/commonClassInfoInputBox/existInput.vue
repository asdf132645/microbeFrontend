<template>
  <div v-for="category in moInfo" :key="category.classNm" class="w-full flex-justify-center mb14">
    <p class="ml40" style="width: 340px;">{{ category.classNm }}</p>
    <input
        type="checkbox"
        :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE }]"
        v-model="category[`${databaseDetailBeforeAfterStatus}Grade`]"
        true-value="Exist"
        false-value="None"
        @change="handleClickGrade(moInfo)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
import { BEFORE_AFTER_STATUS } from "@/common/defines/constFile/dataBase";

const store = useStore();
const emits = defineEmits();
const props = defineProps(['moInfo']);

const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

const handleClickGrade = (changedMoInfo: any) => {
  emits('handleClickGrade', changedMoInfo);
}

</script>