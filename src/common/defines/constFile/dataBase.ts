export const testType = [
    {value: '01', text: 'WBC Diff'},
    {value: '04', text: 'PBS'},
    {value: '02', text: 'Body fluid default'},
    {value: '03', text: 'Body fluid select'}
];

export const fourGrades = ['Rare', 'Few', 'Moderate', 'Many'];

export const sputumGrades = {
    grades: ['1', '2', '3-1', '3-2', '4-1', '4-2', '5', '6'],
    EPCellGrades: ['> 25', '> 25', '> 25', '> 25', '10 ~ 25', '10 ~ 25', '< 10', '< 10'],
    WBCGrades: ['< 10', '10 ~ 25', '> 25', '> 25', '> 25', '> 25', '> 25', '< 10'],
    WBCEPCellRatioGrades: ['', '', 'x10 ↓', 'x10 ↑', 'x10 ↓', 'x10 ↑', '', ''],
}

export const categoryForUrineLowPower = ['WBC', 'Yeast'];

export const powerMode = {
    LOW_POWER: 'LP',
    HIGH_POWER: 'HP',
}

export const moTestType = {
    BLOOD: 'Blood',
    URINE: 'Urine',
    SPUTUM: 'Sputum'
}

export const moCategory = {
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
}

export const bloodType = {
    HIGH_POWER: [ moCategory.GPC_CLUSTERS, moCategory.GPC_PAIRS, moCategory.GPC_CHAINS, moCategory.GNB, moCategory.GPB_SMALL, moCategory.GPB_LARGE, moCategory.GNDC, moCategory.GNCB ],
    LOW_POWER: [ moCategory.YEAST ]
}

export const urineType = {
    HIGH_POWER: [ moCategory.GPC, moCategory.GNB, moCategory.GPB ],
    LOW_POWER: [ moCategory.WBC, moCategory.YEAST ],
}

export const arrowDirection = {
    LEFT: 'left',
    RIGHT: 'right',
}

export const beforeAfterStatus = {
    BEFORE: 'before',
    AFTER: 'after',
};

const test = [
    {
        "id": "0",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
                "count": "25",
                "classNm": "EP Cell",
                "afterGrade": "Rare",
                "beforeGrade": "Moderate"
            },
            {
                "count": "10",
                "classNm": "WBC",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            },
            {
                "count": "1",
                "classNm": "Yeast",
                "afterGrade": "None",
                "beforeGrade": "Exist"
            },
            {
                "count": "0",
                "classNm": "Hyphae",
                "afterGrade": "None",
                "beforeGrade": "None"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_001_000.bmp",
        "classInfo": [
            {
                "count": "36",
                "classNm": "GPC",
                "afterGrade": "Moderate",
                "beforeGrade": "Many"
            },
            {
                "count": "14",
                "classNm": "GNB",
                "afterGrade": "Moderate",
                "beforeGrade": "Few"
            },
            {
                "count": "14",
                "classNm": "GPB",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "14",
                "classNm": "GNDC",
                "afterGrade": "Moderate",
                "beforeGrade": "Few"
            }
        ]
    },
    {
        "id": "0",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "25",
                "classNm": "EP Cell",
                "afterGrade": "Rare",
                "beforeGrade": "Few"
            },
            {
                "count": "10",
                "classNm": "WBC",
                "afterGrade": "Rare",
                "beforeGrade": "Moderate"
            },
            {
                "count": "1",
                "classNm": "Yeast",
                "afterGrade": "Exist",
                "beforeGrade": "None"
            },
            {
                "count": "0",
                "classNm": "Hyphae",
                "afterGrade": "None",
                "beforeGrade": "None"
            }
        ]
    },
    {
        "id": "1",
        "name": "AR_PB-0036_004_000.bmp",
        "classInfo": [
            {
                "count": "36",
                "classNm": "GPC",
                "afterGrade": "Few",
                "beforeGrade": "Many"
            },
            {
                "count": "14",
                "classNm": "GNB",
                "afterGrade": "Few",
                "beforeGrade": "Moderate"
            },
            {
                "count": "14",
                "classNm": "GPB",
                "afterGrade": "Few",
                "beforeGrade": "Moderate"
            },
            {
                "count": "14",
                "classNm": "GNDC",
                "afterGrade": "Many",
                "beforeGrade": "Moderate"
            }
        ]
    },
    {
        "id": "2",
        "classInfo": [
            {
                "count": "36",
                "classNm": "GPC",
                "afterGrade": "Moderate",
                "beforeGrade": "Many"
            },
            {
                "count": "14",
                "classNm": "GNB",
                "afterGrade": "Moderate",
                "beforeGrade": "Few"
            },
            {
                "count": "14",
                "classNm": "GPB",
                "afterGrade": "Few",
                "beforeGrade": "Few"
            },
            {
                "count": "14",
                "classNm": "GNDC",
                "afterGrade": "Moderate",
                "beforeGrade": "Few"
            }
        ]
    }
]