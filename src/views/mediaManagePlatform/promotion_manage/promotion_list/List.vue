<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input placeholder="促销员姓名/账号" :maxlength="20" v-model="form.salesmanNoOrName" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="媒体名/账号" :maxlength="20" v-model="form.mediaNoOrName" ></el-input>
            </el-form-item> 
            <el-form-item>
              <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
       @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @del="del"
      :DataGrid = 'datagrid'></list-data>

    <Edit :isShow="isShow" :data="data" @saveSuccess="SaveSuccess" ></Edit>

  </div>
</template>
<script>
import Edit from './Edit.vue'
import {tool} from '../../../../utils/'
export default {
  components: {Edit},
  data(){
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'salesmanName', label:'促销员',width:210, formatter: function(y,column,cellValue) {
              return y.salesmanName + '/' + y.accNo
          }},
          { key:'mediaName', label:'所属媒体',width:200,formatter:function(row,column,cellValue){
            if(row.mediaName && row.mediaName!=''){
              let str= row.mediaName.slice(0,20);
              let num = row.mediaUserNo ? '-'+row.mediaUserNo :''
              str += num;
              return str
            }
            return '-'
          }},
          { key:'userName', label:'媒体管理账号',width:200,formatter:function(y,column,cellValue){
            if(!y.userName && !y.userNo){
                    return '-'
            }else{
                var name = y.userName? y.userName +'  /': '  /';
                var account= y.userNo? y.userNo : '-';
                return name + account
            }
          }},
          { key:'sex', label:'性别', formatter: function(y,column,cellValue) {
              return y.sex === 1 ? '男' : y.sex === 0 ? '女' : ''
          }},
          { key:'age', label:'年龄'},
          { key:'mresAdSimpleInfo', label:'负责广告位',type:'html',width:200,formatter:function(row,column,cellValue){
            let html='-';
            if(!row.mresAdSimpleInfo || !row.mresAdSimpleInfo.length){
              return '-'
            }
            row.mresAdSimpleInfo.map((item, i) => {
              if(item.mresName && item.mresName!=''){
                let str= item.mresName.slice(0,20);
                if(i==0){
                  html = `<font title="${item.mresName}">${str}</font>`
                }else {
                  html += `<font title="${item.mresName}"><br>${str}</font>`
                }
              }
            })
            return html
          }},
          { key:'mresAdSimpleInfo', label:'展示内容',type:'html',width:200,formatter:function(row,column,cellValue){
            let html='-';
            if(!row.mresAdSimpleInfo || !row.mresAdSimpleInfo.length){
              return '-'
            }
            row.mresAdSimpleInfo.map((item, i) => {
              if(item.mresName && item.mresName!=''){
                let str= '';
                if(i==0){
                  if(item.goodsName && item.goodsName!=''){
                    str= item.goodsName.slice(0,20); 
                    html = `<font title="${item.goodsName}">${str}</font>`
                  }else{
                    html='-'
                  }
                }else {
                  if(item.goodsName && item.goodsName!=''){
                    str= item.goodsName.slice(0,20); 
                    html += `<font title="${item.goodsName}"><br>${str}</font>`
                  }else{
                    html += `<br>`+'-'
                  }
                }
              }
            })
            return html
          }},
          { key:'mresAdSimpleInfo', label:'广告位状态',width:100,type:'html',formatter:function(row,column,cellValue){
            let html='-';
            if(!row.mresAdSimpleInfo || !row.mresAdSimpleInfo.length){
              return '-'
            }
            row.mresAdSimpleInfo.map((item, i) => {
              let str='';
              if(i==0){
                  str= item.advStatus==1 ? '上架中' : item.advStatus==2 ? '下架' : '-';
                  html = `<font>${str}</font>`
              }else {
                  str= item.advStatus==1 ? '上架中' : item.advStatus==2 ? '下架' : '-';
                  html += `<font><br>${str}</font>`
              }
            })
            return html
          }},
          { key:'mresAdSimpleInfo', label:'广告位地址',type:'html',width:350, formatter: function(row,column,cellValue) {
              let html='-';
            if(!row.mresAdSimpleInfo || !row.mresAdSimpleInfo.length){
              return '-'
            }
            row.mresAdSimpleInfo.map((item, i) => {
              let str='';
              if(i==0){
                  if(item.tagAddr && item.tagAddr!=''){
                    str= item.tagAddr.slice(0,20); 
                    html = `<font title="${item.tagAddr}">${str}</font>`
                  }else{
                    html='-'
                  }
              }else {
                  if(item.tagAddr && item.tagAddr!=''){
                    str= item.tagAddr.slice(0,20);
                    html += `<font title="${item.tagAddr}"><br>${str}</font>`
                  }else{
                    html += `<br>`+'-'
                  }
              }
            })
            return html
          }},
          { key:'createdDate', label:'新增日期',width:150, formatter: function(row,column,cellValue) {
              return tool.date.format(row.createdDate,'yyyy-MM-dd hh:mm:ss')
          }},
          { type:'operate', label: '操作', width:100,
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
      form:{
        salesmanNoOrName:'',
        mediaNoOrName:''
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
      this.$confirm('确认删除    "'+opts.data.salesmanName+'  '+opts.data.accNo+'"    吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api_mediaManagePlatform_salesman({pathParams:`/${opts.data.salesmanId}`,type:'delete'}).then(res=>{
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
      }else if(selectItems.ids.length >1){
        this.$message({type:'error',message:'只能选择一项'})
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
        }else if(selectItems.ids.length >1){
          this.$message({type:'error',message:'只能选择一项'})
          return
        }else{
          this.del( {data:selectItems.datas[0]} )
        }
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
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_mediaManagePlatform_salesman({data:this.form}).then(res=>{
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
