<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="init">  
        <el-tab-pane label="按位置" name="first"></el-tab-pane>
        <el-tab-pane label="按媒体分类" name="second"></el-tab-pane>
        <el-tab-pane label="按展现形式" name="third"></el-tab-pane>
    </el-tabs>
    <list-data
        ref='list-data'
        @view="view"
        :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTabName: 'first',
      datagrid:{
        List:[],
        FieldList: [
          { key: 'cateName', label: '位置'},
          { key: 'advNum', label: '广告位数量'},
          { key: 'photographNum', label: '近30天扫拍量'},
          { key: 'dealNum', label: '近30天成交量'},
          { key: 'conversionRate', label: '近30天转化率'},
          { key: 'advRoi', label: '近30天ROI'},
          { type: 'operate', label: '序号',
            condition : function(list){
              if(list.list.length-1 == list.dataIndex){
                return '小计'
              }else{
                return list.dataIndex+1
              }
            }
          },
          { type: 'operate', label: '操作',
            btns:[
               {text:'查看详细',eventName:'view',condition:( row )=>{
                 if( row.list.length-1 == row.dataIndex ){
                   return false
                 }
                 return true
               }}
            ]
          },
        ],
        Checkbox:false
      },
      form:{
        type:1
      }

    }
  },
  methods: {
    view(opts) {
      this.$router.push({path:'/mu/conversion/detail', query:{type:this.form.type,cate:opts.data.cate}})
    },
    init() {
      if(this.activeTabName=='first'){  
        this.form.type = 1
        this.datagrid.FieldList[0].label = '位置';
        
      }else if(this.activeTabName=='second'){  
        this.form.type = 3
        this.datagrid.FieldList[0].label = '媒体分类';

      }else if(this.activeTabName=='third'){
        this.form.type = 2
        this.datagrid.FieldList[0].label = '展现形式';
      }
      this.api_mediaManagePlatform_conversionRateList({data:this.form}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
      })
    }
  },
  mounted() {
    this.init()
  } 
}
</script>