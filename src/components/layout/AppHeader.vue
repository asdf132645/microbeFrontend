<template>
  <header class='header'>
    <nav>
      <!--  좌측메뉴  -->
      <div class='appHeaderLeft' v-if="!appHeaderLeftHidden">
        <div class="borderLine">
          <img src="@/assets/celli.png" class="headerLogo"/>
          <p class="logoProjectTitle">MO</p>
        </div>
        <router-link :to="noRouterPush ? '#' : '/setting'"
                     :class='{ "leftActive": isActive("/setting"), "disabledLink": noRouterPush }'>
          <font-awesome-icon :icon="['fas', 'gear']" style="font-size: 1rem;"/>
          <span class='icoText'>Setting</span>
        </router-link>
        <router-link to="/"
                     v-if="viewerCheck === 'main'"
                     :class='{ "leftActive": isActive("/analysis") || route.path === "/" }'>
          <font-awesome-icon :icon="['fas', 'chart-pie']"
                             style="font-size: 1rem;"
          />
          <span class='icoText'>Analysis</span>
        </router-link>

        <router-link to="/dataBase"
                     :class='{ "leftActive": isActive("/dataBase") || isActive("/databaseDetail") || isActive("/report") }'>
          <font-awesome-icon :icon="['fas', 'server']"
                             style="font-size: 1rem;"
          />
          <span class='icoText'>Database</span>
        </router-link>

        <!-- 가운데 메뉴 -->
        <div v-if="machineVersion === '100a'" class="autoStart-container">
          <ProgressBar
              text="Auto Start"
              :value="autoStartTimer"
              gradientStart="#2196f3"
              gradientEnd="#03a9f4"
              :animationDuration="0.3"
              :showGlowEffect="true"
          />

        </div>

        <!--  우측메뉴  -->
        <div class="small-icon-menu">
          <div class="lastMenu">
            <ul>
              <li class="flex-align-center-justify-between">
                <span>
                  <font-awesome-icon :icon="['fas', 'circle-user']"/>
                {{ userModuleDataGet.userId }}
                </span>
                <span>{{ formattedDate }} {{ formattedTime }}</span>
              </li>
              <li class="lastLiM">
                <span class="logOutBox" @click="logout">LOGOUT</span>
                <span class="logOutBox" @click="exit"> EXIT</span>
                <span class="logOutBox" @click='fullScreen'>FULL SCREEN</span>
              </li>
            </ul>
          </div>
          <div class="iconHeaderMenu">
            <ul>
              <li class="alarm">
                <font-awesome-icon :icon="['fas', 'bell']" :class="{ 'blinking-red': isErrorAlarm, 'blinking-blue': isCompleteAlarm }"/>
              </li>
              <li>
                <font-awesome-icon v-if="isDoorOpen !== 'Y'" :icon="['fas', 'door-closed']"></font-awesome-icon>
                <font-awesome-icon v-else :icon="['fas', 'door-open']" style="color: red;" />
              </li>
              <li>
                <font-awesome-icon :icon="eqStatCdData.icon" :class="eqStatCdData.class"/>
              </li>
              <li class="oilCount-wrapper" @click="openLayer">
                <font-awesome-icon
                    :icon="['fas', 'droplet']"
                    @mouseenter="tooltipVisibleFunc('oilPrime', true)"
                    @mouseleave="tooltipVisibleFunc('oilPrime', false)"
                />
                <Tooltip :isVisible="tooltipVisible.oilPrime" className="mb08" position="bottom" type="" :message="`OilCount: ${oilCountData || 0}`" />
              </li>
              <li class="storage">
                <font-awesome-icon
                    :icon="['fas', 'database']"
                    @mouseenter="tooltipVisibleFunc('storage', true)"
                    @mouseleave="tooltipVisibleFunc('storage', false)"
                />
                <Tooltip :isVisible="tooltipVisible.storage" className="mb08" position="bottom" type="" :message="`Storage: ${storagePercentData || 0}`" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <Modal v-if="oilVisible" @update:closeLayer="closeLayer" @afterOpen="onModalOpen">
    <!-- 헤더 슬롯에 들어갈 내용 -->
    <template #header>
      <h2>Immersion Oil</h2>
    </template>

    <!-- 컨텐츠 슬롯에 들어갈 내용 -->
    <template #content>
      <div class="immersionOilContainer">
        <h5 class="modalTitle mb10">Immersion Oil count Reset</h5>
        <span class="grayText">Reset Immersion Oil count after changing Oil pack</span>
        <div class="flex-justify-between flex-align-center mt10">
          <span>Estimated number of slides left</span>
          <span class="f18">{{ oilCount }}</span>
        </div>

        <div class="flex-column-align-end">
          <div ref="statusBarWrapper" class="statusBarWrapper">
            <div ref="statusBar" class="statusBar"></div>
          </div>
          <div>
            <button @click='onReset' class="alertButton">Reset</button>
          </div>
        </div>
      </div>

      <div class='mt20'>
        <h5 class="modalTitle mb10">Prime Immersion Oil</h5>
        <span class="grayText mt10">Prime oil to remove air from the oil hose</span>
        <div class="flex-column-align-end">
          <div class="statusBarWrapper">
          </div>
          <button type="button" @click='onPrime' :class="{'alertButton': true, 'blinkGripper': isBlinkingPrime}">Prime
          </button>
        </div>
      </div>

    </template>
  </Modal>

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
      :message="confirmMessage"
      @hide="hideConfirm"
      @okConfirm="handleOkConfirm"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {computed, getCurrentInstance, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import router from "@/router";
import Modal from '@/components/commonUi/modal.vue';
import {MESSAGES} from "@/common/defines/constFile/constantMessageText";
import {getCellImgApi} from "@/common/api/service/setting/settingApi";
import Alert from "@/components/commonUi/Alert.vue";
import {tcpReq} from "@/common/tcpRequest/tcpReq";
import Confirm from "@/components/commonUi/Confirm.vue";
import EventBus from "@/eventBus/eventBus";
import Button from "@/components/commonUi/Button.vue";
import {getDateTimeStr} from "@/common/lib/utils/dateUtils";
import {logoutApi} from "@/common/api/service/user/userApi";
import {getDeviceIpApi} from "@/common/api/service/device/deviceApi";
import axios from "axios";
import {SOUND_COMPLETE_ALARM, SOUND_ERROR_ALARM} from "@/common/lib/utils/assetUtils";
import ProgressBar from "@/components/commonUi/ProgressBar.vue";
import Tooltip from "@/components/commonUi/Tooltip.vue";

const route = useRoute();
const appHeaderLeftHidden = ref(false);
const store = useStore();
const storedUser = sessionStorage.getItem('user');
const getStoredUser = JSON.parse(storedUser || '{}');
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const isBlinkingPrime = ref(false);
let blinkTimeout: ReturnType<typeof setTimeout> | null = null;
const machineVersion = ref('');

const instance = getCurrentInstance();
const showConfirm = ref(false);
const confirmType = ref('');
const confirmMessage = ref('');
const embeddedStatusJobCmd = computed(() => store.state.embeddedStatusModule);
const oilCount = ref(0);
const isDoorOpen = ref('');
const storagePercent = ref(0);
const eqStatCd = ref('');
const runInfo = computed(() => store.state.commonModule);
const commonDataGet = computed(() => store.state.commonModule);

const eqStatCdData = ref({
  icon: ['fas', 'person'],
  class: ''
});
const oilCountData = ref('');
const storagePercentData = ref('');
const oilVisible = ref(false);
const maxOilCount = ref(1000);
const statusBarWrapper = ref<HTMLDivElement | null>(null);
const statusBar = ref<HTMLDivElement | null>(null);
const userId = ref('');
const userModuleDataGet = computed(() => store.state.userModule);
const analysisType = computed(() => store.state.commonModule.analysisType);
const isCompleteAlarm = computed(() => store.state.commonModule.isCompleteAlarm);
const isErrorAlarm = computed(() => store.state.commonModule.isErrorAlarm);
const isErrorAlarmRunning = ref(false);
const isCompleteAlarmRunning = ref(false);
const alarmCount = ref(0);
const noRouterPush = ref(false);
const currentDate = ref<string>("");
const currentTime = ref<string>("");
let isAlarmInterval = null;
let isCompleteAlarmInterval = null;
let isErrorAlarmInterval = null;
const isPlayingCompleteAlarm = ref(false);
const isPlayingErrorAlarm = ref(false);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const clickType = ref('');
const isStartCountUpdated = ref(false);
const autoStartTimer = ref(0);

const formattedDate = computed(() => currentDate.value);
const formattedTime = computed(() => currentTime.value);
const tooltipVisible = ref({
  oilPrime: false,
  storage: false,
})

const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'});
  currentTime.value = now.toLocaleTimeString('en-US');
};

const handleOkConfirm = async () => {
  showConfirm.value = false;
  await logoutApi({userId: userId.value});
  if (clickType.value === 'exit') {
    if (viewerCheck.value === 'main') {
      EventBus.publish('childEmitSocketData', tcpReq().embedStatus.exit);
    } else {
      const result = await getDeviceIpApi();
      const ipAddress = `ip=${result.data}`
      const url = `http://${result.data}:3000/close?${ipAddress}`;
      await axios.get(url);
    }
  } else {
    sessionStorage.clear();
    await router.push('user/login');
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }
}

const hideConfirm = () => {
  showConfirm.value = false;
}

const fullScreen = () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

onBeforeMount(() => {
  machineVersion.value = window.MACHINE_VERSION;
})

onMounted(async () => {
  await cellImgGet();
  updateDateTime(); // 초기 시간 설정
  const timerId = setInterval(updateDateTime, 1000); // 1초마다 현재 시간을 갱신
  // 컴포넌트가 해제되기 전에 타이머를 정리하여 메모리 누수를 방지
  onBeforeUnmount(() => {
    clearInterval(timerId);
  });
  if (userId.value === '') { // 사용자가 강제 초기화 시킬 시 유저 정보를 다시 세션스토리지에 담아준다.
    await store.dispatch('userModule/setUserAction', getStoredUser);
  }

  window.addEventListener('wheel', preventScroll, {passive: false});
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', preventScroll);
})

watch(userModuleDataGet.value, (newUserId) => {
  userId.value = newUserId.id;
});

watch([embeddedStatusJobCmd.value], async (newVals: any) => {
  await nextTick();
  oilCount.value = Number(newVals[0].sysInfo.oilCount);
  isDoorOpen.value = newVals[0].sysInfo.isDoorOpen;
  storagePercent.value = Number(newVals[0].sysInfo.storageSize);
  eqStatCd.value = newVals[0].sysInfo.eqStatCd;

  const autoStartTimerNumber = newVals[0].sysInfo?.autoStartTimer;
  if (machineVersion.value === '100a' && autoStartTimerNumber !== undefined) {
    autoStartTimer.value = (parseFloat(autoStartTimerNumber) / 5) * 100;
  }

  eqStatCdData.value = eqStatCdChangeVal(newVals[0].sysInfo.eqStatCd);
  oilCountData.value = oilCountChangeVal();
  storagePercentData.value = storagePercentChangeVal();

  if (!isStartCountUpdated.value) searchCardCount();

});

const preventScroll = (event: any) => {
  if (event.ctrlKey) {
    event.preventDefault();
  }
};

const searchCardCount = async () => {
  const reqDttm = getDateTimeStr(); // 현재 날짜와 시간을 가져오는 함수
  const payload = {
    jobCmd: 'SEARCH_CARD_COUNT',
    reqUserId: userId.value,
    reqDttm: reqDttm,
    testType: analysisType.value,
  };
  EventBus.publish('childEmitSocketData', payload);
  isStartCountUpdated.value = true;
}


watch([commonDataGet.value], async (newVals: any) => {
  const newValsObj = JSON.parse(JSON.stringify(newVals));
  if (newValsObj[0].isRunningState) noRouterPush.value = true;
  else noRouterPush.value = false;
});

watch(() => isErrorAlarm.value, async (newIsErrorAlarm: boolean) => {
  if (newIsErrorAlarm && !isErrorAlarmRunning.value) {
    if (!isPlayingErrorAlarm.value) {
      isErrorAlarmRunning.value = true;
      isPlayingErrorAlarm.value = true;
      try {
        await SOUND_ERROR_ALARM.play();
      } catch (e) {
        console.error(e);
      } finally {
        isPlayingErrorAlarm.value = false;
      }
    }
    isErrorAlarmInterval = setTimeout(() => {
      store.dispatch('commonModule/setCommonInfo', { isErrorAlarm: false });
      isErrorAlarmRunning.value = false;
    }, alarmCount.value);
  }
})

watch(() => isCompleteAlarm.value, async (newIsCompleteAlarm: boolean) => {
  if (newIsCompleteAlarm && !isCompleteAlarmRunning.value) {
    if (!isPlayingCompleteAlarm.value) {
      isCompleteAlarmRunning.value = true;
      isPlayingCompleteAlarm.value = true;
      try {
        await SOUND_COMPLETE_ALARM.play();
      } catch (e) {
        console.error(e);
      } finally {
        isPlayingCompleteAlarm.value = false;
      }
    }

    isCompleteAlarmInterval = setTimeout(() => {
      isCompleteAlarmRunning.value = false;
      store.dispatch('commonModule/setCommonInfo', { isCompleteAlarm: false });
    }, alarmCount.value);
  }
})

const showSuccessAlert = (message: string) => {
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

const isActive = (path: string) => {
  return route.fullPath.includes(path);
};

const logout = () => {
  clickType.value = 'logout';
  confirmMessage.value = MESSAGES.Logout;
  showConfirm.value = true;
  localStorage.removeItem('user')
}

const exit = async () => {
  clickType.value = 'exit';
  confirmMessage.value = MESSAGES.exit;
  showConfirm.value = true;
}

const oilCountChangeVal = (): string => {
  if (oilCount.value >= 0 && oilCount.value <= 100) {
    return '10%';
  } else if (oilCount.value > 100 && oilCount.value <= 250) {
    return '25%';
  } else if (oilCount.value > 250 && oilCount.value <= 500) {
    return '50%';
  } else if (oilCount.value > 500 && oilCount.value <= 750) {
    return '75%';
  } else {
    return '100%';
  }
}

const storagePercentChangeVal = () => {
  if (storagePercent.value >= 0 && storagePercent.value <= 30) {
    return '30%';
  } else if (storagePercent.value > 30 && storagePercent.value <= 60) {
    return '60%';
  } else if (storagePercent.value > 60 && storagePercent.value <= 90) {
    return '90%';
  } else {
    return '100%';
  }
}
const eqStatCdChangeVal = (eqStatCdVal: string) => {
  if (eqStatCdVal === '01') {
    return {
      icon: ['fas', 'person'],
      class: ''
    };
  } else if (eqStatCdVal === '02') {
    return {
      icon: ['fas', 'person-walking'],
      class: ''
    };
  } else if (eqStatCdVal === '03') {
    return {
      icon: ['fas', 'person-running'],
      class: 'runRed'
    };
  } else if (eqStatCdVal === '04' || eqStatCdVal === '05') {
    return {
      icon: ['fas', 'person-running'],
      class: 'runBlue'
    };
  }

  return {
    icon: ['fas', 'person'],
    class: ''
  };
}

const openLayer = () => {
  if (viewerCheck.value === 'viewer') {
    showErrorAlert('Access is only available from the main PC.');
    return;
  }

  oilVisible.value = true;
};

const closeLayer = (val: boolean) => {
  oilVisible.value = val;
};

const onReset = () => {

  getPercent();
  const settings = tcpReq().embedStatus.settings;
  settings.reqUserId = userId;

  Object.assign(settings, {
    oilCount,
    isOilReset: 'Y',
    // uiVersion: 'uimd-pb-comm_v3',
    userId: '',
  });

  EventBus.publish('childEmitSocketData', settings);
  showSuccessAlert(MESSAGES.SUCCESS_ALERT);
}

const getPercent = () => {
  if (!statusBarWrapper.value || !statusBar.value) return;
  const percent = Math.min(Math.round((oilCount.value / maxOilCount.value) * 100), 100);
  const progressBarWidth = `${(percent / 100) * statusBarWrapper.value.offsetWidth}px`;
  statusBar.value.style.width = progressBarWidth;
}

const onPrime = () => {
  if (blinkTimeout !== null) clearTimeout(blinkTimeout);

  isBlinkingPrime.value = true;
  tcpReq().embedStatus.oilPrime.reqUserId = userId;
  EventBus.publish('childEmitSocketData', tcpReq().embedStatus.oilPrime);

  blinkTimeout = setTimeout(() => {
    isBlinkingPrime.value = false;
    blinkTimeout = null;
  }, 1500);
}

const onModalOpen = () => {
  // 모달이 열린 후에 실행되는 콜백 함수
  getPercent();
};

const cellImgGet = async () => {
  try {
    const result = await getCellImgApi();
    if (result) {
      if (result?.data) {
        const data = result.data;
        alarmCount.value = data?.isAlarm ? Number(data.alarmCount) * 1000 : 5000;
        await store.dispatch('commonModule/setCommonInfo', { cellImageAnalyzedSetting: data });
        await store.dispatch('commonModule/setCommonInfo', {iaRootPath: String(data?.iaRootPath)});
        sessionStorage.setItem('iaRootPath', data?.iaRootPath);

      }
    }

  } catch (e) {
    console.error(e);
  }
}

const tooltipVisibleFunc = (type: 'oilPrime' | 'storage', visible: boolean) => {
  tooltipVisible.value[type] = visible;
}

</script>
