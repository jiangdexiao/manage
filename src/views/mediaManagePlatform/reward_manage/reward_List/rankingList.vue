<template>
  <div>
       <el-dialog
        title="查看排行榜"
        custom-class='dialog'
        :visible.sync="show_ranking_Dialog" width="900px"
        :close-on-click-modal="false"
        :before-close="handleClose">
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-form :model="form">
                    <el-form-item label="激励标题：">
                        <p>{{form.rewardTitle}}</p>
                    </el-form-item>
                    <el-form-item label="日期："> 
                        <p>{{tool.date.format(form.startTime,'yyyy-MM-dd hh:mm:ss')}}  至 {{tool.date.format(form.endTime,'yyyy-MM-dd hh:mm:ss')}}</p>
                    </el-form-item>
                    <el-form-item label="排行奖励：">
                        <p>{{form.havaRanking==1?'有':'无'}}</p>
                    </el-form-item>
                    <el-form-item label="有效角色：">
                        <p>{{form.roleType==1?'媒体':form.roleType==2?'BD专员':form.roleType==3?'促销员':'-'}}</p>
                    </el-form-item>
                </el-form>
            </el-col>
            <list-data
                ref='list-data'
                @onChangeCurrentPage="onChangeCurPage"
                @onChangePageSize="onChangeCurPageSize"
                :DataGrid = 'datagrid'></list-data>
       </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        let tool =this.tool
        return {
            show_ranking_Dialog:false,
            datagrid: {
                List: [],
                FieldList: [
                { key:'ranking', label:'排名',width:60},
                { key: 'userName', label: '用户/账号',width:260,formatter:function(row,column,cellValue){
                    if(!row.userName && !row.accNo){
                        return '-'
                    }else{
                        var name = row.userName? row.userName +'  /': '  /';
                        var account= row.accNo? row.accNo : '-';
                        return name + account
                    }
                }},
                { key:'orderNum', label:'成交订单',width:200,tooltip:true},
                { key:'orderMoney', label:'成交金额',width:150,formatter: function(y,column,cellValue) {
                    return tool.str.twoDecimal(y.orderMoney,2) 
                }},
                { key:'rewardMoney', label:'奖励金额',width:150,formatter: function(y,column,cellValue) {
                    return tool.str.twoDecimal(y.rewardMoney,2) 
                }},
                { key:'rankingMoney', label:'预计排行奖',width:150,formatter: function(y,column,cellValue) {
                    return y.rankingMoney?tool.str.twoDecimal(y.rankingMoney,2) :'-'
                }},
                { key: 'isSettlement', label: '排行奖是否结算',width:80,formatter: function(row) {
                    return row.isSettlement===1?'是':'否'
                }},
                { key:'fullMoney', label:'满额奖',width:150,formatter: function(y,column,cellValue) {
                    return y.fullMoney?tool.str.twoDecimal(y.fullMoney,2):'-' 
                }},
                { key: 'fullIsSettlement', label: '满额奖是否结算',width:80,formatter: function(row) {
                    return row.fullIsSettlement===1?'是':'否'
                }}
                ],
                Checkbox:false,
                Pagination: {
                    current_page: 1,
                    page_size:10,
                    total: 0
                }
            },
            form:{
                rewardId:'',
                rewardTitle:'',
                startTime:'',
                endTime:'',
                havaRanking:'',
                roleType:'',
            },
        }
    },
    props:['isShow','data'],
    methods: {
        handleClose(){
            this.$parent.show_ranking_Dialog = false;
            this.tool.dp.clearData(this.form)
        },
        onChangeCurPage(page) {
            this.datagrid.Pagination.current_page = page
            this.init()
        },
        onChangeCurPageSize(pageSize) {
            this.datagrid.Pagination.page_size  = pageSize
            this.init()
        },
        init() {
            let datas = {
                rewardId: this.data.rewardId,
                rows: this.datagrid.Pagination.page_size,
                pageNumber: this.datagrid.Pagination.current_page
            }
            this.api_mediaManagePlatform_rewardRanking({ data:datas }).then(data=>{
               this.datagrid.Pagination.total = data.totalCount;
               this.datagrid.List = data.content.rankingList.length ? data.content.rankingList : [];
            })
        }
    },
    watch: {
        isShow(v){
            this.show_ranking_Dialog = v
            if( !v ) {return false}
            this.init();
            this.tool.dp.assignData(this.form, this.data)
        }
    }
}
</script>
