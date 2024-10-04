<template>
  <div>
    <div class="settingTabSubButtons">
<!--      <button @click="selectTab('ImagePrint')" :class="{ 'active': activeTab === 'ImagePrint' }">Image Print</button>-->
      <button @click="selectTab('CbcCode')" :class="{ 'active': activeTab === 'CbcCode' }">CBC Code</button>
      <button @click="selectTab('filePathSet')" :class="{ 'active': activeTab === 'filePathSet' }">CBC File Path</button>
    </div>

    <div class="tab-content">
      <component :is="selectedTabComponent"/>
    </div>
  </div>

  <Confirm
      v-if="showConfirm"
      :is-visible="showConfirm"
      :message="confirmMessage"
      :confirmText="messages.SAVE"
      :closeText="messages.LEAVE"
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
import ImagePrint from "@/views/setting/report/component/ImagePrint.vue";
import cbcCode from "@/views/setting/report/component/cbcCode.vue";
import FilePathSet from '@/views/setting/report/component/filePathSet.vue';
import { computed, ref } from "vue";
import { useStore } from "vuex";
import {messages} from "@/common/defines/constFile/constantMessageText";
import Confirm from "@/components/commonUi/Confirm.vue";
import {settingUpdate} from "@/common/lib/utils/settingSave";
import Alert from "@/components/commonUi/Alert.vue";

const store = useStore();
let activeTab = ref('CbcCode');
const movingTab = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');
const settingType = computed(() => store.state.commonModule.settingType);
const beforeSettingFormattedString = computed(() => store.state.commonModule.beforeSettingFormattedString);
const afterSettingFormattedString = computed(() => store.state.commonModule.afterSettingFormattedString);

const selectTab = (tabName: string) => {
  if (activeTab.value === tabName) return;
  movingTab.value = tabName;
  if (beforeSettingFormattedString.value !== afterSettingFormattedString.value) {
    showConfirm.value = true;
    confirmMessage.value = `${settingType.value} ${messages.settingNotSaved}`;
  } else {
    activeTab.value = movingTab.value;
  }
};

const selectedTabComponent = computed(() => {
  switch (activeTab.value) {
    // case 'ImagePrint':
    //   return ImagePrint;
    case 'CbcCode':
      return cbcCode;
    case 'filePathSet':
      return FilePathSet;
    default:
      return null;
  }
});

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
}

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
}

const hideConfirm = async () => {
  await store.dispatch('commonModule/setCommonInfo', {beforeSettingFormattedString: null});
  await store.dispatch('commonModule/setCommonInfo', {afterSettingFormattedString: null});
  activeTab.value = movingTab.value;
  showConfirm.value = false;
}

const handleOkConfirm = async () => {
  showConfirm.value = false;
  try {
    console.log(settingType.value);
    await settingUpdate(settingType.value, JSON.parse(afterSettingFormattedString.value));
    await showSuccessAlert(messages.settingSaveSuccess);
  } catch (e) {
    await showErrorAlert(messages.settingSaveFailure);
  }
}

</script>