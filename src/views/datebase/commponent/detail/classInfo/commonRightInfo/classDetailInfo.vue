<template>
  <div style="width: 100%;">
    MO Info


    <div style="display: flex;">
      <div v-for="type in fourTypes" :key="type">
        <div>
          <span>{{ type }}</span>
          <input type="radio" />
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const classTypeArr = ['WBC', 'Yeast'];
const fourTypes = ['Rare', 'Few', 'Moderate', 'Many'];

</script>