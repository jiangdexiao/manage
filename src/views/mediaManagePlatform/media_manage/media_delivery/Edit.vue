<template>
    <div class="edit-form">
        <el-dialog :title="dialog.goodId?'编辑':'新增'" :visible.sync="dialog.dialogVisible" @close="edit_close" :close-on-click-modal="false"   custom-class='dialog'>
            <el-col :span="12">
                <el-form :model="form">
                <el-form-item label="商品">
                    <span>{{ good.goodsName }}</span>
                    <el-button type="text" @click="selectGoods">请选择商品</el-button>
                </el-form-item>
                <el-form-item label="商家">
                <span>{{good.dealerName}}</span>
                </el-form-item>
                <el-form-item label="商家ID">
                    <span>{{good.dealerId}}</span>
                </el-form-item>
                <el-form-item label="识别图">
                    <img v-show="good.imageUrl && good.imageUrl!=''" class="avatar mg_b15" :src="good.imageUrl">
                    <!-- <upload v-show="good.dealerId" ref="imgUpload" :img="{imageUrl:good.imageUrl,imgGroup:2,minSize:300,maxSize:700,filter:function(){   -->
                    <ele-upload v-show="good.imageUrl==''" ref="imgUpload" :img="{imageUrl:good.imageUrl,imgGroup:2,minSize:300,maxSize:700,filter:function(){
                        if( !good.goodsId ){
                            $message('请先选择商品');
                            return false;
                        }
                        return true;
                    }}"  v-on:uploadSuccess="uploadSuccess"></ele-upload>
                    <a class="a_textSty" v-if="good.dealerId && good.dealerId!=''"  @click="showManageImg">管理识别图</a>
                </el-form-item>
                <el-form-item label="开始" >
                    <el-date-picker
                        v-model="dialog.startTime"
                        type="date"  @change="queryStartSchedul">>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束" >
                    <el-date-picker
                        v-model="dialog.endTime"
                        type="date" @change="queryEndSchedul">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            </el-col>
            <el-col class="line" :span="2">&nbsp;&nbsp;</el-col>
            <el-col :span="10">
                <el-form :model="form" label-position="top">
                    <el-form-item label="广告位">
                        <span>{{good.mresNmae}}</span>
                    </el-form-item>
                    <el-form-item label="条码值">
                        <span v-html="getCode" ></span>
                    </el-form-item>
                    <el-form-item label="行业">
                        <span>{{good.mediaCode}}</span>
                    </el-form-item>
                    <el-form-item label="位置">
                        <div v-html="getAdrress" ></div>
                    </el-form-item>
                    <el-form-item label="属性">
                        <span>{{good.typeName}}</span>
                    </el-form-item>
                    <el-form-item label="形式">
                        <span>{{good.exhibitName}}</span>
                    </el-form-item>
                    <el-form-item label="区域">
                        <span v-html="getRegion" ></span>
                    </el-form-item>
                    <el-form-item label="媒体">
                        <span>{{good.mediaName}}</span>
                    </el-form-item>
                </el-form>
            </el-col>
            <div slot="footer" class="dialog-footer">
                <el-button @click="edit_close">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button type="danger" @click="del" v-if="dialog.goodId" >删除</el-button>
            </div>
        </el-dialog>
        <el-dialog title="商品列表" :visible.sync="showGoodsListDialog" @close="ai_goods_dialog_close" custom-class="dialog"  >
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="form" >
                    <el-form-item>
                        <el-input  placeholder="商品名/商品ID" :maxlength="50" v-model="form.goodsMessage" class="form-input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input  placeholder="商家名/商家ID" :maxlength="50" v-model="form.dealerMessage" class="form-input"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.goodsLaunchStatus"  class="form-input" placeholder="选择投放状态" clearable>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search" >搜索</el-button>
                    </el-form-item>
                </el-form>
             </el-col>
             <el-table :data="myTable.tableData">
                <el-table-column property="goodsId" label="商品ID" width="300"></el-table-column>
                <el-table-column property="goodsName" label="商品名" width="100"></el-table-column>
                <el-table-column property="dealerName" label="商家名" width="300"></el-table-column>
                <el-table-column property="goodsLaunchStatus" label="是否投放" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.goodsLaunchStatus===1?'是':'否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope" >
                        <el-button @click="select(scope.row)" type="text" size="small">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-pagination style="float:right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="myTable.pageNumber"
                    :page-size="myTable.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="myTable.totalCount">
                </el-pagination>
                <!-- <datagrid ref="grid" 
                :tableData="myTable.tableData" 
                :totalCount="myTable.totalCount" 
                :columns="myTable.columns" 
                :rowClick="myTable.rowClick" 
                :sortChange="myTable.sortChange"
                v-on:currentPageChange="currentPageChange"
                v-on:pageSizeChange="pageSizeChange"
                v-on:select="select"
                ></datagrid> -->
            </div>
        </el-dialog>
        <manageGoodsImgDialog ref="manageGoodsImg" :imageDialog="imageDialog" v-on:imgSelected="imgSelected" v-on:delSuccess="delSuccess"></manageGoodsImgDialog>
        <loadingComponent :showLoading="imageDialog.isShowLoading"></loadingComponent>
    </div>
</template>

<script>
// import upload from "./upload";
import manageGoodsImgDialog from "./manageGoodsImg";
import loadingComponent from './loading';
export default {
  data() {
    return {
      showGoodsListDialog: false,
      goods: [],
      sellers: [],
      flagTime: 0,
      form: {
        goodsMessage: "",
        dealerMessage: "",
        goodsLaunchStatus: "",
        pageOrNot: 1,
        pageNum: 1,
        rows: 10
      },
      myTable: {
        totalCount: 0,
        tableData: [],
        pageSize: 10,
        pageNumber: 1
      },
      imageDialog: {
        dialogVisible: false,
        isShowLoading:false,
        goodsIds:'',
        recognizedUrl:''
      }
    };
  },
  props: ["dialog", "good"],
  components: { manageGoodsImgDialog,loadingComponent },
  computed: {
    getAdrress() {
      let adrress = "";
      if (this.good.tagAddr) {
        this.good.tagAddr.split(",").forEach(element => {
          if (element) adrress += `${element}<br>`;
        });
      }
      return adrress;
    },
    getCode() {
      let codes = "";
      if (this.good.mresNo) {
        this.good.mresNo.split(",").forEach(element => {
          if (element) codes += `${element}<br>`;
        });
      }
      return codes;
    },
    getRegion(){
        let region = '';
        if( this.good.tagRegion ){
            this.good.tagRegion.split(';').forEach(element=>{
                if(element) region +=`${element}<br>`;
            });
        }
        return region;
    }
  },
  methods: {
      //管理识别图删除
    delSuccess(delImgUrl) {
        if(delImgUrl == this.good.imageUrl ){
            this.good.imageUrl =''
            this.imageDialog.recognizedUrl =''
        }
    },
    //选择的识别图
    imgSelected(value){
      this.good.imageUrl = value;
      this.imageDialog.recognizedUrl = value;
      this.imageDialog.dialogVisible = false;
    },
    //管理识别图
    showManageImg(){
      let that = this;
      //查询参数
      that.imageDialog.goodsIds = that.good.goodsId;
      that.imageDialog.recognizedUrl = that.good.imageUrl;
      that.$refs.manageGoodsImg.init();
    },
    select(row) {
      let that = this;
      that.showGoodsListDialog = false;
      if (!row) return;
      this.$refs.imgUpload.clear();
      that.good.goodsId = row.goodsId;
      that.good.goodsName = row.goodsName;
      that.good.dealerId = row.dealerId;
      that.good.dealerName = row.dealerName;
      that.good.imageUrl = row.goodsRecognized.length ? row.goodsRecognized[0].recognizedUrl : '';
      that.imageDialog.recognizedUrl = that.good.imageUrl;
    },
    handleSizeChange: function(size) {
      this.myTable.pageSize = size;
    },
    handleCurrentChange: function(currentPage) {
      this.myTable.pageNumber = currentPage;
      this.search();
    },
    //选择结束时间的时候
    queryEndSchedul(endTime) {
      let that = this;
      this.dialog.endTime = this.tool.date.format(new Date(endTime), "yyyy-MM-dd");
      this.api_mediaManagePlatform_querySchedule({
          data: {
            goodsId: that.dialog.goodId,
            endTime: that.dialog.endTime,
            mresIds: that.dialog.mresId,
            startTime: that.dialog.startTime,
            goodsIdNew: that.good.goodsId
          } 
        }).then(data=>{
            if(data.status == 200){
			that.flagTime = 0;
		  }
          if (data.status == 2) {
            that.flagTime = 1;
            that.$message({type:'error',message:data.errorMessage});
            return ;
          }
          if(data.status == 506){
            that.flagTime = 2;
            that.$message({type:'error',message:data.errorMessage});
          }
        })
    },
    //选择开始时间的时候
    queryStartSchedul(start) {
      let that = this;
      this.dialog.startTime = this.tool.date.format(new Date(start), "yyyy-MM-dd");
      this.api_mediaManagePlatform_querySchedule({ 
          data:{
            goodsId: that.dialog.goodId,
            endTime: that.dialog.endTime,
            mresIds: that.dialog.mresId,
            startTime: that.dialog.startTime,
            goodsIdNew: that.good.goodsId
          } 
        }).then(data=>{
            if(data.status == 200){
			that.flagTime = 0;
		  }
          if (data.status == 2) {
            that.flagTime = 1;
            that.$message({type:'error',message:data.errorMessage});
            return ;
          }
          if(data.status == 506){
              that.flagTime = 2;
            that.$message({type:'error',message:data.errorMessage});
          }
        })
    },
    search() {
      let that = this;
      that.form.pageNum = that.myTable.pageNumber;
      that.form.rows = that.myTable.pageSize;
      this.api_sellerManagePlatform_goodsInformation({ data:this.form }).then(data=>{
          that.myTable.totalCount = data.totalCount;
          that.myTable.tableData = data.content ? data.content : [];
      })
    },
    selectGoods() {
      this.showGoodsListDialog = true;
      this.search();
    },
    save() {
      let that = this;
      if (!that.good.goodsId) {
        that.$message({ message: "请选择商品", type: "error" });
        return;
      }
      if (!that.good.imageUrl) {
        that.$message({ message: "请选择识别图", type: "error" });
        return;
      }
      if (that.flagTime==2) {
        that.$message({type:'error',message:"选择日期内排期内容不一样"});
        return;
      }
      if(that.flagTime==1){
        that.$message({type:'error',message:"暂不支持跨月操作，请选择同月进行排期！"});
        return;
      }
      if(!this.tool.date.compareDate(that.dialog.startTime,that.dialog.endTime)){
          that.$message({type:'error',message:"开始时间不能大于结束时间"});
          return;
      }
      this.api_mediaManagePlatform_adScheduleAdd({ 
          data:{
            goodsId: that.good.goodsId,
            dealerId: that.good.dealerId,
            startTime: that.dialog.startTime,
            endTime: that.dialog.endTime,
            mresIds: that.dialog.mresId,
            goodsIdOld: that.dialog.goodId,
            startTimeOld: that.good.startTime,
            endTimeOld: that.good.endTime,
            imageUrl: that.good.imageUrl
          }
      }).then(res=>{
          that.$message({type:'success',message:'保存成功'});
          that.$parent.dialog.dialogVisible = false;
          that.$emit("search"); //通知父组件刷新列表
      })
    },
    del() {
      let that = this;
      if (that.flagTime==1) {
        that.$message("暂不支持跨月操作，请选择同月进行排期！");
        return;
      }
      if (that.flagTime==2) {
        that.$message({type:'error',message:"选择日期内排期内容不一样"});
        return;
      }if(!this.tool.date.compareDate(that.dialog.startTime,that.dialog.endTime)){
          that.$message({type:'error',message:"开始时间不能大于结束时间"});
          return;
      }
      that.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            this.api_mediaManagePlatform_adScheduleAdd({
                 data:{
                    goodsId: "",
                    dealerId: "",
                    startTime: that.dialog.startTime,
                    endTime: that.dialog.endTime,
                    mresIds: that.dialog.mresId
                }
            }).then(res=>{
                that.$message({type:'success',message:'删除成功'});
                that.$parent.dialog.dialogVisible = false;
                that.$emit("search"); //通知父组件刷新列表
            })
        })
        .catch(() => {
        });
    },
    //编辑对话框关闭
    edit_close() {
      //清楚数据
      this.flagTime = 0;
      this.$refs.imgUpload.clear();
      this.$parent.dialog.dialogVisible = false;
      // console.log('编辑框关闭事件回调...')
    },
    //商品列表对话框关闭
    ai_goods_dialog_close() {
      //清除数据
      (this.form = {
        goodsMessage: "",
        dealerMessage: "",
        goodsLaunchStatus: "",
        pageOrNot: 1,
        pageNum: 1,
        rows: 8
      }),
        (this.myTable = {
          totalCount: 0,
          tableData: [],
          pageSize: 10,
          pageNumber: 1
        });
      this.showGoodsListDialog = false;
    },
    uploadSuccess(res,opt) {
      let that = this, pdata='';
      if (!that.good.goodsId) {
        that.$message({type:'error',message:"请先选择商品"});
        return;
      }
      that.imageDialog.isShowLoading = true;
      pdata = {
        recognizedId: res.content.im_name,
        recognizedUrl: res.content.url
      };
      if (res && res.content) {
          this.api_sellerManagePlatform_adminGoodsRecognizeds({ type:'post',data:pdata,pathParams:`/${that.good.goodsId}` }).then(resdata=>{
            that.imageDialog.isShowLoading = false;
            that.$message({type:'success',message:'商品识别图添加成功'});
            that.good.imageUrl = res.content.url
            that.imageDialog.recognizedUrl= res.content.url
            that.$refs.imgUpload.clear();
          })
      } else {
        this.$refs.imgUpload.clear();
        this.$message({message:res.errorMessage,type:'error'});
        that.imageDialog.isShowLoading = false;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>

.mg_b15 {
    margin-bottom: 15px;
}
.a_textSty{
    margin-left: 54px;
    width: 180px;
    text-align: center;
    display: block;
    margin-top: -15px;
}
</style>
