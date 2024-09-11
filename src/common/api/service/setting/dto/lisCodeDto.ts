//cbc

export interface CreateCbcCodeRbcDto {
    cbcCodeItems: cbcCodeItem[];
}


export interface cbcCodeItem {
    cd: string;
    classCd: string;
    fullNm: string;
    isSelected: boolean;
}

export interface UpdateCbcCodeRbcDto {
    cbcCodeItems: cbcCodeItem[];
}
