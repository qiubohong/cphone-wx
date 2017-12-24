import Vue from 'vue'
import Vuex from 'vuex'
import * as fetch from './fetch'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const SUCCESS = "101002"

export default new Vuex.Store({
  state: {
    brands: [],
    indexHot: [],
    recycles: [], //回收
    recycleSelect: {},
    recycleProblems: [],
    recycleResult: {},
    recycleOrderList: [],

    repairs: [], //维修
    repairSelect: {}, //选中的维修手机
    repairProblems: [], //选中的故障
    repairOrderList: [], //订单列表

    stores: [],

    position: {
      longitude: 113,
      latitude: 22,
    },

    customer: {},
    wxOpenid: -1,

    key: {
      recycleSelect: "RECYCLE_SELECT",
      recycleSubmit: "RECYCLE_SUBMIT",
      repairSelect: "REPAIR_SELECT",
      repairProblems: "REPAIR_PROBLEM",
      position: {
        longitude: "LONGITUDE",
        latitude: "LATITUDE",
      },
      customer: "CUSTOMER",
      wxOpenid: "WXOPENID",
    },
    code: {
      success: SUCCESS
    },
    pageLoading: false,
  },
  actions: {
    FETCH_WEIXIN: ({ commit, dispatch, state },{code}) => {
      return new Promise((resolve, reject) => {
        fetch.getWxOpenId(code)
          .then(data => {
            resolve(data)
            commit('SET_WEIXIN', {data});
          }).catch(reject);
      })
    },
    FETCH_WEIXIN_CACHE: ({ commit, dispatch, state }) => {
      let data;
      try{
        data = JSON.parse(localStorage.getItem(state.key['wxOpenid']));
      }catch(e){
        console.error(e);
      }
      data = data || {};
      commit('SET_WEIXIN', {data});
    },
    FETCH_SIGN: ({ commit, dispatch, state }, { data }) => {
      return new Promise((resolve, reject) => {
        fetch.sign(data)
          .then(data => {
            resolve(data)
          }).catch(reject);
      })
    },
    FETCH_ISSIGN: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.isSign(state.wxOpenid)
          .then(data => {
            resolve(data)
          }).catch(reject);
      })
    },
    FETCH_LOGIN: ({ commit, dispatch, state }, { data }) => {
      return new Promise((resolve, reject) => {
        fetch.login(data)
          .then(data => {
            resolve(data);

          }).catch(reject);
      })
    },
    FETCH_LOGIN_CACHE: ({ commit, dispatch, state }) => {
      let data;
      try {
        data = JSON.parse(localStorage.getItem(state.key["customer"]));
      } catch (e) {}
      data = data || {};
      commit('SET_CUSTOMER', { data })
    },
    FETCH_BRANDS: ({ commit, dispatch, state }) => {
      fetch.getBrands()
        .then(data => {
          commit('SET_BRANDS', { data })
        })
    },
    FETCH_INDEX_HOT: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getIndexHot().then(data => {
          resolve(data);
          commit('SET_INDEX_HOT', { data })
        }).catch(reject);
      });
    },
    FETCH_RECYCLES: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getRecyclePhones()
          .then(data => {
            resolve(data);
            commit('SET_RECYCLE', { data });
          }).catch(reject);
      });
    },
    FETCH_RECYCLE_ID: ({ commit, dispatch, state }, { phoneId }) => {
      return new Promise((resolve, reject) => {
        fetch.getRecycleById(phoneId)
          .then(data => {
            resolve(data);
          }).catch(reject);
      });
    },
    FETCH_SINGLE_RECYCLE: ({ commit, dispatch, state }) => {
      let data = JSON.parse(localStorage.getItem(state.key["recycleSelect"]));
      console.log(data);
      commit('SET_RECYCLE_SELECT', { data })
    },
    FETCH_RECYCLE_PROBLEM: ({ commit, dispatch, state }, { phoneId }) => {
      state.pageLoading = true;
      fetch.getRecycleProblems(phoneId)
        .then(data => {
          state.pageLoading = false;
          commit('SET_RECYCLE_PROBLEMS', { data })
        })
    },
    FETCH_RECYCLE_OFFER: ({ commit, dispatch, state }, { submitData, callback }) => {
      state.pageLoading = true;
      fetch.recycleOffer(submitData)
        .then(data => {
          state.pageLoading = false;
          callback(data);
        })
    },
    FETCH_RECYCLE_ORDER: ({ commit, dispatch, state }, { formData }) => {
      return new Promise((resolve, reject) => {
        fetch.recycleOrder(formData)
          .then(data => {
            resolve(data);
          }).catch((e) => {
            reject(e);
          });
      });
    },
    FETCH_RECCYLE_RESULT: ({ commit, dispatch, state }) => {
      let data = {};
      try {
        data = JSON.parse(localStorage.getItem(state.key["recycleSubmit"]));
      } catch (e) {}
      commit('SET_RECYCLE_RESULT', { data })
    },
    FETCH_RECYCLE_ORDERLIST: ({ commit, dispatch, state }, { customerId }) => {
      return new Promise((resolve, reject) => {
        fetch.getRecycleOrderList(customerId)
          .then(data => {
            resolve(data);
            commit('SET_RECYCLE_ORDERLIST', { data });
          }).catch(reject);
      });
    },
    FETCH_RECYCLE_CANCLEORDER: ({ commit, dispatch, state }, { orderSn, customerId }) => {
      return new Promise((resolve, reject) => {
        fetch.cacnleRecycleOrder(orderSn, customerId)
          .then(data => {
            resolve(data);
          }).catch(reject);
      });
    },
    //维修
    FETCH_REPAIRS: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getMaintainPhones()
          .then(data => {
            resolve(data);
            commit('SET_REPAIRS', { data });
          }).catch(reject)
      })
    },
    FETCH_REPAIR_PROBLEMS: ({ commit, dispatch, state }, { phoneId }) => {
      return new Promise((resolve, reject) => {
        fetch.getMaintainProblems(phoneId)
          .then(data => {
            resolve(data);
          }).catch(reject)
      })
    },
    FETCH_SELECT_REPAIR: ({ commit, dispatch, state }) => {
      let repair = {};
      let problems = [];
      try {
        repair = JSON.parse(localStorage.getItem(state.key["repairSelect"]));
        problems = JSON.parse(localStorage.getItem(state.key["repairProblems"]));
      } catch (e) {}
      commit('SET_SELECT_REPAIR', { repair, problems })
    },
    FETCH_REPAIR_OFFER: ({ commit, dispatch, state }, { submitData }) => {
      return new Promise((resolve, reject) => {
        fetch.repariOffer(submitData)
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETCH_REPAIR_ORDER: ({ commit, dispatch, state }, { formData }) => {
      return new Promise((resolve, reject) => {
        fetch.repariOrder(formData)
          .then(data => {
            resolve(data);
          }).catch((e) => {
            reject(e);
          });
      });
    },
    FETCH_REPAIR_ORDERLIST: ({ commit, dispatch, state }, { customerId }) => {
      return new Promise((resolve, reject) => {
        fetch.getRepairOrderList(customerId)
          .then(data => {
            resolve(data);
            commit('SET_REPAIR_ORDERLIST', { data });
          }).catch(reject);
      });
    },
    FETCH_REPARI_ID: ({ commit, dispatch, state }, { phoneId }) => {
      return new Promise((resolve, reject) => {
        fetch.getRepariById(phoneId)
          .then(data => {
            resolve(data);
          }).catch(reject);
      });
    },
    FETCH_REPARI_CANCLEORDER: ({ commit, dispatch, state }, { orderSn, customerId }) => {
      return new Promise((resolve, reject) => {
        fetch.cacnleRepairOrder(orderSn, customerId)
          .then(data => {
            resolve(data);
          }).catch(reject);
      });
    },
    //通用
    FETCH_POSITION: ({ commit, dispatch, state }) => {
      let longitude = sessionStorage.getItem(state.key.position.longitude);
      let latitude = sessionStorage.getItem(state.key.position.latitude);
      commit('SET_POSITION', { longitude, latitude });
    },
    FETECH_STORE: ({ commit, dispatch, state }, { latitude, longitude }) => {
      return new Promise((resolve, reject) => {
        fetch.getStore(latitude, longitude)
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETECH_STORE_ID: ({ commit, dispatch, state }, { storeId }) => {
      return new Promise((resolve, reject) => {
        fetch.getStoreById(storeId)
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETECH_PRIZE: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getCurPrize()
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETECH_RAFFLES: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getCustomerRaffles(state.customer.number)
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },
    FETCH_PRIZE_RECORD: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        fetch.getAwardPrizes()
          .then(data => {
            resolve(data);
          }).catch(reject);
      })
    },

  },
  mutations: {
    SET_WEIXIN: (state, { data }) => {
      if(!data){
        return;
      }
      if (data.errorCode == SUCCESS) {
        state.wxOpenid = data.data
      } else {
        state.wxOpenid = null;
      }
    },
    SET_CUSTOMER: (state, { data }) => {
      state.customer = data
    },
    SET_BRANDS: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.brands = data.data
      } else {
        state.brands = [];
      }
    },
    SET_INDEX_HOT: (state, { data }) => {
      state.indexHot = data.data
    },
    SET_RECYCLE: (state, { data }) => {
      if (data.data && data.errorCode == SUCCESS) {
        state.recycles = data.data;
      } else {
        state.recycles = [];
      }
    },
    SET_RECYCLE_SELECT: (state, { data }) => {
      state.recycleSelect = data;
    },
    SET_RECYCLE_RESULT: (state, { data }) => {
      state.recycleResult = data;
    },
    SET_RECYCLE_PROBLEMS: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        let recycleProblems = data.data
        if (recycleProblems) {
          recycleProblems.forEach((item) => {
            if (item.problemType == 0) {
              item.checked = "";
            } else {
              item.checked = [];
            }
          });
        }
        state.recycleProblems = recycleProblems;
      } else {
        state.recycleProblems = [];
      }
    },
    SET_RECYCLE_ORDERLIST: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.recycleOrderList = data.data
      } else {
        state.recycleOrderList = [];
      }
    },
    SET_REPAIRS: (state, { data }) => {
      if (data.errorCode == SUCCESS) {
        state.repairs = data.data
      } else {
        state.repairs = [];
      }
    },
    SET_SELECT_REPAIR: (state, { repair, problems }) => {
      state.repairSelect = repair;
      state.repairProblems = problems;
    },
    SET_REPAIR_ORDERLIST: (state, { data }) => {
      if (data.data && data.errorCode == SUCCESS) {
        state.repairOrderList = data.data
      } else {
        state.repairOrderList = [];
      }
    },

    SET_POSITION: (state, { longitude, latitude }) => {
      if (!longitude || !latitude) {
        longitude = 113;
        latitude = 22;
      }
      state.position.longitude = longitude;
      state.position.latitude = latitude;
    },
    SET_STORE: (state, { data }) => {
      state.stores = data;
    },
  }
})
