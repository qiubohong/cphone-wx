<template>
  <div class="recoverQues">
    <yd-navbar :title="title">
       <router-link to="/recoverIndex" slot="left">
            <yd-navbar-back-icon></yd-navbar-back-icon>
        </router-link>
    </yd-navbar>
    <div class="quesBox">
      <yd-cell-group :id="index" :title="ques.title" v-for="(ques,index) in quesList" :key="index">
          <yd-cell-item v-if='ques.type === "danxuan"' v-for="option in ques.options">
            <yd-radio-group slot="left" v-model="ques.checked">
                <yd-radio :val="option.title" style='width:12rem'></yd-radio>
            </yd-radio-group>
          </yd-cell-item>

          <yd-cell-item v-if='ques.type === "duoxuan"' v-for="option in ques.options">
            <yd-checkbox-group slot="left" v-model="ques.checked">
              <yd-checkbox :val="option.title" style='width:12rem'></yd-checkbox>
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
      this.$store.commit('FETCH_RECYCLE',{
        id:this.$route.params.id
      });
    }
  },
  computed:{
    title(){
      return "手机回收-"+this.$store.state.recoverSelect.name;
    }
  },
  data () {
    return {
      radio1:"",
      quesList: [
        {title: "选项标题1", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}], type:'danxuan',checked:""},
        {title: "选项标题2", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}], type:'danxuan',checked:""},
        {title: "选项标题3", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}], type:'danxuan',checked:""},
        {title: "选项标题4", options: [{title:"选项标题1"},{title:"选项标题2"},{title:"选项标题3"}], type:'duoxuan',checked:[]}
      ],
    }
  },
  methods:{
    handleClick: function(){
      for(let val of this.quesList){
        if(val.type === 'duoxuan'){
          continue;
        }
        if(val.checked === ""){
          this.$dialog.toast({
            mes: '请选完“'+val.title+'”选项！',
            icon: 'error',
            callback: () => {
                            
            }
          });
          break;
        }
      }
      this.$router.push("/recoverResult");
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
