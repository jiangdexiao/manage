<template>
  <div class="edit-form">
      <el-dialog
        :title="pageOption=='edit'?'编辑BD专员':'新增BD专员'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
                    <el-form-item label="登录手机号" prop="account">
                        <el-input v-model="form.account" :maxlength="11" ></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="password" v-if="pageOption=='add'">
                        <el-input v-model="form.password" :maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="editPassword" v-if="pageOption=='edit'">
                        <el-input v-model="form.editPassword" :maxlength="16"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="bdName">
                        <el-input v-model="form.bdName" :maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio  :label="1">男</el-radio>
                            <el-radio  :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="form.age"></el-input>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="orgId">  
                        <EleOrgProvinceCity :selectVal="form.orgId" v-on:selected="EleOrgProvinceCity_CallBack"></EleOrgProvinceCity>
                    </el-form-item>
                    <el-form-item label="主管BD专员" v-if="bdOrgLevel!=0" prop="parentBdId">
                        <el-select v-model="form.parentBdId" filterable remote placeholder="主管BD专员"  clearable :remote-method="get_bdList" :loading="loading" >
                            <el-option v-for="(item,i) in bdList" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域"  prop="regionCode">
                        <EleAreaProvinceCityAreas :selectVal="areas" v-on:selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCityAreas>
                    </el-form-item>
                    <el-form-item label="媒体分类" prop="mediaCate">
                        <EleMediaCategory :selectVal="medias" v-on:selected="EleMediaCategory_CallBack"></EleMediaCategory>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="bdMobile">
                        <el-input v-model="form.bdMobile" :maxlength="20" ></el-input>
                    </el-form-item>
                    <el-form-item label="联系邮箱"  prop="email">
                        <el-input v-model="form.email" :maxlength="50"></el-input>
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
import { EleOrgProvinceCity , EleAreaProvinceCityAreas , EleMediaCategory } from '../../../../components/business/'
import rules from '../../../../utils/rules/'
import md5 from 'md5'
import { mapState } from 'vuex'
export default {
  components:{EleOrgProvinceCity,EleAreaProvinceCityAreas,EleMediaCategory},
  data(){
      let tool = this.tool
      const rule_password = function(rule,value,callback){
          if(value && value.length < 6){
              callback(new Error('密码最少为6位'))
          }else if(value && !tool.validate.password(value) ){
            callback(new Error('密码只能输入英文,数字和特殊字符！@#￥%.&*'))
          }else{
              callback()
          }
      }
      const rule_bdName = function(rule,value,callback){
          if( value && !tool.validate.chinese(value)){
              callback(new Error('姓名只能输入中文'))
          }else{
              callback()
          }
      }
      return{
          pageOption:'',
          loading:false,
          form:{
              bdId:'', 
              account: '', 
              password: '', 
              bdName: '', 
              sex: '', 
              age: '', 
              orgId: [], 
              parentBdId:'',
              regionCode:'',
              mediaCate: '', 
              bdMobile: '', 
              email: '' 
            },
          formRules:{
              account: [
                { required: true,validator: rules.rule_mobile, trigger: 'blur' }
              ],
              password: [
                {required:true,validator: rules.rule_password, trigger: 'blur' }
              ],
              editPassword: [
                {validator: rule_password, trigger: 'blur' }
              ],
              bdName: [
                { required: true,message:'请输入姓名', trigger: 'blur' },
                { min:2,max:10,message:'姓名长度在2-10个汉字', trigger: 'blur' },
                { validator: rule_bdName, trigger: 'blur' }
              ],
              sex:[
                  {required:true,message:'请选择性别',trigger:'change'}
              ],
              age:[
                  {required: true,validator: rules.rule_age, trigger: 'blur' }
              ],
              orgId:[
                  {required:true,message:'请选择组织',trigger:'change'}
              ],
              parentBdId:[
                  {required:true,message:'请选择主管BD专员',trigger:'change'}
              ],
              regionCode:[
                  {required:true,message:'请输入区域信息',trigger:'change'}
              ],
              mediaCate:[
                   {required:true,message:'媒体分类不能为空，请至少选择两级',trigger:'change'}
              ],
              bdMobile:[
                  { required: true,validator: rules.rule_mobile_tel, trigger: 'blur' }
              ],
              email:[
                { validator: rules.rule_email, trigger: 'blur' }
              ]
          },
          queryBdId:'',
          bdOrgLevel:0,//是否显示bd专员选择列表
          bdList:[],
          areas:[],
          medias:[]
      }
  },
  props:['isShow','data'],
  computed:{
      ...mapState(['prefix_18BD'])
  },
  methods:{
    get_bdList(query){
        if( query && query.length > 50 ){
        this.$message({type:'error',message:'输入不能超过50个字符'});return;
      }
      this.loading = true;
      this.api_mediaManagePlatform_bd({data:{orgId:this.queryBdId,orgType:1,keyWords:query}}).then(res=>{
        this.loading = false;
        this.bdList = res.content
      })
    },
    EleOrgProvinceCity_CallBack(orgId,parentId,orgLevel,array){
        this.form.orgId = array;
        this.bdOrgLevel = orgLevel;
        if( parentId &&  parentId != this.queryBdId && orgLevel!=0){
            this.form.parentBdId ='';
            this.bdList = [];
            this.queryBdId = parentId;
            this.api_mediaManagePlatform_bd({data:{orgId:parentId,orgType:1}}).then(res=>{
                this.bdList = res.content
            })
        }else if(orgLevel==0){
            this.bdList = [];
            this.form.parentBdId = 0;
            this.queryBdId ='';
        }
    },
    EleAreaProvinceCity_CallBack(val,array){
        this.form.regionCode = array.length==3 ? val :''
    },
    EleMediaCategory_CallBack(val,array){
        this.form.mediaCate = array.length==2 ? val :''
    },
    handleClose(){
        this.$parent.isShow = false;
        this.$refs.form.resetFields();
        this.clear_param()
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if( this.pageOption==='edit' ){
                  this.api_mediaManagePlatform_bd({data:{
                      bdId:this.form.bdId,
                      orgId:this.form.orgId?this.form.orgId[this.form.orgId.length-1]:'',
                      bdName:this.form.bdName,
                      account:this.form.account,
                      bdMobile:this.form.bdMobile,
                      parentBdId:this.form.parentBdId,
                      email:this.form.email,
                      password: this.form.editPassword ? md5(this.form.editPassword) :'',
                      sex:this.form.sex,
                      age:this.form.age,
                      mediaCate:this.form.mediaCate,
                      regionCode:this.form.regionCode
                  },
                    pathParams:`/${this.form.bdId}`,
                    type:'put'})
                    .then(res=>{
                    this.handleClose()
                    this.$emit('saveSuccess')
                 })
              }else{
                  this.api_common_mediaId({ data:{ prefix:this.prefix_18BD } }).then(res=>{
                      this.form.bdId = res.content
                      this.api_mediaManagePlatform_bd({
                      data:{
                        bdId:this.form.bdId,
                        orgId:this.form.orgId?this.form.orgId[this.form.orgId.length-1]:'',
                        bdName:this.form.bdName,
                        account:this.form.account,
                        bdMobile:this.form.bdMobile,
                        parentBdId:this.form.parentBdId,
                        email:this.form.email,
                        password:md5(this.form.password),
                        sex:this.form.sex,
                        age:this.form.age,
                        mediaCate:this.form.mediaCate,
                        regionCode:this.form.regionCode
                      },type:'post'})
                      .then(res=>{
                        this.handleClose()
                        this.$emit('saveSuccess')
                      })
                  })
              }
          } else {
            return false;
          }
        })
    },
    clear_param() {
        this.bdOrgLevel= 0;
        this.tool.dp.clearData(this.form)
        this.bdList=[];  this.areas=[];  this.medias=[];
    },
    getBdId(orgLevel,ListData) {
        let bdId='';
        if(orgLevel>0){
            bdId = ListData[orgLevel-1].orgId
        }else if(orgLevel===0){
            bdId = 0
        }
        this.queryBdId = bdId;
        this.api_mediaManagePlatform_bd({data:{orgId:bdId,orgType:1}}).then(res=>{
            this.bdList = res.content
        })
    }
  },
  watch:{
      isShow(v){
          this.form.bdId = ''
          if( v === true){
              this.pageOption = 'add'
              if( this.data && this.data.bdId){
                  this.pageOption = 'edit'
                  this.api_mediaManagePlatform_bd({pathParams:`/${this.data.bdId}`}).then(res=>{
                    let c = res.content
                    this.form.bdId = c.bdId
                    this.form.account = c.account
                    this.form.password = c.password
                    this.form.bdName = c.bdName
                    this.form.sex = c.sex
                    this.form.age = c.age
                    this.form.orgId = c.orgInfoList.map(item=>{
                        return item.orgId
                    })
                    this.form.parentBdId = c.parentBdId
                    this.getBdId(c.orgInfoList[c.orgInfoList.length-1].orgLevel, c.orgInfoList);
                    this.form.regionCode = c.regionCode
                    this.form.mediaCate = c.mediaCate
                    this.form.bdMobile = c.bdMobile
                    this.form.email = c.email
                    this.bdOrgLevel = c.orgInfoList.length-1;
                    if( c.proCode ){
                        this.areas.push(c.proCode)
                    }
                    if( c.cityCode ){
                        this.areas.push(c.cityCode)
                    }
                    if( c.areaCode ){
                        this.areas.push(c.areaCode)
                    }
                    if(c.parentCateCode && c.parentCateName)
                        this.medias.push(c.parentCateCode)
                    if(c.cateCode && c.cateName)
                        this.medias.push(c.cateCode)
                    this.$parent.isShow = v
                })
              }
          }
      },
      "form.account":{
        handler(value, oldValue) {
            this.form.bdMobile = value
        },
        deep: true
      }
  }
}
</script>

