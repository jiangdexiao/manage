<template>
  <div class="zlzj">
    <!--工具条-->
    <el-col :span="24" class="toolbar head">
      <el-form :inline="true"  >
        <el-form-item>
          <div class="mr ml">
            待结算金额统计（元）
            <el-tooltip class="item" effect="dark" content="租赁费用待结算金额的总和" placement="right-start">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <span>{{settleAmount}}元</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="mr ml">
            已结算金额累计（元）
            <el-tooltip class="item" effect="dark" content="租赁费用当前累计已结算金额的总和" placement="right-start">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <span>{{tradableAmount}}元</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search_params.correlationName" placeholder="输入客户名称" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="get_inout_info" >搜索</el-button>
          <el-button type="primary" size="medium" @click="derive_inout" >导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        datagrid: {
          List: [],
          FieldList: [
            { key: "correlationName", label: "客户名称" },
            { key: "settleAmount", label: "租赁待结算金额/元" },
            { key: "tradableAmount", label: "可用金额/元" },
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          ShowSummary: true,
          ShowSummaryMethod:(param)=>{
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
              if (index === 0) {
                sums[index] = '总计';
                return;
              }
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
                }, 0);
                sums[index] += ' 元';
              } else {
                sums[index] = 'N/A';
              }
            });
            return sums;
          },
          Checkbox: false
        },
        // 搜索参数
        search_params: {correlationName: ''},
        pagination:{pageNo:1, pageSize: 10},
        pageCount: 0,
        // 收支明细列表
        inout_list:[],
        loading: false,
        settleAmount:0,
        tradableAmount:0,
      }
    },
    watch:{
    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.get_inout_info()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.get_inout_info()
      },
      // 导出表格
      derive_inout () {
        let url = this.BASE_URL + 'm2c.trading/web/account/media/rent/detail/export?correlationName='+this.search_params.correlationName
        location.href=url
      },
      // 租赁资金概括
      get_account () {
        this.api_businessManagePlatform_rentAccount ({ 
          data:{
            token: sessionStorage.getItem("access_token")
          },
        }).then(res => {
          this.settleAmount = res.content.settleAmount
          this.tradableAmount = res.content.tradableAmount
        })
      },
      // 获取租赁资金列表
      get_inout_info () {
        this.api_businessManagePlatform_leaseList ({ 
          data: Object.assign({}, this.search_params,{
            pageNumber:this.datagrid.Pagination.current_page,
            rows:this.datagrid.Pagination.page_size,
            token: sessionStorage.getItem("access_token")
          }),
        }).then(res => {
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      },
      // 分页功能
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagination.pageSize = val
        this.get_inout_info()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagination.pageNo = val
        this.get_inout_info()
      }
    },
    mounted () {
      this.get_inout_info()
      this.get_account()
    },
    destroyed () {
      window.handle = null
    }
  }
</script>
<style lang="scss"  scoped>
.zlzj{
  .head {
    background-color: #fff;
    margin-bottom:10px;
  }
  .mr{
    margin-right:20px;
  }
  .ml{
    margin-left:40px;
  }
  .prompt {
    padding: 0 5px;
    color:#F5BD23;
    font-weight: 600;
    cursor: default;
  }
}

</style>