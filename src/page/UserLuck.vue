<template>
  <div class="userLuck">
    <yd-navbar :title="title">
      <router-link to="/userIndex" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
      <yd-flexbox slot="right" @click.native="ruleShow = true">
        <yd-icon slot='right' name="warn-outline" size='.24rem'></yd-icon>
        <span>开奖规则</span>
      </yd-flexbox>
    </yd-navbar>
    <div style="background:#fff;text-align:center;padding:.2rem 0;">
      <template v-if="prize.status">
        <img style="border:1px solid #ececec;margin:.2rem auto;width:3rem;" :src="prize.prizeImgHttpPath">
        <div class="luck-title">{{prize.prizeName}}（价值 <em style="">￥{{prize.prizeValue}}</em>）</div>
        <div>
          本期兑换码池已有：
          <yd-countup :endnum="prize.raffleNum" duration="1"></yd-countup>个
        </div>
        <div>距离开奖还差：
          <yd-countup :endnum="prize.raffleNum-prize.sentRaffleNum" duration="1" style='font-size:.38rem;color:#f00'></yd-countup>个</div>
      </template>
      <template v-if="!prize.status">
        <div style="padding:1rem 0;">奖品正在筹备中，马上就开始了，尽请期待！</div>
      </template>
    </div>

    <div style="font-size:.3rem;padding:.3rem .25rem;border-top:1px solid #ececec">我的兑换码</div>
    <div v-if="raffles.length == 0" style="background:#fff;padding:1rem 0;text-align:center;">
      还没有兑换码，赶快去 <yd-button @click.native="$router.push('/')">获取</yd-button>
    </div>
    <yd-cell-group v-if="raffles.length > 0">
      <yd-cell-item v-for="item in raffles">
        <span slot="left" style="font-size:.26rem;">{{item.raffleId}}</span>
        <span slot="right" v-if='item.status == "中奖"' style="color:#f00">{{item.status}}</span>
        <span slot="right"v-if='item.status != "中奖"'>{{item.status}}</span>
      </yd-cell-item>
    </yd-cell-group>

    <div style="font-size:.3rem;padding:.3rem .25rem;border-top:1px solid #ececec">兑换码记录</div>
    <yd-accordion>
      <yd-accordion-item v-for="(item, index) in records" :title="item.awardTime.replace(/-|:|\s/g,'')+'期'">
        <div style="padding:.4rem;">
          中奖兑换码：<span style="color:#f00">{{item.awardRaffleId}}</span>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <yd-popup v-model="ruleShow" position="bottom" height="95%">
      <yd-button style="margin: .2rem;" type="danger" @click.native="ruleShow = false">关闭</yd-button>
      <div style="margin:.2rem;font-size:.28rem;line-height:.6rem;">
        <ol type="1">
          <li>1. 每次开奖为采用兑换码池，当兑换码池中的兑换码全部购买完毕，即开奖。</li>
          <li>2. 兑换码获取方式为：
            <ul>
              <li>- 成功完成回收手机即可获取</li>
              <li>- 成功完成维修手机即可获取</li>
            </ul>
          </li>
          <li>3. 获奖的童鞋可以耐心等候客服，客服美女将会在十个工作日内联系，请保证联系通畅。</li>
        </ol>
      </div>
    </yd-popup>
  </div>
</template>
<script>
import {isLogin, goLogin} from '../utils/index'
export default {
  name: 'userLuck',
  created() {
    //如果没登录就跳转到登陆界面
    if(!isLogin(this.$store)){
      goLogin.call(this, window.location.href);
    }else{
      this.getPrize();
      this.getRaffles();
      this.gerRecords();
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getPrize();
    }, 1000 * 60)
  },
  data() {
    return {
      prize: {},
      raffles:[],
      title: "开奖中心",
      ruleShow: false,
      interval: -1,
      records: [],
    }
  },
  computed: {
    customer() {
      return this.$store.state.customer;
    }
  },
  methods: {
    getPrize() {
      this.$dialog.loading.open();
      this.$store.dispatch('FETECH_PRIZE').then((data) => {
        this.$dialog.loading.close();
        if (data && data.status == '1') {
          this.prize = data;
          this.$forceUpdate();
        } else {
          toastError(data.message)
        }
      }).catch((e) => {
        this.$dialog.loading.close();
        this.toastError('网络异常，稍后重试！')
      })
    },
    getRaffles(){
      this.$store.dispatch('FETECH_RAFFLES').then((data) => {
        this.$dialog.loading.close();
        if (data && data.status == '1') {
          this.raffles = data.data;
          this.$forceUpdate();
        } else {
          this.toastError(data.message)
        }
      }).catch((e) => {
        console.log(e)
        this.$dialog.loading.close();
        this.toastError('网络异常，稍后重试！')
      })
    },
    gerRecords(){
      this.$store.dispatch('FETCH_PRIZE_RECORD').then((data) => {
        this.$dialog.loading.close();
        if (data && data.status == '1') {
          this.records = data.data;
          this.$forceUpdate();
        } else {
          this.toastError(data.message)
        }
      }).catch((e) => {
        console.log(e)
        this.$dialog.loading.close();
        this.toastError('网络异常，稍后重试！')
      })
    }
  },
  beforeDestroy() {
    if (this.interval != -1) {
      window.clearInterval(this.interval);
    }
  }
}

</script>
<style>
.yd-cell-right {
  min-height: .9rem;
}

.luck-title {
  font-size: .3rem;
  margin-bottom: .2rem;
}

.countdown {
  font-size: .3rem;
}

.countdown em {
  color: #f00;
}

</style>
