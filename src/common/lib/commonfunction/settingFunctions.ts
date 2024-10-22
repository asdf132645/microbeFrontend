import { ref } from 'vue';
import {
    getCellImgApi,
    createCellImgApi,
    createGramRangeApi,
    getGramRangeApi,
    getCbcCodeRbcApi,
    createCbcCodeRbcApi,
} from '@/common/api/service/setting/settingApi';
import {DEFAULT_CBC_LIST, defaultCellImageAnalyzed, DEFAULT_GRAM_RANGE} from "@/common/defines/constFile/settings/settings";
import { useStore } from "vuex";
import {isObjectEmpty} from "@/common/lib/utils/checkUtils";

/**
 * API 요청 시 분류할 Constant
 * sendingForm: Create 요청 시 사용할 key 값
 * defaultItem: Create 요청 시 보내는 body
 * getRequest: get 요청 함수
 * createRequest: create 요청 함수
 * */
const settingsConstant = ref<any>({
    'cbcCode': {
        'sendingForm': 'cbcCodeItems',
        'defaultItem': DEFAULT_CBC_LIST,
        'getRequest': getCbcCodeRbcApi,
        'createRequest': createCbcCodeRbcApi,
    },
    'cellImage': {
        'getRequest': getCellImgApi,
        'createRequest': createCellImgApi,
    },
    'gramRange': {
        'sendingForm': 'gramRangeItems',
        'defaultItem': DEFAULT_GRAM_RANGE,
        'getRequest': getGramRangeApi,
        'createRequest': createGramRangeApi,
    },
})

/** 로그인 시 Setting 값 설정 함수 */
export const initializeAllSettings = async () => {
    await firstGetSettings('cellImage');
    await firstGetSettings('cbcCode')
    await firstGetSettings('gramRange')
}

const firstGetSettings = async (initializeType: string) => {
    const getRequest = settingsConstant.value[initializeType].getRequest;
    try {
        const { data } = await getRequest() || {};

        if (!data || data.length === 0 || isObjectEmpty(data)) {
            const sendingFormStr = settingsConstant.value[initializeType]?.sendingForm;
            const defaultItem = settingsConstant.value[initializeType].defaultItem;
            const createRequest = settingsConstant.value[initializeType].createRequest;

            const anotherDefaultValue = await defaultComputedValueForCreateRequest(initializeType)

            if (sendingFormStr) {
                await createRequest({[sendingFormStr]: anotherDefaultValue || defaultItem});
            } else {
                await createRequest(anotherDefaultValue || defaultItem);
            }

            afterResponse(initializeType);
        }
    } catch (e) {
        console.log(`${initializeType} Error - ${e}`);
    }
}

/** Create 요청시 보낼 defaultValue 중 계산되어야 하는 값들을 반환하는 함수 */
const defaultComputedValueForCreateRequest = async (initializeType: string) => {
    switch (initializeType) {
        case 'cellImage':
            const cellImgSet = {
                analysisType: defaultCellImageAnalyzed.analysisType,
                iaRootPath: defaultCellImageAnalyzed.iaRootPath,
                isAlarm: defaultCellImageAnalyzed.isAlarm,
                alarmCount: defaultCellImageAnalyzed.alarmCount,
                keepPage: defaultCellImageAnalyzed.keepPage,
                backupPath: defaultCellImageAnalyzed.backupPath,
                backupStartDate: defaultCellImageAnalyzed.backupStartDate.toISOString().split('T')[0],
                backupEndDate: defaultCellImageAnalyzed.backupEndDate.toISOString().split('T')[0],
                autoBackUpMonth: 'Not selected',
                autoBackUpStartDate: null,
            };
            return cellImgSet;

        default:
            return null;
    }
}

/** Response를 받은 후 할 작업 정리 함수 */
const afterResponse = async (initializeType: string) => {
    const store = useStore();
    switch (initializeType) {
        case 'cellImage':
            await store.dispatch('commonModule/setCommonInfo', { cellImageAnalyzedSetting: defaultCellImageAnalyzed })
            break;
        default:
            break;
    }
}