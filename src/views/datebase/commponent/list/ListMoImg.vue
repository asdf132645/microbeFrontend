<template>
  <div v-if="isImagesLoaded && !isObjectEmpty(selectedItem)" class="listTableImageContainer">
    <h3 class="infoImageTitle">Images</h3>
    <template v-if="allImages.length > 0">
      <Splide ref="splide" class="listTable-images-wrapper" :options="{ perPage: 1, drag: true, wheel: true, lazyLoad: 'nearby', perMove: 1, pagination: false }" @splide:mounted="initializedSplide">
        <SplideSlide v-for="(imageName, index) in allImages" :key="imageName" @moved="updateImageIndex">
          <img
              width="540px"
              height="540px"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :src="showImage(imageName, index)"
              v-show="!hiddenImages[`${imageName}`]"
              @error="hideImage(imageName, imageName)"
          />
        </SplideSlide>
      </Splide>
      <p class="infoImage-imageIndex-wrapper">{{ imageIndex }} / {{ allImages.length }}</p>
    </template>
    <div v-else>No images available</div>
  </div>
</template>

<script setup lang="ts">
import '@splidejs/vue-splide/css';
import {computed, defineProps, nextTick, onMounted, ref, watch} from 'vue';
import {useStore} from "vuex";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import {filterImageFiles, isObjectEmpty} from "@/common/lib/utils/checkUtils";
import {FOLDER_NAME} from "@/common/defines/constFile/dataBase";

const props = defineProps(['dbData', 'selectedItem']);
const store = useStore();
const iaRootPath = ref<any>(store.state.commonModule.iaRootPath);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;
const allImages = ref<any[]>([]);
const hiddenImages = ref<{ [key: string]: boolean }>({});
const imageIndex = ref(1);
const splide = ref();
const isImagesLoaded = ref(false);

onMounted(async () => {
  allImages.value = [];
  await getImageFolder();
  isImagesLoaded.value = true;
});

watch(() => props.selectedItem, async () => {
  allImages.value = [];
  isImagesLoaded.value = false;
  await getImageFolder();
  isImagesLoaded.value = true;
},{deep: true});

const initializedSplide = (splideInstance: any) => {
  splideInstance.on('ready', () => {
    imageIndex.value = 1;
  })
  splideInstance.on('move', (newIndex: number) => {
    imageIndex.value = newIndex + 1;
  })
}

const getImageFolder = async () => {
  const { selectedItem } = props;
  if (!selectedItem?.classInfo || selectedItem?.classInfo.length === 0) {
    return '';
  }

  const slotId = selectedItem.slotId || '';
  const path = selectedItem?.img_drive_root_path !== '' && selectedItem?.img_drive_root_path ? selectedItem?.img_drive_root_path : iaRootPath.value;
  const folderPath = `${path}/${slotId}/${FOLDER_NAME.LOW_POWER}`;
  const result = await fetch(`${apiBaseUrl}/folders?folderPath=${folderPath}`);
  const imageNames = await result.json()
  allImages.value = filterImageFiles(imageNames);
}

const showImage = (imageName: string, index: number) => {
  const { selectedItem } = props;
  if (!selectedItem?.classInfo || selectedItem?.classInfo.length === 0) return '';
  const slotId = selectedItem.slotId || '';
  const path = selectedItem?.img_drive_root_path !== '' && selectedItem?.img_drive_root_path ? selectedItem?.img_drive_root_path : iaRootPath.value;
  const folderPath = `${path}/${slotId}/${FOLDER_NAME.LOW_POWER}`;
  return `${apiBaseUrl}/images/getImageBySize?size=large&folder=${folderPath}&imageName=${imageName}`;
}

function hideImage(id: string, fileName: string) {
  hiddenImages.value[`${id}-${fileName}`] = true;
}

const updateImageIndex = (newIndex: number) => {
  imageIndex.value = newIndex;
}
</script>
