<template>
  <div v-if="allImages.length > 0" class="classImageSliderContainer">
    <img
        :class="selectedImageFileIndex ===  image.index? 'selected-image' : ''"
        v-for="image in allImages"
        :key="image"
        :src="image.url"
        v-show="!hiddenImages[`${image.url}`]"
        @error="hideImage(image.url)"
        @click="selectImage(image.url, image.index)"
    />
  </div>
</template>

<script setup lang="ts">

import {ref, defineProps, onMounted} from "vue";
import { useStore } from "vuex";
import { register } from 'swiper/element/bundle';
import 'swiper/swiper-bundle.css';

const store = useStore();
const hiddenImages = ref<{ [key: string]: boolean }>({});
const props = defineProps(['allImages', 'viewer']);
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const apiBaseUrl = window.MAIN_API_IP;
const selectedImageFileIndex = ref(0);

onMounted(() => {
  register();
})

const selectImage = (imageFileName: string, imageIndex: number) => {
  selectedImageFileIndex.value = imageIndex;
  props.viewer.goToPage(imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

</script>