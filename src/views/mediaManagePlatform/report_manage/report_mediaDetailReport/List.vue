<template>
  <div class="list tab_list">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
              <EleAreaProvinceCity v-on:selected="provinceSelected"></EleAreaProvinceCity>
            </el-form-item>
            <el-form-item>
              <EleMediaCategory v-on:selected="categorySelected"></EleMediaCategory>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="媒体编号" :maxlength="100" v-model="form.mediaNo" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="媒体名称" :maxlength="100" v-model="form.mediaName" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.mresCate" class="form-input" placeholder="选择广告位位置" clearable>
                  <el-option v-for="(cell,i) in bannerCategoryList" :label="cell.dicName" :value="cell.dicCode" :key='i'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.formId"  class="form-input" placeholder="广告位形式" clearable>
                  <el-option v-for="(cell,i) in formIdList" :label="cell.formName" :value="cell.formId" :key='i'></el-option>
              </el-select>
            </el-form-item>  
            <el-form-item>
              <el-select v-model="form.contractStatus"  class="form-input" placeholder="合约状态" clearable>
                  <el-option value="1" label="合约中" ></el-option>
                  <el-option value="2" label="合约过期"></el-option>
                  <el-option value="3" label="终止合约"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.cooperWay"  class="form-input" placeholder="合作方式" clearable>
                  <el-option value="1" label="分成合作" ></el-option>
                  <el-option value="2" label="租赁合作"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="新增日期"
                    end-placeholder="新增日期"
                    :default-value="defaultValue">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="eTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="生效日期"
                    end-placeholder="生效日期"
                    :default-value="defaultValue">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
            </el-form-item>   
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @onClickBtnDownload="onClickBtnDownload"
      :DataGrid = 'datagrid'></list-data>

  </div>
</template>
<script>
import { EleMediaCategory,EleAreaProvinceCity } from '../../../../components/business/'
import {tool} from '../../../../utils/'
export default {
  components: {
    EleAreaProvinceCity,
    EleMediaCategory
  },
  data(){
    return {
      token: sessionStorage.getItem('access_token'),
      defaultValue: tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),
      time: [],
      eTime: [],
      datagrid: {
        List: [],
        FieldList: [
          { key:'mediaNo', label:'媒体编号',width:100},
          { key: 'cooperNo', label: '合同编号',width:210,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.cooperNo,20)
          }},
          { key: 'contractStatusStr', label: '合同状态'},
          { key: 'cooperWay', label: '合同方式',formatter:function(y,column,cellValue){
             return y.cooperWay === 1 ? '分成合作' :y.cooperWay === 2 ? '租赁合作' :'-'
          }},
          { key: 'mediaName', label: '媒体名称',width:210,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.mediaName,20)
          }},
          { key:'proName', label:'地区',width:210, formatter:function(y,column,cellValue){
            return y.proName +' ' + y.cityName
          }},
          { key: 'addr', label: '详细地址',width:350,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.addr,20)
          }},
          { key:'level', label:'媒体等级', formatter:function(y,column,cellValue){
            return y.level == 1 ? 'A级' : y.level==2? 'B级' : y.level==3 ? 'C级' :'' 
          }},
          { key:'cateName', label:'媒体分类',width:200, formatter:function(y,column,cellValue){
            return y.parCateName +' > '+ y.cateName
          }},
          { key:'busiArea', label:'营业面积（平米）',width:150,formatter:function(y,column,cellValue){
            return  tool.str.twoDecimal(y.busiArea,2)
          }},
          { key:'workDayCusts', label:'人流量（人天）',width:150},
          { key:'averageConsu', label:'人均消费（元）',width:150,formatter:function(y,column,cellValue){
            return  tool.str.twoDecimal(y.averageConsu,2)
          }}, 
          { key:'employeeNum', label:'员工人数',width:100},
          { key:'adFormList', label:'广告位形式',width:250,formatter:function(y,column,cellValue){
            let str = ''
            y.adFormList.map((item,i) => {
              i==0 ? str += item : str += '   、'+ item
            } )
            return  str
          }},
          { key:'adCateList', label:'广告位位置',width:210,formatter:function(y,column,cellValue){
            let str = ''
            y.adCateList.map((item,i) => {
              i==0 ? str += item : str += '   、'+ item
            } )
            return  str
          }},
          { key:'adCount', label:'广告位数量',width:150},
          { key:'contactMan', label:'联系人',width:150},
          { key:'contactTel', label:'联系方式',width:150},
          { key:'createDate', label:'新增日期',width:150,formatter: function( row ) {
            return tool.date.format(row.createDate, "yyyy-MM-dd hh:mm:ss")
          }},
          { key:'effectDate', label:'生效日期',width:150}
        ],
        ToolBar:[
          {text:'导出xls',eventName:'onClickBtnDownload'}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form:{
          regionCode:'',
          mediaCate:'',
          mediaName:'',
          formId:'',
          mediaNo:'',
          contractStatus:'',
          cooperWay:''
      },
      bannerCategoryList: [], //广告位分类
      formIdList: [], //广告位形式
    }
  },
  methods: {
    onClickBtnDownload() {
      if( this.time && this.time.length > 0){
          this.form.dateStart = this.time[0];
          this.form.dateEnd = this.time[1];
      }else{
          this.form.dateStart='';
          this.form.dateEnd='';
      }
      if( this.eTime && this.eTime.length > 0){
          this.form.effectDateStart = this.eTime[0];
          this.form.effectDateEnd = this.eTime[1];
      }else{
          this.form.effectDateStart='';
          this.form.effectDateEnd='';
      }
      const loading = this.$loading({
        lock: true,
        text: '正在提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.api_mediaManagePlatform_mediaDetailDownLoad({
          data:this.form, type:'post', 
          headers:{ ContentType: 'application/x-www-form-urlencoded'}, 
          opts:{responseType: 'blob', downloadOption:'download'}
        }).then(res=>{
          let blob = res, 
              dateTime = this.tool.date.format(new Date(),'yyyyMMdd'),
              down_url = window.URL.createObjectURL(blob),
              a = document.createElement('a');
          a.download = '媒体明细'+dateTime + '.xls' ;
          a.href = down_url;
          $("body").append(a);    
          a.click();
          $(a).remove();
          loading.close();
        }).catch(err=>{
            loading.close();
            this.$message({type:'error',message:'下载失败'});
        })
    },
    provinceSelected(val){
        this.form.regionCode = val;
    },
    categorySelected(val){
        this.form.mediaCate = val;
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      if( this.time && this.time.length > 0){
          this.form.dateStart = this.time[0];
          this.form.dateEnd = this.time[1];
      }else{
          this.form.dateStart='';
          this.form.dateEnd='';
      }
      if( this.eTime && this.eTime.length > 0){
          this.form.effectDateStart = this.eTime[0];
          this.form.effectDateEnd = this.eTime[1];
      }else{
          this.form.effectDateStart='';
          this.form.effectDateEnd='';
      }
      this.api_mediaManagePlatform_mediaDetailReport({data:this.form}).then(res=>{
        this.datagrid.List = res.content=='' ? []  :res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    //获取下拉列表数据： 广告位分类、广告位形式
    getSelList() {
      this.api_mediaManagePlatform_mresCateList({data:{ token: this.token, dicType: "mres_cate" }}).then(res=>{
        this.bannerCategoryList = res.content;
      })  
      this.api_mediaManagePlatform_formList().then(res=>{
        debugger
        this.formIdList = res.content;
      })
    }
  },
  mounted() {
    this.init()
    this.getSelList()
  }
  
}
</script>
<style lang="scss">
.tab_list{
    .el-table__empty-text{
        left:50px !important;
    }
}
</style>