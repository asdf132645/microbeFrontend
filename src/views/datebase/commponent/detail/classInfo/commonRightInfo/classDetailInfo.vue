<template>
  <div style="width: 450px;">
    <template v-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.BLOOD)">
      <h1 class="fs12 classInfoClassTitle">{{ MO_CATEGORY.YEAST }}</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.BLOOD)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.URINE)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>
        <template v-if="category.classNm === MO_CATEGORY.WBC">
          <GradeInputNoTitle :grades="FOUR_GRADES" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((it: any) => it.classNm === MO_CATEGORY.WBC)" />
        </template>
        <template v-if="category.classNm === MO_CATEGORY.YEAST">
          <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((it: any) => it.classNm === MO_CATEGORY.YEAST)" />
        </template>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.URINE)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>
      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>


    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.SPUTUM)">
      <h1 class="fs12 classInfoClassTitle mt24">Sputum</h1>
      <div class="classInfoHorizontalRule"></div>

      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo.filter((item: any) => item.classNm === 'Sputum')" :key="category.classNm">
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
                  <td @click="handleGradeClick(moInfo, category.classNm, grade)">
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
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((item: any) => item.classNm === MO_CATEGORY.YEAST)" />

      <h1 class="fs12 classInfoClassTitle">Hyphae</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo.filter((item: any) => item.classNm === MO_CATEGORY.HYPHAE)" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.SPUTUM)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>

      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>
  </div>

</template>

<script setup lang="ts">

import { LocationQueryValue, useRoute } from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {
  FOUR_GRADES, GRADE_TEXT,
  MO_CATEGORY,
  MO_TEST_TYPE,
  POWER_MODE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import { getCurrentAnalysisType } from "@/common/lib/utils/conversionDataUtils";
import { useStore } from "vuex";
import {updateRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";
import GradeInputNoTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputNoTitle.vue";

const store = useStore();
const route = useRoute();
const props = defineProps(['selectedImageName']);
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>('');
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const currentAnalysisType = ref(MO_TEST_TYPE.BLOOD);
const moInfo = ref<any>([]);
const currentSelectedImageName = ref('');
const userModuleDataGet = computed(() => store.state.userModule);
const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

onMounted(() => {
  currentPowerType.value = route.query.pageType;
})

watch(() => selectItems.value, async (newSelectItems) => {
  await nextTick();
  if (!isObjectEmpty(newSelectItems)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value?.cassetId);
    getMoInfo(newSelectItems);
  }
}, { deep: true });

// LP or HP
watch(() => route.query.pageType, async (newPageType) => {
  await nextTick();
  currentPowerType.value = newPageType;
  if (!isObjectEmpty(selectItems.value)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.cassetId);
    getMoInfo(selectItems.value);
  }
})

watch(() => props.selectedImageName, async (newSelectedImageName) => {
  await nextTick();
  currentSelectedImageName.value = newSelectedImageName;
  if (!isObjectEmpty(selectItems.value)) {
    getMoInfo(selectItems.value);
  }
})

const getMoInfo = (selectItems: any) => {
  if (currentPowerType.value === POWER_MODE.LOW_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '0')[0];
  } else if (currentPowerType.value === POWER_MODE.HIGH_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '1')[0];
  }
}

const showingByPowerAndAnalysisType = (powerType: string, analysisType: string) => {
  return currentPowerType.value === powerType && currentAnalysisType.value === analysisType && moInfo.value;
}

const checkGrade = (gradeText: string, paramGrade: string) => {
  return gradeText === paramGrade;
}

const checkToggleGrade = (currentGrade: string | boolean) => {
  return currentGrade === 'Exist' || currentGrade === true;
}

const handleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  updateGrade(updatingMoInfo, className, grade);
}

const handleToggleGradeClick = (updatingMoInfo: any, className: string, grade: string) => {
  const newGrade = grade === 'Exist' ? 'None' : 'Exist';
  updateGrade(updatingMoInfo, className, newGrade);
}

const updateGrade = async (updatingMoInfo: any, className: string, grade: string) => {
  const filteredMoInfo = updatingMoInfo.classInfo.find((item: any) => item.classNm === className)
  updatingMoInfo.classInfo = updatingMoInfo.classInfo.map((item: any) => {
    if (item.classNm === className) {
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