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
    recycles: [],
    recoverSelect:{}
  },
  actions:{
    FETCH_BRANDS:({ commit, dispatch, state })=>{
      fetch.getBrands()
        .then(data => {
          commit('SET_BRANDS', { data })
          return Promise.resolve(data);
        })
    },
  	FETCH_INDEX_HOT:({ commit, dispatch, state })=>{
  		fetch.getIndexHot()
  			.then(data => {
          commit('SET_INDEX_HOT', { data })
          return Promise.resolve(data);
        })
  	},
    FETCH_RECYCLES:({ commit, dispatch, state },{brandId})=>{
      fetch.getRecyclePhones(brandId)
        .then(data => {
          commit('SET_RECYCLE', { data })
          return Promise.resolve(data);
        })
    },
    FETCH_SINGLE_RECYCLE:({ commit, dispatch, state },{brandId})=>{
      fetch.getRecyclePhones(brandId)
        .then(data => {
          commit('SET_RECYCLE', { data })
          return Promise.resolve(data);
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
      data.data.forEach((item2, idx) => {
        let flag = false;
        recycles.forEach((item, index) => {
          if (item2.id === item.id) {
            Object.assign({}, item, item2);
            flag = true;
          }
        });
        !flag && recycles.push(item2);
      })
      state.recycles = recycles;
    },
    SET_RECOVER_SELECT:(state,{data}) => {
      state.recoverSelect = data;
    }
  }
})