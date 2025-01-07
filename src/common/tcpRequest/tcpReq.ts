import {getDateTimeStr, getDateTimeStrForUI} from "@/common/lib/utils/dateUtils";
import {JOB_CMD} from "@/common/defines/constFile/analysis/analysis";

export const tcpReq:any = () => {
    const reqDttm = getDateTimeStr(); // 현재 날짜와 시간을 가져오는 함수
    const saveReqDttm = getDateTimeStrForUI();

    return {
        embedStatus: {
            start: {
                jobCmd: JOB_CMD.START,
                reqUserId: '',
                testType: "",
                wbcCount: "",
                reqDttm: reqDttm
            },
            startAction: {
                jobCmd: JOB_CMD.START,
                reqUserId: '',
                testType: '06',
                LPCount: '10',
                reqDttm: reqDttm,
            },
            init: {
                jobCmd: JOB_CMD.INIT,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            restart: {
                jobCmd: JOB_CMD.RESTART,
                reqUserId: '',
                reqDttm: reqDttm,
                bfSelectFiles: []
            },
            stop: {
                jobCmd: JOB_CMD.STOP,
                reqUserId: '',
                reqDttm: reqDttm,
                isEmergency: 'N',
                isUserStop: 'Y'
            },
            end: {
                jobCmd: JOB_CMD.END,
                reqUserId: '',
                testType: "",
                wbcCount: "",
                reqDttm: reqDttm
            },
            runningInfo: {
                jobCmd: JOB_CMD.RUNNING_INFO,
                reqUserId: '',
                reqDttm: reqDttm
            },
            sysInfo: {
                jobCmd: JOB_CMD.SYSINFO,
                reqUserId: '',
                reqDttm: reqDttm,
                isRewindingBelt: false,
                autoStart: 1,
            },
            pause: {
                jobCmd: JOB_CMD.PAUSE,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            runIngComp: {
                jobCmd: JOB_CMD.RUNNING_COMP,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            recovery: {
                jobCmd: JOB_CMD.RECOVERY,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            settings: {
                jobCmd: JOB_CMD.SETTINGS,
                reqUserId: '',
                reqDttm: reqDttm,
                saveReqDttm: saveReqDttm,
                pbiaRootDir: 'D:/MOIA_proc',
                oilCount: '',
                isOilReset: '',
                deviceType: '03',
            },
            oilPrime: {
                jobCmd: JOB_CMD.OIL_PRIME,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            gripperOpen: {
                jobCmd: JOB_CMD.GRIPPER_OPEN,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            cameraReset: {
                jobCmd: JOB_CMD.CAMERA_RESET,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            exit: {
                jobCmd: JOB_CMD.CLIENT_EXIT,
                reqUserId: '',
                reqDttm: reqDttm,
            },
            searchCardCount: {
                jobCmd: JOB_CMD.SEARCH_CARD_COUNT,
                reqUserId: '',
                reqDttm: reqDttm,
                testType: '',
            },
            errorClear: {
                jobCmd: JOB_CMD.ERROR_CLEAR,
                reqUserId: '',
                reqDttm: reqDttm,
            }
        },
    };
};
