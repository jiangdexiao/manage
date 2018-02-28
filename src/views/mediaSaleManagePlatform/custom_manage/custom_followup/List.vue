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
        :visible.sync="show_view_dialog"
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
      @edit="edit"
      @onClickBtnEdit = "onClickBtnEdit"
      @onClickBtnFollow = "onClickBtnFollow"
      @onClickBtnView = "onClickBtnView"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @see="see"
      :DataGrid = 'datagrid'></list-data>
      <Edit :isShow="show_follow_dialog" :type="type" :data="data" @saveSuccess="init"></Edit>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Edit from './Edit.vue'
export default {
  components:{Edit},
  data() {
    let tool = this.tool
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'recordName', label:'备案客户'},
          { key:'createBdName', label:'备案BD专员',width:180,formatter:function(row,column,cellValue){
            if (!row.createBdName && !row.createBdAccount) {
              return "-";
            } else {
              let name = row.createBdName ? row.createBdName + "  /" : "  /";
              let account = row.createBdAccount ? row.createBdAccount : "-";
              return name + account;
            }
          }},
          { key:'handleBdName', label:'跟进BD专员',width:180,formatter:function(row,column,cellValue){
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
              ? "备案失败" : row.recordStatus == 3 ? "签约成功" : "已被其他签约";
          }},
          { key:'followUpStatus', label:'跟进状态', formatter: function(row,column,cellValue) {
              return row.followUpStatus == 1 
              ? "跟进中" : row.followUpStatus == 2
              ? "未分派" : row.followUpStatus == 3 ? "放弃跟进" : "不需要跟进";
          }},
          { key:'followUpTime', label:'跟进时间',formatter:function(row,column,cellValue){
              return tool.date.format(row.followUpTime,'yyyy-MM-dd hh:mm')
          }},
          { type:'operate',label: '操作',width:100,
            btns:[
              {text:'修改',eventName:'edit'},
            ]
          }
        ],
        ToolBar:[
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'跟进',eventName:'onClickBtnFollow'},
          {text:'查看',eventName:'onClickBtnView'}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:true
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
      show_view_dialog: false,
      show_follow_dialog: false,
      data:null,
      type:1 //1=修改  2=跟进
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    handleClose(){
        this.show_view_dialog = false;
        this.follow_list= [];
    },
    getBdList(query) {
        if (query == "") return;
        if( query.length > 20 ){
            this.$message({type:'error',message:'输入不能超过20个字符'});return;
        }
        this.sellers = [];
        this.loading = true;
        this.api_mediaManagePlatform_getBdList({data:{staffKeys: query}}).then(res=>{
          this.loading = false
          this.sellers = res.content
        }).catch(err=>{
          this.loading = false
        })
    },
    onClickBtnEdit(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.type = 1
        this.edit( {data:data.batch.datas[0]} )
      }
    },
    onClickBtnFollow(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.type = 2
        this.edit( {data:data.batch.datas[0]} )
      }
    },
    onClickBtnView(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.see( {data:data.batch.datas[0]} )
      }
    },
    see(row) { 
      this.api_mediaManagePlatform_followUpLog({data:{recordId:row.data.recordId}}).then(res=>{
        this.follow_list = res.content;
        this.show_view_dialog = true;
      })
    },
    edit(row){
      this.show_follow_dialog = true
      this.data = row.data
      console.log(row)
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
      this.api_mediaManagePlatform_followUpLog({data:{
        keyWords: this.form.keyWords,
        createBdId: this.form.createBdId,
        handleBdId: this.form.handleBdId,
        beginTime: this.form.beginTime,
        endTime: this.form.endTime,
        followUpStatus: this.form.followUpStatus,
        status: this.form.recordStatus,
        orderType: 1,
        operateBdId: this.getUser.bd.bdId,
        rows: this.datagrid.Pagination.page_size,                          // 每页多少条数据
        pageNumber: this.datagrid.Pagination.current_page    // 请求第几页
      }}).then(res=>{
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