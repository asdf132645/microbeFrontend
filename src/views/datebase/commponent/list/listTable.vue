<template>
  <div class="loaderBackground" v-if="loadingDelay">
    <div class="loader"></div>
    <p class="loadingText">Loading...</p>
  </div>
  <table class='defaultTable dbDataTable' ref="scrollableDiv">
    <thead>
    <tr class="list-table-header">
      <th>NO</th>
      <th><input type="checkbox" v-model="selectAllCheckbox" @change="selectAllItems"/></th>
      <th>Type</th>
      <th>Cassette ID</th>
      <th>State</th>
      <th>Tray Slot</th>
      <th>Barcode NO</th>
      <th>Patient ID</th>
      <th>Patient Name</th>
      <th>Analyzed Date</th>
      <th>Tact Time(sec)</th>
      <th>Submit</th>
      <th>Submit Date</th>
      <th>Edit</th>
    </tr>
    </thead>

    <tbody v-if="dbData.length !== 0">
    <template v-for="(item, idx) in dbData"
              :key="item.id">
      <tr
          class="list-table-item"
          :class="{
            selectedTr: selectedItemId === item.id,
            submittedTr: item.submitState === 'Submit',
            lisTr: item.submitState === 'lisCbc',
            rock: item.lock_status && item.pcIp !== myIp,
            checkFirst: item.submitState === 'checkFirst',
          }"
          @click="selectItem(item)"
          @dblclick='rowDbClick(item)'
          ref="firstRow"
          style="height: 49px"
          v-bind:data-row-id="item.id"
          @contextmenu.prevent="rowRightClick(item, $event)"
          title="Double click the row"
      >
        <td class="relative">
          <font-awesome-icon class="red isNotNormalIcon" :icon="['fas', 'triangle-exclamation']" v-if="!item.isNormal" />
          {{ idx + 1 }}
        </td>
        <td @click="handleCheckboxChange(item)">
          <input type="checkbox" v-model="item.checked" :checked="item.checked"/>
        </td>
        <td> {{ getTestTypeText(item?.testType) }}</td>
        <td v-if="item?.cassetId">{{ item?.cassetId.split('_')[0] }}</td>
        <td v-else></td>
        <td>
          <font-awesome-icon
              :icon="['fas', `${item?.lock_status ? 'lock' : 'lock-open' }`]"
          />
        </td>
        <td> {{ item?.traySlot }}</td>
        <td> {{ item?.barcodeNo }}</td>
        <td> {{ item?.patientId }}</td>
        <td> {{ item?.patientNm }}</td>
        <td> {{ item?.analyzedDttm === '' ? '' : formatDateString(item?.analyzedDttm) }}</td>
        <td> {{ item?.tactTime }}</td>
        <td> {{ submitStateChangeText(item?.submitState, item?.submitUserId) }}</td>
        <td> {{ !item?.submitOfDate ? '' : formatDateString(item?.submitOfDate) }}</td>
        <td>
          <font-awesome-icon v-if="(item?.submitState === 'checkFirst' || item?.submitState === '' || !item?.submitState) && !item.lock_status"
                             :icon="['fas', 'pen-to-square']"
                             @click="editData(item)"/>
        </td>
      </tr>
    </template>
    <tr>
      <div ref="loadMoreRef" style="height: 30px;"></div>
    </tr>
    </tbody>
    <tbody v-else>
    <tr class="text-center">
      <td colspan="13"> NO Data</td>
    </tr>
    </tbody>
  </table>
  <div v-if="contextMenu.visible" :style="{ top: (contextMenu.y - 100) + 'px', left: contextMenu.x + 'px' }"
       class="context-menu">
    <ul>
      <li @click="printStart">Print</li>
      <li @click="classificationRowDbClick">Classification</li>
      <li @click="editOrderData">Edit order data</li>
      <li @click="showDeleteConfirm">Delete</li>
    </ul>
  </div>

  <Modal v-if="visible" @update:closeLayer="closeLayer" @afterOpen="onModalOpen">
    <!-- 헤더 슬롯에 들어갈 내용 -->
    <template #header>
      <h2>Edit order data</h2>
    </template>

    <!-- 컨텐츠 슬롯에 들어갈 내용 -->
    <template #content>
<!--      <div>-->
        <ul class="editOrder">
          <li class="flex-column-justify-center">
            <label for="testType">PB/BF</label>
            <input id="testType" class="inputDisabled" type="text" v-model="itemObj.testType" readonly disabled/>
          </li>
          <li class="flex-column-justify-center">
            <label for="traySlot">Tray Slot</label>
            <input id="traySlot" class="inputDisabled" type="text" v-model="itemObj.traySlot" readonly disabled/>
          </li>
          <li class="flex-column-justify-center">
            <label for="barcode">BARCODE ID</label>
            <input id="barcode" type="text" v-model="itemObj.barcodeNo" placeholder="BARCODE ID"/>
          </li>
          <li class="flex-column-justify-center">
            <label for="patientId">PATIENT ID</label>
            <input id="patientId" type="text" v-model="itemObj.patientId" placeholder="PATIENT ID"/>
          </li>
          <li class="flex-column-justify-center">
            <label for="patientName">PATIENT NAME</label>
            <input id="patientName" type="text" v-model="itemObj.patientNm" placeholder="PATIENT NAME"/>
          </li>
          <li class="flex-column-justify-center">
            <label for="analyzedDate">Analyzed date</label>
            <input id="analyzedDate" class="inputDisabled" type="text" v-model="itemObj.analyzedDttm" readonly
                   disabled/>
          </li>
          <li class="flex-column-justify-center">
            <label for="signedState">Signed state</label>
            <input id="signedState" class="inputDisabled" type="text" v-model="itemObj.submitState" readonly disabled/>
          </li>
          <li v-if="!barCodeImageShowError">
            <p>Barcode Image</p>
            <img class="mt10" width="376" :src="barcodeImg" @error="onImageError"/>
          </li>
        </ul>
<!--      </div>-->
      <div class="modalBottom">
        <button class="alertButton" @click="dbDataEditSet">Save</button>
      </div>
    </template>
  </Modal>
  <Print v-if="printOnOff" :selectItems="rightClickItem" ref="printContent" :printOnOff="printOnOff" @printClose="printClose"/>
  <Alert
      v-if="showAlert"
      :is-visible="showAlert"
      :type="alertType"
      :message="alertMessage"
      @hide="hideAlert"
      @update:hideAlert="hideAlert"
  />

  <Confirm
      v-if="showConfirm"
      :is-visible="showConfirm"
      type="delete"
      :message="confirmMessage"
      @hide="hideConfirm"
      @okConfirm="handleOkConfirm"
  />
</template>

<script setup lang="ts">
import { getImageUrl, getTestTypeText } from "@/common/lib/utils/conversionDataUtils";
import {
  ref,
  onMounted,
  watchEffect,
  defineProps,
  defineEmits,
  computed,
  nextTick,
  onUnmounted,
  getCurrentInstance, watch
} from 'vue';
import router from "@/router";
import Modal from "@/components/commonUi/modal.vue";
import {
  deleteRunningApi,
  detailRunningApi,
  updatePcIpStateApi,
  updateRunningApi
} from "@/common/api/service/runningInfo/runningInfoApi";
import {useStore} from "vuex";
import {MESSAGES} from "@/common/defines/constFile/constantMessageText";
import Print from "@/views/datebase/commponent/detail/report/print.vue";
import Alert from "@/components/commonUi/Alert.vue";
import moment from "moment";
import {getDeviceIpApi} from "@/common/api/service/device/deviceApi";
import {barcodeImgDir} from "@/common/defines/constFile/settings/settings";
import {isObjectEmpty} from "@/common/lib/utils/checkUtils";
import Confirm from "@/components/commonUi/Confirm.vue";
import {RunningInfoResponse} from "@/common/api/service/runningInfo/runningInfo.dto";

interface RunningInfoWithChecked extends RunningInfoResponse {
  checked: boolean;
}

interface PropsType {
  dbData: RunningInfoWithChecked[],
  notStartLoading: boolean;
  loadingDelayParents: boolean;
}

const props = defineProps<PropsType>();
const loadMoreRef = ref(null);
const emits = defineEmits();
const selectedItemId = ref<number | string>('');
const visible = ref(false);
const itemObj = ref<RunningInfoResponse>({});
const store = useStore();
const userModuleDataGet = computed(() => store.state.userModule);
const cellImageAnalyzedSetting = computed(() => store.state.commonModule.cellImageAnalyzedSetting);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const myIp = ref('');
const loadingDelay = ref(false);
const formatDateString = (dateString: Date | string) => {
  const momentObj = moment(dateString, 'YYYYMMDDHHmmssSSSSS');
  return momentObj.format('YYYY-MM-DD HH:mm:ss');
}


const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0
});
const storedUser = sessionStorage.getItem('user');
const getStoredUser = JSON.parse(storedUser || '{}');
const userId = ref('');
const rightClickItem = ref({});
const printOnOff = ref(false);
const printContent = ref(null);
const selectAllCheckbox = ref(false);
const instance = getCurrentInstance();
const barcodeImg = ref('');
const pbiaRootDir = computed(() => store.state.commonModule.iaRootPath);
const selectedSampleId = computed(() => store.state.commonModule.selectedSampleId);
const dataBasePageReset = computed(() => store.state.commonModule);
const isCtrlKeyPressed = ref(false);
const isShiftKeyPressed = ref(false);
const firstShiftKeyStr = ref('');
const lastShiftKeyStr = ref('');
let socketTimeoutId: any = undefined; // 타이머 ID 저장
const scrollableDiv = ref(null);
const barCodeImageShowError = ref(false);
const showConfirm = ref(false);
const confirmMessage = ref('');
const selectedItemsUsedInDelete = ref([]);
const dbDataFindByIdUsedInDelete = ref([]);


onMounted(async () => {
  myIp.value = JSON.parse(sessionStorage.getItem('pcIp') ?? '');
  try {

    userId.value = getStoredUser.id;
  } catch (e) {
    console.error(e);
  }
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
})

async function handleKeyDown(event: KeyboardEvent) {
  // 컨트롤 키가 눌렸는지 확인
  if (event.ctrlKey) {
    isCtrlKeyPressed.value = true;
  }
  // 쉬프트 키가 눌렸는지 확인
  if (event.shiftKey) {
    isShiftKeyPressed.value = true;
  }
}


function handleKeyUp(event: KeyboardEvent) {
  // Ctrl 키가 떼어졌는지 확인
  if (!event.ctrlKey) {
    isCtrlKeyPressed.value = false;
  }
  // 쉬프트 키가 눌렸는지 확인
  if (!event.shiftKey) {
    isShiftKeyPressed.value = false;
  }
}


onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

watch(() => props.loadingDelayParents, (newVal) => {
      loadingDelay.value = newVal ? true : false;
    }, {deep: true});

watchEffect(async () => {
  if (props.dbData.length > 0) {
    await nextTick();
    const filteredItems = props.dbData.filter(item => item.id === Number(selectedSampleId.value || 0));

    // 첫 번째 행을 클릭
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
    if (loadMoreRef.value) {
      observer.observe(loadMoreRef.value);
    }

    if (selectedItemId.value === '0' || !selectedItemId.value) {
      loadingDelay.value = false;
    }

    if (dataBasePageReset.value.dataBasePageReset === true && filteredItems.length !== 0) {
      await selectItem(filteredItems[0]);
      await store.dispatch('commonModule/setCommonInfo', {dataBasePageReset: false});
      await removeCheckBox();
      return;
    }

  }
});


const printClose = () => {
  printOnOff.value = false;
}

const printStart = () => {
  printOnOff.value = true;
  resetContextMenu();
}
const editOrderData = () => {
  editData(rightClickItem.value);
  resetContextMenu();
};

const classificationRowDbClick = () => {
  rowDbClick(rightClickItem.value);
  resetContextMenu();
}
const selectAllItems = () => {
  props.dbData.forEach(item => {
    item.checked = selectAllCheckbox.value;
  });
  emits('checkListItem', props.dbData.filter(dbDataItem => dbDataItem.checked));
};

const removeCheckBox = () => {
  props.dbData.forEach(item => {
    item.checked = false;
  });
  emits('checkListItem', props.dbData.filter(dbDataItem => dbDataItem.checked));
};


const resetContextMenu = () => {
  contextMenu.value.x = 0;
  contextMenu.value.y = 0;
  contextMenu.value.visible = false;
}

const handleOutsideClick = (event: MouseEvent) => {
  const contextMenuElement = document.querySelector('.context-menu');
  if (contextMenuElement && !contextMenuElement.contains(event.target as Node)) {
    resetContextMenu();
  }
};


const rowRightClick = async (item: RunningInfoResponse, event: MouseEvent) => {
  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: item.id});
  rightClickItem.value = item;
  if (event) {
    contextMenu.value.x = event.clientX;
    contextMenu.value.y = event.clientY;
    contextMenu.value.visible = true;
  }
};

const handleShiftSelection = () => {
  const startId = Math.min(Number(firstShiftKeyStr.value), Number(lastShiftKeyStr.value));
  const endId = Math.max(Number(firstShiftKeyStr.value), Number(lastShiftKeyStr.value));

  const items = props.dbData;

  items.forEach((item) => {
    const itemId = Number(item.id);
    if (itemId >= startId && itemId <= endId) {
      item.checked = !item.checked;
    }
  });

  emits('checkListItem', props.dbData.filter(dbDataItem => dbDataItem.checked));
};

const handleCheckboxChange = (item: RunningInfoWithChecked) => {
  if (isObjectEmpty(item)) return;
  item.checked = !item.checked;
  emits('checkListItem', props.dbData.filter(dbDataItem => dbDataItem.checked));
};


const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio !== 1) {
      emits('loadMoreData');
    }
  });
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
}

const hideAlert = () => {
  showAlert.value = false;
};


const selectItem = async (item) => {
  if (isShiftKeyPressed.value) {
    if (firstShiftKeyStr.value) {
      lastShiftKeyStr.value = item.id;
      handleShiftSelection();
    }
  } else {
    lastShiftKeyStr.value = '';
  }
  if (isCtrlKeyPressed.value) {
    handleCheckboxChange(item);
  }
  // 부모로 전달
  if (!item) return;

  firstShiftKeyStr.value = item.id;
  emits('selectItem', item);
  selectedItemId.value = item.id;
  await store.dispatch('commonModule/setCommonInfo', {selectedSampleId: String(item.id)});
};

const getIpAddress = async (item) => {
  try {
    const result = await getDeviceIpApi();
    const ipAddress = result.data;
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const req = `oldPcIp=${ipAddress}&newEntityId=${item.id}&newPcIp=${ipAddress}&dayQuery=${dayQuery}`

    await updatePcIpStateApi(req).then(response => {
      delayedEmit('SEND_DATA', 'refreshDb', 300);
    }).catch(error => {
      console.error(error)
    });
  } catch (e) {
    console.error(e)
  }
}

const delayedEmit = (type, payload, delay) => {
  if (socketTimeoutId !== undefined) {
    clearTimeout(socketTimeoutId); // 이전 타이머 클리어
  }

  socketTimeoutId = window.setTimeout(() => {
    instance?.appContext.config.globalProperties.$socket.emit('state', {
      type: 'SEND_DATA',
      payload: 'refreshDb'
    });
  }, delay);
};
const rowDbClick = async (item: any) => {
  if (item.lock_status && item?.pcIp !== myIp.value) return;

  await store.dispatch('commonModule/setCommonInfo', { selectedSampleId: item.id });
  await store.dispatch('commonModule/setCommonInfo', { currentSelectItems: item });
  await store.dispatch('commonModule/setCommonInfo', { currentPowerType: 'LP' });
  await getIpAddress(item);
  await router.push({
    name: 'databaseDetail',
    params: { id: item.id },
    query: { pageType: 'LP' }
  });
}

const closeLayer = (val: boolean) => {
  visible.value = val;
};

const onModalOpen = () => {
  //
};

const dbDataEditSet = async () => {
  try {
    const updatedRuningInfo = {
      id: itemObj.value.id,
      barcodeNo: itemObj.value.barcodeNo,
      patientId: itemObj.value.patientId,
      patientNm: itemObj.value.patientNm,
    };

    const localDbData = [...props.dbData];

    const indexToUpdate = localDbData.findIndex(item => item.id === itemObj.value.id);

    if (indexToUpdate !== -1) {
      localDbData[indexToUpdate] = {...localDbData[indexToUpdate], ...updatedRuningInfo};
    }

    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const { startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [localDbData[indexToUpdate]],
      dayQuery: dayQuery,
    })
    if (response) {
      showSuccessAlert(MESSAGES.SUCCESS_ALERT);
      emits('initData');
      closeLayer();
    } else {
      console.error('백엔드가 디비에 저장 실패함');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


const editData = async (item: any) => {
  openLayer();
  itemObj.value = JSON.parse(JSON.stringify(item));
  itemObj.value.submitState = ['', 'Ready', 'checkFirst'].includes(itemObj.value.submitState) ? '' : itemObj.value.submitState;
  itemObj.value.testType = getTestTypeText(item?.testType);
  const path = item?.img_drive_root_path !== '' && item?.img_drive_root_path ? item?.img_drive_root_path : pbiaRootDir.value;
  barcodeImg.value = getImageUrl('barcode_image.jpg', path, item.slotId, barcodeImgDir.barcodeDirName);

}

const openLayer = () => {
  visible.value = true;
};

const deleteRow = async (selectedItems: any, dbDataFindById: any) => {
  if (isObjectEmpty(selectedItems)) selectedItems = [rightClickItem.value];
  try {
    if (isObjectEmpty(selectedItems) && selectedItemId.value === '') {
      showErrorAlert(MESSAGES.IDS_ERROR_SELECT_A_TARGET_ITEM);
      return;
    } else if (isObjectEmpty(selectedItems) && selectedItemId.value !== '') {
      selectedItems = dbDataFindById;
      if (selectedItems.lock_status) {
        showErrorAlert(MESSAGES.lockRow);
        return;
      }
      const idsToDelete = selectedItems
      const path = selectedItems?.img_drive_root_path !== '' && selectedItems?.img_drive_root_path ? selectedItems?.img_drive_root_path : sessionStorage.getItem('iaRootPath');
      const rootArr = `${path}/${selectedItems.slotId}`;
      const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
      const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
      const dayQuery = startDate + endDate + page + searchText + testType;
      const req = {
        ids: [idsToDelete.id],
        img_drive_root_path: [rootArr],
        dayQuery: dayQuery,
      }

      loadingDelay.value = true;
      const response = await deleteRunningApi(req);

      if (response.success) {
        showSuccessAlert('Items deleted successfully');
        emits('refresh'); // 데이터 다시 불러오기

      } else {
        console.error('Failed to delete items');
      }

      loadingDelay.value = false;
    } else {
      const idsToDelete = selectedItems.map(item => item.id);
      const idsToDeleteLock = selectedItems.map(item => item.lock_status);
      if (idsToDeleteLock.includes(true)) {
        showErrorAlert(MESSAGES.lockRow);
        return
      }
      const path = selectedItems?.img_drive_root_path !== '' && selectedItems?.img_drive_root_path ? selectedItems?.img_drive_root_path : sessionStorage.getItem('iaRootPath');
      const rootArr = selectedItems.map(item => `${path}/${item.slotId}`);
      const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
      const { startDate, endDate, page, searchText, testType } = JSON.parse(day);
      const dayQuery = startDate + endDate + page + searchText + testType;
      const req = {
        ids: idsToDelete,
        img_drive_root_path: rootArr,
        dayQuery: dayQuery,
      }

      loadingDelay.value = true;
      const response = await deleteRunningApi(req);

      if (response.success) {
        showSuccessAlert('Items deleted successfully');
        emits('refresh'); // 데이터 다시 불러오기
      } else {
        console.error('Failed to delete items');
      }

      loadingDelay.value = false;
    }


  } catch (error) {
    console.error('Error:', error);
  }

  loadingDelay.value = false;
}

const submitStateChangeText = (text, submitUserId) => {
  switch (text) {
    case 'Ready':
      return 'Ready';
    case 'Submit':
      return `Submit (${submitUserId})`;
    default:
      return 'Ready';
  }
}

const onImageError = () => {
  barCodeImageShowError.value = true;
}

const hideConfirm = () => {
  showConfirm.value = false;
}

const handleOkConfirm = async () => {
  showConfirm.value = false;
  await deleteRow(selectedItemsUsedInDelete.value, dbDataFindByIdUsedInDelete.value);
}

const showDeleteConfirm = () => {
  showConfirm.value = true;
  confirmMessage.value = 'Would you want delete?';
  selectedItemsUsedInDelete.value = props.dbData.filter(item => item.checked);
  dbDataFindByIdUsedInDelete.value = props.dbData.find(item => item.id === selectedItemId.value);
  resetContextMenu();
  emits('disableSelectItem');
}

</script>

