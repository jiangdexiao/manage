<template>
  <div class="m10jsgl">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form" >
        <el-form-item>
          <el-input v-model="inout_search_params.businessId" placeholder="订货/提现/售后号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="inout_search_params.inoutType" placeholder="请选择收支类型" clearable>
            <el-option label="收入" value="1"></el-option>
            <el-option label="支出" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="inout_search_params.businessType" placeholder="请选择业务类型" clearable>
            <el-option label="销售预收" value="1"></el-option>
            <el-option label="销售退款" value="2"></el-option>
            <el-option label="提现" value="3"></el-option>
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
            { key: "businessId", label: "业务号" },
            { key: "businessType", label: "业务类型", formatter: function (row,column,cellValue) {
              return row.businessType === 1 ? '销售预收' : row.businessType === 2 ? '销售退款' : row.businessType === 3 ? '提现' : '-'
            }},
            { key: "in", label: "收入/元" },
            { key: "out", label: "支出/元" },
            { key: "createDate", label: "生成时间", width: 150 },
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
              } else if (index === 1) {
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
        inout_search_params: {businessId: '', inoutType: '', businessType: '', startDate: '', endDate: ''},
        pagination:{pageNo:1, pageSize: 10},
        pageCount: 0,
        // 当前所处阶段(生成结算单)
        build_period: 'before',
        // 收支明细列表
        inout_list:[],
        // 计划生成的结算单数量总和
        order_select_all: 0,
        build_params: [],
        build_result: '生成成功',
        // 控制生成的模态框是否显示
        loading: false,
        time:''
      }
    },
    watch:{
      'time': {
        handler (val, oldVal) {
          let that = this
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            that.inout_search_params.startDate = ''
            that.inout_search_params.endDate = ''
          }
        },
        deep: true
      }
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
        let that = this
        if (that.time !== null && that.time !== '') {
          that.inout_search_params.startDate = that.date_format(new Date(that.time[0]),"yyyy-MM-dd")
          that.inout_search_params.endDate = that.date_format(new Date(that.time[1]),"yyyy-MM-dd")
        }
        let url = that.BASE_URL + 'm2c.trading/web/accounting/platform/inout/detail/export?businessId='+that.inout_search_params.businessId+'&inoutType='+'&access_token='+sessionStorage.getItem('access_token')+that.inout_search_params.inoutType+'&businessType='+that.inout_search_params.businessType+'&startDate='+that.inout_search_params.startDate+'&endDate'+that.inout_search_params.endDate
        location.href=url
      },
      // 获取资金明细列表
      get_inout_info () {
        if (this.time !== null && this.time !== '') {
          this.inout_search_params.startDate = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.inout_search_params.endDate = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.form.pageSize = this.datagrid.Pagination.page_size
        this.form.pageNo = this.datagrid.Pagination.current_page
        this.api_businessManagePlatform_getInoutDetail ({ 
          data: Object.assign({}, this.inout_search_params, this.form, {
            token: sessionStorage.getItem("access_token")
          }),
        }).then(res => {
          res.content.map((item,index)=> {
            if(item.type === '') {
              res.content[index].type = '商城销售'
            }
            if(item.inoutType == 1){
              item.in=item.amount
              item.out = (0).toFixed(2)
            } else {
              item.in=(0).toFixed(2)
              item.out = item.amount
            }
          })
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      },
      // 业务类型
      businessType (row, column) {
        if (row[column.property]== 1) {
          return '销售预收'
        }else if (row[column.property] == 2) {
          return '销售退款'
        } else if (row[column.property] == 3) {
          return '提现'
        }
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
          if (index === 2 || index === 3) {
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
        this.get_inout_info()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagination.pageNo = val
        this.get_inout_info()
      }
    },
    mounted () {
      let that = this
      that.get_inout_info()
    },
    destroyed () {
      window.handle = null
    }
  }
</script>
