// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import YDUI from 'vue-ydui';
import 'vue-ydui/dist/ydui.rem.css';
import { throttle } from './utils'

import './assets/base.css';

Vue.use(YDUI);


Vue.config.productionTip = false

Vue.filter('formatDate', function(date, format) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    let now = new Date();
    if (typeof date === 'number') {
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

let getPosition = throttle(function() {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position:" + position.coords.longitude)
    let longitude = position.coords.longitude;
    let latitude = position.coords.latitude;
    localStorage.setItem(this.$store.state.key.position.longitude, longitude);
    localStorage.setItem(this.$store.state.key.position.latitude, latitude);
    this.$store.dispatch('FETCH_POSITION');
  });
}, 1000);

let getWxOpenId = false;

let isLogin = throttle(function() {
  if (getWxOpenId) return;
  getWxOpenId = true;
  let path = this.$route.path;
  let customer = this.$store.state.customer;
  if (!customer.id && (path != "/login" && path != "register")) {
    this.$dialog.loading.open();
    this.$store.dispatch('FETCH_WEIXIN_CACHE');
    setTimeout(() => {
      console.log("wxOpenid:"+this.$store.state.wxOpenid)
      if (this.$store.state.wxOpenid) {
        this.$store.dispatch('FETCH_ISSIGN')
          .then((data) => {
            this.$dialog.loading.close();
            //查询openid已被注册
            if (data.data && this.$store.state.code['success'] == data.errorCode) {
              this.$router.replace({ path: '/login' })
            } else {
              this.$router.replace({ path: '/register' })
            }
          }).catch((e) => {
            console.log(e);
            this.$dialog.loading.close();
            this.toastError('网络有问题，稍后重试！')
          });
      } else {
        if (this.getUrlParam('code')) {
          let code = this.getUrlParam('code');
          this.$store.dispatch('FETCH_WEIXIN', { code })
            .then((data) => {
              if (data.data && this.$store.state.code['success'] == data.errorCode) {
                localStorage.setItem(this.$store.state.key['wxOpenid'], JSON.stringify(data));
                this.$store.dispatch('FETCH_WEIXIN_CACHE');
                setTimeout(function() {
                  window.location.href = "/?d=" + Date.now();
                }, 300);
              } else {
                this.toastError("微信校验有误，请稍后重试！");
              }
            }).catch((e) => {
              console.log(e);
              this.toastError('网络有问题，稍后重试！');
            })
        } else {
          window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf9dc214798a674d9&redirect_uri=http%3A%2F%2Fwww.chuangshouji.com&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
        }
      }
    }, 10);
  }
}, 500);

Vue.mixin({
  created: function() {
    this.$store.dispatch('FETCH_LOGIN_CACHE');
    //判断是否登录
    isLogin.call(this);
    //每跳一个页面 更新地理位置
    getPosition.call(this);
  },
  methods: {
    toastError(mes) {
      this.$dialog.toast({
        mes,
        timeout: 1500,
        icon: "error"
      })
    },
    getUrlParam(name) {
      let param = null;
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let matches = window.location.search.substr(1).match(reg);
      if (matches != null) {
        param = unescape(matches[2]);
      }
      return param;
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
