<template>
  <div class="m10jsgl">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :form="form" >
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.orderId" placeholder="请输入订单号（平台号）" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.dealerOrderId" placeholder="请输入商户订单号（订货号）" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="order_search_params.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option label="待付款" value=0></el-option>
            <el-option label="待发货" value=1></el-option>
            <el-option label="待收货" value=2></el-option>
            <el-option label="已完成" value=3></el-option>
            <el-option label="交易完成" value=4></el-option>
            <el-option label="交易关闭" value=5></el-option>
            <el-option label="已取消" value=-1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="order_search_params.afterSellStatus" placeholder="请选择售后状态" clearable>
            <el-option label="待商家同意" value=20></el-option>
            <el-option label="待顾客寄回商品" value=21></el-option>
            <el-option label="待商家确认退款" value=22></el-option>
            <el-option label="待商家发货" value=23></el-option>
            <el-option label="待顾客收货" value=24></el-option>
            <el-option label="售后已完成" value=25></el-option>
            <el-option label="售后已取消" value=26></el-option>
            <el-option label="商家已拒绝" value=27></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="order_search_params.commentStatus" placeholder="请选择评论状态" clearable>
            <el-option label="待评论" value=0></el-option>
            <el-option label="已评论" value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="order_search_params.payStatus" placeholder="请选择支付状态" clearable>
            <el-option label="未支付" value=0></el-option>
            <el-option label="已支付" value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="order_search_params.payWay" placeholder="请选择支付方式" clearable>
            <el-option label="支付宝" value=1></el-option>
            <el-option label="微信" value=2></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.goodsNameOrId" placeholder="请输入商品名称/编号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.shopName" placeholder="请输入店铺名称" class="form-input"></el-input>
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
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.userName" placeholder="请输入下单用户名/账号" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input @keydown.enter="get_refund_info" v-model="order_search_params.mediaOrResId" placeholder="请输入广告位ID/媒体ID" class="form-input"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" class='btn-search' @click="get_refund_info" >搜索</el-button>
          <el-button type="primary" size="medium" @click="reset" >重置搜索</el-button>
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
                { text: "详情", eventName: "clickDetails" }
              ]
            },
            { label: "订单号/商户订单号", formatter:function(row,column,cellValue){
              return row.orderId + '/'+ row.dealerOrderId
            }},
            { key: "orderStatusStr", label: "订单状态" },
            { key: "orderMoney", label: "订单总额/元" },
            { key: "userName", label: "下单用户" },
            { key: "payStatusStr", label: "支付状态" },
            { key: "shopName", label: "店铺名称" },
            { key: "createTime", label: "下单时间", width: 150, formatter:function(row,column,cellValue){
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

        form: {},
        // 搜索参数
        order_search_params: { orderId: '',  dealerOrderId: '',  orderStatus: '',  afterSellStatus: '',  commentStatus: '',  payStatus: '',  goodsNameOrId: '',  shopName: '', orderStartTime: '', orderEndTime: '', userName: '', mediaOrResId: ''},
      }
    },
    watch:{
      'time': {
        handler (val, oldVal) {
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            this.order_search_params.orderStartTime = ''
            this.order_search_params.orderEndTime = ''
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
      clickDetails (opts) {
        sessionStorage.setItem('dealerOrderId', opts.data.dealerOrderId)
        this.$router.push({path: '/m/orderList/orderDetails'})
      },
      // 重置搜索
      reset () {
        this.order_search_params = { orderId: '',  dealerOrderId: '',  orderStatus: '',  afterSellStatus: '',  commentStatus: '',  payStatus: '',  goodsNameOrId: '',  shopName: '', orderStartTime: '', orderEndTime: '', userName: '', mediaOrResId: ''}
        this.time = ''
      },
      // 获取退款查询列表
      get_refund_info () {
        if (this.time !== null && this.time !== '') {
          this.order_search_params.orderStartTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.order_search_params.orderEndTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNum = this.datagrid.Pagination.current_page
        this.api_businessManagePlatform_getOrderList ({ 
          data: Object.assign({}, this.order_search_params, this.form, {
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
