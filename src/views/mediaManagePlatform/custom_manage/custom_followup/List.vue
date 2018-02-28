<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
               <el-input  placeholder="备案客户/联系人" :maxlength="40" v-model="form.keyWords" class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.createBdId" filterable remote placeholder="备案BD姓名/账号"  clearable :remote-method="getBdList" :loading="loading">
                    <el-option v-for="(item,i) in sellers" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.handleBdId" filterable remote placeholder="跟进BD姓名/账号"  clearable :remote-method="getBdList" :loading="loading">
                    <el-option v-for="(item,i) in sellers" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.status"  placeholder="选择备案状态"  clearable >
                    <el-option value="1" label="备案中" ></el-option>
                    <el-option value="2" label="备案失效"></el-option>
                    <el-option value="3" label="签约成功"></el-option>
                    <el-option value="4" label="已被其他签约"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.followUpStatus"  placeholder="选择跟进状态"  clearable >
                    <el-option value="1" label="跟进中" ></el-option>
                    <el-option value="2" label="未分派"></el-option>
                    <el-option value="3" label="放弃跟进"></el-option>
                    <el-option value="4" label="不需要跟进"></el-option>
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
              <el-button type="primary" size="medium" class='btn-search' @click="init" >搜索</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <el-dialog
        title="查看"
        custom-class='dialog'
        :visible.sync="isShowLog"
        :before-close="handleClose">
        <el-col :span="24" v-for="(item,i) in follow_list" :key="i">
          <el-form ref="form"  label-width="100px">
              <el-form-item >
                第 {{item.followUpNumber}} 次
              </el-form-item>
              <el-form-item label="跟进日期">
                 {{tool.date.format(new Date(item.followUpTime),"yyyy-MM-dd hh:mm:ss")}}
              </el-form-item>
              <el-form-item label="跟进备注">
                {{item.followUpNote}}
              </el-form-item>
              <el-form-item label="BD专员">
                {{item.handleBdName + ' ' + item.handleBdAccount}}
              </el-form-item>
          </el-form>
        </el-col>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @see="see"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
export default {
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'recordName', label:'备案客户',tooltip:true,width:200,formatter:function( row ){
            return tool.str.textLength(row.recordName,20)
          }},
          { key:'createBdName', label:'备案BD专员',width:200,formatter:function(row,column,cellValue){
            if (!row.createBdName && !row.createBdAccount) {
              return "-";
            } else {
              let name = row.createBdName ? row.createBdName + "  /" : "  /";
              let account = row.createBdAccount ? row.createBdAccount : "-";
              return name + account;
            }
          }},
          { key:'handleBdName', label:'跟进BD专员',width:200,formatter:function(row,column,cellValue){
            if (!row.handleBdName && !row.handleBdAccount) {
              return "-";
            } else {
              let name = row.handleBdName ? row.handleBdName + "  /" : "  /";
              let account = row.handleBdAccount ? row.handleBdAccount : "-";
              return name + account;
            }
          }},
          { key:'followUpNumber', label:'跟进次数', formatter: function(row,column,cellValue) {
              return row.followUpNumber == 0 ? 0 : '第' + row.followUpNumber + '次';
          }},
          { key:'followUpNote', label:'跟进日志',width:350,tooltip:true,formatter:function( row ){
            return tool.str.textLength(row.followUpNote,20)
          }},
          { key:'recordStatus', label:'备案状态', formatter: function(row,column,cellValue) {
              return row.recordStatus == 1 
              ? "备案中" : row.recordStatus == 2
              ? "备案失效" : row.recordStatus == 3 ? "签约成功" : "已被其他签约";
          }},
          { key:'followUpStatus', label:'跟进状态', formatter: function(row,column,cellValue) {
              return row.followUpStatus == 1 
              ? "跟进中" : row.followUpStatus == 2
              ? "未分派" : row.followUpStatus == 3 ? "放弃跟进" : "不需要跟进";
          }},
          { key:'followUpTime', label:'跟进时间',width:150,formatter:function(row,column,cellValue){
              return tool.date.format(row.followUpTime,'yyyy-MM-dd hh:mm')
          }},
          { type:'operate',label: '操作',width:80,
            btns:[
              {text:'查看',eventName:'see'},
            ]
          }
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
          keyWords: "",
          createBdId: "",
          handleBdId: "",
          followUpStatus: "",
          status: "",
          orderType: 1,
      },
      time:[tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'), tool.date.format(new Date(),'yyyy-MM-dd')],
      sellers: [],
      loading: false,
      follow_list: [],
      isShowLog: false,

    }
  },
  methods: {
    handleClose(){
        this.isShowLog = false;
        this.follow_list= [];
    },
    getBdList(query) {
        if (query == "") return;
        if( query.length > 20 ){
            this.$message({type:'error',message:'输入不能超过20个字符'});return;
        }
        this.sellers = [];
        this.loading = true;
        this.api_mediaManagePlatform_getBdList({data:{keyWords: query}}).then(res=>{
          this.loading = false
          this.sellers = res.content
        })
    },
    see(opts,selectIems) { 
      this.api_mediaManagePlatform_followUpLog({data:{recordId:opts.data.recordId}}).then(res=>{
        this.follow_list = res.content;
        this.isShowLog = true;
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
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      if( this.time && this.time.length > 0){
          this.form.beginTime = this.time[0];
          this.form.endTime = this.time[1];
      }else{
          this.form.beginTime='';
          this.form.endTime='';
      }
      this.api_mediaManagePlatform_followUpLog({data:this.form}).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }

  },
  mounted() {
    this.init()
  }
}
</script>