<template>
  <div class="edit-form">
    <el-dialog
      :title="addModifyToggle==='add'?'新增静态内容':'修改静态内容'"
      custom-class='dialog'
      @open="dialogOpen"
      :visible.sync="isShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
		  :modal-append-to-body="false">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :maxlength="20" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" :maxlength="50" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="cate">
              <div id="editor-container">
								<UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
							</div>
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
import md5 from "md5"
import { mapState } from "vuex"
import UE from '../../../../components/ueditor/ue.vue'
export default {
	name: '',
	components: {UE},
  data() {
    return {
      cate_match: {
        "1": "使用",
        "2": "订单",
        "3": "发货",
        "4": "支付",
        "5": "投诉",
        "6": "反馈建议",
        "7": "其他",
        "8": "未分派"
      },
      form: {title: '', remarks: '', content: '', userId: ''},
      formRules: {
        userPhone: [{ required: true, message: "用户电话不能为空", trigger: "blur" }],
        userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        content: [{ required: true, message: "反馈内容不能为空", trigger: "blur" }]
      },
			file_change: false,
			config: {
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
    };
  },
  props: ["isShow", "data", "addModifyToggle", "defaultMsg"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    dialogOpen(){
      console.log(111)
			setTimeout(() => {
				$('.v-modal').css('z-index',2000)
			}, 100);
      setTimeout(() => {
				$('.el-dialog__wrapper').css('z-index',2001)
			}, 100);
      
		},
    handleClose() {
      this.$parent.isShow = false
			this.form = {title: '', remarks: '', content: '', userId: ''}
      this.$parent.data = null
      this.$refs.ue.setUEContent('')
		},
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addModifyToggle === "add") {
            this.api_businessManagePlatform_scontentAdd({ 
              data: Object.assign({}, this.form, {
                userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
                userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
                userAccNo: JSON.parse(sessionStorage.getItem('userInfo')).telNo,
                token: sessionStorage.getItem('access_token'),
                code: parseInt(Math.random() * 1000000) + '',
                content: this.$refs.ue.getUEContent()
              }),
            }).then(res => {
              this.handleClose()
              this.$parent.get_static_info()
            })
          } else if (this.addModifyToggle === "modify") {
            // console.log(1)
            // console.log(this.data.scontentId)
            // this.form.scontentId = this.data.scontentId
            this.api_businessManagePlatform_scontentUpd({ 
              data: Object.assign({}, this.form, {
                userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
                userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
                userAccNo: JSON.parse(sessionStorage.getItem('userInfo')).telNo,
                token: sessionStorage.getItem('access_token'),
                code: parseInt(Math.random() * 1000000) + '',
                // scontentId: this.data.scontentId,
                content: this.$refs.ue.getUEContent()
              }),
            }).then(res => {
              this.handleClose()
              this.$parent.get_static_info()
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
				this.form = { ...v }
      }
    },
    defaultMsg(v) {
      if (v) {
        if (this.$refs.ue !== undefined) {
          this.$refs.ue.setUEContent(v)
        }
      }
    }
	}
};
</script>

<style lang="scss" scoped>
.edit-form {
  .textarea_upgTip {
    height: 100px;
    resize: none;
    width: 200px;
	}
	/* 富文本输入框样式 */
	#editor-container {
		line-height: 20px!important;
	}
}
</style>
