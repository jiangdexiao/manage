<template>
  <div class="list">
     <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
            <el-form-item>
                <el-input placeholder="促销员姓名/账号" :maxlength="20" v-model="form.saler" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="媒体名/账号" :maxlength="50" v-model="form.media" ></el-input>
            </el-form-item> 
            <el-form-item>
                <el-date-picker
                    :editable="false"
                    unlink-panels
                    v-model="time"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
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
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
export default {
  data() {
    let tool = this.tool
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'salerName', label:'促销员',formatter:function(y,column,cellValue){
            if(!y.salerName && !y.salerNo){
                    return '-'
            }else{
                var name = y.salerName? y.salerName +'  /': '  /';
                var account= y.salerNo? y.salerNo : '-';
                return name + account
            }
          }},
          { key:'mediaName', label:'所属媒体',formatter:function(row,column,cellValue){
            if(row.mediaName && row.mediaName!=''){
              let str= row.mediaName.slice(0,20);
              let num = row.mediaUserNo ? '-'+row.mediaUserNo :''
              str += num;
              return str
            }
            return '-'
          }},
          { key:'incomeTotal', label:'收益总额（含待结算）',formatter:function( row ){
            return  tool.str.twoDecimal(row.incomeTotal,2)
          }},
          { key:'incomeSettled', label:'已结算',formatter:function( row ){
            return  tool.str.twoDecimal(row.incomeSettled,2)
          }},
          { key:'incomeSetteing', label:'待结算',formatter:function( row ){
            return  tool.str.twoDecimal(row.incomeSetteing,2)
          }}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form: {
        saler:'',
        media:''
      },
      time:[tool.date.format(new Date(tool.date.getLastMonth()),'yyyy-MM-dd'), tool.date.format(new Date(),'yyyy-MM-dd')],

    }
  },
  methods: {
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
      if( this.time && this.time.length > 0){
          this.form.dateStart = this.time[0];
          this.form.dateEnd = this.time[1];
      }else{
          this.form.dateStart='';
          this.form.dateEnd='';
      }
      this.api_mediaManagePlatform_income({data:this.form}).then(res=>{
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