export interface CellImgAnalyzedRequest {
    analysisType: string;
    iaRootPath: string;
    isAlarm: boolean;
    LPCaptureCount: string;
    alarmCount: string;
    keepPage: boolean;
    backupPath: string;
    backupStartDate: string;
    backupEndDate: string;
    autoBackUpMonth: string;
    autoBackUpStartDate: Date;
}

export interface CellImgAnalyzedResponse {
    analysisType: string;
    iaRootPath: string;
    LPCaptureCount: string;
    isAlarm: boolean;
    alarmCount: string;
    keepPage: boolean;
    backupPath: string;
    backupStartDate: Date;
    backupEndDate: Date;
    autoBackUpMonth: string;
    autoBackUpStartDate: Date;
}