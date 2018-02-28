<template>
  <div class="edit-form">
    <el-dialog
      title="新增投诉"
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="用户电话" prop="userPhone">
              <el-input v-model="form.userPhone" :maxlength="11" placeholder="请使用手机号"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="form.userName" :maxlength="20" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="反馈类型" prop="cate">
              <el-select v-model="form.cate"  placeholder="反馈类型">
                <el-option v-for="(item,i) in cate_match" :key="i" :value="i" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="反馈内容" prop="content">
              <textarea type="text" class="textarea_upgTip" :maxlength="200" v-model="form.content"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status"  placeholder="选择状态">
                <el-option label="待处理" value=1></el-option>
                <el-option label="完成" value=2></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="处理备注" prop="remarks">
              <textarea type="text" class="textarea_upgTip" :maxlength="200" v-model="form.remarks"
                placeholder="" style="width:180px;height:100px;resize:none;border-radius:4px;border: 1px solid #d8dce5;padding:10px;font-family:Helvetica Neue;color:#5a5e66;">
              </textarea>
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
    const ruleMobile = (rule,value,callback)=>{
      if( this.form.userPhone && !((/^1[34578]\d{9}$/).test(this.form.userPhone))){
        callback(new Error('手机号格式不正确'))
      }else{
        callback()
      }
    }
    return {
      cate_match: {'1': '使用', '2': '订单', '3': '发货', '4': '支付', '5': '投诉', '6': '反馈建议', '7': '其他', '8': '未分派'},
      form: {userPhone: '', userName: '', cate: '', content: '', status: '', remarks: ''},
      formRules: {
        userPhone: [
          { required: true, message: "用户电话不能为空", trigger: "blur" },
          { required: true, validator: ruleMobile, trigger: 'blur'  },
        ],
        userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        content: [{ required: true, message: "反馈内容不能为空", trigger: "blur" }]
      },
      file_change: false
    };
  },
  props: ["isShow", "data", "addModifyToggle"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    handleClose() {
      this.$parent.isShow = false
      // this.$refs.form.resetFields()
      this.form = {userPhone: '', userName: '', cate: '', content: '', status: '', remarks: ''}
      this.$parent.data = null
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addModifyToggle === 'add') {
            this.api_businessManagePlatform_getUserId ({
              data: {
                token: sessionStorage.getItem('access_token'),
                mobile: this.form.userPhone,
                username: this.form.userName
              },
            }).then(res => {
							let userId = res.content.length > 0 ? res.content[0].userId : ''
							this.api_businessManagePlatform_addComplaint ({
								data: Object.assign({}, this.form, {
									token: sessionStorage.getItem('access_token'),
									userId: userId,
									serviceStaffPhone: JSON.parse(sessionStorage.getItem('userInfo')).telNo,
									serviceStaffId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
									serviceStaffName: JSON.parse(sessionStorage.getItem('userInfo')).userName
								}),
							}).then(res => {
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
