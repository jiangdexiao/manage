export default {
    name: 'list',
    data () {
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'id', label: 'ID'}, 
            { key: 'name', label: '姓名'},
            { key: 'date', label: '时间',formatter:function(row,column,cellValue){ return cellValue + '1'}},
            { type:'operate',label: '操作',
              btns:[
                {text:'编辑',eventName:'onClickBtnEdit'},
                {text:'删除',type:'danger',eventName:'onClickBtnDelete'}
              ]
            }
          ],
          ToolBar:[
            {text:'添加',eventName:'onClickBtnAdd'},
            {text:'删除',type:'danger',eventName:'onClickBtnDelete'},
          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 30
          },
          Search: {
            fields: [{
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
            }, {
              label: '',
              key: 'input',
              desc: '请输入标题'
            }]
          }
        }
      }
    },
    methods: {
      // {type,data,dataIndex,list,btn,btnIndex}
      onChangeCurPage (page) {
        this.$message('当前页是第' + page + '页')
      },
      onChangeCurPageSize (pageSize) {
        this.$message('当前每页显示 ' + pageSize + ' 条')
      },
      onClickBtn (opts) {
        console.log(opts);
        this.$message('点击的是自定义')
      },
      onClickBtnAdd (opts) {
        // console.log(opts);
        this.$message('点击的是添加按钮')
      },
      onClickBtnEdit (opts) {
        // console.log(opts);
        this.$message('点击的是修改按钮')
      },
      onClickBtnView () {
        this.$message('点击的是查看按钮')
      },
      onClickBtnDelete () {
        this.$message('点击的是删除按钮')
      }
    },
    mounted () {
      for(let i =0;i<10;i++){

        this.datagrid.List.push({id:i,name:'张三',date:'2017-01-01 12:11:10'})
      }
      this.datagrid.Pagination.total= this.datagrid.List.length
    },
    watch: {
      $route (to, from) {
  
      }
    }
  }
  