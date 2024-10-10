<template>
  <div class="rbc-container imgList">

    <div class="flex-column-justify-center">
      <div class="flex-justify-center-align-start mt40">
        <div class="flex-center">
          <span class="arrowBox leftArrow">
          <font-awesome-icon :icon="['fas', 'arrow-left']" @click="handleImageArrow('left')" />
        </span>

          <div class="classImageInfo-container">

            <div class="tiling-viewer_img_list-box_img_list">
              <div v-if="tileExist"
                   ref="tilingViewerLayer"
                   id="tiling-viewer_img_list" style="width: 100%;">
              </div>

              <div v-else>
                <span>Tile does not exist.</span>
              </div>

            </div>
          </div>

          <span class="arrowBox rightArrow">
          <font-awesome-icon :icon="['fas', 'arrow-right']" @click="handleImageArrow('right')" />
        </span>
        </div>

        <ClassDetailInfo :selectedImageName="selectedImageName" />
      </div>


      <ClassImageSlider :allImages="allImages" :viewer="viewer" />
    </div>

  </div>
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
import {computed, defineEmits, defineProps, onMounted, ref, watch } from 'vue';
import OpenSeadragon from 'openseadragon';
import { useStore } from "vuex";
import Alert from "@/components/commonUi/Alert.vue";
import ClassDetailInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classDetailInfo.vue";
import ClassImageSlider from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classImageSlider.vue";
import type { DirectionType, ImageSourceType } from "#/database/image";
import { ARROW_DIRECTION, FOLDER_NAME } from "@/common/defines/constFile/dataBase";
import {LocationQueryValue, useRoute} from "vue-router";

const emits = defineEmits();
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');

const canvasOverlay = ref<any>(null);
let viewer: any = ref<any>(null);
const isMagnifyingGlass = ref(false);
const tilingViewerLayer = ref(null);
const tileExist = ref(true);
const selectItems = computed(() => store.state.commonModule.currentSelectItems);

const store = useStore();
const route = useRoute();
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const allImages = ref<any>([]);
const selectedImageName = ref('');
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>('');

onMounted(async () => {
  await initElement();
  currentPowerType.value = route.query.pageType;
})

watch(() => route.query.pageType, async (newPageType) => {
  currentPowerType.value = newPageType;
  const tilingViewerLayer = document.getElementById('tiling-viewer_img_list');
  if (tilingViewerLayer) {
    tilingViewerLayer.innerHTML = ''; // 기존 내용 삭제

    // OpenSeadragon 인스턴스가 존재하면 초기화하지 않고 캔버스만 업데이트
    if (viewer.value) {
      viewer.value.destroy(); // 기존 뷰어 인스턴스 파괴
    }
    await initElement();
  }
})

watch(() => selectItems.value, async () => {
  const tilingViewerLayer = document.getElementById('tiling-viewer_img_list');
  if (tilingViewerLayer) {
    tilingViewerLayer.innerHTML = ''; // 기존 내용 삭제

    // OpenSeadragon 인스턴스가 존재하면 초기화하지 않고 캔버스만 업데이트
    if (viewer.value) {
      viewer.value.destroy(); // 기존 뷰어 인스턴스 파괴
    }
    await initElement();
  }
})

const initElement = async () => {


  const rootPath = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : iaRootPath.value;
  const powerFolderName = currentPowerType.value === 'HP' ? FOLDER_NAME.HIGH_POWER : FOLDER_NAME.LOW_POWER;
  const folderPath = `${rootPath}/${selectItems.value.slotId}/${powerFolderName}`;
  const path = `D:\\MO_IMAGE_TEST\\1`;
  const imageSources = await fetchImage(folderPath);
  allImages.value = imageSources.map((imageSource, index: number) => {
    return {
      url: imageSource.url,
      width: imageSource.url,
      height: imageSource.height,
      index,
    }
  });

  try {

    viewer.value = OpenSeadragon({
      id: "tiling-viewer_img_list",
      animationTime: 0.4,
      showNavigator: false,
      sequenceMode: true,
      defaultZoomLevel: 1,
      prefixUrl: `${apiBaseUrl}/folders?folderPath=D:/UIMD_Data/Res/uimdFe/images/`,
      tileSources: imageSources,
      showSequenceControl: false,
      showReferenceStrip: false,
      gestureSettingsMouse: {clickToZoom: false},
      maxZoomLevel: 15,
      minZoomLevel: 1, // 최소 확대 레벨 설정
      zoomPerClick: 1.2, // 클릭 확대 비율 설정
      zoomPerScroll: 1.2, // 스크롤 확대 비율 설정
      viewportMargins: {top: 0, left: 0, bottom: 0, right: 0}, // 뷰포트 여백 설정
      visibilityRatio: 1.0 // 이미지를 뷰포트에 맞추기 위한 비율 설정
    });

    // 마그니파이어 설정 - 동그라미 줌기능
    new OpenSeadragon.MouseTracker({
      element: viewer.value.element,
      moveHandler: function (event) {
        const existingMagCanvas = document.getElementById('magCanvas');
        if (existingMagCanvas) {
          viewer.value.element.removeChild(existingMagCanvas);
        }

        if (!isMagnifyingGlass.value) {
          return;
        }

        const { canvas } = viewer.value.drawer;
        const magCanvas = document.createElement('canvas');
        const magCtx = magCanvas.getContext('2d');
        canvasOverlay.value = magCanvas;
        if (magCtx) {
          const magWidth = 200;
          const magHeight = 200;
          const zoomLevel = 5;

          magCanvas.id = 'magCanvas';
          magCanvas.width = magWidth;
          magCanvas.height = magHeight;
          magCanvas.style.position = 'absolute';
          magCanvas.style.left = `${event.position.x - magWidth / 2}px`;
          magCanvas.style.top = `${event.position.y - magHeight / 2}px`;
          magCanvas.style.border = '1px solid';
          magCanvas.style.borderRadius = '50%';
          magCanvas.style.width = `${magWidth}px`;
          magCanvas.style.height = `${magHeight}px`;
          magCanvas.style.zIndex = '0';

          viewer.value.element.appendChild(magCanvas);

          // 줌을 위한 확대된 부분을 정확히 잘라내기 위해 drawImage 메서드 수정
          magCtx.drawImage(
              canvas,
              event.position.x - (magWidth / 2 / zoomLevel),
              event.position.y - (magHeight / 2 / zoomLevel),
              magWidth / zoomLevel,
              magHeight / zoomLevel,
              0,
              0,
              magWidth,
              magHeight
          );

          magCanvas.style.visibility = event.position.y <= 0 || event.position.x <= 0 ? 'hidden' : 'visible';
        }
      },
    });


    // 캔버스 오버레이 생성 및 추가
    const canvas = document.createElement('canvas');
    const overlay = viewer.value.addOverlay({
      element: canvas,
      location: new OpenSeadragon.Rect(0, 0, 1, 1), // 캔버스가 뷰어 전체를 덮도록 설정
    });
    canvas.id = 'myCanvas';
    canvasOverlay.value = canvas;

    viewer.value.addHandler('open', function (event: any) {
      selectedImageName.value = event.source.url;
      // 캔버스 크기를 조정
      canvas.width = event.source.width;
      canvas.height = event.source.height;
    });

    viewer.value.addHandler('page', function (event: any) {
      // 페이지가 변경될 때 오버레이를 다시 추가
      selectedImageName.value = event.eventSource.tileSources[event.page].url;
      if (canvas.parentElement !== viewer.value.container) {
        viewer.value.addOverlay({
          element: canvas,
          location: new OpenSeadragon.Rect(0, 0, 1, 1),
        });
      }
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

const fetchImage = async (folderPath: string): Promise<ImageSourceType[]> => {
  const url = `${apiBaseUrl}/folders?folderPath=${folderPath}`;
  const response = await fetch(url);
  if (response.statusText === 'Not Found') {
    console.log('response', response);
  }

  const imageNames = await response.json()



  const imageSources = imageNames.map((imageName: string) => ({
    type: 'image',
    buildPyramid: false,
    width: 1920,
    height: 1080,
    url: `${url}\\${imageName}`
  }))

  return imageSources;
}

const handleImageArrow = (direction: DirectionType) => {
  const currentImageIndex = viewer.value.currentPage()
  const totalPages = viewer.value.tileSources.length;
  if (direction === ARROW_DIRECTION.LEFT && currentImageIndex > 0) {
    viewer.value.goToPage(currentImageIndex - 1);
  } else if (direction === ARROW_DIRECTION.RIGHT && currentImageIndex < totalPages) {
    viewer.value.goToPage(currentImageIndex + 1);
  }
}

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};
</script>

