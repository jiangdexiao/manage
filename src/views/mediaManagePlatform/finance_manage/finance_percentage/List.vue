
<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar private-date" >
			<el-form :inline="true" :model="search_params">
          <el-form-item>
              <el-select v-model="search_params.userId" filterable remote placeholder="BD专员姓名/账号"  clearable :remote-method="getSellers" :loading="loading">
                  <el-option v-for="(item,i) in sellers" :key="i" :label="item.bdName + '/' + item.account" :value="item.bdId"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="queryTime">
              <el-date-picker :editable="false" :clearable="false" :picker-options="formPickerOptions" v-model="search_params.queryTime" type="month" placeholder="选择月" value-format="yyyy-MM" class="form-input"></el-date-picker>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" size="medium" @click="init" class='btn-search' >搜索</el-button>
          </el-form-item>
		    </el-form>
		</el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="handleSizeChange"
      @edit="getFlow"
      :DataGrid = 'datagrid'></list-data>

         <el-dialog title="财务管理 > BD提成 > BD流水" :visible.sync="showFlowDialog" @close="ai_goods_dialog_close" custom-class="dialog list-dialog">
            <!--工具条-->
            <el-col :span="24" class="toolbar private-date" >
                <el-form :inline="true" :model="form" >
                    <el-form-item>
                        <el-select v-model="form.status"  class="form-input" placeholder="选择流水状态" clearable>
                            <el-option label="待结算" value="1"></el-option>
                            <el-option label="已结算" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item >
                        <el-date-picker
                            :editable="false"
                            unlink-panels
                            v-model="time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search" >搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <list-data
            ref='edit-list-data'
            @onChangeCurrentPage="handleCurrentChange"
            @onChangePageSize="handleCurrentChange"
            :DataGrid = 'editDatagrid'></list-data>
        </el-dialog>
	</section>
    
</template>

<script>
export default {
    data() {
        let tool = this.tool
        return {
          datagrid:{
            List:[],
            FieldList: [
              { key: 'groupByTime', label: '日期',formatter:function(row,column,cellValue){
                return tool.date.format(row.groupByTime, 'yyyy年MM月')
              }},
              { key: 'bdName', label: 'BD专员姓名/账号',formatter:function(row,column,cellValue){
                if(!row.bdName && !row.account){
                  return '-'
                }else{
                  var name = row.bdName? row.bdName +'  /': '  /';
                  var account= row.account? row.account : '-';
                  return name + account
                }
              }},
              { key: 'settledAmount', label: '已结算提成小计',formatter:function(row,column,cellValue){ 
                return  tool.str.twoDecimal(row.settledAmount,4)
              }},
              { key: 'settleAmount', label: '待结算小计',formatter:function(row,column,cellValue){
                return  tool.str.twoDecimal(row.settleAmount,4)
              }},
              {type:'operate',lable:'操作',
                btns:[
                  {text:'查看流水',eventName:'edit'},
                ]
              }
            ],
            Pagination: {
              current_page: 1,
              page_size:10,
              total: 0
            },
            Checkbox:false
          },
          editDatagrid:{
            List:[],
            FieldList: [
              { key: 'updatedTime', label: '发生日期',width:200,formatter:function(row,column,cellValue){
                return tool.date.format(row.updatedTime, 'yyyy-MM-dd hh:mm:ss')
              }},
              { key: 'bdName', label: 'BD专员',formatter:function(row,column,cellValue){
                if(!row.bdName && !row.account){
                  return '-'
                }else{
                  var name = row.bdName? row.bdName +'  /': '  /';
                  var account= row.account? row.account : '-';
                  return name + account
                }
              }},
              { key: 'businessType', label: '类目',formatter:function(row,column,cellValue){ 
                return row.businessType == 1 ? "订单分成" : row.businessType == 2 ? '提现': row.businessType == 3 ? "注册分成": row.businessType == 4? "下载分成": row.businessType == 5 ? "租赁":'-';
                }},
              { key: 'settleNo', label: '流水号',tooltip:true,width:200,formatter:function( row ){
                return tool.str.textLength(row.settleNo,20)
              }},
              { key: 'contributor', label: '类型',formatter:function(row,column,cellValue){
                if(row.contributor == ""){
                    return "自推";
                }else{
                    let s= JSON.parse(row.contributor);
                    if(s.subBdId==null){
                        return "自推";
                    }else{
                        return "员工贡献";
                    }
                }
              }},
              { key: 'contributor', label: '贡献员工',formatter:function(row,column,cellValue){
                if(row.contributor == ""){
                    return "-";
                }else{
                    let s= JSON.parse(row.contributor);
                    if(s.subBdId==null){
                        return "-";
                    }else{
                        return '['+s.subBdRoleInfo+']'+s.subBdName+ '  '+s.subBdAccount;
                    }
                }
              }},
              { key: 'amount', label: '提成金额',formatter:function(row,column,cellValue){
                return tool.str.twoDecimal(row.amount,4)
              }},
              { key:'settleStatus', label:'状态',formatter:function(row,column,cellValue){
                return row.settleStatus==1?'待结算':'已结算'
              }},
              {key:'mresName',label:'来源明细',width:350,type:'html',formatter:function( row ){
                  let html = (row.mresName==null ?'': row.mresName + "-") + row.businessId + (row.goodsName == ''? '': '-' + row.goodsName) + "-" + (row.goodsPrice==''? 0 : tool.str.twoDecimal(row.goodsPrice,2))
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
          // 搜索参数
          search_params: { 
              userId: '',
              queryTime: this.tool.date.format(new Date(),'yyyy-MM')
            },
            loading:false,
            token:sessionStorage.getItem('access_token'),
            showFlowDialog: false,
            sellers: [], //BD专员
            time:[this.tool.date.format(new Date(this.tool.date.getLastMonth()),'yyyy-MM-dd'),this.tool.date.format(new Date(),'yyyy-MM-dd')],
          form: {
              endTime: this.tool.date.format(new Date(),'yyyy-MM-dd'),
              startTime: "",
              status: "",
              pageNo: 1,
              pageRows: 10,
              userIdList:'',
              systemAccessToken:sessionStorage.getItem('access_token')
          },
            formPickerOptions:{
              disabledDate(time) {
              let nowDate = new Date();
              nowDate.setMonth(nowDate.getMonth()-12);
              let prevDate = nowDate.getTime();
                nowDate.setMonth(nowDate.getMonth()+12);
              let nextDate = nowDate.getTime();
              let piker = time.getTime();
              return piker < prevDate || piker > nextDate;
              }
            }
        }
    },
    methods: {
        // {type,data,dataIndex,list,btn,btnIndex}
        onChangeCurPage (page) {
          // this.$message('当前页是第' + page + '页')
          this.datagrid.Pagination.current_page = page
          this.init()
        },
        onChangeCurPageSize (pageSize) {
          // this.$message('当前每页显示 ' + pageSize + ' 条')
          this.datagrid.Pagination.page_size  = pageSize
          this.init()
        },
        // 获取BD提成列表
        init() {
          this.api_mediaManagePlatform_deductMonth(
            {data:{
              systemAccessToken: this.token,
              userIdList: this.search_params.userId,
              queryTime: this.search_params.queryTime,
              pageRows: this.datagrid.Pagination.page_size,
              pageNo: this.datagrid.Pagination.current_page
            }}).then(res=>{
            this.datagrid.List = res.content?res.content:[]
            this.datagrid.Pagination.total = res.totalCount
          })
        },
        getSellers(query) {
            if (query == "") return
            if( query.length > 20 ){
                this.$message({type:'error',message:'输入不能超过20个字符'})
                return
            }
            this.sellers = [];
            this.loading = true;
            this.api_mediaManagePlatform_bd({data:{keyWords: query}}).then(res=>{
              this.loading = false
              this.sellers = res.content;
            }).catch(err=>{
              this.loading = false
            })
        },
        getFlow(row){
            this.showFlowDialog=true;
            var date= this.tool.date.format(new Date(),'yyyy-MM-dd');
            let time = this.tool.date.format(new Date(),'yyyy-MM');
            if(!this.tool.date.compareDateToMomth(this.search_params.queryTime,time) ){
                date =  this.tool.date.getDateDay(this.search_params.queryTime);
            }
            this.form={
                endTime: date,
                startTime: this.search_params.queryTime+"-01",
                status: "",
                pageNo: 1,
                pageRows: 10,
                userIdList:row.data.userId,
                systemAccessToken:this.token
            }
            this.time= [];
            this.time[0] =this.form.startTime 
            this.time[1] =this.form.endTime 
            this.search();
        },
         search() {
            this.form.pageNo = this.editDatagrid.Pagination.current_page;
            this.form.pageRows = this.editDatagrid.Pagination.page_size;
            if( this.time && this.time.length > 0){
                this.form.startTime = this.time[0];
                this.form.endTime = this.time[1];
            }else{
                this.form.startTime='';
                this.form.endTime='';
            }
            this.api_mediaManagePlatform_deductStream({data:this.form}).then(res=>{
              this.editDatagrid.List = res.content ? res.content : [];
              this.editDatagrid.Pagination.total = res.totalCount;
            })
        },
        handleSizeChange: function(size) {
            this.editDatagrid.Pagination.page_size = size;
        },
        handleCurrentChange: function(currentPage) {
            this.editDatagrid.Pagination.current_page = currentPage;
            this.search();
        },
        ai_goods_dialog_close() {
          //清除数据
          this.form = {
              endTime: "",
              startTime: "",
              status: "",
              pageNo: 1,
              pageRows: 10,
              userIdList:''
          }
          this.editDatagrid.List = []
          this.editDatagrid.Pagination.total = 0
          this.editDatagrid.Pagination.page_size = 10
          this.editDatagrid.Pagination.current_page = 1
          this.showFlowDialog = false;
        }
    },
    mounted() {
        this.init();
    }
}
</script>