<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-select v-model="form.handleBdId" filterable remote placeholder="BD专员姓名/账号"  clearable :remote-method="getSellers" :loading="loading">
                    <el-option v-for="(item,i) in sellers" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                  :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
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
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    let tool = this.tool
    return {
      time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'),this.tool.date.format(new Date(),'yyyy-MM-dd')],
      datagrid: {
        List: [],
        FieldList: [
          { key:'bdName', label:'BD专员姓名/账号',width:260,formatter:function(row,column,cellValue){
            if (!row.bdName && !row.account) {
              return "-";
            } else {
              let name = row.bdName ? row.bdName + "  /" : "  /";
              let account = row.account ? row.account : "-";
              return name + account;
            }
          }},
          { key:'devoteJson', label:'类型',formatter:function(row){
            if(row.devoteJson==""){
                return "自推"
            }else{
                let s= JSON.parse(row.devoteJson);
                if(s.subBdId==null){
                    return "自推";
                }else{
                    return "员工贡献";
                }
            }
          }},
          { key:'devoteJson',label:'贡献员工',width:350,html:true, formatter:function(row){
            if(row.devoteJson == ""){
                return "-"
            }else{
                let s= JSON.parse(row.devoteJson);
                if(s.subBdId==null){
                    return "-";
                }else{
                    return '['+s.subBdRoleInfo+']'+s.subBdName+ '  '+s.subBdAccount;
                }
            }
          }},
          { key:'amount', label:'提成',formatter: function(row) {
            return  tool.str.twoDecimal(row.amount,4)
          }},
          { key:'settleTime', label:'结算时间',width:260,tooltip:true,formatter: function( row ) {
             if(row.settleStatus==1){
                  return '-'
              }else {
                  return tool.date.format(row.settleTime, "yyyy-MM-dd hh:mm:ss")
              }
          }},
          { key:'mresName', label:'来源明细', width:350, tooltip:true,formatter: function( row ) {
            return (row.mresName==null ? "":row.mresName + "-")  + row.bussnessId + ( row.goodsName==''? "" : "-"+row.goodsName) + "-" + (row.goodsPrice=='' ? 0 : tool.str.twoDecimal(row.goodsPrice,2));
          }},
          { key:'orderTime', label:'订单时间',width:260,formatter: function( row ) {
            return tool.date.format(row.orderTime, "yyyy-MM-dd hh:mm:ss")
          }},
          { key:'curMonthAmount', label:'当月累计结算后提成', formatter: function( row ) {
            return  tool.str.twoDecimal(row.curMonthAmount,4)
          }},
          { key:'lastMonthAmount', label:'上月累计结算后提成', formatter: function( row ) {
            return  tool.str.twoDecimal(row.lastMonthAmount,4)
          }},
          { key:'hisAmount', label:'历史累计结算后提成',formatter: function( row ) {
            return  tool.str.twoDecimal(row.hisAmount,4)
          }},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      // 定义搜索参数
      form: {
        handleBdId:'',
        keyWords:'',
        startTime:'',
        endTime:''
      },
      sellers:[],
      loading:false
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      if(this.time==null){
          this.form.startTime = '';
          this.form.endTime = '';
      }else{
          this.form.startTime = this.time[0];
          this.form.endTime = this.time[1];
      }
      this.api_mediaSaleManagePlatform_bdDeduct({
        data:{ systemAccessToken :sessionStorage.getItem('access_token'),
              userType:6,
              userIdList:this.form.handleBdId,
              operateBdId:this.getUser.bd.bdId,
              startTime:this.form.startTime,
              endTime:this.form.endTime,
              pageRows:this.datagrid.Pagination.page_size,
              pageNo:this.datagrid.Pagination.current_page
            }
      }).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    getSellers(query){
      if (query == "") return;
        if( query.length > 20 ){
            this.$message({type:'error',message:'输入不能超过20个字符'});return;
        }
        this.sellers = []
        this.loading = true
        this.api_mediaManagePlatform_bd({ keyWords:query }).then(res=>{
          this.loading = false
          this.sellers = res.content?res.content:[]
        }).catch(err=>{
          this.loading = false
        })
    }
  },
  mounted() {
    this.init()
  }
}
</script>
