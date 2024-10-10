<template>
  <div style="width: 450px;">
    <template v-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.BLOOD)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo?.classInfo" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>

        <label class="mt24">Exist</label>
        <div class="flex-column-center mt12" v-for="item in moInfo?.classInfo" :key="item?.classNm">
          <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
            <div
                @click="handleToggleGradeClick(moInfo, item.classNm, item[`${databaseDetailBeforeAfterStatus}Grade`])"
                class="grade-dot-wrapper"
                :class="{ active: checkToggleGrade(item[`${databaseDetailBeforeAfterStatus}Grade`])}"
            >
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.BLOOD)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <label class="mt24">Exist</label>
      </div>
      <div class="w-full mt12 flex-align-center-justify-start" v-for="category in moInfo?.classInfo" :key="category?.classNm">
        <label class="text-start w210">{{ category?.classNm }}</label>
        <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
          <div
              @click="handleToggleGradeClick(moInfo, category.classNm, category[`${databaseDetailBeforeAfterStatus}Grade`])"
              class="grade-dot-wrapper"
              :class="{ active: checkToggleGrade(category[`${databaseDetailBeforeAfterStatus}Grade`])}"
          >
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.URINE)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>
        <template v-if="category.classNm === moCategory.WBC">
          <div class="w-full mt12 flex-column-center" v-for="category in moInfo?.classInfo.filter((it: any) => it.classNm === 'WBC')" :key="category?.classNm">
            <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
              <template v-for="grade in FOUR_GRADES" :key="grade">
                <div class="flex-column-center">
                  <div>{{ grade }}</div>
                  <div
                      @click="handleGradeClick(moInfo, category.classNm, grade)"
                      class="grade-dot-wrapper mt12"
                      :class="{ active: checkGrade(grade, category[`${databaseDetailBeforeAfterStatus}Grade`])}"
                  >
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-if="category.classNm === 'Yeast'">
          <div v-for="category in moInfo?.classInfo.filter((it: any) => it.classNm === 'Yeast')" :key="category.classNm" class="w-full flex-column-center mb14">
            <p class="mt12" style="width: 340px;">Exist</p>
            <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
              <div
                  @click="handleToggleGradeClick(moInfo, category.classNm, category[`${databaseDetailBeforeAfterStatus}Grade`])"
                  class="grade-dot-wrapper"
                  :class="{ active: checkToggleGrade(category[`${databaseDetailBeforeAfterStatus}Grade`])}"
              >
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.URINE)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>
      <div class="flex-justify-center gap40 mt22">
        <h3 v-for="grade in FOUR_GRADES" :key="grade">{{ grade }}</h3>
      </div>

      <div class="w-full mt12 flex-align-center-justify-start gap40" v-for="category in moInfo?.classInfo" :key="category?.classNm">
        <h3>{{ category?.classNm }}</h3>
        <div class="grade-container flex-justify-center" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
          <template v-for="grade in FOUR_GRADES" :key="grade">
            <div
                @click="handleGradeClick(moInfo, category.classNm, grade)"
                class="grade-dot-wrapper w-full flex-column-center"
                :class="{ active: checkGrade(grade, category[`${databaseDetailBeforeAfterStatus}Grade`])}"
            ></div>
          </template>
        </div>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.SPUTUM)">
      <h1 class="fs12 classInfoClassTitle">Sputum</h1>
      <div class="classInfoHorizontalRule"></div>

      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo.filter((item: any) => item.classNm === 'Sputum')" :key="category.classNm">
        <div class="table-container">
          <table>
            <tr>
              <th></th>
              <th v-for="column in SPUTUM_GRADES.GRADES" :key="column">{{ column }}</th>
            </tr>
            <tr>
              <td class="row-header">Sputum</td>
              <td
                  v-for="grade in SPUTUM_GRADES.GRADES"
                  :key="grade"
                  @click="handleGradeClick(moInfo, category.classNm, grade)"
                  class="grade-dot-wrapper"
                  :class="{ active: checkGrade(grade, category[`${databaseDetailBeforeAfterStatus}Grade`])}"
              >
              </td>
            </tr>
            <tr>
              <td class="row-header">EP Cell</td>
              <td v-for="column in SPUTUM_GRADES.EPCELL_GRADES" :key="column">{{ column }}</td>
            </tr>
            <tr>
              <td class="row-header">WBC</td>
              <td v-for="column in SPUTUM_GRADES.WBC_GRADES" :key="column">{{ column }}</td>
            </tr>
            <tr>
              <td class="row-header">WBC/EP Cell</td>
              <td v-for="column in SPUTUM_GRADES.WBC_EPCELL_RATIO_GRADES" :key="column">{{ column }}</td>
            </tr>
          </table>
        </div>
      </div>

      <template v-for="category in moInfo.classInfo.filter((item: any) => item.classNm === 'Yeast' || item.classNm === 'Hyphae')" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>
        <label class="mt24">Exist</label>
        <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
          <div
              @click="handleToggleGradeClick(moInfo, category.classNm, category[`${databaseDetailBeforeAfterStatus}Grade`])"
              class="grade-dot-wrapper"
              :class="{ active: checkToggleGrade(category[`${databaseDetailBeforeAfterStatus}Grade`])}"
          >
          </div>
        </div>
      </template>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.SPUTUM)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <ul class="w-full flex-justify-end" style="gap: 24px;">
          <li v-for="type in FOUR_GRADES" :key="type" class="flex-justify-center">{{ type }}</li>
        </ul>
      </div>
      <div class="w-full mt24 flex-align-center-justify-start" v-for="category in moInfo?.classInfo" :key="category?.classNm">
        <label style="width: 240px;">{{ category?.classNm }}</label>
        <div class="grade-container" :class="{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === BEFORE_AFTER_STATUS.BEFORE} ">
          <div
              v-for="grade in FOUR_GRADES"
              :key="grade"
              @click="handleGradeClick(moInfo, category.classNm, grade)"
              class="grade-dot-wrapper"
              :class="{ active: checkGrade(grade, category[`${databaseDetailBeforeAfterStatus}Grade`])}"
          >
          </div>
        </div>
      </div>
    </template>
  </div>

</template>

<script setup lang="ts">

import { LocationQueryValue, useRoute } from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {
  BEFORE_AFTER_STATUS,
  FOUR_GRADES,
  moCategory,
  MO_TEST_TYPE,
  POWER_MODE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import { calculateSputumStatus } from "@/common/lib/utils/changeData";
import { getCurrentAnalysisType } from "@/common/lib/utils/conversionDataUtils";
import { useStore } from "vuex";
import ExistInput from "@/views/datebase/commponent/detail/classInfo/commonClassInfoInputBox/existInput.vue";
import FourGradeInput from "@/views/datebase/commponent/detail/classInfo/commonClassInfoInputBox/fourGradeInput.vue";
import {updateRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";

const store = useStore();
const route = useRoute();
const props = defineProps(['selectedImageName']);
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>('');
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const currentAnalysisType = ref(MO_TEST_TYPE.BLOOD);
const moInfo = ref<any>([]);
const sputumStatus = ref('1');
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
    moInfo.value = selectItems.moInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '0')[0];
    if (currentAnalysisType.value === MO_TEST_TYPE.SPUTUM && moInfo.value) {
      sputumStatus.value = calculateSputumStatus(moInfo.value.classInfo);
    }
  } else if (currentPowerType.value === POWER_MODE.HIGH_POWER) {
    moInfo.value = selectItems.moInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '1')[0];
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

  const updatedMoInfoObj = selectItems.value.moInfo.map((item: any) => {
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
<style scoped>
.table-container {
  font-family: Arial, sans-serif;
  color: white;
  background-color: #333;
  padding: 20px;
  border-radius: 4px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #555;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #444;
}

.row-header {
  text-align: left;
  padding-left: 15px;
  font-weight: bold;
}
</style>