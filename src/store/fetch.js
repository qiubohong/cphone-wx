// 引入 axios
const BASE = 'http://www.chuangshouji.com/cphone/';

function fetch(opt) {
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

export function getRecyclePhones(brandId) {
  return fetch({ url: BASE + `recycle/getRecyclePhones/${brandId}` })
}

export function getRecycleById(brandId) {
  return fetch({ url: BASE + `recycle/getRecyclePhones/${brandId}` })
}

export function getRecycleProblems(phoneId) {
  return fetch({ url: BASE + `recycle/getRecycleProblems/${phoneId}` })
}

export function recycleOffer(data) {
  return fetch({ url: BASE + `recycle/offer`, method: "post", data })
}

export function getMaintainPhones() {
  return fetch({ url: BASE + `maintain/getMaintainPhones`})
}
