<template>
  <div class="recoverOrder">
    <yd-navbar :title="title">
      <router-link to="/userIndex" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <div style="padding:1rem;text-align:center;" v-if="list.length === 0">
      暂无订单，去下单吧！
      <yd-button @click.native="$router.push('/')">去首页</yd-button>
    </div>
    <div class="order-box" v-for="item in list">
      <yd-flexbox class="order-title">
        <div>维修机型：{{item.repairPhoneName}}</div>
        <yd-flexbox-item style="text-align:right;" class="price">￥{{item.amount}}</yd-flexbox-item>
      </yd-flexbox>
      <yd-flexbox style="margin">
        <div class="order-icon">
          <yd-icon name="phone3"></yd-icon>
        </div>
        <yd-flexbox-item style="padding-top:.2rem;line-height:.4rem">
          <div v-if="item.serviceType == 1">预约地址：{{item.address}}</div>
          <template v-if="item.serviceType == 2">
            <div>门店地址：{{item.storeName}}</div>
            <div>门店电话：<a :href="'tel:'+item.storeNumber">{{item.storeNumber}}<yd-icon name="phone2" size=".2rem"></yd-icon></a></div>
          </template>
          <div v-if="item.serviceType < 3">预约时间：{{item.period}}</div>
          <div>预约类型：{{serviceType[item.serviceType]}}</div>
          <!-- <div>手机号：1365487555124</div> -->
          <div style="color:#aaa;margin-bottom:.2rem;">下单时间：[{{item.applyTime | formatDate('yyyy-MM-dd hh:mm:ss')}}]</div>
        </yd-flexbox-item>
        <div style="color:#f00;padding-right:.2rem" v-if="item.status == 5">订单已取消</div>
      </yd-flexbox>
      <yd-step :current="item.status + 1" v-if="item.status != 5">
        <yd-step-item>
          <span slot="bottom">订单提交</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">待受理</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">订单受理</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">服务完成</span>
        </yd-step-item>
        <yd-step-item>
          <span slot="bottom">确认完成</span>
        </yd-step-item>
      </yd-step>
      <div class="order-footer">
        <yd-button type="primary" v-if="item.status == 3" @click.native="payOrder(item.serialNumber)">支付订单</yd-button>
        <yd-button type="danger" v-if="item.status < 3" @click.native="cancleOrder(item.serialNumber)">取消订单</yd-button>
      </div>
    </div>
  </div>
</template>
<script>
import { payOrder, confirmFinishRepairOrder } from '../store/fetch'
import { wxPay } from '../utils/index'

export default {
  name: 'recoverOrder',
  created() {
    if (this.$store.state.customer.id) {
      this.getOrderList();
    }
  },
  data() {
    return {
      title: "维修订单",
      serviceType: {
        "1": "上门",
        "2": "门店",
        "3": "邮寄"
      },
      orderStatus: {
        //0：未下单，1： 待接单，2：已接单，3：已完成 ，4：交易失败，5：已删除
      },
      phones: {}, //缓存已经请求到的手机
      stores: {} //缓存已经请求到的门店
    }
  },
  computed: {
    customer() {
      return this.$store.state.customer;
    },
    list() {
      return this.$store.state.repairOrderList;
    }
  },
  methods: {
    payOrder(orderSn) {
      this.$dialog.confirm({
        title: '创手机-提示您',
        mes: '确定手机已经维修好了？点击确定支付！',
        opts: () => {
          this.goPay(orderSn);
        }
      });
    },
    goPay(orderSn) {
      this.$dialog.loading.open('正在启动支付...');
      //1 获取请求微信支付的参数
      payOrder(orderSn).then((res) => {
        this.$dialog.loading.close();
        if (res && res.status == 1) {
          //2 调用微信支付的内置接口
          wxPay(res.appId, res.timeStamp, res.nonceStr, res.package, res.signType, res.paySign).then((wxRes) => {
            this.$dialog.loading.open('完成支付，请求订单状态...');
            //3 完成微信支付，调用完成订单接口
            confirmFinishRepairOrder(orderSn).then((data) => {
              this.$dialog.loading.close();
              if (data.data && data.errorCode === this.$store.state.code['success']) {
                this.$dialog.alert({
                  mes: "支付成功，订单完成！",
                  callback: () => {
                    this.getOrderList();
                  }
                });
              } else {
                this.toastError(data.errorInfo);
              }
            }).catch((e) => {
              console.log(e)
              this.toastError('网络异常，请稍后重试！')
            });
            //微信支付错误提示
          }).catch((msg) => this.toastError(msg));
        } else {
          this.toastError(res.msg);
        }
      }).catch((e) => {
        //请求微信支付参数错误提示
        console.log(e)
        this.toastError('网络异常，请稍后重试！')
      });
    },

    cancleOrder(orderSn) {
      this.$dialog.confirm({
        title: '创手机-提示您',
        mes: '是否删除该订单？',
        opts: () => {
          this.$dialog.loading.open();
          let customerId = this.customer.id;
          this.$store.dispatch('FETCH_REPARI_CANCLEORDER', { orderSn, customerId })
            .then((data) => {
              this.$dialog.loading.close();
              this.getOrderList();
            })
        }
      });
    },
    noOpen: function() {
      this.$dialog.alert({
        title: '手机回收提示您',
        mes: '该功能正在开发中...',
      });
    },
    getOrderList() {
      this.$dialog.loading.open();
      this.$store.dispatch('FETCH_REPAIR_ORDERLIST', { customerId: this.customer.id })
        .then((data) => {
          this.$dialog.loading.close();
          data.data.forEach((item, index) => {
            if (this.phones[item.maintainPhoneId]) {
              this.list[index].repairPhoneName = this.phones[item.maintainPhoneId].name;
            } else {
              this.$store.dispatch('FETCH_REPARI_ID', { phoneId: item.maintainPhoneId })
                .then((data) => {
                  this.phones[item.maintainPhoneId] = data.data;
                  this.list[index].repairPhoneName = data.data.name;
                  this.$forceUpdate();
                });
            }
            //如果不是门店维修
            if (item.storeId) {
              if (this.stores[item.storeId]) {
                this.list[index].storeName = this.stores[item.storeId].address + '(' + this.stores[item.storeId].name + ')';
                this.list[index].storeNumber = this.stores[item.storeId].number;
              } else {
                this.$store.dispatch('FETECH_STORE_ID', { storeId: item.storeId })
                  .then((data) => {
                    this.stores[item.storeId] = data.data;
                    this.list[index].storeName = data.data.address + '(' + data.data.name + ')';
                    this.list[index].storeNumber = data.data.number;
                    this.$forceUpdate();
                  });
              }
            }
            this.$forceUpdate();
          })
        })
    }
  }
}

</script>
<style scoped>


</style>
