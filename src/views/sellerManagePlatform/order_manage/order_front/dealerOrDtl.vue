<template>
  <div class="list">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="订货单详情" name="first">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class="elRow">
            <el-row :gutter="20">
              <el-col :span='24'>
                <span class="tit01">订单状态</span>
                <span class="ml20 redcolor" style="font-size: 18px;">{{orderStatus === 0? '待付款': orderStatus === 1? '待发货': orderStatus === 2? '待收货': orderStatus === 3? '已完成': orderStatus === 4? '交易完成': orderStatus===5?'交易关闭': orderStatus=== -1 ? '已取消':'--'}}</span>
              </el-col>
              <el-col :span='6'>
                <span class="tit01">订货号</span>
                <span class="ml20">{{dealerOrderId}}</span>
              </el-col>
              <el-col :span='6'>
                <span class="tit01">下单时间</span>
                <span class="ml20">{{createdDate}}</span>
              </el-col>
              <el-col :span='12'> </el-col>
              <el-col :span='6'>
                <span class="tit01">支付方式</span>
                <span class="ml20">{{payWay === 1 ? '支付宝': payWay === 2 ? '微信': '-'}}</span>
              </el-col>
              <el-col :span='6'>
                <span class="tit01">支付时间</span>
                <span class="ml20">{{payTime == ''?'-':payTime}}</span>
              </el-col>
              <el-col :span='6'>
                <span class="tit01">支付单号</span>
                <span class="ml20">{{payNo == ''?'-':payNo}}</span>
              </el-col>
              <el-col :span='24'>
                <span class="tit01">收货信息</span>
                  <span class="ml20">
                    <span>{{recvAddr}}</span>
                    <!-- <i class="ico_compile" v-show="orderStatus === 0 ? !bModify : bModify" @click="modifyFreight(true)"></i> -->
                  </span>
              </el-col>
              <el-col :span="24">
                <span class="tit01">发票信息</span>
                <span class="ml20">{{invoiceInfo == ''?'-': invoiceInfo}}</span>
              </el-col>
              <el-col :span="24">
                <span class="tit01">买家留言</span>
                <span class="ml20 ">{{noted == ''?'-':noted}}</span>
              </el-col>
            </el-row>
          </div>
            <table class="mt20 detail_table">
              <thead>
                <tr>
                  <td class="a1">商品信息</td>
                  <td class="a2">广告位信息</td>
                  <td class="a3">数量</td>
                  <td class="a4">单位</td>
                  <td class="a5">单价/元</td>
                  <td class="a5">商品金额/元</td>
                  <td class="a6">运费</td>
                  <td class="a7">售后信息</td>
                </tr>
              </thead>
              <tbody id="goodsTabBody" v-for="(goods,index) in goodses">
                <tr>
                  <td class="a1 clear">
                    <div class="a1_img mr10 fl"><img :src="JSON.parse(goods.goodsImage == ''? '[]': goods.goodsImage)[0]" /></div>
                    <div class="wose wid mt10">
                      <i v-if="goods.isChange==1" class="changeGood"></i>
                      {{goods.goodsName}}</div>
                    <div class="blue" v-if="goods.skuName != ''">规格：{{goods.skuName}}</div>
                  </td>
                  <td class="a2">
                    {{typeof(mediaResInfos[goods.mediaResId])!='undefined'?mediaResInfos[goods.mediaResId].name : ''}}<br>{{typeof(mediaResInfos[goods.mediaResId])!='undefined'?mediaResInfos[goods.mediaResId].cateName:''}}
                  <td class="a3">{{goods.sellNum}}</td>
                  <td class="a4">{{goods.unitName}}</td>
                  <td class="a5">
                    <template v-if="goods.isSpecial==1">特惠价 {{(goods.strSpecialPrice)}}</template>
                    <p :class="{'lineThrough':goods.isSpecial==1}">{{goods.isChange==0?(goods.strPrice):(goods.strChangePrice)}}</p>
                    <!-- {{goods.isChange==0?(goods.price):(goods.changePrice)}} -->
                  </td>
                  <td class="a5">{{(goods.strTotalPrice)}}</td>
                  <td class="a6">
                    <span :id="'spanFreight' + index" v-show="!fModify">{{goods.strFreight}}</span>
                    <i class="ico_compile"  v-show="orderStatus === 55 ? !fModify : fModify" @click="modifyFreight1(true)"></i>
                    <!--点击ico_compile后会出现input-->
                    <input class="form-control a6_input" :id="'freight'+ index" v-show="fModify=false" v-model="goods.strFreight" type="number"/>
                  </td>
                  <td class="a7">
                    <span v-if="goods.afterSellOrderId ==''"> --</span>
                    <span v-else class='iconTips'>
                      <!-- <i class ='iconfont icon-ico_hint'></i> -->
                      <a   style='margin-left:20px;color:#337ab7' @click='gotoAfterSales(goods.afterSellOrderId)' target='_blank'>        
                        {{goods.afterOrderType==0?(goods.afterSellStatus==-1?'售后已取消':goods.afterSellStatus==3?'商家已拒绝':goods.afterSellStatus==1?'待商家同意':goods.afterSellStatus==4?'待顾客寄回商品':(goods.afterSellStatus==5||goods.afterSellStatus==6)?'待商家发货':goods.afterSellStatus==7?'待顾客收货':goods.afterSellStatus>=8?'售后已完成':'--'):goods.afterOrderType==1?(goods.afterSellStatus==-1?'售后已取消':goods.afterSellStatus==3?'商家已拒绝':goods.afterSellStatus==0?'待商家同意':goods.afterSellStatus==4?'待顾客寄回商品':(goods.afterSellStatus==5||goods.afterSellStatus==6)?'待商家确认退款':goods.afterSellStatus>=9?'售后已完成':'--'):goods.afterOrderType==2?(goods.afterSellStatus==-1?'售后已取消':goods.afterSellStatus==3?'商家已拒绝':goods.afterSellStatus==2?'待商家同意':goods.afterSellStatus==4?'待商家确认退款':goods.afterSellStatus>=9?'售后已完成':'--'):'--'}}
                      </a>
                    </span>
                  </td>
                </tr>
              </tbody>
              <!-- <tbody class="js_num">
                <tr>
                  <td colspan="5"></td>
                  <td></td>
                  <td>
                    <div>商品总额</div>
                    <div>运费</div>
                    <div>优惠金额</div>
                    <div>订单总额</div>
                  </td>
                  <td class="pr40">
                    <div>{{(totalData.strTotalOrderPrice)}}</div>
                    <div>{{(totalData.strTotalFreight)}}</div>
                    <div>{{(parseFloat(totalData.strPlateformDiscount)+parseFloat(totalData.strDealerDiscount)).toFixed(2)}}</div>
                    <div class="redcolor" style="font-size: 18px;">{{(totalData.orderPrice)}}</div>
                  </td>
                </tr>
              </tbody> -->
              <tbody class="js_num">
                <tr>
                  <td colspan="5"></td>
                  <td colspan="2">
                    <div>商品总额</div>
                    <div>运费</div>
                    <div>满减抵扣/元</div>
                    <div>优惠券抵扣/元</div>
                    <div>订单总额</div>
                  </td>
                  <td class="pr40">
                    <div>{{(totalData.strTotalOrderPrice)}}</div>
                    <div>{{(totalData.strTotalFreight)}}</div>
                    <div>{{(parseFloat(totalData.strPlateformDiscount)+parseFloat(totalData.strDealerDiscount)).toFixed(2)}}</div>
                    <div>{{(totalData.strCouponDiscount)}}</div>
                    <div class="redcolor" style="font-size: 18px;">{{(totalData.orderPrice)}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          <!-- </div> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="发货详情" name="second">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div class="elRow">
            <el-row :gutter="20">
              <el-col :span="24">
                <span class="tit01">订单状态</span>
                <span class="ml20 redcolor" style="font-size: 18px;">{{strOrderStatus}}</span>
              </el-col>
              <el-col :span="24">
                <span class="tit01">订货号</span>
                <span class="ml20">{{dealerOrderId}}</span>
              </el-col>
              <el-col :span="24">
                <span class="tit01">收货信息</span>
                <span class="ml20">{{recvAddr}}</span>
              </el-col>
            </el-row>
          </div>
            <table class="mt20 detail_table">
              <thead>
              <tr>
                <td class="a1">商品信息</td>
                <td class="a2">订货数</td>
                <td class="a3">待发货数</td>
              </tr>
              </thead>
              <tbody id="sendTabBody" v-for="(goods,index) in goodses">
                <tr>
                  <td class="a1 clear">
                    <div class="a1_img mr10 fl"><img :src="JSON.parse(goods.goodsImage == ''? '[]': goods.goodsImage)[0]"/></div>
                    <div class="wose wid mt10">
                      <i v-if="goods.isChange==1" class="changeGood"></i>
                      {{goods.goodsName}}</div>
                    <div class="blue" v-if="goods.skuName != ''">规格：{{goods.skuName}}</div>
                  </td>
                  <td>
                    {{goods.sellNum}}</td>
                  <td>{{orderStatus<2? (goods.sellNum - goods.afNum) : 0}}</td>
                </tr>
              </tbody>
              <tbody class="deliver_tb" v-if="(expressWay==0 && expressNo!='')||(expressWay==1 && expressPhone!='')">
                <tr>
                  <td colspan="3">
                  <div class="mt10 mb10">
                    <span class="mr20 tit_tb">配送方式</span>
                    <span class="ml20">
                      <span>{{orderStatus>=2? (expressWay==0?'物流发货':expressWay==1?'自有物流':'-') :'-'}}
                        <span class="mr20 tit_tbb">{{orderStatus>=2? (expressWay==0?'物流公司':expressWay==1?'配送员':''):''}}</span>
                        <span class="ml20">{{expressWay==0?expressName:expressWay==1?expressPerson+'， '+expressPhone:''}}</span>
                      </span>
                    </span>
                  </div>
                  <div class="mt10 mb10" v-show="expressWay==0 && expressNo!=''">
                    <span class="mr20 tit_tb">物流单号</span>
                    <span class="ml20" v-if="orderStatus<2">--</span>
                    <span class="ml20" v-if="orderStatus>=2">{{expressNo}}
                      <a class="ml20" v-if="!expressLink" @click="getQueryExpress(expressNo)">查看物流跟踪信息</a>
                      <a class="ml20" v-if="expressLink" href="http://www.kuaidi100.com/?from=openv" target="_blank">查看物流跟踪信息</a>
                    </span>
                  </div>
                  <div class="mt10 mb10">
                    <span class="mr20 tit_tb">备注</span>
                    <span class="ml20">
                    <span>{{orderStatus>=2? expressNote:'--'}}</span>
                    </span>
                  </div>
                  </td>
                </tr>
              </tbody>
            </table>
          <!-- </div> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="third">
        <div role="tabpanel" class="tab-pane fade in active" aria-labelledby="home-tab">
          <div>
          <!--<table id="logTable" style="table-layout:fixed"></table>-->
            <div class="ops_red">
              <div class="ops_tabs">

                <el-table
                  :data="operatingRecords"
                  style="width: 100%">
                  <el-table-column
                    prop="optTime"
                    label="操作时间">
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

              <div class="page_pus" style="margin-top: 20px;margin-right: 30px;height: 60px;">
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
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--物流单弹层-->
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
        //goodsMoney: 0,
        //orderFreight: 0,
        is_Success: false,
        activeName: 'first',
        showAfter: false,
        Deliver: false,
        strOrderStatus: '',
        orderStatus: 0,
        dealerOrderId: '',
        createdDate: '',
        payWay: '',
        payNo: '',
        expressPerson:'',
        expressPhone:'',
        payTime: '',
        recvAddr: '',
        invoiceInfo: '',
        noted: '',
        goodses: [],
        totalData: {},
        bModify: false,
        fModify: false,
        // province: '',
        // provinceCode: '',
        // city: '',
        // cityCode: '',
        //area: '',
        //areaCode: '',
        //streetAddr: '',
        //revPerson: '',
        //phone: '',
        strSaleAfterNo: ''
        //,shipments: []
        ,expressNote: ''
        ,expressNo: ''
        ,expressName: ''
        ,expressCode: ''
        ,expressWay: 0
        ,province_all_search: []
        ,city_all_search: []
        // 所有的区(供搜索使用)
        ,area_all_search: []
        , expressNum: 0
        ,pageRows:10
        ,currentPage: 1
        ,totalCount:0
        ,operatingRecords:[]
        ,mediaResInfos : {},
        logisticShow:false, // 物流单弹层
        logisticInfo:[], // 物流信息
        expressLink:false
      }
    },
    watch: {
    },
    methods: {
      // 售后信息跳转到售后详情页面
       gotoAfterSales (afterSellOrderId) {
        sessionStorage.setItem('afterSale:afterSellOrderId',afterSellOrderId)
        this.$router.push({name:'s_order_details'})
      },
      //获取‘查看物流信息’标识
      getflage(com,nu){
        console.log(com,nu)
        let that = this
        this.api_sellerManagePlatform_getQueryExpress({data:{
          com:com,
          nu:nu
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            if(res.content===''){
              that.expressLink = true
            }else{
              return
            }
          }else{
            return
          }
        })
        // $.ajax({
        //   type: 'get',
        //   url: this.base + 'm2c.scm/order/web/expressInfo',
        //   data: {
        //     com:com,
        //     nu:nu
        //   },
        //   success: function (result) {
        //     if (result.status === 200){
        //       if(result.content===''){
        //         that.expressLink = true
        //       }else{
        //         return
        //       }
        //     }
        //     else{
        //       return
        //     }
        //   }
        // });
      },
      //物流单详情
      getQueryExpress(nu){
        let that = this
        // console.log(nu)
        // that.logisticInfo = [{"time":"2017-12-22 11:18:20","ftime":"2017-12-22 11:18:20","context":"[深圳市] 快件离开 [深圳中心]已发往[深圳西乡]"},{"time":"2017-12-22 10:57:24","ftime":"2017-12-22 10:57:24","context":"[深圳市] 快件到达 [深圳中心]"},{"time":"2017-12-22 05:47:17","ftime":"2017-12-22 05:47:17","context":"[东莞市] 快件离开 [东莞中心]已发往[深圳中心]"},{"time":"2017-12-22 05:40:53","ftime":"2017-12-22 05:40:53","context":"[东莞市] 快件到达 [东莞中心]"},{"time":"2017-12-21 23:14:18","ftime":"2017-12-21 23:14:18","context":"[东莞市] 快件离开 [东莞虎门]已发往[深圳中心]"},{"time":"2017-12-21 23:08:03","ftime":"2017-12-21 23:08:03","context":"[东莞市] [东莞虎门]的虎门六部已收件 电话:18033454661"}]
        // if(that.logisticInfo!==''){
        //   for(let i = 0;i<that.logisticInfo.length;i++){
        //     that.logisticInfo[i].time = that.logisticInfo[i].time.split(" ")
        //   }
        // }
        this.api_sellerManagePlatform_getQueryExpress({data:{
          com:that.expressCode,
          nu:nu
        }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.logisticShow = true
            if(res.content.resData === '' || res.content === ''){
                that.logisticInfo = []
            }else{
              that.logisticInfo = JSON.parse(res.content.resData).data
            }
            let obj = {'context':'商家发货','time':that.tool.date.format(new Date(res.content.shipGoodsTime), 'yyyy-MM-dd hh:mm:ss')
            }
            that.logisticInfo.push(obj)
            for(let i = 0;i<that.logisticInfo.length;i++){
              that.logisticInfo[i].time = that.logisticInfo[i].time.split(" ")
            }
            console.log(that.logisticInfo)
          }else{
            that.$message({
              type:'warning',
              message:res.errorMessage
            })
          }
        })
      },
      // tab页切换
      handleTabClick (tab, event) { // tab切换
        let that = this
        if (tab.paneName ==='first') {
          that.getDealerOrderInfo() // 订货单详情
        } else if (tab.paneName === 'second') {
          that.customerfreight()
        } else if (tab.paneName === 'third'){
          that.get_log_info() // 操作列表
        }
      },
      // 获取全部订单信息
      customerfreight () {
        let that = this
        this.api_sellerManagePlatform_getExpressDetail({data: {
            dealerOrderId: that.dealerOrderId
          }}).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            for(let i=0;i<result.content.length;i++){
              if(result.content[i].expressCode!==''&& result.content[i].expressWay!==1){
                that.getflage(result.content[i].expressCode,result.content[i].expressNo)
              }
              if(result.content[i].expressCode!=='' || result.content[i].expressPhone!==''){
                that.expressNote  =result.content[i].expressNote
                that.expressNo    =result.content[i].expressNo
                that.expressName  =result.content[i].expressName
                that.expressWay   =result.content[i].expressWay
                that.expressPerson=result.content[i].expressPerson
                that.expressPhone =result.content[i].expressPhone
                that.expressCode  =result.content[i].expressCode
                return
              }
              //return
            }
          }
        })
      },
      //列表
      getDealerOrderInfo () {
        let that = this;
        let a = {
         // dealerId: JSON.parse(sessionStorage.getItem('mUser')).dealerId,
          //condition: that.search_params.condition.replace(/\s+/g,""),
          rows: that.pageSize,                     // 每页多少条数据
          pageNum: that.pageIndex,    // 请求第几页
        }
        this.api_sellerManagePlatform_getDealerOrderInfo({data: {
            orderNo: that.$route.query.orderId,
            dealerOrderId: that.dealerOrderId
          }}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status === 200){
            that.setReturnData(res.content);
          }
        })
      },

      setReturnData: function (data) {
        let that = this;
          //that.goodsMoney = data.orderPrice;
          //that.orderFreight = data.orderFreight;
          that.orderStatus = data.orderStatus;
          that.strOrderStatus = data.orderStatus === 0? '待付款': data.orderStatus === 1? '待发货': data.orderStatus === 2? '待收货': data.orderStatus === 3? '已完成': data.orderStatus === 4? '交易完成': data.orderStatus === 5? '交易关闭' : data.orderStatus === -1? '已取消' : '--';
          that.dealerOrderId = that.$route.query.dealerOrderId;
          let d = new Date(data.createdDate);
          that.createdDate = that.tool.date.format(d, 'yyyy-MM-dd hh:mm:ss');
          that.payWay = data.payWay;
          that.payNo = data.payNo;
          // that.provinceCode = data.privinceCode;
          // that.cityCode = data.cityCode;
          // that.areaCode = data.areaCode;
          if (data.payDate != null) {
            d = new Date(data.payDate)
            that.payTime = that.tool.date.format(d, 'yyyy-MM-dd hh:mm:ss');
          }
          // that.city = data.city;
          // that.cityCode = data.cityCode;
          // that.province = data.province;
        // that.area = data.areaCounty;
        // that.areaCode = data.areaCode;
        //that.phone = data.revPhone;
        //that.revPerson = data.revPerson;
        //that.streetAddr = data.streetAddr;
          that.recvAddr = data.province + data.city + data.areaCounty + data.streetAddr + " " + data.revPerson + " " + data.revPhone;
          if (data.invoiceType != -1) {
            if (data.invoiceType==1)
              that.invoiceInfo = "发票抬头：" + data.invoiceHeader + " 纳税人标识：" + data.invoiceCode + "发票内容：明细"; //data.invoiceName +
            else if (data.invoiceType==0)
              that.invoiceInfo = "发票抬头：" + data.invoiceHeader + "发票内容：明细"; //data.invoiceName;
          }
          that.noted = data.noted;

          that.setGoodsTable(data.goodsInfoBeans, data);
      },
      setGoodsTable: function (goodses, totalData) {
        let that = this;
        that.goodses = goodses;
        that.totalData = totalData;
        that.expressNum = 0;
        let resIds = '';
        that.goodses.forEach(function(val, index) {
          val.freight = val.freight;
          if(typeof(val.mediaResId)=='undefined' || val.mediaResId==null ||  val.mediaResId=='' || val.mediaResId=='-')
            ;
          else {
            if (index > 0)
              resIds += ',';
            resIds += '"'+val.mediaResId+'"';
          }
          that.expressNum +=(val.sellNum - val.afNum);
        });
        that.getMediaResInfo(resIds);
      },
      get_log_info () {
        let that = this
        that.is_Success = false;
        this.api_sellerManagePlatform_getOrderLogs({
            data: {
              orderId: that.$route.query.orderId,
              rows: that.pageRows,                     // 每页多少条数据
              pageNum: that.currentPage,    // 请求第几页*/
            },
            pathParams:'/' + that.dealerOrderId
        }).then(result=>{
          if(result==undefined){
              return false
          }else if(result.status == '200'){
            if (typeof(result.content) == 'string')
              return
            that.operatingRecords = result.content
            for(let i=0;i<that.operatingRecords.length;i++){
              let d = new Date(that.operatingRecords[i].optTime)
              that.operatingRecords[i].optTime = this.tool.date.format(d, 'yyyy-MM-dd hh:mm')
            }
            that.totalCount = result.totalCount
            let uIds = ''
            let ct = 0
            for (let i=0; i< that.operatingRecords.length; i++) {
              let usId = that.operatingRecords[i].optUser
              that.operatingRecords[i].optUserStr = '--'
              if (uIds.indexOf(usId) == -1) {
                if (ct>0)
                  uIds +=','
                ct ++
                uIds += usId
              }
            }
            that.totalCount = result.totalCount;
            if (uIds != '')
            that.getUserByIds(uIds)
          }
        })
      },
      getUserByIds(ids) {
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
          }
        })
      }
      ,handleSizeChange(val) {
        let that = this
        that.pageRows=val
        that.get_log_info();
      }
      ,handleCurrentChange(val) {
        let that = this
        that.currentPage=val
        that.get_log_info();
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
            for (let i=0; i<res.content.length; i++) {
              let a = {};
              a.name = res.content[i].mresName;
              a.cateName = res.content[i].cateName;
              that.mediaResInfos[res.content[i].mresId] = a;
            }
          }
        })
      }
    }
  ,
    mounted () {
      let that = this
      that.dealerOrderId = that.$route.query.dealerOrderId
      this.getDealerOrderInfo();
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../static/css/main.sellerManage.css";
.iconTips{
    text-indent: 2em;
    width: 16px;
    height: 16px;
    zoom:0.85;
    background: url(../../../../../static/images/sellerManage/ico_hint_hint.png) 0 0 no-repeat;
  }
table{border-collapse:collapse;}
thead td{color:#333;}
p,th,td,span{font-size:14px;color:#333;}
td{font-size:14px;color:#666;}
a.ml20{color:#337ab7;}
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
.mt20{
  margin-top: 20px;
}
.redcolor{
  color: red;
}
.ml20{
  margin-left: 20px;
}
.mt20{
  margin-top: 20px;
}
.pad0{
	padding:0px;
}
.elRow{padding:25px;
  .el-col{margin-bottom:20px;height:20px;}
}
  .tit01{
    display: inline-block;
    width: 90px;
    text-align: right;
  }

      .detail_table{
        margin: auto;
        border: 1px solid #e7e7e7;
        width: 99%;
        margin-top: 20px;
        .fh{
    		background: #fff;
    	 }
       .deliver_tb{
         background: #fff;
         .tit_tb{
           display: inline-block;
           width: 80px;
           text-align: right;
           color: #666666;
         }
         .tit_tbb{
           display: inline-block;
           margin-left: 150px;
           width: 80px;
           text-align: right;
           color: #666666;
         }
       }
        td{
          padding-left: 20px;
          p.lineThrough{text-decoration:line-through;font-size:12px;color:#999;}
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
          	padding-left: 50px;
          }
        }
        .a2{
          width:11%;
        }
        .a3{
          width:7%;
        }
        .a4{
          width:7.5%;
        }
        .a5{
          width:8%;
        }
        .a6{
          width:6%;
        }
        .a7{
          width:7%;
        }
        .a6_input{
        	border: 1px solid #E6E8F2;
        	width: 100px;
        	height: 40px;
        }
        thead{
          background: #DFE9F6;
          line-height: 40px;
          height: 40px;
        }
        tbody{
        	border-bottom: 1px solid #E5E5E5;
        	background: #F4F5FA;
        }
        .js_num{
        	background: #fff;
        	padding-top: 20px;
        	padding-bottom: 20px;
        	td{
        		padding-top: 20px;
        		padding-bottom: 20px;
        		line-height: 30px;
        		text-align: right;
        	}
        }
      .detail_tit{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FFF9EE;
        font-size: 18px;
        color: #F5A623;
      }
      .detail_tit02{
        height: 60px;
        width: 99%;
        line-height: 60px;
        margin-left: 10px;
        padding-left: 20px;
        background: #FBF5EF;
        font-size: 18px;
        color: #FD3242;
      }
          
          .bj_select{
          	width: 120px;
          	height: 40px;
          	line-height: 40px;
          option{
          	height: 40px;
          	line-height: 40px;
          }
          }
          .bj02_select{
          	width: 350px;
          	height: 40px;
          	line-height: 40px;
          }
        }
    .ico_compile{
     	width: 16px;
      height: 16px;
      //background: url(../../../assets/images/ico_compile.png);
      display: inline-block;
      margin-left: 10px;
    }

 /*公用样式*/
  .mt5{
    margin-top: 5px;
  }
  .mt10{
    margin-top: 10px;
  }
  .ml10{
    margin-left: 10px;
  }
  .ml20{
    margin-left: 20px;
  }
  .mr20{
    margin-right: 20px;
  }
  .pr20{
  	padding-right: 20px;
  }
  .pr40{
  	padding-right: 40px;
  }
  .mr10{
    margin-right: 10px;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .ml30{
    margin-left: 30px;
  }
  .poi1{
    position: relative;
  }
  .poi2{
    position: absolute;
  }
  .poi3{
    position: fixed;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .wose{
    height:46px;padding-top:5px;
    overflow : hidden;
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
  .clear{
    clear: both;
    overflow: hidden;
  }
  .border_r{
    border-right: 1px solid #e5e5e5;
  }
  .input_check {
    position: absolute;
    width: 17px;
    height: 17px;
    visibility: hidden;
  }
  .input_check + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    border-radius: 2px;
    //background:url(../../../assets/images/ico_radio_default.png) no-repeat center;
  }
  .input_check:checked + label {
    display: inline-block;
    width: 17px;
    height: 17px;
    //background:url(../../../assets/images/ico_radio_select.png) no-repeat center;
  }

</style>
