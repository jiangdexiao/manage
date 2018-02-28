<template>
    <div class="list">
         <!--工具条-->
        <el-col :span="24" class="toolbar" style="height:50px;line-height:50px;">
            <el-col :span="2">{{getUser.name}}</el-col>
            <el-col :span="3">总榜排名  第{{ bdInfo.rankingNo }}名  </el-col>
            <el-col :span="3">总收益 {{ bdInfo.totalMoney }}  元  </el-col>
        </el-col>
        <list-data
          ref='list-data'
          :DataGrid = 'datagrid'></list-data>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        let tool = this.tool
        return {
          datagrid:{
            List:[],
            FieldList: [
              { key: 'rankingNo', label: '排名'},
              { key: 'bdName', label: 'BD专员'},
              { key: 'dayCompare', label: '昨日环比',formatter:function(row,column,cellValue){ 
                return row.dayCompare == null ? '-' : row.dayCompare > 0 ? "+" + row.dayCompare : row.dayCompare
              }},
              { key: 'monthCompare', label: '上月环比',formatter:function(row,column,cellValue){
                return row.monthCompare >0 ? "+" + row.monthCompare : row.monthCompare
              }},
              { key: 'monthCompare', label: '所属组织',width:350,tooltip:true,formatter:function(row,column,cellValue){
                let addr = ''
                row.orgInfoList.map((item, i) => {
                    if (i < row.orgInfoList.length - 1) {
                        addr += item.orgName + '>'
                    } else {
                        addr += item.orgName
                    }
                })
                return addr
              }},
              { key: 'parentCateName', label: '行业',formatter:function(row,column,cellValue){
                return row.parentCateName + ">" + row.cateName
              }},
              { key: 'proName', label: '区域',formatter:function(row,column,cellValue){
                return (row.proName==null ? '' : row.proName) + (row.cityName==null ? '': ">" +row.cityName) +(row.areaName==null ? '' :">"+ row.areaName);
              }},
              { key: 'totalMoney', label: '总收益',formatter:function(row){
                return  tool.str.twoDecimal(row.totalMoney,4)
              }}
            ],
            Checkbox:false
          },
          bdInfo:{
            rankingNo:'',
            totalMoney:''
          }
        }
    },
    computed:{
      ...mapGetters(['getUser'])
    },
    methods: {
        // 获取业务进度列表
        init() {
          this.api_mediaSaleManagePlatform_bdRanking().then(res=>{
            this.datagrid.List = res.content?res.content:[]
            // this.datagrid.Pagination.total = res.totalCount
          })
        },
        getBdInfo(){
          this.api_mediaSaleManagePlatform_bdInfo({ data:{bdId:this.getUser.bd.bdId} }).then(res=>{
            if( res.content ){
              this.bdInfo.rankingNo=res.content.rankingNo
              this.bdInfo.totalMoney=res.content.totalMoney
            }
          })
        }
    },
    mounted() {
      this.getBdInfo()
      this.init()
    }
}
</script>