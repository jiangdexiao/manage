export default {
    name: 'list',
    data () {
      return {
        list: [],
        fields: [
          { key: 'id', label: 'ID'}, 
          { key: 'name', label: '姓名'}
        ],
        pagination:{
          total:0
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
      const obj = {
        id: 1,
        name: '赛'
      }
      this.list = Array(30).fill(obj)
      this.pagination.total= this.list.length
    },
    watch: {
      $route (to, from) {
  
      }
    }
  
  }
  