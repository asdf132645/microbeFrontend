import type { GramRange } from "@/common/defines/constFile/settings/settings.dto";

export const LOW_POWER_CAPTURE_COUNT_LIST = [
    { value: '10', text: '10' },
    { value: '20', text: '20' },
    { value: '30', text: '30' },
    { value: '40', text: '40' },
    { value: '50', text: '50' },
]

export const DEFAULT_CBC_LIST = [
    { cd: '01', classCd: 'clusters', fullNm: 'GPC Clusters' },
    { cd: '02', classCd: 'pairs', fullNm: 'GPC Pairs' },
    { cd: '03', classCd: 'chains', fullNm: 'GPC Chains' },
    { cd: '04', classCd: '', fullNm: 'GNB' },
    { cd: '05', classCd: 'small', fullNm: 'GPB Small' },
    { cd: '06', classCd: 'large', fullNm: 'GPB Large' },
    { cd: '07', classCd: '', fullNm: 'GNDC' },
    { cd: '08', classCd: '', fullNm: 'GNCB' },
    { cd: '09', classCd: '', fullNm: 'Yeast' },
    { cd: '10', classCd: '', fullNm: 'WBC' },
    { cd: '11', classCd: '', fullNm: 'GPC' },
    { cd: '12', classCd: '', fullNm: 'GPB' },
    { cd: '13', classCd: '', fullNm: 'EP Cell' },
    { cd: '14', classCd: '', fullNm: 'Hyphae' },
];

export const DEFAULT_GRAM_RANGE: GramRange[] = [
    {
        fullNm: 'WBC',
        classId: '01',
        fewBoundary: 1,
        rareBoundary: 6,
        moderateBoundary: 30,
    },
    {
        fullNm: 'EP Cell',
        classId: '02',
        fewBoundary: 1,
        rareBoundary: 6,
        moderateBoundary: 30,
    },
    {
        fullNm: 'Gram',
        classId: '03',
        fewBoundary: 1,
        rareBoundary: 6,
        moderateBoundary: 30,
    },
]

export const GRAM_RANGE_UNIT = { LPF: 'LPF', HPF: 'HPF' };

export const DEFAULT_IMAGE_PRINT = [
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

export const defaultCellImageAnalyzed = {
    analysisType: '',
    iaRootPath: 'D:\\MOIA_proc',
    LPCaptureCount: '20',
    isAlarm: false,
    alarmCount: '5',
    keepPage: false,
    backupPath: '',
    backupStartDate: new Date(),
    backupEndDate: new Date(),
    autoBackUpMonth: 'Not selected',
    autoBackUpStartDate: new Date(),
}