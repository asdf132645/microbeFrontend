<template>
  <div style="width: 98%;">
    <div class="classDetailInfoWrapper">
      <h1 class="fs12 classInfoClassTitle">{{ title }}</h1>
    </div>
    <GradeInputWithTitle
        :isCheckable="isCheckable"
        :grades="grades"
        :moInfo="totalClassInfo"
        @updateGrade="updateGrade"
        :classInfo="classInfo"
        @classCheck="classCheck"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";

const props = defineProps(['title', 'grades', 'totalClassInfo', 'updateGrade', 'classInfo', 'isCheckable', 'classCheck'])

</script>