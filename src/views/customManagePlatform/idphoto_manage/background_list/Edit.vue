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
                    <el-form-item label="底色名称" prop="colorName">
                        <el-input v-model="form.colorName" placeholder=" 请输入证件照底色名称（限0~10个中文）" :minlength="1" :maxlength="10" style="width:80%"></el-input>
                    </el-form-item>
                    <el-form-item label="底色值" prop="colorValue" >
                        <el-input v-model="form.colorValue" placeholder=" 请输入色值（16进制）" style="width:80%">
                          <template slot="append">
                            <el-color-picker v-model="form.colorValue" size="small"></el-color-picker>
                          </template>
                        </el-input>
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

    const color_name = (rule,value,callback)=>{
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

    const color_value = (rule,value,callback)=>{
      if(value == undefined || value.trim() == "") {
        callback();
      } else {
        if(/^#{1}[0-9a-fA-F]{6}$/i.test(value.trim())){
          callback()
        }else{
          callback(new Error('请输入16进制颜色值,如#0FB3C3'))
        }
      }
    }

    return {
      pageOption: "",
      loading: false,
      color2:"",
      form: {
        colorName: "",
        colorValue:"",
      },
      formRules: {
        colorName: [
          { required: true, message: "请输入底色名称", trigger: "blur" },
          {validator:color_name,trigger:"blur"}
        ],
        colorValue: [
          { required: true, message: "请输入颜色值", trigger: "blur" },
          {validator:color_value,trigger:"blur"}
        ]
      }
    };
  },
  props: ["isShow"],
  methods: {
    handleClose() {
      this.$parent.isShow = false;
      this.$refs.form.resetFields();
      this.clear_param();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.api_customManagePlatform_addcolor({
            data: {
              colorName: this.form.colorName,
              colorValue:this.form.colorValue,
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
      this.colorName = '';
      this.colorValue = '';
    },

  },

};
</script>

