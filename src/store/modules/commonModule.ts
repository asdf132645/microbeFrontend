// commonModule.ts
import {Commit} from 'vuex';
import {CellImgAnalyzedResponse} from "@/common/api/service/setting/dto/cellImgAnalyzedDto";
import {DEFAULT_CELL_IMAGE_ANALYZED} from "@/common/defines/constFile/settings/settings";

export interface CommonState {
    startEmbedded: boolean;
    eqStatCd: number;
    isRunningState: boolean;
    totalCount: string;
    embeddedNumber: string;
    isAlarm: boolean;
    bfSelectFiles: any[];
    slideProceeding: string;
    totalSlideTime: string;
    iaRootPath: string;
    runningSlotId: string;
    isRequestInProgress: boolean;
    startInfoBoolen: boolean;
    runningInfoBoolen: boolean;
    runningInfoStop: boolean;
    reqArr: any[];
    resFlag: boolean;
    firstLoading: boolean;
    slotIndex: number;
    viewerCheck: string;
    runningArr: any;
    classArr: any[];
    rbcArr: any[];
    processInfo: any[];
    orderList: any[];
    loginSetData: string;
    siteCd: string;
    deviceSerialNm: string;
    cbcLayer: boolean;
    rbcReData: boolean;
    rbcInfoAfterData: any[];
    resetRbcArr: boolean;
    selectedSampleId: string;
    classInfoArr: any[];
    dataBasePageReset: boolean;
    resetAnalyzing: boolean;
    testType: string;
    analysisType: string;
    beforeSettingFormattedString: string;
    afterSettingFormattedString: string;
    settingChangedChecker: boolean;
    dbListDataFirstNum: number;
    dbListDataLastNum: number;
    isTcpConnected: boolean;
    initValData: boolean;
    enteringRouterPath: string;
    settingType: string;
    isDownloadOrUploading: boolean;
    cellImageAnalyzedSetting: CellImgAnalyzedResponse;
    currentSelectItems: any;
    currentImageIndex: number;
    currentImageName: string;
}

interface CommonModule {
    namespaced: true;
    state: () => CommonState;
    mutations: {
        setStartEmbedded: (state: CommonState, value: boolean) => void;
        setEqStatCd: (state: CommonState, value: number) => void;
        setIsRunningState: (state: CommonState, value: boolean) => void;
        setTotalCount: (state: CommonState, value: string) => void;
        setEmbeddedNumber: (state: CommonState, value: string) => void;
        setIsAlarm: (state: CommonState, value: boolean) => void;
        setBfSelectFiles: (state: CommonState, value: []) => void;
        setSlideProceeding: (state: CommonState, value: string) => void;
        setTotalSlideTime: (state: CommonState, value: string) => void;
        setIaRootPath: (state: CommonState, value: string) => void;
        setRunningSlotId: (state: CommonState, value: string) => void;
        setIsRequestInProgress: (state: CommonState, value: boolean) => void;
        setStartInfoBoolen: (state: CommonState, value: boolean) => void;
        setRunningInfoBoolen: (state: CommonState, value: boolean) => void;
        setRunningInfoStop: (state: CommonState, value: boolean) => void;
        setReqArr: (state: CommonState, value: string[]) => void;
        shiftReqArr: (state: CommonState) => void;
        setReqArrPaste: (state: CommonState, value: any[]) => void;
        setResFlag: (state: CommonState, value: boolean) => void;
        setFirstLoading: (state: CommonState, value: boolean) => void;
        setSlotIndex: (state: CommonState, value: number) => void;
        setViewerCheck: (state: CommonState, value: string) => void;
        setRunningArr: (state: CommonState, value: any) => void;
        setClassArr: (state: CommonState, value: any[]) => void;
        setRbcArr: (state: CommonState, value: any[]) => void;
        setProcessInfo: (state: CommonState, value: any[]) => void;
        setOrderList: (state: CommonState, value: any[]) => void;
        setLoginSetData: (state: CommonState, value: string) => void;
        setSiteCd: (state: CommonState, value: string) => void;
        setDeviceSerialNm: (state: CommonState, value: string) => void;
        setCbcLayer: (state: CommonState, value: boolean) => void;
        setRbcReData: (state: CommonState, value: boolean) => void;
        setRbcInfoAfterData: (state: CommonState, value: any[]) => void;
        setResetRbcArr: (state: CommonState, value: boolean) => void;
        setSelectedSampleId: (state: CommonState, value: string) => void;
        setClassInfoArr: (state: CommonState, value: any[]) => void;
        setDataBasePageReset: (state: CommonState, value: boolean) => void;
        setResetAnalyzing: (state: CommonState, value: boolean) => void;
        setTestType: (state: CommonState, value: string) => void;
        setAnalysisType: (state: CommonState, value: string) => void;
        setBeforeSettingFormattedString: (state: CommonState, value: string) => void;
        setAfterSettingFormattedString: (state: CommonState, value: string) => void;
        setSettingChangedChecker: (state: CommonState, value: boolean) => void;
        setDbListDataFirstNum: (state: CommonState, value: number) => void;
        setDbListDataLastNum: (state: CommonState, value: number) => void;
        setIsTcpConnected: (state: CommonState, value: boolean) => void;
        setInitValData: (state: CommonState, value: boolean) => void;
        setEnteringRouterPath: (state: CommonState, value: string) => void;
        setSettingType: (state: CommonState, value: string) => void;
        setIsDownloadOrUploading: (state: CommonState, value: boolean) => void;
        setCellImageAnalyzedSetting: (state: CommonState, value: CellImgAnalyzedResponse) => void;
        setCurrentSelectItems: (state: CommonState, value: any) => void;
        setCurrentImageIndex: (state: CommonState, value: number) => void;
        setCurrentImageName: (state: CommonState, value: string) => void;
    };
    actions: {
        setCommonInfo: (context: { commit: Commit }, payload: CommonState) => void;
    };
}

export const commonModule: CommonModule = {
    namespaced: true,
    state: () => ({
        startEmbedded: false,
        eqStatCd: 0,
        isRunningState: false,
        totalCount: '',
        embeddedNumber: '',
        isAlarm: false,
        bfSelectFiles: [],
        slideProceeding: '',
        totalSlideTime: '00:00:00',
        iaRootPath: 'D:\\MOIA_proc',
        runningSlotId: '',
        isRequestInProgress: false,
        startInfoBoolen: false,
        runningInfoBoolen: false,
        runningInfoStop: false,
        reqArr: [],
        resFlag: true,
        firstLoading: false,
        slotIndex: 0,
        viewerCheck: '',
        runningArr: [],
        classArr: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        rbcArr: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        processInfo: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        orderList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        loginSetData: '',
        siteCd: '',
        deviceSerialNm: '',
        cbcLayer: false,
        rbcReData: false,
        rbcInfoAfterData: [],
        resetRbcArr: false,
        selectedSampleId: '',
        classInfoArr:[],
        dataBasePageReset: false,
        resetAnalyzing: false,
        testType: '',
        analysisType: '',
        beforeSettingFormattedString: '',
        afterSettingFormattedString: '',
        settingChangedChecker: false,
        dbListDataFirstNum: 0,
        dbListDataLastNum: 0,
        isTcpConnected: false,
        initValData: false,
        enteringRouterPath: '',
        settingType: '',
        isDownloadOrUploading: false,
        cellImageAnalyzedSetting: DEFAULT_CELL_IMAGE_ANALYZED,
        currentSelectItems: {},
        currentImageIndex: 0,
        currentImageName: '',
    }),
    mutations: {
        setStartEmbedded(state: CommonState, value: boolean): void {
            state.startEmbedded = value;
        },
        setEqStatCd(state: CommonState, value: number): void {
            state.eqStatCd = value;
        },
        setIsRunningState(state: CommonState, value: boolean): void {
            state.isRunningState = value;
        },
        setTotalCount(state: CommonState, value: string): void {
            state.totalCount = value;
        },
        setEmbeddedNumber(state: CommonState, value: string): void {
            state.embeddedNumber = value;
        },
        setIsAlarm(state: CommonState, value: boolean): void {
            state.isAlarm = value;
        },
        setBfSelectFiles(state: CommonState, value: any[]): void {
            state.bfSelectFiles = value;
        },
        setSlideProceeding(state: CommonState, value: string): void {
            state.slideProceeding = value;
        },
        setTotalSlideTime(state: CommonState, value: string): void {
            state.totalSlideTime = value;
        },
        setIaRootPath(state: CommonState, value: string): void {
            state.iaRootPath = value;
        },
        setRunningSlotId(state: CommonState, value: string): void {
            state.runningSlotId = value;
        },
        setIsRequestInProgress(state: CommonState, value: boolean): void {
            state.isRequestInProgress = value;
        },
        setStartInfoBoolen(state: CommonState, value: boolean): void {
            state.startInfoBoolen = value;
        },
        setRunningInfoBoolen(state: CommonState, value: boolean): void {
            state.runningInfoBoolen = value;
        },
        setRunningInfoStop(state: CommonState, value: boolean): void {
            state.runningInfoStop = value;
        },
        setReqArr(state: CommonState, value: any[]): void {
            if (!state.reqArr) {
                state.reqArr = []; // 배열이 없으면 빈 배열로 초기화
            }
            state.reqArr.push(value);
        },
        shiftReqArr(state: CommonState): void {
            state.reqArr.shift();
        },
        setReqArrPaste(state: CommonState, value: any[]): void {
            state.reqArr = value;
        },
        setResFlag(state: CommonState, value: boolean): void {
            state.resFlag = value;
        },
        setFirstLoading(state: CommonState, value: boolean): void {
            state.firstLoading = value;
        },
        setSlotIndex(state: CommonState, value: number): void {
            state.slotIndex = value;
        },
        setViewerCheck(state: CommonState, value: string): void {
            state.viewerCheck = value;
        },
        setRunningArr(state: CommonState, value: any[]): void {
            state.runningArr = value;
        },
        setClassArr(state: CommonState, value: any[]): void {
            state.classArr = value;
        },
        setRbcArr(state: CommonState, value: any[]): void {
            state.rbcArr = value;
        },
        setProcessInfo(state: CommonState, value: any[]): void {
            state.processInfo = value;
        },
        setOrderList(state: CommonState, value: any[]): void {
            state.orderList = value;
        },
        setLoginSetData(state: CommonState, value: string): void {
            state.loginSetData = value;
        },
        setDeviceSerialNm(state: CommonState, value: string): void {
            state.deviceSerialNm = value;
        },
        setSiteCd(state: CommonState, value: string): void {
            state.siteCd = value;
        },
        setSelectedSampleId(state: CommonState, value: string): void {
            state.selectedSampleId = value;
        },
        setCbcLayer(state: CommonState, value: boolean): void {
            state.cbcLayer = value;
        },
        setRbcReData(state: CommonState, value: boolean): void {
            state.rbcReData = value;
        },
        setResetRbcArr(state: CommonState, value: boolean): void {
            state.resetRbcArr = value;
        },
        setRbcInfoAfterData(state: CommonState, value: any[]): void {
            state.rbcInfoAfterData = value;
        },
        // classInfoArr
        setClassInfoArr(state: CommonState, value: any[]): void {
            state.classInfoArr = value;
        },
        setDataBasePageReset(state: CommonState, value: boolean): void {
            state.dataBasePageReset = value;
        },
        setResetAnalyzing(state: CommonState, value: boolean): void {
            state.resetAnalyzing = value;
        },
        setTestType(state: CommonState, value: string): void {
            state.testType = value;
        },
        setAnalysisType(state: CommonState, value: string): void {
            state.analysisType = value;
        },
        setBeforeSettingFormattedString(state: CommonState, value: string): void {
            state.beforeSettingFormattedString = value;
        },
        setAfterSettingFormattedString(state: CommonState, value: string): void {
            state.afterSettingFormattedString = value;
        },
        setSettingChangedChecker(state: CommonState, value: boolean): void {
            state.settingChangedChecker = value;
        },
        setDbListDataFirstNum(state: CommonState, value: number): void {
            state.dbListDataFirstNum = value;
        },
        setDbListDataLastNum(state: CommonState, value: number): void {
            state.dbListDataLastNum = value;
        },
        setIsTcpConnected(state: CommonState, value: boolean): void {
            state.isTcpConnected = value;
        },
        setInitValData(state: CommonState, value: boolean): void {
            state.initValData = value;
        },
        setEnteringRouterPath(state: CommonState, value: string): void {
            state.enteringRouterPath = value;
        },
        setSettingType(state: CommonState, value: string): void {
            state.settingType = value;
        },
        setIsDownloadOrUploading(state: CommonState, value: boolean): void {
            state.isDownloadOrUploading = value;
        },
        setCellImageAnalyzedSetting(state: CommonState, value: CellImgAnalyzedResponse): void {
            state.cellImageAnalyzedSetting = value;
        },
        setCurrentSelectItems(state: CommonState, value: any): void {
            state.currentSelectItems = value;
        },
        setCurrentImageIndex(state: CommonState, value: number): void {
            state.currentImageIndex = value;
        },
        setCurrentImageName(state: CommonState, value: string): void {
            state.currentImageName = value;
        }
    },
    actions: {
        setCommonInfo({commit}: { commit: Commit }, payload: CommonState): void {
            if (payload.hasOwnProperty('startEmbedded')) {
                commit('setStartEmbedded', payload.startEmbedded);
            }

            if (payload.hasOwnProperty('eqStatCd')) {
                commit('setEqStatCd', payload.eqStatCd);
            }

            if (payload.hasOwnProperty('isRunningState')) {
                commit('setIsRunningState', payload.isRunningState);
            }

            if (payload.hasOwnProperty('totalCount')) {
                commit('setTotalCount', payload.totalCount);
            }
            if (payload.hasOwnProperty('embeddedNumber')) {
                commit('setEmbeddedNumber', payload.embeddedNumber);
            }
            if (payload.hasOwnProperty('isAlarm')) {
                commit('setIsAlarm', payload.isAlarm);
            }
            if (payload.hasOwnProperty('bfSelectFiles')) {
                commit('setBfSelectFiles', payload.bfSelectFiles);
            }
            if (payload.hasOwnProperty('slideProceeding')) {
                commit('setSlideProceeding', payload.slideProceeding);
            }
            if (payload.hasOwnProperty('totalSlideTime')) {
                commit('setTotalSlideTime', payload.totalSlideTime);
            }
            if (payload.hasOwnProperty('iaRootPath')) {
                commit('setIaRootPath', payload.iaRootPath);
            }
            if (payload.hasOwnProperty('runningSlotId')) {
                commit('setRunningSlotId', payload.runningSlotId);
            }
            if (payload.hasOwnProperty('isRequestInProgress')) {
                commit('setIsRequestInProgress', payload.isRequestInProgress);
            }
            if (payload.hasOwnProperty('startInfoBoolen')) {
                commit('setStartInfoBoolen', payload.startInfoBoolen);
            }
            if (payload.hasOwnProperty('runningInfoBoolen')) {
                commit('setRunningInfoBoolen', payload.runningInfoBoolen);
            }
            if (payload.hasOwnProperty('runningInfoStop')) {
                commit('setRunningInfoStop', payload.runningInfoStop);
            }
            if (payload.hasOwnProperty('reqArr')) {
                commit('setReqArr', payload.reqArr);
            }
            if (payload.hasOwnProperty('shiftReqArr')) {
                commit('shiftReqArr');
            }
            if (payload.hasOwnProperty('reqArrPaste')) {
                commit('setReqArrPaste', payload.reqArr);
            }
            if (payload.hasOwnProperty('resFlag')) {
                commit('setResFlag', payload.resFlag);
            }
            if (payload.hasOwnProperty('firstLoading')) {
                commit('setFirstLoading', payload.firstLoading);
            }
            if (payload.hasOwnProperty('slotIndex')) {
                commit('setSlotIndex', payload.slotIndex);
            }
            if (payload.hasOwnProperty('viewerCheck')) {
                commit('setViewerCheck', payload.viewerCheck);
            }
            if (payload.hasOwnProperty('runningArr')) {
                commit('setRunningArr', payload.runningArr);
            }
            if (payload.hasOwnProperty('classArr')) {
                commit('setClassArr', payload.classArr);
            }
            if (payload.hasOwnProperty('rbcArr')) {
                commit('setRbcArr', payload.rbcArr);
            }
            if (payload.hasOwnProperty('processInfo')) {
                commit('setProcessInfo', payload.processInfo);
            }
            if (payload.hasOwnProperty('orderList')) {
                commit('setOrderList', payload.orderList);
            }
            if (payload.hasOwnProperty('loginSetData')) {
                commit('setLoginSetData', payload.loginSetData);
            }
            if (payload.hasOwnProperty('siteCd')) {
                commit('setSiteCd', payload.siteCd);
            }
            if (payload.hasOwnProperty('deviceSerialNm')) {
                commit('setDeviceSerialNm', payload.deviceSerialNm);
            }
            if (payload.hasOwnProperty('selectedSampleId')) {
                commit('setSelectedSampleId', payload.selectedSampleId)
            }
            if (payload.hasOwnProperty('cbcLayer')) {
                commit('setCbcLayer', payload.cbcLayer)
            }
            if (payload.hasOwnProperty('rbcReData')) {
                commit('setRbcReData', payload.rbcReData)
            }
            if (payload.hasOwnProperty('rbcInfoAfterData')) {
                commit('setRbcInfoAfterData', payload.rbcInfoAfterData)
            }
            if(payload.hasOwnProperty('resetRbcArr')) {
                commit('setResetRbcArr', payload.resetRbcArr)
            }
            if(payload.hasOwnProperty('classInfoArr')) {
                commit('setClassInfoArr', payload.classInfoArr)
            }
            if (payload.hasOwnProperty('dataBasePageReset')){
                commit('setDataBasePageReset', payload.dataBasePageReset);
            }
            if (payload.hasOwnProperty('resetAnalyzing')){
                commit('setResetAnalyzing', payload.resetAnalyzing);
            }
            if (payload.hasOwnProperty('testType')){
                commit('setTestType', payload.testType);
            }
            if (payload.hasOwnProperty('analysisType')) {
                commit('setAnalysisType', payload.analysisType);
            }
            if (payload.hasOwnProperty('beforeSettingFormattedString')) {
                commit('setBeforeSettingFormattedString', payload.beforeSettingFormattedString);
            }
            if (payload.hasOwnProperty('afterSettingFormattedString')) {
                commit('setAfterSettingFormattedString', payload.afterSettingFormattedString);
            }
            if (payload.hasOwnProperty('settingChangedChecker')) {
                commit('setSettingChangedChecker', payload.settingChangedChecker);
            }
            if (payload.hasOwnProperty('dbListDataFirstNum')) {
                commit('setDbListDataFirstNum', payload.dbListDataFirstNum);
            }
            if (payload.hasOwnProperty('dbListDataLastNum')) {
                commit('setDbListDataLastNum', payload.dbListDataLastNum);
            }
            if (payload.hasOwnProperty('isTcpConnected')) {
                commit('setIsTcpConnected', payload.isTcpConnected);
            }
            if (payload.hasOwnProperty('initValData')) {
                commit('setInitValData', payload.initValData);
            }
            if (payload.hasOwnProperty('enteringRouterPath')) {
                commit('setEnteringRouterPath', payload.enteringRouterPath);
            }
            if (payload.hasOwnProperty('settingType')) {
                commit('setSettingType', payload.settingType);
            }
            if (payload.hasOwnProperty('isDownloadOrUploading')) {
                commit('setIsDownloadOrUploading', payload.isDownloadOrUploading);
            }
            if (payload.hasOwnProperty('cellImageAnalyzedSetting')) {
                commit('setCellImageAnalyzedSetting', payload.cellImageAnalyzedSetting);
            }
            if (payload.hasOwnProperty('currentSelectItems')) {
                commit('setCurrentSelectItems', payload.currentSelectItems);
            }
            if (payload.hasOwnProperty('currentImageIndex')) {
                commit('setCurrentImageIndex', payload.currentImageIndex);
            }
            if (payload.hasOwnProperty('currentImageName')) {
                commit('setCurrentImageName', payload.currentImageName);
            }
        },
    },
};
