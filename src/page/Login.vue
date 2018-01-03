<template>
  <div class="index">
    <yd-flexbox align='center' direction='vertical' style='margin-top:1rem'>
      <yd-flexbox-item align='center'><img src="/static/img/product.png" alt=""></yd-flexbox-item>
      <yd-flexbox-item align='center'>
        <h1 style="margin:.4rem 0;font-size:.6rem">创手机-回收维修</h1></yd-flexbox-item>
    </yd-flexbox>
    <yd-cell-group style='margin:0 .2rem'>
      <yd-cell-item>
        <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
        <input v-model="number" slot="right" type="number" placeholder="请输入手机号">
        </span>
      </yd-cell-item>
      <yd-cell-item>
        <yd-icon slot="icon" name="warn-outline" size=".45rem"></yd-icon>
        <input v-model="password" slot="right" type="password" placeholder="请输入密码">
      </yd-cell-item>
    </yd-cell-group>
    <div style='margin:.2rem'>
      <yd-button size="large" type="primary" @click.native="login">登录</yd-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  computed: {
    wxOpenid() {
      return this.$store.state.wxOpenid;
    }
  },
  data() {
    return {
      number: "",
      password: ""
    }
  },
  created() {},
  methods: {
    toastError(mes) {
      this.$dialog.toast({
        mes: mes,
        timeout: 1500,
        icon: "error",
      })
    },
    check() {
      if (this.number == "") {
        this.toastError("手机号不能为空！");
        return false;
      }
      if (this.password == "") {
        this.toastError("密码不能为空！");
        return false;
      }
      return true;
    },
    login() {
      if (!this.check()) {
        return;
      }
      let data = {
        number: this.number,
        password: this.password,
        wxOpenid: this.wxOpenid,
      };
      this.$dialog.loading.open('登录中');
      this.$store.dispatch("FETCH_LOGIN", { data })
        .then(data => {
          this.$dialog.loading.close();
          if (this.$store.state.code["success"] == data.errorCode) {
            this.$dialog.toast({
              mes: "登录成功",
              timeout: 1500,
              icon: "success",
            });
            localStorage.setItem(this.$store.state.key["customer"], JSON.stringify(data.data));
            this.$store.dispatch('FETCH_LOGIN_CACHE');
            setTimeout(function() {
              var url = localStorage.getItem("returnUrl") || "/";
              location.href = url;
            }, 10);
          } else {
            this.$dialog.toast({
              mes: data.errorInfo,
              timeout: 1500,
              icon: "error",
            })
          }
        }).catch((e) => {
          console.error(e)
          this.$dialog.toast({
            mes: "网络错误请稍后重试",
            timeout: 1500,
            icon: "error",
          })
        })
    }
  }

}

</script>
<style scoped>


</style>
