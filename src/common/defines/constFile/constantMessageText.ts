export  const MESSAGES = {
    Logout: 'Would you like to log out?',

    // Message
    IDS_MSG_DELETE_ACCOUNT: 'Are you sure you want to delete your account?',
    IDS_MSG_LOGOUT: 'Are you sure you want to logout now?',
    IDS_MSG_DUPLICATE_KEY: 'The %s key is a duplicate key.',
    IDS_MSG_HOTKEY_IN_ENGLISH: 'Please recheck the key',

    IDS_ERROR_CHECK_ID: 'The ID must be 5-20 letters or numbers starting with the alphabet.',
    IDS_ERROR_CHECK_PASSWORD: 'The password is a combination of 6-30 digits in English, numbers.',
    IDS_ERROR_NOT_MATCHED_PASSWORD: 'Passwords do not match.',
    IDS_ERROR_SIGINUP: 'Please check the input field.',
    IDS_ERROR_SIGINUP_ALREADY_ID: 'ID already registered.',
    IDS_ERROR_LOGIN_ERROR: 'Please check your ID and password.',
    IDS_ERROR_LOGIN_ID: 'Please check your Login ID.',
    IDS_ERROR_ALREADY_RUNNING: 'Process is already running.',
    IDS_ERROR_STOP_PROCESS: 'Process is terminating.',
    IDS_ERROR_INIT_ERROR: 'Please initialize.',
    IDS_ERROR_CHECK_REQUIRED_FIELDS: 'Please check required fields',
    IDS_ERROR_CHECK_SLOT_NO: 'Please check the slot number.',
    IDS_ERROR_FAVORITE_MAX_REGIST: 'Up to 5 favorites can be registered.',
    IDS_ERROR_FAVORITE_MAX_REGIST2: 'Up to 12 favorites can be registered.',
    IDS_ERROR_ENTER_YOUR_ORDER_DETAILS: 'Please enter your order details.',
    IDS_ERROR_SELECT_A_TARGET_ITEM: 'Please select items',
    IDS_ERROR_PLEASE_SELECT_AN_IMAGE: 'Please select an image.',
    IDS_ERROR_ALREADY_ADDED: 'This item has already been added.',
    IDS_ERROR_ADD_A_WORKLIST: 'Please add a worklist',
    IDS_ERROR_NO_TEST_RESULTS: 'There are no test results.',
    IDS_ERROR_FILE_CLISSIFICATION: 'File classification error',
    IDS_ERROR_ENTER_CLASS_INFO: 'Please enter class information',
    IDS_ERROR_PLEASE_CONFIRM_YOUR_USER_ID: 'Please confirm your user ID.',

    IDS_DOWNLOAD_COMPLETE: 'Download Complete',
    IDS_SELECT_SLIDE: 'Please select a slide.',
    IDS_SIGNED_ITEMS_CANNOT_BE_MODIFIED: 'Signed items cannot be modified.',
    IDS_RECOVER_GRIPPER_CONDITION: 'Would you like to recover the gripper condition?',
    IDS_PLEASE_ENTER_END_DATE: 'Please enter the end date.',
    IDS_PLEASE_ENTER_START_DATE: 'Please enter the start date.',
    IDS_THE_MAXIMUM_INQUIRY_DATE_IS_31_DAYS: 'The maximum inquiry date is 31 days.',
    IDS_START_DATE_IS_NOT_GREATER_THEN_END_DATE: 'Start date is not greater than end date.',
    IDS_RESTART_SYSTEM: 'A new version has been downloaded. Please restart the application to apply the update.',
    IDS_PLEASE_ENTER_YOUR_BARCODE_NUMBER: 'Please enter your barcode number',
    IDS_BARCODE_REGISTRATION_SUCCESSFUL: 'Barcode registration successful',
    IDS_THIS_IS_A_DUPLICATION_ABBREVIATION: 'This is a duplicate abbreviation.',
    IDS_MSG_UPLOAD_LIS: 'Upload current results to LIS',
    IDS_MSG_SUBMIT_SLIDE: 'Submit slide',
    IDS_MSG_CONFIRM_SLIDE: 'Confirm slide',
    IDS_NO_DATA_FOUND: 'No data found.',
    IDS_MSG_DATA_BACKUP: 'Data from that period will be deleted. Would you like to proceed?',
    IDS_MSG_DATA_RESTORE: 'Do you want to recover your data?',
    IDS_MSG_SIZE_CHROMIA_LINKED_LIS: 'Size and Chromia categories are linked with LIS data.',
    UPLOAD_PLEASE_LIS: 'To upload the LIS, please enter the content in the LIS File Path field under the LIS(CBC) Hot Key & File Path tab in the settings page and save it.',
    UPLOAD_PLEASE_CBC: 'To load CBC, please enter the content in the CBC File Path field under the LIS(CBC) Hot Key & File Path tab in the settings page and save it.',

    UPDATE_SUCCESSFULLY : 'Update Successfully',
    TCP_DiSCONNECTED: 'The TCP connection was disconnected.',
    alreadyInitialized: 'It has already been initialized.',

    lockRow: 'Deletion is not allowed when locked.',
    exit: 'Are you sure you want to quit the program?',

    SETTING_SAVE_SUCCESS: 'Saved successfully',
    SETTING_SAVE_FAILURE: 'Save failed',
    SETTING_UPDATE_SUCCESS: 'Updated successfully',
    SETTING_UPDATE_FAILURE: 'Update failed',
    SETTING_NOT_SAVED: 'Setting not saved',

    ALERT_TYPE_SUCCESS: 'success',
    ALERT_TYPE_ERROR: 'error',

    FAILED_ALERT: 'Failed',
    SUCCESS_ALERT: 'Success',
    SAVE: 'Save',
    LEAVE: 'Leave',
    CANCEL: 'Cancel',
    CLOSE: 'Close',
    COPY: 'Copy',
    MOVE: 'Move',
    DELETE: 'Delete',
    UPLOAD: 'Upload',
    OK: 'Ok',
    SETTING: 'Setting',
} as const;

export const MSG = {
    INFO: {
        DOWNLOAD_SAVE_PATH_ENG: 'Destination path for download and Origin path for upload',
        DOWNLOAD_SAVE_PATH_KOR: '다운로드 시 저장 경로 & 업로드 시 백업 파일 경로',
        UPLOAD_KOR: 'Download Save Path에서 업로드할 폴더 선택 & 데이터 업로드 폴더 경로 선택',
        DOWNLOAD_KOR: '다운로드 받을 날짜 선택 & copy: 다른 컴퓨터로 이동시킬때 사용(데이터 복사)',
        IA_ROOT_PATH_KOR: '검체 데이터 저장 경로 및 다운로드 진행 시 시작 경로',
        ALARM_TIME_KOR: '알람 켜기/끄기 & 타이머(초) 선택',
        KEEP_PAGE_KOR: '데이터베이스 상세 페이지에서 좌측 하단 위, 아래 화살표를 사용하여 검체 이동할 때 탭 유지',

        //  Unused
        KEEP_PAGE_ENG: 'Keep page when moving in Database detail page by up, down arrows',
        UPLOAD_ENG: '',
        DOWNLOAD_ENG: '',
        ALARM_TIME_ENG: '',
        ANALYSIS_TYPE: '',
        LP_ANALYSIS_VALUES: '',
        IA_ROOT_PATH_ENG: '',
    },
    SYSTEM: {
        PROCESS_ALREADY_RUNNING: 'Process is already running.',
        STOP_PROCESS: 'Process is terminating.',
        FULLSCREEN_SUGGEST: 'Please click the full screen button.',
    },
    GENERAL: {
        SAVE: 'Save',
        LEAVE: 'Leave',
        CANCEL: 'Cancel',
        CLOSE: 'Close',
        COPY: 'Copy',
        MOVE: 'Move',
        DELETE: 'Delete',
        UPLOAD: 'Upload',
        OK: 'OK',
        SUCCESS: 'Success',
    }
} as const;

export const MSG_TOAST = {
    SUCCESS: 'success',
    ERROR: 'error',
    BAR_CODE_SUCCESS: 'Barcode Copied',
    SAVED: 'Saved',
} as const;

export const TOAST_MSG_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

export const ALERT_TYPE = {
    CORE_ERROR: 'CORE_ERROR',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;