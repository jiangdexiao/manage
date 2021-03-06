import EleTableHead from './EleTableHead.vue'

export default {
  name: 'list-data',
  components: {EleTableHead},
  data () {
    return {
      batch_flag: true, // 符合批量删除为true,否则为false
      batch_datas: [],
      batch_ids: [],
      batch: {
        flag: true,
        datas: [],
        ids: []
      },
      toolbar:this.DataGrid.ToolBar || [],//工具栏
      list: this.DataGrid.List || [], // 列表数组
      fields: this.DataGrid.FieldList || [], // 字段数组
      expand: this.DataGrid.Expand || false, // 折叠
      checkbox:this.DataGrid.Checkbox!==false?true:this.DataGrid.Checkbox,//是否显示复选框
      pagination: this.DataGrid.Pagination || {}, // 分页
      search: this.DataGrid.Search,// 搜索
      showSummary:this.DataGrid.ShowSummary,//是否显示合计行
      showSummaryMethod:this.DataGrid.ShowSummaryMethod //合计方法
    }
  },
  methods: {
    clearSelection(val){
      // console.log(val)
    },
    onSelect(val,row){
      // console.log(val)
      this.$emit('onSelect',val,row)
    },
    onSelectAll(val){
      // console.log(val)
      this.$emit('onSelectAll',val)
    },
    /**
     * 表格列表触发CheckBox的事件
     * @param  {array} val 
     */
    onSelectionChange (val) {
      this.batch.datas = val
      this.batch.ids = []
      if (val.length) {
        this.batch.flag = false
        for (var i = 0; i < val.length; i++) {
          this.batch.ids.push(val[i].id)
        }
      } else {
        this.batch.flag = true
      }

      /**
       * 改变CheckBox事件，第一个参数是ID数组，第二个参数二维数组，每个数组是选中的对象
       */
      this.$emit('onSelectionChange', {
        ids: this.batch.ids,
        datas: this.batch.datas
      })
      
    },

    /**
     * 搜索事件
     * @param data    搜索表单的值
     */
    onSearch (opts) {
      this.$emit('onSearch', opts)
      console.log(opts)
    },

    /**
     * 删除事件
     * @param  {object || boolean} user  当前信息对象或者为布尔值,为布尔值时，代表是批量删除
     * @param  {number} index 当前列表索引
     */
    onBatchDelete () {
      this.$emit('onClickBtnBatchDelete', {
        ids: this.batch.ids,
        datas: this.batch.datas
      })
    },

    /**
     * 点击按钮事件
     * @param opts  组装的返回参数
     * @param.attr  opts.eventName   string 按钮事件
     * @param.attr  opts.index  number      当点击列表中的按钮时，此值为当前行的索引
     * @param.attr  opts.data   object      当点击列表中的按钮时，此值为当前行数据
     * @param.attr  opts.list   array       当点击列别中的按钮时，此值为当前列表数据
     */
    onBtnEvent (opts) {
      this.$emit(opts.btnInfo.eventName, opts,{ids: this.batch.ids,datas: this.batch.datas})
    },
    /**
     * 改变当前页码事件
     * @param  {number} page 当前页面
     */
    onChangeCurrentPage (page) {
      this.$emit('onChangeCurrentPage', page)
    },

    /**
     * 改变每页显示的数量事件
     * @param  {number} page_size 每页显示的数量
     */
    onChangePageSize (pageSize) {
      this.$emit('onChangePageSize', pageSize)
    },
    set(obj,key,value,event){
      this.$set(obj,key,value)
      if( event )event.stopPropagation()
    },
    blur(row,field){
      this.set(row ,'column_opened_state',false);
      field.control.blur(row);
    }
  },

  mounted () {
    // console.log(this.DataGrid);
  },

  /**
   * 接收参数
   * @type {Object}
   */
  props: {
    DataGrid:{
      type:Object,
      default(){
        return {}
      }
    }
  },

  /**
   * 监控参数
   * @type {Object}
   */
  watch: {
    'DataGrid.List'(v){
      if( v ){
        this.list = v
      }
    },
    'DataGrid.FieldList'(v){
      if( v ){
        this.fields = v
      }
    },
    'DataGrid.ToolBar'(v){
      if( v ){
        this.toolbar = v
      }
    },
    'DataGrid.Pagination'(v){
      this.pagination = v
    },
    'DataGrid.Checkbox'(v){
      this.checkbox = v
    },
    'DataGrid.Expand'(v){
      this.checkbox = v
    },
    'DataGrid.Search'(v){
      this.search = v
    },
    'DataGrid.ShowSummary'(v){
      this.showSummary = v
    }
  }
}
