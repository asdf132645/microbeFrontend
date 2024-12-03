<template>
  <div class="mo-right-detail-container rbc-container imgList container-shadow borderRadiusRound">

    <div class="flex-column-justify-center">
      <div class="flex-justify-around mt12">
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

        <ClassDetailInfo :selectItems="selectItems" @checkedClassSet="checkedClassSetFunc" />
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
import {computed, defineEmits, nextTick, onMounted, ref, watch} from 'vue';
import { useStore } from "vuex";
import { LocationQueryValue, useRoute } from "vue-router";
import Alert from "@/components/commonUi/Alert.vue";
import ClassDetailInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classDetailInfo.vue";
import {FOLDER_NAME, MO_CATEGORY_CLASS_ID, POWER_MODE} from "@/common/defines/constFile/dataBase";
import { MESSAGES } from "@/common/defines/constFile/constantMessageText";
import { filterAvailableImageItems } from "@/common/lib/utils/checkUtils";
import ClassInfoImageSlider
  from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classInfoImageSlider.vue";
import { readDziFile, readJsonFile } from "@/common/api/service/fileReader/fileReaderApi";
import {detailRunningApi, updateRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {openseadragonPrefixUrl} from "@/common/lib/utils/assetUtils";


const store = useStore();
const route = useRoute();
const props = defineProps(['selectItems']);
const emits = defineEmits();
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const canvasOverlay = ref<HTMLCanvasElement | null>(null);
let viewer: any = ref<any>(null);
const tilingViewerLayer = ref(null);
const tileExist = ref(true);
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);
const userModuleDataGet = computed(() => store.state.userModule);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const refreshClass = computed(() => store.state.commonModule.refreshClass);
const allImages = ref<any>([]);
const hiddenImages = ref<{ [key: string]: boolean }>({});
const checkedClassIdArr = ref<string[]>([]);
const classInfoPositionArr = ref<any>([]);
const drawPath = ref<any>([]);
const powerModeToIdMap = {
  [POWER_MODE.LOW_POWER]: '0',
  [POWER_MODE.HIGH_POWER]: '1',
};

const checkAndInitialize = async () => {
  const tilingViewerLayer = document.getElementById('tiling-viewer_img_list');
  if (tilingViewerLayer) {
    tilingViewerLayer.innerHTML = '';
    if (viewer.value) viewer.value.destroy();
    await initElement();
  }
  await fetchImageJsonData(currentImageName.value);
};

watch(() => currentPowerType.value, async (newValue, oldValue) => {
  if (newValue === oldValue || refreshClass.value) return;
  await nextTick();
  await checkAndInitialize();
});

watch(() => props.selectItems, async (newValue, oldValue) => {
  if (newValue === oldValue || refreshClass.value) return;
  await nextTick();
  await checkAndInitialize();
});

watch(() => refreshClass.value, async () => {
  if (!refreshClass.value) {
    await checkAndInitialize();
  }
})

watch(() => currentImageName.value, async (curImgName) => {
  await fetchImageJsonData(curImgName);

  const result: any = await detailRunningApi(props.selectItems.id)
  const getSelectItems = result.data;
  if (currentPowerType.value in powerModeToIdMap) {
    const updatedClassInfo = getSelectItems.classInfo.map((item: any) => {
      return item.name === currentImageName.value && item.id === powerModeToIdMap[currentPowerType.value]
          ? { ...item, isWatched: true }
          : item;
    });

    const updatedSelectItems = {
      ...getSelectItems,
      classInfo: updatedClassInfo,
    }

    await updateRunningInfo(updatedSelectItems);
  }
})

const initElement = async () => {
  const rootPath = props.selectItems?.img_drive_root_path !== '' && props.selectItems?.img_drive_root_path ? props.selectItems?.img_drive_root_path : iaRootPath.value;
  const powerFolderName = currentPowerType.value === POWER_MODE.HIGH_POWER ? FOLDER_NAME.HIGH_POWER : FOLDER_NAME.LOW_POWER;
  const folderPath = `${rootPath}/${props.selectItems?.slotId}/${powerFolderName}`;
  const tilesInfo = await fetchTileImagesInfo(folderPath);

  if (!tilesInfo || tilesInfo.length === 0) return;

  try {
    viewer.value = OpenSeadragon({
      id: "tiling-viewer_img_list",
      animationTime: 0.4,
      showNavigator: false,
      sequenceMode: true,
      defaultZoomLevel: 1,
      prefixUrl: openseadragonPrefixUrl(apiBaseUrl),
      tileSources: tilesInfo,
      showSequenceControl: true,
      showReferenceStrip: false,
      showHomeControl: false,
      gestureSettingsMouse: {clickToZoom: false},
      maxZoomLevel: 15,
      minZoomLevel: 1, // 최소 확대 레벨 설정
      zoomPerClick: 1.2, // 클릭 확대 비율 설정
      zoomPerScroll: 1.2, // 스크롤 확대 비율 설정
      viewportMargins: {top: 0, left: 0, bottom: 0, right: 0}, // 뷰포트 여백 설정
      visibilityRatio: 1.0 // 이미지를 뷰포트에 맞추기 위한 비율 설정
    });

    // 캔버스 오버레이 생성 및 추가
    const canvas = document.createElement('canvas');
    const overlay = viewer.value.addOverlay({
      element: canvas,
      location: new OpenSeadragon.Rect(0, 0, 1, 1), // 캔버스가 뷰어 전체를 덮도록 설정
    });
    canvas.id = 'myCanvas';
    canvasOverlay.value = canvas;

    viewer.value.addHandler('open', async (event: any) => {
      await store.dispatch('commonModule/setCommonInfo', { currentImageName: event.source.Image.imageName });
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

      // 캔버스 크기를 조정
      canvas.width = event.source.Image.Size.Width;
      canvas.height = event.source.Image.Size.Height;
    });

    viewer.value.addHandler('full-page', async (event: any) => {
      if (!event.fullPage) {
        viewer.value.element.style.backgroundColor = '';
        await document.documentElement.requestFullscreen();
      } else {
        viewer.value.element.style.backgroundColor = 'black';
      }
    })

    viewer.value.addHandler('page', async (event: any) => {
      await store.dispatch('commonModule/setCommonInfo', { currentImageName: event.eventSource.tileSources[event.page].Image.imageName });

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

const fetchImageJsonData = async (curImageName: string) => {
  if (!curImageName) return;

  const imageDriveRootPath = props.selectItems?.img_drive_root_path !== '' && props.selectItems?.img_drive_root_path ? props.selectItems?.img_drive_root_path : iaRootPath.value;
  const folderName = currentPowerType.value === 'LP' ? FOLDER_NAME.LOW_POWER : FOLDER_NAME.HIGH_POWER;
  const imageName = curImageName.split('.')[0];
  const originJsonUrl = `${imageDriveRootPath}/${props.selectItems?.slotId}/${folderName}/${imageName}.json`;
  try {
    const result = await readJsonFile({ fullPath: originJsonUrl });
    classInfoPositionArr.value = result.data.classList;
  } catch (error) {
    console.error(error);
    classInfoPositionArr.value = [];
  }
}

const checkedClassSetFunc = (checkedClassSet: Set<string>) => {
  checkedClassIdArr.value = [...checkedClassSet];
  const ctx = removeClassPosCanvas()
  if (checkedClassIdArr.value.length === 0 && ctx) ctx.globalCompositeOperation = 'destination-out'; // 기존 색상을 지우는 모드로 설정
  drawClassPosCanvas(checkedClassIdArr.value);
}

const removeClassPosCanvas = () => {
  const canvas = canvasOverlay.value;
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  drawPath.value = [];
  return ctx;
}

const drawClassPosCanvas = (classInfoArr: any) => {
  const ctx = removeClassPosCanvas();
  if (!ctx) return;

  const COLORS = {
    [MO_CATEGORY_CLASS_ID.WBC]: 'navy',
    [MO_CATEGORY_CLASS_ID.GNC]: '#00FF00',
    [MO_CATEGORY_CLASS_ID.GNB]: '#00FF00',
    [MO_CATEGORY_CLASS_ID.GPC]: '#FFA500',
    [MO_CATEGORY_CLASS_ID.GPB]: '#FFA500',
    [MO_CATEGORY_CLASS_ID.YEAST]: '#3CFFDD',
  };

  // 1. 전체 캔버스를 반투명하게 채우기
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // 검정색, 50% 투명도
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 2. 상자 결합 경로 생성
  const combinedPath = new Path2D();
  for (const classId of classInfoArr) {
    for (const classPosItem of classInfoPositionArr.value) {
      if (classId === classPosItem.classId) {
        for (const detailPosItem of classPosItem.pos) {
          const drawObj = {
            classId: classId,
            posX: Number(detailPosItem.x1),
            posY: Number(detailPosItem.y1),
            width: Number(detailPosItem.x2) - Number(detailPosItem.x1),
            height: Number(detailPosItem.y2) - Number(detailPosItem.y1),
          };

          // 모든 상자를 하나의 Path2D에 추가
          combinedPath.rect(drawObj.posX, drawObj.posY, drawObj.width, drawObj.height);
          drawPath.value.push(drawObj);
        }
      }
    }
  }

  // 3. 결합된 경로 내부 지우기
  ctx.globalCompositeOperation = 'destination-out'; // 기존 색상을 지우는 모드
  ctx.fill(combinedPath);

  // 4. 일반 모드로 복원 후 테두리 그리기
  ctx.globalCompositeOperation = 'source-over';
  for (const classId of classInfoArr) {
    for (const classPosItem of classInfoPositionArr.value) {
      if (classId === classPosItem.classId) {
        ctx.strokeStyle = COLORS[classId] || '#00BFFF';
        ctx.lineWidth = 1;
        for (const detailPosItem of classPosItem.pos) {
          const drawObj = {
            classId: classId,
            posX: Number(detailPosItem.x1),
            posY: Number(detailPosItem.y1),
            width: Number(detailPosItem.x2) - Number(detailPosItem.x1),
            height: Number(detailPosItem.y2) - Number(detailPosItem.y1),
          };

          // 상자 테두리 그리기
          ctx.strokeRect(drawObj.posX, drawObj.posY, drawObj.width, drawObj.height);
        }
      }
    }
  }
};

const dziWidthHeight = async (imageFileName: string): Promise<any> => {
  const path = props.selectItems?.img_drive_root_path !== '' && props.selectItems?.img_drive_root_path ? props.selectItems?.img_drive_root_path : iaRootPath.value;
  const powerFolderName = currentPowerType.value === POWER_MODE.HIGH_POWER ? FOLDER_NAME.HIGH_POWER : FOLDER_NAME.LOW_POWER;
  const dziUrl = `${path}/${props.selectItems.slotId}/${powerFolderName}/${imageFileName}.dzi`;
  const imageResponse = await readDziFile({ filePath: dziUrl });
  return await extractWidthHeightFromDzi(`${imageFileName}.jpg`, imageResponse);
}

const extractWidthHeightFromDzi = (fileName: string, xmlString: any): any => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const sizeElement = xmlDoc.getElementsByTagName("Size")[0];
  const tileSizeEl = xmlDoc.getElementsByTagName('Image')[0];
  const tileSize = tileSizeEl.getAttribute("TileSize");
  const width = sizeElement.getAttribute("Width");
  const height = sizeElement.getAttribute("Height");
  return {fileName, width: Number(width), height: Number(height), tileSize: Number(tileSize)}
}

const extractSubStringBeforeFiles = (str: string) => {
  const searchString = '_files';
  const endIndex = str.indexOf(searchString);

  if (endIndex !== -1) {
    return str.substring(0, endIndex);
  }

  return str;
}

const fetchTileImagesInfo = async (folderPath: string) => {
  const url = `${apiBaseUrl}/folders?folderPath=${folderPath}`;
  const response = await fetch(url);
  if (!response.ok) return;

  const fileNames = await response.json();
  const availableFileNames = filterAvailableImageItems(fileNames) as string[];

  const sortedFileNames = availableFileNames.reduce((acc: { files: string[], jpg: string[] }, fileName: string) => {
    if (fileName.endsWith('_files')) acc.files.push(fileName);
    else if (fileName.endsWith('.jpg')) acc.jpg.push(fileName);
    return acc;
  }, { files: [], jpg: [] });

  sortedFileNames.files.sort((a: string, b: string) => Number(a.split('_')[0]) - Number(b.split('_')[0]));
  sortedFileNames.jpg.sort((a: string, b: string) => Number(a.split('.')[0]) - Number(b.split('.')[0]));
  const { files: fileNamesEndsWithFiles, jpg: fileNamesEndsWithJpg } = sortedFileNames;

  allImages.value = fileNamesEndsWithJpg
      .map((imageSource, index) => ({
        url: `${url}\\${imageSource}`,
        imageName: imageSource,
        index,
      }))

  if (currentPowerType.value in powerModeToIdMap) {
    const targetId = powerModeToIdMap[currentPowerType.value];
    allImages.value = allImages.value.map((item: { url: string; imageName: string; index: number }) => {
      const matchedClassInfo = props.selectItems.classInfo.find(
          (classInfoItem: any) => classInfoItem.id === targetId && classInfoItem.name === item.imageName
      );
      return { ...item, isWatched: matchedClassInfo?.isWatched ?? false };
    });
  }

  const tilesInfo = await Promise.all(
      fileNamesEndsWithFiles
          .map(async (fileName: string) => {
            const fileNameResult = extractSubStringBeforeFiles(fileName);
            const { width, height, tileSize, fileName: imageFileName } = await dziWidthHeight(fileNameResult);

            return {
              Image: {
                xmlns: "http://schemas.microsoft.com/deepzoom/2009",
                Url: `${apiBaseUrl}/folders?folderPath=${folderPath}/${fileName}/`,
                Format: "jpg",
                Overlap: "1",
                TileSize: tileSize,
                imageName: imageFileName,
                Size: {
                  Width: width,
                  Height: height
                }
              }
            }
          })
  )

  return tilesInfo;
}

const goToSelectImage = async (imageIndex: number) => {
  viewer.value.goToPage(imageIndex);
}

const updateRunningInfo = async (updatedRuningInfoObj: any) => {
  try {
    const day = sessionStorage.getItem('lastSearchParams') || localStorage.getItem('lastSearchParams') || '';
    const {startDate, endDate, page, searchText, testType } = JSON.parse(day);
    const dayQuery = startDate + endDate + page + searchText + testType;
    const response = await updateRunningApi({
      userId: Number(userModuleDataGet.value.id),
      runingInfoDtoItems: [updatedRuningInfoObj],
      dayQuery: dayQuery,
    })
    if (!response) console.error('백엔드가 디비에 저장 실패함');
  } catch (error) {
    console.error('Error:', error);
  }
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