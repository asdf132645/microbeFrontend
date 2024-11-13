<template>

  <ClassInfoMenu @refreshClass="refreshClass"/>
  <div class="reportSection">
    <DetailHeader
        :testType="getTestTypeText(selectItems?.testType)"
        :barcodeNo="selectItems?.barcodeNo"
        :cbcPatientNo="selectItems?.cbcPatientNo"
        :patientName="selectItems?.patientName"
        :hospitalName="selectItems?.hosName"
        :cbcPatientName="selectItems?.cbcPatientNm"
        :cbcSex="selectItems?.cbcSex"
        :cbcAge="selectItems?.cbcAge"
    />
    <div class="reportDiv">
      <div class="databaseDetailLeft shadowBox">
        <ClassInfo type='report' @submitStateChanged="submitStateChanged" :isCommitChanged="isCommitChanged"/>
      </div>
      <div class="reportDetail shadowBox">
        <div class="reportTitle">
          <span>[Hospital]</span> <span>DM Serial Nbr : {{ selectItems?.slotId }}</span>
          <font-awesome-icon :icon="['fas', 'print']" @click="printStart" class="printStart"/>
        </div>
        <div class="reportDivTop">
          <h3 class="reportH3">Analysis Report from UIMD MO system</h3>
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
          <div class="wbcLeft">
            <h3 class="reportH3 mb10 pl0">MO Classification result</h3>
            <table class="tableClass mt22">
              <colgroup>
                <col width="40%">
                <col width="20%">
                <col width="20%">
              </colgroup>
              <thead>
              <tr class="reportWbcclassificationSmallTitle">
                <th>Class</th>
                <th>Grade</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item) in moInfo" :key="item.id" class="wbcClassDbDiv">
                <td>{{ MAP_CLASS_ID_TO_CLASS_NM[item?.classId] }}</td>
                <td>{{ item?.afterGrade }}</td>
              </tr>
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


import ClassInfo from "@/views/datebase/commponent/detail/classInfo/commonLeftInfo/classInfo.vue";
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
import {getTestTypeText, getTotalCountOfClassInfo} from "@/common/lib/utils/conversionDataUtils";
import Print from "@/views/datebase/commponent/detail/report/print.vue";
import {useStore} from "vuex";
import {formatDateString} from "@/common/lib/utils/dateUtils";
import ClassInfoMenu from "@/views/datebase/commponent/detail/classInfoMenu.vue";
import { MAP_CLASS_ID_TO_CLASS_NM } from "@/common/defines/constFile/dataBase";
import DetailHeader from "@/views/datebase/commponent/detail/detailHeader.vue";

const store = useStore();
const moInfo = ref<any>(null);
const printOnOff = ref(false);
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const instance = getCurrentInstance();
const printContent = ref<HTMLElement | null>(null);
const isCommitChanged = ref(false);
const totalCount = ref(0);

const handleClickOutside = (event: MouseEvent) => {
  if (printContent.value && !printContent.value.contains(event.target as Node) && printOnOff.value) {
    printClose();
  }
};


onMounted(async () => {
  await initData();
  document.addEventListener('click', handleClickOutside);

});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const refreshClass = async () => {
  await initData();
}

const printClose = () => {
  printOnOff.value = false;
}

const printStart = (event: MouseEvent) => {
  event.stopPropagation(); // 이벤트 전파를 막아 handleClickOutside 실행 방지
  printOnOff.value = true;
};

const initData = async () => {
  if (selectItems.value?.classInfo && selectItems.value?.classInfo.length !== 0) {
    moInfo.value = selectItems.value?.classInfo.find((item: any) => item.id === '2').classInfo;
    totalCount.value = getTotalCountOfClassInfo(moInfo.value);
  }
};

const submitStateChanged = (changedSubmitState: string) => {
  if (changedSubmitState) isCommitChanged.value = !isCommitChanged.value;
};

</script>
