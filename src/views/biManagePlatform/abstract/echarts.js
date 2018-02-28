import DefaultBar from '../../../components/echarts/bar/default/'
import FillLine from '../../../components/echarts/line/fillLine/'
import DefaultLine from '../../../components/echarts/line/default/'
import LineColumn from '../../../components/echarts/bar/lineColumn/'
import dataTransf from '../../../components/echarts/data-transf/index.js'
import '../../../../static/css/bi.scss'

export default {
  components: {DefaultBar, FillLine, DefaultLine, LineColumn, dataTransf},
  data() {
    return {
      table:{},
      todayTrade:'',
      totalTrade:'',

      barData: {
        xAxis_data: [],
        yAxis_name: '订单量',
        series_name: '订单量',
        value_list: [],
        legend_dada: ['订单量'],
      },
      numberMedia: {
        legend_dada: ['媒体数'],
        xAxis_data: [],
        yAxis_name: '媒体数',
        series_name: '媒体数',
        series_data: [],
      },
      advertising: {
        legend_dada: [{name: '空置率'}, {name: '上架广告位'},],
        xAxis_data: [],
        yAxis_name: '空置率与上架广告位',
        first_name: '空置率',
        first_data: [],
        two_name: '上架广告位',
        two_data: [],
      },
      scan: {
        id: 'scan',
        legend_data: [{name: '扫描', icon: 'rect'}, {name: '购买', icon: 'rect'}, {name: '转化率'}],
        xAxis_data: [],
        yAxis_name: '扫描与购买转化率',
        first_name: '扫描',
        first_data: [],
        two_name: '购买',
        two_data: [],
        three_name: '转化率',
        three_data: [],
      },
    }
  },
  mounted() {
    this.getSummary()
    this.echartsFn1()
    this.echartsFn2()
    this.echartsFn3()
    this.echartsFn4()
  },
  methods: {
    getSummary(){
      let list;
      this.api_biManagePlatform_homeSummary().then(res => {
        list = res.content ? res.content : [];
        this.table = list
        let number1 =Number(list.totalTrade) / 10000;
        let number2 =Number(list.todayTrade) / 10000;
        this.totalTrade = number1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,' );
        this.todayTrade = number2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,' );
      })
    },
    echartsFn1() {
      let list;
      this.api_biManagePlatform_homeOrderctn().then(res => {
        list = res.content ? res.content : [];
        list.forEach((item) => {
          this.barData.xAxis_data.push(dataTransf.formatTime(item.date))
          this.barData.value_list.push(item.num)

        });

      })
    },
    echartsFn2() {
      let list;
      this.api_biManagePlatform_homeMediactn().then(res => {
        list = res.content ? res.content : [];
        list.forEach((item) => {
          this.numberMedia.xAxis_data.push(dataTransf.formatTime(item.date));
          this.numberMedia.series_data.push(item.num)
        });
      })
    },
    echartsFn3() {
      let list;
      this.api_biManagePlatform_homeMresctn().then(res => {
        list = res.content ? res.content : [];
        list.forEach((item) => {
          // console.log(dataTransf.a(item.date))
          this.advertising.xAxis_data.push(dataTransf.formatTime(item.date));
          this.advertising.first_data.push(dataTransf.toPercent(item.empReate))
          this.advertising.two_data.push(item.onlineAdverNum)
        });
      })
    },
    echartsFn4() {
      let list;
      this.api_biManagePlatform_homePaihuoCtn().then(res => {
        list = res.content ? res.content : [];
        list.forEach((item) => {
           this.scan.xAxis_data.push(dataTransf.formatTime(item.date));
          this.scan.first_data.push(item.paihuoNum)
          this.scan.two_data.push(item.buyNum)
          this.scan.three_data.push(dataTransf.toPercent(item.transRate))
        });
      })
    },
  }

}
