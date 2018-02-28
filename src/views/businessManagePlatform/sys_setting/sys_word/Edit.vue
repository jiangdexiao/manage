<template>
  <div class="edit-form">
    <el-dialog
      title="添加禁用词汇"
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="词汇名" prop="versionNo">
              <el-input v-model="form.words" placeholder="词汇名(单个长度1-20位)"></el-input>
              批量增加用 ,  或者， 分割  最多十个
            </el-form-item>
            <el-form-item label="作用" prop="status">
              <el-select v-model="form.function" placeholder="请选择">
                <el-option label="替换" value="REPLACE_WITH_WHITESPACE"></el-option>
                <el-option label="拒绝提交" value="REFUSE_COMMIT"></el-option>
              </el-select>
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
      form: {words: '', function: ''},
      formRules: {
        androidTitle: [{ required: true, message: "android标题不能为空", trigger: "blur" }],
        androidContent: [{ required: true, message: "android内容不能为空", trigger: "blur" }],
        iosContent: [{ required: true, message: "ios内容不能为空", trigger: "blur" }],
        // fileUrl: [{ required: true, message: "请上传文件", trigger: "blur" }],
        // isRedirect: [{ required: true }],
        // redirectUrl: [{ required: true}]
      },
      file_change: false,
      goods_all: []
    };
  },
  props: ["isShow", "data", "addModifyToggle", "isSuccess"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    handleClose() {
      this.$parent.isShow = false
      // this.$refs.form.resetFields()
      this.form = {words: '', function: ''}
      this.$parent.data = null
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addModifyToggle === 'add') {
            this.api_businessManagePlatform_getId ({
              data: {
                idType: 'FORBID_ID',
                userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token
              },
            }).then(res => {
              if (this.isSuccess === false) return
              this.api_businessManagePlatform_forbidEdit ({
                data: {
                  wordId: JSON.parse(utf8.decode(base64.decode(res.content))).id,
                  userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
                  systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
                  words: this.form.words.includes('，') ? this.form.words.replace(/，/g, ',') : this.form.words,
                  function: this.form.function,
                  action: 'A'
                },
              }).then(res => {
                this.$parent.isSuccess = false
                this.$parent.init()
                this.handleClose()
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

<style lang="scss" scoped>
.edit-form {
  .textarea_upgTip {
    height:100px;
    resize:none;
    width: 200px;
  }
}
</style>
