<template>
  <div class="classImageSlider-hover-container"></div>
  <div v-if="localAllImages.length > 0" class="classImageSliderContainer container-shadow">
    <div class="classImageSliderContainer-top-wrapper">
      <font-awesome-icon :icon="['fas', 'caret-up']" style="color: black;" />
    </div>
    <Splide :has-track="false" ref="splide" :options="{ perPage: 8, drag: true, wheel: true, lazyLoad: 'nearby', perMove: 1, pagination: false }" class="splide-container">
      <SplideTrack>
        <SplideSlide v-for="image in localAllImages" :key="image.url">
          <img
              style="width: 100px; cursor:pointer; margin-top: 4px; opacity: 1"
              class="slideImage cursor-pointer"
              :class="[
                  image.isWatched ? 'watched-image' : '',
                  currentImageName.split('.')[0] ===  image.imageName.split('.')[0] ? 'selected-image' : '',
              ]"
              :src="image.url"
              v-show="!hiddenImages[`${image.url}`]"
              @error="hideImage(image.url)"
              @click="selectImage(image.index, image.imageName)"
          />
        </SplideSlide>
      </SplideTrack>

      <div class="splide__arrows splide__arrows--ltr" :style="{ display: localAllImages.length <= 10 ? 'none' : '' }"></div>
    </Splide>
    <p class="classImageSlider-imageIndex-wrapper">{{ currentImageIndex }} / {{ allImages.length }}</p>
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
const currentPowerType = computed(() => store.state.commonModule.currentPowerType);
const localAllImages = ref(props.allImages);
const splide = ref();
const currentImageIndex = ref(1);

watch([() => route.params.id, () => currentPowerType.value], () => {
  if (splide.value) splide.value.go(0);
})

watch(() => props.allImages, async (newAllImages) => {
  localAllImages.value = props.allImages;
  localAllImages.value[0].isWatched = true;
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: newAllImages[0]?.imageName ?? '' });
})

watch(() => currentImageName.value, () => {
  localAllImages.value = localAllImages.value.map((item, index: number) => {
    if (item.imageName.split('.')[0] === currentImageName.value.split('.')[0]) {
      currentImageIndex.value = index + 1;
      return {...item, isWatched: true };
    }
    return item;
  })
})

const selectImage = async (imageIndex: number, imageFileName: string) => {
  await store.dispatch('commonModule/setCommonInfo', { currentImageName: imageFileName });
  emits('goToSelectImage', imageIndex);
}

const hideImage = (fileName: string) => {
  hiddenImages.value[fileName] = true;
}

</script>