<template>
  <div id="app">
    <router-view></router-view>
    <div class="footer">
      ©版本归创手机所有 2017
    </div>
  </div>
</template>
<script>
export default {
  name: 'app',
  created(){
    /*this.$store.dispatch('FETCH_WEIXIN').then(()=>{

    }).catch((e)=>{
      console.log(e)
    });*/
    this.$store.dispatch('FETCH_POSITION');
    this.$store.dispatch('FETCH_BRANDS');
  },
  watch: {
   '$route'() {
      if (_czc) {
         var location = window.location
         var content_url = location.pathname + location.hash
         var referer_url = '/'
         _czc.push(['_trackPageview', content_url, referer_url])
      }
   },
 }
}
</script>

<style>
.footer{
  text-align: center;
  color:#aaa;
  margin:.3rem 0;
}
.yd-list-img img{
  margin-top: 0 !important;
  transform: translateY(-50%);
}
</style>
