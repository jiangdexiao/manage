<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form">
        <el-form-item>
          <el-input placeholder="BD专员姓名/账号" :maxlength="20" v-model="form.keyWords" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <EleOrgProvinceCity v-on:selected="EleProvinceCity_CallBack" ></EleOrgProvinceCity>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
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
    <Edit :isShow="isShow" :data="data" @saveSuccess="SaveSuccess"></Edit>
  </div>
</template>
<script>
  import { EleOrgProvinceCity } from '../../../../components/business/'
  import Edit from './Edit.vue'
  import {tool} from '../../../../utils/'
  export default {
    components:{EleOrgProvinceCity,Edit},
    data () {
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'bdName', label: 'BD专员姓名/账号',width:200,formatter:function(row,column,cellValue){
              if(!row.bdName && !row.account){
                  return '-'
              }else{
                  let name = row.bdName? row.bdName +'  /': '  /';
                  let account= row.account? row.account : '-';
                  return name + account
              }
            }},
            { key: 'roleType', label: '角色',width:150,formatter:function(row,column,cellValue){ return row.roleType === 1?'BD负责人':'普通专员' }},
            { key: 'orgName', label: '所属组织',formatter:function(row,column,cellValue){
              let addr = ''
              row.orgInfoList.map((item, i) => {
                  if (i < row.orgInfoList.length - 1) {
                      addr += item.orgName + '>'
                  } else {
                      addr += item.orgName
                  }
              })
              return addr
            }},
            { key: 'parentBdName', label: '上级BD专员',width:200,formatter:function(row,column,cellValue){
              if(!row.parentBdName && !row.parentBdAccount){
                  return '-'
              }else{
                  let name = row.parentBdName? row.parentBdName +'  /': '  /';
                  let account= row.parentBdAccount? row.parentBdAccount : '-';
                  return name + account
              }
            }},
            { key: 'lastLoginDate', label: '最后登录',width:200,formatter:function(row,column,cellValue){
              return tool.date.format(row.lastLoginDate,'yyyy-MM-dd hh:mm')
            }},
            { key: 'createDate', label: '新增时间',width:200,formatter:function(row,column,cellValue){
              return tool.date.format(row.createDate,'yyyy-MM-dd hh:mm')
            }},
            { type:'operate',label: '操作',
              btns:[
                {text:'修改',eventName:'edit'},
                {text:'删除',type:'danger',eventName:'del'}
              ]
            }
          ],
          ToolBar:[
            {text:'添加',eventName:'onClickBtnAdd'},
            {text:'修改',eventName:'onClickBtnEdit'},
            {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          }
        },
        form:{
          keyWords:'',
          orgId:'',
          operateBdId:0
        },
        isShow:false,
        data:null
      }
    },
    methods: {
      EleProvinceCity_CallBack(param){
        this.form.orgId = param
      },
      SaveSuccess(){
        this.init()
      },
      onClickSearch(){
        this.init()
      },
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
         this.api_mediaManagePlatform_bd({pathParams:`/${opts.data.bdId}`,type:'delete'}).then(res=>{
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
        if( selectItems && selectItems.ids.length !==1){
          this.$message({type:'error',message:'请选择一项'})
          return
        }else{
          this.edit( {data:selectItems.datas[0]} )
        }
      },
      //删除
      onClickBtnDelete(opts,selectItems){
        if( selectItems && selectItems.ids.length !== 1){
            this.$message({type:'error',message:'请选择一项'})
            return
          }else{
            this.del( {data:selectItems.datas[0]} )
          }
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

      init(){
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNumber = this.datagrid.Pagination.current_page
        this.api_mediaManagePlatform_bd({data:this.form}).then(res=>{
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      }
    },
    mounted () {
      this.init()
    }
  }

</script>
