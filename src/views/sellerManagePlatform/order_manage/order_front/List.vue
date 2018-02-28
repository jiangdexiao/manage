<template>
  <div class="list">
    <div class="toolbar">
      <el-select v-model="search_params.orderStatus" placeholder="订单状态">
        <el-option
          v-for="orderStatu in orderStatuses"
          :key="orderStatu.value"
          :label="orderStatu.label"
          :value="orderStatu.value">
        </el-option>
      </el-select>
      <el-select v-model="search_params.afterSellStatus" placeholder="售后状态">
        <el-option
          v-for="afterSellStatu in afterSellStatuses"
          :key="afterSellStatu.value"
          :label="afterSellStatu.label"
          :value="afterSellStatu.value">
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
      <el-input v-model="search_params.condition" placeholder="输入商品名称/订货号/支付单号/收货人号码/商家名称/商家ID" :maxlength="100" title="输入商品名称/订货号/支付单号/收货人号码/商家名称"></el-input>
      <el-button type="primary" size="medium" @click="get_good_info()" class="btn-search">搜索</el-button>
      <span class="ml10 gjsort" @click="advancedSearch">高级搜索</span>
    </div>
    <div class="toolbar btnbar">
      <el-button type="primary" size="medium" icon="el-icon-download" @click.native="exportSearch()">导出</el-button>
    </div>
    <div class="soloSearchBox" v-if="advancedShow">
      <h4>高级搜索<a class="close bg-ico_close" @click="advancedShow=!advancedShow"></a></h4>
      <div class="searcWrap mess">
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">关键词：</el-col>
          <el-col :span="9">
            <el-input v-model="search_params.condition" :maxlength="100" placeholder="输入商品名称/订货号/支付单号/收货人号码/商家名称/商家ID" title="输入商品名称/订货号/支付单号/收货人号码/商家名称/商家ID"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">下单时间</el-col>
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
          <el-col :span="3" class="alginRight">订单状态：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.orderStatus" placeholder="订单状态">
              <el-option
                v-for="orderStatu in orderStatuses"
                :key="orderStatu.value"
                :label="orderStatu.label"
                :value="orderStatu.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="alginRight">评论状态：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.commentStatus" placeholder="评论状态">
              <el-option
                v-for="commentStatu in commentStatus"
                :key="commentStatu.value"
                :label="commentStatu.label"
                :value="commentStatu.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">售后状态：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.afterSellStatus" placeholder="售后状态">
              <el-option
                v-for="afterSellStatu in afterSellStatuses"
                :key="afterSellStatu.value"
                :label="afterSellStatu.label"
                :value="afterSellStatu.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="alginRight">支付方式：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.payWay" placeholder="支付方式">
              <el-option
                v-for="isPayDeposit in isPayDeposits"
                :key="isPayDeposit.value"
                :label="isPayDeposit.label"
                :value="isPayDeposit.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
        <!--  <el-col :span="3" class="alginRight">开发票：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.invoiceType" placeholder="开发票">
              <el-option
                v-for="invoiceType in invoiceTypes"
                :key="invoiceType.value"
                :label="invoiceType.label"
                :value="invoiceType.value">
              </el-option>
            </el-select>
          </el-col>-->
          <el-col :span="3" class="alginRight">广告位：</el-col>
          <el-col :span="9">
            <el-select v-model="search_params.mediaInfo" placeholder="广告位">
              <el-option
                v-for="mediaInfo in mediaInfos"
                :key="mediaInfo.value"
                :label="mediaInfo.label"
                :value="mediaInfo.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt20">
          <el-col :span="20" :offset="3">
            <el-button type="primary" size="medium" @click="searchAll()" class="btn-search">搜索</el-button>
            <el-button size="medium" @click="clearAll()">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="good_info clear">
      <table class="notetable">
        <thead>
        <tr>
          <!--<td><el-checkbox @change="checkAll" id="ck_all"></el-checkbox></td>-->
          <td class="a8">操作</td>
          <td class="a1">
            单号</td>
          <td class="a2">支付单号</td>
          <!--<td class="a3">数量</td>-->
          <td class="a4">订单总额/元</td>
          <td class="a5">订单状态</td>
          <td class="a6">商家信息</td>
          <td class="a7">下单时间</td>
        </tr>
        </thead>
        <!-- 在tbody上v-for循环 -->
        <tbody v-if="totalCount == 0">
        <tr style="height:50px; text-align:center;">
          <td colspan="7">暂无数据</td>
        </tr>
        </tbody>
        <tbody v-for="(item,index) in dataList">
        <tr class="bg01">
        <!--  <td>
            <el-checkbox :name="'ck'+ index"></el-checkbox>
          </td>-->
          <td><span>   -</span></td>
          <td>
            <span>平台号：{{item.orderId}}</span></td>
          <td><span v-show="item.payNo != '' ? true : false">{{item.payNo}}</span></td>
          <!--<td><span >&nbsp;- </span></td>-->
          <!-- <td><span> {{((parseFloat(item.goodAmount) + parseFloat(item.oderFreight) - parseFloat(item.plateFormDiscount)-parseFloat(item.dealerDiscount))).toFixed(2)}} </span></td> -->
          <td><span> {{((parseFloat(item.goodAmount) + parseFloat(item.oderFreight) - parseFloat(item.plateFormDiscount)-parseFloat(item.dealerDiscount) - parseFloat(item.strCouponDiscount))).toFixed(2)}} </span></td>
          <td><span>   -</span></td>
          <td><span>   -</span></td>
          <td><span>   {{item.createDate}}</span></td>

        </tr>
        <tr class="bg02">
          <td colspan="8"  class="nopad">
            <table class="cen_tab">
              <tr v-for="(bean,subIndex) in item.dealerOrderBeans">
                <!--<td></td>-->
                <td class="a5">
                  <div class="detail" @click="gotoDetail(item.orderId, bean.dealerOrderId)" ><i class="ico_details bg-ico_details mr20 fl"></i>详情</div>
                </td>
                <td class="a1"><span>订货号：{{bean.dealerOrderId}}</span></td>
                <td class="a2"><span v-show="item.payNo != '' ? true : false">{{item.payNo}}</span></td>
                <!--<td class="a3">-</td>-->
                <!-- <td class="a4"><span>{{(parseFloat(bean.goodAmount)+parseFloat(bean.oderFreight)-parseFloat(bean.dealerDiscount)-parseFloat(bean.plateFormDiscount)).toFixed(2)}}</span></td> -->
                <td class="a4"><span>{{(parseFloat(bean.goodAmount)+parseFloat(bean.oderFreight)-parseFloat(bean.dealerDiscount)-parseFloat(bean.plateFormDiscount) - parseFloat(bean.strCouponDiscount)).toFixed(2)}}</span></td>
                <td class="a5"><span>{{bean.status==0?'待付款': bean.status==1? '待发货' : bean.status==2?'待收货' : bean.status==3 ? '已完成' : bean.status==4 ? '交易完成' : bean.status==5?'交易关闭':  bean.status==-1?'已取消':'--'}}</span>
                </td>
                <td class="a6"><a class="ellipsis width" :title="bean.dealerName">{{bean.dealerName}}</a></td>
                <td class="a7"><span>{{item.createDate}}</span></td>
              </tr>
            </table>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="block" style="margin: 20px;float: left">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="pageIndex"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */
  // import searchTag from '../../searchTag'
  export default {
    name: '',
    data () {
      return {
        noMessage:false,
        dataList: [],
        amout: '',
        number: '',
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        advancedShow: false,
        is_Success: false,
        // 搜索参数
        search_params: { orderStatus: '', afterSellStatus: '', orderId: '', payWay: '', startTime: '', endTime: '', condition: '', mediaInfo: '', dealerClassify: '', commentStatus: '', invoiceType: ''},
        searchBoxList: [],
        time: '',
        orderStatuses:[{value:'',label:'订单状态'},{value:'0',label:'待付款'},{value:'1',label:'待发货'},{value:'2',label:'待收货'},{value:'3',label:'已完成'},{value:'4',label:'交易完成'},{value:'5',label:'交易关闭'},{value:'-1',label:'已取消'}],
        afterSellStatuses:[{value:'',label:'售后状态'},{value:'20',label:'待商家同意'},{value:'21',label:'待顾客寄回商品'},{value:'22',label:'待商家确认退款'},{value:'23',label:'待商家发货'},{value:'24',label:'待顾客收货'},{value:'25',label:'售后已完成'},{value:'26',label:'售后已取消'},{value:'27',label:'商家已拒绝'}],
        commentStatus:[{value:'',label:'评论状态'},{value:'0',label:'待评论'},{value:'1',label:'已评论'}],
        isPayDeposits:[{value:'',label:'支付方式'},{value:'1',label:'支付宝'},{value:'2',label:'微信'}],// 支付方式
        invoiceTypes:[{value:'',label:'开发票'},{value:'0',label:'个人'},{value:'1',label:'公司'}], // 发票
        mediaInfos:[{value:'',label:'广告位'},{value:'0',label:'无'},{value:'1',label:'有'}], // 广告位
        // isChangePage: false //搜索时是否是页码切换请求 以判断是否要重置页码
      }
    },
    methods: {
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
      gotoDetail(orderId, dealerOrId) {
        let that = this
        var path='s_dealerOrDtl'
        that.$router.push({name : path,query: {orderId: orderId, dealerOrderId: dealerOrId}})
      },
      handleSizeChange (sz) {
        let that = this;
        that.pageSize = sz;
        that.get_good_info();
      },
      handlePageChange (sz) {
        let that = this;
        that.pageIndex = sz;
        // that.isChangePage = true
        that.get_good_info()
      },
      searchAll () {
        let that = this
        that.get_good_info()
        that.advancedShow = false
      },
      // 时间选择
      changeTime(){
        let that = this
        let x = 'startTime'
        let y = that.search_params.startTime + "~" + that.search_params.endTime
        that.addTag(x, '时间段：' + y)
        that.get_good_info()
      },
      // 高级搜索内重置
      clearAll () {
        let that = this
        that.search_params.orderStatus = ''
        that.search_params.afterSellStatus = ''
        that.search_params.orderId = ''
        that.search_params.payWay = ''
        that.search_params.startTime = ''
        that.search_params.endTime = ''
        that.search_params.condition = ''
        that.search_params.mediaInfo = ''
        that.search_params.dealerClassify = ''
        that.search_params.invoiceType = ''
        that.search_params.commentStatus = ''
        that.time = ''
      },
      advancedSearch () {
        let that = this
        that.advancedShow = true
      },
      // 获取全部订单信息
      get_good_info () {
        let that = this
        that.advancedShow = false
        if (that.search_params.startTime > that.search_params.endTime) {
          that.$message('开始时间不能大于结束时间')
          return
        }
        // if(!that.isChangePage){
        //   that.pageIndex = 1
        // }
        that.is_Success = false
        let a = {
         // dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          condition: that.search_params.condition.replace(/\s+/g,""),
          rows: that.pageSize,                     // 每页多少条数据
          pageNum: that.pageIndex,    // 请求第几页
        }
        this.api_sellerManagePlatform_getOrderList({data:Object.assign(this.search_params,a)}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.dataList = res.content;
            for(let i=0;i<that.dataList.length;i++){
              let d = new Date(that.dataList[i].createDate)
              this.dataList[i].createDate = this.tool.date.format(d, 'yyyy-MM-dd hh:mm')
            }
            if(res.content.length == 0){
              that.noMessage = true
            }
            console.log(that.dataList)
            that.totalCount = res.totalCount;
          }
        })
        // that.$.ajax({
        //   type: 'get',
        //   url: that.localbase + 'm2c.scm/order/manager/orderList',
        //   data: {
        //      token: sessionStorage.getItem('mToken'),
        //       isEncry: false,
        //       dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
        //       orderStatus: that.search_params.orderStatus,
        //       afterSellStatus: that.search_params.afterSellStatus,
        //       startTime: that.search_params.startTime,
        //       endTime: that.search_params.endTime,
        //       condition: that.search_params.condition.replace(/\s+/g,""),
        //       payWay: that.search_params.payWay,
        //       commentStatus:that.search_params.commentStatus,
        //       rows: that.pageSize,                     // 每页多少条数据
        //       pageNum: that.pageIndex,    // 请求第几页
        //     mediaInfo:that.search_params.mediaInfo
        //   },
        //   success: function (res) {
        //     var dataList = res.content;
        //     if(res.content.length == 0){
        //       that.noMessage = true
        //     //  that.show_tip('没有匹配的数据')
        //     }
        //     that.totalCount = res.totalCount;
        //     that.dataList= dataList;
        //     console.log(res);
        //   }
        // })
        // that.isChangePage = false
      },
      exportSearch () {
        let that = this
        that.advancedShow = false
        if (that.search_params.startTime > that.search_params.endTime) {
          that.$message('开始时间不能大于结束时间')
          return
        }
        let url=this.BASE_URL + 'm2c.scm/order/export/admin/all/orderDtl?'+
          'orderStatus='+that.search_params.orderStatus+
          '&afterSellStatus='+that.search_params.afterSellStatus+
          '&condition='+that.search_params.condition.replace(/\s+/g,"") +
          '&startTime='+that.search_params.startTime+
          '&endTime='+that.search_params.endTime+
          '&payWay='+that.search_params.payWay+
          '&mediaInfo='+that.search_params.mediaInfo+
          '&commentStatus='+that.search_params.commentStatus+'&access_token='+sessionStorage.getItem('access_token');
        if(!that.tool.permission.permission('scm:order:export')){
          this.$message('无权限访问接口')
          return
        }
        window.location.href=url
      },
      timeBox () {
        this.is_Success = true
      }
      // ,checkAll(val) {
      //   let that = this;
      //   var len = that.dataList.length;
      //   for (var i = 0; i < len; i++) {
      //     //console.log(typeof(that.$("input[name='ck" + i + "']").prop("checked")));
      //     if(that.$("input[name='ck" + i + "']").prop("checked") != val)
      //       that.$("input[name='ck" + i + "']").click();
      //   }
      // }
    },
    mounted () {
      this.get_good_info()
    }

  }
</script>
<style lang="scss" scoped>
.searchBoxList{width:100%;height:52px;padding:10px 0;background:#fff;}
.searchBoxList span{display:inline-block;padding-left:20px;margin-right:10px;}
.searchBoxList span.clearSearch{display:inline-block;float:right;margin-right:10px;padding-left:16px;}
// background:url(../../../assets/images/ico_reset.png) no-repeat 0 0;
  .good_info {
    float:left;
    width:100%;
    height:auto;
    .notetable{
      width:100%;
      min-height: 40px; border-collapse:collapse;
			.a1{
				width: 20%;
			}
			.a2{
				width: 20%;
			}
			.a4{
				width: 10%;
			}
			.a5{
				width: 10%;
			}
			.a6{
				width: 10%;
			}
			.a7{
				width: 15%;
			}
			.a8{
				width: 10%;
			}
      .ico_explain{
        width: 16px;
        height: 16px;
        display: inline-block;
      }
      thead{
        background: #DFE9F6;
        tr{
          height: 40px;
          line-height: 40px;
          td{
            color:#333;
            padding-left: 30px;font-size:14px;
          }
        }
      }
      .red_fh{
        color: red;
      }
      tbody{
        .content{
          background: rgba(244,245,250,0.00);
          box-shadow: 0 -1px 0 0 #E5E5E5;
          padding-top: 20px;
          padding-bottom: 20px;

        }
        .a1_img{
          padding-left: 25px;
          img{
            width: 50px;
            height: 50px;
            margin-top: 20px;
            margin-bottom: 20px;
          }
        }
        .bg01{
        	background: #F4F5FA;
        }
        td{
          color:#666; font-size:14px;
          padding:7px 0;
          padding-left: 30px;
          height: 50px;
          line-height: 24px;
      	}
      	.bg02{
          background:#EDF0F7;
      		.nopad{
      			padding: 0px;
      			.cen_tab{
              width: 100%;
              td.a6{
                width:10%;
                a.width{width:100px;color:#5a5e66;display: block;}
                a.width:hover{ text-decoration:none;}
              }

      			}
      		}
      		// tr{
      		// 	border-bottom: 1px solid #E5E5E5;
      		// }
      		td{
      			padding-right: 0px;
      		}
      	}
      }

    }
  }

    span{
      cursor: pointer;
    }
    .operation{
      margin-top: 31px;
      margin-right: 15px;
    }
.soloSearchBox{position:absolute;top:0;left:0;height:auto;padding:20px;width:100%;background:#fff;z-index:2; box-sizing:border-box;
  h4 a.close{
    opacity:1;display:inline-block;width:24px;height:24px;float:right; mergin-right:20px;
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
  }
  .alginRight{text-align: right; line-height:50px;color:#666;}
}
.detail{cursor:pointer;color: #667991;}
.ico_details{
	background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -746px -836px no-repeat;
	width: 16px;
	height: 16px;
	display: inline-block;
	margin-top: 4px;
}
/*公用样式*/
.mr20{
  margin-right: 20px;
}
.mt10{
  margin-top: 10px;
}
.mt20{
  margin-top: 20px;
}
</style>
