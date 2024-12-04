<template>
  <ClassInfoMenu @refreshClass="refreshClass" :isNext="isNext" @isNextFalse="isNextFalse"/>

  <div class="list-detail-container">
    <DetailHeader
        :testType="getTestTypeText(selectItems?.testType)"
        :barcodeNo="selectItems?.barcodeNo"
        :cbcPatientNo="selectItems?.cbcPatientNo"
        :patientName="selectItems?.patientName"
        :hospitalName="selectItems?.hosName"
        :cbcPatientName="selectItems?.cbcPatientNm"
        :cbcSex="selectItems?.cbcSex"
        :cbcAge="selectItems?.cbcAge"
    />
    <div class="databaseDetailLeft container-shadow">
        <ClassInfo :selectItems="selectItems" type='listTable' @nextPage="nextPage" />
    </div>


    <div class="databaseDetailRight">
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
import { LocationQueryValue, useRoute } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import { GetRunningInfoByIdDocument } from "@/gql";
import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import ClassInfo from "@/views/datebase/commponent/detail/classInfo/commonLeftInfo/classInfo.vue";
import Alert from "@/components/commonUi/Alert.vue";
import ClassImageInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classImageInfo.vue";
import DetailHeader from "@/views/datebase/commponent/detail/detailHeader.vue";



const store = useStore();
const route = useRoute();
const wbcInfo = ref<any>(null);
const iaRootPath = ref<string>(store.state.commonModule.iaRootPath);
const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
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
  // const { result, loading, error } = useQuery(GetRunningInfoByIdDocument, selectItems.value.id);
  try {
    // Store에 담아서 관리
    // 상위 부모에서 호출 한번만
    // Page 달라졌을 때만 업데이트

    // Graph QL 사용하며
    const result = await detailRunningApi(selectItems.value.id);
    await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: result.data });
  } catch (e) {
    await store.dispatch('/commonModulesetCommonInfo', { currentSelectItems: {} });
    console.error(e);
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

const hideAlert = () => {
  showAlert.value = false;
}
const refreshClass = async (data: any) => {
  await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: data });
  const path = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : store.state.commonModule.iaRootPath;
  iaRootPath.value = path;
  await store.dispatch('commonModule/setCommonInfo', { refreshClass: false });
}

</script>
