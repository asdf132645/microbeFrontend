<template>
  <div class="classDetailInfoContainer">
    <template v-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <h1 class="fs12 classInfoClassTitle">Fungi</h1>
      <div class="classInfoHorizontalRule"></div>
      <GradeInputNoTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="detailClassInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.HIGH_POWER, MO_TEST_TYPE.BLOOD) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Bacteria</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="detailClassInfo" />
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(POWER_MODE.LOW_POWER, MO_TEST_TYPE.URINE) && !isObjectEmpty(moInfo)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo?.classInfo" :key="category.classId">
        <h1 class="fs12 classInfoClassTitle">{{ getClassTitle(category.classId)  }}</h1>
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
      <div v-show="moInfo?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST).length > 0">
        <h1 class="fs12 classInfoClassTitle">Bacteria</h1>
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

      <div v-show="moInfo?.classInfo.filter((it: any) => it.classId === CLASS_INFO_ID.YEAST).length > 0">
        <h1 class="fs12 classInfoClassTitle">Fungi</h1>
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
        <h1 class="fs12 classInfoClassTitle">Bacteria</h1>
        <div class="classInfoHorizontalRule"></div>
      </div>

      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfo" @updateGrade="updateGrade" :classInfo="moInfo?.classInfo" />
    </template>

    <div class="detailMemo-container">
      <textarea  v-model="detailMemo" class="detailMemo-textarea"></textarea>
      <button @click="updateDetailMemo" class="detailMemo-button">Save</button>
    </div>
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
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";
import GradeInputNoTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputNoTitle.vue";
import {ClassInfoType} from "@/common/api/service/runningInfo/runningInfo.dto";
import Toast from "@/components/commonUi/Toast.vue";
import {MSG_TOAST, TOAST_MSG_TYPE} from "@/common/defines/constFile/constantMessageText";

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

const getClassTitle = (classInfoId: string) => {
  switch (classInfoId) {
    case CLASS_INFO_ID.WBC:
      return 'Cell';
    case CLASS_INFO_ID.YEAST:
      return 'Fungi';
    default:
      return 'Bacteria';
  }
}

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
  detailMemo.value = moInfo.value.detailMemo;
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

const updateDetailMemo = async () => {
  const updatedMoInfoObj = props.selectItems.classInfo.map((item: any) => {
    if (item.id === moInfo.value.id && item.name === moInfo.value.name) {
      return {...item, detailMemo: detailMemo.value };
    }
    return item;
  })

  moInfo.value.detailMemo = detailMemo.value;

  const updatedSelectItems = {
    ...props.selectItems,
    classInfo: updatedMoInfoObj
  }

  updateRunningInfo(updatedSelectItems);
  toastMessageType.value = TOAST_MSG_TYPE.SUCCESS;
  await showToast(MSG_TOAST.SUCCESS);
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
    if (item.id === filteredMoInfo.id && item.name === filteredMoInfo.name) {
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