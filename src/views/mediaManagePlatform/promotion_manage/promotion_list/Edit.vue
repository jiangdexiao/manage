<template>
  <div class="edit-form">
    <el-dialog
        :title="optionPage=='add'?'新增':'修改'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="所属媒体" prop="mediaId">
                        <el-select v-model="form.mediaId" filterable remote placeholder="所属媒体"  clearable :remote-method="get_mediaIdList" :loading="loading" >
                            <el-option v-for="(item,i) in media_list" :key="i" :label="item.mediaName" :value="item.mediaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="登录手机号" prop="accNo">
                        <el-input v-model="form.accNo" @blur="change_tel" :maxlength="11"></el-input>
                        <div style="color:red;">{{add_iphone === 1 ? '账号已存在，可直接升级为促销员': add_iphone === 2 ? '账号已是促销员用户，不能新增' : add_iphone === 3 ? '账号已是媒体用户，不能新增' : add_iphone === 4 ? '账号已是经销商用户，不能新增' : ''}}</div>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="userPwd" v-if="optionPage=='add'">
                        <el-input v-model="form.userPwd" :maxlength="16" ></el-input>
                    </el-form-item>
                    <el-form-item label="登录密码" prop="editUserPwd" v-if="optionPage=='edit'">
                        <el-input v-model="form.editUserPwd" :maxlength="16" ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="salesmanName" >
                        <el-input v-model="form.salesmanName"  :maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio  :label="1">男</el-radio>
                            <el-radio  :label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age" >
                        <el-input :maxlength="3" v-model="form.age"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button v-if="add_iphone === 2 || add_iphone === 3 || add_iphone === 4">拒 绝</el-button>
                <el-button type="primary" @click="save" v-if="add_iphone != 2 && add_iphone != 3 && add_iphone != 4">保 存</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
import rules from '../../../../utils/rules/'
import md5 from 'md5'
export default {
    data() {
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
        return {
            formRules:{
                mediaId: [
                    { required: true,message:'请输入所属媒体', trigger: 'blur' },
                ],
                accNo: [
                    { required: true,validator: rules.rule_mobile, trigger: 'blur'  },
                ],
                userPwd: [
                    {required: true, validator: rules.rule_password, trigger: 'blur' }
                ],
                editUserPwd: [
                    {validator: rule_password, trigger: 'blur' }
                ],
                salesmanName:[
                    { required: true,message:'请输入姓名', trigger: 'blur' },
                ],
                sex: [
                    { required: true, message: '请选择性别', trigger: 'blur' }
                ],
                age: [
                    {required: true, validator: rules.rule_age, trigger: 'blur' }
                ],
            },
            form: {
                userGroup:'',
                userId:'',
                salesmanId:'',
                mediaId:'',
                accNo:'',
                userPwd:'',
                salesmanName:'',
                sex:'',
                age:''
            },
            media_list:[],
            optionPage:'add',
            loading:false,
             // 手机号保存坚持参数
            add_iphone: '',

        }
    },
    props:['isShow','data'],
    methods: {
        verify_val() {
             if (this.form.salesmanName.length <2 ) {
                this.$message({type:'error',message:'姓名最少两个字符'})
                return false
            }
            return true
        },
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (!this.verify_val()) {
                        return false;
                    }
                    if(this.optionPage=='add'){  
                        this.api_common_mediaId({ data:{ prefix:'18SL' } }).then(res=>{
                            this.form.salesmanId = res.content
                            this.form.userPwd = md5(this.form.userPwd);
                            this.api_mediaManagePlatform_salesman({data:this.form,type:'post'}).then(res=>{
                                this.handleClose()
                                this.$emit('saveSuccess')
                            }).catch((res) => {
                                this.form.userPwd =''
                            })
                        })
                    }else{
                        this.form.userPwd= this.form.editUserPwd ? md5(this.form.editUserPwd) : '',
                        this.api_mediaManagePlatform_salesman({data:this.form, type:'put'}).then(res=>{
                            this.handleClose()
                            this.$emit('saveSuccess')  
                        })
                    }
                } else {
                    return false;
                }
            })
        },
        // 手机号检测
        change_tel () {
            this.api_mediaManagePlatform_bymobile({data:{systemAccessToken:'',mobile:this.form.accNo}}).then(res=>{
                this.add_iphone = res.content.groupType
                this.form.userId = res.content.userId
            })
        },
        get_mediaIdList(query) {
            // if (!query || query == "") return;
            if( query && query.length > 50 ){
                this.$message({type:'error',message:'输入不能超过50个字符'});return;
            }
            this.loading = true;
            this.api_mediaManagePlatform_mediaList({data:{mediaName:query}}).then(res=>{
                this.loading = false;
                this.media_list = res.content
            })
        },
        handleClose(){
            this.$parent.isShow = false;
            this.$refs.form.resetFields();
            this.clear_param()
        },
        clear_param() {
            this.media_list= []; this.tool.dp.clearData(this.form)
        },

    },
    watch: {
        isShow(v){
            if( !v || !this.data ) {
                this.optionPage= 'add';
                this.add_iphone = -1
                this.get_mediaIdList()
                return false
            };
            this.optionPage= 'edit';
            this.tool.dp.assignData(this.form, this.data)
            this.get_mediaIdList(this.data.mediaName)
            this.$parent.isShow = v
        }

    }
}
</script>
