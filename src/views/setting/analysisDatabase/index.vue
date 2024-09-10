<template>
  <div>
    <div class="settingTabSubButtons">
      <button @click="activateTab('cellImageAnalyzed')" :class="{ 'active': activeTab === 'cellImageAnalyzed' }">Cell Image Analyzed</button>
      <template v-if="viewerCheck !== 'viewer'">
        <button @click='activateTab("deviceControls")' :class="{ 'active': activeTab === 'deviceControls' }">Device Controls</button>
        <button @click='activateTab("gramRange")' :class="{ 'active': activeTab === 'gramRange' }">Gram Range</button>
      </template>
    </div>

    <div class="tab-content">
      <component :is="activeTabComponent" />
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
import { computed, ref } from 'vue';
import CellImageAnalyzed from "@/views/setting/analysisDatabase/component/cellImageAnalyzed.vue";
import DeviceControls from '@/views/setting/analysisDatabase/component/deviceControls.vue'
import GramRange from "@/views/setting/analysisDatabase/component/gramRange.vue";
import {useStore} from "vuex";
import Alert from "@/components/commonUi/Alert.vue";
import {messages} from "@/common/defines/constFile/constantMessageText";
import Confirm from "@/components/commonUi/Confirm.vue";
import {settingUpdate} from "@/common/lib/utils/settingSave";

const store = useStore();
const activeTab = ref('cellImageAnalyzed');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');

const movingTab = ref('');
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const settingType = computed(() => store.state.commonModule.settingType);
const beforeSettingFormattedString = computed(() => store.state.commonModule.beforeSettingFormattedString);
const afterSettingFormattedString = computed(() => store.state.commonModule.afterSettingFormattedString);

const activateTab = (tabName: string) => {
  if (activeTab.value === tabName) return;
  movingTab.value = tabName;
  if (beforeSettingFormattedString.value !== afterSettingFormattedString.value) {
    showConfirm.value = true;
    confirmMessage.value = `${settingType.value} ${messages.settingNotSaved}`;
  } else {
    activeTab.value = movingTab.value;
  }
};

const showSuccessAlert = async (message: string) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
}

const showErrorAlert = async (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
}

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'cellImageAnalyzed':
      return CellImageAnalyzed;
    case 'deviceControls':
      return DeviceControls;
    case 'gramRange':
      return GramRange;
    default:
      return null;
  }
});

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
