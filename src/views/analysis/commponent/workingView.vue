<template>
  <div>
    <h3 class="titleText">Working View</h3>
    <div>
      <p class="mt30" :class="{'blinkColor': isBlinking}">{{ changeWqStatCd() }}</p>
      <p class="workingViewer-processingCode">{{ getProcessingCode(processingCode) }}</p>

      <div class="circular-progress-bar mt20">
        <svg class="progress-ring" width="240" height="240">
          <!-- Define Rotating Gradient -->
          <defs>

            <!-- Gradient for Progress Circle -->
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#56ccf2" />
              <stop offset="50%" stop-color="#35b0b6" />
              <stop offset="100%" stop-color="#2f80ed" />

              <!-- Rotate the gradient over time -->
              <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  from="0 0.5 0.5"
                  to="360 0.5 0.5"
                  dur="2s"
                  repeatCount="indefinite"
              />
            </linearGradient>

            <!-- Drop Shadow Filter -->
            <filter id="shadow">
              <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(0, 0, 0, 0.3)" />
            </filter>
          </defs>

          <!-- Background Circle -->
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius - strokeWidth / 2"
              :stroke-width="strokeWidth"
              stroke="#ccc"
              fill="none"
          />

          <!-- Progress Circle with Animated Gradient and Shadow -->
          <circle
              :cx="radius"
              :cy="radius"
              :r="radius - strokeWidth / 2"
              :stroke-width="strokeWidth"
              stroke="url(#gradient)"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashoffset"
              filter="url(#shadow)"
          />
        </svg>

        <div class="workingView-analysisTime-container">
          <p class="slideTime">Analysis Time</p>
          <p class="slideTime mt20"> {{ timeDataGet.slideTime }} </p>
        </div>
      </div>
      <p class="slideTime1 mt20 mb4">Total Time</p>
      <p> {{ timeDataGet.totalSlideTime }} </p>

    </div>
    <div class='slideCardWrap' v-if="machineVersion === '12a'">
      <!-- input -->
      <ul class='slideContent'>
        <li class="cassette" v-for="item in slideCardData.input" :key="item.slotNo" :class="getSlotStateClass(item.slotState, 'input')"></li>
        <p class="mt10">INPUT</p>
      </ul>
      <!-- output -->
      <ul class='slideContent'>
        <li v-for="item in slideCardData.output" :key="item.slotNo"
            :class="getSlotStateClass(item.slotState,'output')"></li>
        <p class="mt10">OUTPUT</p>
      </ul>
    </div>
    <div class='slideCardWrap' v-else>
      <!-- input -->
      <ul class='slideContent pb100a'>
        <li>INPUT : {{ casExistChangeText(iCasExist) }}</li>
        <li class="cassette" v-for="item in [...slideCardData.input].reverse()" :key="item.slotNo"
            :class="getSlotStateClass(item.slotState,'input')"></li>
        <li class="mt10">OUTPUT : {{ casExistChangeText(oCasExist) }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, defineProps, onBeforeMount } from 'vue';
import {useStore} from "vuex";
import {SlotInfo} from "@/store/modules/testPageCommon/ruuningInfo";
import {EmbeddedStatusState} from "@/store/modules/embeddedStatusModule";
import {getCountToTime} from "@/common/lib/utils/dateUtils";
import { SLIDE_CARD, SLIDE_CARD_100A } from "@/common/defines/constFile/analysis/analysis";
import {getProcessingCode} from "@/common/lib/utils/conversionDataUtils";
import {CommonState} from "@/store/modules/commonModule";
import { SLIDE_CARD_TYPE } from "@/common/defines/constFile/analysis/analysis.dto";
import {IntervalType} from "@/common/type/generalTypes";

// 스토어
const store = useStore();
const runningInfoModule = computed(() => store.state.runningInfoModule);
const commonDataGet = computed(() => store.state.commonModule);
const initValData = computed(() => store.state.commonModule.initValData);
const timeDataGet = computed(() => store.state.timeModule);
const props = defineProps(['parsedData', 'pb100aCassette']);
const processingCode = ref('');
const timeNum = ref(0);


const size = 240;  // SVG 크기
const strokeWidth = 14; // 프로그레스 바 두께
const radius = size / 2;
const circumference = 2 * Math.PI * (radius - strokeWidth / 2);
const dashoffset = ref(circumference);

const eqStatCd = ref('');
const slideTime = ref('');
const totalSlideTime = ref('');

let countingInterval: IntervalType = null;
let countingIntervalTotal: IntervalType = null;
let isBlinkingInterval: IntervalType = null;

const slideCardData = ref(SLIDE_CARD);
const totalElapsedTimeCount = ref(0);
const elapsedTimeCount = ref(0);
const isBlinking = ref(false);
const fixEqStatCd = ref(false);
const machineVersion = ref('100a');
const iCasExist = ref('0');
const oCasExist = ref('0');

watch(() => store.state.embeddedStatusModule, (newData: EmbeddedStatusState) => {
  const sysInfo = newData.sysInfo;
  if (sysInfo.eqStatCd === '02') {
    fixEqStatCd.value = false;
  }

  if (!fixEqStatCd.value) {
    eqStatCd.value = newData.sysInfo.eqStatCd;
  }

  if (commonDataGet.value.isRunningState) {
    updateInputState(sysInfo.iCasStat, slideCardData.value.input);
    updateInputState(sysInfo.oCasStat, slideCardData.value.output);
  } else {
    stopTotalCounting();
    stopCounting();
  }

  const regex = /[1,2,9]/g;
  const dataICasStat = String(sysInfo?.iCasStat);
  if (String(sysInfo?.iCasStat) !== '999999999999') {
    if ((dataICasStat.search(regex) < 0) || sysInfo?.oCasStat === '111111111111') { // 끝났을 경우 체크하는 곳
      updateInputState(sysInfo.iCasStat, slideCardData.value.input);
      updateInputState(sysInfo.oCasStat, slideCardData.value.output);
    }
  }
}, {deep: true});

// 장비가 슬라이드 검사를 완료 할때 감시
watch([commonDataGet.value], async (newVals: CommonState[]) => {
  const newValsObj = JSON.parse(JSON.stringify(newVals));

  if (!newValsObj[0].startEmbedded) {
    stopCounting();
  } else if (newValsObj[0].runningSlotId === '' && newValsObj[0].startEmbedded) {
    startTotalCounting();
  }


  if (!newValsObj[0].isRunningState) {
    stopTotalCounting();
    stopCounting();
    dashoffset.value = circumference;
  }
});


watch([runningInfoModule.value], (newSlot: SlotInfo[]) => {
  const slotArray = JSON.parse(JSON.stringify(newSlot))
  iCasExist.value = slotArray[0]?.runningInfo?.iCasExist;
  oCasExist.value = slotArray[0]?.runningInfo?.oCasExist;
  processingCode.value = slotArray[0]?.runningInfo?.processingCode;

  if (slotArray[0].changeSlideState?.changeSlide.value === 'start' && slotArray[0].slideBooleanState?.slideIs.value === true) {
    startCounting();
  } else if (slotArray[0].changeSlideState?.changeSlide.value === 'stop') {
    if (countingInterval !== null) {
      // stop일 경우 실행 중인 interval을 중지
      clearInterval(countingInterval);
      countingInterval = null;
    }
  }
  // afterChange
  if (slotArray[0].changeSlideState?.changeSlide.value === 'afterChange') {
    stopCounting();
    startCounting();
  }

  if (slotArray[0].runningInfo) dashoffset.value = calculateDashOffset(processingCode.value);

});


watch(() => eqStatCd.value, (newVal) => {
  if (newVal === '05') {
    isBlinkingInterval = setInterval(() => {
      isBlinking.value = !isBlinking.value;
    }, 1000);

  } else {
    isBlinking.value = false;
    if (isBlinkingInterval !== null) clearInterval(isBlinkingInterval);
  }
})

watch(() => initValData.value, (newVal) => {
  if (newVal) {
    eqStatCd.value = '05';
  }
  fixEqStatCd.value = newVal;
})
watch(
    () => props.pb100aCassette,
    (newVal) => {
      if (newVal === 'reset') {
        stopTotalCounting();
        startTotalCounting();
        stopCounting();
      }
    },
    {deep: true}
);

onBeforeMount(() => {
  machineVersion.value = window.MACHINE_VERSION;
  slideCardData.value = machineVersion.value === '100a' ? SLIDE_CARD_100A : SLIDE_CARD;
})

onMounted(() => {
  eqStatCd.value = '01';
  slideCardData.value.input.forEach(item => {
    item.slotState = '0';
  });

  slideCardData.value.output.forEach(item => {
    item.slotState = '0';
  });

});

const calculateDashOffset = (processingCode: string | number) => {
  let percentage;
  if (processingCode === '' || !processingCode) percentage = 0;
  else if (Number(processingCode) < 300) percentage = 1;
  else if (Number(processingCode < 400)) percentage = 2;
  else if (Number(processingCode < 500)) percentage = 3;
  else if (Number(processingCode < 700)) percentage = 4;
  else if (Number(processingCode < 900)) percentage = 5;
  else percentage = 6;

  const calculatedPercentage = (percentage / 6) * 100;
  return circumference * (1 - calculatedPercentage / 100);
}

const updateInputState = (source: string, target: SLIDE_CARD_TYPE[]): void => {
  // 2는 진행중, 1은 있다. 3은 완료 iCasStat 기준
  target.forEach((item, index) => {
    item.slotState = source.charAt(index);
  });
}


const startCounting = (): void => {
  if (!countingInterval) {
    countingInterval = setInterval(() => {
      if (commonDataGet.value.isRunningState) {
        elapsedTimeCount.value += 1;
        timeNum.value = elapsedTimeCount.value % 60;
        sessionStorage.setItem('elapsedTimeCount', String(elapsedTimeCount.value));
        store.dispatch('timeModule/setTimeInfo', {slideTime: getCountToTime(elapsedTimeCount.value)});
      }
    }, 1000);
  }
};

onBeforeUnmount(() => {
  if (countingInterval) {
    clearInterval(countingInterval);
    countingInterval = null;
  }
  if (countingIntervalTotal) {
    clearInterval(countingIntervalTotal);
    countingIntervalTotal = null;
  }
});

const startTotalCounting = (): void => {
  if (!countingIntervalTotal) {
    countingIntervalTotal = setInterval(() => {
      if (commonDataGet.value.isRunningState) {
        totalElapsedTimeCount.value += 1;
        sessionStorage.setItem('totalElapsedTimeCount', String(totalElapsedTimeCount.value));
        store.dispatch('timeModule/setTimeInfo', {totalSlideTime: getCountToTime(totalElapsedTimeCount.value)});
      }
    }, 1000);
  }
};

const stopCounting = () => {
  if (countingInterval !== null) clearInterval(countingInterval);
  countingInterval = null;
  elapsedTimeCount.value = 0;
  slideTime.value = getCountToTime(0);
  sessionStorage.removeItem('elapsedTimeCount');
  store.dispatch('timeModule/setTimeInfo', {slideTime: '00:00:00'});
};

const stopTotalCounting = (): void => {
  if (countingIntervalTotal !== null) clearInterval(countingIntervalTotal);
  countingIntervalTotal = null;
  totalElapsedTimeCount.value = 0;
  totalSlideTime.value = getCountToTime(0);
  sessionStorage.removeItem('totalElapsedTimeCount');
  store.dispatch('timeModule/setTimeInfo', {totalSlideTime: '00:00:00'});
};


const changeWqStatCd = (): string => {
  switch (eqStatCd.value) {
    case '01':
      return 'IDLE';
    case '02':
      return 'READY';
    case '03':
      return 'ERROR';
    case '04':
      return 'RUNNING';
    case '05':
      return 'INITIALIZATION';
    default:
      return 'UNKNOWN';
  }
}

const getSlotStateClass = (state: string, type: string): string => {
  // 각 상태에 따라 클래스명 반환
  if (type === 'input') {
    switch (String(state)) {
      case '0':
        return 'class-for-state-0';
      case '1':
        return 'class-for-state-1';
      case '2':
        return 'class-for-state-2';
      case '3':
        return 'class-for-state-3';
      case '4':
        return 'class-for-state-4';
      default:
        return '';
    }
  } else {
    switch (state) {
      case '0':
        return 'out-for-state-0';
      case '1':
        return 'out-for-state-1';
      default:
        return 'outClassDefault';
    }
  }

}

const casExistChangeText = (val: string) => {
  switch (val) {
    case '0':
      return 'EMPTY';
    case '1':
      return 'EXIST';
    case '2':
      return 'FULL';
  }
}

</script>