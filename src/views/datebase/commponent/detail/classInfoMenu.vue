<template>
  <div class="wbcMenu">
    <ul>

      <template v-if="true">
        <li :class='{ "onRight": isActive(`/imagesComponent?id=${currentSampleId}&pageType=LP`) }' @click="pageGo(`/imagesComponent?id=${currentSampleId}&pageType=LP`)">
          <p class="menuIco">
            <font-awesome-icon :icon="['fas', 'disease']"/>
          </p>
          <p>LP Image</p>
        </li>
        <li v-if="!isLoading" :class='{ "onRight": isActive(`/imagesComponent?id=${currentSampleId}&pageType=HP`) }' @click="pageGo(`/imagesComponent?id=${currentSampleId}&pageType=HP`)">
          <p class="menuIco">
            <font-awesome-icon :icon="['fas', 'clipboard']"/>
          </p>
          <p>HP Image</p>
        </li>
      </template>

    </ul>
    <div @click="lisCbcClick" :class='{ "onRight": cbcLayer, "cbcLi": true }'>
      <font-awesome-icon :icon="['fas', 'desktop']"/>
      <p>LIS-CBC</p>
    </div>
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
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch
} from "vue";
import router from "@/router";

import {
  classInfoMenuDetailSelectQueryApi,
  clearPcIpState,
  detailRunningApi,
  pageUpDownRunnIngApi,
  updatePcIpStateApi
} from "@/common/api/service/runningInfo/runningInfoApi";
import {useStore} from "vuex";
import {LocationQueryValue, useRoute} from "vue-router";
import Alert from "@/components/commonUi/Alert.vue";
import {getDeviceIpApi} from "@/common/api/service/device/deviceApi";

const instance = getCurrentInstance();
const store = useStore();
const route = useRoute();
const emits = defineEmits();
const props = defineProps(['isNext']);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const selectItems = ref<any>(null);
const resData = ref<any>([]);
const wbcInfo = ref<any>([]);
const currentSampleId = ref<LocationQueryValue | LocationQueryValue[]>('');
const selectedSampleId = computed(() => store.state.commonModule.selectedSampleId);

const cbcLayer = computed(() => store.state.commonModule.cbcLayer);
const isButtonDisabled = ref(false);
let timeoutId: number | undefined = undefined;
const pageMoveDeleteStop = ref(false);

const ipAddress = ref<any>('');
const isLoading = ref(true);
const keepPage = ref('');
let socketTimeoutId: number | undefined = undefined; // 타이머 ID 저장
const testType = computed(() => store.state.commonModule.testType);
const dbListDataFirstNum = computed(() => store.state.commonModule.dbListDataFirstNum);
const dbListDataLastNum = computed(() => store.state.commonModule.dbListDataLastNum);

onBeforeMount(async () => {
  await getDetailRunningInfo();
  isLoading.value = false;
  keepPage.value = JSON.parse(JSON.stringify(sessionStorage.getItem('keepPage')));
})

onMounted(async () => {
  currentSampleId.value = route.query.id;
  pageMoveDeleteStop.value = true;
  const ip = await getDeviceIpApi();
  ipAddress.value = ip.data;
});

onUnmounted(async () => {
  if (pageMoveDeleteStop.value) {
    await deleteConnectionStatus();
  }
  await store.dispatch('commonModule/setCommonInfo', {cbcLayer: false});
})

watch(props.isNext, (newVal) => {
  if (newVal) {
    moveWbc('down')
  }
});

const getDetailRunningInfo = async () => {
  try {
    const result = await classInfoMenuDetailSelectQueryApi(String(selectedSampleId.value));
    selectItems.value = result.data;
    await store.dispatch('commonModule/setCommonInfo', {testType: selectItems.value.testType});

    resData.value = result.data;
  } catch (e) {
    console.log(e);
    selectItems.value = null;
    resData.value = null;
  }
}

const hideAlert = () => {
  showAlert.value = false;
};

const deleteConnectionStatus = async () => {
  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(resData.value?.id)});
  const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
  const {startDate, endDate, page, searchText, nrCount, testType, wbcInfo, wbcTotal} = JSON.parse(day);
  const dayQuery = startDate + endDate + page + searchText + nrCount + testType + wbcInfo + wbcTotal;
  const req = `oldPcIp=${ipAddress.value}&dayQuery=${dayQuery}`
  await clearPcIpState(req)
      .then(response => {
        delayedEmit('SEND_DATA', 'refreshDb', 300);
      }).catch(error => {
        console.log('2 err', error)
      });
}

const upDownBlockAccess = async (selectItems: any) => {
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

const pageGo = (path: string) => {
  router.push(path);
  pageMoveDeleteStop.value = false;
}

async function pageUpDownRunnIng(id: number, step: string, type: string) {
  try {
            const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, nrCount, testType, wbcInfo, wbcTotal} = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + nrCount + testType + wbcInfo + wbcTotal;
    const req = `id=${id}&step=${step}&type=${type}&dayQuery=${dayQuery}`
    const res = await pageUpDownRunnIngApi(req);
    if (res.data !== null) {
      resData.value = res.data;
      await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(res.data.id)});
    }
  } catch (e) {
    console.log(e)
  }
}

const moveWbc = async (direction: any) => {
  if (direction === 'up') {
    if (dbListDataFirstNum.value === selectItems.value?.id) {
      showAlert.value = true;
      alertType.value = 'success';
      alertMessage.value = 'This is the first page. Navigation to other pages is not possible.';
      return;
    }
  } else {
    if (dbListDataLastNum.value === selectItems.value?.id) {
      showAlert.value = true;
      alertType.value = 'success';
      alertMessage.value = 'This is the last page. Navigation to other pages is not possible.';
      return;
    }
  }

  store.dispatch('commonModule/setCommonInfo', {cbcLayer: false});
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId);
  }
  isButtonDisabled.value = true; // 버튼 비활성화
  await processNextDbIndex(direction, selectItems.value?.id);

  timeoutId = window.setTimeout(() => {
    isButtonDisabled.value = false;
  }, 700);

};

const processNextDbIndex = async (direction: any, id: number) => {
  const res: any = await pageUpDownRunnIng(id, '1', direction);
  if (resData.value?.lock_status) {
    showAlert.value = true;
    alertType.value = 'success';
    alertMessage.value = 'Someone else is editing.';
    return;
  }
  await handleDataResponse(res?.id, res);
};

const handleDataResponse = async (dbId: any, res: any) => {
  if (!resData.value) return;
  selectItems.value = resData.value;

  const resClassInfo = resData.value?.wbcInfoAfter.length === 0 ? resData.value?.wbcInfo?.wbcInfo[0] : resData.value?.wbcInfoAfter;
  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(dbId)});
  await updateUpDown(resClassInfo, resData.value);
};

const updateUpDown = async (selectWbc: any, selectItemsNewVal: any) => {

  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(selectItemsNewVal.id)});
  if ((selectItems.value?.testType === '01' && isActive("/databaseRbc")) || (!keepPage.value || keepPage.value === "false")) {
    pageGo('/imagesComponent');
  }
  emits('refreshClass', selectItemsNewVal);
  pageMoveDeleteStop.value = true;
  await upDownBlockAccess(selectItemsNewVal);
};

const isActive = (path: string) => {
  return route.fullPath === path;
};

const lisCbcClick = () => {
  //
  store.dispatch('commonModule/setCommonInfo', {cbcLayer: !cbcLayer.value});
}

</script>
