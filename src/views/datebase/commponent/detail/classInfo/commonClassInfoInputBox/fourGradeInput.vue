<template>
  <div v-for="category in moInfo" :key="category.classNm" class="w-full flex-justify-center mb14">
    <p class="ml40" style="width: 340px;">{{ category.classNm }}</p>
    <input
        type="checkbox"
        :checked="`${category[databaseDetailBeforeAfterStatus + 'Grade']}` === 'Exist'"
        :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        @click="handleClickGrade"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
import { beforeAfterStatus, moCategory } from "@/common/defines/constFile/dataBase";

const store = useStore();
const emits = defineEmits();
const props = defineProps(['moInfo']);

const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

const handleClickGrade = () => {
  emits('handleClickGrade');
}

</script>