<template>
  <div class="recoverForm">
    <yd-navbar :title="title">
      <router-link :to="'/recoverResult'+this.$store.state.recycleSelect.id" slot="left">
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
          <input slot="right" type="text" @click.stop="cityShow = true" v-model="cityModel" readonly placeholder="请选择省市">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">详细地址：</span>
          <input v-model="address" slot="right" type="tel" placeholder="请输入详细地址">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">预约时间：</span>
          <yd-datetime :start-date="startDate" :end-date="endDate" type="datetime" v-model="formData.period" slot="right"></yd-datetime>
        </yd-cell-item>
      </template>
      <template v-if='formData.serviceType == 2'>
        <yd-cell-item arrow @click.native="show2 = true">
          <span slot="left">{{checkedAddress == '' ? '请选择门店' : checkedAddress}}</span>
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">预约时间：</span>
          <yd-datetime :start-date="startDate" :end-date="endDate" type="datetime" v-model="formData.period" slot="right"></yd-datetime>
        </yd-cell-item>
      </template>
      <template v-if='formData.serviceType == 3'>
        <yd-cell-item>
          <span slot="left">快递公司：</span>
          <input slot="right" type="text" placeholder="请输入快递公司">
        </yd-cell-item>
        <yd-cell-item>
          <span slot="left">快递单号：</span>
          <input slot="right" type="number" placeholder="请输入快递单号">
        </yd-cell-item>
      </template>
    </yd-cell-group>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="submitForm">确定下单</yd-button>
    </div>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="danger" @click.native="backQues">重新评估</yd-button>
    </div>
    <yd-cityselect :provance="cityProps.provance" v-model="cityShow" :done="cityResult" :items="district"></yd-cityselect>
    <yd-popup v-model="storeShow" position="bottom" height="95%">
      <yd-flexbox style="margin: .2rem;">
        <yd-flexbox-item>
          <yd-button type="primary" @click.native="storeShow = false">确定</yd-button>
        </yd-flexbox-item>
        <yd-flexbox-item style='text-align:right'>
          <yd-button type="danger" @click.native="storeShow = false">取消</yd-button>
        </yd-flexbox-item>
      </yd-flexbox>
      <yd-cell-group>
        <yd-cell-item type="radio" style='padding-bottom:.2rem'>
          <span slot="left">
                <h3>创手机湖南xxx店</h3>
                <p>门店地址：xxxxxxx</p>
                <p>服务时间：xxxxxxx</p>
                <p>联系电话：xxxxxxx</p>
              </span>
          <input slot="right" type="radio" value="创手机湖南xxx店" v-model="checkedAddress" />
        </yd-cell-item>
        <yd-cell-item type="radio" style='padding-bottom:.2rem'>
          <span slot="left">
                <h3>创手机湖南xxx店</h3>
                <p>门店地址：xxxxxxx</p>
                <p>服务时间：xxxxxxx</p>
                <p>联系电话：xxxxxxx</p>
              </span>
          <input slot="right" type="radio" value="创手机湖南xxx1店" v-model="checkedAddress" />
        </yd-cell-item>
        <yd-cell-item type="radio" style='padding-bottom:.2rem'>
          <span slot="left">
                <h3>创手机湖南xxx店</h3>
                <p>门店地址：xxxxxxx</p>
                <p>服务时间：xxxxxxx</p>
                <p>联系电话：xxxxxxx</p>
              </span>
          <input slot="right" type="radio" value="创手机湖南xxx2店" v-model="checkedAddress" />
        </yd-cell-item>
      </yd-cell-group>
    </yd-popup>
  </div>
</template>
<script>
import District from 'ydui-district/dist/gov_province_city_area_id';

function formateDate(date, format) {
  if (Object.prototype.toString.call(date) !== "[object Date]") {
    return;
  }
  var regexpObj = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S+": date.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in regexpObj) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        regexpObj[k] : ("00" + regexpObj[k]).substr(("" + regexpObj[k]).length));
    }
  }
  return format;
}

export default {
  name: 'recoverForm',
  created() {
    if (!this.$store.state.recycleSelect.name) {
      this.$store.dispatch('FETCH_SINGLE_RECYCLE');
      this.$store.dispatch("FETCH_RECCYLE_RESULT");
    }

  },
  data() {
    let now = new Date();
    now.setDate(now.getDate()+1);
    let startDate = formateDate(now,"yyyy-MM-dd hh:mm");
    now.setDate(now.getDate()+7);
    let endDate = formateDate(now,"yyyy-MM-dd hh:mm");
    console.log(startDate);
    return {
      startDate: startDate,
      endDate: endDate,
      cityShow: false,
      cityProps: {
        provance: "湖南省"
      },
      storeShow: false,
      formData: {
        "recyclePhoneId": 0,
        "remark": "",
        "customerId": 0,
        "serviceType": 1, //1：上门；2：门店；3：邮寄
        "address": "",
        "period": "",
        "storeId": 0,
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
        "positon": ""
      },
      address: "",
      cityModel: '',
      district: District,
      checkedAddress: ''
    }
  },
  computed: {
    title() {
      return "手机回收-" + this.$store.state.recycleSelect.name + "-填写";
    },
    recycleSelect() {
      this.formData.recyclePhoneId = this.$store.state.recycleSelect.id;
      return this.$store.state.recycleSelect;
    },
    offer() {
      return this.$store.state.recycleResult;
    }
  },
  methods: {
    submitForm: function() {
      this.formData.address = this.cityModel + this.address;
      //this.$router.push("/formSuccess/recoverIndex");
    },
    backQues: function() {
      this.$router.push("/recycleQues/"+this.$store.state.recycleSelect.id);
    },
    cityResult(ret) {
      this.cityModel = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    }
  }

}

</script>
<style scoped>


</style>
