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
    this.$store.dispatch('FETCH_WEIXIN').then(()=>{

    }).catch((e)=>{
      console.log(e)
    })
    this.$store.dispatch('FETCH_BRANDS');
    this.$store.dispatch('FETCH_LOGIN_CACHE');
    navigator.geolocation.getCurrentPosition((position) =>{
      console.log("position:"+position.coords.longitude)
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        localStorage.setItem(this.$store.state.key.position.longitude, longitude);
        localStorage.setItem(this.$store.state.key.position.latitude, latitude);
        this.$store.dispatch('FETCH_POSITION');
    });
    if(!this.$store.state.customer.id){
      this.$router.push({ path: '/login' })
    }
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
