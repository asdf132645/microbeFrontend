import { ref } from 'vue';
import {
    getCellImgApi,
    createCellImgApi,
    createGramRangeApi,
    getGramRangeApi,
    getCbcCodeRbcApi,
    createCbcCodeRbcApi,
} from '@/common/api/service/setting/settingApi';
import { defaultCbcList, defaultGramRange } from "@/common/defines/constFile/settings";

const defaultCellImgData = {
    testTypeCd: '01',
    diffCellAnalyzingCount: '20',
    diffWbcPositionMargin: '0',
    diffRbcPositionMargin: '0',
    diffPltPositionMargin: '0',
    pbsCellAnalyzingCount: '100',
    stitchCount: '1',
    edgeShotType: '0',
    bfCellAnalyzingCount: '100',
    iaRootPath: 'D:\\MOIA_proc',
    isNsNbIntegration: false,
    isAlarm: false,
    alarmCount: '5',
    keepPage: false,
    backupPath: '',
    backupStartDate: new Date(),
    backupEndDate: new Date(),
    userId: '', // 사용자 ID 기본값
};


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
        'defaultItem': defaultCbcList,
        'getRequest': getCbcCodeRbcApi,
        'createRequest': createCbcCodeRbcApi,
    },
    'cellImage': {
        'getRequest': getCellImgApi,
        'createRequest': createCellImgApi,
    },
    'gramRange': {
        'sendingForm': 'gramRangeItems',
        'defaultItem': defaultGramRange,
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
        const {data} = await getRequest() || {};

        if (!data || data.length === 0) {
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
                analysisType: defaultCellImgData.testTypeCd,
                diffCellAnalyzingCount: defaultCellImgData.diffCellAnalyzingCount,
                diffWbcPositionMargin: defaultCellImgData.diffWbcPositionMargin,
                diffRbcPositionMargin: defaultCellImgData.diffRbcPositionMargin,
                diffPltPositionMargin: defaultCellImgData.diffPltPositionMargin,
                pbsCellAnalyzingCount: defaultCellImgData.pbsCellAnalyzingCount,
                stitchCount: defaultCellImgData.stitchCount,
                edgeShotType: defaultCellImgData.edgeShotType,
                bfCellAnalyzingCount: defaultCellImgData.bfCellAnalyzingCount,
                iaRootPath: defaultCellImgData.iaRootPath,
                isNsNbIntegration: defaultCellImgData.isNsNbIntegration ? 'Y' : 'N',
                isAlarm: defaultCellImgData.isAlarm,
                alarmCount: defaultCellImgData.alarmCount,
                keepPage: defaultCellImgData.keepPage,
                backupPath: defaultCellImgData.backupPath,
                backupStartDate: defaultCellImgData.backupStartDate.toISOString().split('T')[0],
                backupEndDate: defaultCellImgData.backupEndDate.toISOString().split('T')[0],
                autoBackUpMonth: 'Not selected',
                autoBackUpStartDate: null,
            };
            return cellImgSet;

        default:
            return null;
    }
}

/** Response를 받은 후 할 작업 정리 함수 */
const afterResponse = (initializeType: string) => {
    switch (initializeType) {
        case 'cellImage':
            sessionStorage.setItem('isNsNbIntegration', defaultCellImgData.isNsNbIntegration ? 'Y' : 'N');
            sessionStorage.setItem('wbcPositionMargin', String(defaultCellImgData?.diffWbcPositionMargin));
            sessionStorage.setItem('rbcPositionMargin', String(defaultCellImgData?.diffRbcPositionMargin));
            sessionStorage.setItem('pltPositionMargin', String(defaultCellImgData?.diffPltPositionMargin));
            sessionStorage.setItem('edgeShotType', String(defaultCellImgData?.edgeShotType));
            sessionStorage.setItem('iaRootPath', String(defaultCellImgData?.iaRootPath));
            sessionStorage.setItem('keepPage', String(defaultCellImgData?.keepPage));
            break;
        default:
            break;
    }
}