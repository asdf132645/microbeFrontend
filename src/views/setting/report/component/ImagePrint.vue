<template>
  <div class="settingImagePrint">
    <button class="imagePrintBtn mb2" type="button" @click="toggleAllChecks">{{ allChecked ? 'Uncheck All' : 'Check All' }}</button>
    <label v-for="item in imagePrintArr" :key="item.id">
      <div>{{ item.fullNm }}</div>
      <div><input type="checkbox" :value="item.classId" v-model="selectedItems" /></div>
    </label>
  </div>
  <div class="mt1">
    <button class="saveBtn" type="button" @click="saveImagePrint()">Save</button>
  </div>

  <Confirm
      v-if="showConfirm"
      :is-visible="showConfirm"
      :message="confirmMessage"
      :type="MESSAGES.SETTING"
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
import { ref, onMounted, computed, watch } from 'vue';
import { DEFAULT_IMAGE_PRINT, settingName } from "@/common/defines/constFile/settings/settings";
import { ApiResponse } from "@/common/api/httpClient";
import {
  createImagePrintApi,
  getImagePrintApi,
  updateImagePrintApi
} from "@/common/api/service/setting/settingApi";
import Alert from "@/components/commonUi/Alert.vue";
import { MESSAGES } from '@/common/defines/constFile/constantMessageText';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Confirm from "@/components/commonUi/Confirm.vue";

const store = useStore();
const router = useRouter();
const imagePrintArr = ref<any[]>([]);
const selectedItems = ref<string[]>([]);
const saveHttpType = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');
const enteringRouterPath = computed(() => store.state.commonModule.enteringRouterPath);
const settingChangedChecker = computed(() => store.state.commonModule.settingChangedChecker);
const settingType = computed(() => store.state.commonModule.settingType);
const allChecked = ref(false);

onMounted(async () => {
  await getImagePrintData();
  await store.dispatch('commonModule/setCommonInfo', { settingType: settingName.imagePrint });
});

watch(() => selectedItems.value, async (newItem) => {
  imagePrintArr.value.forEach((item) => {
    item.checked = newItem.includes(item.classId);
  });

  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(imagePrintArr.value) });
  if (settingType.value !== settingName.imagePrint) {
    await store.dispatch('commonModule/setCommonInfo', { settingType: settingName.imagePrint });
  }
}, { deep: true });

watch(() => settingChangedChecker.value, () => {
  checkIsMovingWhenSettingNotSaved();
})

const checkIsMovingWhenSettingNotSaved = () => {
  showConfirm.value = true;
  confirmMessage.value = `${settingType.value} ${MESSAGES.SETTING_NOT_SAVED}`;
}

const saveImagePrint = async () => {
  try {
    let result: ApiResponse<void>;

    imagePrintArr.value.forEach((item) => {
      item.checked = selectedItems.value.includes(item.classId);
    });

    if (saveHttpType.value === 'post') {
      result = await createImagePrintApi({ imagePrintItems: imagePrintArr.value });
    } else {
      const updateResult = await updateImagePrintApi({ imagePrintItems: imagePrintArr.value });

      if (updateResult.data) {
        showSuccessAlert(MESSAGES.UPDATE_SUCCESSFULLY);
        await getImagePrintData();
      } else {
        showErrorAlert(MESSAGES.SETTING_UPDATE_FAILURE);
      }
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
      return;
    }

    if (result) {
      showSuccessAlert(MESSAGES.SETTING_SAVE_SUCCESS);
      saveHttpType.value = 'put';
      await getImagePrintData();
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
    }
  } catch (e) {
    console.error(e);
  }
};

const getImagePrintData = async () => {
  try {
    const result = await getImagePrintApi();

    if (result && result.data) {
      const data = result.data;

      if (!data || (data instanceof Array && data.length === 0)) {
        saveHttpType.value = 'post';
        imagePrintArr.value = DEFAULT_IMAGE_PRINT;
      } else {
        saveHttpType.value = 'put';
        imagePrintArr.value = data;
        selectedItems.value = data.filter((item) => item.checked).map((item) => item.classId);
        allChecked.value = selectedItems.value.length === imagePrintArr.value.length ? true : false;
      }

      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
    }
  } catch (e) {
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

const hideAlert = () => {
  showAlert.value = false;
};

const toggleAllChecks = () => {
  allChecked.value = !allChecked.value;
  if (allChecked.value) {
    selectedItems.value = imagePrintArr.value.map(item => item.classId);
  } else {
    selectedItems.value = [];
  }
};

const hideConfirm = async () => {
  await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
  showConfirm.value = false;
  await router.push(enteringRouterPath.value);
}

const handleOkConfirm = async () => {
  await saveImagePrint();
  showConfirm.value = false;
}

</script>
