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
  <div class="moClassScroll">
<!--    -->
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
import {computed, defineEmits, defineProps, nextTick, onBeforeMount, onMounted, ref, watch} from 'vue';
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


const props = defineProps(['wbcInfo', 'selectItems', 'type', 'isCommitChanged', 'classCompareShow']);
const store = useStore();
const userModuleDataGet = computed(() => store.state.userModule);
const emits = defineEmits();
import moment from 'moment';

const selectItems = ref(props.selectItems);
const pbiaRootDir = computed(() => store.state.commonModule.iaRootPath);
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
const projectBm = ref(false);
const okMessageType = ref('');
const barCodeImageShowError = ref(false);
const submittedScreen = ref(false);
const lisBtnColor = ref(false);

onBeforeMount(async () => {
  projectBm.value = window.PROJECT_TYPE === 'bm';
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
    wbcMemo.value = props.selectItems?.wbcMemo;
    const path = props.selectItems?.img_drive_root_path !== '' && props.selectItems?.img_drive_root_path ? props.selectItems?.img_drive_root_path : pbiaRootDir.value;
    barcodeImg.value = getBarcodeDetailImageUrl('barcode_image.jpg', path, props.selectItems?.slotId, barcodeImgDir.barcodeDirName);
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