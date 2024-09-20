<!-- ListInfo.vue -->
<template>
  <div v-if="!isObjectEmpty(selectedItem)">
    <div>
      <h3 class="orderTitle hh3title">Order Information</h3>
      <div class="orderListWrapper" style="padding: 0;">
        <ul class="orderListUi">
          <li class="flexColumn">
            <span class="mb1">Order ID:</span>
            <span class="mb2">{{ selectedItem?.slotId }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb1">Cassette ID:</span>
            <span class="mb2">{{ selectedItem?.cassetId }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb1">Patient ID:</span>
            <span class="mb2">{{ selectedItem?.patientId }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb1">Patient Name:</span>
            <span class="mb2">{{ selectedItem?.patientNm }}</span>
          </li>
        </ul>
        <div>
          <img v-show="!barCodeImageShowError" @error="onImageError" :src="pilePath"
               style="width: 200px; float:right;"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';
import {barcodeImgDir} from "@/common/defines/constFile/settings";
import {useStore} from "vuex";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
const store = useStore();
const props = defineProps(['selectedItem']);
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const siteCd = computed(() => store.state.commonModule.siteCd);

const pilePath = ref('');
const barCodeImageShowError = ref(false);
const wbcTotal = ref(0);
const nonWbcTitles = ['NR', 'GP', 'PA', 'AR', 'MA', 'SM', 'OT'];

onMounted(async () => {
  barCodeImageShowError.value = false;
  // iaRootPath가 존재하면 getImageUrl 함수 호출
  if (iaRootPath.value) {
    pilePath.value = getImageUrl('barcode_image.jpg');
  }
});

watch(() => props.selectedItem, (newSelectedItem) => {
  barCodeImageShowError.value = false;
  // setWbcTotalAndPercent();

  if (iaRootPath.value) {
    pilePath.value = getImageUrl('barcode_image.jpg', newSelectedItem);
  }
});

const setWbcTotalAndPercent = () => {
  wbcTotal.value = props.selectedItem.wbcInfoAfter.reduce((acc, item) => {
    if (!nonWbcTitles.includes(item.title)) return acc + Number(item.count)
    return acc
  }, 0)
  for (const item of props.selectedItem.wbcInfoAfter) {
    const targetArray = getStringArrayBySiteCd(siteCd.value, props.selectedItem?.testType);
    if (!targetArray.includes(item.title)) {
      const percentage = ((Number(item.count) / Number(wbcTotal.value)) * 100).toFixed(1); // 소수점 0인경우 정수 표현
      item.percent = (Number(percentage) === Math.floor(Number(percentage))) ? Math.floor(Number(percentage)).toString() : percentage;
    }
  }
}

const getStringArrayBySiteCd = (siteCd, testType) => {
  if (!siteCd && siteCd === '') {
    siteCd = '0000';
    testType = '01';
  }
  const arraysBySiteCd = { // 0006 -> 고대
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


const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

function getImageUrl(imageName) {
  const path = props.selectedItem?.img_drive_root_path !== '' && props.selectedItem?.img_drive_root_path ? props.selectedItem?.img_drive_root_path : iaRootPath.value;
  return `${apiBaseUrl}/images?folder=${path + '/' + props.selectedItem.slotId + '/' + barcodeImgDir.barcodeDirName + '/'}&imageName=${imageName}`;
}

const onImageError = () => {
  barCodeImageShowError.value = true;
}

</script>
