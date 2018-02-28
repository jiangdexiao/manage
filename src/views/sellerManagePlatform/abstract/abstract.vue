<template>
  <div class="list clear">
    <el-row :gutter="10" class="dataTotal">
      <el-col :span="6">
        <div class="box">
          <h5>商家数量<span>当前累计</span></h5>
          <p>{{dealerNum == undefined || '' ? '--' : dealerNum}}<span>家</span></p>
          <router-link :to="{name:'s_dealer_list'}">查看明细</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>商品在售
            <span>当前累计</span>
          </h5>
          <p>{{goodNum == undefined || '' ? '--' : goodNum}}<span>个</span></p>
          <router-link :to="{name:'s_product_list',query:{goodsStatus:2} }">查看明细</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>销售金额
            <div class="icon">
              <div class="tips">
                <p>已付款的金额统计</p>
              </div>
            </div>
            <span>当月累计</span>
          </h5>
          <p>{{sellMoney == undefined || '' ? '--' :sellMoney}}<span>元</span></p>
          <router-link :to="{name:'s_order_front'}">查看明细</router-link>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box">
          <h5>待结算金额
            <div class="icon">
              <div class="tips">
                <p>顾客付款后，待系统结算的金额</p>
              </div>
            </div>
            <span>当前累计</span>
          </h5>
          <p>{{money.totalSettleAmount == undefined  ? '--' : (money.totalSettleAmount)}}<span>元</span></p>
          <router-link :to="{name:'s_countQuery',query:{SettleStatus:1} }" >结算查询</router-link>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dataInfo">
      <el-col :span="12" >
        <div class="box" style="height:245px;">
          <h5>数据概要</h5>
          <el-tabs v-model="activeData" @tab-click="handleClick" style="margin-top:-50px;">
            <el-tab-pane label="今日数据" name="first">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderNum == undefined  ? '--' :reportData.orderNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款订单数
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>顾客申请退款、退货退款，且当天商家已同意的售后单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderRefundNum == undefined  ? '--' :reportData.orderRefundNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>当天审核已通过的商品数目</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.goodsAddNum == undefined  ? '--' :reportData.goodsAddNum}}</h4>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.sellMoney == undefined  ? '--' :reportData.sellMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>申请退款、退货退款，且当天商家已同意的售后金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.refundMoney == undefined  ? '--' :reportData.refundMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数</div>
                  <h4>{{reportData.goodsCommentNum == undefined  ? '--' :reportData.goodsCommentNum}}</h4>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="昨日数据" name="second">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>订单数
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderNum == undefined  ? '--' :reportData.orderNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款订单数
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>顾客申请退款、退货退款，且当天商家已同意的售后单数</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.orderRefundNum == undefined  ? '--' :reportData.orderRefundNum}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>商品新增数
                    <div class="icon">
                      <div class="tips">
                        <p>当天审核已通过的商品数目</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.goodsAddNum == undefined  ? '--' :reportData.goodsAddNum}}</h4>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <div>销售金额
                    <div class="icon">
                      <div class="tips">
                        <p>当天已付款订单金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.sellMoney == undefined  ? '--' :reportData.sellMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>退款金额
                    <div class="icon">
                      <div class="tips" style="width:160px;">
                        <p>申请退款、退货退款，且当天商家已同意的售后金额</p>
                      </div>
                    </div>
                  </div>
                  <h4>{{reportData.refundMoney == undefined  ? '--' :reportData.refundMoney}}</h4>
                </el-col>
                <el-col :span="8">
                  <div>评论新增数</div>
                  <h4>{{reportData.goodsCommentNum == undefined  ? '--' :reportData.goodsCommentNum}}</h4>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box">
          <h5>商家销售榜
            <span class="timeChoose">
              <el-date-picker
                v-model="month"
                type="month" value-format="yyyy-MM"
                format = 'yyyy年MM月'
                :picker-options="pickerBeginDate"
                placeholder="选择月">
              </el-date-picker>
            </span>
          </h5>
          <div class="height300">
            <el-table
              :data="dataList"
              style="width:96%;margin:10px auto;">
              <el-table-column
                type='index'
                label="排行"
                width="180">
                <template slot-scope="scope" class="pl26">
                  <span :class="{'red':scope.row.index===1||scope.row.index===2||scope.row.index===3}">
                    <i class="no1" v-if="scope.row.index===1"></i>
                    <i class="no2" v-if="scope.row.index===2"></i>
                    <i class="no3" v-if="scope.row.index===3"></i>
                    {{ scope.row.index }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="商家名称"
                prop = 'dealerName'
                width="300">
                <!-- <template slot-scope="scope">
                  <span class="ellipsis">{{ scope.row.dealerName }}</span>
                </template> -->
              </el-table-column>
              <el-table-column
                prop="money"
                label="销量额/元">
              </el-table-column>
            </el-table>
            <!-- <p><router-link v-if="dataList.length!=0" class="more" :to="{name:'goodList'}">查看更多></router-link></p> -->
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="echart">
      <el-col :span="12">
        <div class="box">
          <h5>销售金额统计
            <div class="icon">
              <div class="tips">
                <p>已付款的金额统计</p>
              </div>
            </div>
            <span>近7日数据</span>
          </h5>
          <p>单位/元</p><p class="x">单位/日</p>
          <div id="chartLine" style="width:90%; height:350px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 引入折线图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
export default {
  name: '',
  data () {
    return {
       pickerBeginDate:{ //可选时间小于等于本月的时间
          disabledDate : (time) => {
            let maxMonth = new Date() ;
            if(maxMonth){
              return time.getTime() > maxMonth
            }
          }
        },
      activeData:'first', // 今日/昨日数据
      time:'', // 时间
      dataList:[],
      chartLine: null, // 初始化折线图
      goodNum:null, // 在售商品数量
      dealerNum:null, // 商家数量 
      sellMoney:null, // 累计销售金额
      reportData:{}, // 数据概要
      xAxis:[], // 7日销售X轴
      reportDataList:[], // 7日销售数值
      reportRatioList:[], // 7日销售环比
      month:'', // 搜索排行榜月份
      money:{}, // 待结算金额
      datas:[], // 从后台获取的七日折线图数据
    //   datas:[ {
    //     "ratio": 0,
    //     "ratioFlag": 0,
    //     "sellMoney": 0,
    //     "time": "12.12"
    // },
    // {
    //     "ratio": 5,
    //     "ratioFlag": 4,
    //     "sellMoney": 0,
    //     "time": "12.13"
    // },
    // {
    //     "ratio": 6,
    //     "ratioFlag": 6,
    //     "sellMoney": 0,
    //     "time": "12.14"
    // },
    // {
    //     "ratio": 5,
    //     "ratioFlag": 0,
    //     "sellMoney": 0,
    //     "time": "12.15"
    // },
    // {
    //     "ratio": 8,
    //     "ratioFlag": 5,
    //     "sellMoney": 0,
    //     "time": "12.16"
    // },
    // {
    //     "ratio": 0,
    //     "ratioFlag": 0,
    //     "sellMoney": 0,
    //     "time": "12.17"
    // },
    // {
    //     "ratio": 0,
    //     "ratioFlag": 0,
    //     "sellMoney": 0,
    //     "time": "12.18"
    // }]  // 折线图的数据
    } 
  },
  watch: {
    'month': {
      handler: function (val, oldVal) {
        let that = this
        if (val != oldVal) {
          that.$nextTick(function () {
            // let month = val.slice(0,4).toString() + val.slice(5,7).toString()
            // console.log(val,month)
            //that.month = month
            that.getDataList()
          })
        } else {
          return false
        }
      },
      deep: true
    }
  },
  methods: {
    handleClick(tab, event) {
      this.getReportData()
    },
    // 获取商家数量 （待接口）
    getDealerNum(){
      this.api_sellerManagePlatform_getDealerNum({}).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
        this.dealerNum = res.content
        }
    })
    },
    // 获取在售商品数量
    getGoodsNum(){
      this.api_sellerManagePlatform_getGoodsNum({}).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
        this.goodNum = res.content
        }
    })
    },
    // 获取销售金额
    getSellMoney(){
       this.api_sellerManagePlatform_getSellMoney({}).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
        this.sellMoney = res.content
        }
    })
    },
    // 获取待结算金额和可用金额
    amount () {
      let parameter ={
        token:this.tool.cookie.getCookie('access_token'),
      }
      this.api_sellerManagePlatform_amount({data:parameter}).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
        this.money = res.content
        }
    })
    },
    // 获取今日或昨日数据
    getReportData(){
      // console.log()
      this.api_sellerManagePlatform_getReportData({data:{
      timeType: this.activeData ==='first' ? 1:2
      }
      }).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
      this.reportData = res.content
        }
    })
    },
    // 获取7日数据折线图
    getReportDataList(){
      this.api_sellerManagePlatform_getReportDataList({}).then(res=>{
      if(res==undefined){ 
        console.log('七日折线图res.content',res.content)
        return false
      }else if(res.status == '200'){
         this.datas = res.content
         for(let i=0;i<this.datas.length;i++){
          this.xAxis.push(this.datas[i].time)
          this.reportDataList.push(this.datas[i].sellMoney)
          this.reportRatioList.push(this.datas[i].ratioFlag==0?'--':this.datas[i].ratio)
            }
         this.setEchart()
        }
    })
    },
    analysis(data){
      var end_obj = []
      for(let i in data){
        var obj = {name:'', datas:[]}
        obj.name = data[i].time
        obj.value = data[i]['sellMoney']
        obj.datas[0] = data[i]['ratio']
        obj.datas[1] = data[i]['ratioFlag']
        end_obj.push(obj);
      }
      return end_obj
    },
    setEchart(data){
      // 引入 ECharts 主模块
      let that = this
      let echarts = require('echarts');
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      let option ={
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              //backgroundColor: '#0086FF'
            }
          },
          formatter: function(a){
            return ('<p>'+a[0].name
              +'</br><i class="blueRadius"> </i>销售金额: '+a[0].data.value
              +'<br><i class="yellowRadius"> </i>环比: '+ (a[0].data.datas[1]==0 ? '--': a[0].data.datas[0]+'%')
              +'</p>'
            );
          }, 
        },
        itemStyle:{
            normal:{
                color: "#0086FF"
            }
        },
        lineStyle:{
            normal:{
                width:10,  //连线粗细
                color: "#0086FF"  //连线颜色
            }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : that.xAxis
          }
        ],
        yAxis : [
          {
            type : 'value',
            boundaryGap : false,
            min: 0,
            data : that.reportDataList
          }
        ],
        series : [
          {
            //name:'销售金额',
            type:'line',
            symbol:'circle',//拐点样式 circle|rectangle|triangle|diamond|emptyCircle|emptyRectangle|emptyTriangle|emptyDiamond|image://+图片
            symbolSize: 8,//拐点大小
            //stack: '金额',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {normal: {
              color:'#0086FF'
            }},
            data:[],
          },
        ]
      }
      let datas = that.datas;
      var name = [];
      for(let i in datas){
        name.push(datas[i].time);
      }
      option.series[0].data = that.analysis(that.datas);
      //option.tooltip.formatter = that.analysis(that.datas)
      option.xAxis.data = name;
      console.log(option.series[0].data)
      this.chartLine.setOption(option)
    },
    // 获取商家销售排行
    getDataList(){
      let parameter ={
      month:(this.month).slice(0,4).toString()+(this.month).slice(5,7).toString()
      }
      this.api_sellerManagePlatform_getDataList({data:parameter}).then(res=>{
      if(res==undefined){ return false
      }else if(res.status == '200'){
         this.dataList = res.content
         for(let i=0;i<res.content.length;i++){
             this.dataList[i].index = i+1
          }
        }
    })
    },
  },
  mounted () {
    this.getDealerNum()
    this.getGoodsNum()
    this.getDataList()
    this.amount()
    this.getSellMoney()
    this.getReportData()
    this.getReportDataList()
    let that = this
    let date=new Date()
    let year=date.getFullYear()
    let month=date.getMonth()+1
    month =(month<10 ? "0"+month:month);
    let mydate = (year.toString()+'-'+month.toString())
    this.month = mydate
    console.log(this.month)
  }
}
</script>
<style lang="scss" scoped>
  div.icon{
    width:16px;height:16px; display:inline-block; position:relative;
    background: url('../../../../static/images/sellerManage/css_sprites.png') -848px -50px no-repeat;
  div.tips{display:none;width:100px;height:auto;background:#fff;
    border:1px solid #E5E5E5;border-radius: 4px;
    box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;
    top:18px;left:0px; text-indent: 0;padding:6px;font-weight:normal;
      p{line-height:24px;font-size:12px; color:#666;}
    }
  }
    i.changeGood{width:24px;height:14px;
        background: url('../../../../static/images/sellerManage/css_sprites.png') -650px -716px no-repeat;
        display:inline-block;margin-right:6px;}
    i.red{
        color: red;display:inline-block;padding-right:6px;font-size:12px;
            font-style: normal;
    }
    i.redTip{
        padding-left:10px;
        padding-top:10px;
    }
      div.icon:hover div.tips{display:block;}
  .ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .ellipsis2{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  a:hover{ text-decoration: none;}
  .home{padding:20px;}
  .el-row{margin-bottom:10px;}
  p.setUp{color: #667991;}
  .dataTotal .box,.dataInfo .box,.echart .box{background:#fff;height:auto;border-radius:5px;text-align: center;padding-bottom:20px;}
  .dataTotal h5{text-align:left;background: #E6E8F2;font-size:16px;color: #667991;line-height:50px;padding:0 20px;
    div.icon{top:2px;}
    span{font-size:12px;background:#B7C9E1;color:#fff;float:right;line-height:20px;padding:0 4px;margin-top:15px;}
  }
  .dataTotal p{text-align: center;font-size:30px;color:#333;line-height:42px;padding:0 20px;
    span{font-size:14px;color:#151515;margin-left:6px;}
  }
  .dataTotal a{width:80px;height:25px;border: 1px solid #CCCCCC;border-radius: 3px;display:inline-block;line-height:24px;font-size:13px;color: #333333;}
  .dataInfo .box,.echart .box{border-radius:0;text-align:center;padding-bottom:0px;}
  .dataInfo h5,.echart h5{font-size:16px;color:#333;text-align:left;line-height:50px;padding:0 20px;margin:0;border-bottom:1px solid #dfe4ed;}
  .echart h5 span{font-size:12px;color:#666;float:right;}
  .echart .box{padding-bottom:20px;text-align: left;position:relative;}
  .echart .box p{position:absolute;margin-left:20px;margin-top:15px;color:#666;}
  .echart .box p.x{margin-top:315px;right:20px;}
  .dataInfo .box .el-col{padding:10px 0 ;}
  .height300{height:290px; text-align:left;
    p{text-align: center;}
  .pl26{padding-left:26px;}
    i.no1,i.no2,i.no3{float: left;margin-left:-26px;display:inline-block;width:16px;height:16px;line-height:40px;
    background:url('../../../assets/images/sellerManage/no.1.png') no-repeat;
    margin-top:2px;}
    i.no2{background:url('../../../assets/images/sellerManage/no.2.png') no-repeat;}
    i.no3{background:url('../../../assets/images/sellerManage/no.3.png') no-repeat;}
    span{display: inline-block;font-size: 14px;color:#999;float:left;margin-left:26px;}
    span.red{color:#FD3242;}
  }
  .el-tabs__header .el-tabs__active-bar,.el-tabs__header .el-tabs__item{padding:0 20px;}
  .box div.icon{text-align: left;top:2px;}
  .box div.icon div.tips p{text-align: left;padding:0;}
  .echart{top:-105px;}
  a.more{color:#667991;font-size:12px; text-decoration:underline;position:absolute;z-index:2;}
  div.icon div.tips{padding:0 6px;}
  .echart .box div.icon div.tips p{position:static;}
  div.icon div.tips p{margin:0;}
</style>
<style>
.dataInfo .el-tabs__nav{float:right !important;}
.dataInfo .el-tabs__item{height:50px;line-height:50px;}
.dataInfo .el-input{margin:0;float:right;}
.dataInfo .el-tabs__nav-wrap::after{height:1px;}
.dataInfo .el-tabs__content{width:100%; overflow:visible;}
.height300 .el-table td,.height300 .el-table th{padding:8px 0;padding-left:20px;}
.height300 .el-table td{background:#fff;}
.height300 .el-table{border-left:1px solid #E6E8F2;border-right:1px solid #E6E8F2;}
.box .is-disabled{width:80px;height:25px;border: 1px solid #CCCCCC;border-radius: 3px;display:inline-block;line-height:24px;font-size:13px;padding:0;}
#chartLine i{display:inline-block;width:10px;height:10px;background:#F5BD23;border-radius:5px;margin-right:4px;}
#chartLine i.blueRadius{background:#0086FF;}
#chartLine p{padding:0px 10px;padding-top:5px; line-height:24px;}
</style>
