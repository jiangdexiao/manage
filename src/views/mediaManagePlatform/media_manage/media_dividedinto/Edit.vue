<template>
  <div class="edit-form">
      <el-dialog
        title="编辑媒体分成"
        custom-class='dialog'
        :visible.sync="show_eidt_dialog"
        :close-on-click-modal="false"
        @close="handleClose">
            <el-col :span="24" >
                <el-form ref="form" label-width="100px" :model="form" :rules="formRules">
                    <el-form-item label="区域" prop="region">
                        <EleAreaProvinceCity :selectVal="areas" @selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCity>
                    </el-form-item>
                    <el-form-item label="行业分类">
                        <el-select v-model="form.industry" placeholder="请选择行业" clearable >
                            <el-option v-for="(cell,i) in industryList" :value="cell.cateCode" :key='i' :label="cell.cateName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-select v-model="form.goodsSort" placeholder="选择商品分类" clearable>
                            <el-option v-for="(cell,i) in goodsSortList" :value="cell.classifyId" :key='i' :label="cell.classifyName" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分成比" prop="splitRatio">
                        <el-input type="text"  @keyup.native="form.splitRatio=form.splitRatio.replace(/[^\d.]/g,'')"  :maxlength="6" placeholder="输入0.0001 - 10的值" v-model="form.splitRatio">
                            <template slot="append">%</template>
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
import { EleAreaProvinceCity } from '../../../../components/business/'
import { mapState } from 'vuex'
export default {
  components:{EleAreaProvinceCity},
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
          show_eidt_dialog:false,
          form:{
              industry: '', 
              goodsSort: '', 
              region: '', 
              splitRatio: '',
              goodsSortName:''
            },
            formRules:{
                splitRatio: [
                    { required: true,message:'请输入分成比', trigger: 'blur' },
                ],
                region:[
                    {validator: rule_region,trigger:'change'}
                ],
            },
          areas:[],
          regions:[]
      }
  },
  props:{
      isShow:{
          type:Boolean
      },
      data:{
          type:Object
      },
      industryList:{
          type:Array
      },
      goodsSortList:{
          type:Array
      },
      mediaOrSalesman:{
          type:Number
      }
  },
  computed:{
      ...mapState(['prefix_18DD'])
  },
  methods:{
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
        this.show_eidt_dialog = false
        this.$parent.show_edit_dialog = false;
        this.$refs.form.resetFields();
    },
    validate(){
        if(this.form.region =='' && this.form.industry =='' && this.form.goodsSort ==''){
            this.$message({type:'error',message:'区域/行业/商品分类：最少选择一个'})
            return false
        }
        if(this.form.region !='' && this.form.industry =='' && this.form.goodsSort !=''){
            this.$message({type:'error',message:'不支持区域和商品分类进行组合'})
            return false
        }
        if(this.form.splitRatio && this.form.splitRatio!='0'){  
            var num = this.form.splitRatio;
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
            if (!valid) {return}
            if(this.validate()){
                if( this.form.goodsSort ){
                    let good  = this.goodsSortList.find(p=>p.classifyId == this.form.goodsSort)
                    if( good ) 
                        this.form.goodsSortName = good.classifyName 
                    else 
                        this.form.goodsSortName =''
                }
                if( this.data ){
                    this.api_mediaManagePlatform_divide({
                        data:Object.assign( {}, this.form, {divideIntoId: this.data.divideIntoId, mediaOrSalesman: this.mediaOrSalesman }),
                        type:'put'
                    }).then(result=>{
                        this.$emit('success')
                        this.handleClose()
                    })
                }else{
                    this.api_common_mediaId({data:{prefix:this.prefix_18DD}}).then(res=>{
                        this.api_mediaManagePlatform_divide({
                            data:Object.assign( {}, this.form, {divideIntoId: res.content,mediaOrSalesman: this.mediaOrSalesman }),
                            type:'post'
                        }).then(result=>{
                            this.$emit('success')
                            this.handleClose()
                        })
                    })
                }
            }
        })
    }
  },
  watch:{
      isShow(v){
          this.show_eidt_dialog = v
          if( v ){
              if( this.data ){
                  this.form.region = this.data.region
                  this.form.industry = this.data.industry&&this.data.industry!=='0'?this.data.industry:''
                  this.form.goodsSort = this.data.goodsSort&&this.data.goodsSort!=='0'?this.data.goodsSort:''
                  this.form.splitRatio = this.data.splitRatio?this.data.splitRatio:''
                  if( this.data.proCode )
                    this.areas.push(this.data.proCode)
                  if( this.data.cityCode )
                    this.areas.push(this.data.cityCode)
              }
          }else{
              this.form.region = ''
              this.form.industry = ''
              this.form.goodsSort = ''
              this.form.splitRatio = ''
              this.form.goodsSortName=''
              this.areas = []
          }
      }
  }
}
</script>

