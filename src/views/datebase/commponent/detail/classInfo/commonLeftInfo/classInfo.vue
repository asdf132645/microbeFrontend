<template>
  <img class="classInfo-barcode-img" v-if="!barCodeImageShowError" @error="onImageError" @load="onLoadImg" :src="barcodeImg"/>
  <div class="mt10" v-else style="height: 204px;"></div>
  <div class="classInfo-title-container">
    <h3 class="wbcClassInfoLeft">{{ currentAnalysisType }} Total Classification</h3>

    <ul class="leftWbcInfo">
      <li
          class="relative"
          @mouseenter="tooltipVisibleFunc('barcodeCopy', true)"
          @mouseleave="tooltipVisibleFunc('barcodeCopy', false)"
      >
        <font-awesome-icon @click="barcodeCopy" :icon="['fas', 'copy']" class="hoverSizeAction" />
        <Tooltip :isVisible="tooltipVisible.barcodeCopy" className="mb08" :message="MSG.TOOLTIP.BARCODE_COPY" />
      </li>

      <li
          class="relative"
          @mouseenter="tooltipVisibleFunc('memo', true)"
          @mouseleave="tooltipVisibleFunc('memo', false)"
      >
        <font-awesome-icon class="hoverSizeAction" :icon="['fas', 'pen-to-square']" @mousedown.stop @click="memoOpen" />
        <Tooltip :isVisible="tooltipVisible.memo" className="mb08" position="top" type="" :message="MSG.TOOLTIP.MEMO" />
      </li>
      <MemoBox
          v-model:memo="memo"
          :showMemoModal="showMemoModal"
          @saveMemo="handleMemoSave"
          @closeMemo="handleCloseMemo"
      />
      <li
          @click="commitConfirmed"
          class="relative"
          :class="{'submitted': selectItems?.submitState === 'Submit',}"
          @mouseenter="tooltipVisibleFunc('confirm', true)"
          @mouseleave="tooltipVisibleFunc('confirm', false)"
      >
        <font-awesome-icon class="hoverSizeAction" :icon="['fas', 'square-check']"/>
        <Tooltip :isVisible="tooltipVisible.confirm" className="mb08" position="top" type="" :message="MSG.TOOLTIP.CONFIRM" />
      </li>
    </ul>
  </div>
  <div class="classInfoHorizontalRule"></div>

<!-- 무조건 Total 값으로 계산 -->
  <div class="classInfoDetailContainer">
    <div v-if="currentAnalysisType === MO_TEST_TYPE.BLOOD && !isObjectEmpty(moInfoTotal)" class="classInfo-grade-wrapper">
      <GradeBox
          title="Cell"
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfoTotal"
          :updateGrade="updateGrade"
          :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST)"
      />
      <GradeBox
          title="Cell"
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfoTotal"
          :updateGrade="updateGrade"
          :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST)"
      />
    </div>


    <div v-else-if="currentAnalysisType === MO_TEST_TYPE.URINE && !isObjectEmpty(moInfoTotal)" class="classInfo-grade-wrapper">
      <GradeBox
          title="Cell"
          :grades="FOUR_GRADES"
          :totalClassInfo="moInfoTotal"
          :updateGrade="updateGrade"
          :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.WBC)"
      />
      <GradeBox
          title="Bacteria"
          :grades="FOUR_GRADES"
          :totalClassInfo="moInfoTotal"
          :updateGrade="updateGrade"
          :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST && item.classId !== CLASS_INFO_ID.WBC)"
      />
      <GradeBox
          title="Fungi"
          :grades="[GRADE_TEXT.EXIST]"
          :totalClassInfo="moInfoTotal"
          :updateGrade="updateGrade"
          :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST)"
      />
    </div>

    <div v-else-if="currentAnalysisType === MO_TEST_TYPE.SPUTUM && !isObjectEmpty(moInfoTotal)" class="classInfo-grade-wrapper">
      <div class="w-full flex-align-center-justify-start" v-for="category in moInfoTotal" :key="category.classId">
        <template v-if="category.classId === '15'">
          <div class="classDetailInfoWrapper w-full" v-for="category in moInfoTotal?.classInfo.filter((item: any) => item.classId === '15')" :key="category.classId">
            <table class="no-css-table">
              <thead>
                <th></th>
                <th v-for="column in SPUTUM_GRADES.GRADES" :key="column" width="8%;">{{ column }}</th>
              </thead>
              <colgroup>
                <col width="2%" />
                <col width="4%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
              </colgroup>
              <tbody>
              <tr>
                <td class="text-left">Sputum</td>
                <template v-for="grade in SPUTUM_GRADES.GRADES" :key="grade">
                  <td @click="handleGradeClick(moInfoTotal, category.classId, grade)">
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
                <td class="text-center fs08" v-for="column in SPUTUM_GRADES.EPCELL_GRADES" :key="column">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs08">WBC</td>
                <td class="text-center fs08" v-for="column in SPUTUM_GRADES.WBC_GRADES" :key="column">{{ column }}</td>
              </tr>
              <tr>
                <td class="fs08">WBC / EP Cell</td>
                <td class="text-center fs08" v-for="column in SPUTUM_GRADES.WBC_EPCELL_RATIO_GRADES" :key="column">{{ column }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>

      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.GPC || item.classId === CLASS_INFO_ID.GNB || item.classId === CLASS_INFO_ID.GPB || item.classId === CLASS_INFO_ID.GNDC)" />
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST || item.classId === CLASS_INFO_ID.HYPHAE)" />
    </div>

  </div>

  <Alert
      v-if="showAlert"
      :is-visible="showAlert"
      :type="alertType"
      :message="alertMessage"
      @hide="hideAlert"
      @update:hideAlert="hideAlert"
  />
  <Confirm
      v-if="showConfirm"
      :is-visible="showConfirm"
      :type="confirmType"
      :message="confirmMessage"
      @hide="hideConfirm"
      @okConfirm="handleOkConfirm"
  />

  <Toast
      v-if="toastMessage"
      :message="toastMessage"
      :messageType="toastMessageType"
      :duration="1500"
      position="bottom-right"
  />
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, nextTick, onMounted, ref, watch} from 'vue';
import { getCurrentAnalysisType, getImageUrl } from "@/common/lib/utils/conversionDataUtils";
import { barcodeImgDir } from "@/common/defines/constFile/settings/settings";

import { detailRunningApi, updateRunningApi } from "@/common/api/service/runningInfo/runningInfoApi";
import { useStore } from "vuex";
import {MESSAGES, MSG, MSG_TOAST, TOAST_MSG_TYPE} from "@/common/defines/constFile/constantMessageText";
import Alert from "@/components/commonUi/Alert.vue";
import Confirm from "@/components/commonUi/Confirm.vue";
import moment from 'moment';
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import { useRoute } from "vue-router";
import {
  CLASS_INFO_ID,
  FOUR_GRADES, GRADE_TEXT,
  MO_TEST_TYPE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";
import Toast from "@/components/commonUi/Toast.vue";
import GradeBox from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeBox.vue";
import MemoBox from "@/components/commonUi/MemoBox.vue";
import type { TooltipClassInfoType } from "@/common/type/tooltipType";
import Tooltip from "@/components/commonUi/Tooltip.vue";

const store = useStore();
const route = useRoute();
const props = defineProps(['type', 'selectItems']);
const emits = defineEmits();
const userModuleDataGet = computed(() => store.state.userModule);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);
const barcodeImg = ref('');
const memo = ref('');
const showMemoModal = ref(false);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmType = ref('');
const confirmMessage = ref('');
const okMessageType = ref('');
const barCodeImageShowError = ref(false);
const submittedScreen = ref(false);
const currentAnalysisType = ref(MO_TEST_TYPE.URINE);
const moInfoTotal = ref<any>([]);
const toastMessage = ref('');
const toastMessageType = ref(TOAST_MSG_TYPE.SUCCESS);
const tooltipVisible = ref<TooltipClassInfoType>({
  barcodeCopy: false,
  memo: false,
  confirm: false,
  classMoveLock: false,
  beforeCountPercent: false,
  afterCountPercent: false,
  lisUpload: false,
})

onMounted(async () => {
  await nextTick();
  if (!isObjectEmpty(props.selectItems)) {
    setBarcodeImage();
    currentAnalysisType.value = getCurrentAnalysisType(props.selectItems.testType);
    getTotalMoInfo(props.selectItems);
  }
})

watch([() => currentPowerType.value, () => route.name], async () => {
  await nextTick();
  if (!isObjectEmpty(props.selectItems)) {
    currentAnalysisType.value = getCurrentAnalysisType(props.selectItems.testType);
    getTotalMoInfo(props.selectItems);
  }
})

watch(() => props.selectItems, async (newSelectItems) => {
  await nextTick();
  if (!isObjectEmpty(newSelectItems)) {
    currentAnalysisType.value = getCurrentAnalysisType(newSelectItems.testType);
    getTotalMoInfo(newSelectItems);
    memo.value = props.selectItems?.memo;
    setBarcodeImage();
    await store.dispatch('commonModule/setCommonInfo', {testType: props.selectItems?.testType});
    if (props.selectItems?.submitState === "" || !props.selectItems?.submitState) {
      const result: any = detailRunningApi(String(props.selectItems?.id));
      const updatedItem = { id: props.selectItems?.id ,submitState: 'checkFirst' };
      const updatedRuningInfo = {...result.data, ...updatedItem}
      await resRunningItem({ updatedRunningInfo: updatedRuningInfo, noAlert: true });
    }
    barCodeImageShowError.value = false;
  }
}, { deep: true });

const getTotalMoInfo = (newSelectItems: any) => {
  moInfoTotal.value = newSelectItems?.classInfo.find((item: any) => String(item.id) === '2');
}

const setBarcodeImage = () => {
  const path = props.selectItems?.img_drive_root_path || iaRootPath.value;
  const imageUrl = getImageUrl('barcode_image.jpg', path, props.selectItems?.slotId, barcodeImgDir.barcodeDirName);
  barcodeImg.value = imageUrl;
  preloadImage(imageUrl);

}

const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
}

const barcodeCopy = async () => {
  const textarea = document.createElement('textarea');
  textarea.value = props.selectItems.barcodeNo;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  toastMessageType.value = TOAST_MSG_TYPE.SUCCESS;
  await showToast(MSG_TOAST.BAR_CODE_SUCCESS);
}

const commitConfirmed = () => {
  submittedScreen.value = true;
  showConfirm.value = true;
  confirmMessage.value = MESSAGES.IDS_MSG_CONFIRM_SLIDE;
  okMessageType.value = 'commit';
}

const handleOkConfirm = () => {
  if (okMessageType.value == 'commit') onCommit();
  showConfirm.value = false;
}

const hideConfirm = () => {
  showConfirm.value = false;
}

const onCommit = async () => {
  const localTime = moment().local();
  const result: any = await detailRunningApi(String(props.selectItems?.id));
  const updatedItem = {
    submitState: 'Submit',
    submitOfDate: localTime.format(),
    submitUserId: userModuleDataGet.value.name,
  };
  const updatedRuningInfo = {...result.data, ...updatedItem}
  await resRunningItem({ updatedRunningInfo: updatedRuningInfo, type: 'commit' });

  // selectItems.value?.submitState = 'Submit';
  emits('submitStateChanged', 'Submit');
}

const handleMemoSave = async (memo: string) => {
  const enterAppliedmemo = memo.replaceAll('\r\n', '<br>');
  const updatedItem = { memo: enterAppliedmemo };
  const result: any = await detailRunningApi(String(props.selectItems?.id));
  const updatedRuningInfo = {...result.data, ...updatedItem}
  await resRunningItem({ updatedRunningInfo: updatedRuningInfo, type: 'memo' });
  showMemoModal.value = false;
}

const memoOpen = () => {
  showMemoModal.value = !showMemoModal.value;
}

const handleCloseMemo = () => {
  showMemoModal.value = false;
}

const checkGrade = (gradeText: string, paramGrade: string) => {
  return gradeText === paramGrade;
}

const handleGradeClick = (updatingMoInfo: any, classId: string, grade: string) => {
  updateGrade(updatingMoInfo, classId, grade);
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
    moInfo: updatedMoInfoObj
  }

  await resRunningItem({ updatedRunningInfo: updatedSelectItems, noAlert: true });
}

const resRunningItem = async ({ updatedRunningInfo, noAlert, type }: {updatedRunningInfo: any; noAlert?: boolean; type?: 'commit' | 'memo'}) => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [updatedRunningInfo],
      dayQuery: dayQuery,
    })
    if (response) {
      if (!noAlert) {
        if (type === 'commit') {
          toastMessageType.value = TOAST_MSG_TYPE.SUCCESS;
          await showToast(MSG_TOAST.SUCCESS);
        } else if (type === 'memo') {
          toastMessageType.value = TOAST_MSG_TYPE.SUCCESS;
          await showToast(MSG_TOAST.SAVED);
        }
      }
      memo.value = updatedRunningInfo.memo;
    } else {
      console.error('백엔드가 디비에 저장 실패함');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_ERROR;
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};

const onImageError = () => {
  barCodeImageShowError.value = true;
}

const onLoadImg = () => {
  barCodeImageShowError.value = false;
}

const showToast = async (message: string) => {
  toastMessage.value = message;
  setTimeout(() => {
    toastMessage.value = ''; // 메시지를 숨기기 위해 빈 문자열로 초기화
  }, 1500); // 5초 후 토스트 메시지 사라짐
};

const tooltipVisibleFunc = (type: keyof TooltipClassInfoType, visible: boolean) => {
  tooltipVisible.value[type] = visible;
}

</script>