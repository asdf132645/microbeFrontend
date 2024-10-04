<template>
  <img class="mt1" v-if="!barCodeImageShowError" @error="onImageError" @load="onLoadImg" :src="barcodeImg"/>
  <div class="mt1" v-else-if="barCodeImageShowError" style="height: 209.5px;"></div>
  <div class="mt1 mb2 flex-justify-between">
    <h3 class="wbcClassInfoLeft">
      Micro-organism Smear total Report
    </h3>

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
      <li>
        <font-awesome-icon :icon="['fas', 'lock']" v-if="!toggleLock" @click="toggleLockEvent"/>
        <font-awesome-icon :icon="['fas', 'lock-open']" v-if="toggleLock" @click="toggleLockEvent"/>
      </li>
    </ul>
  </div>

<!-- 무조건 Total 값으로 계산 -->
  <div class="classInfoDetailContainer">
    <div class="classInfoDetailTop">
      <h3>Category</h3>
      <h3>Grade</h3>
    </div>

    <div v-if="currentAnalysisType === moTestType.BLOOD">
      <h3 class="ml320 mt30" style="height: 40px;">Exist</h3>
      <ExistInput :moInfo="moInfoTotal.classInfo.filter((item: any) => item.classNm !== moCategory.YEAST)" @handleClickGrade="handleClickGrade" />
      <div class="mt22"></div>
      <ExistInput :moInfo="moInfoTotal.classInfo.filter((item: any) => item.classNm === moCategory.YEAST)" @handleClickGrade="handleClickGrade" />
    </div>

    <div v-else-if="currentAnalysisType === moTestType.URINE && moInfoTotal.classInfo">
      <div class="flex-justify-around ml150">
        <div v-for="grade in fourGrades" :key="grade" class="w-full flex-justify-center mb14">
          <h3>{{ grade }}</h3>
        </div>
      </div>

      <div class="w-full flex-align-center-justify-start mt24" v-for="category in moInfoTotal.classInfo.filter((item: any) => item.classNm !== moCategory.YEAST)" :key="category.classNm">
        <label style="width: 240px;">{{ category?.classNm }}</label>
        {{ category[`${databaseDetailBeforeAfterStatus}Grade`] }}
        <input
            v-for="grade in fourGrades"
            :key="grade"
            :name="category?.classNm"
            style="margin-top: 2px; width: 24px;"
            type="radio"
            :value="grade"
            v-model="category[`${databaseDetailBeforeAfterStatus}Grade`]"
            :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
            @click="handleClickGrade"
        />
      </div>

      <h3 class="ml320 mt30" style="height: 40px;">Exist</h3>
      <ExistInput :moInfo="moInfoTotal.classInfo.filter((item: any) => item.classNm === moCategory.YEAST)" @handleClickGrade="handleClickGrade" />
    </div>

    <div v-else-if="currentAnalysisType === moTestType.SPUTUM">
      <div class="w-full flex-align-center-justify-start mt24" v-for="category in moInfoTotal.classInfo" :key="category.classNm">
        <template v-if="category.classNm === moCategory.WBC">
          <h1 class="fs12 classInfoClassTitle">Sputum</h1>

          <div class="table-container">
            <table class="sputum-table">
              <thead>
              <tr>
                <th></th>
                <th v-for="column in sputumGrades.grades" :key="column">{{ column }}</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Sputum</td>
                <td v-for="column in sputumGrades.grades" :key="column">
                  <div :class="['circle', {'green': column === sputumStatus }]"></div>
                </td>
              </tr>
              <tr>
                <td>EP Cell</td>
                <td v-for="value in sputumGrades.EPCellGrades" :key="value">{{ value }}</td>
              </tr>
              <tr>
                <td>WBC</td>
                <td v-for="value in sputumGrades.WBCGrades" :key="value">{{ value }}</td>
              </tr>
              <tr>
                <td>WBC/EP Cell</td>
                <td v-for="(value, index) in sputumGrades.WBCEPCellRatioGrades" :key="index">{{ value }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>

        <div class="classDetailInfoWrapper">
          <ul class="w-full flex-justify-end" style="gap: 24px;">
            <li v-for="type in fourGrades" :key="type" class="flex-justify-center">{{ type }}</li>
          </ul>
        </div>
        <div class="w-full mt24 flex-align-center-justify-start" v-for="item in moInfoTotal?.classInfo" :key="item?.classNm">
          <label style="width: 240px;">{{ item?.classNm }}</label>
          <input
              v-for="type in fourGrades"
              :key="type"
              :name="item?.classNm"
              style="margin-top: 2px; width: 24px;"
              type="radio"
              :value="type"
              v-model="item.beforeGrade"
              :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
          />
        </div>
      </div>
    </div>


  </div>

  <div class="flex-center mt24 gap12">
    <button
        :class="['classInfoBtn', { 'color-red': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        @click="changeBeforeAfterStatus(beforeAfterStatus.BEFORE)"
    >
      Before
    </button>
    <button
        :class="['classInfoBtn', { 'color-red': databaseDetailBeforeAfterStatus === beforeAfterStatus.AFTER }]"
        @click="changeBeforeAfterStatus(beforeAfterStatus.AFTER)"
    >
      After
    </button>
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
import { barcodeImgDir } from "@/common/defines/constFile/settings";

import { detailRunningApi, updateRunningApi } from "@/common/api/service/runningInfo/runningInfoApi";
import { useStore } from "vuex";
import { messages } from "@/common/defines/constFile/constantMessageText";
import Alert from "@/components/commonUi/Alert.vue";
import Confirm from "@/components/commonUi/Confirm.vue";
import moment from 'moment';
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import {LocationQueryValue, useRoute} from "vue-router";
import {
  beforeAfterStatus,
  fourGrades,
  moCategory,
  moTestType,
  powerMode,
  sputumGrades
} from "@/common/defines/constFile/dataBase";
import {calculateSputumStatus} from "@/common/lib/utils/changeData";
import ExistInput from "@/views/datebase/commponent/detail/classInfo/commonClassInfoInputBox/existInput.vue";

const store = useStore();
const route = useRoute();
const props = defineProps(['selectItems', 'type', 'isCommitChanged']);
const emits = defineEmits();
const userModuleDataGet = computed(() => store.state.userModule);


const selectItems = ref(props.selectItems);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const barcodeImg = ref('');
const memo = ref('');
const memoModal = ref(false);
const toggleLock = ref(false);
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
const currentAnalysisType = ref(moTestType.URINE);
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>(powerMode.LOW_POWER);
const moInfoTotal = ref<any>([]);
const sputumStatus = ref('1');
const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

onMounted(() => {
  currentPowerType.value = route.query.pageType;
  testBarcodeImage();
})

// watch(() => props.isCommitChanged, () => {
//   selectItems.value?.submitState = 'Submit';
// })

watch(() => route.query.pageType, async (newPageType) => {
  await nextTick();
  currentPowerType.value = newPageType;
  if (!isObjectEmpty(selectItems.value)) {
    currentAnalysisType.value = getCurrentAnalysisType(selectItems.value.cassetId);
    selectTotalItems(selectItems.value);
  }
})

watch(() => props.selectItems, async (newSelectItems) => {
  await nextTick();

  if (!isObjectEmpty(newSelectItems)) {
    selectItems.value = newSelectItems;
    currentAnalysisType.value = getCurrentAnalysisType(newSelectItems.cassetId);
    selectTotalItems(newSelectItems);
    memo.value = selectItems.value?.moMemo;
    /** TODO 바코드 이미지 */
    // testAfterBarcodeImage(props.selectItems?.img_drive_root_path);

    await store.dispatch('commonModule/setCommonInfo', {testType: selectItems.value?.testType});
    if (newSelectItems?.submitState === "" || !newSelectItems?.submitState) {
      const result: any = detailRunningApi(String(newSelectItems?.id));
      const updatedItem = { id: newSelectItems.id ,submitState: 'checkFirst' };
      const updatedRuningInfo = {...result.data, ...updatedItem}
      await resRunningItem(updatedRuningInfo, true);
    }
    barCodeImageShowError.value = false;
  }
}, { deep: true });

const selectTotalItems = (newSelectItems: any) => {
  moInfoTotal.value = newSelectItems?.moInfo.find((item: any) => item.id === '2');
  if (currentAnalysisType.value === moTestType.SPUTUM) {
    sputumStatus.value = calculateSputumStatus(moInfoTotal.value.classInfo);
  }
}

const testBarcodeImage = () => {
  const apiBaseUrl = window.APP_API_BASE_URL || 'http://192.168.0.115:3002';
  const iaRootPath = 'D:\\MOIA_proc';
  barcodeImg.value = `${apiBaseUrl}/images/getImageRealTime?folder=${iaRootPath + '/20240906153702_02_MO-0036/' + barcodeImgDir.barcodeDirName + '/'}&imageName=barcode_image.jpg`;
}

const testAfterBarcodeImage = (imgDriveRootPath: string) => {
  const path = imgDriveRootPath !== '' && imgDriveRootPath ? imgDriveRootPath : iaRootPath.value;
  barcodeImg.value = getBarcodeDetailImageUrl('barcode_image.jpg', path, selectItems.value?.slotId, barcodeImgDir.barcodeDirName);
}

const lisModalOpen = () => {
  showConfirm.value = true;
  confirmMessage.value = messages.IDS_MSG_UPLOAD_LIS;
  okMessageType.value = 'lis';
}


const toggleLockEvent = () => {
  toggleLock.value = !toggleLock.value;
}

const barcodeCopy = async () => {
  const textarea = document.createElement('textarea');
  textarea.value = props.selectItems.barcodeNo;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showSuccessAlert(messages.SUCCESS_ALERT);
}

const commitConfirmed = () => {
  submittedScreen.value = true;
  showConfirm.value = true;
  confirmMessage.value = messages.IDS_MSG_CONFIRM_SLIDE;
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
  const result: any = await detailRunningApi(String(props.selectItems?.id));
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
  const enterAppliedMoMemo = memo.value.replaceAll('\r\n', '<br>');
  const updatedItem = { moMemo: enterAppliedMoMemo };
  const result: any = await detailRunningApi(String(props.selectItems?.id));
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

const handleClickGrade = async (updatedMoInfo: any) => {
  const updatedSelectItems = selectItems.value;
  const updatingSelectItems = updatedSelectItems.moInfo.find((item:any) => item.id === '2').classInfo;


  Object.assign(updatingSelectItems, updatedMoInfo);
  Object.assign(updatedSelectItems, updatingSelectItems);
  console.log('www', updatedSelectItems);
  await resRunningItem(updatedSelectItems, true);
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
        showSuccessAlert('success');
      }
      memo.value = updatedRuningInfo.moMemo;
    } else {
      console.error('백엔드가 디비에 저장 실패함');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
  window.scrollTo({top: 0, behavior: 'smooth'});
};

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
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

const changeBeforeAfterStatus = async (clickedStatus: string) => {
  if (databaseDetailBeforeAfterStatus.value === clickedStatus) return;
  await store.dispatch('commonModule/setCommonInfo', { databaseDetailBeforeAfterStatus: clickedStatus });
}

</script>

<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.sputum-table {
  border-collapse: collapse;
  color: white;
  font-family: Arial, sans-serif;
}

.sputum-table th, .sputum-table td {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

.sputum-table th {
  background-color: black;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto;
  border: 1px solid black;
}

.circle.green {
  background-color: green;
}
</style>