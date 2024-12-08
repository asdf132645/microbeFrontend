<template>
  <div class="orderList-container container-shadow">
    <h3 class="titleText">Order List</h3>
    <table class="orderListTable">
      <thead>
      <tr>
        <th>Barcode ID</th>
        <th>Patient Name</th>
        <th>Order Date</th>
        <th>State</th>
      </tr>
      </thead>
      <tbody v-if="dspOrderList.length > 0">
        <tr v-for="(slot, index) in dspOrderList" :key="index">
          <td>{{ slot?.barcodeId }}</td>
          <td>{{ slot?.patientName }}</td>
          <!--    0019는 길병원(검사 끝나는 시간으로 해달라는 길병원 요구)    -->
          <td>{{
              slot?.analyzedDttm ? formatDateString(slot?.analyzedDttm) : formatDateString(slot?.orderDate)
            }}
          </td>
          <td>{{ slot?.state }}</td>
        </tr>
      </tbody>
      <tbody v-else>
      <tr>
        <td colspan="4">Data is empty.</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import { stringToDateTime } from "@/common/lib/utils/conversionDataUtils";
import { formatDateString } from "@/common/lib/utils/dateUtils";
import { RUNNING_INFO_INTERFACE_CODE } from "@/common/defines/constFile/commonCodeList";

interface OrderListInterface {
  barcodeId: string;
  patientName: string;
  orderDate: string;
  analyzedDttm: string;
  state: string | undefined;
}

const props = defineProps(['parsedData', 'startStatus', 'pb100aCassette']);
const dspOrderList = ref<OrderListInterface[]>([]);

watch(() => props.parsedData, (newVal) => {
      runningInfoGet(newVal);
    },{deep: true});

watch(() => props.pb100aCassette, (newVal) => {
      if (newVal === 'reset') {
        dspOrderList.value = [];
      }
    }, {deep: true});


watch(() => props.startStatus, (newVal) => {
      if (newVal === true) dspOrderList.value = [];
    }, {deep: true});

const runningInfoGet = async (data: any) => {
  const parsedData = data
  if (parsedData.jobCmd === 'RUNNING_INFO') {
    const currentSlot = parsedData?.slotInfo
    if (currentSlot) {
      const barcodeNo = currentSlot.barcodeNo;
      const existingItemIndex = dspOrderList.value.findIndex((item: any) => item.barcodeId === barcodeNo);
      const inputCassetteArr = [...parsedData?.iCasStat].filter((id: string) => id !== '0');
      if (existingItemIndex === -1 && barcodeNo !== '') {

        /** 만약 오류가 발생해서 OrderList가 10개 초과일 경우 화면에서 보여주는 OrderList를 10개까지만 보여주는 코드 */
        // Start
        if (dspOrderList.value.length > 10) {
          dspOrderList.value = [];
        }
        // End

        // Core에서 받는 stateCd가 저장되는 타이밍을 잡기 어려워 추가한 stateCd 변경 코드
        const completedCassetteIndex = inputCassetteArr.lastIndexOf('3');
        dspOrderList.value[completedCassetteIndex].state = RUNNING_INFO_INTERFACE_CODE.I_CAS_STAT_ID_LIST[3].cdNm;

        const stateCdObj = RUNNING_INFO_INTERFACE_CODE.I_CAS_STAT_ID_LIST.find((code: {cd: string; cdNm: string}) => code.cd === inputCassetteArr[dspOrderList.value.length]);

        dspOrderList.value.push({
          barcodeId: barcodeNo,
          patientName: currentSlot.patientNm,
          orderDate: stringToDateTime(currentSlot.orderDttm),
          analyzedDttm: stringToDateTime(currentSlot.analyzedDttm),
          state: stateCdObj?.cdNm,
        });
      } else {
        const stateCdObj = RUNNING_INFO_INTERFACE_CODE.I_CAS_STAT_ID_LIST.find((code: {cd: string; cdNm: string}) => code.cd === inputCassetteArr[existingItemIndex]);

        dspOrderList.value[existingItemIndex] = {
          barcodeId: barcodeNo,
          patientName: currentSlot.patientNm,
          orderDate: stringToDateTime(currentSlot.orderDttm),
          analyzedDttm: stringToDateTime(currentSlot.analyzedDttm),
          state: stateCdObj?.cdNm,
        };
      }
    }
  }
}


</script>