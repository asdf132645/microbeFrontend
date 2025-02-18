<template>
  <div class="classDetailInfoContainer">

    <div class="classDetailInfo-title-container">
      <h3 class="classDetailInfo-title">{{ currentAnalysisType }} Classification</h3>
    </div>
    <div class="classInfoHorizontalRule"></div>

    <template v-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <GradeBox
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="detailClassInfo"
      />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <GradeBox
          title="Bacteria"
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="detailClassInfo"
      />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.URINE) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo?.classInfo" :key="category.classId">
        <GradeBox
            title="Cell"
            :grades="FOUR_GRADES"
            :totalClassInfo="moInfo"
            :updateGrade="updateGrade"
            :classInfo="filterClassInfoByClassIds(detailClassInfo, 'include', [CLASS_INFO_ID.WBC])"
            :isCheckable="true"
            :classCheck="classCheck"
        />
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.URINE) && !isObjectEmpty(moInfo)">
      <GradeBox
          title="Bacteria"
          :grades="FOUR_GRADES"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="filterClassInfoByClassIds(detailClassInfo, 'delete', [CLASS_INFO_ID.YEAST])"
          :isCheckable="true"
          :classCheck="classCheck"
      />

      <GradeBox
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="filterClassInfoByClassIds(detailClassInfo, 'include', [CLASS_INFO_ID.YEAST])"
          :isCheckable="true"
          :classCheck="classCheck"
      />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.SPUTUM)  && !isObjectEmpty(moInfo)">
      <h1 class="classInfoClassTitle mt24">Grade</h1>

      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo.filter((item: any) => item.classId === '90')" :key="category.classId">
        <table class="sputum-table">
            <thead>
              <th></th>
              <th v-for="column in SPUTUM_GRADES.GRADES" :key="column" width="10%;" style="margin-bottom: 4px; border-collapse: collapse">{{ column }}</th>
            </thead>
            <colgroup>
              <col width="12%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
              <col width="11%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="fs08" style="border: none;">
                  <font-awesome-icon
                      v-if="!checkedClasses[category?.classId]"
                      :icon="['fas', 'eye-slash']"
                      @click="checkClassStatus(category?.classId, 'check', category)"
                      class="w20 cursor-pointer"
                      size="lg"
                  />
                  <font-awesome-icon
                      v-else
                      :icon="['fas', 'eye']"
                      color="#29C7CA"
                      @click="checkClassStatus(category?.classId, 'disable', category)"
                      class="w20 cursor-pointer"
                      size="lg"
                  />
                </td>
                <template v-for="grade in SPUTUM_GRADES.GRADES" :key="grade">
                  <td @click="handleGradeClick(moInfo, category.classId, grade)" class="text-center relative" style="border-top: none;">
                    <font-awesome-icon
                        class="grade-dot-wrapper top-half"
                        :icon="['fac', 'half-circle-down']"
                        :class="{ 'active-before': checkGrade(category.beforeGrade, grade)}"
                        style="transform: translate(-50%, -20%)"
                        size="lg"
                    />
                    <font-awesome-icon
                        class="grade-dot-wrapper bottom-half"
                        :icon="['fac', 'half-circle-up']"
                        :class="{ 'active-after': checkGrade(category.afterGrade, grade)}"
                        style="transform: translate(-50%, -20%)"
                        size="lg"
                    />
                  </td>
                </template>

              </tr>
              <tr>
                <td class="fs10" style="border: none; text-align: left">{{ SPUTUM_GRADES.COLUMNS[1] }}</td>
                <td class="fs10" v-for="column in SPUTUM_GRADES.EPCELL_GRADES" :key="column">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs10" style="border: none; text-align: left">{{ SPUTUM_GRADES.COLUMNS[2] }}</td>
                <td class="fs10" v-for="column in SPUTUM_GRADES.WBC_GRADES" :key="column">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs09" style="border: none; text-align: left">{{ SPUTUM_GRADES.COLUMNS[3] }}</td>
                <td class="fs10" v-for="column in SPUTUM_GRADES.WBC_EPCELL_RATIO_GRADES" :key="column" style="vertical-align: center; border-bottom: none;">{{ column }}</td>
              </tr>
            </tbody>
      </table>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.SPUTUM) && !isObjectEmpty(moInfo)">
      <GradeBox
          title="Bacteria"
          :grades="FOUR_GRADES"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="filterClassInfoByClassIds(detailClassInfo, 'delete', [CLASS_INFO_ID.YEAST, CLASS_INFO_ID.HYPHAE])"
          :isCheckable="true"
          :classCheck="classCheck"
      />

      <GradeBox
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfo"
          :updateGrade="updateGrade"
          :classInfo="filterClassInfoByClassIds(detailClassInfo, 'include', [CLASS_INFO_ID.YEAST, CLASS_INFO_ID.HYPHAE])"
          :isCheckable="true"
          :classCheck="classCheck"
      />
    </template>
  </div>

  <Toast
      v-if="toastMessage"
      :message="toastMessage"
      :messageType="toastMessageType"
      :duration="1500"
      position="bottom-right"
  />
</template>

<script setup lang="ts">

import {useRoute} from "vue-router";
import {computed, defineProps, nextTick, ref, watch} from "vue";
import {
  CLASS_INFO_ID,
  FOUR_GRADES,
  GRADE_TEXT,
  MO_TEST_TYPE,
  POWER_MODE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import {isObjectEmpty} from "@/common/lib/utils/checkUtils";
import {
  filterClassInfoByClassIds,
  getCurrentAnalysisType,
  getValidClassIds
} from "@/common/lib/utils/conversionDataUtils";
import {useStore} from "vuex";
import {updateRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ClassInfoType} from "@/common/api/service/runningInfo/runningInfo.dto";
import Toast from "@/components/commonUi/Toast.vue";
import {MSG_TOAST, TOAST_MSG_TYPE} from "@/common/defines/constFile/constantMessageText";
import GradeBox from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeBox.vue";

const store = useStore();
const route = useRoute();
const props = defineProps(['selectItems'])
const emits = defineEmits();
const currentAnalysisType = ref(MO_TEST_TYPE.BLOOD);
const moInfo = ref<any>([]);
const detailClassInfo =  ref<any>([]);
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const userModuleDataGet = computed(() => store.state.userModule);
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);
const checkedClassSet = ref<Set<string>>(new Set());
const detailMemo = ref('');
const toastMessage = ref('');
const toastMessageType = ref(TOAST_MSG_TYPE.SUCCESS);
const checkedClasses = ref<any>({});

watch(() => props.selectItems, async (newSelectItems) => {
  await nextTick();
  if (!isObjectEmpty(newSelectItems)) {
    checkedClassSet.value = new Set();
    currentAnalysisType.value = getCurrentAnalysisType(newSelectItems.testType);
    getMoInfo(newSelectItems, String(currentPowerType.value));
  }
}, { deep: true });

// LP or HP
watch(() => currentPowerType.value, async () => {
  await nextTick();
  if (!isObjectEmpty(props.selectItems)) {
    checkedClassSet.value = new Set();
    currentAnalysisType.value = getCurrentAnalysisType(props.selectItems.testType);
    getMoInfo(props.selectItems, String(currentPowerType.value));
  }
});

watch(() => currentImageName.value, async () => {
  await nextTick();
  if (!isObjectEmpty(props.selectItems)) {
    checkedClassSet.value = new Set();
    getMoInfo(props.selectItems, String(currentPowerType.value));
  }
})

const getMoInfo = (selectItems: any, pageType: string) => {
  // if (currentImageName.value === '' || !currentImageName.value || !selectItems) return;

  const imageName = currentImageName.value.split('.')[0];
  if (pageType === POWER_MODE.LOW_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => {
      if (String(item.id) === '0') {
        return item.name.includes(imageName)
      }
    })[0];
  } else if (pageType === POWER_MODE.HIGH_POWER) {
    moInfo.value = selectItems.classInfo.filter((item: any) => {
      if (String(item.id) === '1') {
        return item.name.includes(imageName);
      }
    })[0];
  }
  if (isObjectEmpty(moInfo.value)) return;

  const id = pageType === POWER_MODE.LOW_POWER ? '0' : '1';
  const validClassIds = getValidClassIds(currentAnalysisType.value, id);
  detailClassInfo.value = moInfo.value.classInfo.filter((item: ClassInfoType) => validClassIds.includes(item.classId));
  detailMemo.value = moInfo.value.detailMemo;
}

const classCheck = ({ classId, isChecked }: { classId: string, isChecked: boolean }) => {
  if (isChecked) checkedClassSet.value.add(classId);
  else checkedClassSet.value.delete(classId);
  emits('checkedClassSet', checkedClassSet.value);
}

const checkClassStatus = (classId: string, type: 'check' | 'disable', category: ClassInfoType) => {
  if (type === 'check') checkedClasses.value[classId] = true;
  else checkedClasses.value[classId] = false;
  const isChecked = type === 'check' ? true : false;
  classCheck({ classId, isChecked });
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

  const updatedMoInfoObj = props.selectItems.classInfo.map((item: any) => {
    if (String(item.id) === String(filteredMoInfo.id) && item.name === filteredMoInfo.name) {
      return {...item, ...filteredMoInfo };
    }
    return item;
  })
  const updatedSelectItems = {
    ...props.selectItems,
    classInfo: updatedMoInfoObj
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
    if (!response) console.error('백엔드가 디비에 저장 실패함');
  } catch (error) {
    console.error('Error:', error);
  }
}

const showToast = async (message: string) => {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = ''; // 메시지를 숨기기 위해 빈 문자열로 초기화
  }, 1500); // 5초 후 토스트 메시지 사라짐
};


</script>