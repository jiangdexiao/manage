<template>
    <div>
        <el-cascader  placeholder="请选择所属组织" :options="list" v-model="selected" @change="regionHandleItemChange" change-on-select class="form-input" :clearable="!disabled" >
        </el-cascader>
    </div>
</template>

<script>
export default {
  data(){
      return{
           //缓存点击的区域项
            tempArea:null,
            list:[],
            selected:[]
      }
  },
  props:{
      selectVal:{
          type:Array
      },
      disabled:{
          type:Boolean
      }
  },
  methods:{
      //val 值为数组
        regionHandleItemChange(val) {
            if( !val || val.length == 0){//清空
                this.$emit('selected','');
                return;
            }
            let orgId = val[val.length-1]
            let orgLevel = val.length-1
            let parentOrgId = val.length==1?0:val[val.length-2]
            this.$emit('selected',orgId,parentOrgId,orgLevel,val);
            for(var i=0; i<val.length; i++){
                if( i === 0){
                    this.tempArea = this.list.find(p=> p.value == val[i])
                }
                else{
                    if(this.tempArea && this.tempArea.children){
                        this.tempArea= this.tempArea.children.find(p=> p.value == val[i])
                    }else{
                        this.tempArea= this.tempArea
                    }
                }
            }
            this.getOrg(orgLevel+1,orgId,this.tempArea);
        },
        getOrg(orgLevel=0,parentOrgId=0,obj = this){
            this.api_common_bdorg({data:{ orgLevel: orgLevel,parentOrgId:parentOrgId}}).then(res=>{
                //是否禁用选项
                let disabled = this.isDisabled(orgLevel)
                obj.children = res.content.map(item => {
                    let temp = null
                    if( orgLevel === 5){
                        temp = {disabled:disabled, label: item.orgName, value: item.orgId,}
                    }else{
                        temp = {disabled:disabled, label: item.orgName, value: item.orgId,children:[] }
                    }
                    if( this.selectVal && this.selectVal.toString().indexOf(temp.value) !=-1 ){
                        this.getOrg(orgLevel+1,temp.value,temp)
                    }
                    return temp
                })
            })
        },
      //获取国家 国家orgLevel =0  大区 orgLevel=1 城市 orgLevel=2 区域 orgLevel =3 BOM orgLevel =4
        init(orgLevel=0,parentOrgId=0,obj = this){
            this.api_common_bdorg({data:{ orgLevel: orgLevel,parentOrgId:parentOrgId}}).then(res=>{
                //是否禁用选项
                let disabled = this.isDisabled(orgLevel)
                if( this.selectVal && this.selectVal.length>0 ){
                    this.list = res.content.map(item => {
                        let temp = {disabled:disabled, label: item.orgName, value:item.orgId,children:[] }
                        if(this.selectVal.toString().indexOf(temp.value) !=-1 ){
                            this.getOrg(orgLevel+1,temp.value,temp)
                        }
                        return temp
                    })
                }else{
                    this.list = res.content.map(item => {
                        return {disabled:disabled, label: item.orgName, value:item.orgId,children:[] }
                    })
                }
            })
        },
        isDisabled(orgLevel){
            let disabled = false
            if( this.disabled === true && orgLevel === 0){
                disabled = true
            }else if(this.disabled === true && this.selectVal && this.selectVal.length > 0){
                if( orgLevel <= this.selectVal.length-1 ){
                    disabled = true
                }
            }
            return disabled
        }
  },
  mounted(){
      this.init();
  },
  watch:{
      selectVal(v){
          this.selected = []
          if( v && v.length>0){
            this.selected = v
            this.init()
          }
      }
  }
}
</script>

<style>

</style>