<template>
  <el-col :span="24" class='actions-top'>
    <div class="list-header">
      <slot name="sls-header-before"></slot>
    </div>

    <template v-if="toolbar && toolbar.length > 0" >
        <el-button 
            v-for="(btn,index) in toolbar"
            :key="index"
            :type="btn.type || 'primary'"
            size="medium"
            :icon="btn.icon || 'add'"
            @click='onBtnEvent({btnInfo:btn,batch:batch})'>{{ btn.text || '添加'}}</el-button>
    </template>
    
    <div class='list-header'>
      <slot name="sls-header-after"></slot>
    </div>

    <div v-if="fields && fields.length" class="list-search">
      <form-data
        :Setting="setting"
        :FieldList='fields'
        :DefaultValue="default_value"
        @onSubmit='onSearch'></form-data>
    </div>
  </el-col>
</template>

<script>
  export default {
    data () {
      return {
        disabled: true
      }
    },
    computed: {
      batch () {
        return this.Batch
      },
      toolbar () {
        return this.ToolBar
      },
      fields () {
        return this.Search.fields || []
      },
      default_value () {
        return this.Search.default_value || {}
      },
      setting () {
        return this.Search.setting || {inline: true}
      }
    },
    props: {
      Batch: {
        type: Object,
        default () {
          return {}
        }
      },
      ToolBar: {
        type: Array
      },
      Search: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      onBtnEvent (opts) {
        this.$emit('onBtnEvent', opts)
      },
      onSearch (opts) {
        this.$emit('onSearch', opts)
      }
    },
    created () {

    },
    mounted () {

    },
    watch: {}
  }
</script>
<style scoped lang='scss'>
  .list-header {
    display: inline-block;
  }

  .list-search {
    display: inline-block;
    // float: right;
  }
</style>
