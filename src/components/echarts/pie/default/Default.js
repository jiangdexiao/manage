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
        value_list: this.dataList,
        legend: this.legend,
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
      let that =this;
      this.chartDom.setOption({
        color: ['#335887', '#4f85cd', '#8dacd1', '#86adde', '#c0d5ee', '#b2c8e1'],
        title: {
          text: that.data.title,
          subtext: that.data.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
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
          orient: 'vertical',
          left: '5',
          top: '10',
          bottom: '5',
          data: that.data.legend
        },
        series: [{
          name: that.data.series_title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: that.data.value_list,
          avoidLabelOverlap: true,
          legendHoverLink: false,
          hoverAnimation: false,
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: '1.5'
            },
          },
          label: {
            normal: {
              show: true,
              position: 'outside',
              formatter: '{b}  {d}%',
              /*formatter: function (item) {
                return item.value + ' , ' + prop[item.dataIndex] + '%'
              },*/

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
        }],
      })
      window.addEventListener('resize', () => {
        this.chartDom.resize()
      })
    },

    updateTextList() {
      var data = this.data.data_list
      this.data.text_list = []
      for (var i = 0; i < data.length; i++) {
        this.data.text_list.push(data[i].name)
      }
      return this
    }
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
    legend: [Array],
    dataList: {
      type: Array,
      required: true
    }
  },
  watch: {
    dataList(v) {
      this.data.value_list = v
      this.update()
    },
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
  }
}
