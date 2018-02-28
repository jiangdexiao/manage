<template>
  <div>
    <!--工具条-->
      <el-col :span="24" class="toolbar">
          <el-form :inline="true" :model="form">
              <el-form-item>
                  <el-input  placeholder="媒体名/媒体编号" :maxlength="20" v-model="form.keyWords" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
              </el-form-item>
          </el-form>
      </el-col>
    <list-data
      ref='list-data'
      @tdView="tdView"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>

<script>
export default {
  data(){
      let tool = this.tool
      return {
        datagrid:{
          List:[],
          FieldList: [
            { key: 'mediaName', label: '媒体名',width:350, tooltip:true,formatter: function(row) {
              return tool.str.textLength(row.mediaName,20)
            }},
            { key: 'userName', label: '管理用户',width:200,formatter:function(row,column,cellValue){
               if(!row.userName && !row.accNo){
                    return '-'
                }else{
                    var name = row.userName? row.userName +'  /': '  /';
                    var account= row.accNo? row.accNo : '-';
                    return name + account
                }
            }},
            { key: 'adTotalNum', label: '广告位数',width:150},
            { key: 'adValidNum', label: '有效广告位数量',width:150},
            { key: 'contractStartDate', label: '合约开始时间',width:200, tooltip:true,formatter: function(row) {
               return tool.date.format(row.contractStartDate, "yyyy-MM-dd");
            }},
            { key: 'cycleNum', label: '付款周期',width:80},
            { key: 'chargeDate', label: '开始计费时间',width:200, tooltip:true,formatter: function(row) {
               return tool.date.format(row.chargeDate, "yyyy-MM-dd");
            }},
            { key: 'totalPaidRent', label: '已支付租金总计',width:150,formatter:function(row,column,cellValue){
              return  tool.str.twoDecimal(row.totalPaidRent,2)
            }},
            { key: 'totalPendingRent', label: '待支付租金',width:150,formatter:function(row,column,cellValue){
              return  tool.str.twoDecimal(row.totalPendingRent,2)
            }},
            { type:'operate',label: '操作', width:150,
              btns:[ {text:'查看租金详细',eventName:'tdView'},]
            }
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox:false
        },
          form:{
            keyWords:''
          },
      }
  },
  methods:{
    tdView(opts){
      this.$router.push({path:'/mu/rent/detail', query:{mediaId:opts.data.mediaId}})
    },
      onChangeCurPage (page) {
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize (pageSize) {
        this.datagrid.Pagination.page_size  = pageSize
        this.init()
      },
      init(){
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNumber = this.datagrid.Pagination.current_page
        this.api_mediaManagePlatform_rentList({data:this.form}).then(res=>{
          this.datagrid.List = res.content?res.content:[]
          this.datagrid.Pagination.total = res.totalCount
        })
      }
  },
  mounted(){
      this.init();
  }
}
</script>
