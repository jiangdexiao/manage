<template>
  <div class="m10jsgl">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="instr_search_params" >
        <el-form-item>
          <el-input @keydown.enter="get_instr_info" v-model="instr_search_params.ticketNo" placeholder="请输入票据号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_instr_info" v-model="instr_search_params.withdrawNo" placeholder="请输入提现号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_instr_info" v-model="instr_search_params.ticketOutUnit" placeholder="出票单位" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_instr_info" v-model="instr_search_params.ticketInUnit" placeholder="收票单位" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="instr_search_params.businessType" placeholder="业务类型" clearable>
            <!--5、业务类型，必选，包含全部，收入类型-进项发票，费用类型-进项发票，费用类型-->
            <el-option label="全部" value=0></el-option>
            <el-option label="收入类型-进项发票" value=1></el-option>
            <el-option label="费用类型-进项发票" value=2></el-option>
            <el-option label="费用类型" value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!--6、发票类型，必选，包含全部，增值税专用发票、增值税普通发票、其他发票-->
          <el-select v-model="instr_search_params.ticketType" placeholder="发票类型" clearable>
            <el-option label="全部" value=20></el-option>
            <el-option label="增值税专用发票" value=21></el-option>
            <el-option label="增值税普通发票" value=22></el-option>
            <el-option label="其他发票" value=23></el-option>
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
          <el-button type="primary" size="medium" class='btn-search' @click="get_instr_info" >搜索</el-button>
          <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
          <el-button type="primary" size="medium" >新增录入</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @clickDetails="clickDetails"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
  </div>
</template>

<script>
  import { tool } from "../../../../utils/"
  export default {
    name: '',
    data () {
      return {
        datagrid: {
          List: [],
          FieldList: [
            {
              type: "operate",
              label: "操作",
              width: 130,
              btns: [
                { text: "详情", eventName: "clickDetails" },
                { text: "编辑", eventName: "clickEdit" },
                { text: "删除", eventName: "clickDelete" },
              ]
            },
            { label: "票据号", formatter:function(row,column,cellValue){
              return row.orderId + '/'+ row.dealerOrderId
            }},
             { label: "提现号", formatter:function(row,column,cellValue){
              return row.orderId + '/'+ row.dealerOrderId
            }},
            { label: "业务类型", formatter:function(row,column,cellValue){
              return row.orderId + '/'+ row.dealerOrderId
            }},
            { key: "orderStatusStr", label: "出票单位" },
            { key: "orderStatusStr", label: "收票单位" },
            { key: "orderMoney", label: "票面总额/元" },
            { key: "createTime", label: "录入时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.createTime,'yyyy-MM-dd hh:mm')
            }},
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          },
          Checkbox: false
        },
        time: '',
        // 搜索参数
        instr_search_params: { ticketNo: '',  withdrawNo: '',  ticketOutUnit: '',  ticketInUnit: '',  businessType: '',  ticketType: '',  startTime: '',  endTime: ''},
      }
    },
    watch:{
      'time': {
        handler (val, oldVal) {
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            this.instr_search_params.startTime = ''
            this.instr_search_params.endTime = ''
          }
        },
        deep: true
      }
    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.get_instr_info()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.get_instr_info()
      },
      clickDetails (opts) {
        // sessionStorage.setItem('dealerOrderId', opts.data.dealerOrderId)
        this.$router.push({path: '/m/orderList/orderDetails'})
      },
      // 重置搜索
      reset () {
        this.instr_search_params = { ticketNo: '',  withdrawNo: '',  ticketOutUnit: '',  ticketInUnit: '',  businessType: '',  ticketType: '',  startTime: '',  endTime: ''}
        this.time = ''
      },
      // 获取票据列表说
      get_instr_info () {
        if (this.time) {
          this.instr_search_params.startTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.instr_search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.api_businessManagePlatform_getInstrList ({ 
          data: Object.assign({}, this.instr_search_params, {
            pageNumber:this.datagrid.Pagination.current_page,
            rows:this.datagrid.Pagination.page_size,
            token: sessionStorage.getItem("access_token")
          }),
        }).then(res => {
          if (res.content === '') {
            this.datagrid.List = []
            this.datagrid.Pagination.total = res.totalCount
          } else {
            console.log(res.content)
            this.datagrid.List = res.content
            this.datagrid.Pagination.total = res.totalCount
          }
        })
      },
      // 分页功能
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagination.pageSize = val
        this.get_instr_info()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagination.pageNo = val
        this.get_instr_info()
      }
    },
    mounted () {
      let that = this
      that.get_instr_info()

    },
    destroyed () {
      window.handle = null
    }
  }
</script>
