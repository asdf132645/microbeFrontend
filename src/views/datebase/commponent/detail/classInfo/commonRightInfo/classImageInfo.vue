<template>
  <div class="mo-right-detail-container rbc-container imgList shadowBox borderRadiusRound">

    <div class="flex-column-justify-center">
      <div class="flex-justify-center-align-start mt40">
        <div class="flex-center">
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
        </div>

        <ClassDetailInfo :selectedImageName="selectedImageName" />
      </div>

      <ClassInfoImageSlider :allImages="allImages" @goToSelectImage="goToSelectImage" />
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
import OpenSeadragon from 'openseadragon';
import { computed, defineEmits, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from "vuex";
import { LocationQueryValue, useRoute } from "vue-router";
import Alert from "@/components/commonUi/Alert.vue";
import ClassDetailInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classDetailInfo.vue";
import type { ImageSourceType } from "#/database/image";
import {FOLDER_NAME, MO_CATEGORY, MO_CATEGORY_CLASS_ID, POWER_MODE} from "@/common/defines/constFile/dataBase";
import { MESSAGES } from "@/common/defines/constFile/constantMessageText";
import { filterImageFiles } from "@/common/lib/utils/checkUtils";
import ClassInfoImageSlider
  from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classInfoImageSlider.vue";
import {readJsonFile} from "@/common/api/service/fileReader/fileReaderApi";


const store = useStore();
const route = useRoute();
const props = defineProps(['checkedClassSet']);
const emits = defineEmits();
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const canvasOverlay = ref<HTMLCanvasElement | null>(null);
let viewer: any = ref<any>(null);
const tilingViewerLayer = ref(null);
const tileExist = ref(true);
const selectItems = computed(() => store.state.commonModule.currentSelectItems);
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const allImages = ref<any>([]);
const selectedImageName = ref('');
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>('');
const hiddenImages = ref<{ [key: string]: boolean }>({});
const checkedClassArr = ref<string[]>([]);
const classInfoPositionArr = ref<any>([]);
const drawPath = ref<any>([]);

onMounted(async () => {
  currentPowerType.value = route.query.pageType;
})

watch(() => route.query.pageType, async (newPageType) => {
  await nextTick();
  currentPowerType.value = newPageType;
  const tilingViewerLayer = document.getElementById('tiling-viewer_img_list');
  if (tilingViewerLayer) {
    tilingViewerLayer.innerHTML = '';

    if (viewer.value) viewer.value.destroy();
    await initElement();
  }
  await fetchImageJsonData(currentImageName.value);
})

watch(() => props.checkedClassSet, (newCheckedClassSet) => {
  checkedClassArr.value = [...newCheckedClassSet];

  drawClassPosCanvas(checkedClassArr.value);
}, { deep: true });

watch(() => selectItems.value, async () => {
  await nextTick();
  const tilingViewerLayer = document.getElementById('tiling-viewer_img_list');
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: '' });
  await store.dispatch('commonModule/setCommonInfo', { currentImageIndex: 0 });
  if (tilingViewerLayer) {
    tilingViewerLayer.innerHTML = '';
    if (viewer.value) viewer.value.destroy();
    await initElement();
  }
  await fetchImageJsonData(currentImageName.value);

})

const initElement = async () => {

  const rootPath = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : iaRootPath.value;
  const powerFolderName = currentPowerType.value === POWER_MODE.HIGH_POWER ? FOLDER_NAME.HIGH_POWER : FOLDER_NAME.LOW_POWER;
  const folderPath = `${rootPath}/${selectItems.value.slotId}/${powerFolderName}`;
  const imageSources = await fetchImage(folderPath);

  allImages.value = imageSources.map((imageSource, index: number) => {
    return {
      url: imageSource.url,
      width: imageSource.width,
      height: imageSource.height,
      imageName: imageSource.imageName,
      index,
    }
  });

  if (imageSources.length === 0) return;

  try {

    viewer.value = OpenSeadragon({
      id: "tiling-viewer_img_list",
      animationTime: 0.4,
      showNavigator: false,
      sequenceMode: true,
      defaultZoomLevel: 1,
      prefixUrl: `${apiBaseUrl}/folders?folderPath=D:/UIMD_Data/Res/uimdFe/images/`,
      tileSources: imageSources,
      showSequenceControl: true,
      showReferenceStrip: false,
      gestureSettingsMouse: {clickToZoom: false},
      maxZoomLevel: 15,
      minZoomLevel: 1, // 최소 확대 레벨 설정
      zoomPerClick: 1.2, // 클릭 확대 비율 설정
      zoomPerScroll: 1.2, // 스크롤 확대 비율 설정
      viewportMargins: {top: 0, left: 0, bottom: 0, right: 0}, // 뷰포트 여백 설정
      visibilityRatio: 1.0 // 이미지를 뷰포트에 맞추기 위한 비율 설정
    });

    canvasOverlay.value = document.createElement('canvas');
    canvasOverlay.value.id = 'myCanvas';
    viewer.value.addOverlay({
      element: canvasOverlay.value,
      location: new OpenSeadragon.Rect(0, 0, 1, 1),
    });

    viewer.value.addHandler('open', async (event: any) => {

      const fullPageButton = viewer.value.buttonGroup.buttons.find((button: any) => button.tooltip === 'Toggle full page');
      if (fullPageButton) {
        fullPageButton.element.addEventListener('click', async () => {
          if (viewer.value.isFullPage()) {
            await document.exitFullscreen();
            viewer.value.setFullPage(false);
          } else {
            viewer.value.setFullPage(true);
          }
        });
      }

      await store.dispatch('commonModule/setCommonInfo', { currentImageName: event.source.imageName });
      selectedImageName.value = event.source.url;
      canvasOverlay.value.width = event.source.width;
      canvasOverlay.value.height = event.source.height;
    });

    viewer.value.addHandler('page', async (event: any) => {
      selectedImageName.value = event.eventSource.tileSources[event.page].url;
      await store.dispatch('commonModule/setCommonInfo', { currentImageIndex: event.page });
      await store.dispatch('commonModule/setCommonInfo', { currentImageName: event.eventSource.tileSources[event.page].imageName });

      if (canvasOverlay.value) {
        canvasOverlay.value.width = viewer.value.viewport.getContainerSize().x;
        canvasOverlay.value.height = viewer.value.viewport.getContainerSize().y;
        viewer.value.updateOverlay(canvasOverlay.value);
      }
    });

    viewer.value.addHandler('resize', (event: any) => {
      if (canvasOverlay.value) {
        canvasOverlay.value.width = event.newContainerSize.x;
        canvasOverlay.value.height = event.newContainerSize.y;
        viewer.value.updateOverlay(canvasOverlay.value);
      }
    })

    viewer.value.addHandler('zoom', function (event) {
      if (canvasOverlay.value) {
        const viewportZoom = viewer.value.viewport.getZoom();
        const image = viewer.value.world.getItemAt(0);
        canvasOverlay.value.width = image.getContentSize().x * viewportZoom;
        canvasOverlay.value.height = image.getContentSize().y * viewportZoom;
        viewer.value.updateOverlay(canvasOverlay.value);
      }
    });

    viewer.value.addHandler('full-page', async (event: any) => {
      if (!event.fullPage) {
        viewer.value.element.style.backgroundColor = '';
        await document.documentElement.requestFullscreen();
      } else {
        viewer.value.element.style.backgroundColor = 'black';
      }
    })


  } catch (err) {
    console.error('Error:', err);
  }
}

const fetchImageWidthHeightData = async (fetchingImageName: string): Promise<{ width: number, height: number }> => {
  const imageDriveRootPath = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : iaRootPath.value;
  const folderName = currentPowerType.value === 'LP' ? FOLDER_NAME.LOW_POWER : FOLDER_NAME.HIGH_POWER;
  const imageName = fetchingImageName.split('.')[0];
  const originJsonUrl = `${imageDriveRootPath}/${selectItems.value?.slotId}/${folderName}/${imageName}.json`;
  const result = await readJsonFile({ fullPath: originJsonUrl });
  const { orgHeight, orgWidth } = result.data;
  return { width: orgWidth, height: orgHeight };
}

const fetchImageJsonData = async (curImageName: string) => {
  const imageDriveRootPath = selectItems.value?.img_drive_root_path !== '' && selectItems.value?.img_drive_root_path ? selectItems.value?.img_drive_root_path : iaRootPath.value;
  const folderName = currentPowerType.value === 'LP' ? FOLDER_NAME.LOW_POWER : FOLDER_NAME.HIGH_POWER;
  const imageName = curImageName.split('.')[0];
  const originJsonUrl = `${imageDriveRootPath}/${selectItems.value?.slotId}/${folderName}/${imageName}.json`;
  const result = await readJsonFile({ fullPath: originJsonUrl });
  classInfoPositionArr.value = result.data.classList;
}

const removeClassPosCanvas = () => {
  const canvas = canvasOverlay.value;
  if (!canvas) {
    console.log('Canvas element를 찾을 수 없습니다.');
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.log('2D context를 가져올 수 없습니다.');
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  drawPath.value = [];
  return ctx;
}

const drawClassPosCanvas = (classInfoArr: any) => {
  if (!canvasOverlay.value) {
    console.error('Canvas 요소가 존재하지 않습니다.');
    return;
  }

  const ctx = canvasOverlay.value.getContext('2d');
  if (!ctx) {
    console.error('Canvas의 2D 컨텍스트를 가져오지 못했습니다.');
    return;
  }

  const COLORS = {
    [MO_CATEGORY_CLASS_ID.WBC]: 'red',
    [MO_CATEGORY_CLASS_ID.GNC]: 'orange',
    [MO_CATEGORY_CLASS_ID.GNB]: 'navy',
    [MO_CATEGORY_CLASS_ID.GPC]: 'purple',
    [MO_CATEGORY_CLASS_ID.GPB]: '#1E90FF',
    [MO_CATEGORY_CLASS_ID.YEAST]: '#FF6347',
  }

  for (const className of classInfoArr) {

    for (const classPosItem of classInfoPositionArr.value) {
      if (MO_CATEGORY_CLASS_ID[className] === classPosItem.classId) {
        ctx.strokeStyle = COLORS[className] || 'black';
        ctx.lineWidth = 2;
        for (const detailPosItem of classPosItem.pos) {
          const drawObj = {
            classId: MO_CATEGORY_CLASS_ID[className],
            className: className,
            posX: Number(detailPosItem.x1),
            posY: Number(detailPosItem.y1),
            width: Number(detailPosItem.x2) - Number(detailPosItem.x1),
            height: Number(detailPosItem.y2) - Number(detailPosItem.y1)
          }

          // 이미지 좌표를 뷰포트 좌표로 변환
          const viewportRect = viewer.value.viewport.imageToViewportRectangle(
              drawObj.posX,
              drawObj.posY,
              drawObj.width,
              drawObj.height
          );

          // 뷰포트 좌표를 화면 좌표로 변환
          const screenRect = viewer.value.viewport.viewportToViewerElementRectangle(viewportRect);

          ctx.strokeRect(screenRect.x, screenRect.y, screenRect.width, screenRect.height);
          drawPath.value.push(drawObj);
        }
      }
    }
  }
}

const fetchImage = async (folderPath: string): Promise<ImageSourceType[]> => {
  const url = `${apiBaseUrl}/folders?folderPath=${folderPath}`;
  const response = await fetch(url);
  if (response.statusText === 'Not Found') {
    console.log('response', response);
  }

  const imageNames = await response.json()
  const imageSources = [];

  await store.dispatch('commonModule/setCommonInfo', { currentImageName: filterImageFiles(imageNames)[0] });

  for (const imageName of filterImageFiles(imageNames)) {
    const { width, height } = await fetchImageWidthHeightData(imageName);

    const imageSource = {
      type: 'image',
      buildPyramid: false,
      width: width,
      height: height,
      url: `${url}\\${imageName}`,
      imageName: imageName
    }
    imageSources.push(imageSource);
  }

  return imageSources;
}

const goToSelectImage = async (imageIndex: number) => {
  viewer.value.goToPage(imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_ERROR;
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};

</script>