<template>
  <div class="list tab_list">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
              <el-select v-model="form.roleType"  class="form-input" placeholder="选择有效角色" clearable>
                  <el-option value="1" label="媒体" ></el-option>
                  <el-option value="2" label="BD专员"></el-option>
                  <el-option value="3" label="促销员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.roleType">
                <el-input placeholder="有效角色名/账号" :maxlength="100" v-model="form.roleKeys" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="激励标题" :maxlength="100" v-model="form.rewardTitle" ></el-input>
            </el-form-item>  
            <el-form-item>
              <el-select v-model="form.rewardType"  class="form-input" placeholder="选择奖励类型" clearable>
                  <el-option value="1" label="成交奖励" ></el-option>
                  <el-option value="2" label="排行奖励"></el-option>
                  <el-option value="3" label="满额奖励"></el-option>
              </el-select>
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
import {tool} from '../../../../utils/'
export default {
  data(){
    return {
      token: sessionStorage.getItem('access_token'),
      datagrid: {
        List: [],
        FieldList: [
          { key:'createTime', label:'日期',width:150,formatter: function( row ) {
            return tool.date.format(row.createTime, "yyyy-MM-dd hh:mm")
          }},
          { key: 'userName', label: '角色名/账号',width:260,formatter:function(row,column,cellValue){
            if(!row.userName && !row.accNo){
                return '-'
            }else{
                var name = row.userName? row.userName +'  /': '  /';
                var account= row.accNo? row.accNo : '-';
                return name + account
            }
          }},
          { key:'roleType', label:'角色',width:90,formatter:function(y,column,cellValue){
            return y.roleType == 1 ? '媒体' : y.roleType==2? 'BD专员' : y.roleType==3 ? '促销员' :'' 
          }},
          { key:'roleInfo', label:'角色信息',width:320,type:'html',formatter:function(row,column,cellValue){
             if(row.roleType==1 || row.roleType==3){
               return row.roleInfo? row.roleInfo:'-'
             }else{
                let addr = ''
                row.orgInfoList.map((item, i) => {
                    if (i < row.orgInfoList.length - 1) {
                        addr += item.orgName + '>'
                    } else {
                        addr += item.orgName
                    }
                })
                return  `<font title="${addr}">${tool.str.textLength(addr,20)}</font>`
             }
          }},
          { key:'rewardTitle', label:'所属激励',width:320,tooltip:true,formatter:function(row,column,cellValue){
             return tool.str.textLength(row.rewardTitle,20)
          }},
          { key:'orderMoney', label:'交易金额',width:150,formatter: function(y,column,cellValue) {
            return tool.str.twoDecimal(y.orderMoney,2) 
          }},
          { key:'rewardType', label:'奖励类型',width:150, formatter:function(y,column,cellValue){
            return y.rewardType == 1 ? '成交奖励' : y.rewardType==2? '排行奖' : y.rewardType==3 ? '满额奖' :'' 
          }},
          { key:'rewardMoney', label:'奖励',width:150,formatter: function(y,column,cellValue) {
            return tool.str.twoDecimal(y.rewardMoney,2) 
          }},
          { key: 'mediaName', label: '来源',width:400,type:'html',formatter:function( row ){
              let html = (row.mresNo==null ?'': row.mresNo + "-") + (row.mediaName? row.mediaName:'') +'-'+row.orderId +"-" + (row.goodsName? row.goodsName:'') + '-'+(row.dealerName?row.dealerName:'')
              return  `<font title="${html}">${tool.str.textLength(html,20)}</font>`
          }}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form:{
        roleType:'',
        roleKeys:'',
        rewardTitle:'',
        rewardType:''
      },
    }
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
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_mediaManagePlatform_rewardDetail({ data: this.form }).then(res=>{
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