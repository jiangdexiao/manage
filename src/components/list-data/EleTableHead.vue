<template>
    <div>
        <el-col :span="24" class='toolbar' v-if="fields && fields.length">
            <!-- <div class="list-header">
            <slot name="sls-header-before"></slot>
            </div> -->
            <form-data
                :Setting="setting"
                :FieldList='fields'
                :DefaultValue="default_value"
                :Rules="rules"
                @onSubmit='onSearch'></form-data>
            
            <!-- <div class='list-header'>
            <slot name="sls-header-after"></slot>
            </div> -->
        </el-col>
        <el-col :span="24" class="toolbar btnbar" v-if="toolbar && toolbar.length > 0">
          <el-button 
                v-for="(btn,index) in toolbar" :key="index"
                v-if=" ( btn.condition && typeof btn.condition == 'function' && btn.condition({btnInfo:btn,batch:batch}) || !btn.condition || (btn.condition && typeof btn.condition !='function') )"
                :type="btn.type || 'primary'"
                size="medium"
                :icon="btn.icon || 'add'"
                @click='onBtnEvent({btnInfo:btn,batch:batch})'>{{ btn.text || '添加'}}</el-button>
        </el-col>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        disabled: true
      }
    },
    computed: {
        //批量操作获取的数据
      batch () {
        return this.Batch
      },
      //工具栏按钮
      toolbar () {
        return this.ToolBar
      },
      rules(){
          return this.Search.rules || {}
      },
      //查询字段
      fields () {
        return this.Search.fields || []
      },
      //查询默认值
      default_value () {
        return this.Search.default_value || {}
      },
      //表单样式
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
    // display: inline-block;
  }

  .list-search {
    // display: inline-block;
    // float: right;
  }
</style>
