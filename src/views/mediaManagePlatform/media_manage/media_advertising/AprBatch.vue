<template>
	<div class="edit-form aprBatch_dialog">
        <el-dialog custom-class="dialog" title="批量审批" @close="handleClose" :visible.sync="show_aprBatch_dialog" :close-on-click-modal= "false">
            <el-form label-width="150px">
                <p v-if="data && data.length">共选择 {{data.length}} 个可审批的广告位，请谨慎操作！</p>
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
          show_aprBatch_dialog:false,
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    handleClose(){
        this.show_aprBatch_dialog = false
        this.$parent.show_aprBatch_dialog = false
    },
    save(check){
        let status = check ? 2 :3;
        this.api_mediaManagePlatform_mresAprBatch({type:'put',
            data: {mresIds: JSON.stringify(this.data), aprStatus: status,operateUserId:this.getUser.userId,userType:3} }).then(res=>{
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
          this.show_aprBatch_dialog = v 
      }
  }
}
</script>

<style lang="scss">
.aprBatch_dialog {
    .el-dialog{
        width: 500px;
        height: 210px;
    }
    .el-dialog__body {
        height: auto;
    }
}
</style>