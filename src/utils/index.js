import { fetch } from '../store/fetch'

const MAPAK = "vQnjUfpiKMZ9pLTxa34asEx1Y57VRWDS";

/**
 * 日期转换
 * @param  {[type]} date   [description]
 * @param  {[type]} format [description]
 * @return {[type]}        [description]
 */
export function formateDate(date, format) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    return;
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
}

/**
 * 节流函数
 * @param  {[type]} func    [description]
 * @param  {[type]} wait    [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
export function throttle(func, wait, options) {
  /* options的默认值
   *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
   *  options.leading = true;
   * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
   *  options.trailing = true; 
   * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
   */
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    // 计算剩余时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

/**
 * 调用微信支付
 * @param  {[type]} appId     [description]
 * @param  {[type]} timeStamp [description]
 * @param  {[type]} nonceStr  [description]
 * @param  {[type]} package2  [description]
 * @param  {[type]} signType  [description]
 * @param  {[type]} paySign   [description]
 * @return {[type]}           [description]
 */
export function wxPay(appId, timeStamp, nonceStr, package2, signType, paySign) {
  return new Promise((resolve, reject) => {
    if (typeof WeixinJSBridge == 'undefined') {
      reject("请在微信端开启支付！")
      return;
    }
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      "appId": appId, //公众号名称，由商户传入     
      "timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
      "nonceStr": nonceStr, //随机串     
      "package": package2,
      "signType": signType, //微信签名方式：     
      "paySign": paySign //微信签名 
    }, function(res) {
      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        resolve(res);
      } else {
        reject("微信支付失败");
      }
    });
  })

}
/**
 * 获取微信openid
 * @param  {String} url [description]
 * @return promise
 */
export function goWxOpenId(url = "http://www.chuangshouji.com") {
  this.$store.dispatch('FETCH_WEIXIN_CACHE');
  let wxOpenid = this.$store.state.wxOpenid;
  console.log("wxOpenid:" + this.$store.state.wxOpenid)
  if (wxOpenid) {
    return;
  }
  //是否为微信返回的
  if (this.getUrlParam('code')) {
    let code = this.getUrlParam('code');
    this.$store.dispatch('FETCH_WEIXIN', { code })
      .then((data) => {
        if (data.data && this.$store.state.code['success'] == data.errorCode) {
          localStorage.setItem(this.$store.state.key['wxOpenid'], JSON.stringify(data));
          this.$store.dispatch('FETCH_WEIXIN_CACHE');
          setTimeout(function() {
            window.location.href = url + "?d=" + Date.now();
          }, 300);
        } else {
          this.toastError("微信校验有误，请稍后重试！");
        }
      }).catch((e) => {
        console.log(e);
        this.toastError('网络有问题，稍后重试！');
      })
  } else {
    let redirect_uri = encodeURIComponent(url);
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf9dc214798a674d9&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
  }
}

/**
 * 是否登陆
 * @param {Store } [vuex] [description]
 * @return {Boolean} [description]
 */
export function isLogin(store) {
  let customer = {};
  store.dispatch('FETCH_LOGIN_CACHE');
  try {
    customer = JSON.parse(localStorage.getItem("CUSTOMER"));
  } catch (e) {}
  return !!customer && !!customer.id;
}

/**
 * 判断当前用户是否注册
 * @return {Boolean} [description]
 */
export function goLogin(url) {
  localStorage.setItem("returnUrl" , url);
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
}



/**
 * 获取地理位置经纬度
 * @return {[type]} [description]
 */
export function getLocalPosition() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    fetch({
      url: "/cphone/storeinfo/jsapiSign?url="+encodeURIComponent(encodeURIComponent(location.href.split("#")[0])),
    }).then((res) => {
      var data = res.data;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function() {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            console.log("经度:" + res.longitude)
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            localStorage.setItem(this.$store.state.key.position.longitude, longitude);
            localStorage.setItem(this.$store.state.key.position.latitude, latitude);
            this.$store.dispatch('FETCH_POSITION');
          }
        });
      });
    }).catch((e)=>{
      console.log(e);
    })
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("经纬度:" + position.coords.latitude+","+position.coords.longitude)
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;
      localStorage.setItem(this.$store.state.key.position.longitude, longitude);
      localStorage.setItem(this.$store.state.key.position.latitude, latitude);
      this.$store.dispatch('FETCH_POSITION');
    });
  }
}
