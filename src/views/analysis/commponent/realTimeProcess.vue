<template>
  <div>
    <h3 class="titleText">Real Time Process</h3>
    <div class="realTimeProcess-image-container">
      <img
          v-if="!imageShowError"
          :key="stitchingImage"
          alt="Stitching Image"
          :src="stitchingImage"
          @error="onImageError"
          @load="onImageLoad"
          ref="imageRef"
      />
      <canvas ref="canvasRef"></canvas>
    </div>

  </div>
</template>

<script setup lang="ts">

import {computed, onBeforeUnmount, ref, watch} from "vue";
import {IntervalType} from "@/common/type/generalTypes";
import { getStitchingImageUrl } from "@/common/lib/utils/conversionDataUtils";
import {useStore} from "vuex";


const store = useStore();
const props = defineProps(['parsedData']);
const slotId = ref('')
const imageShowError = ref(false);
const stitchingImage = ref('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const previousCoordinates = ref<{ x1: number; x2: number; y1: number; y2: number }[]>([]);
const currentCoordinate = ref<{ x1: number; x2: number; y1: number; y2: number } | null>(null);
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const blinkInterval = ref<IntervalType>(null);
const preloadImageInstance = new Image();
const processingCode = ref('');

onBeforeUnmount(() => {
  if (blinkInterval.value) {
    clearInterval(blinkInterval.value);
  }
});

watch(() => props.parsedData, () => {
  imageShowError.value = false;
  slotId.value = props.parsedData.slotInfo.slotId;
  processingCode.value = props.parsedData.processingCode;

  if (Number(processingCode.value) < 500) {
    removeCanvas();
    stitchingImage.value = '';
  }

  if (300 <= Number(processingCode.value)) {
    showRealTimeImage();
    setStitchingImage();
  }
})

const showRealTimeImage = () => {
  const realTimeState = props.parsedData.RealTimeState;
  const { id, x1, x2, y1, y2 } = realTimeState;

  if (
      previousCoordinates.value.length > 0 &&
      previousCoordinates.value[previousCoordinates.value.length - 1].x1 === x1 &&
      previousCoordinates.value[previousCoordinates.value.length - 1].x2 === x2 &&
      previousCoordinates.value[previousCoordinates.value.length - 1].y1 === y1 &&
      previousCoordinates.value[previousCoordinates.value.length - 1].y2 === y2
  ) {
    //
  } else {
    previousCoordinates.value.push({ x1, x2, y1, y2 });
    currentCoordinate.value = { x1, x2, y1, y2 };
    setupBlinking();
    drawCanvas();
  }
}

const setStitchingImage = () => {
  const imageUrl = getStitchingImageUrl(iaRootPath.value, slotId.value);
  stitchingImage.value = imageUrl;
  preloadImage(imageUrl);
}

const preloadImage = (url: string) => {
  preloadImageInstance.src = url;
  preloadImageInstance.onload = () => {
    stitchingImage.value = url;
    imageShowError.value = false;
  }

  preloadImageInstance.onerror = () => {
    imageShowError.value = true;
    setTimeout(() => preloadImage(url), 500);
  }
}

const onImageError = () => {
  imageShowError.value = true;
}

const onImageLoad = () => {
  imageShowError.value = false;
}

const removeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return null;

  const context = canvas.getContext('2d');
  if (!context) return undefined;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  previousCoordinates.value = [];
}

const drawCanvas = () => {
  if (!canvasRef.value || !imageRef.value) return;

  const canvas = canvasRef.value;
  const context = canvas.getContext("2d");
  if (!context || !imageRef.value) return;

  const image = imageRef.value;

  canvas.width = image.width;
  canvas.height = image.height;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // 이전 좌표 그리기
  for (const { x1, x2, y1, y2 } of previousCoordinates.value) {
    drawRectangle(context, x1, y1, x2 - x1, y2 - y1, "rgba(0, 0, 255, 0.3)");
  }

  if (currentCoordinate.value) {
    const { x1, y1, x2, y2 } = currentCoordinate.value;
    drawRectangle(context, x1, y1, x2 - x1, y2 - y1, "rgba(255, 0, 0, 0.8)");
  }
};

const drawRectangle = (
    context: CanvasRenderingContext2D | null,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
) => {
  if (!context) return;
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

// 깜박이 애니메이션 설정
const setupBlinking = () => {
  if (blinkInterval.value) {
    clearInterval(blinkInterval.value);
  }

  blinkInterval.value = setInterval(() => {
    if (!canvasRef.value || !imageRef.value) return;
    currentCoordinate.value = currentCoordinate.value ? null : props.parsedData.RealTimeState;
    drawCanvas();
  }, 500);
};

</script>