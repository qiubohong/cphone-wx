<template>
  <div class="index">
    <yd-flexbox align='center' direction='vertical' style='margin-top:1rem'>
        <yd-flexbox-item align='center'><img src="/static/img/product.jpg" alt=""></yd-flexbox-item>
        <yd-flexbox-item align='center'><h1 style="margin:.4rem 0;font-size:.6rem">创手机-回收维修</h1></yd-flexbox-item>
    </yd-flexbox>
    <yd-cell-group style='margin:0 .2rem'>
      <yd-cell-item>
        <yd-icon slot="icon" name="phone3" size=".45rem"></yd-icon>
        <input  slot="right" type="number" placeholder="请输入手机号">
        </span>
      </yd-cell-item>
       <yd-cell-item>
            <yd-icon slot="icon" name="shield-outline" size=".45rem"></yd-icon>
            <input type="text" slot="right" placeholder="请输入验证码">

            <!-- ↓↓关键代码是这里↓↓ -->
            <yd-sendcode slot="right" 
                         v-model="start1" 
                         @click.native="sendCode1" 
                         type="warning"
            ></yd-sendcode>
            <!-- ↑↑关键代码是这里↑↑ -->

        </yd-cell-item>
    </yd-cell-group>
    <div style='margin:.2rem'>
    <yd-button size="large" type="primary">登录</yd-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  computed: {
    
  },
  data () {
    return {
      start1: false
    }
  },
  created () {
  },
  methods:{
    sendCode1() {
                this.$dialog.loading.open('发送中...');
                setTimeout(() => {

                    this.start1 = true;
                    this.$dialog.loading.close();

                    this.$dialog.toast({
                        mes: '已发送',
                        icon: 'success',
                        timeout: 1500
                    });

                }, 1000);
            }
  }

}
</script>
<style scoped>

</style>
