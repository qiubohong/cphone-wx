const DOMAIN = 'http://www.chuangshouji.com/';
const BASE = DOMAIN+'cphone/';

export function fetch(opt) {
  opt = Object.assign({
    method: 'get',
    type: 'json'
  }, opt)
  return new Promise((resolve, reject) => {
    var obj = new XMLHttpRequest(); // XMLHttpRequest对象用于在后台与服务器交换数据
    if (opt.url.indexOf('?') < 0) {
      opt.url += '?'
    }
    if (opt.data && opt.method.toLowerCase() == 'get') {
      for (var key in opt.data) {
        opt.url += '&' + key + '=' + opt.data[key]
      }
    }
    obj.open(opt.method, opt.url, true);
    if (opt.method.toLowerCase() == 'post') {
      obj.setRequestHeader('Content-Type', 'application/json');
    }

    obj.onreadystatechange = function() {
      if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
        var resData = obj.responseText; //从服务器获得数据
        if (opt.type == 'json') {
          try {
            resolve(JSON.parse(resData));
          } catch (error) {
            reject(resData)
          }
        }
      }
    };

    if (opt.data && opt.method.toLowerCase() == 'post') {
      obj.send(JSON.stringify(opt.data))
    } else {
      obj.send();
    }
  })
}

export function getBrands() {
  return fetch({ url: BASE + 'phone/getBrands' })
}

export function getIndexHot() {
  return fetch({ url: BASE + 'recycle/hotRecycles' })
}

export function getRecyclePhones() {
  return fetch({ url: BASE + `recycle/getRecyclePhones` })
}

export function getRecycleByBrandId(brandId) {
  return fetch({ url: BASE + `recycle/getRecyclePhones/${brandId}` })
}

export function getRecycleProblems(phoneId) {
  return fetch({ url: BASE + `recycle/getRecycleProblems/${phoneId}` })
}

export function getRecycleById(recyclePhoneId){
  return fetch({ url: BASE + `recycle/recyclePhoneInfo/${recyclePhoneId}`})
}

export function recycleOffer(data) {
  return fetch({ url: BASE + `recycle/offer`, method: "post", data })
}

export function recycleOrder(data) {
  return fetch({ url: BASE + `recycle/order/commitOrder`, method: "post", data })
}

export function getRecycleOrderList(customerId) {
  return fetch({ url: BASE + `recycle/order/orderList/${customerId}`})
}

export function cacnleRecycleOrder(orderSn,customerId) {
  return fetch({ url: BASE + `recycle/order/cacnleOrder/${orderSn}/${customerId}`, data:{orderSn,customerId}})
}

export function confirmFinishRecycleOrder(serialNumber) {
  return fetch({ url: BASE + `recycle/order/confirmFinish/${serialNumber}`})
}

//维修
export function getMaintainPhones() {
  return fetch({ url: BASE + `maintain/getMaintainPhones`})
}

export function getMaintainProblems(phoneId){
  return fetch({ url: BASE + `maintain/getMaintainProblems/${phoneId}`})
}
export function getRepariById(maintainPhoneId){
  return fetch({ url: BASE + `maintain/maintainPhoneInfo/${maintainPhoneId}`})
}
export function repariOffer(data){
  return fetch({ url: BASE + `maintain/offer`,data, method:"post"})
}
export function repariOrder(data) {
  return fetch({ url: BASE + `maintain/order/commitOrder`, method: "post", data })
}
export function getRepairOrderList(customerId) {
  return fetch({ url: BASE + `maintain/order/orderList/${customerId}`})
}
export function cacnleRepairOrder(orderSn,customerId) {
  return fetch({ url: BASE + `maintain/order/cacnleOrder/${orderSn}/${customerId}`, data:{orderSn,customerId}})
}

export function payOrder(serialNumber){
  return fetch({ url: DOMAIN + `CPhoneRaffle/WeixinPay/maintainPay`, data:{serialNumber}})
}
export function confirmFinishRepairOrder(serialNumber) {
  return fetch({ url: BASE + `maintain/order/confirmFinish/${serialNumber}`})
}

//抽奖
export function getCurPrize(){
  return fetch({ url: DOMAIN + `CPhoneRaffle/rafflePrize/getCurPrize`})
}
export function getCustomerRaffles(customerPhone){
  return fetch({ url: DOMAIN + `CPhoneRaffle/raffle/getCustomerRaffles`, data:{customerPhone}})
}
export function  getAwardPrizes(){
  return fetch({ url: DOMAIN + `CPhoneRaffle/rafflePrize/getAwardPrizes`})
}

//通用
export function getStore(lat,lng) {
  return fetch({ url: BASE + `storeinfo/nearlist/${lat}/${lng}`})
}

export function getAddreessByPosition(lat,lng){
  return fetch({ url: BASE + `user/getAddreessByPosition/${lat}/${lng}`})
}

export function getStoreById(storeId) {
  return fetch({ url: BASE + `storeinfo/storeInfo/${storeId}`})
}

//登录注册
export function getWxOpenId(code){
  return fetch({url: BASE + 'user/access/callback', data:{code,state:"123"}})
}
export function login(data) {
  return fetch({ url: BASE + `user/customer/login`,data})
}
export function sign(data) {
  return fetch({ url: BASE + `user/customer/sign`,data})
}
export function sendSignCode(number) {
  return fetch({ url: BASE + `user/sendSignCode/${number}`})
}
export function isSign(openid){
  return fetch({ url: BASE + `user/customer/${openid}`})
}