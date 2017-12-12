<template>
  <div class="recoverResult">
    <yd-navbar :title="title">
      <router-link :to="'/recoverQues/'+this.$store.state.recycleSelect.id" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div style="margin: 0 .2rem">
      <yd-button style="height:1.2rem;" size="large" type="primary" shape="circle" bgcolor="#000" color="#fff">
        ￥{{offer.price}}
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
  created() {
    if(!this.$store.state.recycleSelect.name){
      this.$store.dispatch('FETCH_SINGLE_RECYCLE');
      this.$store.dispatch("FETCH_RECCYLE_RESULT");
    }
  },
  data() {
    return {
    }
  },
  computed:{
    title(){
      return "手机回收-"+this.$store.state.recycleSelect.name+"-报价";
    },
    offer(){
      return this.$store.state.recycleResult;
    }
  },
  methods: {
    goToForm: function() {
      this.$router.push('/recycleForm');
    },
    getGeolocation: function() {
      navigator.geolocation.getCurrentPosition(function(position) {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        console.log('longitude:' + longitude + ',latitude:' + latitude)
      });
    }
  }

}

</script>
<style scoped>


</style>
