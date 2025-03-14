<template>
  <div class="progressBarLogin" v-if="!progressOnOff && forceViewer === 'main' && !isViewer">
    <div class="progressDiv">
      <progress class="login-process" id="file" :value="progress" max="100"></progress>
      <div class="loading-text mt10">Loading...</div>
    </div>
  </div>

  <div class='uimdLogin'>
    <div class='loginContent'>
      <p class="loginTitle"><span class="loginColorSpan">U</span>IMD</p>
      <p class='loginP mt20'>Unique Idea Medical Device</p>
      <div class="mt30 loginDiv">
        <ul class="loginUl">
          <li>
            <input class="loginInput" type="text" v-model="idVal" placeholder="ID" @keydown="loginUser">
          </li>
          <li>
            <input class="loginInput" type="password" v-model="password" placeholder="password" @keydown="loginUser">
          </li>
        </ul>

        <div class='loginBtn'>
          <button type="button" @click="loginUser()" @keydown="loginUser">Login</button>
          <button type="button" @click="goJoinPage">Add User</button>
        </div>
      </div>
    </div>
  </div>
    <Alert
    v-if="showAlert"
    :is-visible="showAlert"
    :type="alertType"
    :message="alertMessage"
    @hide="hideAlert"
    @update:hideAlert="hideAlert"
  />
</template>

<script setup lang="ts">
import {ref, onMounted, computed, onBeforeMount, watch} from "vue";
import { login } from "@/common/api/service/user/userApi";
import {
  createDeviceInfoApi,
  getDeviceInfoApi,
  getDeviceIpApi,
  putDeviceInfoApi
} from "@/common/api/service/device/deviceApi";
import router from "@/router";
import { UserResponse  } from '@/common/api/service/user/user.dto'
import {ApiResponse} from "@/common/api/httpClient";
import {useStore} from "vuex";
import Alert from "@/components/commonUi/Alert.vue";
import { initializeAllSettings } from "@/common/lib/commonfunction/settingFunctions";
import {MESSAGES} from "@/common/defines/constFile/constantMessageText";

const store = useStore();
const password = ref('');
const idVal = ref('');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');
const isAutoLoginEnabled = ref(false);
const isViewer = ref(false);
const forceViewer = ref('');
const isTcpConnected = computed(() => store.state.commonModule.isTcpConnected);
const uimdOpenIp = ref('');
const progress = ref(0);
const progressOnOff = ref(false);

onBeforeMount(async () => {
  uimdOpenIp.value = window.MAIN_WEBSOCKET_IP;
  forceViewer.value = window.FORCE_VIEWER;
  await checkIsViewer();
})

onMounted(async () => {
  isAutoLogginable();
  startProgress();
  if (isTcpConnected.value) {
    progressOnOff.value = true;
  }
})

const startProgress = () => {
  progress.value = 0;

  const interval = setInterval(() => {
    if (!isTcpConnected.value) {
      progress.value += 0.5;
    } else {
      progress.value = 100;
      clearInterval(interval);
    }
  }, 1000);

  watch(isTcpConnected, (newValue) => {
    if (newValue) {
      progress.value = 100;
      setTimeout(() => {
        progressOnOff.value = true;
      }, 1000);
      clearInterval(interval);
    }
  });
};

/** 자동 로그인 확인 */
const isAutoLogginable = () => {
  const getStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (getStoredUser.userId && getStoredUser.password) {
    idVal.value = getStoredUser.userId;
    password.value = getStoredUser.password;
    loginUser();
  }
};

const getDeviceInfoFromTxt = async () => {
  const filePath = 'D:\\UIMD_Data\\Backend_INI';
  const fileName = 'HW_Config';
  try {
    const result = await readFileTxt(`path=${filePath}&filename=${fileName}`);
    const iniFileData = result.data.data;
    const deviceBarcodePattern = /DEVICE_SERIAL\s*=\s*(.+)/;
    const siteCdPattern = /SERVICE_SITE\s*=\s*(.+)/;

    const deviceBarcode = iniFileData.match(deviceBarcodePattern)[1] || '';
    const siteCd = iniFileData.match(siteCdPattern)[1] || '';

    const deviceInfoObj = {
      siteCd,
      deviceSerialNm: deviceBarcode,
    }

    const deviceData = await getDeviceInfoApi();
    if (deviceData.data.length === 0 || !deviceData.data) {
      await createDeviceInfoApi({ deviceItem: deviceInfoObj });
      sessionStorage.setItem('autoStart', 'true');
    } else {
      sessionStorage.setItem('autoStart', deviceData.data[0]?.autoStart);
      await putDeviceInfoApi({ siteCd: siteCd, deviceSerialNm: deviceBarcode });
    }

    await store.dispatch('commonModule/setCommonInfo', { siteCd: siteCd })
    localStorage.setItem('siteCd', siteCd);

  } catch (e) {
    console.error(e);
  }
}

const goJoinPage = () => {
  router.push('/user/join');
}

const loginUser = async (event?: KeyboardEvent) => {
  if (event && event.key !== 'Enter' && event.type !== 'click') return;

  const user = {
    userId: idVal.value,
    password: password.value,
  }

  if (user.userId === '' || user.password === '') {
    showSuccessAlert('Login failed.');
    return;
  }

  try {
    const result: ApiResponse<UserResponse | undefined | any> = await login(user);
    if (result?.data?.user) {
      await getDeviceInfoFromTxt();
      await initializeAllSettings();
      await store.dispatch('userModule/setUserAction', result.data?.user);
      sessionStorage.setItem('user', JSON.stringify(result.data.user));

      if (isAutoLoginEnabled.value) {
        localStorage.setItem('user', JSON.stringify((result.data.user)))
      }
      await getIpAddress();

    }else{
      showSuccessAlert('Login failed.');
    }
  } catch (e) {
    showSuccessAlert('server Err.')
    console.error(e);
  }
}

const checkIsViewer = async () => {
  try {
    const result = await getDeviceIpApi();
    if((result.data === '1' || (window.APP_API_BASE_URL && window.APP_API_BASE_URL.includes(result.data)))) {
      isViewer.value = false;
    } else {
      isViewer.value = true;
    }
  } catch (e) {
    console.error(e);
  }
}

const getIpAddress = async () => {
  try {
    const result = await getDeviceIpApi();
    if((result.data === '1' || (window.APP_API_BASE_URL && window.APP_API_BASE_URL.includes(result.data))) && window.FORCE_VIEWER !== 'viewer'){
      await store.dispatch('commonModule/setCommonInfo', {viewerCheck: 'main'});
      await updateAccount('main');
      sessionStorage.setItem('viewerCheck', 'main');
      sessionStorage.setItem('pcIp', JSON.stringify(result.data));
    }else{
      await store.dispatch('commonModule/setCommonInfo', {viewerCheck: 'viewer'});
      await updateAccount('viewer');
      sessionStorage.setItem('viewerCheck', 'viewer');
      sessionStorage.setItem('pcIp', JSON.stringify(result.data));
    }
  } catch (e) {
    console.error(e);
  }
}

const updateAccount = async (viewerCheck: string) => {
      showSuccessAlert('login successful.');

      if(viewerCheck === 'main'){
        await router.push('/');
        await document.documentElement.requestFullscreen();
      }else{
        await router.push('/dataBase');
        await document.documentElement.requestFullscreen();
      }
      await store.dispatch('commonModule/setCommonInfo', {loginSetData: ''});
      await store.dispatch('commonModule/setCommonInfo', {resFlag: false});
}

const showSuccessAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_SUCCESS;
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};

</script>
