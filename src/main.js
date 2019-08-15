// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import iView from 'iview';
import App from './App';
import router from './router';
import store from './store';
import './assets/less/index.less';
import conf from './config'
import { SAVE_TOKEN, SAVE_USER_INFO } from './store/mutationTypes';
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(Vuex);
Vue.use(iView);

const token = localStorage.getItem('token');
const _id = localStorage.getItem('_id');
if (token) {
  store.commit({ type: SAVE_TOKEN, token });
}
if (_id) {
  store.commit({ type: SAVE_USER_INFO, user_id: _id });
}

axios.defaults.baseURL = conf.apiGateway
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

axios.interceptors.request.use(
  config => {
    const token = store.state.user.token;
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    let data = response.data;
    if (response.status === 200) {
      return Promise.resolve(data);
    }
    return Promise.reject(data);
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          iView.Notice.error({ title: error.response.data.message });
          localStorage.clear();
          store.commit({ type: SAVE_TOKEN, token: '' });
          store.commit({ type: SAVE_USER_INFO, user_id: '' });
          router.replace({
            path: '/welcome'
          });
        case 404:
          iView.Notice.error({ title: error.response.data.message });
          localStorage.clear();
          store.commit({ type: SAVE_TOKEN, token: '' });
          store.commit({ type: SAVE_USER_INFO, user_id: '' });
          router.replace({
            path: '/welcome'
          });
        default:
          iView.Notice.error({ title: error.response.data.message });
      }
    }
    return Promise.reject(error.response.data);
  }
);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const { token, user_id } = store.state.user;
  if (to.path === '/welcome') {
    if (token && user_id) {
      router.replace({
        path: `/${user_id}/blogs`
      });
    }
  } 
  else {
    if (!token) {
      router.replace({
        path: '/welcome'
      });
    }
  }
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
