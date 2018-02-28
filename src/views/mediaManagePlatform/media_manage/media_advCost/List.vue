<template>
  <div class="list">
    <!--工具条-->
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      @onClickBtnEdit="onClickBtnEdit"
      @edit="edit"
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
          { key:'formName', label:'广告位形式'},
          { key:'advSize', label:'广告位尺寸'},
          { key:'advFrameCost', label:'固定框架成本（元/个）',formatter: function(y,column,cellValue) {
              return tool.str.twoDecimal(y.advFrameCost,2) 
          }},
          { key:'advProductionCost', label:'海报制作成本（元/次）',formatter: function(y,column,cellValue) {
              return tool.str.twoDecimal(y.advProductionCost,2) 
          }},
          { key:'advNum', label:'广告位数量'},
          { type:'operate', label: '操作', width:100,
            btns:[ 
              {text:'修改',eventName:'edit'}
            ]
          }
        ],
        ToolBar:[
          {text:'修改',eventName:'onClickBtnEdit'}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        }
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
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      let datas={
        rows: this.datagrid.Pagination.page_size,
        pageNumber :this.datagrid.Pagination.current_page
      }
      this.api_mediaManagePlatform_advCost({data:datas}).then(res=>{
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
