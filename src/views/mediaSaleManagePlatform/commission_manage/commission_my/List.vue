<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <div class="header" v-if="isShowHeader">
          <div class="divClass">
              <span>本月结算后提成</span>
              <p class= "hotM" ><span>￥</span>&nbsp;{{form.curMonthAmount}}</p>
          </div>  
          <div class="fl">
              <div class="box_sty">
                  <span>上月结算后提成 </span>
                  <span>￥{{form.lastMonthAmount}}</span> 
              </div>
              <div class="box_sty">
                  <span>累计结算后提成 </span>
                  <span>￥{{form.hisAmount}}</span>  
              </div>
          </div> 
      </div>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  
  data() {
    let tool = this.tool
    return {
      time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'),this.tool.date.format(new Date(),'yyyy-MM-dd')],
      datagrid: {
        List: [],
        FieldList: [
          { key:'devoteJson', label:'类型',width:260,formatter:function(row){
            if(row.devoteJson==""){
                return "自推"
            }else{
                let s= JSON.parse(row.devoteJson);
                if(s.subBdId==null){
                    return "自推";
                }else{
                    return "员工贡献";
                }
            }
          }},
          { key:'devoteJson',label:'贡献员工',width:350,html:true, formatter:function(row){
            if(row.devoteJson == ""){
                return "-"
            }else{
                let s= JSON.parse(row.devoteJson);
                if(s.subBdId==null){
                    return "-";
                }else{
                    return '['+s.subBdRoleInfo+']'+s.subBdName+ '  '+s.subBdAccount;
                }
            }
          }},
          { key: 'businessType', label: '类目',formatter:function(row,column,cellValue){ 
            return row.businessType == 1 ? "订单分成" : row.businessType == 2 ? '提现': row.businessType == 3 ? "注册分成": row.businessType == 4? "下载分成": row.businessType == 5 ? "租赁":'-';
          }},
          { key:'amount', label:'提成',formatter: function(row) {
            return  tool.str.twoDecimal(row.amount,4)
          }},
          { key:'settleTime', label:'结算时间',width:260,formatter: function( row ) {
             if(row.settleStatus==1){
                  return '-'
              }else {
                  return tool.date.format(row.settleTime, "yyyy-MM-dd hh:mm:ss")
              }
          }},
          { key:'orderTime', label:'订单时间',width:260,formatter: function( row ) {
            return tool.date.format(row.orderTime, "yyyy-MM-dd hh:mm:ss")
          }},
          { key:'mresName', label:'来源明细',width:350,type:'html', formatter: function( row ) {
            let html= (row.mresName==null ? "":row.mresName + "-")  + row.businessId + ( row.goodsName==''? "" : "-"+row.goodsName) + "-" + (row.goodsPrice=='' ? 0 : tool.str.twoDecimal(row.goodsPrice,2));
            return  `<font title="${html}">${tool.str.textLength(html,20)}</font>`
          }}
        ],
        Pagination: {
          current_page: 1,
          page_size:10,
          total: 0
        },
        Checkbox:false
      },
      // 定义搜索参数
      form: {
        curMonthAmount:'',
        lastMonthAmount:'',
        hisAmount:''
      },
      isShowHeader:true
    }
  },
  computed:{
    ...mapGetters(['getUser'])
  },
  methods: {
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size  = pageSize
      this.init()
    },
    init(){
      this.isShowHeader =this.datagrid.Pagination.current_page!=1 ? false :true 
      this.api_mediaSaleManagePlatform_bdMyDeduct({
        data:{ systemAccessToken :sessionStorage.getItem('access_token'),
              userIdList:this.getUser.bd.bdId,
              pageRows:this.datagrid.Pagination.page_size,
              pageNo:this.datagrid.Pagination.current_page
            }
      }).then(res=>{
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    getBdInfo(){
      this.api_mediaSaleManagePlatform_bdAccounting({data:{ systemAccessToken:sessionStorage.getItem("access_token"),userType:6,userId:this.getUser.bd.bdId } }).then(res=>{
        this.form.curMonthAmount = this.tool.str.twoDecimal(res.content.curMonthAmount,4)
        this.form.lastMonthAmount = this.tool.str.twoDecimal(res.content.lastMonthAmount,4)
        this.form.hisAmount = this.tool.str.twoDecimal(res.content.hisAmount,4)
      })
    }
  },
  mounted() {
    this.init()
    this.getBdInfo()
  }
}
</script>
<style lang="scss" scoped>
.right_wrap{
    margin: 20px;
    background: #fff;
    position: relative;
    top: 20px;
    padding: 10px;
}
.fl{
    float: left;
}
.box_sty {
    line-height: 40px;
}
.header {
    padding: 20px;
    position: relative;
    height: 70px;
    background-color: #f7d48f2b;
}
.header .divClass{
    width: 38%;
    float: left;
}
.header span{
    font-size: 14px;
    margin-left: 20px;
}
.header .hotM{
    font-size: 25pt;
    color: red;
    font-weight: 500;
    padding: 10px 0 10px;
}
</style>
