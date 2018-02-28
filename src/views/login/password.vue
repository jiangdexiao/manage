<template>
  <div>
      <el-dialog title="修改密码" @close="dialogClose" :visible.sync="show_password_dialog" :close-on-click-modal= "false" width="550px">
            <el-form ref="form" :rules="rulesForm" :model="form" class="form_box">
                <el-form-item label="原密码" prop="oldPasswd" label-width="120px">
                    <el-input type="password" :maxlength="16" v-model="form.oldPasswd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码"  prop="newPasswd1" label-width="120px">
                    <el-input type="password" :maxlength="16" v-model="form.newPasswd1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码"  prop="newPasswd2" label-width="120px">
                    <el-input type="password" :maxlength="16" v-model="form.newPasswd2" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer center">
                <el-button type="primary" @click="save">确认</el-button>
                <el-button @click="dialogClose">取 消</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import { mapGetters  } from 'vuex'
import md5 from 'md5'
export default {
  data(){
      const rule1 = (rule, value, callback)=>{
        if (!value) {
             callback(new Error('请输入原密码'))
        }
        else if( value.length < 6 || value.length > 16){
             callback(new Error('请输入6到16位原密码'))
        }
        else if( !this.tool.validate.password(value) ){
             callback(new Error('密码只能输入英文,数字和特殊字符！@#￥%.&*'))
        }
        else{
            callback()
        }
        
    }
    const rule2 = (rule, value, callback)=>{
        if (!value) {
             callback(new Error('请输入新密码'))
        }
        else if( value.length < 6 || value.length > 16){
             callback(new Error('请输入6到16位新密码'))
        }
        else if( !this.tool.validate.password(value) ){
             callback(new Error('密码只能输入英文,数字和特殊字符！@#￥%.&*'))
        }
        else{
            if (this.form.newPasswd2 !== '') {
                this.$refs.form.validateField('newPasswd2');
            }
            callback()
        }
    }
    const rule3 = (rule, value, callback)=>{
        if (!value) {
             callback(new Error('请输入确认密码'))
        }
        else if( value !== this.form.newPasswd1 ){
            callback(new Error('两次输入密码不一致!'))
        }
        else{
            callback()
        }
    }
      return{
          show_password_dialog:false,
          form:{
              oldPasswd:'',
              newPasswd1:'',
              newPasswd2:''
          },
          rulesForm:{
              oldPasswd:[
                  { validator: rule1, trigger: 'blur' }
              ],
              newPasswd1:[
                  { validator: rule2, trigger: 'blur' }
              ],
              newPasswd2:[
                  { validator: rule3, trigger: 'blur' }
              ]
          }
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
      save(){
          this.$refs.form.validate((valid) => {
            if (valid) {
                this.api_user_modpwd({
                    data:{
                        userName:this.getUser.userName,
                        oldPasswd:md5(this.form.oldPasswd.trim()).toLowerCase(),
                        newPasswd:md5(this.form.newPasswd1.trim()).toLowerCase()
                    }
                }).then(res=>{
                    this.dialogClose()
                    this.$message({type:'success',message:'密码修改成功,请重新登录'})
                    this.$router.push({path:'/login'})
                })
            } else {
                return false;
            }
        });
      },
      dialogClose(){
          this.$refs.form.resetFields();
          this.show_password_dialog = false
          this.$parent.show_password_dialog = false
      }
  },
  props:{
      isShow:{
          type:Boolean
      }
  },
  watch:{
      isShow(v){
          this.show_password_dialog = v
      }
  }
}
</script>
