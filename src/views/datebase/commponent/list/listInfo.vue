<!-- ListInfo.vue -->
<template>
  <div v-if="!isObjectEmpty(selectedItem)">
    <div>
      <h3 class="orderTitle hh3title">Order Information</h3>
      <div class="orderListWrapper" style="padding: 0;">
        <ul class="orderListUi">
          <li class="flexColumn">
            <span class="mb10">Order ID:</span>
            <span class="mb20">{{ selectedItem?.slotId }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb10">Cassette ID:</span>
            <span class="mb20">{{ selectedItem?.cassetId.split('_')[0] }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb10">Patient ID:</span>
            <span class="mb20">{{ selectedItem?.patientId }}</span>
          </li>
          <li class="flexColumn">
            <span class="mb10">Patient Name:</span>
            <span class="mb20">{{ selectedItem?.patientNm }}</span>
          </li>
        </ul>
        <div>
          <img v-show="!barCodeImageShowError" @error="onImageError" :src="filePath"
               style="width: 200px; float:right;"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';
import {barcodeImgDir} from "@/common/defines/constFile/settings/settings";
import {useStore} from "vuex";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
const store = useStore();
const props = defineProps(['selectedItem']);
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const siteCd = computed(() => store.state.commonModule.siteCd);

const filePath = ref('');
const barCodeImageShowError = ref(false);

onMounted(async () => {
  barCodeImageShowError.value = false;
  // iaRootPath가 존재하면 getImageUrl 함수 호출
  if (iaRootPath.value) {
    filePath.value = getImageUrl('barcode_image.jpg');
  }
});

watch(() => props.selectedItem, (newSelectedItem) => {
  barCodeImageShowError.value = false;
  // setWbcTotalAndPercent();

  if (iaRootPath.value) {
    filePath.value = getImageUrl('barcode_image.jpg', newSelectedItem);
  }
});

const apiBaseUrl = sessionStorage.getItem('viewerCheck') === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

function getImageUrl(imageName) {
  const path = props.selectedItem?.img_drive_root_path !== '' && props.selectedItem?.img_drive_root_path ? props.selectedItem?.img_drive_root_path : iaRootPath.value;
  return `${apiBaseUrl}/images?folder=${path + '/' + props.selectedItem.slotId + '/' + barcodeImgDir.barcodeDirName + '/'}&imageName=${imageName}`;
}

const onImageError = () => {
  barCodeImageShowError.value = true;
}

</script>
