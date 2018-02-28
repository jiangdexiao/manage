<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
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
import { EleAreaProvinceCity, EleMediaCategory} from '../../../../components/business/'
export default {
  components:{ EleAreaProvinceCity, EleMediaCategory},
  data() {
    let tool = this.tool
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key:'rank', label:'排名',width:100},
          { key:'salerName', label:'促销员',width:200,formatter:function(y,column,cellValue){
            if(!y.salerName && !y.salerAccNo){
                  return '-'
            }else{
                var name = y.salerName? y.salerName +'  /': '  /';
                var account= y.salerAccNo? y.salerAccNo : '-';
                return name + account
            }
          }},
          { key:'doDRatio', label:'昨日环比',formatter:function(y,column,cellValue){
            return y.doDRatio == null ? "-" : (y.doDRatio > 0 ? "+" + y.doDRatio : y.doDRatio)
          }},
          { key:'moMRatio', label:'上月环比',formatter:function(y,column,cellValue){
            return y.moMRatio == null ?"-":(y.moMRatio >0 ? "+" + y.moMRatio : y.moMRatio)
          }},
          { key:'mediaName', label:'所属媒体',formatter:function(row,column,cellValue){
            if(row.mediaName && row.mediaName!=''){
              let str= row.mediaName.slice(0,20);
              let num = row.mediaUserNo ? '-'+row.mediaUserNo :''
              str += num;
              return str
            }
            return '-'
          }},
          { key:'parCateName', label:'行业', formatter:function(y,column,cellValue){
            return y.parCateName+">"+y.mediaCateName 
          }},
          { key:'province', label:'区域', formatter:function(y,column,cellValue){
            return (y.province == null ? "" : y.province + ">") + (y.city == null ? "" : y.city)
          }},
          { key:'profit', label:'总收益',formatter:function(row){
            return  tool.str.twoDecimal(row.profit,2)
          }}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      form: {
        mediaId:0,
        regionCode:'',
        mediaCate:''
      }

    }
  },
  methods: {
    provinceSelected(val){
        this.form.regionCode = val;
    },
    categorySelected(val){
        this.form.mediaCate = val;
    },
    init() {
      this.api_mediaManagePlatform_rank({data:this.form}).then(res=>{
        this.datagrid.List = res.content==''?[]:res.content;
      })
    }
  },
  mounted() {
    this.init()
  }
}
</script>