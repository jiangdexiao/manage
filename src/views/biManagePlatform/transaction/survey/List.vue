<template>
  <div class="bi-content">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true">
          <!--  :clearable="false"-->
          <el-form-item>
            <el-date-picker
              v-model="periodic"
              :picker-options="pickerOptions0"
              type="daterange"
              @change="changeDate"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class='btn-search' @click="init">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <table class="top-table">
      <thead>
      <tr>
        <th>订单数</th>
        <th>销售额</th>
        <th>下单客户数</th>
        <th>未支付订单数</th>
        <th>客单价</th>
        <th>退单金额</th>
      </tr>
      </thead>
      <tbody>
      <tr class="title">
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 110px">客户支付过的订单数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 110px">订单金额含满减优惠和使用的优惠券金额，不含运费</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 130px">昨日下过单且支付过的客户数，一个客户下都个订单数按一个客户计算</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 110px">截止到今日凌晨，客户下了订单而没有支付的订单数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 110px">昨日订单金额/昨日下单客户数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="bottom">
              <div slot="content" style="width: 130px">昨日售后状态为9同意退款的订单之订单金额</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
      </tr>
      <tr class="data">
        <td>
          <p>{{summary.payOrderCnt}}</p>
          <div class="bottom-tips">
              <!-- <i class="iconfont up-arrow" v-if="summary.yestodayGoodsVisitorsCWTS >0">&#xe626;</i>
              <i class="iconfont down-arrow" v-if="summary.yestodayGoodsVisitorsCWTS <0">&#xe627;</i>
              <span v-if="summary.yestodayGoodsVisitorsCWTS >0">+</span>
              <span v-if="summary.yestodayGoodsVisitorsCWTS <0">-</span> -->
            <span>
              <i  v-if="summary.orderRelative > 0" style='color:green' class="iconfont icon-shangjiantou"></i>
              <i  v-if="summary.orderRelative < 0" style='color:red' class="iconfont icon-xiajiantou"></i>
              {{(summary.orderRelative?summary.orderRelative.toFixed(1):'0.0')+'%'}}
            </span>
            <el-tooltip placement="right">
              <div slot="content" style="width: 140px">日环比：（昨日订单数-前日订单数）/前日定单数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          <p>{{summary.orderAmount}}</p>
          <div class="bottom-tips">
            <!--   <i class="iconfont up-arrow" v-if="summary.yestodayGoodsVisitorsCWTS >0">&#xe626;</i>
              <i class="iconfont down-arrow" v-if="summary.yestodayGoodsVisitorsCWTS <0">&#xe627;</i>
              <span v-if="summary.yestodayGoodsVisitorsCWTS >0">+</span>
              <span v-if="summary.yestodayGoodsVisitorsCWTS <0">-</span>-->
             <span>
              <i  v-if="summary.amoutRelative > 0" style='color:green' class="iconfont icon-shangjiantou"></i>
              <i  v-if="summary.amoutRelative < 0" style='color:red' class="iconfont icon-xiajiantou"></i>
              {{(summary.amoutRelative?summary.amoutRelative.toFixed(1):0.0)+'%'}}
            </span>
            <el-tooltip placement="right">
              <div slot="content" style="width: 140px">日环比：(昨日销售额-前日销售额)/前日销售额</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          <p>{{summary.placeOrderCnt}}</p>
          <div class="bottom-tips">
            <!--  <i class="iconfont up-arrow" v-if="summary.yestodayGoodsScansCWTS >0">&#xe626;</i>
              <i class="iconfont down-arrow" v-if="summary.yestodayGoodsScansCWTS<0">&#xe627;</i>
              <span v-if="summary.yestodayGoodsScansCWTS >0">+</span>-->

            <span>
              <i  v-if="summary.orderCustRelative > 0" style='color:green' class="iconfont icon-shangjiantou"></i>
              <i  v-if="summary.orderCustRelative < 0" style='color:red' class="iconfont icon-xiajiantou"></i>
              {{(summary.orderCustRelative?summary.orderCustRelative.toFixed(1):'0.0')+'%'}}
            </span>
            <el-tooltip placement="right">
              <div slot="content" style="width: 150px">
                日环比：
                （昨日下单客户数-前日下单客户数）/前日下单客户数
              </div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td><p>{{summary.cancelOrders}}</p></td>
        <td><p>{{summary.amountPerCustomer}}</p></td>
        <td><p>{{summary.refundAmount}}</p></td>
      </tr>
      </tbody>
    </table>

    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title">
            <i class="iconfont">&#xe62a;</i> 销售金额和下单转化率趋势图  
            <el-tooltip placement="right" >
              <div slot="content" style="width: 200px">
                销售金额：订单状态为已支付的昨日订单金额，含满减活动和优惠的那部分金额，不含快递费。<br>
                下单转化率：被售商品数/浏览商品数，同一个同一天商品被浏览多次按多次算，同一个商品同一天销售多次，按一次计算
              </div>
              <i class="iconfont icon-ico_explain"></i>
            </el-tooltip>
          </div>
          <LineColumn
            class="echarts_box_fl"
            style="width: 100%; height: 270px"
            id="firstChart"
            :legendData="firstChart.legend"
            :xAxisData="firstChart.xAxis_data"
            :yAxisName="firstChart.yAxis_name"
            :colors="firstChart.colors"
            :barName="firstChart.bar_name"
            :barVal="firstChart.bar_value"
            :lineName="firstChart.line_name"
            :lineVal="firstChart.line_value">
          </LineColumn>
        </div>

      </el-col>
      <el-col :span="12">
        <div class="chart" style="height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe629; </i>整体交易转化率</div>
          <div class="chart_two" style="height: 180px">
            <div class="bar-type-box">
              <div class="bar-type">{{datesTrans.uvCnt}}</div>
              <!--<div class="bar-type">{{datesTrans.inPackageCustCnt}}</div>-->
              <div class="bar-type">{{datesTrans.placeOrderCnt}}</div>
              <div class="bar-type">{{datesTrans.payOrderCustCnt}}</div>
              <ul class="left">
                <li>下单客户转化率  {{(datesTrans.placeOrderCustTrans*100).toFixed(2)}}%</li>
                <li>支付客户转化率  {{(datesTrans.payCustTrans*100).toFixed(2)}}%</li>
              </ul>
              <ul class="right">
                <li><span>商品浏览用户数</span></li>
                <!--<li><span>加入购物车用户数</span></li>-->
                <li><span>下单客户数</span></li>
                <li><span>支付订单用户数</span></li>
              </ul>

            </div>
            <div class="shade"></div>
          </div>
        </div>
      </el-col>
      <el-col>

      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart" style="width: 100%; height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe61e; </i>下单客户数趋势图</div>
          <FillLine
            style="width: 100%; height: 270px"
            class="echarts_box_fl"
            id="customersTren"
            :seriesData="customersTren.series_data"
            :xAxisData="customersTren.xAxis_data"
            :yAxisName="customersTren.yAxis_name"
            :seriesName="customersTren.series_name"
            :legendDada="customersTren.legend_dada"
          >
          </FillLine>
        </div>

      </el-col>
      <el-col :span="12">
        <div class="chart" style="width: 100%; height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe602; </i>各渠道销售额占比</div>
          <!--       :title="chartScatter.title"-->
          <Scatter
            style="width: 100%; height: 270px"
            id="chart04"
            :legend="chartScatter.legend"
            :xAxisData="chartScatter.xAxis_data"
            :listVal="chartScatter.list_value"
            :yAxisName="chartScatter.yAxis_name"
            :seriesTitle="chartScatter.yAxis_name"

          ></Scatter>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import '../../../../../static/css/bi.scss'
  import LineColumn from '../../../../components/echarts/bar/singleColumnLine/'
  import FillLine from '../../../../components/echarts/line/fillLine/'
  import Scatter from '../../../../components/echarts/scatter/default/'
  import dataTransf from '../../../../components/echarts/data-transf/'

  export default {
    components: {FillLine, LineColumn, Scatter, dataTransf},
    data() {
      return {
        periodic: [new Date(new Date().getTime() - 20 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        summary: {},
        orderAmount: [],
        orderTransrate: [],
        firstChart: {
          id: 'scan',
          legend: [{icon: 'rect', name: '销售金额'}, {name: '下单转化率'}],
          colors: ['#7cb5ee'],
          yAxis_name:'销售金额',
          xAxis_data: [],
          bar_name: '销售金额',
          bar_value: [],
          line_name: '下单转化率',
          line_value: [],
        },
        datesTrans: {},
        customersTren: {
          legend_dada: ['下单客户数'],
          xAxis_data: [],
          yAxis_name: '下单客户数',
          series_name: '下单客户数',
          series_data: [],
        },
        chartScatter: {
          legend: [{icon: 'rect', name: '各渠道销售额占比'}],
          list_value: [],
          xAxis_data: [],
          yAxis_name:'各渠道销售额占比',
          title:'各渠道销售额占比',
        },

      }
    },
    mounted() {
      this.orderYestoday()
      this.init()
    },
    methods: {
      orderYestoday() {
        this.api_biManagePlatform_orderYestoday().then(res => {
          if( res.content && res.content.length > 0){
            let list = res.content[0]
            this.summary = list
            this.summary.orderAmount = list.orderAmount / 10000
            this.summary.amountPerCustomer = (list.amountPerCustomer / 10000).toFixed(2)
            this.summary.refundAmount = list.refundAmount / 10000
          }
        })
      },
      changeDate() {
        this.startTime = this.periodic[0];
        this.endTime = this.periodic[1];
      },
      init() {
        /*********** 销售金额和下单转化率趋势图 **************/
        this.api_biManagePlatform_orderTrans({
          data: {
            startTime: this.startTime ? this.startTime : '',
            endTime: this.endTime ? this.endTime : '',
          }
        }).then(res => {
          let list = res.content ? res.content : [];
          this.firstChart.xAxis_data = [];
          this.firstChart.bar_value = [];
          this.firstChart.line_value = [];
          list.forEach((item, i) => {
            this.firstChart.xAxis_data.push(dataTransf.formatTime(item.dateid))
            this.firstChart.bar_value.push(item.orderAmount / 10000)
            this.firstChart.line_value.push((item.orderTransrate*100).toFixed(2))
          })
        })


        /*********** 整体交易转化率 **************/
        this.api_biManagePlatform_datesTrans({
          data: {
            startTime: this.startTime ? this.startTime : '',
            endTime: this.endTime ? this.endTime : '',
          }
        }).then(res => {
          if( res.content && res.content.length >0){
            this.datesTrans = res.content[0]
            // this.datesTrans.orderTransrate = (this.datesTrans.orderTransrate * 100).toFixed(2);
          }
        })

        /*********** 下单客户趋势图 **************/
        this.api_biManagePlatform_customersTrend({
          data: {
            startTime: this.startTime ? this.startTime : '',
            endTime: this.endTime ? this.endTime : '',
          }
        }).then(res => {
          let list = res.content ? res.content : [];
          this.customersTren.xAxis_data = [];
          this.customersTren.series_data = [];
          list.forEach((item, i) => {
            this.customersTren.xAxis_data.push(dataTransf.formatTime(item.dateid))
            this.customersTren.series_data.push(item.placeOrderCnt);
          })
        })

        /***********  各渠道销售额占比 **************/
        this.api_biManagePlatform_byChannel({
          data: {
            startTime: this.startTime ? this.startTime : '',
            endTime: this.endTime ? this.endTime : '',
          }
        }).then(res => {
          let list = res.content ? res.content : [];
          this.chartScatter.list_value = []
          this.chartScatter.xAxis_data = []
          list.forEach(item => {
            this.chartScatter.list_value.push([((item.amount / 10000).toFixed(2)), ((item.pro * 100).toFixed(2)), item.typeDesc?item.typeDesc:item.type])
            this.chartScatter.xAxis_data.push((item.amount / 10000).toFixed(2))
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .chart_two {
    margin: 70px auto 0 auto;
    width: 280px;
    position: relative;
    /*图表本身*/
    .bar-type {
      height: 50px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      position: relative;
      &:first-child {
        background-color: #1549a3;
        z-index: 99;
      }
      &:nth-child(2) {
        background-color: #1067c5;
      }
      &:nth-child(3) {
        background-color: #378ade;
      }
      &:nth-child(4) {
        background-color: #a6cdf0;
      }
    }
    /*白色遮罩*/
    .shade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      /*bottom: 0;*/
      width: 280px;
      /*background-color: #fff;*/
      border-width: 200px 120px 0;
      /*border-width: 135px 83px 0;*/
      border-style: solid;
      border-color: transparent #fff;
      z-index: 99;
    }
    /*图表左右两侧内容*/
    .bar-type-box {
      position: relative;
      .left {
        position: absolute;
        bottom: 10px;
        left: -136px;
        color: #666;
        z-index: 990;
        li {
          font-size: 10px;
          position: relative;
          height: 40px;
          line-height: 40px;
          &:after {
            content: '';
            position: absolute;
            bottom: 18px;
            border-bottom: 1px solid #ccc;
            z-index: 999;
          }
          &:first-child {
            left: 0;
            &:after {
              width: 76px;
              left: 101px;
            }
          }
          &:nth-child(2) {
            &:after {
              left: 118px;
              width: 90px;
            }
          }
          &:nth-child(3) {
            &:after {
              left: 124px;
              width: 115px;
            }
          }
        }
      }
      .right {
        position: absolute;
        top: 0;
        right: -136px;
        color: #666;
        z-index: 990;
        font-size: 10px;

        li {
          position: relative;
          height: 45px;
          line-height: 45px;
          span {
            font-size: 10px;
            -webkit-transform: scale(.8);
            -moz-transform: scale(.8);
            -o-transform: scale(.8);
            transform: scale(.8);
          }
          &:after {
            content: '';
            position: absolute;
            bottom: 23px;
            border-bottom: 1px solid #ccc;
            z-index: 999;
          }
          &:first-child {
            &:after {
              left: -48px;
              width: 41px;
            }
          }
          &:nth-child(2) {
            &:after {
              left: -76px;
              width: 70px;
            }
          }
          &:nth-child(3) {
            &:after {
              left: -94px;
              width: 90px;
            }
          }
          &:nth-child(4) {
            &:after {
              left: -124px;
              width: 115px;
            }
          }
        }
      }
    }

  }

</style>
