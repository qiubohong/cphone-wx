<template>
    <div class="repairIndex">
      <yd-navbar title="手机维修">
       <router-link to="/" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
      </yd-navbar>
      <yd-scrolltab style='top:1rem'>
        <yd-scrolltab-panel v-if="item.maintainPhones.length > 0" v-for="item in repairs" :label="item.brandName">
            <yd-list theme="3">
              <yd-list-item v-for="item2 in item.maintainPhones" @click.native="getProblem(item2)">
                  <img slot="img" :src="item2.picUrl.indexOf('http') >= 0 ? item2.picUrl : 'http://'+item2.picUrl">
                  <div slot="title" style="text-align: center;">{{item2.name}}</div>
                  <div slot="other">
                     <yd-button size="large" type="primary">立即维修</yd-button>
                  </div>
              </yd-list-item>
          </yd-list>
        </yd-scrolltab-panel>
      </yd-scrolltab>
       <yd-popup v-model="problemShow" position="bottom" height="auto" style="padding:.2rem;">
          <div style="margin:.2rem .2rem .5rem .2rem">
            <h3 style="font-size:.4rem;margin-bottom:.5rem">{{repairSelect.name}}</h3>
            <yd-checkbox-group v-model="selectPrombles">
                <yd-checkbox :val="index" v-for="(p,index) in problems">{{p.problemName}}</yd-checkbox>
            </yd-checkbox-group>
          </div>
          <yd-button type="primary" size="large" @click.native="selectRepairType">下一步</yd-button>
        </yd-popup>
    </div>
    </div>
</template>
<script>
export default {
  name: 'repairIndex',
  created(){
    this.$dialog.loading.open();
    this.$store.dispatch('FETCH_REPAIRS')
      .then(()=> this.$dialog.loading.close());
  },
  data (){
    return {
      problemShow: false,
      repairSelect: {},
      problems:[],
      selectPrombles:[],
    }
  },
  computed:{
    repairs(){
      return this.$store.state.repairs;
    }
  },
  methods: {
    getProblem(repair){
      this.repairSelect = repair;
      this.selectPrombles = [];
      this.$dialog.loading.open();
      this.$store.dispatch('FETCH_REPAIR_PROBLEMS',{phoneId:repair.id})
      .then((data)=> {
        this.$dialog.loading.close();
        if(data.errorCode = this.$store.state.code["success"]){
          this.problems = data.data;
          this.problemShow = true;
        }else{
          toastError(data.errorInfo)
        }
      }).catch(()=>{
        toastError("网络错误，请稍后重试！")
      });
    },
    selectRepairType: function(){
      if(this.selectPrombles.length == 0){
        this.toastError('您还未选择任何故障')
        return;
      }
      let problems = [];
      this.selectPrombles.forEach((val)=>{
        problems.push(this.problems[val]);
      });
      localStorage.setItem(this.$store.state.key['repairSelect'], JSON.stringify(this.repairSelect));
      localStorage.setItem(this.$store.state.key['repairProblems'], JSON.stringify(problems));
      this.$store.dispatch('FETCH_SELECT_REPAIR');

      this.problemShow = false;
      this.$router.push("/repairForm");
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
