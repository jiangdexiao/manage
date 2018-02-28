<template>
  <div>
    <list-data
    ref='list-data'
    checkbox
    @onClickBtnAdd="onClickBtnAdd"
    @onClickBtnEdit="onClickBtnEdit"
    @onClickBtnDelete="onClickBtnDelete"
    @onClickBtnPreview="onClickBtnPreview"
    @edit="edit"
    @del="del"
    @preview="preview"
    @onChangeCurrentPage="onChangeCurPage"
    @onChangePageSize="onChangeCurPageSize"
    :DataGrid = 'datagrid'></list-data>
    <el-dialog
      title="静态内容预览"
      custom-class='dialog_static'
      :visible.sync="dialog_preview"
      :before-close="handleClose">
        <div v-html="preview_params.content"></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog_preview=false">关闭</el-button>
        </span>
    </el-dialog>
    <Edit :isShow="isShow" :data="data" :defaultMsg="defaultMsg"  :addModifyToggle="addModifyToggle"></Edit>

    
  </div>
</template>
<script>
import utf8 from 'utf8'
import base64 from 'base-64'
import Edit from "./Edit.vue"
import { tool } from "../../../../utils/"
import UE from '../../../../components/ueditor/ue.vue'
export default {
  components: {UE, Edit},
  data(){
    return {
      datagrid:{
        List: [],
        FieldList: [
          { type: 'operate',label: '操作',
            width: 130,
            btns:[
              { text: '修改', eventName:'edit'},
              { text: '删除', eventName:'del', style: 'color:red', condition:function({data}){ return data.isInit !== 1 } },
              { text: '预览', type:'danger', eventName:'preview', style: 'color:#447695' }
            ]
          },
          { key: 'scontentId', label: 'ID', tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.scontentId, 5)
          }},
          { key: 'title', label: '标题'},
          { key: 'remarks', label: '备注'},
          { key: 'userName', label: '新增账号'},
          { key: 'createdDate', label: '新增时间', formatter:function(row,column,cellValue){
              return tool.date.format(row.createdDate,'yyyy-MM-dd hh:mm')
          }}
        ],
        ToolBar:[
          {text:'添加',eventName: 'onClickBtnAdd'},
          {text:'修改',eventName: 'onClickBtnEdit'},
          {text:'删除',type:'danger', eventName:'onClickBtnDelete'},
          {text:'预览',eventName: 'onClickBtnPreview'},
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox: true,
      },
      addModifyToggle: '',
      isShow: false,
      data: null,
      dialog_preview: false,
      preview_params: {content: ''},
      add_modify_delete_params: {title: '', remarks: '', content: '', userId: ''},
      defaultMsg: ''
    }
  },
  methods:{
    handleClose () {
      this.dialog_preview = false
    },
    onChangeCurPage (page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.get_static_info()
    },
    onChangeCurPageSize (pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size  = pageSize
      this.get_static_info()
    },
    onClickBtnAdd (opts) {
      this.addModifyToggle = 'add'
      this.data = null
      this.isShow = true
    },
    onClickBtnEdit (opts,selectItems) {
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'warning',message:'请选择一项'})
        return
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else{
        this.edit( {data:selectItems.datas[0]} )
      }
    },
    onClickBtnDelete (opts,selectItems) {
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'warning',message:'请选择一项'})
        return
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else{
        this.del( {data:selectItems.datas[0]} )
      }
    },
    onClickBtnPreview (opts,selectItems) {
      if( selectItems && selectItems.ids.length == 0){
        this.$message({type:'warning',message:'请选择一项'})
        return
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else{
        this.preview( {data:selectItems.datas[0]} )
      }
    },
    edit (opts) {
      this.addModifyToggle = 'modify'
      this.data =  {...opts.data}
      this.defaultMsg = opts.data.content
      this.isShow = true
    },
    del (opts) {
      this.add_modify_delete_params = opts.data
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_scontentDel({ 
          data: Object.assign({}, {
            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            userAccNo: JSON.parse(sessionStorage.getItem('userInfo')).telNo,
            token: sessionStorage.getItem('access_token'),
          }, this.add_modify_delete_params),
        }).then(res => {
          this.handleClose()
          this.get_static_info()
        })
      }).catch(() => {})
    },
    preview (opts) {
      this.preview_params.content = opts.data.content
      this.dialog_preview = true
    },
    saveSuccess(){
      console.log('保存成功')
    },
    get_static_info () {
      let that = this
      let params = {
        token: JSON.parse(sessionStorage.getItem('userInfo')).token,
        rows: that.datagrid.Pagination.page_size,                          // 每页多少条数据
        pageNumber: that.datagrid.Pagination.current_page         // 请求第几页
      }
      that.api_businessManagePlatform_scontent({data:params}).then(res=>{
        that.datagrid.List = res.content
        that.datagrid.Pagination.total = res.totalCount
      })
    },
  },
  mounted () {
    this.get_static_info()
  }
  
}
</script>