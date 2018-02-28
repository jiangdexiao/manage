<template>
  <div class="food-analysis bi-content">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
          <el-form-item>
            <el-date-picker
              v-model="periodic"
              :picker-options="pickerOptions0"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="init" class='btn-search'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart" v-loading="loading1">
          <div class="charts-title"><i class="iconfont">&#xe620; </i>餐饮媒体订单趋势图</div>
          <LineColumn
            style="height: 370px; width: 100%"
            id="cateringMedia"
            :legendData="cateringMedia.legend_data"
            :xAxisData="cateringMedia.xAxis_data"
            :yAxisName="cateringMedia.yAxis_name"
            :firstName="cateringMedia.first_name"
            :firstData="cateringMedia.first_data"
            :twoName="cateringMedia.two_name"
            :twoData="cateringMedia.two_data"
            :threeName="cateringMedia.three_name"
            :threeData="cateringMedia.three_data"
          >
          </LineColumn>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart" style="height: 370px" v-loading="loading2">
          <div class="charts-title"><i class="iconfont">&#xe6a6; </i>餐饮媒体转化分析</div>
          <div class="transform_parse" tyle="height: 370px">
            <div class="bar-type-box">
              <div class="bar-type"> {{cartUserCnt.scanUserCnt}}</div>
              <!--<div class="bar-type">{{cartUserCnt.cartUserCnt}}</div>-->
              <div class="bar-type">{{cartUserCnt.orderUserCnt}}</div>
              <div class="bar-type">{{cartUserCnt.payUserCnt}}</div>
              <ul class="left">
                <!--<li>加购转化率 {{cartUserCnt.cartUserRate}}</li>-->
                <li>下单转化率  {{cartUserCnt.orderUserRate}}</li>
                <li>付款转化率   {{cartUserCnt.payUserRate}}</li>
              </ul>
              <ul class="right">
                <li><span>浏览客户数</span></li>
                <!--<li><span>加购客户数</span></li>-->
                <li><span>下单客户数</span></li>
                <li><span>付款客户数</span></li>
              </ul>

            </div>
            <div class="shade"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="9">
        <div class="chart" v-loading="loading3">
          <div class="charts-title"><i class="iconfont">&#xe6a7; </i>广告位订单量占比</div>
          <chartPie
            style="height: 370px; width: 100%"
            id="orders"
            :dataList="orderProp.value_list"
            :legend="orderProp.legend"
            :seriesTitle="orderProp.series_title"
          >
          </chartPie>

        </div>
      </el-col>
      <el-col :span="15">
        <div class="chart" v-loading="loading4">
          <div class="charts-title"><i class="iconfont">&#xe61e; </i>订单分析
            <el-select class="order-select" v-model="optionsVal" filterable size="10px"
                       @change="orderAnalyzing(optionsVal)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="order-analyzing-box">
            <table class="order-analyzing">
              <thead>
              <tr>
                <th>分析维度</th>
                <th>扫拍量</th>
                <th>订单量</th>
                <th>转换率</th>
                <th>订单金额（元）
                  <el-tooltip placement="right">
                    <div slot="content" style="width: 110px">
                      包含满减活动优惠金额
                    </div>
                    <el-button class="iconfont">&#xe678;</el-button>
                  </el-tooltip>
                </th>
                <th>商品数量</th>
                <th>订单单价</th>
              </tr>
              </thead>
              <tbody>
              <!--<tr v-for="item in order_trading order_prop"  v-for="item in order_prop"  >-->
              <tr v-for="item in order_trading">
                <td><p>{{item.typeName}}</p></td>
                <td><p>{{item.scanCnt}}</p></td>
                <td><p>{{item.orderCnt}}</p></td>
                <td><p>{{item.prop}}</p></td>
                <td><p>{{item.orderAmt}}</p></td>
                <td><p>{{item.goodsCnt}}</p></td>
                <td><p>{{item.price}}</p></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import LineColumn from '../../../../components/echarts/bar/lineColumn/'
  import chartPie from '../../../../components/echarts/pie/default/'
  import dataTransf from '../../../../components/echarts/data-transf/index.js'
  import '../../../../../static/css/bi.scss'

  export default {
    components: {LineColumn, chartPie, dataTransf},
    data() {
      return {
        form: {},
        periodic: [new Date(new Date().getTime() - 20 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        cateringMedia: {
          id: 'cateringMedia',
          legend_data: [{name: '扫拍量', icoyn: 'rect'}, {name: '购买量', icon: 'rect'}, {name: '转化率'}],
          xAxis_data: [],
          yAxis_name: '扫描量与购买量',
          first_name: '扫拍量',
          first_data: [],
          two_name: '购买量',
          two_data: [],
          three_name: '转化率',
          three_data: [],
        },
        frist_server:[],

        cartUserCnt: {},
        orderProp: {
          series_title: '',
          value_list: [],
          legend: [],
        },
        options: [
          {
            value: '1',
            label: 'top10商圈订单情况'
          },
          {
            value: '3',
            label: '各菜系订单情况'
          },
          {
            value: '4',
            label: '各广告位形式订单情况 '
          },
          {
            value: '5',
            label: '各商品品类订单情况 '
          },
        ],
        optionsVal: '1',
        order_trading: {},
        startTime: '',
        endTime: '',
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
      }
    },
    mounted() {
      this.EchartsFn1();
      this.canyingTransfor();
      this.EchartsFn3();
      this.orderAnalyzing();
    },
    methods: {
      init(){
        if (this.periodic && Array.isArray(this.periodic) && this.periodic[0]) {
          //dataTransf.formatTime(item.dateid)
          let beginTime = dataTransf.forTime(this.periodic[0]);
          let endTimecs = dataTransf.forTime(this.periodic[1]);
          this.startTime = this.periodic[0];
          this.endTime = this.periodic[1];
          let gap = endTimecs - beginTime;
          console.log(beginTime)
          let type = this.optionsVal;
          if (gap > 2592000) {
            this.$message.error("开始时间与结束时间间隔不能大于30天");
            return false;
          }
          this.EchartsFn1(this.startTime, this.endTime);
          this.canyingTransfor(this.startTime, this.endTime);
          this.EchartsFn3(this.startTime, this.endTime);
          this.orderAnalyzing(type);
          this.disab = true;
          this.inquire = '查询中...'
          setTimeout(() => {
            this.inquire = '查询'
            this.disab = false;
          }, 2000);
        }
        else {
          this.$message.error("请选择正确的时间格式");
          return false;
        }
      },
      EchartsFn1(startTime, endTime) {
        let list;
        this.loading1 = true;
        this.cateringMedia.xAxis_data = [];
        this.cateringMedia.first_data = [];
        this.cateringMedia.two_data = [];
        this.cateringMedia.three_data = [];
        this.api_biManagePlatform_canyingTendency({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.loading1 = false;
          list = res.content ? res.content : [];
          list.forEach((item) => {
//            this.cateringMedia.xAxis_data.push(this.dateFormat(item.dateid))
            this.cateringMedia.xAxis_data.push(dataTransf.formatTime(item.dateid))
            //扫拍量
            this.cateringMedia.first_data.push(item.scanCnt)
//            购买量
            this.cateringMedia.two_data.push(item.buyCnt)
            // 转化率
            this.cateringMedia.three_data.push((item.transRate * 100).toFixed(2))
          });
        })
      },
      canyingTransfor(startTime, endTime) {
        this.cartUserCnt.cartUserRate = undefined;
        this.cartUserCnt.payUserRate = undefined;
        this.cartUserCnt.orderUserRate = undefined;
        this.loading2 = true;
        this.api_biManagePlatform_canyingTransfor({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.loading2 = false;
          let list;
          list = res.content ? res.content : [];
          this.cartUserCnt = list;
          this.cartUserCnt.cartUserRate = (Math.round(list.cartUserRate * 100)).toFixed(2) + '%'
          this.cartUserCnt.payUserRate = (Math.round(list.payUserRate * 100)).toFixed(2) + '%'
          this.cartUserCnt.orderUserRate = (Math.round(list.orderUserRate * 100)).toFixed(2) + '%'
        })
      },
      EchartsFn3(startTime, endTime) {
        this.orderProp.legend = [];
        this.orderProp.value_list = [];
        this.loading3 = true;
        this.api_biManagePlatform_canyingProp({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.loading3 = false;
          let list;
          list = res.content ? res.content : [];
          let prop = [];
          list.forEach((item) => {
            this.orderProp.legend.push(item.advAreaName)
            this.orderProp.value_list.push({name: item.advAreaName, value: item.payOrderCnt});
            prop.push((item.prop * 100).toFixed(2));
          });
        })
      },
      orderAnalyzing(val) {
        this.order_trading = null;
        this.loading4 = true;
        this.api_biManagePlatform_canyingTop({
          data: {
            type: val,
            startTime: this.startTime ? this.startTime : '',
            endTime: this.endTime ? this.endTime : '',
          }
        }).then(res => {
          this.loading4 = false;
          this.order_trading = res.content;
          this.order_trading.forEach(item => {
            item.orderAmt = item.orderAmt / 10000
            if (Number(item.orderCnt) === 0 && Number(item.scanCnt) === 0) {
              item.prop = 0
            } else if (Number(item.orderCnt) / Number(item.scanCnt) === Infinity) {
              item.prop = 0
            } else {
              item.prop = ((Number(item.orderCnt) / Number(item.scanCnt)) * 100).toFixed(2) + '%'
            }
            if (item.orderAmt === 0 && item.orderCnt === 0) {
              item.price = 0
            } else {
              item.price = ((Number(item.orderAmt) / Number(item.orderCnt))).toFixed(2)
            }
          });
        })
      },
    }
  }
</script>

<style lang="scss">
  .chart {
    background-color: #fff;
  }

  .order-analyzing {
    width: 100%;
    .el-tooltip {
      font-size: 16px;
      display: inline;
      padding: 6px 4px;
      border: 0;
      background-color: transparent !important;
    }
  }

  .system-tips {
    padding-top: 184px;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #999;
    font-size: 20px;
  }

  .transform_parse {
    margin: 115px auto 0 auto;
    width: 280px;
    position: relative;
    .bar-type-box {
      position: relative;
      .left {
        position: absolute;
        top: 45px;
        left: -120px;
        color: #666;
        z-index: 990;
        li {
          font-size: 10px;
          position: relative;
          height: 50px;
          line-height: 45px;
          -webkit-transform: scale(.8);
          -moz-transform: scale(.8);
          -o-transform: scale(.8);
          transform: scale(.8);
          &:after {
            content: '';
            position: absolute;
            bottom: 23px;
            border-bottom: 1px solid #ccc;
            z-index: 999;
          }
          &:first-child {
            left: -10px;
            &:after {
              width: 76px;
              left: 118px;
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
        right: -100px;
        color: #666;
        z-index: 990;
        font-size: 10px;

        li {
          position: relative;
          height: 50px;
          line-height: 50px;
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
    .shade {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      /*background-color: #fff;*/
      border-width: 200px 120px 0;
      border-style: solid;
      border-color: transparent #fff;
      z-index: 99;
    }
  }
</style>
