export interface GramRangeRequest {
    gramRangeItems: GramRangeItems[];
}

export type GramRangeResponse = GramRangeItems;

export interface GramRangeItems {
    classId: string;
    rareMost: string;
    fewLeast: string;
    fewMost: string;
    moderateLeast: string;
    moderateMost: string;
    manyLeast: string;
    abbreviation: string;
    fullNm: string;
    uint: string;
}