<template>
  <img class="mt1" v-if="!barCodeImageShowError" @error="onImageError" @load="onLoadImg" :src="barcodeImg"/>
  <div class="mt1" v-else-if="barCodeImageShowError" style="height: 209.5px;"></div>
  <div class="mt1 mb2 flex-justify-between">
    <h3 class="wbcClassInfoLeft">{{ currentAnalysisType }} Classification</h3>

    <ul class="leftWbcInfo">
      <li @click="barcodeCopy">
        <font-awesome-icon :icon="['fas', 'copy']"/>
      </li>
      <li class="relative">
        <font-awesome-icon :icon="['fas', 'comment-dots']" class="memoOpenBtn" @click="memoOpen"/>
        <div v-if="memoModal" class="memoModal">
          <textarea v-model="memo"></textarea>
          <button class="memoModalBtn" @click="memoChange">OK</button>
          <button class="memoModalBtn" @click="memoCancel">CANCEL</button>
        </div>
      </li>
      <li
          @click="commitConfirmed"
          :class="{'submitted': selectItems?.submitState === 'Submit',}"
      >
        <font-awesome-icon :icon="['fas', 'square-check']"/>
      </li>
      <li
          @click="lisModalOpen"
          :class="{'submitted': selectItems?.submitState === 'lis' || lisBtnColor,}"
      >
        <font-awesome-icon :icon="['fas', 'upload']"/>
      </li>
    </ul>
  </div>

<!-- 무조건 Total 값으로 계산 -->
  <div class="classInfoDetailContainer">
    <div class="classInfoDetailTop">
      <h3>Category</h3>
      <h3>Grade</h3>
    </div>

    <template v-if="currentAnalysisType === MO_TEST_TYPE.BLOOD && !isObjectEmpty(moInfoTotal)">
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST)" />
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST)" />
    </template>


    <template v-else-if="currentAnalysisType === MO_TEST_TYPE.URINE && !isObjectEmpty(moInfoTotal)">
      <GradeInputWithTitle :grades="FOUR_GRADES" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId !== CLASS_INFO_ID.YEAST)" />
      <GradeInputWithTitle :grades="[GRADE_TEXT.EXIST]" :moInfo="moInfoTotal" @updateGrade="updateGrade" :classInfo="moInfoTotal?.classInfo.filter((item: any) => item.classId === CLASS_INFO_ID.YEAST)" />
    </template>

    <template v-else-if="currentAnalysisType === MO_TEST_TYPE.SPUTUM && !isObjectEmpty(moInfoTotal)">
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
    </template>

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
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue';
import { getBarcodeDetailImageUrl, getCurrentAnalysisType } from "@/common/lib/utils/conversionDataUtils";
import { barcodeImgDir } from "@/common/defines/constFile/settings/settings";

import { detailRunningApi, updateRunningApi } from "@/common/api/service/runningInfo/runningInfoApi";
import { useStore } from "vuex";
import { MESSAGES } from "@/common/defines/constFile/constantMessageText";
import Alert from "@/components/commonUi/Alert.vue";
import Confirm from "@/components/commonUi/Confirm.vue";
import moment from 'moment';
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import {LocationQueryValue, useRoute} from "vue-router";
import {
  CLASS_INFO_ID,
  FOLDER_NAME,
  FOUR_GRADES, GRADE_TEXT,
  MO_TEST_TYPE,
  POWER_MODE,
  SPUTUM_GRADES
} from "@/common/defines/constFile/dataBase";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import GradeInputWithTitle from "@/views/datebase/commponent/detail/classInfo/commonGrade/gradeInputWithTitle.vue";
import {readJsonFile} from "@/common/api/service/fileReader/fileReaderApi";

const store = useStore();
const route = useRoute();
const props = defineProps(['type', 'isCommitChanged']);
const emits = defineEmits();
const userModuleDataGet = computed(() => store.state.userModule);


const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const barcodeImg = ref('');
const memo = ref('');
const memoModal = ref(false);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmType = ref('');
const confirmMessage = ref('');
const okMessageType = ref('');
const barCodeImageShowError = ref(false);
const submittedScreen = ref(false);
const lisBtnColor = ref(false);
const currentAnalysisType = ref(MO_TEST_TYPE.URINE);
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>(POWER_MODE.LOW_POWER);
const moInfoTotal = ref<any>([]);
const classPositionArr = ref<any>([]);
const checkedClassSet = ref<Set<string>>(new Set());

onMounted(async () => {
  await nextTick();
  currentPowerType.value = route.query.pageType;
  setBarcodeImage();

  if (!isObjectEmpty(selectItems.value)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.testType);
    getTotalMoInfo(selectItems.value);
  }
})

// watch(() => props.isCommitChanged, () => {
//   selectItems.value?.submitState = 'Submit';
// })

watch(() => currentImageName.value, async () => {
  await getClassPosition();
})

watch(() => [route.query.pageType, route.name], async () => {
  await nextTick();
  currentPowerType.value = route.query.pageType;
  if (!isObjectEmpty(selectItems.value)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.testType);
    getTotalMoInfo(selectItems.value);
  }
})

watch(() => selectItems.value, async (newSelectItems) => {
  await nextTick();

  if (!isObjectEmpty(newSelectItems)) {
    currentAnalysisType.value = getCurrentAnalysisType(newSelectItems.testType);
    getTotalMoInfo(newSelectItems);
    memo.value = selectItems.value?.memo;
    /** TODO 바코드 이미지 */
    // testAfterBarcodeImage(props.selectItems?.img_drive_root_path);

    await store.dispatch('commonModule/setCommonInfo', {testType: selectItems.value?.testType});
    if (selectItems.value?.submitState === "" || !selectItems.value?.submitState) {
      const result: any = detailRunningApi(String(selectItems.value?.id));
      const updatedItem = { id: selectItems.value.id ,submitState: 'checkFirst' };
      const updatedRuningInfo = {...result.data, ...updatedItem}
      await resRunningItem(updatedRuningInfo, true);
    }
    barCodeImageShowError.value = false;
  }
}, { deep: true });

const getTotalMoInfo = (newSelectItems: any) => {
  moInfoTotal.value = newSelectItems?.classInfo.find((item: any) => item.id === '2');
}

const setBarcodeImage = () => {
  const imgDriveRootPath = selectItems.value?.img_drive_root_path
  const path = imgDriveRootPath !== '' && imgDriveRootPath ? imgDriveRootPath : iaRootPath.value;
  barcodeImg.value = getBarcodeDetailImageUrl('barcode_image.jpg', path, selectItems.value?.slotId, barcodeImgDir.barcodeDirName);
}

const lisModalOpen = () => {
  showConfirm.value = true;
  confirmMessage.value = MESSAGES.IDS_MSG_UPLOAD_LIS;
  okMessageType.value = 'lis';
}

const barcodeCopy = async () => {
  const textarea = document.createElement('textarea');
  textarea.value = selectItems.value.barcodeNo;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showSuccessAlert(MESSAGES.SUCCESS_ALERT);
}

const commitConfirmed = () => {
  submittedScreen.value = true;
  showConfirm.value = true;
  confirmMessage.value = MESSAGES.IDS_MSG_CONFIRM_SLIDE;
  okMessageType.value = 'commit';
}

const handleOkConfirm = () => {
  onCommit();
  showConfirm.value = false;
}

const hideConfirm = () => {
  showConfirm.value = false;
}

const onCommit = async () => {
  const localTime = moment().local();
  const result: any = await detailRunningApi(String(selectItems.value?.id));
  const updatedItem = {
    submitState: 'Submit',
    submitOfDate: localTime.format(),
    submitUserId: userModuleDataGet.value.name,
  };
  const updatedRuningInfo = {...result.data, ...updatedItem}
  await resRunningItem(updatedRuningInfo);

  // selectItems.value?.submitState = 'Submit';
  emits('submitStateChanged', 'Submit');
}

const memoChange = async () => {
  const enterAppliedmemo = memo.value.replaceAll('\r\n', '<br>');
  const updatedItem = { memo: enterAppliedmemo };
  const result: any = await detailRunningApi(String(selectItems.value?.id));
  const updatedRuningInfo = {...result.data, ...updatedItem}

  await resRunningItem(updatedRuningInfo);
  memoModal.value = false;
}

const memoOpen = () => {
  memoModal.value = !memoModal.value;
}

const memoCancel = () => {
  memoModal.value = false;
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

  await resRunningItem(updatedSelectItems, true);
}

const getClassPosition = async () => {
  const folderName = currentPowerType.value === POWER_MODE.HIGH_POWER ? FOLDER_NAME.HIGH_POWER : FOLDER_NAME.LOW_POWER;
  const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : iaRootPath.value;
  const positionUrl = `${path}/${selectItems.value.slotId}/${folderName}/${currentImageName.value}.json`;

  const response = await readJsonFile({ fullPath: positionUrl });
  if (response.data !== 'not file') {
    const newJsonData = response.data;
  }

  classPositionArr.value = null;
}

const resRunningItem = async (updatedRuningInfo: any, noAlert?: boolean) => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [updatedRuningInfo],
      dayQuery: dayQuery,
    })
    if (response) {
      if (!noAlert) {
        showSuccessAlert(MESSAGES.SUCCESS_ALERT);
      }
      memo.value = updatedRuningInfo.memo;
    } else {
      console.error('백엔드가 디비에 저장 실패함');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
  alertMessage.value = message;
  window.scrollTo({top: 0, behavior: 'smooth'});
};

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

</script>