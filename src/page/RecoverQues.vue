<template>
  <div class="recoverQues">
    <yd-navbar :title="title">
       <router-link to="/recoverIndex" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <div class="quesBox">
      <yd-cell-group :id="index" :title="ques.problemName" v-for="(ques,index) in problems" :key="index">
          <yd-cell-item v-if='ques.problemType === 0' v-for="option in ques.selects">
            <yd-radio-group slot="left" v-model="ques.checked">
                <yd-radio :val="option.id" style='width:12rem'>{{option.problemItem}}</yd-radio>
            </yd-radio-group>
          </yd-cell-item>

          <yd-cell-item v-if='ques.problemType === 1' v-for="option in ques.selects">
            <span slot="right">{{ques.checked}}</span>
            <yd-checkbox-group slot="left" v-model="ques.checked">
              <yd-checkbox :val="option.id" shape="circle" style="display:block;width:8rem;padding:.2rem 0;border-bottom:1px solid #ececec">{{option.problemItem}}</yd-checkbox>
            </yd-checkbox-group>
          </yd-cell-item>
      </yd-cell-group>
    </div>
    
    <div style="margin: 0 .2rem">
      <yd-button size="large" type="primary" @click.native="handleClick">我要询价</yd-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recoverIndex',
  created(){
    if(!this.$store.recoverSelect){
      this.$store.dispatch('FETCH_SINGLE_RECYCLE').then(()=>{
      });
      this.$store.dispatch('FETCH_RECYCLE_PROBLEM',{
        phoneId: this.$route.params.id
      });
    }
  },
  computed:{
    title(){
      if(this.$store.state.recoverSelect){
        return "手机回收-"+this.$store.state.recoverSelect.name;
      }
      return "手机回收";
    },
    problems(){
      let {recycleProblems} = this.$store.state;
      return recycleProblems;
    }
  },
  watch:{
    loading: (val)=>{
      console.log(val)
      if(val){
        this.$dialog.loading.open();
      }else{
        this.$dialog.loading.close();
      }
    }
  },
  data () {
    return {
      loading: this.$store.state.pageLoading,
      phoneId: this.$route.params.id,
      checked:[],
    }
  },
  methods:{
    handleClick: function(){
      let flag = false;
      let answers = [];
      for(let val of this.problems){
        if(val.problemType === 1){
          if(val.checked.length === 0){
            this.$dialog.toast({
              mes: '请选完“'+val.problemName+'”选项！',
              icon: 'error',
              callback: () => {}
            });

          break;
          }else{
            answers.push({
              problemId:val.id,
              selects:[...val.checked]
            })
          }
        }else {
          if(val.checked === ""){
            flag = true;
            this.$dialog.toast({
              mes: '请选完“'+val.problemName+'”选项！',
              icon: 'error',
              callback: () => {}
            });
            break;
          }else{
            answers.push({
              problemId:val.id,
              selects:[val.checked]
            })

          }
          
        }
      }
      if(flag){
        return;
      }
      let submitData = {
        "phoneId": this.phoneId,
        "answers": [
          ...answers
        ]
      }
      console.log(JSON.stringify(submitData))
      this.$store.dispatch("FETCH_RECYCLE_OFFER",{
        submitData,
        callback(res){
          console.log(res)
        }
      })
      //this.$router.push("/recoverResult");
    }
  }

}
</script>
<style scoped>
.recoverQues .btn-primary{
  font-size: .26rem;
  height: .6rem;
  margin-top: 0.1rem;
}
.recoverQues .yd-cell-left{
  display: none
}
</style>
