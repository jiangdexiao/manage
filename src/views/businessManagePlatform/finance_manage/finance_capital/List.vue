<template>
  <div class="funds_enquiries">
    <div class="content_list">
      <div class="funds_enquiries_top">
        <div class="detail_total">
          <div>预收款统计（元）
            <el-tooltip class="item" effect="dark" content="预收货款的金额，预收款=待结算金额+可用金额+提现中金额" placement="right">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <div class="total_amount">&nbsp;&nbsp;&nbsp;{{Amount_info.totalAdvancePayment}}</div>元
          </div>
        </div>
        <div class="detail_content">
          <div class="detail_public">
            待结算统计（元）
            <el-tooltip class="item" effect="dark" content="顾客付款后，待平台结算的金额" placement="right-start">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <span class="detail_hover" @mouseover="isShow=true" @mouseout="isShow=false"><i class="iconfont icon-xiangxi"></i>详细</span>
            <p>{{Amount_info.totalSettleAmount}}</p>
            <div class="detail_hover_content" v-if="isShow">
              <div class="content_header">
                商城销售
                <span>下载/注册</span>
              </div>
              <div class="content_middle">
                商家
                <div class="content_right_float">--</div>
                <div class="content_middle_float">{{Amount_info.dealerSettleAmount}}元</div>
              </div>
              <div class="content_platform">
                <div class="content_middle">
                  平台
                  <div class="content_right_float">--</div>
                  <div class="content_middle_float">{{Amount_info.platformSettleAmount}}元</div>
                </div>
                <div class="platform_detail">
                  <ul style="float:left;">
                    <li>媒体</li>
                    <li>促销员</li>
                    <li>BD专员</li>
                    <li>美图溪</li>
                  </ul>
                  <ul class="content_right_float" style="text-align:right;">
                    <li>{{Amount_info.mediaDownloadRegSettleAmount}}元</li>
                    <li>{{Amount_info.salerDownloadRegSettleAmount}}元</li>
                    <li>{{Amount_info.bdDownloadRegSettleAmount}}元</li>
                    <li>{{Amount_info.platformDownloadRegSettleAmount}}元</li>
                  </ul>
                  <ul class="content_middle_position">
                    <li>{{Amount_info.meidaSettleAmount}}元</li>
                    <li>{{Amount_info.salerSettleAmount}}元</li>
                    <li>{{Amount_info.bdSettleAmount}}元</li>
                    <li>{{Amount_info.mtxSettleAmount}}元</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="detail_public" style="margin: 0 7px;">
            可用金额统计（元）
            <el-tooltip class="item" effect="dark" content="已结算的金额，可用金额可提现" placement="right-start">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <span class="detail_hover" @mouseover="isSettleAmountShow=true" @mouseout="isSettleAmountShow=false"><i class="iconfont icon-xiangxi"></i>详细</span>
            <p>{{Amount_info.totalTradableAmount}}</p>
            <div class="detail_hover_content" style="width:230px;" v-if="isSettleAmountShow">
              <div class="content_middle">
                商家
                <div class="content_right_float">{{Amount_info.dealerTradableAmount}}元</div>
              </div>
              <div class="content_platform">
                <div class="content_middle">
                  平台
                  <div class="content_right_float">{{Amount_info.platformTradableAmount}}元</div>
                </div>
                <div class="platform_detail">
                  <ul style="float:left;">
                    <li>媒体</li>
                    <li>促销员</li>
                    <li>BD专员</li>
                    <li>美图溪</li>
                  </ul>
                  <ul class="content_right_float" style="text-align:right;">
                    <li>{{Amount_info.meidaTradableAmount}}元</li>
                    <li>{{Amount_info.salerTradableAmount}}元</li>
                    <li>{{Amount_info.bdTradableAmount}}元</li>
                    <li>{{Amount_info.mtxTradableAmount}}元</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="detail_public">
            提现中金额统计（元）
            <el-tooltip class="item" effect="dark" content="待财务处理的提现金额" placement="right-start">
              <span class="prompt"><i class="iconfont icon-ico_explain"></i></span>
            </el-tooltip>
            <span class="detail_hover" @mouseover="isTradableingShow=true" @mouseout="isTradableingShow=false"><i class="iconfont icon-xiangxi"></i>详细</span>
            <p>{{Amount_info.totalTradableingAmount}}</p>
            <div class="detail_hover_content" style="width:230px;" v-if="isTradableingShow">
              <div class="content_middle">
                商家
                <div class="content_right_float">{{Amount_info.dealerTradableingAmount}}元</div>
              </div>
              <div class="content_platform">
                <div class="content_middle">
                  平台
                  <div class="content_right_float">{{Amount_info.platformTradableingAmount}}元</div>
                </div>
                <div class="platform_detail">
                  <ul style="float:left;">
                    <li>媒体</li>
                    <li>促销员</li>
                    <li>BD专员</li>
                    <li>美图溪</li>
                  </ul>
                  <ul class="content_right_float" style="text-align:right;">
                    <li>{{Amount_info.meidaTradableingAmount}}元</li>
                    <li>{{Amount_info.salerTradableingAmount}}元</li>
                    <li>{{Amount_info.bdTradableingAmount}}元</li>
                    <li>{{Amount_info.mtxTradableingAmount}}元</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="business_circle">
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :form="form" >
              <el-form-item>
                <el-input placeholder="请输入客户名称" @keydown.enter="get_gether_info" v-model="search_params.amountName" class="form-input"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="search_params.amountType" placeholder="选择角色" clearable>
                  <el-option label="促销员" value="1"></el-option>
                  <el-option label="商家" value="2"></el-option>
                  <el-option label="媒体" value="3"></el-option>
                  <el-option label="平台" value="4"></el-option>
                  <el-option label="BD专员" value="6"></el-option>
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
                <el-button type="primary" size="medium" class='btn-search' @click="get_gether_info" >搜索</el-button>
                <el-button type="primary" size="medium" @click="derive" >导出</el-button>
              </el-form-item>
            </el-form>
        </el-col>
        <div class="search choose">
          <list-data
            ref='list-data'
            @onChangeCurrentPage="onChangeCurPage"
            @onChangePageSize="onChangeCurPageSize"
            :DataGrid = 'datagrid'>
          </list-data>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      time:'',
      datagrid: {
        List: [],
        FieldList: [
          { key: "correlationId", label: "客户ID" },
          { key: "correlationName", label: "客户名称" },
          { key: "correlationType", label: "所属角色" },
          { key: "settleAmount", label: "待结算金额/元" },
          { key: "tradableAmount", label: "可用金额/元" },
          { key: "tradableingAmount", label: "提现中金额/元" },
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
              } else if (index === 1 || index === 2) {
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
      search_params: { amountName: "", amountType: "",startDate:'',endDate:'' },
      // 分页参数
      pagination: { pageNumber: 1, rows: 10 },
      pageCount: 0,
      isShow: false,
      isSettleAmountShow: false,
      isTradableingShow: false,
      // 收款列表
      gether_list: [],
      // 自己查询详情
      Amount_info: {
        totalSettleAmount: "", //总待结算金额
        salerSettleAmount: "", //促销员待结算金额
        dealerSettleAmount: "", //商家待结算金额
        meidaSettleAmount: "", //媒体待结算金额
        platformSettleAmount: "", //平台待结算金额
        bdSettleAmount: "", //BD待结算金额
        mtxSettleAmount: "",//美图溪待结算金额
        totalTradableAmount: "", //总可用金额
        salerTradableAmount: "", //促销员待结算金额
        dealerTradableAmount: "", //商家可用金额
        meidaTradableAmount: "", //媒体可用金额
        platformTradableAmount: "", //平台可用金额
        bdTradableAmount: "", //BD可用金额
        mtxTradableAmount: "",//美图溪可用金额
        totalAdvancePayment: "", //总预收款金额
        alipaylAdvancePayment: "", //支付宝预收款金额
        wechatAdvancePayment: "",//微信预收款金额
        totalTradableingAmount: "", //总提现中金额
        salerTradableingAmount: "", //促销员提现中金额
        dealerTradableingAmount: "", //商家提现中金额
        meidaTradableingAmount: "", //媒体提现中金额
        platformTradableingAmount: "", //平台提现中金额
        bdTradableingAmount: "", //BD提现中金额
        mtxTradableingAmount: "",//美图溪提现中金额
        mediaDownloadRegSettleAmount: "",//媒体下载分成
        salerDownloadRegSettleAmount: "",//促销员下载分成
        bdDownloadRegSettleAmount: "",//BD下载分成
        platformDownloadRegSettleAmount: "",//美图溪下载分成
      }
    };
  },
   watch:{
      'time': {
        handler (val, oldVal) {
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            this.search_params.startDate = ''
            this.search_params.endDate = ''
          }
        },
        deep: true
      }
    },
  methods: {
    // 供应商名字显示为商家
    change_dealerName(row, column) {
      if (row[column.property] == "供应商 ") {
        return "商家";
      } else {
        return row[column.property];
      }
    },
    // 导出表格
    derive() {
      let that = this
      let perms = sessionStorage.getItem('perms') // 权限
      if (perms.indexOf('trading:platformAmount:export') === -1) {
        that.show_tip('无权限访问接口!')
        return
      } else {
        if (that.time !== null && that.time !== '') {
          that.search_params.startDate = this.tool.date.format(new Date(that.time[0]),"yyyy-MM-dd")
          that.search_params.endDate = this.tool.date.format(new Date(that.time[1]),"yyyy-MM-dd")
          // 判断时间搜索区间是否超过一年
          if (this.time[1]-this.time[0] > 31536000000) {
            this.$message({
            message: '查询的时间跨度不超过一年！',
            type: 'warning'
          });
            return 
          }
        }
        let url = that.BASE_URL + 'm2c.trading/web/account/platform/admin/amountList.export?token='+sessionStorage.getItem('access_token')+'&access_token='+sessionStorage.getItem('access_token')+'&amountName='+that.search_params.amountName+'&amountType='+ that.search_params.amountType +'&startDate=' +that.search_params.startDate  +'&endDate=' +that.search_params.endDate
        location.href=url
      }
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.get_gether_info()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size = pageSize
      this.get_gether_info()
    },
    // 获取收款列表
    get_gether_info() {
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      if (this.time !== null && this.time !== '') {
        this.search_params.startDate = this.tool.date.format(new Date(this.time[0]),"yyyy-MM-dd")
        this.search_params.endDate = this.tool.date.format(new Date(this.time[1]),"yyyy-MM-dd")
        // 判断时间搜索区间是否超过一年
        if (this.time[1]-this.time[0] > 31536000000) {
          this.$message({
          message: '查询的时间跨度不超过一年！',
          type: 'warning'
        });
          return 
        }
      }
      this.api_businessManagePlatform_getAmountList ({ 
        data: Object.assign({}, this.search_params, this.form, {
          token: sessionStorage.getItem("access_token")
        }),
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    // 表格总计方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (index !== 1) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)
            .toFixed(2);
          sums[index];
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
  },
  mounted() {
    this.api_businessManagePlatform_getAmountDetails ({ 
      data: {
        token: sessionStorage.getItem("access_token")
      },
    }).then(res => {
      this.Amount_info = res.content
    })
    this.get_gether_info()
  }
}
</script>

<style lang="scss"  scoped>
.funds_enquiries {
  // padding: 20px 0 0 32px;
  margin-top: 10px;
  color: #000;
  display: flex;
  .pull-left {
    float: left;
  }
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      font-size: 14px;
    }
  }
  .content_list {
    width:100%;
    .funds_enquiries_top {
      min-width: 1200px;
      height: 160px;
      background: #fff;
      .prompt {
        padding: 0 5px;
        color:#F5BD23;
        font-weight: 600;
        cursor: default;
      }
      .detail_total {
        height: 50px;
        padding-left: 10px;
        line-height: 50px;
        font-size: 14px;
        color: #000;
        font-weight: 600;
        .total_amount {
          display: inline-block;
          font-size: 18px;
          font-weight: 500;
        }
      }
      .detail_content {
        width: 98%;
        height: 110px;
        padding: 0 10px;
        .detail_public {
          width: 28%;
          min-width: 380px;
          height: 100px;
          background: #EDF0F7;
          display: inline-block;
          font-size: 12px;
          padding: 20px;
          color: #000;
          box-sizing: border-box;
          position: relative;
          span {
            display: inline-table;
            margin: 0px 10px 10px 0px;
          }
          p {
            font-size: 24px;
          }
          .detail_hover {
            margin: 0px;
            color: #666666;
            position: absolute;
            right: 20px;
            cursor: pointer;
            i {
              font-size:14px;
              margin-right:5px;
              color:#666666;
            }
          }
          .detail_hover_content {
            width: 300px;
            padding: 14px;
            background: #FFFFFF;
            box-shadow: 0 0 4px 0 #BFC1CB;
            border-radius: 2px;
            position: absolute;
            top: 43px;
            right: 20px;
            z-index: 2;
            .content_header {
              height: 30px;
              line-height: 30px;
              font-weight: 600;
              text-align: center;
              span {
                position: absolute;
                right: 16px;
              }
            }
            .content_platform {
              box-sizing: border-box;
              margin-top: 5px;
              border: 1px solid #E6E8F2;
              height: 130px;
              .content_middle_position {
                text-align: right;
                position: absolute;
                right: 140px;
              }
              .platform_detail {
                margin: 10px 20px 10px 10px;
                color: #666666;
                ul {
                  li {
                    font-size: 12px;
                    height: 20px;
                  }
                }
              }
            }
            .content_middle_float {
              float: right;
              margin-right: 104px;
            }
            .content_right_float {
              float: right;
              margin-right: -6px;
            }
            .content_middle {
              height: 30px;
              line-height: 30px;
              background: #EDF0F7;
              padding: 0 20px 0px 10px;
            }
          }
        }
      }
    }
    .content_list_top {
      h4 {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
        // display: inline-block;
        .prompt {
          // display: inline-block;
          // width:10px;
          // height: 10px;
          // padding:0;
          // margin:0;
          // border-radius: 50%;
          // font-size: 12px;
          padding: 0 5px;
          // border: 1px solid #666;
          color:#F5BD23 ;
          // margin-left: 5px;
          cursor: default;
          // &#xe678;
        }
      }
      margin: 10px 0;
    }
    .show_amount {
      width:100%;
      min-width: 1440px;
      height: 200px;
      padding: 20px;
      margin-bottom: 20px;
      background-color: #fff;
      .amount_info {
        width: 368px;
        height: 128px;
        border: 1px solid #ccc;
        margin-right: 10px;
        border-radius: 5px;
        padding: 15px;
        h4,
        p {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 10px;
          .prompt {
            // width:10px;
            // height: 10px;
            // padding:0;
            // margin:0;
            // border-radius: 50%;
            // font-size: 12px;
            padding: 0 5px;
            // border: 1px solid #666;
            color: #F5BD23 ;
            // margin-left: 5px;
            cursor: default;
          }
        }
        .half {
          width: 50%;
        }
        .mr {
          margin-right: 15px;
        }
        .ml {
          margin-left: 15px;
        }
      }
    }
    .business_circle {
      .choose {
        width: 100%;
        //  height:70px;
        margin: 0;
        padding: 15px 0 0 0;
        color: #000;
        // background-color: #fff;
        .search_cell {
          margin: 0 40px 10px 0;
          select {
            height: 24px;
            color: #777777;
          }
          input {
            margin-left: 10px;
            width: 350px;
            height: 36px;
            color: #5a5e66;
            border-radius: 4px;
            padding-left: 5px;
            border: 1px solid #d8dce5;
          }
        }
        .express_order {
          position: relative;
          // top: 100px;
          // left: 20px;
          .gray {
            background: #f0f0f0;
          }
          .sel {
            width: 200px;
            position: relative;
            overflow: hidden;
            i {
              position: absolute;
              width: 0;
              height: 0;
              border-left: 3px solid transparent;
              border-right: 3px solid transparent;
              border-top: 6px solid gray;
              top: 50%;
              transform: translateY(-50%);
              right: 5px;
            }
          }
          .sear {
            width: 200px;
            position: absolute;
            z-index: 1;
            top: 26px;
            left: 70px;
            box-sizing: border-box;
            border: 1px solid #e5e5e5;
            font-size: 12px;
            background-color: #fff;
            box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.2);
            .sear_input {
              width: 180px;
              height: 26px;
              line-height: 26px;
              border: 1px solid #bfc1cb;
              margin: 10px;
              font-size: 12px;
              padding: 0 10px;
            }
            h5 {
              line-height: 30px;
              background-color: #edf0f7;
              padding: 0 10px;
              margin: 0;
              font-size: 12px;
              list-style: none;
              cursor: pointer;
            }
            ul {
              cursor: pointer;
              margin: 0px;
              padding: 0px;
              list-style: none;
              height: 240px;
              overflow-y: scroll;
              li {
                padding: 0 10px;
                line-height: 30px;
                margin: 0;
              }
              li:hover {
                background: #f0f0f0;
              }
            }
            .foot {
              height: 50px;
              border-top: 1px solid #bfc1cb;
              .sur_btn {
                width: 80px;
                height: 26px;
                background-color: #11d2eb;
                color: #fff;
                margin-left: 60px;
                margin-top: 12px;
                border: none;
              }
            }
          }
          ._r {
            left: 84px;
          }
        }
        .marleft {
          margin-left: 30px;
        }
      }
    }
    .info {
      // margin-top:10px
      // width:1180px;
      width: 100%;
      padding: 10px;
      background-color: #fff;
      margin-top: 10px;
      .search {
        margin: 0;
        padding: 0 0 0 30px;
      }
      button {
        border-radius: 0;
        height: 30px;
        padding: 0 20px;
      }
    }
  }
  #show_medianame_edit {
    .inp {
      width: 250px;
      height: 24px;
      border-radius: 2px;
      border: 1px solid #bfc1cb;
      margin-left: 30px;
    }
    .btn_ser {
      width: 60px;
      height: 24px;
      border-radius: 2px;
      background-color: #0086ff;
      margin-left: 20px;
      border: none;
      color: #fff;
      font-size: 12px;
    }
  }
}

</style>