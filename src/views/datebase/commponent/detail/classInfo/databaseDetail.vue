<template>
  <ClassInfoMenu @refreshClass="refreshClass" :isNext="isNext" @isNextFalse="isNextFalse"/>

  <div class="wbcContent">
    <div class="topClintInfo">
      <ul>
        <li>
          {{ getTestTypeText(selectItems?.testType) }}
        </li>
        <li>{{ selectItems?.barcodeNo }}</li>
        <li>{{ selectItems?.patientId || 'patientId No Data' }}</li>
        <li>{{ selectItems?.cbcPatientNo }}</li>
        <li>{{ selectItems?.patientName }}</li>
        <li> {{ selectItems?.cbcPatientNm }} {{ selectItems?.cbcSex }} {{ selectItems?.cbcAge }}</li>
        <li>{{ selectItems?.analyzedDttm }}</li>
      </ul>
    </div>
    <LisCbc v-if="cbcLayer" :selectItems="selectItems"/>
    <div :class="'databaseWbcRight shadowBox' + (cbcLayer ? ' cbcLayer' : '')">
        <ClassInfo :selectItems="selectItems" type='listTable' @nextPage="nextPage" />
    </div>


    <div :class="'databaseMoRight' + (cbcLayer ? ' cbcLayer' : '')">
      <ClassImageInfo :selectItems="selectItems" />
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
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
import { detailRunningApi } from "@/common/api/service/runningInfo/runningInfoApi";
import { useStore } from "vuex";
import { getTestTypeText } from "@/common/lib/utils/conversionDataUtils";
import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import ClassInfo from "@/views/datebase/commponent/detail/classInfo/commonLeftInfo/classInfo.vue";
import LisCbc from "@/views/datebase/commponent/detail/lisCbc.vue";
import Alert from "@/components/commonUi/Alert.vue";
import ClassImageInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classImageInfo.vue";
import { LocationQueryValue, useRoute } from "vue-router";
import {beforeAfterStatus} from "@/common/defines/constFile/dataBase";


const store = useStore();
const route = useRoute();
const wbcInfo = ref<any>(null);
const selectItems = ref<any>(null);
const currentSampleId = ref<LocationQueryValue | LocationQueryValue[]>('');

const userId = ref('');
const userModuleDataGet = computed(() => store.state.userModule);
const cbcLayer = computed(() => store.state.commonModule.cbcLayer);
const iaRootPath = ref<string>(store.state.commonModule.iaRootPath);
const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const instance = getCurrentInstance();
const isNext = ref(false);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');

onMounted(async () => {
  currentSampleId.value = route.params.id;
  await getDetailRunningInfo();
  wbcInfo.value = [];
});

watch(() => route.params.id, async (newId, oldId) => {
  if (newId !== oldId) {
    currentSampleId.value = newId;
    await getDetailRunningInfo();
  }
})

const getDetailRunningInfo = async () => {
  try {
    const result = await detailRunningApi(currentSampleId.value);
    selectItems.value = result.data;
  } catch (e) {
    selectItems.value = {};
    console.log(e);
  } finally {
    iaRootPath.value = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path !== null && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
  }
}

const nextPage = () => {
  isNext.value = true;
}

const isNextFalse = () => {
  isNext.value = false;
}

watch(userModuleDataGet.value, (newUserId, oldUserId) => {
  userId.value = newUserId.id;
});

async function updateOriginalDb(notWbcAfterSave?: string) {
//
}

const hideAlert = () => {
  showAlert.value = false;
}
const refreshClass = async (data: any) => {
  // await getDetailRunningInfo();
  selectItems.value = data;
  const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
  iaRootPath.value = path;
  await store.dispatch('commonModule/setCommonInfo', { databaseDetailBeforeAfterStatus: beforeAfterStatus.BEFORE })
}

</script>
