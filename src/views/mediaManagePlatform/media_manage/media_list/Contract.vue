<template>
	<div class="edit-form">
        <el-dialog title="合同信息" @close="dialogClose" :visible.sync="show_contract_dialog" :close-on-click-modal= "false" width="550px">
            <el-form label-width="150px" :model="data" class="form_box">
                <el-form-item label="合作方式 :" >
                    <span>{{cooperWay}}</span>
                </el-form-item>
                <el-form-item label="合同编号 :" >
                    <span>{{ media!=null?media.cooperNo:'' }}</span>
                </el-form-item>
                <el-form-item label="起止时间 :" >
                    <span>{{ media!=null?(media.dateStart+' - '+media.dateEnd):''  }}</span>
                </el-form-item>
                <el-form-item label="生效时间 :" >
                    <span>{{ media!=null?media.effectDate:''}}</span>
                </el-form-item>
                <el-form-item label="广告位数量 :" >
                    <span>{{ media!=null?media.contractMresNum:'' }}</span>
                </el-form-item>
                <el-form-item label="广告位位置 :" >
                    <span>{{ media!=null?(media.parCateName+' > '+media.cateName):'' }}</span>
                </el-form-item>
            </el-form>
        </el-dialog>
	</div>
</template>
<script>
export default {
  data(){
      return {
          show_contract_dialog:false,
          media:null
      }
  },
  methods:{
        dialogClose(){
          this.show_contract_dialog = false
          this.$parent.show_contract_dialog = false
      }
  },
  computed:{
      cooperWay(){
          if( this.media ){
            if( this.media.cooperWay === 1 ) 
              return "分成合作";
            else if(  this.media.cooperWay === 2 )
              return "租赁合作";  
          }
          return '';
      }
  },
  mounted(){
      
  },
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Object
      }
  },
  watch:{
      isShow(v){
          this.show_contract_dialog = v
          this.media = null
          if( this.data && this.data.mediaId ){
              this.api_mediaManagePlatform_mediaDetail({pathParams:`/${ this.data.mediaId }`}).then(res=>{
                  this.media = res.content
              })
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>