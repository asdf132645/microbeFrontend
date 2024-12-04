<template>
  <div class="joinContent">
    <p class="mt20 mb40 ">CREATE ACCOUNT</p>
    <div>
      <ul class="joinWrapper">
        <li>
          <span class="loginTitle">ID</span>
          <input class="loginInput" type="text" v-model="idVal">
        </li>
        <li>
          <span class="loginTitle">password</span>
          <input class="loginInput" type="text" v-model="password">
        </li>
        <li>
          <span class="loginTitle">Repeat password</span>
          <input class="loginInput" type="text" v-model="passwordRepeat">
        </li>
        <li>
          <span class="loginTitle">name</span>
          <input class="loginInput" type="text" v-model="nameVal">
        </li>
        <li>
          <span class="loginTitle">Employee No</span>
          <input class="loginInput" type="text" v-model="employeeNo">
        </li>
        <li>
          <span class="loginTitle">user Type</span>
          <select v-model="userType">
            <option value="admin">Admin</option>
            <option value="normal">Normal</option>
          </select>
        </li>
      </ul>
      <div class='joinBtn'>
        <button class="defaultBtn" type="button" @click='createAccount'>Create Account</button>
        <button class="defaultBtn" type="button" @click='goLoginPage'>Back</button>
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
import {ref} from "vue";
import {createUser} from "@/common/api/service/user/userApi";
import router from "@/router";
import Alert from "@/components/commonUi/Alert.vue";
import {ALERT_TYPE, MESSAGES} from "@/common/defines/constFile/constantMessageText";
import {VALIDATION_MSG} from "@/common/defines/constFile/validation";

const employeeNo = ref('');
const idVal = ref('');
const nameVal = ref('');
const passwordRepeat = ref('');
const password = ref('');
const userType = ref('admin');
const showAlert = ref(false);
const alertType = ref('');
const alertMessage = ref('');

const goLoginPage = () => {
  router.push('/user/login');
}

const createAccount = async () => {
  if (!signUpValidation()) return;

  const user = {
    userId: idVal.value,
    password: password.value,
    name: nameVal.value,
    employeeNo: employeeNo.value,
    userType: userType.value,
    subscriptionDate: new Date(),
  }

  try {
    const result: any = await createUser(user);
    if (result.data?.userId) {
      await showSuccessAlert(VALIDATION_MSG.SIGNUP.SIGNUP_SUCCESS);
      await router.push('/user/login');
    } else {

      // User Id 중복
      if (result.data.includes('Duplicate')) {
        showErrorAlert(VALIDATION_MSG.SIGNUP.DUPLICATE_USERID);
      }

    }
  } catch (e) {
    console.error(e);
    showErrorAlert(VALIDATION_MSG.SIGNUP.SIGNUP_FAILURE);
  }
}

const signUpValidation = () => {
  if (idVal.value === "") {
    showErrorAlert(VALIDATION_MSG.SIGNUP.ENTER_ID);
    return false;
  }
  else if (idVal.value.includes('_')) {
    showErrorAlert(VALIDATION_MSG.SIGNUP.WRONG_USERID_FORMAT);
    return false;
  }
  else if (password.value === "") {
    showErrorAlert(VALIDATION_MSG.SIGNUP.ENTER_PASSWORD);
    return false;
  }
  else if (nameVal.value === "") {
    showErrorAlert(VALIDATION_MSG.SIGNUP.ENTER_NAME);
    return false;
  }
  else if (employeeNo.value === "") {
    showErrorAlert(VALIDATION_MSG.SIGNUP.ENTER_EMPLOYEE_NO);
    return false;
  }
  else if (passwordRepeat.value === "") {
    showErrorAlert(VALIDATION_MSG.SIGNUP.ENTER_PASSWORD_REPEAT);
    return false;
  }
  else if (password.value !== passwordRepeat.value) {
    showErrorAlert(VALIDATION_MSG.SIGNUP.PASSWORD_CHECK);
    return false;
  }

  return true;
}

const showSuccessAlert = async (message: string) => {
  showAlert.value = true;
  alertType.value = ALERT_TYPE.SUCCESS;
  alertMessage.value = message;
};

const showErrorAlert = (message: string) => {
  showAlert.value = true;
  alertType.value = MESSAGES.ALERT_TYPE_ERROR;
  alertMessage.value = message;
};

const hideAlert = () => {
  showAlert.value = false;
};
</script>
