<template>
  <div v-for="category in moInfo" :key="category.classNm" class="w-full flex-justify-center mb14">
    <p class="ml40" style="width: 340px;">{{ category.classNm }}</p>
      <input
          v-for="grade in FOUR_GRADES"
          :key="grade"
          :name="category?.classNm"
          style="margin-top: 2px; width: 24px;"
          type="radio"
          :value="grade"
          v-model="category[`${databaseDetailBeforeAfterStatus}Grade`]"
          :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE }]"
          @change="handleClickGrade(moInfo)"
      />
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, defineEmits, onMounted, watch} from "vue";
import { useStore } from "vuex";
import { BEFORE_AFTER_STATUS, FOUR_GRADES } from "@/common/defines/constFile/dataBase";

const store = useStore();
const emits = defineEmits();
const props = defineProps(['moInfo']);

const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

const handleClickGrade = (changedMoInfo: any) => {
  emits('handleClickGrade', changedMoInfo);
}

</script>