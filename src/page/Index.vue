<template>
  <div class="index">
     <yd-navbar title="上门·快修·回收">
       <router-link to="userIndex" slot="right">
            <yd-icon name="ucenter-outline" size="25px" color="#777"></yd-icon>
        </router-link>
     </yd-navbar>
     <yd-slider autoplay="3000">
        <yd-slider-item>
            <img src="http://www.chuangshouji.com:8089/phone/1514203312740.1.jpg">
        </yd-slider-item>
        <yd-slider-item>
            <img src="http://www.chuangshouji.com:8089/phone/1514203347268.2.jpg">
        </yd-slider-item>
    </yd-slider>
    <yd-grids-group :rows="4" item-height="2rem" style="border-top:1px solid #ececec">
        <yd-grids-item link="recycleIndex">
            <img slot="icon" style="height:1.2rem" src="/static/img/icon/a1.jpg">
        </yd-grids-item>
        <yd-grids-item link="repairIndex">
            <img slot="icon" style="height:1.2rem" src="/static/img/icon/a2.jpg">
        </yd-grids-item>
        <yd-grids-item link="userLuck">
            <img slot="icon" style="height:1.2rem" src="/static/img/icon/a3.jpg">
        </yd-grids-item>
        <yd-grids-item>
            <img @click="goTel" slot="icon" style="height:1.2rem" src="/static/img/icon/a4.jpg">
        </yd-grids-item>
    </yd-grids-group>
    <div class="index-title">
    热门回收机型
    </div>
    <yd-list theme="3">
        <yd-list-item v-for="item in list" @click.native="goToQues(item)">
            <img slot="img" :src="item.picUrl.indexOf('http') >= 0 ? item.picUrl : 'http://'+item.picUrl">
            <div slot="title" style="text-align: center;">{{item.name}}</div>
            <div slot="other" style="text-align:center;padding:.1rem">
              <span class="list-price"><em>¥</em>{{item.totalPrice}}</span>
            </div>
            <div slot="other">
               <yd-button size="large" type="primary">立即回收</yd-button>
            </div>
        </yd-list-item>
    </yd-list>
  </div>
</template>

<script>

export default {
  name: 'hello',
  computed: {
    list(){
      return this.$store.state.indexHot
    }
  },
  data () {
    return {
    }
  },
  watch:{
  },
  created () {
    this.$dialog.loading.open()
    this.$store.dispatch('FETCH_INDEX_HOT').then(()=>{
      this.$dialog.loading.close();
    })
  },
  methods:{
    goToQues: function(item){
      localStorage.setItem(this.$store.state.key.recycleSelect,JSON.stringify(item));
      this.$store.dispatch('FETCH_SINGLE_RECYCLE');
      this.$router.push({ path: '/recycleQues/'+item.id })
    },
    noOpen: function(){
      this.$dialog.alert({
        title: '手机回收提示您',
        mes: '该功能正在开发中...',
      });
    },
    goTel(){
      window.location.href = "tel:4006465400"
    }
  }

}
</script>
<style scoped>
.index-title{
  padding: .2rem .26rem;
  font-size: .26rem;
}
.index .btn-primary{
  font-size: .26rem;
    height: .6rem;
    margin-top: 0.1rem;
}
</style>
