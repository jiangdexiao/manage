<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" title="审批" @close="handleClose" :visible.sync="show_apr_dialog" :close-on-click-modal= "false" >
            <el-form label-width="150px">
                <el-form-item label="媒体 :" >
                    <span>{{ obj.mediaName }}</span>
                </el-form-item>
                <el-form-item label="广告位 :" >
                    <span>{{ obj.mresName }}</span>
                </el-form-item>
                <el-form-item label="条码 :" >
                    <span>{{ obj.mresNo }}</span>
                </el-form-item>
                <el-form-item label="理由 :" >
                    <span>{{ obj.aprReason }}</span>
                </el-form-item>
                <el-form-item label="原状态 :" >
                    <span>{{ obj.useStatus }}</span>
                </el-form-item>
                <el-form-item label="审批状态 :" >
                    <span>{{ obj.aprStatusName }}</span>
                </el-form-item>
                <el-form-item label="操作人 :" >
                    <span>{{ obj.operator }}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="save(true)">审批通过</el-button>
                <el-button type="primary"  @click="save(false)" >审批不通过</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data(){
      return {
          show_apr_dialog:false,
          obj:{
              mresId:'',
              mediaName:'',
              mresName:'',
              mresNo:'',
              aprReason:'',
              useStatus:'',
              aprStatus:'',
              operator:'',
              aprStatusName:''
          }
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    handleClose(){
        this.show_apr_dialog = false
        this.$parent.show_apr_dialog = false
    },
    save(check){
      let status = "0";
      if( this.obj.aprStatus && this.obj.aprStatus !== '11' && this.obj.aprStatus !== '21'){
        this.$message({type:'error',message:'已审核'});
        return;
      }
      if (this.obj.aprStatus && this.obj.aprStatus.charAt(0) === "1") {
        status = check == true ? "12" : "13";
      } else if (this.obj.aprStatus && this.obj.aprStatus.charAt(0) === "2") {
        status = check == true ? "22" : "23";
      }else{
        status = '22';
      }
      this.api_mediaManagePlatform_mresApr({pathParams:`/${this.obj.mresId}`,type:'put',
      data: {aprStatus: status,operateUserId:this.getUser.userId,userType:3} }).then(res=>{
          this.handleClose()
          this.$emit('success',true)
      })
    }
  },
  mounted(){
      
  },
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Array
      }
  },
  watch:{
      isShow(v){
          this.show_apr_dialog = v
          this.obj = {
              mresId:'',
              mediaName:'',
              mresName:'',
              mresNo:'',
              aprReason:'',
              useStatus:'',
              aprStatus:'',
              operator:'',
              aprStatusName:''
          }
          if( v === true){
              if( this.data && this.data.length >0 ){
                  this.api_mediaManagePlatform_mresDetail({pathParams:`/${this.data[0].mresId}`}).then(res=>{
                    this.obj.mresId = res.content.mresId;
                    this.obj.mediaName = res.content.mediaName;
                    this.obj.mresName = res.content.mresName;
                    this.obj.mresNo = res.content.mresNo;
                    this.obj.aprReason = res.content.aprReason;
                    this.obj.useStatus = res.content.useStatus;
                    if( this.obj.useStatus === 1 )
                        this.obj.useStatus = '下线';
                    else if( this.obj.useStatus === 2)
                        this.obj.useStatus = '上线中';
                    else 
                        this.obj.useStatus = '-';
                    this.obj.aprStatus = res.content.aprStatus;
                    this.obj.operator = (res.content.aprReqManName?res.content.aprReqManName:'') +' '+(res.content.aprReqManNo?res.content.aprReqManNo:'');
                    this.obj.aprStatusName = this.tool.str.getAprStatusName(res.content.aprStatus);
                  })
              }
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>