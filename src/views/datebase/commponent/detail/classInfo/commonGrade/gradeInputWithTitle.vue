<template>
  <table class="no-css-table" v-if="!isObjectEmpty(classInfo)">
    <thead v-if="!noHead">
      <th></th>
      <th></th>
      <th v-for="grade in grades" :key="grade">{{ grade }}</th>
    </thead>
    <colgroup>
      <col v-for="(colWidth, index) in colReturn(grades.length)" :key="index" :style="{ width: colWidth + '%' }" />
    </colgroup>
    <tbody>
    <tr v-for="category in classInfo" :key="category?.classId">
      <td></td>
      <td class="flex-justify-center">
        {{ MAP_CLASS_ID_TO_CLASS_NM[category?.classId] }}
        <input v-show="isCheckable" type="checkbox"  v-model="checkedClasses[category?.classId]" @change="e => checkClassStatus(e, category?.classId)" />
      </td>
      <template v-for="grade in grades" :key="grade">
        <td class="text-center">
          <div class="grade-icon-container" @click="handleGradeClickFunc(moInfo, category.classId, grades.includes(GRADE_TEXT.EXIST) ? category.afterGrade : grade)">
            <font-awesome-icon
                class="grade-dot-wrapper top-half"
                :icon="['fac', 'half-circle-down']"
                size="lg"
                :class="{ 'active-before': checkGradeFunc(category.beforeGrade, grade)}"
            />
            <font-awesome-icon
                class="grade-dot-wrapper bottom-half"
                :icon="['fac', 'half-circle-up']"
                size="lg"
                :class="{ 'active-after': checkGradeFunc(category.afterGrade, grade)}"
            />
          </div>
        </td>
      </template>
    </tr>
    </tbody>
  </table>



</template>

<script setup lang="ts">
import {defineProps, defineEmits, reactive, watch, computed, ref} from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { GRADE_TEXT, MAP_CLASS_ID_TO_CLASS_NM } from "@/common/defines/constFile/dataBase";
import {isObjectEmpty} from "@/common/lib/utils/checkUtils";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps(['classInfo', 'grades', 'moInfo', 'noHead', 'isCheckable'])
const emits = defineEmits();
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const checkedClasses = ref({});

watch(() => currentImageName.value, () => {
  checkedClasses.value = {};
})

const checkGradeFunc = (beforeAfterGrade: string, gradeText: string) => {

  if (!props.grades.includes(GRADE_TEXT.EXIST)) {
    return checkGrade(gradeText, beforeAfterGrade);
  }
  return checkToggleGrade(beforeAfterGrade);
}

const checkClassStatus = (event: Event, classId: string) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  checkedClasses[classId] = isChecked;
  emits('classCheck', { classId, isChecked});
}

const checkGrade = (gradeText: string, paramGrade: string) => {
  return gradeText === paramGrade;
}

const checkToggleGrade = (currentGrade: string | boolean) => {
  return currentGrade === 'Exist' || currentGrade === true;
}

const handleGradeClickFunc = (updatingMoInfo: any, classId: string, grade: string) => {
  if (!props.grades.includes(GRADE_TEXT.EXIST)) {
    return handleGradeClick(updatingMoInfo, classId, grade);
  }

  return handleToggleGradeClick(updatingMoInfo, classId, grade);
}

const handleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  emits('updateGrade', updatingMoInfo, className, grade);
}

const handleToggleGradeClick = (updatingMoInfo: any, classId: string, grade: string) => {
  const newGrade = grade === 'Exist' ? 'None' : 'Exist';
  emits('updateGrade', updatingMoInfo, classId, newGrade);
}

const colReturn = (col: number) => {
  switch (col + 1) {
    case 2:
      return [7, 18, 60];
    case 4:
      return [25, 25, 25, 25];
    case 5:
      return [8, 18, 18, 18, 18, 18];
    case 6:
      return [20, 16, 16, 16, 16, 16];
  }
}

</script>