<template>
  <div class="userIndex">
     <yd-navbar :title="title">
       <router-link to="/" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <div class="userTop">
      <div class="userImg">
        <img src="/static/img/product.jpg" alt="" style="width:100%">
      </div>
      <div class="userName">
        <span>{{customer.name}}</span>
        <yd-icon name="feedback" size=".3rem" style="display:none;"></yd-icon>
      </div>
    </div>
    <yd-cell-group>
        <yd-cell-item arrow type="link" href="repairOrder">
            <span slot="left">
              <img src="/static/img/icon/repair.png" alt="" style="height:.5rem;display:inline-block;    vertical-align: middle;">
              <span>维修订单</span>
            </span>
            <span slot="right"></span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="recycleOrder">
            <span slot="left">
              <img src="/static/img/icon/recover.png" alt="" style="height:.5rem;display:inline-block;    vertical-align: middle;">
              <span>回收订单</span>
            </span>
            <span slot="right"></span>
        </yd-cell-item>
        <yd-cell-item arrow type="link" href="userLuck">
            <span slot="left">
              <img src="/static/img/icon/luck.png" alt="" style="height:.5rem;display:inline-block;    vertical-align: middle;">
              <span>我的兑换码</span>
            </span>
            <span slot="right"></span>
        </yd-cell-item>
    </yd-cell-group>
    <div style="padding:.4rem">
      <yd-button type="danger" size="large" @click.native="logout">退出登录</yd-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userIndex',
  created(){

  },
  data () {
    return {
      title:"用户中心",
      username:"用户昵称"
    }
  },
  computed:{
    customer(){
      return this.$store.state.customer;
    }
  },
  methods:{
    logout(){
      localStorage.clear();
      this.$store.dispatch('FETCH_LOGIN_CACHE');
      this.$router.push('/login');
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
.userIndex .userTop {
  background: #04be02;
  padding:.5rem;
  margin-bottom:.5rem;
}
.userIndex .userImg{
  width:2rem;
  height:2rem;
  box-shadow: #0e760d 1px 1px 3px;
  border-radius: 50%;
  background: #fff;
  overflow: hidden;
  margin:0 auto;
}
.userIndex .userName{
  color:#fff;
  text-align: center;
  margin-top: .2rem;
}
</style>
