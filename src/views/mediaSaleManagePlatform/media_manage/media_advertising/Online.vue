<template>
	<div class="edit-form">
        <el-dialog custom-class="dialog" :title="obj.status===1?'下线':'上线'" @close="handleClose" :visible.sync="show_online_dialog" :close-on-click-modal= "false" >
            <el-form label-width="150px" ref="obj" :model="obj" :rules="formRules">
                <el-form-item label="媒体 :" >
                    <span>{{ obj.mediaName }}</span>
                </el-form-item>
                <el-form-item label="广告位 :" >
                    <span>{{ obj.mresName }}</span>
                </el-form-item>
                <el-form-item label="条码 :" >
                    <span>{{ obj.mresNo }}</span>
                </el-form-item>
                <el-form-item label="当前投放 :" >
                    <span>{{ obj.advStatus }}</span>
                </el-form-item>
                <el-form-item  :label="obj.status===1?'下线理由':'上线理由'" prop="reason">
                    <el-input type="textarea" v-model="obj.reason" :maxlength="200" ></el-input>
                </el-form-item>
                <el-form-item  v-if="obj.status === 1">
                    <span style='color:red;text-align:center'>下线此广告位不能再进行排期投放，并且之前投放排期全部失效，谨慎操作！</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary"  @click="save" >保 存</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data(){
      return {
          show_online_dialog:false,
          obj:{
              mresId:'',
              mediaName:'',
              mresName:'',
              mresNo:'',
              advStatus:'',
              reason:'',
              status:''
          },
          formRules:{
            reason: [
                { required: true,message:'理由至少为2个字符', trigger: 'change' },
                { min: 2, max: 200, message: '理由至少为2个字符', trigger: 'change' }
            ]
          }
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    handleClose(){
        this.show_online_dialog = false
        this.$refs.obj.resetFields()
        this.$parent.show_online_dialog = false
    },
    save(){
        this.$refs.obj.validate((valid) => {
          if (valid) {
            this.api_mediaManagePlatform_mresLine({pathParams:`/${this.obj.mresId}`,type:'put',
            data:{
                reason: this.obj.reason,
                aprStatus: this.obj.status === 1 ? 11 : 21,
                operateUserId:this.getUser.userId,
                userType:3}
            }).then(res=>{
                this.handleClose()
                this.$emit('success',true)
            })
         }else{
              return false;
          }
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
          this.show_online_dialog = v
          this.obj = {
              mresId:'',
              mediaName:'',
              mresName:'',
              mresNo:'',
              advStatus:'',
              reason:'',
              status:''
          }
          if( v === true){
              if( this.data && this.data.length >0 ){
                  this.obj.mresId = this.data[0].mresId
                  this.obj.mediaName = this.data[0].mediaName
                  this.obj.mresName = this.data[0].mresName
                  this.obj.mresNo = this.data[0].mresNo
                  this.obj.status = this.data[0].useStatus === 1? 2:1
                  if (this.data[0].advStatus === 1) 
                    this.obj.advStatus = "上架中"
                  else if (this.data[0].advStatus === 2) 
                    this.obj.advStatus = "下架"
              }
          }
      }
  }
}
</script>

<style lang="scss" scoped>

</style>