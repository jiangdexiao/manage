<template>
  <div class="list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="售后单详情" name="first">
        <div class="elRow">
          <el-row :gutter="20">
            <el-col :span='6'>
              <span class="tit01">售后状态</span>
              <span class="ml20">
                {{orderDetail.orderType==0?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==1?'待商家同意':orderDetail.status==4?'待顾客寄回商品':(orderDetail.status==5||orderDetail.status==6)?'待商家发货':orderDetail.status==7?'待顾客收货':orderDetail.status>=8?'售后已完成':'--'):orderDetail.orderType==1?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==0?'待商家同意':orderDetail.status==4?'待顾客寄回商品':(orderDetail.status==5||orderDetail.status==6)?'待商家确认退款':orderDetail.status>=9?'售后已完成':'--'):orderDetail.orderType==2?(orderDetail.status==-1?'售后已取消':orderDetail.status==3?'商家已拒绝':orderDetail.status==2?'待商家同意':orderDetail.status==4?'待商家确认退款':orderDetail.status>=9?'售后已完成':'--'):'--'}}
              </span>
            </el-col>
            <el-col :span="12">
              <span class="tit01">售后期望</span>
              <span class="ml20">{{orderDetail.orderType==0?'换货':orderDetail.orderType==1?'退货':orderDetail.orderType==2?'仅退款':'-'}}</span>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="6">
              <span class="tit01">售后单号</span>
              <span class="ml20">{{orderDetail.afterSelldealerOrderId}}</span>
            </el-col>
            <el-col :span="12">
              <span class="tit01">售后总额</span>
              <!-- <span class="ml20 redcolor">{{orderDetail.orderType==0?'--':((parseFloat(orderDetail.backMoney) + parseFloat(orderDetail.backFreight))).toFixed(2)}}元</span> -->
              <span class="ml20 redcolor">{{orderDetail.orderType==0?'--':orderDetail.backMoney}}元</span>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="6">
              <span class="tit01">申请原因</span>
              <span class="ml20">{{orderDetail.reason}}</span>
            </el-col>
            <el-col :span="12">
              <span class="tit01">申请时间</span>
              <span class="ml20">{{orderDetail.createdDate}}</span>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="6">
              <span class="tit01">关联订货号</span>
              <router-link   :to="{name:'s_dealerOrDtl',query:{dealerOrderId: orderDetail.dealerOrderId,orderId: orderDetail.orderId}}" target="_blank"><span class="ml20 alink">{{orderDetail.dealerOrderId}}</span></router-link>
            </el-col>
            <el-col :span="12">
              <span class="tit01 fl" v-show="orderDetail.rejectReason!=''">拒绝原因</span>
              <span class="ml20 fl" style="width:65%;">{{orderDetail.rejectReason}}</span>
            </el-col>
            <el-col :span="6"> </el-col>
            <el-col :span="24">
              <span class="tit01">订单总额</span>
              <!-- <span class="ml20">{{(orderDetail.orderTotalMoney)}}元（含运费<span>{{(orderDetail.orderFreight)}}</span>元）</span> -->
              <span class="ml20">{{orderDetail.orderTotalMoney}}元（含运费<span>{{(orderDetail.orderFreight)}}</span>元）</span>
            </el-col>
          </el-row>
          <table class="mt20 detail_table">
            <thead>
            <tr>
              <td class="a1">商品信息</td>
              <td class="a2">广告位信息</td>
              <td class="a4">数量</td>
              <td class="a4">单位</td>
              <td class="a3">单价/元</td>
              <td class="a5">商品金额/元</td>
              <td class="a5">售后金额/元</td>
              <td class="a6">操作</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="a1 clear">
                <div class="a1tab fl mr20 mt10"><img :src="JSON.parse((typeof(orderDetail.goodsInfo.goodsImage) == 'undefined' || orderDetail.goodsInfo.goodsImage == '')? '[1]': orderDetail.goodsInfo.goodsImage)[0]"/></div>
                <div class="a1tit fl">
                  <div class="wose">
                    <i v-if="orderDetail.goodsInfo.isChange==1" class="changeGood"></i>
                    {{orderDetail.goodsInfo.goodsName}}
                  </div>
                  <div class="blue" v-if="orderDetail.goodsInfo.skuName != ''">
                    规格： {{orderDetail.goodsInfo.skuName}}
                  </div>
                </div>
              </td>
              <td class="a2">{{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].name : ''):''}}
                <br>{{orderDetail.goodsInfo.mediaResId != ''?(typeof(mediaResInfos[orderDetail.goodsInfo.mediaResId])!='undefined'?mediaResInfos[orderDetail.goodsInfo.mediaResId].cateName:''):''}}</td>
                <td class="a4">{{orderDetail.goodsInfo.sellNum}}</td>
               <td class="a4">{{orderDetail.goodsInfo.unitName}}</td>
              <td class="a3">
                <template v-if="orderDetail.goodsInfo.isSpecial==1">特惠价 {{(orderDetail.goodsInfo.strSpecialPrice)}}</template>
                <p :class="{'lineThrough':orderDetail.goodsInfo.isSpecial==1}">{{(orderDetail.goodsInfo.strPrice)}}</p>
                <!-- {{(orderDetail.goodsInfo.price)}} -->
              </td>
              <td class="a5">{{(orderDetail.goodsInfo.strTotalPrice)}}</td>
              <!-- <td class="a5">{{orderDetail.orderType==0?'--': (parseFloat(orderDetail.backMoney) + parseFloat(orderDetail.backFreight)).toFixed(2)}}</td> -->
              <td class="a5">{{orderDetail.orderType==0?'--': (orderDetail.backMoney)}}</td>
              <td class="a6">--</td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="售后物流" name="second">
          <!--没有物流的情况 -->
        <div class="elRow">
          <h3 class="building" v-if="orderDetail.status <=4"> 暂无物流信息</h3>
          <el-row :gutter="20" v-if ="orderDetail.status>=5">
            <el-col :span='6'>
              <span class="tit01">售后状态:</span>
              <span class="ml20" >
                {{orderDetail.orderType==0?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==1?'待商家同意':logistics.status==4?'待顾客寄回商品':(logistics.status==5||logistics.status==6)?'待商家发货':logistics.status==7?'待顾客收货':logistics.status>=8?'售后已完成':'--'):orderDetail.orderType==1?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==0?'待商家同意':logistics.status==4?'待顾客寄回商品':(logistics.status==5||logistics.status==6)?'待商家确认退款':logistics.status>=9?'售后已完成':'--'):orderDetail.orderType==2?(logistics.status==-1?'售后已取消':logistics.status==3?'商家已拒绝':logistics.status==2?'待商家同意':logistics.status==4?'待商家确认退款':logistics.status>=9?'售后已完成':'--'):'--'}}
              </span>
            </el-col>
            <el-col :span='6'>
              <span class="tit01">售后单号:</span><span class="ml20">{{logistics.afterSellOrderId}}</span>
            </el-col>
          </el-row>
          <table class="mt20 detail_table" v-if ="orderDetail.status>=5">
            <thead>
              <tr style="margin-left:40px" >
                <td><span style="margin-left:20px;width:50%">商品信息</span> <span style="margin-left:50%">换货数</span></td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="a1 clear">
                  <div class="a1tab fl mr20 mt10"><img :src="JSON.parse(orderDetail.goodsInfo.goodsImage == ''? '[]': orderDetail.goodsInfo.goodsImage)[0]" /></div>
                  <div class="wose wid">
                    <i v-if="orderDetail.goodsInfo.isChange==1" class="changeGood"></i>
                    {{orderDetail.goodsInfo.goodsName}}</div>
                  <div class="blue" v-if="orderDetail.goodsInfo.skuName != ''">规格：{{orderDetail.goodsInfo.skuName}}</div>
                </td>
                <td>
                </td>
              </tr>
              <!--换货 且售后状态为商家重新发货之后的情况-->
              <tr class="borderTop" v-if ="orderDetail.orderType==0 && logistics.status>=7" >
                <td style="width:100%">
                  <h3 style="color:rgb(0, 102, 204);padding-left:12px;font-size:16px;" >商家重新发货</h3>
                  <template v-if="logistics.expressWay===0">
                    <div class="detail_cen" style="line-height: 40px;">
                      <div>
                        <span class="tit01">物流公司:</span><span class="ml20">{{logistics.expressName!=='' ? logistics.expressName : '--'}}</span>
                      </div>
                      <div>
                        <span class="tit01">物流单号:</span>
                        <span class="ml20">{{logistics.expressNo!=='' ? logistics.expressNo : '--'}}
                          <a v-if="!expressLink" class="ml20" @click="getQueryExpress(logistics.expressCode,logistics.expressNo)">查看物流跟踪信息</a>
                          <a v-if="expressLink" href="http://www.kuaidi100.com/?from=openv" target="_blank">查看物流跟踪信息</a>
                        </span>
                      </div>
                    </div>
                  </template>
                  <template v-if="logistics.expressWay===1">
                    <div class="detail_cen" style="line-height: 40px;">
                      <div>
                        <span class="tit01">配送方式:</span><span class="ml20">自有物流</span>
                      </div>
                      <div>
                        <span class="tit01">配送员:</span>
                        <span class="ml20">{{logistics.expressPerson!=='' ? logistics.expressPerson : '--'}}</span>
                        <span class="ml20">{{logistics.expressPhone!=='' ? logistics.expressPhone : '--'}}</span>
                      </div>
                    </div>
                  </template>
                </td>
                <td></td>
              </tr>
              <!--退货/换货 且售后状态为顾客寄回商品之后的情况-->
              <tr class="borderTop" v-if ="(orderDetail.orderType==0||orderDetail.orderType==1) && logistics.status>=5">
                <td style="width:100%" >
                  <h3 style="color:rgb(0, 102, 204);padding-left:12px;font-size:16px;" >顾客寄回商品</h3>
                  <div class="detail_cen" style="line-height: 40px;">
                    <div>
                      <span class="tit01">物流公司:</span>
                      <span class="ml20">{{logistics.backExpressName == ''? '--' :logistics.backExpressName}}</span>
                    </div>
                    <div>
                      <span class="tit01">物流单号:</span>
                      <span class="ml20">{{logistics.backExpressNo == ''? '--' :logistics.backExpressNo}}
                        <a class="ml20" v-if="!expressLink1" @click="getQueryExpress(logistics.backExpressCode,logistics.backExpressNo)">查看物流跟踪信息</a>
                        <a v-if="expressLink1" href="http://www.kuaidi100.com/?from=openv" target="_blank">查看物流跟踪信息</a>
                      </span>
                    </div>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="third">
         <div class="ops_red">
           <div class="ops_tabs">
             <el-table
               :data="operatingRecords"
               style="width: 100%">
               <el-table-column
                 label="操作时间">
                 <template slot-scope="scope">{{tool.date.format(new Date(scope.row.optTime), 'yyyy-MM-dd hh:mm:ss')  }}</template>
               </el-table-column>
               <el-table-column
                 prop="optContent"
                 label="操作内容">
               </el-table-column>
               <el-table-column
                 prop="optUserStr"
                 label="操作人">
               </el-table-column>
             </el-table>
           </div>

         <div class="page_pus" style="margin-top: 20px;height: 60px;">
           <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="currentPage"
             :page-sizes="[5, 10, 20, 30]"
             :page-size="pageRows"
             layout="total, sizes, prev, pager, next, jumper"
             :total="totalCount">
           </el-pagination>
         </div>
         </div>
      </el-tab-pane>
    </el-tabs>
    <div class="hptczp" v-if="logisticShow"></div>
    <div class="infoBox" v-if="logisticShow">
      <h4>物流跟踪信息<a class="close bg-ico_close02" @click="logisticShow=!logisticShow"></a></h4>
      <ul>
        <li v-for="(item,index) in logisticInfo">
          <p>{{item.context}}</p>
          <h5>
            <span>{{item.time[1]}}</span>
            <span class="fontSamll">{{item.time[0]}}</span>
          </h5>
        </li>
      </ul>
      <h6>如快递有问题，请先拨打快递公司电话咨询<el-button size="medium" @click="logisticShow=!logisticShow" class="fr mr20" style="margin-top:8px;">关闭查询结果</el-button></h6>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        expressLink1:false,//顾客
        expressLink:false,//商家
        pageRows:5,
        currentPage: 1,
        totalCount:0,
        activeName: 'first',
        orderDetail:{
          afterSelldealerOrderId:'',
          backMoney: 0,
          createdDate: '',
          dealerdealerOrderId: '',
          goodsInfo:{},
          orderTotalMoney:0,
          orderType:0,
          reason:'',
          status:0,
          orderFreight:0,
          backFreight:0,
          strcouponDiscount:''
        },
        operatingRecords:[],
        logistics:{
          afterSellOrderId:'',
          expressName:'',
          expressNo:'',
          goodsInfo:'',
          status:0,
          backExpressName:''
          ,backExpressNo:''
          ,orderType:-1
        },
        dialogVisible: false,
        // 搜索参数
        search_params: { orderNo: '', keywordType: '', statusFlag: sessionStorage.getItem('statusFlag'), payWay: '', startTime: sessionStorage.getItem('startTime'), endTime: sessionStorage.getItem('endTime'), keyword: '' },
        dialogVisible: false,
        shipmentForm: {
          expressNo: '',
          expressName: '',
          expressCode: '',
          noted:'',
          expressPerson: '',
          phone: '',
          expressWay:'0',
        },
        formLabelWidth: '120px',
        shipments:[],
        mediaResInfos:{},
        goodses:[],
        logisticShow:false, // 物流单弹层
        logisticInfo:[], // 物流信息
      }
    },
    methods: {
      //获取‘查看物流信息’标识
      getflage(com,nu,flage){
        let that = this
        this.api_sellerManagePlatform_getQueryExpress({data:{
          com:com,
          nu:nu
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            if(res.content===''){
              if(flage===1){
                  that.expressLink = true
                }else{
                  that.expressLink1 = true
                }
              }else{
                return
              }
          }else{
            return
          }
        })
      },
      //物流单详情
      getQueryExpress(com,nu){
        let that = this
        console.log(nu)
        this.api_sellerManagePlatform_getQueryExpress({data:{
          com:com,
          nu:nu
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.logisticShow = true
            if(res.content.resData === ''){
              that.logisticInfo = []
            }else{
              that.logisticInfo = JSON.parse(res.content.resData).data
            }
            let obj = {'context':'添加售后物流信息','time':that.tool.date.format(new Date(res.content.shipGoodsTime), 'yyyy-MM-dd hh:mm:ss')
            }
            that.logisticInfo.push(obj)
            for(let i = 0;i<that.logisticInfo.length;i++){
              that.logisticInfo[i].time = that.logisticInfo[i].time.split(" ")
            }
          }else{
            that.$message({
              type:'error',
              message:res.errorMessage
            })
          }
        })
      },
      // 获取全部订单信息
      handleClick(tab, event) {
        if (tab.paneName==='first'){
          let that = this
          that.loadOrderDetail()

        } else if (tab.paneName==='third'){
          let that = this
          that.operatingRecord()
        }
        else if (tab.paneName==='second'){
          let that = this
          that.afterselllogistics()
        }
      }
      ,loadOrderDetail () {
        let that = this
        this.api_sellerManagePlatform_loadOrderDetail({data:{
          afterSellOrderId:sessionStorage.getItem('afterSale:afterSellOrderId')
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.orderDetail = res.content
            that.orderDetail.afterSelldealerOrderId = res.content.afterSellDealerOrderId
            that.orderDetail.backMoney = res.content.strBackMoney
            that.orderDetail.orderTotalMoney=res.content.strOrderTotalMoney
            that.orderDetail.orderFreight=res.content.strOrderFreight
            that.orderDetail.backFreight=res.content.strBackFreight
            that.orderDetail.createdDate = this.tool.date.format(res.content.createdDate, 'yyyy-MM-dd hh:mm:ss')
            // that.orderDetail.orderTotalMoney=res.content.strOrderTotalMoney
            // that.orderDetail.orderFreight=res.content.strOrderFreight
            // that.orderDetail.backFreight=res.content.strBackFreight
            // that.orderDetail.strcouponDiscount = res.content.strcouponDiscount
            sessionStorage.setItem('afterSellDealerOrderId',res.content.afterSellDealerOrderId)
            that.setReturnData(res.content)
          }
        })
       },
      setReturnData:function(data){
        let that = this
        that.setGoodsTable(data.goodsInfoBeans, data)
      },
      setGoodsTable:function(goods,totalData){
        let that = this
        that.totalData = totalData;
        that.expressNum = 0;
        that.goodses = goods
        var resIds = '';
        if(that.goodses != undefined){
          that.goodses.forEach(function(val, index) {
            val.freight = val.freight;
            //val.mediaResId='18AD16F1F35C569E4C1785DF22FA47652789';
            if(typeof(val.mediaResId)=='undefined' || val.mediaResId==null ||  val.mediaResId=='')
              ;//val.mediaResId = '-'
            else {
              if (index > 0)
                resIds += ',';
              resIds += '"'+val.mediaResId+'"';
            }
            that.expressNum += val.sellNum;
          });
        }
        that.getMediaResInfo(resIds);
      }
      ,operatingRecord() {
        let that = this
        console.log(that.orderDetail.afterSelldealerOrderId)
        that.api_sellerManagePlatform_getOperatingRecord({data:{
          // token:sessionStorage.getItem('access_token'),
          // isEncry: false,
          orderId:sessionStorage.getItem('afterSellDealerOrderId'),
          rows: that.pageRows,                     // 每页多少条数据
          pageNum: that.currentPage    // 请求第几页*/
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            // 获取订单操作列表
            if (typeof(res.content) == 'string')
              return;
            that.operatingRecords = res.content;
            var uIds = '';
            //that._map = {};
            var ct = 0;
            for (var i=0; i< that.operatingRecords.length; i++) {
              var usId = that.operatingRecords[i].optUser;
              that.operatingRecords[i].optUserStr = '--';
              if (uIds.indexOf(usId) == -1) {
                if (ct>0)
                  uIds +=',';
                ct ++;
                uIds += usId;
              }
            }
            that.totalCount = res.totalCount;
            that.getUserByIds(uIds);
          }
        })
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.operatingRecord();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.operatingRecord();
      }
      ,afterselllogistics() {
        let that = this
        this.api_sellerManagePlatform_getAftreselllogistics({
            data: {
              // token:sessionStorage.getItem('access_token'),
              // isEncry: false,
              afterSellOrderId:sessionStorage.getItem('afterSellDealerOrderId'),
            }
        }).then(result=>{
          if(result==undefined){
              return false
          }else if(result.status == '200'){
            that.logistics=result.content
            if(that.logistics.expressNo!==''&& that.logistics.expressWay!=='1'){
              that.getflage(that.logistics.expressCode,that.logistics.expressNo,1)
            }
            if(that.logistics.backExpressNo!==''){
              that.getflage(that.logistics.backExpressCode,that.logistics.backExpressNo,0)
            }
            console.log(that.logistics)
          }
        })
      }
      ,getUserByIds(ids) {
        let that = this;
        this.api_sellerManagePlatform_getUserInfoByIds({
            data: {
              token: sessionStorage.getItem('access_token'),
              userIds: ids
            }
        }).then(result=>{
          if(result==undefined){
              return false
          }else if(result.status == '200'){
            that._map = {}
            let sz = result.content.length
            for(let i=0; i<sz; i++) {
              let obj = result.content[i]
              that._map[obj.userId] = obj.mobile + '[' + obj.userName + ']'
            }
            for (let i=0; i< that.operatingRecords.length> 0; i++) {
              if (typeof(that._map[that.operatingRecords[i].optUser]) != 'undefined')
                that.operatingRecords[i].optUserStr = that._map[that.operatingRecords[i].optUser]
              else
                that.operatingRecords[i].optUserStr = that.operatingRecords[i].optUser
            }
            console.log(that.orderDetail.afterSelldealerOrderId)
          }
        })
      }
    ,getMediaResInfo(resIds) {
      if (resIds == '') {
        return;
      }
      let that = this;
      this.api_sellerManagePlatform_getMediaResInfo({data: {
          mresIdList: '[' + resIds + ']'
        }}).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status === 200){
          that.mediaResInfos = {};
          for (let i=0; i<result.content.length; i++) {
            let a = {};
            a.name = result.content[i].mresName;
            a.cateName = result.content[i].cateName;
            that.mediaResInfos[result.content[i].mresId] = a;
          }
        }
      })
    }
    },
    mounted () {
      let that = this
      //  if(that.$route.query.from === 's_order_front'){
      // sessionStorage.setItem('afterSale:afterSellOrderId',that.$route.query.afterSellOrderId)
      // }
      that.loadOrderDetail()
    },
    watch: {
      'shipmentForm.expressWay': {
        handler(code, oldCode) {
            let that = this
            that.shipmentForm.expressPerson=''
            that.shipmentForm.phone=''
            that.shipmentForm.expressNo=''
            that.shipmentForm.expressName=''
            that.shipmentForm.expressCode=''
            that.shipmentForm.noted=''
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../static/css/main.sellerManage.css";
table{border-collapse:collapse;}
thead td{color:#333;}
h3{font-weight: normal;}
p,th,td,span{font-size:14px;color:#333;}
.detail_cen a{color:#337ab7;}
.detail_cen a:hover{text-decoration:underline;}
.elRow{padding:25px;
  .el-col{margin-bottom:20px;height:20px;}
}
.borderTop{border-top:1px solid #e7e7e7;
  h3{
    margin-top:15px;
  }
}
.infoBox{width:780px;height:800px;position:absolute;top:50%;left:50%;margin-top:-400px;margin-left:-390px;background:#fff;border-radius:5px;    z-index: 1000;overflow: hidden;
  h4{background:#DFE9F6;width:100%;height:50px;line-height: 50px;text-indent: 1.5em;color:#666;font-size:16px;}
  a.close{display:inline-block;width:50px; height:50px;position:absolute;top:0; right:0;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -294px -326px no-repeat;opacity:1;}
  h6{height:50px;line-height: 50px;text-indent:20px;color:#999;font-size:12px;width:100%;background: #F5F5F5;position:absolute;bottom:0px;}
  ul{width:800px;height:670px;padding:20px 55px 10px;overflow-y:auto;overflow-x:hidden;
    li{float:left;height:75px;width:670px;position: relative;
      p{border-left:1px solid #efefef;padding-left:67px;width:640px;padding-top:20px;line-height:55px;margin-left:50px;color:#999; letter-spacing: 1px;}
      h5{width:100px;height:55px;background:#fff;position:absolute;top:20px;left:0;text-align:center;line-height:22px;padding:5px 0;            span{color:#999;}
        span.fontSamll{font-size:12px;display: block;}
      }
    }
    li:nth-child(1){
      h5 span,p{color:#0086FF;}
      p{border-left:none;}
    }
  }
}
  .tit01{
    display: inline-block;
    width: 90px;
    text-align: right;
  }
.building{
  font-size:20px;color:#666;
  padding:240px 0;
  line-height:40px;
  margin-top:100px;
  text-align: center;
  background:url('../../../../../static/images/sellerManage/image_repair.png') no-repeat center top;
}
.redcolor{
  color: red;
}
.mr20{
  margin-right: 20px;
}
.ml20{
  margin-left: 20px;
}
.mt10{
  margin-top: 10px;
}
.mt20{
  margin-top: 20px;
}
  .wose{
    height:46px;padding-top:5px;
    overflow : hidden;
    width:180px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .blue{
    float: left;
  	font-size: 12px;
		color: #999;
  }

    table td p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        margin-top: 20px;
        td{
          padding-left: 10px;
        }
        .a1_img{
            img{
              width: 50px;
              height: 50px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
          }
        .a1{
          width: 22%;
          .a1tab{
            width: 50px;
            height: 50px;
            img{
              width: 50px;
              height: 50px;
            }
          }
          .a1tit{
            .top{
              width:85%;
              height: 40px;
              line-height: 20px;
              font-size: 14px;
              color: #333333;
            }
            .btm{
              font-size: 12px;
              color: #999999;
            }
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:10%;
          .btm{
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-radius: 2px;
            width: 60px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            color: #333;
            text-align: center;
            cursor: pointer;
          }
        }
        .a7{
          width:7%;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
        tbody{
        	border-bottom: 1px solid #E5E5E5;
        	background: #F4F5FA;
          td{
            padding-bottom: 20px;
          }
        }
      }
  .alink{
    color:#337ab7!important;
 }
</style>
