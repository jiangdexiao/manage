<template>
    <div class="list">
         <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <EleAreaProvinceCity v-on:selected="provinceSelected"></EleAreaProvinceCity>
                </el-form-item>
                <el-form-item>
                    <EleMediaCategory v-on:selected="categorySelected"></EleMediaCategory>
                </el-form-item> 
                <el-form-item>
                <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <list-data
          ref='list-data'
          :DataGrid = 'datagrid'></list-data>
    </div>
</template>

<script>
import EleAreaProvinceCity from '../../../../components/business/EleAreaProvinceCity.vue'
import EleMediaCategory from '../../../../components/business/EleMediaCategory.vue'
export default {
    data() {
        let tool = this.tool
        return {
          datagrid:{
            List:[],
            FieldList: [
              { key: 'rank', label: '排名',width:100},
              { key: 'mediaName', label: '媒体名'},
              { key: 'doDRatio', label: '昨日环比',formatter:function(row,column,cellValue){ 
                return row.doDRatio == null ? "-" : (row.doDRatio > 0 ? "+" + row.doDRatio : row.doDRatio)
              }},
              { key: 'moMRatio', label: '上月环比',formatter:function(row,column,cellValue){
                return row.moMRatio == null? "-": (row.moMRatio >0 ? "+" + row.moMRatio : row.moMRatio)
              }},
              { key: 'parCateName', label: '行业',formatter:function(row,column,cellValue){
                return row.parCateName+">"+row.mediaCateName 
              }},
              { key: 'province', label: '区域',formatter:function(row,column,cellValue){
                return (row.province == null ? "" : row.province + ">") + (row.city == null ? "" :row.city) 
              }},
              { key: 'totalProfit', label: '总收益',formatter:function(row,column,cellValue){
                return  tool.str.twoDecimal(row.totalProfit,2)
              }}
            ],
            Checkbox:false
          },
          form: {
              mediaCate: '',
              regionCode: '',
              rankType:0,
              mediaId:0
          }
        }
    },
    components:{
        EleAreaProvinceCity,
        EleMediaCategory
    },
    methods: {
        provinceSelected(val){
            this.form.regionCode = val;
        },
        categorySelected(val){
            this.form.mediaCate = val;
        },
        // 获取业务进度列表
        init() {
          this.api_mediaManagePlatform_mediaRank({data:this.form}).then(res=>{
            this.datagrid.List = res.content?res.content:[]
          })
        }
    },
    mounted() {
        this.init();
    }
}
</script>