export default {
    name: 'components-list-data-expand',
    components: {},
    data () {
      return {
        datagrid:{
            List: [],
            FieldList: [{
              key: 'name',
              label: '标题'
            }],
            Expand: true
        }
      }
    },
    created () {
      for (let i = 1; i <= 3; i++) {
        this.datagrid.List.push({
          name: '赛冷思' + i,
          address: '北京上海第 ' + i + ' 区'
        })
      }
    },
    methods: {
      init () {
  
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      $route () {
  
      }
    }
  }
  