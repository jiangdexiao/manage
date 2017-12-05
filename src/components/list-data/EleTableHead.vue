<template>
  <el-col :span="24" class='actions-top'>
    <div class="list-header">
      <slot name="sls-header-before"></slot>
    </div>

    <el-button
        v-if='toolbar.btn_add!==false'
        type='primary'
        icon='add'
        @click='onBtnEvent({type:"Add"})'>{{ toolbar.btn_add_text || '添加'}}</el-button>
    <el-button
        v-if='toolbar.btn_delete!==false'
        type='danger'
        icon='delete'
        :disabled='batch.flag'
        @click='onBtnEvent({type:"BatchDelete"})'>{{ toolbar.btn_delete_text ||'删除'}}</el-button>
    

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
        type: Object,
        default () {
          return {}
        }
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
