//cbc

export interface CreateCbcCodeRbcDto {
    cbcCodeItems: cbcCodeItem[];
}


export interface cbcCodeItem {
    cd: string;
    classCd: string;
    fullNm: string;
}

export interface UpdateCbcCodeRbcDto {
    cbcCodeItems: cbcCodeItem[];
}
