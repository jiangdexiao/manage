<template>
    <div class="scheduleInfo_dialog_pou">
        <el-dialog title="查看" :visible.sync="dialog_dialogVisible" :before-close="ai_dialog_close"  custom-class='dialog middel-dialog'>
            
            <el-tabs v-model="editableTabsValue2" type="card" >
                <el-tab-pane
                    v-for="(item, index) in editableTabs2"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                >
                    <el-form :model="form">
                        <el-form-item label="广告位">
                            <span class="mg_r20" v-if="option=='mres'">{{ item.rowInfo.rowDataObj.name }} <br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mresNo}}</span><br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mediaName}}</span><br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mediaUserName}}   {{mresDetail[index].mediaUserNo}}</span> 
                            </span>
                            <span class="mg_r20" v-else>{{ item.formInfo.mresName }}<br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mresNo}}</span><br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mediaName}}</span><br>
                                <span class="mg_l54" v-if="mresDetail[index]">{{mresDetail[index].mediaUserName}}   {{mresDetail[index].mediaUserNo}}</span> 
                            </span>
                            <!-- <el-button type="text" @click="selectSaleMan(index,'1')">选择广告位</el-button> -->
                        </el-form-item>
                        <el-form-item label="促销员">
                            <span class="mg_r20" v-if="option=='mres'">{{ item.formInfo.salesmanName }} &nbsp;&nbsp;{{item.formInfo.salesmanNo}}</span>
                            <span class="mg_r20" v-else>{{ item.rowInfo.rowDataObj.name }} &nbsp;&nbsp;{{item.rowInfo.rowDataObj.salesmanNo}}</span>
                            <!-- <el-button type="text" @click="selectSaleMan(index, '2') ">选择促销员</el-button> -->
                        </el-form-item>
                        <el-form-item label="开始日期" >
                            <el-date-picker
                                v-model="item.rowInfo.startTime"
                                type="date" :readonly="true">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期" >
                            <el-date-picker
                                v-model="item.rowInfo.endTime"
                                type="date" :readonly="true">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="开始时间" >
                            <el-time-select :readonly="true" v-model="item.formInfo.hourStart" :picker-options="{
                                start: '00:00',
                                step: '00:60',
                                end: '24:00'
                                }">
                            </el-time-select>
                        </el-form-item>
                        <el-form-item label="结束时间" >
                            <el-time-select  :readonly="true" v-model="item.formInfo.hourEnd" :picker-options="{
                                start: '00:00',
                                step: '00:60',
                                end: '24:00',
                                minTime: dialog.startHour
                                }">
                            </el-time-select>
                        </el-form-item>
                    </el-form>
                    <div class="dialog-footer center">
                        <el-button @click="cancel">关闭</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <el-dialog title="选择促销员" :visible.sync="showGoodsListDialog" custom-class="dialog"  >
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="form" >
                    <el-form-item>
                        <el-input placeholder="促销员姓名/登录手机号" :maxlength="20" v-model="form.salesman" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search" >搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" class="pou_box">
                <el-table :data="myTable.tableData">
                    <el-table-column property="salesmanName" label="促销员名" ></el-table-column>
                    <el-table-column property="salesmanNo" label="登录手机" ></el-table-column>
                    <el-table-column property="sex" label="性别" >
                        <template slot-scope="scope">
                            <span>{{ scope.row.sex===1?'男':'女' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope" >
                            <el-button @click="select(scope.row,'pouSaleman')" type="text" size="small">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-dialog>
        <el-dialog title="选择广告位" :visible.sync="showMresListDialog" custom-class="dialog"  >
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="form" >
                    <el-form-item>
                        <el-input placeholder="广告位名/ID/条码" :maxlength="20" v-model="pouMresSearch.mresName" ></el-input>
                    </el-form-item>
                    <el-select v-model="pouMresSearch.categoryValue" placeholder="请选择广告分类">
                        <el-option
                        v-for="item in pouMresSearch.bannerCategoryList"
                        :key="item.dicCode"
                        :label="item.dicName"
                        :value="item.dicCode">
                        </el-option>
                    </el-select>
                    <el-form-item>
                        <el-button type="primary" @click="searchMres" >搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24" class="pou_box">
                <el-table :data="pouMresSearch.tableData">
                    <el-table-column property="mresName" label="广告位名" ></el-table-column>
                    <el-table-column property="mresId" label="ID" ></el-table-column>
                    <el-table-column property="mresNo" label="条码" ></el-table-column>
                    <el-table-column property="mresCateName" label="分类" ></el-table-column>
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope" >
                            <el-button @click="select(scope.row,'pouMres')" type="text" size="small">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-dialog>
    </div>
</template>

<script>

export default {
  data(){
      return{
          showGoodsListDialog:false,
          showMresListDialog:false,
          goods:[],
          sellers:[],
          form:{
              salesman:'',
              mediaId:'0',
              pageNumber:1,
              rows:10
          },
          myTable:{
              tableData:[]
          },
          editableTabsValue2: '1',
          editableTabs2: [],
          //广告位的详细信息
          mresDetail: [], 
          dialog_dialogVisible: false,
          option:'',
          selDataIndex:'',
          media_id:'0',
          pouMresSearch: {
              categoryValue:'',
              mresName: '',
              bannerCategoryList:[],
              tableData: []
          },
      }
  },
  props:["dialog",'saleMan'],
  methods:{
    select(row,opt){
        let that = this;
        if( !row )return;
        if(opt=='pouSaleman'){   
        //当前为弹窗时选择一个 促销员
            if(that.option=='mres'){ 
             //按广告位查询的时候    
                that.editableTabs2[that.selDataIndex].formInfo.salesmanName= row.salesmanName;
                that.editableTabs2[that.selDataIndex].formInfo.salesmanNo= row.salesmanNo;
                that.editableTabs2[that.selDataIndex].formInfo.salesmanId= row.salesmanId;
            }else {
                //按促销员查询的时候  rowDataObj
                that.editableTabs2[that.selDataIndex].rowInfo.rowDataObj.name = row.salesmanName;
                that.editableTabs2[that.selDataIndex].rowInfo.rowDataObj.salesmanNo = row.salesmanNo;
                that.editableTabs2[that.selDataIndex].rowInfo.rowDataObj.mresId = row.salesmanId;
            }
            that.showGoodsListDialog = false;
        }else if(opt=='pouMres'){
        //当前为弹窗时选择一个 广告位
            if(that.option=='mres'){ 
             //按广告位查询的时候
                that.editableTabs2[that.selDataIndex].rowInfo.rowDataObj.name = row.mresName;
                that.editableTabs2[that.selDataIndex].rowInfo.rowDataObj.mresId = row.mresId;
            }else {
                //按促销员查询的时候  rowDataObj
                that.editableTabs2[that.selDataIndex].formInfo.mresId= row.mresId;
                that.editableTabs2[that.selDataIndex].formInfo.mresName= row.mresName;
            }
            that.showMresListDialog = false;
        }
    },
    handleSizeChange:function(size){
        this.myTable.pageSize = size;
    },
    handleCurrentChange:function(currentPage){
        this.myTable.pageNumber = currentPage;
    },
    search(){
        // '获取促销员列表'
        let that = this;
        that.getSaleManList();
    },
    //获取广告位列表
    searchMres() {
        let that = this;
        if(!that.pouMresSearch.bannerCategoryList.length){
            that.bind_bannerCategory();
        }
        let data = {
          mediaId: that.media_id,
          mresName: that.pouMresSearch.mresName,
          mresCate: that.pouMresSearch.categoryValue };
        this.api_mediaManagePlatform_mresList({data:data}).then(res=>{
          that.pouMresSearch.tableData = res.content
        })

    },
    //获取促销员列表
    getSaleManList(){
        this.api_mediaManagePlatform_salesmanList({data:that.form}).then(res=>{
          this.myTable.tableData = res.content?res.content:[];
        })
    },
    //获取媒体Id
    //获取广告位分类的选择数据
    bind_bannerCategory(){
        this.api_mediaManagePlatform_mresCateList({data:{token: sessionStorage.getItem('access_token'), dicType: "mres_cate"}}).then(res=>{
          this.pouMresSearch.bannerCategoryList = res.content
        })
    },
    selectSaleMan(dataIndex,optNum){
        if(optNum=='1'){
            this.showMresListDialog = true;
            this.selDataIndex = dataIndex;
            this.searchMres();
            this.pouMresSearch.mresName = '';
            this.pouMresSearch.categoryValue = ''
        }else {
            this.showGoodsListDialog = true;
            this.selDataIndex = dataIndex;
            this.search();
        }
    },
    cancel(){
        this.dialog_dialogVisible = false;
        this.ai_dialog_close()
    },
    ai_dialog_close(){
        this.dialog_dialogVisible = false;
        this.editableTabs2 = [];
        this.pouMresSearch= {
            categoryValue:'',
            mresName: '',
            bannerCategoryList:[],
            tableData: []
        }
        this.mresDetail=[]
    },
    objDeepCopy (source) {
        let sourceCopy = source instanceof Array ? [] : {};
        for (let item in source) {
            sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
        }
        return sourceCopy;
    },
    dataInitFn(row,arr) {
        let that = this;
        let dialog= that.objDeepCopy(row);
        let saleMan= that.objDeepCopy(arr);
        that.editableTabs2 = [];
        that.editableTabsValue2= '0';
        that.dialog_dialogVisible = false;
        that.option = dialog.rowDataObj.option;
        //按 saleMan的长度 生成tab个数  //dialog 为row行头信息obj   formInfo  //optName=='mres'即为广告位
        if(saleMan.length){
            for (let [rowIndex, item] of saleMan.entries()) {
                let stime = item.hourStart.toString() , etime = item.hourEnd.toString();
                item.hourStart =  stime.length == 1?("0"+stime+":00"):(stime+":00");
                item.hourEnd   =  etime.length == 1?("0"+etime+":00"):(etime+":00");
                let obj = { 
                    title: dialog.rowDataObj.option==='mres' ? item.salesmanName: dialog.rowDataObj.option==='sman'? item.mresName :'', 
                    name: rowIndex+1+ '',
                    rowInfo: dialog,
                    formInfo: item,
                    showDel: true
                };
                that.editableTabs2.push(obj);
                //查询广告位详情
                let mresId='', salesmanId= '';
                if(that.option=='mres'){
                    mresId = dialog.rowDataObj.mresId;
                    salesmanId = item.salesmanId;
                    that.getMresDetail(rowIndex,mresId,salesmanId,saleMan.length)
                }else{
                    mresId= item.mresId;
                    salesmanId = dialog.rowDataObj.mresId;
                    that.getMresDetail(rowIndex,mresId,salesmanId,saleMan.length)
                }
            }
        }
    },
    removeTab(targetName) {
        let that = this;
        that.editableTabs2.splice(targetName-1,1)
        if(that.editableTabsValue2==targetName){
            that.editableTabsValue2 = that.editableTabs2[0].name
        }
    },
    //查询广告位详情
    getMresDetail(targetName,mresId,salesmanId,length){
        let that = this , obj = {};
        if(that.option=='mres' && targetName !==0){
            return
        }
        this.api_mediaManagePlatform_scheduleInfo({data:{mresId: mresId,salesmanId: salesmanId}}).then(data=>{
          if (data.status == 200) {
              obj = {
              mresNo: data.content.mresNo,
              mediaName: data.content.mediaName,
              mediaUserName: data.content.mediaUserName,
              mediaUserNo: data.content.mediaUserNo
              }
              that.mresDetail[targetName] = obj;
              if(that.option=='mres' && length > 1){
                  for(let i=1; i<length; i++){
                      that.mresDetail.push(that.mresDetail[0])
                  }
              }
              if(length === that.mresDetail.length){
                  that.dialog_dialogVisible = true;
                  that.editableTabsValue2= '1';
              }
          }
        })
    },
  },
  mounted(){
    // this.$nextTick( function(){
    //     debugger
    //     this.dataInitFn();
    // })
  }
}
</script>

<style lang="scss">
.scheduleInfo_dialog_pou {
.dialog{
    width:600px;
    height:auto;
}
// .dialog .el-dialog__body {
//   height: 650px;
//   overflow-y: scroll;
// }
.dialog.small-dialog{
    width:400px;
    height:550px;
}

.dialog.middel-dialog{
    width:400px;
    height:700px;
}
.fl{
    float: left;
}
.fr{
    float: right;
}
.center{
    text-align: center
}
.mg_r20 {
    margin-right: 20px
}
.mg_l54{
    margin-left: 54px
}
.pou_box{
    height: 493px;
    overflow-y: scroll;
}
}
</style>


