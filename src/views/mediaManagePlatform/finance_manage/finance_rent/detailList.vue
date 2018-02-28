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
            { key: 'createDate', label: '创建时间',width:200, tooltip:true,formatter: function(row) {
               return tool.date.format(row.createDate, "yyyy-MM-dd");
            }},
            { key: 'mediaName', label: '媒体名',width:350, tooltip:true,formatter: function(row) {
              return tool.str.textLength(row.mediaName,20)
            }},
            { key: 'userName', label: '管理用户',width:220,formatter:function(row,column,cellValue){
               if(!row.userName && !row.accNo){
                    return '-'
                }else{
                    var name = row.userName? row.userName +'  /': '  /';
                    var account= row.accNo? row.accNo : '-';
                    return name + account
                }
            }},
            { key: 'description', label: '类目',width:220},
            { key: 'rent', label: '金额',width:150},
            { key: 'pendingRent', label: '待支付租金',formatter:function(row,column,cellValue){
              return  tool.str.twoDecimal(row.pendingRent,2)
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox:false
        },
          form:{
            mediaId:'',
            keyWords:''
          },
      }
  },
  methods:{
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
        this.api_mediaManagePlatform_rentDetailList({data:this.form}).then(res=>{
          this.datagrid.List = res.content?res.content:[]
          this.datagrid.Pagination.total = res.totalCount
        })
      }
  },
  mounted(){
    if(!this.$route.query.mediaId){
      this.$router.push({path:'/mu/rent'})
    }else{
      this.form.mediaId = this.$route.query.mediaId
      this.init();
    }
  }
}
</script>
