<template>
  <div class="recoverForm">
    <div style="background:#04be02;width:3rem;height:3rem;text-align:center;line-height:3rem;border-radius:50%;margin:.4rem auto;">
      <yd-icon name="checkoff" color="#fff" size="1.5rem"></yd-icon>
    </div>
    <p style="text-align:center;font-size:.3rem">
      感谢亲，下单成功！<br>
感谢您的支持<br>
我们客服会尽快跟您联系<br>
敬请稍候！<br>
    </p>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="backQues">再次下单</yd-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formSuccess',
  data () {
    return {
      title:"下单成功"
    }
  },
  methods:{
    backQues: function(){
      var router = this.$route.params.router;
      if(router){
        this.$router.push("/"+router);
      }else{
        this.$router.push("/");
      }
      
    }
  }

}
</script>
<style scoped>
</style>
