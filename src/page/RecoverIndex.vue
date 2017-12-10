<template>
  <div class="recoverIndex">
     <yd-navbar title="手机回收">
       <router-link to="/" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
     </yd-navbar>
     <yd-scrolltab style='top:1rem'>
        <yd-scrolltab-panel v-for="item in brands" :label="item.brandName" v-if="item.hasChild">
            <yd-list theme="3">
              <yd-list-item v-for="item2 in phones" v-if="item2.brandId == item.id">
                  <img slot="img" :src="item2.picUrl.indexOf('http') >= 0 ? item2.picUrl : 'http://'+item2.picUrl">
                  <div slot="title" style="text-align: center;">{{item2.name}}</div>
                  <div slot="other" style="text-align:center;padding:.1rem">
                    <span class="list-price"><em>¥</em>{{item2.totalPrice}}</span>
                  </div>
                  <div slot="other">
                     <yd-button size="large" type="primary"  @click.native="goToQues(item2)">立即购买</yd-button>
                  </div>
              </yd-list-item>
          </yd-list>
        </yd-scrolltab-panel>
      </yd-scrolltab>
  </div>
</template>

<script>
export default {
  name: 'recoverIndex',
  computed: {
    list(){
      return this.$store.state.indexHot
    },
    brands(){
      const brands = this.$store.state.brands;
      brands.forEach((item,index)=>{
        item.hasChild = true;
        this.$store.dispatch('FETCH_RECYCLES',{brandId:item.id})
      })
      if(brands.length > 0){
        this.$dialog.loading.close();
      }
      return this.$store.state.brands;
    },
    phones(){
      const recycles =  this.$store.state.recycles;
      this.brands.forEach((item, index)=>{
          var flag = false;
        recycles.forEach((item2)=>{
          if(item2.brandId === item.id){
            flag = true;
          }
        })
            this.brands[index].hasChild = flag;
      })
      return recycles;
    }
  },
  data () {
    return {
    }
  },
  watch:{
  },
  created () {
    this.$dialog.loading.open('很快加载好了');
    this.$store.dispatch('FETCH_INDEX_HOT');
  },
  mounted(){
  },
  methods:{
    goToQues: function(item){
      localStorage.setItem(this.$store.state.key.selectRecycle,JSON.stringify(item));
      this.$store.dispatch('FETCH_SINGLE_RECYCLE');
      this.$router.push({ path: '/recoverQues/'+item.id })
    }
  }

}
</script>
<style scoped>
.recoverIndex .btn-primary{
  font-size: .26rem;
  height: .6rem;
  margin-top: 0.1rem;
}
</style>
