<template>
  <div class="execute">
    <div class='startDiv'>
      <p class="startStopP" v-if="showStopBtn" @click="isInit === 'Y' && toggleStartStop('start')">
        <font-awesome-icon
            :icon="['fas', 'circle-play']"
            :class="{ 'startBtn': true, [btnStatus]: true }"
        />
      </p>
      <p class="startStopP" v-else @click="toggleStartStop('stop')">
        <font-awesome-icon :icon="['fas', 'circle-stop']" class='stopBtn' />
      </p>
    </div>

    <div class="stopDiv">
      <select v-model="lpCaptureCount" :disabled="isRunningState">
        <option v-for="option in lpCaptureCountType" :key="option.value" :value="option.value">{{ option.text }}</option>
      </select>
      <div class="initBtn" @click="sendInit" :class="{'isInitDisabled': isInit === 'Y'}">
        <font-awesome-icon :icon="['fas', 'rotate-right']" style="font-size: 0.9rem;"
                           :class="{ 'disabled': isInit !== 'N' }"
        />
        <span> INITIALIZING </span>
      </div>
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
import { ref, computed, watch, onMounted, nextTick, defineEmits } from "vue";

import {useStore} from "vuex";
import { LP_CAPTURE_OPTIONS } from '@/common/defines/constFile/analysis';
import { messages } from '@/common/defines/constFile/constantMessageText';
import { tcpReq } from '@/common/tcpRequest/tcpReq';
import { getCellImgApi } from "@/common/api/service/setting/settingApi";
import EventBus from "@/eventBus/eventBus";
import Alert from "@/components/commonUi/Alert.vue";
import Confirm from "@/components/commonUi/Confirm.vue";
import {getDeviceInfoApi} from "@/common/api/service/device/deviceApi";


const store = useStore();
const embeddedStatusJobCmd = computed(() => store.state.embeddedStatusModule);
const userModuleDataGet = computed(() => store.state.userModule);

const runInfo = computed(() => store.state.commonModule);
const executeState = computed(() => store.state.executeModule);
const isPause = ref(runInfo.value?.isPause);
const isRunningState = ref(executeState.value?.isRunningState);
const userStop = ref(embeddedStatusJobCmd.value?.userStop);
const isRecoveryRun = ref(embeddedStatusJobCmd.value?.isRecoveryRun);
const isInit = ref(embeddedStatusJobCmd.value?.isInit);
const userId = ref('');
const analysisType = ref();
const commonDataGet = computed(() => store.state.commonModule);
const showStopBtn = ref(false);
const btnStatus = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const testTypeArr = ref<any>([]);
const emits = defineEmits();
const showConfirm = ref(false);
const confirmType = ref('');
const confirmMessage = ref('');
const siteCd = ref('');
const lpCaptureCount = ref('20');
const lpCaptureCountType = ref<any>([]);

watch(userModuleDataGet.value, async (newUserId, oldUserId) => {
  if (newUserId.id === '') {
    return;
  }
  userId.value = newUserId.id;
  await initDataExecute();
});

onMounted(async () => {
  await initDataExecute();
});

const initDataExecute = async () => {
  lpCaptureCountType.value = LP_CAPTURE_OPTIONS;

  await nextTick();
  await cellImgGet();
  await getDeviceInfo();
  await initData();
  if (isRunningState.value) {
    btnStatus.value = 'isRunning';
    showStopBtn.value = false;
  } else {
    btnStatus.value = 'start';
    showStopBtn.value = true;
  }
}

watch(commonDataGet.value, (value) => {
  if (value.loginSetData === '') {
    initDataExecute();
    store.dispatch('commonModule/setCommonInfo', {loginSetData: 'nn'});
  }
  if(value.resetAnalyzing){
    cellImgGet();
    store.dispatch('commonModule/setCommonInfo', {resetAnalyzing: false});
  }
},{deep: true});

watch([runInfo.value], async (newVals) => {
  await nextTick();
  const [newRunInfo] = newVals;

  const {isRunningState: newIsRunningState } = newRunInfo || {};
  isRunningState.value = newIsRunningState;

  if (isRunningState.value) {
    btnStatus.value = 'isRunning';
    showStopBtn.value = false;
  } else {
    // btnStatus.value = 'isInit';
    showStopBtn.value = true;
  }
})


// 스토어 변경 감시
watch([embeddedStatusJobCmd.value, executeState.value], async (newVals) => {
  const [newEmbeddedStatusJobCmd] = newVals;

  await nextTick();
  const {
    isPause: newIsPause,
    userStop: newUserStop,
    isRecoveryRun: newIsRecoveryRun,
    isInit: newIsInit,
  } = newEmbeddedStatusJobCmd || {};

  isPause.value = newIsPause;
  userStop.value = newUserStop;
  isRecoveryRun.value = newIsRecoveryRun;
  isInit.value = newIsInit;

  if (isPause.value) {
    btnStatus.value = 'isPause';
  } else if (userStop.value && !isRecoveryRun.value) {
    btnStatus.value = 'onRecover';
  } else if (isInit.value === 'N' || isInit.value === '') {
    btnStatus.value = 'isInit';
  } else {
    btnStatus.value = 'start';
  }
});


//웹소켓으로 백엔드에 전송
const emitSocketData = async (type: string, payload: any) => {
  EventBus.publish('childEmitSocketData', payload);
};

const toggleStartStop = (action: 'start' | 'stop') => {
  if (action === 'start') {
    if (isPause.value) { // 일시정지인 상태일 경우 임베디드에게 상태값을 알려준다.

      tcpReq().embedStatus.restart.reqUserId = userId.value;
      emitSocketData('SEND_DATA', tcpReq().embedStatus.restart);
      return;
    }
    // 실행 여부 체크
    if (isRunningState.value) {
      showSuccessAlert(messages.IDS_ERROR_ALREADY_RUNNING);
      return;
    } else if (userStop.value) {
      confirmMessage.value = messages.IDS_RECOVER_GRIPPER_CONDITION;
      showConfirm.value = true;
      return;
    }

    let startAction = tcpReq().embedStatus.startAction;
    Object.assign(startAction, {
      testType: analysisType.value,
      LPCount: lpCaptureCount.value,
      reqUserId: userId.value,
    });

    if (isInit.value === 'Y') { // 초기화 여부 체크 초기화가 되어있는 상태이면 실행
      // 웹소켓으로 백엔드에 전송
      emitSocketData('SEND_DATA', startAction);
      const InfoData = {
        startEmbedded: true,
      }
      // 시작 버튼이 눌리면 연속적으로 실행정보, 장비정보를 요청한다.
      store.dispatch('commonModule/setCommonInfo', InfoData);
    }
  } else {
    // 장비 중단
    if (!isRunningState.value) {
      showSuccessAlert(messages.IDS_ERROR_STOP_PROCESS);
      return;
    }
    store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {userStop: true});
    tcpReq().embedStatus.stop.reqUserId = userId.value;
    emitSocketData('SEND_DATA', tcpReq().embedStatus.stop);

  }

};

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
};

const showErrorALert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
}

const hideAlert = () => {
  showAlert.value = false;
};

const hideConfirm = () => {
  showConfirm.value = false;
}

const handleOkConfirm = () => {
  showConfirm.value = false;
  tcpReq().embedStatus.recovery.reqUserId = userId.value;
  emitSocketData('SEND_DATA', tcpReq().embedStatus.recovery);
}

const sendInit = () => { // 장비 초기화 진행
  // if (isInitializing.value) {
  //   if (isInit.value === 'Y' || btnStatus.value === "isRunning" || isRunningState.value) {
  //     showSuccessAlert(messages.alreadyInitialized);
  //   }
  //     showErrorALert('Program is already running');
  //     return;
  // }

  // if (isInit.value === 'Y' || btnStatus.value === "isRunning" || isRunningState.value) {
  //   showSuccessAlert(messages.alreadyInitialized);
  //   return;
  // }
  tcpReq().embedStatus.init.reqUserId = userId.value;
  emitSocketData('SEND_DATA', tcpReq().embedStatus.init);
  emits('initDataChangeText', true);
  // isInitializing.value = true;
}

const initData = async () => {
  const newObj = {...embeddedStatusJobCmd.value }
  const runInfoObj = {...runInfo.value};
  isInit.value = newObj.isInit;
  isPause.value = newObj.isPause;
  userStop.value = newObj.userStop;
  isRecoveryRun.value = newObj.isRecoveryRun;
  isRunningState.value = runInfoObj.isRunningState;
  showStopBtn.value = (isInit.value === 'N' || isInit.value === '') && !isRunningState.value;
}

const cellImgGet = async () => {
  try {
    const result = await getCellImgApi();
    if (result) {
      if (result?.data) {
        const data = result.data;
        await store.dispatch('commonModule/setCommonInfo', { analysisType: analysisType.value });
        lpCaptureCount.value = data.LPCaptureCount;
      }
    }

  } catch (e) {

    console.log(e);
  }
}

const getDeviceInfo = async () => {
  try {
    const deviceData = await getDeviceInfoApi();
    siteCd.value = deviceData.data.siteCd;
  } catch (e) {
    console.log(e);
  }
}

</script>
