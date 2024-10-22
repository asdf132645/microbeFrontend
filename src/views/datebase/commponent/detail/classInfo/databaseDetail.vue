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
        <ClassInfo type='listTable' @nextPage="nextPage" />
    </div>


    <div :class="'databaseMoRight' + (cbcLayer ? ' cbcLayer' : '')">
      <ClassImageInfo />
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
import { LocationQueryValue, useRoute } from "vue-router";
import { BEFORE_AFTER_STATUS } from "@/common/defines/constFile/dataBase";
import { useQuery } from "@vue/apollo-composable";
import { GetRunningInfoByIdDocument } from "@/gql";
import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import ClassInfo from "@/views/datebase/commponent/detail/classInfo/commonLeftInfo/classInfo.vue";
import LisCbc from "@/views/datebase/commponent/detail/lisCbc.vue";
import Alert from "@/components/commonUi/Alert.vue";
import ClassImageInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classImageInfo.vue";



const store = useStore();
const route = useRoute();
const wbcInfo = ref<any>(null);
const selectItems = computed(() => store.state.commonModule.currentSelectItems);

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
  await getDetailRunningInfo();
  wbcInfo.value = [];
});

const getDetailRunningInfo = async () => {
  const { result, loading, error } = useQuery(GetRunningInfoByIdDocument, selectItems.value.id);
  console.log('result', result);
  console.log('loading', loading);
  console.log('error', error);
  try {
    // Store에 담아서 관리
    // 상위 부모에서 호출 한번만
    // Page 달라졌을 때만 업데이트

    // Graph QL 사용하며
    const result = await detailRunningApi(selectItems.value.id);
    await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: result.data });
  } catch (e) {
    await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: {} });
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
  await getDetailRunningInfo();
  await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: data });
  const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
  iaRootPath.value = path;
  await store.dispatch('commonModule/setCommonInfo', { databaseDetailBeforeAfterStatus: BEFORE_AFTER_STATUS.BEFORE })
}

</script>
