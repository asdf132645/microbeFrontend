import { settingName } from "@/common/defines/constFile/settings";
import {
    putCellImgApi,
    updateCbcCodeRbcApi,
    updateFilePathSetApi,
    updateImagePrintApi,
    updateGramRangeApi,
} from "@/common/api/service/setting/settingApi";
import store from "@/store/index";

export const settingUpdate = async (settingType: string, settingUpdatingData: any) => {
    if (!settingType || !settingUpdatingData) return;

    switch (settingType) {
        case settingName.cellImageAnalyzed:
            const cellImageObj = settingUpdatingData;
            const cellImageId = cellImageObj.id;
            if (cellImageObj?.id) {
                delete cellImageObj.id;
            }
            try {
                const result = await putCellImgApi(cellImageObj, cellImageId);
                if (result) {
                    const data: any = result?.data;
                    // 공통으로 사용되는 부분 세션스토리지 저장 새로고침시에도 가지고 있어야하는부분
                    sessionStorage.setItem('wbcPositionMargin', data?.diffWbcPositionMargin);
                    sessionStorage.setItem('rbcPositionMargin', data?.diffRbcPositionMargin);
                    sessionStorage.setItem('pltPositionMargin', data?.diffPltPositionMargin);
                    sessionStorage.setItem('edgeShotType', String(data?.edgeShotType));
                    sessionStorage.setItem('iaRootPath', data?.iaRootPath);
                    sessionStorage.setItem('keepPage', String(data?.keepPage));
                    await store.dispatch('commonModule/setCommonInfo', {resetAnalyzing: true});
                }
            } catch (e) {
                console.log(e);
            }
            break;

        case settingName.gramRange:
            try {
                await updateGramRangeApi({ gramRangeItems: settingUpdatingData });
            } catch (e) {
                console.log(e);
            }
            break;

        case settingName.imagePrint:
            try {
                await updateImagePrintApi({ imagePrintItems: settingUpdatingData });
            } catch (e) {
                console.log(e);
            }
            break;

        case settingName.cbcCode:
            try {
                await updateCbcCodeRbcApi({ cbcCodeItems: settingUpdatingData });
            } catch (e) {
                console.log(e);
            }
            break;

        case settingName.filePathSet:
            try {
                await updateFilePathSetApi({ filePathSetItems: settingUpdatingData });
            } catch (e) {
                console.log(e);
            }
            break;

        default:
            break;
    }
    await store.dispatch('commonModule/setCommonInfo', {beforeSettingFormattedString: null});
    await store.dispatch('commonModule/setCommonInfo', {afterSettingFormattedString: null});
}