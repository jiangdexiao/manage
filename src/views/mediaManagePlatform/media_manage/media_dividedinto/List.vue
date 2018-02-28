<template>
    <div class="list">
      <el-tabs v-model="activeTabName" @tab-click="tabClick">  
        <el-tab-pane label="业绩分成" name="first"></el-tab-pane>
        <el-tab-pane label="下载分成" name="second"></el-tab-pane>
        <el-tab-pane label="注册分成" name="third"></el-tab-pane>
        <el-tab-pane label="租赁模式" name="fourth"></el-tab-pane>
      </el-tabs>

      <div v-if="activeTabName=='first'"> 
         <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="form">
                <el-form-item>
                    <EleAreaProvinceCity v-on:selected="selected"></EleAreaProvinceCity>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.industry" placeholder="请选择行业" clearable >
                        <el-option v-for="(cell,i) in industryList" :value="cell.cateCode" :key='i' :label="cell.cateName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.goodsSort" placeholder="选择商品分类" clearable>
                        <el-option v-for="(cell,i) in goodsSortList" :value="cell.classifyId" :key='i' :label="cell.classifyName" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          @edit="edit"
          @del="del"
          @onClickBtnAdd="onClickBtnAdd"
          @onClickBtnEdit="onClickBtnEdit"
          @onClickBtnDelete="onClickBtnDelete"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
        <Edit :isShow="show_edit_dialog"
        :data="data"
        :mediaOrSalesman="mediaOrSalesman"
        :industryList="industryList"
        :goodsSortList="goodsSortList"
        @success="success"></Edit>
      </div>

      <div v-if="activeTabName=='second'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每下载一个" prop="shareMoney" >
              <el-input :maxlength="5" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              同一台机器重复下载不计算
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
      <div v-if="activeTabName=='third'" class="mg_t40"> 
        <el-form ref="formShare" :model="formShare"  :rules="formRules" label-width="150px" >
          <el-form-item label="每注册一个" prop="shareMoney" >
              <el-input :maxlength="5" v-model="formShare.shareMoney" ></el-input>元
          </el-form-item>
          <el-form-item>
              <p>同一台机器重复注册不计算</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="formerFn" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="save" >保 存</el-button>
        </div>
      </div>
      <div v-if="activeTabName=='fourth'" class="w_450"> 
        <div class="topdiv">
           <p class="color_1">计费方式</p>
           <p>开始计费时间  &nbsp;&nbsp;&nbsp; <b>新增媒体/签约出的签约信息处填写</b></p>
           <p class="psty3 color_1">广告位单价设置（按广告位形式）</p>
        </div>
        <el-form ref="rentForm" :model="rentForm" :rules="formRules" label-width="150px">
              <el-form-item
                  v-for="(items, index) in rentForm.formIdList"
                  :label="items.formName"
                  :key="items.formId"
                  :prop="'formIdList.' + index + '.rent'"
                  :rules="formRules.rent">
                <el-input type="text" :maxlength="7" placeholder="0.00-9999.99" v-model="items.rent">
                    <template slot="append">元/个月</template>
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer mg_l150">
            <el-button @click="resetRent" class="mg_r20">取 消</el-button>
            <el-button type="primary"  @click="saveRent" >保 存</el-button>
        </div>
      </div>

    </div>
</template>

<script>
import EleAreaProvinceCity from '../../../../components/business/EleAreaProvinceCity.vue'
import Edit from './Edit.vue'
export default {
    data() {
        let tool = this.tool
        let rule_shareMoney = function(rule,value,callback){
          if(value.length && !tool.validate.money(value) ){
            callback(new Error('请输入整数或小数（小数最多两位）'))
          }else if(value > 99.99 ){
            callback(new Error('分成金额不能大于 99.99 元'))
          }else{
              callback()
          }
        }
        let rule_rentMoney = function(rule,value,callback){
          if(value.length && !tool.validate.money(value) ){
            callback(new Error('请输入整数或小数（小数最多两位）'))
          }else if(value > 9999.99 ){
            callback(new Error('分成金额不能大于 9999.99 元'))
          }else{
              callback()
          }
        }
        return {
          datagrid:{
            List:[],
            FieldList: [
              { key: 'region', label: '区域',formatter:function(row,column,cellValue){
                if(row.region == '0'){
                    return '全部'
                }else{
                    var pname = row.proName? row.proName +'  /': '  /';
                    var cname = row.cityName? row.cityName : '-';
                    return pname + cname
                }
              }},
              { key: 'industry', label: '行业分类',formatter:function(row,column,cellValue){
                return row.industry === '0' ?'全部':row.cateName
              }},
              { key: 'goodsSort', label: '商品分类',formatter:function(row,column,cellValue){
                return row.goodsSort === '0'?'全部':row.goodsSortName
              }},
              { key: 'splitRatio', label: '分成比',formatter:function(row,column,cellValue){
                return row.splitRatio +'%'
              }},
              { type:'operate',label:'操作',
                condition:function({data}){//自定义列显示  返回null 则显示btns项
                  if( data.divideIntoId == '18DD1B7D04C2A2614EA0A80F437537852277' )
                    return '内置'
                  return null
                },
                btns:[
                  {text:'修改',eventName:'edit',condition:function(row){ return row.divideIntoId != '18DD1B7D04C2A2614EA0A80F437537852277'}},
                  {text:'删除',type:'danger',eventName:'del',condition:function(row){ return row.divideIntoId != '18DD1B7D04C2A2614EA0A80F437537852277' }},
                ]
              }
            ],
            ToolBar:[
              {text:'添加',eventName:'onClickBtnAdd'},
              {text:'修改',eventName:'onClickBtnEdit'},
              {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
            ],
            Pagination:{
              total:0,
              page_size:10,
              current_page:1
            }
          },
          //搜索参数
          form:{
              region: '',
              industry: '',
              goodsSort: ''
          },
            // 媒体分成
          mediaOrSalesman: 1,

          //行业分类
          industryList: [],
          //商品分类
          goodsSortList: [],
          show_edit_dialog:false,
          data:null , //要传递给dialog的编辑对象
          activeTabName:'first',
          formShare:{
            formerShareMoney:'',
            shareMoney:'',
            commissionId:''
          },
          formRules:{
            shareMoney:[
                { validator: rule_shareMoney, trigger: 'change' }
            ],
            rent:[
                { validator: rule_rentMoney, trigger: 'change' }
            ],
          },
          share_type:'',
          rentForm:{
            formIdList:[],
            backFormList:[]
          }
        }
    },
    components:{
        EleAreaProvinceCity,
        Edit
    },
    methods: {
      objDeepCopy (source) {
          let sourceCopy = source instanceof Array ? [] : {};
          for (let item in source) {
              sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
          }
          return sourceCopy;
      },
      saveRent(){
        this.$refs.rentForm.validate((valid) => {
          if (valid) { 
            let data = []
            this.rentForm.formIdList.map((item) => {
              let obj = {
                formId: item.formId,
                rent: this.tool.str.twoDecimal(item.rent,2),
              }
              data.push(obj)
            })
            this.api_mediaManagePlatform_setRent({type:'put', data: { formList: JSON.stringify(data)} }).then(result => {
                  this.$message({type:'success',message:'设置成功'})
                  this.getRentList()
            })
          }
        })
      },
      resetRent() {
        this.rentForm.formIdList  = this.objDeepCopy(this.rentForm.backFormList)
      },
      getRentList() {
        this.api_mediaManagePlatform_formList().then(res=>{
            let data = []
            res.content.map((item) => {
              let obj = {
                formId: item.formId,
                formName: item.formName,
                rent: this.tool.str.twoDecimal(item.rent, 2)
              }
              data.push(obj)
            })
            this.rentForm.formIdList= data
            this.rentForm.backFormList= this.objDeepCopy(data)
        }) 
      },
      tabClick(){
        this.tool.dp.clearData(this.formShare)
        this.tool.dp.clearData(this.form)
        this.rentForm.formIdList = []
        this.rentForm.backFormList = [] 
        if(this.activeTabName=='first'){
          this.init()
        }else if(this.activeTabName=='fourth'){
          this.getRentList()
        }else{
          let data_type = this.activeTabName=='second' ? 1 :2
          this.api_mediaManagePlatform_commInfo({data: {type:  data_type,roleType:1 }}).then(result => {
            this.formShare.shareMoney = result.content.shareMoney===null ? '0.00' :this.tool.str.twoDecimal(result.content.shareMoney,2)
            this.formShare.formerShareMoney = result.content.shareMoney===null ? '0.00' :this.tool.str.twoDecimal(result.content.shareMoney,2)
            this.formShare.commissionId = result.content.commissionId
            this.share_type = result.content==='' ? 'add' :'update'
          })
        }
      },
      save() {
        this.$refs.formShare.validate((valid) => {
          if (valid) {
            let data_type = this.activeTabName=='second' ? 1 :2 ,
                msg =  data_type==1 ?'下载分成设置保存成功' :'注册分成设置保存成功' ;
                this.formShare.shareMoney= this.formShare.shareMoney=='' ? '0.00':this.formShare.shareMoney
            if(this.share_type=='add'){
              this.api_mediaManagePlatform_commissionAdd({type:'post', data: {type: data_type, roleType:1, shareMoney: this.formShare.shareMoney}}).then(result => {
                  this.$message({type:'success',message:msg})
                  this.tabClick()
              })
            }else{
              this.api_mediaManagePlatform_commissionUpdate({type:'post', data: this.formShare}).then(result => {
                  this.$message({type:'success',message:msg})
                  this.tabClick()
              })
            }
          }
        })
      },
      formerFn() {
        this.formShare.shareMoney = this.formShare.formerShareMoney
      },
        success(){
          this.init()
        },
        selected(val){
            this.form.region = val;
        },
        onClickBtnAdd(){
          this.editFunc(null)
        },
        onClickBtnDelete(data){
          if( data.batch.datas.length !== 1){
            this.$message({type:'error',message:'请选择一项'})
            return
          }
           if( data.batch.datas[0].divideIntoId == '18DD1B7D04C2A2614EA0A80F437537852277' ){
            this.$message({type:'error',message:'该条为默认项，不可修改和删除！'})
            return
          }
          this.deleteFunc(data.batch.datas[0].divideIntoId)
        },
        onClickBtnEdit(data){
          if( data.batch.ids.length !== 1){
            this.$message({type:'error',message:'请选择一项'})
            return
          }
          this.editFunc(data.batch.datas[0])
        },
        edit(row){
          this.editFunc(row.data)
        },
        del(row){
          if( row.data.divideIntoId == '18DD1B7D04C2A2614EA0A80F437537852277' ){
            this.$message({type:'error',message:'该条为默认项，不可修改和删除！'})
            return
          }
          this.deleteFunc(row.data.divideIntoId)
        },
        editFunc(row){
          this.data = row
          this.show_edit_dialog = true
        },
        deleteFunc(id){
          this.$confirm('确认删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api_mediaManagePlatform_divide({pathParams:`/${id}`,type:'delete'}).then(res=>{
              this.init()
            })
          }).catch(() => {

          })
        },
        // 获取行业分类列表
        get_industry () {
          this.api_mediaManagePlatform_catePar({data:{token:sessionStorage.getItem('access_token')}}).then(res=>{
            this.industryList = res.content?res.content:[]
          })
        },
        //获取商品分类列表
        get_goodsSort () {
          this.api_sellerManagePlatform_goodsLevel({data:{level:1}}).then(res=>{
            this.goodsSortList = res.content?res.content:[]
          })
        },
        // {type,data,dataIndex,list,btn,btnIndex}
        onChangeCurPage (page) {
          // this.$message('当前页是第' + page + '页')
          this.datagrid.Pagination.current_page = page
          this.init()
        },
        onChangeCurPageSize (pageSize) {
          // this.$message('当前每页显示 ' + pageSize + ' 条')
          this.datagrid.Pagination.page_size  = pageSize
          this.init()
        },
        init() {
          this.api_mediaManagePlatform_divide({
            data:{
              region: this.form.region,
              industry: this.form.industry,
              goodsSort: this.form.goodsSort,
              mediaOrSalesman: this.mediaOrSalesman,
              rows:this.datagrid.Pagination.page_size,
              pageNumber:this.datagrid.Pagination.current_page
            }
          }).then(res=>{
            this.datagrid.List = res.content?res.content:[]
            this.datagrid.Pagination.total = res.totalCount
          })
        }
    },
    mounted() {
      this.get_industry()
      this.get_goodsSort()
      this.init()
    }
}
</script>
<style lang="scss" scoped>
.w_450 {
  width:450px;
}
  .mg_l150 {
    margin-left: 150px;
  }
  .topdiv{
     margin-left: 50px;
     line-height:32px;
     font-size:14px;
  }
  .mg_t40{
    margin-top: 40px;
  }
  .psty3{
    margin: 30px 10px 10px 0;
  }
  .color_1 {
    color: #3a8ee6;
  }
  .mg_r20 {
    margin-right: 20px;
  }
</style>
