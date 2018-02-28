<template>
  <div class="edit-form">
    <el-dialog title="客户签约"
        custom-class='dialog list-dialog'
        :visible.sync="show_signuserlist_dialog"
        :close-on-click-modal="false"
        @close="handleClose">
        <p style="text-align: center">签约成功</p>
        <list-data
          ref='list-data'
          @hasSign = "hasSign"
           @onChangeCurrentPage="onChangeCurPage"
           @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'></list-data>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data(){
    return{
      show_signuserlist_dialog:false,
      datagrid:{
        List:[],
        FieldList: [
          { key: 'recordName', label: '备案客户名'},
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
          { key: 'keywords', label: '关键词'},
          { type:'operate',label: '处理',
            btns:[
              {text:'已被签约',eventName:'hasSign'},
            ]
          }
        ],
        Checkbox:false,
        Pagination:{
          total:0,
          page_size:10,
          current_page:1
        }
      }
    }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    hasSign(row){
      this.api_mediaManagePlatform_record({pathParams:`/${row.data.recordId}`,
           data:{status: 4,operateBdId: this.getUser.bd.bdId},type:'put'}).then(res=>{
        this.$parent.$parent.init()
        this.init()
      })
    },
    handleClose(){
      this.show_signuserlist_dialog = false
      this.$parent.show_signuserlist_dialog = false
      this.datagrid.Pagination.page_size = 10
      this.datagrid.Pagination.current_page = 1
      this.datagrid.Pagination.total = 0
      this.datagrid.List = []
      this.$parent.$parent.init()
      this.tool.dp.clearData(this.form)
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      this.api_mediaSaleManagePlatform_recordSign({data:{
          keyword:this.form.keyword,
          recordName:this.form.recordName,
          token:sessionStorage.getItem('access_token'),
          operateBdId:this.getUser.bd.bdId,
          rows:this.datagrid.Pagination.page_size,
          pageNumber:this.datagrid.Pagination.current_page
      }}).then(res=>{
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
    },
    form:{
        type:Object,
        default(){
            return {
                keyword:'',
                recordName:''
            }
        }
    }
  },
  watch:{
    isShow(v){
      this.show_signuserlist_dialog = v
      if( v === true){
        this.init()
      }
    }
  }
}
</script>