import echarts from 'echarts'

export default {
  name: 'chart-line',
  data() {
    return {
      chartDom: null,
      data: {
        id: this.id,
        title: this.title,
        subtext: this.subtext,
        legend_data: this.legendDada,
        xAxis_data:this.xAxisData,
        yAxis_name: this.yAxisName,
        first_name: this.firstName,
        first_data: this.firstData,
        two_name: this.twoName,
        two_data: this.twoData,
        grid: this.grid,
      },

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
      if(this.chartDom){
        this.chartDom.setOption({
          color: ['#5891D5', '#FCC192'],
          title: {
            text: this.data.title,
            subtext: this.data.subtext,
          },
          tooltip: {
            trigger: 'axis',
            snap: true,
            axisPointer: {
              type: 'none',
            },
            confine: true,
            padding: 10,
            formatter: '{b0}<br/> {a1}: {c1}%<br />{a0}: {c0}',
            backgroundColor: '#fff',
            borderColor: '#FCC192',
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
            data:this.data.legend_data,
            bottom: 5,
            itemWidth: 20,
            borderRadius: 0
          },
          xAxis: [
            {
              data:this.data.xAxis_data,
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
              min: 0,
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
              name: this.data.two_name,
              type: 'line',
              symbol: 'circle',
              symbolSize: 7,
              showAllSymbol: true,
              yAxisIndex: 1,
              data: this.data.two_data,
              barWidth: 18,
              label: {
                normal: {}
              }

            },
            {
              name: this.data.first_name,
              type: 'line',
              symbol: 'circle',
              symbolSize: 7,
              showAllSymbol: true,
              yAxisIndex: 0,
              data: this.data.first_data,
              barWidth: 18,
              label: {
                normal: {}
              }
            },

          ]
        })
        window.addEventListener('resize', () => {
          this.chartDom.resize()
        })
      }

    }
  },
  mounted: function () {
    this.init()
      .update()
  },
  props: {
    id: [String],
    title: [String, Number],
    subtext: [String, Number],
    yAxisName: [String, Number],
    firstName: [String, Number],
    twoName: [String, Number],
    legendDada: [Array],
    grid: [Object],
    xAxisData: {
      type: Array,
      required: true
    },
    firstData: {
      type: Array,
      required: true
    },
    twoData: {
      type: Array,
      required: true
    },
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
    legendDada (v) {
      this.data.legend_dada = v
      this.update()
    },
    xAxisData (v) {
      this.data.xAxis_data = v
      this.update()
    },
    yAxisName (v) {
      this.data.yAxis_name = v
      this.update()
    },
    firstName (v) {
      this.data.first_name = v
      this.update()
    },
    firstData (v) {
      this.data.first_data = v
      this.update()
    },
    twoName (v) {
      this.data.two_name = v
      this.update()
    },
    twoData (v) {
      this.data.two_data = v
      this.update()
    },
  },
}
