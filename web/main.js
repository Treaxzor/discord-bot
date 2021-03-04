import Vue from 'vue';
import App from './app.vue';
import Router from './router';
import http from './extensions/http'

import './css/main.css';

import VueToastr2 from 'vue-toastr-2';
import 'vue-toastr-2/dist/vue-toastr-2.min.css';
window.toastr = require('toastr');
Vue.use(VueToastr2);


const router = new Router();

const vue = new Vue({
  router: new Router(),
  render(h) {
    return h(App);
  },
  mounted() {
    window.$sap = jQuery;
  }
}).$mount('#app');