// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';

import axios from 'axios'

import './assets/base.css';

Vue.use(YDUI);

Vue.prototype.$ajax = axios

Vue.config.productionTip = false

Vue.filter('formatDate', function (date, format) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    let now = new Date();
    if(typeof date === 'number'){
    	now.setTime(date);
    	date = now;
    }
  }
  var regexpObj = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S+": date.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in regexpObj) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        regexpObj[k] : ("00" + regexpObj[k]).substr(("" + regexpObj[k]).length));
    }
  }
  return format;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
