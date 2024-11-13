export const TEST_TYPE = [
    { value: '00', text: 'Urine' },
    { value: '01', text: 'Blood' },
    { value: '02', text: 'Sputum' },
    { value: '03', text: 'Sputum' },
];

export const FOUR_GRADES = ['Rare', 'Few', 'Moderate', 'Many'];

export const GRADE_TEXT = {
    RARE: 'Rare',
    FEW: 'Few',
    MODERATE: 'Moderate',
    MANY: 'Many',
    EXIST: 'Exist',
    NONE: 'None',
    '1': '1',
    '2': '2',
    '3-1': '3-1',
    '3-2': '3-2',
    '4-1': '4-1',
    '4-2': '4-2',
    '5': '5',
    '6': '6',
}

export const SPUTUM_GRADES = {
    GRADES: ['1', '2', '3-1', '3-2', '4-1', '4-2', '5', '6'],
    EPCELL_GRADES: ['> 25', '> 25', '> 25', '> 25', '10 ~ 25', '10 ~ 25', '< 10', '< 10'],
    WBC_GRADES: ['< 10', '10 ~ 25', '> 25', '> 25', '> 25', '> 25', '> 25', '< 10'],
    WBC_EPCELL_RATIO_GRADES: ['', '', 'x10 ↓', 'x10 ↑', 'x10 ↓', 'x10 ↑', '', ''],
    COLUMNS: ['Sputum', 'EP Cell', 'WBC', 'WBC/EP Cell']
}

export const POWER_MODE = {
    LOW_POWER: 'LP',
    HIGH_POWER: 'HP',
}

export const MO_TEST_TYPE = {
    BLOOD: 'Blood',
    URINE: 'Urine',
    SPUTUM: 'Sputum',
    BODY_FLUID: 'Body Fluid'
}

export const MO_TEST_TYPE_CODE = {
    URINE: '00',
    SPUTUM: '01',
    BLOOD: '02',
    BODY_FLUID: '03'
}

export const MO_CATEGORY_NAME = {
    GPC_CLUSTERS: 'GPC Clusters',
    GPC_PAIRS: 'GPC Pairs',
    GPC_CHAINS: 'GPC Chains',
    GNB: 'GNB',
    GPB_SMALL: 'GPB Small',
    GPB_LARGE: 'GPB Large',
    GNDC: 'GNDC',
    GNCB: 'GNCB',
    YEAST: 'Yeast',
    WBC: 'WBC',
    GPC: 'GPC',
    GPB: 'GPB',
    GNC: 'GNC',
    EP_CELL: 'EP Cell',
    HYPHAE: 'Hyphae',
    SPUTUM: 'Sputum',
    WBC_EPCELL: 'WBC/EP Cell',
    GRAM: 'Gram'
};

export const CLASS_ID_MAP_BY_CLASS_NM = {
    WBC: MO_CATEGORY_NAME.WBC,
    EP_CELL: MO_CATEGORY_NAME.EP_CELL,
    YEAST: MO_CATEGORY_NAME.YEAST,
    HYPHAE: MO_CATEGORY_NAME.HYPHAE,
    GPC: MO_CATEGORY_NAME.GPC,
    GPB: MO_CATEGORY_NAME.GPB,
    GNC: MO_CATEGORY_NAME.GNC,
    GNB: MO_CATEGORY_NAME.GNB,
    GPC_CLUSTERS: MO_CATEGORY_NAME.GPC_CLUSTERS,
    GPC_PAIRS: MO_CATEGORY_NAME.GPC_PAIRS,
    GPC_CHAINS: MO_CATEGORY_NAME.GPC_CHAINS,
    GPB_SMALL: MO_CATEGORY_NAME.GPB_SMALL,
    GPB_LARGE: MO_CATEGORY_NAME.GPB_LARGE,
    GNDC: MO_CATEGORY_NAME.GNDC,
    GNCB: MO_CATEGORY_NAME.GNCB,
}

export const CLASS_INFO_ID = {
    WBC: '00',
    EP_CELL: '01',
    YEAST: '02',
    HYPHAE: '03',
    GPC: '04',
    GPB: '05',
    GNC: '06',
    GNB: '07',
    GPC_CLUSTERS: '08',
    GPC_PAIRS: '09',
    GPC_CHAINS: '10',
    GPB_SMALL: '11',
    GPB_LARGE: '12',
    GNDC: '13',
    GNCB: '14',
}

export const MAP_CLASS_ID_TO_CLASS_NM = Object.fromEntries(
    Object.entries(CLASS_INFO_ID).map(([key, value]) => [value, key])
);

export const MO_CATEGORY_CLASS_ID = {
    [MO_CATEGORY_NAME.WBC]: '00',
    [MO_CATEGORY_NAME.EP_CELL]: '01',
    [MO_CATEGORY_NAME.YEAST]: '02',
    [MO_CATEGORY_NAME.GPC]: '03',
    [MO_CATEGORY_NAME.GPB]: '04',
    [MO_CATEGORY_NAME.GNC]: '05',
    [MO_CATEGORY_NAME.GNB]: '06'
}

export const FOLDER_NAME = {
    HIGH_POWER: '22_HIGH_Detection',
    LOW_POWER: '13_LOW_Detection'
}

export const MAP_TEST_TYPE_TO_TEST_NAME = {
    '00': MO_TEST_TYPE.URINE,
    '01': MO_TEST_TYPE.SPUTUM,
    '02': MO_TEST_TYPE.BLOOD,
    '03': MO_TEST_TYPE.BODY_FLUID,
}

export const URINE_LOW_POWER_CLASS_IDS = [CLASS_INFO_ID.WBC];

export const URINE_HIGH_POWER_CLASS_IDS = [CLASS_INFO_ID.GPC, CLASS_INFO_ID.GNB, CLASS_INFO_ID.GPB, CLASS_INFO_ID.YEAST];

export const SPUTUM_LOW_POWER_CLASS_IDS = [CLASS_INFO_ID.WBC, CLASS_INFO_ID.EP_CELL, CLASS_INFO_ID.YEAST, CLASS_INFO_ID.HYPHAE];

export const SPUTUM_HIGH_POWER_CLASS_IDS = [CLASS_INFO_ID.GPC, CLASS_INFO_ID.GNB, CLASS_INFO_ID.GPB, CLASS_INFO_ID.GNDC];

export const BLOOD_LOW_POWER_CLASS_IDS = [CLASS_INFO_ID.YEAST];

export const BLOOD_HIGH_POWER_CLASS_IDS = [CLASS_INFO_ID.GPC_CLUSTERS, CLASS_INFO_ID.GPC_PAIRS, CLASS_INFO_ID.GPC_CHAINS, CLASS_INFO_ID.GNB, CLASS_INFO_ID.GPB_SMALL, CLASS_INFO_ID.GPB_LARGE, CLASS_INFO_ID.GNDC, CLASS_INFO_ID.GNCB];

export const URINE_TOTAL_CLASS_IDS = [...URINE_HIGH_POWER_CLASS_IDS, ...URINE_LOW_POWER_CLASS_IDS];

export const BLOOD_TOTAL_CLASS_IDS = [...BLOOD_HIGH_POWER_CLASS_IDS, ...BLOOD_LOW_POWER_CLASS_IDS];

export const SPUTUM_TOTAL_CLASS_IDS = [...SPUTUM_HIGH_POWER_CLASS_IDS, ...SPUTUM_LOW_POWER_CLASS_IDS];

export const LOW_POWER_CLASS_IDS = [...URINE_LOW_POWER_CLASS_IDS, ...SPUTUM_LOW_POWER_CLASS_IDS, ...BLOOD_LOW_POWER_CLASS_IDS];

export const HIGH_POWER_CLASS_IDS = [...URINE_HIGH_POWER_CLASS_IDS, ...SPUTUM_HIGH_POWER_CLASS_IDS, ...BLOOD_HIGH_POWER_CLASS_IDS];

export const CATEGORY_ID_ARRAYS = {
    [MO_TEST_TYPE.URINE.toUpperCase()]: [...URINE_HIGH_POWER_CLASS_IDS, ...URINE_LOW_POWER_CLASS_IDS],
    [MO_TEST_TYPE.BLOOD.toUpperCase()]: [...BLOOD_HIGH_POWER_CLASS_IDS, ...BLOOD_LOW_POWER_CLASS_IDS],
    [MO_TEST_TYPE.SPUTUM.toUpperCase()]: [...SPUTUM_HIGH_POWER_CLASS_IDS, ...SPUTUM_LOW_POWER_CLASS_IDS],
}