<template>
  <div class="edit-form">
    <el-dialog
      :title="addModifyToggle==='add'?'新增版本发布':'修改版本发布'"
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="终端" prop="phoneType">
              <el-select v-model="form.phoneType"  placeholder="所有终端">
                <!-- <el-option label="所有终端" value=""></el-option> -->
                <el-option label="iOS手机" :value="1"></el-option>
                <el-option label="Android手机" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本号" prop="versionNo">
              <el-input v-model="form.versionNo" :maxlength="6" placeholder="5-6位（1.1.1或1.1.11）"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              待发布
            </el-form-item>
            <el-form-item label="更新提示" prop="upgTip">
              <textarea type="text" class="textarea_upgTip" :maxlength="200" v-model="form.upgTip"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
            </el-form-item>
            <el-form-item label="是否强制" prop="isMust">
              <el-radio-group v-model="form.isMust">
                <el-radio :label="0">不强制升级</el-radio>
                <el-radio :label="1">强制升级</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="安装包" prop="isMust" v-show="parseInt(form.phoneType) === 2">
              <el-radio-group v-model="isUpload">
                <el-radio :label="1">填写地址</el-radio>
                <el-radio :label="2">上传安装包</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上传安装包" prop="fileUrl" v-show="parseInt(isUpload) === 2&&parseInt(form.phoneType) === 2">
              <div style="word-break:break-word" v-show="addModifyToggle==='modify'">{{form.fileUrl}}</div>
              <input type="file" id="add_modify_params_file" @change="file_change_func">
            </el-form-item>
            <el-form-item label="安装包地址" prop="fileUrl" v-show="parseInt(isUpload) === 1&&parseInt(form.phoneType) === 2">
              <el-input v-model="form.fileUrl" ></el-input>
            </el-form-item>
            <el-form-item label="是否跳转页面" prop="isRedirect" v-show="parseInt(form.phoneType) === 2">
              <el-radio-group v-model="form.isRedirect">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="跳转地址" prop="redirectUrl" v-show="parseInt(form.isRedirect) === 1">
              <el-input v-model="form.redirectUrl" ></el-input>
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
import rules from "../../../../utils/rules/";
import md5 from "md5";
import { mapState } from "vuex";
export default {
  data() {
    return {
      form: { versionNo: '', phoneType: '', upgTip: '', isMust: 0, fileUrl: '', isRedirect: 0, redirectUrl: '' },
      formRules: {
        phoneType: [{ required: true, message: "请选择终端", trigger: "blur" }],
        versionNo: [{ required: true, message: "请填写版本号", trigger: "blur" }],
        upgTip: [{ required: true, message: "更新提示不能为空", trigger: "blur" }],
        isMust: [{ required: true }]
        // fileUrl: [{ required: true, message: "请上传文件", trigger: "blur" }],
        // isRedirect: [{ required: true }],
        // redirectUrl: [{ required: true}]
      },
      file_change: false,
      isUpload: 1
    };
  },
  props: ["isShow", "data", "addModifyToggle", "fileChange", "isSuccess"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    handleClose() {
      this.$parent.isShow = false
      // this.$refs.form.resetFields()
      this.form = { versionNo: '', phoneType: '', upgTip: '', isMust: 0, fileUrl: '', isRedirect: 0, redirectUrl: '' }
      this.$parent.data = null
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let that = this
          if (that.$parent.isSuccess === false) return
          let ajax = function () {
            if (that.addModifyToggle === 'add') {
              that.api_businessManagePlatform_addVersion ({
                data: Object.assign({}, that.form, {
                  userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                  userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
                  token: JSON.parse(sessionStorage.getItem('userInfo')).token
                }),
              }).then(res => {
                that.$parent.init()
                that.handleClose()
                that.$parent.isSuccess = false
              }).catch(() => {
                that.$parent.isSuccess = true
              })
            } else {
              that.api_businessManagePlatform_updVersion ({
                data: Object.assign({}, that.form, {
                  userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                  userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
                  token: JSON.parse(sessionStorage.getItem('userInfo')).token
                }),
              }).then(res => {
                that.$parent.init()
                that.handleClose()
              })
            }
          }
          if (that.file_change) {
            let formData = new FormData()
            formData.append('androidApk', document.querySelector('#add_modify_params_file').files[0])
            formData.append('token', sessionStorage.getItem('access_token'))
            if (that.$parent.isSuccess === false) return
            that.$parent.isSuccess = false
            $.ajax({
              type: 'post',
              url: that.BASE_URL + 'm2c.support/app/apk',
              data: formData,
              processData: false,
              contentType: false,
              success: function (result) {
                result = JSON.parse(result)
                if (result.errorMessage && result.errorMessage !== '') {
                  this.$message({type:'error',message: result.errorMessage})
                  that.file_change = true
                  return
                }
                that.file_change = false
                that.form.fileUrl = result.content.url
                if (result.status === 200) {
                  ajax()
                  // that.wait_upload = false
                  that.$parent.isSuccess = false
                }
              }
            })
          } else {
            if (parseInt(that.form.phoneType) === 2 && that.form.fileUrl === '') {
              this.$message({type:'error',message:'文件url不能为空'})
              return
            }
            ajax()
          }
        }
      })
    },
    file_change_func () {
      if (document.querySelector('#add_modify_params_file').value === '') return
      this.file_change = true
    },
  },
  watch: {
    fileChange(v) {
      this.file_change = v
    },
    isShow(v) {
      this.$parent.isShow = v
    },
    data(v) {
      if (v) {
        console.log(v)
        console.log(v.phoneType === 2)
        this.form = {...v}
      }
    }
    // addModifyToggle(v) {
    //   document.querySelector('#add_modify_params_file').value = ''
    // }
  }
};
</script>

<style lang="scss" scoped>
.edit-form {
  .textarea_upgTip {
    height:100px;
    resize:none;
    width: 200px;
  }
}
</style>
