<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
            <el-form-item>
                <el-input  placeholder="BD专员姓名/账号"  :maxlength="20" v-model="form.keyWords"  class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
                <EleProvinceCity v-on:selected="EleProvinceCity_CallBack" ></EleProvinceCity>
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
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
  import { EleProvinceCity } from '../../../../components/business/'
  import {tool} from '../../../../utils/'
  export default {
    components:{EleProvinceCity},
    data () {
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'bdName', label: 'BD专员姓名/账号'},
            { key: 'roleType', label: '角色',formatter:function(row,column,cellValue){ return row.roleType === 1?'BD负责人':'普通专员' }},
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
            { key: 'parentBdName', label: '上级BD专员',formatter:function(row,column,cellValue){
              if(!row.parentBdName && !row.parentBdAccount){
                  return '-'
              }else{
                  let name = row.parentBdName? row.parentBdName +'  /': '  /';
                  let account= row.parentBdAccount? row.parentBdAccount : '-';
                  return name + account
              }
            }},
            { key: 'lastLoginDate', label: '最后登录',formatter:function(row,column,cellValue){
              return tool.date.format(row.lastLoginDate,'yyyy-MM-dd hh:mm')
            }},
            { key: 'createDate', label: '新增时间',formatter:function(row,column,cellValue){
              return tool.date.format(row.createDate,'yyyy-MM-dd hh:mm')
            }},
            { type:'operate',label: '操作',
              btns:[
                {text:'修改',eventName:'onClickBtnEdit'},
                {text:'删除',type:'danger',eventName:'onClickBtnDelete'}
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
        }
      }
    },
    methods: {
      EleProvinceCity_CallBack(param){
        this.form.orgId = param
      },
      onClickSearch(){
        this.init()
      },
      onClickBtnAdd (opts) {
        // console.log(opts);
        this.$message('点击的是添加按钮')
      },
      onClickBtnEdit (opts) {
        // console.log(opts);
        this.$message('点击的是修改按钮')
      },
      onClickBtnDelete () {
        this.$message('点击的是删除按钮')
      },
      // {type,data,dataIndex,list,btn,btnIndex}
      onChangeCurPage (page) {
        this.$message('当前页是第' + page + '页')
      },
      onChangeCurPageSize (pageSize) {
        this.$message('当前每页显示 ' + pageSize + ' 条')
      },
      init(){
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNumber = this.datagrid.Pagination.current_page
        this.api_mediaManagePlatform_bd({data:this.form}).then(res=>{
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.content.totalCount
        })
      }
    },
    mounted () {
      this.init()
    }
  }
  
</script>
