export interface GramRangeRequest {
    gramRangeItems: GramRangeItems[];
}

export type GramRangeResponse = GramRangeItems;

export interface GramRangeItems {
    classId: string;
    fullNm: string;
    fewBoundary: number;
    rareBoundary: number;
    moderateBoundary: number;
}