export interface LP_CAPTURE_OPTIONS_TYPE {
    value: string;
    text: string;
}

export interface SLIDE_CARD_TYPE {
    slotNo: number;
    slotState: string;
}

export interface SLOT_INFO_TYPE {
    userId: string;
    cassetId: string;
    testType: string;
    slotNo: string;
    barcodeNo: string;
    patientId: string;
    patientNm: string;
    gender: string;
    birthday: string;
    slotId: string;
    orderDttm: string;
    analyzedDttm: string;
    tactTime: string;
    isNormal: boolean;
}