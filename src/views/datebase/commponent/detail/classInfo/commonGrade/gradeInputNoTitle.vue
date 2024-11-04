<template>
  <table class="no-css-table">
    <thead v-if="!noHead">
      <th v-for="grade in grades" :key="grade">{{ grade }}</th>
    </thead>
    <colgroup>
      <col v-for="(colWidth, index) in colReturn(grades.length)" :key="index" :style="{ width: colWidth + '%' }" />
    </colgroup>
    <tbody>
    <tr v-for="category in classInfo" :key="category?.classId">
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

const handleGradeClick = (updatingMoInfo: any, classId: string, grade: string) => {
  emits('updateGrade', updatingMoInfo, classId, grade);
}

const handleToggleGradeClick = (updatingMoInfo: any, classId: string, grade: string) => {
  const newGrade = grade === 'Exist' ? 'None' : 'Exist';
  emits('updateGrade', updatingMoInfo, classId, newGrade);
}

const colReturn = (col: number) => {
  switch (col) {
    case 1:
      return [100];
    case 2:
      return [25, 25, 25, 25];
    case 3:
      return [8, 18, 18, 18, 18, 18];
    case 4:
      return [25, 25, 25, 25];
  }
}

</script>