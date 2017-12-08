<template>
    <div>
        <el-cascader  placeholder="请选择所属组织" :options="list"  @change="regionHandleItemChange" change-on-select class="form-input" clearable >
        </el-cascader>
    </div>
</template>

<script>
export default {
  data(){
      return{
           //缓存点击的区域项
            tempArea:null,
            //缓存父级index
            parentIndex:[],
            list:[]
      }
  },
  methods:{
      //val 值为数组
        regionHandleItemChange(val) {
            
            if( !val || val.length == 0){//清空
                this.$emit('selected','');
                return;
            }
            val =  val[val.length-1];
            let parentOrgId = val.split('-')[0];
            let orgLevel = parseInt(val.split('-')[1]);
            let indNum = val.split('-')[2];

            this.$emit('selected',parentOrgId);
            if( orgLevel == 0){
                this.parentIndex = [];
                this.parentIndex[0]= indNum;
                this.tempArea = this.list.find(p => p.value === val.toString());
            }
            else if( orgLevel != 0){ 
                this.parentIndex = this.parentIndex.slice(0,parseInt(orgLevel)+1);
                this.parentIndex[parseInt(orgLevel)]= indNum;
                for(var i=0; i<this.parentIndex.length; i++){
                     var ind = this.parentIndex[i];
                     if(i==0){
                         this.tempArea= this.list[ind]
                     }else {
                         if(this.tempArea.children){
                             this.tempArea= this.tempArea.children[ind]
                         }else{
                             this.tempArea= this.tempArea
                         }
                     }
                }
            }else {
                this.tempArea = this.tempArea && this.tempArea.children && this.tempArea.children.find(p => p.value === val.toString());
            }
            this.init(orgLevel+1,parentOrgId,this.tempArea);
        },
      //获取国家 国家orgLevel =0  大区 orgLevel=1 城市 orgLevel=2 区域 orgLevel =3 BOM orgLevel =4
        init(orgLevel=0,parentOrgId=0,obj = this){
            // 默认触发新增/修改 所属组织
            this.api_common_bdorg({data:{ orgLevel: orgLevel,parentOrgId:parentOrgId}}).then(res=>{
                if( res.status != 200 || res.content.length == 0){
                    delete obj.children;
                    return;
                } 
                if( orgLevel === 0){
                    obj.list = res.content.map((item,i) => {
                        return { label: item.orgName, value: `${item.orgId}-${orgLevel}-${i}`,orgLevel:orgLevel, children: [] };
                    });
                }else if( orgLevel < 4 ){
                    obj.children = res.content.map((item,i) => {
                        return { label: item.orgName, value: `${item.orgId}-${orgLevel}-${i}`,orgLevel:orgLevel, children: [] };
                    });
                }else if( orgLevel == 4){
                    obj.children = res.content.map((item,i) => {
                        return { label: item.orgName, value: `${item.orgId}-${orgLevel}-${i}`,orgLevel:orgLevel};
                    });
                }
            })
        }
  },
  mounted(){
    //   console.log('初始化区域控件')
      this.init();
  }
}
</script>

<style>

</style>