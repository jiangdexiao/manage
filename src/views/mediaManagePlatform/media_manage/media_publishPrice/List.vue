<template>
    <div>
      <list-data
        ref='list-data'
        @onClickBtn="onClickBtn"
        @tdClicks="tdClicks"
        @onChangeCurrentPage="onChangeCurPage"
        @onChangePageSize="onChangeCurPageSize"
        :DataGrid = 'datagrid'></list-data>
        <el-dialog :title="optionPage=='add' ? '新增' : '修改'" :visible.sync="add_modify_dialog" @close="handleClose"  label-width="120px" custom-class='dialog'>
            <el-col :span="24">
                <el-form ref="am_form" :model="am_form" :rules="formRules" label-width="100px">
                    <el-form-item label="形式标题" prop="title">
                        <el-input v-model="am_form.title" :maxlength="30" ></el-input>
                    </el-form-item>
                    <el-form-item label="尺寸说明" prop="size">
                        <el-input v-model="am_form.size" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="原价" prop="price">
                        <el-input v-model="am_form.price" :maxlength="7"></el-input>元/天/个
                    </el-form-item>
                     <el-form-item label="政策价" prop="policyPrice">
                        <el-input v-model="am_form.policyPrice" :maxlength="7"></el-input>元/天/个
                    </el-form-item>
                </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="am_form_save" >保 存</el-button>
            </span>
        </el-dialog>
        <Edit :isShow="isShow" :data="data" :cateList="cateList"></Edit>
    </div>
</template>
<script>
import {tool} from '../../../../utils/'
import rules from '../../../../utils/rules/'
import Edit from './Edit.vue'
export default {
  components: {Edit},
  data() {
    return {
    datagrid: {
        List: [],
        FieldList: [
          { key: 'title', label: '形式/标题',width:350, tooltip:true,formatter: function(row) {
            return tool.str.textLength(row.title,20)
          }},
          { key: 'size', label: '尺寸说明'},
          { key: 'price', label: '原价  /元/天/个',formatter: function(row) {
            return  tool.str.twoDecimal(row.price,2)
          }}, 
          { key: 'policyPrice', label: '政策价  /元/天/个',formatter: function(row) {
            return  tool.str.twoDecimal(row.policyPrice,2)
          }}, 
          { key: 'advNumber', label: '广告位数量'},
          { type:'operate',label: '操作', width:260,
            btns:[
                {text:'查看广告位',eventName:'tdClicks',opt:'view'},
                {text:'修改',eventName:'tdClicks',opt:'modify',condition: ( row )=>{
                    if(!row.data.publishPriceId){
                        return false
                    }
                    return true
                }},
                {text:'绑定广告位',eventName:'tdClicks',opt:'binding',condition: ( row )=>{
                    if(!row.data.publishPriceId){
                        return false
                    }
                    return true
                }}
            ]
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtn',opt:'add'},
          {text:'修改',eventName:'onClickBtn',opt:'modify'},
          {text:'查看广告位',eventName:'onClickBtn',opt:'view'},
          {text:'绑定广告位',type:'danger',eventName:'onClickBtn',opt:'binding'},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
    },
    optionPage:'',
    optionRow_id:'',
    //新增和修改窗口
    add_modify_dialog: false,
    am_form:{
        title: '',
        size: '',
        price: '',
        policyPrice: '',
    },
    formRules:{
        title: [
            { required: true,message:'形式/标题至少为2个字符', trigger: 'blur' },
            { min: 2, max: 30, message: '形式/标题至少为2个字符', trigger: 'blur' }
        ],
        size: [
            { required: true,message:'尺寸说明至少为2个字符', trigger: 'blur' },
            { min: 2, max: 30, message: '尺寸说明至少为2个字符', trigger: 'blur' }
        ],
        price: [
            { required: true,validator: rules.rule_money, trigger: 'change' }
        ],
        policyPrice:[
            { validator: rules.rule_money, trigger: 'change' }
        ]
    },
    isShow:false,
    data:null,
    cateList:[],
    }
  },
  methods: {
    handleClose(){
        this.add_modify_dialog=false;
        this.$refs.am_form.resetFields();
        this.tool.dp.clearData(this.am_form)
        this.isShow= false;
        this.tool.dp.clearData(this.v_form)
    },
    //新增修改的验证
    verify_val() {
        if(!this.am_form.price || isNaN(this.am_form.price)){
            this.$message({type:'error',message:'请输入原价，原价为：0-9999.99 的值'})
            return false
        }
        this.am_form.price=parseFloat(this.am_form.price);
        if( this.am_form.price < 0 || this.am_form.price >9999.99 ){
            this.$message({type:'error',message:'原价为：0-9999.99 的值'})
            return false
        }
        if(this.am_form.policyPrice){
            this.am_form.policyPrice=parseFloat(this.am_form.policyPrice);
            if( this.am_form.policyPrice < 0 || this.am_form.policyPrice >9999.99 ){
                this.$message({type:'error',message:'政策价为：0-9999.99 的值'})
                return false
            }
            if( this.am_form.policyPrice > this.am_form.price ){
                this.$message({type:'error',message:'政策价不能大于原价价格'})
                return false
            }
        }
        return true
    },
    //修改保存
    am_form_save(){
        this.$refs.am_form.validate((valid) => {
          if (valid) {
            if(!this.verify_val()) {
                 return false
             }
            let type= this.optionPage==='add'? 'post' : 'put';
            this.am_form.price = this.tool.str.twoDecimal(this.am_form.price,2)
            this.am_form.policyPrice = this.tool.str.twoDecimal(this.am_form.policyPrice,2)
            if(this.optionPage==='add'){
                this.api_common_mediaId({ data:{ prefix: "18PP"} }).then(res=>{
                    this.am_form.publishPriceId = res.content
                    this.api_mediaManagePlatform_publishList({data:this.am_form, type:type}).then(res=>{
                        this.init();
                        this.add_modify_dialog = false
                        this.handleClose()
                    })
                })
            }else{
                this.am_form.publishPriceId = this.optionRow_id;
                this.api_mediaManagePlatform_publishList({data:this.am_form, type:type}).then(res=>{
                    this.init();
                    this.add_modify_dialog = false
                    this.handleClose()
                })
            }
          }else {
            return false;
          }
        })
    },
    tdClicks(opts) {
        let opt = opts.btnInfo.opt 
        if (opt === "add") {
            this.optionPage = opt;
            this.add_modify_dialog= true

        } else if (opt === "modify") {
            this.optionPage = opt;
            this.add_modify_dialog= true
            this.optionRow_id = opts.data.publishPriceId;
            this.tool.dp.assignData(this.am_form, opts.data)

        }else if (opt === "view" || opt === "binding") { 
            this.optionPage = opt;
            this.isShow= true
            this.data = opts.data
            this.data.optionPage = opt
        }
    },
    onClickBtn(opts,selectItems) {
        if( opts.btnInfo.opt!=='add'  && selectItems && selectItems.ids.length !== 1){
            this.$message({type:'error',message:'请选择一项'})
            return
        }else{
            if(opts.btnInfo.opt!=='add' && opts.btnInfo.opt!=='view'  && !selectItems.datas[0].publishPriceId){
                this.$message({type:'error',message:'当前项不能操作'})
                return 
            }
            this.tdClicks({data:selectItems.datas[0],btnInfo:opts.btnInfo} )
        }
    },
    //获取广告位分类  
    getCateList() {
        this.api_mediaManagePlatform_mresCateList({data: {dicType: "mres_cate",token:sessionStorage.getItem('access_token')}}).then(res=>{
          this.cateList = res.content;
        })
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init() {
      let data= {rows : this.datagrid.Pagination.page_size, pageNumber: this.datagrid.Pagination.current_page};
      this.api_mediaManagePlatform_publishList({data:data}).then(res=>{
        this.datagrid.Pagination.total = res.totalCount;
        let last={advNumber :res.content[res.content.length-1],
                  price: '',
                  size:'',
                  title:'剩余未绑定',
                  end:'end'};
        let data = res.content.slice(0,res.content.length-1);
        data.push(last)
        this.datagrid.List = data
      })
    }
  },
  mounted() {
    this.init()
    this.getCateList()
  }
}
</script>