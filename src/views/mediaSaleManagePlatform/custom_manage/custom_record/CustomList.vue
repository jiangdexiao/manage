<template>
  <div class="edit-form">
    <el-dialog title="客户列表"
        custom-class='dialog list-dialog'
        :visible.sync="show_userlist_dialog"
        :close-on-click-modal="false"
        @close="handleClose">
    <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="form">
                <el-form-item>
                    <el-input  placeholder="备案媒体名称" :maxlength="50" v-model="form.keyWords" class="form-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="medium" @click="init" class='btn-search'>搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
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
          { key: 'recordName', label: '备案客户'},
          { key: 'createBdName', label: 'BD专员',formatter:function( row ){
            if (!row.createBdName && !row.createBdAccount) {
                return "-";
            } else {
                var name = row.createBdName ? row.createBdName + "  /" : "  /";
                var account = row.createBdAccount ? row.createBdAccount : "-";
                return name + account;
            }
          }},
          { key: 'cateName', label: '行业',formatter:function(row){return row.parentCateName+'>'+ row.cateName  }},
          { key: 'keywords', label: '关键词'}
        ],
        Checkbox:false,
        // Pagination:{
        //   total:0,
        //   page_size:10,
        //   current_page:1
        // }
      },
      form:{
        keyWords: ''
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
      this.form.keyWords= ''
    //   this.datagrid.Pagination.page_size = 10
    //   this.datagrid.Pagination.current_page = 1
    //   this.datagrid.Pagination.total = 0
      this.datagrid.List = []
    },
    init(){
      this.api_mediaManagePlatform_record({data:{
          keyWords:this.form.keyWords,
          token:sessionStorage.getItem('access_token'),
          rows:10,
          pageNum:1
      }}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
        // this.datagrid.Pagination.total = res.totalCount
      })  
    }
  },
  mounted(){
    this.init()
  },
  props:{
    isShow:{
      type:Boolean
    },
    dataObj:{
        type:Object
    }
  },
  watch:{
    isShow(v){
      this.show_userlist_dialog = v
      this.form.keyWords = this.dataObj.keyWords ? this.dataObj.keyWords :''
      if( v === true){
        this.init()
      }
    }
  }
}
</script>