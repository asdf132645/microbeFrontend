<template>
  <div v-if="allImages.length > 0" class="classImageSliderContainer">
    <Splide :has-track="false" ref="splide" :options="{ perPage: 10, drag: true, wheel: true, lazyLoad: 'nearby', perMove: 1, pagination: false }">
      <SplideTrack>
        <SplideSlide v-for="image in allImages" :key="image.url">
          <img
              style="width: 112px; cursor:pointer; margin-top: 4px;"
              :class="currentImageName ===  image.imageName? 'selected-image' : ''"
              :src="image.url"
              v-show="!hiddenImages[`${image.url}`]"
              @error="hideImage(image.url)"
              @click="selectImage(image.index, image.imageName)"
          />
        </SplideSlide>
      </SplideTrack>

      <div class="splide__arrows splide__arrows--ltr" :style="{ display: allImages.length <= 10 ? 'none' : '' }">
      </div>
    </Splide>
  </div>
</template>

<script setup lang="ts">
import '@splidejs/vue-splide/css';
import { ref, defineProps, computed, watch } from "vue";
import {useRoute} from "vue-router";
import { useStore } from "vuex";
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';


const route = useRoute();
const store = useStore();
const hiddenImages = ref<{ [key: string]: boolean }>({});
const props = defineProps(['allImages']);
const emits = defineEmits();
const currentImageName = computed(() => store.state.commonModule.currentImageName);
const splide = ref();

watch(() => [route.params.id, route.query.pageType], () => {
  if (splide.value) splide.value.go(0);
})



const selectImage = async (imageIndex: number, imageFileName: string) => {
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: imageFileName });
  emits('goToSelectImage', imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[`${fileName}`] = true;
}

</script>