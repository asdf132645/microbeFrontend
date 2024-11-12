import { commonCodeList } from '@/common/defines/constFile/commonCodeList';
import {
    BLOOD_HIGH_POWER_CLASS_IDS,
    BLOOD_LOW_POWER_CLASS_IDS, BLOOD_TOTAL_CLASS_IDS, CLASS_INFO_ID,
    MO_TEST_TYPE, SPUTUM_HIGH_POWER_CLASS_IDS, SPUTUM_LOW_POWER_CLASS_IDS, SPUTUM_TOTAL_CLASS_IDS,
    TEST_TYPE,
    URINE_HIGH_POWER_CLASS_IDS,
    URINE_LOW_POWER_CLASS_IDS, URINE_TOTAL_CLASS_IDS
} from "@/common/defines/constFile/dataBase";
import {ClassInfoType} from "@/common/api/service/runningInfo/runningInfo.dto";
export const getCommonCode = (grpCd: string, cd: string): string | undefined => {
    const foundCode = commonCodeList.find((code) => code.grpCd === grpCd && code.cd === cd);

    return foundCode?.cdNm;
};

export function stringToDateTime(str: string): string {
    if (!str) {
        return '';
    }

    const [year, month, day, hour, minute, second] = [
        str.substring(0, 4),
        str.substring(4, 6),
        str.substring(6, 8),
        str.substring(8, 10),
        str.substring(10, 12),
        str.substring(12, 14)
    ];

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export const getTestTypeText = (value: string) => {
    const matchingOption = TEST_TYPE.find(option => option.value === value);
    return matchingOption ? matchingOption.text : '';
};

export const getBarcodeDetailImageUrl =  (imageName: string, iaRootPath: string, slotId: string, barcodeDirName: string): string => {
    const apiBaseUrl = window.APP_API_BASE_URL || 'http://192.168.0.115:3002';
    return `${apiBaseUrl}/images/getImageRealTime?folder=${iaRootPath + "/" + slotId + "/" + barcodeDirName + "/"}&imageName=${imageName}`;
}

export const getCurrentAnalysisType = (testType: string) => {
    switch (testType) {
        case '00':
            return MO_TEST_TYPE.URINE;
        case '01':
            return MO_TEST_TYPE.SPUTUM;
        case '02':
            return MO_TEST_TYPE.BLOOD;
        case '03':
            return MO_TEST_TYPE.BODY_FLUID;
        default:
            return MO_TEST_TYPE.URINE
    }
}

export const getValidClassIds = (cassetteType: string, id: string) => {
    switch (cassetteType) {
        case MO_TEST_TYPE.URINE:
            switch (id) {
                case '0':
                    return URINE_LOW_POWER_CLASS_IDS;
                case '1':
                    return URINE_HIGH_POWER_CLASS_IDS;
                case '2':
                    return URINE_TOTAL_CLASS_IDS;
                default:
                    return [];
            }
        case MO_TEST_TYPE.BLOOD:
            switch (id) {
                case '0':
                    return BLOOD_LOW_POWER_CLASS_IDS;
                case '1':
                    return BLOOD_HIGH_POWER_CLASS_IDS;
                case '2':
                    return BLOOD_TOTAL_CLASS_IDS;
                default:
                    return [];
            }
        case MO_TEST_TYPE.SPUTUM:
            switch (id) {
                case '0':
                    return SPUTUM_LOW_POWER_CLASS_IDS;
                case '1':
                    return SPUTUM_HIGH_POWER_CLASS_IDS;
                case '2':
                    return SPUTUM_TOTAL_CLASS_IDS;
                default:
                    return [];
            }
        default:
            return [];
    }
}

export const filterClassInfoByClassIds = (classInfo: ClassInfoType[], type: 'delete' | 'include', validClassIds: string[]) => {
    if (type === 'include') return classInfo.filter((item) => validClassIds.includes(item.classId));
    return classInfo.filter((item) => !validClassIds.includes(item.classId));
};

export const getTotalCountOfClassInfo = (classInfo: ClassInfoType[]) => {
    return classInfo.reduce((acc: number, item) => Number(item.count) + acc, 0);
}

export const getProcessingCode = (processingCode: string) => {
    if (processingCode === '' || !processingCode) return '';
    if (Number(processingCode) < 300) return "Move to LowPower Area";
    if (Number(processingCode) < 400) return "Scanning Smear";
    if (Number(processingCode) < 500) return "Analyzing LowPower";
    if (Number(processingCode) < 700) return "Dropping Oil";
    if (Number(processingCode) < 900) return "Analyzing HighPower";
    return "Device Setting";
}