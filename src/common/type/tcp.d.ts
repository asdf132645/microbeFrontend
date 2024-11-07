export interface ClassInfoInterface {
    classId: string;
    count: number;
}

export interface MoInfoInterface {
    id: number;
    name: string;
    LPCount?: number;
    HPCount?: number;
    classInfo: ClassInfoInterface[]
}

export interface SlotInfoInterface {
    slotNo: string;
    barcodeNo: string;
    patientId: string;
    patientNm: string;
    gender: string;
    birthDay: string;
    slotId: string;
    orderDttm: string;
    analyzedDttm: string;
    stateCd: string;
    tactTime: string;
    testType: string;
    MOInfo: MoInfoInterface[];
}

export interface DefaultResponseInterface {
    resultCd: string;
    resultMsg: string;
    jobCmd: string;
    errorLevel: string;
}

export interface RUNNING_INFO_INTERFACE extends DefaultResponseInterface {
    processingCode: number;
    iCasStat: string;
    oCasStat: string;
    cassetId: string;
    slotInfo: SlotInfoInterface;
    workingDone?: string;
    iCasExist?: string;
    oCasExist?: string;
}

export interface SYS_INFO_INTERFACE extends DefaultResponseInterface {
    isInit: string;
    oilCount: string;
    isDoorOpen: string;
    eqStatCd: string;
    isRecovery: string;
    storageSize: string;
    isBfMode: string;
    activationCards: any;
    currentCardCount: string;
    currentCardName: string;
    currentSerialNo: string;
    deviceBarcode: string;
    siteCd: string;
    iCasStat: number;
    oCasStat: number;
}