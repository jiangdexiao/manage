<template>
  <div class="clearing">
    <el-tabs v-model="statu.wdStatus" @tab-click="handleClick" class= 'marl' v-show="tableOrDetails.table">
      <el-tab-pane label="待结算" name="1">
        <el-col :span="24" class="toolbar">
          <el-form :inline="true" :form="search_params">
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.settleId" placeholder="输入提现号" class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.dealerOrderId" placeholder="输入订货号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.tradeNo" placeholder="输入第三方流水号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.customerName" placeholder="输入客户名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search_params.orderCompleted" placeholder="选择是否可结算" clearable v-if="Number(search_params.settleStatus)===1">
                <el-option label="可结算" value="2"></el-option>
                <el-option label="不可结算" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search_params.payWay" placeholder="选择支付方式" clearable>
                <el-option label="微信" value="2"></el-option>
                <el-option label="支付宝" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                unlink-panels
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
              <el-button type="primary" size="medium" class='btn-search' @click="get_Pending_info" >搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <div style="height:120px;"></div>
        <list-data
          ref='list-data'
          @clickOperate="clickOperate"
          @clickSettleId="clickSettleId"
          @onSelectionChange="handleSelectionChange"
          @batchSettleChecked="batchSettleChecked"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagrid'>
        </list-data>
      </el-tab-pane>
      <el-tab-pane label="已结算" name="2">
        <el-col :span="24" class="toolbar">
          <el-form :inline="true" :form="search_params">
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.settleId" placeholder="输入结算号" class="form-input"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.dealerOrderId" placeholder="输入订货号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.tradeNo" placeholder="输入第三方流水号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input @keydown.enter="get_Pending_info" v-model="search_params.customerName" placeholder="输入客户名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search_params.payWay" placeholder="选择支付方式" clearable>
                <el-option label="微信" value="2"></el-option>
                <el-option label="支付宝" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                unlink-panels
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
              <el-button type="primary" size="medium" class='btn-search' @click="get_Pending_info" >搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <div style="height:95px;"></div>
        <list-data
          ref='list-data'
          @clickOperate="clickOperate"
          @clickSettleId="clickSettleId"
          @onChangeCurrentPage="onChangeCurPage"
          @onChangePageSize="onChangeCurPageSize"
          :DataGrid = 'datagridSettle'>
        </list-data>
      </el-tab-pane>
    </el-tabs>
    <div class="details_style" v-show="tableOrDetails.details">
      <div class="details_style_content">
        <ul>
          <li>结算号：<span>{{show_params.settleId}}</span></li>
          <li>第三方流水号：<span>{{show_params.tradeNo}}</span></li>
          <li>生成时间：<span>{{show_params.createdTime}}</span></li>
          <li v-if="search_params.settleStatus===2">结算状态：<span>{{show_params.settleStatus===1?'待结算':'已结算'}}</span></li>
        </ul>
        <ul>
          <li>订货号：<span>{{show_params.dealerOrderId}}</span></li>
          <li>支付方式：<span>{{show_params.payWay===1?'支付宝':'微信'}}</span></li>
          <li v-if="search_params.settleStatus===1">结算状态：<span>{{show_params.settleStatus===1?'待结算':'已结算'}}</span></li>
          <li v-if="search_params.settleStatus===2">更新时间<span>{{show_params.updatedTime}}</span></li>
          <li v-if="search_params.settleStatus===2">结算人：<span>{{show_params.updatedUserName}}</span></li>
        </ul>
        <div class="remark">
          备注： <span v-show="!textarea_show">{{remark}}</span>
          <div class="textarea_button" v-show="textarea_show">
            <textarea name="" id="" cols="120" v-model="remark" style="resize:none;margin-top:5px;height:36px;"></textarea>
            <button class="save_button" @click="remark_edit">保存</button>
            <button class="save_cancel" @click="cancle_remark_edit">取消</button>
          </div>
          <i class="el-icon-edit-outline" @click="textarea_edit" v-show="!textarea_show" v-if="show_params.settleStatus===1"></i>
        </div>
        <div class="tableBox" style="margin-left:0px;">
          <el-table
            :data="SettleInfo_list"
            stripe
            border
            style="margin-top: 50px">
            <el-table-column
              prop="correlationName"
              label="客户名称">
            </el-table-column>
            <el-table-column
              prop="correlationType"
              label="角色"
              :formatter="change_dealerName">
            </el-table-column>
            <el-table-column
              prop="saleCutsAmount"
              label="销售分成/元">
            </el-table-column>
             <el-table-column
              prop="activityAmount"
              label="满减分摊/元"
              :render-header="headerRender">
            </el-table-column>
            <el-table-column
              prop="couponShareAmount"
              label="优惠券分摊/元"
              :render-header="headerRenderShare">
            </el-table-column>
            <el-table-column
              prop="settleAmount"
              label="销售结算金额/元">
            </el-table-column>
          </el-table>
        </div>
        <!-- <div class="total">结算总额{{total_Amount}}元</div> -->
        <button class="sumbit_button" v-if="show_params.settleStatus===1&&show_params.orderCompleted===2" @click="settleOpen(show_params.settleId)">确认结算</button>
        <button class="cancel_button" @click="cancel_back">返回</button>
      </div>
    </div>

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
              width: 80,
              btns: [
                { text: "详情", eventName: "clickOperate", },
                { text: "结算", type: "danger", eventName: "clickSettleId", condition:function({data}){ return parseInt(data.orderCompleted) === 2}}
              ]
            },
            { key: "settleId", label: "结算号", width: 80, tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.settleId, 5)
            }},
            { key: "dealerOrderId", label: "订货号", width: 200 },
            { key: "tradeNo", label: "第三方流水号", width: 300 },
            { key: "goodsTotalAmount", label: "订货金额/元" },
            { key: "afterSellAmount", label: "售后金额/元" },
            { key: "settleTotalAmount", label: "结算金额/元" },
            { key: "payWay", label: "支付方式", formatter: function (row,column,cellValue) {
              return row.payWay === 1 ? '支付宝' : row.payWay === 2 ? '微信' : '-'
            }},
            { key: "createdTime", label: "生成时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.createdTime,'yyyy-MM-dd hh:mm')
            }}
          ],
          ToolBar: [
            { text: "批量结算", eventName: "batchSettleChecked" }
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          }
        },
        datagridSettle: {
          List: [],
          FieldList: [
            {
              type: "operate",
              label: "操作",
              width: 80,
              btns: [
                { text: "详情", eventName: "clickOperate", }
              ]
            },
            { key: "settleId", label: "结算号", width: 80, tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.settleId, 5)
            }},
            { key: "dealerOrderId", label: "订货号", width: 200  },
            { key: "tradeNo", label: "第三方流水号", width: 300  },
            { key: "goodsTotalAmount", label: "订货金额/元" },
            { key: "afterSellAmount", label: "售后金额/元" },
            { key: "settleTotalAmount", label: "结算金额/元" },
            { key: "payWay", label: "支付方式", formatter: function (row,column,cellValue) {
              return row.payWay === 1 ? '支付宝' : row.payWay === 2 ? '微信' : '-'
            }},
            { key: "createdTime", label: "更新时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.updatedTime,'yyyy-MM-dd hh:mm')
            }}
          ],
          Pagination: {
            current_page: 1,
            page_size: 10,
            total: 0
          }
        },
        form: {},
        // 日期参数
        time: '',
        // 控制文本输入
        canEdit: false,
        // 控制文本输入是否显示
        textarea_show: false,
        // 详情控制页
        tableOrDetails: {table: true, details: false},
        // 搜索参数
        fullscreenLoading: false,
        search_params: {settleId: '', dealerOrderId: '', tradeNo: '', customerName: '', payWay: '', startDate: '', endDate: '', settleStatus: 1, orderCompleted: ''},
        show_params: {settleId: '', dealerOrderId: '', tradeNo: '', createdTime: '', payWay: '', settleStatus: 1, orderCompleted: '', updatedTime: '', updatedUserName: ''},
        statu:{wdStatus: '1'},
        // 分页参数
        pagination:{pageNumber:1, pageNumber1:1, rows: 10},
        pageCount: 0,
        // 待结算列表
        Pending_list:[],
        // 结算备注
        remark: '',
        // 另存备注
        other_remark:'',
        // 已结算列表
        Settlement_list: [],
        // 结算详情
        SettleInfo_list: [],
        // 批量结算列表
        settleIdList: [],
        // 结算总金额
        total_Amount: 0,
        // 自己查询详情
        Amount_info: {
          totalSettleAmount: '', //总待结算金额
          salerSettleAmount: '', //促销员待结算金额
          dealerSettleAmount: '', //商家待结算金额
          meidaSettleAmount: '', //媒体待结算金额
          platformSettleAmount: '', //平台待结算金额
          bdSettleAmount: '', //BD待结算金额
          totalTradableAmount: '', //总可用金额
          salerTradableAmount: '', //促销员待结算金额
          dealerTradableAmount: '', //商家待结算金额
          meidaTradableAmount: '', //媒体待结算三金额
          platformTradableAmount: '', //平台待结算金额
          bdTradableAmount: '', //BD待结算金额
          totalAdvancePayment: '', //总预收款金额
          alipaylAdvancePayment: '', //支付宝预收款金额
          wechatAdvancePayment: '' //微信预收款金额
        }
      }
    },
    watch: {
      'time': {
        handler (val, oldVal) {
          let that = this
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            that.search_params.startDate = ''
            that.search_params.endDate = ''
          }
        },
        deep: true
      }
    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.get_Pending_info()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size = pageSize
        this.get_Pending_info()
      },
      headerRender (h,{column,index}) {
        return <el-tooltip placement="right" content="满减活动，需要承担的活动成本">
                <span>满减分摊/元 <i class="iconfont icon-ico_explain"></i></span>
              </el-tooltip>
      },
      headerRenderShare (h,{column,index}) {
        return <el-tooltip placement="right" content="使用优惠券，需要承担的活动成本">
                <span>优惠券分摊/元 <i class="iconfont icon-ico_explain"></i></span>
              </el-tooltip>
      },
      handleClick (tab, event) {
        this. pagination.pageNumber = 1
        this.time = ''
        this.search_params = {settleId: '', dealerOrderId: '', tradeNo: '', customerName: '', payWay: '', startDate: '', endDate: '', settleStatus: 1, orderCompleted: ''}
        if (tab.name === '1') {
          this.search_params.settleStatus = 1
          this.get_Pending_info()
        } else {
          this.search_params.settleStatus = 2
          this.get_Pending_info()
        }
      },
      // 供应商名字显示为商家
      change_dealerName (row, column) {
        if (row[column.property] == '供应商 ') {
          return '商家'
        } else {
          return row[column.property]
        }
      },
      // 详情备注编辑
      textarea_edit () {
        this.textarea_show = true
      },
      // 批量选中
      handleSelectionChange(val) {
        console.log(233)
        console.log(val)
        this.settleIdList = val.datas
      },
      // 批量结算
      batchSettleChecked () {
        console.log(this.settleIdList)
        if (this.settleIdList.length === 0) {
          this.$message({ type: "warning", message: "请选择一项" })
          return
        } else {
          console.log(this.settleIdList)
          let settleId = []
          for (let i = 0; i< this.settleIdList.length; i++) {
            settleId.push(this.settleIdList[i].settleId)
          }
          settleId = settleId.join(',')
          console.log(settleId)
          this.settleOpen(settleId)
        }
      },
      // 详情信息
      get_detail_info (settleId) {
        this.api_businessManagePlatform_getDetails ({ 
          data: {
            settleId: settleId,
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          }, 
        }).then(res => {
          this.SettleInfo_list = res.content
        })
        this.remark_get(settleId)
      },
      // 表格上点详情
      clickOperate(opts) {
        let url = ''
        this.show_params.settleStatus = this.search_params.settleStatus
        this.show_params.settleId = opts.data.settleId
        this.show_params.dealerOrderId = opts.data.dealerOrderId
        this.show_params.tradeNo = opts.data.tradeNo
        this.show_params.createdTime = this.tool.date.format(new Date(opts.data.createdTime), 'yyyy-MM-dd hh:mm:ss')
        this.show_params.payWay = opts.data.payWay
        this.show_params.updatedUserName = opts.data.updatedUserName
        this.show_params.orderCompleted = opts.data.orderCompleted
        this.show_params.updatedTime = this.tool.date.format(new Date(opts.data.updatedTime), 'yyyy-MM-dd hh:mm:ss')
        this.tableOrDetails.table = false
        this.tableOrDetails.details = true
        this.total_Amount = opts.data.settleTotalAmount
        console.log(opts.data.settleId)
        this.get_detail_info(opts.data.settleId)
      },
      // 表格上点结算
      clickSettleId (opts) {
        this.settleOpen(opts.data.settleId)
      },
      // 详情返回
      cancel_back () {
        this.tableOrDetails.table = true
        this.tableOrDetails.details = false
      },
      // 结算弹窗
      settleOpen (settleId) {
        this.$confirm('是否确认结算 ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api_businessManagePlatform_toSettle ({ 
            data: {
              token: JSON.parse(sessionStorage.getItem('userInfo')).token,
              settleIdList: settleId,
              updatedUserId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
              updatedUserName: JSON.parse(sessionStorage.getItem('userInfo')).name
            },
          }).then(res => {
            this.get_Pending_info()
            this.show_params.settleStatus = 2
            this.$message ({
              type: 'success',
              message: '结算成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消结算'
          })     
        })
      },
      // 获取待结算列表
      get_Pending_info (){
        this.fullscreenLoading = true
        if (this.time !== null && this.time !== '') {
          this.search_params.startDate = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.search_params.endDate = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.form.rows = this.datagrid.Pagination.page_size
        this.form.pageNumber = this.datagrid.Pagination.current_page
        this.api_businessManagePlatform_PendingList({ 
          data: Object.assign({}, this.form, this.search_params, {
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          }),
        }).then(res => {
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
          this.datagridSettle.List = res.content
          this.datagridSettle.Pagination.total = res.totalCount
        })
      },
      // 分页功能
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`)
        this.pagination.rows = val
        this.get_Pending_info()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        switch(this.search_params.settleStatus)
        {
          case 1:
            this.pagination.pageNumber1 = val
            break
          case 2:
            this.pagination.pageNumber2 = val
            break
        }
        this.get_Pending_info()
      },
      // 查询结算备注
      remark_get (settleId) {
        this.api_businessManagePlatform_getRemark ({ 
          data: {
            settleId: settleId,
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          },
        }).then(res => {
          if (res.content.remark !== null) {
            this.remark = res.content.remark
            this.other_remark = res.content.remark
          } else {
            this.remark = ''
            this.other_remark = ''
          }
        })
      },
      // 修改结算备注
      remark_edit () {
        if (this.remark.length>50){
          this.$message({
            type: 'warning',
            message: '备注长度不超过50个字符！'
          })
          return
        }
        this.api_businessManagePlatform_remarkUpdate ({ 
          data: {
            token: JSON.parse(sessionStorage.getItem('userInfo')).token,
            settleId: this.show_params.settleId,
            remark: this.remark
          },
        }).then(res => {
          this.textarea_show = false
          this.other_remark = this.remark 
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        })
      },
      // 取消保存备注
      cancle_remark_edit() {
        this.remark = this.other_remark
        this.textarea_show=false
        // this.remark_get(this.show_params.settleId)
      }
    },
    mounted () {
      this.get_Pending_info()
    }
  }
</script>

<style lang="scss" scoped>
.clearing{
  .tableBox{
    width:100%;
    .batch_settle_content {
      text-align: left;
      .batch_settle {
        margin: 10px;
        width: 120px;
        border: none;
        height: 40px;
        background: #5295FF;
        border-radius: 4px;
        color: #fff;
      }
    }
  }
  .marl{
    // width:95%;
    // margin:0px 30px;
    // .el-date-editor .el-range-input {
    //   display: inline;
    // }
    .search{
      background-color: #fff;
      padding-bottom: 20px;
      margin:0;
      .toggle_type{
        padding-top: 25px;
        border-bottom: 1px solid #ccc;
        li{
            width:100px;
            height: 30px;
            // line-height: 28px;
            text-align: center;
            float: left;
            font-size: 16px;
            transform: translateY(2px);
        }
        li.active{
            border-bottom:4px solid #60AEF6;
        }
    }
    .search_cell{
        margin-left:20px;
        .search_input{
            // width:220px;
        }
      }
    }
  }
  .details_style {
    margin-top: 10px;
    padding: 20px 30px;
    background: #fff;
    height: 100%;
    .remark {
      margin-top: 10px;
    }
    .details_style_content {
      position: relative;
      span {
        margin-left: 20px;
        color: #8C97A8;
      }
      i {
        font-size: 20px;
      }
      ul {
        width: 50%;
        padding: 0px;
        float: left;
        font-size: 14px;
        li {
          list-style: none;
          line-height: 30px;
        }
      }
      .textarea_button {
        position: relative;
        textarea {
          position: absolute;
          top: -30px;
          left: 60px;
        }
        .save_button {
          border: none;
          background: #5295FF;
          color: #fff;
          width: 50px;
          height: 20px;
          position: absolute;
          top: 20px;
          left: 750px;
          border-radius: 4px;
        }
        .save_cancel {
          border: 1px solid #000;
          background: #fff;
          color: #000;
          width: 50px;
          height: 20px;
          position: absolute;
          border-radius: 4px;
          top: 20px;
          left: 810px;
        }
      }
    }
    .total {
      text-align: right;
      padding-right: 100px;
      font-size: 14px;
      font-weight: 700;
      margin-top: 30px;
    }
    .sumbit_button {
      margin-top: 60px;
      width: 120px;
      height: 40px;
      border: none;
      background: #5295FF;
      border-radius: 4px;
      color: #fff;
    }
    .cancel_button {
      margin-top: 60px;
      margin-left: 60px;
      width: 120px;
      height: 40px;
      border: 1px solid #000;
      background: #fff;
      border-radius: 4px;
    }
  }
}
.modal-open{
  #build{display:flex}
  #build.in{z-index:2000}
}
</style>
