export const lowPowerCaptureCountList = [
    { value: '10', text: '10' },
    { value: '20', text: '20' },
    { value: '30', text: '30' },
    { value: '40', text: '40' },
    { value: '50', text: '50' },
]

export const defaultCbcList = [
    {cd: '01', classCd: 'diff', fullNm: 'WBC Diff. Count', isSelected: true},
    {cd: '02', classCd: 'seg', fullNm: 'Seg.-neutrophils', isSelected: true},
    {cd: '03', classCd: 'band', fullNm: 'Band-neutrophils', isSelected: true},
    {cd: '04', classCd: '', fullNm: 'Lymphocytes', isSelected: true},
    {cd: '05', classCd: '', fullNm: 'Monocytes', isSelected: true},
    {cd: '06', classCd: '', fullNm: 'Eosinophils', isSelected: true},
    {cd: '07', classCd: '', fullNm: 'Basophils', isSelected: true},
    {cd: '08', classCd: '', fullNm: 'Metamyelocytes', isSelected: true},
    {cd: '09', classCd: '', fullNm: 'Myelocytes', isSelected: true},
    {cd: '10', classCd: '', fullNm: 'Promyelocytes', isSelected: true},
    {cd: '11', classCd: '', fullNm: 'Blasts', isSelected: true},
    {cd: '12', classCd: '', fullNm: 'Immature cells', isSelected: true},
    {cd: '13', classCd: '', fullNm: 'Atypical cells', isSelected: true},
    {cd: '14', classCd: '', fullNm: 'Atypical lymphocyte', isSelected: true},
    {cd: '15', classCd: '', fullNm: 'Activated lymphocyte', isSelected: true},
    {cd: '16', classCd: '', fullNm: 'Prolymphocytes', isSelected: true},
    {cd: '17', classCd: '', fullNm: 'Promonocytes', isSelected: true},
    {cd: '18', classCd: '', fullNm: 'Plasma cells', isSelected: true},
    {cd: '19', classCd: '', fullNm: 'Nucleated RBC', isSelected: true},
    {cd: '20', classCd: '', fullNm: 'Others', isSelected: true},
    {cd: '21', classCd: '', fullNm: 'Atypical Lymphoid cells', isSelected: true},
    {cd: '22', classCd: '', fullNm: 'Leukemic cells', isSelected: true},
    {cd: '23', classCd: '', fullNm: 'Abnormal lymphocyte', isSelected: true},
    {cd: '24', classCd: '', fullNm: 'Reactive lymphocyte', isSelected: true},
    {cd: '25', classCd: '', fullNm: 'Plasmacytoid lymphocyte', isSelected: true},
    {cd: '26', classCd: '', fullNm: 'ANC calc', isSelected: true},
    {cd: '27', classCd: '', fullNm: 'WBC', isSelected: true},
    {cd: '28', classCd: '', fullNm: 'RBC', isSelected: true},
    {cd: '29', classCd: '', fullNm: 'HGB', isSelected: true},
    {cd: '30', classCd: '', fullNm: 'HCT', isSelected: true},
    {cd: '31', classCd: '', fullNm: 'MCV', isSelected: true},
    {cd: '32', classCd: '', fullNm: 'MCH', isSelected: true},
    {cd: '33', classCd: '', fullNm: 'MCHC', isSelected: true},
    {cd: '34', classCd: '', fullNm: 'RDW', isSelected: true},
    {cd: '35', classCd: '', fullNm: 'Platelet', isSelected: true},
    {cd: '36', classCd: '', fullNm: 'PCT', isSelected: true},
    {cd: '37', classCd: '', fullNm: 'MPV', isSelected: true},
    {cd: '38', classCd: '', fullNm: 'PDW', isSelected: true},
    {cd: '39', classCd: '', fullNm: 'ESR', isSelected: true}
];

export const defaultGramRange = [
    {
        abbreviation: 'WBC',
        fullNm: 'WBC',
        classId: '01',
        rareMost: '0',
        fewLeast: '1',
        fewMost: '5',
        moderateLeast: '6',
        moderateMost: '30',
        manyLeast: '31',
        unit: 'LPF',
    },
    {
        abbreviation: 'EP Cell',
        fullNm: 'EP Cell',
        classId: '02',
        rareMost: '0',
        fewLeast: '1',
        fewMost: '5',
        moderateLeast: '6',
        moderateMost: '30',
        manyLeast: '31',
        unit: 'LPF',
    },
    {
        abbreviation: 'Gram',
        fullNm: 'Gram',
        classId: '03',
        rareMost: '0',
        fewLeast: '1',
        fewMost: '5',
        moderateLeast: '6',
        moderateMost: '30',
        manyLeast: '31',
        unit: 'HPF',
    },
]

export const defaultImagePrint = [
    { fullNm: '1', classId: '01', checked: false },
    { fullNm: '2', classId: '02', checked: false },
    { fullNm: '3', classId: '03', checked: false },
    { fullNm: '4', classId: '04', checked: false },
    { fullNm: '5', classId: '05', checked: false },
    { fullNm: '6', classId: '06', checked: false },
    { fullNm: '7', classId: '07', checked: false },
    { fullNm: '8', classId: '08', checked: false },
    { fullNm: '9', classId: '09', checked: false },
    { fullNm: '10', classId: '10', checked: false },
    { fullNm: '11', classId: '11', checked: false },
]

export const lisHotKeyAndLisFilePathAndUrl =[
    { lisHotKey: '', lisFilePath:'', cbcFilePath:'' },
]

export const barcodeImgDir = {
    barcodeDirName: '00_Barcode_Image'
}

export const dirName = {
    howellJollyDirName: '19_Howell_jolly',
    malariaDirName: '43_InclusionBody_Malaria',
    noMalariaDirName: '44_InclusionBody_NoMalaria',
    rbcClassDirName: '03_RBC_Classification',
    rbcImageDirName: '02_RBC_Image',
    barcodeDirName: '00_Barcode_Image',
    wbcClassDirName: '01_WBC_Classification',
    bfDirName: '02_LowPower_Image',
    bfHighDirName: '03_HighPower_Image',
    bfClassDirName: '05_BF_Classification',
    iaRootPath: 'D:/ia_proc',
}

export const settingName = {
    cellImageAnalyzed: 'cellImageAnalyzed',
    gramRange: 'gramRange',
    normalRange: 'normalRange',
    imagePrint: 'imagePrint',
    cbcCode: 'cbcCode',
    filePathSet: 'filePathSet',
}