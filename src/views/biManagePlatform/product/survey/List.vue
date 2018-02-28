<template>
  <div class="bi-content">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
          <!--  :clearable="false"-->
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
            <!--// @click="init"-->
            <el-button type="primary" size="medium" class='btn-search' @click="init" :disabled="disab">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <table class="top-table">
      <thead>
      <tr>
        <th>商品访客数</th>
        <th>商品浏览量</th>
        <th>商品浏览平均时长</th>
        <th>被访商品占比</th>
      </tr>
      </thead>
      <tbody>
      <tr class="title">
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 160px">昨日商品访问总数，一个客户浏览多 个商品算一个客户(UV)</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 160px">昨日商品的浏览量(PV)，同一个客户浏览同一个商品多次按多次计算

              </div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="right">
              <div slot="content" style="width: 160px">昨日客户对商品浏览的平均时长：浏览商品总时长/ 被浏览的商品总数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td>
          昨日
          <div class="bottom-tips">
            <el-tooltip placement="bottom">
              <div slot="content" style="width: 160px">昨日被浏览的上架商品总数 / 截止到昨日已上架商品总数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
      </tr>
      <tr class="data">
        <td>
          <p>{{summary.yestodayGoodsVisitors}}</p>
          <div class="bottom-tips">
            <i class="iconfont up-arrow" v-if="summary.yestodayGoodsVisitorsCWTS >0">&#xe626;</i>
            <i class="iconfont down-arrow" v-if="summary.yestodayGoodsVisitorsCWTS <0">&#xe627;</i>
            <span v-if="summary.yestodayGoodsVisitorsCWTS >0">+</span>
            <!--<span v-if="summary.yestodayGoodsVisitorsCWTS <0">-</span>-->
            <span>{{summary.uvpercent}}</span>
            <el-tooltip placement="right">
              <div slot="content" style="width: 160px">日环比：（昨日商品总访客数 - 前日商品总访客数）/ 前日商品总访客数</div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td><p>{{summary.yestodayGoodsScans}}</p>
          <div class="bottom-tips">
            <i class="iconfont up-arrow" v-if="summary.yestodayGoodsScansCWTS >0">&#xe626;</i>
            <i class="iconfont down-arrow" v-if="summary.yestodayGoodsScansCWTS<0">&#xe627;</i>
            <span v-if="summary.yestodayGoodsScansCWTS >0">+</span>

            <span>{{summary.pvpercent}}</span>
            <el-tooltip placement="right">
              <div slot="content" style="width: 160px">
                日环比：
                （昨日商品浏览量-前日商品浏览量）/前日商品浏览量
              </div>
              <el-button class="iconfont">&#xe678;</el-button>
            </el-tooltip>
          </div>
        </td>
        <td><p>{{summary.yestodayScanAverTime}}</p></td>
        <td><p>{{summary.yestodayScanedGoodsPropportion}}</p></td>
      </tr>
      </tbody>
    </table>
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="chart">
          <div class="charts-title"><i class="iconfont">&#xe646;</i> 访客与加购趋势</div>
          <LineColumn
            class="echarts_box_fl"
            style="width: 100%; height: 270px"
            id="visitAndBuy"
            :legendData="visitAndBuy.legend_data"
            :xAxisData="visitAndBuy.xAxis_data"
            :yAxisName="visitAndBuy.yAxis_name"
            :firstName="visitAndBuy.first_name"
            :firstData="visitAndBuy.first_data"
            :twoName="visitAndBuy.two_name"
            :twoData="visitAndBuy.two_data"
            :threeName="visitAndBuy.three_name"
            :threeData="visitAndBuy.three_data"
          >
          </LineColumn>
        </div>

      </el-col>
      <el-col :span="12">
        <div class="chart" style="width: 100%; height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe628; </i>总浏览量趋势</div>
          <FillLine
            style="width: 100%; height: 270px"
            class="echarts_box_fl"
            id="listScan"
            :seriesData="listScan.series_data"
            :xAxisData="listScan.xAxis_data"
            :yAxisName="listScan.yAxis_name"
            :seriesName="listScan.series_name"
            :legendDada="listScan.legend_dada"
          >
          </FillLine>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="9">
        <div class="chart" style="width: 100%; height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe6a7; </i>商品品类销售额占比</div>
          <!-- <EmptyPie
          id="order_prop"
          style="height: 270px; width: 100%"
          :dataList="propList.data_list"
          :legend="propList.legend"
          :seriesTitle="propList.series_title"
          :prop="propList.prop"
       >
       </EmptyPie>-->
          <div id="Echarts_03" class="echarts_box_fl" style="height: 270px"></div>
        </div>
      </el-col>
      <el-col :span="15" style="position: relative">
        <ul class="charts-tab">
          <li v-for="(item,index) in tabs" :key="index"
              :class="{on:index == num}"
              @click="tab(index)">{{item}}
          </li>
        </ul>

        <div class="chart tab_chart_horiz" style="width: 100%; height: 270px">
          <div class="charts-title"><i class="iconfont">&#xe61d; </i>近5日商品排行榜TOP10</div>
          <!--id="id_visits" -->
          <div v-if="this.num ===0" style="width: 100%;height: 270px">
            <Horizontal
              id="id_visits"
              style="width: 100%;height: 100%"
              :nameList="this.visits.name_list"
              :valueList="this.visits.value_list"
            ></Horizontal>
          </div>
          <div v-if="this.num ==1" style="width: 100%;height: 270px">
            <Horizontal
              id="id_changeRate"
              style="width: 100%;;height: 270px"
              :nameList="this.changeRate.name_list"
              :valueList="this.changeRate.value_list"
              :title="this.changeRate.title"
              :xMax="this.changeRate.x_max"
            ></Horizontal>
          </div>
          <div v-if="this.num ==2" style="width: 100%;height: 270px">
            <Horizontal
              id="id_saleAmount"
              style="width: 100%;height: 270px"
              :nameList="this.saleAmount.name_list"
              :valueList="this.saleAmount.value_list"
            ></Horizontal>
          </div>
          <div v-if="this.num ==3" tyle="width: 100%;height: 270px">
            <Horizontal
              id="id_paihuoNum"
              style="width: 100%;height: 100%"
              :nameList="this.paihuoNum.name_list"
              :valueList="this.paihuoNum.value_list"
            ></Horizontal>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import LineColumn from '../../../../components/echarts/bar/lineColumn/'
  import FillLine from '../../../../components/echarts/line/fillLine/'
  //  import EmptyPie from '../../../../components/echarts/pie/empty/'
  import Horizontal from '../../../../components/echarts/bar/horizontal/'
  import dataTransf from '../../../../components/echarts/data-transf/index.js'
  import '../../../../../static/css/bi.scss'

  export default {
    components: {FillLine, LineColumn, Horizontal, dataTransf},
    data() {
      return {
        form: {},
        periodic: [new Date(new Date().getTime() - 20 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
        inquire: "查询",
        tabs: ['访问量', '成交转化率', '销售额', '扫拍量'],
        num: 0,
        tabList: '',
        disab: false,
        summary: {},
        visitAndBuy: {
          id: 'scan',
          legend_data: [{name: '访客数', icon: 'rect'}, {name: '加购客户数', icon: 'rect'}, {name: '加购率'}],
          xAxis_data: [],
          yAxis_name: '访客与加购趋势',
          first_name: '访客数',
          first_data: [],
          two_name: '加购客户数',
          two_data: [],
          three_name: '加购率',
          three_data: [],
        },
        listScan: {
          legend_dada: ['浏览量'],
          xAxis_data: [],
          yAxis_name: '浏览量',
          series_name: '浏览量',
          series_data: [],
        },

        listTop: {
          scans: [],
          date: []
        },
        /*  propList: {
            series_title: '',
            data_list: [],
            legend: [],
            prop:[],
          },*/
        propList: {
          name: [],
          prop: [],
          data: [],
          num: [],
        },
        topList: {
          name: [],
          cnv: []
        },

        visits: {
          name_list: [],
          value_list: []
        },
        saleAmount: {
          name_list: [],
          value_list: []
        },
        paihuoNum: {
          name_list: [],
          value_list: []
        },
        changeRate: {
          title: '(%)',
          name_list: [],
          value_list: [],
          x_max:100,
        },

        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
      }
    },
    mounted() {
      this.getsummary();
      this.EchartsFn1();
      this.EchartsFn2();
      this.EchartsFn3_Ajxa();
      this.getTabData();
    },
    methods: {

      init() {
        if (this.periodic && Array.isArray(this.periodic) && this.periodic[0]) {
          //dataTransf.formatTime(item.dateid)
          let beginTime = dataTransf.forTime(this.periodic[0]);
          let endTimecs = dataTransf.forTime(this.periodic[1]);
          this.startTime = this.periodic[0];
          this.endTime = this.periodic[1];
          let gap = endTimecs - beginTime;
          if (gap > 2592000) {
            this.$message.error("开始时间与结束时间间隔不能大于30天");
            return false;
          }
          this.EchartsFn1(this.startTime, this.endTime);
          this.EchartsFn2(this.startTime, this.endTime);
          this.EchartsFn3_Ajxa(this.startTime, this.endTime);
          this.disab = true;
          this.inquire = '查询中...'
          setTimeout(() => {
            this.inquire = '查询'
            this.disab = false;
          }, 2000);
        }
        this.EchartsFn1(this.startTime, this.endTime);
        this.EchartsFn2(this.startTime, this.endTime);
        this.EchartsFn3_Ajxa(this.startTime, this.endTime);
      },

      getsummary() {
        /*昨日商品概况*/
        this.api_biManagePlatform_yestoday().then(res => {
          let list = res.content ? res.content : [];
          this.summary = list;
          this.summary.yestodayScanedGoodsPropportion = Number(list.yestodayScanedGoodsPropportion * 100).toFixed(2) + '%';
          this.summary.uvpercent = (list.yestodayGoodsVisitorsCWTS * 100).toFixed(2) + '%';
          this.summary.pvpercent = (list.yestodayGoodsScansCWTS * 100).toFixed(2) + '%';
          Number.prototype.toCurrencyString = function () {
            return this.toFixed(2).replace(/\d(?=(?:\d{3})+\b)/g, '$&,'); // 这里看你是不是要小数
          }
          this.summary.yestodayGoodsVisitors = Number(this.summary.yestodayGoodsVisitors).toLocaleString()
        })
      },
      EchartsFn1(startTime, endTime) {

        this.api_biManagePlatform_visitAndBuy({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.visitAndBuy.xAxis_data = [];
          this.visitAndBuy.first_data = [];
          this.visitAndBuy.two_data = [];
          this.visitAndBuy.three_data = [];


          let list = res.content;
          list.forEach((item) => {
            this.visitAndBuy.xAxis_data.push(dataTransf.formatTime(item.date))
            //visitors 访问数
            this.visitAndBuy.first_data.push(item.visitors)
            this.visitAndBuy.two_data.push(item.buyers)
            this.visitAndBuy.three_data.push((item.prop * 100).toFixed(2))
          });
        })
      },
      EchartsFn2(startTime, endTime) {
        this.api_biManagePlatform_goodScanCnt({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.listScan.xAxis_data = [];
          this.listScan.series_data = [];

          let list = res.content;
          list.forEach((item) => {
            this.listScan.xAxis_data.push(dataTransf.formatTime(item.date))
            this.listScan.series_data.push(item.scans)
          });

        })

      },
      EchartsFn3_Ajxa(startTime, endTime) {
        this.api_biManagePlatform_categoryProp({
          data: {
            startTime: startTime ? startTime : '',
            endTime: endTime ? endTime : '',
          }
        }).then(res => {
          this.propList.prop = [];
          this.propList.name = [];
          this.propList.data = [];

          let list = res.content ? res.content : [];
          let news = true;
          list.forEach((item) => {
            this.propList.prop.push((Math.round(item.prop * 10000) / 100).toFixed(2));
            let num = (item.num / 10000).toFixed(2);
            if (item.categoryName === null) {
              this.propList.name.push('其他')
              this.propList.data.push({name: '其他', value: num});
            } else {
              this.propList.name.push(item.categoryName)
              this.propList.data.push({name: item.categoryName, value: num});
            }
          });
          this.EchartsFn3(news, this.propList.prop, this.propList.name, this.propList.data)
        })
      },
      EchartsFn3(news, prop, name, data) {
        var myChart = echarts.init(document.getElementById('Echarts_03'));
        var that = this;
        var option = {
          color: ['#1b7fd5', '#87b7e3', '#aac5f1', '#c1dbf2'],

          grid: {
            right: '10',
            left: '60',
            top: 60,
            bottom: 60,
          },
          legend: {
            data: name,//this.propList.name,
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 40,
            bottom: 20,
            itemWidth: 10,
            borderRadius: 0,

          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              center: ['56%', '55%'],
              radius: ['28%', '60%'],
              avoidLabelOverlap: true,
              legendHoverLink: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: true,
                  position: 'outside',
                  formatter: function (item) {
                    return item.value + ' , ' + prop[item.dataIndex] + '%'
                  },
//                  formatter:'{c} , {d}%',

                  borderWidth: 1,
                  color: '#666',
                },
                emphasis: {
                  show: true
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  borderWidth: 1,
                  borderColor: '#999',
                  lineStyle: {
                    color: '#ccc'
                  }
                },
                emphasis: {
                  show: true,
                  lineStyle: {
                    color: '#ccc'
                  }
                }
              },
              itemStyle: {
                emphasis: {
//                  borderColor: "#999"
                  opacity: 1,
                }
              },
              data: data//this.propList.data,
            }
          ]
        };
        if (news) {
          myChart.setOption(option)
        }
        myChart.setOption(option)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
      },
      getTabData() {
        this.api_biManagePlatform_goodTop().then(res => {
          let list = res.content;
          this.visits.value_list = [];
          this.visits.name_list = [];

          this.saleAmount.value_list = [];
          this.saleAmount.name_list = [];

          this.paihuoNum.value_list = [];
          this.paihuoNum.name_list = [];

          this.changeRate.value_list = [];
          this.changeRate.name_list = [];
          /*访问量*/
          list.Visits.forEach(item => {
            this.visits.value_list.push(item.cnv);
            this.visits.name_list.push(item.goodsName);
          });
          /*销售额*/
          list.SaleAmount.forEach(item => {
            this.saleAmount.value_list.push((item.cnv / 10000).toFixed(2));
            this.saleAmount.name_list.push(item.goodsName);
          });
          /*扫拍量*/
          list.PaihuoNum.forEach(item => {
            this.paihuoNum.value_list.push(item.cnv);
            this.paihuoNum.name_list.push(item.goodsName);
          });
//          转换率
          list.ChangeRate.forEach(item => {
            this.changeRate.value_list.push((item.cnv * 100).toFixed(2));
            this.changeRate.name_list.push(item.goodsName);
//            console.log('转换率 ：'+item.goodsName)

          });
        })

      },


      //tab 切换
      tab(index) {
        this.num = index;
        //console.log(this.num);
        if (index === 0) {
          this.$nextTick(() => {
            this.getTabData('id_visits', this.visits.cnv, this.visits.name);
          })
        }
        if (index === 1) {
          this.$nextTick(() => {
            this.getTabData('id_changeRate', this.changeRate.cnv, this.changeRate.name);
          })
        }
        if (index === 2) {
          this.$nextTick(() => {
            this.getTabData('id_saleAmount', this.saleAmount.cnv, this.saleAmount.name);
          })
        }
        if (index === 3) {
          this.$nextTick(() => {
            this.getTabData('id_paihuoNum', this.paihuoNum.cnv, this.paihuoNum.name);
          })
        }

      },


    },
  }
</script>

<style>

</style>
