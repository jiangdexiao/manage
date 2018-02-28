import echarts from 'echarts'

export default {
  name: 'line-column',
  data() {
    return {
      chartDom: null,
      data: {
        id: this.id,
        title: this.title,
        subtext: this.subtext,
        legend: this.legendData,
        xAxis_data: this.xAxisData,
        yAxis_name: this.yAxisName,
        first_name: this.firstName,
        first_data: this.firstData,
        two_name: this.twoName,
        two_data: this.twoData,
        three_name: this.threeName,
        three_data: this.threeData,
        colors: this.colors,
        list_val: this.listVal
      },
      server: [],
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
      }
      if (this.data.colors === undefined) {
        this.data.colors = ['#548FD5', '#C7D9F1', '#FCC192'];
      }

      if (this.chartDom) {
        this.chartDom.setOption({
          color: this.data.colors,
          title: {
            text: this.data.title,
            subtext: this.data.subtext
          },
          tooltip: {
            trigger: 'axis',
            // snap: true,
            axisPointer: {
              type: 'none',
            },
            formatter: '{b0}<br/>{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}%',
            confine: true,
            padding: 10,
            backgroundColor: '#fff',
            borderColor: '#8FB5E3',
            borderWidth: '1',
            textStyle: {
              color: '#333'
            }
          },
          grid: {
            right: '40',
            left: '60',
            top: 60,
            bottom: 60,
          },
          legend: {
            data: this.data.legend,
            bottom: 5,
            itemWidth: 20,
            borderRadius: 0
          },
          xAxis: [
            {
              data: this.data.xAxis_data,
//              name: '0 (万)',
              nameLocation: 'start',
              nameTextStyle: {
                color: '#666',
                width: 2,
                fontSize: 9
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc',
                }
              },
              axisLabel: {
                color: '#666',
                fontSize: 10,
                align: 'center',
                interval: 1
              },
              axisTick: {
                interval: 0
              },
            },
          ],
          yAxis: [
            {
//              min: 100,
              type: 'value',
              name: this.data.yAxis_name,
              offset: 25,
              nameLocation: 'middle',
              nameTextStyle: {
                color: '#666',
                fontSize: 10,
                align: 'left',
              },
              boundaryGap: false,
              axisLine: {
                show: false,

              },
              axisTick: {
                show: false,

              },
              axisLabel: {
                fontSize: 10,
                margin: -15,
                formatter: function (value, index) {
                  if (index === 0) {
                    return '';
                  } else {
                    return value
                  }

                }
              }
            },
            {
//              minInterval: 3,
              type: 'value',
              offset: 20,
              max: 100,
              splitLine: {
                show: false
              },
              axisLine: {
                show: false,

              },
              axisTick: {
                show: false,

              },
              axisLabel: {
                fontSize: 10,
                margin: -15,
                formatter: function (value, index) {
                  if (index === 0) {
                    return '';
                  } else {
                    return value + '%'
                  }

                }
              }
            }

          ],
          series: [
            {
              name: this.data.first_name,
              type: 'bar',
              symbol: 'circle',
              symbolSize: 7,
              data: this.data.first_data,
              barWidth: 10,
              label: {
                normal: {}
              }

            },
            {
              name: this.data.two_name,
              type: 'bar',
              barGap: "0%",
              data: this.data.two_data,
              barWidth: 10,
              label: {
                normal: {}
              }

            },
            {
              name: this.data.three_name,
              type: 'line',
              yAxisIndex: 1,
              // symbol: 'circle',
              symbolSize: 7,
              showAllSymbol: true,
              data: this.data.three_data,
              label: {
                normal: {}
              },
            }
          ]
        })
        window.addEventListener('resize', () => {
          this.chartDom.resize()
        })
      }

    }
  },
  mounted() {
    this.init().update()
  },
  props: {
    id: [String],
    title: [String, Number],
    subtext: [String],
    legendData: [Array],
    colors: [Array],
    yAxisName: [String],
    firstName: [String],
    twoName: [String],
    threeName: [String],
    xAxisData: {
      type: Array,
      required: true,
    },
    firstData: {
      type: Array,
      // required: true
    },
    listVal: {
      type: Array,
      // required: true
    },
    twoData: {
      type: Array,
      // required: true
    },
    threeData: {
      type: Array,
      // required: true
    }
  },
  watch: {
    title(v) {
      this.data.title = v;
      this.update()
    },
    colors(v) {
      this.data.colors = v;
      this.update()
    },
    subtext(v) {
      this.data.subtext = v
      this.update()
    },
    legendData(v) {
      console.log('legend')
      this.data.legend = v
      this.update()
    },
    xAxisData(v) {
      this.data.xAxis_data = v
      this.update()
    },
    yAxisName(v) {
      this.data.yAxis_name = v
      this.update()
    },
    firstName(v) {
      this.data.first_name = v;
      this.update()
    },
    firstData(v) {
      this.data.first_data = v;
      this.update()
    },
    listVal(v) {
      this.data.list_val = v;
      this.update()
    },
    twoName(v) {
      this.data.two_name = v;
      this.update()
    },
    twoData(v) {
      this.data.two_data = v;
      this.update()
    },
    threeName(v) {
      this.data.three_name = v;
      this.update()
    },
    threeData(v) {
      this.data.three_data = v;
      this.update()
    },
  },
}
