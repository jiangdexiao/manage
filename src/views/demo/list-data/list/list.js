export default {
  name: 'list',
  data() {
    return {
      /**
       * 列表信息
       */
      datagrid: {
        /**
         * 列表数据
         */
        List: [],
        /**
         * 1.列表字段信息
         * 列元素对象
         * key:字段名称
         * label:列头名称
         * width:列宽度
         * align:列内容显示的对齐方式  left center  right  默认center
         * header-align：列头部label显示的对齐方式 left center  right 默认center
         * sortable：列是否可排序  boolean  默认false
         * filters：数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。Array[{ text, value }] 
         * filter-method：数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示。Function(value, row)
         * filter-multiple：数据过滤的选项是否多选 Boolean 默认true
         * class-name：列的 className
         * resizable：对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真） boolean 默认true
         * formatter:自定义列格式化方法function(row, column, cellValue) 接收3个参数
         * headerRender：function(h,{column,index}){} 列标题 Label 区域渲染使用的 只支持jsx语法
         * type:列表内容类型
         *    1.默认 值为文本列（即不定义type属性则为文本列）
         *    2.值为 index  则显示为索引列  indexMethod:自定义索引列值得方法
         *    3.值为 link  则显示为链接列
         *        link_target：链接打开窗口所在位置  默认 _self 当前窗口打开
         *        link_text:链接文本内容  默认 列字段所对应内容
         *    4.值为 html  则显示为html列
         *    5.值为 text 则显示为文本列
         *    6.值为 image  则显示为图片列 
         *         imageWidth:单元格中图片显示的宽度
         *         imageHeight：单元格中图片显示的高度
         *         previewWidth:图片列预览图片的宽度
         *         previewHeight：图片列预览图片的高度
         *    
         *    7.值为 operate  则显示为操作列
         *      condition：function ({data}) 自定义列操作显示  返回 null 则显示btns项 否则显示返回结果值
         *      btns：操作列按钮数组 按钮数组对象描述:
         *        text:按钮名称
         *        type:按钮样式
         *        eventName：按钮事件名称
         *        condition：function ({data}) 自定义按钮显示  返回true则显示  返回false 则不显示
         *        control：自定义操作按钮触发事件后的显示控件
         *          type：控件类型  目前暂只支持 drowdown 下拉形式的显示方式
         *          display:true  是否显示
         *          children:子控件数组
         *            type：子控件类型 目前暂只支持 input  文本框控件
         *            name：子控件名称
         *            value：绑定控件的值
         *            class：控件样式类名称
         *            prefix：控件后缀名称
         *            callback：function（row) 控件触发的事件的回调方法  暂只支持input 的 blur事件方法
         * 
         * 
         * control 是否自定义单元格控件
         *    type：控件类型 input为文本框  目前暂只支持文本框（可自行扩展）
         *    width：控件宽度
         *    maxLength：文本框控件可允许最大的输入字符数
         *    blur：function(row){}文本框焦点离开事件，接收一个参数
         * style：单元格自定义样式 function（）{}返回一个样式字符串
         * tooltip：单元格是否可以显示提示内容
         */
        FieldList: [
          {key: '', label: '排序',type:'index',indexMethod:(index)=>{
            return index++
          }},
          {key: 'id', label: 'ID'},
          {
            key: 'name', label: '姓名', width: 180, control: {
            type: 'input', width: 120, maxLength: 10, blur: function (row) {
              //此处调用api
              //_this.api
              console.log(row.name)
            }
          }
          },
          {key: 'state', label: '状态', headerRender:(h,{column,index})=>{
                    
            return <el-tooltip placement="right" content="状态">
                    <span>状态  <i class="iconfont icon-ico_explain"></i></span>
                  </el-tooltip>
          } },
          {key: 'image', label: '图片', type: 'image'},
          {key: 'url', label: '链接', type: 'link'},
          {
            key: 'date', label: '时间', formatter: function (row, column, cellValue) {
            return cellValue + '1'
          }
          },
          {
            type: 'operate', label: '操作', condition: function ({data}) {//自定义列显示  返回null 则显示btns项
            if (data.state == 0)
              return 'abc'
            return null
          },
            btns: [
              {
                text: '编辑', eventName: 'onClickBtnEdit', condition: function ({data}) {
                  return data.state == 0
                }
              },
              {text: '删除', type: 'danger', eventName: 'onClickBtnDelete'},
              {text: '移动',  eventName: 'onClickBtnMove',
                control:{
                  display:true,
                  type:'drowdown',//下拉形式
                  children:[
                    {name:'上移',type:'input',value:'',prefix:'位',class:'drowdown-default',
                      callback:( row )=>{
                        //api 上移 
                        // row.value
                        console.log('回调');
                        row.value = '' }
                      }
                  ] 
                }
              }
            ]
          }
        ],
        /**
         * 工具栏按钮 Array
         * text:按钮名称
         * type:按钮样式
         * eventName:按钮点击的触发事件名称
         */
        ToolBar: [
          {text: '添加', eventName: 'onClickBtnAdd'},
          {text: '删除', type: 'danger', eventName: 'onClickBtnDelete'},
        ],
        /**
         * 分页信息
         * current_page：当前第几页
         * page_size：每页条数
         * total：总条数
         */
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 30
        },
        /**
         * 是否显示展开列
         */
        expand:true,
        /**
         * 是否显示checkbox列
         */
        Checkbox:false,
        /**
         * ShowSummary:是否显示合计行
         * ShowSummaryMethod:自定义合计行方法
         */
        ShowSummary: true,
        ShowSummaryMethod:(param)=>{
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            } else {
              sums[index] = '';
            }
          });
  
          return sums;
        },
        //查询表单
        Search: {
          fields: [
            {
              key: 'cate',
              type: 'select',
              multiple: false,
              list: [{
                value: 'jishu',
                text: '技术'
              }, {
                value: 'sanwen',
                text: '散文'
              }, {
                value: 'qita',
                text: '其他'
              }],
              desc: '请选择分类',
              label: ''
            },
            {
              label: '',
              key: 'input',
              type: 'input',
              desc: '请输入标题'
            }],
          //表单规则
          rules: {
            input: [
              {required: true, message: '请输入活动名称', trigger: 'blur'},
              {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
            ]
          }
        }
      }
    }
  },
  methods: {
    /**
     * 当用户手动勾选数据行的 Checkbox 时触发的事件
     * @param {*} selection 
     * @param {*} row 
     */
    onSelect(selection, row){

    },
    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     * @param {*} selection 
     */
    onSelectAll(selection){

    },
    /**
     * 当选择项发生变化时会触发该事件
     * @param {*} selection 
     */
    onSelectionChange(selection){

    },
    onClickBtnAdd(opts) {
      // console.log(opts);
      this.$message('点击的是添加按钮')
    },
    onClickBtnEdit(opts) {
      // console.log(opts);
      this.$message('点击的是修改按钮')
    },
    onClickBtnDelete() {
      this.$message('点击的是删除按钮')
    },
    // {type,data,dataIndex,list,btn,btnIndex}
    onChangeCurPage(page) {
      this.$message('当前页是第' + page + '页')
    },
    onChangeCurPageSize(pageSize) {
      this.$message('当前每页显示 ' + pageSize + ' 条')
    }
  },
  mounted() {
    for (let i = 0; i < 10; i++) {

      this.datagrid.List.push({
        id: i,
        name: '张三',
        image: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
        url: 'http://www.baidu.com',
        state: i / 2,
        date: '2017-01-01 12:11:10'
      })
    }
    this.datagrid.Pagination.total = this.datagrid.List.length
  },
  watch: {
    $route(to, from) {

    }
  }
}
