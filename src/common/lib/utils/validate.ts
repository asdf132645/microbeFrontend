import { GramRangeItems } from "@/common/api/service/setting/dto/gramRangeDto";

export const gramRangeValidate = (gramItems: GramRangeItems[]) => {
    const isNumberValidated = gramItems.every((item: GramRangeItems) =>
        Number(item.rareBoundary) < Number(item.fewBoundary) &&
        Number(item.fewBoundary) < Number(item.moderateBoundary)
    );

    return isNumberValidated;
}