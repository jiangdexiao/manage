<template>
  <div class="list">
    <div class="searcWrap">
      <el-select v-model="search_params.replyStatus" placeholder="回复状态">
        <el-option
          v-for="reply in replyStatuses"
          :key="reply.value"
          :label="reply.label"
          :value="reply.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.starLevel" placeholder="星级评价">
        <el-option
          v-for="level in leveles"
          :key="level.value"
          :label="level.label"
          :value="level.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期" value-format="yyyy-MM-dd"
        @change="timeCheck">
      </el-date-picker>
      <el-input v-model="search_params.condition" :maxlength="100" placeholder="输入商品名称/订单号/顾客姓名/顾客手机号/商家名称" title="输入商品名称/订单号/顾客姓名/顾客手机号/商家名称"></el-input>
      <el-button type="primary" size="medium" @click="get_comment_info()" class="btn-search">搜索</el-button>
      <span class="ml10 gjsort" @click="advancedSearch">高级搜索</span>
    </div>
    <div class="soloSearchBox" v-if="advancedShow">
      <h4>高级搜索<a class="close" @click="advancedShow=!advancedShow"></a></h4>
      <div class="searcWrap mess">
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">关键词：</el-col>
          <el-col :span="9">
            <el-input v-model="search_params.condition" :maxlength="100" placeholder="输入商品名称/订单号/顾客姓名/顾客手机号/商家名称" title="输入商品名称/订单号/顾客姓名/顾客手机号/商家名称"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">评价时间：</el-col>
          <el-col :span="9">
            <el-date-picker style="padding-bottom:1px;"
                            v-model="time"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                            @change="timeCheck">
            </el-date-picker><!--时间-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">回复状态：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.replyStatus" placeholder="回复状态">
              <el-option
                v-for="replyStatu in replyStatuses"
                :key="replyStatu.value"
                :label="replyStatu.label"
                :value="replyStatu.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="alginRight">评价星级：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.starLevel" placeholder="评价星级">
              <el-option
                v-for="starLevel in leveles"
                :key="starLevel.value"
                :label="starLevel.label"
                :value="starLevel.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">图片情况：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.imageStatus" placeholder="图片情况">
              <el-option
                v-for="imageStatu in imageStatuses"
                :key="imageStatu.value"
                :label="imageStatu.label"
                :value="imageStatu.value">
              </el-option>
            </el-select>
          </el-col>
            <el-col :span="3" class="alginRight">评价级别：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.commentLevel" placeholder="评价级别">
              <el-option
                v-for="commentLevel in commentLeveles"
                :key="commentLevel.value"
                :label="commentLevel.label"
                :value="commentLevel.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="20" :offset="3">
            <el-button type="primary" size="medium" @click="get_comment_info()" class="btn-search">搜索</el-button>
            <el-button size="medium" @click="clearAll()">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="comment_info" style="background:#fff;">
      <table class="comment_table" id="table" style="table-layout:fixed">
        <thead >
        <tr>
          <td width="120px" >操作</td>
          <td width="320px;">评论内容</td>
          <td>评价星级</td>
          <td>评价级别</td>
          <td>商品信息</td>
          <td>订单号</td>
          <td>顾客信息</td>
          <td>商家信息</td>
          <td>评价时间</td>
        </tr>
        </thead>
        <tbody v-if="goodsCommentTotalCount==0">
          <tr style="height:60px; text-align:center;color:#5a5e66;font-size:14px">
            <td colspan="8">暂无数据</td>
          </tr>
        </tbody>
        <tbody v-for="(comment,index) in datacomment">
          <tr>
            <td>
              <div @click="delShow(comment.commentId)">
                <i class="icon_hp"></i>
                <span >删除</span>
              </div>
            </td>
            <td>
              <a class="ellipsis3" :title="comment.commentContent">{{comment.commentContent}}</a><br/><br/>
              <div class="mt10" v-for="(img,index2) in comment.commentImages">
                <div class="conimg" @click="imgWrapShow(index,index2)">
                  <img class="conimg mr10 fl" :src="img" />
                  <div><i class="el-icon-zoom-in"></i></div>
                </div>
              </div>
              <!-- 图片弹层 -->
              <div class="hptczp" v-show="imgWrap"></div>
              <div class="imgWrap" v-show="imgWrap">
                <template v-for="comment in datacomment">
                  <div class="imgUl">
                    <ul>
                      <li>
                        <img :src="datacomment[rowIndex].commentImages[imgIndex]" />
                      </li>
                    </ul>
                  </div>
                  <div class="ctrl">
                    <a @click="prev" class="prev" v-if="imgIndex > 0"></a>
                    <a @click="next" class="next" v-if="imgIndex < comment.commentImages.length-1"></a>
                  </div>
                  <a class="close" @click="imgWrap=!imgWrap"></a>
                </template>
              </div>
            </td>
            <td>
              <span>{{comment.starLevel}}</span>星
            </td>
              <td>
              <span v-if="comment.commentLevel ==1 " > 好评</span>
              <span v-else-if="comment.commentLevel ==3" > 差评</span>
              <span v-else > 中评</span>
            </td>
            <td>
              <a class="ellipsis2" :title="comment.goodsName">{{comment.goodsName}}</a>
              <div class="tdcolor mt10" v-if="comment.skuName != ''">规格：{{comment.skuName}}</div>
            </td>
            <td>
              {{comment.orderId}}
            </td>
            <td>
              <div>{{comment.buyerName}}</div>
              <div>{{comment.buyerPhoneNumber}}</div>
            </td>
            <td>
              <div>{{comment.dealerName}}</div>
            </td>
            <td>
              <div>{{comment.commentTime}}</div>
            </td>
          </tr>
          <tr >
            <td></td>
            <td colspan="8" v-if='comment.replyCommentContent'>
              <div class="tdhf">
                <div class="nr">
                  回复内容:
                </div>
                <div class="tit">{{comment.replyCommentContent}}</div>
                <div class="time">{{comment.replyTime}}回复</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float: left">
        <el-pagination
          @size-change="goodsCommentHandleSizeChange"
          @current-change="goodsCommentHandleCurrentChange"
          :current-page="goodsCommentCurrentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="goodsCommentPageRows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="goodsCommentTotalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        is_Success: false,
        // 搜索参数
        search_params: {condition: '', replyStatus: '', starLevel: '', startTime: '', endTime: '', imageStatus: ''},
        replyStatuses: [{value: '', label: '回复状态'}, {value: '1', label: '未回复'}, {value: '2', label: '已回复'}], // 回复状态
        leveles: [{value: '', label: '评价星级'}, {value: '1', label: '1星'}, {value: '2', label: '2星'}, {value: '3', label: '3星'}, {value: '4', label: '4星'}, {value: '5', label: '5星'}], // 评价星级
        commentLeveles: [{value: '', label: '全部'}, {value: '1', label: '好评'}, {value: '2', label: '中评'}, {value: '3', label: '差评'}], // 评价级别
        imageStatuses:[{value: '', label: '图片情况'}, {value: '1', label: '无图'}, {value: '2', label: '有图'}], // 图片情况
        datacomment: '',
        goodsCommentCurrentPage: 1,
        goodsCommentPageRows: 10,
        goodsCommentTotalCount: 0,
        replyStatusName: '回复状态',
        levelName: '评价星级',
        advancedShow: false,
        deleteId: '',
        time: '',
        imgWrap:false, //图片盒子显示隐藏
        rowIndex:0,
        imgIndex:0,
        // isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
      // 图片放大
      imgWrapShow(index,index2){
        let that = this
        that.imgWrap = true
        that.rowIndex = index
        that.imgIndex = index2
      },
      prev(){
        let that = this
        if(that.imgIndex > 0){
          that.imgIndex--
        }
      },
      next(){
        let that = this
        if(that.imgIndex < that.datacomment[that.rowIndex].commentImages.length-1){
          that.imgIndex++
        }
      },
      // 时间赋值
      timeCheck () {
        let that = this
        if (that.time != null) {
          that.search_params.startTime = that.time[0]
          that.search_params.endTime = that.time[1]
        } else {
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      // 重置
      clearAll () {
        let that = this
        that.search_params.condition = ''
        that.search_params.replyStatus = ''
        that.search_params.starLevel = ''
        that.search_params.endTime = ''
        that.search_params.startTime = ''
        that.search_params.imageStatus = ''
        that.time = ''
      },
      // 点击到删除按钮
      delShow(commentId){
        this.deleteId = commentId
         this.$confirm('是否删除评论?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            callback: this.delComment (commentId)
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      advancedSearch () {
        let that = this
        that.advancedShow = true
        that.clearAll()
      },
      goodsCommentHandleSizeChange (val) {
        let that = this
        that.goodsCommentPageRows = val
        that.get_comment_info()
      },
      goodsCommentHandleCurrentChange (val) {
        let that = this
        that.goodsCommentCurrentPage = val
        // that.isChangePage = true
        that.get_comment_info()
      },
      //删除评论
      delComment (commentId) {
        let that = this
        this.api_sellerManagePlatform_delGoodsComment({
          pathParams: '/'+commentId
        }).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status == '200') {
            that.get_comment_info()
          }
        })
      },
      // 回复状态
      replyStatus (n) {
        if (n === '' || n === undefined) {
          this.replyStatusName = '回复状态'
        } else if (n === '') {
          this.replyStatusName = '全部'
          n = ''
        } else if (n === 1) {
          this.replyStatusName = '未回复'
        } else {
          this.replyStatusName = '已回复'
        }
        this.search_params.replyStatus = n
        this.get_comment_info()
      },
      // 评价星级
      level (n) {
        if (n === '' || n === undefined) {
          this.levelName = '评价星级'
        } else if (n === 0) {
          this.levelName = '全部'
        } else if (n === 1) {
          this.levelName = '1星'
        } else if (n === 2) {
          this.levelName = '2星'
        } else if (n === 3) {
          this.levelName = '3星'
        } else if (n === 4) {
          this.levelName = '4星'
        } else if (n === 5) {
          this.levelName = '5星'
        }
        this.search_params.starLevel = n
        this.get_comment_info()
      },
      // 获取结算单列表
      get_comment_info () {
        let that = this
        that.advancedShow = false
        if (that.search_params.startTime > that.search_params.endTime) {
          that.$message.error('开始时间不能大于结束时间')
          return
        }
        // if(!that.isChangePage){
        //   that.goodsCommentCurrentPage = 1
        // }
        that.is_Success = false

        this.api_sellerManagePlatform_getGoodsComment({
          data: {
            token: sessionStorage.getItem('mToken'),
            replyStatus: that.search_params.replyStatus,
            starLevel: that.search_params.starLevel,
            commentLevel: that.search_params.commentLevel,
            startTime: that.search_params.startTime,
            endTime: that.search_params.endTime,
            condition: that.search_params.condition.replace(/\s+/g,""),
            imageStatus: that.search_params.imageStatus,
            rows: that.goodsCommentPageRows,                          // 每页多少条数据
            pageNum: that.goodsCommentCurrentPage     // 请求第几页
          }
        }).then(res => {
          if (res == undefined) {
            return false
          } else if (res.status == '200') {
            that.datacomment = res.content
            that.goodsCommentTotalCount = res.totalCount
          }
        })
        // that.isChangePage = false
      },
      timeBox () {
        this.is_Success = true
      }
    },
    mounted () {
      this.get_comment_info()
    }
  }
</script>
<style lang="scss" scoped>
  .clear{
    clear: both;
    overflow: hidden;
  }
  .mt5{
    margin-top: 5px;
  }
  .wid50{
    width: 50px;
    display: inline-block;
  }
  .mt10{
    margin-top: 10px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mr{margin-right: 20px;}
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
table tr:nth-child(2n+1){background:#F4F5FA;}
table tr:nth-child(2n){background:#EDF0F7;}
table tr:hover{background:#F4F5FA;}
  .comment_table{
    font-size: 14px;
    width: 100%;
    box-sizing:border-box;
    border-collapse:collapse;
    .a1{width: 344px;}
    .a2{width: 155px;}
    .a3{width: 205px;}
    .a4{width: 145px;}
    .a5{width: 145px;}
    .a6{width: 145px;}
    .a7{width: 145px;}
    .a8{width: 145px;}
    thead{
      tr{
        min-height: 40px;
        // line-height: 40px;
        background: #DFE9F6;
        color:#333;
        border-bottom:1px solid #e6ebf5;
        td{
          padding: 12px 0;
          text-indent: 2em;
          text-align: left;
          line-height: 23px;
        }
      }
    }
    tbody{
      background: #fff;
      border-bottom:1px solid #DFE9F6;
      tr{
        td{
          padding-left: 28px;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-right: 20px;
          background: #fff;
          min-height: 80px;
        }
        .td_img{
          width: 50px;
          height: 50px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .conimg{
          width: 50px;
          height: 50px;
          position: relative;
          display: inline-block;float:left;margin-right:10px;margin-bottom:10px;
          div{
            position: absolute;
            width:50px;height:50px;
            top: 0;
            left: 0;
            background:rgba(255,255,255,0.5);
            display: none;
            i{width:16px;height:16px;position:absolute;top:15px;left:19px;}
          }
        }
        .conimg:hover div{
          display: block;
        }
        .tdcolor{
          color: #999999;
        }
        a.ellipsis2{
          width:180px;
          height: 40px;
          line-height:20px;
          color:#5a5e66;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          position: relative;
          float:left;
        }
        a.ellipsis2:hover{ text-decoration:none;}

        a.ellipsis3{
          width:90%;
          height: 60px;
          line-height:20px;
          color:#5a5e66;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          position: relative;
          float:left;
        }
        a.ellipsis3:hover{ text-decoration:none;}
        .tdhf{
          /*width: 1120px;*/
          min-height: 100px;
          background: #F4F5FA;
          border-radius: 4px;
          padding-left: 20px;
          padding-right: 20px;
          line-height: 30px;
          .nr{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #0086FF;
          }
          .tit{
            ont-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
          }
          .time{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #999999;
          }

        }
        .icon_hp{
          width: 16px;
          height: 17px;
          display: inline-block;
          margin-right: 10px;
          background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -964px -166px no-repeat;
        }
      }
    }
  }

  .imgWrap{
    width:660px;
    height:660px;
    // background: #ffffff;
    // border-radius:10px;
    position: fixed;
    top:50%;left:50%;
    margin-top:-330px;
    margin-left:-330px;
    z-index: 999;
    a.close{
      display:inline-block;width:30px;height:30px;
      position: absolute;top:-60px;right:-200px; background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -350px -181px no-repeat;
    }
    div.imgUl{
      width:660px;
      height:660px;
      position: absolute;
      top:0px;left:0px;
      vertical-align: middle;
      display: table;
      ul{
        width:660px;
        height:660px;
        li{
          line-height:660px;
          width:660px;
          height:660px;
          img{width:660px;height:auto;}
        }
      }
    }
    div.ctrl{
      position: absolute;
      top:260px;
      left:-130px;
      width:920px;
      a{
        width:50px;height:50px;display:inline-block;position:absolute;
      }
      a.prev{top:0;left:0px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -50px -50px no-repeat;opacity:0.4}
      a.next{top:0;right:0px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -200px -50px;opacity:0.4}
      a.prev:hover{transition: all 0.2s ease;opacity:1}
      a.next:hover{transition: all 0.2s ease;opacity:1}
    }
  }
  .sp{
    width: 1583px;
    height: 84px;
    margin-left: 48px;
    margin-top: 130px;
    background-color: #fff;
    .dropdown{
      display: inline-block;
      font-size: 16px;
      line-height: 84px;
      .sort{
        display: inline;
        margin: 0 20px 0 30px;
      }
      .state{
        display: inline;
        margin-right: 20px;
      }
      .dropdown-menu {
        li{
          line-height: 30px;
          padding-left: 25px;
          position: relative;
          i{
            font-size: 10px;
            color: gray;
            padding-left: 15px;
            position: absolute;
            top: 8px;
            right: 19px;
          }
        }
      }
    }
    .search_cell{
      display: inline-block;
      position: relative;
      span{
        font-size: 16px;
        margin-right: 25px;
        i{
          font-size: 20px;
          padding-left: 10px;
        }
      }
      .time{
        width: 600px;
        height: 61px;
        position: absolute;
        left: 0px;
        top: 60px;
        z-index: 10;
        .form-control{
          width: 139px;
          height: 31px;
          position: absolute;
          top: 12px;
        }
        .start{
          left: 20px;
        }
        .separator{
          position: absolute;
          left: 162px;
          top: 12px;
        }
        .end{
          right: 20px;
        }
      }
    }
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 500px;
        height: 39px;
        color: #444;
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .add{
      margin-top: 31px;
      margin-right: 15px;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      padding: 10px;
      position: relative;
      .bootstrap-table {
        margin: 0;
      }
      [tableexport-id] {
        width: 120px;
        height: 25px;
        color: #fff;
        line-height: 25px;
        border-radius: 2px;
        border: none;
        margin-bottom: 12px;
        position: absolute;
        top: 10px;
        left: 134px;
        background: #F56C6C;
      }
      .public_button {
        width: 120px;
        height: 25px;
        color: #fff;
        border-radius: 2px;
        border: none;
      }
      .print_order {
        background: #18DCF6;
      }
      //表格样式
      table {
        td {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .zIndex2{z-index:21;}
  .icon{width:40px;height:40px;z-index:11;display:inline-block;}
  .timeIcon{background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -50px -340px no-repeat;background-size:19px 20px;}
  .searchIcon{background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -514px -836px no-repeat;background-size:20px 20px;}
  .soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2;
    h4 a.close{
      opacity:1;display:inline-block;width:24px;height:24px;float:right; margin-right:20px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -174px -470px no-repeat;
    }
    .searcWrap{width:100%;height:auto;position:relative;}
    .mess{
      margin-top: 30px;padding:0px 40px;padding-bottom:30px;background:#fff;
      h4{
        line-height:50px;
        margin-bottom:10px;
        font-size:16px;
        color:#333;
      }
      .inline{display:inline-block;line-height:50px;}
      .modify{margin-left:10px;line-height:50px;width:16px;height:16px;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -398px -836px no-repeat;}
    }
    .alginRight{text-align: right; line-height:50px;color:#666;}
    .formControl{display:inline-block;width:100%;height:36px;padding:6px 12px; line-height:50px;font-size:14px;background:#fff;border:1px solid #ccc;border-radius:4px;}
  }
  .mb20{
    margin-bottom: 20px;
  }
  .delectGoodCon {
    width: 400px;
    height: 280px;
    background: #fff;
    z-index: 9999;
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -140px;
    background: #FFFFFF;
    border-radius: 4px;
    .agreetc_header, .refuse_header {
      width: 100%;
      height: 50px;
      background: #DFE9F6;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 16px;
      span {
        display: inline-block;
        line-height: 50px;
      }
    }
  }

  .agreetc_header, .refuse_header {
    width: 100%;
    height: 50px;
    background: #DFE9F6;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 16px;
    span {
      display: inline-block;
      line-height: 50px;
    }
  }
  .fr{
    float: right;
  }
  .agreetc_body{
    padding-left: 20px;
    padding-right: 20px;
    background: #FFFFFF;
    margin-top: 10px;
    text-align: center;
    font-size: 20px;
    color: #333333;
    line-height: 150px;
  }
  .agreetc_footer,.refuse_footer {
    height: 80px;
    padding-top: 10px;
    padding-left: 50%;
    .btn {
      width: 80px;
      height: 30px;
      border: none;
      border-radius: 2px;
      color: #fff;
    }

    .save {
      margin-left: -110px;
      background: #0086FF;
    }
    .cancel {
      margin-left: 40px;
      background: #FFF;
      border: 1px solid #CCCCCC;
      color: #444;
    }
  }
  .hptczp{
    width: 100%;
    height: 100%;
    display: block;
    position: fixed;
    left: 0px;
    top: 0px;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    opacity: 0.5;

  }
</style>
