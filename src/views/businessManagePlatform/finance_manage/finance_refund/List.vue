<template>
  <div class="m10jsgl">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form" >
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="refund_search_params.tradeNo" placeholder="输入流水号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="refund_search_params.afterSellOrderId" placeholder="输入商城售后号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="refund_search_params.dealerName" placeholder="输入客户名称" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="refund_search_params.userName" placeholder="输入收款人" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="refund_search_params.payWay" placeholder="请选择支付方式" clearable>
            <el-option label="支付宝" value="支付宝"></el-option>
            <el-option label="微信" value="微信"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="refund_search_params.refundStatus" placeholder="请选择退款状态" clearable>
            <el-option label="退款关闭" value="退款关闭"></el-option>
            <el-option label="退款成功" value="退款成功"></el-option>
            <!--<el-option label="" value="退款失败"></el-option>
            <el-option label="" value="退款中"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="time"
            width="350"
            :editable="false"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="get_refund_info" >搜索</el-button>
          <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
          <el-button type="primary" size="medium" @click="derive" >导出</el-button>
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
            { key: "tradeNo", label: "第三方流水号" },
            { key: "afterSellOrderId", label: "单号" },
            { key: "type", label: "类型" },
            { key: "refundAmount", label: "退款金额/元" },
            { key: "refundStatus", label: "退款状态" },
            { key: "payWay", label: "支付方式" },
            { key: "dealerName", label: "商家名称", formatter: function (row,column,cellValue) {
              return row.dealerName ==''?'-':row.dealerName
            }},
            { key: "userName", label: "收款人", formatter: function (row,column,cellValue) {
              return row.userName ==''?'-':row.userName
            }},
            { key: "createdTime", label: "退款时间", width: 150 },
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
                sums[index] = '合计'
                return
              } else if (index === 1 || index === 6 || index === 7) {
                return ''
              } 
              const values = data.map(item => Number(item[column.property]));
              if (!values.every(value => isNaN(value))) {
                sums[index] = (values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr
                  } else {
                    return prev
                  }
                }, 0)).toFixed(2)
              } else {
                sums[index] = ''
              }
            })
            return sums
          },
          Checkbox: false
        },
        form: {},
        // 搜索参数
        refund_search_params: {tradeNo: '', afterSellOrderId: '', dealerName: '', userName: '', payWay: '', refundStatus: '', startDate: '', endDate: ''},
       // 分页参数  
        pagination:{pageNo:1, pageSize: 10},
        pageCount: 0,
        refund_list: [],
        // 当前所处阶段(生成结算单)
        build_period: 'before',
        // 计划生成的结算单数量总和
        order_select_all: 0,
        build_params: [],
        build_result: '生成成功',
        // 控制生成的模态框是否显示
        loading: false,
        myText:'-',
        time:''
      }
    },
    watch:{
      'time': {
        handler (val, oldVal) {
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            this.refund_search_params.startDate = ''
            this.refund_search_params.endDate = ''
          }
        },
        deep: true
      }
    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.get_refund_info()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.get_refund_info()
      },
      // 导出表格
      derive () {
        let that = this
        if (that.time !== null && that.time !== '') {
          that.refund_search_params.startDate = that.date_format(new Date(that.time[0]),"yyyy-MM-dd")
          that.refund_search_params.endDate = that.date_format(new Date(that.time[1]),"yyyy-MM-dd")
        }
        let url = that.BASE_URL + 'm2c.trading/web/order/pay/orderrefundexportexcel?token='+sessionStorage.getItem('access_token')+'&access_token='+sessionStorage.getItem('access_token')+'&tradeNo='+that.refund_search_params.tradeNo+'&afterSellOrderId='+that.refund_search_params.afterSellOrderId+'&dealerName='+that.refund_search_params.dealerName+'&userName='+that.refund_search_params.userName+'&payWay='+that.refund_search_params.payWay+'&refundStatus='+that.refund_search_params.refundStatus+'&startDate='+that.refund_search_params.startDate+'&endDate='+that.refund_search_params.endDate
        location.href=url
      },
      // 重置搜索
      reset () {
        this.refund_search_params={tradeNo: '', afterSellOrderId: '', dealerName: '', userName: '', payWay: '', refundStatus: '', startDate: '', endDate: ''}
        this.time = ''
      },
      // 获取退款查询列表
      get_refund_info () {
        if (this.time !== null && this.time !== '') {
          this.refund_search_params.startDate = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.refund_search_params.endDate = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.form.pageSize = this.datagrid.Pagination.page_size
        this.form.pageNo = this.datagrid.Pagination.current_page
        this.api_businessManagePlatform_getRefund ({ 
          data: Object.assign({}, this.refund_search_params, this.form, {
            token: sessionStorage.getItem("access_token")
          }),
        }).then(res => {
          res.content.map((item,index)=> {
            if(item.type === '') {
              res.content[index].type = '商城销售'
            }
          })
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      },
      // 表格总计方法
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          // const values = column[3]
          // console.log(values)
          if (index === 3) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0).toFixed(2);
            sums[index]
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      // 分页功能
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagination.pageSize = val
        this.get_refund_info()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagination.pageNo = val
        this.get_refund_info()
      }
    },
    mounted () {
      let that = this
      that.get_refund_info()

    },
    destroyed () {
      window.handle = null
    }
  }
</script>
