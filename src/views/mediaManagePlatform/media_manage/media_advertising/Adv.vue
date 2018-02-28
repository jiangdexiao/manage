<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" :title="obj.advStatus===1?'下架':'上架'" @close="handleClose" :visible.sync="show_adv_dialog" :close-on-click-modal= "false" >
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
                <el-form-item v-if=" obj.advStatus === 1" label="下架商品 :" >
                    <span>{{ obj.advGoodsName }}</span>
                </el-form-item>
                <el-form-item v-if=" obj.advStatus === 1" label="备注 :" >
                    <el-input type="textarea" v-model="obj.advReason" :maxlength="200" ></el-input>
                </el-form-item>
                <el-form-item>
                    <span style='color:red;text-align:center'>{{ obj.advStatus === 1? '下架后当前投放商品自动删除投放，谨慎操作！':'暂不支持手动上架，上架状态根据投放排期自动切换！'}}</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" v-if="obj.advStatus === 1" @click="save" >保 存</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
export default {
  data(){
      return {
          show_adv_dialog:false,
          obj:{}
      }
  },
  methods:{
    handleClose(){
        this.show_adv_dialog = false
        this.$parent.show_adv_dialog = false
    },
    save(){
        if (this.obj.advStatus === 1) {
            //原始状态为上架 当前操作为下架
            this.api_mediaManagePlatform_mresAdv({pathParams:`/${this.obj.mresId}`, type:'put' ,data: {advStatus: 2, remarks: this.obj.advReason} }).then(res=>{
                this.$emit('success',true)
            })
        } else {
            //原始状态为下架 当前操作为上架
            this.api_mediaManagePlatform_mresAdv({pathParams:`/${this.obj.mresId}`,type:'put',data: {advStatus: 1} }).then(res=>{
                this.$emit('success',true)
            })
        }
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
          this.show_adv_dialog = v
          this.obj = {}
          if( v === true){
              if( this.data && this.data.length >0 ){
                  this.obj = this.data[0]
              }
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>