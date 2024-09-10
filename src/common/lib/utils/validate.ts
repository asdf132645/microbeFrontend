import { GramRangeItems } from "@/common/api/service/setting/dto/gramRangeDto";

export const gramRangeValidate = (gramItems: GramRangeItems[]) => {
    const isNumberValidated = gramItems.every((item: GramRangeItems) =>
        Number(item.rareMost) < Number(item.fewLeast) &&
        Number(item.fewLeast) < Number(item.fewMost) &&
        Number(item.fewMost) < Number(item.moderateLeast) &&
        Number(item.moderateLeast) < Number(item.moderateMost)
        && Number(item.moderateMost) <  Number(item.manyLeast)
    );

    return isNumberValidated;
}