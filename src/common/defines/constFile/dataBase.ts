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
    EP_CELL: 'EP Cell',
    HYPHAE: 'Hyphae',
    SPUTUM: 'Sputum',
    WBC_EPCELL: 'WBC/EP Cell',
    GRAM: 'Gram'
};

export const BLOOD_TYPE = {
    HIGH_POWER: [ MO_CATEGORY.GPC_CLUSTERS, MO_CATEGORY.GPC_PAIRS, MO_CATEGORY.GPC_CHAINS, MO_CATEGORY.GNB, MO_CATEGORY.GPB_SMALL, MO_CATEGORY.GPB_LARGE, MO_CATEGORY.GNDC, MO_CATEGORY.GNCB ],
    LOW_POWER: [ MO_CATEGORY.YEAST ]
}

export const URINE_TYPE = {
    HIGH_POWER: [ MO_CATEGORY.GPC, MO_CATEGORY.GNB, MO_CATEGORY.GPB ],
    LOW_POWER: [ MO_CATEGORY.WBC, MO_CATEGORY.YEAST ],
}

export const ARROW_DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
}

export const BEFORE_AFTER_STATUS = {
    BEFORE: 'before',
    AFTER: 'after',
};

export const FOLDER_NAME = {
    HIGH_POWER: '22_HIGH_Detection',
    LOW_POWER: '13_LOW_Detection'
}

export const FIVE_COL_GRADES = ['', ...FOUR_GRADES];

export const YEAST_COL_GRADES = ['', MO_CATEGORY.YEAST];

/** TODO
 * description
 * 1. BLOOD, URINE, SPUTUM
 * 2. BLOOD TYPE
 * 3. URINE TYPE
 * 4. SPUTUM TYPE*/
const test = [
    {
        "id": "0",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "WBC",
                "afterGrade": "Most",
                "beforeGrade": "Few"
            },
            {
                "count": "12",
                "classNm": "Yeast",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "12",
                "classNm": "EP Cell",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "2",
                "classNm": "Hyphae",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "0",
                "classNm": "Sputum",
                "afterGrade": "1",
                "beforeGrade": "3-1"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "4",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            },
            {
                "count": "3",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            },
            {
                "count": "1",
                "classNm": "GNDC",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            }
        ]
    },
    {
        "id": "0",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "WBC",
                "afterGrade": "3-2",
                "beforeGrade": "Moderate"
            },
            {
                "count": "0",
                "classNm": "Yeast",
                "afterGrade": "Exist",
                "beforeGrade": "None"
            },
            {
                "count": "0",
                "classNm": "EP Cell",
                "afterGrade": "None",
                "beforeGrade": "None"
            },
            {
                "count": "0",
                "classNm": "Sputum",
                "afterGrade": "1",
                "beforeGrade": "2"
            },
            {
                "count": "2",
                "classNm": "Hyphae",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "10",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Moderate"
            },
            {
                "count": "4",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            },
            {
                "count": "3",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            },
            {
                "count": "1",
                "classNm": "GNDC",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            }
        ]
    },
    {
        "id": "2",
        "classInfo": [
            {
                "count": "10",
                "classNm": "WBC",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "12",
                "classNm": "EP Cell",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "12",
                "classNm": "Yeast",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "0",
                "classNm": "Sputum",
                "afterGrade": "1",
                "beforeGrade": "3-1"
            },
            {
                "count": "4",
                "classNm": "Hyphae",
                "afterGrade": "Exist",
                "beforeGrade": "Exist"
            },
            {
                "count": "20",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "8",
                "classNm": "GNB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            },
            {
                "count": "6",
                "classNm": "GPB",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            },
            {
                "count": "2",
                "classNm": "GNDC",
                "afterGrade": "Rare",
                "beforeGrade": "Rare"
            }
        ]
    }
]