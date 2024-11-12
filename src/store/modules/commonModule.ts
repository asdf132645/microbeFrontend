// commonModule.ts
import { Commit } from 'vuex';
import { CellImgAnalyzedResponse } from "@/common/api/service/setting/dto/cellImgAnalyzedDto";
import { DEFAULT_CELL_IMAGE_ANALYZED } from "@/common/defines/constFile/settings/settings";

export interface CommonState {
    startEmbedded: boolean;
    eqStatCd: number;
    isRunningState: boolean;
    totalCount: string;
    isAlarm: boolean;
    totalSlideTime: string;
    iaRootPath: string;
    runningSlotId: string;
    runningInfoStop: boolean;
    reqArr: any[];
    resFlag: boolean;
    firstLoading: boolean;
    viewerCheck: string;
    runningArr: any;
    processInfo: any[];
    orderList: any[];
    loginSetData: string;
    siteCd: string;
    deviceSerialNm: string;
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
    currentImageName: string;
    currentPowerType: 'LP' | 'HP';
    currentAnalyzingSlotNo: number;
}

interface CommonModule {
    namespaced: true;
    state: () => CommonState;
    mutations: {
        setStartEmbedded: (state: CommonState, value: boolean) => void;
        setEqStatCd: (state: CommonState, value: number) => void;
        setIsRunningState: (state: CommonState, value: boolean) => void;
        setTotalCount: (state: CommonState, value: string) => void;
        setIsAlarm: (state: CommonState, value: boolean) => void;
        setTotalSlideTime: (state: CommonState, value: string) => void;
        setIaRootPath: (state: CommonState, value: string) => void;
        setRunningSlotId: (state: CommonState, value: string) => void;
        setRunningInfoStop: (state: CommonState, value: boolean) => void;
        setReqArr: (state: CommonState, value: string[]) => void;
        shiftReqArr: (state: CommonState) => void;
        setReqArrPaste: (state: CommonState, value: any[]) => void;
        setResFlag: (state: CommonState, value: boolean) => void;
        setFirstLoading: (state: CommonState, value: boolean) => void;
        setViewerCheck: (state: CommonState, value: string) => void;
        setRunningArr: (state: CommonState, value: any) => void;
        setProcessInfo: (state: CommonState, value: any[]) => void;
        setOrderList: (state: CommonState, value: any[]) => void;
        setLoginSetData: (state: CommonState, value: string) => void;
        setSiteCd: (state: CommonState, value: string) => void;
        setDeviceSerialNm: (state: CommonState, value: string) => void;
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
        setCurrentImageName: (state: CommonState, value: string) => void;
        setCurrentPowerType: (state: CommonState, value: 'LP' | 'HP') => void;
        setCurrentAnalyzingSlotNo: (state: CommonState, value: number) => void;
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
        isAlarm: false,
        totalSlideTime: '00:00:00',
        iaRootPath: 'D:\\MOIA_proc',
        runningSlotId: '',
        runningInfoStop: false,
        reqArr: [],
        resFlag: true,
        firstLoading: false,
        viewerCheck: '',
        runningArr: [],
        processInfo: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        orderList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        loginSetData: '',
        siteCd: '',
        deviceSerialNm: '',
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
        currentImageName: '',
        currentAnalyzingSlotNo: 0,
        currentPowerType: 'LP',
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
        setIsAlarm(state: CommonState, value: boolean): void {
            state.isAlarm = value;
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
        setViewerCheck(state: CommonState, value: string): void {
            state.viewerCheck = value;
        },
        setRunningArr(state: CommonState, value: any[]): void {
            state.runningArr = value;
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
        setCurrentImageName(state: CommonState, value: string): void {
            state.currentImageName = value;
        },
        setCurrentAnalyzingSlotNo(state: CommonState, value: number): void {
            state.currentAnalyzingSlotNo = value;
        },
        setCurrentPowerType(state: CommonState, value: 'LP' | 'HP'): void {
            state.currentPowerType = value;
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
            if (payload.hasOwnProperty('isAlarm')) {
                commit('setIsAlarm', payload.isAlarm);
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
            if (payload.hasOwnProperty('viewerCheck')) {
                commit('setViewerCheck', payload.viewerCheck);
            }
            if (payload.hasOwnProperty('runningArr')) {
                commit('setRunningArr', payload.runningArr);
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
            if (payload.hasOwnProperty('currentImageName')) {
                commit('setCurrentImageName', payload.currentImageName);
            }
            if (payload.hasOwnProperty('currentAnalyzingSlotNo')) {
                commit('setCurrentAnalyzingSlotNo', payload.currentAnalyzingSlotNo);
            }
            if (payload.hasOwnProperty('currentPowerType')) {
                commit('setCurrentPowerType', payload.currentPowerType);
            }
        },
    },
};
