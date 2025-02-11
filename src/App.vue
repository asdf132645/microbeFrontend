<!-- App.vue -->
<template>
  <div>
    <AppHeader
        v-if="router.currentRoute.value.path !== '/user/login' && router.currentRoute.value.path !== '/user/join'"/>
    <main class="content">
      <router-view/>
      <Analysis
          :parsedData="parsedDataProps"
          :isClass="router.currentRoute.value.path === '/'"
          :startStatus="startStatus"
          :pb100aCassette="pb100aCassette"
      />
    </main>
    <Alert
        v-if="showAlert"
        :is-visible="showAlert"
        :type="alertType"
        :message="alertMessage"
        @hide="hideAlert"
        @update:hideAlert="hideAlert"
    />
  </div>
</template>

<script setup lang="ts">

import {
  getCurrentInstance,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  onBeforeUnmount,
  onBeforeMount, reactive,
} from 'vue';
import { useStore } from "vuex";
import {useRouter} from "vue-router";
import axios from "axios";
import AppHeader from "@/components/layout/AppHeader.vue";
import { sysInfoStore, runningInfoStore } from '@/common/lib/storeSetData/common';
import {tcpReq} from '@/common/tcpRequest/tcpReq';
import {MESSAGES} from '@/common/defines/constFile/constantMessageText';
import { getCellImgApi, getGramRangeApi } from "@/common/api/service/setting/settingApi";
import { existOrNone, getGradeByRange, getSputumGrade } from "@/common/lib/utils/changeData";
import {ApiResponse} from "@/common/api/httpClient";
import {createRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import Alert from "@/components/commonUi/Alert.vue";
import { getDeviceIpApi } from "@/common/api/service/device/deviceApi";
import EventBus from "@/eventBus/eventBus";
import Analysis from "@/views/analysis/index.vue";
import {logoutApi} from "@/common/api/service/user/userApi";
import { DEFAULT_GRAM_RANGE } from "@/common/defines/constFile/settings/settings";
import type { GRAM_RANGE_TYPE } from "@/common/defines/constFile/settings/settings.dto";
import {
  MO_CATEGORY_NAME,
  MO_TEST_TYPE,
  CLASS_INFO_ID,
  MAP_TEST_TYPE_TO_TEST_NAME,
  URINE_LOW_POWER_CLASS_IDS,
  BLOOD_LOW_POWER_CLASS_IDS,
  SPUTUM_LOW_POWER_CLASS_IDS, FILE_NAME
} from "@/common/defines/constFile/dataBase";
import {CommonState} from "@/store/modules/commonModule";
import { MoInfoInterface, RUNNING_INFO_INTERFACE } from "@/common/type/tcp";
import {IntervalType} from "@/common/type/generalTypes";
import {getValidClassIds} from "@/common/lib/utils/conversionDataUtils";
import {JOB_CMD} from "@/common/defines/constFile/analysis/analysis";
import {readJsonFile} from "@/common/api/service/fileReader/fileReaderApi";

const router = useRouter();
const store = useStore();
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const commonDataGet = computed(() => store.state.commonModule);
const instance = getCurrentInstance();
const userId = ref('');
const storedUser = sessionStorage.getItem('user');
const getStoredUser = JSON.parse(storedUser || '{}');
const gramItems = ref<GRAM_RANGE_TYPE[]>([]);
const runningArr = ref<RUNNING_INFO_INTERFACE>({});
const viewerCheckApp = ref('');
const parsedDataProps = ref<any>({});
const startStatus = ref(false);
const machineVersion = ref('12a');
const pb100aCassette = ref('');
const deleteData = ref(false);
let socketTimeoutId: number | undefined = undefined; // 타이머 ID 저장
const isFullscreen = ref(false);
const ipMatches = ref(false);
const barcodeNum = ref('');
const runningInfoBoolean = ref(false);
const intervalState = reactive<{intervalId: IntervalType; countingStartInterval: IntervalType; countingRunInterval: IntervalType}>({
  intervalId: null,
  countingStartInterval: null,
  countingRunInterval: null,
});
const userModuleDataGet = computed(() => store.state.userModule);
const reqArr = computed(() => store.state.commonModule);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const currentAnalyzingSlotNo = computed(() => store.state.commonModule.currentAnalyzingSlotNo);
const isRewindingBelt = computed(() => store.state.commonModule.isRewindingBelt);
const currentSlotId = ref('');

const wbcConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.WBC)[0]);
const epCellConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.EP_CELL)[0]);
const gramConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.GRAM)[0]);
const currentMoInfoArr = ref<any[]>([]);

instance?.appContext.config.globalProperties.$socket.on('isTcpConnected', async (isTcpConnected) => {
  console.log('isTCPConnected');
  if (isTcpConnected) {
    setTimeout(async () => {
      await store.dispatch('commonModule/setCommonInfo', {isTcpConnected: true});
    }, 1500)
  }
})

instance?.appContext.config.globalProperties.$socket.on('viewerCheck', async (ip) => { // 뷰어인지 아닌지 체크하는곳
  await getIpAddress(ip)
});

const getIpAddress = async (ip: string) => {
  try {
    const result = await getDeviceIpApi();
    if (result.data === ip) {
      viewerCheckApp.value = result.data;
    } else {
      viewerCheckApp.value = result.data;
    }
  } catch (e) {
    console.error(e);
  }
}

const checkFullscreenStatus = () => {
  const {path} = router.currentRoute.value;
  if (path === '/user/login') {
    return;
  }
  isFullscreen.value = window.matchMedia('(display-mode: fullscreen)').matches;
  if (!isFullscreen.value) {
    showSuccessAlert('Please click the full screen button.');
  } else {
    if (alertMessage.value === 'Please click the full screen button.') {
      hideAlert();
    }
  }
}

const startChecking = () => {
  // 화면 상태를 즉시 업데이트
  checkFullscreenStatus();
  // 1분(60000ms)마다 체크를 수행
  intervalState.intervalId = setInterval(checkFullscreenStatus, 60000);
}


watch(reqArr.value, async (newVal: CommonState) => {
  if (!newVal.reqArr) return;
  const uniqueReqArr = removeDuplicateJobCmd(newVal.reqArr);
  const notSysRunInfo = uniqueReqArr.filter((item: any) => !['SYSINFO', 'RUNNING_INFO'].includes(item.jobCmd));

  if (notSysRunInfo.length > 0) {
    await sendMessage(notSysRunInfo[0]);
    await store.dispatch('commonModule/setCommonInfo', {reqArrPaste: []});
    return;
  }

  if (deleteData.value) {
    deleteData.value = false;
    await store.dispatch('commonModule/setCommonInfo', {reqArrPaste: []});
    return
  }

  if (uniqueReqArr.length === 0) return;


  // `notSysRunInfo`와 `uniqueReqArr` 처리
  if (notSysRunInfo.length > 0) {
    await sendMessage(notSysRunInfo[0]);
  } else {
    await sendMessage(uniqueReqArr[0]);
  }

  // `reqArrPaste` 상태 초기화
  await store.dispatch('commonModule/setCommonInfo', {reqArrPaste: []});
});


watch(userModuleDataGet.value, (newUserId) => {
  if (newUserId.id === '') return;

  cellImgGet();
  userId.value = newUserId.id;
});


onBeforeMount(() => {
  machineVersion.value = window.MACHINE_VERSION;

  instance?.appContext.config.globalProperties.$socket.emit('viewerCheck', {
    type: 'SEND_DATA',
    payload: window.APP_API_BASE_URL
  });
});

window.addEventListener('beforeunload', async () => {
  await logoutApi({userId: userId.value});
  await store.dispatch('commonModule/setCommonInfo', {firstLoading: false});
});

const leave = async (event: any) => {
  event.preventDefault();
  if (!ipMatches.value) {
    const result = await getDeviceIpApi();
    const ipAddress = `ip=${result.data}`
    const url = `http://${result.data}:3000/close?${ipAddress}`;
    await axios.get(url);
  } else {
    await EventBus.publish('childEmitSocketData', tcpReq().embedStatus.exit);
  }
};

const isIpMatching = (url: string, ip: any) => {
  // URL에서 IP 주소 추출
  const urlPattern = /http:\/\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+):/;
  const match = url.match(urlPattern);
  if (match && match[1]) {
    // 추출된 IP 주소와 주어진 IP 주소 비교
    return match[1] === ip;
  }
  return false;
};

onMounted(async () => {
  await nextTick();
  await cellImgGet();
  await getGramRange();
  startChecking();

  const result = await getDeviceIpApi();
  ipMatches.value = isIpMatching(window.APP_API_BASE_URL, result.data);
  window.addEventListener('beforeunload', leave);

  if (userId.value === '') { // 사용자가 강제 초기화 시킬 시 유저 정보를 다시 세션스토리지에 담아준다.
    await store.dispatch('userModule/setUserAction', getStoredUser);
    userId.value = userModuleDataGet.value.id
  }

  if (!commonDataGet.value.isRunningState) {
    if (!commonDataGet.value.firstLoading && ipMatches.value && window.FORCE_VIEWER === 'main') {
      intervalState.countingStartInterval = setInterval(async () => {
        await startSysPostWebSocket();
      }, 400);

      intervalState.countingRunInterval = setInterval(async () => {
        if (!commonDataGet.value.runningInfoStop) {
          await runInfoPostWebSocket();
        }
      }, 500);
      await store.dispatch('commonModule/setCommonInfo', {firstLoading: true});
    }
  }
  EventBus.subscribe('childEmitSocketData', emitSocketData);

});

onBeforeUnmount(async () => {
  window.removeEventListener('beforeunload', leave);

  if (intervalState.countingRunInterval) {
    clearInterval(intervalState.countingRunInterval);
    intervalState.countingRunInterval = null;
  }
  if (intervalState.countingStartInterval) {
    if (intervalState.countingRunInterval !== null) clearInterval(intervalState.countingRunInterval);
    intervalState.countingRunInterval = null;
  }
});

instance?.appContext.config.globalProperties.$socket.on('chat', async (data) => {
  await socketData(data);
});

async function socketData(data: any) {
  if (commonDataGet.value.viewerCheck !== 'main') {
    return;
  }
  deleteData.value = false;
  try {
    if (typeof data === 'string') {
      await showSuccessAlert(MESSAGES.TCP_DiSCONNECTED);
      return;
    }
    const textDecoder = new TextDecoder('utf-8');
    const stringData = textDecoder.decode(data);
    const parseDataWarp = JSON.parse(stringData);

    if (alertMessage.value === MESSAGES.TCP_DiSCONNECTED) hideAlert();

    // 시스템정보 스토어에 담기
    switch (parseDataWarp.jobCmd) {
      case JOB_CMD.SYSINFO:
        const res = await sysInfoStore(parseDataWarp);
        if (res !== null) {
          showCoreErrorAlert(res);
          const isAlarm = sessionStorage.getItem('isAlarm');
          if (isAlarm === 'true') {
            await store.dispatch('commonModule/setCommonInfo', {isErrorAlarm: true}); // 오류 알람을 킨다.
          }
        }
        break;
      case JOB_CMD.INIT:
        barcodeNum.value = '';
        await store.dispatch('commonModule/setCommonInfo', {initValData: false});
        sendSettingInfo();
        break;
      case JOB_CMD.START:
        barcodeNum.value = '';
        await runningStart();
        break;
      case JOB_CMD.RUNNING_INFO:
        parsedDataProps.value = parseDataWarp;
        runningInfoBoolean.value = true;
        await runningInfoStore(parseDataWarp);
        await runningInfoCheckStore(parseDataWarp);
        break;
      case JOB_CMD.STOP:
        console.log('stop!=--------------------------')
        barcodeNum.value = '';
        await store.dispatch('commonModule/setCommonInfo', {isRunningState: false});
        await store.dispatch('timeModule/setTimeInfo', {totalSlideTime: '00:00:00'});
        await store.dispatch('timeModule/setTimeInfo', {slideTime: '00:00:00'});
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: false});
        startStatus.value = false;
        runningInfoBoolean.value = false;
        break;
      case JOB_CMD.RUNNING_COMP:
        barcodeNum.value = '';
        await runningComplete();
        break;
      case JOB_CMD.PAUSE:
        barcodeNum.value = '';
        await store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {isPause: true}); // 일시정지 상태로 변경한다.
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: false});
        startStatus.value = false;
        runningInfoBoolean.value = false;
        break;
      case JOB_CMD.RESTART:
        barcodeNum.value = '';
        await runningInfoStore(parseDataWarp);
        await runningInfoCheckStore(parseDataWarp);
        await store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {isPause: false}); // start 가 되면 false로 변경
        await store.dispatch('timeModule/setTimeInfo', {totalSlideTime: '00:00:00'});
        await store.dispatch('timeModule/setTimeInfo', {slideTime: '00:00:00'});
        runningInfoBoolean.value = true;
        startStatus.value = true;
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        break;
      case JOB_CMD.RECOVERY:
        barcodeNum.value = '';
        await store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {userStop: false});
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        break;
      case JOB_CMD.ERROR_CLEAR:
        showAlert.value = false;
        console.log('ERROR CLEAR');
        break;
    }

    async function runningComplete() {
      await store.dispatch('commonModule/setCommonInfo', { runningInfoStop: false });
      await store.dispatch('commonModule/setCommonInfo', { startEmbedded: false });
      await store.dispatch('commonModule/setCommonInfo', { isRunningState: false }); // 시스템이 돌아가는 상태를 알려준다.
      await store.dispatch('commonModule/setCommonInfo', { isAlarm: false }); // 알람을 킨다.
      await store.dispatch('commonModule/setCommonInfo', { runningSlotId: '' });
      await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
      await store.dispatch('commonModule/setCommonInfo', { runningArr: [] });
      await store.dispatch('runningInfoModule/setChangeSlide', {key: 'changeSlide', value: 'stop'});// 슬라이드가 끝났으므로 stop을 넣어서 끝낸다.
      await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: false});
      runningInfoBoolean.value = false;
      startStatus.value = false;
    }

    async function runningStart() {
      await store.dispatch('commonModule/setCommonInfo', {isRunningState: true});// 실행중이라는 여부를 보낸다
      await store.dispatch('runningInfoModule/setChangeSlide', {key: 'changeSlide', value: 'start'}); // 첫 슬라이드가 시작되었음을 알려준다.
      await store.dispatch('commonModule/setCommonInfo', {startEmbedded: 'start',});
      await store.dispatch('timeModule/setTimeInfo', {totalSlideTime: '00:00:00'});
      await store.dispatch('timeModule/setTimeInfo', {slideTime: '00:00:00'});
      await store.dispatch('commonModule/setCommonInfo', {runningInfoStop: false});
      await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
      await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
      await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
      startStatus.value = true;
      runningInfoBoolean.value = true;
    }

    async function runningInfoCheckStore(data: RUNNING_INFO_INTERFACE) {
      const regex = /[1,2,9]/g;
      if (String(data?.iCasStat) !== '999999999999') { // 스캔중일때는 pass + 완료상태일때도
        const dataICasStat = String(data?.iCasStat);
        const currentSlot = data?.slotInfo;
        const iCasStatArr = [...data?.iCasStat];

        if (iCasStatArr.lastIndexOf("2") !== -1) {
          await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: true});
        }

        // iCasStat (0 - 없음, 1 - 있음, 2 - 진행중, 3 - 완료, 4 - 에러, 9 - 스캔)
        if ((dataICasStat.search(regex) < 0) || data?.oCasStat === '111111111111' && !commonDataGet.value.runningInfoStop) {
          tcpReq().embedStatus.runIngComp.reqUserId = userModuleDataGet.value.userId;
          if (machineVersion.value === '12a') {
            await store.dispatch('commonModule/setCommonInfo', { reqArr: tcpReq().embedStatus.runIngComp });
            await store.dispatch('commonModule/setCommonInfo', {runningInfoStop: true});
          } else if (machineVersion.value === '100a' && data?.workingDone === 'Y') {
            await store.dispatch('commonModule/setCommonInfo', {reqArr: tcpReq().embedStatus.runIngComp});
            await store.dispatch('commonModule/setCommonInfo', {runningInfoStop: true});
          }
          await saveTestHistory(data);
          return;
        }

        await store.dispatch('runningInfoModule/setChangeSlide', {key: 'changeSlide', value: 'start'});
        //슬라이드 변경시 데이터 저장

        // tcpReq().embedStatus.pause.reqUserId = userId.value;
        // await store.dispatch('commonModule/setCommonInfo', {reqArr: tcpReq().embedStatus.pause});
        // tcpReq().embedStatus.pause.reqUserId = userId.value;
        // await store.dispatch('commonModule/setCommonInfo', {isRunningState: false});


        if (currentAnalyzingSlotNo.value !== currentSlot?.slotNo) {
          await store.dispatch('runningInfoModule/setChangeSlide', {key: 'changeSlide', value: 'afterChange'});
          await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: true});
          await saveTestHistory(runningArr.value)
          await store.dispatch('commonModule/setCommonInfo', {runningSlotId: currentSlot?.slotId});
          await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: currentSlot?.slotNo });
        }
        // 데이터 넣는 부분
        if (iCasStatArr.lastIndexOf("2") !== -1) runningArr.value = data;
      }

    }

    async function saveTestHistory(data: RUNNING_INFO_INTERFACE) {
      const completeSlot = data.slotInfo;
      if (!completeSlot) return;

      Object.assign(completeSlot, { userId: userId.value, isNormal: true });

      const moInfoData = await getMoInfoFromFolder(completeSlot.slotId);

      if (moInfoData) {
        const convertedMoInfo = convertMoInfo(MAP_TEST_TYPE_TO_TEST_NAME[completeSlot.testType], moInfoData);

        const traySlotFirstNum = machineVersion.value === '100a' ? `${data?.traySlot}` : '1';

        const newObj = {
          slotNo: completeSlot.slotNo,
          lock_status: false,
          traySlot: traySlotFirstNum + '-' + completeSlot.slotNo,
          barcodeNo: completeSlot.barcodeNo,
          patientId: completeSlot.patientId,
          patientNm: completeSlot.patientNm,
          gender: completeSlot.gender,
          birthDay: completeSlot.birthDay,
          slotId: completeSlot.slotId,
          orderDttm: completeSlot.orderDttm,
          testType: completeSlot.testType,
          analyzedDttm: tcpReq().embedStatus.settings.saveReqDttm,
          tactTime: completeSlot.tactTime,
          classInfo: convertedMoInfo,
          cassetId: data?.cassetId,
          isNormal: true,
          // isNormal: completeSlot?.isNormal,
          submitState: '',
          submitOfDate: '',
          submitUserId: '',
          memo: '',
        }
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: completeSlot.slotNo });
        await saveRunningInfo(newObj, completeSlot.slotId);
      } else {
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: completeSlot.slotNo });
      }
    }

    async function saveRunningInfo(runningInfo: any, slotId: string) {
      try {
        if (currentSlotId.value === '' || currentSlotId.value !== runningInfo.slotId) {
          let result: ApiResponse<void>;
          result = await createRunningApi({userId: Number(userId.value), runingInfoDtoItems: runningInfo});
          if (result) {
            if (runningInfo.slotId) {
              currentSlotId.value = runningInfo.slotId;
              currentMoInfoArr.value = [];
            }
            delayedEmit('SEND_DATA', 'refreshDb', 300);
          }
        } else {
          delayedEmit('SEND_DATA', 'refreshDb', 300);
        }

      } catch (e) {
        console.error(e);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const delayedEmit = (type: string, payload: string, delay: number) => {
  if (socketTimeoutId !== undefined) {
    clearTimeout(socketTimeoutId); // 이전 타이머 클리어
  }

  socketTimeoutId = window.setTimeout(() => {
    instance?.appContext.config.globalProperties.$socket.emit('state', {
      type: 'SEND_DATA',
      payload: 'refreshDb'
    });
  }, delay);
};

// jobCmd가 중복되지 않도록 배열 필터링
const removeDuplicateJobCmd = (reqArr: any) => {
  const uniqueJobCmds = new Set(); // 중복을 체크하기 위한 Set 생성
  const uniqueReqArr: any = []; // 중복되지 않은 jobCmd를 담을 배열
  reqArr.forEach((req: any) => {
    if (!uniqueJobCmds.has(req.jobCmd)) {
      uniqueJobCmds.add(req.jobCmd); // Set에 jobCmd 추가
      uniqueReqArr.push(req); // 유니크한 jobCmd인 경우 배열에 추가
    }
  });
  return uniqueReqArr;
};

const startSysPostWebSocket = async () => {
  tcpReq().embedStatus.sysInfo.reqUserId = userId.value;
  const req = tcpReq().embedStatus.sysInfo;
  await store.dispatch('commonModule/setCommonInfo', { reqArr: req });
  let autoStart: string | number = sessionStorage.getItem('autoStart') || 1;
  if (autoStart === 'true') autoStart = 1;
  else if (autoStart === 'false') autoStart = 0;

  if (machineVersion.value === '100a') {
    Object.assign(req, { isRewindingBelt: isRewindingBelt.value });
    Object.assign(req, { autoStart: autoStart });
  }

  await store.dispatch('commonModule/setCommonInfo', {reqArr: req});
};

const runInfoPostWebSocket = async () => {
  if (!runningInfoBoolean.value) {
    return;
  }
  tcpReq().embedStatus.runningInfo.reqUserId = userId.value;
  const req = tcpReq().embedStatus.runningInfo;
  await store.dispatch('commonModule/setCommonInfo', {reqArr: req});
};

const emitSocketData = async (payload: any) => {
  await store.dispatch('commonModule/setCommonInfo', {reqArr: payload});
};

const sendSettingInfo = () => {
  const req = {
    jobCmd: 'SETTINGS',
    reqUserId: '',
    reqDttm: tcpReq().embedStatus.settings.reqDttm,
    pbiaRootDir: iaRootPath.value || '',
    oilCount: '1000',
    isOilReset: 'N',
    deviceType: '03',
  };
  store.dispatch('commonModule/setCommonInfo', {reqArr: req});
}

const getGramRange = async () => {
  try {
    const result = await getGramRangeApi();
    if (result) {
      if (!result?.data || (result?.data instanceof Array && result?.data.length === 0)) {
        gramItems.value = DEFAULT_GRAM_RANGE;
      } else {
        gramItems.value = result.data;
      }

      wbcConvertSetting.value = gramItems.value.filter((gramItem: any) => gramItem.fullNm === 'WBC')[0];
      epCellConvertSetting.value = gramItems.value.filter((gramItem: any) => gramItem.fullNm === 'EP Cell')[0];
      gramConvertSetting.value = gramItems.value.filter((gramItem: any) => gramItem.fullNm === 'Gram')[0];
    }
  } catch (e) {
    console.error(e);
  }
}


// 메시지를 보내는 함수
const sendMessage = async (payload: any) => {
  const executeAfterDelay = async () => {
    instance?.appContext.config.globalProperties.$socket.emit('message', {
      type: 'SEND_DATA',
      payload: payload
    });
  };
  await executeAfterDelay();
  deleteData.value = true;
};

const convertMoInfo = (cassetteType: keyof typeof MO_TEST_TYPE, moInfo: MoInfoInterface[]) => {

  const convertedMoInfo = [];

  const totalMoInfo = moInfo.filter((item) => String(item.id) === '2')[0];
  const totalLPCount = totalMoInfo.LPTotalCount;
  const totalHPCount = totalMoInfo.HPTotalCount;

  for (const moItem of moInfo) {
    const validClassIds = getValidClassIds(cassetteType, String(moItem.id));
    const updatingClassInfo = moItem.classList
        .filter(moClassInfoItem => validClassIds.includes(moClassInfoItem.classId))
        .map(moClassInfoItem => ({
          count: calcCount(Number(totalLPCount), Number(totalHPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType),
          classId: moClassInfoItem.classId,
          beforeGrade: setMoInfoGrade({
            cassetteType,
            classId: moClassInfoItem.classId,
            count: calcCount(Number(totalLPCount), Number(totalHPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType),
          }),
          afterGrade: setMoInfoGrade({
            cassetteType,
            classId: moClassInfoItem.classId,
            count: calcCount(Number(totalLPCount), Number(totalHPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType)
          }),
        }))

    if (cassetteType === MO_TEST_TYPE.SPUTUM) {
      // Sputum Gram 계산을 위한 WBC, EP Cell Count 추출
      const wbcCount = moItem.classList.find(item => item.classId === CLASS_INFO_ID.WBC)?.count || 0;
      const epCellCount = moItem.classList.find(item => item.classId === CLASS_INFO_ID.EP_CELL)?.count || 0;
      const gradeText = getSputumGrade(wbcCount, epCellCount);
      const sputumItem = {
        count: 0,
        classId: '90',
        beforeGrade: gradeText,
        afterGrade: gradeText,
      }
      updatingClassInfo.push(sputumItem);
    }

    const updatedMoInfoItem = {
      id: moItem.id,
      name: moItem.fileName,
      classInfo: updatingClassInfo,
      isWatched: false,
    }
    convertedMoInfo.push(updatedMoInfoItem);
  }
  return convertedMoInfo;
};

const calcCount = (totalLPCount: number, totalHPCount: number, count: number, id: string, classId: string, cassetteType: string) => {
  if (String(id) === '2') {
    switch (cassetteType) {
      case MO_TEST_TYPE.URINE:
        if (URINE_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(totalLPCount) > 0 ? Math.ceil(Number(count) / Number(totalLPCount)) : 0;
        }
        return Number(totalHPCount) > 0 ? Math.ceil(Number(count) / Number(totalHPCount)) : 0;
      case MO_TEST_TYPE.SPUTUM:
        if (SPUTUM_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(totalLPCount) > 0 ? Math.ceil(Number(count) / Number(totalLPCount)) : 0;
        }
        return Number(totalHPCount) > 0 ? Math.ceil(Number(count) / Number(totalHPCount)) : 0;
      case MO_TEST_TYPE.BLOOD:
        if (BLOOD_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(totalLPCount) > 0 ? Math.ceil(Number(count) / Number(totalLPCount)) : 0;
        }
        return Number(totalHPCount) > 0 ? Math.ceil(Number(count) / Number(totalHPCount)) : 0;
    }
  }
  return Number(count);
}

const setMoInfoGrade = ({ cassetteType, classId, count }: {cassetteType: string, classId: string, count: number}) => {

  switch (cassetteType) {
    case MO_TEST_TYPE.BLOOD:
      return existOrNone(count);

    case MO_TEST_TYPE.URINE:

      if (classId === CLASS_INFO_ID.YEAST) return existOrNone(count);
      if (classId === CLASS_INFO_ID.WBC) return getGradeByRange(wbcConvertSetting.value, count);
      return getGradeByRange(gramConvertSetting.value, count);

    case MO_TEST_TYPE.SPUTUM:
      if ([CLASS_INFO_ID.YEAST, CLASS_INFO_ID.HYPHAE].includes(classId)) return existOrNone(count);
      else return getGradeByRange(gramConvertSetting.value, count);
  }
}

const cellImgGet = async () => {
  try {
    const result = await getCellImgApi();
    if (result) {
      if (result?.data) {
        const data = result.data;
        sessionStorage.setItem('iaRootPath', data?.iaRootPath);
        await store.dispatch('commonModule/setCommonInfo', {iaRootPath: String(data?.iaRootPath)});
        await store.dispatch('commonModule/setCommonInfo', { cellImageAnalyzedSetting: data });
        sessionStorage.setItem('keepPage', String(data?.keepPage));
      }
    }
  } catch (e) {
    console.error(e);
  }
}

const getMoInfoFromFolder = async (slotId: string) => {
  const url = `${iaRootPath.value}/${slotId}/${FILE_NAME.MO_INFO}`;
  try {
    const response = await readJsonFile(({ fullPath: url }));
    if (response?.data) {
      return response?.data.MOinfo;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

const showSuccessAlert = async (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
  alertMessage.value = message;
};

const showCoreErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'coreError'
  alertMessage.value = message;
}

const hideAlert = () => {
  if (alertType.value === 'coreError') errorClear();
  showAlert.value = false;
};

const errorClear = async () => {
  await store.dispatch('commonModule/setCommonInfo', {reqArr: tcpReq().embedStatus.errorClear });
}

</script>