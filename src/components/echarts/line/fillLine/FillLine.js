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
        series_name: this.seriesName,
        series_data: this.seriesData,
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
      }
      if(this.chartDom){
        this.chartDom.setOption({
          color: ['#8FB5E3'],
          title: {
            text: this.data.title,
            subtext: this.data.subtext,
          },
          tooltip: {
            trigger: 'axis',
            // snap: trsue,
            axisPointer: {
              type: 'none',
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
          grid: {
            right: '10',
            left: '60',
            top: 60,
            bottom: 60,
          },
          legend: {
            data: this.data.legend_data,
            bottom: 5,
            itemWidth: 20,
            borderRadius: 0
          },
          xAxis: [
            {
              data: this.data.xAxis_data,
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
              /*axisPointer:{
                  type: 'line'
              }*/
            },
          ],
          yAxis: [
            {
//              min: 100,
              type: 'value',
              name: this.data.yAxis_name,
              offset: 25,
              nameLocation: 'middle',
//              minInterval:1,
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
            }
          ],
          series: [{
            name: this.data.series_name,
            type: 'line',
//            symbol: 'circle',
            symbolSize: 7,
            showSymbol: false,
            data: this.data.series_data,
            barWidth: 18,
            label: {
              normal: {}
            },
            areaStyle: {
              normal: {
                color: '#8FB5E3'
              }
            },
            lineStyle: {
              normal: {
                color: '#8FB5E3',
                width: 0
              }
            }

          }]
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
    seriesName: [String, Number],
    yAxisName: [String, Number],
    legendDada: [Array],
    xAxisData: {
      type: Array,
      required: true
    },
    seriesData: {
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
    seriesName (v) {
      this.data.series_name = v
      this.update()
    },
    seriesData (v) {
      this.data.series_data = v
      this.update()
    },
  },
}
