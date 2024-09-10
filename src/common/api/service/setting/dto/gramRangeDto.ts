

export interface CreateGramRange {
    gramRangeItems: GramRangeItems[];
}

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

export interface GramRangeUpdateDto {
    gramRangeItems: GramRangeItems[];
}
