<template>
  <div v-if="allImages.length > 0" class="classImageSliderContainer">
    <Swiper
        ref="imageSwiper"
        direction="horizontal"
        :slides-per-view="10"
        :space-between="10"
        navigation
        :scrollbar="{ draggable: true }"
        mousewheel
    >
      <SwiperSlide v-for="image in allImages" :key="image.url">
        <img
            style="width: 112px; cursor:pointer; margin-top: 4px;"
            :class="currentImageIndex ===  image.index? 'selected-image' : ''"
            :src="image.url"
            v-show="!hiddenImages[`${image.url}`]"
            @error="hideImage(image.url)"
            @click="selectImage(image.index, image.imageName)"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">

import { ref, defineProps, onMounted, computed } from "vue";
import { useStore } from "vuex";
import SwiperCore, { Navigation, Scrollbar, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/swiper-bundle.css';

const store = useStore();
const hiddenImages = ref<{ [key: string]: boolean }>({});
const props = defineProps(['allImages']);
const emits = defineEmits();
const iaRootPath = ref(store.state.commonModule.iaRootPath);
const currentImageIndex = computed(() => store.state.commonModule.currentImageIndex);
const apiBaseUrl = window.MAIN_API_IP;

onMounted(() => {
  SwiperCore.use([Navigation, Scrollbar, Mousewheel]);
})

const selectImage = async (imageIndex: number, imageFileName: string) => {
  await store.dispatch('commonModule/setCommonInfo', { currentImageIndex: imageIndex });
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: imageFileName });
  emits('goToSelectImage', imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

</script>