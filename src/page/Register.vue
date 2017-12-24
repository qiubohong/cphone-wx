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
        <input v-model="name" slot="right" type="text" placeholder="请输入昵称">
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
        <input v-model="password" slot="right" type="number" placeholder="请输入登录密码">
        </span>
      </yd-cell-item>
    </yd-cell-group>
    <div style='margin:.2rem'>
      <yd-button size="large" type="primary" @click.native="register">立即绑定</yd-button>
    </div>
  </div>
</template>
<script>
import {sendSignCode} from '../store/fetch';

export default {
  name: 'register',
  created(){
    console.log(this.$store.state)
    if(this.$store.state.customer.id){
      this.$router.push({ path: '/' })
    }
  },
  computed: {
    wxOpenid(){
      return this.$store.state.wxOpenid;
    }
  },
  data() {
    return {
      name:"",
      number:"",
      password:"",
      authCode:"",
      code: false
    }
  },
  methods: {
    sendCode() {
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/; 
      if(!myreg.test(this.number)){
        this.toastError('手机格式不正确！')
        return;
      }
      this.$dialog.loading.open('发送中');
      sendSignCode(this.number).then((data)=>{
        if(this.$store.state.code["success"] == data.errorCode){
          this.$dialog.loading.close();
          this.$dialog.toast({
            mes:"发送成功",
            timeout:1500,
            icon:"success",
          })
          this.code = true;
        }else{
          this.toastError(data.errorInfo);
        }
      }).catch(()=>this.toastError('网络错误请稍后重试'));
    },
    check(){
      if(this.name == ""){
        this.toastError("昵称不能为空！");
        return false;
      }
      if(this.number == ""){
        this.toastError("电话号码不能为空！");
        return false;
      }
      if(this.authCode == ""){
        this.toastError("验证码不能为空！");
        return false;
      }
      if(this.password == ""){
        this.toastError("密码不能为空！");
        return false;
      }
      return true;
    },
    register(){
      if(!this.check()){
        return;
      }
      let data = {
        name:this.name,
        number:this.number,
        password:this.password,
        authCode:this.authCode,
        wxOpenid: this.wxOpenid,
      };
      this.$dialog.loading.open('注册中');
      this.$store.dispatch("FETCH_SIGN",{data})
        .then(data=>{
        this.$dialog.loading.close();
          if(this.$store.state.code["success"] == data.errorCode){
            this.$dialog.toast({
              mes:"注册成功",
              timeout:1500,
              icon:"success",
            });
            
            localStorage.setItem(this.$store.state.key["customer"], JSON.stringify(data.data));
            this.$store.dispatch('FETCH_LOGIN_CACHE');
            setTimeout(function() {
              var url = localStorage.getItem("returnUrl") || "/";
              location.href = url;
            }, 10);
          }else{
            this.$dialog.toast({
            mes:data.errorInfo,
            timeout:1500,
            icon:"error",
          })
          }
        }).catch((e)=>{
          console.error(e)
          this.$dialog.toast({
          mes:"网络错误请稍后重试",
          timeout:1500,
          icon:"error",
        })
        })
    }
  }

}

</script>
<style scoped>


</style>
