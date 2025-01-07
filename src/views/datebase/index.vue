<template>
  <div class="main-container">
    <h3 class="titleH3">
      Classification List
      <button @click="classListToggleEvent" class="classificationListBtn">
        <font-awesome-icon :icon="['fas', 'list-check']"/>
      </button>
    </h3>
    <div class="listBoxTable container-shadow">
      <div class="filterListDiv">
        <div>
          <select v-model="searchType" class="searchSelect">
            <option value="barcodeNo">Barcode No</option>
            <option value="patientId">Patient ID</option>
            <option value="patientNm">Patient Name</option>
          </select>
          <div class="relative">
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
            <input type="text" v-model='searchText' placeholder="Search" class="searchInputBox" @keydown.enter="handleEnter" ref="barcodeInput" @input="handleInput"/>
          </div>
          <div class="settingDatePickers">
            <Datepicker v-model="startDate"></Datepicker>
            <Datepicker v-model="endDate"></Datepicker>
          </div>
          <button class="searchClass" @click="setDateToday">Today</button>
          <button class="searchClass" @click="dateRefresh">Refresh</button>
          <button type="button" class="searchClass" @click="search">Search</button>
        </div>


        <!-- Classification List Modal -->
        <div class="filterDivBox" v-if="classListToggle">
          <div class="lastTestType">
            <span>Test Type</span>
            <div>
              <label>
                <input type="checkbox" value="99" @change="changeTestType('99')" :checked="testType === '99'"/>
                <span>ALL</span>
              </label>
              <label>
                <input type="checkbox" value="00" @change="changeTestType('00')" :checked="testType === MO_TEST_TYPE_CODE.URINE"/>
                <span>Urine</span>
              </label>
              <label>
                <input type="checkbox" value="01" @change="changeTestType('01')" :checked="testType === MO_TEST_TYPE_CODE.SPUTUM"/>
                <span>Sputum</span>
              </label>
              <label>
                <input type="checkbox" value="02" @change="changeTestType('02')" :checked="testType === MO_TEST_TYPE_CODE.BLOOD"/>
                <span>Blood</span>
              </label>
            </div>
          </div>
        </div>


      </div>
      <keep-alive>
        <ListTable
            :loadingDelayParents="loadingDelayParents"
            :dbData="dbGetData"
            @loadMoreData="loadMoreData"
            @loadPrevData="loadPrevData"
            @initData="initDbData"
            @selectItem="selectItem"
            @refresh="refresh"
            @checkListItem="checkListItem"
            @disableSelectItem="disableSelectItem"
            :notStartLoading='notStartLoading'
        />
      </keep-alive>
    </div>
    <div class='listBox container-shadow'>
      <ListInfo :dbData="dbGetData" :selectedItem="selectedItem"/>
      <ListMoImg :dbData="dbGetData" :selectedItem="selectedItem"/>
    </div>
  </div>
  <Alert
      v-if="showAlert"
      :is-visible="showAlert"
      :message="alertMessage"
      @hide="hideAlert"
      @update:hideAlert="hideAlert"
  />
</template>

<script setup lang="ts">

import ListTable from "@/views/datebase/commponent/list/listTable.vue";
import ListInfo from "@/views/datebase/commponent/list/listInfo.vue";
import ListMoImg from "@/views/datebase/commponent/list/ListMoImg.vue";
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from "vue";
import { getRunningApi, removePageAllDataApi} from "@/common/api/service/runningInfo/runningInfoApi";
import moment from "moment/moment";
import Datepicker from "vue3-datepicker";
import {formatDate} from "@/common/lib/utils/dateUtils";
import Alert from "@/components/commonUi/Alert.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {isObjectEmpty} from "@/common/lib/utils/checkUtils";
import {MO_TEST_TYPE_CODE} from "@/common/defines/constFile/dataBase";
import {ClassInfoType, RunningInfoResponse} from "@/common/api/service/runningInfo/runningInfo.dto";


const store = useStore();
const dbGetData = ref<RunningInfoResponse[]>([]);
const showAlert = ref(false);
const alertMessage = ref('');

const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 29);

const startDate = ref(thirtyDaysAgo);
const endDate = ref(new Date());
const searchText = ref('');
const searchType = ref('barcodeNo');
const page = ref(1);
const prevPage = ref(1);
const selectedItem = ref<any>({});
const titleItem = ref<any>([]);
const titleItemArr = ref([]);
const testType = ref('');
const wbcCountOrder = ref('');
const classListToggle = ref(false);
const instance = getCurrentInstance();
const prevDataPage = ref('');
const reqDataPrev = ref('');
const checkedSelectedItems = ref<any>([]);
const iaRootPath = ref<any>(store.state.commonModule.iaRootPath);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const eventTriggered = ref(false);
const loadingDelayParents = ref(false);
const notStartLoading = ref(false);
const barcodeInput = ref<HTMLInputElement | null>(null);

const inputTimeout = ref<any>(null);
const bufferDelay = 100; // 입력 완료 감지 지연 시간 (ms)
const inputBuffer = ref('');
const router = useRouter();

async function handleStateVal(data: any) {
  eventTriggered.value = true;
  notStartLoading.value = false;
  await removePageAllDataApi();
  await initDbData();
}

onMounted(async () => {
  if (!eventTriggered.value) {
    await initDbData();
  }

  document.addEventListener('click', closeClassListBox);
  if (barcodeInput.value) {
    barcodeInput.value.focus();
  }

  notStartLoading.value = true;
  instance?.appContext.config.globalProperties.$socket.on('stateVal', handleStateVal);
  document.addEventListener('keydown', handleGlobalKeydown);

});

const previousValue = ref('');
let lastInputTime = Date.now();
const isBarcodeScannerInput = { value: false };

const setDateToday = () => {
  startDate.value = new Date();
  endDate.value = new Date();
  search();
}

// 이벤트 핸들러 함수
const handleInput = (event: any) => {
  if (!event.data) {
    return;
  }

  // 현재 입력 시간
  const currentTime = Date.now();

  // 현재 입력과 마지막 입력 사이의 시간 차이 계산
  const timeDiff = currentTime - lastInputTime;

  // 바코드 리더기에서 입력된 것인지 확인 (시간 차이가 50ms 이하이면 바코드 리더기에서 입력된 것으로 간주)
  if (timeDiff < 50) {
    isBarcodeScannerInput.value = true;
  } else {
    isBarcodeScannerInput.value = false;
  }

  // 마지막 입력 시간을 현재 시간으로 업데이트
  lastInputTime = currentTime;

  // 바코드 리더기 입력이 아니면 이벤트 종료
  if (!isBarcodeScannerInput.value) {
    return;
  }

  // 입력 버퍼에 추가된 문자
  inputBuffer.value += event.data;

  // 이전 타이머가 설정되어 있으면 클리어
  if (inputTimeout.value) {
    clearTimeout(inputTimeout.value);
  }

  // 새로운 타이머 설정
  inputTimeout.value = setTimeout(() => {
    // 입력 완료로 간주
    const trimmedValue = inputBuffer.value.trim();

    // 입력된 값과 이전 값이 다를 때만 업데이트
    if (trimmedValue !== previousValue.value) {
      searchText.value = trimmedValue;
      previousValue.value = trimmedValue;
    }

    // 버퍼 초기화
    inputBuffer.value = '';
    search();
  }, bufferDelay);
};

const handleGlobalKeydown = (event) => {
  if (router.currentRoute.value.path === '/dataBase') {
    if (event.key === 'Enter' || event.key === 'Tab') {
      setTimeout(() => {
        if (barcodeInput.value) {
          barcodeInput.value.focus();
          searchText.value = searchText.value.trim();
          const trimmedValue = searchText.value.trim();
          if (trimmedValue !== previousValue.value) {
            // 입력된 값과 이전 값이 다를 때만 업데이트
            previousValue.value = trimmedValue;
          }
        }
      }, 10); // 아주 짧은 지연을 주어 바코드 리더기가 입력을 시작할 수 있도록 함

    }
  }
};


const handleEnter = () => {
  if (barcodeInput.value) {
    search();
  }
};

onBeforeUnmount(() => {
  // instance?.appContext.config.globalProperties.$socket.off('stateVal', handleStateVal);
  document.removeEventListener('click', closeClassListBox);
});

const closeClassListBox = (event: MouseEvent) => {
  const selectBox = document.querySelector('.filterDivBox');
  const selectButton = document.querySelector('.classificationListBtn');
  if (selectButton && selectButton.contains(event.target as Node)) return;
  if (selectBox && !selectBox.contains(event.target as Node)) {
    classListToggle.value = false; // 셀렉트 박스 닫기
  }
};

const classListToggleEvent = () => {
  classListToggle.value = !classListToggle.value;
}
const changeTestType = (value: any) => {
  testType.value = testType.value === value ? '' : value;
}

const updateFilter = () => {
  const selectedItems = titleItem.value?.filter((item: any) => item.checked).map((item: any) => item.classId);
  titleItemArr.value = selectedItems;
}

const initDbData = async () => {
  // titleItem.value = [];
  // 이전 조회 결과 및 검색 조건 불러오기
  loadingDelayParents.value = true;
  // const lastQuery = loadLastQuery();
  const lastSearchParams = loadLastSearchParams();
  // 이전 검색 조건 적용

  if (!isObjectEmpty(lastSearchParams)) {
    searchType.value = lastSearchParams.searchType || 'barcodeNo';
    searchText.value = lastSearchParams.searchText || '';
    startDate.value = new Date(lastSearchParams.startDate) || new Date();
    endDate.value = new Date(lastSearchParams.endDate) || new Date();
    page.value = lastSearchParams.page || 1;
    await getDbData('search');
  } else {
    await getDbData('mounted', 1);
  }
}

const selectItem = (item: any) => {
  selectedItem.value = item;
};

const saveLastSearchParams = () => {
  const lastSearchParams = {
    page: page.value,
    prevPage: prevPage.value,
    searchType: searchType.value,
    searchText: searchText.value,
    startDate: formatDate(startDate.value),
    endDate: formatDate(endDate.value),
    testType: testType.value,
  };
  sessionStorage.setItem('lastSearchParams', JSON.stringify(lastSearchParams));
  localStorage.setItem('lastSearchParams', JSON.stringify(lastSearchParams));
};

const loadLastSearchParams = () => {
  const storedSearchParams = sessionStorage.getItem('lastSearchParams');
  return storedSearchParams ? JSON.parse(storedSearchParams) : {};
};

const getDbData = async (type: string, pageNum?: number) => {

  if (type === 'search') {
    checkedSelectedItems.value = [];
    notStartLoading.value = true;
    page.value = 1;
  } else {
    notStartLoading.value = false;
  }
  let pageChange = 0;
  if (type === 'loadMoreData') {
    pageChange = page.value;
  } else if (type === 'loadPrevData') {
    pageChange = prevPage.value;
  } else {
    pageChange = page.value;
  }
  const requestData: any = {
    page: type !== 'mounted' ? pageChange : Number(pageNum),
    pageSize: 20,
    startDay: searchText.value === '' ? formatDate(startDate.value) : '',
    endDay: searchText.value === '' ? formatDate(endDate.value) : '',
    barcodeNo: searchType.value === 'barcodeNo' ? searchText.value : undefined,
    patientId: searchType.value === 'patientId' ? searchText.value : undefined,
    patientNm: searchType.value === 'patientNm' ? searchText.value : undefined,
  };
  if (prevDataPage.value === '') {
    prevDataPage.value = requestData.page;
  }
  if (titleItemArr.value.length !== 0) {
    requestData.title = titleItemArr.value;
  }

  if (testType.value !== '99' && testType.value !== '') {
    requestData.testType = testType.value;
  }

  if (wbcCountOrder.value !== '' && wbcCountOrder.value !== 'all') {
    requestData.wbcCountOrder = wbcCountOrder.value;
  }

  try {
    const result = await getRunningApi(requestData);
    saveLastSearchParams();
    if (page.value === 1 && result.data.data.length === 0) {
      loadingDelayParents.value = false;
      dbGetData.value = []
      return;
    }
    if (result && result.data) {
      prevDataPage.value = requestData.page;
      reqDataPrev.value = requestData;
      const newData = result.data.data;
      if (newData.length === 0) {
        if (page.value === 1) {
          page.value = 1;
        } else {
          page.value -= 1;
        }
        if (newData.length === 0 && String(result.data?.page) === '1') {
          dbGetData.value = newData;
        }
      } else {

        if (type === 'search') {
          dbGetData.value = newData;
        } else {
          newData.forEach((item: any) => {
            const index = dbGetData.value.findIndex(data => data.id === item.id);
            if (index !== -1) {
              dbGetData.value[index] = item;
            } else {
              dbGetData.value.push(item);
            }
          });
        }

        // if (titleItem.value.length === 0) {
        //   const wbcInfoItems = dbGetData.value[0]?.wbcInfo?.wbcInfo[0];
        //   titleItem.value = wbcInfoItems.map((item: WbcInfo) => {
        //     if (titleItemArr.value.includes(item.title)) {
        //       return {...item, checked: true };
        //     }
        //     return { ...item, checked: false };
        //   });
        // }

        if (titleItem.value.length === 0) {
          const moInfoItems = dbGetData.value[0]?.classInfo;
          titleItem.value = moInfoItems.map((item: ClassInfoType) => {
            if (titleItemArr.value.includes(item.classId)) return {...item, checked: true };
            return { ...item, checked: false };
          });
        }

        if (wbcCountOrder.value === '' || wbcCountOrder.value === 'all') {
          dbGetData.value = dbGetData.value.sort((a, b) => {
            const dateA = moment(a.analyzedDttm, 'YYYYMMDDHHmmssSSS');
            const dateB = moment(b.analyzedDttm, 'YYYYMMDDHHmmssSSS');

            // Moment.js의 diff 메서드를 사용하여 날짜 차이 계산
            return dateB.diff(dateA);
          });
        }
        // 마지막 조회 결과 저장
        if (dbGetData.value.length !== 0) {
        //
        } else {
          page.value -= 1;
        }

      }
    }
    if (dbGetData.value.length > 0) {
      const {path} = router.currentRoute.value;

      if(path === '/dataBase'){
        await store.dispatch('commonModule/setCommonInfo', {dbListDataFirstNum: Number(dbGetData.value[0].id)})
        await store.dispatch('commonModule/setCommonInfo', {dbListDataLastNum: Number(dbGetData.value[dbGetData.value.length - 1].id)})
      }
    }


  } catch (e) {
    console.error(e);
  }
};

const search = () => {
  dbGetData.value = [];
  sessionStorage.removeItem('lastSearchParams');
  const diffInMs = endDate.value.getTime() - startDate.value.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  if (diffInDays > 31) {
    showSuccessAlert("You cannot select a period of more than 30 days.");
    return;
  }
  getDbData('search');
};

const refresh = () => {
  getDbData('search');
}

const disableSelectItem = () => {
  selectedItem.value = {};
}

const loadMoreData = async () => {
  page.value += 1;
  await getDbData('loadMoreData');
};

const loadPrevData = async () => {

  prevPage.value = loadLastSearchParams().prevPage;
  prevPage.value -= 1;
  if (prevPage.value <= 0) {
    return;
  }
  await getDbData('loadPrevData');
};

const showSuccessAlert = async (message: string) => {
  showAlert.value = true;
  alertMessage.value = message;

};

const hideAlert = () => {
  showAlert.value = false;
};


const dateRefresh = () => {
  startDate.value = thirtyDaysAgo
  endDate.value = new Date();
  searchText.value = '';
  search();
}

const checkListItem = (items: any) => {
  checkedSelectedItems.value = items;
}


</script>
