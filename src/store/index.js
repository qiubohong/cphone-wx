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
    
    key:{
      recycleSelect:"RECYCLE_SELECT",
      recycleSubmit:"RECYCLE_SUBMIT",
    },
    pageLoading:false,
  },
  actions:{
    FETCH_BRANDS:({ commit, dispatch, state })=>{
      fetch.getBrands()
        .then(data => {
          commit('SET_BRANDS', { data })
        })
    },
  	FETCH_INDEX_HOT:({ commit, dispatch, state })=>{
  		fetch.getIndexHot()
  			.then(data => {
          commit('SET_INDEX_HOT', { data })
        })
  	},
    FETCH_RECYCLES:({ commit, dispatch, state },{brandId})=>{
      state.pageLoading = true;
      fetch.getRecyclePhones(brandId)
        .then(data => {
          commit('SET_RECYCLE', { data });
          state.pageLoading = false;
        })
    },
    FETCH_SINGLE_RECYCLE:({ commit, dispatch, state })=>{
      let data = JSON.parse(localStorage.getItem(state.key["selectRecycle"]));
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
    FETCH_RECCYLE_RESULT:({ commit, dispatch, state })=>{
      let data = JSON.parse(localStorage.getItem(state.key["recycleSubmit"]));
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
  },
  mutations:{
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
  }
})