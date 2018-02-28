<template>
    <div class="dialog_pou_img"> 
        <el-dialog :title="viewOpt=='hisImg'?'查看历史照片':'审核照片'" :visible.sync="isImgShow" :before-close="handleClose" :close-on-click-modal="false"  custom-class='dialog'>
            <el-row>
                <div class="top_div">
                    <p v-if="viewOpt==='autidImg'"><span>任  务：</span>{{form.taskNo}}</p>
                    <p><span>执行方：</span>{{form.name}}   {{form.accNo}}</p>
                    <p><span>负责BD：</span>{{form.bdStaffName}}   {{form.bdStaffNo}}</p>
                </div>
                <el-col :span="24" v-if="imgTable.photoList.length==0">
                    <p class="t_c">暂无数据</p>
                </el-col>
                <el-col :span="8" v-for="(img, i) in imgTable.photoList" :key="i">
                    <el-card :body-style="{ padding: '0px',overflow: 'hidden'}">
                        <img :src="img.photoUrl" class="image">
                    </el-card>
                    <div class="text_div"  @click="showImgFn(img,'1')">
                        <p v-if="img.isNeedRecheck===1"><a class="f_c1" @click="showImgFn(img,'2')">二审</a></p>
                        <p v-if="img.itemStatus===1 || (img.itemStatus!=2 && img.mresNo===0 && img.itemStatus!=3)">合格</p> 
                        <p class="f_c2" v-if="img.itemStatus===2">不合格</p>
                        <p class="text_c f_c2" v-if="img.itemStatus===3">待上传</p>
                        <p class="text_b">{{img.photoTime}}</p>
                    </div>
                    <div class="bottom clearfix"> 
                        <span class="fl">{{img.mresNo===0?'全景照': img.mresNo}}</span>
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer" v-if="form.option ==='hisImg'">
                <el-pagination style="float:right" 
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="imgTable.pageNumber"
                    :page-size="imgTable.pageSize"
                    :total="imgTable.totalCount"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
        <el-dialog
            :title="imgOpt==='1'?'照片查看':'二次人工审核'" :close-on-click-modal="false" 
            custom-class='dialog'
            :visible.sync="dialogShowImg"
            width="670px" class="img_dialog">
                <p class="p_box" v-if="imgOpt==='1'">
                    <span class="fl">{{imgInfo.mresNo===0?'全景照': imgInfo.mresNo}}</span>
                    <span class="fr">
                        <font v-if="imgInfo.isNeedRecheck===1">系统判断：</font>
                        <font v-else>二次审核：</font>
                        {{imgInfo.itemStatus===1?'合格':imgInfo.itemStatus===2?'不合格':imgInfo.mresNo===0?'合格':imgInfo.itemStatus===3?'待上传':''}}
                    </span>
                </p> 
                <p class="p_box" v-if="imgOpt==='2'">
                    <span class="fl">{{imgInfo.mresNo===0?'全景照': imgInfo.mresNo}}</span>
                    <span class="fr">
                        系统判断：{{imgInfo.itemStatus===1?'合格':imgInfo.itemStatus===2?'不合格':imgInfo.mresNo===0?'合格':imgInfo.itemStatus===3?'待上传':''}}
                    </span></p> 
                <div class="img_div">
                    <img :src="imgInfo.photoUrl">
                </div>
                <div v-if="imgOpt==='2'">
                    <el-button type="primary" @click="verify(true)">通  过</el-button>
                    <el-button @click="verify(false)">不合格</el-button>
                </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data(){
      return{
        dialogShowImg: false,
        viewOpt:'',
        imgOpt:'',
        form:{
            taskNo:'',
            accNo:'',
            name:'',
            bdStaffName:'',
            bdStaffNo:'',
            option:'',
        },
        imgInfo: {},
        imgTable: {
            photoList: [],
            totalCount: 0,
            pageSize: 10,
            pageNumber: 1
        }
      }
  },
  props:{
      isImgShow:{
          type:Boolean
      },
      data:{
          type:Object
      }
  },
  computed:{
      ...mapGetters(['getUser'])
  },
  methods:{
    //审核
    verify(bool){
        let datas = {
            taskId: this.data.taskId,
            mresNo: this.imgInfo.mresNo,
            itemStatus: bool?12:22
        }
        this.api_mediaManagePlatform_photoRechk({type:'post',data: datas}).then(res=>{
            this.$message({type:'success',message:'图片审核成功'});
            this.dialogShowImg = false
            this.init()
        })
    },
    //预览大图
    showImgFn(item,opt){
        this.imgInfo =item;
        this.imgOpt =opt;
        if(item.itemStatus==3){ return}
        this.dialogShowImg = true;
        event.stopPropagation()
    },
    //编辑对话框关闭
    handleClose() {
      this.$parent.isImgShow = false; 
      this.$parent.init();
      this.clearData();
    },
    clearData() {
        this.tool.dp.clearData(this.imgInfo)
        this.tool.dp.clearData(this.form)
        this.imgTable= {
            photoList: [],
            totalCount: 0,
            pageSize: 10,
            pageNumber: 1
        }
    },
    handleCurrentChange(currentPage) {
        this.imgTable.pageNumber = currentPage;
        this.init()
    },
    handleSizeChange(size) {
        this.imgTable.pageSize = size;
        this.init()
    },
    init() {
        if(this.data.option ==='hisImg'){
            this.viewOpt = this.data.option
            let datas = {
                userId: this.data.userId,
                role: this.data.role,
                rows: this.imgTable.pageSize,
                pageNumber:this.imgTable.pageNumber
            }
            this.api_mediaManagePlatform_photoHis({data: datas}).then(res=>{
                this.imgTable.photoList = res.content && res.content.photoList.length ? res.content.photoList :[]
                this.imgTable.totalCount = res.totalCount
            })
        }else if(this.data.option ==='autidImg'){
             this.viewOpt = this.data.option
             this.api_mediaManagePlatform_photoAudit({data:{taskId: this.data.taskId}}).then(res=>{
                this.imgTable.photoList = res.content.photoList.length ? res.content.photoList :[]  
            })
        }
    }
  },
  watch:{
      isImgShow(v){
          if( !v || !this.data ) { return false }
          this.init()
          this.tool.dp.assignData(this.form, this.data)
          this.$parent.isImgShow = v
      }
  }
}
</script>

<style lang="scss">
.dialog_pou_img {
    .top_div{
        margin-left: 20px;
    }
    .el-card__body {
        background-color: rgba(223, 228, 237, 0.58);
        width: 200px;
        height: 160px;
    }
    .top_div span{
        width: 62px;
        display: inline-block;
        text-align: right;
        margin-right: 15px;
    }
    .text_div {
        position: relative;
        height: 150px;
        padding: 15px 10px;
        text-align: right;
        .text_b {
            bottom: 15px;
            position: absolute;
            right: 10px;
        }
        .text_c{
            position: absolute;
            top: 44%;
            left: 36%;
        }
    }
    .text_div p{
        margin: 0 10px;
    }
  .time {
    font-size: 13px;
    color: #999;
  }
  .fl{
      float: left;
  }
  .fr{
      float: right;
  }
  .f_c1 {
      color:#0086ff;
  }
  .f_c2 {
      color:red;
  }
  .f_c3 {
      color:red;
  }
  .t_c {
      text-align: center;
  }
  .el-card {
    border: 0;
    box-shadow: none;
    padding: 10px;
    position: absolute;
  }
  .bottom {
    padding: 0 20px 15px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    margin: auto;
    height: 160px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
    .img_dialog{
        text-align: center;
    }
    .img_dialog .el-dialog {
        padding: 0 10px 10px 10px;
    }
    .img_dialog .el-dialog__body {
        width: 650px;
        height: 650px;
        padding:0 !important;
    }
    .img_dialog .el-dialog__body img{
        max-width: 560px;
        max-height: 450px;
    }
    .p_box{
        width: 560px;
        margin: 0 auto;
        display: inline-block;
    }
    .img_div{
        width: 560px;
        height: 450px;
        background-color: rgba(223, 228, 237, 0.58);
        margin: 0 auto;
    }
}
</style>

