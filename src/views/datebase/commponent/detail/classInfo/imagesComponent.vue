<template>
  <ClassInfoMenu @refreshClass="refreshClass" :isNext="isNext" @isNextFalse="isNextFalse"/>

  <div class="wbcContent">
    <div class="topClintInfo">
      <ul>
        <li>
          {{ projectType === 'bm' ? getBmTestTypeText(selectItems?.testType) : getTestTypeText(selectItems?.testType) }}
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
      <ClassInfo v-if="!isLoading" :wbcInfo="wbcInfo" :selectItems="selectItems" :classCompareShow="classCompareShow"
                 type='listTable'
                 @nextPage="nextPage"
                 @scrollEvent="scrollToElement"/>
    </div>

    <div :class="'databaseWbcLeft' + (cbcLayer ? ' cbcLayer' : '')">

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
import {computed, getCurrentInstance, onBeforeMount, onMounted, ref, watch} from "vue";
import {classInfoDetailApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {useStore} from "vuex";

import {getBmTestTypeText, getTestTypeText} from "@/common/lib/utils/conversionDataUtils";

import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import ClassInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classInfo.vue";
import LisCbc from "@/views/datebase/commponent/detail/lisCbc.vue";
import Alert from "@/components/commonUi/Alert.vue";

const selectedTitle = ref('');
const wbcInfo = ref<any>(null);

const selectItems = ref<any>(null);
const store = useStore();
const userId = ref('');
const userModuleDataGet = computed(() => store.state.userModule);
const cbcLayer = computed(() => store.state.commonModule.cbcLayer);

const iaRootPath = ref<any>(store.state.commonModule.iaRootPath);
const selectedSampleId = computed(() => store.state.commonModule.selectedSampleId);


const imgSet = ref(false);
const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

const instance = getCurrentInstance();
const projectType = ref<any>('bm');

const showSize = ref(false);

const isNext = ref(false);
const classCompareShow = ref(false);
const isLoading = ref(true);
const $imageGalleryRef = ref<any>(null);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');


onBeforeMount(async () => {
  isLoading.value = false;
  projectType.value = window.PROJECT_TYPE;
})

onMounted(async () => {
  await getDetailRunningInfo();
  wbcInfo.value = [];

});

const getDetailRunningInfo = async () => {
  try {
    const result = await classInfoDetailApi(String(selectedSampleId.value));
    selectItems.value = result.data;

    const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path !== null && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
    iaRootPath.value = path;

  } catch (e) {
    console.log(e);
  }
}

const nextPage = () => {
  isNext.value = true;
}

const isNextFalse = () => {
  isNext.value = false;
}

const handleClickOutside = (event: any) => {
  // 클릭 이벤트의 대상이 imgSet이 아닌지 확인
  if (!event.target.closest('.imgSetWrap')) {
    imgSet.value = false;
    selectedTitle.value = '';
  }

  if (!event.target.closest('.sizeContainer, .sizeButton')) {
    showSize.value = false;
  }
};

watch(userModuleDataGet.value, (newUserId, oldUserId) => {
  userId.value = newUserId.id;
});

const scrollToElement = (itemId: number) => {
  if ($imageGalleryRef.value) {
    $imageGalleryRef.value.scrollToElement(itemId);
  }
};

async function updateOriginalDb(notWbcAfterSave?: string) {
//
}

const hideAlert = () => {
  showAlert.value = false;
}
const refreshClass = async (data: any) => {

  await getDetailRunningInfo();
  selectItems.value = data;
  const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
  iaRootPath.value = path;

}
</script>
