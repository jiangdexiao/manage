<template>
  <div class="adddetail_container">
    <el-col :span="24" class="toolbar mb100">
       <div class="addbg">
       	<!--基础信息-->
       	<div class="message clear02">
       		<div><b>基础信息</b></div>
       		<div>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">满减名称</span>
		       			<span>{{fullCutInfo.fullCutName}}</span>
		       		</div>
	       		</el-col>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">生成者</span>
		       			<span v-if="fullCutInfo.creatorType == 1">平台</span>
                <span v-if="fullCutInfo.creatorType == 2">商家</span>
		       		</div>
	       		</el-col>
       		</div>
       		<div>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">编号</span>
		       			<span>{{fullCutInfo.fullCutNo}}</span>
		       		</div>
	       		</el-col>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">数量</span>
		       			<span v-if="fullCutInfo.totalNum == null || fullCutInfo.totalNum == 0 ">不限制</span>
                <span v-if="fullCutInfo.totalNum != null && fullCutInfo.totalNum > 0 ">{{fullCutInfo.totalNum}}</span>
		       		</div>
	       		</el-col>
       		</div>
       		<div>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">有效期</span>
		       			<span>{{fullCutInfo.expirationTimeStart}}~{{fullCutInfo.expirationTimeEnd}}</span>
		       			<span class="redcolor" v-if="fullCutInfo.status == 1">（未生效）</span>
                <span class="redcolor" v-if="fullCutInfo.status == 2">（已生效）</span>
                <span class="redcolor" v-if="fullCutInfo.status == 3">（已失效）</span>
		       		</div>
	       		</el-col>
	       		<el-col :span="10" class="toolbar">
		       		<div class="con mt10">
		       			<span class="tit01">使用情况</span>
                <span>{{fullCutInfo.isUse}}</span>
                <span>（已使用 <span class="bluecolor02">{{fullCutInfo.useNum == null ? 0 : fullCutInfo.useNum}}</span>次）</span>
		       			<!--<el-button size="small">查看使用记录</el-button>-->
		       		</div>
	       		</el-col>
       		</div>
       	</div>
       	<!--规则条件-->
       	<div class="message clear02">
       		<div class="mb10">
       			<div><b>基础信息</b></div>
       			<div class="con mt10">
		       		<span class="tit01">形式</span>
		       		<span v-if="fullCutInfo.fullCutType == 1">减钱</span>
              <span v-if="fullCutInfo.fullCutType == 2">打折</span>
              <span v-if="fullCutInfo.fullCutType == 3">换购</span>
              <div v-if="fullCutInfo.fullCutType == 3" class="clear02">
                <el-col :span="20">
                  <div class="Allchosen">
                    <div class="Allchosen_t">
                      已选 <span class="bluecolor02">{{exchangeGoodsList.length}}</span> 件商品
                    </div>
                    <div class="Allchosen_c">
                      <!-- 选择商品的时候 -->
                      <div class="chosen_all_have mclear" v-if="exchangeGoodsList.length > 0 && exchange_all_show == true">
                        <div class="fl mb10" v-for="(exchangeGoods,index) in exchangeGoodsList">
                          <el-tooltip :content="exchangeGoods.goodsName" placement="top-start" effect="light">
                            <div class="img fl poi1">
                              <img :src="exchangeGoods.goodsImageUrl"/>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="exchangeGoodsList.length > 10" @click="exchange_all_show = false">
                          <div class="">收起全部</div>
                          <div><i class="icon_open02"></i></div>
                        </div>
                      </div>
                      <div class="chosen_all_have mclear" v-if="exchangeGoodsList.length > 0 && exchange_all_show == false">
                        <div class="fl mb10" v-for="(exchangeGoods,index) in exchangeGoodsList" v-if="index < 10">
                          <el-tooltip :content="exchangeGoods.goodsName" placement="top-start" effect="light">
                            <div class="img fl poi1">
                              <img :src="exchangeGoods.goodsImageUrl"/>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="exchangeGoodsList.length > 10" @click="exchange_all_show = true">
                          <div>展开全部</div>
                          <div><i class="icon_open"></i></div>
                        </div>
                      </div>
                      <!-- 没有选择任何商品的时候 -->
                      <div class="chosen_all_none" v-if="exchangeGoodsList.length == 0">
                        还没有选择任何商品哦
                      </div>
                    </div>
                  </div>
                </el-col>
              </div>
		       	</div>
		       	<div class="con mt10">
		       		<span class="tit01">门槛选择</span>
		       		<span v-if="fullCutInfo.thresholdType == 1">金额</span>
              <span v-if="fullCutInfo.thresholdType == 2">件数</span>
		       	</div>
		       	<div class="mt10 box ml80" v-for="(item, index) in fullCutInfo.itemList">
              <b>层级<span class="bluecolor02"> {{index + 1}} </span></b>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 1 && fullCutInfo.thresholdType == 1">
                满<span class="bluecolor02"> {{item.threshold}}</span> 元减<span class="bluecolor02"> {{item.money}}</span> 元
              </span>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 1 && fullCutInfo.thresholdType == 2">
                满<span class="bluecolor02"> {{item.threshold}}</span> 件减<span class="bluecolor02"> {{item.money}}</span> 元
              </span>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 2 && fullCutInfo.thresholdType == 1">
                满<span class="bluecolor02"> {{item.threshold}}</span> 元打<span class="bluecolor02"> {{item.discount}}</span> 折
              </span>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 2 && fullCutInfo.thresholdType == 2">
                满<span class="bluecolor02"> {{item.threshold}}</span> 件打<span class="bluecolor02"> {{item.discount}}</span> 折
              </span>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 3 && fullCutInfo.thresholdType == 1">
                满<span class="bluecolor02"> {{item.threshold}}</span> 元加<span class="bluecolor02"> {{item.buyingPrice}}</span> 元可以换购商品
              </span>
              <span class="ml20" v-if="fullCutInfo.fullCutType == 3 && fullCutInfo.thresholdType == 2">
                满<span class="bluecolor02"> {{item.threshold}}</span> 件加<span class="bluecolor02"> {{item.buyingPrice}}</span> 元可以换购商品
              </span>
		       	</div>
		       	<div class="con mt10">
		       		<span class="tit01">作用范围</span>
		       		<span v-if="fullCutInfo.rangeType == 0 && fullCutInfo.creatorType == 1">全场</span>
              <span v-if="fullCutInfo.rangeType == 0 && fullCutInfo.creatorType == 2">全店</span>
              <span v-if="fullCutInfo.rangeType == 1">店铺</span>
              <span v-if="fullCutInfo.rangeType == 2">商品</span>
              <span v-if="fullCutInfo.rangeType == 3">品类</span>
		       	</div>
            <div class="clear02" v-if="fullCutInfo.rangeType == 2">
              <el-col :span="20" class="toolbar">
                <div class="Allchosen">
                  <div class="Allchosen_t">
                    已选 <span class="bluecolor02">{{chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="chosen_all_have mclear" v-if="chooseGoodsList.length > 0 && goods_all_show == true">
                      <div class="fl" v-for="(chooseGoods,index) in chooseGoodsList">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="chooseGoodsList.length > 10" @click="goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="chosen_all_have mclear" v-if="chooseGoodsList.length > 0 && goods_all_show == false">
                      <div class="fl" v-for="(chooseGoods,index) in chooseGoodsList" v-if="index < 10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="chooseGoodsList.length > 10" @click="goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="chosen_all_none" v-if="chooseGoodsList.length == 10">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
		       	<div class="clear02" v-if="fullCutInfo.rangeType == 3">
			       	<el-col :span="20" class="toolbar">
				       	<div class="Allchosen">
		              <div class="Allchosen_t">
		               	已选 <span class="bluecolor02">{{showClassifyList.length}}</span> 个品类
		              </div>
                  <div class="Allchosen_c" v-if="showClassifyList.length > 0">
                    <!-- 选择店铺的时候 -->
                    <div class="chosen_all_have">
                      <div class="wose ml10" v-for="(classify, index) in showClassifyList">
                        <el-tag type="info">
                          {{classify.classifyName}}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="Allchosen">
		              <div class="Allchosen_c overflowy h215">
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
			       	</el-col>
       			</div>
            <div class="clear02" v-if="fullCutInfo.rangeType == 1">
              <el-col :span="20" class="toolbar">
                <div class="Allchosen">
                  <div class="Allchosen_t">
                    已选 <span class="bluecolor02">{{chooseShopList.length}}</span> 个店铺
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="chosen_all_have mclear" v-if="chooseShopList.length > 0 && shop_all_show == true">
                      <div class="fl mr10" v-for="(chooseShop, index) in chooseShopList">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="chooseShopList.length > 10" @click="shop_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="chosen_all_have mclear" v-if="chooseShopList.length > 0 && shop_all_show == false">
                      <div class="fl mr10" v-for="(chooseShop, index) in chooseShopList" v-if="index < 10">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="chooseShopList.length > 10" @click="shop_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="chosen_all_none" v-if="chooseShopList.length == 0">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <div class="clear02" v-if="fullCutInfo.rangeType == 0">
              <el-col :span="20" class="toolbar">
                <div class="Allchosen">
                  <div class="Allchosen_t">
                    已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="chosen_all_have mclear" v-if="removeGoodsList.length > 0 && remove_goods_all_show == true">
                      <div class="fl mr10" v-for="(removeGoods, index) in removeGoodsList">
                        <el-tooltip :content="removeGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="removeGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="chosen_all_have mclear" v-if="removeGoodsList.length > 0 && remove_goods_all_show == false">
                      <div class="fl mr10" v-for="(removeGoods, index) in removeGoodsList" v-if="index < 10">
                        <el-tooltip :content="removeGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="removeGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1 mr10" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="chosen_all_none" v-if="removeGoodsList.length == 0">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
                <div class="Allchosen" v-if="fullCutInfo.creatorType == 1">
                  <div class="Allchosen_t">
                    已排除 <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择店铺的时候 -->
                    <div class="chosen_all_have" v-if="removeShopList.length > 0 && remove_shop_all_show == true">
                      <div class="wose mr10" v-for="(removeShop, index) in removeShopList">
                        <el-tag type="info" closable @close="deleteRemoveShop(index, removeShop)">
                          {{removeShop.shopName}}
                        </el-tag>
                      </div>
                      <!--展开全部-->
                      <div class="allshop" v-if="removeShopList.length > 10" @click="remove_shop_all_show = false">
                        <span>收起全部</span>
                        <i class="icon_open02"></i>
                      </div>
                    </div>
                    <div class="chosen_all_have" v-if="removeShopList.length > 0 && remove_shop_all_show == false">
                      <div class="wose mr10" v-for="(removeShop, index) in removeShopList" v-if="index < 10">
                        <el-tag type="info" closable>
                          {{removeShop.shopName}}
                        </el-tag>
                      </div>
                      <!--展开全部-->
                      <div class="allshop" v-if="removeShopList.length > 10" @click="remove_shop_all_show = true">
                        <span>展开全部</span>
                        <i class="icon_open"></i>
                      </div>
                    </div>
                    <!-- 没有选择任何店铺的时候 -->
                    <div class="chosen_all_none" v-if="removeShopList.length == 0">
                      还没有选择任何店铺哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
       		</div>
       	</div>
       	<!--发放方式-->
       	<div class="message clear02">
	       	<div class="con mt10 clear02">
			      <b class="tit01">发放方式</b>
			       	<span>无需领取，每人优惠 <span class="bluecolor02">{{fullCutInfo.numPerOne}}</span> 次，每天仅可优惠 <span class="bluecolor02">{{fullCutInfo.numPerDay}}</span> 次领取</span>
			    </div>
		    </div>
		    <!--成本控制-->
		    <div class="message clear02 mt10">
		      <div><b>成本控制</b></div>
		      <div class="con mt10">
		      	<span class="tit01">通用成本</span>
		       	<span>平台承担</span>
		       	<span class="bluecolor02" v-if="fullCutInfo.creatorType == 1"> {{costAll.platform}} </span>
            <span class="bluecolor02" v-if="fullCutInfo.creatorType == 2"> 0 </span>%
		       	<span class="ml20">商家承担</span>
		       	<span class="bluecolor02" v-if="fullCutInfo.creatorType == 1"> {{costAll.dealer}} </span>
            <span class="bluecolor02" v-if="fullCutInfo.creatorType == 2"> 100 </span>%
		      </div>
		      <div v-if="fullCutInfo.creatorType == 1">
		      	<el-col :span="20" class="toolbar">
          	    <div class="Allchosenshop">
                  <div class="Allchosenshop_t">
                    	已单独设置 <span class="bluecolor02">{{fullCutInfo.costList == null ? 0 : fullCutInfo.costList.length - 1}}</span> 个店铺
                  </div>
                  <div class="Allchosenshop_c">
                    <!--没有设置店铺情况 -->
                    <div class="Allchosenshop_c_none" v-if="fullCutInfo.costList == null || fullCutInfo.costList.length <= 1">
                      还没有单独设置任何商家哦
                    </div>
                    <!--设置店铺情况 -->
                    <div class="Allchosenshop_c_have mclear" v-if="fullCutInfo.costList != null && fullCutInfo.costList.length > 1">
                      <div class="Allchosenshop_box fl mt10" v-for="cost in fullCutInfo.costList" v-if="cost.dealerId != 'ALL'">
                        <div class="Allchosenshop_box_t fl">
                          <div class="tit04 wose">{{cost.dealerName}}</div>
                          <div class="tit05">平台承担:{{cost.platformPercent}}%，店铺承担:{{cost.dealerPercent}}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
		      	</el-col>
		      </div>
		    </div>
       	<!--备注-->
       	<div class="message clear02 mt20">
       		<b class="tit01 fl ml28">备注</b>
	       	<div class="con">
			      <el-col :span="18" class="toolbar">
				      <span class="ml20 bzbox">{{fullCutInfo.remark == '' ? '暂无' :  fullCutInfo.remark}}</span>
			      </el-col>
			    </div>
		    </div>
       </div>
    </el-col>
    <div class="b_button">
      <div class="marauto wid180">
    		<el-button size="medium" @click="back()">返回</el-button>
  		</div>
  	</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods_all_show: false,
      shop_all_show: false,
      exchange_all_show: false,
      remove_goods_all_show: false,
      remove_shop_all_show: false,
      fullCutInfo: '',
      costAll: {platform: '', dealer: ''},
      removeGoodsList: [],
      removeShopList: [],
      chooseShopList: [],
      chooseGoodsList: [],
      exchangeGoodsList: [],
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
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/goods/classify/tree',
//        data: {
//          parentClassifyId: parentClassifyId
//        },
//        success: function (result) {
//          _this.classifyList = result.content
//          for (let a = 0; a < _this.classifyList.length; a++) {
//            _this.classifyList[a].disabled = true
//            if (_this.classifyList[a].subClassify != null && _this.classifyList[a].subClassify.length > 0) {
//              for (let b = 0; b < _this.classifyList[a].subClassify.length; b++) {
//                _this.classifyList[a].subClassify[b].disabled = true
//                if (_this.classifyList[a].subClassify[b].subClassify != null && _this.classifyList[a].subClassify[b].subClassify.length > 0) {
//                  for (let c = 0; c < _this.classifyList[a].subClassify[b].subClassify.length; c++) {
//                    _this.classifyList[a].subClassify[b].subClassify[c].disabled = true
//                  }
//                }
//              }
//            }
//          }
//        }
//      })
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
      _this.$router.push({path: '/m/marketTool/fullcutList'})
    }
  },
  mounted () {
    let _this = this
    _this.classifySelect('-1')
    _this.api_businessManagePlatform_fullcutDetail({
      pathParams: `/${sessionStorage.getItem('full_cut_id')}`
    }).then(result => {
      _this.fullCutInfo = result.content
      if (_this.fullCutInfo.rangeType === 0) {
        for (let i = 0; i < _this.fullCutInfo.removeRangeList.length; i++) {
          if (_this.fullCutInfo.creatorType == 1) {
            if (_this.fullCutInfo.removeRangeList[i].type == 1) {
              let removeShop = {}
              removeShop.dealerId = _this.fullCutInfo.removeRangeList[i].id
              removeShop.shopName = _this.fullCutInfo.removeRangeList[i].name
              removeShop.shopIcon = _this.fullCutInfo.removeRangeList[i].imageUrl
              _this.removeShopList.push(removeShop)
            }
          }
          if (_this.fullCutInfo.removeRangeList[i].type == 2) {
            let removeGoods = {}
            removeGoods.goodsId = _this.fullCutInfo.removeRangeList[i].id
            removeGoods.goodsName = _this.fullCutInfo.removeRangeList[i].name
            removeGoods.goodsImageUrl = _this.fullCutInfo.removeRangeList[i].imageUrl
            _this.removeGoodsList.push(removeGoods)
          }
        }
      }
      if (_this.fullCutInfo.rangeType == 1) {
        for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
          let shop = {}
          shop.dealerId = _this.fullCutInfo.suitableRangeList[i].id
          shop.shopName = _this.fullCutInfo.suitableRangeList[i].name
          shop.shopIcon = _this.fullCutInfo.suitableRangeList[i].imageUrl
          _this.chooseShopList.push(shop)
        }
      }
      if (_this.fullCutInfo.rangeType == 2) {
        for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
          let goods = {}
          goods.goodsId = _this.fullCutInfo.suitableRangeList[i].id
          goods.goodsName = _this.fullCutInfo.suitableRangeList[i].name
          goods.goodsImageUrl = _this.fullCutInfo.suitableRangeList[i].imageUrl
          _this.chooseGoodsList.push(goods)
        }
      }
      if (_this.fullCutInfo.rangeType === 3) {
        for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
          _this.rangeClassifyList.push(_this.fullCutInfo.suitableRangeList[i].id)
        }
        setTimeout(() => {
          _this.getCheckedNodes()
        }, 1000)
      }
      if (_this.fullCutInfo.fullCutType == 3) {
        let goodsIds = _this.fullCutInfo.itemList[0].goodsIds
        _this.api_businessManagePlatform_goodsMultiple({
          data: {
            goodsIds: goodsIds
          }
        }).then(result => {
          _this.exchangeGoodsList = result.content
        })
      }
      if (_this.fullCutInfo.creatorType == 1) {
        for (let i = 0; i < _this.fullCutInfo.costList.length; i++) {
          if (_this.fullCutInfo.costList[i].dealerId === 'ALL') {
            _this.costAll.platform = _this.fullCutInfo.costList[i].platformPercent
            _this.costAll.dealer = _this.fullCutInfo.costList[i].dealerPercent
          }
        }
      }
    })

//    $.ajax({
//      url: _this.BASE_URL + 'm2c.market/web/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
//      success: function (result) {
//        _this.fullCutInfo = result.content
//        if (_this.fullCutInfo.rangeType === 0) {
//          for (let i = 0; i < _this.fullCutInfo.removeRangeList.length; i++) {
//            if (_this.fullCutInfo.creatorType == 1) {
//              if (_this.fullCutInfo.removeRangeList[i].type == 1) {
//                let removeShop = {}
//                removeShop.dealerId = _this.fullCutInfo.removeRangeList[i].id
//                removeShop.shopName = _this.fullCutInfo.removeRangeList[i].name
//                removeShop.shopIcon = _this.fullCutInfo.removeRangeList[i].imageUrl
//                _this.removeShopList.push(removeShop)
//              }
//            }
//            if (_this.fullCutInfo.removeRangeList[i].type == 2) {
//              let removeGoods = {}
//              removeGoods.goodsId = _this.fullCutInfo.removeRangeList[i].id
//              removeGoods.goodsName = _this.fullCutInfo.removeRangeList[i].name
//              removeGoods.goodsImageUrl = _this.fullCutInfo.removeRangeList[i].imageUrl
//              _this.removeGoodsList.push(removeGoods)
//            }
//          }
//        }
//        if (_this.fullCutInfo.rangeType == 1) {
//          for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
//            let shop = {}
//            shop.dealerId = _this.fullCutInfo.suitableRangeList[i].id
//            shop.shopName = _this.fullCutInfo.suitableRangeList[i].name
//            shop.shopIcon = _this.fullCutInfo.suitableRangeList[i].imageUrl
//            _this.chooseShopList.push(shop)
//          }
//        }
//        if (_this.fullCutInfo.rangeType == 2) {
//          for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
//            let goods = {}
//            goods.goodsId = _this.fullCutInfo.suitableRangeList[i].id
//            goods.goodsName = _this.fullCutInfo.suitableRangeList[i].name
//            goods.goodsImageUrl = _this.fullCutInfo.suitableRangeList[i].imageUrl
//            _this.chooseGoodsList.push(goods)
//          }
//        }
//        if (_this.fullCutInfo.rangeType === 3) {
//          for (let i = 0; i < _this.fullCutInfo.suitableRangeList.length; i++) {
//            _this.rangeClassifyList.push(_this.fullCutInfo.suitableRangeList[i].id)
//          }
//          setTimeout(() => {
//            _this.getCheckedNodes()
//          }, 1000)
//        }
//        if (_this.fullCutInfo.fullCutType == 3) {
//          let goodsIds = _this.fullCutInfo.itemList[0].goodsIds
//          $.ajax({
//            url: _this.BASE_URL + 'm2c.scm/goods/detail/multiple',
//            data: {
//              goodsIds: goodsIds
//            },
//            success: function (result) {
//              _this.exchangeGoodsList = result.content
//            }
//          })
//        }
//        if (_this.fullCutInfo.creatorType == 1) {
//          for (let i = 0; i < _this.fullCutInfo.costList.length; i++) {
//            if (_this.fullCutInfo.costList[i].dealerId === 'ALL') {
//              _this.costAll.platform = _this.fullCutInfo.costList[i].platformPercent
//              _this.costAll.dealer = _this.fullCutInfo.costList[i].dealerPercent
//            }
//          }
//        }
//      }
//    })
  }
}
</script>

<style lang="scss" scoped>
.adddetail_container{
	padding: 15px 26px;
	.addbg{
		background: #FFFFFF;
		padding: 22px 34px;
		.message{
			width: 100%;
			font-size: 14px;
			.con{
				.tit01{
					display: inline-block;
					width: 65px;
					line-height: 30px;
					text-align: right;
					margin-right: 15px;
				}
			}
			.bzbox{
				background: #F5F5F5;
				padding: 10px;
				height: 50px;
				font-size: 14px;
				display: inline-block;
        width: 100%;
			}
			.box{
				width: 450px;
				height: 46px;
				line-height: 46px;
				color: #777777;
				padding-left: 10px;
				background: #F5F5F5 ;
				b{
					font-size: 14px;
				}
			}
			.Allchosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 80px;
        min-height: 120px;
        .Allchosen_t{
          /*width: 100%;*/
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #E6E8F2;
          padding-left: 20px;
          color: #878787;
          font-size: 14px;
          background: #F5F5F5;
          .bluecolor{
            color: #006FFF;
          }
        }
        .Allchosen_c{
          max-height: 300px;
          padding-top: 10px;
          padding-left: 10px;
          padding-bottom: 10px;
          .chosen_all_none{
            line-height: 83px;
            color: #ccc;
            font-size: 14px;
          }
          .chosen_all_have{
            width: 100%;
            height: 100%;
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
              .icon_open02{
                width: 15px;
                height: 7px;
                display: inline-block;
                background: url(../../../../../../static/images/businessManage/icon_open02.png) no-repeat center;
              }
            }
            .img{
              width: 60px;
              height: 60px;
              margin-right:10px;
              margin-bottom: 10px;
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
      }
			b{
				font-size: 16px;
				color: #000000;
			}
		}
		.Allchosenshop{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 80px;
        height: 220px;
        .Allchosenshop_t{
          height: 32px;
          line-height: 32px;
          border-bottom: 1px solid #E6E8F2;
          padding-left: 20px;
          color: #878787;
          font-size: 14px;
          background: #F5F5F5;
          .bluecolor{
            color: #006FFF;
          }
        }
        .Allchosenshop_c{
          height: 168px;
          text-align: center;
          padding: 10px;
          .Allchosenshop_c_none{
            line-height: 168px;
            color: #ccc;
            font-size: 14px;
          }
          .Allchosenshop_c_have{
            height: 168px;
            overflow-y: auto;
            .Allchosenshop_box{
              width: 390px;
              /*height: 50px;*/
              padding: 10px;
              border: 1px solid #F5F5F5;
              background:rgba(245,245,245,1);
              border-radius: 2px;
              text-align: left;
              margin-right: 10px;
              .Allchosenshop_box_t{
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
}
.b_button{
      padding-top: 20px;
      padding-bottom: 20px;
      margin-top: 10px;
      background: #fff;
      position: fixed;
      z-index: 99;
      bottom: 0px;
      width: 100%;
      left: 200px;
      border-top:1px solid #E6E8F2;
    }
  .mr30{
    margin-right: 30px;
  }
  .wid138{
    width: 138px;
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
  .icon_delet02{
    width: 16px;
    height: 20px;
    display: inline-block;
    background: url(../../../../../../static/images/businessManage/icon_delet02.png) no-repeat center;
    margin-top: 20px;
    cursor: pointer;
    }
  .name_style{
    display:  inline-block;
    line-height: 20px;
    color:  #ccc;
    width:  260px;
    font-size: 12px;
  }
  .editbtn{
  	margin-top: 10px;
    width: 100px;
    height: 20px;
    border: 1px solid #666666;
    color: #666666;
    background: #fff;
    font-size: 12px;
  }
  .mt14{
  	margin-top: 14px;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .mclear{
    clear: both;
    overflow: hidden;
  }
  .mt2{
    margin-top: 2px;
  }
  .mt5{
    margin-top: 6px;
  }
  .mt10{
    margin-top: 10px;
  }
  .mt0{
  	margin-top: initial!important;
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
  .ml15{
    margin-left: 15px;
  }
  .wid290{
  	width: 290px;
  }
  .ml20{
    margin-left: 20px;
  }
  .ml100{
    margin-left: 100px;
  }
  .ml50{
    margin-left: 50px;
  }
  .ml65{
    margin-left: 65px;
  }
  .ml165{
    margin-left: 165px;
  }
  .linh35{
    line-height: 35px;
    display: inline-block;
    font-size: 14px;
  }
  .ml28{
  	margin-left: 28px;
  }
  .ml80{
    margin-left: 80px;
  }
  .ml305{
    margin-left: 305px;
  }
  .mr10{
    margin-right: 10px;
  }
  .fontstyle{
    font-style: normal;
  }
  .redcolor{
  	color: #F56C6C;
  }
  .mb100{
    margin-bottom: 100px!important;
  }
  .w200{
    width: 200px;
  }
  .mt7{
  	margin-top: 7px;
  }
  .fs14{
  	font-size: 14px;
  }
  .clear02{
  	clear: both;
  	overflow: hidden;
  }
  .textarea{
  	width:500px;
  }
  .pad10{
  	padding: 10px;
  }
  .mr20{
  	margin-right: 20px;
  }
  .blackcolor{
  	color: #444;
  }
</style>
