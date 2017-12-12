<template>
  <div class="recoverOrder">
     <yd-navbar :title="title">
       <router-link to="/userIndex" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <div class="order-box" v-for="n in 6">
      <yd-flexbox class="order-title">
        <div>iphone6s</div>
        <yd-flexbox-item style="text-align:right;" class="price">￥2800.00</yd-flexbox-item>
      </yd-flexbox> 
        <yd-flexbox style="margin">
          <div class="order-icon">
            <yd-icon name="phone3"></yd-icon>
          </div>
          <yd-flexbox-item>
            <div>预约地址：广东省东莞市xxxx</div>
            <div>手机号：1365487555124</div>
            <div style="color:#aaa">[2010.10.11 18:00:09]</div>
          </yd-flexbox-item>
        </yd-flexbox>
        <yd-step current="2">
          <yd-step-item>
              <span slot="bottom">订单提交</span>
          </yd-step-item>
          <yd-step-item>
              <span slot="bottom">订单受理</span>
          </yd-step-item>
          <yd-step-item>
              <span slot="bottom">工程师出发</span>
          </yd-step-item>
          <yd-step-item>
              <span slot="bottom">回收完成</span>
          </yd-step-item>
        </yd-step>
        <div class="order-footer">
          <yd-button type="primary">去催单</yd-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recoverOrder',
  data () {
    return {
      title:"回收订单",
      username:"用户昵称"
    }
  },
  methods:{
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
</style>
