<template>
  <div class="index">
     <yd-navbar title="手机回收">
       <router-link to="userIndex" slot="right">
            <yd-icon name="ucenter-outline" size="25px" color="#777"></yd-icon>
        </router-link>
     </yd-navbar>
     <yd-slider autoplay="3000">
        <yd-slider-item>
            <img src="/static/img/banner/1.png">
        </yd-slider-item>
        <yd-slider-item>
            <img src="/static/img/banner/2.jpg">
        </yd-slider-item>
    </yd-slider>
    <yd-grids-group :rows="3">
        <yd-grids-item link="recycleIndex">
            <img slot="icon" src="/static/img/icon/a1.png">
            <span slot="text">手机回收</span>
        </yd-grids-item>
        <yd-grids-item link="repairIndex">
            <img slot="icon" src="/static/img/icon/a2.png">
            <span slot="text">手机维修</span>
        </yd-grids-item>
        <yd-grids-item @click.native="noOpen">
            <img slot="icon" src="/static/img/icon/a3.png">
            <span slot="text">开奖中心</span>
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
               <yd-button size="large" type="primary">立即购买</yd-button>
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
      localStorage.setItem(this.$store.state.key.selectRecycle,JSON.stringify(item));
      this.$store.dispatch('FETCH_SINGLE_RECYCLE');
      this.$router.push({ path: '/recycleQues/'+item.id })
    },
    noOpen: function(){
      this.$dialog.alert({
        title: '手机回收提示您',
        mes: '该功能正在开发中...',
      });
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
