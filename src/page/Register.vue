<template>
  <div class="index">
    <yd-flexbox align='center' direction='vertical' style='margin-top:1rem'>
      <yd-flexbox-item align='center'><img src="/static/img/product.jpg" alt=""></yd-flexbox-item>
      <yd-flexbox-item align='center'>
        <h1 style="margin:.4rem 0;font-size:.6rem">创手机-完善信息</h1></yd-flexbox-item>
    </yd-flexbox>
    <yd-cell-group style='margin:0 .2rem'>
      <yd-cell-item>
        <yd-icon slot="icon" name="ucenter-outline" size=".45rem"></yd-icon>
        <input v-model="name" slot="right" type="number" placeholder="请输入昵称">
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
        <input v-model="number" slot="right" type="number" placeholder="请输入手机号">
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <yd-icon slot="icon" name="shield-outline" size=".45rem"></yd-icon>
        <input v-model="authCode" type="text" slot="right" placeholder="请输入验证码">
        <!-- ↓↓关键代码是这里↓↓ -->
        <yd-sendcode 
          slot="right" 
          v-model="code" 
          @click.native="sendCode" 
          type="warning"
          storage-key="registerCode"></yd-sendcode>
        <!-- ↑↑关键代码是这里↑↑ -->
      </yd-cell-item>
      <yd-cell-item>
        <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
        <input v-model="passwd" slot="right" type="number" placeholder="请输入登录密码">
        </span>
      </yd-cell-item>
    </yd-cell-group>
    <div style='margin:.2rem'>
      <yd-button size="large" type="primary">登录</yd-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'register',
  computed: {
    wxOpenid(){
      return this.$store.state.wxOpenid;
    }
  },
  data() {
    return {
      name:"",
      number:"",
      passwd:"",
      authCode:"",
      code: false
    }
  },
  created() {},
  methods: {
    sendCode() {
      setTimeout(() => {
        this.code = true;
      }, 1000);
    }
  }

}

</script>
<style scoped>


</style>
