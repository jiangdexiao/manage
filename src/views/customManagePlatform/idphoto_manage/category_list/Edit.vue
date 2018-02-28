<template>
  <div class="edit-form">
      <el-dialog
        title="新增分类"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
                    <el-form-item label="分类名称" prop="sortName">
                        <el-input v-model="form.sortName" placeholder=" 请输入证件照分类名称（限1~20个中文）" :minlength="1" :maxlength="20" style="width:80%"></el-input>
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
export default {
  data() {
    let tool = this.tool;

    const sort_name = (rule,value,callback)=>{
      if(value == undefined || value.trim() == "") {
        callback();
      } else {
        if(/^[\u4E00-\u9FA5]+$/i.test(value.trim())){
          callback()
        }else{
          callback(new Error('只能输入中文'))
        }
      }
    }

    return {
      pageOption: "",
      loading: false,
      form: {
        sortName: ""
      },
      formRules: {
        sortName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {validator:sort_name,trigger:"blur"}
        ]
      }
    };
  },
  props: ["isShow", "data"],
  methods: {
    handleClose() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
      this.clear_param();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.api_customManagePlatform_addsort({
            data: {
              sortName: this.form.sortName
            }
          }).then(res => {
            this.handleClose();
            this.$emit("saveSuccess");
          });
        } else {
          return false;
        }
      });
    },
    clear_param() {
      this.sortName = '';
    },

  },

};
</script>

