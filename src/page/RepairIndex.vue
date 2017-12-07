<template>
    <div class="repairIndex">
      <yd-navbar title="手机维修">
       <router-link to="/" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <yd-scrolltab style='top:1rem'>
        <yd-scrolltab-panel v-for="item in list" :label="item.name">
            <yd-list theme="3">
              <yd-list-item v-for="t in item.child" @click.native="show1 = true;">
                  <img slot="img" :src="t.img">
                  <div slot="title" style="text-align: center;">{{t.title}}</div>
                  <div slot="other">
                     <yd-button size="large" type="primary">立即维修</yd-button>
                  </div>
              </yd-list-item>
          </yd-list>
        </yd-scrolltab-panel>
      </yd-scrolltab>
       <yd-popup v-model="show1" position="bottom" height="auto" style="padding:.2rem;">
          <div style="margin:.2rem .2rem .5rem .2rem">
            <h3 style="font-size:.4rem;margin-bottom:.5rem">iPhone6</h3>
            <yd-checkbox-group v-model="checkbox3">
                <yd-checkbox val="1">屏碎</yd-checkbox>
                <yd-checkbox val="2">电池故障</yd-checkbox>
                <yd-checkbox val="3">外壳更换</yd-checkbox>
            </yd-checkbox-group>
          </div>
          <yd-button type="primary" size="large" @click.native="selectRepairType">下一步</yd-button>
        </yd-popup>
        <yd-popup v-model="show2" position="right" height="100%" style="padding:.2rem;">
          <yd-cell-group>
              <yd-cell-item>
                <span slot="left" style="margin-right:.15rem">
                  <yd-navbar-back-icon></yd-navbar-back-icon>
                </span>
                <yd-input slot="right" v-model="input7" placeholder="请输入搜索的型号"></yd-input>
              </yd-cell-item>
            </yd-cell-group>
        </yd-popup>
    </div>
    </div>
</template>
<script>
export default {
  name: 'repairIndex',
  data (){
    return {
      input7: '',
      list: [{name:"iPhone",child:[
          {img: "/static/img/product.jpg", title: "iphone6"},
          {img: "/static/img/product.jpg", title: "iphone7"},
          {img: "/static/img/product.jpg", title: "iphone7"}]},
        {name:"华为",child:[
          {img: "/static/img/product.jpg", title: "华为Mate7"},
          {img: "/static/img/product.jpg", title: "华为Mate7"},
          {img: "/static/img/product.jpg", title: "华为Mate6"}]},
        {name:"oppo",child:[
          {img: "/static/img/product.jpg", title: "r11"},
          {img: "/static/img/product.jpg", title: "r9"},{img: "/static/img/product.jpg", title: "r7"}]},
        {name:"vivo",child:[{img: "/static/img/product.jpg", title: "y67"},{img: "/static/img/product.jpg", title: "a11"},{img: "/static/img/product.jpg", title: "f87"}]},
        {name:"小米",child:[{img: "/static/img/product.jpg", title: "M10"},{img: "/static/img/product.jpg", title: "小米6"},{img: "/static/img/product.jpg", title: "小米5"}]},
        {name:"金立",child:[{img: "/static/img/product.jpg", title: "ty65"},{img: "/static/img/product.jpg", title: "金立1"},{img: "/static/img/product.jpg", title: "金立2"}]},
      ],
      show2:false,
      show1: false,
      checkbox3:[]
    }
  },
  methods: {
    selectRepairType: function(){
      this.$router.push("/repairForm");
      this.show1 = false;
      return;
      if(this.checkbox3.length == 0){
        this.$dialog.toast({
          mes: '您还未选择任何故障',
          timeout: 1500
        });
        return;
      }
      this.show1 = false;
    }
  }
}
</script>
<style>
.repairIndex .m-scrolltab{
  margin-top: 2rem;
}
.repairIndex .btn-primary{
  font-size: .26rem;
  height: .6rem;
  margin-top: 0.1rem;
}
.repairIndex .popup-content .btn-primary{
  font-size: .28rem;
  height: .8rem;
  margin-top: 0.1rem;
}
</style>
