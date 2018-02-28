<template>
    <div>
    <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input  placeholder="备案客户/联系人" :maxlength="40" v-model="form.keyWords" class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <EleOrgProvinceCity :disabled="true" :selectVal="orgs" v-on:selected="EleProvinceCity_CallBack" ></EleOrgProvinceCity>
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
        @onClickBtnSign="onClickBtnSign"
        @onClickBtnFollow="onClickBtnFollow"
        @onClickBtnHelp="onClickBtnHelp"
        @edit="edit"
        @del="del"
        @follow="follow"
        @onChangeCurrentPage="onChangeCurPage"
        @onChangePageSize="onChangeCurPageSize"
        :DataGrid = 'datagrid'></list-data>
      <Edit :isShow="show_edit_dialog" :data="data" @saveSuccess="init" ></Edit>
      <Sign :isShow="show_sign_dialog" :data="data" @saveSuccess="init" ></Sign>
      <FowllowUp :isShow="show_follow_dialog" :type="2" :data="data" @saveSuccess="init" ></FowllowUp>
    </div>
</template>
<script>
import { EleOrgProvinceCity } from '../../../../components/business/'
import Edit from './Edit.vue'
import Sign from './Sign.vue'
import FowllowUp from './FollowUp.vue'
import { mapGetters } from 'vuex'
export default {
  components:{EleOrgProvinceCity,Edit,Sign,FowllowUp},
  data() {
    let tool = this.tool
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'recordName', label:'备案客户',width:180},
          { key:'contactName', label:'客户联系人',width:180,formatter:function(row,column,cellValue){
            if (!row.contactName && !row.contactMobile) {
              return "-";
            } else {
              let name = row.contactName ? row.contactName + "  /" : "  /";
              let account = row.contactMobile ? row.contactMobile : "-";
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
          { key:'orgInfoList', label:'所属组织',width:300, formatter: function(row,column,cellValue) {
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
          { key:'endDate', label:'有效日期',width:150,formatter:function(row,column,cellValue){
              return tool.date.format(row.createDate,'yyyy-MM-dd hh:mm')
          }},
          { type:'operate',label: '操作',width:160,
            btns:[
              {text:'修改',eventName:'edit'},
              {text:'删除',eventName:'del'},
              {text:'跟进',eventName:'follow'},
            ]
          }
        ],
        ToolBar:[
          {text:'新增',eventName:'onClickBtnAdd'},
          {text:'修改',eventName:'onClickBtnEdit'},
          {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
          {text:'跟进',eventName:'onClickBtnFollow'},
          {text:'签约',eventName:'onClickBtnSign'},
          {text:'发起协助',eventName:'onClickBtnHelp'},
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
        recordName: "",
        bdKeyWords: "",
        status: "",
        orgId: "",
        followUpStatus: ""
      },
      show_edit_dialog:false,
      show_sign_dialog:false,
      show_follow_dialog:false,
      show_help_dialog:false,
      data:null,
      orgs:[]
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    //修改
    edit(row) {
      this.data = row.data
      this.show_edit_dialog = true
    },
    //删除
    del(row) {
        this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api_mediaManagePlatform_record({pathParams:`/${row.data.recordId}`,type:'delete'}).then(res=>{
          this.init()
        })
      }).catch(() => {
        
      })
    },
    //跟进
    follow(row){
      this.data = row.data
      this.show_follow_dialog = true
    },
    //新增
    onClickBtnAdd (opts) {
      this.data = null
      this.show_edit_dialog = true
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
    //签约
    onClickBtnSign(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.data = data.batch.datas[0]
        if( this.data.status === 3){
          this.$message({type:'error',message:'您选择的用户已签约'})
        }else{
          this.show_sign_dialog = true
        }
      }
    },
    //跟进
    onClickBtnFollow(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.follow({data:data.batch.datas[0]})
      }
    },
    //协助
    onClickBtnHelp(data){
      if( data.batch.datas.length !== 1){
        this.$message({type:'error',message:'请选择一项'})
        return
      }else{
        this.show_help_dialog = true
        this.$message({type:'error',message:'本版本暂不支持发起协助'})
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
      this.api_mediaManagePlatform_record({data:{
        keyWords:this.form.keyWords,
        bdKeyWords:this.form.bdKeyWords,
        orgId:this.form.orgId,
        status:this.form.status,
        followUpStatus:this.form.followUpStatus,
        operateBdId:this.getUser.bd.bdId,
        rows:this.datagrid.Pagination.page_size,
        pageNumber:this.datagrid.Pagination.current_page
      }}).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted() {
    this.orgs = this.getUser.bd.orgInfoList.map(item=>{
          return item.orgId
      })
    this.init()
  }
}
</script>