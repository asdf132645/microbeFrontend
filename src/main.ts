// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/global.css';
import './assets/css/color.css';
import './assets/css/layout.css';
import './assets/css/layoutExtraWide.css';
import './assets/css/icoBtn.css';

import { library } from '@fortawesome/fontawesome-svg-core';
// @ts-ignore
import { fas } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import socketPlugin from '@/plugins/socketPlugin';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faHalfCircleUp, faHalfCircleDown } from './icons/customIcons';
import { useProvideApolloClient } from '@/graphql/apollo';
import VueSplide from '@splidejs/vue-splide';

library.add(fas);
library.add(faCircle);
library.add(faHalfCircleUp);
library.add(faHalfCircleDown); // 커스텀 아이콘 추가

const app = createApp(App);



// Vuex store 및 router 등록
app.use(router);
app.use(store);
app.use(socketPlugin);
app.use(VueSplide)


app.component('font-awesome-icon', FontAwesomeIcon);
useProvideApolloClient();

app.mount('#app');