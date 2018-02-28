<template>
  <div class="yhxz_container">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" class="demo-form-inline">
          <!--基础信息-->
          <div class="BasicinFormation clear02">
            <div class="Basicinbt">基础信息</div>
            <div class="mt10">
              <el-form-item label="优惠券名称">
                <el-input v-model="couponParams.coupon_name" placeholder="不超过11个字" :maxlength="22" @blur="formValidator(1)"></el-input>
              </el-form-item>
              <span class="name_style">可用英文数字，汉字，特殊字符，一个中文数字符号=1个字，一个英文=半个字
              </span>
              <el-form-item label="面值" class="ml65">
                <el-input  v-model="couponParams.coupon_json.money" placeholder="最大1000" :maxlength="4" @blur="formValidator(4)">
                  <i slot="suffix" class="el-input__icon fontstyle">元</i>
                </el-input>
              </el-form-item>
              <!--<div class="tit">-->
                <!--填0即为不限制数量，修改发行量只能增加不能减少，请谨慎设置。-->
              <!--</div>-->
            </div>
            <div class="pl28">
              <el-form-item label="有效期">
                <el-date-picker
                                v-model="couponParams.expiration_time"
                                type="daterange"
                                clearable
                                align="left"
                                :editable="false"
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="发行量" class="ml165">
                <el-input  v-model="couponParams.total_num" placeholder="最大99999" :maxlength="5" @blur="formValidator(2)">
                  <i slot="suffix" class="el-input__icon fontstyle">张</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="clear02">
              <div class="fl tit ml80">
                有效期未开始时，用户可领取但不可使用；修改时，只能延后结束时间不能提前，请谨慎设置。
              </div>
              <div class="fl tit ml305">
                最大99999，填0即为不限制数量，修改发行量只能增加不能减少，请谨慎设置。
              </div>
            </div>
          </div>
          <!--条件设置-->
          <div class="BasicinFormation clear02">
            <div class="Basicinbt">条件设置</div>
            <div class="mt10">
              <el-form-item label="门槛选择">
                <el-radio v-model="couponParams.threshold_type" label="1" class="ml10">金额</el-radio>
                <el-radio v-model="couponParams.threshold_type" label="2">件数</el-radio>
                <el-radio v-model="couponParams.threshold_type" label="3">无条件</el-radio>
              </el-form-item>
            </div>
            <div class="tit01" v-if="couponParams.threshold_type == 1 || couponParams.threshold_type == 2">
              <span class="ml60 mr10">满</span>
              <el-form-item>
                <el-input v-if="couponParams.threshold_type == 1" v-model="couponParams.coupon_json.threshold" placeholder="最大9999" :maxlength="4" @blur="formValidator(9)">
                  <i slot="suffix" class="el-input__icon fontstyle">元</i>
                </el-input>
                <el-input v-if="couponParams.threshold_type == 2" v-model="couponParams.coupon_json.threshold" placeholder="最大100" :maxlength="3" @blur="formValidator(9)">
                  <i slot="suffix" class="el-input__icon fontstyle">件</i>
                </el-input>
              </el-form-item>
              <span>可使用该优惠券</span>
            </div>
            <div>
              <el-form-item label="作用范围">
                <el-radio-group v-model="couponParams.range_type" size="small" @change="changeRangeType(couponParams.range_type)">
                  <el-radio label="2" class="ml10">商品</el-radio>
                  <el-radio label="3">品类</el-radio>
                  <el-radio label="1">店铺</el-radio>
                  <el-radio label="0">全场</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!--作用范围为商品-->
            <div v-if="couponParams.range_type == 2">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top clear02">
                    <div class="fl wid290">
                      <el-input placeholder="请输入内容" class="mt14" v-model="goods_query_item.condition">
                        <el-button slot="append" icon="el-icon-search" @click="goodsSelect()">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-model="goods_query_item.dealerId" clearable placeholder="全部店铺" @change="goodsSelect()" class="ml15">
                      <el-option v-for="shop in shopResult.content"
                                 :key="shop.dealerId"
                                 :label="shop.shopName"
                                 :value="shop.dealerId">
                      </el-option>
                    </el-select>
                    <el-select v-model="goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="goodsSelect()" class="">
                      <el-option v-for="classify in classifyList"
                                 :key="classify.classifyId"
                                 :label="classify.classifyName"
                                 :value="classify.classifyId">
                      </el-option>
                    </el-select>
                    <span class="title ml15">最多选择30个商品</span>
                  </div>
                  <div class="shopbox_cen clear02">
                    <!-- 请判断有商品的时候显示 -->
                    <div class="shopbox_have clear02" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                      <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                      <div v-for="(goods, index) in goodsResult.content" @click="chooseGoods(goods)">
                        <div :class="['shopbox_have_box', 'fl', goods.isChoosed == 1 ? 'b_active' : '']">
                          <div class="wose shopbox_have_tit clear02">
                            <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                              <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                            </el-tooltip>
                            <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                          </div>
                          <div class="shopbox_have_img">
                            <div class="img fl mr10">
                              <img :src="goods.goodsImageUrl"/>
                            </div>
                            <div class="tit03 fl">店铺:
                              <el-tooltip :content="goods.shopName" placement="top-start" effect="light" v-if="goods.shopName.length > 6">
                                <span>{{goods.shopName.substring(0,6).concat('...')}}</span>
                              </el-tooltip>
                              <span v-if="goods.shopName.length <= 6">{{goods.shopName}}</span>
                            </div>
                            <div class="tit03 fl">价格:<span>¥{{goods.goodsPrice}}元</span></div>
                          </div>
                          <i :class="goods.isChoosed == 1 ? 'icon_selected' : ''"></i>
                        </div>
                      </div>
                    </div>
                    <!-- 请判断没有商品的时候显示 -->
                    <div class="shopbox_no" v-else>
                      <div class="shopboxbg"></div>
                      <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                    </div>
                    <el-pagination v-if="goodsResult.content != null && goodsResult.content.length > 0"
                      @current-change="changeGoodsPageNo"
                      :current-page="goodsResult.pageNumber"
                      :page-size="10"
                      layout="total, prev, pager, next, jumper"
                      :total="goodsResult.totalCount">
                    </el-pagination>
                  </div>
                </div>
                <div class="Alreadychosen">
                  <div class="Alreadychosen_t">
                    已选 <span class="bluecolor02">{{chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Alreadychosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="Alreadychosen_c_have clear02" v-if="chooseGoodsList.length > 0 && goods_all_show == true">
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="chooseGoodsList.length > 10" @click="goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="Alreadychosen_c_have clear02" v-if="chooseGoodsList.length > 0 && goods_all_show == false">
                      <div v-for="(chooseGoods,index) in chooseGoodsList" class="fl mb10" v-if="index < 10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="chooseGoodsList.length > 10" @click="goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="Alreadychosen_c_none" v-if="chooseGoodsList.length == 0">
                      还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为品类-->
            <div v-if="couponParams.range_type == 3">
              <div class="category_container clear02">
                <div class="category_container_l fl">
                  <div class="category_container_l_t">
                    <span>分类列表</span>
                    <span class="tit07">可多选</span>
                  </div>
                  <div class="category_container_l_b">
                    <el-tree
                      :data="classifyList"
                      :props="defaultProps"
                      node-key="classifyId"
                      ref="classifyTree"
                      show-checkbox
                      default-expand-all
                      highlight-current
                      @check-change="getCheckedNodes">
                    </el-tree>
                  </div>
                </div>
                <div class="category_container_r fl">
                  <div class="category_container_r_t">
                    <span>已选 </span><span class="tit08 bluecolor02">{{showClassifyList.length}}</span><span> 个分类</span>
                  </div>
                  <div class="category_container_r_b">
                    <div class="category_container_r_box clear02" v-for="(classify,index) in showClassifyList">
                      <span class="fl">{{classify.classifyName}}</span>
                      <span class="tit09 fr" @click="deleteClassify(index, classify)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--作用范围为店铺-->
            <div v-if="couponParams.range_type == 1">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top clear02">
                    <div class="fl wid290">
                      <el-input placeholder="请输入店铺名称" v-model="shop_query_item.dealerName" class="mt14">
                        <el-button slot="append" icon="el-icon-search" @click="shopSelect()">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-model="shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="shopSelect()" class="ml15">
                      <el-option v-for="shopClassify in shopClassifyList"
                                 :key="shopClassify.dealerClassifyId"
                                 :label="shopClassify.dealerClassifyName"
                                 :value="shopClassify.dealerClassifyId">
                      </el-option>
                    </el-select>
                    <span class="title ">最多选择30个店铺</span>
                  </div>
                  <div class="shopbox_cen clear02">
                    <!-- 请判断有商品的时候显示 -->
                    <div class="shopbox_have clear02" v-if="shopResult.content != null && shopResult.content.length > 0">
                      <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                      <div v-for="(shop, index) in shopResult.content" @click="chooseShop(shop)">
                        <div :class="['shopbox_have_box', 'fl', shop.isChoosed == 1 ? 'b_active' : '']">
                          <div class="wose shopbox_have_tit clear02">
                            <el-tooltip :content="shop.shopName" placement="top-start" effect="light" v-if="shop.shopName.length > 15">
                              <span>{{shop.shopName.substring(0,15).concat('...')}}</span>
                            </el-tooltip>
                            <span v-if="shop.shopName.length <= 15">{{shop.shopName}}</span>
                          </div>
                          <div class="shopbox_have_img">
                            <div class="img fl mr10">
                              <img :src="shop.shopIcon"/>
                            </div>
                            <!--<div class="tit03 fl">店铺:-->
                              <!--<span v-if="shop.shopName.length > 6">{{shop.shopName.substring(0,6).concat('...')}}</span>-->
                              <!--<span v-else>{{shop.shopName}}</span>-->
                            <!--</div>-->
                            <div class="tit03 fl">商家:
                              <el-tooltip :content="shop.dealerName" placement="top-start" effect="light" v-if="shop.dealerName.length > 6">
                                <span>{{shop.dealerName.substring(0,6).concat('...')}}</span>
                              </el-tooltip>
                              <span v-if="shop.dealerName.length <= 6">{{shop.dealerName}}</span>
                            </div>
                          </div>
                          <i :class="shop.isChoosed == 1 ? 'icon_selected' : ''"></i>
                        </div>
                      </div>
                    </div>
                    <!-- 请判断没有商品的时候显示 -->
                    <div class="shopbox_no" v-else>
                      <div class="shopboxbg"></div>
                      <div class="shopboxcen">暂时还没有店铺可供选择哦</div>
                    </div>
                    <el-pagination v-if="shopResult.content != null && shopResult.content.length > 0"
                      @current-change="changeShopPageNo"
                      :current-page="shopResult.pageNumber"
                      :page-size="10"
                      layout="total, prev, pager, next, jumper"
                      :total="shopResult.totalCount">
                    </el-pagination>
                  </div>
                </div>
                <div class="Alreadychosen">
                  <div class="Alreadychosen_t">
                    已选 <span class="bluecolor02">{{chooseShopList.length}}</span> 个店铺
                  </div>
                  <div class="Alreadychosen_c">
                    <!-- 选择店铺的时候 -->
                    <div class="Alreadychosen_c_have" v-if="chooseShopList.length > 0 && shop_all_show == true">
                      <div class="wose ml10" v-for="(chooseShop, index) in chooseShopList">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--多的时候控制js展示展开全部-->
                      <div class="allshop" v-if="chooseShopList.length > 10" @click="shop_all_show = false">
                        <span>收起全部</span>
                        <i class="icon_open02"></i>
                      </div>
                    </div>
                    <div class="Alreadychosen_c_have" v-if="chooseShopList.length > 0 && shop_all_show == false">
                      <div class="wose ml10" v-for="(chooseShop, index) in chooseShopList" v-if="index < 10">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--多的时候控制js展示展开全部-->
                      <div class="allshop" v-if="chooseShopList.length > 10" @click="shop_all_show = true">
                        <span>展开全部</span>
                        <i class="icon_open"></i>
                      </div>
                    </div>
                    <!-- 没有选择任何店铺的时候 -->
                    <div class="Alreadychosen_c_none" v-if="chooseShopList.length == 0">
                      还没有选择任何店铺哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为全场-->
            <div v-if="couponParams.range_type == 0">
              <el-col :span="20">
                <div class="Full-court_container">
                  <div class="Full-court01">
                    <span>已设置该优惠券作用于全场商品，如需排除其中个别的商品或店铺，点击</span>
                    <span class="button" @click="openRangeDailog()">排除商品或店铺</span>
                  </div>
                  <div class="Alreadychosen">
                    <div class="Alreadychosen_t">
                      已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
                    </div>
                    <div class="Alreadychosen_c">
                      <!-- 选择商品的时候 -->
                      <div class="Alreadychosen_c_have clear02" v-if="removeGoodsList.length > 0 && remove_goods_all_show == true">
                        <div v-for="(removeGoods, index) in removeGoodsList">
                          <el-tooltip :content="removeGoods.goodsName" placement="top-start" effect="light">
                            <div class="img fl poi1">
                              <img :src="removeGoods.goodsImageUrl"/>
                              <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = false">
                          <div>收起全部</div>
                          <div><i class="icon_open02"></i></div>
                        </div>
                      </div>
                      <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0 && remove_goods_all_show == false">
                        <div v-for="(removeGoods, index) in removeGoodsList"  v-if="index < 10">
                          <el-tooltip :content="removeGoods.goodsName" placement="top-start" effect="light">
                            <div class="img fl poi1">
                              <img :src="removeGoods.goodsImageUrl"/>
                              <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                            </div>
                          </el-tooltip>
                        </div>
                        <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                        <div class="img02 fl poi1" v-if="removeGoodsList.length > 10" @click="remove_goods_all_show = true">
                          <div>展开全部</div>
                          <div><i class="icon_open"></i></div>
                        </div>
                      </div>
                      <!-- 没有选择任何商品的时候 -->
                      <div class="Alreadychosen_c_none" v-if="removeGoodsList.length == 0">
                        还没有选择任何商品哦!
                      </div>
                    </div>
                  </div>
                  <div class="Alreadychosen">
                    <div class="Alreadychosen_t">
                      已排除 <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
                    </div>
                    <div class="Alreadychosen_c">
                      <!-- 选择店铺的时候 -->
                      <div class="Alreadychosen_c_have" v-if="removeShopList.length > 0 && remove_shop_all_show == true">
                        <div class="wose ml10" v-for="(removeShop, index) in removeShopList">
                          <el-tag type="info" closable @close="deleteRemoveShop(index, removeShop)">
                            {{removeShop.shopName}}
                          </el-tag>
                        </div>
                        <!--多的时候控制js展示展开全部-->
                        <div class="allshop" v-if="removeShopList.length > 10" @click="remove_shop_all_show = false">
                          <span>收起全部</span>
                          <i class="icon_open02"></i>
                        </div>
                      </div>
                      <div class="Alreadychosen_c_have" v-if="removeShopList.length > 0 && remove_shop_all_show == false">
                        <div class="wose ml10" v-for="(removeShop, index) in removeShopList" v-if="index < 10">
                          <el-tag type="info" closable @close="deleteRemoveShop(index, removeShop)">
                            {{removeShop.shopName}}
                          </el-tag>
                        </div>
                        <!--多的时候控制js展示展开全部-->
                        <div class="allshop" v-if="removeShopList.length > 10" @click="remove_shop_all_show = true">
                          <span>展开全部</span>
                          <i class="icon_open"></i>
                        </div>
                      </div>
                      <!-- 没有选择任何店铺的时候 -->
                      <div class="Alreadychosen_c_none" v-if="removeShopList.length == 0">
                        还没有选择任何店铺哦
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
          </div>
          <!--领取方式-->
          <div class="BasicinFormation clear02">
            <div class="Basicinbt">
              <span class="linh35">领取方式</span>
              <el-form-item>
                <el-radio v-model="couponParams.receive_type" label="1" class="ml10">用户主动领取</el-radio>
                <el-radio v-model="couponParams.receive_type" label="2">后台派发</el-radio>
                <el-radio v-model="couponParams.receive_type" label="3">活动专用</el-radio>
              </el-form-item>
              <div class="title02" v-if="couponParams.receive_type === '1'">设置为主动领取后，该优惠券将不可以通过后台进 行发放，用户可在客户端或其他渠道领取该优惠券。</div>
              <div class="title02" v-if="couponParams.receive_type === '2'">设置为后台派发后，将不可以在客户端或其他渠道设置领取页面，而是运营人员直接从后台派发，进入用户的券包。</div>
              <div class="title02" v-if="couponParams.receive_type === '3'">设置为活动专用后，该优惠券仅供活动使用，用户无法从商品详情页 领取，后台也无法派发；且满减是否可共用由活动决定。</div>
            </div>
          </div>
          <!--成本控制-->
          <div :class="['BasicinFormation', 'clear02', couponParams.receive_type === '3' ? 'mb100' : '']">
            <div class="Basicinbt">
              	成本控制
            </div>
            <div class="mt10" v-if="couponParams.receive_type === '1'">
              <span class="fl mt10">
                领取限制
              </span>
              <el-form-item label="每人限领" class="ml20 coupon_input">
                <el-input  v-model="couponParams.num_per_one" :maxlength="5" @blur="formValidator(5)">
                  <i slot="prefix" class="fontstyle">共</i>
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
              <el-form-item label="每人每天限领" v-if="couponParams.num_per_one > 1" class="coupon_input">
                <el-input  v-model="couponParams.num_per_day" :maxlength="5" @blur="formValidator(6)">
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="mt10">
              <span class="fl mt10">
                营销成本
                <br/>
                分摊
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
              <el-form-item label="平台承担" class="ml15 coupon_input">
                <el-input  v-model="couponParams.cost_json.platform" :maxlength="3" @blur="formValidator(7)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-form-item label="商家承担" class="ml29 coupon_input">
                <el-input  v-model="couponParams.cost_json.dealer" :maxlength="3" @blur="formValidator(8)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-button type="primary" size="medium" class="mt10" @click="openCostDailog()">单独成本设置</el-button>
          	  <el-col :span="20">
          	    <div class="Alreadychosenshop">
                  <div class="Alreadychosenshop_t">
                    已单独设置 <span class="bluecolor02">{{dealerCostList.length}}</span> 个店铺
                  </div>
                  <div class="Alreadychosenshop_c">
                    <!--没有设置店铺情况 -->
                    <div class="Alreadychosenshop_c_none" v-if="dealerCostList.length == 0">
                      还没有单独设置任何商家哦
                    </div>
                    <!--设置店铺情况 -->
                    <div class="Alreadychosenshop_c_have clear02" v-if="dealerCostList.length > 0">
                      <div class="Alreadychosenshop_box fl mt10" v-for="(cost,index) in dealerCostList">
                        <div class="Alreadychosenshop_box_t fl">
                          <div class="tit04 wose">{{cost.shopName}}</div>
                          <div class="tit05">平台承担:{{cost.platform}}%，店铺承担:{{cost.dealer}}%</div>
                        </div>
                        <div class="fr icon_delet02" @click="deleteShopCost(index, cost)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
          </div>
          <!--其他规则-->
          <div class="BasicinFormation clear02 mb100" v-if="couponParams.receive_type === '1' || couponParams.receive_type === '2'">
            <div class="Basicinbt">
              <span class="linh35">其他规则</span>
              <el-form-item>
                <el-checkbox v-model="couponParams.is_share" class="ml10">可与其他营销活动共同使用</el-checkbox>
              </el-form-item>
              <el-tooltip placement="top-start" effect="light">
                <div slot="content">
                  先使用满减，再用优惠券<br/>
                </div>
                <i class="icon-intro02"></i>
              </el-tooltip>
            </div>
          </div>
          <!--确定提交-->
          <div class="b_button">
          	<div class="marauto wid180">
          	<el-form-item>
    					<el-button type="primary" size="medium" @click="postfrom()">创建</el-button>
    					<el-button size="medium" @click="back()">返回</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
        <!--作用范围全场弹框-->
        <el-dialog title="排除商品或店铺" :visible.sync="rangeDialogVisible" width="980px" center>
          <span slot="title" class="Full-court-title">
            <span class="fl">排除商品或店铺</span>
            <span class="clear02 _bt">
              <span class="goods fl" :class="tab_flag == 'goods' ? 'bluecolor' : ''" @click="changeTab('goods')">
                商品
              </span>
              <span class="shop" :class="tab_flag == 'shop' ? 'bluecolor' : ''" @click="changeTab('shop')">
                店铺
              </span>
            </span>
            <span class="fr c_yx">
  					  已选 <span class="bluecolor02">{{removeGoodsList.length}}</span> 个商品，
              <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
  				  </span>
          </span>
          <!--商品-->
          <div class="Full-court-b_box" v-if="tab_flag == 'goods'">
            <div class="shopbox04">
              <div class="shopbox_top clear02">
                <el-input placeholder="请输入内容" v-model="goods_query_item.condition" style="width: 32%;">
                   <el-button slot="append" icon="el-icon-search" @click="goodsSelect()">搜索</el-button>
                </el-input>
                <el-select v-model="goods_query_item.dealerId" clearable placeholder="全部店铺" @change="goodsSelect()" class="ml15">
                  <el-option v-for="shop in shopResult.content"
                             :key="shop.dealerId"
                             :label="shop.shopName"
                             :value="shop.dealerId">
                  </el-option>
                </el-select>
                <el-select v-model="goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="goodsSelect()" class="ml15">
                  <el-option v-for="classify in classifyList"
                             :key="classify.classifyId"
                             :label="classify.classifyName"
                             :value="classify.classifyId">
                  </el-option>
                </el-select>
              </div>
              <div class="shopbox_cen clear02">
                <!-- 请判断有商品的时候显示 -->
                <div class="shopbox_have clear02" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                  <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                  <div v-for="(goods, index) in goodsResult.content" @click="removeGoods(goods)">
                    <div :class="['shopbox_have_box', 'fl', goods.isRemoved == 1 ? 'b_active' : '']">
                      <div class="wose shopbox_have_tit clear02">
                        <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                          <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                        </el-tooltip>
                        <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                      </div>
                      <div class="shopbox_have_img">
                        <div class="img fl mr10">
                          <img :src="goods.goodsImageUrl"/>
                        </div>
                        <div class="tit03 fl">店铺:
                          <el-tooltip :content="goods.shopName" placement="top-start" effect="light" v-if="goods.shopName.length > 6">
                            <span>{{goods.shopName.substring(0,6).concat('...')}}</span>
                          </el-tooltip>
                          <span v-if="goods.shopName.length <= 6">{{goods.shopName}}</span>
                        </div>
                        <div class="tit03 fl">价格:<span>¥{{goods.goodsPrice}}元</span></div>
                      </div>
                      <i :class="goods.isRemoved == 1 ? 'icon_selected' : ''"></i>
                    </div>
                  </div>
                </div>
                <!-- 请判断没有商品的时候显示 -->
                <div class="shopbox_no" v-else>
                  <div class="shopboxbg"></div>
                  <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                </div>
                <el-pagination v-if="goodsResult.content != null && goodsResult.content.length > 0"
                  @current-change="changeGoodsPageNo"
                  :current-page="goodsResult.pageNumber"
                  :page-size="8"
                  layout="total, prev, pager, next, jumper"
                  :total="goodsResult.totalCount">
                </el-pagination>
              </div>
            </div>
            <div class="Alreadychosen">
              <div class="Alreadychosen_t">
                已选 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
              </div>
              <div class="Alreadychosen_c overflowy">
                <!-- 没有选择任何商品的时候 -->
                <div class="Alreadychosen_c_none" v-if="removeGoodsList.length == 0">
                  还没有选择任何商品哦
                </div>
                <!-- 选择商品的时候 -->
                <div class="Alreadychosen_c_have" v-if="removeGoodsList.length > 0">
                  <div v-for="(removeGoods,index) in removeGoodsList">
                    <el-tooltip :content="removeGoods.goodsName" placement="top-start" effect="light">
                      <div class="img fl poi1">
                        <img :src="removeGoods.goodsImageUrl"/>
                        <div class="poi2 del_info" @click="deleteRemoveGoods(index, removeGoods)">X</div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="Full-court-b_box" v-if="tab_flag == 'shop'">
            <div class="shopbox04">
              <div class="shopbox_top clear02">
                <el-input placeholder="请输入店铺名称进行搜索" v-model="shop_query_item.dealerName" style="width: 32%;">
                  <el-button slot="append" icon="el-icon-search" @click="shopSelect()">搜索</el-button>
                </el-input>
                <el-select v-model="shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="shopSelect()" class="ml15">
                  <el-option v-for="shopClassify in shopClassifyList"
                             :key="shopClassify.dealerClassifyId"
                             :label="shopClassify.dealerClassifyName"
                             :value="shopClassify.dealerClassifyId">
                  </el-option>
                </el-select>
                <!--<span class="title ml15">最多选择30个店铺</span>-->
              </div>
              <div class="shopbox_cen clear02">
                <!-- 请判断有商品的时候显示 -->
                <div class="shopbox_have clear02" v-if="shopResult.content != null && shopResult.content.length > 0">
                  <!--控制点击的时候加上class名字b_active，就可以出现点击效果！！！-->
                  <div v-for="(shop, index) in shopResult.content" @click="removeShop(shop)">
                    <div :class="['shopbox_have_box', 'fl', shop.isRemoved == 1 ? 'b_active' : '']">
                      <div class="wose shopbox_have_tit clear02">
                        <el-tooltip :content="shop.shopName" placement="top-start" effect="light" v-if="shop.shopName.length > 15">
                          <span>{{shop.shopName.substring(0,15).concat('...')}}</span>
                        </el-tooltip>
                        <span v-if="shop.shopName.length <= 15">{{shop.shopName}}</span>
                      </div>
                      <div class="shopbox_have_img">
                        <div class="img fl mr10">
                          <img :src="shop.shopIcon"/>
                        </div>
                        <!--<div class="tit03 fl">店铺:-->
                          <!--<span v-if="shop.shopName.length > 6">{{shop.shopName.substring(0,6).concat('...')}}</span>-->
                          <!--<span v-else>{{shop.shopName}}</span>-->
                        <!--</div>-->
                        <div class="tit03 fl">商家:
                          <el-tooltip :content="shop.dealerName" placement="top-start" effect="light" v-if="shop.dealerName.length > 6">
                            <span>{{shop.dealerName.substring(0,6).concat('...')}}</span>
                          </el-tooltip>
                          <span v-if="shop.dealerName.length <= 6">{{shop.dealerName}}</span>
                        </div>
                      </div>
                      <i :class="shop.isRemoved == 1 ? 'icon_selected' : ''"></i>
                    </div>
                  </div>
                </div>
                <!-- 请判断没有商品的时候显示 -->
                <div class="shopbox_no" v-else>
                  <div class="shopboxbg"></div>
                  <div class="shopboxcen">暂时还没有店铺可供选择哦</div>
                </div>
                <el-pagination v-if="shopResult.content != null && shopResult.content.length > 0"
                  @current-change="changeShopPageNo"
                  :current-page="shopResult.pageNumber"
                  :page-size="8"
                  layout="total, prev, pager, next, jumper"
                  :total="shopResult.totalCount">
                </el-pagination>
              </div>
            </div>
            <div class="Alreadychosen">
              <div class="Alreadychosen_t">
                已选 <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
              </div>
              <div class="Alreadychosen_c overflowy">
                <!-- 没有选择任何店铺的时候 -->
                <div class="Alreadychosen_c_none" v-if="removeShopList.length == 0">
                  还没有选择任何店铺哦
                </div>
                <!-- 选择店铺的时候 -->
                <div class="Alreadychosen_c_have" v-if="removeShopList.length > 0">
                  <div class="wose ml10" v-for="(removeShop,index) in removeShopList">
                    <el-tag type="info" closable @close="deleteRemoveShop(index, removeShop)">
                      {{removeShop.shopName}}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="rangeDialogVisible = false">确 定</el-button>
            <el-button size="medium" @click="rangeDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <!--单独设置成本弹窗-->
        <el-dialog title="单独成本设置" :visible.sync="costDialogVisible" width="980px" center :close="scanShopCost">
          <div class="sigle_set clear02">
            <div class="sigle_set_left fl">
              <div class="sigle_set_left_t clear02">
                <el-input placeholder="请输入店铺名称" v-model="cost_shop_query_item.dealerName" class="coupon_input fl ">
                </el-input>
                <el-select v-model="cost_shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="costShopSelect()" class=" fl coupon_input">
                  <el-option v-for="shopClassify in shopClassifyList"
                             :key="shopClassify.dealerClassifyId"
                             :label="shopClassify.dealerClassifyName"
                             :value="shopClassify.dealerClassifyId">
                  </el-option>
                </el-select>
                <el-button icon="el-icon-search" class="fl mt7" type="" @click="costShopSelect()" style="padding: 9px"></el-button>
              </div>
              <div class="sigle_set_left_b clear02">
                <!--点击效果出现class名字b_active-->
                <div :class="['sigle_set_leftbox', 'fl', shop.isCost == true ? 'b_active' : '']" v-for="(shop, index) in costShopResult.content" @click="addShopCost(shop)">
                  <div class="tit06 wose02">{{shop.shopName}}</div>
                  <div class="s_img">
                    <img :src="shop.shopIcon"/>
                  </div>
                  <i :class="shop.isCost == true ? 'icon_selected' : ''"></i>
                </div>
              </div>
              <el-pagination v-if="costShopResult.content != null && costShopResult.content.length > 0"
                            @current-change="changeCostShopPageNo"
                            :current-page="costShopResult.pageNumber"
                            :page-size="12"
                            layout="total, prev, next, jumper"
                            :total="costShopResult.totalCount">
              </el-pagination>
            </div>
            <div class="sigle_set_right fr">
              <div class="sigle_set_right_t">成本设置</div>
              <div class="sigle_set_right_b">
                <div class="sigle_set_right_b_box fl" v-for="(cost,index) in dealerCostList">
                  <div class="sigle_set_right_b_box_t fl">
                    <div class="tit04 wose">{{cost.shopName}}</div>
                    <div class="tit05">
                      <span>平台承担:</span>
                      <input class="el-input__inner perce" v-model="cost.platform" :maxlength="3" @blur="dealerCostBlur('platform', cost)"/>%，
                      <span>店铺承担:</span>
                      <input class="el-input__inner perce" v-model="cost.dealer" :maxlength="3" @blur="dealerCostBlur('dealer', cost)"/>%
                    </div>
                  </div>
                  <div class="fr icon_delet02" @click="deleteShopCost(index, cost)"></div>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="scanShopCost">确 定</el-button>
            <el-button @click="scanShopCost">取 消</el-button>
          </span>
        </el-dialog>
      </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goods_all_show: false,
      shop_all_show: false,
      remove_goods_all_show: false,
      remove_shop_all_show: false,
      rangeDialogVisible: false,
      costDialogVisible: false,
      tab_flag: 'goods',
      goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
      goodsResult: '',
      chooseGoodsList: [],
      shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 查询商家条件
      cost_shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 成本设置商家
      shopResult: '',
      costShopResult: '',
      chooseShopList: [],
      classifyList: [],
      shopClassifyList: [],
      rangeClassifyList: [],
      showClassifyList: [],
      removeShopList: [],
      removeGoodsList: [],
      dealerCostList: [], // 商家单独成本设置
      couponParams: {
        coupon_id: '', // 优惠券业务ID
        coupon_name: '', // 优惠券名称
        expiration_time: [], // 有效期时间
        expiration_time_start: '', // 有效期开始时间
        expiration_time_end: '', // 有效期结束时间
        total_num: '', // 优惠券总数
        coupon_type: '1', // 优惠券类型，1：代金券，2：折扣券，3：分享券
        coupon_form: '1', // 优惠券形式，1：减钱，2：打折
        threshold_type: '1', // 门槛类型，1：金额，2：件数，3：无条件
        coupon_json: {threshold: '', money: ''}, // threshold:门槛金额/件数 // money:优惠券面值
        range_type: '2', // 作用范围，0：全场，1：商家，2：商品，3：品类
        dealer_ids: [],
        goods_ids: [],
        goods_classifys: [],
        remove_dealer_ids: [],
        remove_goods_ids: [],
        receive_type: '1',
        num_per_one: '1', // 每人限领总次数
        num_per_day: '1', // 每人每天限领次数
        cost_json: {platform: '', dealer: ''}, // 成本设置
        is_share: false,
        is_effect: 1,
        creator_type: 1, // 生成者类型，1：平台，2：商家
        creator: 'platform'// 生成者，平台或者商家ID
      },
      defaultProps: {
        children: 'subClassify',
        label: 'classifyName'
      },
      pickerOptions: {
        disabledDate (time) {
          let myDate = new Date()
          let year = myDate.getFullYear()
          let month = myDate.getMonth()
          let date = myDate.getDate()
          return time.getTime() < new Date(year, month, date).getTime()
        }
      }
    }
  },
  mounted () {
    let _this = this
    _this.changeRangeType('2')
  },
  created: function () {
    let _this = this
    _this.couponParams.coupon_id = _this.guid()
  },
  watch: {
    'couponParams.expiration_time': {
      handler (val, oldVal) {
        let _this = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          _this.couponParams.expiration_time_start = ''
          _this.couponParams.expiration_time_end = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 用于生成uuid
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid () {
      let _this = this
      return (_this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4() + _this.S4())
    },
    formatDate (date, fmt) {
      let that = this
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : that.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
    },
    // 打开全场弹框
    openRangeDailog () {
      let _this = this
      _this.rangeDialogVisible = true
      _this.changeTab('goods')
    },
    // 打开成本设置弹框
    openCostDailog () {
      let _this = this
      _this.costDialogVisible = true
      _this.cost_shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 12}
      _this.costShopSelect()
      _this.shopClassifySelect()
    },
    // 切换作用范围
    changeRangeType (rangeType) {
      let _this = this

      _this.chooseShopList = []
      _this.chooseGoodsList = []
      _this.rangeClassifyList = []
      _this.removeGoodsList = []
      _this.removeShopList = []

      if (rangeType === '0') { // 作用范围为全场
        _this.changeTab('goods')
      } else if (rangeType === '1') { // 作用范围为商家
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 10}
        _this.shopSelect()
        _this.shopClassifySelect()
      } else if (rangeType === '2') { // 作用范围为商品
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: '', pageNum: 1, rows: 10}
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 10000}
        _this.goodsSelect()
        _this.shopSelect()
        _this.classifySelect('-1')
      } else if (rangeType === '3') { // 作用范围为品类
        _this.classifySelect('-1')
      }
    },
    // 切换Tab
    changeTab (flag) {
      let _this = this
      _this.tab_flag = flag
      if (flag === 'goods') {
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: '', pageNum: 1, rows: 8}
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 10000}
        _this.goodsSelect()
        _this.classifySelect('-1')
        _this.shopSelect()
      } else if (flag === 'shop') {
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 8}
        _this.shopSelect()
        _this.shopClassifySelect()
      }
    },
    // 商品搜索
    goodsSelect () {
      let _this = this
      _this.api_businessManagePlatform_goodsSelect({
        data: {
          goodsClassifyId: _this.goods_query_item.goodsClassifyId,
          condition: _this.goods_query_item.condition,
          dealerId: _this.goods_query_item.dealerId,
          pageNum: _this.goods_query_item.pageNum,
          rows: _this.goods_query_item.rows
        }
      }).then(result => {
        for (let i = 0; i < result.content.length; i++) {
          result.content[i].isRemoved = 0
          result.content[i].isChoosed = 0
          for (let j = 0; j < _this.chooseGoodsList.length; j++) {
            if (result.content[i].goodsId === _this.chooseGoodsList[j].goodsId) {
              result.content[i].isChoosed = 1
            }
          }
          for (let j = 0; j < _this.removeGoodsList.length; j++) {
            if (result.content[i].goodsId === _this.removeGoodsList[j].goodsId) {
              result.content[i].isRemoved = 1
            }
          }
        }
        _this.goodsResult = result
      })
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/goods/choice',
//        data: {
//          goodsClassifyId: _this.goods_query_item.goodsClassifyId,
//          condition: _this.goods_query_item.condition,
//          dealerId: _this.goods_query_item.dealerId,
//          pageNum: _this.goods_query_item.pageNum,
//          rows: _this.goods_query_item.rows
//        },
//        success: function (result) {
//          for (let i = 0; i < result.content.length; i++) {
//            result.content[i].isRemoved = 0
//            result.content[i].isChoosed = 0
//            for (let j = 0; j < _this.chooseGoodsList.length; j++) {
//              if (result.content[i].goodsId === _this.chooseGoodsList[j].goodsId) {
//                result.content[i].isChoosed = 1
//              }
//            }
//            for (let j = 0; j < _this.removeGoodsList.length; j++) {
//              if (result.content[i].goodsId === _this.removeGoodsList[j].goodsId) {
//                result.content[i].isRemoved = 1
//              }
//            }
//          }
//          _this.goodsResult = result
//        }
//      })
    },
    // 商品查询改变分页页码
    changeGoodsPageNo (pageNo) {
      let _this = this
      _this.goods_query_item.pageNum = pageNo
      _this.goodsSelect()
    },
    // 店铺查询改变分页页码
    changeShopPageNo (pageNo) {
      let _this = this
      _this.shop_query_item.pageNum = pageNo
      _this.shopSelect()
    },
    // 成本设置店铺查询改变分页页
    changeCostShopPageNo (pageNo) {
      let _this = this
      _this.cost_shop_query_item.pageNum = pageNo
      _this.costShopSelect()
    },
    // 作用范围为商品,选择商品
    chooseGoods (goodsInfo) {
      let _this = this
      if (goodsInfo.isChoosed == 0) { // 未选中的商品被选中
        if (_this.chooseGoodsList.length < 30) {
          _this.chooseGoodsList.push(goodsInfo)
          goodsInfo.isChoosed = 1
        } else {
          _this.$message({
            message: '作用商品最多添加30个',
            type: 'warning'
          })
        }
      } else if (goodsInfo.isChoosed == 1) { // 已选中的商品被取消
        goodsInfo.isChoosed = 0
        for (let i = 0; i < _this.chooseGoodsList.length; i++) {
          if (_this.chooseGoodsList[i].goodsId == goodsInfo.goodsId) { // 该商品已在被选中商品列表中
            // 该商品是被取消的，需要从被选中商品列表删除
            _this.chooseGoodsList.splice(i, 1)
          }
        }
      }
    },
    // 作用范围为商品,删除商品
    deleteGoods (index, chooseGoods) {
      let _this = this
      _this.chooseGoodsList.splice(index, 1)
      for (let i = 0; i < _this.goodsResult.content.length; i++) {
        if (_this.goodsResult.content[i].goodsId === chooseGoods.goodsId) {
          _this.goodsResult.content[i].isChoosed = 0
        }
      }
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
      })
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/goods/classify/tree',
//        data: {
//          parentClassifyId: parentClassifyId
//        },
//        success: function (result) {
//          _this.classifyList = result.content
//        }
//      })
    },
    // 获取已选择的品类
    getCheckedNodes (data, checked, indeterminate) {
      let _this = this
      let nodes = _this.$refs.classifyTree.getCheckedNodes()
      let ids = _this.$refs.classifyTree.getCheckedKeys()
      _this.rangeClassifyList = []
      _this.showClassifyList = []
      for (let i = 0; i < nodes.length; i++) {
        let classify = {}
        classify.classifyId = nodes[i].classifyId
        classify.classifyName = nodes[i].classifyName
        _this.rangeClassifyList.push(classify)
        if (ids.indexOf(nodes[i].parentClassifyId) === -1) { // 不包含该节点父节点
          _this.showClassifyList.push(classify)
        }
      }
    },
    // 商家筛选
    shopSelect () {
      let _this = this
      _this.api_businessManagePlatform_dealerShopSelect({
        data: {
          dealerName: _this.shop_query_item.dealerName,
          dealerClassify: _this.shop_query_item.dealerClassify,
          dealerId: _this.shop_query_item.dealerId,
          rows: _this.shop_query_item.rows,
          pageNum: _this.shop_query_item.pageNum
        }
      }).then(result => {
        for (let i = 0; i < result.content.length; i++) {
          result.content[i].isChoosed = 0
          result.content[i].isRemoved = 0
          for (let j = 0; j < _this.chooseShopList.length; j++) {
            if (result.content[i].dealerId == _this.chooseShopList[j].dealerId) {
              result.content[i].isChoosed = 1
            }
          }
          for (let j = 0; j < _this.removeShopList.length; j++) {
            if (result.content[i].dealerId == _this.removeShopList[j].dealerId) {
              result.content[i].isRemoved = 1
            }
          }
        }
        _this.shopResult = result
      })
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/shop/sys/shop',
//        data: {
//          dealerName: _this.shop_query_item.dealerName,
//          dealerClassify: _this.shop_query_item.dealerClassify,
//          dealerId: _this.shop_query_item.dealerId,
//          rows: _this.shop_query_item.rows,
//          pageNum: _this.shop_query_item.pageNum
//        },
//        success: function (result) {
//          for (let i = 0; i < result.content.length; i++) {
//            result.content[i].isChoosed = 0
//            result.content[i].isRemoved = 0
//            for (let j = 0; j < _this.chooseShopList.length; j++) {
//              if (result.content[i].dealerId == _this.chooseShopList[j].dealerId) {
//                result.content[i].isChoosed = 1
//              }
//            }
//            for (let j = 0; j < _this.removeShopList.length; j++) {
//              if (result.content[i].dealerId == _this.removeShopList[j].dealerId) {
//                result.content[i].isRemoved = 1
//              }
//            }
//          }
//          _this.shopResult = result
//        }
//      })
    },
    // 成本设置商家筛选
    costShopSelect () {
      let _this = this
      _this.api_businessManagePlatform_dealerShopSelect({
        data: {
          dealerName: _this.cost_shop_query_item.dealerName,
          dealerClassify: _this.cost_shop_query_item.dealerClassify,
          dealerId: _this.cost_shop_query_item.dealerId,
          rows: _this.cost_shop_query_item.rows,
          pageNum: _this.cost_shop_query_item.pageNum
        }
      }).then(result => {
        for (let i = 0; i < result.content.length; i++) {
          result.content[i].isCost = false
          for (let j = 0; j < _this.dealerCostList.length; j++) {
            if (result.content[i].dealerId === _this.dealerCostList[j].dealerId) {
              result.content[i].isCost = true
            }
          }
        }
        _this.costShopResult = result
      })
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/shop/sys/shop',
//        data: {
//          dealerName: _this.cost_shop_query_item.dealerName,
//          dealerClassify: _this.cost_shop_query_item.dealerClassify,
//          dealerId: _this.cost_shop_query_item.dealerId,
//          rows: _this.cost_shop_query_item.rows,
//          pageNum: _this.cost_shop_query_item.pageNum
//        },
//        success: function (result) {
//          for (let i = 0; i < result.content.length; i++) {
//            result.content[i].isCost = false
//            for (let j = 0; j < _this.dealerCostList.length; j++) {
//              if (result.content[i].dealerId === _this.dealerCostList[j].dealerId) {
//                result.content[i].isCost = true
//              }
//            }
//          }
//          _this.costShopResult = result
//        }
//      })
    },
    // 店铺分类搜索
    shopClassifySelect () {
      let _this = this
      _this.api_businessManagePlatform_dealerSecondClassify({
        data: {}
      }).then(result => {
        _this.shopClassifyList = result.content
      })
//      $.ajax({
//        type: 'get',
//        url: _this.BASE_URL + 'm2c.scm/dealerclassify/sys/dealer/all/second/classify',
//        success: function (result) {
//          _this.shopClassifyList = result.content
//        }
//      })
    },
    // 作用范围为店铺,选择店铺
    chooseShop (shop) {
      let _this = this
      if (shop.isChoosed == 0) { // 该店铺原为未选中，现在被选中
        if (_this.chooseShopList.length < 30) {
          _this.chooseShopList.push(shop)
          shop.isChoosed = 1
        } else {
          _this.$message({
            message: '作用店铺最多添加30个',
            type: 'warning'
          })
        }
      } else if (shop.isChoosed == 1) { // 该店铺原为被选中，现在被取消
        shop.isChoosed = 0
        for (let j = 0; j < _this.chooseShopList.length; j++) {
          if (_this.chooseShopList[j].dealerId == shop.dealerId) {
            _this.chooseShopList.splice(j, 1)
          }
        }
      }
    },
    // 作用范围为店铺,删除店铺
    deleteShop (index, chooseShop) {
      let _this = this
      _this.chooseShopList.splice(index, 1)
      for (let i = 0; i < _this.shopResult.content.length; i++) {
        if (_this.shopResult.content[i].dealerId === chooseShop.dealerId) {
          _this.shopResult.content[i].isChoosed = 0
        }
      }
    },
    // 作用范围为品类，删除品类
    deleteClassify (index, classify) {
      let _this = this
      _this.$refs.classifyTree.setChecked(classify.classifyId, false, true)
    },
    // 作用范围为全场，添加被排除商品
    removeGoods (goodsInfo) {
      let _this = this
      if (goodsInfo.isRemoved == 0) { // 未选中的商品被排除
//        if (_this.removeGoodsList.length < 30) {
        _this.removeGoodsList.push(goodsInfo)
        goodsInfo.isRemoved = 1
//        } else {
//          _this.$message({
//            message: '最多排除30个商品',
//            type: 'warning'
//          })
//        }
      } else if (goodsInfo.isRemoved == 1) { // 已排除的商品被取消
        goodsInfo.isRemoved = 0
        for (let i = 0; i < _this.removeGoodsList.length; i++) {
          if (_this.removeGoodsList[i].goodsId == goodsInfo.goodsId) { // 该商品已在被排除商品列表中
            // 该商品是被取消的，需要从被选中商品列表删除
            _this.removeGoodsList.splice(i, 1)
          }
        }
      }
    },
    // 作用范围为全场，添加被排除店铺
    removeShop (shopInfo) {
      let _this = this
      if (shopInfo.isRemoved == 0) { // 未选中的店铺被排除
//        if (_this.removeShopList.length < 30) {
        _this.removeShopList.push(shopInfo)
        shopInfo.isRemoved = 1
//        } else {
//          _this.$message({
//            message: '最多排除30个店铺',
//            type: 'warning'
//          })
//        }
      } else if (shopInfo.isRemoved == 1) { // 已排除的店铺被取消
        shopInfo.isRemoved = 0
        for (let i = 0; i < _this.removeShopList.length; i++) {
          if (_this.removeShopList[i].dealerId == shopInfo.dealerId) { // 该店铺已在被排除店铺列表中
            // 该店铺是被取消的，需要从被排除店铺列表删除
            _this.removeShopList.splice(i, 1)
          }
        }
      }
    },
    // 作用范围为全场,删除已排除商品
    deleteRemoveGoods (index, removeGoods) {
      let _this = this
      _this.removeGoodsList.splice(index, 1)
      for (let i = 0; i < _this.goodsResult.content.length; i++) {
        if (_this.goodsResult.content[i].goodsId === removeGoods.goodsId) {
          _this.goodsResult.content[i].isRemoved = 0
        }
      }
    },
    // 作用范围为全场,删除已排除店铺
    deleteRemoveShop (index, removeShop) {
      let _this = this
      _this.removeShopList.splice(index, 1)
      for (let i = 0; i < _this.shopResult.content.length; i++) {
        if (_this.shopResult.content[i].dealerId === removeShop.dealerId) {
          _this.shopResult.content[i].isRemoved = 0
        }
      }
    },
    // 添加店铺成本设置
    addShopCost (shop) {
      let _this = this
      if (shop.isCost == false) { // 该店铺原为未选中，现在被选中
        let shopCost = {}
        shopCost.dealerId = shop.dealerId
        shopCost.shopName = shop.shopName
        shopCost.platform = ''
        shopCost.dealer = ''
        _this.dealerCostList.push(shopCost)
        shop.isCost = true
      }
    },
    // 扫描店铺单独成本设置，排除为空和不合格的设置条目
    scanShopCost (done) {
      let _this = this
      for (let i = _this.dealerCostList.length - 1; i >= 0; i--) {
        let cost = _this.dealerCostList[i]
        if (cost.platform === '' ||
          parseInt(cost.platform) < 0 ||
          parseInt(cost.platform) > 100 ||
          cost.dealer === '' ||
          parseInt(cost.dealer) < 0 ||
          parseInt(cost.dealer) > 100 ||
          (cost.platform !== '' && cost.dealer !== '' && 100 - parseInt(cost.platform) !== parseInt(cost.dealer))) {
          _this.dealerCostList.splice(i, 1)
        }
      }
      _this.costDialogVisible = false
    },
    // 删除店铺单独成本设置
    deleteShopCost (index, cost) {
      let _this = this
      _this.dealerCostList.splice(index, 1)
      for (let i = 0; i < _this.costShopResult.content.length; i++) {
        if (_this.costShopResult.content[i].dealerId === cost.dealerId) {
          _this.costShopResult.content[i].isCost = false
        }
      }
    },
    // 拼接选中商品IDs
    makeGoodsIds () {
      let _this = this
      _this.couponParams.goods_ids = []
      for (let i = 0; i < _this.chooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.chooseGoodsList[i].goodsId
        goodsItem.entityName = _this.chooseGoodsList[i].goodsName
        _this.couponParams.goods_ids.push(goodsItem)
      }
    },
    // 拼装作用范围商家参数
    makeDealerIds () {
      let _this = this
      _this.couponParams.dealer_ids = []
      for (let i = 0; i < _this.chooseShopList.length; i++) {
        let dealer = {}
        dealer.dealerId = _this.chooseShopList[i].dealerId
        dealer.entityName = _this.chooseShopList[i].shopName
        _this.couponParams.dealer_ids.push(dealer)
      }
    },
    // 拼装作用范围品类参数
    makeClassifyIds () {
      let _this = this
      _this.couponParams.goods_classifys = []
      for (var i = 0; i < _this.rangeClassifyList.length; i++) {
        let classify = {}
        classify.categoryId = _this.rangeClassifyList[i].classifyId
        classify.entityName = _this.rangeClassifyList[i].classifyName
        _this.couponParams.goods_classifys.push(classify)
      }
    },
    // 拼装作用范围全场参数
    makeRemoveIds () {
      let _this = this
      _this.couponParams.remove_goods_ids = []
      _this.couponParams.remove_dealer_ids = []
      for (let i = 0; i < _this.removeGoodsList.length; i++) {
        let removeGoods = {}
        removeGoods.goodsId = _this.removeGoodsList[i].goodsId
        removeGoods.entityName = _this.removeGoodsList[i].goodsName
        _this.couponParams.remove_goods_ids.push(removeGoods)
      }
      for (let i = 0; i < _this.removeShopList.length; i++) {
        let removeDealer = {}
        removeDealer.dealerId = _this.removeShopList[i].dealerId
        removeDealer.entityName = _this.removeShopList[i].shopName
        _this.couponParams.remove_dealer_ids.push(removeDealer)
      }
    },
    // 发送添加请求
    postfrom () {
      let _this = this
      let flag = _this.formValidator(0)
      if (flag) {
        _this.makeGoodsIds()
        _this.makeDealerIds()
        _this.makeClassifyIds()
        _this.makeRemoveIds()
        let rebody = {
          coupon_id: _this.couponParams.coupon_id,
          coupon_type: _this.couponParams.coupon_type,
          coupon_name: _this.couponParams.coupon_name,
          coupon_total: _this.couponParams.total_num,
          expiration_time_start: _this.couponParams.expiration_time_start,
          expiration_time_end: _this.couponParams.expiration_time_end,
          coupon_form: _this.couponParams.coupon_form,
          threshold_type: _this.couponParams.threshold_type,
          coupon_json: JSON.stringify(_this.couponParams.coupon_json),
          range_type: _this.couponParams.range_type,
          dealer_ids: JSON.stringify(_this.couponParams.dealer_ids),
          goods_ids: JSON.stringify(_this.couponParams.goods_ids),
          goods_categories: JSON.stringify(_this.couponParams.goods_classifys),
          remove_goodsIds: JSON.stringify(_this.couponParams.remove_goods_ids),
          remove_dealerIds: JSON.stringify(_this.couponParams.remove_dealer_ids),
          num_per_one: _this.couponParams.num_per_one,
          num_per_day: _this.couponParams.num_per_day,
          is_effect: _this.couponParams.is_effect,
          with_other_cut: _this.couponParams.is_share === true ? 1 : 0,
          cost_json: JSON.stringify(_this.couponParams.cost_json),
          dealer_cost_list: JSON.stringify(_this.dealerCostList),
          receive_type: _this.couponParams.receive_type,
          creator_type: _this.couponParams.creator_type,
          creator: _this.couponParams.creator
        }
        console.log('rebody:', JSON.stringify(rebody))
        _this.api_businessManagePlatform_couponCreation({
          data: JSON.stringify(rebody),
          headers: {'Content-Type': 'application/json'}
        }).then(result => {
          console.log('status:', result.status)
          _this.$router.push({path: '/m/marketTool/couponList'})
        })
//        $.ajax({
//          url: _this.BASE_URL + 'm2c.market/admin/coupon/creation',
//          contentType: 'application/json', // 必须有
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          type: 'post',
//          data: JSON.stringify(rebody),
//          success: function (result) {
//            if (result.status == 200) {
//              console.log('status:', result.status)
//              _this.$router.push({path: '/m/marketTool/couponList'})
//            }
//          }
//        })
      }
    },
    // 商家成本失去焦点验证
    dealerCostBlur (flag, cost) {
      if (flag === 'platform') {
        if (cost.platform === '' || !/^(0|[1-9][0-9]?|100)$/.test(cost.platform)) {
          cost.platform = ''
        } else {
          cost.dealer = 100 - cost.platform
        }
      }
      if (flag === 'dealer') {
        if (cost.dealer === '' || !/^(0|[1-9][0-9]?|100)$/.test(cost.dealer)) {
          cost.dealer = ''
        } else {
          cost.platform = 100 - cost.dealer
        }
      }
    },
    // 提交验证
    formValidator (flag) {
      let _this = this
      // flag--1:名称，2：总数，3：时间,4:面值，5：每人次数,6:每天次数,7:平台成本,8:商家成本，9：门槛
      if (flag == 0 || flag == 1) {
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{1,22}$/.test(_this.couponParams.coupon_name)) {
          _this.warning('名称只能为汉字数字英文特殊字符,不能为空')
          return false
        }
        let realLength = _this.getStrLength(_this.couponParams.coupon_name)
        if (realLength > 11) {
          _this.warning('优惠券名称不能超过11个字')
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        if (_this.couponParams.total_num == '') {
          _this.couponParams.total_num = 0
        }
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.total_num)) {
          _this.couponParams.total_num = 0
          _this.warning('优惠券数量最多5位正整数，填0为不限制数量')
          return false
        }
      }
      if (flag == 0 || flag == 3) {
        if (_this.couponParams.expiration_time != null && _this.couponParams.expiration_time.length > 0) {
          _this.couponParams.expiration_time_start = _this.formatDate(_this.couponParams.expiration_time[0], 'yyyy-MM-dd')
          _this.couponParams.expiration_time_end = _this.formatDate(_this.couponParams.expiration_time[1], 'yyyy-MM-dd')
        }
        if (_this.couponParams.expiration_time_start == '' || _this.couponParams.expiration_time_end == '') {
          _this.warning('有效期时间不能为空')
          return false
        }
      }
      if (flag == 0 || flag == 4) {
        if (!/^([1-9]\d{0,2}|1000)$/.test(_this.couponParams.coupon_json.money)) {
          _this.couponParams.coupon_json.money = ''
          _this.warning('优惠券面值为最多1000正整数')
          return false
        }
        if (_this.couponParams.coupon_json.threshold !== '' &&
          _this.couponParams.coupon_json.money !== '' &&
          _this.couponParams.threshold_type === '1' &&
          parseInt(_this.couponParams.coupon_json.threshold) <= parseInt(_this.couponParams.coupon_json.money)) {
          _this.warning('优惠券优惠金额不能大于门槛金额')
          return false
        }
      }
      if (flag == 0 || flag == 9) {
        if (_this.couponParams.threshold_type === '1') {
          if (!/^[1-9]\d{0,3}$/.test(_this.couponParams.coupon_json.threshold)) {
            _this.couponParams.coupon_json.threshold = ''
            _this.warning('优惠券门槛为正整数，最多9999元')
            return false
          }
          if (_this.couponParams.coupon_json.threshold !== '' &&
            _this.couponParams.coupon_json.money !== '' &&
            parseInt(_this.couponParams.coupon_json.threshold) <= parseInt(_this.couponParams.coupon_json.money)) {
            _this.warning('优惠券优惠金额不能大于门槛金额')
            return false
          }
        } else if (_this.couponParams.threshold_type === '2') {
          if (!/^([1-9]\d{0,1}|100)$/.test(_this.couponParams.coupon_json.threshold)) {
            _this.couponParams.coupon_json.threshold = ''
            _this.warning('优惠券门槛为正整数，最多100件')
            return false
          }
        } else {
          _this.couponParams.coupon_json.threshold = 0
        }
      }
      if (flag == 0 || flag == 5) {
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.num_per_one) ||
          parseInt(_this.couponParams.num_per_one) < 1 ||
          (parseInt(_this.couponParams.total_num) > 0 && parseInt(_this.couponParams.num_per_one) > parseInt(_this.couponParams.total_num))) {
          _this.warning('每人领取优惠券次数必须大于0且小于优惠券发行张数')
          _this.couponParams.num_per_one = 1
          return false
        }
      }
      if (flag == 0 || flag == 6) {
        if (!/^[0-9]{1,5}$/.test(_this.couponParams.num_per_day) ||
          parseInt(_this.couponParams.num_per_day) < 1 ||
          parseInt(_this.couponParams.num_per_day) > parseInt(_this.couponParams.num_per_one)) {
          _this.warning('每人每天领取优惠券次数必须大于0且小于每人领取优惠券次数')
          _this.couponParams.num_per_day = 1
          return false
        }
      }
      if (flag == 0 || flag == 7) {
        if (_this.couponParams.cost_json.platform === '' ||
          parseInt(_this.couponParams.cost_json.platform) < 0 ||
          parseInt(_this.couponParams.cost_json.platform) > 100) {
          _this.couponParams.cost_json.platform = ''
        }
        if (!/^(0|[1-9][0-9]?|100)$/.test(_this.couponParams.cost_json.platform)) {
          _this.couponParams.cost_json.platform = ''
        }
        if (_this.couponParams.cost_json.platform !== '' && parseInt(_this.couponParams.cost_json.platform) >= 0 && parseInt(_this.couponParams.cost_json.platform) <= 100) {
          _this.couponParams.cost_json.dealer = 100 - _this.couponParams.cost_json.platform
        }
      }
      if (flag == 0 || flag == 8) {
        if (_this.couponParams.cost_json.dealer === '' ||
          parseInt(_this.couponParams.cost_json.dealer) < 0 ||
          parseInt(_this.couponParams.cost_json.dealer) > 100) {
          _this.couponParams.cost_json.dealer = ''
        }
        if (!/^(0|[1-9][0-9]?|100)$/.test(_this.couponParams.cost_json.dealer)) {
          _this.couponParams.cost_json.dealer = ''
        }
        if (_this.couponParams.cost_json.dealer !== '' && parseInt(_this.couponParams.cost_json.dealer) >= 0 && parseInt(_this.couponParams.cost_json.dealer) <= 100) {
          _this.couponParams.cost_json.platform = 100 - _this.couponParams.cost_json.dealer
        }
      }
      if (flag == 0) {
        if (_this.couponParams.range_type == 1 && (_this.chooseShopList.length <= 0)) {
          _this.warning('作用范围为商家时已选商家不能为空')
          return false
        }
        if (_this.couponParams.range_type == 2 && (_this.chooseGoodsList.length <= 0)) {
          _this.warning('作用范围为商品时已选商品不能为空')
          return false
        }
        if (_this.couponParams.range_type == 3 && (_this.rangeClassifyList.length <= 0)) {
          _this.warning('作用范围为品类时已选品类不能为空')
          return false
        }
        if (_this.dealerCostList.length > 0) {
          if (_this.couponParams.cost_json.platform === '' || _this.couponParams.cost_json.dealer === '') {
            _this.warning('请填写通用成本设置')
            return false
          }
          let costList = _this.dealerCostList
          for (var i = costList.length - 1; i >= 0; i--) {
            if (costList[i].platform === '' ||
              parseInt(costList[i].platform) < 0 ||
              parseInt(costList[i].platform) > 100 ||
              costList[i].dealer === '' ||
              parseInt(costList[i].dealer) < 0 ||
              parseInt(costList[i].dealer) > 100 ||
              (costList[i].platform !== '' && costList[i].dealer !== '' && 100 - parseInt(costList[i].platform) !== parseInt(costList[i].dealer))) {
              _this.dealerCostList.splice(i, 1)
              _this.warning('平台承担成本和商家承担成本不能为空且和必须为100')
              return false
            }
          }
        } else {
          if (_this.couponParams.cost_json.platform === '' || _this.couponParams.cost_json.dealer === '') {
            _this.couponParams.cost_json.platform = 100
            _this.couponParams.cost_json.dealer = 0
          }
        }
      }
      return true
    },
    // 验证提示
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
    },
    back () {
      let _this = this
      _this.$message.closeAll()
      _this.$router.push({path: '/m/marketTool/couponList'})
    },
    getStrLength (str) {
      let realLength = 0
      if (str && str.trim().length > 0) {
        str = str.trim()
        for (let i = 0; i < str.length; i++) {
          let charCode = str.charCodeAt(i)
          if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
            realLength += 0.5
          } else {
            realLength += 1
          }
        }
        return realLength
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .yhxz_container{
    padding: 15px 26px;
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
    .c_yx{
      padding-right: 40px;
      font-size: 14px;
      color: #777777;
    }
    .Full-court-b_box{
      width: 100%;
      /*height: 350px;*/
      .shopbox04{
        /*height: 350px;*/
        border:1px solid #E6E8F2;
        border-radius: 3px;
        .shopbox_top{
          min-height: 50px;
          line-height: 50px;
          background:rgba(249,250,254,1);
          padding-left: 10px;
          padding-right: 20px;
          border-bottom: 1px solid #E6E8F2;
          /*padding-top: 10px;*/
          .title{
            width:120px;
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(136,186,244,1);
            display: inline-block;
            line-height: 32px;
          }
          .b_input-with{
            width: 100%!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
        }
        .shopbox_cen{
          height: 305px;
          overflow-y: auto;
          padding: 10px;
          .shopbox_no{
            width: 100%;
            height: 90%;
            .shopboxbg{
              width: 100%;
              height: 50%;
              background: url(../../../../../../static/images/businessManage/icon_none.png) no-repeat center bottom;
            }
            .shopboxcen{
              text-align: center;
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:rgba(204,204,204,1);
              margin-top: 20px;
            }
          }
          .shopbox_have{
            width: 100%;
            height: 88%;
            overflow-y: auto;
            .shopbox_have_box{
              width: 224px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
                display: block;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                height: 78px;
                padding: 5px;
                .img{
                  width:60px;
                  height:60px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .tit03{
                  width: 60%;
                  font-size:12px;
                  font-family:PingFangSC-Regular;
                  color:rgba(0,0,0,1);
                  line-height:17px;
                  min-width: 100px;
                }
              }
            }
            .shopbox_have_box:hover{
              border:1px solid #0086FF;
            }
          }
        }
      }
      .Alreadychosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 0px;
        min-height: 115px;
        .Alreadychosen_t{
         /* width: 100%;*/
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
      }
    }
    .Full-court-title{
      font-size:16px;
      font-family:PingFangSC-Medium;
      color:rgba(119,119,119,1);
      line-height:32px;
      span{
        line-height: 32px;
        display: inline-block;
      }
      ._bt{
        /*	width: 120px;*/
        height: 32px;
        display: inline-block;
        line-height: 32px;
        border: 1px solid #E6E8F2;
      }
      .goods{
        width: 60px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid #E6E8F2;
        cursor: pointer;
      }
      .shop{
        width: 60px;
        display: inline-block;
        text-align: center;
        border-right: 1px solid #E6E8F2;
        cursor: pointer;
      }
    }
    .sigle_set{
      width: 100%;
      min-height: 640px;
      .sigle_set_left{
        width: 450px;
        height: 600px;
        border: 1px solid #E6E8F2;
        cursor: pointer;
        .sigle_set_left_t{
         /* width: 100%;*/
         /* height: 50px;*/
          background:rgba(249,250,254,1);
          border-radius: 3px 3px 0px 0px;
          border-bottom:1px solid #E6E8F2;
          padding-top:8px;
          padding-left:5px;
          padding-bottom: 8px;
          .single_input-with{
            width: 192px!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
        }
        .sigle_set_left_b{
          padding: 10px;
          overflow-y: auto;
          /*width: 100%;*/
          height: 480px;
          .sigle_set_leftbox{
            width: 90px;
            height: 140px;
            border: 1px solid #E6E8F2;
            margin-right: 10px;
            margin-bottom: 10px;
            .tit06{
              font-size:12px;
              font-family:PingFangSC-Regular;
              color:rgba(0,0,0,1);
              line-height:24px;
              padding-left: 5px;
              border-bottom: 1px solid #E6E8F2;
              height: 48px;
              width: 100%;
            }
            .s_img{
              padding-top: 15px;
              padding-left: 15px;
              img{
                width: 60px;
                height: 60px;
              }

            }
          }
        }
      }
      .sigle_set_right{
        width: 450px;
        height: 600px;
        border: 1px solid #E6E8F2;
        .sigle_set_right_t{
          /*width: 100%;*/
          height: 50px;
          background: #f9fafe;
          line-height: 50px;
          padding-left: 10px;
          color: #999999;
          font-size: 14px;
          border-bottom: 1px solid #E6E8F2;
        }
        .sigle_set_right_b{
          padding: 10px;
          overflow-y: auto;
          /*width: 100%;*/
          height: 550px;
          .sigle_set_right_b_box{
            width: 95%;
            /*height: 50px;*/
            padding: 10px;
            border: 1px solid #F5F5F5;
            background:rgba(245,245,245,1);
            border-radius: 2px;
            text-align: left;
            margin-bottom: 10px;
            .sigle_set_right_b_box_t{
              font-size: 12px;
              width: 80%;
              .tit04{
                color: #000000;
              }
              .tit05{
                color: #777777;
                .perce{
                  width:55px!important ;
                  height: 30px!important;
                }
              }
            }
            .icon_delet02{
              width: 16px;
              height: 20px;
              display: inline-block;
              background: url(../../../../../../static/images/businessManage/icon_delet02.png) no-repeat center;
              margin-top: 20px;
              cursor: pointer;
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
    .b_active{
        border: 1px solid #0086FF!important;
        position: relative;
        .icon_selected{
          position: absolute;
          background: url(../../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
          width:18px;
          height:18px;
          right: 0px;
          bottom: 0px;
        }
      }
    .BasicinFormation{
      background-color: #fff;
      padding: 20px 34px;
      /*padding-: 28px;*/
      margin-bottom: 10px;
      .Basicinbt{
        font-size:16px;
        font-family:PingFangSC-Medium;
        color:rgba(0,0,0,1);
      }
      .icon-intro02{
        width: 15px;
        height: 15px;
        background: url(../../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
        display: inline-block;
        margin-top: 12px;
      }
      .tit{
        display: inline-block;
        width:280px;
        height:34px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(204,204,204,1);
        line-height:17px;
        /*padding-left:80px;*/
      }
      .tit01{
        font-size:14px;
        font-family:PingFangSC-Regular;
        color:rgba(153,153,153,1);
        line-height:40px;
        display: inline-block;
      }
      .Alreadychosenshop{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        height: 220px;
        .Alreadychosenshop_t{
          /*width: 100%;*/
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
              width: 390px;
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
      .shopbox{
        /*width: 980px;*/
        /*height: 350px;*/
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        .shopbox_top{
          min-height: 50px;
          line-height: 50px;
          background:rgba(249,250,254,1);
          padding-left: 10px;
          padding-right: 20px;
          border-bottom: 1px solid #E6E8F2;
          /*padding-top: 10px;*/
          .title{
            width:120px;
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(136,186,244,1);
            display: inline-block;
            line-height: 32px;
          }
          .b_input-with{
            width: 100%!important;
            height: 32px!important;
            line-height: 32px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
          }
          .b_select{
            width: 150px!important;
            height: 32px!important;
            margin-left: 10px;
          }
          .sort{
            width:60px;
            height:32px;
            background:rgba(255,255,255,1);
            border-radius: 0px 2px 2px 0px ;
            line-height: 32px;
            color:rgba(0,134,255,1);
            font-size: 14px;
            display: inline-block;
            text-align: center;
            border-radius: 4px;
            border: 1px solid #d8dce5;
            border-left: none;
            border-top-left-radius: 0px;
            border-bottom-left-radius:0px;
          }
        }
        .shopbox_cen{
          height: 300px;
          /*overflow-y: auto;*/
          padding: 10px;
          .shopbox_no{
            width: 100%;
            height: 90%;
            .shopboxbg{
              width: 100%;
              height: 50%;
              background: url(../../../../../../static/images/businessManage/icon_none.png) no-repeat center bottom;
            }
            .shopboxcen{
              text-align: center;
              font-size:14px;
              font-family:PingFangSC-Regular;
              color:rgba(204,204,204,1);
              margin-top: 20px;
            }
          }
          .shopbox_have{
            width: 100%;
            height: 88%;
            overflow-y: auto;
            .shopbox_have_box{
              width: 224px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
                display: block;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                width: 100%;
                height: 78px;
                padding: 5px;
                .img{
                  width:60px;
                  height:60px;
                  img{
                    width: 100%;
                    height: 100%;
                  }
                }
                .tit03{
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                line-height:17px;
                  min-width: 100px;
                }
              }
            }
            .shopbox_have_box:hover{
              border:1px solid #0086FF;
            }
          }
        }
      }
      .Full-court_container{
        margin-left: 75px;
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
        .Full-court01{
          height: 50px;
          border: 1px solid #E6E8F2;
          background: #F9FAFE;
          line-height: 50px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:rgba(153,153,153,1);
          padding-left: 17px;
          .button{
            width:120px;
            height:30px;
            background:rgba(255,255,255,1);
            border-radius: 2px ;
            text-align: center;
            border: 1px solid #E6E8F2;
            color:#73A9E8 ;
            display: inline-block;
            line-height: 30px;
            cursor: pointer;
          }

        }
        .Alreadychosen{
          margin-left: initial;
        }
      }
      .category_container{
        padding-left: 80px;
        .category_container_l{
          width: 430px;
          height: 380px;
          border: 1px solid #E6E8F2;
          margin-right: 20px;
          .category_container_l_t{
           /* width: 100%;*/
            height: 32px;
            line-height: 32px;
            padding-left: 15px;
            color: #999;
            font-size: 14px;
            border-bottom:1px solid #E6E8F2;
            background:rgba(249,250,254,1);
            border-radius: 3px 3px 0px 0px ;
            .tit07{
              font-size:12px;
              font-family:PingFangSC-Regular;
              color:rgba(136,186,244,1);
            }
          }
          .category_container_l_b{
           /* width: 100%;*/
            height: 325px;
            overflow-y: auto;
            padding: 10px 20px;
          }
        }
        .category_container_r{
          width: 250px;
          height: 380px;
          border: 1px solid #E6E8F2;
          .category_container_r_t{
            /*width: 100%;*/
            height: 32px;
            line-height: 32px;
            padding-left: 15px;
            color: #999;
            font-size: 14px;
            border-bottom:1px solid #E6E8F2;
            background:rgba(249,250,254,1);
            border-radius: 3px 3px 0px 0px ;
            .tit08{
              color: #006FFF;
            }
          }
          .category_container_r_b{
            /*width: 100%;*/
            height: 348px;
            overflow-y: auto;
            padding: 10px;
            .category_container_r_box:hover .tit09{
              display: block;
            }
            .category_container_r_box{
             /* width:100%;*/
              height:28px;
              background:rgba(245,245,245,1);
              border-radius: 2px ;
              font-size:12px;
              font-family:PingFangSC-Medium;
              color:rgba(0,0,0,1);
              line-height:28px;
              padding-left: 5px;
              padding-right: 5px;
              margin-bottom: 5px;
              .tit09{
                display: none;
                color: #73A9E8;
                cursor: pointer;
              }
            }
          }
        }
      }
      .Alreadychosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 75px;
        min-height: 115px;
        .Alreadychosen_t{
          /*width: 100%;*/
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
          min-height: 83px;
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
      .title02{
        width:322px;
        height:40px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        color:rgba(153,153,153,1);
        line-height:20px;
        margin-left: 75px;
      }
      .pl28{
        padding-left: 28px;
      }
      .ml66{
        margin-left: 66px;
      }
    }
  }
  .name_style{
    display:  inline-block;
    line-height: 20px;
    color:  #ccc;
    width:  260px;
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
  .mt2{
    margin-top: 2px;
  }
  .mt5{
    margin-top: 6px;
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
  .ml15{
    margin-left: 15px;
  }
  .ml20{
    margin-left: 20px;
  }
  .ml29{
    margin-left: 29px;
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
  }
  .ml60{
    margin-left: 60px;
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
  .mb100{
    margin-bottom: 100px!important;
  }
  .w200{
    width: 200px;
  }
  .wid290{
  	width: 290px;
  }
  .mt7{
  	margin-top: 7px;
  }
  .fs14{
  	font-size: 14px;
  }
  .mt14{
  	margin-top: 14px;
  }
</style>
