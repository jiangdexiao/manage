<template>
  <div class="edit-form">
		<el-dialog
			:title="addModifyToggle==='add'?'新增用户':'修改用户'"
			custom-class='dialog'
			:visible.sync="isShow"
			:before-close="handleClose">
				<el-col :span="24" >
					<el-form :model="ruleForm" :rules="formRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
						<el-form-item label="角色" prop="roleId">
						<el-select  v-model="ruleForm.roleId">
							<el-option v-for="(role,i) in rolesArray" :value="i" :key="i" :label="role" v-show="(i!= 1 &&i != 2 &&  i!= 7 &&  i!= 8)" ></el-option>
						</el-select>
						</el-form-item>
						<el-form-item label="用户名" prop="editUserName">
							<el-input v-model="ruleForm.editUserName"></el-input>
						</el-form-item>
						<el-form-item label="姓名" prop="name">
							<el-input v-model="ruleForm.name"></el-input>
						</el-form-item>
						<el-form-item label="编号" prop="userNo">
							<el-input v-model="ruleForm.userNo"></el-input>
						</el-form-item>
						<el-form-item label="联系电话" prop="telNo">
							<el-input v-model="ruleForm.telNo"></el-input>
						</el-form-item>
						<el-form-item label="邮件" prop="email">
							<el-input v-model="ruleForm.email"></el-input>
						</el-form-item>
						<el-form-item label="密码" prop="passwd">
							<el-input v-model="ruleForm.passwd"></el-input>
						</el-form-item>
						<el-form-item label="备注" prop="note">
							<el-input v-model="ruleForm.note"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
				<span slot="footer" class="dialog-footer">
					<el-button @click="handleClose">取 消</el-button>
					<el-button type="primary" @click="save">保 存</el-button>
				</span>
		</el-dialog> 
  </div>
</template>
      
<script>
import md5 from "md5"
import utf8 from 'utf8'
import base64 from 'base-64'
export default {
  data() {
    const rule_pwd = (rule,value,callback)=>{
      if(this.addModifyToggle === 'add') {
        if (!this.ruleForm.passwd) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        userId: "",
        editUserName: "",
        name: "",
        roleId: "",
        note: "",
        telNo: "",
        email: "",
        passwd: "",
        userNo: ""
      },
      formRules: {
				roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
				editUserName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
				name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
				passwd: [
          { validator: rule_pwd, trigger: 'blur' }
        ],
      },
      roleArr: [],
      rules: {},
      search_all_roles_match_toArray: {}
    };
  },
  props: ["isShow", "data", "rolesArray", "addModifyToggle", "allRolesMatch"],
  methods: {
    // 关闭
    handleClose() {
      this.$parent.isShow = false;
      this.$refs.ruleForm.resetFields()
      this.ruleForm = {
        userId: "",
        editUserName: "",
        name: "",
        roleId: "",
        note: "",
        telNo: "",
        email: "",
        passwd: "",
        userNo: ""
      };
      this.$parent.data = null;
    },
    // 保存提交
    save() {
			this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let action = ''
          if (this.addModifyToggle === 'add') {
            action = 'A'
            this.api_businessManagePlatform_getId ({
              data: {
                idType: 'FORBID_ID',
                userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token
              },
            }).then(res => {
              this.api_businessManagePlatform_sysUserSave ({ 
                data: Object.assign({}, this.ruleForm, {
									systemAccessToken: sessionStorage.getItem('access_token'),
									userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
									roleName: this.rolesArray[this.ruleForm.roleId],
									passwd: this.ruleForm.passwd ? md5(this.ruleForm.passwd).toLowerCase() : '',
									userId: JSON.parse(utf8.decode(base64.decode(res.content))).id,
									action: action
                }),
              }).then(res => {
                this.$parent.get_role_info()
                this.handleClose()
                return
              })
            })
          } else if (this.addModifyToggle === 'edit') {
            action = 'U'
            this.api_businessManagePlatform_sysUserSave ({ 
							data: Object.assign({}, this.ruleForm, {
								systemAccessToken: sessionStorage.getItem('access_token'),
								userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
								roleName: this.rolesArray[this.ruleForm.roleId],
								editUserName: this.ruleForm.editUserName,
								passwd: this.ruleForm.passwd ? md5(this.ruleForm.passwd).toLowerCase() : '',
								userId: this.ruleForm.userId,
								action: action
							}),
						}).then(res => {
							this.$parent.get_role_info()
							this.handleClose()
						})
          }
          
        }
      })
    }
  },
  watch: {
    isShow(v) {
      if (!v || !this.data) return false;
      this.$parent.isShow = v;
    },
    data(v) {
      if (v) {
        console.log('data', v.userName)
				this.ruleForm = v
				this.ruleForm.editUserName = v.userName
      }
    }
  },
  mounted() {
     console.log('data', this.rolesArray)
  }
};
</script>

<style >

</style>
      