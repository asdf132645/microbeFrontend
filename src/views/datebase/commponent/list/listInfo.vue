<!-- ListInfo.vue -->
<template>
  <div class="list-info-container">
    <div v-if="!isObjectEmpty(selectedItem)" class="mt12 ">
      <h3 class="orderTitle hh3title">Order Information</h3>
      <div class="orderListWrapper">
        <ul class="orderListUi">
          <li class="flex-justify-start mt12">
            <span class="w100">Slot ID</span>
            <span>{{ selectedItem?.slotId }}</span>
          </li>
          <li class="flex-justify-start">
            <span class="w100">Cassette ID</span>
            <span v-if="selectedItem?.cassetId">{{ selectedItem?.cassetId.split('_')[0] }}</span>
          </li>
          <li v-if="selectedItem?.patientId" class="flex-justify-start">
            <span class="w100">Patient ID</span>
            <span>{{ selectedItem?.patientId }}</span>
          </li>
          <li v-if="selectedItem?.patientNm" class="flex-justify-start">
            <span class="w100">Patient Name</span>
            <span>{{ selectedItem?.patientNm }}</span>
          </li>
        </ul>
        <div class="orderList-image-wrapper">
          <img v-show="!barCodeImageShowError" @error="onImageError" :src="barcodeImageSrc" class="orderListBarcodeImg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, watch, computed } from 'vue';
import {barcodeImgDir} from "@/common/defines/constFile/settings/settings";
import {useStore} from "vuex";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
const store = useStore();
const props = defineProps(['selectedItem']);
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const siteCd = computed(() => store.state.commonModule.siteCd);
const barcodeImageSrc = ref('');
const barCodeImageShowError = ref(false);
const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

onMounted(async () => {
  barCodeImageShowError.value = false;

  // iaRootPath가 존재하면 getImageUrl 함수 호출
  if (iaRootPath.value) setBarcodeImage();
});

watch(() => props.selectedItem, () => {
  barCodeImageShowError.value = false;
  if (iaRootPath.value) setBarcodeImage();
});

const setBarcodeImage = () => {
  if (isObjectEmpty(props.selectedItem)) return;

  const path = props.selectedItem?.img_drive_root_path || iaRootPath.value;
  const imageUrl = `${apiBaseUrl}/images?folder=${path + '/' + props.selectedItem.slotId + '/' + barcodeImgDir.barcodeDirName + '/'}&imageName=barcode_image.jpg`;
  barcodeImageSrc.value = imageUrl;
  preloadImage(imageUrl);
}

const preloadImage = (url: string) => {
  const img = new Image();
  img.src = url;
}

const onImageError = () => {
  barCodeImageShowError.value = true;
}

</script>
