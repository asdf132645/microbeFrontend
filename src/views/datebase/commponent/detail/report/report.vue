<template>

  <ClassInfoMenu @refreshClass="refreshClass"/>
  <div :class="'reportSection' + (cbcLayer ? ' cbcLayer' : '')">
    <LisCbc v-if="cbcLayer" :selectItems="selectItems"/>
    <div class="reportDiv">
      <div class="wbcDiv shadowBox">
        <WbcClass v-if="!isLoading" :wbcInfo="wbcInfo" :selectItems="selectItems" type='report'
                  @classOrderChanged="classOrderChanged" @submitStateChanged="submitStateChanged"
                  :isCommitChanged="isCommitChanged"/>
      </div>
      <div class="reportDetail shadowBox">
        <div class="reportTitle">
          <span>[Hospital]</span> <span>DM Serial Nbr : {{ selectItems?.slotId }}</span>
          <font-awesome-icon :icon="['fas', 'print']" @click="printStart" class="printStart"/>
        </div>
        <div class="reportDivTop">
          <h3 class="reportH3" v-if="!projectBm">Analysis Report from UIMD PB system</h3>
          <h3 class="reportH3" v-if="projectBm">Analysis Report from UIMD BM system</h3>
          <table class="reportTable">
            <tbody>
            <tr>
              <th>Slot ID</th>
              <td>{{ selectItems?.slotId }}</td>
            </tr>
            <tr>
              <th>Ordered date</th>
              <td>{{ formatDateString(selectItems?.orderDttm) }}</td>
            </tr>
            <tr>
              <th>Signed by ID</th>
              <td>{{ selectItems?.submitUserId }}</td>
            </tr>
            <tr>
              <th>Signed date</th>
              <td>{{ selectItems?.submitOfDate }}</td>
            </tr>
            <tr>
              <th>Patient ID</th>
              <td>{{ selectItems?.patientId }}</td>
            </tr>
            <tr>
              <th>Ordered Classification</th>
              <td>{{ getTestTypeText(selectItems?.testType) }}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{{ selectItems?.patientName }}</td>
            </tr>
            <tr>
              <th>Birth</th>
              <td>{{ selectItems?.birthDay }}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{{ selectItems?.gender === '' ? '' : selectItems?.gender === '01' ? 'Male' : 'Female' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div :class="['reportDivBottom', selectItems.testType !== '04' && 'reportDiff']">
          <div :class="['wbcLeft', projectBm && 'wbcLeftBm']">
            <h3 class="reportH3 mb1 pl0">{{ wbcClassTileChange() }} result</h3>
            <table class="tableClass mt22">
              <colgroup>
                <col width="40%">
                <col width="20%">
                <col width="20%">
              </colgroup>
              <thead>
              <tr class="reportWbcclassificationSmallTitle">
                <th>Class</th>
                <th>Count</th>
                <th>Percent</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item) in wbcInfo" :key="item.id" class="wbcClassDbDiv">
                <template v-if="shouldRenderCategory(item.title)">
                  <td>{{ item?.name }}</td>
                  <td>{{ item?.count }}</td>
                  <td> {{ Number(item?.percent) || '0' }}</td>
                </template>
              </tr>
              <tr>
                <td>Total</td>
                <td>{{ selectItems?.wbcInfo?.totalCount || 0 }}</td>
                <td>100.00</td>
              </tr>
              </tbody>
            </table>

            <h3 v-if="!selectItems?.wbcInfo?.nonRbcClassList && !projectBm" class="reportH3 mb1 pl0">non-WBC</h3>
            <table class="tableClass" v-if="!projectBm">
              <colgroup>
                <col width="40%">
                <col width="20%">
                <col width="20%">
              </colgroup>
              <tbody>
              <template v-for="(nWbcItem, outerIndex) in nonWbcClassList" :key="outerIndex">
                <tr v-show="siteCd !== '0006' && nWbcItem?.title !== 'SM'">
                  <td>{{ getCategoryName(nWbcItem) }}</td>
                  <td>
                    {{ Number(nWbcItem?.count) || 0 }}
                    <span v-if="nWbcItem?.title === 'NR' || nWbcItem?.title === 'GP'"> /{{
                        selectItems?.wbcInfo?.maxWbcCount
                      }} WBC</span>
                  </td>
                  <td>-</td>
                </tr>
              </template>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </div>
  <div ref="printContent">
    <Print v-if="printOnOff" @printClose="printClose"/>
  </div>
</template>

<script setup lang="ts">


import WbcClass from "@/views/datebase/commponent/detail/classInfo/commonLeftInfo/classInfo.vue";
import { computed, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { getTestTypeText } from "@/common/lib/utils/conversionDataUtils";
import { defaultWbcClassList, WbcInfo } from "@/store/modules/analysis/wbcclassification";
import Print from "@/views/datebase/commponent/detail/report/print.vue";
import router from "@/router";
import {useStore} from "vuex";
import {formatDateString} from "@/common/lib/utils/dateUtils";
import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import LisCbc from "@/views/datebase/commponent/detail/lisCbc.vue";
import {detailRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {readJsonFile} from "@/common/api/service/fileReader/fileReaderApi";

const getCategoryName = (category: WbcInfo) => category?.name;
const store = useStore();

const selectItems = ref<any>([]);
const wbcInfo = ref<any>(null);
const printOnOff = ref(false);
const siteCd = computed(() => store.state.commonModule.siteCd);
const cbcLayer = computed(() => store.state.commonModule.cbcLayer);
const selectedSampleId = computed(() => store.state.commonModule.selectedSampleId)
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const instance = getCurrentInstance();
const projectBm = ref(false);
const orderClass = ref<any>([]);
const isLoading = ref(true);
const nonWbcTitleArr = ['NR', 'GP', 'PA', 'AR', 'MA', 'SM'];
const nonWbcClassList = ref<any[]>([]);
const printContent = ref<HTMLElement | null>(null);
const isCommitChanged = ref(false);

const handleClickOutside = (event: MouseEvent) => {
  if (printContent.value && !printContent.value.contains(event.target as Node) && printOnOff.value) {
    printClose();
  }
};


onMounted(async () => {
  await getDetailRunningInfo();
  isLoading.value = false;
  await initData();
  document.addEventListener('click', handleClickOutside);

});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const getDetailRunningInfo = async () => {
  try {
    const result = await detailRunningApi(String(selectedSampleId.value));
    selectItems.value = result.data;
  } catch (e) {
    console.log(e);
  }
}

// WbC Classification 쪽에서 Order Class 바꿀 시 Print 영역에도 바로 적용시키기 위한 코드
const classOrderChanged = async () => {
  await initData();

}

const shouldRenderCategory = (title: string) => {
  // 제외할 클래스들 정의
  const targetArray = getStringArrayBySiteCd(siteCd.value, selectItems.value?.testType);
  return !targetArray.includes(title);
};

const getStringArrayBySiteCd = (siteCd: string, testType: string): string[] => {
  if (!siteCd && siteCd === '') {
    siteCd = '0000';
    testType = '01';
  }
  const arraysBySiteCd: any = { // 0006 -> 고대
    '0006': {
      includesStr: ["AR", "NR", "GP", "PA", "MC", "MA", "SM", 'NE', 'GP', 'PA', 'OT'],
      includesStr2: ["NR", "AR", "MC", "MA", "SM", 'NE', 'GP', 'PA', 'OT'],
    },
  };

  // 지정된 siteCd에 대한 배열을 가져오거나, 기본 배열을 반환
  const arraysForSiteCd = arraysBySiteCd[siteCd] || {
    includesStr: ["AR", "NR", "GP", "PA", "MC", "SM", "MA", 'GP', 'PA', 'OT'],
    includesStr2: ["NR", "AR", "MC", "MA", "SM", 'GP', 'PA', 'OT'],
  };

  // testType에 따라 제외할 부분 정의
  return (testType === '01' || testType === '04') ? arraysForSiteCd.includesStr : arraysForSiteCd.includesStr2;
};

const refreshClass = async (data: any) => {
  await getDetailRunningInfo();
  await initData();
}

const printClose = () => {
  printOnOff.value = false;
}

const wbcClassTileChange = (): string => 'WBC Classification';

const printStart = (event: MouseEvent) => {
  event.stopPropagation(); // 이벤트 전파를 막아 handleClickOutside 실행 방지
  printOnOff.value = true;
};

const pageGo = (path: string) => {
  router.push(path)
}

async function initData(data?: any) {
  if (selectItems.value?.classInfo && selectItems.value?.classInfo.length !== 0) {
    nonWbcClassList.value = selectItems.value?.classInfo.filter((item: any) => nonWbcTitleArr.includes(item.title));
    wbcInfo.value = selectItems.value?.classInfo;
  }
}

const submitStateChanged = (changedSubmitState: string) => {
  if (changedSubmitState) {
    isCommitChanged.value = !isCommitChanged.value;
  }
};

</script>
