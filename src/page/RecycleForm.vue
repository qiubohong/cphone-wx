<template>
  <div class="recoverForm">
    <yd-navbar :title="title">
      <router-link :to="'/recycleResult/'+this.$store.state.recycleSelect.id" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <img src="/static/img/icon/form-icons.png" alt="" style="width:100%">
    <yd-cell-group>
      <yd-cell-item>
        <span slot="left">回收手机：{{recycleSelect.name}} </span>
        <span slot="right">￥{{offer.price}}</span>
      </yd-cell-item>
      <!-- <yd-cell-item>
        <span slot="left">手机号：</span>
        <input slot="right" v-model="formData." type="tel" placeholder="请输入手机号">
      </yd-cell-item> -->
      <yd-cell-item>
        <span slot="left">回收方式：</span>
        <div slot="right" style="text-align:left;width:100%">
          <yd-radio-group v-model="formData.serviceType">
            <yd-radio val="1">上门</yd-radio>
            <yd-radio val="2">门店</yd-radio>
            <yd-radio val="3">邮寄</yd-radio>
          </yd-radio-group>
        </div>
      </yd-cell-item>
      <template v-if='formData.serviceType == 1'>
        <yd-cell-item arrow>
          <span slot="left">所在地区：</span>
          <input slot="right" type="text" @click.stop="cityShow = true" v-model="cityModel" readonly :placeholder="placeholder">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">详细地址：</span>
          <input v-model="address" slot="right" type="text" placeholder="请输入详细地址">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">预约时间：</span>
          <yd-datetime
              :start-date="startDate" 
              :end-date="endDate" 
              start-hour="9"
              end-hour="22"
              type="datetime" v-model="formData.period" slot="right"></yd-datetime>
        </yd-cell-item>
      </template>
      <template v-if='formData.serviceType == 2'>
        <yd-cell-item arrow @click.native="getStore">
          <span slot="left">{{checkedAddress == '' ? '请选择门店' : checkedAddress}}</span>
        </yd-cell-item>
      </template>
      <template v-if='formData.serviceType == 3'>
        <yd-cell-item>
          <span slot="left">锁屏密码：</span>
          <input v-model="formData.iphonePasswd" slot="right" type="text" placeholder="请输入锁屏密码">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">快递公司：</span>
          <input v-model="formData.expressCompany" slot="right" type="text" placeholder="请输入快递公司">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">快递单号：</span>
          <input v-model="formData.expressNumber" slot="right" type="number" placeholder="请输入快递单号">
        </yd-cell-item>
      </template>
    </yd-cell-group>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="submitForm">确定下单</yd-button>
    </div>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="danger" @click.native="backQues">重新评估</yd-button>
    </div>

    <yd-cityselect :provance="provance"
                :city="city"
                v-model="cityShow" :done="cityResult" :items="district" ref="cityselectDemo"></yd-cityselect>

    <yd-popup v-model="storeShow" position="bottom" height="95%">
      <yd-flexbox style="margin: .2rem;">
        <yd-flexbox-item>
          <yd-button type="primary" @click.native="storeShow = false">确定</yd-button>
        </yd-flexbox-item>
        <yd-flexbox-item style='text-align:right'>
          <yd-button type="danger" @click.native="cancelStore">取消</yd-button>
        </yd-flexbox-item>
      </yd-flexbox>
      <yd-cell-group>
        <yd-cell-item type="radio" style='padding-bottom:.2rem' v-for="(store,index) in stores">
          <span slot="left">
                <h3>{{store.name}}</h3>
                <p>门店地址：{{store.address}}</p>
                <p>联系电话：{{store.number}}</p>
              </span>
          <input slot="right" type="radio" :value="index" v-model="storeIndex" />
        </yd-cell-item>
      </yd-cell-group>
    </yd-popup>
  </div>
</template>
<script>
import District from 'ydui-district/dist/gov_province_city_area_id';
import { formateDate, isLogin, goLogin } from '../utils/index'
import {getAddreessByPosition} from '../store/fetch'

export default {
  name: 'recoverForm',
  created() {
    if (isLogin(this.$store)) {
      if (!this.$store.state.recycleSelect.name) {
        this.$store.dispatch('FETCH_SINGLE_RECYCLE');
        this.$store.dispatch("FETCH_RECCYLE_RESULT");
        this.$store.dispatch("FETCH_POSITION");
      }
    } else {
      goLogin.call(this, window.location.href);
    }
  },
  data() {
    let now = new Date();
    now.setDate(now.getDate() + 1);
    let startDate = formateDate(now, "yyyy-MM-dd hh:mm");
    now.setDate(now.getDate() + 7);
    let endDate = formateDate(now, "yyyy-MM-dd hh:mm");
    return {
      startDate: startDate,
      endDate: endDate,
      cityShow: false,
      provance: "",
      city: "",

      storeShow: false,
      formData: {
        "recyclePhoneId": 0,
        "remark": "",
        "customerId": 0,
        "serviceType": 1, //1：上门；2：门店；3：邮寄
        "address": "",
        "period": "",
        "storeId": 1,
        "expressCompany": "",
        "expressNumber": "",
        "iphonePasswd": "",
        "recyclePhoneProblems": {
          "phoneId": 0,
          "answers": [{
            "problemId": 0,
            "selectIds": [
              0
            ]
          }]
        },
        "positon": "0,0" //坐标：lat,lng
      },
      address: "",
      cityModel: '',
      district: District,
      checkedAddress: '',
      storeIndex: -1,
      selectStore: {},

      placeholder: "请选择省市"
    }
  },
  watch: {
    storeIndex(val) {
      if (val != -1) {
        this.selectStore = this.stores[val];
        this.checkedAddress = this.stores[val].address;
      }
    }
  },
  computed: {
    title() {
      return "手机回收-" + this.$store.state.recycleSelect.name + "-填写";
    },
    recycleSelect() {
      this.formData.recyclePhoneId = this.$store.state.recycleSelect.id;
      this.formData.recyclePhoneProblems = this.$store.state.recycleResult;
      this.formData.customerId = this.$store.state.customer.id;
      return this.$store.state.recycleSelect;
    },
    offer() {
      return this.$store.state.recycleResult;
    },
    position() {
      console.log("position")
      return this.$store.state.position;
    },
    stores() {
      return this.$store.state.stores;
    }
  },
  methods: {
    toastError(mes) {
      this.$dialog.toast({
        mes,
        timeout: 1500,
        icon: 'error',
      });
    },
    checkForm() {
      if (this.formData.serviceType == 1) {
        if (this.formData.address === "") {
          this.toastError("请选择地址！");
          return false;
        }
      } else if (this.formData.serviceType == 2) {
        if (this.formData.storeId === "") {
          this.toastError("请选择门店");
          return false;
        }
      } else if (this.formData.serviceType == 3) {
        if (this.formData.iphonePasswd === "") {
          this.toastError("请输入解锁密码");
          return false;
        }
        if (this.formData.expressCompany === "") {
          this.toastError("请输入快递公司名称");
          return false;
        }
        if (this.formData.expressNumber === "") {
          this.toastError("请输入快递单号");
          return false;
        }
      }

      return true;
    },
    submitForm() {
      this.formData.address = this.cityModel + this.address;
      this.formData.positon = this.position.latitude + "," + this.position.longitude;
      if (this.selectStore.id) {
        this.formData.storeId = this.selectStore.id;
      }
      let check = this.checkForm();
      if (!check) {
        return;
      }
      console.log(this.formData)
      this.$dialog.loading.open("提交中...");
      this.$store.dispatch('FETCH_RECYCLE_ORDER', { formData: this.formData })
        .then((data) => {
          this.$dialog.loading.close();
          if (this.$store.state.code["success"] == data.errorCode) {
            this.$router.push("/formSuccess/recycleIndex");
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch((e) => {
          console.log(e)
          this.toastError('网络错误请稍后重试！');
        });
    },
    backQues() {
      this.$router.push("/recycleQues/" + this.$store.state.recycleSelect.id);
    },
    cityResult(ret) {
      this.cityModel = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    getStore() {
      this.$dialog.loading.open();
      let longitude = (~~this.position.longitude).toFixed(6);
      let latitude = (~~this.position.latitude).toFixed(6);
      this.$store.dispatch('FETECH_STORE', { latitude, longitude }).then((data) => {
        this.$dialog.loading.close();
        if (this.$store.state.code["success"] === data.errorCode) {
          this.$store.commit('SET_STORE', { data: data.data })
          this.storeShow = true;
        } else {
          this.toastError(data.errorInfo)
        }
      }).catch(() => {
        this.toastError('网络错误请稍后重试！');
      })
    },
    cancelStore() {
      this.storeShow = false;
      this.checkedAddress = "";
    },
    getAddreessByPos() {
      let { longitude, latitude } = this.$store.state.position;
      if (longitude != 113) {
        this.placeholder = "正在定位";
        getAddreessByPosition(latitude, longitude).then((res) => {
          if (this.$store.state.code["success"] == res.errorCode) {
            this.provance = res.data.province;
            this.city = res.data.city;
            this.cityModel = res.data.adress;
            //this.$forceUpdate();
          } else {
            this.toastError(res.errorInfo)
          }
        }).catch((e) => {
          console.log(e)
          this.toastError('网络错误请稍后重试！');
        })
      }
    }
  },
  mounted() {
    this.getAddreessByPos();
  }
}

</script>
<style scoped>


</style>
