<template>
    <div class="dialog_pou_img"> 
        <el-dialog title="管理识别图" :visible.sync="imageDialog.dialogVisible"  @close="edit_close" :close-on-click-modal="false"  custom-class='dialog'>
            <el-row>
                <ele-upload v-if="imgTable.tableData.length<totalCount" ref="imgUpload" class="el-col el-col-8 t_c" :img="{imgGroup:2,minSize:300,maxSize:700}"  v-on:uploadSuccess="uploadSuccess"></ele-upload>
            <el-col :span="8" v-for="(img, i) in imgTable.tableData" :key="i">
                <el-card :body-style="{ padding: '0px', overflow: 'hidden'}">
                    <img :src="img.recognizedUrl" class="image">
                </el-card>
                <div class="bottom clearfix"> 
                    <a class="fl f_c1" @click="selectedImg(img)" v-if="img.recognizedUrl===imageDialog.recognizedUrl">已选择</a>
                    <a class="fl f_c1" @click="selectedImg(img)" v-else>选择</a>
                    <a type="text" class="fr f_c2" @click="delImg(img)">删除</a>
                </div>
            </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <!-- <el-pagination style="float:right" 
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="imgTable.pageNumber"
                    :page-size="imgTable.pageSize"
                    :total="imgTable.totalCount"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination> -->
            </div>

        </el-dialog>
        <loadingComponent :showLoading="isShowLoading"></loadingComponent>
    </div>
</template>

<script>
import loadingComponent from './loading'
export default {
  components: { loadingComponent },
  data(){
      return{
        isShowLoading: false,
        totalCount:'',
        imgTable: {
            tableData: [],
            totalCount: 0,
            pageSize: 10,
            pageNumber: 1
        }
      }
  },
  props: ["imageDialog"],
  methods:{
    uploadSuccess(res) {
        this.img_option(res,'manage_addimg')  
        this.$refs.imgUpload.clear();
    },
    selectedImg(itme) {
        this.$emit('imgSelected',itme.recognizedUrl);
    },
    delImg(itme) {
        this.$confirm('确认删除该图片吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let res ={content : itme}
            this.img_option(res,'manage_del_img')
            // this.$refs.imgUpload.clear();
        })
    },
    img_option(res,opt){
        let that = this, type='', pdata='',  params = that.imageDialog.goodsIds;
        that.isShowLoading = true;
        if(opt==='manage_del_img'){ 
            //管理识别图的 删除操作
            let str = '' ; type = 'delete';
            for(let key in res.content){
                str += key+'='+ res.content[key]+'&'
            }
            params =  that.imageDialog.goodsIds + '?'+ str;
            
        }else if(opt==='manage_addimg') {
            //管理识别图的 新增操作
            type = 'post'
            pdata = {
                recognizedId: res.content.im_name,
                recognizedUrl: res.content.url
            };
        }
        if (res && res.content && type!='') {
          this.api_sellerManagePlatform_adminGoodsRecognizeds({ type:type,data:pdata,pathParams:`/${params}` }).then(resdata=>{
              that.isShowLoading = false;
                if (opt==='manage_addimg'){
                    that.getImageList();
                    that.$message({type:'success',message:'商品识别图添加成功'});

                }else if (opt==='manage_del_img'){
                    that.getImageList();
                    this.$emit('delSuccess', res.content.recognizedUrl);
                    that.$message({type:'success',message:'商品识别图删除成功'});
                }
          })
        }else {
            this.$refs.imgUpload.clear();
            this.$message({message:res.errorMessage,type:'error'});
            that.isShowLoading = false;
        }

    },


    //编辑对话框关闭
    edit_close() {
      //清楚数据
      //this.$refs.imgUpload.clear();
      this.$parent.imageDialog.dialogVisible = false;
      this.clearData();
    },
    clearData() {
        this.imgTable= {
            tableData: [],
            totalCount: 0,
            pageSize: 10,
            pageNumber: 1
        }
    },
    handleCurrentChange(currentPage) {
        this.imgTable.pageNumber = currentPage;
        this.getImageList()
    },
    handleSizeChange(size) {
        this.imgTable.pageSize = size;
        this.getImageList()
    },
    getImageList() {
        this.api_sellerManagePlatform_recognizeds({ data:{goodsIds:this.imageDialog.goodsIds} }).then(data=>{
            this.totalCount = data.totalCount;
            this.imgTable.tableData = data.content[0].goodsRecognized.length ? data.content[0].goodsRecognized : []
        })
    },
    // 获取新增媒体分类列表
    init() {
        let that = this;
        that.imageDialog.dialogVisible= true;
        that.getImageList();
    }
  },
  mounted(){}
}
</script>

<style lang="scss">
.dialog_pou_img {
  .el-card__body { 
    background-color: rgba(223, 228, 237, 0.58) !important;
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
      color:#409EFF;
  }
  .f_c2 {
      color:red;
  }
  .t_c {
      text-align: center;
  }
  .el-card {
    border: 0;
    box-shadow: none;
    padding: 10px;
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
}

</style>

