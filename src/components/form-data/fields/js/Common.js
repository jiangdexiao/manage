
export default function (name) {
    return {
      name: name,
      data () {
        return {}
      },
      computed: {
        //对象数据
        data () {
          return this.Data
        },
        events () {
          return this.Data.events || {}
        },
        //表单数据
        submit_data () {
          return this.SubmitData
        },
        submit_info () {
          return this.SubmitInfo
        },
        temp_field_obj () {
          return this.TempFieldObj
        },
        custom_attrs () {
          return this.Data.custom_attrs || {}
        },
        label_attr () {
          return this.custom_attrs.label || 'text'
        },
        value_attr () {
          return this.custom_attrs.value || 'value'
        }
      },
      props: {
        Data: {
          type: Object,
          default () {
            return {}
          }
        },
        SubmitData: {
          type: Object,
          default () {
            return {}
          }
        },
        SubmitInfo: {
          type: Object,
          default () {
            return {}
          }
        },
        TempFieldObj: {
          type: Object,
          default () {
            return {}
          }
        }
      },
      methods: {
        /**
         * 处理表单控件值复数类型，比如，获取的值和显示的文本不同时，除了返回需要提交表单的value值，还需要返回显示的文本，以防不时之需
         */
        setArrayValue () {
          // 把存储value和text的数组转成对象格式，有利于提高根据值取文本的效率
          if (!this.temp_field_obj[this.data.key]) {
            this.temp_field_obj[this.data.key] = {}
          }
          
          console.log("name:"+name+' custom_attrs:'+this.custom_attrs)
  
          // 当存在value和text数组时，才可调用
          if (this.data.list && Array.isArray(this.data.list)) {
            // 遍历value和text数组，组装成对象格式
            this.data.list.forEach(item => {
              this.temp_field_obj[this.data.key][item[this.value_attr] !== undefined ? item[this.value_attr] : item[this.label_attr]] = item[this.label_attr] !== undefined ? item[this.label_attr] : item[this.value_attr]
            })
  
            // 如果当前默认值为真，默认先提取一下默认值对应的文本
            if (this.submit_data[this.data.key] !== undefined) {
              // 默认值分两种：数组(多选)，字符串或整形(单选)
              if (Array.isArray(this.submit_data[this.data.key])) {
                // 循环数组值，把每个对应的文本取出来
                this.submit_info[this.data.key] = []
                this.submit_data[this.data.key].forEach(item => {
                  if (this.temp_field_obj[this.data.key][item]) {
                    this.submit_info[this.data.key].push(this.temp_field_obj[this.data.key][item])
                  }
                })
              } else {
                // 不是数组，直接提取对应的值得文本
                this.submit_info[this.data.key] = ''
                if (this.temp_field_obj[this.data.key][this.submit_data[this.data.key]]) {
                  this.submit_info[this.data.key] = this.temp_field_obj[this.data.key][this.submit_data[this.data.key]]
                }
              }
            }
          }
        },
  
        /**
         * 当没有传默认值或者连default_value都不存在时(添加的时候确实是不需要传default_value,如果不这样操作一下，绑定将会失败)
         * 此时，组件中定义的default_value只是一个空对象，这时，v-model是无法绑定的，所以这个函数用来设置默认字段。
         */
        setDefaultFieldByNoDefaultValue () {
          if (this.submit_data[this.data.key] === undefined) {
            this.$set(this.submit_data, this.data.key, '')
          }
        },
  
        init () {}
      },
      created () {
        this.setDefaultFieldByNoDefaultValue()
        this.setArrayValue()
      },
      mounted () {
        this.init()
      },
      watch: {
        $route () {
          this.init()
        }
      }
    }
  }