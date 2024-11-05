<template>
  <div class="alignDiv" style="text-align: center">
    <ul>
      <li>
        <p class="mb20 mt20">CBC File Path</p>
        <input type="text" :value="filePathSetArr[0] ? filePathSetArr[0].cbcFilePath : ''"
               @input="updateCbcFilePath($event, 0)">
      </li>
    </ul>
  </div>
  <div class="mt10">
    <button class="saveBtn" type="button" @click="saveFilePathSet()">Save</button>
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
import { lisHotKeyAndLisFilePathAndUrl, SETTING_NAME } from "@/common/defines/constFile/settings/settings";
import {ApiResponse} from "@/common/api/httpClient";
import { createFilePathSetApi, getFilePathSetApi, updateFilePathSetApi } from "@/common/api/service/setting/settingApi";
import Alert from "@/components/commonUi/Alert.vue";
import {FilePathItem} from "@/common/api/service/setting/dto/filePathSetDto";
import {MESSAGES} from '@/common/defines/constFile/constantMessageText';
import Confirm from "@/components/commonUi/Confirm.vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const filePathSetArr = ref<FilePathItem[]>([]);
const saveHttpType = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');
const enteringRouterPath = computed(() => store.state.commonModule.enteringRouterPath);
const settingChangedChecker = computed(() => store.state.commonModule.settingChangedChecker);
const settingType = computed(() => store.state.commonModule.settingType);

onMounted(async () => {
  await getFilePathSetData();
  await store.dispatch('commonModule/setCommonInfo', { settingType: SETTING_NAME.filePathSet });
});

watch(() => filePathSetArr.value, async (filePathSetArr) => {
  await store.dispatch('commonModule/setCommonInfo', {afterSettingFormattedString: JSON.stringify(filePathSetArr)});
  if (settingType.value !== SETTING_NAME.filePathSet) {
    await store.dispatch('commonModule/setCommonInfo', { settingType: SETTING_NAME.filePathSet });
  }
}, { deep: true });

watch(() => settingChangedChecker.value, () => {
  checkIsMovingWhenSettingNotSaved();
})

const checkIsMovingWhenSettingNotSaved = () => {
  showConfirm.value = true;
  confirmMessage.value = `${settingType.value} ${MESSAGES.SETTING_NOT_SAVED}`;
}

const saveFilePathSet = async () => {
  try {
    let result: ApiResponse<void>;

    if (saveHttpType.value === 'post') {
      result = await createFilePathSetApi({filePathSetItems: filePathSetArr.value });
    } else {
      const updateResult = await updateFilePathSetApi({ filePathSetItems: filePathSetArr.value });

      if (updateResult.data) {
        showSuccessAlert(MESSAGES.UPDATE_SUCCESSFULLY);
        await getFilePathSetData();
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
      await getFilePathSetData();
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
    }
  } catch (e) {
    console.error(e);
  }
};

const getFilePathSetData = async () => {
  try {
    const result = await getFilePathSetApi();

    if (result && result.data) {
      const data = result.data;

      if (!data || (data instanceof Array && data.length === 0)) {
        saveHttpType.value = 'post';
        filePathSetArr.value = lisHotKeyAndLisFilePathAndUrl;
      } else {
        saveHttpType.value = 'put';
        filePathSetArr.value = data;
      }
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: JSON.stringify(filePathSetArr.value) });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(filePathSetArr.value) });
    }
  } catch (e) {
    console.error(e);
  }
};

const updateCbcFilePath = (event: any, index: number) => {
  filePathSetArr.value[index].cbcFilePath = event.target.value;
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

const hideConfirm = async () => {
  await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
  showConfirm.value = false;
  await router.push(enteringRouterPath.value);
}

const handleOkConfirm = async () => {
  await saveFilePathSet();
  showConfirm.value = false;
}

</script>

