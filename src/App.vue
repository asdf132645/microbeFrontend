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
import {createDeviceInfoApi, getDeviceInfoApi, getDeviceIpApi} from "@/common/api/service/device/deviceApi";
import EventBus from "@/eventBus/eventBus";
import Analysis from "@/views/analysis/index.vue";
import {logoutApi} from "@/common/api/service/user/userApi";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import { DEFAULT_GRAM_RANGE } from "@/common/defines/constFile/settings/settings";
import type { GRAM_RANGE_TYPE } from "@/common/defines/constFile/settings/settings.dto";
import {
  MO_CATEGORY_NAME,
  MO_TEST_TYPE,
  CLASS_INFO_ID,
  MAP_TEST_TYPE_TO_TEST_NAME,
  URINE_HIGH_POWER_CLASS_IDS,
  URINE_LOW_POWER_CLASS_IDS,
  URINE_TOTAL_CLASS_IDS,
  BLOOD_LOW_POWER_CLASS_IDS,
  BLOOD_TOTAL_CLASS_IDS,
  BLOOD_HIGH_POWER_CLASS_IDS,
  SPUTUM_TOTAL_CLASS_IDS,
  SPUTUM_HIGH_POWER_CLASS_IDS, SPUTUM_LOW_POWER_CLASS_IDS
} from "@/common/defines/constFile/dataBase";
import {CommonState} from "@/store/modules/commonModule";
import {JobCmdType, MoInfoInterface, RUNNING_INFO_INTERFACE} from "@/common/type/tcp";
import {IntervalType} from "@/common/type/generalTypes";

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

const wbcConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.WBC)[0]);
const epCellConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.EP_CELL)[0]);
const gramConvertSetting = ref<GRAM_RANGE_TYPE>(DEFAULT_GRAM_RANGE.filter(item => item.fullNm === MO_CATEGORY_NAME.GRAM)[0]);

instance?.appContext.config.globalProperties.$socket.on('isTcpConnected', async (isTcpConnected) => {
  console.log('isTcpConnected', isTcpConnected);
  if (isTcpConnected) {
    setTimeout(async () => {
      await store.dispatch('commonModule/setCommonInfo', {isTcpConnected: true});
    }, 1500)
  }
})

instance?.appContext.config.globalProperties.$socket.on('viewerCheck', async (ip) => { // 뷰어인지 아닌지 체크하는곳
  await getIpAddress(ip)
});

const siteCdDvBarCode = ref(false);

const getIpAddress = async (ip: string) => {
  try {
    const result = await getDeviceIpApi();
    if (result.data === ip) {
      viewerCheckApp.value = result.data;
    } else {
      viewerCheckApp.value = result.data;
    }
  } catch (e) {
    console.log(e)
  }
}

function checkFullscreenStatus() {
  const {path} = router.currentRoute.value;
  if (path === '/user/login') {
    return;
  }
  isFullscreen.value = window.matchMedia('(display-mode: fullscreen)').matches;
  if (!isFullscreen.value) {
    showErrorAlert('Please click the full screen button.');
  } else {
    if (alertMessage.value === 'Please click the full screen button.') {
      hideAlert();
    }
  }
}

function startChecking() {
  // 화면 상태를 즉시 업데이트
  checkFullscreenStatus();
  // 1분(60000ms)마다 체크를 수행
  intervalState.intervalId = setInterval(checkFullscreenStatus, 60000);
}


watch(reqArr.value, async (newVal: CommonState) => {
  if (!newVal.reqArr) return;
  const uniqueReqArr = removeDuplicateJobCmd(newVal.reqArr);
  const notSysRunInfo = uniqueReqArr.filter((item) => !['SYSINFO', 'RUNNING_INFO'].includes(item.jobCmd));

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

window.addEventListener('unload', async () => {
  if (!ipMatches.value) return;
  instance?.appContext.config.globalProperties.$socket.emit('message', {
    type: 'SEND_DATA',
    payload: {
      jobCmd: 'clientExit',
      reqUserId: '',
      reqDttm: '',
    }
  });
})

const leave = async (event: any) => {
  event.preventDefault();
  if (!ipMatches.value) {
    const result = await getDeviceIpApi();
    const ipAddress = `ip=${result.data}`
    const url = `http://${result.data}:3000/close?${ipAddress}`;
    await axios.get(url);
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
  siteCdDvBarCode.value = false;
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
      return
    }
    const textDecoder = new TextDecoder('utf-8');
    const stringData = textDecoder.decode(data);
    const parseDataWarp = JSON.parse(stringData);

    if (alertMessage.value === MESSAGES.TCP_DiSCONNECTED) {
      hideAlert();
    }

    // 시스템정보 스토어에 담기
    switch (parseDataWarp.jobCmd) {
      case 'SYSINFO':
        const res = await sysInfoStore(parseDataWarp);
        if (res !== null) {
          showErrorAlert(res);
        }
        const deviceInfoObj = {
          siteCd: parseDataWarp.siteCd,
          deviceSerialNm: parseDataWarp.deviceSerialNm
        }
        if (!siteCdDvBarCode.value) {
          await saveDeviceInfo(deviceInfoObj);
        }
        break;
      case 'INIT':
        barcodeNum.value = '';
        await store.dispatch('commonModule/setCommonInfo', {initValData: false});
        sendSettingInfo();
        break;
      case 'START':
        barcodeNum.value = '';
        await runningStart();
        break;
      case 'RUNNING_INFO':
        parsedDataProps.value = parseDataWarp;
        runningInfoBoolean.value = true;
        await runningInfoStore(parseDataWarp);
        await runningInfoCheckStore(parseDataWarp);
        break;
      case 'STOP':
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
      case 'RUNNING_COMP':
        barcodeNum.value = '';
        await runningComplete();
        break;
      case 'PAUSE':
        barcodeNum.value = '';
        await store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {isPause: true}); // 일시정지 상태로 변경한다.
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: false});
        startStatus.value = false;
        runningInfoBoolean.value = false;
        break;
      case 'RESTART':
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
      case 'RECOVERY':
        barcodeNum.value = '';
        await store.dispatch('embeddedStatusModule/setEmbeddedStatusInfo', {userStop: false});
        await store.dispatch('commonModule/setCommonInfo', {runningSlotId: ''});
        await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: 0 });
        await store.dispatch('commonModule/setCommonInfo', {runningArr: []});
        break;
      case 'ERROR_CLEAR':
        console.log('err')
        await showSuccessAlert(MESSAGES.FAILED_ALERT);
        break;
      case 'SEARCH_CARD_COUNT':
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
      const regex = /[129]/g;
      if (String(data?.iCasStat) !== '999999999999') { // 스캔중일때는 pass + 완료상태일때도
        const dataICasStat = String(data?.iCasStat);
        const currentSlot = data?.slotInfo;
        const iCasStatArr = [...data?.iCasStat];

        if (iCasStatArr.lastIndexOf("2") !== -1) {
          await store.dispatch('runningInfoModule/setSlideBoolean', {key: 'slideBoolean', value: true});
        }

        // if (machineVersion.value === '100a') {
        //   if (data?.iCasChange === '1') pb100aCassette.value = 'reset';
        //   else pb100aCassette.value = '';
        // }

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
        if (iCasStatArr.lastIndexOf("2") !== -1) {
          runningArr.value = data;
        }

      }

    }

    async function saveTestHistory(data: any) {
      const completeSlot = data.slotInfo;
      if (!completeSlot) return;

      Object.assign(completeSlot, { userId: userId.value, isNormal: true });

      /** TODO MO Normal 조건 추가 필요 */
      if (isObjectEmpty(data?.MOInfo)) {
        console.log('검체 데이터 저장 실패');
        return;
      }

      const moInfoNewVal = data?.MOInfo;
      const convertedMoInfo = convertMoInfo(MAP_TEST_TYPE_TO_TEST_NAME[completeSlot.testType], moInfoNewVal);

      const traySlotFirstNum = machineVersion.value === '100a' ? `${data?.traySlot}` : '1';

      const newObj = {
        slotNo: completeSlot.slotNo,
        lock_status: false,
        traySlot: traySlotFirstNum + '-' + completeSlot.slotNo,
        barcodeNo: completeSlot.barcodeNo,
        patientId: completeSlot.patientId,
        patientNm: completeSlot.patientNm,
        gender: completeSlot.gender,
        birthDay: completeSlot.birthday,
        slotId: completeSlot.slotId,
        orderDttm: completeSlot.orderDttm,
        testType: completeSlot.testType,
        analyzedDttm: tcpReq().embedStatus.settings.saveReqDttm,
        tactTime: completeSlot.tactTime,
        classInfo: convertedMoInfo,
        cassetId: data?.cassetId,
        isNormal: completeSlot.isNormal,
        submitState: '',
        submitOfDate: '',
        submitUserId: '',
        memo: '',
      }
      await store.dispatch('commonModule/setCommonInfo', { currentAnalyzingSlotNo: completeSlot.slotNo });
      await saveRunningInfo(newObj, completeSlot.slotId);
    }

    async function saveDeviceInfo(deviceInfo: any) {
      try {
        const deviceData = await getDeviceInfoApi();
        if (deviceData.data.length === 0 || !deviceData.data) {
          await createDeviceInfoApi({ deviceItem: deviceInfo });
          siteCdDvBarCode.value = true;
        } else {
          siteCdDvBarCode.value = true;
        }

        await store.dispatch('commonModule/setCommonInfo', {siteCd: parseDataWarp.siteCd})
        localStorage.setItem('siteCd', parseDataWarp.siteCd);
      } catch (err) {
        console.error("Error handling device information", err);
        siteCdDvBarCode.value = true;
      }
    }

    async function saveRunningInfo(runningInfo: any, slotId: string) {
      try {
        let result: ApiResponse<void>;
        result = await createRunningApi({userId: Number(userId.value), runingInfoDtoItems: runningInfo});

        if (result) {
          if (slotId) {
            console.log('save successful');
          }
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
    console.log(e);
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

const convertMoInfo = (cassetteType: string, moInfo: MoInfoInterface[]) => {
  const convertedMoInfo = [];

  for (const moItem of moInfo) {
    const validClassIds = getValidClassIds(cassetteType, moItem.id);
    const updatingClassInfo = moItem.classInfo
        .filter(moClassInfoItem => validClassIds.includes(moClassInfoItem.classId))
        .map(moClassInfoItem => ({
          count: calcCount(Number(moItem?.LPCount), Number(moItem?.HPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType),
          classId: moClassInfoItem.classId,
          beforeGrade: setMoInfoGrade({
            cassetteType,
            classId: moClassInfoItem.classId,
            count: calcCount(Number(moItem?.LPCount), Number(moItem?.HPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType),
          }),
          afterGrade: setMoInfoGrade({
            cassetteType,
            classId: moClassInfoItem.classId,
            count: calcCount(Number(moItem?.LPCount), Number(moItem?.HPCount), Number(moClassInfoItem.count), moItem.id, moClassInfoItem.classId, cassetteType)
          })
        }))

    if (cassetteType === MO_TEST_TYPE.SPUTUM) {
      // Sputum Gram 계산을 위한 WBC, EP Cell Count 추출
      const wbcCount = moItem.classInfo.find(item => item.classId === CLASS_INFO_ID.WBC)?.count || 0;
      const epCellCount = moItem.classInfo.find(item => item.classId === CLASS_INFO_ID.EP_CELL)?.count || 0;
      const gradeText = getSputumGrade(wbcCount, epCellCount);
      const sputumItem = {
        count: 0,
        classId: '15',
        beforeGrade: gradeText,
        afterGrade: gradeText,
      }
      updatingClassInfo.push(sputumItem);
    }

    const updatedMoInfoItem = {
      id: moItem.id,
      name: moItem.name,
      classInfo: updatingClassInfo
    }
    convertedMoInfo.push(updatedMoInfoItem);
  }
  return convertedMoInfo;
};

const calcCount = (totalLPCount: number, totalHPCount: number, count: number, id: number, classId: string, cassetteType: string) => {
  if (id === 2) {
    switch (cassetteType) {
      case MO_TEST_TYPE.URINE:
        if (URINE_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(count / totalLPCount);
        }
        return Number(count / totalHPCount);
      case MO_TEST_TYPE.SPUTUM:
        if (SPUTUM_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(count / totalLPCount);
        }
        return Number(count / totalHPCount);
      case MO_TEST_TYPE.BLOOD:
        if (BLOOD_LOW_POWER_CLASS_IDS.includes(classId)) {
          return Number(count / totalLPCount);
        }
        return Number(count / totalHPCount);
    }
  }
  return Number(count);
}

const getValidClassIds = (cassetteType: string, id: number) => {
  switch (cassetteType) {
    case MO_TEST_TYPE.URINE:
      switch (id) {
        case 0:
          return URINE_LOW_POWER_CLASS_IDS;
        case 1:
          return URINE_HIGH_POWER_CLASS_IDS;
        case 2:
          return URINE_TOTAL_CLASS_IDS;
        default:
          return [];
      }
    case MO_TEST_TYPE.BLOOD:
      switch (id) {
        case 0:
          return BLOOD_LOW_POWER_CLASS_IDS;
        case 1:
          return BLOOD_HIGH_POWER_CLASS_IDS;
        case 2:
          return BLOOD_TOTAL_CLASS_IDS;
        default:
          return [];
      }
    case MO_TEST_TYPE.SPUTUM:
      switch (id) {
        case 0:
          return SPUTUM_LOW_POWER_CLASS_IDS;
        case 1:
          return SPUTUM_HIGH_POWER_CLASS_IDS;
        case 2:
          return SPUTUM_TOTAL_CLASS_IDS;
        default:
          return [];
      }
    default:
      return [];
  }
}

const setMoInfoGrade = ({ cassetteType, classId, count }: {cassetteType: string, classId: string, count: number}) => {

  switch (cassetteType) {
    case MO_TEST_TYPE.BLOOD:
      return existOrNone(count);

    case MO_TEST_TYPE.URINE:

      if (classId === CLASS_INFO_ID.YEAST) return existOrNone(count);
      return getGradeByRange(classId === CLASS_INFO_ID.WBC ? wbcConvertSetting.value : gramConvertSetting.value, count);

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
        await store.dispatch('commonModule/setCommonInfo', {iaRootPath: String(data?.iaRootPath)});
        await store.dispatch('commonModule/setCommonInfo', { cellImageAnalyzedSetting: data });
      }
    }
  } catch (e) {
    console.log(e);
  }
}

const showSuccessAlert = async (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
  alertMessage.value = message;
};

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_ERROR;
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};
</script>