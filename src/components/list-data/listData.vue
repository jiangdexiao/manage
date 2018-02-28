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
        <!-- element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" -->
        <!-- v-loading="$store.state.m_common.ajax_loading" -->
    <el-table 
        
        fit 
        highlight-current-row 
        stripe  
        style="width: 100%" align='center' :show-summary="showSummary" :summary-method="showSummaryMethod" :data="list" @select="onSelect"  @select-all="onSelectAll"  @selection-change='onSelectionChange'>
        <el-table-column fixed type="expand"  v-if='expand !== false'>
            <template slot-scope="scope">
                <slot name="expand" :data="scope.row" :index="scope.$index"></slot>
            </template>
        </el-table-column>

        <el-table-column fixed v-if=' checkbox !== false' type="selection"  width="55" align='center'></el-table-column>

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
             :当内容过长被隐藏时显示 tooltip	
            -->
        <template v-for='(field,index) in fields' >
            <!--显示操作列-->
            <el-table-column
                fixed
                :key="index"
                v-if='field.type === "operate"'
                :label="field.label || '操作'"
                :width="field.width || 150"
                :align="field.align || 'center'">
                <template slot-scope='scope'>
                    <!--自定义操作按钮-->
                    <span class="spansty" v-if=" ( field.condition || typeof field.condition == 'function') && field.condition({list:list,data:scope.row,dataIndex:scope.$index})">
                        {{ field.condition({list:list,data:scope.row,dataIndex:scope.$index}) }}
                    </span>
                    <span v-else-if=' field.btns && field.btns.length > 0 ' >
                        <span v-for='(btn,index) in field.btns' :key='index'>
                            <template v-if="btn.control && btn.control.display === true && btn.control.children && btn.control.children.length >0">
                                <el-dropdown trigger="click" menu-align="start" size="mini" :hide-on-click="false">
                                    <span>
                                        <el-button
                                            v-if=" ( btn.condition && typeof btn.condition == 'function' && btn.condition({list:list,data:scope.row,dataIndex:scope.$index,btnIndex:index,btn:btn}) )
                                            || !btn.condition || ( btn.condition && typeof btn.condition !== 'function')  "
                                            :type="'text'"
                                            :icon="btn.icon"
                                            size="mini"
                                            @click='onBtnEvent({btnInfo:btn,data:scope.row,dataIndex:scope.$index,btnIndex:index,list:list})'>
                                                <span class="spansty" :style="btn.style||''">{{ btn.text ||''}}</span>
                                            </el-button>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="( control,m ) in btn.control.children" :key="m">
                                            <div class="control">
                                                <template v-if="!control.type || control.type == 'input'">
                                                    <span>{{ control.name }}</span>
                                                    <el-input v-model="control.value" size="mini" @blur="control.callback(control,scope.row,scope.$index)"></el-input>
                                                    <span>{{ control.prefix }}</span>
                                                </template>
                                            </div>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                            <template v-else>
                                <el-button
                                    v-if=" ( btn.condition && typeof btn.condition == 'function' && btn.condition({list:list,data:scope.row,dataIndex:scope.$index,btnIndex:index,btn:btn}) )
                                    || !btn.condition || ( btn.condition && typeof btn.condition !== 'function')  "
                                    :type="'text'"
                                    :icon="btn.icon"
                                    size="mini"
                                    @click='onBtnEvent({btnInfo:btn,data:scope.row,dataIndex:scope.$index,btnIndex:index,list:list})'>
                                        <span class="spansty" :style="btn.style||''">{{ btn.text ||''}}</span>
                                    </el-button>
                            </template>
                        </span>
                    </span>
                </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column :key="index" v-if="field.type === 'index' && field.indexMethod && typeof field.indexMethod === 'function'" type="index" :index="field.indexMethod"></el-table-column>
            <!--普通文本列-->
            <el-table-column
                :key="index"
                v-else-if='!field.type || field.type==="text"'
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
                :width='field.width'
                :render-header='field.headerRender'>
                <template slot-scope="scope">
                    <template v-if="field.control && field.control.type === 'input'">
                        <span v-if="!scope.row.column_opened_state">
                            <el-col :span="18">
                                <!-- <span>{{scope.row[field.key]}}</span> -->
                                <template v-if="field.tooltip === true  && scope.row[field.key] && scope.row[field.key].length">
                                    <el-tooltip  class="item" effect="light" :content="scope.row[field.key]+''" placement="top">
                                        <span v-if="field.formatter && typeof field.formatter === 'function'">{{ field.formatter(scope.row,scope.column) }}</span>
                                        <span>{{scope.row[field.key]}}</span>
                                    </el-tooltip>
                                </template>
                                <template v-else>
                                    <span v-if="field.formatter && typeof field.formatter === 'function'">{{ field.formatter(scope.row,scope.column) }}</span>
                                    <span v-else>{{scope.row[field.key]}}</span>
                                </template>
                            </el-col>
                            <el-col :span="6">
                                <i style="cursor:pointer;" class="el-icon-edit" @click.stop="set(scope.row ,'column_opened_state',true)" ></i>
                            </el-col>
                        </span>
                        <span  v-else>
                            <el-col :span="18">
                                <el-input :maxlength="field.control.maxLength" :style="{width:(field.control.width||field.width||100)+'px'}" v-model="scope.row[field.key]" @blur="blur(scope.row,field,$event)" placeholder="请输入内容"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <i style="cursor:pointer;margin-top:49%;" class="el-icon-circle-close-outline" @click.stop="set(scope.row ,'column_opened_state',false,$event)" ></i>
                            </el-col>
                        </span>
                    </template>
                    <template v-else-if="(field.style && typeof field.style === 'function')">
                        <span :style="field.style(scope.row)" v-if="field.formatter && typeof field.formatter === 'function'">{{ field.formatter(scope.row,scope.column) }}</span>
                        <span :style="field.style(scope.row)" v-else>{{scope.row[field.key]}}</span>
                    </template>
                     <template v-else-if="field.tooltip === true  && scope.row[field.key] && scope.row[field.key].length">
                        <el-tooltip  class="item" effect="light" :content="scope.row[field.key]+''" placement="top">
                            <span v-if="field.formatter && typeof field.formatter === 'function'">{{ field.formatter(scope.row,scope.column) }}</span>
                            <span>{{scope.row[field.key]}}</span>
                        </el-tooltip>
                    </template>
                    <template v-else>
                        <span v-if="field.formatter && typeof field.formatter === 'function'">{{ field.formatter(scope.row,scope.column) }}</span>
                        <span v-else>{{scope.row[field.key]}}</span>
                    </template>
                </template>
            </el-table-column>
            <!--默认列-->
            <el-table-column
                :key="index"
                v-else-if='!field.type'
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
                :width='field.width'>
            </el-table-column>
            <!--显示html列-->
            <el-table-column
                :key="index"
                v-else-if='field.type==="html"'
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
                :width='field.width'>
                <template slot-scope="scope">
                    <span v-if="field.formatter && typeof field.formatter === 'function'" v-html="field.formatter(scope.row,scope.column)" ></span>
                    <span v-else v-html="scope.row[field.key]"></span>
                </template>
            </el-table-column>
            <!--显示图片列-->
            <el-table-column
							:key="index"
							v-else-if='field.type==="image"'
							:prop="field.key"
							:label="field.label"
							:align="field.align || 'center'"
							:width='field.width'>
							<template slot-scope='scope'>
								<template v-if="(scope.row[field.key])||(field.formatter && typeof field.formatter === 'function' && field.formatter(scope.row))">
									<el-popover v-if="field.formatter && typeof field.formatter === 'function' && field.formatter(scope.row) " trigger="hover" placement="right">
											<!--<img  :style="{width:(field.previewWidth||45)+'px',height:(field.previewHeight||45)+'px'}" :src="field.formatter(scope.row,scope.column)" alt="">-->
												<img  :style="{width:(field.previewWidth||45)+'px'}" :src="field.formatter(scope.row,scope.column)" alt="">
											<div slot="reference" class="name-wrapper">
													<img  :style="{width:(field.imageWidth||45)+'px',height:(field.imageHeight||45)+'px'}" :src="field.formatter(scope.row,scope.column)" alt="">
											</div>
									</el-popover>
									<el-popover v-else trigger="hover" placement="right">
											<img  :style="{width:(field.previewWidth||45)+'px'}" :src="scope.row[field.key]" alt="">
											<div slot="reference" class="name-wrapper">
													<img  :style="{width:(field.imageWidth||45)+'px',height:(field.imageHeight||45)+'px'}" :src="scope.row[field.key]" alt="">
											</div>
									</el-popover>
							</template>
							<template v-else>
									<span>-</span>
							</template>
							</template>
            </el-table-column>
            <!--显示链接列-->
            <el-table-column
                :key="index"
                v-else-if='field.type==="link"'
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
            :page-sizes="pagination.page_sizes || [5,10,20,30,40,50,100]"
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
  .spansty {
      padding-right:8px;
      font-size:14px;
  }
  .list {
    table {
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }
  .control .el-input{
        width:50px !important
    }
</style>