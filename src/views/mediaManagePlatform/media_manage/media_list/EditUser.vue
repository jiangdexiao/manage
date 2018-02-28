<template>
  <div class="edit-form">
      <el-dialog
        title="新增用户"
        custom-class='dialog'
        :visible.sync="show_useradd_dialog"
        :close-on-click-modal="false"
        @close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="用户账号" prop="mobile">
                        <el-input placeholder="请使用手机号" v-model="form.mobile" :maxlength="11" ></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password">
                        <el-input  v-model="form.password" :maxlength="16" ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="username">
                         <el-input  v-model="form.username" :maxlength="10" ></el-input>
                    </el-form-item>
                    <el-form-item label="性别" >
                        <el-radio-group v-model="form.sex">
                            <el-radio label="1" >男</el-radio>
                            <el-radio label="0"> 女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="form.age" :maxlength="3"></el-input>
                    </el-form-item>
                    <el-form-item label="区域">
                        <EleAreaProvinceCity  v-on:selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCity>
                    </el-form-item>
                    <el-form-item label="头像">
                        <ele-upload ref="imgUpload" :img="{imageUrl:option.img,imgGroup:1,maxSize:300}"  v-on:uploadSuccess="uploadSuccess"></ele-upload>  
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="save" >保 存</el-button>
            </span>
      </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { EleAreaProvinceCity} from '../../../../components/business/'
import rules from '../../../../utils/rules/'
import md5 from 'md5'
export default {
  components:{EleAreaProvinceCity},
  data(){
       let tool = this.tool
      const rule_age = function(rule,value,callback){
          if ( value && (value <0 || value >100 || !tool.validate.age(value))){
              return callback(new Error('年龄请输入0-100的整数'));
          }else{
              callback()
          }
      }
      return{
          option: {
            img: ''//http://ofyaji162.bkt.clouddn.com/touxiang.jpg
          },
          show_useradd_dialog:false,
          form:{
            mobile:'',
            password:'',
            sex:'1',
            age:'',
            username:'',
            provinceCode:'',
            districtCode:''
         },
          formRules:{
              mobile: [
                { required: true,message:'用户账号不能为空', trigger: 'blur' },
                { validator: rules.rule_mobile, trigger: 'blur' }
              ],
              password:[
                { required: true,message:'密码不能为空', trigger: 'blur' },
                { validator: rules.rule_password, trigger: 'blur' }
              ],
              username: [
                { required: true,message:'请输入姓名', trigger: 'change' },
                { min:2,max:20,message:'姓名最少2个字符', trigger: 'change' },
              ],
              age:[
                { validator: rule_age, trigger: 'change' }
              ]
          }
      }
  },
  methods:{
    EleAreaProvinceCity_CallBack(val,len,array){
        if( array && array.length == 1){
            this.form.provinceCode = array[0]
        }else if( array && array.length == 2){
            this.form.provinceCode = array[0]
            this.form.districtCode = array[1]
        }
        console.log(array)
    },
    uploadSuccess(res){
        console.log('图片上传成功返回值：'+ JSON.stringify(res))
        if (res && res.content) {
            this.option.img = res.content.url
            this.form.icon = res.content.url
        } else {
            this.$refs.imgUpload.clear()
            this.$message({message:res.errorMessage,type:'error'})
        }
    },
    handleClose(){
        this.show_useradd_dialog = false
        this.$parent.show_useradd_dialog = false;
        this.$refs.form.resetFields();
        
        this.clear()
    },
    clear(){
        this.option.img = ''
        this.form.icon = ''
        this.form.provinceCode = ''
        this.form.districtCode = ''
        this.$refs.imgUpload.clear()
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              this.api_user_add({
                  data:{
                      token:sessionStorage.getItem('access_token'),
                      groupType:1,
                      icon:this.option.img,
                      mobile:this.form.mobile,
                      password:md5(this.form.password),
                      sex:this.form.sex,
                      age:this.form.age,
                      username:this.form.username,
                      provinceCode:this.form.provinceCode,
                      districtCode:this.form.districtCode
                    } 
             }).then(res=>{
                 let u = {userId:res.content,username:this.form.username,mobile:this.form.mobile}
                 this.$emit('select',u)
                 this.handleClose()
              })
          }
        })
    }
  },
  mounted(){
  },
  props:{
      isShow:{
          type:Boolean
      }
  },
  watch:{
      isShow(v){
          this.show_useradd_dialog = v
      }
  }
}
</script>

