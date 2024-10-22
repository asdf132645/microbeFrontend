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
        <tr v-for="(gramItem, index) in gramItems" :key="gramItem.classId">
          <td>{{ gramItem.fullNm }}</td>
          <td>
            ~
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.rareBoundary"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'rareBoundary', 'upper')"
            >
          </td>
          <td>
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.rareBoundary + 1"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'rareBoundary', 'lower')"
            >
            ~
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.fewBoundary"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'fewBoundary', 'upper')"
            >
          </td>
          <td>
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.fewBoundary + 1"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'fewBoundary', 'lower')"
            >
            ~
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.moderateBoundary"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'moderateBoundary', 'upper')"
            >
          </td>
          <td>
            <input
                style="width: 32px;"
                type="text"
                :value="gramItem.moderateBoundary + 1"
                @keydown="allowOnlyNumbers"
                @input="updateBoundaryDebounced($event, index, 'moderateBoundary', 'lower')"
            >
            ~
          </td>
          <td>({{ getUnit(gramItem.fullNm) }})</td>
        </tr>
      </tbody>
    </table>
    <button @click="saveGramRange" class="saveBtn" type="button">Save</button>
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
import { ref, onMounted, computed, watch } from 'vue';
import { debounce } from "lodash";
import { createGramRangeApi, getGramRangeApi, updateGramRangeApi } from "@/common/api/service/setting/settingApi";
import { ApiResponse } from "@/common/api/httpClient";
import Alert from "@/components/commonUi/Alert.vue";
import {DEFAULT_GRAM_RANGE, GRAM_RANGE_UNIT, settingName} from "@/common/defines/constFile/settings/settings";
import { MESSAGES } from '@/common/defines/constFile/constantMessageText';
import Confirm from "@/components/commonUi/Confirm.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { gramRangeValidate } from "@/common/lib/utils/validate";
import { MO_CATEGORY } from "@/common/defines/constFile/dataBase";
import {GramRangeItems} from "@/common/api/service/setting/dto/gramRangeDto";


const store = useStore();
const router = useRouter();
const saveHttpType = ref('');
const gramItems = ref<GramRangeItems[]>(DEFAULT_GRAM_RANGE);
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
  confirmMessage.value = `${settingType.value} ${MESSAGES.SETTING_NOT_SAVED}`;
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
        showSuccessAlert(MESSAGES.UPDATE_SUCCESSFULLY);
        await getGramRange();
      } else {
        showErrorAlert('Update failed');
      }
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
      return;
    }
    if (result) {
      showSuccessAlert(MESSAGES.SETTING_SAVE_SUCCESS);
      saveHttpType.value = 'put';
      await getGramRange();
      await store.dispatch('commonModule/setCommonInfo', { beforeSettingFormattedString: null });
      await store.dispatch('commonModule/setCommonInfo', { afterSettingFormattedString: null });
    }
  } catch (e) {
    console.log(e);
  }
};

const boundaries = ['rareBoundary', 'fewBoundary', 'moderateBoundary'] as const;

const allowOnlyNumbers = (event: KeyboardEvent) => {
  const key = event.key;

  // 숫자, 백스페이스, Delete, 화살표 키를 허용
  if (!/^\d$/.test(key) && key !== 'Backspace' && key !== 'Delete' &&
      key !== 'ArrowLeft' && key !== 'ArrowRight') {
    event.preventDefault();
  }
};

const updateBoundary = (
    event: Event,
    index: number,
    boundary: typeof boundaries[number],
    position: 'upper' | 'lower'
) => {
  const inputValue = +(event.target as HTMLInputElement).value;
  if (isNaN(inputValue) || inputValue < 0) return;

  const updatedGramItem = { ...gramItems.value[index] };

  if (position === 'upper') {
    updatedGramItem[boundary] = inputValue;

    const nextBoundary = getNextBoundary(boundary);
    if (nextBoundary && updatedGramItem[nextBoundary] <= inputValue) {
      // 인접한 상위 값이 현재 값보다 작거나 같으면, 인접한 값을 업데이트된 값 + 1로 설정
      updatedGramItem[nextBoundary] = inputValue;
    }
  } else {
    updatedGramItem[boundary] = inputValue;

    const prevBoundary = getPreviousBoundary(boundary, position);
    if (prevBoundary && updatedGramItem[prevBoundary] >= inputValue) {
      // 인접한 하위 값이 현재 값보다 크거나 같으면, 인접한 값을 업데이트된 값 - 1로 설정
      updatedGramItem[prevBoundary] = inputValue - 1;
    }
  }

  // 업데이트된 아이템 적용
  gramItems.value[index] = updatedGramItem;
};


const updateBoundaryDebounced = debounce(updateBoundary, 300);

const getPreviousBoundary = (boundary: typeof boundaries[number], position: 'lower' | 'upper') => {
  if (position === 'lower') return boundaries[boundaries.indexOf(boundary)];
  return boundaries[boundaries.indexOf(boundary) - 1];

}
const getNextBoundary = (boundary: typeof boundaries[number]) => boundaries[boundaries.indexOf(boundary) + 1];


const getGramRange = async () => {
  try {
    const result = await getGramRangeApi();
    if (result) {
      if (!result?.data || (result?.data instanceof Array && result?.data.length === 0)) {
        saveHttpType.value = 'post';
        gramItems.value = DEFAULT_GRAM_RANGE;
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

const getUnit = (classNm: string) => {
  if (classNm === MO_CATEGORY.GRAM) return GRAM_RANGE_UNIT.HPF;
  return GRAM_RANGE_UNIT.LPF;
}

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
  await saveGramRange();
  showConfirm.value = false;
}

</script>
