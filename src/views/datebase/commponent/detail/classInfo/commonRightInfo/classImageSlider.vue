<template>
  <div v-if="allImages.length > 0" class="classImageSliderContainer">
    <img
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

import {onMounted, ref, defineEmits, defineProps, watch} from "vue";
import { useStore } from "vuex";

const store = useStore();
const hiddenImages = ref<{ [key: string]: boolean }>({});
const selectedImage = ref('');
const emits = defineEmits();
const props = defineProps(['allImages', 'viewer']);
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const apiBaseUrl = window.MAIN_API_IP;

const selectImage = (imageFileName: string, imageIndex: number) => {
  props.allImages.indexOf()
  props.viewer.goToPage(imageIndex);
    emits('selectImage', imageFileName);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

</script>