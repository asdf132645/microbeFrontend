// runing-info.interface.ts

interface RunningInfoRequest {
    id: number;
    lock_status: boolean;
    traySlot: string;
    slotNo: string;
    barcodeNo: string;
    patientId: string;
    patientNm: string;
    gender: string;
    birthDay: string;
    slotId: string;
    orderDttm: string;
    testType: string;
    analyzedDttm: string;
    tactTime: string;
    cassetId: string;
    isNormal: boolean;
    classInfo: ClassInfo[];
    submitState: string;
    submitOfDate: Date;
    submitUserId: string;
    memo: string;
    pcIp: string;
    cbcPatientNo: string;
    cbcPatientNm: string;
    cbcSex: string;
    cbcAge: string;
    img_drive_root_path: string;
}

interface RunningInfoResponse {
    id: number;
    lock_status: boolean;
    traySlot: string;
    slotNo: string;
    barcodeNo: string;
    patientId: string;
    patientNm: string;
    gender: string;
    birthDay: string;
    slotId: string;
    orderDttm: string;
    testType: string;
    analyzedDttm: string;
    tactTime: string;
    cassetId: string;
    isNormal: boolean;
    classInfo: ClassInfo[];
    submitState: string;
    submitOfDate: Date;
    submitUserId: string;
    memo: string;
    pcIp: string;
    cbcPatientNo: string;
    cbcPatientNm: string;
    cbcSex: string;
    cbcAge: string;
    img_drive_root_path: string;
}

interface ClassInfo {
    id: string;
    name?: string;
    classInfo: ClassInfoType[];
}

export interface ClassInfoType {
    count: string;
    classId: string;
    beforeGrade: string;
    afterGrade: string;
}


interface RunningInfoRes {
    data: any[];
    total: number;
    page: number;
}

interface RuningInfoApiRequest {
    page: number;
    pageSize: number;
    startDay: string;
    endDay: string;
    barcodeNo?: string | undefined;
    patientId?: string | undefined;
    patientNm?: string | undefined;
    title?: string[] | [];
    nrCount?: number;
}


export { RuningInfoApiRequest, RunningInfoRequest, RunningInfoResponse };
