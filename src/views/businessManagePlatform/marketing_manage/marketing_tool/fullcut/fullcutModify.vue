<template>
  <div class="offadd_container">
      <el-col :span="24" class="">
        <el-form :inline="true" class="demo-form-inline">
          <!--基础信息-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">基础信息</div>
            <div class="mt10">
              <el-col :span="10">
                <el-form-item label="满减编号" class="mb10">
                  <div class="mt6">
                    <span class="ml10">{{fullcutInfo.fullCutNo}}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="生成者" class="mb10">
                  <div class="mt6">
                    <span class="ml10" v-if="fullcutInfo.creatorType == 1">平台</span>
                    <span class="ml10" v-if="fullcutInfo.creatorType == 2">商家</span>
                  </div>
                </el-form-item>
              </el-col>
            	<el-col :span="10">
	              <el-form-item label="满减名称" class="mb10">
	                <el-input placeholder="不超过11个字" class="ml10" :maxlength="11" v-model="fullcutParams.full_cut_name" @blur="formValidator(1)"></el-input>
	              </el-form-item>
              </el-col>
              <el-col :span="10">
	              <el-form-item label="数量" class="ml15 mb10">
	                <el-input  placeholder="填0即为不限制数量" class="ml10" :maxlength="5" v-model="fullcutParams.total_num" @blur="formValidator(2)">
	                  <i slot="suffix" class="el-input__icon fontstyle">张</i>
	                </el-input>
	              </el-form-item>
	            </el-col>
              <el-col :span="10">
                <el-form-item label="使用情况" class="mb10">
                  <div class="mt6">
                    <span class="ml10">{{fullcutInfo.isUse}}</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="状态" class="ml15 mb10">
                  <div class="mt6">
                    <span class="ml10" v-if="fullcutInfo.status == 1">未生效</span>
                    <span class="ml10" v-if="fullcutInfo.status == 2">已生效</span>
                    <span class="ml10" v-if="fullcutInfo.status == 3">已失效</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="有效期" class="ml15 mb10">
                  <div class="mt6">
                    <span class="ml10 mr10">{{fullcutInfo.expirationTimeStart}}</span>至<span class="ml10">{{fullcutInfo.expirationTimeEnd}}</span>
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </div>
          <!--条件设置-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">条件设置</div>
            <div class="mt10">
	            <el-form-item label="满减形式" class="mb10">
                <div class="mt6">
                  <span class="ml10" v-if="fullcutInfo.fullCutType == 1">减钱</span>
                  <span class="ml10" v-if="fullcutInfo.fullCutType == 2">打折</span>
                  <span class="ml10" v-if="fullcutInfo.fullCutType == 3">换购</span>
                </div>
	          	</el-form-item>
            </div>
            <div v-if="fullcutInfo.fullCutType == 3">
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
            <div class="clear02">
              <el-form-item label="门槛选择" class="mt10 mb10">
                <div class="mt6">
                  <span class="ml10" v-if="fullcutInfo.thresholdType == 1">金额</span>
                  <span class="ml10" v-if="fullcutInfo.thresholdType == 2">件数</span>
                </div>
              </el-form-item>
            </div>
            <div class="mclear ml98" v-for="(item, index) in fullcutInfo.itemList">
	            <div class="tit01 fl">
	            	<div class="">
	            	  <span><b class="blackcolor">层级{{index + 1}}</b></span>
	                <span class="mr10 ml10">满 </span>
                  <span class="bluecolor02">{{item.threshold}}</span>
                  <span v-if="fullcutInfo.thresholdType == 1"> 元</span>
                  <span v-if="fullcutInfo.thresholdType == 2"> 件</span>
                  <!-- 减钱 -->
                  <span class="mr10" v-if="fullcutInfo.fullCutType == 1"> 减 </span>
                  <span class="bluecolor02" v-if="fullcutInfo.fullCutType == 1">{{item.money}}</span>
                  <span v-if="fullcutInfo.fullCutType == 1"> 元</span>
                  <!-- 打折 -->
                  <span class="mr10" v-if="fullcutInfo.fullCutType == 2"> 打</span>
                  <span class="bluecolor02" v-if="fullcutInfo.fullCutType == 2">{{item.discount}}</span>
                  <span v-if="fullcutInfo.fullCutType == 2"> 折</span>
                  <!-- 换购 -->
                  <span class="mr10" v-if="fullcutInfo.fullCutType == 3"> 加</span>
                  <span class="bluecolor02" v-if="fullcutInfo.fullCutType == 3">{{item.buyingPrice}}</span>
                  <span v-if="fullcutInfo.fullCutType == 3"> 元可以换购</span>
	              </div>
	            </div>
            </div>
            <div class="mt10">
              <el-form-item label="作用范围" class="mb10">
                <div class="mt6">
                  <el-radio v-if="fullcutInfo.rangeType == 0 && fullcutInfo.creatorType == 1" label="0" value="0" class="ml10 mr10">全场</el-radio>
                  <el-radio v-if="fullcutInfo.rangeType == 0 && fullcutInfo.creatorType == 2" label="0" value="0" class="ml10 mr10">全店</el-radio>
                  <el-radio v-if="fullcutInfo.rangeType == 1" label="1" value="1" class="ml10 mr10">店铺</el-radio>
                  <el-radio v-if="fullcutInfo.rangeType == 2" label="2" value="2" class="ml10 mr10">商品</el-radio>
                  <el-radio v-if="fullcutInfo.rangeType == 3" label="3" value="3" class="ml10 mr10">品类</el-radio>
                  <span class="greycolor" v-if="fullcutInfo.rangeType == 1">不可对之前已选择的店铺做删除；仅可额外再增加店铺。</span>
                  <span class="greycolor" v-if="fullcutInfo.rangeType == 2">不可对之前已选择的商品做删除；仅可额外再增加商品。</span>
                  <span class="greycolor" v-if="fullcutInfo.rangeType == 3">不可对之前已选择的品类做删除；仅可额外再增加品类。</span>
                </div>
              </el-form-item>
            </div>
            <!--作用范围为商品-->
            <div class="clear02" v-if="fullcutInfo.rangeType == 2">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top mclear">
                    <div class="fl wid290">
                      <el-input placeholder="请输入商品标题进行搜索" class="mt14" v-model="goods_query_item.condition">
                        <el-button slot="append" icon="el-icon-search" @click="goodsSelect()">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-if="fullcutInfo.creatorType == 1" v-model="goods_query_item.dealerId" clearable placeholder="全部店铺" @change="goodsSelect()" class="ml15 mt0">
                      <el-option v-for="shop in shopResult.content"
                                 :key="shop.dealerId"
                                 :label="shop.shopName"
                                 :value="shop.dealerId">
                      </el-option>
                    </el-select>
                    <el-select v-model="goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="goodsSelect()" class="mt0">
                      <el-option v-for="classify in classifyList"
                                 :key="classify.classifyId"
                                 :label="classify.classifyName"
                                 :value="classify.classifyId">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="shopbox_cen mclear">
                    <!-- 请判断有商品的时候显示 -->
                    <div class="shopbox_have mclear" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                      <!--控制点击b_active-->
                      <div class="pad10">
                        <div v-for="(goods, index) in goodsResult.content" class="poi1 fl">
                          <div class="shopbox_have_box fl" :class="goods.isOld == 1 ? 'b_active02' : goods.isChoosed == 1 ? 'b_active' : ''" @click="chooseGoods(goods, 0)">
                            <div class="wose shopbox_have_tit mclear">
                              <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                                <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                              </el-tooltip>
                              <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                            </div>
                            <div class="shopbox_have_img mclear">
	                            <div class="fl">
	                              <div class="img fl mr10">
                                  <img :src="goods.goodsImageUrl"/>
	                              </div>
                                <div class="tit03 fl wose02">店铺:
                                  <el-tooltip :content="goods.shopName" placement="top-start" effect="light" v-if="goods.shopName.length > 6">
                                    <span>{{goods.shopName.substring(0,6).concat('...')}}</span>
                                  </el-tooltip>
                                  <span v-if="goods.shopName.length <= 6">{{goods.shopName}}</span>
                                </div>
	                              <div class="tit03 fl mt6">价格:<span>¥{{goods.goodsPrice}}元</span></div>
	                            </div>
                            </div>
                            <i :class="(goods.isOld == 1 || goods.isChoosed == 1) ? 'icon_selected' : ''"></i>
                          </div>
                          <div class="poi2 e-btn">
                            <a class="editbtn" @click="openGoodsSku(goods)">修改规格及数量</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 请判断没有商品的时候显示 -->
                    <div class="shopbox_no" v-if="goodsResult.content == null || goodsResult.content.length == 0">
                      <div class="shopboxbg"></div>
                      <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                    </div>
                    <!--页脚-->
                    <el-pagination v-if="goodsResult.content != null && goodsResult.content.length > 0"
                                   @current-change="changeGoodsPageNo"
                                   :current-page="goodsResult.pageNumber"
                                   :page-size="10"
                                   layout="total, prev, pager, next, jumper"
                                   :total="goodsResult.totalCount">
                    </el-pagination>
                  </div>
                </div>
                <!--已经选择的商品-->
                <div class="Allchosen">
                  <div class="Allchosen_t">
                    	已选 <span class="bluecolor02">{{oldChooseGoodsList.length + chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="chosen_all_have mclear" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 0 && goods_all_show == true">
                      <div class="fl mb10" v-for="(chooseGoods,index) in oldChooseGoodsList">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <div class="fl mb10" v-for="(chooseGoods,index) in chooseGoodsList">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 10" @click="goods_all_show = false">
                        <div class="">收起全部</div>
                        <div><i class="icon_open02"></i></div>
                      </div>
                    </div>
                    <div class="chosen_all_have mclear" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 0 && goods_all_show == false">
                      <div class="fl mb10" v-for="(chooseGoods,index) in oldChooseGoodsList" v-if="index < 10">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                      </div>
                      <div class="fl mb10" v-for="(chooseGoods,index) in chooseGoodsList" v-if="index < 10 - oldChooseGoodsList.length">
                        <el-tooltip :content="chooseGoods.goodsName" placement="top-start" effect="light">
                          <div class="img fl poi1">
                            <img :src="chooseGoods.goodsImageUrl"/>
                            <div class="poi2 del_info" @click="deleteGoods(index, chooseGoods)">X</div>
                          </div>
                        </el-tooltip>
                      </div>
                      <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                      <div class="img02 fl poi1" v-if="oldChooseGoodsList.length + chooseGoodsList.length > 10" @click="goods_all_show = true">
                        <div>展开全部</div>
                        <div><i class="icon_open"></i></div>
                      </div>
                    </div>
                    <!-- 没有选择任何商品的时候 -->
                    <div class="chosen_all_none" v-if="oldChooseGoodsList.length + chooseGoodsList.length == 0">
                     		 还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为品类-->
            <div class="clear02" v-if="fullcutInfo.rangeType == 3">
              <div class="category_container mclear">
                <div class="category_container_l fl">
                  <div class="category_container_l_t">
                    <span>分类列表</span>
                    <span class="tit07">可多选</span>
                  </div>
                  <div class="category_container_l_b">
                    <el-tree
                      :data="classifyList"
                      :props="defaultProps"
                      :default-checked-keys="oldrangeClassifyList"
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
                    <div class="category_container_r_box mclear" v-for="(classify,index) in showClassifyList">
                      <span class="fl">{{classify.classifyName}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--作用范围为店铺-->
            <div class="clear02" v-if="fullcutInfo.rangeType == 1">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top mclear">
                    <div class="fl wid290 mt7">
                      <el-input placeholder="请输入店铺名称进行搜索" v-model="shop_query_item.dealerName">
                        <el-button slot="append" icon="el-icon-search" @click="shopSelect()" type="primary">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-model="shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="shopSelect()" class="ml20">
                      <el-option v-for="shopClassify in shopClassifyList"
                                 :key="shopClassify.dealerClassifyId"
                                 :label="shopClassify.dealerClassifyName"
                                 :value="shopClassify.dealerClassifyId">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="shopbox_cen mclear">
                    <!-- 请判断有店铺的时候显示 -->
                    <div class="shopbox_have mclear" v-if="shopResult.content != null && shopResult.content.length > 0">
                      <!--控制点击b_active-->
                      <div class="pad10">
                        <div class="shopbox_have_box fl" :class="shop.isChoosed == 1 ? 'b_active' : shop.isOldChoosed == 1 ? 'b_active02' : ''" v-for="(shop, index) in shopResult.content" @click="chooseShop(shop)">
                          <div class="wose shopbox_have_tit mclear">
                            <el-tooltip :content="shop.shopName" placement="top-start" effect="light" v-if="shop.shopName.length > 15">
                              <span>{{shop.shopName.substring(0,15).concat('...')}}</span>
                            </el-tooltip>
                            <span v-if="shop.shopName.length <= 15">{{shop.shopName}}</span>
                          </div>
                          <div class="shopbox_have_img">
                            <div class="img fl mr10">
                              <img :src="shop.shopIcon"/>
                            </div>
                            <div class="tit03 fl wose02">商家:
                              <el-tooltip :content="shop.dealerName" placement="top-start" effect="light" v-if="shop.dealerName.length > 6">
                                <span>{{shop.dealerName.substring(0,6).concat('...')}}</span>
                              </el-tooltip>
                              <span v-if="shop.dealerName.length <= 6">{{shop.dealerName}}</span>
                            </div>
                          </div>
                          <i :class="(shop.isChoosed == 1 || shop.isOldChoosed == 1) ? 'icon_selected' : ''"></i>
                        </div>
                      </div>
                    </div>
                    <!-- 请判断没有店铺的时候显示 -->
                    <div class="shopbox_no" v-if="shopResult.content == null || shopResult.content.length == 0">
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
                <div class="Allchosen">
                  <div class="Allchosen_t">
                    	已选 <span class="bluecolor02">{{oldChooseShopList.length + chooseShopList.length}}</span> 个店铺
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择店铺的时候 -->
                    <div class="chosen_all_have" v-if="oldChooseShopList.length + chooseShopList.length > 0 && shop_all_show == true">
                      <div class="wose ml10" v-for="(chooseShop, index) in oldChooseShopList">
                        <el-tag type="info">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <div class="wose ml10" v-for="(chooseShop, index) in chooseShopList">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--展开全部-->
                      <div class="allshop" v-if="oldChooseShopList.length + chooseShopList.length > 10" @click="shop_all_show = false">
                        <span>收起全部</span>
                        <i class="icon_open02"></i>
                      </div>
                    </div>
                    <div class="chosen_all_have" v-if="oldChooseShopList.length + chooseShopList.length > 0 && shop_all_show == false">
                      <div class="wose ml10" v-for="(chooseShop, index) in oldChooseShopList" v-if="index < 10">
                        <el-tag type="info">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <div class="wose ml10" v-for="(chooseShop, index) in chooseShopList" v-if="index < 10 - oldChooseShopList.length">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--多的时候控制js展示展开全部-->
                      <div class="allshop" v-if="oldChooseShopList.length + chooseShopList.length > 10" @click="shop_all_show = true">
                        <span>展开全部</span>
                        <i class="icon_open"></i>
                      </div>
                    </div>
                    <!-- 没有选择任何店铺的时候 -->
                    <div class="chosen_all_none" v-if="oldChooseShopList.length + chooseShopList.length == 0">
                      	还没有选择任何店铺哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为全场-->
            <div class="clear02" v-if="fullcutInfo.rangeType == 0">
              <el-col :span="20">
                <div class="Full-court_container">
                  <div class="Full-court01">
                    <span v-if="fullcutInfo.creatorType == 1">已设置该满减作用于全场商品，如需排除其中个别的商品或店铺，点击</span>
                    <span v-if="fullcutInfo.creatorType == 2">已设置该满减作用于全店商品，只能删除已排除的商品，不能新增</span>
                  </div>
                  <div class="Allchosen">
                    <div class="Allchosen_t">
                      	已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
                    </div>
                    <div class="Allchosen_c">
                      <!-- 选择商品的时候 -->
                      <div class="chosen_all_have mclear" v-if="removeGoodsList.length > 0 && remove_goods_all_show == true">
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
                      <div class="chosen_all_have" v-if="removeGoodsList.length > 0 && remove_goods_all_show == false">
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
                      <div class="chosen_all_none" v-if="removeGoodsList.length == 0">
                        	还没有选择任何商品哦!
                      </div>
                    </div>
                  </div>
                  <div class="Allchosen" v-if="fullcutInfo.creatorType == 1">
                    <div class="Allchosen_t">
                      	已排除 <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
                    </div>
                    <div class="Allchosen_c">
                      <!-- 选择店铺的时候 -->
                      <div class="chosen_all_have" v-if="removeShopList.length > 0 && remove_shop_all_show == true">
                        <div class="wose ml10" v-for="(removeShop, index) in removeShopList">
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
                        <div class="wose ml10" v-for="(removeShop, index) in removeShopList" v-if="index < 10">
                          <el-tag type="info" closable @close="deleteRemoveShop(index, removeShop)">
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
                </div>
              </el-col>
            </div>
          </div>
          <!--领取方式-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">发放方式</div>
						<div class="mt10">
							<el-form-item label="发放方式" class="mb10">
                <div class="mt6">
                  <span class="ml10">无需发放</span>
                </div>
              </el-form-item>
            </div>
          </div>
          <!--成本控制-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">成本控制</div>
            <div class="mt10">
              <el-form-item label="每人优惠" class="mb10">
                <div class="mt6">
                  <span class="ml10">共 </span>
                  <span class="bluecolor02">{{fullcutInfo.numPerOne}}</span>
                  <span> 次</span>
                </div>
              </el-form-item>
              <el-form-item label="每人每天限领" v-if="fullcutInfo.numPerOne > 1" class="mb10">
                <div class="mt6">
                  <span class="ml10 bluecolor02">{{fullcutInfo.numPerDay}}</span>
                  <span> 次</span>
                </div>
              </el-form-item>
            </div>
            <div v-if="fullcutInfo.creatorType == 1">
              <el-form-item label="平台承担" class="offadd_input mb10">
                <el-input v-model="fullcutParams.cost_json.platform" class="ml10" :maxlength="3" @blur="formValidator(7)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-form-item label="商家承担" class="offadd_input mb10">
                <el-input v-model="fullcutParams.cost_json.dealer" class="ml10" :maxlength="3" @blur="formValidator(8)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-button  size="medium" class="mt7 ml20" @click="openCostDailog()" type="primary">单独成本设置</el-button>
          	  <el-col :span="20">
          	    <div class="Allchosenshop">
                  <div class="Allchosenshop_t">
                    	已单独设置 <span class="bluecolor02">{{oldDealerCostList.length + dealerCostList.length}}</span> 个店铺
                  </div>
                  <div class="Allchosenshop_c" style="">
                    <!--没有设置店铺情况 -->
                    <div class="Allchosenshop_c_none" v-if="oldDealerCostList.length + dealerCostList.length == 0">
                      还没有单独设置任何商家哦
                    </div>
                    <!--设置店铺情况 -->
                    <div class="Allchosenshop_c_have mclear" v-if="oldDealerCostList.length + dealerCostList.length > 0">
                      <div class="Allchosenshop_box fl mt10" v-for="(cost,index) in oldDealerCostList">
                        <div class="Allchosenshop_box_t fl">
                          <div class="tit04 wose">{{cost.shopName}}</div>
                          <div class="tit05">平台承担:{{cost.platform}}%，店铺承担:{{cost.dealer}}%</div>
                        </div>
                      </div>
                      <div class="Allchosenshop_box fl mt10" v-for="(cost,index) in dealerCostList">
                        <div class="Allchosenshop_box_t fl">
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
          <!--备注内容-->
          <div class="offaddFormation mclear mb130">
            <div class="offaddbt clear02">
              <span class="offaddbt fl mr10 ml32">备注</span>
              <div class="mb10">
                <span class="ml25 fs14">{{fullcutInfo.remark}}</span>
              </div>
            </div>
          </div>
          <!--确定提交-->
          <div class="b_button">
          	<div class="marauto wid180">
          	<el-form-item>
    					<el-button type="primary" size="medium" @click="postfrom()">提 交</el-button>
    					<el-button size="medium" @click="back()">返 回</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
        <!--单独设置成本弹窗-->
        <el-dialog v-if="fullcutInfo.creatorType == 1" title="单独成本设置" :visible.sync="costDialogVisible" width="980px" center :close="scanShopCost">
          <div class="sigle_set mclear">
            <div class="sigle_set_left fl">
              <div class="sigle_set_left_t mclear">
                <el-input placeholder="请输入店铺名称进行搜索" v-model="cost_shop_query_item.dealerName" class="offadd_input fl">
                </el-input>
                <el-select v-model="cost_shop_query_item.dealerClassify" clearable placeholder="全部品类" class="fl offadd_input coupon_input" @change="costShopSelect()">
                  <el-option v-for="shopClassify in shopClassifyList"
                             :key="shopClassify.dealerClassifyId"
                             :label="shopClassify.dealerClassifyName"
                             :value="shopClassify.dealerClassifyId">
                  </el-option>
                </el-select>
                <el-button icon="el-icon-search" class="fl mt7" type="primary" @click="costShopSelect()" style="padding: 9px"></el-button>
              </div>
              <div class="sigle_set_left_b mclear">
                <!--点击效果出现class名字b_active-->
                <div class="sigle_set_leftbox fl" :class="shop.isOldCost == true ? 'b_active02' : shop.isCost == true ? 'b_active' : ''" v-for="(shop, index) in costShopResult.content" @click="addShopCost(shop)">
                  <div class="tit06 wose02">{{shop.shopName}}</div>
                  <div class="s_img">
                    <img :src="shop.shopIcon"/>
                  </div>
                  <i :class="(shop.isOldCost == true || shop.isCost == true) ? 'icon_selected' : ''"></i>
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
                <div class="sigle_set_right_b_box fl" v-for="(cost,index) in oldDealerCostList">
                  <div class="sigle_set_right_b_box_t fl">
                    <div class="tit04 wose">{{cost.shopName}}</div>
                    <div class="tit05">
                      <span>平台承担:</span>
                      <input class="el-input__inner perce" v-model="cost.platform" :maxlength="3" @blur="dealerCostBlur('platform', cost)"/>%，
                      <span>店铺承担:</span>
                      <input class="el-input__inner perce" v-model="cost.dealer" :maxlength="3" @blur="dealerCostBlur('dealer', cost)"/>%
                    </div>
                  </div>
                </div>
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
      	<!--修改规格-->
        <el-dialog title="选择所选商品规格及数量" :visible.sync="skuDialogVisible" width="800px" center>
          <div class="singlecontaner clear02">
            <div class="fl mr20 singlecont_l">
              <div class="singlecont_l_t wose02">
                {{goodsInfo.goodsName}}
              </div>
              <div class="singlecont_l_b">
                <img :src="goodsInfo.goodsImageUrl"/>
              </div>
            </div>
            <div class="fl singlecont_r">
              <table class="singlecont_tab">
                <thead>
                <tr>
                  <td class="a1">是否参与满减</td>
                  <td class="a2">规格</td>
                  <td class="a3">现有库存</td>
                  <td class="a4">参与满减库存</td>
                </tr>
                </thead>
                <!--设计一页8条记录-->
                <tbody>
                <tr v-for="(sku, index) in goodsInfo.goodsSkuList" :key="index">
                  <td class="a1">
                    <el-checkbox v-model="sku.isCheck"></el-checkbox>
                  </td>
                  <td class="a2">
                    <input type="hidden" name="goodsSkuName" v-model="sku.goodsSkuName"/>
                    {{sku.goodsSkuName == '' ? '通用' : sku.goodsSkuName}}
                  </td>
                  <td class="a3">{{sku.goodsSkuInventory}}</td>
                  <td class="a4"><input class="el-input__inner" v-model="sku.goodsSkuNum" @blur="checkSkuNum($event, sku, goodsInfo.isOld)"/></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="skuDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="chooseGoods(goodsInfo, 1)">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chose: true,
      costDialogVisible: false,
      skuDialogVisible: false,
      exchange_all_show: false,
      goods_all_show: false,
      shop_all_show: false,
      remove_goods_all_show: false,
      remove_shop_all_show: false,
      goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
      goodsResult: '',
      shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 作用商家
      cost_shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 成本设置商家
      shopResult: '',
      costShopResult: '',
      goodsInfo: '',
      chooseGoodsList: [],
      oldChooseGoodsList: [],
      chooseShopList: [],
      oldChooseShopList: [],
      classifyList: [],
      shopClassifyList: [],
      rangeClassifyList: [],
      showClassifyList: [],
      oldrangeClassifyList: [],
      removeShopList: [],
      removeGoodsList: [],
      dealerCostList: [], // 商家单独成本设置
      oldDealerCostList: [],
      exchangeGoodsList: [],
      fullCutList: [], // threshold:门槛金额/件数，discount:优惠折扣，money:优惠金额，level:层级,buyingPrice: 换购价,goodsIds:换购商品ids
      fullcutInfo: '',
      fullcutParams: {
        full_cut_id: '', // 满减业务ID
        full_cut_name: '', // 满减名称
        total_num: '', // 满减总数
        range_type: '',
        dealer_ids: [], // 商家ID列表
        goods_ids: [], // 商品ID列表
        goods_sku_list: [],
        goods_classifys: [], // 商品品类列表
        remove_goods_ids: [], // 全场排除的商品IDs
        remove_dealer_ids: [], // 全场排除的商家IDs
        cost_json: {platform: '', dealer: ''} // 成本设置
      },
      defaultProps: {
        children: 'subClassify',
        label: 'classifyName'
      }
    }
  },
  mounted () {
    let _this = this
    _this.classifySelect('-1')
    _this.api_businessManagePlatform_fullcutDetail({
      pathParams: `/${sessionStorage.getItem('full_cut_id')}`
    }).then(result => {
      console.log('满减详情:', JSON.stringify(result.content))
      _this.fullcutInfo = result.content
      _this.fullcutParams.full_cut_id = _this.fullcutInfo.fullCutId
      _this.fullcutParams.full_cut_name = _this.fullcutInfo.fullCutName
      _this.fullcutParams.total_num = _this.fullcutInfo.totalNum
      _this.fullcutParams.range_type = _this.fullcutInfo.rangeType
      if (_this.fullcutInfo.creatorType == 1) {
        if (_this.fullcutInfo.costList != null && _this.fullcutInfo.costList.length > 0) {
          for (let i = 0; i < _this.fullcutInfo.costList.length; i++) {
            if (_this.fullcutInfo.costList[i].dealerId === 'ALL') {
              _this.fullcutParams.cost_json.platform = _this.fullcutInfo.costList[i].platformPercent
              _this.fullcutParams.cost_json.dealer = _this.fullcutInfo.costList[i].dealerPercent
            } else {
              let cost = {}
              cost.dealerId = _this.fullcutInfo.costList[i].dealerId
              cost.shopName = _this.fullcutInfo.costList[i].dealerName
              cost.platform = _this.fullcutInfo.costList[i].platformPercent
              cost.dealer = _this.fullcutInfo.costList[i].dealerPercent
              _this.oldDealerCostList.push(cost)
            }
          }
        } else {
          _this.fullcutParams.cost_json.platform = 100
          _this.fullcutParams.cost_json.dealer = 0
        }
      } else if (_this.fullcutInfo.creatorType == 2) {
        _this.fullcutParams.cost_json.platform = 0
        _this.fullcutParams.dealer = 100
      }
      if (_this.fullcutInfo.rangeType === 0) {
        for (let i = 0; i < _this.fullcutInfo.removeRangeList.length; i++) {
          if (_this.fullcutInfo.creatorType == 1) {
            if (_this.fullcutInfo.removeRangeList[i].type == 1) {
              let removeShop = {}
              removeShop.dealerId = _this.fullcutInfo.removeRangeList[i].id
              removeShop.shopName = _this.fullcutInfo.removeRangeList[i].name
              removeShop.shopIcon = _this.fullcutInfo.removeRangeList[i].imageUrl
              _this.removeShopList.push(removeShop)
            }
          }
          if (_this.fullcutInfo.removeRangeList[i].type == 2) {
            let removeGoods = {}
            removeGoods.goodsId = _this.fullcutInfo.removeRangeList[i].id
            removeGoods.goodsName = _this.fullcutInfo.removeRangeList[i].name
            removeGoods.goodsImageUrl = _this.fullcutInfo.removeRangeList[i].imageUrl
            _this.removeGoodsList.push(removeGoods)
          }
        }
      }
      if (_this.fullcutInfo.rangeType == 1) {
        _this.changeRangeType('1')
        for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
          let shop = {}
          shop.dealerId = _this.fullcutInfo.suitableRangeList[i].id
          shop.shopName = _this.fullcutInfo.suitableRangeList[i].name
          shop.shopIcon = _this.fullcutInfo.suitableRangeList[i].imageUrl
          _this.oldChooseShopList.push(shop)
        }
      }
      if (_this.fullcutInfo.rangeType == 2) {
        _this.changeRangeType('2')
        console.log(JSON.stringify(_this.fullcutInfo.suitableRangeList))
        for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
          let goods = {}
          goods.goodsId = _this.fullcutInfo.suitableRangeList[i].id
          goods.goodsName = _this.fullcutInfo.suitableRangeList[i].name
          goods.goodsImageUrl = _this.fullcutInfo.suitableRangeList[i].imageUrl
          goods.skuFlag = _this.fullcutInfo.suitableRangeList[i].skuFlag
          goods.chooseSkuList = _this.fullcutInfo.suitableRangeList[i].skuList
          _this.oldChooseGoodsList.push(goods)
        }
      }
      if (_this.fullcutInfo.rangeType == 3) {
        _this.changeRangeType('3')
        for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
          _this.oldrangeClassifyList.push(_this.fullcutInfo.suitableRangeList[i].id)
        }
        setTimeout(() => {
          _this.getCheckedNodes()
        }, 1000)
      }
      if (_this.fullcutInfo.fullCutType == 3) {
        let goodsIds = _this.fullcutInfo.itemList[0].goodsIds
        _this.api_businessManagePlatform_goodsMultiple({
          data: {
            goodsIds: goodsIds
          }
        }).then(result => {
          _this.exchangeGoodsList = result.content
        })

//        $.ajax({
//          url: _this.BASE_URL + 'm2c.scm/goods/detail/multiple',
//          data: {
//            goodsIds: goodsIds
//          },
//          success: function (result) {
//            _this.exchangeGoodsList = result.content
//          }
//        })
      }
    })

//    $.ajax({
//      url: _this.BASE_URL + 'm2c.market/web/fullcut/detail/' + sessionStorage.getItem('full_cut_id'),
//      data: {
//      },
//      success: function (result) {
//        console.log('满减详情:', JSON.stringify(result.content))
//        _this.fullcutInfo = result.content
//        _this.fullcutParams.full_cut_id = _this.fullcutInfo.fullCutId
//        _this.fullcutParams.full_cut_name = _this.fullcutInfo.fullCutName
//        _this.fullcutParams.total_num = _this.fullcutInfo.totalNum
//        _this.fullcutParams.range_type = _this.fullcutInfo.rangeType
//        if (_this.fullcutInfo.creatorType == 1) {
//          if (_this.fullcutInfo.costList != null && _this.fullcutInfo.costList.length > 0) {
//            for (let i = 0; i < _this.fullcutInfo.costList.length; i++) {
//              if (_this.fullcutInfo.costList[i].dealerId === 'ALL') {
//                _this.fullcutParams.cost_json.platform = _this.fullcutInfo.costList[i].platformPercent
//                _this.fullcutParams.cost_json.dealer = _this.fullcutInfo.costList[i].dealerPercent
//              } else {
//                let cost = {}
//                cost.dealerId = _this.fullcutInfo.costList[i].dealerId
//                cost.shopName = _this.fullcutInfo.costList[i].dealerName
//                cost.platform = _this.fullcutInfo.costList[i].platformPercent
//                cost.dealer = _this.fullcutInfo.costList[i].dealerPercent
//                _this.oldDealerCostList.push(cost)
//              }
//            }
//          } else {
//            _this.fullcutParams.cost_json.platform = 100
//            _this.fullcutParams.cost_json.dealer = 0
//          }
//        } else if (_this.fullcutInfo.creatorType == 2) {
//          _this.fullcutParams.cost_json.platform = 0
//          _this.fullcutParams.dealer = 100
//        }
//        if (_this.fullcutInfo.rangeType === 0) {
//          for (let i = 0; i < _this.fullcutInfo.removeRangeList.length; i++) {
//            if (_this.fullcutInfo.creatorType == 1) {
//              if (_this.fullcutInfo.removeRangeList[i].type == 1) {
//                let removeShop = {}
//                removeShop.dealerId = _this.fullcutInfo.removeRangeList[i].id
//                removeShop.shopName = _this.fullcutInfo.removeRangeList[i].name
//                removeShop.shopIcon = _this.fullcutInfo.removeRangeList[i].imageUrl
//                _this.removeShopList.push(removeShop)
//              }
//            }
//            if (_this.fullcutInfo.removeRangeList[i].type == 2) {
//              let removeGoods = {}
//              removeGoods.goodsId = _this.fullcutInfo.removeRangeList[i].id
//              removeGoods.goodsName = _this.fullcutInfo.removeRangeList[i].name
//              removeGoods.goodsImageUrl = _this.fullcutInfo.removeRangeList[i].imageUrl
//              _this.removeGoodsList.push(removeGoods)
//            }
//          }
//        }
//        if (_this.fullcutInfo.rangeType == 1) {
//          _this.changeRangeType('1')
//          for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
//            let shop = {}
//            shop.dealerId = _this.fullcutInfo.suitableRangeList[i].id
//            shop.shopName = _this.fullcutInfo.suitableRangeList[i].name
//            shop.shopIcon = _this.fullcutInfo.suitableRangeList[i].imageUrl
//            _this.oldChooseShopList.push(shop)
//          }
//        }
//        if (_this.fullcutInfo.rangeType == 2) {
//          _this.changeRangeType('2')
//          for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
//            let goods = {}
//            goods.goodsId = _this.fullcutInfo.suitableRangeList[i].id
//            goods.goodsName = _this.fullcutInfo.suitableRangeList[i].name
//            goods.goodsImageUrl = _this.fullcutInfo.suitableRangeList[i].imageUrl
//            goods.skuFlag = _this.fullcutInfo.suitableRangeList[i].skuFlag
//            goods.chooseSkuList = _this.fullcutInfo.suitableRangeList[i].skuList
//            _this.oldChooseGoodsList.push(goods)
//          }
//        }
//        if (_this.fullcutInfo.rangeType == 3) {
//          _this.changeRangeType('3')
//          for (let i = 0; i < _this.fullcutInfo.suitableRangeList.length; i++) {
//            _this.oldrangeClassifyList.push(_this.fullcutInfo.suitableRangeList[i].id)
//          }
//          setTimeout(() => {
//            _this.getCheckedNodes()
//          }, 1000)
//        }
//        if (_this.fullcutInfo.fullCutType == 3) {
//          let goodsIds = _this.fullcutInfo.itemList[0].goodsIds
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
//      }
//    })
  },
  methods: {
    formatDate (date, fmt) {
      let _this = this
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
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _this.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero (str) {
      return ('00' + str).substr(str.length)
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

      if (rangeType === '1') { // 作用范围为商家
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 10}
        _this.shopSelect()
        _this.shopClassifySelect()
      } else if (rangeType === '2') { // 作用范围为商品
        _this.goods_query_item = {goodsClassifyId: '', condition: '', dealerId: '', pageNum: 1, rows: 10}
        _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 10000}
        if (_this.fullcutInfo.creatorType === 2) {
          _this.goods_query_item.dealerId = _this.fullcutInfo.creator
        }
        _this.goodsSelect()
        _this.shopSelect()
        _this.classifySelect('-1')
      } else if (rangeType === '3') { // 作用范围为品类
        _this.classifySelect('-1')
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
          result.content[i].isOld = 0
          result.content[i].skuFlag = 0
          result.content[i].chooseSkuList = []
          for (let j = 0; j < _this.oldChooseGoodsList.length; j++) {
            if (result.content[i].goodsId === _this.oldChooseGoodsList[j].goodsId) {
              result.content[i].isOld = 1
              result.content[i].skuFlag = _this.oldChooseGoodsList[j].skuFlag
              result.content[i].chooseSkuList = _this.oldChooseGoodsList[j].chooseSkuList
            }
          }
          for (let j = 0; j < _this.chooseGoodsList.length; j++) {
            if (result.content[i].goodsId === _this.chooseGoodsList[j].goodsId) {
              result.content[i].isChoosed = 1
              result.content[i].skuFlag = _this.chooseGoodsList[j].skuFlag
              result.content[i].chooseSkuList = _this.chooseGoodsList[j].chooseSkuList
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
//            result.content[i].isOld = 0
//            result.content[i].skuFlag = 0
//            result.content[i].chooseSkuList = []
//            for (let j = 0; j < _this.oldChooseGoodsList.length; j++) {
//              if (result.content[i].goodsId === _this.oldChooseGoodsList[j].goodsId) {
//                result.content[i].isOld = 1
//                result.content[i].skuFlag = _this.oldChooseGoodsList[j].skuFlag
//                result.content[i].chooseSkuList = _this.oldChooseGoodsList[j].chooseSkuList
//              }
//            }
//            for (let j = 0; j < _this.chooseGoodsList.length; j++) {
//              if (result.content[i].goodsId === _this.chooseGoodsList[j].goodsId) {
//                result.content[i].isChoosed = 1
//                result.content[i].skuFlag = _this.chooseGoodsList[j].skuFlag
//                result.content[i].chooseSkuList = _this.chooseGoodsList[j].chooseSkuList
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
    // 店铺查询改变分页页
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
    // 打开商品规格选择弹框
    openGoodsSku (goods) {
      let _this = this
      _this.skuDialogVisible = true
      for (let i = 0; i < goods.goodsSkuList.length; i++) {
        if (goods.isChoosed == 0 && goods.isOld == 0) {
          _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//          goods.goodsSkuList[i].isCheck = true
          goods.goodsSkuList[i].goodsSkuNum = 0
        } else {
          if (goods.skuFlag == 0) {
            _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//            goods.goodsSkuList[i].isCheck = true
            goods.goodsSkuList[i].goodsSkuNum = goods.goodsSkuList[i].goodsSkuInventory
            goods.goodsSkuList[i].oldSkuNum = goods.goodsSkuList[i].goodsSkuInventory
          } else {
            console.log(JSON.stringify(goods.chooseSkuList))
            _this.$set(goods.goodsSkuList[i], 'isCheck', false)
//            goods.goodsSkuList[i].isCheck = false
            goods.goodsSkuList[i].goodsSkuNum = 0
            goods.goodsSkuList[i].oldSkuNum = 0
            for (let g = 0; g < goods.chooseSkuList.length; g++) {
              if (goods.goodsSkuList[i].goodsSkuId === goods.chooseSkuList[g].skuId) {
                _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//                goods.goodsSkuList[i].isCheck = true
                goods.goodsSkuList[i].goodsSkuNum = goods.chooseSkuList[g].skuNum
                goods.goodsSkuList[i].oldSkuNum = goods.chooseSkuList[g].skuNum
              }
            }
          }
        }
      }
      console.log(goods)
      _this.goodsInfo = goods
    },
    // 验证规格数
    checkSkuNum (e, sku, isOld) {
      let _this = this
      let target = e.target
      if (parseInt(sku.goodsSkuInventory) < parseInt(sku.goodsSkuNum)) {
        _this.warning('参与库存不能超过现有库存')
        sku.goodsSkuNum = 0
        target.value = 0
      }
      if (!/^[0-9]{1,5}$/.test(sku.goodsSkuNum)) {
        _this.warning('参与库存数不规范')
        sku.goodsSkuNum = 0
        target.value = 0
      }
      if (isOld == 1 && parseInt(sku.oldSkuNum) > 0 && sku.isCheck === false) {
        _this.warning('已参与满减规格不能取消')
        sku.isCheck = true
      }
      if (isOld == 1 && parseInt(sku.oldSkuNum) > parseInt(sku.goodsSkuNum)) {
        _this.warning('参与库存不能低于已设定的参与库存')
        sku.goodsSkuNum = sku.oldSkuNum
        target.value = sku.oldSkuNum
      }
    },
    // 作用范围为商品,选择商品
    chooseGoods (goodsInfo, skuFlag) {
      let _this = this
      if (goodsInfo.isOld == 1) {
        if (skuFlag == 1) {
          let chooseSkuList = []
          for (let i = 0; i < goodsInfo.goodsSkuList.length; i++) {
            if (goodsInfo.goodsSkuList[i].isCheck === true && goodsInfo.goodsSkuList[i].goodsSkuNum > 0) {
              let chooseSku = {}
              chooseSku.skuId = goodsInfo.goodsSkuList[i].goodsSkuId
              chooseSku.skuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
              chooseSkuList.push(chooseSku)
            }
          }
          goodsInfo.chooseSkuList = chooseSkuList
          _this.skuDialogVisible = false
        }
        for (let i = 0; i < _this.oldChooseGoodsList.length; i++) {
          if (_this.oldChooseGoodsList[i].goodsId === goodsInfo.goodsId) {
            _this.oldChooseGoodsList[i] = goodsInfo
          }
        }
      }
      if (goodsInfo.isOld == 0) {
        if (skuFlag == 0) {
          if (goodsInfo.isChoosed == 0) { // 未选中的商品被选中
            goodsInfo.isChoosed = 1
            goodsInfo.skuFlag = 0
            goodsInfo.chooseSkuList = []
            _this.chooseGoodsList.push(goodsInfo)
          } else if (goodsInfo.isChoosed == 1) { // 已选中的商品被取消
            goodsInfo.isChoosed = 0
            goodsInfo.skuFlag = 0
            goodsInfo.chooseSkuList = []
            for (let g = 0; g < goodsInfo.goodsSkuList.length; g++) {
              _this.$set(goodsInfo.goodsSkuList[g], 'isCheck', false)
//              goodsInfo.goodsSkuList[g].isCheck = false
              goodsInfo.goodsSkuList[g].goodsSkuNum = 0
            }
            for (let i = 0; i < _this.chooseGoodsList.length; i++) {
              if (_this.chooseGoodsList[i].goodsId == goodsInfo.goodsId) { // 该商品已在被选中商品列表中
                // 该商品是被取消的，需要从被选中商品列表删除
                _this.chooseGoodsList.splice(i, 1)
              }
            }
          }
        }
        if (skuFlag == 1) {
          let chooseSkuList = []
          for (let i = 0; i < goodsInfo.goodsSkuList.length; i++) {
            if (goodsInfo.goodsSkuList[i].isCheck === true && goodsInfo.goodsSkuList[i].goodsSkuNum > 0) {
              let chooseSku = {}
              chooseSku.skuId = goodsInfo.goodsSkuList[i].goodsSkuId
              chooseSku.skuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
              chooseSkuList.push(chooseSku)
            }
          }
          if (chooseSkuList.length > 0) {
            goodsInfo.isChoosed = 1
            goodsInfo.skuFlag = 1
            goodsInfo.chooseSkuList = chooseSkuList
          } else {
            goodsInfo.isChoosed = 0
            goodsInfo.skuFlag = 0
            goodsInfo.chooseSkuList = []
          }
          _this.skuDialogVisible = false
        }
        let flag = true
        for (let i = 0; i < _this.chooseGoodsList.length; i++) {
          if (_this.chooseGoodsList[i].goodsId === goodsInfo.goodsId) { // 该商品已在被选中商品列表中
            if (goodsInfo.isChoosed == 0) { // 该商品是被取消的，需要从列表删除
              _this.chooseGoodsList.splice(i, 1)
            } else if (goodsInfo.isChoosed == 1) { // 该商品是被选中的，需要更新
              _this.chooseGoodsList[i] = goodsInfo
            }
            flag = false
          }
        }
        if (flag === true && goodsInfo.isChoosed == 1) { // 该商品不在被选中商品列表中且是被选中的,需要添加到列表中
          _this.chooseGoodsList.push(goodsInfo)
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
          _this.goodsResult.content[i].skuFlag = 0
          _this.goodsResult.content[i].chooseSkuList = []
          for (let g = 0; g < _this.goodsResult.content[i].goodsSkuList.length; g++) {
            _this.$set(_this.goodsResult.content[i].goodsSkuList[g], 'isCheck', false)
//            _this.goodsResult.content[i].goodsSkuList[g].isCheck = false
            _this.goodsResult.content[i].goodsSkuList[g].goodsSkuNum = 0
          }
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
        for (let i = 0; i < _this.oldrangeClassifyList.length; i++) {
          for (let a = 0; a < _this.classifyList.length; a++) {
            if (_this.oldrangeClassifyList[i] === _this.classifyList[a].classifyId) {
              _this.classifyList[a].disabled = true
            } else {
              if (_this.classifyList[a].subClassify != null && _this.classifyList[a].subClassify.length > 0) {
                for (let b = 0; b < _this.classifyList[a].subClassify.length; b++) {
                  if (_this.oldrangeClassifyList[i] === _this.classifyList[a].subClassify[b].classifyId) {
                    _this.classifyList[a].subClassify[b].disabled = true
                  } else {
                    if (_this.classifyList[a].subClassify[b].subClassify != null && _this.classifyList[a].subClassify[b].subClassify.length > 0) {
                      for (let c = 0; c < _this.classifyList[a].subClassify[b].subClassify.length; c++) {
                        if (_this.oldrangeClassifyList[i] === _this.classifyList[a].subClassify[b].subClassify[c].classifyId) {
                          _this.classifyList[a].subClassify[b].subClassify[c].disabled = true
                        }
                      }
                    }
                  }
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
//          for (let i = 0; i < _this.oldrangeClassifyList.length; i++) {
//            for (let a = 0; a < _this.classifyList.length; a++) {
//              if (_this.oldrangeClassifyList[i] === _this.classifyList[a].classifyId) {
//                _this.classifyList[a].disabled = true
//              } else {
//                if (_this.classifyList[a].subClassify != null && _this.classifyList[a].subClassify.length > 0) {
//                  for (let b = 0; b < _this.classifyList[a].subClassify.length; b++) {
//                    if (_this.oldrangeClassifyList[i] === _this.classifyList[a].subClassify[b].classifyId) {
//                      _this.classifyList[a].subClassify[b].disabled = true
//                    } else {
//                      if (_this.classifyList[a].subClassify[b].subClassify != null && _this.classifyList[a].subClassify[b].subClassify.length > 0) {
//                        for (let c = 0; c < _this.classifyList[a].subClassify[b].subClassify.length; c++) {
//                          if (_this.oldrangeClassifyList[i] === _this.classifyList[a].subClassify[b].subClassify[c].classifyId) {
//                            _this.classifyList[a].subClassify[b].subClassify[c].disabled = true
//                          }
//                        }
//                      }
//                    }
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
          result.content[i].isOldChoosed = 0
          result.content[i].isRemoved = 0
          for (let j = 0; j < _this.oldChooseShopList.length; j++) {
            if (result.content[i].dealerId === _this.oldChooseShopList[j].dealerId) {
              result.content[i].isOldChoosed = 1
            }
          }
          for (let j = 0; j < _this.chooseShopList.length; j++) {
            if (result.content[i].dealerId === _this.chooseShopList[j].dealerId) {
              result.content[i].isChoosed = 1
            }
          }
          for (let j = 0; j < _this.removeShopList.length; j++) {
            if (result.content[i].dealerId === _this.removeShopList[j].dealerId) {
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
//            result.content[i].isOldChoosed = 0
//            result.content[i].isRemoved = 0
//            result.content[i].isCost = false
//            result.content[i].isOldCost = false
//            for (let j = 0; j < _this.oldChooseShopList.length; j++) {
//              if (result.content[i].dealerId === _this.oldChooseShopList[j].dealerId) {
//                result.content[i].isOldChoosed = 1
//              }
//            }
//            for (let j = 0; j < _this.chooseShopList.length; j++) {
//              if (result.content[i].dealerId === _this.chooseShopList[j].dealerId) {
//                result.content[i].isChoosed = 1
//              }
//            }
//            for (let j = 0; j < _this.removeShopList.length; j++) {
//              if (result.content[i].dealerId === _this.removeShopList[j].dealerId) {
//                result.content[i].isRemoved = 1
//              }
//            }
//            for (let j = 0; j < _this.oldDealerCostList.length; j++) {
//              if (result.content[i].dealerId === _this.oldDealerCostList[j].dealerId) {
//                result.content[i].isOldCost = true
//              }
//            }
//            for (let j = 0; j < _this.dealerCostList.length; j++) {
//              if (result.content[i].dealerId === _this.dealerCostList[j].dealerId) {
//                result.content[i].isCost = true
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
          result.content[i].isOldCost = false
          for (let j = 0; j < _this.oldDealerCostList.length; j++) {
            if (result.content[i].dealerId === _this.oldDealerCostList[j].dealerId) {
              result.content[i].isOldCost = true
            }
          }
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
//            result.content[i].isOldCost = false
//            for (let j = 0; j < _this.oldDealerCostList.length; j++) {
//              if (result.content[i].dealerId === _this.oldDealerCostList[j].dealerId) {
//                result.content[i].isOldCost = true
//              }
//            }
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
      if (shop.isOldChoosed == 0) {
        if (shop.isChoosed == 0) { // 该店铺原为未选中，现在被选中
          shop.isChoosed = 1
          _this.chooseShopList.push(shop)
        } else if (shop.isChoosed == 1) { // 该店铺原为被选中，现在被取消
          shop.isChoosed = 0
          for (let j = 0; j < _this.chooseShopList.length; j++) {
            if (_this.chooseShopList[j].dealerId === shop.dealerId) {
              _this.chooseShopList.splice(j, 1)
            }
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
    // 作用范围为全场,删除已排除商品
    deleteRemoveGoods (index, removeGoods) {
      let _this = this
      _this.removeGoodsList.splice(index, 1)
    },
    // 作用范围为全场,删除已排除店铺
    deleteRemoveShop (index, removeShop) {
      let _this = this
      _this.removeShopList.splice(index, 1)
    },
    // 添加店铺成本设置
    addShopCost (shop) {
      let _this = this
      if (shop.isCost === false) { // 该店铺原为未选中，现在被选中
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
      for (let i = _this.oldDealerCostList.length - 1; i >= 0; i--) {
        let cost = _this.oldDealerCostList[i]
        if (cost.platform === '' ||
          parseInt(cost.platform) < 0 ||
          parseInt(cost.platform) > 100 ||
          cost.dealer === '' ||
          parseInt(cost.dealer) < 0 ||
          parseInt(cost.dealer) > 100 ||
          (cost.platform !== '' && cost.dealer !== '' && 100 - parseInt(cost.platform) !== parseInt(cost.dealer))) {
          _this.oldDealerCostList.splice(i, 1)
        }
      }
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
      _this.fullcutParams.goods_sku_list = []
      _this.fullcutParams.goods_ids = []
      for (let i = 0; i < _this.oldChooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.oldChooseGoodsList[i].goodsId
        goodsItem.goodsName = _this.oldChooseGoodsList[i].goodsName
        goodsItem.skuFlag = _this.oldChooseGoodsList[i].skuFlag
        let goodsItemSkuList = []
        if (_this.oldChooseGoodsList[i].skuFlag == 1) {
          for (let g = 0; g < _this.oldChooseGoodsList[i].chooseSkuList.length; g++) {
            let goodsItemSku = {}
            goodsItemSku.skuId = _this.oldChooseGoodsList[i].chooseSkuList[g].skuId
            goodsItemSku.skuNum = _this.oldChooseGoodsList[i].chooseSkuList[g].skuNum
            goodsItemSkuList.push(goodsItemSku)
            let itemSku = {}
            itemSku.goodsId = _this.oldChooseGoodsList[i].goodsId
            itemSku.skuId = _this.oldChooseGoodsList[i].chooseSkuList[g].skuId
            itemSku.skuNum = _this.oldChooseGoodsList[i].chooseSkuList[g].skuNum
            _this.fullcutParams.goods_sku_list.push(itemSku)
          }
        }
        goodsItem.chooseSkuList = goodsItemSkuList
        _this.fullcutParams.goods_ids.push(goodsItem)
      }
      for (let i = 0; i < _this.chooseGoodsList.length; i++) {
        let goodsItem = {}
        goodsItem.goodsId = _this.chooseGoodsList[i].goodsId
        goodsItem.goodsName = _this.chooseGoodsList[i].goodsName
        goodsItem.skuFlag = _this.chooseGoodsList[i].skuFlag
        let goodsItemSkuList = []
        if (_this.chooseGoodsList[i].skuFlag == 1) {
          for (let g = 0; g < _this.chooseGoodsList[i].chooseSkuList.length; g++) {
            let goodsItemSku = {}
            goodsItemSku.skuId = _this.chooseGoodsList[i].chooseSkuList[g].skuId
            goodsItemSku.skuNum = _this.chooseGoodsList[i].chooseSkuList[g].skuNum
            goodsItemSkuList.push(goodsItemSku)
            let itemSku = {}
            itemSku.goodsId = _this.oldChooseGoodsList[i].goodsId
            itemSku.skuId = _this.oldChooseGoodsList[i].chooseSkuList[g].skuId
            itemSku.skuNum = _this.oldChooseGoodsList[i].chooseSkuList[g].skuNum
            _this.fullcutParams.goods_sku_list.push(itemSku)
          }
        }
        goodsItem.chooseSkuList = goodsItemSkuList
        _this.fullcutParams.goods_ids.push(goodsItem)
      }
    },
    // 拼装作用范围商家参数
    makeDealerIds () {
      let _this = this
      _this.fullcutParams.dealer_ids = []
      for (let i = 0; i < _this.oldChooseShopList.length; i++) {
        let dealer = {}
        dealer.dealerId = _this.oldChooseShopList[i].dealerId
        dealer.shopName = _this.oldChooseShopList[i].shopName
        _this.fullcutParams.dealer_ids.push(dealer)
      }
      for (let i = 0; i < _this.chooseShopList.length; i++) {
        let dealer = {}
        dealer.dealerId = _this.chooseShopList[i].dealerId
        dealer.shopName = _this.chooseShopList[i].shopName
        _this.fullcutParams.dealer_ids.push(dealer)
      }
    },
    // 拼装作用范围品类参数
    makeClassifyIds () {
      let _this = this
      _this.fullcutParams.goods_classifys = []
      for (let i = 0; i < _this.rangeClassifyList.length; i++) {
        let classify = {}
        classify.classifyId = _this.rangeClassifyList[i].classifyId
        classify.classifyName = _this.rangeClassifyList[i].classifyName
        _this.fullcutParams.goods_classifys.push(classify)
      }
    },
    // 拼装作用范围全场参数
    makeRemoveIds () {
      let _this = this
      _this.fullcutParams.remove_goods_ids = []
      _this.fullcutParams.remove_dealer_ids = []
      for (let i = 0; i < _this.removeGoodsList.length; i++) {
        let removeGoods = {}
        removeGoods.goodsId = _this.removeGoodsList[i].goodsId
        removeGoods.goodsName = _this.removeGoodsList[i].goodsName
        _this.fullcutParams.remove_goods_ids.push(removeGoods)
      }
      for (let i = 0; i < _this.removeShopList.length; i++) {
        let removeDealer = {}
        removeDealer.dealerId = _this.removeShopList[i].dealerId
        removeDealer.shopName = _this.removeShopList[i].shopName
        _this.fullcutParams.remove_dealer_ids.push(removeDealer)
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
          full_cut_id: _this.fullcutParams.full_cut_id,
          full_cut_name: _this.fullcutParams.full_cut_name,
          total_num: _this.fullcutParams.total_num,
          range_type: _this.fullcutParams.range_type,
          dealer_ids: JSON.stringify(_this.fullcutParams.dealer_ids),
          goods_ids: JSON.stringify(_this.fullcutParams.goods_ids),
          sku_list: JSON.stringify(_this.fullcutParams.goods_sku_list),
          goods_classifys: JSON.stringify(_this.fullcutParams.goods_classifys),
          remove_goods_ids: JSON.stringify(_this.fullcutParams.remove_goods_ids),
          remove_dealer_ids: JSON.stringify(_this.fullcutParams.remove_dealer_ids),
          cost_json: JSON.stringify(_this.fullcutParams.cost_json),
          dealer_cost_list: JSON.stringify(_this.dealerCostList.concat(_this.oldDealerCostList))
        }
        console.log('rebody:', JSON.stringify(rebody))
        _this.api_businessManagePlatform_modifyFullcut({
          data: JSON.stringify(rebody),
          headers: {'Content-Type': 'application/json'}
        }).then(result => {
          console.log('status:', result.status)
          _this.$router.push({path: '/m/marketTool/fullcutList'})
        })
//        $.ajax({
//          url: _this.BASE_URL + 'm2c.market/admin/fullcut/modify',
//          contentType: 'application/json', // 必须有
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          type: 'post',
//          data: JSON.stringify(rebody),
//          success: function (result) {
//            if (result.status == 200) {
//              console.log('status:', result.status)
//              _this.$router.push({path: '/m/marketTool/fullcutList'})
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
      // falg--1:名称，2：总数,7:平台成本,8:商家成本
      if (flag == 0 || flag == 1) {
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{1,11}$/.test(_this.fullcutParams.full_cut_name)) {
          _this.warning('名称为最多11位汉字数字英文,不能为空')
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        if (_this.fullcutParams.total_num === '') {
          _this.fullcutParams.total_num = 0
        }
        if (!/^[0-9]{1,5}$/.test(_this.fullcutParams.total_num)) {
          _this.fullcutParams.total_num = 0
          _this.warning('满减数量最多5位正整数，填0为不限制数量')
          return false
        }
      }
      if (flag == 0 || flag == 7) {
        if (_this.fullcutParams.cost_json.platform === '' ||
          parseInt(_this.fullcutParams.cost_json.platform) < 0 ||
          parseInt(_this.fullcutParams.cost_json.platform) > 100) {
          _this.fullcutParams.cost_json.platform = ''
        }
        if (!/^(0|[1-9][0-9]?|100)$/.test(_this.fullcutParams.cost_json.platform)) {
          _this.fullcutParams.cost_json.platform = ''
        }
        if (_this.fullcutParams.cost_json.platform != '' &&
          parseInt(_this.fullcutParams.cost_json.platform) >= 0 &&
          parseInt(_this.fullcutParams.cost_json.platform) <= 100) {
          _this.fullcutParams.cost_json.dealer = 100 - _this.fullcutParams.cost_json.platform
        }
      }
      if (flag == 0 || flag == 8) {
        if (_this.fullcutParams.cost_json.dealer === '' ||
          parseInt(_this.fullcutParams.cost_json.dealer) < 0 ||
          parseInt(_this.fullcutParams.cost_json.dealer) > 100) {
          _this.fullcutParams.cost_json.dealer = ''
        }
        if (!/^(0|[1-9][0-9]?|100)$/.test(_this.fullcutParams.cost_json.dealer)) {
          _this.fullcutParams.cost_json.dealer = ''
        }
        if (_this.fullcutParams.cost_json.dealer != '' &&
          parseInt(_this.fullcutParams.cost_json.dealer) >= 0 &&
          parseInt(_this.fullcutParams.cost_json.dealer) <= 100) {
          _this.fullcutParams.cost_json.platform = 100 - _this.fullcutParams.cost_json.dealer
        }
      }
      if (flag == 0) {
        if (_this.fullcutParams.range_type == 1 && _this.oldChooseShopList.length + _this.chooseShopList.length <= 0) {
          _this.warning('作用范围为商家时已选商家不能为空')
          return false
        }
        if (_this.fullcutParams.range_type == 2 && _this.oldChooseGoodsList.length + _this.chooseGoodsList.length <= 0) {
          _this.warning('作用范围为商品时已选商品不能为空')
          return false
        }
        if (_this.fullcutParams.range_type == 3 && _this.oldrangeClassifyList.length + _this.rangeClassifyList.length <= 0) {
          _this.warning('作用范围为品类时已选品类不能为空')
          return false
        }
        if (_this.oldDealerCostList.length + _this.dealerCostList.length > 0) {
          if (_this.fullcutParams.cost_json.platform === '' || _this.fullcutParams.cost_json.dealer === '') {
            _this.warning('请填写通用成本设置')
            return false
          }
          for (let i = 0; i < _this.dealerCostList.length; i++) {
            if (_this.dealerCostList[i].platform === '' ||
              parseInt(_this.dealerCostList[i].platform) < 0 ||
              parseInt(_this.dealerCostList[i].platform) > 100 ||
              _this.dealerCostList[i].dealer === '' ||
              parseInt(_this.dealerCostList[i].dealer) < 0 ||
              parseInt(_this.dealerCostList[i].dealer) > 100) {
              _this.dealerCostList.splice(i, 1)
              return false
            }
            if (_this.dealerCostList[i].platform !== '' &&
              _this.dealerCostList[i].dealer !== '' &&
              100 - _this.dealerCostList[i].platform != _this.dealerCostList[i].dealer) {
              _this.warning('平台承担成本和商家承担成本之和必须为100')
              _this.dealerCostList.splice(i, 1)
              return false
            }
          }
        } else {
          if (_this.fullcutParams.cost_json.platform === '' || _this.fullcutParams.cost_json.dealer === '') {
            _this.fullcutParams.cost_json.platform = 100
            _this.fullcutParams.cost_json.dealer = 0
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
      _this.$router.push({path: '/m/marketTool/fullcutList'})
    }
  }
}
</script>

<style lang="scss" scoped>
  .e-btn{
    left: 10px;
    top: 100px;
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
  .offadd_container{
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
        height: 350px;
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
            width:99px;
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
          height: 270px;
          overflow-y: auto;
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
              width: 200px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
               	width: 195px;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                height: 98px;
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
                }
              }
              .shopbox_have_img02{
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
                }
              }
            }
          }
        }
      }
      .Allchosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 0px;
        min-height: 200px;
        .Allchosen_t{
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
        .Allchosen_c{
          height: 160px;
          padding-top: 10px;
          padding-left: 10px;
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
      height: 625px;
      .sigle_set_left{
        width: 450px;
        height: 600px;
        border: 1px solid #E6E8F2;
        cursor: pointer;
        .sigle_set_left_t{
         /* width: 100%;*/
          /*height: 38px;*/
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
			    height: 470px;
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
          height: 67px;
          background: #f9fafe;
          line-height: 67px;
          padding-left: 10px;
          color: #999999;
          font-size: 14px;
          border-bottom: 1px solid #E6E8F2;
        }
        .sigle_set_right_b{
          padding: 10px;
          overflow-y: auto;
          width: 430px;
          height: 550px;
          .sigle_set_right_b_box{
            width: 410px;
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
    .icon_selected{
      position: absolute;
      background: url(../../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
      width:18px;
      height:18px;
      right: 0px;
      bottom: 0px;
    }
    .b_active{
        border: 1px solid #0086FF!important;
        position: relative;
        .editbtn{
        	border:1px solid #0086FF!important;
        	color: #0086FF!important;
        	cursor: pointer;
        }
      }
    .b_active02{
      border: 1px solid #000000 !important;
      position: relative;
      .editbtn{
        border:1px solid #0086FF!important;
        color: #0086FF!important;
        cursor: pointer;
      }
    }
    .offaddFormation{
     	background-color: #fff;
    	padding: 20px 34px;
    	margin-bottom: 10px;
      .offaddbt{
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
        color: #777777;
        width: 450px;
        height: 46px;
        line-height:46px;
        display: inline-block;
        background: #F5F5F5;
        padding-left: 20px;
        padding-right: 20px;
      }
      .Allchosenshop{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 98px;
        height: 220px;
        .Allchosenshop_t{
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
      .shopbox{
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 98px;
        .shopbox_top{
          min-height: 50px;
          line-height: 50px;
          background:rgba(249,250,254,1);
          padding-left: 10px;
          padding-right: 20px;
          border-bottom: 1px solid #E6E8F2;
          /*padding-top: 10px;*/
          .title{
            width:99px;
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
          height: 360px;
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
              width: 220px;
              /*height: 100px;*/
              border:1px solid #E6E8F2;
              margin-right:10px;
              margin-bottom:10px;
              cursor: pointer;
              .shopbox_have_tit{
                padding-left: 5px;
                width: 215px;
                height: 28px;
                font-size:12px;
                font-family:PingFangSC-Regular;
                color:rgba(0,0,0,1);
                border-bottom: 1px solid #E6E8F2;
                line-height: 28px;
              }
              .shopbox_have_img{
                height: 98px;
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
                width: 60%;
                }
              }
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
        .Allchosen{
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
            /*width: 100%;*/
            height: 345px;
            overflow-y: auto;
            padding: 10px 20px;
          }
        }
        .category_container_r{
          width: 250px;
          height: 380px;
          border: 1px solid #E6E8F2;
          .category_container_r_t{
           /* width: 100%;*/
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
              /*width:100%;*/
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
      .Allchosen{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 98px;
        min-height: 120px;
        .Allchosen_t{
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
        .Allchosen_c{
          min-height: 98px;
          padding-top: 10px;
          padding-left: 10px;
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
    }
  }
  .singlecontaner{
  	height:420px;
  	border-bottom: 1px solid #E5E5E5;
  	.singlecont_l{
  		border: 1px solid #E5E5E5;
  		width: 140px;
  		height: 186px;
  		.singlecont_l_t{
  			padding: 5px;
  			width:130px;
  			height: 30px;
  			background:rgba(245,245,245,1);
  			font-size: 12px;
  			line-height: 17px;
  			color: #000000;
  		}
  		.singlecont_l_b{
  			width: 108px;
  			height: 108px;
  			margin-top: 15px;
  			margin-left: 15px;
  			img{
  				width: 100%;
  				height: 100%;

  			}
  		}
  	}
  	.singlecont_r{
  		width: 580px;
  		max-height: 360px;
  		.singlecont_tab{
  			width: 100%;
  			/*height: 360px;*/
  			border-collapse:collapse;
  			td{
  				border: 1px solid #E6E8F2;
  				margin: 0px;
  				text-align: center;
  				height: 40px;
  			}
  			.a1{
  				width: 20%;
  			}
  			.a2{
  				width: 20%;
  			}
  			.a3{
  				width: 20%;
  			}
  			.a4{
  				width: 40%;
  			}
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
  .name_style{
    display:  inline-block;
    line-height: 20px;
    color:  #ccc;
    width:  260px;
    font-size: 12px;
  }
  .editbtn{
    display: inline-block;
    box-sizing: border-box;
  	margin-top: 10px;
    width: 100px;
    height: 20px;
    line-height: 20px;
    padding-left: 5px;
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
  .mt6{
    margin-top: 7px;
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
  .ml32{
    margin-left: 32px;
  }
  .ml25{
    margin-left: 25px;
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
  .ml98{
    margin-left: 98px;
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
  .mb130{
    margin-bottom: 130px!important;
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
  .ml75{
  	margin-left: 75px;
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
