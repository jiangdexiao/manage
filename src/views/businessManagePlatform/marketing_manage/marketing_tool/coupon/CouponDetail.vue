<template>
  <div class="Detailcoupons_container">
      <el-col :span="24" class="toolbar">
        <div class="Detailcoupons_nav">
        	<span><a class="g_active">优惠券信息</a></span>
        </div>
        <!--设置信息-->
        <div class="set_message">
        	<div class="mb30">
        		<div class="ml20"><b>基础信息</b></div>
        		<div class="mt10">
              <span>
                <span class="ml20 mr20 wid80">优惠券名称</span>
                <span class="wid250">{{couponInfo.couponName}}</span>
              </span>
              <span class="ml75">
                <span class="ml20 mr20 wid80">优惠券类型</span>
                <span v-if="couponInfo.couponType == 1">代金券</span>
                <span v-if="couponInfo.couponType == 2">折扣券</span>
                <span v-if="couponInfo.couponType == 3">分享券</span>
              </span>
            </div>
        		<div class="mt10">
              <span>
                <span class="ml20 mr20 wid80">面值</span>
                <span class="wid250" v-if="couponInfo.couponForm == 1">{{couponInfo.couponItem.faceValue}}元</span>
                <span class="wid250" v-if="couponInfo.couponForm == 2">{{couponInfo.couponItem.faceValue}}折</span>
        		  </span>
        		  <span class="ml75">
                <span>
                  <span class="ml20 mr20 wid80">发行量</span>
                  <span v-if="couponInfo.couponTotal > 0">{{couponInfo.couponTotal}}张</span>
                  <span v-if="couponInfo.couponTotal == 0">无限制</span>
                </span>
                <span class="ml20">
                  <el-button v-if="couponInfo.canPush" type="primary" size="medium" @click="remind()">提醒使用</el-button>
                </span>
                <i class="icon-intro02" v-popover:popover1 v-if="couponInfo.canPush">
                  <el-popover
                    ref="popover1"
                    placement="top-start"
                    width="300"
                    trigger="hover">
                    <p class="pad5 fs12">仅在还剩余优惠券，未被使用且距离生成优惠券7天之后，可发送推送</p>
                  </el-popover>
                </i>
                <span>
                  <span class="mr10 ml20 wid80">总共发出</span>
                  <span class="bluecolor02">{{couponInfo.sendNum}}</span>
                  <span>张</span>
                </span>
                <span>
                  <span class="mr10 ml20 wid80">已被使用</span>
                  <span class="bluecolor02">{{couponInfo.usedNum}}</span>
                  <span>张</span>
                </span>
                <span>
                  <span class="mr10 ml20 wid80">还剩余</span>
                  <span class="bluecolor02" v-if="couponInfo.couponTotal > 0">{{couponInfo.couponRemain}}</span>
                  <span class="bluecolor02" v-if="couponInfo.couponTotal == 0">无限制</span>
                  <span>张</span>
                </span>
              </span>
            </div>
            <div class="mt10">
        			<span class="ml20 mr20 wid80">
        				有效期
        			</span>
              <span class="wid250">{{couponInfo.expirtationTimeStart}}~{{couponInfo.expirtationTimeEnd}}</span>
            </div>
        		<div class="mt10" v-if="couponInfo.couponType == 3">
        			<span class="ml20 mr20 wid80">
        				领取地址
        			</span>
        			<span class="mr10">{{couponInfo.shareUrl}}/{{couponInfo.couponId}}</span>
        			<el-button class="mr10 btn" type="primary" size="medium" @click="doCopy()">复制地址</el-button>
              <button class="copyBtn noshow" ref="copyBtn" :data-clipboard-text = "couponInfo.shareUrl + '/' + couponInfo.couponId" type="text"></button>
        			<span class="greycolor">该地址不能用于运营管理各模块的跳转设置</span>
        		</div>
        	</div>
        	<div class="mb30">
        		<div class="ml20"><b>条件设置</b></div>
        		<div class="mt10">
        			<span class="ml20 mr20 wid80">
        				使用门槛
        			</span>
        			<span v-if="couponInfo.thresholdType == 1">满{{couponInfo.couponItem.threshold}}元可使用该优惠券</span>
              <span v-if="couponInfo.thresholdType == 2">满{{couponInfo.couponItem.threshold}}件可使用该优惠券</span>
              <span v-if="couponInfo.thresholdType == 3">全场通用</span>
        		</div>
        		<div class="mt10">
        			<span class="ml20 mr20 wid80">
        				作用范围
        			</span>
        			<span v-if="couponInfo.rangeType == 0">全场</span>
              <span v-if="couponInfo.rangeType == 1">店铺</span>
              <span v-if="couponInfo.rangeType == 2">商品</span>
              <span v-if="couponInfo.rangeType == 3">品类</span>
        		</div>
        		<div class="mt10">
        			<div class="Alreadychosen" v-if="couponInfo.rangeType == 0">
                <div class="Alreadychosen_t">
                  已排除<span class="bluecolor02">{{removeGoodsList.length}}</span>件商品
                </div>
                <div class="Alreadychosen_c overflowy">
                  <!-- 没有选择任何商品的时候 -->
                  <div class="Alreadychosen_c_none" v-if="removeGoodsList.length == 0">
                    还没有排除任何商品哦
                  </div>
                  <!-- 选择商品的时候 -->
                  <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0 && remove_goods_all_show == false">
                    <div v-for="(goods,index) in removeGoodsList" v-if="index < 10">
                      <el-tooltip :content="goods.goodsName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="goods.goodsImageUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = true">
                      <div>展开全部</div>
                      <div><i class="icon_open"></i></div>
                    </div>
                  </div>
                  <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0 && remove_goods_all_show == true">
                    <div v-for="goods in removeGoodsList">
                      <el-tooltip :content="goods.goodsName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="goods.goodsImageUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = false">
                      <div>收起全部</div>
                      <div><i class="icon_open02"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Alreadychosen" v-if="couponInfo.rangeType == 0 && couponInfo.creatorType == 1">
                <div class="Alreadychosen_t">
                  已排除<span class="bluecolor02">{{removeShopList.length}}</span>个品铺
                </div>
                <div class="Alreadychosen_c overflowy">
                  <!-- 没有选择任何店铺的时候 -->
                  <div class="Alreadychosen_c_none" v-if="removeShopList.length == 0">
                    还没有排除任何店铺哦
                  </div>
                  <!-- 选择商品的时候 -->
                  <div class="Alreadychosen_c_have" v-if="removeShopList.length > 0 && remove_shop_all_show == false">
                    <div v-for="(shop,index) in removeShopList" v-if="index < 10">
                      <el-tooltip :content="shop.shopName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="shop.shopIcon"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当店铺超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="removeShopList.length > 10" @click="remove_shop_all_show = true">
                      <div>展开全部</div>
                      <div><i class="icon_open"></i></div>
                    </div>
                  </div>
                  <div class="Alreadychosen_c_have" v-if="removeShopList.length > 0 && remove_shop_all_show == true">
                    <div v-for="shop in removeShopList">
                      <el-tooltip :content="shop.shopName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="shop.shopIcon"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <div class="img02 fl poi1" v-if="removeShopList.length > 10" @click="remove_shop_all_show = false">
                      <div>收起全部</div>
                      <div><i class="icon_open02"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Alreadychosen" v-if="couponInfo.rangeType == 1">
                <div class="Alreadychosen_t">
                  已选<span class="bluecolor02">{{couponInfo.suitableRangeList == null ? 0 : couponInfo.suitableRangeList.length}}</span>个店铺
                </div>
                <div class="Alreadychosen_c overflowy">
                  <!-- 没有选择任何店铺的时候 -->
                  <div class="Alreadychosen_c_none" v-if="couponInfo.suitableRangeList == null || couponInfo.suitableRangeList.length == 0">
                    还没有选择任何店铺哦
                  </div>
                  <!-- 选择店铺的时候 -->
                  <div class="Alreadychosen_c_have" v-if="couponInfo.suitableRangeList != null && couponInfo.suitableRangeList.length > 0 && shop_all_show == false">
                    <div v-for="(shop,index) in couponInfo.suitableRangeList" v-if="index < 10">
                      <el-tooltip :content="shop.entityName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="shop.dealerPicUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当店铺超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="couponInfo.suitableRangeList.length > 10" @click="shop_all_show = true">
                      <div>展开全部</div>
                      <div><i class="icon_open"></i></div>
                    </div>
                  </div>
                  <div class="Alreadychosen_c_have" v-if="couponInfo.suitableRangeList != null && couponInfo.suitableRangeList.length > 0 && shop_all_show == true">
                    <div v-for="shop in couponInfo.suitableRangeList">
                      <el-tooltip :content="shop.entityName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="shop.dealerPicUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <div class="img02 fl poi1" v-if="couponInfo.suitableRangeList.length > 10" @click="shop_all_show = false">
                      <div>收起全部</div>
                      <div><i class="icon_open02"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Alreadychosen" v-if="couponInfo.rangeType == 2">
                <div class="Alreadychosen_t">
                  已选<span class="bluecolor02">{{couponInfo.suitableRangeList == null ? 0 : couponInfo.suitableRangeList.length}}</span>件商品
                </div>
                <div class="Alreadychosen_c overflowy">
                  <!-- 没有选择任何商品的时候 -->
                  <div class="Alreadychosen_c_none" v-if="couponInfo.suitableRangeList == null || couponInfo.suitableRangeList.length == 0">
                    还没有选择任何商品哦
                  </div>
                  <!-- 选择商品的时候 -->
                  <div class="Alreadychosen_c_have" v-if="couponInfo.suitableRangeList != null && couponInfo.suitableRangeList.length > 0 && goods_all_show == false">
                    <div v-for="(goods,index) in couponInfo.suitableRangeList" v-if="index < 10">
                      <el-tooltip :content="goods.entityName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="goods.goodsPicUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="couponInfo.suitableRangeList.length > 10" @click="goods_all_show = true">
                      <div>展开全部</div>
                      <div><i class="icon_open"></i></div>
                    </div>
                  </div>
                  <div class="Alreadychosen_c_have" v-if="couponInfo.suitableRangeList != null && couponInfo.suitableRangeList.length > 0 && goods_all_show == true">
                    <div v-for="goods in couponInfo.suitableRangeList">
                      <el-tooltip :content="goods.entityName" placement="top-start" effect="light">
                        <div class="img fl poi1 mb10">
                          <img :src="goods.goodsPicUrl"/>
                        </div>
                      </el-tooltip>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="couponInfo.suitableRangeList.length > 10" @click="goods_all_show = false">
                      <div>收起全部</div>
                      <div><i class="icon_open02"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="Alreadychosen h250" v-if="couponInfo.rangeType == 3">
                <div class="Alreadychosen_t">
                  已选 <span class="bluecolor02">{{showClassifyList.length}}</span> 个品类
                </div>
                <div class="Alreadychosen_c overflowy h215">
                  <el-tree
                    :data="classifyList"
                    :props="defaultProps"
                    :default-checked-keys="rangeClassifyList"
                    node-key="classifyId"
                    ref="classifyTree"
                    show-checkbox
                    default-expand-all
                    highlight-current
                    @check-change="getCheckedNodes">
                  </el-tree>
                </div>
              </div>
        		</div>
        	</div>
        	<div class="mb30">
        		<span class="ml20 mr20"><b>领取方式</b></span>
        		<span class="ml15">{{couponInfo.receiveType == 1 ? '用户主动领取' : couponInfo.receiveType == 2 ? '后台派发' : couponInfo.receiveType == 3 ? '活动专用' : ''}}</span>
        	</div>
        	<div class="mb30">
        		<div class="ml20"><b>成本控制</b></div>
        		<div class="mt10" v-if="couponInfo.receiveType == 1 && (couponInfo.couponType == 1 || couponInfo.couponType == 2)">
              <span class="ml20 mr20 wid80">领取限制</span>
        			<span class="mr10">每人限领</span><span class="mr10 bluecolor02">{{couponInfo.numPerOne}}</span><span>次</span>
              <span class="mr10" v-if="couponInfo.numPerOne">每人每天限领</span><span class="mr10 bluecolor02">{{couponInfo.numPerDay}}</span><span>次</span>
        		</div>
        		<div class="mt10 clear02 mb30 clear02" v-if="couponInfo.creatorType == 1">
                <span class="mr15 wid80 mb30 fl">
                  营销成本<br/>分摊
                  <el-tooltip placement="top-start" effect="light">
                    <div slot="content">
                      1.商家承担默认为该优惠券作用范围下的商家
                      <br/> 2.平台及商家均可以设置为0，但两个值相加不能超过100；只能输入整数
                      <br/> 3.如需针对其中的商家单独成本设置，可以点击下方的单独成本设置
                      <br/>
                    </div>
                    <i class="icon-intro02" style="margin-top: initial;"></i>
                  </el-tooltip>
                </span>
                <div class="mt10">
                <span>平台承担:</span><span class="bluecolor02">{{costAll.platform}}</span><span>%</span>
                <span class="ml10">商家承担:</span><span class="bluecolor02">{{costAll.dealer}}</span><span>%</span>
                </div>
        			<div class="Alreadychosenshop">
                <div class="Alreadychosenshop_t">
                  已单独设置<span class="bluecolor02">{{couponInfo.conponCostItemsList == null ? 0 : couponInfo.conponCostItemsList.length - 1}}</span>个店铺
                </div>
                <div class="Alreadychosenshop_c">
                  <!--没有设置店铺情况 -->
                  <div class="Alreadychosenshop_c_none" v-if="couponInfo.conponCostItemsList == null || couponInfo.conponCostItemsList.length <= 1">
                    还没有单独设置任何商家哦
                  </div>
                  <!--设置店铺情况 -->
                  <div class="Alreadychosenshop_c_have clear02" v-if="couponInfo.conponCostItemsList != null && couponInfo.conponCostItemsList.length > 1">
                    <div class="Alreadychosenshop_box fl" v-for="cost in couponInfo.conponCostItemsList" v-if="cost.dealerId != 'ALL'">
                      <div class="Alreadychosenshop_box_t fl">
                        <div class="tit04 wose">{{cost.dealerName}}</div>
                        <div class="tit05">平台承担：{{cost.platformPercent}}%，店铺承担：{{cost.dealerPercent}}%</div>
                      </div>
                    </div>
                  </div>
                </div>
            	</div>
        		</div>
            <span class="ml20 mr20" v-if="couponInfo.receiveType == 1 || couponInfo.receiveType == 2"><b>其他规则</b></span>
            <span class="ml15" v-if="(couponInfo.receiveType == 1 || couponInfo.receiveType == 2) && couponInfo.withOtherCut == 1">可与其他营销活动共同使用</span>
            <span class="ml15" v-if="(couponInfo.receiveType == 1 || couponInfo.receiveType == 2) && couponInfo.withOtherCut == 0">不可与其他营销活动共同使用</span>
        	</div>
          <div class="mb30 marauto w100">
            <el-button type="primary" size="medium" @click="back()">返回</el-button>
          </div>
        </div>
      </el-col>
  </div>
</template>

<script>
import Clipboard from '../../../../../../static/js/clipboard.min.js'
let clipboard = new Clipboard('.copyBtn')
export default {
  data () {
    return {
      goods_all_show: false,
      shop_all_show: false,
      remove_goods_all_show: false,
      remove_shop_all_show: false,
      couponInfo: '',
      costAll: {platform: '', dealer: ''},
      removeGoodsList: [],
      removeShopList: [],
      rangeClassifyList: [],
      classifyList: [],
      showClassifyList: [],
      defaultProps: {
        children: 'subClassify',
        label: 'classifyName',
        disabled: 'disabled'
      }
    }
  },
  methods: {
    doCopy () {
      let _this = this
      _this.$refs.copyBtn.click()
      _this.$message({
        message: '复制成功！',
        type: 'success'
      })
    },
    // 品类搜索
    classifySelect (parentClassifyId) {
      let _this = this
      _this.api_businessManagePlatform_goodsClassifyTree({
        data: {
          parentClassifyId: parentClassifyId
        }
      }).then(result => {
        _this.classifyList = result.content
        for (let a = 0; a < _this.classifyList.length; a++) {
          _this.classifyList[a].disabled = true
          if (_this.classifyList[a].subClassify != null && _this.classifyList[a].subClassify.length > 0) {
            for (let b = 0; b < _this.classifyList[a].subClassify.length; b++) {
              _this.classifyList[a].subClassify[b].disabled = true
              if (_this.classifyList[a].subClassify[b].subClassify != null && _this.classifyList[a].subClassify[b].subClassify.length > 0) {
                for (let c = 0; c < _this.classifyList[a].subClassify[b].subClassify.length; c++) {
                  _this.classifyList[a].subClassify[b].subClassify[c].disabled = true
                }
              }
            }
          }
        }
      })
    },
    // 获取已选择的品类
    getCheckedNodes (data, checked, indeterminate) {
      let _this = this
      let nodes = _this.$refs.classifyTree.getCheckedNodes()
      let ids = _this.$refs.classifyTree.getCheckedKeys()
      _this.showClassifyList = []
      for (let i = 0; i < nodes.length; i++) {
        let classify = {}
        classify.classifyId = nodes[i].classifyId
        classify.classifyName = nodes[i].classifyName
        if (ids.indexOf(nodes[i].parentClassifyId) === -1) { // 不包含该节点父节点
          _this.showClassifyList.push(classify)
        }
      }
    },
    back () {
      let _this = this
      _this.$router.push({path: '/m/marketTool/couponList'})
    },
    remind () {
      let _this = this
      _this.api_businessManagePlatform_remindMessage({
        data: {
          user_id: JSON.parse(sessionStorage.getItem('userInfo')).userId,
          coupon_id: sessionStorage.getItem('coupon_id')
        }
      }).then(result => {
        console.log('result:', JSON.stringify(result.content))
        _this.$message({
          message: '消息提醒成功，已成功提醒' + result.content.pushNum + '位用户！',
          type: 'success'
        })
      })
    },
    // 验证提示
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
    }
  },
  created () {
    let _this = this
    _this.classifySelect('-1')
    _this.api_businessManagePlatform_couponDetail({
      pathParams: `/${sessionStorage.getItem('coupon_id')}`
    }).then(result => {
      console.log('优惠券详情:', result.content)
      _this.couponInfo = result.content
      let sendTime = new Date(_this.couponInfo.expirtationTimeStart.replace(/-/g, '/')).getTime() + 7 * 24 * 60 * 60 * 1000
      if (parseInt(_this.couponInfo.sendNum) - parseInt(_this.couponInfo.usedNum) > 0 && new Date().getTime() >= sendTime) {
        _this.couponInfo.canPush = true
      }
      if (_this.couponInfo.rangeType === 0) {
        for (let i = 0; i < _this.couponInfo.removeRangeList.length; i++) {
          if (_this.couponInfo.removeRangeList[i].dealerId != null && _this.couponInfo.removeRangeList[i].dealerId !== '') {
            let removeShop = {}
            removeShop.dealerId = _this.couponInfo.removeRangeList[i].dealerId
            removeShop.shopName = _this.couponInfo.removeRangeList[i].entityName
            removeShop.shopIcon = _this.couponInfo.removeRangeList[i].dealerPicUrl
            _this.removeShopList.push(removeShop)
          }
          if (_this.couponInfo.removeRangeList[i].goodsId != null && _this.couponInfo.removeRangeList[i].goodsId !== '') {
            let removeGoods = {}
            removeGoods.goodsId = _this.couponInfo.removeRangeList[i].goodsId
            removeGoods.goodsName = _this.couponInfo.removeRangeList[i].entityName
            removeGoods.goodsImageUrl = _this.couponInfo.removeRangeList[i].goodsPicUrl
            _this.removeGoodsList.push(removeGoods)
          }
        }
        console.log('removeShopList:', JSON.stringify(_this.removeShopList))
        console.log('removeGoodsList:', JSON.stringify(_this.removeGoodsList))
      }
      if (_this.couponInfo.rangeType === 3) {
        for (let i = 0; i < _this.couponInfo.suitableRangeList.length; i++) {
          _this.rangeClassifyList.push(_this.couponInfo.suitableRangeList[i].categoryId)
        }

        setTimeout(() => {
          _this.getCheckedNodes()
        }, 1000)
        console.log('rangeClassifyList:', JSON.stringify(_this.rangeClassifyList))
      }
      for (let i = 0; i < _this.couponInfo.conponCostItemsList.length; i++) {
        if (_this.couponInfo.conponCostItemsList[i].dealerId === 'ALL') {
          _this.costAll.platform = _this.couponInfo.conponCostItemsList[i].platformPercent
          _this.costAll.dealer = _this.couponInfo.conponCostItemsList[i].dealerPercent
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .ml15{
    margin-left: 15px;
  }
.ml20 {
  margin-left: 20px;
}
.mr20{
	margin-right: 20px;
}
.Detailcoupons_container{
	padding: 15px 26px;
	.Detailcoupons_nav{
		background: #FFFFFF;
		/*width: 100%;*/
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		color: #666666;
		padding-left:20px;
		border:1px solid #EDF0F7;
		span{
			width: 95px;
			display: inline-block;
			height: 100%;
			line-height: 40px;
			text-align: center;
		}
		a{
			color:  #666666;
			text-decoration:none ;
			display: inline-block;
			line-height: 34px;
		}
		.g_active{
			border-bottom: 2px solid #0086FF;
		}
	}
	.Cancellationinformation{
		.Cancellationin{
			min-height: 550px;
			background: #FFFFFF;
			padding: 10px;
		}
		.Cancellationin02{
			background: #FFFFFF;
			padding: 10px;

		}
	}
	.img02{
    		width: 60px;
    		height: 45px;
    		border: 1px solid #E6E8F2;
    		font-size:12px;
				font-family:PingFangSC-Regular;
				color:rgba(0,134,255,1);
				text-align: center;
				padding-top: 15px;
				cursor: pointer;
    	}
   .icon_open{
				width: 15px;
				height: 7px;
				display: inline-block;
				background: url(../../../../../../static/images/businessManage/icon_open.png) no-repeat center;
		}
  .icon_open02{
    width: 15px;
    height: 7px;
    display: inline-block;
    background: url(../../../../../../static/images/businessManage/icon_open02.png) no-repeat center;
  }
	.Alreadychosen{
      margin-top: 10px;
      border:1px solid #E6E8F2;
      border-radius: 3px;
      margin-left: 124px;
      height: 115px;
      .Alreadychosen_t{
       	background:#F5F5F5 ;
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #E6E8F2;
        padding-left: 20px;
        color: #878787;
        font-size: 14px;
        .bluecolor{
          color: #006FFF;
        }
      }
      .Alreadychosen_c{
        height: 83px;
        padding-top: 10px;
				padding-left: 10px;
        .Alreadychosen_c_none{
          line-height: 83px;
          color: #ccc;
          font-size: 14px;
        }
        .Alreadychosen_c_have{
        	width: 100%;
        	height: 100%;
        .Alreadychosen_c_h_shop{
      		width: 200px;
      		height: 28px;
      		line-height: 28px;
      		font-size: 12px;
      		padding-left: 5px;
      		background: #F5F5F5;
      		margin-right: 10px;
      		margin-bottom: 10px;
      	}
      	.allshop{
      		width:80px;
					height:28px;
					line-height: 28px;
					background:rgba(245,245,245,1);
					border-radius: 2px ;
					color: #0086FF;
					font-size: 12px;
					text-align: center;
					cursor: pointer;
					.icon_open{
						width: 15px;
						height: 7px;
						display: inline-block;
						background: url(../../../../../../static/images/businessManage/icon_open.png) no-repeat center;
					}
      	}
        	.img{
        		width: 60px;
        		height: 60px;
        		margin-right:10px;
        		img{
        			width: 60px;
        			height: 60px;
        			margin-right: 10px;
        			cursor: pointer;
        		}
        	}
        	.img:hover .del_info{
        		display: block;
        	}
        	.img:hover .alt1{
        		display: block;
        	}
        	/*.alt1{
        		right: -10px;
        		top: -20px;
        		padding-left: 5px;
        		padding-right: 5px;
        		border: 1px solid #979797;
        		color:#979797;
        		line-height: 20px;
        		font-size: 12px;
        		display: none;
        	}*/
        	.del_info{
        		width: 58px;
        		display: none;
        		height: 14px;
        		line-height: 14px;
        		font-size: 10px;
        		color: #F5BD23;
        		text-align: center;
        		bottom: 1px;
        		left: 1px;
        		background: #fff;
        		border-top:1px solid #E5E5E5;
        		cursor: pointer;
        	}
        }
      }
    }
	.set_message{
		padding: 30px;
		background: #FFFFFF;
	}
	.Alreadychosenshop{
    	margin-top: 10px;
      border:1px solid #E6E8F2;
      border-radius: 3px;
      margin-left: 124px;
      height: 220px;
      .Alreadychosenshop_t{
        width: 100%;
        height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #E6E8F2;
        padding-left: 20px;
        color: #878787;
        font-size: 14px;
        background:#F5F5F5;
        .bluecolor{
          color: #006FFF;
        }
      }
      .Alreadychosenshop_c{
        height: 168px;
        text-align: center;
        padding: 10px;
        .Alreadychosenshop_c_none{
          line-height: 168px;
          color: #ccc;
          font-size: 14px;
        }
        .Alreadychosenshop_c_have{
        	height: 168px;
        	overflow-y: auto;
        	.Alreadychosenshop_box{
        		width: 395px;
        		/*height: 50px;*/
        		padding: 10px;
        		border: 1px solid #F5F5F5;
						background:rgba(245,245,245,1);
						border-radius: 2px;
						text-align: left;
						margin-right: 10px;
        		.Alreadychosenshop_box_t{
        			font-size: 12px;
        			width: 80%;
        			.tit04{
        				color: #000000;
        			}
        			.tit05{
        				color: #777777;
        			}
        		}
        		.icon_delet02{
        			width: 16px;
        			height: 20px;
        			display: inline-block;
        			background: url(../../../../../../static/images/businessManage/icon_delet02.png) no-repeat center;
        			margin-top: 10px;
        			cursor: pointer;
        		}
        	}
        }
      }
    }
}
.pad5{
	padding: 5px;
}
.icon-intro02{
    	width: 15px;
    	height: 15px;
    	background: url(../../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
    	display: inline-block;
    	cursor: pointer;
    	/*margin-top: 22px;*/
    }
.greycolor{
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(204,204,204,1);
}
.wid80{
	width: 80px;
	height: 30px;
	line-height: 30px;
	text-align: right;
	display: inline-block;
}
  .wid250{
    width: 250px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    display: inline-block;
  }
.mr15{
	margin-right: 15px;
}
.hei60{
  height: 60px;
}
.mb30{
	margin-bottom: 30px;
}
.border_top{
	border-top: 1px solid #E5E5E5;
}
.marauto{
	margin: auto;
}
.wid180{
	width: 180px;
}
.poi1{
	position: relative;
}
.overflowy{
	overflow-y: auto;
}
.mb10{
	margin-bottom: 10px;
}
.poi2{
	position: absolute;
}
.poi3{
	position: fixed;
}
.wose{
	white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wose02{
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}
.bluecolor{
	background: #0086FF;
	color: #FFFFFF;
}
.bluecolor02{
	color: #0086FF;
}
.fs12{
	font-size: 12px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear02{
  clear: both;
  overflow: hidden;
}
.mt10{
  margin-top: 10px;
}
.mr10{
	margin-right: 10px;
}
.mt20{
  margin-top: 20px;
}
.ml10{
  margin-left: 10px;
}
.ml100{
  margin-left: 100px;
}
.ml75{
  margin-left: 75px;
}
.linh35{
  line-height: 35px;
  display: inline-block;
}
.ml60{
  margin-left: 60px;
}
.mr10{
  margin-right: 10px;
}
.fontstyle{
  font-style: normal;
}
.mb105{
	margin-bottom: 105px!important;
}
.h215 {
  height: 215px !important;
}
.h250{
  height: 250px!important;
}
.w100{
  width: 100px;
}
.marauto{
  margin: auto;
}
  .noshow{
    display: none;
  }
</style>
