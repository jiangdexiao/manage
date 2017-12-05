export default {
    name: 'list',
    data () {
      return {
        list: [],
        fields: [
          { key: 'id', label: 'ID'}, 
          { key: 'name', label: '姓名'},
          { key: 'date', label: '时间',formatter:function(row,column,cellValue){ return cellValue + '1'}}
        ],
        pagination: {
          current_page: 1,
          page_size:10,
          total: 30
        },
        btn_info:{
          list:[
            {
              text:'自定义'
            }
          ]
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
      const obj = {id:'1',name:'张三',date:'2017-01-01 12:11:10'}
      this.list = Array(30).fill(obj)
      this.pagination.total= this.list.length
    },
    watch: {
      $route (to, from) {
  
      }
    }
  
  }
  