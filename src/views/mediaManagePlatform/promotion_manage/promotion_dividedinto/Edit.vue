<template>
  <div class="edit-form">
      <el-dialog
        :title="optionPage=='add'?'新增':'修改'"
        custom-class='dialog'
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" :model="form" :rules="formRules"  label-width="120px">
                    <el-form-item label="区域"  prop="region">
                        <EleAreaProvinceCity :selectVal="areas" v-on:selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCity>
                    </el-form-item>
                    <el-form-item label="媒体分类" prop="industry">
                        <el-select v-model="form.industry" placeholder="请选择" clearable>
                            <el-option
                            v-for="(item,i) in cateList"
                            :key="i"
                            :label="item.cateName"
                            :value="item.cateCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goodsSort">
                        <el-select v-model="form.goodsSort" @change="goodsSort_call" placeholder="请选择" clearable>
                            <el-option
                            v-for="(item,i) in goodsSortList"
                            :key="i"
                            :label="item.classifyName"
                            :value="item.classifyId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分成比" prop="splitRatio">
                        <el-input v-model="form.splitRatio" :maxlength="6" ></el-input>%
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
import { EleAreaProvinceCity } from '../../../../components/business/'
import { mapState } from 'vuex'
export default {
  components:{ EleAreaProvinceCity},
  data(){
      let _this = this
      const rule_region = function(rule,value,callback){
          if(_this.regions[0] && !_this.form.region){
            callback(new Error('区域：请选择到市级'))
          }else{
              callback()
          }
      }
      return{
        form:{
            divideIntoId:'',
            region: 0,
            industry: '',
            goodsSort: '',
            goodsSortName: '', 
            splitRatio: ''
        },
        formRules:{
            splitRatio: [
                { required: true,message:'请输入分成比', trigger: 'blur' },
            ],
            region:[
                {validator: rule_region,trigger:'change'}
            ],
        },
        mediaOrSalesman:2,
        //当前操作 新增add/修改modify
        optionPage:'add',
        areas:[],
        regions:[],

      }
  },
  props:['isShow','data','goodsSortList','cateList'],
  computed:{
      ...mapState(['prefix_18DD'])
  },
  methods:{
    goodsSort_call(val){
        let selitem = this.goodsSortList.find(p => p.classifyId==val) 
        this.form.goodsSortName = selitem.classifyName
    },
    EleAreaProvinceCity_CallBack(val,length){
        if(length==2){
            this.form.region = val
            this.regions[1] = val
        }else{
            this.regions = []
            this.regions[0] = val
            this.form.region =''
        }
    },
    handleClose(){
        this.$parent.isShow = false;
        this.$refs.form.resetFields();
        this.clear_param()
    },
    verify_val() {
        // 区域行业商品分类的判断   region  industry goodsSort
        if(this.form.region =='' && this.form.industry =='' && this.form.goodsSort ==''){
            this.$message({type:'error',message:'区域/行业/商品分类：最少选择一个'})
                return false
        }
        if(this.form.region !='' && this.form.industry =='' && this.form.goodsSort !=''){
            this.$message({type:'error',message:'不支持区域和商品分类进行组合'})
                return false
        } 
        if(this.form.splitRatio ===''){
            this.$message({type:'error',message:'分成比不能为空，可为0，或 0.0001 - 10 的值'})
            return false
        }
        if(this.form.splitRatio && this.form.splitRatio!='0'){  
            let num = this.form.splitRatio;
            if(isNaN(num)){
                this.$message({type:'error',message:'请输入正确的格式，分成比：0.0001 - 10 的值'})
                return false
            }
            this.form.splitRatio=parseFloat(num);
            if(this.form.splitRatio!==0){
                if( this.form.splitRatio < 0.0001 || this.form.splitRatio >10 ){
                this.$message({type:'error',message:'分成比：0.0001 - 10 的值'})
                return false
                }
            }
        }
        return true 
    },
    save(){
        this.$refs.form.validate((valid) => {
          if (valid) {
              if (!this.verify_val()) {
                return false;
              }
              if(this.optionPage=='add'){  
                this.api_common_mediaId({ data:{ prefix:this.prefix_18DD } }).then(res=>{
                    this.form.divideIntoId = res.content
                    this.form.mediaOrSalesman= this.mediaOrSalesman
                    this.api_mediaManagePlatform_divide({data:this.form,type:'post'}).then(res=>{
                        this.handleClose()
                        this.$emit('saveSuccess')
                    })
                })
              }else{
                this.form.mediaOrSalesman= this.mediaOrSalesman
                this.api_mediaManagePlatform_divide({data:this.form, type:'put'}).then(res=>{
                    this.handleClose()
                    this.$emit('saveSuccess')
                })
              }
          } else {
            return false;
          }
        })
    },
    clear_param() {
        this.areas= [];this.regions=[]; this.clearData(this.form)
    },
    // 清除数据  
    clearData(obj) {
      for (let pro in obj) {
        if(obj[pro] instanceof Array){
          obj[pro] = [];
        }else {
          obj[pro] = "";
        }
      }
    },
    //参数赋值
    parama_Fn(list, datalist) {
      for (let key in list) {
        if (datalist[key]) {
          list[key] = datalist[key];
        } else {
          list[key] = "";
        }
      }
      return list;
    },
  },
  watch:{
      isShow(v){
        if( !v || !this.data ) {
            this.optionPage= 'add';
            return false
        };
        this.clear_param();
        this.optionPage= 'modify';
        this.parama_Fn(this.form, this.data)
        let c = this.data;
        this.form.industry = c.industry&&c.industry!=='0'?c.industry:''
        this.form.goodsSort = c.goodsSort&&c.goodsSort!=='0'?c.goodsSort:''
        if( c.proCode ){
            this.areas.push(c.proCode)
        }
        if( c.cityCode ){
            this.areas.push(c.cityCode)
        }
        if( c.areaCode ){
            this.areas.push(c.areaCode)
        }
        this.$parent.isShow = v
      },
  }
}
</script>

