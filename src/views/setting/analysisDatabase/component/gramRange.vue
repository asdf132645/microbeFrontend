<template>
  <div class="settingGramRangeContainer">
    <table class="defaultTable">
      <thead>
        <tr>
          <th></th>
          <th>Rare</th>
          <th>Few</th>
          <th>Moderate</th>
          <th>Many</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="gramItem in gramItems" :key="gramItem.id">
          <td>{{ gramItem.fullNm }}</td>
          <td>
            ~
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'rareMost')" v-model="gramItem.rareMost">
          </td>
          <td>
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'fewLeast')" v-model="gramItem.fewLeast">
            ~
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'fewMost')" v-model="gramItem.fewMost">
          </td>
          <td>
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'moderateLeast')" v-model="gramItem.moderateLeast">
            ~
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'moderateMost')" v-model="gramItem.moderateMost">
          </td>
          <td>
            <input style="width: 32px;" type="text" @input="filterNumbersOnly($event, gramItem, 'manyLeast')" v-model="gramItem.manyLeast">
            ~
          </td>
          <td>({{ gramItem.unit }})</td>
        </tr>
      </tbody>
    </table>
    <button @click="saveGramRange" class="saveBtn" type="button">Save</button>
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
import { ref, onMounted, computed, watch } from 'vue';
import { createGramRangeApi, getGramRangeApi, updateGramRangeApi } from "@/common/api/service/setting/settingApi";
import { ApiResponse } from "@/common/api/httpClient";
import Alert from "@/components/commonUi/Alert.vue";
import { defaultGramRange, settingName } from "@/common/defines/constFile/settings";
import { messages } from '@/common/defines/constFile/constantMessageText';
import Confirm from "@/components/commonUi/Confirm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { gramRangeValidate } from "@/common/lib/utils/validate";

const store = useStore();
const router = useRouter();
const saveHttpType = ref('');
const gramItems = ref<any>([]);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const showConfirm = ref(false);
const confirmMessage = ref('');
const enteringRouterPath = computed(() => store.state.commonModule.enteringRouterPath);
const settingChangedChecker = computed(() => store.state.commonModule.settingChangedChecker);
const settingType = computed(() => store.state.commonModule.settingType);

onMounted(async () => {
  await getGramRange();
  await store.dispatch('commonModule/setCommonInfo', { settingType: settingName.gramRange });
});

watch(() => gramItems.value, async (gramItemsAfterSettingObj) => {
  await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(gramItemsAfterSettingObj) });
  if (settingType.value !== settingName.gramRange) {
    await store.dispatch('commonModule/setCommonInfo', { settingType: settingName.gramRange });
  }
}, { deep: true });

watch(() => settingChangedChecker.value, () => {
  checkIsMovingWhenSettingNotSaved();
})

const checkIsMovingWhenSettingNotSaved = () => {
  showConfirm.value = true;
  confirmMessage.value = `${settingType.value} ${messages.settingNotSaved}`;
}

const saveGramRange = async () => {
  const isValidate = gramRangeValidate(gramItems.value);
  if (!isValidate) {
    showErrorAlert('Gram range invalid number');
    return;
  }

  try {
    let result: ApiResponse<void>;
    if (saveHttpType.value === 'post') {
      result = await createGramRangeApi({gramRangeItems: gramItems.value});
    } else {
      const updateResult = await updateGramRangeApi({gramRangeItems: gramItems.value});

      if (updateResult.data) {
        showSuccessAlert(messages.UPDATE_SUCCESSFULLY);
        await getGramRange();
      } else {
        showErrorAlert('update failed');
      }
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
      return;
    }
    if (result) {
      showSuccessAlert(messages.settingSaveSuccess);
      saveHttpType.value = 'put';
      await getGramRange();
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
    }
  } catch (e) {
    console.log(e);
  }
};

const filterNumbersOnly = (event: Event, item: any, field: 'rareMost' | 'fewLeast' | 'fewMost' | 'moderateLeast' | 'moderateMost' | 'manyLeast') => {
  const input = event.target as HTMLInputElement;
  const filteredValue = input.value.replace(/[^0-9]/g, '');
  item[field] = filteredValue.trim();
};

const getGramRange = async () => {
  try {
    const result = await getGramRangeApi();
    if (result) {
      if (!result?.data || (result?.data instanceof Array && result?.data.length === 0)) {
        saveHttpType.value = 'post';
        gramItems.value = defaultGramRange;
      } else {
        saveHttpType.value = 'put';
        gramItems.value = result.data;
      }

      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: JSON.stringify(gramItems.value) });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: JSON.stringify(gramItems.value) });
    }
  } catch (e) {
    console.log(e);
  }
}

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'success';
  alertMessage.value = message;
};

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
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
  await saveGramRange();
  showConfirm.value = false;
}

</script>
