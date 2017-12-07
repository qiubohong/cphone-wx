<template>
  <div class="userLuck">
     <yd-navbar :title="title">
      <router-link to="/userIndex" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
      <yd-flexbox slot="right"  @click.native="show1 = true">
        <yd-icon slot='right' name="warn-outline" size='.24rem'></yd-icon>
        <span>开奖规则</span>
      </yd-flexbox>
    </yd-navbar>
    <div style="background:#fff;text-align:center;padding:.2rem 0;">
      <img style="border:1px solid #ececec;margin:.2rem auto;" src="/static/img/product.jpg" alt="">
      <div class="luck-title">iphone 8（价值 <em style="">￥8888</em>） 一台</div>
        <div>
          第x期兑换码池已有：
         <yd-countup :endnum="number" duration="1"></yd-countup>个
        </div>
        <div>距离开奖还差：<yd-countup :endnum="maxnum-number" duration="1" style='font-size:.38rem;color:#f00'></yd-countup>个</div>
    </div>
    <div style="font-size:.3rem;padding:.3rem .25rem;border-top:1px solid #ececec">我的兑换码</div>
    <yd-cell-group title="第x期">
      <yd-cell-item v-for="n in 6">
        <span slot="left" style="font-size:.26rem;">ABC4324SDDDSFAAASDXXA</span>
        <span slot="right">未开奖</span>
       </yd-cell-item>
    </yd-cell-group>
    <div style="font-size:.3rem;padding:.3rem .25rem;border-top:1px solid #ececec">兑换码记录</div>
    <yd-accordion title="">
      <yd-accordion-item v-for="n in 2" :title="'第'+n+'期'">
          <yd-cell-group>
            <yd-cell-item>
              <span slot="left" style="font-size:.26rem;">
                中奖号码：<span style="color:#0bb20c">ABC4324SDDDSFAAASDXXA</span>
              </span>
            </yd-cell-item>
            <yd-cell-item v-for="n in 6">
              <span slot="left" style="font-size:.26rem;">ABC4324SDDDSFAAASDXXA</span>
              <span slot="right" v-if='n != 3'>未中奖</span>
              <span slot="right" v-if='n == 3' style="color:#f00">中奖</span>
            </yd-cell-item>
          </yd-cell-group>
      </yd-accordion-item>
    </yd-accordion>
    <div style="margin:.3rem;text-align:center;display:none">
      <yd-button  type="hollow" shape="circle">往期开奖记录</yd-button>
    </div>
    <yd-popup v-model="show1" position="bottom" height="95%">
        <yd-button style="margin: .2rem;" type="danger" @click.native="show1 = false">关闭</yd-button>
        <div style="margin:.2rem;font-size:.28rem;line-height:.6rem;">
          <ol type="1">
            <li>1. 每次开奖为兑换码已发出20,000个</li>
            <li>2. 兑换码获取方式为：xxxxxx</li>
            <li>3. 获奖的童鞋可以耐心等候客服，客服美女将会在十个工作日内联系，请保证联系通畅。</li>
          </ol>
        </div>
    </yd-popup>
  </div>
</template>

<script>
export default {
  name: 'userLuck',
  mounted(){
    this.interval = setInterval(()=>{
      var num = ~~(Math.random() * 100);
      this.number += num;
      var last = this.maxnum - this.number;
      if(last <= 0){
        this.$dialog.alert({mes: '第x期中间兑换码有：<ul><li>ABC4324SDDDSFAAASDXXA</li></ul>'});
        this.number = 0;
      }
    },6000)
  },
  data () {
    return {
      title:"开奖中心",
      username:"用户昵称",
      show1: false,
      number: 1200,
      maxnum: 1300,
      nextLuck: false,
      interval: -1,
    }
  },
  methods:{
    noOpen: function(){
      this.$dialog.alert({
        title: '手机回收提示您',
        mes: '该功能正在开发中...',
      });
    }
  },
  beforeDestroy(){
    if(this.interval != -1){
      window.clearInterval(this.interval);
    }
  }
}
</script>
<style >
.yd-cell-right{
  min-height:.9rem;
}
.luck-title{
  font-size: .3rem;margin-bottom: .2rem;
}
.countdown{
  font-size: .3rem;
}
.countdown em{
  color:#f00;
}
</style>
