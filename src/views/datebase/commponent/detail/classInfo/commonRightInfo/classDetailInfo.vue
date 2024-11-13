<template>
  <div class="classDetailInfoContainer" style="width: 450px;">
    <template v-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <h1 class="fs12 classInfoClassTitle">{{ MO_CATEGORY_NAME.YEAST }}</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="detailClassInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="detailClassInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.URINE) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo?.classInfo" :key="category.classId">
        <h1 class="fs12 classInfoClassTitle">{{ MAP_CLASS_ID_TO_CLASS_NM[category.classId] }}</h1>
        <div class="classInfoHorizontalRule"></div>
        <GradeInputWithTitle
            v-if="category.classId === CLASS_INFO_ID.WBC"
            :isCheckable="true"
            @classCheck="classCheck"
            :grades="FOUR_GRADES"
            :moInfo="moInfo"
            @updateGrade="updateGrade"
            :classInfo="filterClassInfoByClassIds(detailClassInfo, 'include', [CLASS_INFO_ID.WBC])"
        />
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.URINE) && !isObjectEmpty(moInfo)">
      <div v-show="moInfo?.classInfo.filter((it: any) => it.classId === CLASS_INFO_ID.YEAST).length > 0">
        <h1 class="fs12 classInfoClassTitle">Yeast</h1>
        <div class="classInfoHorizontalRule"></div>
        <GradeInputWithTitle
            :isCheckable="true"
            @classCheck="classCheck"
            :grades="[GRADE_TEXT.EXIST]"
            :moInfo="moInfo"
            @updateGrade="updateGrade"
            :classInfo="filterClassInfoByClassIds(detailClassInfo, 'include', [CLASS_INFO_ID.YEAST])"
        />
      </div>

      <div v-show="moInfo?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST).length > 0">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <GradeInputWithTitle
            :isCheckable="true"
            @classCheck="classCheck"
            :grades="FOUR_GRADES"
            :moInfo="moInfo"
            @updateGrade="updateGrade"
            :classInfo="filterClassInfoByClassIds(detailClassInfo, 'delete', [CLASS_INFO_ID.YEAST])"
        />
      </div>
    </template>


    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.SPUTUM)  && !isObjectEmpty(moInfo)">
      <h1 class="fs12 classInfoClassTitle mt24">Sputum</h1>
      <div class="classInfoHorizontalRule"></div>

      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo.filter((item: any) => item.classId === '15')" :key="category.classId">
        <table class="no-css-table">
            <thead>
              <th></th>
              <th v-for="column in SPUTUM_GRADES.GRADES" :key="column" width="10%;">{{ column }}</th>
            </thead>
            <colgroup>
              <col width="2%" />
              <col width="4%" />
              <col width="16%" />
              <col width="6%" />
              <col width="10%" />
              <col width="6%" />
              <col width="16%" />
              <col width="18%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="text-left">Sputum</td>
                <template v-for="grade in SPUTUM_GRADES.GRADES" :key="grade">
                  <td @click="handleGradeClick(moInfo, category.classId, grade)">
                    <font-awesome-icon
                        class="grade-dot-wrapper top-half"
                        :icon="['fac', 'half-circle-down']"
                        size="lg"
                        :class="{ 'active-before': checkGrade(category.beforeGrade, grade)}"
                    />
                    <font-awesome-icon
                        class="grade-dot-wrapper bottom-half"
                        :icon="['fac', 'half-circle-up']"
                        size="lg"
                        :class="{ 'active-after': checkGrade(category.afterGrade, grade)}"
                    />
                  </td>
                </template>

              </tr>
              <tr>
                <td class="fs08">EP Cell</td>
                <td v-for="column in SPUTUM_GRADES.EPCELL_GRADES" :key="column" style="font-size: 0.8rem;">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs08">WBC</td>
                <td v-for="column in SPUTUM_GRADES.WBC_GRADES" :key="column" style="font-size: 0.8rem;">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs08">WBC / EP Cell</td>
                <td v-for="column in SPUTUM_GRADES.WBC_EPCELL_RATIO_GRADES" :key="column" style="font-size: 0.8rem;">{{ column }}</td>
              </tr>
            </tbody>
      </table>
      </div>

      <h1 class="fs12 classInfoClassTitle mt24">Yeast</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST)" />

      <h1 class="fs12 classInfoClassTitle">Hyphae</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.HYPHAE)" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.SPUTUM) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>

      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>
  </div>

</template>

<script setup lang="ts">

import { useRoute } from "vue-router";
import {computed, nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {
  FOUR_GRADES, GRADE_TEXT, MAP_CLASS_ID_TO_CLASS_NM, CLASS_INFO_ID,
  MO_CATEGORY_NAME,
  MO_TEST_TYPE,
  POWER_MODE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import {
  filterClassInfoByClassIds,
  getCurrentAnalysisType,
  getValidClassIds
} from "@/common/lib/utils/conversionDataUtils";
import { useStore } from "vuex";
import {updateRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";
import GradeInputNoTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputNoTitle.vue";
import {ClassInfoType} from "@/common/api/service/runningInfo/runningInfo.dto";
import {RouteType} from "@/common/type/generalTypes";

const store = useStore();
const route = useRoute();
const emits = defineEmits();
const currentAnalysisType = ref(MO_TEST_TYPE.BLOOD);
const moInfo = ref<any>([]);
const detailClassInfo =  ref<any>([]);
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const userModuleDataGet = computed(() => store.state.userModule);
const checkedClassSet = ref<Set<string>>(new Set());

watch(() => selectItems.value, async (newSelectItems) => {
  await nextTick();
  if (!isObjectEmpty(newSelectItems)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.testType);
    getMoInfo(newSelectItems, String(currentPowerType.value));
  }
}, { deep: true });

// LP or HP
watch(() => currentPowerType.value, async () => {
  await nextTick();
  if (!isObjectEmpty(selectItems.value)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.testType);
    getMoInfo(selectItems.value, String(currentPowerType.value));
  }
});

watch(() => currentImageName.value, async (newSelectedImageName) => {
  await nextTick();
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: newSelectedImageName });
  if (!isObjectEmpty(selectItems.value)) {
    getMoInfo(selectItems.value, String(currentPowerType.value));
  }
})

const getMoInfo = (selectItems: any, pageType: string) => {
  if (currentImageName.value === '' || !currentImageName.value || !selectItems) return;

  const imageName = currentImageName.value.split('.')[0];
  if (pageType === POWER_MODE.LOW_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => {
      if (item.id === '0') {
        return item.name.includes(imageName)
      }
    })[0];
  } else if (pageType === POWER_MODE.HIGH_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => {
      if (item.id === '1') {
        return item.name.includes(imageName);
      }
    })[0];
  }
  if (isObjectEmpty(moInfo.value)) return;

  const id = pageType === POWER_MODE.LOW_POWER ? '0' : '1';
  const validClassIds = getValidClassIds(currentAnalysisType.value, id);
  detailClassInfo.value = moInfo.value.classInfo.filter((item: ClassInfoType) => validClassIds.includes(item.classId));
}

const classCheck = ({ classId, isChecked }: { classId: string, isChecked: boolean }) => {
  if (isChecked) checkedClassSet.value.add(classId);
  else checkedClassSet.value.delete(classId);
  emits('checkedClassSet', checkedClassSet.value);
}

const showingByPowerAndAnalysisType = (powerType: string, analysisType: string) => {
  return currentPowerType.value === powerType && currentAnalysisType.value === analysisType && moInfo.value;
}

const checkGrade = (gradeText: string, paramGrade: string) => {
  return gradeText === paramGrade;
}

const handleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  updateGrade(updatingMoInfo, className, grade);
}

const updateGrade = async (updatingMoInfo: any, classId: string, grade: string) => {
  const filteredMoInfo = updatingMoInfo.classInfo.find((item: any) => item.classId === classId)
  updatingMoInfo.classInfo = updatingMoInfo.classInfo.map((item: any) => {
    if (item.classId === classId) {
      return { ...item, afterGrade: grade };
    }
    return item;
  })

  const updatedMoInfoObj = selectItems.value.classInfo.map((item: any) => {
    if (item.id === filteredMoInfo.id && item.name === filteredMoInfo.name) {
      return {...item, ...filteredMoInfo };
    }
    return item;
  })
  const updatedSelectItems = {
    ...selectItems.value,
    moInfo: updatedMoInfoObj
  }

  await updateRunningInfo(updatedSelectItems);
}

const updateRunningInfo = async (updatedRuningInfoObj: any) => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [updatedRuningInfoObj],
      dayQuery: dayQuery,
    })
    if (!response) {
      console.error('백엔드가 디비에 저장 실패함');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

</script>