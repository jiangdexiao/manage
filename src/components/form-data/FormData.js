// import Fields from './fields/'
export default {
  // components: Fields,
  name: 'form-data',
  data () {
    return {
      setting: this.Setting,
      primary_key: this.PrimaryKey,
      fields: this.FieldList,
      components: {
        input: 'ele-input',
        textarea: 'ele-textarea',
        select: 'ele-select',
        radio: 'ele-radio',
        switch: 'ele-switch',
        cascader: 'ele-cascader',
        checkbox: 'ele-checkbox',
        date: 'ele-date',
        daterange: 'ele-date-range',
        year: 'ele-date-year',
        month: 'ele-date-month',
        week: 'ele-date-week',
        time: 'ele-time',
        timerange: 'ele-time-range',
        timefixed: 'ele-time-fixed',
        timefixedrange: 'ele-time-fixed-range',
        datetime: 'ele-date-time',
        datetimerange: 'ele-date-time-range',
        editor: 'ele-editor'
      },
      cur_component: '',
      temp_field_obj: {},
      submit_data: this.DefaultValue,
      submit_info: {},
      rules: this.Rules || {}
    }
  },
  methods: {
    getComponent(key){
      return this.components[key] || 'ele-input'
    },
    /**
     * 表单提交事件
     */
    onSubmit (ref) {
      var data = {
        data: this.submit_data,
        info: this.submit_info
      }
      if (this.rules) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$emit('onSubmit', data)
          }
        })
      } else {
        this.$emit('onSubmit', data)
      }
    }
  },
  created () {
  },
  mounted () {
    // console.log(this.fields);

  },
  props: {
    FieldList: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    Editor: {
      type: Object,
      default () {
        return {}
      }
    },
    Rules: {
      type: Object,
      default () {
        return {}
      }
    },
    DefaultValue: {
      type: Object,
      default () {
        return {}
      }
    },
    Setting: {
      type: Object,
      default () {
        return {}
      }
    },
    PrimaryKey: {
      type: String,
      default: 'form-data'
    }
  },

  /**
   * 监控参数
   * @type {Object}
   */
  watch: {
    FieldList: {
      deep: true,
      handler (v) {
        if (v) {
          this.fields = v
        }
      }
    },
    submit_data: {
      deep: true,
      handler (v) {

      }
    },
    DefaultValue: {
      deep: true,
      handler (v) {
        this.default_value = v
      }
    },
    wangeditor_update (v) {

    },
    Setting (v) {
      this.setting = v
    },
    PrimaryKey (v) {
      this.primary_key = v
    }
  }
}
