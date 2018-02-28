<template>
  <div class='m_banner' @click="cancel_class_chose">
    <div class="banner_admin">
      <p>顶部banner编辑</p>
      <div class="parent_search_button">
        <input type="text" placeholder="请输入banner标题或者编号进行搜索" @keydown.enter="get_banner_info" v-model="filterString">
        <button class="search_button" @click="get_banner_info">搜索</button>
      </div>
      <div>
        <button class="add_button" @click="banner_edit('add')">新增banner
          <!-- <div class="public_icon_top"></div>
          <div class="public_icon_left"></div> -->
        </button>
        <span style="margin-left:20px;color:#777777;">(目前共{{banner_pages.totalCount}}条banner)</span>
      </div>
      <div class="public_banner" v-for="(cell,index) in module_number" :key="index">
        <img class="banner_img" :src="cell.picUrl" width="230" height="100" content="Bottom center" placement="bottom" effect="light"></img>
        <el-tooltip placement="top"  v-if="Number(module_number[index].effectStrategy)===1&&new Date(module_number[index].effectTime).getTime()>new Date().getTime()">
          <div slot="content" style="text-align:center;">定时生效时间<br/>{{cell.effectTime}}</div>
           <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:5px;top:5px;">
        </el-tooltip>
        <span>编号：{{cell.bannerNo}}</span>
        <p style="width:200px;height:19px;overflow:hidden;">{{cell.title}}</p>
        <div class="banner_link"><span style="margin:0px;display:inline-block;position:absolute;">链接：</span><span style="margin:0 0 0 36px;">{{cell.linkType==='GOODS'?cell.goodsName:cell.linkType==='SHOP'?cell.shopName:cell.link}}</span></div>
        <button class="public_banner_edit" @click="banner_edit('modify',module_number[index])">编辑</button>
        <button class="public_banner_delete small-font smallsize-font" @click="click_banner_delete(module_number[index])">删除本条</button>
      </div>
      <!-- banner_pages: {pageNo: '', pageCount: ''} -->
      <div class="banner_page">
        <button :class="banner_pages.pageNo == '1'?'page_btn dis_able' :'page_btn'" @click="flip('banner','prev')">上一页</button>
        <span class="page_color">{{banner_pages.pageNo}}</span>/{{banner_pages.pageCount}}
        <button :class="banner_pages.pageNo == banner_pages.pageCount?'page_btn dis_able' :'page_btn'" @click="flip('banner','next')">下一页</button>
        <!-- <span class="mar_l">转到</span><input type="text" class="page_color inp" v-model="join_circle_params.pages"><span>页</span>  <button class="page_btn" @click="flip('turn', row)">确定</button> -->
      </div>
    </div>
    <div class="banner_right">
      <p>请选择首页展示编号</p>
      <input type="text" maxlength="2" style="margin-top:15px;" v-model="bannerNo_clecked.first" @mouseover="get_img_src" @mouseout="remove_img_src">
      <div id="bannerNo_clecked_first" style="position:absolute;top:28px;left:-134px;overflow:hidden;" v-if="bannerNo_clecked_img">
        <img :src="bannerNo_clecked_img?bannerNo_clecked_img:false" width="160px;height:70px;" v-if="bannerNo_clecked_img">
      </div>
      <input type="text" maxlength="2" style="margin-top:15px;" v-model="bannerNo_clecked.second" @mouseover="get_img_src" @mouseout="remove_img_src">
      <input type="text" maxlength="2" v-model="bannerNo_clecked.third" @mouseover="get_img_src" @mouseout="remove_img_src">
      <input type="text" maxlength="2" v-model="bannerNo_clecked.fourth" @mouseover="get_img_src" @mouseout="remove_img_src">
      <input type="text" maxlength="2" v-model="bannerNo_clecked.fifth" @mouseover="get_img_src" @mouseout="remove_img_src">
      <button style="background:#11D2EB;margin-top:21px;" @click="banner_No_clecked">确认</button>
      <!-- <button style="background:#B7C9E1;">取消</button> -->
    </div>
    
    <!-- 新增/修改banner -->
    <el-dialog
      title=""
      custom-class='dialog chose_goods'
      :visible.sync="choose_show"
      :before-close="cancle_banner_edit">
      <div :class='["frame_layer modal",choose_show?"frame_layer_show":""]'>
        <div class="modal-dialog frame">
          <div class="frame_left">
            <span>banner上传</span>
            <input v-if="upload_img_show" type="file" id="banner_img_input" style="display:none" @change="upload_img" accept="image/jpg, image/jpeg, image/png, image/gif">
            <div class="img_banner" style="width:90px;height:55px;position:relative;">
              <i class="iconfont icon-icon_pic" style="font-size:55px;position:absolute;bottom:16px;" v-show="img_src===false"></i>
              <img width="90" height="55" id="banner_img" v-show="img_src!==false" :src="img_src">
            </div>
            <div class="banner_img_tips">尺寸限制710px*332px，300K以内，格式：jpg、jpeg、png、gif</div>
            <button class="banner_upload_btn" onclick="document.querySelector('#banner_img_input').click()">点击上传</button>
            <span>banner名</span>
            <input class="banner_upload_name" placeholder="请输入banner名" maxlength="50" v-model="module_add_info.title">
            <span>链接选择</span>
            <div class="banner_chose">
              <label>
                <input type="radio" value='GOODS' v-model="module_add_info.linkType">商品
              </label>
            </div>
            <div class="banner_chose">
              <label class="bz">
                <input type="radio" value='SHOP' v-model="module_add_info.linkType">店铺
              </label>
            </div>
            <div class="banner_chose">
              <label class="bz">
                <input type="radio" value='LINK' v-model="module_add_info.linkType">链接
              </label>
            </div>
            <span>生效时间</span>
            <div class="banner_chose">
              <label>
                <input type="radio" value=0 v-model="module_add_info.effectStrategy">立即生效
              </label>
            </div>
            <div class="banner_chose">
              <label class="bz">
                <input type="radio" value=1 v-model="module_add_info.effectStrategy">定时生效
              </label>
            </div>
            <div class="date_style_add">
              <el-date-picker
                v-show="parseInt(module_add_info.effectStrategy)===1"
                v-model="module_add_info.effectTime"
                :editable = "false"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <!-- <input type="date" id="chose_time"  :min="this.tool.date.format(new Date(new Date().getTime()), 'yyyy-MM-dd')" class="form-control search_input search_input_date_l" v-model="module_add_info.effectTime" v-show="parseInt(module_add_info.effectStrategy) === 1"> -->
          </div>
          <div class="frame_total">
            <!-- 点击选中的商品 -->
            <div class="tc_shop" v-if="module_add_info.linkType==='GOODS'">
              <span>{{module_add_info.linkType==='GOODS'?'已选商品':module_add_info.linkType==='SHOP'?'已选商家':''}}</span>
              <div class="merchant fl" v-show="choose_goods_checked">
                <h6>{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsName:choose_shops_checked_info.shopName}}</h6>
                <img class="fl" :src="module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsImageUrl:choose_shops_checked_info.shopIcon">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:70px;height:19px;overflow:hidden;">{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.dealerName:choose_shops_checked_info.shopName}}</div>
                  <div class="public_description">{{module_add_info.linkType==='GOODS'?'价格：':'在售商品'}}</div>
                  <div class="public_description">{{module_add_info.linkType==='GOODS'?'￥':''}}{{choose_goods_checked_info.goodsPrice}}{{module_add_info.linkType==='SHOP'?'件':''}}</div>
                </div>
              </div>
            </div>
            <!-- 点击选中的店铺 -->
            <div class="tc_shop" v-if="module_add_info.linkType==='SHOP'">
              <span>{{module_add_info.linkType==='GOODS'?'已选商品':module_add_info.linkType==='SHOP'?'已选商家':''}}</span>
              <div class="merchant fl" v-show="choose_shops_checked">
                <h6>{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsName:choose_shops_checked_info.shopName}}</h6>
                <img class="fl" :src="module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsImageUrl:choose_shops_checked_info.shopIcon">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:70px;height:19px;overflow:hidden;">{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.dealerName:choose_shops_checked_info.dealerName}}</div>
                  <div class="public_description">{{module_add_info.linkType==='GOODS'?'价格：':'在售商品:'}}</div>
                  <div class="public_description">{{module_add_info.linkType==='GOODS'?'￥':''}}{{choose_shops_checked_info.onSaleGoods}}{{module_add_info.linkType==='SHOP'?'件':''}}</div>
                </div>
              </div>
            </div>
            <div class="search">
              <div v-if="module_add_info.linkType==='LINK'" style="margin-top:200px;">
                <div style="font-size: 12px;font-weight:700;">输入网址链接</div>
                <input v-model="module_add_info.link" style="width:600px;height:24px;border-radius:2px;outline:none;border:1px solid #BFC1CB;padding-left:20px;font-size: 12px;color:#777777" placeholder="http://">
              </div>
              <div class="search_tit">{{module_add_info.linkType==='GOODS'?'选择商品':module_add_info.linkType==='SHOP'?'选择商家':''}}</div>
              <div class="search_tit" style="margin-left:293px;" v-if="module_add_info.linkType==='SHOP'">商家分类列表</div>
              <div class="clear" v-if="module_add_info.linkType!=='LINK'">
                <input class="input fl" type="text" placeholder="请输入商品名进行搜索" @keydown.enter="get_goods_list" v-model="good_goodName" v-if="module_add_info.linkType==='GOODS'">
                <input class="input fl" type="text" placeholder="请输入供应商名进行搜索" @keydown.enter="get_shops_list" v-model="shop_shopName" v-if="module_add_info.linkType==='SHOP'">
                <button class="sort fl" @click="get_goods_list" v-if="module_add_info.linkType==='GOODS'">搜索</button>
                <button class="sort fl" @click="get_shops_list" v-if="module_add_info.linkType==='SHOP'">搜索</button>
                <div class="right">
                  <a class="a_btn " style="color:rgba(17,210,235,1);cursor: pointer;" v-if="module_add_info.linkType==='GOODS'" @click="goods_classify_show=true">商品品类选择</a>
                  <!-- <a class="a_btn ">商家筛选</a> -->
                </div>
                <input type="text" class="dealer_class_input" v-if="module_add_info.linkType==='SHOP'" v-model="dealerClassifyName" @click="chose_shops_class" placeholder="请选择二级分类">
                  <div class="dealer_class" v-show="dealer_class_chose" @click="chose_shops_class">
                    <div class="menu">
                      <div v-for="(menu1,index) in firstClassify_list" :key="index">
                        <div class="menu_parent">
                          <label class="menu1_a">
                            <!-- <input class="menu1_a1" type="radio" :value="menu1.dealerFirstClassify" v-model="dealerClassify" @click="chose_shops_dealerClassify('first', firstClassify_list[index])" :dealerFristClassifyName="menu1.dealerFristClassifyName"> -->
                            <span class="menu1_a2">{{menu1.dealerFristClassifyName}}</span>
                          </label>
                          <span class="menu1_b" :dealerFristClassifyName="menu1.dealerFristClassifyName" @click="get_secondClassify(firstClassify_list[index])" style="cursor:pointer;">+</span>
                        </div>
                        <div class="menu_child" style="display:none" :forMenuId="menu1.dealerFirstClassify">
                          <div v-for="(menu2,index) in secondClassify_list" :key="index">
                            <div class="menu2">
                              <label class="menu2_a">
                                <input class="menu2_a1" type="radio" v-model="dealerClassify" @click="chose_shops_dealerClassify('second', secondClassify_list[index])" :dealerSecondClassifyName="menu2.dealerSecondClassifyName" :value="menu2.dealerClassify">
                                <span class="menu2_a2">{{menu2.dealerSecondClassifyName}}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button @click="get_shops_list">确定</button>
                  </div>
              </div>
            </div>
            <div class="goods_body">
              <!-- 商品列表 -->
              <div class="merchant fl" v-if="module_add_info.linkType==='GOODS'&&module_goods.length>0" v-for="(cell,index) in module_goods" :key="index" @click="banner_goods_clecked(module_goods[index])" @mouseover="banner_show_tips(index)">
                <div class="merchant_show" v-show="parseInt(goods_show[index])===1"></div>
                <h6>{{cell.goodsName}}</h6>
                <img class="fl" :src="module_goods_img[index]?module_goods_img[index]:''">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:72px;height:19px;overflow:hidden;">{{cell.dealerName}}</div>
                  <div class="public_description">价格:</div>
                  <div class="public_description">￥{{cell.goodsPrice/100}}</div>
                </div>
              </div>
              <div class="page" v-if="pagination.goods&&module_add_info.linkType==='GOODS'">
                <button :class="join_circle_params.pageNo == '1'?'page_btn dis_able' :'page_btn'" @click="flip('goods','prev')">上一页</button>
                <span class="page_color">{{join_circle_params.pageNo}}</span>/{{join_circle_params.pageCount}}
                <button :class="join_circle_params.pageNo == join_circle_params.pageCount?'page_btn dis_able' :'page_btn'" @click="flip('goods','next')">下一页</button>
                <!-- <span class="mar_l">转到</span><input type="text" class="page_color inp" v-model="join_circle_params.pages"><span>页</span>  <button class="page_btn" @click="flip('turn', row)">确定</button> -->
              </div>
              <!-- 店铺列表 -->
              <div class="merchant fl" v-if="module_add_info.linkType==='SHOP'&&module_shops.length>0" v-for="(cell,index) in module_shops" :key="index" @click="banner_goods_clecked(module_shops[index])" @mouseover="banner_show_tips(index)">
                <div class="merchant_show" v-show="parseInt(goods_show[index])===1"></div>
                <h6>{{cell.shopName}}</h6>
                <img class="fl" :src="module_shops_img[index]?module_shops_img[index]:''">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:70px;height:19px;overflow:hidden;">{{cell.dealerName}}</div>
                  <div class="public_description">在售商品:</div>
                  <div class="public_description">{{cell.onSaleGoods}}件</div>
                </div>
              </div>
              <div class="page" v-if="pagination.shops&&module_add_info.linkType==='SHOP'">
                <button :class="join_circle_params_shop.pageNo == '1'?'page_btn dis_able' :'page_btn'" @click="flip('shops','prev')">上一页</button>
                <span class="page_color">{{join_circle_params_shop.pageNo}}</span>/{{join_circle_params_shop.pageCount}}
                <button :class="join_circle_params_shop.pageNo == join_circle_params_shop.pageCount?'page_btn dis_able' :'page_btn'" @click="flip('shops','next')">下一页</button>
                <!-- <span class="mar_l">转到</span><input type="text" class="page_color inp" v-model="join_circle_params.pages"><span>页</span>  <button class="page_btn" @click="flip('turn', row)">确定</button> -->
              </div>
            </div>
            <div class="footer">
              <button type="button" class="btn cancel" @click="banner_edit_confirm">确认</button>
              <button type="button" class="btn reset" @click="click_reset">重置</button>
              <button type="button" class="btn save" data-dismiss="modal" @click="cancle_banner_edit">取消</button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 删除弹框 -->
    <!-- <div class="modal fade" id="detele_banner" role="dialog" aria-labelledby="sign_outLabel" aria-hidden="true">
      <div class="modal-dialog" style="width:440px">
        <div class="modal-content">
          <div class="modal-body">
            <h4 class="modal-title text-center" id="sign_outLabel" style="line-height:3">
              是否确认删除?
            </h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn save" @click="banner_delete_confirm">确认
            </button>
            <button type="button" class="btn cancel" data-dismiss="modal">我再想想
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!--商品筛选品类弹框s-->
    <el-dialog
      custom-class="dialog goods_classify"
      :visible.sync="goods_classify_show">
      <div class="goods_category_layer_chose">
        <div class="modal-dialog category_goodchoose">
          <div class="shop_choose_center">
            <div class="modal-header">
              <div class="modal-title text-center">
                <span>品类选择</span>
                <!-- <div class="guanb" data-dismiss="modal" aria-hidden="true" @click="goods_classify_show=false"></div> -->
              </div>
            </div>
            <div class="modal-body">
              <div class="menu_goods">
                <div v-for="(menu1,index) in classification_chose_list" :key="index">
                  <div class="menu_parent">
                    <label class="menu1_a">
                      <input class="menu1_a1" type="radio" :value="menu1.classifyId" v-model="goodsClassifyId" :classifyName="menu1.classifyName" :parentClassifyId="menu1.parentClassifyId">
                      <span class="menu1_a2">{{menu1.classifyName}}</span>
                    </label>
                    <span class="menu1_b" :classifyName="menu1.classifyName" :classifyId="menu1.classifyId" :parentClassifyId="menu1.parentClassifyId" @click="expand_menu_title" style="cursor:pointer;">+</span>
                  </div>
                  <div class="menu_child" style="display:none" :forMenuId="menu1.classifyId">
                    <div v-for="(menu2,index) in menu1.subClassify" :key="index">
                      <div class="menu2">
                        <label class="menu2_a">
                          <input class="menu2_a1" type="radio" v-model="goodsClassifyId" :classifyName="menu2.classifyName" :value="menu2.classifyId" :parentClassifyId="menu2.parentClassifyId">
                          <span class="menu2_a2">{{menu2.classifyName}}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer">
              <button type="button" class="btn confirm" @click="set_classify">保存</button>
              <button type="button" class="btn gravity" @click="goods_classify_show=false">取消</button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { tool } from "../../../../utils/"
export default {
  name: '',
  data () {
    return {
      file: '',
      upload_img_show: false,
      banner_img_input: '',
      // banner模块数量
      module_number: 0,
      // 商品品类弹框
      goods_classify_show: false,
      // 搜索过滤
      filterString: '',
      // 商品品类列表
      classification_chose_list: '',
      // 控制选择商品品类列表显示隐藏
      dealer_class_chose: false,
      // 店铺一级列表
      firstClassify_list: '',
      // 店铺二级列表
      secondClassify_list: '',
      // 商品搜索参数
      good_goodName: '',
      // 店铺搜索参数
      shop_shopName: '',
      // 控制分页参数是否显示
      pagination: {goods: false, shops: false},
      // 新增修改图片模块参数
      module_add_info: {dealerId: '', bannerId: '', picUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: ''},
      // 新增banner显示
      choose_show: false,
      // 控制选中商品是否显示
      choose_goods_checked: false,
      // 控制选中d店铺是否显示
      choose_shops_checked: false,
      // 选中商品的参数
      choose_goods_checked_info: {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''},
      // 选中店铺的参数
      choose_shops_checked_info: {dealerName: '', shopName: '', shopIcon: '', onSaleGoods: ''},
      // 新增商品图片地址
      module_goods_img: [],
      // 商品模块数量
      module_goods: 1,
      // 店铺列表
      module_shops: 1,
      // 新增店铺图片地址
      module_shops_img: [],
      // 新增修改删除的标识
      add_modify_toggle: '',
      // 图片上传标识
      picture_change: false,
      // 商品分类ID查询
      goodsClassifyId: '',
      // banner展示bnnerNO保存提交
      bannerNo_clecked: {first: '', second: '', third: '', fourth: '', fifth: ''},
      add_modify_params: {isRedirect: '', isRedirect1: ''},
      goods_show: [],
      // 新增--商品翻页参数
      join_circle_params: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // 新增--店铺翻页参数
      join_circle_params_shop: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // banner分页参数
      banner_pages: {pageNo: '1', pageCount: '', totalCount: ''},
      // 选中编号的src
      bannerNo_clecked_img: '',
      // 查询单个banner参数
      // bannerNo: 
      // 上传图片阈值
      upload_img_via: false,
      // 编辑中的bannerNo
      bannerNo_clecked_edit: '',
      // 所有展示的banner信息
      bannerNo_all_info: '',
      bannerNo_clecked_all: '',
      // 控制图片src属性是否显示
      img_src: false, 
      // 分类名字参数
      dealerClassifyName: '',
      isSuccess: true
    }
  },
  computed: {
    m_user_ID () {
      return $store.state.m_user_ID
    }
  },
  watch: {
  },
  methods: {
    // 获取商品列表
    get_goods_list () {
      let that = this
      that.module_goods_img = []
      $.ajax({
        url: that.BASE_URL + 'm2c.scm/goods/choice',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          pageNum: that.join_circle_params.pageNo,
          condition: that.good_goodName,
          goodsClassifyId: that.goodsClassifyId,
          rows: 8
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          console.log('获取的商品列表: ', res)
          that.join_circle_params.pageCount = res.pageCount
          that.module_goods = res.content
          if (res.content !== '') {
            console.log('获取的商品列表: ', res)
            that.pagination.goods = true
            // 图片链接
            res.content.map(function (x) {
              that.module_goods_img.push(x.goodsImageUrl)
            })
          }
          else {
            // 分页按钮隐藏
            that.pagination.goods = false
            that.module_goods_img = []
          }
        }
      })
    },
    // 获取店铺列表
    get_shops_list () {
      let that = this
      if (that.dealerClassifyName === '') {
        that.dealerClassify = ''
      }
      that.module_shops_img = []
      $.ajax({
        url: that.BASE_URL + 'm2c.scm/shop/sys/shop',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          dealerName: that.shop_shopName,
          dealerClassify: that.dealerClassify,
          pageNum: that.join_circle_params_shop.pageNo,
          rows: 8
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          console.log('获取的店铺列表: ', res)
          that.join_circle_params_shop.pageCount = res.pageCount
          that.module_shops = res.content
          that.dealer_class_chose = false
          if (JSON.stringify(res.content) !== '[]') {
            that.pagination.shops = true
            // 图片链接
            res.content.map(function (x) {
              that.module_shops_img.push(x.shopIcon)
            })
          }
          else {
            that.pagination.shops = false
            that.module_shops_img = []
          }
        }
      })
    },
    // 商家一级分类列表
    get_shops_firstClassify () {
      let that = this
      $.ajax({
        // type: 'post',
        url: that.BASE_URL + 'm2c.scm/dealerclassify/sys/firstClassify',
        data: {
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          console.log('查询到的商家一级分类列表: ', res)
          that.firstClassify_list = res.content
        }
      })
    },
    // 点击获取店铺二级分类列表
    get_secondClassify (content) {
      let that = this
      console.log(content)
      $.ajax({
        // type: 'post',
        url: that.BASE_URL + 'm2c.scm/dealerclassify/sys/secondClassify',
        data: {
          dealerFirstClassifyId: content.dealerFirstClassify
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          console.log('查询到的商家二级分类列表: ', res)
          that.secondClassify_list = res.content
        }
      })
      $(`[forMenuId="${content.dealerFirstClassify}"]`).slideToggle(200)
    },
    // 获取商品分类树详情
    get_class_info () {
      let that = this
      $.ajax({
        url: that.BASE_URL + 'm2c.scm/goods/classify/tree',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          parentClassifyId: -1
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          console.log('获取的获取商品分类树: ', res)
          that.classification_chose_list = res.content
        }
      })
    },
    chose_shops_class (e) {
      let that = this
      e.stopPropagation()
      that.dealer_class_chose = true
    },
    // 点击空白隐藏店铺分类列表
    cancel_class_chose () {
      let that = this
      that.dealer_class_chose = false
    },
    // 点击店铺分类选中ID
    chose_shops_dealerClassify (event, content) {
      let that = this
      if (event === 'first') {
        that.dealerClassify = content.dealerFirstClassify
        that.dealerClassifyName = content.dealerFristClassifyName
      } else {
        that.dealerClassify = content.dealerClassify
        that.dealerClassifyName = content.dealerSecondClassifyName
      }
    },
    // 品类选择保存
    set_classify () {
      let that = this
      if (that.goodsClassifyId==='') {
        that.$message({ type: "warning", message: "请选择商品品类" })
        return
      }
      that.get_goods_list()
      that.goods_classify_show = false
    },
    // 菜单权限右边的加号按钮
    expand_menu_title (event) {
      let target = event.target
      let classifyId = target.getAttribute('classifyId')
      $(`[forMenuId="${classifyId}"]`).slideToggle(200)
    },
    // banner新增/编辑
    banner_edit (toggle, event) {
      let that = this
      // 清空商品、店铺搜索、页数
      this.file = null
      that.upload_img_show = true
      that.goodsClassifyId = ''
      that.good_goodName = ''
      that.shop_shopName = ''
      that.join_circle_params.pageNo = 1
      that.join_circle_params_shop.pageNo = 1
      that.choose_show = true
      that.module_add_info = {dealerId: '', bannerId: '', picUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: '', effectTime: ''}
      // 获取商品、商品品类树和店铺列表
      that.get_goods_list()
      that.get_class_info()
      that.get_shops_list()
      // 获取展示中的banner
      that.get_banner_show_info()
      // 获取店铺一级分类
      that.get_shops_firstClassify()
      if (toggle === 'add') { // 新增
        that.add_modify_toggle = toggle
        // 新增初始化
        that.choose_goods_checked = false
        that.choose_shops_checked = false
        // $('#banner_img').removeAttr('src')
        that.img_src = false
        // document.querySelector('#banner_img_input').videoForm.reset()
        // document.getElementById('#banner_img').removeAttribute('src')
        that.module_add_info = {dealerId: '', bannerId: '', picUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: ''}
        that.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
        that.module_goods_img = []
      } else if (toggle === 'modify') { // 修改
        // document.querySelector('#banner_img_input').value = ''
        that.bannerNo_clecked_edit = event.bannerNo
        that.add_modify_toggle = toggle
        // 清空选中店铺的参数
        that.module_add_info.shopId = ''
        that.choose_shops_checked_info = {dealerName:'', shopName: '', shopIcon: '', onSaleGoods: ''}
        // 清空选中商品的参数
        that.module_add_info.goodsId = ''
        that.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
        $.extend(that.module_add_info, event)
        console.log('获取到的生效状态', that.module_add_info.effectStrategy)
        // module_add_info: {bannerId: '', picUrl: '', title: '', linkType: '', shopId: '', goodsId: '', link: '', effectTime: ''},
        that.img_src = event.picUrl
        console.log('点击获取到的banner信息', event)
        // 获取选中的商品详情
        if (event.linkType === 'GOODS') {
          that.choose_shops_checked = false
          $.ajax({
            url: that.BASE_URL + 'm2c.scm/goods/detail',
            data: {
              goodsId: event.goodsId
            },
            headers: {
              'access_token': sessionStorage.getItem('access_token')
            },
            success: function (res) {
              console.log('选中的商品详情: ', res)
              that.choose_goods_checked_info.goodsName = res.content.goodsName
              that.choose_goods_checked_info.dealerName = res.content.dealerName
              that.choose_goods_checked_info.goodsPrice = res.content.goodsPrice / 100
              that.choose_goods_checked_info.goodsImageUrl = res.content.goodsImageUrl
              that.choose_goods_checked = true
            }
          })
        } else if (event.linkType === 'SHOP') { // 获取选中的店铺详情
          that.choose_goods_checked = false
          $.ajax({
            url: that.BASE_URL + 'm2c.scm/shop/sys/detail',
            data: {
              dealerId: event.shopId
            },
            headers: {
              'access_token': sessionStorage.getItem('access_token')
            },
            success: function (res) {
              console.log('选中的店铺详情: ', res)
              that.choose_shops_checked_info = res.content
              that.choose_shops_checked = true
            }
          })
        }
      }
    },
    // 翻页功能
    flip (toggle, type) {
      let that = this
      if (toggle === 'banner') {
        // that.join_circle_params.pageNo = that.banner_pages.pageNo
        // that.join_circle_params.pageCount = that.banner_pages.pageCount
        if (type === 'prev') {
          if (parseInt(that.banner_pages.pageNo) === 1) {
            // alert('已经是第一页了')
            return
          }
          that.banner_pages.pageNo = parseInt(that.banner_pages.pageNo) - 1
          that.get_banner_info()
        } else if (type === 'next') {
          if (parseInt(that.banner_pages.pageNo) === parseInt(that.banner_pages.pageCount)) {
            // alert('已经是最后一页了')
            return
          }
          that.banner_pages.pageNo = parseInt(that.banner_pages.pageNo) + 1
          that.get_banner_info()
        }
      } else if (toggle === 'goods') {
        if (type === 'prev') {
          if (parseInt(that.join_circle_params.pageNo) === 1) {
            alert('已经是第一页了')
            return
          }
          that.join_circle_params.pageNo = parseInt(that.join_circle_params.pageNo) - 1
          that.get_goods_list()
        } else if (type === 'next') {
          if (parseInt(that.join_circle_params.pageNo) === parseInt(that.join_circle_params.pageCount)) {
            alert('已经是最后一页了')
            return
          }
          that.join_circle_params.pageNo = parseInt(that.join_circle_params.pageNo) + 1
          that.get_goods_list()
        }
      } else if (toggle === 'shops') {
        if (type === 'prev') {
          if (parseInt(that.join_circle_params_shop.pageNo) === 1) {
            alert('已经是第一页了')
            return
          }
          that.join_circle_params_shop.pageNo = parseInt(that.join_circle_params_shop.pageNo) - 1
          that.get_shops_list()
        } else if (type === 'next') {
          if (parseInt(that.join_circle_params_shop.pageNo) === parseInt(that.join_circle_params_shop.pageCount)) {
            alert('已经是最后一页了1')
            return
          }
          that.join_circle_params_shop.pageNo = parseInt(that.join_circle_params_shop.pageNo) + 1
          that.get_shops_list()
        }
      }
    },
    // 用于生成uuid
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid () {
      return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
    },
    // 新增/修改上传图片处理
    add_modify_imgStep (callback) {
      let that = this
      if (!that.picture_change) {
        callback()
      } else {
        let formData = new FormData()
        formData.append('img', document.querySelector('#banner_img_input').files[0])
        formData.append('token', sessionStorage.getItem('access_token'))
        formData.append('imgGroup', 1)
        $.ajax({
          type: 'post',
          url: that.BASE_URL + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            res = JSON.parse(res)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (res.errorMessage && res.errorMessage !== '') {
              that.$message({ type: "error", message: res.errorMessage })
              that.picture_change = true
              return
            }
            // console.log('上传图片成功,返回结果是: ', res)
            that.module_add_info.picUrl = res.content.url
            that.picture_change = false
            callback()
          }
        })
      }
    },
    // 新增/修改提交
    banner_edit_confirm (toggle) {
      let that = this
      if (Number(that.module_add_info.effectStrategy) === 1 && (new Date(that.module_add_info.effectTime).getTime() < new Date().getTime())) {
        that.$message({ type: "warning", message: "确认设置失败，当前模块已生效，请将生效时间改为“立即生效”" })
        return         
      }
      if (that.module_add_info.effectTime) {
        that.module_add_info.effectTime = that.tool.date.format(new Date(that.module_add_info.effectTime), 'yyyy-MM-dd')
      }
      if (that.bannerNo_clecked_all.includes(Number(that.bannerNo_clecked_edit)) && (new Date(that.module_add_info.effectTime).getTime() > new Date().getTime())) {
        console.log(1)
        let arr = []
        for (let i = 0; i < that.bannerNo_all_info.length; i++) {
          if ((new Date(that.bannerNo_all_info[i].effectDate).getTime() < new Date().getTime()) && (that.bannerNo_all_info[i].bannerNo !== that.bannerNo_clecked_edit)) {
            arr.push(that.bannerNo_all_info[i].effectDate)
          }
        }
        console.log(arr)
        console.log(arr.length === 0)
        if (arr.length === 0) {
          that.$message({ type: "warning", message: "设置定时生效失败，展示中的banner不能少于一个" })
          return
        }
      }
      if (that.add_modify_toggle === 'add') {
        if (!that.upload_img_via || that.img_src === false) {
          that.$message({ type: "warning", message: "图片未上传" })
          return
        }
        let img = new Image()
        img.src = that.img_src
        console.log('图片', img.type)
        console.log('宽', img.width, '高',img.height )
        if (img.src && (img.width!==710 || img.height!==332)) {
          that.$message({ type: "warning", message: "图片尺寸不符合，请重新上传" })
          return
        }
        if (!that.module_add_info.title) {
          that.$message({ type: "warning", message: "标题未填写" })
          return
        }
        if (!that.module_add_info.link && !that.module_add_info.goodsId && !that.module_add_info.shopId) {
          that.$message({ type: "warning", message: "跳转链接未设置" })
          return
        }
        if (Number(that.module_add_info.effectStrategy) === 1 && that.module_add_info.effectTime === '') {
          that.$message({ type: "warning", message: "未设置具体定时时间内容" })
          return
        }
        that.add_modify_imgStep(function () {
          if (that.isSuccess === false) return
          that.isSuccess = false
          $.ajax({
            type: 'post',
            url: that.BASE_URL + 'm2c.operate/picword/banner/add.web',
            data: Object.assign({}, that.module_add_info, {
              systemAccessToken: sessionStorage.getItem('access_token'),
              userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
              bannerId: that.add_modify_toggle === 'add' ? that.guid() : that.module_add_info.bannerId,
              effectTime: parseInt(that.module_add_info.effectStrategy) === 0 ? that.tool.date.format(new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') : that.module_add_info.effectTime 
            }),
            headers: {
              'access_token': sessionStorage.getItem('access_token')
            },
            success: function (res) {
              if (res.status === 200) {
                // document.querySelector('#banner_img_input').files[0] = ''
                // window.URL.revokeObjectURL(file)
                that.img_src = false
                that.choose_show = false
                that.isSuccess = true
                that.upload_img_show = false
                that.get_banner_info()
              }
            }
          })
          // }
        })
      } else if (that.add_modify_toggle === 'modify') {
        console.log(that.img_src)
        if (that.img_src === 'http://localhost:8080/' || that.img_src === false) {
          that.$message({ type: "warning", message: "图片未上传" })
          return
        }
        let img = new Image()
        img.src = that.img_src
        console.log('宽', img.width, '高',img.height )
        if (img.src && (img.width!==710 || img.height!==332)) {
          that.$message({ type: "warning", message: "图片尺寸不符合，请重新上传" })
          return
        }
        if (!that.module_add_info.title) {
          that.$message({ type: "warning", message: "标题未填写" })
          return
        }
        if (!that.module_add_info.link && !that.module_add_info.goodsId && !that.module_add_info.shopId) {
          that.$message({ type: "warning", message: "跳转链接未设置" })
          return
        }
        if (that.module_add_info.effectStrategy === '1' && that.module_add_info.effectTime === '') {
          that.$message({ type: "warning", message: "未设置具体定时时间内容" })
          return
        }
        that.add_modify_imgStep(function () {
            $.ajax({
            type: 'post',
            url: that.BASE_URL + 'm2c.operate/picword/banner/edit.web',
            data: Object.assign({}, that.module_add_info, {
              systemAccessToken: sessionStorage.getItem('access_token'),
              userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
              bannerId: that.add_modify_toggle === 'add' ? that.guid() : that.module_add_info.bannerId,
              effectTime: parseInt(that.module_add_info.effectStrategy) === 0 ? that.tool.date.format(new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') : that.module_add_info.effectTime
            }),
            headers: {
              'access_token': sessionStorage.getItem('access_token')
            },
            success: function (res) {
              if (res.status === 200) {
                that.choose_show = false
                that.get_banner_info()
              }
            }
          })
        })
      }
    },
    // 鼠标移入显示遮罩层和确认标识
    banner_show_tips (index) {
      // this.goods_show[index] = 1
      // console.log(this.goods_show[index])
      // console.log('获取到的id', 1)
    },
    // 点击选中商品
    banner_goods_clecked (event) {
      let that = this
      if (that.module_add_info.linkType === 'GOODS') {
        that.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
        that.choose_goods_checked_info.goodsName = event.goodsName
        that.choose_goods_checked_info.dealerName = event.dealerName
        that.choose_goods_checked_info.goodsPrice = event.goodsPrice / 100
        that.choose_goods_checked_info.goodsImageUrl = event.goodsImageUrl
        that.module_add_info.goodsId = event.goodsId
        that.module_add_info.dealerId = event.dealerId
        that.choose_goods_checked = true
        // 清空选中店铺的参数
        that.module_add_info.shopId = ''
        that.choose_shops_checked_info = {dealerName: '', shopName: '', shopIcon: '', onSaleGoods: ''}
        that.choose_shops_checked = false
      } else if (that.module_add_info.linkType === 'SHOP') {
        that.choose_shops_checked_info = {dealerName: '', shopName: '', shopIcon: '', onSaleGoods: ''}
        that.choose_shops_checked_info.dealerName = event.dealerName
        that.choose_shops_checked_info.shopName = event.shopName
        that.choose_shops_checked_info.shopIcon = event.shopIcon
        that.choose_shops_checked_info.onSaleGoods = event.onSaleGoods
        that.module_add_info.shopId = event.shopId
        that.module_add_info.dealerId = event.dealerId
        that.choose_shops_checked = true
        // 清空选中商品的参数
        that.module_add_info.goodsId = ''
        that.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
        that.choose_goods_checked = false
      }
      console.log('获取到的商品信息', event)
      console.log('获取到的商品id', event.shopId)
    },
    // 保存展示的banner
    banner_No_clecked () {
      let that = this
      let bannerNos = []
      console.log(that.module_number)
      bannerNos.push(that.bannerNo_clecked.first)
      bannerNos.push(that.bannerNo_clecked.second)
      bannerNos.push(that.bannerNo_clecked.third)
      bannerNos.push(that.bannerNo_clecked.fourth)
      bannerNos.push(that.bannerNo_clecked.fifth)
      console.log('保存的banner编号', bannerNos)
      console.log('获取到的ID', bannerNos)
      this.api_businessManagePlatform_setBannerShow ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          bannerNos: bannerNos.join(',')
        },
      }).then(res => {
        this.$message({ type: "success", message: "保存设置成功" })
      })
    },
    // 点击重置按钮
    click_reset () {
      // 新增初始化
      // 选中商品/店铺初始化话
      // 清空商品、店铺搜索
      this.goodsClassifyId = ''
      this.good_goodName = ''
      this.shop_shopName = ''
      // 新增修改图片模块参数
      this.module_add_info = {dealerId: '', bannerId: '', picUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: ''}
      // 控制选中商品是否显示
      this.choose_goods_checked = false
      // 控制选中d店铺是否显示
      this.choose_shops_checked = false
      // 选中商品的参数
      this.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
      // 选中店铺的参数
      this.choose_shops_checked_info = {dealerName: '', shopName: '', shopIcon: '', onSaleGoods: ''}
      this.img_src = false
      this.upload_img_via = false
      document.querySelector('#banner_img_input').value = ''
    },
    // 取消新增/编辑banner
    cancle_banner_edit  () {
      this.upload_img_show = false
      this.choose_show = false
      this.upload_img_via = false
    },
    // 上传头像时获取本地地址
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      if (url !== null) {
        this.upload_img_via = true
      }
      return url
    },
    // 上传图片
    upload_img (event) {
      let target = event.target
      // this.file = target.files
      // this.upload_img_via = true
      console.log(target.files)
      let objUrl = this.getObjectURL(target.files[0])
      console.log(objUrl)
      let size = target.files[0].size
      if (size >= 1024000 * 10) this.$message({ type: "warning", message: "图片超过10M了哦" })
      else {
        if (objUrl) {
          this.img_src = objUrl
          this.picture_change = true
        }
      }
    },
    // 点击删除
    click_banner_delete (event) {
      let that = this
      this.bannerId = event.bannerId
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        $.ajax({
          url: that.BASE_URL + 'm2c.operate/picword/banner/del.web',
          data: {
            systemAccessToken: sessionStorage.getItem('access_token'),
            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            bannerId: that.bannerId
          },
          headers: {
            'access_token': sessionStorage.getItem('access_token')
          },
          success: function (res) {
            if (res.status === 200) {
              that.get_banner_info()
            }
          }
        })
      }).catch(() => {})
    },
    // 获取banner列表
    get_banner_info () {
      let that = this
      this.api_businessManagePlatform_getBannerList ({ 
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          filterString: that.filterString,
          pageNo: that.filterString?1:that.banner_pages.pageNo,
          pageRows: 8
        },
      }).then(res => {
        that.module_number = res.content
        for(let i = 0; i < that.module_number.length; i++){
          that.module_number[i].effectTime = tool.date.format(that.module_number[i].effectTime, 'yyyy-MM-dd')
        }
        that.banner_pages.pageCount = res.pageCount
        that.banner_pages.totalCount = res.totalCount
      })
    },
    // 鼠标移上显示图片
    get_img_src (event) {
      let that = this
      // 获取单个banner
      $.ajax({
        url: that.BASE_URL + 'm2c.operate/picword/banner/getbanner.web',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          bannerNo: Number($(event.target).val())
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (res) {
          that.bannerNo_clecked_img = res.content.picUrl
          console.log('获得的单个banner: ', res)
        }
      })
    },
    // 鼠标移开清除
    remove_img_src () {
      let that = this
      // console.log($(event.target).val())
      that.bannerNo_clecked_img = ''
      // for (let j = 0; j < that.module_number.length; j++) {
      //   if (Number($(event.target).val()) === Number(that.module_number[j].bannerNo)) {
      //     that.bannerNo_clecked_img = that.module_number[j].picUrl
      //   }
      // }
    },
    // 查询展示的banner
    get_banner_show_info () {
      let that = this
      that.bannerNo_clecked_all = []
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/picword/banner/getshow.web',
        data: JSON.stringify({
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          modules: that.set_home_info
        }),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (res) {
          console.log('查询展示的banner: ', res)
          that.bannerNo_all_info = res.content
          res.content.map(function (x) {
            that.bannerNo_clecked_all.push(x.bannerNo)
          })
          console.log('编号', that.bannerNo_clecked_all)
          that.bannerNo_clecked = {first: '', second: '', third: '', fourth: '', fifth: ''}
          if (res.content.length === 1) {
            that.bannerNo_clecked.first = res.content[0].bannerNo
          } else if (res.content.length === 2) {
            that.bannerNo_clecked.first = res.content[0].bannerNo
            that.bannerNo_clecked.second = res.content[1].bannerNo
          } else if (res.content.length === 3) {
            that.bannerNo_clecked.first = res.content[0].bannerNo
            that.bannerNo_clecked.second = res.content[1].bannerNo
            that.bannerNo_clecked.third = res.content[2].bannerNo
          } else if (res.content.length === 4) {
            that.bannerNo_clecked.first = res.content[0].bannerNo
            that.bannerNo_clecked.second = res.content[1].bannerNo
            that.bannerNo_clecked.third = res.content[2].bannerNo
            that.bannerNo_clecked.fourth = res.content[3].bannerNo
          } else if (res.content.length === 5) {
            that.bannerNo_clecked.first = res.content[0].bannerNo
            that.bannerNo_clecked.second = res.content[1].bannerNo
            that.bannerNo_clecked.third = res.content[2].bannerNo
            that.bannerNo_clecked.fourth = res.content[3].bannerNo
            that.bannerNo_clecked.fifth = res.content[4].bannerNo
          }
        }
      })
    }
  },
  mounted () {
    let that = this
    that.get_banner_info()
    that.get_banner_show_info()
  }
}
</script>

<style lang="scss" scoped>
.m_banner {
  min-width: 1315px;
  .banner_admin {
    float: left;
    height: 700px;
    width: 1050px;
    border: 1px solid #E5E5E5;
    background: #fff;
    margin-top: 26px;
    padding-left: 25px;
    padding-right: 22px;
    position: relative;
    p {
      font-size: 12px;
      margin: 24px 0px 22px 0px;
      font-weight: 700;
    }
    input {
      border: 1px solid #BFC1CB;
      width: 400px;
      height: 22px;
      border-radius: 2px;
      font-size: 12px;
      color: #777777;
      outline: none;
      padding-left: 8px;
    }
    .parent_search_button {
      position: relative;
    }
    .search_button {
      width: 60px;
      height: 24px;
      background: #0086FF;
      border-radius: 2px;
      color: #fff;
      outline: none;
      border: none;
      position: absolute;
      left: 420px;
      // margin-left: 16px;
    }
    .add_button {
      width: 120px;
      height: 24px;
      background: #6C83BC url('../../../../../static/images/businessManage/icon-add.png') 15px no-repeat;
      background-size: 12px 12px;
      border: none;
      color: #fff;
      font-size: 12px;
      padding-left: 25px;
      position: relative;
      // right: -66px;
      margin: 21px 0px;
    }
    .public_banner {
      float: left;
      width: 230px;
      height: 220px;
      border: 1px solid #E5E5E5;
      margin-right: 20px;
      margin-bottom: 20px;
      position: relative;
      .banner_img {
        height: 100px;
        background: #ECECEC;
      }
      span {
        display: block;
        font-size: 12px;
        color: #777777;
        margin-left: 11px;
        margin-top: 8px;
      }
      p {
        font-size: 12px;
        color: #000000;
        margin-left: 11px;
        margin-top: 3px;
        margin-bottom: 9px;
      }
      .banner_link {
        width: 210px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        padding-left: 6px;
        margin-left: 9px;
        color: #0078E4;
        background: #E1EEF6;
        overflow: hidden;
      }
      .public_banner_delete {
        width: 60px;
        height: 20px;
        outline: none;
        border: none;
        font-size: 12px;
        margin-top: 15px;
        border-radius: 2px;
        color: #777777;
        background: #fff;
        border: 1px solid #BFC1CB;
        padding: 0;
      } //   .small-font{    
      // 　　font-size:12px; 
      //     -webkit-transform-origin-x: 0;
      //     -webkit-transform: scale(0.80);
      //   }
      //   .smallsize-font {
      // 　　font-size: 9.6px;
      //   }
      .public_banner_edit {
        width: 60px;
        height: 20px;
        outline: none;
        border: none;
        font-size: 12px;
        color: #0078E4;
        background: #fff;
        border: 1px solid #0078E4;
        border-radius: 2px;
        padding: 0;
        margin-left: 60px;
      }
    }
  }
  .banner_right {
    float: left;
    width:160px;
    height:659px; 
    margin-top: 26px;
    background:#fff;
    border: 1px solid #E5E5E5;
    padding-top: 41px;
    padding-left: 26px;
    position: relative;
    p {
      margin: 0px;
      font-size: 12px;
      color: #777777;
      // margin-bottom: 30px;
    }
    input {
      width:30px;
      height:30px; 
      border: 1px solid #BFC1CB;
      margin-right: 20px;
      margin-bottom: 20px;
      font-size:12px;
      font-weight: 700;
      color:#000;
      text-align: center;
      outline: none;
    }
    button {
      width:110px;
      height:40px; 
      background:rgba(17,210,235,1);
      border-radius: 2px;
      font-size: 14px;
      color: #fff;
      margin-bottom: 20px;
      border: none;
    }
  }
  // 模态框设置
  .frame_layer {
    .frame {
      width: 870px;
      height: 700px;
      // padding-left: 20px;
      // padding-right: 20px;
      .frame_left {
        width: 120px;
        height: 621px;
        float: left;
        border: 1px solid #E5E5E5;
        background: #F5F5F5;
        padding-left: 30px;
        position: absolute;
        left: 0px;
        top: 0px;
        span {
          font-size: 12px;
          font-weight: 700;
          margin: 26px 0px 6px 0px;
          display: block;
        }
        // .img {
        //   width:90px;
        //   height:55px;
        //   background: #fff;
        // }
        .banner_img_tips {
          width:120px;
          height:45px; 
          font-size: 12px;
          font-family:PingFangSC-Regular;
          color:rgba(119,119,119,1);
          line-height:11px;
          margin-top: 7px;
          margin-bottom: 8px;
        }
        .banner_upload_btn {
          width:55px;
          height:24px;
          border-radius: 3px;
          font-size: 12px;
          padding: 0px;
          border: 1px solid #BFC1CB;
          background: #fff;
          color: #777777;
        }
        .banner_upload_name {
          width:100px;
          height:24px;
          border-radius: 3px;
          font-size: 12px;
          padding-left: 5px;
          margin-bottom: 14px;
          border: 1px solid #BFC1CB;
          background: #fff;
          color: #777777;
          outline: none;
        }
        label {
          font-weight: 500;
        }
        .banner_chose {
          font-size: 12px;
          font-weight: 500;
        }
        #chose_time {
          width: 120px;
          font-size: 12px;
          margin-left: -5px;
          padding: 7px 0px;
        }
      }
      .frame_total {
        float: left;
        width: 720px;
        height: 700px;
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .tc_shop {
        font-size: 12px;
        // width: 100%;
        height: 185px;
        border-bottom: 1px solid #E5E5E5;
        margin: 0px 24px;
        .merchant {
          float: left;
          width: 160px;
          height: 120px; // background-color: red;
          border: 1px solid #E5E5E5;
          margin: 10px 10px 10px 0;
          cursor: pointer;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            width: 150px;
            font-size: 12px;
            background: #F5F5F5;
            border-bottom: 1px solid #ccc;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            float: left;
            width: 70px;
            height: 70px;
            margin-left: 10px;
            margin-right: 5px;
            margin-top: 3px;
          }
        }
        span {
          font-size: 12px;
          font-weight: 700;
          margin: 26px 0px 6px 0px;
          display: block;
        }
        .tc_shop_box {
          margin-top: 20px;
          .tc_shop_span {
            text-align: center;
            width: 180px;
            height: 30px;
            line-height: 30px;
            background: #F5F5F5;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .modal-header {
        border-bottom: none;
        background: rgba(245, 245, 245, 1);
        .close {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 40px;
          height: 40px;
          background: rgba(216, 216, 216, 1);
          // font-size: 18px;
        }
        .modal-title {
          position: relative;
          background: #fff;
          ul {
            display: flex;
            width: 300px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 1px solid #ccc;
            li {
              flex: 1;
              height: 30px;
              text-align: center;
              line-height: 30px;
              box-sizing: border-box;
            }
            li.active {
              background-color: #000;
              color: #fff; // border:1px solid #ccc;
            }
          }
        }
      }
      .search {
        height: 30px;
        line-height: 30px;
        margin: 0px 20px;
        position: relative;
        .sort {
          width: 60px;
          height: 24px;
          background: rgba(0, 134, 255, 1);
          border-radius: 2px;
          margin-left: 10px;
          font-size: 11px;
          color: rgba(255, 255, 255, 1);
          line-height: 24px;
          border: none;
        }
        .search_tit {
          display: inline-block;
          margin-top: 10px;
          font-size: 12px;
          font-weight: 600;
        }
        .input {
          width: 228px;
          height: 24px;
          background: rgba(255, 255, 255, 1);
          border-radius: 2px;
          font-size: 12px;
          border: 1px solid #BFC1CB;
          padding-left: 8px;
        }
        .a_btn {
          padding: 0 10px;
        }
        .right {
          position: absolute;
          right: 0px;
          top: 20px;
        }
      }
      .goods_body {
        margin: 53px 0px 10px 24px;
        position: relative;
        // overflow-y: auto;
        .goods {
          width: 47%;
          height: 120px; // background-color: red;
          border: 1px solid #ccc;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            border-bottom: 1px solid #ccc;
          }
          .media {
            .media-left {
              margin-left: 10px;
              img {
                margin-left: 10px;
              }
            }
          }
        }
        .goods:nth-child(2n+1) {
          margin-right: 20px;
        }
        .merchant {
          float: left;
          width: 160px;
          height: 120px; // background-color: red;
          border: 1px solid #E5E5E5;
          margin: 0 10px 10px 0;
          cursor: pointer;
          h6 {
            padding-left: 10px;
            line-height: 30px;
            margin: 0;
            width: 150px;
            font-size: 12px;
            background: #F5F5F5;
            border-bottom: 1px solid #ccc;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          img {
            float: left;
            width: 70px;
            height: 70px;
            margin-left: 10px;
            margin-right: 5px;
            margin-top: 3px;
          }
        }
        .merchant_show {
          // display: none;
          position: absolute;
          width: 160px;
          height: 120px;
          background: #6C83BC;
          opacity: 0.5;
        }
        .page {
          position: absolute;
          bottom: -293px;
          right: 50px;
          margin:10px 0 0 140px;
          font-size: 12px;
          .page_btn{
            width: 42px;
            height: 20px;
            border:1px solid #979797;
            margin:0;
            padding: 0;
            font-size: 12px;
            background-color: #fff;
            color: #777777;
          }
          .page_color{
            color:#0B5FDD ;
          }
          .inp{
            height: 30px;
            width: 50px;
            margin: 0 10px;
            text-align: center;
          }
          .mar_l {
            margin-left:20px;
          }
          .dis_able{
            opacity: 0.5;
          }
        }
        // .merchant:before{
        //   content: "";
        //   // width: 0;
        //   // height: 100%;
        //   height: 120px;
        //   background: #6C83BC;
        //   padding: 14px 18px;
        //   position: absolute;
        //   // top: 46px;
        //   width: 160px;
        //   left: -1px;
        //   /* opacity: 0.5; */
        //   /* left: 50%; */
        //   opacity: 0;
        //   /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
        // }
        // .merchant:hover:before{
        //   width: 160px;
        //   // left: 0;
        //   margin-left: 1px;
        //   margin-top: -1px;
        //   opacity: 0.5;
        // }
      }
      .footer {
        // width:890px;
        height: 57px;
        border-top: 1px solid #E5E5E5;
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding-top: 20px;
        .btn {
          width: 110px;
          height: 40px;
          border: none;
          border-radius: 2px;
          color: #fff;
          margin-right: 30px;
        }
        .save {
          background: rgba(183, 201, 225, 1);
        }
        .reset {
          background:rgba(245,189,35,1);
        }
        .cancel {
          margin-left: 100px;
          background: rgba(17, 210, 235, 1);
        }
      }
    }
  }
  .dealer_class_input {
    width: 180px;
    height: 24px;
    margin-left: 40px;
    border-radius: 2px;
    font-size: 12px;
    color: #777777;
    padding-left: 10px;
    border: 1px solid #BFC1CB;
  }
  .dealer_class {
    width:190px;
    position: absolute;
    z-index: 1;
    top: 68px;
    left: 349px;
    box-sizing: border-box;
    border:1px solid #E5E5E5;
    font-size: 12px;
    background-color: #fff;
    box-shadow: 0px 1px 2px 1px rgba(0,0,0,.2);
    .menu {
      display:inline-block;text-align:left;
      width: 169px;
      height: 200px;
      overflow: auto;
      padding-top: 10px;
      padding-left: 20px;
      border-bottom: 1px solid #E5E5E5;
      border-radius: 2px;
      .menu_parent{
        padding-right:23px;
        line-height: 18px;
        .menu1_a,.menu2_a{
          display:inline-block;vertical-align:middle;
          .menu1_a1,.menu1_a2{display:inline-block;vertical-align:middle;margin-right:5px}
        }
        .menu1_b{font-size:150%;font-weight:bold;display:inline-block;vertical-align:middle;}
      }
      .menu_child {
        padding-left:23px;
        .menu2_a{
          line-height: 18px;
          .menu2_a1,.menu2_a2{display:inline-block;vertical-align:middle;margin-right:5px}
        }
      }
    }
    button {
      width:80px;
      height:26px; 
      background:rgba(17,210,235,1);
      border-radius: 2px;
      border: none;
      color: #fff;
      line-height: 24px;
      margin-left: 50px;
      margin-bottom: 12px;
    }
  }
  // 商品描述公共类
  .public_description {
    font-size: 7px;
    font-weight: 700;
    line-height: 20px;
  }
  .banner_page {
    position: absolute;
    bottom: 38px;
    right: 96px;
    margin:10px 0 0 140px;
    font-size: 12px;
    .page_btn{
      width: 42px;
      height: 20px;
      border:1px solid #979797;
      margin: 0 8px;
      padding: 0;
      font-size: 12px;
      background-color: #fff;
      color: #777777;
    }
    .page_color{
      color:#0B5FDD ;
    }
    .inp{
      height: 30px;
      width: 50px;
      margin: 0 10px;
      text-align: center;
    }
    .mar_l {
      margin-left:20px;
    }
    .dis_able{
      opacity: 0.5;
    }
  }
  /*选择品类*/
  .goods_category_layer_chose {
    position: absolute;
    left: 0px;
    top: 0px;
    .category_goodchoose {
      width: 480px;
      height: 480px;
      background: #fff;
      .modal-header {
        width: 100%;
        height: 40px;
        text-align: center;
        background: #F5F5F5;
        font-size: 10px;
        position: relative;
        span {
          line-height: 40px;
          display: inline-block;
        }
        .guanb {
          cursor: pointer;
          width: 40px !important;
          height: 40px !important;
          position: absolute;
          background: url('../../../../../static/images/businessManage/icon-close.png');
          right: 0px;
          top: 0px;
          z-index: 999;
        }
      }
      .modal-body {
        padding-left: 80px;
        padding-top: 20px;
        max-height: 360px;
        overflow-y: auto;
        // 商品品类选择样式
        .menu_goods {
          display:inline-block;text-align:left;
          .menu_parent{
            padding-right:23px;
            .menu1_a,.menu2_a{
              display:inline-block;vertical-align:middle;
              .menu1_a1,.menu1_a2{display:inline-block;vertical-align:middle;margin-right:5px}
            }
            .menu1_b{font-size:150%;font-weight:bold;display:inline-block;vertical-align:middle;}
          }
          .menu_child {
            padding-left:23px;
            .menu2_a{
              .menu2_a1,.menu2_a2{display:inline-block;vertical-align:middle;margin-right:5px}
            }
          }
        }
        .wrapper {
          position: relative;
          .triangle {
            width: 0;
            height: 0;
            border-width: 10px 8px 0;
            border-style: solid;
            border-color: #D8D8D8 transparent transparent; /*灰 透明 透明 */
            position: absolute;
            left: -20px;
            top: 3px;
            /*margin:40px auto;*/
          }
          display: inline-block;
          .input_check {
            position: absolute;
            width: 20px;
            height: 20px;
            visibility: hidden;
          }
          span {
            position: relative;
          }
          .input_check + label {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 2px;
            border: 1px solid #BFC1CB;
          }
          .input_check:checked + label {
            display: inline-block;
            width: 15px;
            height: 15px;
            background: url('../../../../../static/images/businessManage/icon-selected.png') no-repeat center;
          }
        }
        .tit {
          font-size: 15px;
        }
      }
      .footer {
        width: 480px;
        height: 60px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        border-top: 1px solid #e5e5e5;
        .btn {
          width: 110px !important;
          height: 40px;
          border-radius: 2px;
          color: #fff;
          width: 28px;
          font-size: 14px;
          text-align: center;
          line-height: 40px;
          display: inline-block;
          padding: 0px;
          margin-right: 20px;
          margin-top: 10px;
          border: none;
        }
        .gravity {
          background: #F5BD23 100%;
        }
        .confirm {
          margin-left: 110px;
          background: #11D2EB 100%;
        }
      }
    }
  }
}

.modal-open{
  .modal {height:100%}
  #add_modify,#forbid,#modify_group{display:flex}
  #add_modify.in,#forbid.in,#modify_group.in,#myModal.in,#nav_detele.in,#delete_list.in,#delete_select.in,#delete_life.in,#detele_banner.in{z-index:2000}
}
.modal::-webkit-scrollbar {
      display: none
    }
    /*IE10,IE11,IE12*/
    .modal {
      -ms-scroll-chaining: chained;
      -ms-overflow-style: none;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
      -ms-overflow-style: none;
      overflow: auto;
    }
</style>
