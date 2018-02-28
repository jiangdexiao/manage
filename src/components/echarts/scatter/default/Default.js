import echarts from 'echarts'

export default {
  name: 'echarts',
  data() {
    return {
      chartDom: null,
      data: {
        id: this.id,
        title: this.title,
        subtext: this.subtext,
        series_title: this.seriesTitle,
        legend: this.legend,
        yAxis_name: this.yAxisName,
        list_value: this.listVal,
        xAxis_data: this.xAxisData,
      }
    }
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      if (this.data.id) {
        this.chartDom = echarts.init(document.getElementById(this.data.id))
      }
      return this
    },

    update() {
      if (this.chartDom === null) {
        this.init()
      } else {

      }
      this.chartDom.setOption({
          color: ['#86adde'],
          title: {
            text: this.data.title,
            subtext: this.data.subtext,
            top: '50%',
            left: '10',
            textStyle: {
              fontWeight: 100,
              fontSize: 10,
              align: 'center',
            }
          },
          tooltip: {
            trigger: 'axis',
            // snap: trsue,
            axisPointer: {
              type: 'none',
            },
            // formatter: '{a}<br />{c2}',
            formatter: function (params) {
              let tips = '<div>' + '<p>销售金额：' + params[0].data[0] + '</p>' + '<p>占比：' + params[0].data[1] + '%</p></div>'
              return tips
            },
            confine: true,
            padding: 10,
            backgroundColor: '#fff',
            borderColor: '#8FB5E3',
            borderWidth: '1',
            textStyle: {
              color: '#333'
            }
          },
          legend: {
            data: this.data.legend,
            // data:[{icon: 'rect', name: '各渠道销售额占比'}],
            bottom: 10,
            itemWidth: 20,
            borderRadius: 0
          },
          grid: {
            right: '8',
            left: '60',
            top: 60,
            bottom: 60,
          },
          xAxis: {
            type: 'category',
            data: this.data.xAxis_data,
            axisLine: {
              lineStyle: {
                color: '#ccc',
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 10,
              align: 'center',
              interval: 0,
              margin: 12
            },
            axisTick: {
              show: false,
              interval: 0
            }
          },
          yAxis: {
            type: 'value',
            max: 100,
            name: this.data.yAxis_name,
            nameLocation: 'middle',
            nameTextStyle: {
              color: '#666',
              fontSize: 10,
              align: 'left',
              verticalAlign: 'left'
            },
            nameGap: '40',
            minInterval: 25,
            axisLabel: {
              fontSize: 10,
              color: '#666',
              // margin: -1,
              formatter: function (value) {
                return value + '%'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
              }
            },
            axisTick: {
              show: false,

            },
          },
          series: [

            {
              name: this.data.series_title,
              type: 'scatter',
              data: this.data.list_value,
              symbolSize: function (data) {
                return Math.sqrt(data[1]) / 0.15;
              },
              hoverAnimation: false,
              label: {
                normal: {
                  show: true,
                  shadowBlur: 10,
                  shadowColor: 'rgba(25, 100, 150, 0.5)',
                  position: ['80%', '100%'],
                  formatter: function (param) {
                    return param.data[2];
                  },

                  borderWidth: 1,
                  color: '#666',
                },
                emphasis: {
                  show: true
                }
              },

            },


          ]
        }
      )
      window.addEventListener('resize', () => {
        this.chartDom.resize()
      })
    },
  },
  mounted: function () {
    this.init()
      .update()
  },
  props: {
    id: {
      type: String,
      required: true
    },
    title: [String, Number],
    subtext: [String, Number],
    seriesTitle: [String, Number],
    yAxisName: [String, Number],
    legend: [Array],
    xAxisData: [Array],
    listVal: [Array],


  },
  watch: {
    title(v) {
      this.data.title = v
      this.update()

    },
    subtext(v) {
      this.data.subtext = v
      this.update()

    },
    seriesTitle(v) {
      this.data.series_title = v
      this.update()
    },
    legend(v) {
      this.data.legend = v
      this.update()
    },
    xAxisData(v) {

      this.data.xAxis_data = v
      this.update()
    },
    yAxisName(v) {

      this.data.xAxis_name = v
      this.update()
    },
    listVal(v) {
      this.data.list_value = v
      this.update()
    },
  }
}
