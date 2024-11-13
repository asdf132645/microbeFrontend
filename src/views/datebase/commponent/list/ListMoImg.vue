<template>
  <div v-show="!isObjectEmpty(selectedItem)" class="listTableImageContainer">
    <h3 class="mb10 hh3title infoImageTitle">Images</h3>
    <div v-if="allImages.length > 0" class="dbImageContainer">
      <template v-for="imageName in allImages" :key="imageName">
        <img
            class="dbRightImages slideImage"
            :src="showImage(imageName)"
            @error="hideImage(imageName, imageName)"
            v-show="!hiddenImages[`${imageName}`]"
            width="121px"
            height="121px"
        />
      </template>
    </div>
    <div v-else>No images available</div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, onMounted, ref, watch} from 'vue';
import {useStore} from "vuex";
import {filterImageFiles, isObjectEmpty} from "@/common/lib/utils/checkUtils";

const props = defineProps(['dbData', 'selectedItem']);
const store = useStore();
const iaRootPath = ref<any>(store.state.commonModule.iaRootPath);
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

const allImages = ref<any[]>([]);
const hiddenImages = ref<{ [key: string]: boolean }>({});
const selectedImage = ref('');

onMounted(() => {
  allImages.value = [];
  getImageFolder();
});

watch(() => props.selectedItem, () => {
  allImages.value = [];
  getImageFolder();
},{deep: true});

const getImageFolder = async () => {
  const { selectedItem } = props;
  if (!selectedItem?.classInfo || selectedItem?.classInfo.length === 0) {
    return '';
  }

  const slotId = selectedItem.slotId || '';
  const path = selectedItem?.img_drive_root_path !== '' && selectedItem?.img_drive_root_path ? selectedItem?.img_drive_root_path : iaRootPath.value;
  const folderPath = `${path}/${slotId}/13_LOW_Detection`;
  const result = await fetch(`${apiBaseUrl}/folders?folderPath=${folderPath}`);
  const imageNames = await result.json()
  allImages.value = filterImageFiles(imageNames);
}

const showImage = (imageName: string) => {
  const { selectedItem } = props;
  if (!selectedItem?.classInfo || selectedItem?.classInfo.length === 0) return '';

  const slotId = selectedItem.slotId || '';
  const path = selectedItem?.img_drive_root_path !== '' && selectedItem?.img_drive_root_path ? selectedItem?.img_drive_root_path : iaRootPath.value;
  const folderPath = `${path}/${slotId}/13_LOW_Detection`;
  return `${apiBaseUrl}/images/getImageRealTime?folder=${folderPath}&imageName=${imageName}`;
}

function hideImage(id: string, fileName: string) {
  hiddenImages.value[`${id}-${fileName}`] = true;
}
</script>
