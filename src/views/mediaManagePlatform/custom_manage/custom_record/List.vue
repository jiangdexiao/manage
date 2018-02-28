<template>
    <div>
    <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input  placeholder="备案客户/联系人" :maxlength="40" v-model="form.keyWords" class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <EleOrgProvinceCity v-on:selected="EleProvinceCity_CallBack" ></EleOrgProvinceCity>
            </el-form-item> 
            <el-form-item>
                <el-input  placeholder="BD专员姓名/账号" :maxlength="20" v-model="form.bdKeyWords" class="form-input"></el-input>
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
            <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
            </el-form-item>
        </el-form>
      </el-col>
      <list-data
        ref='list-data'
        @onClickBtnAdd="onClickBtnAdd"
        @onClickBtnEdit="onClickBtnEdit"
        @onClickBtnDelete="onClickBtnDelete"
        @edit="edit"
        @del="del"
        @onChangeCurrentPage="onChangeCurPage"
        @onChangePageSize="onChangeCurPageSize"
        :DataGrid = 'datagrid'></list-data>
      <Edit :isShow="isShow" :data="data" @saveSuccess="SaveSuccess" ></Edit>
    </div>
</template>
<script>
import { EleOrgProvinceCity } from '../../../../components/business/'
import Edit from './Edit.vue'
import {tool} from '../../../../utils/'
export default {
  components:{EleOrgProvinceCity,Edit},
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'recordName', label:'备案客户',tooltip:true,width:200,formatter:function( row ){
            return tool.str.textLength(row.recordName,20)
          }},
          { key:'contactName', label:'客户联系人',width:200,formatter:function(row,column,cellValue){
            if (!row.contactName && !row.contactMobile) {
              return "-";
            } else {
              let name = row.contactName ? row.contactName + "  /" : "  /";
              let account = row.contactMobile ? row.contactMobile : "-";
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
          { key:'createBdName', label:'新增BD专员',width:200,formatter:function(row,column,cellValue){
            if (!row.createBdName && !row.createBdAccount) {
              return "-";
            } else {
              let name = row.createBdName ? row.createBdName + "  /" : "  /";
              let account = row.createBdAccount ? row.createBdAccount : "-";
              return name + account;
            }
          }},
          { key:'status', label:'备案状态', formatter: function(row,column,cellValue) {
              return row.status == 1 
              ? "备案中" : row.status == 2
              ? "备案失效" : row.status == 3 ? "签约成功" : row.status === 4 ? "已被其他签约" : "";
          }},
          { key:'followUpStatus', label:'跟进状态', formatter: function(row,column,cellValue) {
              return row.followUpStatus == 1 
              ? "跟进中" : row.followUpStatus == 2
              ? "未分派" : row.followUpStatus == 3 ? "放弃跟进" : row.followUpStatus === 4 ? "不需要跟进" : "";
          }},
          { key:'orgInfoList', label:'所属组织',width:350, formatter: function(row,column,cellValue) {
            let addr = "";
            row.orgInfoList.map((item, i) => {
              if (i < row.orgInfoList.length - 1) {
                addr += item.orgName + ">";
              } else {
                addr += item.orgName;
              }
            });
            return addr;
          }},
          { key:'followUpNumber', label:'跟进次数', formatter: function(row,column,cellValue) {
              return row.followUpInfoList.length;
          }},
          { key:'endDate', label:'有效日期',width:150,formatter:function(row,column,cellValue){
              return tool.date.format(row.endDate,'yyyy-MM-dd hh:mm')
          }},
          { key:'createDate', label:'备案日期',width:150,formatter:function(row,column,cellValue){
              return tool.date.format(row.createDate,'yyyy-MM-dd hh:mm')
          }},
          { type:'operate',label: '操作',width:100,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'删除',type:'danger',eventName:'del'}
            ]
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        }
      },
      // 搜索参数
      form: {
        keyWords: "",
        orgId: "",
        recordName: "",
        bdKeyWords: "",
        status: "",
        followUpStatus: ""
      },
      isShow:false,
      data:null
    }
  },
  methods: {
    SaveSuccess(){
      this.data = {}
      this.init()
    },
    //修改
    edit(opts,selectIems) {
      this.data = opts.data
      this.isShow = true
    },
    //删除
    del(opts) {
        this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api_mediaManagePlatform_record({pathParams:`/${opts.data.recordId}`,type:'delete'}).then(res=>{
          this.init()
        })
      }).catch(() => {
        
      })
    },
    //新增
    onClickBtnAdd (opts) {
      this.data = null
      this.isShow = true
    },
    //修改
    onClickBtnEdit(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.edit( {data:selectItems.datas[0]} )
      }
    },
    //删除
    onClickBtnDelete(opts,selectItems){
      if( selectItems && selectItems.ids.length == 0){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.del( {data:selectItems.datas[0]} )
        }
    },
    //搜索组织
    EleProvinceCity_CallBack(param){
      this.form.orgId = param
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
      this.api_mediaManagePlatform_record({data:this.form}).then(res=>{
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