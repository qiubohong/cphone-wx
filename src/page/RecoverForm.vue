<template>
  <div class="recoverForm">
    <yd-navbar :title="title">
       <router-link to="/recoverResult" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <img src="/static/img/icon/form-icons.png" alt="" style="width:100%">
    <yd-cell-group>
        <yd-cell-item>
            <span slot="left">手机号：</span>
            <input slot="right" type="tel" placeholder="请输入手机号">
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">回收方式：</span>
            <div slot="right" style="text-align:left;width:100%">
              <yd-radio-group v-model="radio1" @change.native="changeType">
                <yd-radio val="1">上门</yd-radio>
                <yd-radio val="2">门店</yd-radio>
                <yd-radio val="3">邮寄</yd-radio>
              </yd-radio-group>
            </div>
        </yd-cell-item>
        <template v-if='showOther'>
          <yd-cell-item arrow>
                <span slot="left">所在地区：</span>
                <input slot="right" type="text" @click.stop="show1 = true" v-model="model1" readonly placeholder="请选择省市">
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">详细地址：</span>
            <input slot="right" type="tel" placeholder="请输入详细地址">
          </yd-cell-item>
        </template>
        <template v-if='!showOther'>
          <yd-cell-item arrow @click.native="show2 = true">
            <span slot="left">{{checkedAddress == '' ? '请选择门店' : checkedAddress}}</span>
          </yd-cell-item>
        </template>
    </yd-cell-group>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="submitForm">确定下单</yd-button>
    </div>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="danger" @click.native="backQues">重新评估</yd-button>
    </div>
    <yd-cityselect v-model="show1" :done="result1" :items="district"></yd-cityselect>
    <yd-popup v-model="show2" position="bottom" height="95%">
      <yd-flexbox style="margin: .2rem;">
        <yd-flexbox-item>
        <yd-button type="primary" @click.native="show2 = false">确定</yd-button>
        </yd-flexbox-item>
        <yd-flexbox-item style='text-align:right'>
        <yd-button type="danger" @click.native="show2 = false">取消</yd-button>
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
              <input slot="right" type="radio" value="创手机湖南xxx店" v-model="checkedAddress"/>
            </yd-cell-item>
            <yd-cell-item type="radio" style='padding-bottom:.2rem'>
              <span slot="left">
                <h3>创手机湖南xxx店</h3>
                <p>门店地址：xxxxxxx</p>
                <p>服务时间：xxxxxxx</p>
                <p>联系电话：xxxxxxx</p>
              </span>
              <input slot="right" type="radio" value="创手机湖南xxx1店" v-model="checkedAddress"/>
            </yd-cell-item>
            <yd-cell-item type="radio" style='padding-bottom:.2rem'>
              <span slot="left">
                <h3>创手机湖南xxx店</h3>
                <p>门店地址：xxxxxxx</p>
                <p>服务时间：xxxxxxx</p>
                <p>联系电话：xxxxxxx</p>
              </span>
              <input slot="right" type="radio" value="创手机湖南xxx2店" v-model="checkedAddress"/>
            </yd-cell-item>
      </yd-cell-group>
    </yd-popup>
  </div>
</template>

<script>
import District from 'ydui-district/dist/gov_province_city_area_id';

export default {
  name: 'recoverForm',
  data () {
    return {
      title:"手机回收-iphone6-订单",
      money:"2800",
      show1: false,
      show2: false,
      model1: '',
      radio1: '',
      district: District,
      showOther: true,
      checkedAddress:''
    }
  },
  methods:{
    submitForm: function(){
      this.$router.push("/formSuccess/recoverIndex");
    },
    backQues: function(){
      this.$router.push("/recoverQues");
    },
    result1(ret) {
      this.model1 = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    changeType: function(){
      if(this.radio1 == '2'){
        this.showOther = false;
      }else{
        this.showOther = true;
      }
    }
  }

}
</script>
<style scoped>
</style>
