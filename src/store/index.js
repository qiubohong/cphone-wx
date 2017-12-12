import Vue from 'vue'
import Vuex from 'vuex'
import * as fetch from './fetch'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const SUCCESS="101002"

export default new Vuex.Store({
  state:{
    brands: [],
  	indexHot:[],
    recycles: [], //回收
    recycleSelect:{},
    recycleProblems:[],
    recycleResult:{},

    repairs: [], //维修
    
    stores:[],

    position:{
      longitude: 113,
      latitude: 22,
    },

    customer:{},
    wxOpenid:"123123123",
    
    key:{
      recycleSelect:"RECYCLE_SELECT",
      recycleSubmit:"RECYCLE_SUBMIT",
      position:{
        longitude: "LONGITUDE",
        latitude: "LATITUDE",
      },
      customer: "CUSTOMER",
    },
    code:{
      success:SUCCESS
    },
    pageLoading:false,
  },
  actions:{
    FETCH_SIGN:({ commit, dispatch, state },{data})=>{
      return new Promise((resolve,reject)=>{
        fetch.sign(data)
        .then(data => {
          resolve(data)
        }).catch(reject);
      })
    },
    FETCH_LOGIN:({ commit, dispatch, state },{data})=>{
      return new Promise((resolve,reject)=>{
        fetch.login(data)
        .then(data => {
          resolve(data)
        }).catch(reject);
      })
    },
    FETCH_LOGIN_CACHE:({ commit, dispatch, state })=>{
      let data;
      try{
        data = JSON.parse(localStorage.getItem(state.key["customer"]));
      }catch(e){ }
      data = data || {};
      commit('SET_CUSTOMER', {data})
    },
    FETCH_BRANDS:({ commit, dispatch, state })=>{
      fetch.getBrands()
        .then(data => {
          commit('SET_BRANDS', { data })
        })
    },
  	FETCH_INDEX_HOT:({ commit, dispatch, state })=>{
  		return new Promise((resolve,reject)=>{
  			fetch.getIndexHot().then(data => {
          resolve(data);
          commit('SET_INDEX_HOT', { data })
        }).catch(reject);
      });
  	},
    FETCH_RECYCLES:({ commit, dispatch, state },{brandId})=>{
      return new Promise((resolve,reject)=>{
      fetch.getRecyclePhones(brandId)
        .then(data => {
          resolve(data);
          commit('SET_RECYCLE', { data });
        }).catch(reject);
      });
    },
    FETCH_SINGLE_RECYCLE:({ commit, dispatch, state })=>{
      let data = JSON.parse(localStorage.getItem(state.key["recycleSelect"]));
      console.log(data);
      commit('SET_RECYCLE_SELECT', { data })
    },
    FETCH_RECYCLE_PROBLEM:({ commit, dispatch, state }, {phoneId})=>{
      state.pageLoading = true;
      fetch.getRecycleProblems(phoneId)
        .then(data => {
          state.pageLoading = false;
          commit('SET_RECYCLE_PROBLEMS', { data })
        })
    },
    FETCH_RECYCLE_OFFER:({ commit, dispatch, state }, {submitData, callback})=>{
      state.pageLoading = true;
      fetch.recycleOffer(submitData)
        .then(data => {
          state.pageLoading = false;
          callback(data);
        })
    },
    FETCH_RECYCLE_ORDER:({ commit, dispatch, state }, {formData})=>{
      return new Promise((resolve,reject)=>{
        fetch.recycleOrder(formData)
          .then(data => {
            resolve(data);
          }).catch((e)=>{
            reject(e);
          });
      });
    },
    FETCH_RECCYLE_RESULT:({ commit, dispatch, state })=>{
      let data = {};
      try{
        data = JSON.parse(localStorage.getItem(state.key["recycleSubmit"]));
      }catch(e){ }
      commit('SET_RECYCLE_RESULT', { data })
    },
    FETCH_REPAIRS: ({ commit, dispatch, state })=>{
      state.pageLoading = true;
      fetch.getMaintainPhones(brandId)
        .then(data => {
          commit('SET_REPAIRS', { data });
          state.pageLoading = false;
        })
    }, 
    FETCH_POSITION:({ commit, dispatch, state })=>{
      let longitude = localStorage.getItem(state.key.position.longitude);
      let latitude = localStorage.getItem(state.key.position.latitude);
      commit('SET_POSITION',{longitude,latitude});
    },
    FETECH_STORE: ({ commit, dispatch, state }, {latitude, longitude })=>{
      return new Promise((resolve,reject)=>{
        fetch.getStore(latitude,longitude)
        .then(data => {
          resolve(data);
        }).catch(reject);
      })
    }, 
  },
  mutations:{
    SET_CUSTOMER: (state,{data}) =>{
      state.customer = data
    },
    SET_BRANDS: (state,{data}) =>{
      if(data.errorCode == SUCCESS){
        state.brands = data.data
      }else{
        state.brands = [];
      }
    },
  	SET_INDEX_HOT: (state,{data}) =>{
       state.indexHot = data.data
    },
    SET_RECYCLE: (state,{data}) =>{
      let recycles = Object.assign([], state.recycles);
      let brands = Object.assign([], state.brands);
      data.data.forEach((item2, idx) => {
        let flag = false;
        recycles.forEach((item, index) => {
          if (item2.id === item.id) {
            Object.assign({}, item, item2);
            flag = true;
          }
        });
        !flag && recycles.push(item2);
      });
      state.recycles = recycles;
    },
    SET_RECYCLE_SELECT:(state, {data}) =>{
      state.recycleSelect = data;
    },
    SET_RECYCLE_RESULT:(state, {data}) =>{
      state.recycleResult = data;
    },
    SET_RECYCLE_PROBLEMS:(state, {data}) =>{
      if(data.errorCode == SUCCESS){
        let recycleProblems = data.data
        if(recycleProblems){
          recycleProblems.forEach((item)=>{
            if(item.problemType == 0){
              item.checked = "";
            }else{
              item.checked = [];
            }
          });
        }
        state.recycleProblems = recycleProblems;
      }else{
        state.recycleProblems = [];
      }
    },
    SET_REPAIRS: (state, {data})=>{
      if(data.errorCode == SUCCESS){
        state.repairs = data.data
      }else{
        state.repairs = [];
      }
    },
    SET_POSITION: (state, {longitude,latitude})=>{
      if(!longitude || !latitude){
        longitude = 113;
        latitude = 22;
      }
      state.position.longitude = longitude;
      state.position.latitude = latitude;
    },
    SET_STORE: (state, {data})=>{
      state.stores = data;
    },
  }
})