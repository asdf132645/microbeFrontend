import { SETTING_NAME } from "@/common/defines/constFile/settings/settings";
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
        case SETTING_NAME.cellImageAnalyzed:
            try {
                const result = await putCellImgApi(settingUpdatingData);
                if (result) {
                    const data: any = result?.data;
                    await store.dispatch('commonModule/setCommonInfo', { cellImageAnalyzedSetting: data });
                    await store.dispatch('commonModule/setCommonInfo', {resetAnalyzing: true});
                }
            } catch (e) {
                console.error(e);
            }
            break;

        case SETTING_NAME.gramRange:
            try {
                await updateGramRangeApi({ gramRangeItems: settingUpdatingData });
            } catch (e) {
                console.error(e);
            }
            break;

        case SETTING_NAME.imagePrint:
            try {
                await updateImagePrintApi({ imagePrintItems: settingUpdatingData });
            } catch (e) {
                console.error(e);
            }
            break;

        case SETTING_NAME.cbcCode:
            try {
                await updateCbcCodeRbcApi({ cbcCodeItems: settingUpdatingData });
            } catch (e) {
                console.error(e);
            }
            break;

        case SETTING_NAME.filePathSet:
            try {
                await updateFilePathSetApi({ filePathSetItems: settingUpdatingData });
            } catch (e) {
                console.error(e);
            }
            break;

        default:
            break;
    }
    await store.dispatch('commonModule/setCommonInfo', {beforeSettingFormattedString: null});
    await store.dispatch('commonModule/setCommonInfo', {afterSettingFormattedString: null});
}