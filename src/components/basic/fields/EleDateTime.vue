<template>
  <div>
    <el-date-picker
      @change="onChange"
      v-model="submit_data[data.key]"
      v-bind="date_time_attrs"
      type="datetime"
      :placeholder="data.desc">
    </el-date-picker>
  </div>
</template>
<script>
  import Common from './js/Common'

  var Js = Common('ele-date-time')
  Js.mixins = [{
    computed: {
      date_time_attrs () {
        return this.Data.date_time_attrs || {}
      }
    },
    methods: {
      onChange (v) {
        this.events.change && this.events.change(v)
      }
    }
  }]
  export default Js
</script>
