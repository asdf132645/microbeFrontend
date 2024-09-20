<template>
  <div style="width: 450px;">
    <template v-if="showingByPowerAndAnalysisType(powerMode.LOW_POWER, moTestType.BLOOD)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo?.classInfo" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>

        <label class="mt24">Exist</label>
        <div class="flex-column-center mt12" v-for="item in moInfo?.classInfo" :key="item?.classNm">
          <!-- check를 변경할 시 v-model 처럼 변경 필요 -->
          <input
              type="checkbox"
              :checked="item.beforeGrade === 'Exist'"
              :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
          />
        </div>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(powerMode.HIGH_POWER, moTestType.BLOOD)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <label class="mt24">Exist</label>
      </div>
      <div class="w-full mt24 flex-align-center-justify-start" v-for="item in moInfo?.classInfo" :key="item?.classNm">
        <label style="width: 240px;">{{ item?.classNm }}</label>
        <input
            type="checkbox"
            :checked="item.beforeGrade === 'Exist'"
            :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        />
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(powerMode.LOW_POWER, moTestType.URINE)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo" :key="category.classNm">
        <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
        <div class="classInfoHorizontalRule"></div>
        <template v-if="category.classNm === moCategory.WBC">
          <ul class="w-full flex-justify-end" style="gap: 24px;">
            <li v-for="type in fourGrades" :key="type" class="flex-justify-center">{{ type }}</li>
          </ul>
          <div class="w-full mt24 flex-align-center-justify-start" v-for="item in moInfo?.classInfo.filter((it: any) => it.classNm === 'WBC')" :key="item?.classNm">
            <label style="width: 240px;">{{ item?.classNm }}</label>
            <input
                v-for="type in fourGrades"
                :key="type"
                :name="item?.classNm"
                style="margin-top: 2px; width: 24px;"
                type="radio"
                :value="type"
                v-model="item.beforeGrade"
                :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
            />
          </div>
        </template>
        <template v-if="category.classNm === 'Yeast'">
          <label class="mt24">Exist</label>
          <input
              class="mt12 flex-column-center"
              v-for="item in moInfo?.classInfo.filter((it: any) => it.classNm === 'Yeast')"
              :key="item?.classNm"
              type="checkbox"
              :checked="item.beforeGrade === 'Exist'"
              :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
          />
        </template>
      </div>
    </template>


    <template v-else-if="showingByPowerAndAnalysisType(powerMode.HIGH_POWER, moTestType.URINE)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <ul style="width: 100%; display: flex; gap: 24px; justify-content: flex-end;">
          <li v-for="type in fourGrades" :key="type" style="display: flex;">{{ type }}</li>
        </ul>
      </div>
      <div style="width: 100%; margin-top: 24px; display: flex; align-items: center; justify-content: flex-start;" v-for="item in moInfo?.classInfo" :key="item?.classNm">
        <label style="width: 240px;">{{ item?.classNm }}</label>
        <input
            v-for="type in fourGrades"
            :key="type"
            :name="item?.classNm"
            style="margin-top: 2px; width: 24px;"
            type="radio"
            :value="type"
            v-model="item.beforeGrade"
            :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        />
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(powerMode.LOW_POWER, moTestType.SPUTUM)">
      <div class="classDetailInfoWrapper" v-for="category in moInfo.classInfo" :key="category.classNm">
        <template v-if="category.classNm === moCategory.WBC">
          <h1 class="fs12 classInfoClassTitle">Sputum</h1>
          <div class="classInfoHorizontalRule"></div>

          <div class="table-container">
            <table class="sputum-table">
              <thead>
              <tr>
                <th></th>
                <th v-for="column in sputumGrades.grades" :key="column">{{ column }}</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Sputum</td>
                <td v-for="column in sputumGrades.grades" :key="column">
                  <div :class="['circle', {'green': column === sputumStatus }]"></div>
                </td>
              </tr>
              <tr>
                <td>EP Cell</td>
                <td v-for="value in sputumGrades.EPCellGrades" :key="value">{{ value }}</td>
              </tr>
              <tr>
                <td>WBC</td>
                <td v-for="value in sputumGrades.WBCGrades" :key="value">{{ value }}</td>
              </tr>
              <tr>
                <td>WBC/EP Cell</td>
                <td v-for="(value, index) in sputumGrades.WBCEPCellRatioGrades" :key="index">{{ value }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>


        <template v-if="category.classNm === moCategory.YEAST || category.classNm === moCategory.HYPHAE">
          <h1 class="fs12 classInfoClassTitle">{{ category.classNm }}</h1>
          <div class="classInfoHorizontalRule"></div>
          <label class="mt24">Exist</label>
          <input
              class="mt12 flex-column-center"
              v-for="item in moInfo?.classInfo.filter((it: any) => it.classNm === moCategory.YEAST)"
              :key="item?.classNm"
              type="checkbox"
              :checked="item.beforeGrade === 'Exist'"
              :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
          />
        </template>
      </div>
    </template>

    <template v-else-if="showingByPowerAndAnalysisType(powerMode.HIGH_POWER, moTestType.SPUTUM)">
      <div class="classDetailInfoWrapper">
        <h1 class="fs12 classInfoClassTitle">Gram</h1>
        <div class="classInfoHorizontalRule"></div>
        <ul class="w-full flex-justify-end" style="gap: 24px;">
          <li v-for="type in fourGrades" :key="type" class="flex-justify-center">{{ type }}</li>
        </ul>
      </div>
      <div class="w-full mt24 flex-align-center-justify-start" v-for="item in moInfo?.classInfo" :key="item?.classNm">
        <label style="width: 240px;">{{ item?.classNm }}</label>
        <input
            v-for="type in fourGrades"
            :key="type"
            :name="item?.classNm"
            style="margin-top: 2px; width: 24px;"
            type="radio"
            :value="type"
            v-model="item.beforeGrade"
            :class="[{ 'pointerEventsNone': databaseDetailBeforeAfterStatus === beforeAfterStatus.BEFORE }]"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import { LocationQueryValue, useRoute } from "vue-router";
import {computed, nextTick, onMounted, ref, watch} from "vue";
import { beforeAfterStatus, fourGrades, moCategory, moTestType, powerMode, sputumGrades } from "@/common/defines/constFile/dataBase";
import { isObjectEmpty } from "@/common/lib/utils/checkUtils";
import { calculateSputumStatus } from "@/common/lib/utils/changeData";
import { getCurrentAnalysisType } from "@/common/lib/utils/conversionDataUtils";
import {useStore} from "vuex";

const store = useStore();
const route = useRoute();
const props = defineProps(['selectItems', 'selectedImageName']);
const currentPowerType = ref<LocationQueryValue | LocationQueryValue[]>('');
const selectItems = ref({});
const currentAnalysisType = ref(moTestType.BLOOD);
const moInfo = ref<any>([]);
const sputumStatus = ref('1');
const currentSelectedImageName = ref('');
const databaseDetailBeforeAfterStatus = computed(() => store.state.commonModule.databaseDetailBeforeAfterStatus);

onMounted(() => {
  currentPowerType.value = route.query.pageType;
})

watch(() => props.selectItems, async (newSelectItems) => {
  await nextTick();
  currentAnalysisType.value = getCurrentAnalysisType(newSelectItems.cassetId);
  selectItems.value = newSelectItems;
  getMoInfo(newSelectItems);
})

// LP or HP
watch(() => route.query.pageType, (newPageType) => {
  currentPowerType.value = newPageType;
  if (!isObjectEmpty(selectItems.value)) {
    getMoInfo(selectItems.value);
  }
})

watch(() => props.selectedImageName, async (newSelectedImageName) => {
  await nextTick();
  currentSelectedImageName.value = newSelectedImageName;
  if (!isObjectEmpty(selectItems.value)) {
    getMoInfo(selectItems.value);
  }
})

const getMoInfo = (selectItems: any) => {
  if (currentPowerType.value === powerMode.LOW_POWER) {
    moInfo.value = selectItems.moInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '0')[0];
    if (currentAnalysisType.value === moTestType.SPUTUM && moInfo.value) {
      sputumStatus.value = calculateSputumStatus(moInfo.value.classInfo);
    }
  } else if (currentPowerType.value === powerMode.HIGH_POWER) {
    moInfo.value = selectItems.moInfo.filter((item: any) => currentSelectedImageName.value.includes(item.name) && item.id === '1')[0];
  }
}

const showingByPowerAndAnalysisType = (powerType: string, analysisType: string) => {
  return currentPowerType.value === powerType && currentAnalysisType.value === analysisType && moInfo.value;
}

</script>
<style scoped>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.sputum-table {
  border-collapse: collapse;
  color: white;
  font-family: Arial, sans-serif;
}

.sputum-table th, .sputum-table td {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

.sputum-table th {
  background-color: black;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  margin: 0 auto;
  border: 1px solid black;
}

.circle.green {
  background-color: green;
}
</style>