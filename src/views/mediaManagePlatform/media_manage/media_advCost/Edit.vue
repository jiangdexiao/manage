<template>
  <div class="edit-form">
    <el-dialog
        title="修改"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="广告位形式" >
                        <p>{{form.formName}}</p>
                    </el-form-item>
                    <el-form-item label="广告位尺寸" >
                        <p>{{form.advSize}}</p>
                    </el-form-item>
                    <el-form-item label="固定框架成本" prop="advFrameCost">
                        <el-input :maxlength="7" v-model="form.advFrameCost"><template slot="append">元/个</template></el-input>
                    </el-form-item>
                    <el-form-item label="海报制作成本" prop="advProductionCost">
                        <el-input :maxlength="7" v-model="form.advProductionCost"><template slot="append">元/次</template></el-input>
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
import rules from '../../../../utils/rules/'
export default {
    data() {
        let tool = this.tool
        const rule_twoDecimal = function(rule,value,callback){
          if(rule.msg && !value && value!='0'){
              let msgs = rule.msg +'不能为空'
              callback(new Error(msgs))
          }else if(value && !tool.validate.money(value) ){
            callback(new Error('请输入整数或小数（小数最多两位）'))
          }else if(value>rule.maxVal){
            callback(new Error( rule.msg +'不能大于'+rule.maxVal + rule.unit))
          }else{
              callback()
          }
        }
        return {
            formRules:{
                advFrameCost:[
                    { validator: rule_twoDecimal, msg: '固定框架成本', maxVal:9999.99, unit:'元', trigger: 'change' }
                ],
                advProductionCost:[
                    { validator: rule_twoDecimal, msg: '海报制作成本', maxVal:9999.99, unit:'元', trigger: 'change' }
                ],
            },
            form: {
                costId:'',
                formName:'',
                advSize:'',
                advFrameCost:'',
                advProductionCost:'',
            }
        }
    },
    props:['isShow','data'],
    methods: {
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let datas = {
                        costId: this.form.costId,
                        advFrameCost: this.form.advFrameCost,
                        advProductionCost: this.form.advProductionCost
                    }
                    this.api_mediaManagePlatform_advCost({data:datas, type:'put'}).then(res=>{
                        this.handleClose()
                        this.$emit('saveSuccess')  
                    })
                } else {
                    return false
                }
            })
        },
        handleClose(){
            this.$parent.isShow = false;
            this.$refs.form.resetFields();
            this.clear_param()
        },
        clear_param() {
            this.tool.dp.clearData(this.form)
        },
    },
    watch: {
        isShow(v){
            if( !v || !this.data ) {
                return false
            };
            this.tool.dp.assignData(this.form, this.data)
            this.form.advFrameCost= this.tool.str.twoDecimal(this.form.advFrameCost,2) 
            this.form.advProductionCost =this.tool.str.twoDecimal(this.form.advProductionCost,2) 
            this.$parent.isShow = v
        }
    }
}
</script>
