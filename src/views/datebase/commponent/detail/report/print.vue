<template>
  <div v-show="printReady" class="moveImgIsBool"> Loading Print...</div>
  <div
      style="font-size: 0.8rem; width: 900px; height: 90%; overflow-y: auto; background: #fff; color: #000; position: absolute; top: 10%; left: 33%; box-sizing: border-box; padding: 3rem 7rem; border: 2px solid #ccc; border-radius: 10px; z-index:9999;">
    <button
        style="position: absolute; right: 8px; background: none; border: 1px solid #000; border-radius: 5px; padding: 7px 25px; top: 5px; cursor: pointer"
        @click="closePrint">Close
    </button>
    <div ref="printContent" style="margin-top: 20px;">
      <div>
        <h3 style="margin: 10px 0; font-size: 1.2rem; font-weight: 600; text-align: center;">Analysis Report from UIMD MO system</h3>
      </div>
      <div style="display: flex; flex-direction: column; justify-content: space-between;">
        <table style="width: 100%; font-size: 0.8rem;">
          <colgroup>
            <col style="width: 30%;"/>
            <col style="width: 70%;"/>
          </colgroup>
          <tbody>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Slot ID</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.slotId }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Ordered date</th>
            <td style="text-align: left; padding: 5px 0;">{{ formatDateString(selectItems?.orderDttm) }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Signed by ID</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.submitUserId }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Signed date</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.submitOfDate }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left;">Ordered Classification</th>
            <td style="text-align: left; padding: 5px 0;">{{ getTestTypeText(selectItems?.testType) }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Name</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.patientName }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Birth</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.birthDay }}</td>
          </tr>
          <tr style="padding-bottom: 5px;">
            <th style="text-align: left; padding: 5px 0;">Gender</th>
            <td style="text-align: left; padding: 5px 0;">{{ selectItems?.gender === '' ? '' : selectItems?.gender === '01' ? 'Male' : 'Female' }}</td>
          </tr>

          </tbody>
        </table>

        <div style="margin-top: 20px; border-top: 2px dotted #696969"></div>

        <!-- WBC Classification -->
        <div style="margin-top: 150px; margin-bottom: 50px; border-top: 2px dotted #696969">
          <h3 style="margin: 10px 0; font-size: 1.2rem; font-weight: 600; text-align: center;">MO classification result</h3>
          <table style="width: 100%; font-size: 0.8rem;">
            <colgroup>
              <col style="width: 30%;"/>
              <col style="width: 45%;"/>
              <col style="width: 25%;"/>
            </colgroup>
            <thead>
            <tr style="margin-bottom: 15px; font-size: 18px; font-weight: normal; padding-bottom: 100px;">
              <th style="text-align: left;">Class</th>
              <th style="text-align: left;">Count</th>
              <th style="text-align: left;">Percent</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filteredWbcInfo(wbcInfo, 'wbc')" :key="item.id" style="padding-bottom: 5px;">
              <th style="text-align: left; padding: 5px 0;">{{ item?.name }}</th>
              <td style="text-align: left; padding: 5px 0;">{{ item?.count }}</td>
              <td style="text-align: left; padding: 5px 0;">{{ item?.percent }} %</td>
            </tr>
            <tr style="padding-bottom: 5px;">
              <th style="text-align: left; font-weight: bold; padding: 5px 0;">Total</th>
              <td style="text-align: left; padding: 5px 0;">{{ selectItems?.wbcInfo?.totalCount }}</td>
              <td style="text-align: left; padding: 5px 0;">100.00%</td>
            </tr>
            <tr style="padding-bottom: 5px;">
              <th style="text-align: left; padding: 15px 0;">Comment</th>
              <td v-show="selectItems?.wbcMemo" colspan="2" style="text-align: left; padding: 5px 0;">
                <pre style="text-align: left; outline: 1px solid #252629; padding: 4px;">{{
                    selectItems?.wbcMemo
                  }}</pre>
              </td>
            </tr>
            </tbody>
          </table>

          <!-- Print List -->
          <ul class="print"
              style="list-style: none; padding-left: 0; margin-top: 20px; text-align: center; display:flex; flex-direction: column; align-items: center; justify-content: center;">
            <li v-for="(item) in noImageList(wbcInfo)" :key="item.id" style="">
              <div style="font-weight: bold; font-size: 18px; margin: 10px auto 20px;">{{ item?.title }} ({{
                  item?.count
                }})
              </div>
              <ul :class="'wbcImgWrap ' + item?.title"
                  style="list-style: none; padding-left: 0; margin-top: 10px;text-align: left;">
                <li v-for="(image) in item.images" :key="image.fileName"
                    style="display: inline-block; margin-right: 5px; margin-top: 5px; outline: 1px solid #2c2d2c; cursor: auto;">
                  <div style="position: relative; text-align: left;">
                    <img
                        :src="getImageUrl(image.fileName, item.id, item.title)"
                        v-if="!hiddenImages[`${item.id}-${image.fileName}`]"
                        :width="image.width ? image.width : '150px'" :height="image.height ? image.height : '150px'"
                        @error="handleImageError(item.id, image.fileName)"
                        :style="{ filter: image.filter }" class="cellImg" ref="cellRef"/>
                    <div class="center-point" :style="image.coordinates"></div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, defineEmits, onMounted, ref } from "vue";
import { getTestTypeText } from "@/common/lib/utils/conversionDataUtils";
import { getImagePrintApi } from "@/common/api/service/setting/settingApi";
import {useStore} from "vuex";
import pako from 'pako';
import {formatDateString} from "@/common/lib/utils/dateUtils";
import {detailRunningApi} from "@/common/api/service/runningInfo/runningInfoApi";
import {disableScroll, enableScroll} from "@/common/lib/utils/scrollBlock";

const store = useStore();
const viewerCheck = computed(() => store.state.commonModule.viewerCheck);
const apiBaseUrl = viewerCheck.value === 'viewer' ? window.MAIN_API_IP : window.APP_API_BASE_URL;

const printContent = ref(null);
const wbcInfo = ref([]);

const iaRootPath = computed(() => store.state.commonModule.iaRootPath);
const selectedSampleId = computed(() => store.state.commonModule.selectedSampleId);
const siteCd = computed(() => store.state.commonModule.siteCd);
const selectItems = ref<any>(null);

const imagePrintAndWbcArr = ref<string[]>([]);
const emit = defineEmits(['printClose']);
const nonWbcIdList = ['12', '13', '14', '15', '16'];

const printReady = ref(false);

onMounted(async () => {
  await getDetailRunningInfo();
  await getImagePrintData();
  await printPage();
});

const hiddenImages = ref<Record<string, boolean>>({});

const handleImageError = (itemId: number, fileName: string) => {
  hiddenImages.value[`${itemId}-${fileName}`] = true;
};

const getDetailRunningInfo = async () => {
  try {
    const result: any = await detailRunningApi(String(selectedSampleId.value));
    selectItems.value = result.data;
    wbcInfo.value = result.data.wbcInfoAfter;
  } catch (e) {
    console.log(e);
  }
}

const filteredWbcInfo = (wbcInfoArr, type: 'wbc' | 'nonWbc') => {
  if (type === 'nonWbc') {
    return wbcInfoArr.filter((item: any) => nonWbcIdList.includes(item.id) && item.count > 0);
  }
  return wbcInfoArr.filter((item: any) => !nonWbcIdList.includes(item.id) && item.count > 0);
}

function getImageUrl(imageName: any, id: string, title: string): string {
  // 이미지 정보가 없다면 빈 문자열 반환
  const showImage = [...imagePrintAndWbcArr.value].find(item => item === String(id));
  if (!showImage) {
    return '';
  }

  if (!wbcInfo.value || wbcInfo.value.length === 0) {
    return "";
  }

  const path = selectItems.value.img_drive_root_path !== '' && selectItems.value.img_drive_root_path ? selectItems.value.img_drive_root_path : iaRootPath.value;
  const slotId = selectItems.value.slotId || "";
  const folderPath = `${path}/${slotId}/01_WBC_Classification/${id}_${title}`;
  return `${apiBaseUrl}/images/print?folder=${folderPath}&imageName=${imageName}`;
}

const noImageList = (wbcArr: any) => {
  return wbcArr.filter((item: any) => [...imagePrintAndWbcArr.value].includes(String(item.id)));
}


const printPage = async () => {
  printReady.value = true;
  disableScroll();
  try {
    // 프린트할 컨텐츠를 가져옴
    const content = printContent.value;
    if (!content) {
      throw new Error("프린트할 내용을 찾을 수 없습니다.");
    }

    // HTML 컨텐츠를 Gzip으로 압축
    const compressedContent = pako.gzip(content.innerHTML, {level: 9});

    // HTML 컨텐츠를 PDF로 변환하는 요청을 보냄
    const response = await fetch(`${apiBaseUrl}/pdf/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'gzip'
      },
      body: compressedContent
    });

    if (!response.ok) {
      throw new Error('HTML을 PDF로 변환하는데 실패했습니다.');
    }

    // 받은 PDF 파일을 브라우저의 PDF 뷰어로 열기
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=800,height=500,noopener,noreferrer');
    window.URL.revokeObjectURL(url);
    printReady.value = false;
  } catch (error) {
    console.error('Error:', error);
    printReady.value = false;
  } finally {
    enableScroll();
  }
};


const getImagePrintData = async () => {
  try {
    const result = await getImagePrintApi();

    if (result && result.data) {
      const data = result.data;

      imagePrintAndWbcArr.value = data.filter((item) => item.checked).map(item => item.classId);

      // count가 없는 경우 print에서 보여줄 wbcInfo에서 제거
      wbcInfo.value = wbcInfo.value.filter((item: any) => item.count !== '0');
    }
  } catch (e) {
    console.error(e);
  }
};

const closePrint = () => {
  emit('printClose');
}

</script>
