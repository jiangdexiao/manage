export default {
    name: 'list',
    data () {
      return {
        datagrid:{
          List: [],
          FieldList: [
            { key: 'id', label: 'ID'}, 
            { key: 'name', label: '姓名'},
            { key: 'state', label: '状态'},
            { key: 'image', label: '图片',type:'image'},
            { key: 'url', label: '链接',type:'link'},
            { key: 'date', label: '时间',formatter:function(row,column,cellValue){ return cellValue + '1'}},
            { type:'operate',label: '操作',
              btns:[
                {text:'编辑',eventName:'onClickBtnEdit',condition:function({data}){ return data.state == 0 }},
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
              desc: '请输入标题'
            }],
            //表单规则
            rules:{
              input: [
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ]
            }
          }
        }
      }
    },
    methods: {
      onClickBtnAdd (opts) {
        // console.log(opts);
        this.$message('点击的是添加按钮')
      },
      onClickBtnEdit (opts) {
        // console.log(opts);
        this.$message('点击的是修改按钮')
      },
      onClickBtnDelete () {
        this.$message('点击的是删除按钮')
      }
      // {type,data,dataIndex,list,btn,btnIndex}
      onChangeCurPage (page) {
        this.$message('当前页是第' + page + '页')
      },
      onChangeCurPageSize (pageSize) {
        this.$message('当前每页显示 ' + pageSize + ' 条')
      }
    },
    mounted () {
      for(let i =0;i<10;i++){

        this.datagrid.List.push({id:i,name:'张三',image:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',url:'http://www.baidu.com',state:i/2,date:'2017-01-01 12:11:10'})
      }
      this.datagrid.Pagination.total= this.datagrid.List.length
    },
    watch: {
      $route (to, from) {
  
      }
    }
  }
  