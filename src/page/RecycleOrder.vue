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
        <yd-flexbox-item>回收机型：{{item.recyclePhoneName}}</yd-flexbox-item>
        <yd-flexbox-item style="text-align:right;" class="price">￥{{item.amount}}</yd-flexbox-item>
      </yd-flexbox>
      <yd-flexbox>
        <div class="order-icon">
          <yd-icon name="phone3"></yd-icon>
        </div>
        <yd-flexbox-item style="padding-top:.2rem">
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
      <div class="order-footer" v-if="item.status < 3">
        <yd-button type="danger" @click.native="cancleOrder(item.serialNumber)">取消订单</yd-button>
      </div>
      <div class="order-footer" v-if="item.status == 3">
        <yd-button type="primary" @click.native="finishOrder(item.serialNumber)">确认完成</yd-button>
      </div>
    </div>
  </div>
</template>
<script>
import { confirmFinishRecycleOrder } from '../store/fetch'

export default {
  name: 'recycleOrder',
  created() {
    if (this.$store.state.customer.id) {
      this.getOrderList();
    }
  },
  data() {
    return {
      title: "回收订单",
      serviceType: {
        "1": "上门",
        "2": "门店",
        "3": "邮寄"
      }
    }
  },
  watch: {},
  computed: {
    customer() {
      return this.$store.state.customer;
    },
    list() {
      return this.$store.state.recycleOrderList;
    }
  },
  methods: {
    finishOrder(orderSn) {
      this.$dialog.confirm({
        title: '创手机-提示您',
        mes: '是否确认订单已完成（不可回退）？',
        opts: () => {
          this.$dialog.loading.open();
          confirmFinishRecycleOrder(orderSn).then((data) => {
            this.$dialog.loading.close();
            if (data.data && data.errorCode === this.$store.state.code['success']) {
              this.$dialog.alert({
                mes: "订单完成！",
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

        }
      });
    },
    cancleOrder(orderSn) {
      this.$dialog.confirm({
        title: '创手机-提示您',
        mes: '是否删除该订单？',
        opts: () => {
          this.$dialog.loading.open();
          let customerId = this.customer.id;
          this.$store.dispatch('FETCH_RECYCLE_CANCLEORDER', { orderSn, customerId })
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
    getOrderList(store) {
      this.$dialog.loading.open();
      this.$store.dispatch('FETCH_RECYCLE_ORDERLIST', { customerId: this.$store.state.customer.id }).then((data) => {
        this.$dialog.loading.close();
        data.data.forEach((item, index) => {
          this.$store.dispatch('FETCH_RECYCLE_ID', { phoneId: item.recyclePhoneId })
            .then((data) => {
              this.list[index].recyclePhoneName = data.data.name;
              this.$forceUpdate();
            });
          this.$store.dispatch('FETECH_STORE_ID', { storeId: item.storeId })
            .then((data) => {
              this.list[index].storeName = data.data.address + '(' + data.data.name + ')';
              this.list[index].storeNumber = data.data.number;

              this.$forceUpdate();
            });
        })
      });
    }
  }
}

</script>
<style scoped>


</style>
