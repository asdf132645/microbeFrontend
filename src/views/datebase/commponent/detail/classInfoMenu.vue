<template>
  <div class="wbcMenu">
    <ul>
      <li :class='{ "onRight": isActive("LP") }' @click="pageGo(`/databaseDetail/${selectItems.id}?pageType=LP`)">
        <p class="menuIco">
          <font-awesome-icon :icon="['fas', 'disease']"/>
        </p>
        <p>LP Image</p>
      </li>

      <li :class='{ "onRight": isActive("HP") }' @click="pageGo(`/databaseDetail/${selectItems.id}?pageType=HP`)">
        <p class="menuIco">
          <font-awesome-icon :icon="['fas', 'clipboard']"/>
        </p>
        <p>HP Image</p>
      </li>

      <li :class='{ "onRight": isActive("/report") }' @click="pageGo('/report')">
        <p class="menuIco">
          <font-awesome-icon :icon="['fas', 'clipboard']"/>
        </p>
        <p>REPORT</p>
      </li>
    </ul>
    <div class="wbcMenuBottom">
      <button @click="moveWbc('up')" :disabled="isButtonDisabled">
        <font-awesome-icon :icon="['fas', 'circle-up']"/>
      </button>
      <button @click="moveWbc('down')" :disabled="isButtonDisabled">
        <font-awesome-icon :icon="['fas', 'circle-down']"/>
      </button>
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
</template>

<script setup lang="ts">
import {
  computed,
  defineEmits,
  defineProps,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch
} from "vue";
import router from "@/router";

import {
  clearPcIpState,
  detailRunningApi,
  pageUpDownRunningApi,
  updatePcIpStateApi
} from "@/common/api/service/runningInfo/runningInfoApi";
import {useStore} from "vuex";
import {LocationQueryValue, useRoute} from "vue-router";
import Alert from "@/components/commonUi/Alert.vue";
import {getDeviceIpApi} from "@/common/api/service/device/deviceApi";
import {MESSAGES} from "@/common/defines/constFile/constantMessageText";
import {IntervalType} from "@/common/type/generalTypes";

const instance = getCurrentInstance();
const store = useStore();
const route = useRoute();
const emits = defineEmits();
const props = defineProps(['isNext']);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const resData = ref<any>([]);

let timeoutId: IntervalType = null;
let socketTimeoutId: IntervalType = null; // 타이머 ID 저장
const isButtonDisabled = ref(false);
const pageMoveDeleteStop = ref(false);
const ipAddress = ref<any>('');
const isLoading = ref(true);
const keepPage = ref('');
const dbListDataFirstNum = computed(() => store.state.commonModule.dbListDataFirstNum);
const dbListDataLastNum = computed(() => store.state.commonModule.dbListDataLastNum);
const cellImageAnalyzedSetting = computed(() => store.state.commonModule.cellImageAnalyzedSetting);
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);

onMounted(async () => {
  await getDetailRunningInfo();
  isLoading.value = false;
  keepPage.value = cellImageAnalyzedSetting.value.keepPage;
  pageMoveDeleteStop.value = true;
  const ip = await getDeviceIpApi();
  ipAddress.value = ip.data;
});

onUnmounted(async () => {
  if (pageMoveDeleteStop.value) {
    await deleteConnectionStatus();
  }
})

watch(props.isNext, (newVal) => {
  if (newVal) {
    moveWbc('down')
  }
});

const getDetailRunningInfo = async () => {
  try {
    const result = await detailRunningApi(String(selectItems.value.id));
    await store.dispatch('commonModule/setCommonInfo', {testType: selectItems.value.testType});
    resData.value = result.data;
  } catch (e) {
    console.log(e);
    resData.value = null;
  }
}

const hideAlert = () => {
  showAlert.value = false;
};

const deleteConnectionStatus = async () => {
  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(resData.value?.id)});
  const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
  const { startDate, endDate, page, searchText, testType } = JSON.parse(day);
  const dayQuery = startDate + endDate + page + searchText + testType;
  const req = `oldPcIp=${ipAddress.value}&dayQuery=${dayQuery}`
  await clearPcIpState(req)
      .then(response => {
        delayedEmit('SEND_DATA', 'refreshDb', 300);
      }).catch(error => {
        console.log('2 err', error)
      });
}

const upDownBlockAccess = async () => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const { startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const req = `oldPcIp=${ipAddress.value}&newEntityId=${resData.value?.id}&newPcIp=${ipAddress.value}&dayQuery=${dayQuery}`
    await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(resData.value?.id)});

    await updatePcIpStateApi(req).then(response => {
      delayedEmit('SEND_DATA', 'refreshDb', 300);
    }).catch(error => {
      console.log('3 err', error)
    });
  } catch (e) {
    console.log(e)
  }
}

const delayedEmit = (type: string, payload: string, delay: number) => {
  if (socketTimeoutId !== null) clearTimeout(socketTimeoutId);

  socketTimeoutId = window.setTimeout(() => {
    instance?.appContext.config.globalProperties.$socket.emit('state', {
      type: 'SEND_DATA',
      payload: 'refreshDb'
    });
  }, delay);
};

const pageGo = async (path: string) => {
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: '' });
  router.push(path);
  pageMoveDeleteStop.value = false;
}

async function pageUpDownRunning(id: number, step: string, type: string) {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType} = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const req = `id=${id}&step=${step}&type=${type}&dayQuery=${dayQuery}`
    return await pageUpDownRunningApi(req);
  } catch (e) {
    console.log(e)
  }
}

const moveWbc = async (direction: any) => {
  if (direction === 'up') {
    if (dbListDataFirstNum.value === selectItems.value?.id) {
      showAlert.value = true;
      alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
      alertMessage.value = 'This is the first page. Navigation to other pages is not possible.';
      return;
    }
  } else {
    if (dbListDataLastNum.value === selectItems.value?.id) {
      showAlert.value = true;
      alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
      alertMessage.value = 'This is the last page. Navigation to other pages is not possible.';
      return;
    }
  }

  if (timeoutId !== null) clearTimeout(timeoutId);
  isButtonDisabled.value = true; // 버튼 비활성화
  await processNextDbIndex(direction, selectItems.value?.id);

  timeoutId = window.setTimeout(() => {
    isButtonDisabled.value = false;
  }, 700);

};

const processNextDbIndex = async (direction: any, id: number) => {
  const result = await pageUpDownRunning(id, '1', direction);
  if (result?.data !== null) resData.value = result?.data;

  if (result?.data?.lock_status) {
    showAlert.value = true;
    alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
    alertMessage.value = 'Someone else is editing.';
    return;
  }

  await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: result?.data });
  await store.dispatch('commonModule/setCommonInfo', { selectedSampleId: String(result?.data.id) });
  await handleDataResponse();
};

const handleDataResponse = async () => {
  if (!resData.value) return;
  await updateUpDown(selectItems.value);
};

const updateUpDown = async (selectItemsNewVal: any) => {
  if ((isActive("database")) || (!keepPage.value || keepPage.value === "false")) {
    await store.dispatch('commonModule/setCommonInfo', { currentPowerType: 'LP' });
    pageGo(`/databaseDetail/${selectItemsNewVal.id}?pageType=LP`);
  }
  emits('refreshClass', selectItemsNewVal);
  pageMoveDeleteStop.value = true;
  await upDownBlockAccess(selectItemsNewVal);
};

const isActive = (path: string) => {
  return route.fullPath.includes(path);
};

</script>
