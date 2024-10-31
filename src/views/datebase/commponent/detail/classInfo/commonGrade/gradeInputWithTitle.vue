<template>
  <table class="no-css-table">
    <thead v-if="!noHead">
      <th></th>
      <th></th>
      <th v-for="grade in grades" :key="grade">{{ grade }}</th>
    </thead>
    <colgroup>
      <col v-for="(colWidth, index) in colReturn(grades.length)" :key="index" :style="{ width: colWidth + '%' }" />
    </colgroup>
    <tbody>
    <tr v-for="category in classInfo" :key="category?.classNm">
      <td></td>
      <td class="flex-justify-center">
        {{ category?.classNm }}
<!--     TODO 여기서 클래스 눌렀을 시 박스 그려주는 코드   -->
<!--        <input type="checkbox" @change="e => checkClassStatus(e, category?.classNm)" />-->
      </td>
      <template v-for="grade in grades" :key="grade">
        <td class="text-center">
          <div class="grade-icon-container" @click="handleGradeClickFunc(moInfo, category.classNm, grades.includes(GRADE_TEXT.EXIST) ? category.afterGrade : grade)">
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
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { GRADE_TEXT } from "@/common/defines/constFile/dataBase";

const props = defineProps(['classInfo', 'grades', 'moInfo', 'noHead'])
const emits = defineEmits();

const checkGradeFunc = (beforeAfterGrade: string, gradeText: string) => {

  if (!props.grades.includes(GRADE_TEXT.EXIST)) {
    return checkGrade(gradeText, beforeAfterGrade);
  }
  return checkToggleGrade(beforeAfterGrade);
}

const checkClassStatus = (event: Event, className: string) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  emits('classCheck', { className, isChecked});
}

const checkGrade = (gradeText: string, paramGrade: string) => {
  return gradeText === paramGrade;
}

const checkToggleGrade = (currentGrade: string | boolean) => {
  return currentGrade === 'Exist' || currentGrade === true;
}

const handleGradeClickFunc = (updatingMoInfo: any, className: string, grade: string) => {
  if (!props.grades.includes(GRADE_TEXT.EXIST)) {
    return handleGradeClick(updatingMoInfo, className, grade);
  }

  return handleToggleGradeClick(updatingMoInfo, className, grade);
}

const handleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  emits('updateGrade', updatingMoInfo, className, grade);
}

const handleToggleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  const newGrade = grade === 'Exist' ? 'None' : 'Exist';
  emits('updateGrade', updatingMoInfo, className, newGrade);
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