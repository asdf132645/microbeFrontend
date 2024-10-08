import { commonCodeList } from '@/common/defines/constFile/commonCodeList';
import {MO_TEST_TYPE, TEST_TYPE } from "@/common/defines/constFile/dataBase";
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

export const getCurrentAnalysisType = (cassetId: string) => {
    if (cassetId.includes('B')) return MO_TEST_TYPE.BLOOD;
    if (cassetId.includes('U')) return MO_TEST_TYPE.URINE;
    return MO_TEST_TYPE.SPUTUM;
}