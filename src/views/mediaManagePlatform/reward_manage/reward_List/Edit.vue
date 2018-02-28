<template>
  <div class="edit-form reward_edit">
    <el-dialog
        :title="optionPage=='add'?'创建市场激励':'修改市场激励'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="标题" prop="rewardTitle">
                        <el-input :maxlength="30" v-model="form.rewardTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="有效角色" prop="roleType">
                         <el-select v-model="form.roleType" placeholder="请选择" clearable>
                             <el-option label="媒体" :value="1" ></el-option>
                             <el-option label="BD" :value="2" ></el-option>
                             <el-option label="促销员" :value="3" ></el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item label="预算上限" prop="budgetMoney" >
                        <el-input :maxlength="9" v-model="form.budgetMoney"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <p class="font_red mg_t-10">超过此金额后将自动关闭激励（不含排行奖和满额奖）</p>
                    </el-form-item>
                    <el-form-item label="时间" prop="time">
                        <el-date-picker :editable="false"
                            v-model="form.time"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="新客专享" prop="isNew">
                        <el-radio-group v-model="form.isNew">
                            <el-radio  :label="1">是</el-radio>
                            <el-radio  :label="2">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="满足门槛" prop="condition" >
                        <el-input :maxlength="4" v-model="form.condition"><template slot="append">单</template></el-input>
                    </el-form-item>
                    <el-form-item label="每用户日上限" prop="restrictionMode">
                        <el-radio-group v-model="form.restrictionMode" @change="restrictionMode_change">
                            <el-radio  :label="1">按订单数</el-radio>
                            <el-radio  :label="2">按金额数</el-radio>
                        </el-radio-group><br>
                        <el-form-item v-if="form.restrictionMode==1" prop="limitParam">
                            <el-input :maxlength="3" v-model="form.limitParam"><template slot="append">个</template></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.restrictionMode==2" prop="limitParamMoney">
                            <el-input :maxlength="8" v-model="form.limitParamMoney"><template slot="append">元</template></el-input>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="激励方式" prop="rewardType">
                        <el-radio-group v-model="form.rewardType" @change="rewardType_change">
                            <el-radio  :label="1">按成交比</el-radio>
                            <el-radio  :label="2">按固定额度</el-radio>
                        </el-radio-group><br>
                        <el-form-item v-if="form.rewardType==1" prop="rewardParam">
                            <el-input :maxlength="5" v-model="form.rewardParam"><template slot="append">%</template></el-input>
                        </el-form-item>
                        <el-form-item v-if="form.rewardType==2" prop="rewardParamMoney">
                            <el-input :maxlength="5" v-model="form.rewardParamMoney"><template slot="append">元/单</template></el-input>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="是否有排名奖" prop="havaRanking">
                        <el-radio-group v-model="form.havaRanking" @change="havaRanking_change">
                            <el-radio  :label="1">有</el-radio>
                            <el-radio  :label="2">无</el-radio>
                        </el-radio-group><br>
                        <el-form-item v-if="form.havaRanking==1"  prop="rankingType">
                            <el-radio-group v-model="form.rankingType" @change="rankingType_change">
                                <el-radio  :label="1">按固定额度</el-radio>
                                <el-radio  :label="2">按成交比</el-radio>
                                <el-radio  :label="3">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form-item>
                    <div v-if="form.havaRanking==1 && form.rankingType==1"  class="mg_t-10">
                        <el-form-item v-for="(items, index) in form.rankingList" :key="index" class="mg_b10">
                            <el-form-item label="第" :prop="'rankingList.' + index + '.params1'" :rules="formRules.one" label-width="20px" class="lab_sty1">
                                <el-input :maxlength="4" v-model="items.params1" class="input_70"></el-input>
                            </el-form-item>
                            <el-form-item label="到" :prop="'rankingList.' + index + '.params2'" :rules="formRules.to" label-width="20px" class="lab_sty1">
                                <el-input :maxlength="4" v-model="items.params2" class="input_70"></el-input>名
                            </el-form-item>
                            <el-form-item label="奖励" :prop="'rankingList.' + index + '.rewardMoney'" :rules="formRules.money" label-width="80px" class="lab_sty1">
                                <el-input :maxlength="7" v-model="items.rewardMoney" class="input_170"></el-input>元
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <p class="font_red">*活动结束后 + 1天统一自动结算</p>
                        </el-form-item>
                    </div>
                    <div v-if="form.havaRanking==1 && form.rankingType==2"  class="mg_t-10">
                        <el-form-item v-for="(items, index) in form.rankingList" :key="index" class="mg_b10">
                            <el-form-item label="第" :prop="'rankingList.' + index + '.params1'" :rules="formRules.one" label-width="20px" class="lab_sty1">
                                <el-input :maxlength="4" v-model="items.params1" class="input_70"></el-input>
                            </el-form-item>
                            <el-form-item label="到" :prop="'rankingList.' + index + '.params2'" :rules="formRules.to" label-width="20px" class="lab_sty1">
                                <el-input :maxlength="4" v-model="items.params2" class="input_70"></el-input>名
                            </el-form-item>
                            <el-form-item label="奖励" :prop="'rankingList.' + index + '.rewardMoney'" :rules="formRules.ratio" label-width="80px" class="lab_sty1">
                                <el-input :maxlength="5" v-model="items.rewardMoney" class="input_170"></el-input>%
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <p class="font_red">*对活动时间内的已奖励有效订单成交额的比例活动结束后 + 1天统一自动结算</p>
                        </el-form-item>
                    </div>
                    <div v-if="form.havaRanking==1 && form.rankingType==3">
                        <el-form-item>
                            <el-input type="textarea" :maxlength="200" v-model="form.rankingParams" placeholder="请输入奖励说明"></el-input>
                            <p class="font_red">*仅做备注用，不涉及线上资金流转</p>
                        </el-form-item>
                    </div>
                    <el-form-item label="是否有满额奖" prop="haveFull">
                        <el-radio-group v-model="form.haveFull" @change="haveFull_change">
                            <el-radio  :label="1">有</el-radio>
                            <el-radio  :label="2">无</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="form.haveFull==1" class="mg_t-10">
                        <el-form-item v-for="(items, index) in form.fullList" :key="index" class="mg_b10">  
                            <el-form-item label="满" :prop="'fullList.' + index + '.fullMoney'" :rules="formRules.fullMoney" label-width="20px" class="lab_sty1">
                                <el-input :maxlength="10" v-model="items.fullMoney" class="input_126"></el-input>元交易额
                            </el-form-item>
                            <el-form-item label="奖励" :prop="'fullList.' + index + '.rewardMoney'" :rules="formRules.fullRewardMoney" label-width="82px" class="lab_sty1">
                                <el-input :maxlength="8" v-model="items.rewardMoney" class="input_170"></el-input>元
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <p class="font_red">*订单交易额 满额后 +1 天统一自动结算</p>
                        </el-form-item>
                    </div>
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
import rules from '../../../../utils/rules/'
import { mapGetters } from 'vuex'
export default {
    data() {
        let _this = this
        let tool = this.tool
        const rule_numOnly = function(rule,value,callback){
          if(rule.msg && !value && value!='0'){
              let msgs = rule.msg +'不能为空'
              callback(new Error(msgs))
          }else if( value && value!='0' && !tool.validate.numOnly(value) ){
            callback(new Error('请输入整数'))
          }else if(rule.msg && rule.minVal && parseFloat(value)< rule.minVal){
              callback(new Error(rule.msg+'不能小于'+ rule.minVal+rule.unit))
          }else{
              callback()
          }
        }
        const rule_twoDecimal = function(rule,value,callback){
          if(rule.msg && !value && value!='0'){
              let msgs = rule.msg +'不能为空'
              callback(new Error(msgs))
          }else if(value && !tool.validate.money(value) ){
            callback(new Error('请输入整数或小数（小数最多两位）'))
          }else if(parseFloat(value)>rule.maxVal){
            callback(new Error( rule.msg +'不能大于'+rule.maxVal + rule.unit))
          }else if(rule.minVal && parseFloat(value)<rule.minVal){
            callback(new Error( rule.msg +'不能小于'+rule.minVal + rule.unit))
          }else{
              callback()
          }
        }
        return {
            formRules:{
                rewardTitle:[
                    { required: true,message:'标题不能为空', trigger: 'blur' },
                    { min: 2, max: 30, message: '标题最少两个字符', trigger: 'blur' }
                ],
                roleType:[
                    { required: true,message: '有效角色不能为空', trigger: 'change' }
                ],
                budgetMoney:[
                    { required: true,validator: rule_twoDecimal, msg: '预算上限', maxVal:999999, unit:'元', trigger: 'change' }
                ],
                time:[
                    {  required: true,message: '时间不能为空', trigger: 'change' }
                ],
                isNew: [
                    { required: true, message: '请选择新客专享', trigger: 'change' }
                ],
                condition:[
                    { required: true, validator: rule_numOnly, msg: '满足门槛',trigger: 'change', minVal:1, unit:'单',}
                ],
                restrictionMode: [
                    { required: true, message: '请选择每用户日上限', trigger: 'change' }
                ],
                limitParam:[
                    { validator: rule_numOnly, msg: '订单数',trigger: 'change', minVal:1, unit:'单', }
                ],
                limitParamMoney:[
                    { validator: rule_twoDecimal, msg: '固定额度',minVal:1, maxVal:99999, unit:'元', trigger: 'change' }
                ],
                rewardType:[
                    { required: true, message: '请选择激励方式', trigger: 'change' }
                ],
                rewardParam:[
                    { validator: rule_twoDecimal, msg: '激励方式的比例',minVal:0.01, maxVal:49.99, unit:'%', trigger: 'change' }
                ],
                rewardParamMoney:[
                    { validator: rule_twoDecimal, msg: '激励方式的固定额度',minVal:0.01, maxVal:99.99, unit:'元', trigger: 'change' }
                ],
                havaRanking:[
                    { required: true, message: '请选择是否有排名奖', trigger: 'change' }
                ],
                rankingType:[
                    { required: true, message: '请选择排名奖的方式', trigger: 'change' }
                ],
                one:[
                    { validator: rule_numOnly, msg: '名次',trigger: 'change'}
                ],
                to:[
                    { validator: rule_numOnly, msg: '名次',trigger: 'change'}
                ],
                money:[
                    { validator: rule_twoDecimal, msg: '奖励金额', maxVal:9999.99, unit:'元', trigger: 'change' }
                ],
                ratio:[
                    { validator: rule_twoDecimal, msg: '奖励比例', maxVal:49.99, unit:'%', trigger: 'change' }
                ],
                haveFull:[
                    { required: true, message: '请选择是否有满额奖', trigger: 'change' }
                ],
                fullMoney:[
                    { validator: rule_twoDecimal, msg: '交易额', maxVal:9999999, unit:'元', trigger: 'change' }
                ],
                fullRewardMoney:[
                    { validator: rule_twoDecimal, msg: '奖励金额', maxVal:99999, unit:'元', trigger: 'change' }
                ], 
            },
            form: {
                rewardId:'',
                rewardTitle:'',
                roleType:'',
                budgetMoney:'',
                isNew:'',
                condition:'',
                restrictionMode:'',
                limitParam:'',
                limitParamMoney:'',
                rewardType:'',
                rewardParam:'',
                rewardParamMoney:'',
                havaRanking:'',
                rankingType:'',
                haveFull:'',
                time:[],
                rankingParams:'',

                rankingList:[],
                fullList:[],
            },
            optionPage:'add',
            loading:false,
             // 手机号保存坚持参数
            add_iphone: '',

        }
    },
    computed:{
      ...mapGetters(['getUser'])
    },
    props:['isShow','data'],
    methods: {
        verify_val() {
            if(this.form.havaRanking==1 && this.form.rankingType!=3){
                if(!this.for_verifyFn()){
                    return false
                }
            }
            if( new Date(this.form.time[1]).getTime() < new Date().getTime()){
                this.$message({type:'error',message:'结束时间不能小于当前时间!'});
                return false
            }
            return true
        },
        for_verifyFn(){
            let arr = this.form.rankingList, bool=true; 
            let j, val1, val2, money; 
            for(let i=0; i < arr.length; i++){ 
                j = i; val1 = parseFloat(arr[i].params1), val2=parseFloat(arr[i].params2), money=parseFloat(arr[i].rewardMoney);
                if(val1>val2){
                    bool= false
                    this.$message({type:'error',message:'请输入正确的排名!'});
                    return 
                } 
                if(val1==0 && val2>0){
                    bool= false
                    this.$message({type:'error',message:'请输入正确的排名!'});
                    return 
                } 
                if(val1==0 && val2==0 && money>0){
                    bool= false
                    this.$message({type:'error',message:'请输入正确的排名和奖励!'});
                    return 
                } 
                if(val1!=0 && val2!=0 && (val1<val2 || val1==val2)){
                    while(--j > -1){ 
                        if(this.ranking_verify(val1,arr[j].params1,arr[j].params2)){
                            bool= false
                            this.$message({type:'error',message:'请输入正确的排名!'});
                            break;
                        }
                        if(this.ranking_verify(val2,arr[j].params1,arr[j].params2)){
                            bool= false
                            this.$message({type:'error',message:'请输入正确的排名!'});
                            break;
                        }
                    }
                }
            }
            return bool
        },
        ranking_verify(str,m,n){
            let re = /(\d+)/g;
            while(re.exec(str))
            {
                let int = parseInt(RegExp.$1);
                if(int <m || int> n)return false;
            }
            return true;
        },  
        save() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (!this.verify_val()) {
                        return false;
                    }
                    let r_p = (this.form.havaRanking==1&&this.form.rankingType!=3)?JSON.stringify(this.form.rankingList)
                                    :(this.form.havaRanking==1&&this.form.rankingType==3)? this.form.rankingParams:'';
                    let datas = Object.assign({}, this.form, {
                        userId:this.getUser.userId,
                        rankingParams: r_p,
                        fullParams: this.form.haveFull==1?JSON.stringify(this.form.fullList):'',
                        startTime: this.form.time[0],
                        endTime:this.form.time[1],
                        limitParam: this.form.restrictionMode==1? this.form.limitParam: this.form.limitParamMoney,
                        rewardParam: this.form.rewardType==1? this.form.rewardParam:this.form.rewardParamMoney
                    })
                    delete datas.fullList
                    delete datas.rankingList
                    delete datas.time
                    if(this.optionPage=='add'){  
                        this.api_common_mediaId({ data:{ prefix:'18RW' } }).then(res=>{
                            datas.rewardId = res.content
                            this.api_mediaManagePlatform_rewardAdd({data:datas,type:'post'}).then(res=>{
                                this.handleClose()
                                this.$emit('saveSuccess')
                            }).catch((res) => {
                            })
                        })
                    }else{
                        this.api_mediaManagePlatform_rewardUpdate({data:datas, type:'post'}).then(res=>{
                            this.handleClose()
                            this.$emit('saveSuccess')  
                        })
                    }
                } else {
                    return false;
                }
            })
        },
        rewardType_change(){
            if(this.form.rewardType==1){
                this.form.rewardParam= '0.00'
                this.form.rewardParamMoney= '0.01'
            }else{
                this.form.rewardParamMoney= '0.00'
                this.form.rewardParam= '0.01'
            }   
        },
        restrictionMode_change(){
            this.form.limitParamMoney='0.00'
            this.form.limitParam = 1
        },
        havaRanking_change(){
            if(this.form.havaRanking==2){
                this.form.rankingParams=''
            }
            this.getformList(2)
            this.form.rankingType=1
        },
        rankingType_change(){
            if(this.form.rankingType!=3){
                this.form.rankingParams = ''
            }
            this.getformList(2)
        },
        haveFull_change(){
            this.getformList(1)
        },
        getformList(opt) {
            if(opt===1 || opt===3){
                this.form.fullList=[]
                for(let i=0; i<5; i++){
                    let obj={fullMoney:'0.00',rewardMoney:'0.00'}
                    this.form.fullList.push(obj)
                }
            } 
            if(opt===2 || opt===3){
                this.form.rankingList=[] 
                for(let i=0; i<3; i++){
                    let p={params1:'0',params2:'0',rewardMoney:'0.00'}
                    this.form.rankingList.push(p)
                }
            }
        },
        handleClose(){
            this.$parent.isShow = false;
            this.$refs.form.resetFields();
            this.clear_param()
        },
        clear_param() {
            this.tool.dp.clearData(this.form)
        },
        getformInfo(){ 
            this.form.time=[]
            this.api_mediaManagePlatform_rewardInfo({data:{rewardId: this.data.rewardId}}).then(res=>{
                this.tool.dp.assignData(this.form, res.content)
                this.form.rankingList = res.content.rankingList.length ? res.content.rankingList:[]
                this.form.fullList = res.content.fullList.length ? res.content.fullList:[]
                this.form.rankingParams= res.content.rankingType==3 ? res.content.rankingParams:''
                this.form.time.push(this.tool.date.format(res.content.startTime, "yyyy-MM-dd hh:mm:ss"))
                this.form.time.push(this.tool.date.format(res.content.endTime, "yyyy-MM-dd hh:mm:ss"))
                this.form.limitParam = res.content.restrictionMode==1? res.content.limitParam:res.content.restrictionMode==2? '1':''
                this.form.limitParamMoney= res.content.restrictionMode==2? this.tool.str.twoDecimal(res.content.limitParam,2) :res.content.restrictionMode==1? '0.00':''
                this.form.rewardParam= res.content.rewardType==1? res.content.rewardParam : res.content.rewardType==2?'0.00':''
                this.form.rewardParamMoney= res.content.rewardType==2? this.tool.str.twoDecimal(res.content.rewardParam,2):res.content.rewardType==1?'0.00':''
            })
        }
    },
    watch: {
        isShow(v){
            if(!v) {return false}
            if(v && !this.data ) {
                this.optionPage= 'add';
                this.form.condition= 1   
                this.getformList(3)
                return false
            };
            this.optionPage= 'edit';
            this.getformInfo()
            this.$parent.isShow = v
        }

    }
}
</script>
<style lang="scss" >
.reward_edit {
    .lab_sty1 {
        float: left;
        label {
            line-height: 54px;
        }
    }
    .input_70 {
        width: 70px !important;
    }
    .input_170{
        width: 170px !important;
    }
    .input_126{
        width: 126px !important;
    }
    .mg_b10{
        margin-bottom:10px; 
    }
    .el-form-item__error{
        padding-top: 0px;
    }
}
.font_red {
    color: red;
}
.mg_t-10{
    margin-top: -10px;
}
.el-button--mini{
    padding: 7px 15px !important;
}
</style>