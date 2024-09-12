<template>
  <div class="rbc-container imgList">
<!--    <div class="btn-container_img_list">-->
<!--      <div class='btn-imgsetbox_img_list' ref="imgSetWrap">-->
<!--        <button class="darkButton" @click="imgSetOpen">IMG Setting</button>-->
<!--        <div class="imgSet_img_list" v-show="imgSet_img_list">-->
<!--          <div>-->
<!--            <font-awesome-icon :icon="['fas', 'sun']"/>-->
<!--            <span>Brightness {{ imgBrightness }}</span>-->
<!--            <input-->
<!--                type="range"-->
<!--                min="50"-->
<!--                max="120"-->
<!--                v-model="imgBrightness"-->
<!--                @input="changeImgBrightness"-->
<!--            />-->
<!--            <button class="resetBtn" @click="brightnessReset">Brightness Reset</button>-->
<!--          </div>-->
<!--          <div>-->
<!--            <font-awesome-icon :icon="['fas', 'palette']"/>-->
<!--            <span>RGB [ {{ `${imageRgb[0]} , ${imageRgb[1]}, ${imageRgb[2]}` }} ]</span>-->
<!--            <div class="alignItemsCenter">-->
<!--              <label>R</label>-->
<!--              <input-->
<!--                  type="range"-->
<!--                  min="0"-->
<!--                  max="255"-->
<!--                  v-model="imageRgb[0]"-->
<!--                  @input="changeImageRgb"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="alignItemsCenter">-->
<!--              <label>G</label>-->
<!--              <input-->
<!--                  type="range"-->
<!--                  min="0"-->
<!--                  max="255"-->
<!--                  v-model="imageRgb[1]"-->
<!--                  @input="changeImageRgb"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="alignItemsCenter">-->
<!--              <label>B</label>-->
<!--              <input-->
<!--                  type="range"-->
<!--                  min="0"-->
<!--                  max="255"-->
<!--                  v-model="imageRgb[2]"-->
<!--                  @input="changeImageRgb"-->
<!--              />-->
<!--            </div>-->
<!--            <button class="resetBtn" @click="rgbReset">RGB Reset</button>-->
<!--          </div>-->
<!--          <div>-->
<!--            <font-awesome-icon :icon="['fas', 'th']"/>-->
<!--            <span>Grid</span>-->
<!--            <font-awesome-icon-->
<!--                :icon="isGrid ? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"-->
<!--                @click="onClickGrid"-->
<!--            />-->
<!--          </div>-->
<!--          &lt;!&ndash; <div>-->
<!--            <font-awesome-icon :icon="['fas', 'crop']"/>-->
<!--            <span>Crop</span>-->
<!--            <font-awesome-icon-->
<!--              :icon="isCrop? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"-->
<!--              @click="onClickCrop"-->
<!--            />-->
<!--          </div> &ndash;&gt;-->
<!--          <div>-->
<!--            <font-awesome-icon :icon="['fas', 'ruler']"/>-->
<!--            <span>Ruler</span>-->
<!--            <div class="ruler_box_img_list">-->
<!--              <button-->
<!--                  class="tab-ruler-btn_img_list"-->
<!--                  @click="onClickRuler(ruler)"-->
<!--                  v-for="ruler in rulers"-->
<!--                  :key="ruler.id"-->
<!--                  :class="{ 'active': activeRuler === ruler.text, 'inactive': activeRuler !== ruler.text}"-->
<!--              >{{ ruler.text }}-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div>-->
<!--            <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>-->
<!--            <span>Zoom</span>-->
<!--            <font-awesome-icon-->
<!--                :icon="isMagnifyingGlass ? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"-->
<!--                @click="onClickZoom"-->
<!--            />-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div style="display: flex; justify-content: center; flex-direction: column;">
      <div style="display: flex;">
        <div style="width: 750px; height: 750px;">
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

        <ClassImageInfo />
      </div>


      <ClassImageSlider @selectImage="selectImage" :allImages="allImages" :viewer="viewer" />
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
import {computed, defineEmits, defineProps, nextTick, onMounted, ref, watch } from 'vue';
import OpenSeadragon from 'openseadragon';
import {rulers} from '@/common/defines/constFile/rbc';
import {useStore} from "vuex";
import Alert from "@/components/commonUi/Alert.vue";
import ClassImageInfo from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classDetailInfo.vue";
import ClassImageSlider from "@/views/datebase/commponent/detail/classInfo/commonRightInfo/classImageSlider.vue";
import {dirName} from "@/common/defines/constFile/settings";

interface ImageSourceType {
  type: string;
  buildPyramid: boolean;
  width: number;
  height: number;
  url: string;
}

const emits = defineEmits();
const props = defineProps(['selectItems']);
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');

const canvasOverlay = ref<any>(null);
let viewer: any = ref<any>(null);
const imgSet_img_list = ref(false);
const imgBrightness = ref(100);
const imageRgb = ref([0, 0, 0]);
const isGrid = ref(false);
const isMagnifyingGlass = ref(false);
const ruler = ref(null);
const activeRuler = ref('None');
const rulerPos = ref({
  prevPosX: 0,
  prevPosY: 0,
  posX: 0,
  posY: 0,
  left: 0,
  top: 0,
  width: 50,
  height: 50
});
const rulerSize = ref(5);
const rulerWidth = ref(0);
const viewBoxWH = ref(150);
const tilingViewerLayer = ref(null);
const tileExist = ref(true);
const selectItems = ref<any>({});

const store = useStore();
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const allImages = ref<any>([]);
const selectedImageName = ref('');

onMounted(async () => {
  await initElement();
})

watch(() => props.selectItems, (newSelectItems) => {
  selectItems.value = newSelectItems;
  console.log('제발', selectItems.value);
})

const initElement = async () => {

  const path = `D:\\MO_IMAGE_TEST\\1`;
  const imageSources = await fetchImage(path);
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
      // 캔버스 크기를 조정
      canvas.width = event.source.width;
      canvas.height = event.source.height;
    });

    viewer.value.addHandler('page', function (event: any) {
      // 페이지가 변경될 때 오버레이를 다시 추가
      if (canvas.parentElement !== viewer.value.container) {
        viewer.value.addOverlay({
          element: canvas,
          location: new OpenSeadragon.Rect(0, 0, 1, 1),
        });
      }
      emits('unChecked');
    });

    viewer.value.addHandler('zoom', () => {
      if (activeRuler.value === 'None') {
        return;
      }
      drawRuler(activeRuler.value);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

const fetchImage = async (folderPath: string): Promise<ImageSourceType[]> => {
  const url = `${apiBaseUrl}/folders?folderPath=${folderPath}`;
  const response = await fetch(url);
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

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = 'error';
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};

// Img setting
const imgSetOpen = () => {
  imgSet_img_list.value = !imgSet_img_list.value;
}


// Brightness
const changeImgBrightness = (event: any) => {
  const brightness = event?.target?.value;

  const red = imageRgb.value[0];
  const green = imageRgb.value[1];
  const blue = imageRgb.value[2];

  const imageContainer = document.getElementById('tiling-viewer_img_list');
  if (imageContainer) {
    imageContainer.style.filter = `opacity(1) drop-shadow(0 0 0 rgb(${red}, ${green}, ${blue})) brightness(${brightness}%)`;
  }
};


// RGB
const changeImageRgb = () => {
  const red = imageRgb.value[0];
  const green = imageRgb.value[1];
  const blue = imageRgb.value[2];
  const brightness = imgBrightness.value;

  const imageContainer = document.getElementById('tiling-viewer_img_list');

  if (imageContainer) {
    imageContainer.style.filter = `opacity(0.9) drop-shadow(0 0 0 rgb(${red}, ${green}, ${blue})) brightness(${brightness}%)`;
  }

}

const rgbReset = () => {
  const brightness = imgBrightness.value;
  imageRgb.value = [0, 0, 0];

  const imageContainer = document.getElementById('tiling-viewer_img_list');
  if (imageContainer) {
    imageContainer.style.filter = `opacity(1) drop-shadow(0 0 0 rgb(0,0,0)) brightness(${brightness}%)`;
  }
};

const brightnessReset = () => {
  imgBrightness.value = 100;
  changeImageRgb();
}


// Grid
const onClickGrid = () => {
  isGrid.value = !isGrid.value;
  viewer.value.addHandler('zoom', drawLines);
  if (isGrid.value) {
    drawLines();
  } else {
    removeGridLines();
  }
}

const drawLines = () => {
  removeGridLines();
  if (isGrid.value) {
    const imageHeight = viewer.value.world.getItemAt(0).getContentSize().y;
    const imageWidth = viewer.value.world.getItemAt(0).getContentSize().x;
    const zoom = viewer.value.viewport.getZoom();

    const maxNumberOfLines = 400;
    const numberOfLines = Math.round(maxNumberOfLines / zoom);

    const minGap = Math.min(imageWidth, imageHeight) / numberOfLines;

    for (let i = 1; i < numberOfLines; i++) {
      const linePosition = i * minGap;

      drawLine(linePosition, 0, 1, imageHeight, 'rgba(128, 128, 128, 0.2)'); // 세로선
      drawLine(0, linePosition, imageWidth, 1, 'rgba(128, 128, 128, 0.2)'); // 가로선
    }
  }
};

const drawLine = (x: number, y: number, width: number, height: number, color: string) => {
  const lineElement = document.createElement('div');
  lineElement.className = 'grid-line';
  lineElement.style.position = 'absolute';
  lineElement.style.left = `${x}px`;
  lineElement.style.top = `${y}px`;
  lineElement.style.width = `${width}px`;
  lineElement.style.height = `${height}px`;
  lineElement.style.background = color;
  lineElement.style.userSelect = 'none';
  lineElement.style.pointerEvents = 'none';
  viewer.value.container.appendChild(lineElement);
};

const removeGridLines = () => {
  const gridLines = document.querySelectorAll('.grid-line');
  gridLines.forEach(line => line.remove());
};


// Ruler
const onClickRuler = (ruler: any) => {
  switch (ruler.text) {
    case 'None':
      activeRuler.value = 'None';
      break;
    case 'Line':
      activeRuler.value = 'Line';
      break;
    case 'Cross':
      activeRuler.value = 'Cross';
      break;
    case 'Circle':
      activeRuler.value = 'Circle';
      break;
  }
  drawRuler(ruler);
}

const drawRuler = (ruler: any) => {
  const divtilingViewer = document.getElementById('tiling-viewer_img_list');

  if (divtilingViewer instanceof HTMLElement) {
    const rulerOverlay = document.getElementById('rulerOverlay');
    if (rulerOverlay instanceof HTMLElement) {
      divtilingViewer.removeChild(rulerOverlay);
    }

    const element = document.createElement('div');
    element.id = 'rulerOverlay';
    element.style.position = 'absolute';
    element.style.width = rulerPos.value.width + 'px';
    element.style.height = rulerPos.value.height + 'px';
    element.style.zIndex = '9999999';

    // Zoom level calculation
    const zoom = viewer.value.viewport.getZoom(true);

    if (rulerPos.value.left === 0) {
      element.style.left = (viewer.value.container.clientWidth / 2) - (rulerPos.value.width / 2) + 'px';
    } else {
      element.style.left = (rulerPos.value.left / zoom) + 'px';
    }
    if (rulerPos.value.top === 0) {
      element.style.top = (viewer.value.container.clientHeight / 2) - (rulerPos.value.height / 2) + 'px';
    } else {
      element.style.top = (rulerPos.value.top / zoom) + 'px';
    }

    refreshRuler(element, rulerSize, ruler);
    divtilingViewer.appendChild(element);

    let isPress = false;

    element.onmousedown = function (e) {
      rulerPos.value.prevPosX = e.clientX;
      rulerPos.value.prevPosY = e.clientY;

      if (rulerPos.value.left <= 30) {
        rulerPos.value.left = 31;
      }

      if (rulerPos.value.top <= 80) {
        rulerPos.value.top = 81;
      }

      isPress = true;
    };

    element.onmouseup = function () {
      isPress = false;
    };

    element.onwheel = function (e) {
      if (e.deltaY < 0) {
        if (rulerSize.value < 20) {
          refreshRuler(element, ++rulerSize.value, ruler);
        }
      } else {
        if (rulerSize.value > 5) {
          refreshRuler(element, --rulerSize.value, ruler);
        }
      }
    };

    const parent = document.getElementById('tilingViewer');

    if (parent instanceof HTMLElement) {
      parent.onmousemove = function (e) {
        if (!isPress) {
          return;
        }

        if (rulerPos.value.left <= 30 || rulerPos.value.top <= 80) {
          return;
        }

        rulerPos.value.posX = rulerPos.value.prevPosX - e.clientX;
        rulerPos.value.posY = rulerPos.value.prevPosY - e.clientY;

        rulerPos.value.prevPosX = e.clientX;
        rulerPos.value.prevPosY = e.clientY;

        element.style.left = (element.offsetLeft - rulerPos.value.posX) + 'px';
        element.style.top = (element.offsetTop - rulerPos.value.posY) + 'px';

        rulerPos.value.left = element.offsetLeft;
        rulerPos.value.top = element.offsetTop;
      };
    }
  }
};


const refreshRuler = (element: any, rulerSize: any, ruler: any) => {
  if (typeof rulerSize === 'object') {
    rulerSize = rulerSize.value;
  }
  if (document.getElementById('rulerTitle') !== null) {
    element.removeChild(document.getElementById('rulerTitle'))
  }

  let rSize = 1
  if (rulerSize > 5) {
    rSize = rSize + (0.06 * (rulerSize - 5))
  }

  let zoomRatio = viewer.value.viewport.viewportToImageZoom(viewer.value.viewport.getZoom())

  if (zoomRatio > 1) {
    zoomRatio = zoomRatio * 1.02
  } else if (zoomRatio > 0.9 && zoomRatio < 1) {
    zoomRatio = zoomRatio * 1.12
  } else if (zoomRatio > 0.7 && zoomRatio <= 0.9) {
    zoomRatio = zoomRatio * 1.22
  } else if (zoomRatio > 0.6 && zoomRatio <= 0.7) {
    zoomRatio = zoomRatio * 1.32
  } else if (zoomRatio > 0.5 && zoomRatio <= 0.6) {
    zoomRatio = zoomRatio * 1.42
  } else if (zoomRatio > 0.4 && zoomRatio <= 0.5) {
    zoomRatio = zoomRatio * 1.52
  } else if (zoomRatio > 0.3 && zoomRatio <= 0.4) {
    zoomRatio = zoomRatio * 1.72
  } else if (zoomRatio > 0.2 && zoomRatio <= 0.3) {
    zoomRatio = zoomRatio * 1.92
  }

  rulerWidth.value = 60 * (zoomRatio * rSize)

  const titleElement = document.createElement('div')
  titleElement.id = 'rulerTitle'
  titleElement.style.color = 'black'
  titleElement.style.textAlign = 'center'
  titleElement.style.fontSize = '16px'
  titleElement.style.minWidth = '50px'
  titleElement.style.width = rulerWidth.value + 'px'
  if (ruler.id === 'line' || ruler === 'Line') {
    const startX = (viewBoxWH.value / 2) - (rulerWidth.value / 2)
    const endX = (viewBoxWH.value / 2) + (rulerWidth.value / 2)
    const startY = viewBoxWH.value / 2
    const endY = startY

    titleElement.innerHTML = '<div style="width: 100%;">' + rulerSize + 'μm' + '</div>' +
        '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="' + startX + '" y1="' + startY + '" x2="' + endX + '" y2="' + endY + '" stroke="black" stroke-width="2"/>' +
        '<line x1="' + startX + '" y1="' + (startY - 5) + '" x2="' + startX + '" y2="' + (endY + 5) + '" stroke="black" stroke-width="2"/>' +
        '<line x1="' + endX + '" y1="' + (endY - 5) + '" x2="' + endX + '" y2="' + (endY + 5) + '" stroke="black" stroke-width="2"/>' +
        '</svg>'
    element.appendChild(titleElement)

  } else if (ruler.id === 'cross' || ruler === 'Cross') {
    const centerX = viewBoxWH.value / 2;
    const centerY = viewBoxWH.value / 2;
    const halfWidth = rulerWidth.value / 2;

    titleElement.innerHTML = '<div style="width: 100%;">' + rulerSize + 'μm' + '</div>' +
        '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
        '<line x1="' + (centerX - halfWidth) + '" y1="' + centerY + '" x2="' + (centerX + halfWidth) + '" y2="' + centerY + '" stroke="black" stroke-width="2"/>' +
        '<line x1="' + centerX + '" y1="' + (centerY - halfWidth) + '" x2="' + centerX + '" y2="' + (centerY + halfWidth) + '" stroke="black" stroke-width="2"/>' +
        '</svg>';

    element.appendChild(titleElement);

  } else if (ruler.id === 'circle' || ruler === 'Circle') {
    const cx = viewBoxWH.value / 2
    const cy = viewBoxWH.value / 2
    const radius = rulerWidth.value * 0.5

    titleElement.innerHTML = '<div style="width: 100%;">' + rulerSize + 'μm' + '</div>' +
        '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" stroke="black" stroke-width="2" fill="transparent" opacity="0.6" />' +
        '</svg>';

    element.appendChild(titleElement)
  } else {
    const rulerOverlay = document.getElementById('rulerOverlay')
    if (rulerOverlay !== null) {
      const divtilingViewer = document.getElementById('tilingViewer')
      divtilingViewer?.removeChild(rulerOverlay)
    }
  }
};

// Zoom
const onClickZoom = () => {
  isMagnifyingGlass.value = !isMagnifyingGlass.value;
}

const selectImage = (imageFileName: string) => {
  selectedImageName.value = imageFileName;
}

</script>

