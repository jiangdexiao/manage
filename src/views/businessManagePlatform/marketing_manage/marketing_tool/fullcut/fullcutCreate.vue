  <template>
    <div class="offadd_container">
      <el-col :span="24" class="">
        <el-form :inline="true" class="demo-form-inline">
          <!--基础信息-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">基础信息</div>
            <div class="mt10">
            	<el-col :span="10">
	              <el-form-item label="满减名称" class="mb10">
	                <el-input placeholder="不超过11个字" :maxlength="11" v-model="fullcutParams.full_cut_name" @blur="formValidator(1)"></el-input>
	              </el-form-item>
              </el-col>
              <el-col :span="10">
	              <el-form-item label="数量" class="mb10">
	                <el-input  placeholder="填0即为不限制数量" :maxlength="5" v-model="fullcutParams.total_num" @blur="formValidator(2)">
	                  <i slot="suffix" class="el-input__icon fontstyle">张</i>
	                </el-input>
	              </el-form-item>
	            </el-col>
              <el-form-item label="有效期" class="ml14 mb10">
                <el-date-picker
                  v-model="fullcutParams.expiration_time"
                  type="daterange"
                  class="mt7"
                  clearable
                  align="left"
                  :editable="false"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <!--条件设置-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">条件设置</div>
            <div class="mt10">
	            <el-form-item label="满减形式" class="mb10">
		            <el-select v-model="fullcutParams.full_cut_type" @change="changeLevel()">
		              <el-option label="减钱" value="1"></el-option>
      						<el-option label="打折" value="2"></el-option>
      						<el-option label="换购" value="3"></el-option>
		            </el-select>
                <el-button size="small" type="primary" class="ml28" @click="openGoodsExchange()" v-if="fullcutParams.full_cut_type == 3">选择换购商品</el-button>
	          	</el-form-item>
            </div>
            <div class="clear02 mb10" v-if="fullcutParams.full_cut_type == 3">
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
                            <div class="poi2 del_info" @click="deleteExchangeGoods(index, exchangeGoods)">X</div>
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
                            <div class="poi2 del_info" @click="deleteExchangeGoods(index, exchangeGoods)">X</div>
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
            <div class="mt10">
              <el-form-item label="门槛选择" class="mb10">
                <el-select v-model="fullcutParams.threshold_type" @change="changeLevel()">
		              <el-option label="金额" value="1"></el-option>
      						<el-option label="件数" value="2"></el-option>
		            </el-select>
                <el-button size="small" type="primary" class="ml28" @click="addDiscount()" v-if="fullcutParams.full_cut_type < 3">增加一级优惠</el-button>
              </el-form-item>
            </div>
            <div class="mclear mt10 mb10 ml88 wid666">
	            <div class="tit01 fl" v-for="(fullCut, index) in fullCutList">
                <el-form-item class="mb10 wid650">
                  <span><b class="blackcolor">层级{{index + 1}}</b></span>
                  <span class="mr10 ml10">满</span>
                  <!-- 门槛 -->
                  <el-input v-model="fullCut.threshold">
                    <i slot="suffix" class="el-input__icon fontstyle" v-if="fullcutParams.threshold_type == 1">元</i>
                    <i slot="suffix" class="el-input__icon fontstyle" v-if="fullcutParams.threshold_type == 2">件</i>
                  </el-input>
                  <!-- 减钱 -->
                  <span class="mr10" v-if="fullcutParams.full_cut_type == 1">减</span>
                  <el-input v-if="fullcutParams.full_cut_type == 1" v-model="fullCut.money">
                    <i slot="suffix" class="el-input__icon fontstyle">元</i>
                  </el-input>
                  <!-- 打折 -->
                  <span class="mr10" v-if="fullcutParams.full_cut_type == 2">打</span>
                  <el-input v-if="fullcutParams.full_cut_type == 2" v-model="fullCut.discount">
                    <i slot="suffix" class="el-input__icon fontstyle">折</i>
                  </el-input>
                  <!-- 换购 -->
                  <span class="mr10" v-if="fullcutParams.full_cut_type == 3">加</span>
                  <el-input v-if="fullcutParams.full_cut_type == 3" v-model="fullCut.buyingPrice">
                    <i slot="suffix" class="el-input__icon fontstyle">元</i>
                  </el-input>
                  <span class="mr10" v-if="fullcutParams.full_cut_type == 3">进行换购</span>
                  <i class="icon_delet02 ml28" v-if="index > 0" @click="deleteDiscount(index)"></i>
                </el-form-item>
	            </div>
            </div>
            <div class="mt10">
              <el-form-item label="作用范围" class="mb10">
                <el-radio-group class="mt10" size="small" v-model="fullcutParams.range_type" @change="changeRangeType(fullcutParams.range_type)">
                  <el-radio label="2" class="ml10">商品</el-radio>
                  <el-radio label="3">品类</el-radio>
                  <el-radio label="1">店铺</el-radio>
                  <el-radio label="0">全场</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <!--作用范围为商品-->
            <div class="clear02" v-if="fullcutParams.range_type == 2">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top mclear">
                    <div class="fl wid290">
                      <el-input placeholder="请输入商品标题进行搜索" class="mt14" v-model="goods_query_item.condition">
                        <el-button slot="append" icon="el-icon-search" @click="goodsSelect(1, 10)" type="primary">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-model="goods_query_item.dealerId" clearable placeholder="全部店铺" @change="goodsSelect(1, 10)" class="ml15 mt0">
                      <el-option v-for="shop in shopResult.content"
                                 :key="shop.dealerId"
                                 :label="shop.shopName"
                                 :value="shop.dealerId">
                      </el-option>
                    </el-select>
                    <el-select v-model="goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="goodsSelect(1, 10)" class="mt0">
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
                          <div class="shopbox_have_box fl" :class="goods.isChoosed == 1 ? 'b_active' : ''" @click="chooseGoods(goods, 0)">
                            <div class="wose shopbox_have_tit mclear" >
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
                            <i :class="goods.isChoosed == 1 ? 'icon_selected' : ''"></i>
                          </div>
                          <div class="poi2 e-btn"><button class="editbtn"  @click="openGoodsSku(goods)">修改规格及数量</button></div>
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
                    	已选 <span class="bluecolor02">{{chooseGoodsList.length}}</span> 件商品
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择商品的时候 -->
                    <div class="chosen_all_have mclear" v-if="chooseGoodsList.length > 0 && goods_all_show == true">
                      <div class="fl mb10" v-for="(chooseGoods,index) in chooseGoodsList">
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
                    <div class="chosen_all_have mclear" v-if="chooseGoodsList.length > 0 && goods_all_show == false">
                      <div class="fl mb10" v-for="(chooseGoods,index) in chooseGoodsList" v-if="index < 10">
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
                    <div class="chosen_all_none" v-if="chooseGoodsList.length == 0">
                     		 还没有选择任何商品哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为品类-->
            <div class="clear02" v-if="fullcutParams.range_type == 3">
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
            <div class="clear02" v-if="fullcutParams.range_type == 1">
              <el-col :span="20">
                <div class="shopbox">
                  <div class="shopbox_top mclear">
                    <div class="fl wid290">
                      <el-input placeholder="请输入店铺名称进行搜索" class="mt14" v-model="shop_query_item.dealerName">
                        <el-button slot="append" icon="el-icon-search" @click="shopSelect()" type="primary">搜索</el-button>
                      </el-input>
                    </div>
                    <el-select v-model="shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="shopSelect()" class="ml15 mt0">
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
                        <div class="shopbox_have_box fl" :class="shop.isChoosed == 1 ? 'b_active' : ''" v-for="(shop, index) in shopResult.content" @click="chooseShop(shop)">
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
                          <i :class="shop.isChoosed == 1 ? 'icon_selected' : ''"></i>
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
                    	已选 <span class="bluecolor02">{{chooseShopList.length}}</span> 个店铺
                  </div>
                  <div class="Allchosen_c">
                    <!-- 选择店铺的时候 -->
                    <div class="chosen_all_have" v-if="chooseShopList.length > 0 && shop_all_show == true">
                      <div class="wose ml10" v-for="(chooseShop, index) in chooseShopList">
                        <el-tag type="info" closable @close="deleteShop(index, chooseShop)">
                          {{chooseShop.shopName}}
                        </el-tag>
                      </div>
                      <!--展开全部-->
                      <div class="allshop" v-if="chooseShopList.length > 10" @click="shop_all_show = false">
                        <span>收起全部</span>
                        <i class="icon_open02"></i>
                      </div>
                    </div>
                    <div class="chosen_all_have" v-if="chooseShopList.length > 0 && shop_all_show == false">
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
                    <div class="chosen_all_none" v-if="chooseShopList.length == 0">
                      	还没有选择任何店铺哦
                    </div>
                  </div>
                </div>
              </el-col>
            </div>
            <!--作用范围为全场-->
            <div class="clear02" v-if="fullcutParams.range_type == 0">
              <el-col :span="20">
                <div class="Full-court_container">
                  <div class="Full-court01">
                    <span>已设置该优惠券作用于全场商品，如需排除其中个别的商品或店铺，点击</span>
                    <span class="button" @click="openRangeDailog()">排除商品或店铺</span>
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
                  <div class="Allchosen">
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
                </div>
              </el-col>
            </div>
          </div>
          <!--发放方式-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">发放方式</div>
						<div class="mt10">
							<el-form-item label="发放方式" class="mb10">
                <el-radio-group class="mt10" size="small" v-model="fullcutParams.receive_type">
                  <el-radio label="0" class="ml10">无需发放</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <!--成本控制-->
          <div class="offaddFormation mclear">
            <div class="offaddbt">成本控制</div>
            <div class="mt10">
              <el-form-item label="每人优惠" class="mb10">
                <el-input  v-model="fullcutParams.num_per_one" :maxlength="5" @blur="formValidator(5)">
                  <i slot="prefix" class="fontstyle">共</i>
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
              <el-form-item label="每人每天限领" v-if="fullcutParams.num_per_one > 1" class="mb10">
                <el-input  v-model="fullcutParams.num_per_day" :maxlength="5" @blur="formValidator(6)">
                  <i slot="suffix" class="el-input__icon fontstyle">次</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="mt10">
              <el-form-item label="平台承担" class="offadd_input mb10">
                <el-input v-model="fullcutParams.cost_json.platform" :maxlength="3" @blur="formValidator(7)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-form-item label="商家承担" class="offadd_input ml28 mb10">
                <el-input v-model="fullcutParams.cost_json.dealer" :maxlength="3" @blur="formValidator(8)">
                  <i slot="suffix" class="el-input__icon fontstyle">%</i>
                </el-input>
              </el-form-item>
              <el-button size="medium" class="mt7 ml28" @click="openCostDailog()" type="primary">单独成本设置</el-button>
              <div class="clear02 mb10">
                <el-col :span="20">
                  <div class="Allchosenshop">
                    <div class="Allchosenshop_t">
                        已单独设置 <span class="bluecolor02">{{dealerCostList.length}}</span> 个店铺
                    </div>
                    <div class="Allchosenshop_c" style="">
                      <!--没有设置店铺情况 -->
                      <div class="Allchosenshop_c_none" v-if="dealerCostList.length == 0">
                        还没有单独设置任何商家哦
                      </div>
                      <!--设置店铺情况 -->
                      <div class="Allchosenshop_c_have mclear" v-if="dealerCostList.length > 0">
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
          </div>
          <!--备注内容-->
          <div class="offaddFormation mclear mb100">
            <div class="offaddbt clear02">
              <span class="ml32">备注</span>
              <el-form-item class="ml20">
                <el-input type="textarea" class="textarea " placeholder="我是备注的内容，备注中的内容不会展示给用户的哦" v-model="fullcutParams.remark" :maxlength="255"></el-input>
						  </el-form-item>
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
            <span class="fl ml14">排除商品或店铺</span>
            <span class="mclear _bt">
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
              <div class="shopbox_top mclear">
                <el-input placeholder="请输入内容" style="width: 32%;" v-model="goods_query_item.condition">
                   <el-button slot="append" icon="el-icon-search" @click="goodsSelect(1, 8)" type="primary">搜索</el-button>
                </el-input>
                <el-select v-model="goods_query_item.dealerId" clearable placeholder="全部店铺" class="ml15" @change="goodsSelect(1, 8)">
                  <el-option v-for="shop in shopResult.content"
                             :key="shop.dealerId"
                             :label="shop.shopName"
                             :value="shop.dealerId">
                  </el-option>
                </el-select>
                <el-select v-model="goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="goodsSelect(1, 8)" class="ml15">
                  <el-option v-for="classify in classifyList"
                             :key="classify.classifyId"
                             :label="classify.classifyName"
                             :value="classify.classifyId">
                  </el-option>
                </el-select>
              </div>
              <div class="shopbox_cen mclear">
                <!-- 有商品的时候显示 -->
                <div class="shopbox_have mclear" v-if="goodsResult.content != null && goodsResult.content.length > 0">
                  <!--b_active切换-->
                  <div class="pad10">
                    <div class="shopbox_have_box fl" :class="goods.isRemoved == 1 ? 'b_active' : ''" v-for="(goods, index) in goodsResult.content" @click="removeGoods(goods)">
                      <div class="wose shopbox_have_tit mclear">
                        <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                          <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                        </el-tooltip>
                        <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                      </div>
                      <div class="shopbox_have_img02">
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
                <div class="shopbox_no" v-if="goodsResult.content == null || goodsResult.content.length == 0">
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
            <div class="Allchosen">
              <div class="Allchosen_t">
                	已排除 <span class="bluecolor02">{{removeGoodsList.length}}</span> 件商品
              </div>
              <div class="Allchosen_c overflowy">
                <!-- 没有选择任何商品的时候 -->
                <div class="chosen_all_none" v-if="removeGoodsList.length == 0">
                  	还没有选择任何商品哦
                </div>
                <!-- 选择商品的时候 -->
                <div class="chosen_all_have" v-if="removeGoodsList.length > 0">
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
              <div class="shopbox_top mclear">
                <el-input placeholder="请输入店铺名称进行搜索" style="width: 32%;" v-model="shop_query_item.dealerName">
                  <el-button slot="append" icon="el-icon-search" @click="shopSelect()" type="primary">搜索</el-button>
                </el-input>
                <el-select v-model="shop_query_item.dealerClassify" clearable placeholder="全部店铺分类" @change="shopSelect()" class="ml15">
                  <el-option v-for="shopClassify in shopClassifyList"
                             :key="shopClassify.dealerClassifyId"
                             :label="shopClassify.dealerClassifyName"
                             :value="shopClassify.dealerClassifyId">
                  </el-option>
                </el-select>
              </div>
              <div class="shopbox_cen mclear">
                <!-- 请判断有商品的时候显示 -->
                <div class="shopbox_have mclear" v-if="shopResult.content != null && shopResult.content.length > 0">
                  <!--控制b_active-->
                  <div class="pad10">
                    <div class="shopbox_have_box fl" :class="shop.isRemoved == 1 ? 'b_active' : ''" v-for="(shop, index) in shopResult.content" @click="removeShop(shop)">
                      <div class="wose shopbox_have_tit mclear">
                        <el-tooltip :content="shop.shopName" placement="top-start" effect="light" v-if="shop.shopName.length > 15">
                          <span>{{shop.shopName.substring(0,15).concat('...')}}</span>
                        </el-tooltip>
                        <span v-if="shop.shopName.length <= 15">{{shop.shopName}}</span>
                      </div>
                      <div class="shopbox_have_img02">
                        <div class="img fl mr10">
                          <img :src="shop.shopIcon"/>
                        </div>
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
                <div class="shopbox_no" v-if="shopResult.content == null || shopResult.content.length == 0">
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
            <div class="Allchosen">
              <div class="Allchosen_t">
                	已排除 <span class="bluecolor02">{{removeShopList.length}}</span> 个店铺
              </div>
              <div class="Allchosen_c overflowy">
                <!-- 没有选择任何店铺的时候 -->
                <div class="chosen_all_none" v-if="removeShopList.length == 0">
                  	还没有选择任何店铺哦
                </div>
                <!-- 选择店铺的时候 -->
                <div class="chosen_all_have" v-if="removeShopList.length > 0">
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
            <el-button type="primary" @click="rangeDialogVisible = false">确 定</el-button>
            <el-button size="medium" @click="rangeDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <!--单独设置成本弹窗-->
        <el-dialog title="单独成本设置" :visible.sync="costDialogVisible" width="980px" center :close="scanShopCost">
          <div class="sigle_set mclear">
            <div class="sigle_set_left fl">
              <div class="sigle_set_left_t mclear">
                <el-input placeholder="请输入店铺名称进行搜索" v-model="cost_shop_query_item.dealerName" class="offadd_input fl">
                </el-input>
                <el-select v-model="cost_shop_query_item.dealerClassify" clearable placeholder="全部品类" class="fl offadd_input coupon_input ml15" @change="costShopSelect()">
                  <el-option v-for="shopClassify in shopClassifyList"
                             :key="shopClassify.dealerClassifyId"
                             :label="shopClassify.dealerClassifyName"
                             :value="shopClassify.dealerClassifyId">
                  </el-option>
                </el-select>
                <el-button icon="el-icon-search" class="fl mt7 ml15" type="primary" @click="costShopSelect()" style="padding: 9px"></el-button>
              </div>
              <div class="sigle_set_left_b mclear">
                <!--点击效果出现class名字b_active-->
                <div class="sigle_set_leftbox fl" :class="shop.isCost == true ? 'b_active' : ''" v-for="(shop, index) in costShopResult.content" @click="addShopCost(shop)">
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
                  <tr v-for="sku in goodsInfo.goodsSkuList">
                    <td class="a1">
                      <el-checkbox v-model="sku.isCheck"></el-checkbox>
                      <input type="hidden" name="goodsSkuId" v-model="sku.goodsSkuId"/>
                    </td>
                    <td class="a2">
                      <input type="hidden" name="goodsSkuName" v-model="sku.goodsSkuName"/>
                      {{sku.goodsSkuName == '' ? '通用' : sku.goodsSkuName}}
                    </td>
                    <td class="a3">{{sku.goodsSkuInventory}}</td>
                    <td class="a4"><input class="el-input__inner" v-model="sku.goodsSkuNum" @blur="checkSkuNum($event, sku)"/></td>
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
      	<!--选择参与换购商品-->
      	<el-dialog title="选择参与换购商品" :visible.sync="exchangeDialogVisible" width="980px" center>
          <!--商品-->
          <div class="Full-court-b_box">
            <div class="shopbox04">
              <div class="shopbox_top mclear">
                <el-input placeholder="请输入内容" style="width: 32%;" v-model="exchange_goods_query_item.condition">
                   <el-button slot="append" icon="el-icon-search" @click="exchangeGoodsSelect(1)">搜索</el-button>
                </el-input>
                <el-select v-model="exchange_goods_query_item.dealerId" clearable placeholder="全部店铺" class="ml15" @change="exchangeGoodsSelect(1, 8)">
                  <el-option v-for="shop in shopResult.content"
                             :key="shop.dealerId"
                             :label="shop.shopName"
                             :value="shop.dealerId">
                  </el-option>
                </el-select>
                <el-select v-model="exchange_goods_query_item.goodsClassifyId" clearable placeholder="全部品类" @change="exchangeGoodsSelect(1, 8)" class="ml15">
                  <el-option v-for="classify in classifyList"
                             :key="classify.classifyId"
                             :label="classify.classifyName"
                             :value="classify.classifyId">
                  </el-option>
                </el-select>
              </div>
              <div class="shopbox_cen mclear">
                <!-- 有商品的时候显示 -->
                <div class="shopbox_have mclear" v-if="exchangeGoodsResult.content != null && exchangeGoodsResult.content.length > 0">
                  <!--b_active切换-->
                  <div class="pad10">
                      <div class="shopbox_have_box fl" :class="goods.isExchange == 1 ? 'b_active' : ''" v-for="(goods, index) in exchangeGoodsResult.content" @click="chooseExchangeGoods(goods)">
                        <div class="wose shopbox_have_tit mclear">
                          <el-tooltip :content="goods.goodsName" placement="top-start" effect="light" v-if="goods.goodsName.length > 15">
                            <span>{{goods.goodsName.substring(0,15).concat('...')}}</span>
                          </el-tooltip>
                          <span v-if="goods.goodsName.length <= 15">{{goods.goodsName}}</span>
                        </div>
                        <div class="shopbox_have_img02">
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
                        <i :class="goods.isExchange == 1 ? 'icon_selected' : ''"></i>
                      </div>
                  </div>
                </div>
                <!-- 请判断没有商品的时候显示 -->
                <div class="shopbox_no" v-if="exchangeGoodsResult.content == null || exchangeGoodsResult.content.length == 0">
                  <div class="shopboxbg"></div>
                  <div class="shopboxcen">暂时还没有商品可供选择哦</div>
                </div>
                <el-pagination v-if="exchangeGoodsResult.content != null && exchangeGoodsResult.content.length > 0"
                               @current-change="changeExchangeGoodsPageNo"
                               :current-page="exchangeGoodsResult.pageNumber"
                               :page-size="10"
                               layout="total, prev, pager, next, jumper"
                               :total="exchangeGoodsResult.totalCount">
                </el-pagination>
              </div>
            </div>
            <div class="Allchosen">
              <div class="Allchosen_t">
                	已选 <span class="bluecolor02">{{exchangeGoodsList.length}}</span> 件商品
              </div>
              <div class="Allchosen_c overflowy">
                <!-- 没有选择任何商品的时候 -->
                <div class="chosen_all_none" v-if="exchangeGoodsList.length == 0">
                  	还没有选择任何商品哦
                </div>
                <!-- 选择商品的时候 -->
                <div class="chosen_all_have" v-if="exchangeGoodsList.length > 0">
                  <div v-for="(exchange,index) in exchangeGoodsList">
                    <el-tooltip :content="exchange.goodsName" placement="top-start" effect="light">
                      <div class="img fl poi1">
                        <img :src="exchange.goodsImageUrl"/>
                        <div class="poi2 del_info" @click="deleteExchangeGoods(index, exchange)">X</div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="makeExchangeIds()">确 定</el-button>
            <el-button size="medium" @click="exchangeDialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-col>
    </div>
  </template>

<script>
  export default {
    data () {
      return {
        rangeDialogVisible: false,
        costDialogVisible: false,
        skuDialogVisible: false,
        exchangeDialogVisible: false,
        exchange_all_show: false,
        goods_all_show: false,
        shop_all_show: false,
        remove_goods_all_show: false,
        remove_shop_all_show: false,
        goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
        exchange_goods_query_item: {goodsClassifyId: '', condition: '', dealerId: '', pageNum: '', rows: ''}, // 查询商品条件
        goodsResult: '',
        exchangeGoodsResult: '',
        shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 作用商家
        cost_shop_query_item: {dealerName: '', dealerClassify: '', dealerId: '', pageNum: '', rows: ''}, // 作用商家
        shopResult: '',
        costShopResult: '',
        goodsInfo: '',
        chooseGoodsList: [],
        chooseShopList: [],
        classifyList: [],
        shopClassifyList: [],
        rangeClassifyList: [],
        showClassifyList: [],
        removeShopList: [],
        removeGoodsList: [],
        dealerCostList: [], // 商家单独成本设置
        exchangeGoodsList: [],
        tab_flag: 'goods',
        fullCutList: [], // threshold:门槛金额/件数，discount:优惠折扣，money:优惠金额，level:层级,buyingPrice: 换购价,goodsIds:换购商品ids
        fullcutParams: {
          full_cut_id: '', // 满减业务ID
          full_cut_name: '', // 满减名称
          total_num: '', // 满减总数
          expiration_time: [],
          expiration_time_start: '', // 有效期开始时间
          expiration_time_end: '', // 有效期结束世间
          full_cut_type: '1', // 满减形式，1：减钱，2：打折，3：换购
          threshold_type: '1', // 门槛类型，1：金额，2：件数
          range_type: '2', // 作用范围，0：全场，1：商家，2：商品，3：品类
          dealer_ids: [], // 商家ID列表
          goods_ids: [], // 商品ID列表
          goods_classifys: [], // 商品品类列表
          remove_goods_ids: [], // 全场排除的商品IDs
          remove_dealer_ids: [], // 全场排除的商家IDs
          num_per_one: 1, // 每人次数
          num_per_day: 1, // 每天次数
          is_effect: 1, // 是否生效，0：未生效，1：已生效
          cost_json: {platform: '', dealer: ''}, // 成本设置
          receive_type: '0', // 领取方式，0：自动领取，1：手动领取
          remark: '', // 备注
          creator_type: '1', // 生成者类型1：平台，2：商家
          creator: '平台' // 生成者
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
      _this.changeDiscountType()
    },
    created () {
      let _this = this
      _this.fullcutParams.full_cut_id = _this.guid()
    },
    watch: {
      'fullcutParams.expiration_time': {
        handler (val, oldVal) {
          let _this = this
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
            _this.fullcutParams.expiration_time_start = ''
            _this.fullcutParams.expiration_time_end = ''
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
      // 切换level
      changeLevel () {
        let _this = this
        _this.exchangeGoodsList = []
        _this.fullCutList = [{threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}]
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
          _this.goodsSelect(1, 10)
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
          _this.goodsSelect(1, 8)
          _this.classifySelect('-1')
          _this.shopSelect()
        } else if (flag === 'shop') {
          _this.shop_query_item = {dealerName: '', dealerClassify: '', dealerId: '', pageNum: 1, rows: 8}
          _this.shopSelect()
          _this.shopClassifySelect()
        }
      },
      // 商品搜索
      goodsSelect (pageNo, pageSize) {
        let _this = this
        _this.goods_query_item.pageNum = pageNo
        _this.goods_query_item.rows = pageSize
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
//              result.content[i].isExchange = 0
            result.content[i].skuFlag = 0
            result.content[i].chooseSkuList = []
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

//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/goods/choice',
//          data: {
//            goodsClassifyId: _this.goods_query_item.goodsClassifyId,
//            condition: _this.goods_query_item.condition,
//            dealerId: _this.goods_query_item.dealerId,
//            pageNum: _this.goods_query_item.pageNum,
//            rows: _this.goods_query_item.rows
//          },
//          success: function (result) {
//            for (let i = 0; i < result.content.length; i++) {
//              result.content[i].isRemoved = 0
//              result.content[i].isChoosed = 0
//              result.content[i].isExchange = 0
//              result.content[i].skuFlag = 0
//              result.content[i].chooseSkuList = []
//              for (let j = 0; j < _this.chooseGoodsList.length; j++) {
//                if (result.content[i].goodsId === _this.chooseGoodsList[j].goodsId) {
//                  result.content[i].isChoosed = 1
//                  result.content[i].skuFlag = _this.chooseGoodsList[j].skuFlag
//                  result.content[i].chooseSkuList = _this.chooseGoodsList[j].chooseSkuList
//                }
//              }
//              for (let j = 0; j < _this.removeGoodsList.length; j++) {
//                if (result.content[i].goodsId === _this.removeGoodsList[j].goodsId) {
//                  result.content[i].isRemoved = 1
//                }
//              }
//              for (let j = 0; j < _this.exchangeGoodsList.length; j++) {
//                if (result.content[i].goodsId === _this.exchangeGoodsList[j].goodsId) {
//                  result.content[i].isExchange = 1
//                }
//              }
//            }
//            _this.goodsResult = result
//          }
//        })
      },
      // 换购商品搜索
      exchangeGoodsSelect (pageNo, pageSize) {
        let _this = this
        _this.exchange_goods_query_item.pageNum = pageNo
        _this.exchange_goods_query_item.rows = pageSize
        _this.api_businessManagePlatform_goodsSelect({
          data: {
            goodsClassifyId: _this.exchange_goods_query_item.goodsClassifyId,
            condition: _this.exchange_goods_query_item.condition,
            dealerId: _this.exchange_goods_query_item.dealerId,
            pageNum: _this.exchange_goods_query_item.pageNum,
            rows: _this.exchange_goods_query_item.rows
          }
        }).then(result => {
          for (let i = 0; i < result.content.length; i++) {
            result.content[i].isExchange = 0
            for (let j = 0; j < _this.exchangeGoodsList.length; j++) {
              if (result.content[i].goodsId === _this.exchangeGoodsList[j].goodsId) {
                result.content[i].isExchange = 1
              }
            }
          }
          _this.exchangeGoodsResult = result
        })

//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/goods/choice',
//          data: {
//            goodsClassifyId: _this.exchange_goods_query_item.goodsClassifyId,
//            condition: _this.exchange_goods_query_item.condition,
//            dealerId: _this.exchange_goods_query_item.dealerId,
//            pageNum: _this.exchange_goods_query_item.pageNum,
//            rows: _this.exchange_goods_query_item.rows
//          },
//          success: function (result) {
//            for (let i = 0; i < result.content.length; i++) {
//              result.content[i].isExchange = 0
//              for (let j = 0; j < _this.exchangeGoodsList.length; j++) {
//                if (result.content[i].goodsId === _this.exchangeGoodsList[j].goodsId) {
//                  result.content[i].isExchange = 1
//                }
//              }
//            }
//            _this.exchangeGoodsResult = result
//          }
//        })
      },
      // 商品查询改变分页页码
      changeGoodsPageNo (pageNo) {
        let _this = this
        _this.goodsSelect(pageNo, _this.goods_query_item.rows)
      },
      // 换购商品查询改变分页页码
      changeExchangeGoodsPageNo (pageNo) {
        let _this = this
        _this.exchangeGoodsSelect(pageNo, _this.exchange_goods_query_item.rows)
      },
      // 店铺查询改变分页页码
      changeShopPageNo (pageNo) {
        let _this = this
        _this.shop_query_item.pageNum = pageNo
        _this.shopSelect()
      },
      // 成本设置店铺查询改变分页页码
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
          if (goods.isChoosed == 0) {
            _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//            goods.goodsSkuList[i].isCheck = true
            goods.goodsSkuList[i].goodsSkuNum = 0
          } else {
            if (goods.skuFlag == 0) {
              _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//              goods.goodsSkuList[i].isCheck = true
              goods.goodsSkuList[i].goodsSkuNum = goods.goodsSkuList[i].goodsSkuInventory
            } else {
              _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//              goods.goodsSkuList[i].isCheck = true
              goods.goodsSkuList[i].goodsSkuNum = 0
              for (let g = 0; g < goods.chooseSkuList.length; g++) {
                if (goods.goodsSkuList[i].goodsSkuId === goods.chooseSkuList[g].goodsSkuId) {
                  _this.$set(goods.goodsSkuList[i], 'isCheck', true)
//                  goods.goodsSkuList[i].isCheck = true
                  goods.goodsSkuList[i].goodsSkuNum = goods.chooseSkuList[g].goodsSkuNum
                }
              }
            }
          }
        }
        _this.goodsInfo = goods
      },
      // 验证规格数
      checkSkuNum (e, sku) {
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
      },
      // 作用范围为商品,选择商品
      chooseGoods (goodsInfo, skuFlag) {
        let _this = this
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
              chooseSku.goodsSkuId = goodsInfo.goodsSkuList[i].goodsSkuId
              chooseSku.goodsSkuNum = goodsInfo.goodsSkuList[i].goodsSkuNum
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
//              _this.goodsResult.content[i].goodsSkuList[g].isCheck = false
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
        })

//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/goods/classify/tree',
//          data: {
//            parentClassifyId: parentClassifyId
//          },
//          success: function (result) {
//            _this.classifyList = result.content
//          }
//        })
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
      // 作用范围为品类，删除品类
      deleteClassify (index, classify) {
        let _this = this
        _this.$refs.classifyTree.setChecked(classify.classifyId, false, true)
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

//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/shop/sys/shop',
//          data: {
//            dealerName: _this.shop_query_item.dealerName,
//            dealerClassify: _this.shop_query_item.dealerClassify,
//            dealerId: _this.shop_query_item.dealerId,
//            rows: _this.shop_query_item.rows,
//            pageNum: _this.shop_query_item.pageNum
//          },
//          success: function (result) {
//            for (let i = 0; i < result.content.length; i++) {
//              result.content[i].isChoosed = 0
//              result.content[i].isRemoved = 0
//              result.content[i].isCost = false
//              for (let j = 0; j < _this.chooseShopList.length; j++) {
//                if (result.content[i].dealerId === _this.chooseShopList[j].dealerId) {
//                  result.content[i].isChoosed = 1
//                }
//              }
//              for (let j = 0; j < _this.removeShopList.length; j++) {
//                if (result.content[i].dealerId === _this.removeShopList[j].dealerId) {
//                  result.content[i].isRemoved = 1
//                }
//              }
//              for (let j = 0; j < _this.dealerCostList.length; j++) {
//                if (result.content[i].dealerId === _this.dealerCostList[j].dealerId) {
//                  result.content[i].isCost = true
//                }
//              }
//            }
//            _this.shopResult = result
//          }
//        })
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
//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/shop/sys/shop',
//          data: {
//            dealerName: _this.cost_shop_query_item.dealerName,
//            dealerClassify: _this.cost_shop_query_item.dealerClassify,
//            dealerId: _this.cost_shop_query_item.dealerId,
//            rows: _this.cost_shop_query_item.rows,
//            pageNum: _this.cost_shop_query_item.pageNum
//          },
//          success: function (result) {
//            for (let i = 0; i < result.content.length; i++) {
//              result.content[i].isCost = false
//              for (let j = 0; j < _this.dealerCostList.length; j++) {
//                if (result.content[i].dealerId === _this.dealerCostList[j].dealerId) {
//                  result.content[i].isCost = true
//                }
//              }
//            }
//            _this.costShopResult = result
//          }
//        })
      },
      // 店铺分类搜索
      shopClassifySelect () {
        let _this = this
        _this.api_businessManagePlatform_dealerSecondClassify({
          data: {}
        }).then(result => {
          _this.shopClassifyList = result.content
        })
//        $.ajax({
//          type: 'get',
//          url: _this.BASE_URL + 'm2c.scm/dealerclassify/sys/dealer/all/second/classify',
//          success: function (result) {
//            _this.shopClassifyList = result.content
//          }
//        })
      },
      // 作用范围为店铺,选择店铺
      chooseShop (shop) {
        let _this = this
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
      // 作用范围为全场，添加被排除商品
      removeGoods (goodsInfo) {
        let _this = this
        if (goodsInfo.isRemoved == 0) { // 未选中的商品被排除
          _this.removeGoodsList.push(goodsInfo)
          goodsInfo.isRemoved = 1
        } else if (goodsInfo.isRemoved == 1) { // 已排除的商品被取消
          goodsInfo.isRemoved = 0
          for (let i = 0; i < _this.removeGoodsList.length; i++) {
            if (_this.removeGoodsList[i].goodsId === goodsInfo.goodsId) { // 该商品已在被排除商品列表中
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
          _this.removeShopList.push(shopInfo)
          shopInfo.isRemoved = 1
        } else if (shopInfo.isRemoved == 1) { // 已排除的店铺被取消
          shopInfo.isRemoved = 0
          for (let i = 0; i < _this.removeShopList.length; i++) {
            if (_this.removeShopList[i].dealerId === shopInfo.dealerId) { // 该店铺已在被排除店铺列表中
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
      // 打开换购商品弹窗
      openGoodsExchange () {
        var _this = this
        _this.exchangeDialogVisible = true
        _this.exchange_goods_query_item.goodsClassifyId = ''
        _this.exchange_goods_query_item.condition = ''
        _this.exchange_goods_query_item.dealerId = ''
        _this.exchange_goods_query_item.rows = 8
        _this.exchange_goods_query_item.pageNum = 1
        _this.exchangeGoodsSelect(1, 8)
      },
      // 选择换购商品
      chooseExchangeGoods (exchangeGoods) {
        let _this = this
        if (exchangeGoods.isExchange == 0) {
          exchangeGoods.isExchange = 1
          _this.exchangeGoodsList.push(exchangeGoods)
        } else if (exchangeGoods.isExchange == 1) {
          exchangeGoods.isExchange = 0
          for (var i = 0; i < _this.exchangeGoodsList.length; i++) {
            if (_this.exchangeGoodsList[i].goodsId === exchangeGoods.goodsId) {
              _this.exchangeGoodsList.splice(i, 1)
            }
          }
        }
      },
      // 删除换购商品
      deleteExchangeGoods (index, exchange) {
        let _this = this
        _this.exchangeGoodsList.splice(index, 1)
        for (var i = 0; i < _this.exchangeGoodsResult.content.length; i++) {
          if (_this.exchangeGoodsResult.content[i].goodsId === exchange.goodsId) {
            _this.exchangeGoodsResult.content[i].isExchange = 0
          }
        }
      },
      // 新增满减层级
      addDiscount () {
        // flag--1:滿元減元,2:满件减元，3：满元打折，4：满件打折
        let _this = this
        for (let i = 0; i < _this.fullCutList.length; i++) {
          _this.fullCutList[i].threshold = parseInt(_this.fullCutList[i].threshold) < 0 ? 0 - _this.fullCutList[i].threshold : _this.fullCutList[i].threshold
          _this.fullCutList[i].money = parseInt(_this.fullCutList[i].money) < 0 ? 0 - _this.fullCutList[i].money : _this.fullCutList[i].money
          _this.fullCutList[i].discount = parseInt(_this.fullCutList[i].discount) < 0 ? 0 - _this.params.discount : _this.fullCutList[i].discount
          if (_this.fullcutParams.full_cut_type == 1) {
            if (_this.fullCutList[i].threshold === '' || _this.fullCutList[i].money === '') {
              _this.warning('满减门槛金额/件数和优惠金额不能为空')
              return
            }
            if (_this.fullcutParams.full_cut_type == 1 &&
              _this.fullcutParams.threshold_type == 1 &&
              parseInt(_this.fullCutList[i].threshold) < parseInt(_this.fullCutList[i].money)) {
              _this.warning('满减优惠金额不能大于门槛金额')
              return
            }
          }
          if (_this.fullcutParams.full_cut_type == 2) {
            if (_this.fullCutList[i].threshold === '' || _this.fullCutList[i].discount === '') {
              _this.warning('满减门槛金额/件数和优惠折扣不能为空')
              return
            }
            if (parseInt(_this.fullCutList[i].discount) > 10) {
              _this.warning('满减优惠折扣必须为0-10')
              return
            }
          }
        }
        if (_this.fullCutList.length > 1) {
          for (let i = 0; i < _this.fullCutList.length; i++) {
            for (let g = i + 1; g < _this.fullCutList.length; g++) {
              if (_this.fullcutParams.full_cut_type == 1) {
                if (parseInt(_this.fullCutList[g].threshold) <= parseInt(_this.fullCutList[i].threshold) ||
                  parseInt(_this.fullCutList[g].money) <= parseInt(_this.fullCutList[i].money)) {
                  _this.warning('满减门槛金额/件数和优惠金额必须逐级递增')
                  _this.fullCutList[g].threshold = ''
                  _this.fullCutList[g].money = ''
                  return
                }
              }
              if (_this.fullcutParams.full_cut_type == 2) {
                if (parseInt(_this.fullCutList[g].threshold) <= parseInt(_this.fullCutList[i].threshold)) {
                  _this.warning('满减门槛金额/件数必须逐级递增')
                  _this.fullCutList[g].threshold = ''
                  return
                }
                if (parseFloat(_this.fullCutList[g].discount) >= parseFloat(_this.fullCutList[i].discount)) {
                  _this.warning('满减优惠折扣必须逐级递减')
                  _this.fullCutList[g].discount = ''
                  return
                }
              }
            }
          }
        }
        if (_this.fullCutList.length < 3) {
          let fullcut = {threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}
          _this.fullCutList.push(fullcut)
        } else {
          _this.warning('最多添加3个层级')
        }
      },
      // 切换满减门槛类型和优惠方式
      changeDiscountType () {
        let _this = this
        _this.exchangeGoodsList = []
        _this.fullCutList = [{threshold: '', discount: '', money: '', level: '', buyingPrice: '', goodsIds: ''}]
      },
      // 删除满减层级
      deleteDiscount (index) {
        let _this = this
        if (index > 0) {
          _this.fullCutList.splice(index, 1)
        }
      },
      // 拼接选中商品IDs
      makeGoodsIds () {
        let _this = this
        _this.fullcutParams.goods_ids = []
        for (let i = 0; i < _this.chooseGoodsList.length; i++) {
          let goodsItem = {}
          goodsItem.goodsId = _this.chooseGoodsList[i].goodsId
          goodsItem.goodsName = _this.chooseGoodsList[i].goodsName
          goodsItem.skuFlag = _this.chooseGoodsList[i].skuFlag
          var goodsItemSkuList = []
          if (_this.chooseGoodsList[i].skuFlag == 1) {
            for (var g = 0; g < _this.chooseGoodsList[i].chooseSkuList.length; g++) {
              var goodsItemSku = {}
              goodsItemSku.skuId = _this.chooseGoodsList[i].chooseSkuList[g].goodsSkuId
              goodsItemSku.skuNum = _this.chooseGoodsList[i].chooseSkuList[g].goodsSkuNum
              goodsItemSkuList.push(goodsItemSku)
            }
          }
          goodsItem.skuList = goodsItemSkuList
          _this.fullcutParams.goods_ids.push(goodsItem)
        }
      },
      // 拼装作用范围商家参数
      makeDealerIds () {
        let _this = this
        _this.fullcutParams.dealer_ids = []
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
        for (var i = 0; i < _this.rangeClassifyList.length; i++) {
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
      // 拼装换购商品Id
      makeExchangeIds () {
        let _this = this
        let exchangeGoodsIds = []
        for (let i = 0; i < _this.exchangeGoodsList.length; i++) {
          exchangeGoodsIds.push(_this.exchangeGoodsList[i].goodsId)
        }
        _this.fullCutList[0].goodsIds = exchangeGoodsIds.join(',')
        _this.exchangeDialogVisible = false
      },
      // 发送添加请求
      postfrom () {
        let _this = this
        let flag = _this.formValidator(0)
        if (flag) {
          for (let i = 0; i < _this.fullCutList.length; i++) {
            _this.fullCutList[i].level = i + 1
          }
          _this.makeGoodsIds()
          _this.makeDealerIds()
          _this.makeClassifyIds()
          _this.makeRemoveIds()
          let rebody = {
            full_cut_id: _this.fullcutParams.full_cut_id,
            full_cut_name: _this.fullcutParams.full_cut_name,
            total_num: _this.fullcutParams.total_num,
            expiration_time_start: _this.fullcutParams.expiration_time_start,
            expiration_time_end: _this.fullcutParams.expiration_time_end,
            full_cut_type: _this.fullcutParams.full_cut_type,
            threshold_type: _this.fullcutParams.threshold_type,
            full_cut_json: JSON.stringify(_this.fullCutList),
            range_type: _this.fullcutParams.range_type,
            dealer_ids: JSON.stringify(_this.fullcutParams.dealer_ids),
            goods_ids: JSON.stringify(_this.fullcutParams.goods_ids),
            goods_classifys: JSON.stringify(_this.fullcutParams.goods_classifys),
            remove_goods_ids: JSON.stringify(_this.fullcutParams.remove_goods_ids),
            remove_dealer_ids: JSON.stringify(_this.fullcutParams.remove_dealer_ids),
            num_per_one: _this.fullcutParams.num_per_one,
            num_per_day: _this.fullcutParams.num_per_day,
            is_effect: _this.fullcutParams.is_effect,
            cost_json: JSON.stringify(_this.fullcutParams.cost_json),
            dealer_cost_list: JSON.stringify(_this.dealerCostList),
            receive_type: _this.fullcutParams.receive_type,
            remark: _this.fullcutParams.remark,
            creator_type: _this.fullcutParams.creator_type,
            creator: _this.fullcutParams.creator
          }
          console.log('rebody:', JSON.stringify(rebody))
          _this.api_businessManagePlatform_fullcutCreation({
            data: JSON.stringify(rebody),
            headers: {'Content-Type': 'application/json;'}
          }).then(result => {
            console.log('status:', result.status)
            _this.$router.push({path: '/m/marketTool/fullcutList'})
          })

//          $.ajax({
//            url: _this.BASE_URL + 'm2c.market/admin/fullcut/creation',
//            contentType: 'application/json', // 必须有
//            headers: {'access_token': sessionStorage.getItem('access_token')},
//            type: 'post',
//            data: JSON.stringify(rebody),
//            success: function (result) {
//              if (result.status == 200) {
//                console.log('status:', result.status)
//                _this.$router.push({path: '/m/marketTool/fullcutList'})
//              }
//            }
//          })
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
        // falg--1:名称，2：总数，3：时间,4:形式，5：每人次数,6:每天次数,7:平台成本,8:商家成本
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
            _this.warning('满减数量最多5位正整数，填0即为不限制数量')
            return false
          }
        }
        if (flag == 0 || flag == 3) {
          if (_this.fullcutParams.expiration_time != null && _this.fullcutParams.expiration_time.length > 0) {
            _this.fullcutParams.expiration_time_start = _this.formatDate(_this.fullcutParams.expiration_time[0], 'yyyy-MM-dd')
            _this.fullcutParams.expiration_time_end = _this.formatDate(_this.fullcutParams.expiration_time[1], 'yyyy-MM-dd')
          }
          if (_this.fullcutParams.expiration_time_start == '' || _this.fullcutParams.expiration_time_end == '') {
            _this.warning('有效期时间不能为空')
            return false
          }
        }
        if (flag == 0 || flag == 5) {
          if (!/^[0-9]{1,5}$/.test(_this.fullcutParams.num_per_one) ||
            parseInt(_this.fullcutParams.num_per_one) < 1 ||
            (parseInt(_this.fullcutParams.total_num) > 0 && parseInt(_this.fullcutParams.num_per_one) > parseInt(_this.fullcutParams.total_num))) {
            _this.warning('每人优惠次数必须大于0且小于满减总次数')
            _this.fullcutParams.num_per_one = 1
            return false
          }
        }
        if (flag == 0 || flag == 6) {
          if (!/^[0-9]{1,5}$/.test(_this.fullcutParams.num_per_day) ||
            parseInt(_this.fullcutParams.num_per_day) < 1 ||
            parseInt(_this.fullcutParams.num_per_day) > parseInt(_this.fullcutParams.num_per_one)) {
            _this.warning('每人每天优惠次数必须大于0且小于每人优惠次数')
            _this.fullcutParams.num_per_day = 1
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
          if (_this.fullcutParams.cost_json.platform !== '' &&
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
          if (_this.fullcutParams.cost_json.dealer !== '' &&
            parseInt(_this.fullcutParams.cost_json.dealer) >= 0 &&
            parseInt(_this.fullcutParams.cost_json.dealer) <= 100) {
            _this.fullcutParams.cost_json.platform = 100 - _this.fullcutParams.cost_json.dealer
          }
        }
        if (flag == 0) {
          for (let i = 0; i < _this.fullCutList.length; i++) {
            if (_this.fullcutParams.full_cut_type == 1) {
              if (_this.fullCutList[i].threshold == '' || _this.fullCutList[i].money == '') {
                _this.warning('满减门槛金额/件数和优惠金额不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(_this.fullCutList[i].threshold) || !/^[1-9][0-9]*$/.test(_this.fullCutList[i].money)) {
                _this.warning('满减门槛金额/件数和优惠金额必须为正整数')
                return false
              }
              if (_this.fullcutParams.threshold_type == 1 &&
                parseInt(_this.fullCutList[i].threshold) <= parseInt(_this.fullCutList[i].money)) {
                _this.warning('满减优惠金额不能大于门槛金额')
                return false
              }
              for (let g = i + 1; g < _this.fullCutList.length; g++) {
                if (parseInt(_this.fullCutList[g].threshold) <= parseInt(_this.fullCutList[i].threshold) ||
                  parseInt(_this.fullCutList[g].money) <= parseInt(_this.fullCutList[i].money)) {
                  _this.warning('满减门槛金额/件数和优惠金额必须逐级递增')
                  _this.fullCutList[g].threshold = ''
                  _this.fullCutList[g].money = ''
                  return false
                }
              }
            }
            if (_this.fullcutParams.full_cut_type == 2) {
              if (_this.fullCutList[i].threshold == '' || _this.fullCutList[i].discount == '') {
                _this.warning('满减门槛金额/件数和优惠折扣不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(_this.fullCutList[i].threshold)) {
                _this.warning('满减门槛金额/件数必须为正整数')
                return false
              }
              if (!/^(\d)(\.\d{1,2})?$/.test(_this.fullCutList[i].discount) ||
                parseFloat(_this.fullCutList[i].discount) == 0) {
                _this.warning('优惠折扣必须为0-10之间的最多两位小数')
                return false
              }
              for (let g = i + 1; g < _this.fullCutList.length; g++) {
                if (parseInt(_this.fullCutList[g].threshold) <= parseInt(_this.fullCutList[i].threshold)) {
                  _this.warning('满减门槛金额/件数必须逐级递增')
                  _this.fullCutList[g].threshold = ''
                  return false
                }
                if (parseFloat(_this.fullCutList[g].discount) >= parseFloat(_this.fullCutList[i].discount)) {
                  _this.warning('满减优惠折扣必须逐级递减')
                  _this.fullCutList[g].discount = ''
                  return false
                }
              }
            }
            if (_this.fullcutParams.full_cut_type == 3) {
              if (_this.fullCutList[i].threshold == '' ||
                _this.fullCutList[i].buyingPrice == '' ||
                _this.fullCutList[i].goodsIds == '') {
                _this.warning('满减门槛金额/件数，换购价和换购商品不能为空')
                return false
              }
              if (!/^[1-9][0-9]*$/.test(_this.fullCutList[i].buyingPrice)) {
                _this.warning('满减换购金额必须为正整数')
                return false
              }
            }
          }
          if (_this.fullcutParams.full_cut_typ == 3 && _this.exchangeGoodsList.length <= 0) {
            _this.warning('满减形式为换购时已选换购商品不能为空')
            return false
          }
          if (_this.fullcutParams.range_type == 1 && _this.chooseShopList.length <= 0) {
            _this.warning('作用范围为商家时已选商家不能为空')
            return false
          }
          if (_this.fullcutParams.range_type == 2 && _this.chooseGoodsList.length <= 0) {
            _this.warning('作用范围为商品时已选商品不能为空')
            return false
          }
          if (_this.fullcutParams.range_type == 3 && _this.rangeClassifyList.length <= 0) {
            _this.warning('作用范围为品类时已选品类不能为空')
            return false
          }
          if (_this.dealerCostList.length > 0) {
            if (_this.fullcutParams.cost_json.platform === '' || _this.fullcutParams.cost_json.dealer === '') {
              _this.warning('请填写通用成本设置')
              return false
            }
            for (let i = _this.dealerCostList.length - 1; i >= 0; i--) {
              if (_this.dealerCostList[i].platform === '' ||
                parseInt(_this.dealerCostList[i].platform) < 0 ||
                parseInt(_this.dealerCostList[i].platform) > 100 ||
                _this.dealerCostList[i].dealer === '' ||
                parseInt(_this.dealerCostList[i].dealer) < 0 ||
                parseInt(_this.dealerCostList[i].dealer) > 100 ||
                (_this.dealerCostList[i].platform !== '' && _this.dealerCostList[i].dealer !== '' && 100 - parseInt(_this.dealerCostList[i].platform) !== parseInt(_this.dealerCostList[i].dealer))) {
                _this.dealerCostList.splice(i, 1)
                _this.warning('平台承担成本和商家承担成本不能为空且和必须为100')
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
  .mb0{
    margin-bottom: 0px;
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mb20{
    margin-bottom: 20px;
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
      .shopbox04{
        height: 390px;
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
          height: 360px;
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
            height: 80%;
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
                  width: 58%;
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
                  width: 58%;
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
        color:rgba(153,153,153,1);
        /*line-height:55px;*/
        display: inline-block;
        background: #F5F5F5;
        padding-left: 20px;
        padding-right: 20px;
      }
      .Allchosenshop{
        margin-top: 10px;
        border:1px solid #E6E8F2;
        border-radius: 3px;
        margin-left: 88px;
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
        margin-left: 88px;
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
                width: 58%;
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
        margin-left: 88px;
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
          min-height: 88px;
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
      .ml66{
        margin-left: 66px;
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
    /*margin-top: 20px;*/
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
  .mt6{
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
  .ml14{
    margin-left: 14px;
  }
  .ml15{
    margin-left: 15px;
  }
  .wid290{
  	width: 290px;
  }
  .wid650{
    width: 650px;
  }
  .wid666{
    width: 666px;
  }
  .ml20{
    margin-left: 20px;
  }
  .ml28{
    margin-left: 28px;
  }
  .linh35{
    line-height: 35px;
    display: inline-block;
    font-size: 14px;
  }
  .ml88{
    margin-left: 88px;
  }
  .ml32{
    margin-left: 32px;
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
