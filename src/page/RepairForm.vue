<template>
  <div class="recoverForm">
    <yd-navbar :title="title">
      <router-link to="/repairIndex" slot="left">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </router-link>
    </yd-navbar>
    <yd-accordion accordion>
      <yd-accordion-item v-for="(item,index) in problems" :title="item.problemName + ': '+(selects[index] || '')" :open="index == 0">
        <div style="padding: .24rem;">
          <yd-radio-group v-model="selects[index]" >
            <yd-radio :val="option.problemItem" v-for='option in item.selects'>
              <span>{{option.problemItem + ' ￥' + option.cost}}</span>
            </yd-radio>
          </yd-radio-group>
        </div>
      </yd-accordion-item>
    </yd-accordion>
    <yd-cell-group title="必要信息：" style="margin-top:.2rem">
      <yd-cell-item>
        <span slot="left">维修价格：</span>
        <div slot="right">￥{{money}}</div>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">维修方式：</span>
        <div slot="right">
          <yd-radio-group v-model="formData.serviceType">
            <yd-radio val="1">上门</yd-radio>
            <yd-radio val="2">指定服务</yd-radio>
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
          <span slot="left">{{checkedAddress == '' ? '请选择指定服务' : checkedAddress}}</span>
        </yd-cell-item>
      </template>
      <template v-if='formData.serviceType == 3'>
        <yd-cell-item>
          <div slot="left"> 
            <div style="white-space: normal;">收方地址：福建省泉州市石狮市石狮总部大厦7楼，创手机（收）18150533737（仅支持顺丰到付）</div>
          </div>
        </yd-cell-item>
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
      <yd-button size="large" type="primary" @click.native="confirm">提交</yd-button>
    </div>
    <!-- 城市选择 -->
    <yd-cityselect :provance="provance" 
                   :city="city"
      v-model="cityShow" :done="cityResult" :items="district"></yd-cityselect>
    <!-- 确认框 -->
    <yd-popup v-model="confirmShow" position="bottom" height="auto" style="padding:.2rem;">
      <yd-cell-group style="margin-top:.2rem">
        <yd-cell-item>
          <span slot="left">设备信息：</span>
          <div slot="right">{{repair.name}}</div>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">维修方式：</span>
          <div slot="right" v-if="formData.serviceType == 1">上门</div>
          <div slot="right" v-if="formData.serviceType == 2">门店</div>
          <div slot="right" v-if="formData.serviceType == 3">邮寄</div>
        </yd-cell-item>
        <template v-if="formData.serviceType == 1">
          <yd-cell-item>
            <span slot="left">详细地址：</span>
            <div slot="right">{{formData.address}}</div>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">预约时间：</span>
            <div slot="right">{{formData.period}}</div>
          </yd-cell-item>
        </template>
        <template v-if="formData.serviceType == 2">
          <yd-cell-item>
            <span slot="left">预约时间：</span>
            <div slot="right">{{formData.period}}</div>
          </yd-cell-item>
        </template>
        <template v-if="formData.serviceType == 3">
          <yd-cell-item>
            <span slot="left">快递单号：</span>
            <div slot="right">{{formData.expressNumber}}</div>
          </yd-cell-item>
        </template>
        <yd-cell-item>
          <span slot="left">总共价格：</span>
          <div slot="right">￥{{money}}</div>
        </yd-cell-item>
      </yd-cell-group>
      <yd-button type="primary" size="large" @click.native="submitForm">确认下单</yd-button>
    </yd-popup>
    <!-- 门店选择 -->
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
import {getAddreessByPosition} from '../store/fetch'
import District from 'ydui-district/dist/gov_province_city_area_id';
import {formateDate,isLogin, goLogin} from '../utils/index'

export default {
  name: 'repairForm',
  created() {
    if (isLogin(this.$store)) {
      if (!this.$store.state.recycleSelect.name) {
        this.$store.dispatch('FETCH_SELECT_REPAIR');
        this.$store.dispatch("FETCH_POSITION");
      }

      District.forEach((item)=>{
          if(item.n == "福建省"){
            var temp = {
              v:item.v,
              n:item.n,
              c:[]
            }

            item.c.forEach((item2)=>{
              if(item2.n == "泉州市"){
                var temp2 = {
                  v:item2.v,
                  n:item2.n,
                  c:[]
                }
                item2.c.forEach((item3)=>{
                  if(item3.n == "晋江市" || item3.n == "石狮市" || item3.n == "南安市"){
                    var temp3 = {
                      v:item3.v,
                      n:item3.n
                    }
                    temp2.c.push(temp3)
                  }
                })
                temp.c.push(temp2)
              }
            })
            this.district.push(temp);
          }
        })
    }else{
      goLogin.call(this, window.location.href);
    }
  },
  data() {
    let now = new Date();
    if(now.getHours() > 22){
      now.setDate(now.getDate() + 1);
      now.setHours(9);
    }
    if(now.getHours() < 9){
      now.setHours(9);
    }
    let startDate = formateDate(now, "yyyy-MM-dd hh:mm");
    now.setDate(now.getDate() + 7);
    let endDate = formateDate(now, "yyyy-MM-dd hh:mm");

    return {
      money: 0,
      startDate: startDate,
      endDate: endDate,
      formData: {
        maintainPhoneId: "",
        customerId: "",
        serviceType: 1, //服务方式（1：上门；2：门店；3：邮寄）
        address: "",
        period: "",
        storeId: "",
        expressCompany: "",
        expressNumber: "",
        iphonePasswd: "",
        problemSelects: [],
        positon: "",
      },
      //城市控制器
      cityShow: false,
      provance: "",
      city: "",
      address: "",
      cityModel: '',
      placeholder:"请选择省市",

      //门店控制器
      storeShow: false,
      storeIndex: -1,
      selectStore: {},
      checkedAddress: '',

      confirmShow: false,
      district: [],

      selects: [],
    }
  },
  computed: {
    title() {
      return "手机维修-" + this.$store.state.repairSelect.name + "-订单";
    },
    repair() {
      this.formData.maintainPhoneId = this.$store.state.repairSelect.id;
      this.formData.customerId = this.$store.state.customer.id;
      return this.$store.state.repairSelect;
    },
    problems() {
      const ps = this.$store.state.repairProblems;
      return ps;
    },
    position() {
      return this.$store.state.position;
    },
    stores() {
      return this.$store.state.stores;
    }
  },
  watch: {
    selects(val) {
      this.money = 0;
      val.forEach((item,index) => {
        if(this.problems[index]){
          this.problems[index].selects.forEach((item2) => {
          if (item2.problemItem == item) {
            this.money += (~~item2.cost);
            this.formData.problemSelects[index] = {...item2};
          }
        })
        }
      })
    },
    storeIndex(val) {
      if (val != -1) {
        this.selectStore = this.stores[val];
        this.checkedAddress = this.stores[val].address;
      }
    },
    address(val){
      this.formData.address = this.cityModel + val;
    },
    cityModel(val){
      this.formData.address = this.address + val;
    }
  },
  methods: {
    toastError(mes){
      this.$dialog.toast({
        mes,
        timeout:1500,
        icon:"error"
      })
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
          this.$store.commit('SET_STORE', { data: data.data });
          this.storeShow = true;
        } else {
          toastError(data.errorInfo)
        }
      }).catch(() => {
        toastError('网络错误请稍后重试！');
      })
    },
    cancelStore() {
      this.storeShow = false;
      this.checkedAddress = "";
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
    confirm(){
      this.formData.positon = this.position.latitude + "," + this.position.longitude;
      if(this.selectStore.id){
        this.formData.storeId = this.selectStore.id;
      }
      let check = this.checkForm();
      if (!check) {
        return;
      }
      this.confirmShow = true;
    },
    submitForm: function() {
      let formData =this.formData;
      console.log(JSON.stringify(formData));
      this.$dialog.loading.open();
      this.$store.dispatch('FETCH_REPAIR_ORDER',{formData})
        .then((data) => {
          this.$dialog.loading.close();
          if (data.errorCode == this.$store.state.code["success"]) {
            this.$router.push("/formSuccess/repairIndex");
          } else {
            this.toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络错误，请稍后重试！'))
    },
    offer() {
      this.$store.dispatch('FETCH_REPAIR_OFFER', { submitData: problems })
        .then((data) => {
          this.$dialog.loading.close();
          if (data.errorCode = this.$store.state.code["success"]) {

          } else {
            toastError(data.errorInfo);
          }
        }).catch(() => this.toastError('网络错误，请稍后重试！'))
    },
    getAddreessByPos() {
      let { longitude, latitude } = this.$store.state.position;
      if (longitude != 113) {
        this.placeholder = "正在定位";
        getAddreessByPosition(latitude, longitude).then((res) => {
          if (this.$store.state.code["success"] == res.errorCode) {
            if(this.provance != "福建省" || this.city != "泉州市"){
              this.$dialog.alert({
                mes:"抱歉，当前位置还没有上门服务"
              })
              this.formData.serviceType = 2;
              this.cityModel = "";
              this.placeholder = "请选择省市";
              return;
            }
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
