<template>
  <div class="container-shadow">
    <h3 class="titleText"><span class="greenColor">P</span>rocessing <span class="greenColor">I</span>nformation </h3>
    <ul class="processInfoUl">
      <li><span class="proSpan">Cassette No</span> <span class="proVal">{{ processInfoItem?.cassetteNo }}</span></li>
      <li><span class="proSpan">Barcode ID</span> <span class="proVal">{{ processInfoItem?.barcodeId }}</span></li>
      <li><span class="proSpan">Patient ID</span> <span class="proVal">{{ processInfoItem?.patientId }}</span></li>
      <li><span class="proSpan">Patient Name</span> <span class="proVal">{{ processInfoItem?.patientName }}</span></li>
      <li>
        <!--0019 길병원-->
        <span class="proSpan">
          {{ siteCd === '0019' ? 'Order Date' : 'Analyzed Date' }}
        </span>
        <span class="proVal">
          {{ siteCd === '0019' ? processInfoItem?.analyzedDttm   : processInfoItem?.orderDate }}
        </span>
      </li>
      <li>
        <span class="proSpan">Oil Count</span>
        <span class="proVal">{{ prevOilCount }}</span>
      </li>
      <li>
        <span class="proSpan">{{ currentCardName }}</span>
        <span class="proVal">{{ currentCardCount }}</span>
      </li>
    </ul>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted, defineProps } from "vue";
import { useStore } from "vuex";
import { stringToDateTime } from "@/common/lib/utils/conversionDataUtils";

const store = useStore();
const props = defineProps([ 'parsedData']);
const embeddedStatusJobCmd = computed(() => store.state.embeddedStatusModule);
const siteCd = computed(() => store.state.commonModule.siteCd);

// processInfoItem 초기화
const processInfoItem = ref<any>({});
const prevOilCount = ref<string | null>(null);
const currentCardCount = ref('');
const currentCardName = ref('');

watch([embeddedStatusJobCmd.value], async (newVal) => {
  if (newVal.length > 0) {
    const sysInfo = newVal[0].sysInfo;
    if(sysInfo.oilCount !== prevOilCount.value){
      processInfoItem.value.oilCount = sysInfo.oilCount;
      prevOilCount.value = sysInfo.oilCount;
    }
    currentCardCount.value = sysInfo.currentCardCount;
    currentCardName.value = sysInfo.currentCardName;
  }
})

onMounted(() => {
  prevOilCount.value = embeddedStatusJobCmd.value[0]?.sysInfo.oilCount;
});

watch(
    () => props.parsedData,
    (newVal) => {
      runningInfoGet(newVal);
    },
    { deep: true }
);


const runningInfoGet = async (data: any) => {
  const parsedData = data
  if(parsedData.jobCmd === 'RUNNING_INFO'){
    const currentSlot = parsedData?.slotInfo;
    if (currentSlot) {
      processInfoItem.value = {
        cassetteNo: '',
        barcodeId: currentSlot.barcodeNo,
        patientId: currentSlot.patientId,
        patientName: currentSlot.patientNm,
        // wbcCount: currentSlot.maxWbcCount,
        orderDate: stringToDateTime(currentSlot.orderDttm),
        analyzedDttm: stringToDateTime(currentSlot.analyzedDttm),
      };
    }
  }
}



// 실행정보를 가지고 온다.

</script>
