<template>
  <div v-if="allImages.length > 0" class="classImageSliderContainer">
    <Splide :options="{ perPage: 10, drag: true, wheel: true, lazyLoad: 'nearby', perMove: 1, pagination: false }">
      <SplideSlide v-for="image in allImages" :key="image.url">
        <img
            style="width: 112px; cursor:pointer; margin-top: 4px;"
            :class="currentImageIndex ===  image.index? 'selected-image' : ''"
            :src="image.url"
            v-show="!hiddenImages[`${image.url}`]"
            @error="hideImage(image.url)"
            @click="selectImage(image.index, image.imageName)"
        />
      </SplideSlide>
    </Splide>
  </div>
</template>

<script setup lang="ts">
import '@splidejs/vue-splide/css';
import { ref, defineProps, computed } from "vue";
import { useStore } from "vuex";
import { Splide, SplideSlide } from '@splidejs/vue-splide';



const store = useStore();
const hiddenImages = ref<{ [key: string]: boolean }>({});
const props = defineProps(['allImages']);
const emits = defineEmits();
const currentImageIndex = computed(() => store.state.commonModule.currentImageIndex);

const selectImage = async (imageIndex: number, imageFileName: string) => {
  await store.dispatch('commonModule/setCommonInfo', { currentImageIndex: imageIndex });
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: imageFileName });
  emits('goToSelectImage', imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

</script>