<template>
  <div class="list tab_list">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input placeholder="下单用户名/账号" :maxlength="100" v-model="form.userMessage" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="订单号" :maxlength="100" v-model="form.orderId" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.payStatus"  class="form-input" placeholder="选择支付状态" clearable>
                  <el-option label="已支付" value="1"></el-option>
                  <el-option label="待支付" value="0"></el-option>
                  <el-option label="已取消" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.payWay"  class="form-input" placeholder="选择支付方式" clearable>
                  <el-option label="微信" value="2"></el-option>
                  <el-option label="支付宝" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.afterSellOrderType"  class="form-input" placeholder="选择售后方式" clearable>
                  <el-option label="仅退款" value="2"></el-option>
                  <el-option label="退货退款" value="1"></el-option>
                  <el-option label="换货" value="0"></el-option>
              </el-select>
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
                <el-input placeholder="广告位条码" :maxlength="100" v-model="form.mresNo" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商品名/商品SKU" :maxlength="100" v-model="form.goodsMessage" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家名" :maxlength="100" v-model="form.dealerName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="下单日期"
                    end-placeholder="下单日期"
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
import { EleMediaCategory } from '../../../../components/business/'
import {tool} from '../../../../utils/'
export default {
  components: { EleMediaCategory},
  data(){
    return {
      token: sessionStorage.getItem('access_token'),
      defaultValue: tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'),
      time: [],
      datagrid: {
        List: [],
        FieldList: [
          { key:'orderId', label:'订单号',width:200},
          { key:'userMessage', label:'下单用户',width:360,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.userMessage,20)
          }},
          { key:'payStatus', label:'支付状态',width:80},
          { key:'payWay', label:'支付方式',width:80,formatter:function(row,column,cellValue){
             return row.payWay===''?'-':row.payWay
          }},
          { key: 'afterSellOrderType', label: '售后方式',width:80},
          { key: 'mediaName', label: '来源媒体',width:360,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.mediaName,20)
          }},
          { key:'mediaNo', label:'媒体编号',width:150},
          { key:'mediaCate', label:'媒体分类', width:200},
          { key:'level', label:'媒体等级', width:80},
          { key:'mresNo', label:'广告位条码', width:200},
          { key:'mresCate', label:'广告位位置', width:200},
          { key:'formId', label:'广告位形式', width:200},
          { key:'goodsName', label:'购买商品', width:360,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.goodsName,20)
          }},
          { key:'skuId', label:'商品SKU编号', width:200},
          { key:'dealerName', label:'来源商家', width:200},
          { key:'sellNum', label:'下单数量', width:120},  
          { key:'orderMoney', label:'支付金额', width:120},
          { key:'goodsAmount', label:'销售金额', width:120},
          { key:'createTime', label:'下单日期', width:200},
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
          userMessage:'',
          orderId:'',
          goodsMessage:'',
          dealerName:'',
          payStatus:'',
          payWay:'',
          afterSellOrderType:'',
          mediaNo:'',
          mediaCate:'',
          mediaName:'',
          mresCate:'',
          formId:'',
          mresNo:''
      },
      bannerCategoryList: [], //广告位位置
      formIdList: [], //广告位形式
    }
  },
  methods: {
    onClickBtnDownload() {
      if( this.time && this.time.length > 0){
          this.form.orderTime = this.time[0];
          this.form.orderEndTime = this.time[1];
      }else{
          this.form.orderTime='';
          this.form.orderEndTime='';
      }
      const loading = this.$loading({
        lock: true,
        text: '正在提交中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.api_mediaManagePlatform_orderDetailDownLoad({
          data:this.form, type:'get', 
          headers:{ ContentType: 'application/x-www-form-urlencoded'}, 
          opts:{responseType: 'blob', downloadOption:'download'}
        }).then(res=>{
          let blob = res, 
              dateTime = this.tool.date.format(new Date(),'yyyyMMdd'),
              down_url = window.URL.createObjectURL(blob),
              a = document.createElement('a');
          a.download = '订单明细'+dateTime + '.xls' ;
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
      this.form.pageNum = this.datagrid.Pagination.current_page
      if( this.time && this.time.length > 0){
          this.form.orderTime = this.time[0];
          this.form.orderEndTime = this.time[1];
      }else{
          this.form.orderTime='';
          this.form.orderEndTime='';
      }
      this.api_mediaManagePlatform_orderDetailReport({data:this.form}).then(res=>{
        this.datagrid.List = res.content=='' ? []  :res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    //获取下拉列表数据： 广告位位置、广告位形式
    getSelList() {
      this.api_mediaManagePlatform_mresCateList({data:{ token: this.token, dicType: "mres_cate" }}).then(res=>{
        this.bannerCategoryList = res.content;
      })  
      this.api_mediaManagePlatform_formList().then(res=>{
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