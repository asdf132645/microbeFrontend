import {
    LP_CAPTURE_OPTIONS_TYPE,
    SLIDE_CARD_TYPE,
    SLOT_INFO_TYPE
} from "@/common/defines/constFile/analysis/analysis.dto";

export const LP_CAPTURE_OPTIONS: LP_CAPTURE_OPTIONS_TYPE[] = [
    { value: "10", text: "10 LP Capture" },
    { value: "20", text: "20 LP Capture" },
    { value: "30", text: "30 LP Capture" },
    { value: "40", text: "40 LP Capture" },
    { value: "50", text: "50 LP Capture" },
]

export const SLIDE_CARD: { input: SLIDE_CARD_TYPE[], output: SLIDE_CARD_TYPE[] } = {
    input: [
        {slotNo: 1, slotState: "0"},
        {slotNo: 2, slotState: "0"},
        {slotNo: 3, slotState: "0"},
        {slotNo: 4, slotState: "0"},
        {slotNo: 5, slotState: "0"},
        {slotNo: 6, slotState: "0"},
        {slotNo: 7, slotState: "0"},
        {slotNo: 8, slotState: "0"},
        {slotNo: 9, slotState: "0"},
        {slotNo: 10, slotState: "0"},
        {slotNo: 11, slotState: "0"},
        {slotNo: 12, slotState: "0"}
    ],
    output: [
        {slotNo: 1, slotState: "0"},
        {slotNo: 2, slotState: "0"},
        {slotNo: 3, slotState: "0"},
        {slotNo: 4, slotState: "0"},
        {slotNo: 5, slotState: "0"},
        {slotNo: 6, slotState: "0"},
        {slotNo: 7, slotState: "0"},
        {slotNo: 8, slotState: "0"},
        {slotNo: 9, slotState: "0"},
        {slotNo: 10, slotState: "0"},
        {slotNo: 11, slotState: "0"},
        {slotNo: 12, slotState: "0"}
    ]
};

export const SLIDE_CARD_100A: { input: SLIDE_CARD_TYPE[], output: SLIDE_CARD_TYPE[] } = {
    input: [
        {slotNo: 1, slotState: "0"},
        {slotNo: 2, slotState: "0"},
        {slotNo: 3, slotState: "0"},
        {slotNo: 4, slotState: "0"},
        {slotNo: 5, slotState: "0"},
        {slotNo: 6, slotState: "0"},
        {slotNo: 7, slotState: "0"},
        {slotNo: 8, slotState: "0"},
        {slotNo: 9, slotState: "0"},
        {slotNo: 10, slotState: "0"},
    ],
    output: [
        {slotNo: 1, slotState: "0"},
        {slotNo: 2, slotState: "0"},
        {slotNo: 3, slotState: "0"},
        {slotNo: 4, slotState: "0"},
        {slotNo: 5, slotState: "0"},
        {slotNo: 6, slotState: "0"},
        {slotNo: 7, slotState: "0"},
        {slotNo: 8, slotState: "0"},
        {slotNo: 9, slotState: "0"},
        {slotNo: 10, slotState: "0"},
    ]
};

export const DEFAULT_SLOT_INFO: SLOT_INFO_TYPE = {
    userId: '1',
    cassetId: '1',
    testType: '00',
    slotNo: '01',
    barcodeNo: '12312432',
    patientId: '',
    patientNm: '',
    gender: '',
    birthday: '',
    slotId: '',
    orderDttm: '',
    analyzedDttm: '',
    tactTime: '',
    isNormal: true,
};