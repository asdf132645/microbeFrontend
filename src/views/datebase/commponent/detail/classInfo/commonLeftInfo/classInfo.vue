<template>
  <img class="mt1" v-if="!barCodeImageShowError" @error="onImageError" @load="onLoadImg" :src="barcodeImg"/>
  <div class="mt1" v-else-if="barCodeImageShowError" style="height: 209.5px;"></div>
  <div class="mt1 mb2 flexSpaceBetween">
    <h3 class="wbcClassInfoLeft">
      Micro-organism Smear total Report
    </h3>

    <ul class="leftWbcInfo">
      <li @click="barcodeCopy">
        <font-awesome-icon :icon="['fas', 'copy']"/>
      </li>
      <li style="position: relative">
        <font-awesome-icon :icon="['fas', 'comment-dots']" class="memoOpenBtn" @click="memoOpen"/>
        <div v-if="memoModal" class="memoModal">
          <textarea v-model="wbcMemo"></textarea>
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
  <div class="classInfoDetailContainer">
    <div class="classInfoDetailTop">
      <h3>Category</h3>
      <h3>Grade</h3>
    </div>

    <div v-if="currentAnalysisType === 'Blood'">
      <h3 style="height: 40px; margin-left: 320px; margin-top: 30px;">Exist</h3>
      <div v-for="bloodType in bloodTypeList" :key="bloodType" style="width: 100%; display: flex; margin-bottom: 14px;">
        <p style="width: 340px; margin-left: 40px;">{{ bloodType }}</p>
        <input type="checkbox" />
      </div>
    </div>

    <div v-else-if="currentAnalysisType === 'Urine'">
      <div style="display: flex; justify-content: space-around; margin-left: 150px;">
        <div v-for="urineType in fourGrades" :key="urineType" style="width: 100%; display: flex; margin-bottom: 14px;">
          <h3>{{ urineType }}</h3>
        </div>
      </div>


      <div v-for="bloodType in urineTypeList" :key="bloodType" style="width: 100%; display: flex; margin-bottom: 14px;">
        <p style="width: 340px; margin-left: 40px;">{{ bloodType }}</p>
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="checkbox" />
        <input type="checkbox" />
      </div>

    </div>

    <div v-else-if="currentAnalysisType === 'Sputum'">

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
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps, nextTick, onMounted, ref, watch} from 'vue';
import {getBarcodeDetailImageUrl} from "@/common/lib/utils/conversionDataUtils";
import {barcodeImgDir} from "@/common/defines/constFile/settings";

import {
  detailRunningApi,
  updateRunningApi
} from "@/common/api/service/runningInfo/runningInfoApi";
import {useStore} from "vuex";
import {messages} from "@/common/defines/constFile/constantMessageText";
import Alert from "@/components/commonUi/Alert.vue";
import Confirm from "@/components/commonUi/Confirm.vue";
import moment from 'moment';

const props = defineProps(['selectItems', 'type', 'isCommitChanged']);
const store = useStore();
const userModuleDataGet = computed(() => store.state.userModule);
const emits = defineEmits();


const selectItems = ref(props.selectItems);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const barcodeImg = ref('');
const userId = ref('');
const wbcMemo = ref('');
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
const analysisType = ref(['Blood', 'Urine', 'Sputum']);
const bloodTypeList = ref(['GPC Clusters', 'GPC Pairs', 'GPC Chains', 'GNB', 'GPB Small', 'GPB Large', 'GNDC', 'GNCB', 'Yeast']);
const currentAnalysisType = ref('Urine');
const urineTypeList = ref(['WBC', 'GPC', 'GNB', 'GPB']);
const fourGrades = ['Rare', 'Few', 'Moderate', 'Many'];

onMounted(() => {
  testBarcodeImage();
})

watch(() => props.isCommitChanged, () => {
  selectItems.value.submitState = 'Submit';
})

watch(userModuleDataGet.value, (newUserId) => {
  userId.value = newUserId.id;
});

watch(() => props.selectItems, async (newItem) => {
  await nextTick();
  if (Object.keys(newItem).length !== 0) {
    setTestType(newItem.cassetId);

    wbcMemo.value = props.selectItems?.wbcMemo;

    /** TODO 바코드 이미지 */
    // testAfterBarcodeImage(props.selectItems?.img_drive_root_path);

    await store.dispatch('commonModule/setCommonInfo', {testType: props.selectItems.testType});
    if (props.selectItems?.submitState === "" || !props.selectItems?.submitState) {
      const result: any = detailRunningApi(String(props.selectItems?.id));
      const updatedItem = {
        submitState: 'checkFirst',
      };
      const updatedRuningInfo = {...result.data, ...updatedItem}
      await resRunningItem(updatedRuningInfo, true);
    }
    barCodeImageShowError.value = false;
  }
});

const testBarcodeImage = () => {
  const apiBaseUrl = window.APP_API_BASE_URL || 'http://192.168.0.115:3002';
  const iaRootPath = 'D:\\MOIA_proc';
  barcodeImg.value = `${apiBaseUrl}/images/getImageRealTime?folder=${iaRootPath + '/20240906153702_02_MO-0036/' + barcodeImgDir.barcodeDirName + '/'}&imageName=barcode_image.jpg`;
}

const testAfterBarcodeImage = (imgDriveRootPath: string) => {
  const path = imgDriveRootPath !== '' && imgDriveRootPath ? imgDriveRootPath : iaRootPath.value;
  barcodeImg.value = getBarcodeDetailImageUrl('barcode_image.jpg', path, props.selectItems?.slotId, barcodeImgDir.barcodeDirName);
}

const setTestType = (cassetId: string) => {
  if (cassetId.includes('B')) {
    currentAnalysisType.value = 'Blood';
  } else if (cassetId.includes('U')) {
    currentAnalysisType.value = 'Urine';
  } else if (cassetId.includes('S')) {
    currentAnalysisType.value = 'Sputum';
  }
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

  selectItems.value.submitState = 'Submit';
  emits('submitStateChanged', 'Submit');
}


const memoChange = async () => {
  const enterAppliedWbcMemo = wbcMemo.value.replaceAll('\r\n', '<br>');
  const updatedItem = {
    wbcMemo: enterAppliedWbcMemo
  };
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

const resRunningItem = async (updatedRuningInfo: any, noAlert?: boolean) => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, nrCount, testType, wbcInfo, wbcTotal} = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + nrCount + testType + wbcInfo + wbcTotal;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [updatedRuningInfo],
      dayQuery: dayQuery,
    })
    if (response) {
      if (!noAlert) {
        showSuccessAlert('success');
      }
      const filteredItems = updatedRuningInfo;
      wbcMemo.value = filteredItems.wbcMemo;
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
</script>