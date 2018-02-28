<!--省、市-->
<template>
  <div>
    <el-cascader  placeholder="请选择区域" :options="list" v-model="selected" @change="regionHandleItemChange" change-on-select class="form-input" clearable >
    </el-cascader>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
      return{
          list:[],
          selected:[]
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    regionHandleItemChange(sel){
      if( !sel || sel.length == 0){
          //清空
          this.$emit('selected','');
          return;
      }
      let val =  sel[sel.length-1];
      this.$emit('selected',val,sel.length,sel);
      let obj = this.list.find(p => p.value === val);
      if (!obj || obj.children.length > 0) return;
      this.api_common_cits({data:{province: val,token: this.getUser.token }}).then(res=>{
          obj.children = res.content.map(item => {
            return { label: item.name, value: item.code };
          })
      })
    },
    getCitys(val,obj){
      this.api_common_cits({data:{province: val,token: this.getUser.token }}).then(res=>{
          if( res.content && res.content.length>0){
            
            obj.children = res.content.map(item => {
              let temp = { label: item.name, value: item.code }
              if( this.selectVal.toString().indexOf(temp.value) !=-1 ){
                this.getCitys(temp.value,temp)
              }
              return temp
            })
          }
      })
    },
    init(){
      // 获取省市区列表
      this.api_common_provs({data:{operateBdId: 0,token:this.getUser.token}}).then(res=>{
          if( this.selectVal && this.selectVal.length > 0 ){
             //设置默认赋值
            this.list = res.content.map(item => {
              let temp = { label: item.name, value: item.code,children:[]}
              if( this.selectVal.toString().indexOf(item.code) !=-1){
                this.getCitys(item.code,temp)
              }
              return temp
            })
            this.selected = this.selectVal;
          }else{
            this.list = res.content.map(item => {
                return { label: item.name, value: item.code, children: [] };
            })
          }
      })
    }
  },
  mounted(){
    this.init();
  },
  props:{ 
    selectVal:{
      type:Array
    }
  },
  watch:{
    selectVal(v){
      this.selected = []
      if( v && v!="" ){
        console.log("区域id："+v)
        this.selected = v
        this.init()
      }
    }
  }
}
</script>
