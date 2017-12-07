<template>
  <div class="recoverResult">
    <yd-navbar :title="title">
       <router-link :to="'/recoverQues/'+this.$store.state.recoverSelect.id" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <div style="margin: 0 .2rem">
    <yd-button size="large" type="primary" shape="circle" bgcolor="#000" color="#fff">
      ￥{{money}}
    </yd-button>
    </div>
    <img src="/static/img/icon/result-icons.png" alt="" style="width:100%">
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="goToForm">去下单</yd-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'recoverResult',
  created(){
    
  },
  data () {
    return {
      title:"手机回收-iphone6-报价",
      money:"2800",
      quesList: [
        {title: "选项标题1", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}]},
        {title: "选项标题2", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}]},
        {title: "选项标题3", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}]},
        {title: "选项标题4", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}]}
      ]
    }
  },
  methods:{
    goToForm: function(){
      this.$router.push('/recoverForm');
    }
  }

}
</script>
<style scoped>
</style>
