<template>
  <div class="edit-form">
    <el-dialog title="用户列表"
        custom-class='dialog list-dialog'
        :visible.sync="show_userlist_dialog"
        :close-on-click-modal="false"
        @close="handleClose">
    <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="form">
                <el-form-item>
                    <el-input  placeholder="电话/账号" :maxlength="20" v-model="form.mobile" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" @click="init" class='btn-search'>搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          @edit="edit"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      show_userlist_dialog:false,
      datagrid:{
        List:[],
        FieldList: [
          { key: 'userId', label: 'ID',width:350},
          { key: 'mobile', label: '电话/账号'},
          { key: 'username', label: '姓名'},
          { key: 'groupType', label: '用户组',formatter:function(row,column,cellValue){
              if( row.groupType === 1)
                return "普通用户"
              else if( row.groupType === 2)
                return "促销员"
              else if( row.groupType === 3)
                return  "媒体"
              else 
                return "经销商"
          }},
          { type: 'operate', label: '操作',width:80,
            btns:[
              {text:'选择',eventName:'edit'},
            ]
          },
        ],
        Checkbox:false,
        Pagination:{
          total:0,
          page_size:10,
          current_page:1
        }
      },
      form:{
        groupType:3,
        mobile: '',
        token:sessionStorage.getItem('access_token')
      }
    }
  },
  methods:{
    edit(row){
      this.$emit('select',row.data)
      this.handleClose()
    },
    handleClose(){
      this.show_userlist_dialog = false
      this.$parent.show_userlist_dialog = false
      this.datagrid.Pagination.page_size = 10
      this.datagrid.Pagination.current_page = 1
      this.datagrid.Pagination.total = 0
      this.datagrid.List = 0
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
      this.form.pageNum = this.datagrid.Pagination.current_page
      this.api_mediaManagePlatform_listForUserUnbind({data:this.form}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
        this.datagrid.Pagination.total = res.totalCount
      })  
    }
  },
  mounted(){
    this.init()
  },
  props:{
    isShow:{
      type:Boolean
    }
  },
  watch:{
    isShow(v){
      this.show_userlist_dialog = v
      if( v === true){
        this.init()
      }
    }
  }
}
</script>