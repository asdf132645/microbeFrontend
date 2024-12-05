<template>
  <div v-if="localAllImages.length > 0" class="classImageSliderContainer container-shadow" :class="isSliderComponentOpen ? 'classImageSliderContainer-open' : ''">
    <div class="classImageSliderContainer-top-wrapper" @click="handleSliderComponent">
      <font-awesome-icon v-if="!isSliderComponentOpen" :icon="['fas', 'caret-up']" style="color: black;" />
      <font-awesome-icon v-else :icon="['fas', 'caret-down']" style="color: black;" />
    </div>
    <Splide :has-track="false" ref="splide" :options="{ perPage: 8, drag: true, wheel: true, lazyLoad: 'nearby', perMove: 1, pagination: false }">
      <SplideTrack>
        <SplideSlide v-for="image in localAllImages" :key="image.url">
          <img
              class="splideSlide-img slideImage cursor-pointer"
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

      <div class="splide__arrows splide__arrows--ltr" :style="{ display: localAllImages.length <= 8 ? 'none' : '' }"></div>

    </Splide>
    <p class="classImageSlider-imageIndex-wrapper">{{ currentImageIndex }} / {{ allImages.length }}</p>
  </div>
</template>

<script setup lang="ts">
import '@splidejs/vue-splide/css';
import {ref, defineProps, computed, watch, onMounted, onUnmounted} from "vue";
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
const isSliderComponentOpen = ref(false);

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
})

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

const handleSliderComponent = () => {
  isSliderComponentOpen.value = !isSliderComponentOpen.value;
}

const handleKeyDown = async (e: KeyboardEvent) => {
  const currentIndex = localAllImages.value.findIndex((item: any) => item.imageName.split('.')[0] === currentImageName.value.split('.')[0]);
  if (currentIndex === -1) return;

  const direction = e.code === 'ArrowRight' ? 1 : e.code === 'ArrowLeft' ? -1 : null;
  if (direction !== null) {
    const targetIndex = currentIndex + direction;
    const targetImage = localAllImages.value[currentIndex + direction]?.imageName;
    if (targetImage) {
      await store.dispatch('commonModule/setCommonInfo', { currentImageName: targetImage });
      emits('goToSelectImage', currentIndex + direction);
      splide.value.go(targetIndex);
    }
  }
}

</script>