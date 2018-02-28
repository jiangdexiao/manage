<template>
  <div>
    <el-tabs v-model="activeTabName" @tab-click="init">  
        <el-tab-pane label="按位置" name="first"></el-tab-pane>
        <el-tab-pane label="按展现形式" name="second"></el-tab-pane>
        <el-tab-pane label="按媒体分类" name="third"></el-tab-pane>
    </el-tabs>
    <list-data
        ref='list-data'
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
          { key: 'total', label: '总数'},
          { key: 'vacancyCount', label: '空置数'},
          { key: 'rato', label: '空置率',formatter:function( row ){
            if(row.rato==0 || row.rato==0.00){
                return 0;
            }else{
                return row.rato + "%";
            }
          }},
          { type: 'operate', label: '序号',
            condition : function(list){
              if(list.list.length-1 == list.dataIndex){
                return '小计'
              }else{
                return list.dataIndex+1
              }
            }
          }
        ],
        Checkbox:false
      },
      form:{
        type:1
      }

    }
  },
  methods: {
    init() {
      if(this.activeTabName=='first'){  
        this.form.type = 1
        this.datagrid.FieldList[0].label = '位置';
        
      }else if(this.activeTabName=='second'){  
        this.form.type = 2
        this.datagrid.FieldList[0].label = '展现形式';

      }else if(this.activeTabName=='third'){
        this.form.type = 3
        this.datagrid.FieldList[0].label = '媒体分类';
      }
      this.api_mediaManagePlatform_adsenseVacancyCount({data:this.form}).then(res=>{
        this.datagrid.List = res.content?res.content:[]
      })
    }
  },
  mounted() {
    this.init()
  } 
}
</script>