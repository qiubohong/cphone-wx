<template>
  <div class="recoverForm">
    <yd-navbar :title="title">
       <router-link to="/repairIndex" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <yd-accordion>
      <yd-accordion-item v-for="item in repairArray" :title="item.title + ': '+item.checked">
          <div style="padding: .24rem;">
            <yd-radio-group v-model="item.checked" >
                <yd-radio :val="option.title" v-for='option in item.options'>{{option.title + ' ￥' + option.price}}</yd-radio>
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
            <span slot="left">手机号：</span>
            <input slot="right" type="tel" placeholder="请输入手机号">
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">维修方式：</span>
            <div slot="right">
              <yd-radio-group v-model="radio2" @change.native="changeType">
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
          <yd-cell-item arrow @click.native="show3 = true">
            <span slot="left">{{checkedAddress == '' ? '请选择门店' : checkedAddress}}</span>
          </yd-cell-item>
        </template>

        <yd-cell-item>
            <span slot="left">预约时间：</span>
             <yd-datetime type="datetime" :startDate="startDate" :endDate="endDate" v-model="datetime0" slot="right" placeholder="请输入预约维修时间"></yd-datetime>
        </yd-cell-item>
        <yd-cell-item>
            <span slot="left">备注：</span>
            <yd-textarea slot="right" placeholder="请输入备注" maxlength="100"></yd-textarea>
        </yd-cell-item>
    </yd-cell-group>
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="show2 = true">提交</yd-button>
    </div>
    <!-- 城市选择 -->
    <yd-cityselect v-model="show1" :done="result1" :items="district"></yd-cityselect>
    <!-- 确认框 -->
    <yd-popup v-model="show2" position="bottom" height="auto" style="padding:.2rem;">
            <yd-cell-group style="margin-top:.2rem">
              <yd-cell-item>
                  <span slot="left">设备信息：</span>
                  <div slot="right">iPhone6s</div>
              </yd-cell-item>
              <yd-cell-item>
                  <span slot="left">维修方式：</span>
                  <div slot="right">上门</div>
              </yd-cell-item>
              <yd-cell-item>
                  <span slot="left">预约时间：</span>
                  <div slot="right">{{datetime0}}</div>
              </yd-cell-item>
              <yd-cell-item>
                  <span slot="left">总共价格：</span>
                  <div slot="right">￥{{money}}</div>
              </yd-cell-item>
            </yd-cell-group>
          <yd-button type="primary" size="large" @click.native="submitForm">确认下单</yd-button>
    </yd-popup>
    <!-- 门店选择 -->
    <yd-popup v-model="show3" position="bottom" height="95%">
      <yd-flexbox style="margin: .2rem;">
        <yd-flexbox-item>
        <yd-button type="primary" @click.native="show3 = false">确定</yd-button>
        </yd-flexbox-item>
        <yd-flexbox-item style='text-align:right'>
        <yd-button type="danger" @click.native="show3 = false">取消</yd-button>
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
    var now = new Date();
    now.setHours(now.getHours());
    now = now.getFullYear() + "-" 
        + ((now.getMonth()+1).toString().length == 1 ? ("0"  + (now.getMonth()+1).toString()):(now.getMonth()+1))
        + "-" 
        + (now.getDate().toString().length == 1 ? ("0" + now.getDate().toString()) : now.getDate() )
        + " " 
        + ((now.getHours()+1).toString().length == 1 ? ("0" + (now.getHours()+1).toString()) : (now.getHours()+1)) 
        + ":" 
        + (now.getMinutes().toString().length == 1 ? ("0" + now.getMinutes().toString()) : now.getMinutes()) ;
    var end = new Date();
    end.setMonth(end.getMonth() + 1);
    end = end.getFullYear() + "-" 
        + ((end.getMonth()+1).toString().length == 1 ? ("0"  + (end.getMonth()+1).toString()):(end.getMonth()+1))
        + "-" 
        + (end.getDate().toString().length == 1 ? ("0" + end.getDate().toString()) : end.getDate() )
        + " " 
        + ((end.getHours()+1).toString().length == 1 ? ("0" + (end.getHours()+1).toString()) : (end.getHours()+1)) 
        + ":" 
        + (end.getMinutes().toString().length == 1 ? ("0" + end.getMinutes().toString()) : end.getMinutes()) ;
    return {
      title:"手机维修-iphone6-订单",
      money:0,
      radio2:1,
      show1: false,
      show2: false,
      show3: false,
      model1: '',

      datetime0: '',
      startDate: now,
      endDate: end,
      district: District,
      repairArray: [
        {
          title:'屏幕故障',
          options:[{title:'屏碎（能正常显示）',price:200},{title:'屏碎（不能正常显示）',price:400}],
          checked:''
        },
        {
          title:'电池故障',
          options:[{title:'提升续航时间',price:200}],
          checked:''
        },
        {
          title:'外壳更换',
          options:[{title:'更换外壳',price:200}],
          checked:''
        }
      ],
      showOther:true,
      checkedAddress:''
    }
  },
  methods:{
    submitForm: function(){
      this.$router.push("/formSuccess/repairIndex");
    },
    openSure: function(){

    },
    result1(ret) {
      this.model1 = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
    },
    changeType: function(){
      if(this.radio2 == '2'){
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
