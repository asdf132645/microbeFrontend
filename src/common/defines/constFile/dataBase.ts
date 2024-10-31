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
    SPUTUM: 'Sputum'
}

export const MO_CATEGORY = {
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

export const MO_CATEGORY_CLASS_ID = {
    [MO_CATEGORY.WBC]: '00',
    [MO_CATEGORY.EP_CELL]: '01',
    [MO_CATEGORY.YEAST]: '02',
    [MO_CATEGORY.GPC]: '03',
    [MO_CATEGORY.GPB]: '04',
    [MO_CATEGORY.GNC]: '05',
    [MO_CATEGORY.GNB]: '06'
}

export const FOLDER_NAME = {
    HIGH_POWER: '22_HIGH_Detection',
    LOW_POWER: '13_LOW_Detection'
}