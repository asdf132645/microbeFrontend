<template>
  <div class="alignDiv">
    <label v-for="item in cbcCodeArr" :key="item.cd">
      <p class="mb10">{{ item.fullNm }}</p>
      <input type="text" v-model="item.classCd" />
    </label>
  </div>
  <div class="mt10">
    <button class="saveBtn" type="button" @click="saveCbcCode()">Save</button>
  </div>

  <Confirm
      v-if="showConfirm"
      :is-visible="showConfirm"
      :type="MESSAGES.SETTING"
      :message="confirmMessage"
      @hide="hideConfirm"
      @okConfirm="handleOkConfirm"
  />

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
import {ref, onMounted, computed, watch} from 'vue';
import {DEFAULT_CBC_LIST, SETTING_NAME} from "@/common/defines/constFile/settings/settings";
import Alert from "@/components/commonUi/Alert.vue";
import {cbcCodeItem} from "@/common/api/service/setting/dto/lisCodeDto";
import {MESSAGES} from '@/common/defines/constFile/constantMessageText';
import {getDeviceInfoApi} from "@/common/api/service/device/deviceApi";
import Confirm from "@/components/commonUi/Confirm.vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const cbcCodeArr = ref<cbcCodeItem[]>([]);
const saveHttpType = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');
const enteringRouterPath = computed(() => store.state.commonModule.enteringRouterPath);
const settingChangedChecker = computed(() => store.state.commonModule.settingChangedChecker);
const settingType = computed(() => store.state.commonModule.settingType);
const siteCd = ref('');

onMounted(async () => {
  await getDeviceInfo();
  await getImagePrintData();
  await store.dispatch('commonModule/setCommonInfo', { settingType: SETTING_NAME.cbcCode });
});

watch(() => cbcCodeArr.value, async (cbcCodeArrAfterSetting) => {
  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(cbcCodeArrAfterSetting) });
  if (settingType.value !== SETTING_NAME.cbcCode) {
    await store.dispatch('commonModule/setCommonInfo', { settingType: SETTING_NAME.cbcCode });
  }
}, { deep: true });

watch(() => settingChangedChecker.value, () => {
  checkIsMovingWhenSettingNotSaved();
})

const checkIsMovingWhenSettingNotSaved = () => {
  showConfirm.value = true;
  confirmMessage.value = `${settingType.value} ${MESSAGES.SETTING_NOT_SAVED}`;
}

// const saveCbcCode = async () => {
//   try {
//     let result: ApiResponse<void>;
//
//     if (saveHttpType.value === 'post') {
          // createCBCRBC
//     } else {
          // updateRBC
//
//       if (updateResult.data) {
//         showSuccessAlert(MESSAGES.UPDATE_SUCCESSFULLY);
//         await getImagePrintData();
//       } else {
//         showErrorAlert(MESSAGES.SETTING_UPDATE_FAILURE);
//       }
//       await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
//       await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
//       return;
//     }
//
//     if (result) {
//       showSuccessAlert(MESSAGES.SETTING_SAVE_SUCCESS);
//       saveHttpType.value = 'put';
//       await getImagePrintData();
//       await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
//       await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };

const getImagePrintData = async () => {
  try {
    const result = await { data: 'cbc' };

    if (result && result.data) {
      const data = result.data;

      if (!data || (data instanceof Array && data.length === 0)) {
        saveHttpType.value = 'post';
        cbcCodeArr.value = DEFAULT_CBC_LIST;

      } else {
        saveHttpType.value = 'put';
        cbcCodeArr.value = data;
      }

      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: JSON.stringify(cbcCodeArr.value) });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(cbcCodeArr.value) });
    }
  }
  catch (e) {
    console.error(e);
  }
};

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

const getDeviceInfo = async () => {
  try {
    const deviceData = await getDeviceInfoApi();
    siteCd.value = deviceData.data.siteCd;
  } catch (e) {
    console.error(e);
  }
}

const hideAlert = () => {
  showAlert.value = false;
};

const hideConfirm = async () => {
  await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
  showConfirm.value = false;
  await router.push(enteringRouterPath.value);
}

const handleOkConfirm = async () => {
  await saveCbcCode();
  showConfirm.value = false;
}

</script>

