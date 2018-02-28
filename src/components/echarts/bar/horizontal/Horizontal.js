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
        legend: this.legend,
        name_list: this.nameList,
        value_list: this.valueList,
        x_max:this.xMax,
      }

    }
  },
  methods: {
    init() {
      // 基于准备好的dom，初始化echarts实例
      this.chartDom = echarts.init(document.getElementById(this.data.id))
      return this
    },
    update() {
      if (this.chartDom === null) {
        this.init()
      }
      this.chartDom.setOption({
          color: ['#548FD5'],
          title: {
            text: this.data.title,
            subtext: this.data.subtext,
            bottom: '6',
            right: '-6',
            textStyle: {
              color: '#548FD5',
              width: 2,
              fontSize: 10
            },
          },
          tooltip: {
            trigger: 'axis',
            snap: true,
            axisPointer: {
              type: 'none',
            },
            confine: true,
            padding: 0,
            backgroundColor: '#fff',
            borderColor: '#8FB5E3',
            borderWidth: '1',
            textStyle: {
              color: '#333'
            }
          },
          grid: {
            left: '0%',
            right: '6%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            max:this.data.x_max,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: 'category',
            data: this.data.name_list,//that.visits.name,
            inverse: true,
            axisTick: {
              show: false,

            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 10,
              interval: 0,
            },
          },
          series: [
            {
              type: 'bar',
              barWidth: 8,
              data: this.data.value_list//that.visits.cnv
            },
          ]
        }
      )
      window.addEventListener('resize', () => {
        this.chartDom.resize()
      })
    }
  },
  mounted: function () {
    this.init()
      .update()
    // .update(this.data)
  },
  props: {
    id: [String],
    title: [String, Number],
    xMax: [String, Number],
    subtext: [String, Number],
    legend: [Array],
    nameList: {
      type: Array,
      required: true
    },
    valueList: {
      type: Array,
      required: true
    }
  },
  watch: {
    id(v) {
      this.data.id = v
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
    xMax(v) {
      if(v){
        this.data.x_max = v
        console.log(this.data.x_max)
        this.update()
      }
      else{
        console.log(v)
        this.data.x_max =null
      }

    },
    legend(v) {
      this.data.legend = v
      this.update()
    },
    nameList(v) {
      this.data.name_list = v
      this.update()
    },
    valueList(v) {
      this.data.value_list = v
      this.update()
    },
  }

}
