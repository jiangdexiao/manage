<template>
  <div class="edit-form">
    <el-dialog
      :title="addModifyToggle==='add'?'新增角色':'修改角色'"
      custom-class='dialog_static'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="角色名" prop="roleName">
              <el-input v-model="form.roleName" :maxlength="20" placeholder="请输入角色名(2-20位)"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input v-model="form.note" :maxlength="50" placeholder="请填写备注(最多50个字)"></el-input>
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
import rules from "../../../../utils/rules/"
import base64 from 'base-64'
import utf8 from 'utf8'
import md5 from "md5"
import { mapState } from "vuex"
export default {
  data() {
    return {
      form: {
        roleName: '',
        note: '',
        roleId: '',
      },
      formRules: {
        roleName: [{ required: true, message: "角色名不能为空", trigger: "blur" }]
      }
    }
  },
  props: ["isShow", "data", "addModifyToggle"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    handleClose() {
      this.$parent.isShow = false
      // this.$refs.form.resetFields()
      this.form = { roleName: '', note: '', roleId: '' }
      this.$parent.data = null
    },
    save() {
      console.log('标识', this.addModifyToggle)
      this.$refs.form.validate(valid => {
        if (valid) {
          let action = ''
          if (this.addModifyToggle === 'add') {
            action = 'A'
            this.api_businessManagePlatform_getId ({
              data: {
                idType: 'ROLE_ID',
                userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token
              },
            }).then(res => {
              this.api_businessManagePlatform_sysRoleSave({ 
                data: {
                  systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
                  userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                  roleId: JSON.parse(utf8.decode(base64.decode(res.content))).id,
                  roleName: this.form.roleName,
                  note: this.form.note,
                  action: action
                }
              }).then(res => {
                this.$parent.init()
                this.handleClose()
                return
              })
            })
          } else if (this.addModifyToggle === 'modify') {
            action = 'U'
            this.api_businessManagePlatform_getId ({
              data: {
                idType: 'ROLE_ID',
                userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token
              },
            }).then(res => {
              this.api_businessManagePlatform_sysRoleSave({ 
                data: {
                  systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
                  userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                  roleId: this.form.roleId,
                  roleName: this.form.roleName,
                  note: this.form.note,
                  action: action
                }
              }).then(res => {
                this.$parent.init()
                this.handleClose()
                return
              })
            })
          }
        }
      })
    }
  },
  watch: {
    isShow(v) {
      this.$parent.isShow = v
    },
    data(v) {
      if (v) {
        this.form = {...v}
      }
    }
  }
  };
</script>
