<template>
  <div class='list'>
    <ele-table-head
      @onSearch="onSearch"
      @onBtnEvent="onBtnEvent"
      :Batch="batch"
      :Search="search"
      :ToolBar="toolbar">
      <span slot="sls-header-after"><slot name="header-after"></slot></span>
      <span slot="sls-header-before"><slot name="header-before"></slot></span>
    </ele-table-head>
    <el-table border style="width: 100%" align='center' :data="list" @selection-change='onSelectionChange'>
        <el-table-column fixed type="expand"  v-if='expand !== false'>
            <template slot-scope="scope">
                <slot name="expand" :data="scope.row" :index="scope.$index"></slot>
            </template>
        </el-table-column>

        <el-table-column fixed v-if=' checkbox !== false' type="selection"  width="55" align='center' ></el-table-column>

        <!--
            prop ： 字段属性名 String
            label : 标题名称 String
            align : 对齐方式 left/center/right
            header-align: 表头对齐方式，若不设置该项，则使用表格的对齐方式 left/center/right
            sortable：是否可以排序 Boolean
            formatter :用来格式化内容 Function(row, column, cellValue)
            filters： 数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。 Array[{ text, value }]
            filter-method ：数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。Function(value, row)
            filter-multiple：数据过滤的选项是否多选 Boolean
            class-name : 列的 className   string
            label-class-name :当前列标题的自定义类名  string
            resizable: 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）
            show-overflow-tooltip :当内容过长被隐藏时显示 tooltip	
            -->
        <template v-for='(field,index) in fields' >
            <el-table-column
                fixed
                :key="index"
                v-if='field.type === "operate"'
                :label="field.label || '操作'"
                :width="field.width || 300"
                :align="field.align || 'center'">
                <template slot-scope='scope'>
                    <!--自定义操作按钮-->
                    <span v-if=' field.btns && field.btns.length > 0 ' >
                        <el-button
                            v-for='(btn,index) in field.btns'
                            v-if=" ( !btn.condition || typeof btn.condition !== 'function') || ( btn.condition && btn.condition({list:list,data:scope.row,dataIndex:scope.$index,btnIndex:index,btn:btn}) == true )  "
                            :key='index'
                            :type="'text'"
                            :icon="btn.icon"
                            size="mini"
                            @click='onBtnEvent({btnInfo:btn,data:scope.row,dataIndex:scope.$index,btnIndex:index,list:list})'> {{ btn.text ||''}}</el-button>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :key="index"
                v-if='!field.type'
                :prop="field.key"
                :label="field.label"
                :align="field.align || 'center'"
                :header-align = 'field.header_align'
                :sortable="field.sort || false"
                :formatter='field.formatter'
                :filters='field.filter_list' 
                :filter-method="field.filter_method"
                :filter-multiple="field.filter_multiple"
                :class-name='field.class_name'
                :resizable = 'field.resizable'
                :show-overflow-tooltip = 'field.show_overflow_tooltip'
                :width='field.width'>
            </el-table-column>
            <el-table-column
                :key="index"
                v-if='field.type && field.type==="image"'
                :prop="field.key"
                :label="field.label"
                :align="field.align || 'center'"
                :width='field.width'>
                <template slot-scope='scope'>
                    <img :src="(field.host || '')+scope.row[field.key]" alt="">
                </template>
            </el-table-column>
            <el-table-column
                :key="index"
                v-if='field.type && field.type==="link"'
                :prop="field.key"
                :label="field.label"
                :align="field.align || 'center'"
                :width='field.width'>
                <template slot-scope='scope'>
                    <a :target="field.link_target || '_self'"
                    :href="scope.row[field.key]">{{field.link_text || scope.row[field.key]}}</a>
                </template>
            </el-table-column>
        </template>
    </el-table>

    <el-col :span="24" class='pagination-panel'>
        <el-pagination
            v-if='pagination  &&  ( pagination.total!==undefined && pagination.total>0 )'
            class='pagination'
            :page-sizes="pagination.page_sizes || [10,20,30,40,50,100]"
            :page-size="pagination.page_size || 10"
            :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
            :total="pagination.total || 0"
            :current-page='pagination.current_page || 1'
            @current-change='onChangeCurrentPage'
            @size-change='onChangePageSize'>
        </el-pagination>
    </el-col>
  </div>
</template>
<script>
  import ListDataJs from './ListData.js'

  export default ListDataJs
</script>
<style scoped lang='scss'>
  .pagination-panel {
    margin-top: 20px;
    text-align: left;
  }
  .pagination {
    display: inline-block;
  }

  .list {
    table {
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
</style>