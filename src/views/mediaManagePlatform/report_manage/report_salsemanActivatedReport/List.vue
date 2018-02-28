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
                <el-input placeholder="促销员名/账号" :maxlength="100" v-model="form.salesmanNameOrNo" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="BD员姓名/账号" :maxlength="100" v-model="form.bdNameOrNo" ></el-input>
            </el-form-item> 
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="媒体新增日期"
                    end-placeholder="媒体新增日期"
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
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="cTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="新增促销员日期"
                    end-placeholder="新增促销员日期"
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
import { mapState,mapGetters } from 'vuex'
export default {
  components: {
    EleAreaProvinceCity,
    EleMediaCategory
  },
  data(){
    return {
      moduleId: sessionStorage.getItem('moduleId'),
      token: sessionStorage.getItem('access_token'),
      defaultValue: tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),
      time: [],
      eTime: [],
      cTime: [],
      datagrid: {
        List: [],
        FieldList: [
          { key: 'salesmanName', label: '促销员姓名',width:210,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.salesmanName,20)
          }},
          { key:'salesmanNo', label:'促销员账号',width:120},
          { key:'isActivated', label:'移动端是否激活数据',width:100,formatter:function(y,column,cellValue){
            return y.isActivated==1 ? '是': '否'
          }},
          { key: 'mediaName', label: '所属媒体名称',width:360,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.mediaName,20)
          }},
          { key:'mediaIsActivated', label:'媒体是否激活',width:100,formatter:function(y,column,cellValue){
            return y.mediaIsActivated==1 ? '是': '否'
          }},
          { key:'mediaNo', label:'媒体编号',width:180},
          { key:'cooperNo', label:'合同编号',width:300,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.cooperNo,20)
          }},
          { key:'contractStatusStr', label:'合同状态',width:100},
          { key: 'cooperWay', label: '合同方式',formatter:function(y,column,cellValue){
             return y.cooperWay === 1 ? '分成合作' :y.cooperWay === 2 ? '租赁合作' :'-'
          }},
          { key:'proName', label:'地区',width:210, formatter:function(y,column,cellValue){
            return y.proName +'>' + y.cityName + '>'+ y.areaName
          }},
          { key: 'addr', label: '详细地址',width:320,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.addr,20)
          }},
          { key:'level', label:'媒体等级', formatter:function(y,column,cellValue){
            return y.level == 1 ? 'A级' : y.level==2? 'B级' : y.level==3 ? 'C级' :'' 
          }},
          { key:'cateName', label:'媒体分类',width:200, formatter:function(y,column,cellValue){
            return y.parCateName +' > '+ y.cateName
          }},
          { key:'contactMan', label:'联系人',width:150},
          { key:'contactTel', label:'联系方式',width:120},
          { key:'createDate', label:'媒体新增日期',width:150,formatter: function( row ) {
            return tool.date.format(row.createDate, "yyyy-MM-dd hh:mm:ss")
          }},
          { key:'effectDate', label:'生效日期',width:150},
          { key:'salesmanCreateDate', label:'促销员新增日期',width:150,formatter: function( row ) {
            return tool.date.format(row.salesmanCreateDate, "yyyy-MM-dd hh:mm:ss")
          }}
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
          mediaNo:'',
          contractStatus:'',
          cooperWay:'',
          salesmanNameOrNo:'',
          bdNameOrNo:''
      },
      dataType:{
          type:2 ,
          platformType:''
      }
    }
  },
  computed:{
      ...mapState(['BUSINESS_MANAGE_PLATFORM','MEDIA_MANAGE_PLATFORM','MEDIA_SALE_MANAGE_PLATFORM']),
      ...mapGetters(['getUser'])
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
      if( this.cTime && this.cTime.length > 0){
          this.form.createdDateStart = this.cTime[0];
          this.form.createdDateEnd = this.cTime[1];
      }else{
          this.form.createdDateStart='';
          this.form.createdDateEnd='';
      }
      const loading = this.$loading({
        lock: true,
        text: '正在提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }); 
      this.api_mediaManagePlatform_activatedDownLoad({
          type:'post', 
          data: Object.assign({},this.form,this.dataType), 
          headers:{ ContentType: 'application/x-www-form-urlencoded'}, 
          opts:{responseType: 'blob', downloadOption:'download'}
        }).then(res=>{
          let blob = res, 
              dateTime = this.tool.date.format(new Date(),'yyyyMMdd'),
              down_url = window.URL.createObjectURL(blob),
              a = document.createElement('a');
          a.download = '促销员激活数据'+dateTime + '.xls' ;
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
      if( this.cTime && this.cTime.length > 0){
          this.form.createdDateStart = this.cTime[0];
          this.form.createdDateEnd = this.cTime[1];
      }else{
          this.form.createdDateStart='';
          this.form.createdDateEnd='';
      }
      this.dataType.platformType=''
      if(this.moduleId === this.BUSINESS_MANAGE_PLATFORM || this.moduleId === this.MEDIA_MANAGE_PLATFORM){
          //媒体管理 和 运营平台
          this.dataType.platformType = 1
      }else if(this.moduleId === this.MEDIA_SALE_MANAGE_PLATFORM){
          //媒体行销
          this.dataType.platformType = 2
          this.form.bdLoginNo = this.getUser.userName
      }
      this.api_mediaManagePlatform_activatedList({ data: Object.assign({},this.form,this.dataType) }).then(res=>{
        this.datagrid.List = res.content=='' ? []  :res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted() {
    this.init()
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