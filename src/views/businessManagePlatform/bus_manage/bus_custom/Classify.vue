<template>
  <div class='client_classification' @click="cancel_class_chose">
    <div class="client_classification_content">
      <div class="classification_parent">
        <ul id="nav_classification">
          <li v-for="(cell,index) in classification_list1" :key="index" :uqId="cell.uqId"  @click="nav_active(classification_list1[index],index)" :class="index===0?'li_hover':''">
            <div class="li_active" :style="index===0?'display:block;':''">
            </div>
            {{cell.cateName}}
            <el-tooltip placement="top" v-if="Number(classification_list1[index].effectStrategy)===1&&new Date(classification_list1[index].effectTime).getTime()>new Date().getTime()">
              <div slot="content" style="text-align:center;">定时生效时间<br/>{{classification_list1[index].effectTime}}</div>
                <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;top:11px;left:90px;z-index:1;">
            </el-tooltip>
            <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:11px;left:90px;z-index:1;" v-if="classification_list1[index].beHide==='Y'">
          </li>
        </ul>
        <div class="classification_parent_edit" @click="original_classification('original')">编辑</div>
      </div>
      <div class="classification_content">
        <div class="banner_img">
          <img :src="cateAdvers.picUrl" width="350" height="140" v-if="cateAdvers.picUrl">
          <button class="public_btn_add" @click="children_classification_edit('banner')" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;">新增/编辑</button>
        </div>
        <!-- 一 -->
        <div style="margin-bottom:30px;" v-for="(item,key) in subcates_number" :key="key" :id="'module_children'+key">
          <div class="classification_title">
            <div :id="'class_name_show'+key">{{(subcates[key].subcateName)?subcates[key].subcateName:class_name+(key+1)}}</div>
            <div class="public_title_left"></div>
            <div class="public_title_right"></div>
            <div class="classification_children" @click="original_classification('children', key)">编辑</div>
          </div>
          <div class="public_c_children" v-for="(cell,index) in subcates[key].pics" :key="index">
            <div class="public_c_content">
              <img :src="subcates[key].pics[index].picUrl?subcates[key].pics[index].picUrl:false" class="public_c_content" style="margin:0px;">
            </div>
            <span>{{subcates[key].pics[index].title?subcates[key].pics[index].title:'模块名'}}</span>
          </div>
        </div>

        <button class="add_button_class" @click="add_new_module">新增（最多5个子类）</button>
      </div>

      <!-- 品类编辑 -->
      <div class="classification_edit" v-if="edit_toggle==='original'">
        <div class="classification_e_content">
          <ul>
            <li v-for="(cell,index) in classification_list" :key="index" style="position:relative">
              <el-tooltip placement="top" v-if="Number(classification_list[index].effectStrategy)===1&&new Date(classification_list[index].effectTime).getTime()>new Date().getTime()">
                <div slot="content" style="text-align:center;">定时生效时间<br/>{{classification_list[index].effectTime}}</div>
                <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;top:10px;left:293px;z-index:1;">
              </el-tooltip>
              <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:10px;left:293px;z-index:1;" v-if="classification_list[index].beHide==='Y'">
              <input id="buttonEdit" maxlength="4" class="rename_class" readonly="readonly" v-if="index===0" v-model="cell.cateName">
              <span style="position:absolute;" v-if="index!==0">{{cell.cateName}}</span>
              <span class="public_span_l" @click="click_classification_edit('edit',classification_list[index],index)" v-if="index===0">{{recommend_edit===false?'编辑':'完成'}}</span>
              <span class="public_span_m" @click="set_parent_beHide(index)" v-if="index===0">{{classification_list[index].beHide==='Y'?'展示':'隐藏'}}</span>
              <span class="public_span_l" @click="click_classification_edit('edit',classification_list[index],index)">编辑</span>
              <span class="public_span_m" @click="set_parent_beHide(index)">{{classification_list[index].beHide==='Y'?'展示':'隐藏'}}</span>
              <span class="public_span_r" v-if="index!==0" @click="click_banner_delete('delete_parent',index)">删除</span>
            </li>
          </ul>
          <button @click="click_classification_edit('add')">
            <div class="button_style" ></div>新增分类
          </button>
        </div>
      </div>
      <div class="classification_submit" v-if="edit_toggle==='original'">
        <button class="button_top" @click="set_classification">确认</button>
        <button class="button_bottom" @click="edit_toggle=''">取消</button>
      </div>

      <!-- 子分类编辑 -->
      <div class="classification_children_edit" v-if="edit_toggle==='children'">
        <p>
          <input id="class_buttonEdit" maxlength="4" style="border:none;width:120px;height:30px;padding:0px;padding-left:5px;text-align:center;" readonly="readonly" v-model="class_name_submit">
        </p>
        <!-- <p>推荐01</p> -->
        <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:32px;left:220px;z-index:1;" v-if="hide_or_show==='Y'">
        <button class="button_rename_style" style="margin-left:-15px;" @click="click_classification_rename">{{class_rename===false?'重命名':'完成'}}</button>
        <button class="button_rename_style" @click="hide_or_show==='N'?hide_or_show='Y':hide_or_show='N'">{{hide_or_show==='N'?'隐藏':'展示'}}</button>
        <button class="button_delete" @click="click_banner_delete('delete_module')">删除本模块</button>
        <div class="public_classification_content">
          
          <draggable v-model="subcates[subcates_number_class].pics" :move="getdata" @update="datadragEnd">
            <transition-group>
              <div class="public_classification_children" v-for="(cell,index) in subcates[subcates_number_class].pics.length" :key="index" :id="'calss_children'+index">
                <el-tooltip placement="top" v-if="Number(subcates[subcates_number_class].pics[index].effectStrategy)===1&&new Date(subcates[subcates_number_class].pics[index].effectTime).getTime()>new Date().getTime()">
                  <div slot="content" style="text-align:center;">定时生效时间<br/>{{subcates[subcates_number_class].pics[index].effectTime}}</div>
                    <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;top:0px;left:40px;z-index:1;">
                </el-tooltip>
                <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:0px;left:40px;z-index:1;" v-if="subcates[subcates_number_class].pics[index].beHide==='Y'">
                <div class="classification_children_img">
                  <img :src="classification_children_img[index]?classification_children_img[index]:false" class="classification_children_img" style="margin:0px;">
                </div>
                <div>{{subcates[subcates_number_class].pics[index].title?subcates[subcates_number_class].pics[index].title:'模块名'}}</div>
                <button class="button_edit" @click="children_classification_edit('children',module_life_number[index],index)">编辑</button>
                <button @click="click_banner_delete('delete_class',index)">删除</button>
              </div>
            </transition-group>
          </draggable>

          <div class="public_classification_children" style="border:0px;" v-if="subcates[subcates_number_class].pics.length!=12">
            <button class="add_class_children" style="width:50px;height:50px;border-radius:0px;" @click="add_children"></button>
          </div>
        </div>
        <div class="public_classification_tips">最多只能增加12个子分类哦~</div>
      </div>
      <div class="classification_submit" v-if="edit_toggle==='children'">
        <button class="button_top" @click="set_get_chilidren_info">确认</button>
        <button class="button_bottom" @click="edit_toggle=''">取消</button>
      </div>


    </div>

    <!-- 点我选择品类 s-->
    <!-- <div class="modal fade category_layer" id="category"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="z-index: 1051;">
      <div class="modal-dialog category_goodchoose">
        <div class="frame_total" style="position:relative;height:100%">
          <div class="modal-header">
            <div class="modal-title">
              <span style="margin-left:-60px;font-weight:700;">品类选择</span><span style="margin-left:260px;font-weight:700;">客户端品类名称</span>
              <div class="guanb" data-dismiss="modal" aria-hidden="true"></div>
            </div>
          </div>
          <div class="modal-body">

            <div class="menu">
              <div v-for="(menu1,index) in classification_chose_list" :key="index">
                <div class="menu_parent">
                  <label class="menu1_a">
                    <input class="menu1_a1" type="radio" :value="menu1.classifyId" v-model="set_parent_add.cateId" :classifyName="menu1.classifyName" :parentClassifyId="menu1.parentClassifyId" @click='chose_parent_classificatio'>
                    <span class="menu1_a2">{{menu1.classifyName}}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-body-right">
            <div style="font-size:12px;height:40px;line-height:40px;position:relative">
              <input style="padding-left:29px;width:420px;outline:none;border:none;" maxlength="4" id="input_classification" readonly="readonly" v-model="set_parent_add.cateName">
              <div style="height:40px;background:#F5F5F5;padding-left:29px;">
                <span style="color:#0086FF;margin-right:20px;cursor:pointer" @click="reset_name">重命名</span>
                <span style="color:#11D2EB;cursor:pointer" @click="manage_yunfei_show=true">设置定时操作</span>
              </div>
            </div>
          </div>
          <div class="footer">
            <button type="button" class="btn confirm" @click="submit_classification_parent">确认</button>
            <button type="button" class="btn gravity" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 设置时间 -->
    <!-- <div :class='["frame_layer",manage_yunfei_show?"frame_layer_show":""]'>
      <div class="modal-dialog frame" style="width:500px;height:260px;">
        <div class="modal-header">
          <div class="modal-title text-center" style="line-height:40px;background:#F5F5F5;color:#777777;">
            生效操作
          </div>
        </div>
        <div class="modal-body" style="height:140px;border-bottom:1px solid #E5E5E5;">
          <div class="tool_bar">
            <div class="banner_chose" style="display:inline-block;margin:30px 30px 0px 100px">
              <label>
                <input type="radio" value=0 v-model="set_parent_add.effectStrategy">立即生效
              </label>
            </div>
            <div class="banner_chose" style="display:inline-block;">
              <label class="bz">
                <input type="radio" value=1 v-model="set_parent_add.effectStrategy">定时生效
              </label>
            </div>
            <el-date-picker
              v-show="parseInt(set_parent_add.effectStrategy) === 1"
              v-model="set_parent_add.effectTime"
              :editable = "false"
              format="yyyy-MM-dd"
              type="date"
              class="date_style"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div> 
        <button type="button" class="" @click="classification_parent_time" style="border:none;width:110px;height:40px;border-radius:2px;background:#11D2EB;color:#fff;margin-top:20px;margin-left:106px;">确认</button>
        <button type="button" class="" @click="manage_yunfei_show=false" style="border:none;width:110px;height:40px;border-radius:2px;background:#B7C9E1;color:#fff;margin-top:20px;margin-left:55px;">取消</button>
      </div>
    </div> -->

    <!-- 选择商品界面 -->
    <el-dialog
      custom-class="dialog chose_goods"
      :visible.sync="choose_show"
      :before-close="cancle_banner_edit">
      <div class="frame_layer modal">
        <div class="modal-dialog frame">
          <div class="frame_left">
            <span>图片上传</span>
            <input type="file" id="banner_img_input" style="display:none" v-if="upload_img_show" @change="upload_img" accept="image/jpg, image/jpeg, image/png, image/gif">
            <div class="img_banner" :style="children_edit_toggle==='children'?'width:50px;height:50px;position:relative;':'width:90px;height:55px;position:relative;'">
              <i class="iconfont icon-icon_pic" style="font-size:55px;position:absolute;bottom:16px;" v-show="img_src===false"></i>
              <img :width="children_edit_toggle==='banner'?90:50" :height="children_edit_toggle==='children'?50:55" v-show="img_src!==false" :src="img_src" id="banner_img">
            </div>
            <div class="banner_img_tips" v-if="children_edit_toggle==='banner'">尺寸限制540x180px 300K以内，格式：jpg、jpeg、png、gif</div>
            <div class="banner_img_tips" v-if="children_edit_toggle==='children'">尺寸限制60x60px 300K以内，格式：jpg、jpeg、png、gif</div>
            <button class="banner_upload_btn" onclick="document.querySelector('#banner_img_input').click()">点击上传</button>
            <span  v-if="children_edit_toggle==='children'">标题</span>
            <input class="banner_upload_name" placeholder="请输入标题名" maxlength="4" v-model="module_add_info.title" v-if="children_edit_toggle==='children'">
            <span>链接选择</span>
            <div class="banner_chose">
              <label>
                <input type="radio" value='GOODS' v-model="module_add_info.linkType">商品
              </label>
            </div>
            <div class="banner_chose">
              <label class="bz"  v-if="children_edit_toggle==='children'">
                <input type="radio" value='SHOP' v-model="module_add_info.linkType">店铺
              </label>
            </div>
            <div class="banner_chose">
              <label class="bz">
                <input type="radio" value='LINK' v-model="module_add_info.linkType">链接
              </label>
            </div>
            <div class="banner_chose" v-if="children_edit_toggle==='children'">
              <label class="bz">
                <input type="radio" value='GOODS_CATE' v-model="module_add_info.linkType">二级/三级分类
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
            <!-- <input type="date" :min="this.tool.date.format(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')"  id="chose_time" class="form-control search_input search_input_date_l" v-model="module_add_info.effectTime" v-show="parseInt(module_add_info.effectStrategy) === 1"> -->
            <div v-if="Number(module_add_info.effectStrategy)===0">
              <span>是否隐藏</span>
              <div class="banner_chose">
                <label>
                  <input type="radio" value='Y' v-model="module_add_info.beHide">是
                </label>
              </div>
              <div class="banner_chose">
                <label>
                  <input type="radio" value='N' v-model="module_add_info.beHide">否
                </label>
              </div>
            </div>
          </div>
          <div class="frame_total">
            <div v-if="module_add_info.linkType==='GOODS_CATE'">
              <div>
                <div style="height:40px;background:#F5F5F5;font-size:12px;color:#777777;line-height:40px;text-align:center;">品类选择</div>
                <div class="chose_goods_cate">
                  <div v-for="(menu1,index) in classification_chose_list" :key="index" v-if="parentClassifyId===-1?true:(parentClassifyId===menu1.classifyId)">
                    <div class="menu_parent">
                      <label class="menu1_a">
                        <div class="menu1_a1" type="radio" :value="menu1.classifyId" :classifyName="menu1.classifyName" :parentClassifyId="menu1.parentClassifyId"></div>
                        <span class="menu1_a2">{{menu1.classifyName}}</span>
                      </label>
                      <span class="menu1_b" :classifyName="menu1.classifyName" :classifyId="menu1.classifyId" :parentClassifyId="menu1.parentClassifyId" @click="expand_menu_title" style="cursor:pointer;">+</span>
                    </div>
                    <div class="menu_child" style="display:none" :forMenuId="menu1.classifyId">
                      <div v-for="(menu2,index) in menu1.subClassify" :key="index">
                        <div class="menu2">
                          <label class="menu2_a">
                            <input class="menu2_a1" type="radio" v-model="module_add_info.goodsCateId" :classifyName="menu2.classifyName" :value="menu2.classifyId" :parentClassifyId="menu2.parentClassifyId" @click='chose_classificatio'>
                            <span class="menu2_a2">{{menu2.classifyName}}</span>
                          </label>
                          <span class="menu1_b" :classifyName="menu2.classifyName" :classifyId="menu2.classifyId" :parentClassifyId="menu2.parentClassifyId" @click="expand_menu_title" style="cursor:pointer;">+</span>
                        </div>
                        <div class="menu_child" style="display:none;padding-left:20px;" :forMenuId="menu2.classifyId">
                          <div v-for="(menu3,index) in menu2.subClassify" :key="index">
                            <div class="menu2">
                              <label class="menu2_a">
                                <input class="menu2_a1" type="radio" v-model="module_add_info.goodsCateId" :classifyName="menu3.classifyName" :value="menu3.classifyId" :parentClassifyId="menu3.parentClassifyId" @click='chose_classificatio'>
                                <span class="menu2_a2">{{menu3.classifyName}}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 点击选中的商品 -->
            <div class="tc_shop" v-if="module_add_info.linkType==='GOODS'">
              <span>{{module_add_info.linkType==='GOODS'?'已选商品':module_add_info.linkType==='SHOP'?'已选商家':''}}</span>
              <div class="merchant fl" v-show="choose_goods_checked">
                <h6>{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsName:choose_shops_checked_info.shopName}}</h6>
                <img class="fl" :src="module_add_info.linkType==='GOODS'?choose_goods_checked_info.goodsImageUrl:choose_shops_checked_info.shopIcon">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:72px;height:19px;overflow:hidden;">{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.dealerName:choose_shops_checked_info.shopName}}</div>
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
                  <div class="public_description" style="width:72px;height:19px;overflow:hidden;">{{module_add_info.linkType==='GOODS'?choose_goods_checked_info.dealerName:choose_shops_checked_info.dealerName}}</div>
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
              <div class="clear" v-if="module_add_info.linkType!=='LINK' && module_add_info.linkType!=='GOODS_CATE'">
                <input class="input fl" type="text" placeholder="请输入商品名进行搜索" @keydown.enter="get_goods_info" v-model="good_goodName" v-if="module_add_info.linkType==='GOODS'">
                <input class="input fl" type="text" placeholder="请输入供应商名进行搜索" @keydown.enter="get_shops_info" v-model="shop_shopName" v-if="module_add_info.linkType==='SHOP'">
                <button class="sort fl" @click="get_goods_info" v-if="module_add_info.linkType==='GOODS'">搜索</button>
                <button class="sort fl" @click="get_shops_info" v-if="module_add_info.linkType==='SHOP'">搜索</button>
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
                    <button @click="get_shops_info">确定</button>
                  </div>
              </div>
            </div>
            <div class="goods_body">
              <!-- 商品列表 -->
              <div class="merchant fl" v-if="module_add_info.linkType==='GOODS'" v-for="(cell,index) in module_goods" :key="index" @click="banner_goods_clecked(module_goods[index])">
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
              <div class="merchant fl" v-if="module_add_info.linkType==='SHOP'" v-for="(cell,index) in module_shops" :key="index" @click="banner_goods_clecked(module_shops[index])">
                <div class="merchant_show" v-show="parseInt(goods_show[index])===1"></div>
                <h6>{{cell.shopName}}</h6>
                <img class="fl" :src="module_shops_img[index]?module_shops_img[index]:''">
                <div>
                  <div class="public_description">供应商:</div>
                  <div class="public_description" style="width:72px;height:19px;overflow:hidden;">{{cell.dealerName}}</div>
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
              <button type="button" class="btn cancel" @click="banner_edit_confirm('banner')">确认</button>
              <button type="button" class="btn reset" @click="click_reset">重置</button>
              <button type="button" class="btn save" @click="cancle_banner_edit">取消</button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

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
                      <input class="menu1_a1" type="radio" :value="menu1.classifyId" v-model="goodsClassifyId" :classifyName="menu1.classifyName" :parentClassifyId="menu1.parentClassifyId" @click='chose_parent_classificatio'>
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

    <!-- 主分类删除弹框 -->
    <!-- <div class="modal fade" id="delete_class_children" role="dialog" aria-labelledby="sign_outLabel" aria-hidden="true">
      <div class="modal-dialog" style="width:440px">
        <div class="modal-content">
          <div class="modal-body" style="height:84px;">
            <h4 class="modal-title text-center" id="sign_outLabel" style="line-height:3">
              是否确认删除?
            </h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn save" @click="delete_classification">确认
            </button>
            <button type="button" class="btn cancel" data-dismiss="modal">我再想想
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 子模块删除弹框 -->
    <!-- <div class="modal fade" id="delete_module_class" role="dialog" aria-labelledby="sign_outLabel" aria-hidden="true">
      <div class="modal-dialog" style="width:440px">
        <div class="modal-content">
          <div class="modal-body" style="height:84px;">
            <h4 class="modal-title text-center" id="sign_outLabel" style="line-height:3">
              是否确认删除?
            </h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn save" @click="delete_children_module">确认
            </button>
            <button type="button" class="btn cancel" data-dismiss="modal">我再想想
            </button>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 子分类删除弹框 -->
    <!-- <div class="modal fade" id="delete_class" role="dialog" aria-labelledby="sign_outLabel" aria-hidden="true">
      <div class="modal-dialog" style="width:440px">
        <div class="modal-content">
          <div class="modal-body" style="height:84px;">
            <h4 class="modal-title text-center" id="sign_outLabel" style="line-height:3">
              是否确认删除?
            </h4>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn save" @click="delete_children_class">确认
            </button>
            <button type="button" class="btn cancel" data-dismiss="modal">我再想想
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: '',
  components: {
　　draggable
  },
  data () {
    return {
      upload_img_show: false,
      // 商品品类选择弹框
      goods_classify_show: false,
      // 商品品类搜索参数
      goodsClassifyId: '',
      manage_yunfei_show: false,
      // 次分类列表
      module_life_number: 12,
      // 次分类名字
      class_name: '',
      // 次分类数量
      subcates_pics_number: '',
      // 控制分页参数是否显示
      pagination: {goods: false, shops: false},
      // 控制次分类隐藏展示
      hide_or_show: '',
      // 主分类列表
      classification_list1: [],
      // 主分类列表
      classification_list: [],
      // 主分类设置参数
      set_parent_add: {cateId: '', cateName: '', effectStrategy: 0, effectTime: '', beHide: 'N', uqId: ''},
      // 获取主分类ID
      parUqId: '',
      // 上传图片阈值
      upload_img_via: false,
      // 转分类选择索引
      classification_parent_index: '',
      // 品类模块数量
      classification_number: 3,
      // 获取到的分类选择列表
      classification_chose_list: '',
      // 编辑控制标识
      edit_toggle: '',
      // 子分类图片显示
      classification_children_img: [],
      // 子分类编辑控制标识
      children_edit_toggle: '',
      // 子分类index标识
      children_edit_index: '',
      menu_params: {menuIds: []},
      // 商品搜索参数
      good_goodName: '',
      // 店铺搜索参数
      shop_shopName: '',
      // 选择的父分类
      classification_chose_parent: '',
      // 选择的子分类
      classification_chose_children: [],
      // 搜索过滤
      filterString: '',
      // 新增修改图片模块参数
      module_add_info: {dealerId: '', beHide: 'N', bannerId: '', picUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectDate: ''},
      // 新增banner显示
      choose_show: false,
      // 控制选中商品是否显示
      choose_goods_checked: false,
      // 控制选中d店铺是否显示
      choose_shops_checked: false,
      // 选中商品的参数
      choose_goods_checked_info: {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''},
      // 选中店铺的参数
      choose_shops_checked_info: {shopName: '', shopIcon: '', onSaleGoods: ''},
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
      add_modify_toggle_children: '',
      // 图片上传标识
      picture_change: false,
      // banner展示bnnerNO保存提交
      bannerNo_clecked: {first: '', second: '', thrid: '', fourth: '', fifth: ''},
      add_modify_params: {isRedirect: '', isRedirect1: ''},
      goods_show: [],
      // 新增/修改主分类编辑推荐标识
      recommend_edit: false,
      // 子分类重命名标识
      class_rename: false,
      // 新增--商品翻页参数
      join_circle_params: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // 新增--店铺翻页参数
      join_circle_params_shop: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // 查询次分类参数
      cateAdvers: '',
      subcates: [
        {
          beHide: 'N',
          subcateName: '',
          pics: [
            {
              picUrl: '',
              effectDate: '',
              bannerId: '',
              goodsId: '',
              link: '',
              beHide: 'N',
              linkType: 'GOODS',
              shopId: '',
              title: '',
              effectStrategy: 0
            }
          ]
        },
        {
          beHide: 'N',
          subcateName: '1',
          pics: [
            {
              picUrl: '',
              effectDate: '',
              bannerId: '',
              goodsId: '',
              link: '',
              beHide: 'N',
              linkType: 'GOODS',
              shopId: '',
              title: '',
              effectStrategy: 0
            }
          ]
        },
        {
          beHide: 'N',
          subcateName: '',
          pics: [
            {
              picUrl: '',
              effectDate: '',
              bannerId: '',
              goodsId: '',
              link: '',
              beHide: 'N',
              linkType: 'GOODS',
              shopId: '',
              title: '',
              effectStrategy: 0
            }
          ]
        },
        {
          beHide: 'N',
          subcateName: '',
          pics: [
            {
              picUrl: '',
              effectDate: '',
              bannerId: '',
              goodsId: '',
              link: '',
              beHide: 'N',
              linkType: 'GOODS',
              shopId: '',
              title: '',
              effectStrategy: 0
            }
          ]
        },
        {
          beHide: 'N',
          subcateName: '',
          pics: [
            {
              picUrl: '',
              effectDate: '',
              bannerId: '',
              goodsId: '',
              link: '',
              beHide: 'N',
              linkType: 'GOODS',
              shopId: '',
              title: '',
              effectStrategy: 0
            }
          ]
        }
      ],
      subcates_number: '',
      // 控制子模块编辑索引标识
      subcates_number_class: 0,
      subcates_pics: '',
      class_delete: '',
      class_name_submit: '',
      // 上传图片src控制标识
      img_src: false,
      // 主分类ID
      parentClassifyId: -1,
      // 控制选择商品品类列表显示隐藏
      dealer_class_chose: false,
      // 店铺一级列表
      firstClassify_list: '',
      // 分类名字参数
      dealerClassifyName: '',
      // 店铺二级列表
      secondClassify_list: '',
      // 店铺ID
      dealerClassify: '',
    }
  },
  watch: {
  },
  methods: {
    // 品类左侧导航
    nav_active (content, index) {
      let that = this
      console.log(content)
      that.parUqId = content.uqId
      if (index === 0) {
        that.parentClassifyId = -1
      } else {
        that.parentClassifyId = content.cateId
        console.log('分类ID', that.parentClassifyId)
      }
      console.log('主分类id', that.parUqId)
      let lis = $('#nav_classification li')
      console.log('li', $('#nav_classification li:first'))
      $($('#nav_classification li:first')).addClass('li_hover')
      Array.from(lis).map(function (x) {
        $(x).removeClass('li_hover')
        $(x).children('div').hide()
      })
      console.log(lis)
      $(event.target).addClass('li_hover')
      $(event.target).children('div').show()
      that.get_chilidren_info()
      console.log('文字内容', content.cateName)
      that.class_name = content.cateName + '0'
      that.edit_toggle = ''
      // $(event.target).val()
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
        success: function (result) {
          console.log('查询到的商家一级分类列表: ', result)
          that.firstClassify_list = result.content
        }
      })
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
        success: function (result) {
          console.log('查询到的商家二级分类列表: ', result)
          that.secondClassify_list = result.content
        }
      })
      $(`[forMenuId="${content.dealerFirstClassify}"]`).slideToggle(200)
    },
    getdata (evt) {
      console.log(1)
    },
    datadragEnd (evt) {
      let that = this
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      that.subcates[that.subcates_number_class].pics.map(function (x) {
        that.classification_children_img.push(x.logoUrl)
      })
      for (let j = 0;j < that.subcates[that.subcates_number_class].pics.length;j++) {
        console.log(1)
        that.subcates[that.subcates_number_class].pics[j].order = j + 1
      }
      // let tags = that.subcates[that.subcates_number_class].pics[evt.oldIndex]
      // that.subcates[that.subcates_number_class].pics.splice(evt.oldIndex, 1)
      // Array.prototype.insert = function (index, item) {  
      //   this.splice(index, 0, item)
      // }
      // that.subcates[that.subcates_number_class].pics.insert(evt.newIndex, tags)
      console.log('拖动后数据', that.subcates[that.subcates_number_class].pics)
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
          that.get_goods_info()
        } else if (type === 'next') {
          if (parseInt(that.join_circle_params.pageNo) === parseInt(that.join_circle_params.pageCount)) {
            alert('已经是最后一页了')
            return
          }
          that.join_circle_params.pageNo = parseInt(that.join_circle_params.pageNo) + 1
          that.get_goods_info()
        }
      } else if (toggle === 'shops') {
        if (type === 'prev') {
          if (parseInt(that.join_circle_params_shop.pageNo) === 1) {
            alert('已经是第一页了')
            return
          }
          that.join_circle_params_shop.pageNo = parseInt(that.join_circle_params_shop.pageNo) - 1
          that.get_shops_info()
        } else if (type === 'next') {
          if (parseInt(that.join_circle_params_shop.pageNo) === parseInt(that.join_circle_params_shop.pageCount)) {
            alert('已经是最后一页了1')
            return
          }
          that.join_circle_params_shop.pageNo = parseInt(that.join_circle_params_shop.pageNo) + 1
          that.get_shops_info()
        }
      }
    },
    // 品类选择保存
    set_classify () {
      let that = this
      if (that.goodsClassifyId==='') {
        this.$message({ type: "warning", message: "请选择商品品类" })
        return
      }
      that.get_goods_info()
      that.goods_classify_show = false
    },
    // 选择父分类右侧展示
    chose_parent_classificatio (event) {
      let that = this
      let target = event.target
      that.set_parent_add.cateName = target.getAttribute('classifyName')
    },
    // 商品二级三级分类选择
    chose_classificatio (event) {
      let that = this
      let target = event.target
      that.module_add_info.goodsCate = target.getAttribute('classifyName')
    },
    // 主分类新增/编辑
    original_classification (toggle, index) {
      let that = this
      that.classification_children_img = []
      that.edit_toggle = toggle
      console.log(index)
      console.log('分类名', that.subcates)
      that.subcates_number_class = index
      if (toggle !== 'children') return
      if (that.subcates[index].subcateName) {
        that.class_name_submit = that.subcates[index].subcateName
      }
      else {
        that.subcates[index].subcateName = that.class_name + (index+1)
        that.class_name_submit = that.class_name + (index+1)
      }
      if (that.subcates[index].subcateName) {
        if (that.subcates[index].pics) {
          console.log(111111111111111)
          that.subcates_pics_number = that.subcates[index].pics.length
          that.subcates[index].pics.map(function (x) {
            that.classification_children_img.push(x.picUrl)
          })
        } else {
          console.log('测试')
          that.subcates[index].pics = [{picUrl: '',effectDate: '',bannerId: '',goodsId: '',link: '',beHide: 'N',linkType: 'GOODS',shopId: '',title: '',effectStrategy: 0}]
          that.classification_children_img = []
        }
      }
      else {
        that.subcates_pics_number = 0
      }
    },
    // 主分类提交
    submit_classification_parent (index) {
      let that = this
      if (that.set_parent_add.cateId === '') {
        that.$message({ type: "warning", message: "请选择商品品类" })
        return
      }
      if (Number(that.set_parent_add.effectStrategy) === 1 && (new Date(that.set_parent_add.effectTime).getTime() < new Date().getTime())) {
        that.$message({ type: "warning", message: "确认设置失败，当前模块已生效，请将生效时间改为“立即生效”" })
        return         
      }
      if (Number(that.set_parent_add.effectStrategy)===1) {
        that.set_parent_add.beHide = 'N'
      }
      if (that.add_modify_toggle === 'edit') {
        that.classification_list[that.classification_parent_index] = that.set_parent_add
      } else if (that.add_modify_toggle === 'add') {
        // that.set_parent_add.uqId = that.guid()
        that.classification_list.push(that.set_parent_add)
      }
      console.log(that.classification_list)
      that.$message({ type: "success", message: "编辑成功" })
    },
    // 单个分类（包含推荐）编辑
    click_classification_edit (toggle, event, index) {
      let that = this
      if (index === 0) {
        if (that.recommend_edit === false) {
          $('#buttonEdit').removeAttr('readonly')
          $('#buttonEdit').addClass('rename_class_edit')
          $('#buttonEdit').focus()
          that.recommend_edit = true
          return
        }
        if (that.recommend_edit === true) {
          $('#buttonEdit').attr('readonly','readonly')
          $('#buttonEdit').removeClass('rename_class_edit')
          // $('#buttonEdit').focus()
          that.recommend_edit = false
          return
        }
      }
      console.log(that.classification_list.length)
      if (that.classification_list.length===20) {
        that.$message({ type: "warning", message: "最多可存在20条主分类" })
        return
      }
      that.add_modify_toggle = toggle
      // 获取商品分类树
      that.get_class_info()
      $('#category').modal('show')
      if (toggle === 'edit') {
        that.set_parent_add = event
        that.set_parent_add.effectTime = that.set_parent_add.effectTime ? that.tool.date.format(new Date(that.set_parent_add.effectTime), 'yyyy-MM-dd') : ''
        console.log(that.set_parent_add.effectTime)
        console.log('获取到的值', event)
        that.classification_parent_index = index
        console.log(index)
      } else if (toggle === 'add') {
        that.set_parent_add = {cateId: '', cateName: '', effectStrategy: 0, effectTime: '', beHide: 'N'}
      }
    },
    // 子分类重命名
    click_classification_rename () {
      let that = this
      if (that.class_rename === false) {
        $('#class_buttonEdit').removeAttr('readonly')
        $('#class_buttonEdit').focus()
        that.class_rename = true
        return
      }
      if (that.class_rename === true) {
        $('#class_buttonEdit').attr('readonly','readonly')
        document.querySelector('#class_name_show' + that.subcates_number_class).innerHTML = that.class_name_submit
        // that.class_name = that.class_name_submit
        that.subcates[that.subcates_number_class].subcateName = that.class_name_submit
        // $('#buttonEdit').focus()
        that.class_rename = false
        return
      }
    },
    // 主分类设置定时
    classification_parent_time () {
      if (parseInt(this.set_parent_add.effectStrategy) === 1 && !this.set_parent_add.effectTime) {
        this.$message({ type: "warning", message: "请设置具体生效时间" })
        return
      }
      if (parseInt(this.set_parent_add.effectStrategy) === 0) {
        this.set_parent_add.effectTime = this.tool.date.format(new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      } else {
        this.set_parent_add.effectTime =  this.tool.date.format(new Date(this.set_parent_add.effectTime), 'yyyy-MM-dd')
      }
      this.$message({ type: "warning", message: "设置生效时间成功" })
      this.manage_yunfei_show = false
    },
    // 分类重命名
    reset_name (event) {
      let that = this
      if ($('#input_classification').attr('readonly')) {
        $('#input_classification').removeAttr('readonly')
        $('#input_classification').focus()
        $(event.target).text('完成')
      } else {
        $('#input_classification').attr('readonly','readonly')
        $(event.target).text('重命名')
      }
    },
    // 主分类一键设置
    set_classification () {
      let that = this
      for(let i = 0; i < that.classification_list.length; i++){
        console.log(1)
        that.classification_list[i].effectTime = that.tool.date.format(new Date(that.classification_list[i].effectTime), 'yyyy-MM-dd')
      }
      console.log(that.classification_list)
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/cate/setmain.web',
        data: JSON.stringify({
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          cates: that.classification_list
        }),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
          if (result.status === 200) {
            that.$message({ type: "success", message: "主分类设置成功" })
            $.ajax({
              url: that.BASE_URL + 'm2c.operate/cate/getmain.web',
              data: {
                systemAccessToken: sessionStorage.getItem('access_token'),
                userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
              },
              headers: {
                'access_token': sessionStorage.getItem('access_token')
              },
              success: function (result) {
                console.log('获得的主分类列表: ', result)
                that.classification_list = result.content
                that.classification_list1 = []
                $.extend(that.classification_list1, result.content)
                that.hide_or_show = result.content[0].beHide
                // that.set_parent_info = result.content
                // that.module_number_info.goodsId = result.content
              }
            })
          }
        }
      })
    },
    // 新增子模块
    add_new_module () {
      let that = this
      if (that.subcates_number < 5) {
        that.subcates_number++
        that.subcates[that.subcates_number-1] = {beHide: 'N',subcateName: '',pics: []}
      } else {
        that.subcates_number
        that.$message({ type: "warning", message: "最多五个子分类" })
      }
    },
    // 点击删除
    click_banner_delete (toggle, index) {
      this.class_delete = index
      if (toggle === 'delete_parent') {
        $('#delete_class_children').modal('show')
      }
      if (toggle === 'delete_module') {
        console.log(2)
        $('#delete_module_class').modal('show')
      }
      if (toggle === 'delete_class') {
        $('#delete_class').modal('show')
      }
    },
    // 删除子模块提交
    delete_children_module () {
      let that = this
      that.edit_toggle = ''
      console.log('索引',that.subcates_number_class)
      console.log('长度',that.subcates.length)
      that.subcates.splice(that.subcates_number_class, 1)
      that.subcates_number--
      that.set_get_chilidren_info()
      $('#delete_module_class').modal('hide')
    },
    // 删除子分类提交
    delete_children_class () {
      let that = this
      // document.querySelector('#calss_children' + this.class_delete).style['display'] = 'none'
      that.subcates[that.subcates_number_class].pics.splice(that.class_delete, 1)
      $('#delete_class').modal('hide')
    },
    // 删除主分类提交
    delete_classification () {
      // 删除索引为index的长度为1的元素
      let that = this
      console.log('要删除的数组' ,that.classification_list)
      console.log('删除索引' ,that.class_delete)
      that.classification_list.splice(that.class_delete, 1)
      $('#delete_class_children').modal('hide')
      that.set_classification()
      // $.ajax({
      //   url: that.BASE_URL + 'm2c.operate/cate/getmain.web',
      //   data: {
      //     systemAccessToken: sessionStorage.getItem('access_token'),
      //     userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
      //   },
      
      //   success: function (result) {
      //     console.log('获得的主分类列表: ', result)
      //     that.classification_list = result.content
      //     $.extend(that.classification_list1, result.content)
      //     // 提取主分类id用来获取次分类
      //     that.parUqId = result.content[0].uqId
      //     that.class_name = result.content[0].cateName + '0'
      //     that.get_chilidren_info()
      //     // that.set_parent_info = result.content
      //     // that.module_number_info.goodsId = result.content
      //   }
      // })
    },
    // 次分类编辑点击重置按钮
    click_reset () {
      // 新增初始化
      document.querySelector('#banner_img_input').value = ''
      // 清空商品、店铺搜索
      this.goodsClassifyId = ''
      this.good_goodName = ''
      this.shop_shopName = ''
      // 选中商品/店铺初始化话
      this.module_add_info = {dealerId: '', logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
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
    },
    // 取消新增/编辑banner
    cancle_banner_edit  () {
      this.upload_img_show = false
      this.choose_show = false
      this.upload_img_via = false
      console.log(this.add_modify_toggle_children)
      if (this.add_modify_toggle_children === 'add') {
        this.subcates[this.subcates_number_class].pics.splice(this.subcates[this.subcates_number_class].pics.length-1, 1)
      }
      this.add_modify_toggle_children = ''
    },
    // 新增子分类
    add_children () {
      let that = this
      console.log('索引', that.subcates[that.subcates_number_class].pics.length)
      that.children_classification_edit ('children', event, that.subcates[that.subcates_number_class].pics.length)
      that.subcates[that.subcates_number_class].pics[that.subcates[that.subcates_number_class].pics.length] = {picUrl: '',effectDate: '',bannerId: '',goodsId: '',link: '',beHide: 'N',linkType: 'GOODS',shopId: '',title: '',effectStrategy: 0}
      that.module_add_info = {dealerId: '', logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      console.log(that.subcates[that.subcates_number_class].pics)
    },
    // 获取子分类
    get_chilidren_info () {
      let that = this
      // 获取次分类
      that.classification_children_img = []
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/cate/getsecond.web',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          parUqId: that.parUqId
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (result) {
          console.log('获得的次分类列表: ', result.content.subcates)
          // classification_children_img = result.content.subcates[0].pic[0].picUrl
          if (result.content !== '') {
            that.subcates = result.content.subcates
            // console.log('打印', result.content.subcates[0].pics)
            if (JSON.stringify(result.content.subcates)!=='[]' && result.content.subcates[0].pics === undefined) {
              console.log('~~~')
              that.subcates[0].pics = []
              that.hide_or_show = result.content.subcates[0].beHide
            }
            console.log('pics', that.subcates[0])
            that.subcates_number = result.content.subcates.length
            console.log('子模块数量', that.subcates_number)
            console.log('~~~~', 1)
            console.log('模块二`1', result.content.subcates[1])
            that.cateAdvers = result.content.cateAdvers
            if (result.content.subcates.length === 1) {
              that.subcates[0] = result.content.subcates[0]
              that.subcates.splice(1) 
            } else if (result.content.subcates.length === 2) {
              console.log(1)
              that.subcates[0] = result.content.subcates[0]
              that.subcates[1] = result.content.subcates[1]
              that.subcates.splice(2) 
            } else if (result.content.subcates.length === 3) {
              console.log(2)
              that.subcates[0] = result.content.subcates[0]
              that.subcates[1] = result.content.subcates[1]
              that.subcates[2] = result.content.subcates[2]
              that.subcates.splice(3) 
            } else if (result.content.subcates.length === 4) {
              console.log(3)
              that.subcates[0] = result.content.subcates[0]
              that.subcates[1] = result.content.subcates[1]
              that.subcates[2] = result.content.subcates[2]
              that.subcates[3] = result.content.subcates[3]
              that.subcates.splice(4) 
            } else if (result.content.subcates.length === 5) {
              console.log(4)
              that.subcates[0] = result.content.subcates[0]
              that.subcates[1] = result.content.subcates[1]
              that.subcates[2] = result.content.subcates[2]
              that.subcates[3] = result.content.subcates[3]
              that.subcates[4] = result.content.subcates[4]
              console.log('模块二', that.subcates[1])
              console.log('模块三', that.subcates[2])
            }
            // if (result.content.subcates[0].pics) {
            //   result.content.subcates[0].pics.map(function (x) {
            //     that.classification_children_img.push(x.picUrl)
            //   })
            // }
          } else {
            that.cateAdvers = ''
            // that.subcates[0].pics = []
            that.subcates_number = 0
            that.subcates = []
            // that.subcates[0].pics.splice(0, that.subcates.pics.length)
            console.log('233', that.subcates.pics)
            console.log('参数', that.subcates)
            // result.content.subcates[0].pics = []
            // result.content.subcates[0].pics.map(function (x) {
            //   that.classification_children_img.push(x.picUrl)
            // })
          }
          console.log('获取到的次分类图片', that.classification_children_img)
          // that.module_life_number = result.content
          // that.set_parent_info = result.content
          // that.module_number_info.goodsId = result.content
        }
      })
    },
    // 单个子分类编辑
    children_classification_edit (toggle, event, index) {
      let that = this
      // 清空商品、店铺搜索
      console.log('父分类ID', that.parentClassifyId)
      this.upload_img_show = true
      this.goodsClassifyId = ''
      this.good_goodName = ''
      this.shop_shopName = ''
      that.add_modify_toggle_children = ''
      that.children_edit_toggle = toggle
      that.children_edit = index
      // that.img_src = false
      console.log('src', that.img_src)
      that.choose_show = true
      that.join_circle_params.pageNo = 1
      that.join_circle_params_shop.pageNo = 1
      // 初始化选中商品
      that.choose_goods_checked = false
      that.choose_shops_checked = false
      console.log('索引', index)
      // document.querySelector('#banner_img_input').value = ''
      that.img_src = false
      // 获取商品列表
      that.get_goods_info()
      // 获取商品分类列表
      that.get_class_info()
      // 获取店铺列表
      that.get_shops_info()
      // 获取一级店铺分类
      that.get_shops_firstClassify()
      // 编辑之前清空数据，防止不修改整体数据的话携带上一次编辑的数据过来
      that.module_add_info = {dealerId: '', logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      if (that.children_edit_toggle === 'banner') {
        if (that.cateAdvers) {
          $.extend(that.module_add_info, that.cateAdvers)
          that.img_src = that.module_add_info.picUrl
          console.log('~~~~~~~~~~~~~')
        } else {
          that.add_modify_toggle_children = 'add'
        }
        // that.cateAdvers = that.module_add_info
      } else {
        if (that.subcates[that.subcates_number_class].pics[that.children_edit]) { // 如果本模块存在则执行下面代码拿去性情 否则走else初始化编辑页面即清空编辑页面内容
          $.extend(that.module_add_info, that.subcates[that.subcates_number_class].pics[that.children_edit])
          console.log('编辑')
          that.img_src = that.module_add_info.picUrl
        } else {
          console.log('新增')
          that.add_modify_toggle_children = 'add'
          that.img_src = false
          that.module_add_info = {dealerId: '', logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
      }
      // 获取选中的商品详情
      if (that.module_add_info.linkType === 'GOODS' && that.module_add_info.goodsId) {
        that.choose_shops_checked = false
        $.ajax({
          url: that.BASE_URL + 'm2c.scm/goods/detail',
          data: {
            goodsId: that.module_add_info.goodsId
          },
          headers: {
            'access_token': sessionStorage.getItem('access_token')
          },
          success: function (result) {
            console.log('选中的商品详情: ', result)
            that.choose_goods_checked_info.goodsName = result.content.goodsName
            that.choose_goods_checked_info.dealerName = result.content.dealerName
            that.choose_goods_checked_info.goodsPrice = result.content.goodsPrice / 100
            that.choose_goods_checked_info.goodsImageUrl = result.content.goodsImageUrl
            that.choose_goods_checked = true
          }
        })
      } else if (that.module_add_info.linkType === 'SHOP' && that.module_add_info.shopId) { // 获取选中的店铺详情
        that.choose_goods_checked = false
        $.ajax({
          url: that.BASE_URL + 'm2c.scm/shop/sys/detail',
          data: {
            dealerId: that.module_add_info.shopId
          },
          headers: {
            'access_token': sessionStorage.getItem('access_token')
          },
          success: function (result) {
            console.log('选中的店铺详情: ', result)
            that.choose_shops_checked_info = result.content
            that.choose_shops_checked = true
          }
        })
      }
    },
    // 新增/修改提交
    banner_edit_confirm (toggle) {
      let that = this
      if (that.add_modify_toggle_children === 'add') {
        if (!that.upload_img_via || that.img_src === false) {
          that.$message({ type: "warning", message: '图片未上传' })
          return
        }
      }
      if (that.img_src === false) {
        that.$message({ type: "warning", message: '图片未上传' })
        return
      }
      let img = new Image()
      img.src = that.img_src
      console.log('宽', img.width, '高',img.height )
      if (that.children_edit_toggle === 'banner' && img.src && (img.width!==540 || img.height!==180)) {
        that.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
        return
      }
      if (that.children_edit_toggle === 'children' && img.src && (img.width!==60 || img.height!==60)) {
        that.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
        return
      }
      if (!that.module_add_info.title && that.children_edit_toggle !== 'banner') {
        that.$message({ type: "warning", message: '请输入模块名' })
        return
      }
      if (!that.module_add_info.link && !that.module_add_info.goodsId && !that.module_add_info.shopId && !that.module_add_info.goodsCateId) {
        that.$message({ type: "warning", message: '跳转链接未设置' })
        return
      }
      // if (that.module_add_info.title && that.module_add_info.title.length > 50) {
        // that.$message({ type: "warning", message: "banner名控制在1-50个字" })
      //   that.show_tip('banner名控制在1-50个字')
      //   return
      // }
      if (!that.module_add_info.link && !that.module_add_info.goodsId && !that.module_add_info.shopId && !that.module_add_info.goodsCateId) {
        that.$message({ type: "warning", message: '请选择或者输入链接' })
        return
      }
      if (Number(that.module_add_info.effectStrategy) === 1 && !that.module_add_info.effectTime) {
        that.$message({ type: "warning", message: '未设置具体定时时间内容' })
        return
      }
      if (that.module_add_info.effectTime) {
        that.module_add_info.effectTime = that.tool.date.format(new Date(that.module_add_info.effectTime), 'yyyy-MM-dd')
      }
      if (Number(that.module_add_info.effectStrategy) === 1 && (new Date(that.module_add_info.effectTime).getTime() < new Date().getTime())) {
        that.$message({ type: "warning", message: '确认设置失败，当前模块已生效，请将生效时间改为“立即生效”' })
        return         
      }
      if (that.picture_change) {
        let formData = new FormData()
        formData.append('img', document.querySelector('#banner_img_input').files[0])
        formData.append('token', sessionStorage.getItem('access_token'))
        formData.append('imgGroup', 5)
        $.ajax({
          type: 'post',
          url: that.BASE_URL + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (result) {
            result = JSON.parse(result)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (result.errorMessage && result.errorMessage !== '') {
              that.$message({ type: "error", message: result.errorMessage })
              that.picture_change = true
              return
            }
            else {
              that.module_add_info.picUrl = result.content.url
              that.picture_change = false
              if (that.children_edit_toggle === 'banner') {
                $.extend(that.cateAdvers, that.module_add_info)
                for (let i = that.subcates.length-1; i > 0; i--) {
                  // console.log('子模块数量', that.subcates[i])
                  console.log(JSON.stringify(that.subcates[i]) == "{}")
                  if (JSON.stringify(that.subcates[i]) == "{}") {
                    // console.log(i)
                    that.subcates.splice(i, 1)
                  }
                }
                that.class_rename = false
                $.ajax({
                  type: 'post',
                  url: that.BASE_URL + 'm2c.operate/cate/setsecond.web',
                  data: JSON.stringify({
                    systemAccessToken: sessionStorage.getItem('access_token'),
                    userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
                    parUqId: that.parUqId,
                    cateAdvers: that.module_add_info,
                    subcates: that.subcates
                  }),
                  headers: {
                    'access_token': sessionStorage.getItem('access_token')
                  },
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json',
                  success: function (result) {
                    console.log('获得的次分类列表: ', result)
                    if (result.status === 200) {
                      that.$message({ type: "success", message: '设置成功' })
                      that.img_src = false
                      that.upload_img_show = false
                      that.get_chilidren_info()
                    }
                    // that.module_life_number = result.content
                    // that.set_parent_info = result.content
                    // that.module_number_info.goodsId = result.content
                  }
                })
                console.log('1', that.cateAdvers.picUrl)
                console.log(1)
              } else if (that.children_edit_toggle === 'children') {
                that.classification_children_img[that.children_edit] = result.content.url
                // 如果定时生效，默认不隐藏
                if (Number(that.module_add_info.effectStrategy)===1) {
                  that.module_add_info.beHide = 'N'
                  console.log('sure')
                }
                // if (that.children_edit===0) {
                //   that.subcates[that.subcates_number_class] = {beHide: 'N',subcateName: '',pics: [{picUrl: '',effectDate: '',bannerId: '',goodsId: '',link: '',beHide: 'N',linkType: 'GOODS',shopId: '',title: '',effectStrategy: 0}]}              
                // }
                that.subcates[that.subcates_number_class].pics[that.children_edit] = that.module_add_info
                console.log('索引', that.children_edit)
                console.log(2)
              }
              that.upload_img_show = false
              that.choose_show = false
              that.img_src = false
              that.add_modify_toggle_children = ''
            }
          }
        })
        that.img_src = false
      } else {
        if (that.children_edit_toggle === 'banner') {
          $.extend(that.cateAdvers, that.module_add_info)
          console.log('参数', that.cateAdvers)
          that.set_get_chilidren_info()
          console.log('1', that.cateAdvers.picUrl)
          console.log(1)
        } else if (that.children_edit_toggle === 'children') {
          that.classification_children_img[that.children_edit] = that.subcates[that.subcates_number_class].pics[that.children_edit].picUrl
          if (Number(that.module_add_info.effectStrategy)===1) {
            that.module_add_info.beHide = 'N'
            console.log('sure')
          }
          // if (that.children_edit===0) {
          //   that.subcates[that.subcates_number_class] = {beHide: 'N',subcateName: '',pics: [{picUrl: '',effectDate: '',bannerId: '',goodsId: '',link: '',beHide: 'N',linkType: 'GOODS',shopId: '',title: '',effectStrategy: 0}]}              
          // }
          // $.extend(that.subcates[that.subcates_number_class].pics[that.children_edit], that.module_add_info)
          that.subcates[that.subcates_number_class].pics[that.children_edit] = that.module_add_info
        }
        that.choose_show = false
        that.add_modify_toggle_children = ''
        that.img_src = false
      }
    },
    // 设置次分类
    set_get_chilidren_info () {
      console.log(1)
      let that = this
      console.log(JSON.stringify(that.subcates))
      for (let i = that.subcates.length-1; i >= 0; i--) {
        console.log(JSON.stringify(that.subcates[i].pics) === '[]')
        if (JSON.stringify(that.subcates[i].pics) === '[]') {
          that.subcates.splice(i, 1)
        }
      }
      for (let i = 0;i < that.subcates.length;i++) {
        for (let j = 0;j < that.subcates[i].pics.length;j++) {
          that.subcates[i].pics[j].order = j + 1
        }
      }
      that.class_rename = false
      console.log('主分类参数', JSON.stringify(that.subcates))
      if (that.children_edit_toggle !== 'banner' && that.class_name_submit.length<2) {
        that.$message({ type: "warning", message: '模块名最少两个字' })
        return
      }
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/cate/setsecond.web',
        data: JSON.stringify({
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          parUqId: that.parUqId,
          cateAdvers: that.cateAdvers,
          subcates: that.subcates
        }),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
          console.log('获得的次分类列表: ', result)
          if (result.status === 200) {
            that.edit_toggle = ''
            that.$message({ type: "success", message: '设置成功' })
            that.get_chilidren_info()
          }
          // that.module_life_number = result.content
          // that.set_parent_info = result.content
          // that.module_number_info.goodsId = result.content
        }
      })
    },
    // 控制主分类显示隐藏
    set_parent_beHide (index) {
      let that = this
      if (that.classification_list[index].beHide === 'Y') {
        that.classification_list[index].beHide = 'N'
      } else {
        that.classification_list[index].beHide = 'Y'
        that.classification_list[index].effectStrategy = 0
      }
      // $(event.target)
    },
    // 打开菜单权限后选择事件
    select_menu (event) {
      let that = this
      let target = event.target
      console.log('父级', target.getAttribute('parentClassifyId'))
      if (target.getAttribute('parentClassifyId') === '-1') {
        let classifyId = target.getAttribute('classifyId')
        let checked = target.checked
        console.log(checked)
        let children = [...document.querySelectorAll(`[parentClassifyId="${classifyId}"]`)]
        console.log(children)
        if (checked) {
          children.map(function (x) {
            x.checked = true
            that.classification_chose_children.push(x.attributes.classifyname.value)
          })
          that.classification_chose_parent = target.getAttribute('classifyName')
          console.log(that.classification_chose_children)
          $(`[forMenuId="${classifyId}"]`).slideDown(200)
        } else {
          children.map(function (x) {
            x.checked = false
          })
        }
      } else {
        let parentClassifyId = target.getAttribute('parentClassifyId')
        let brothers = [...document.querySelectorAll(`[parentClassifyId="${parentClassifyId}"]`)]
        let parent = document.querySelector(`[classifyId="${parentClassifyId}"]`)
        if (brothers.filter((x) => x.checked === true).length > 0) {
          parent.checked = true
          console.log(1)
          this.classification_chose_parent = parent.getAttribute('classifyName')
          $(`[forMenuId="${parentClassifyId}"]`).slideDown(200)
        } else {
          parent.checked = false
        }
      }
    },
    // 菜单权限保存按钮
    save_menu () {
      let that = this
      let inputAll = [...document.querySelectorAll(`input[classifyId]`)]
      let menuIds = []
      inputAll.map(function (x) {
        if (x.checked) {
          menuIds.push(x.getAttribute('classifyId'))
        }
      })
      that.menu_params.menuIds = menuIds.join(',')
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/role/menus/save',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          roleId: that.menu_params.roleId,
          menuIds: that.menu_params.menuIds
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (result) {
          // console.log('角色菜单保存成功')
          $('#menu').modal('hide')
        }
      })
    },
    // 菜单权限右边的加号按钮
    expand_menu_title (event) {
      let target = event.target
      let classifyId = target.getAttribute('classifyId')
      $(`[forMenuId="${classifyId}"]`).slideToggle(200)
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
          success: function (result) {
            result = JSON.parse(result)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (result.errorMessage && result.errorMessage !== '') {
              that.$message({ type: "error", message: result.errorMessage })
              that.picture_change = true
              return
            }
            // console.log('上传图片成功,返回结果是: ', result)
            that.module_add_info.picUrl = result.content.url
            that.picture_change = false
            callback()
          }
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
      console.log('获取到的商品id', event.goodsId)
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
      let objUrl = this.getObjectURL(target.files[0])
      let size = target.files[0].size
      if (size >= 1024000 * 10) this.$message({ type: "warning", message: "图片超过10M了哦" })
      else {
        if (objUrl) {
          this.img_src = objUrl
          this.picture_change = true
        }
      }
    },
    // 获取商品列表
    get_goods_info () {
      let that = this
      that.module_goods_img = []
      $.ajax({
        url: that.BASE_URL + 'm2c.scm/goods/choice',
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          pageNum: that.join_circle_params.pageNo,
          rows: 8,
          condition: that.good_goodName,
          goodsClassifyId: that.goodsClassifyId
        },
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        success: function (result) {
          console.log('获取的商品列表: ', result)
          that.join_circle_params.pageCount = result.pageCount
          that.module_goods = result.content
          if (result.content !== '') {
            console.log('获取的商品列表: ', result)
            that.pagination.goods = true
            // 图片链接
            result.content.map(function (x) {
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
    get_shops_info () {
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
        success: function (result) {
          console.log('获取的店铺列表: ', result)
          that.join_circle_params_shop.pageCount = result.pageCount
          that.module_shops = result.content
          if (JSON.stringify(result.content) !== '[]') {
            that.dealer_class_chose = false
            that.pagination.shops = true
            // 图片链接
            result.content.map(function (x) {
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
        success: function (result) {
          console.log('获取的获取商品分类树: ', result)
          that.classification_chose_list = result.content
        }
      })
    }
  },
  mounted () {
    let that = this
    // 获取主分类
    $.ajax({
      url: that.BASE_URL + 'm2c.operate/cate/getmain.web',
      data: {
        systemAccessToken: sessionStorage.getItem('access_token'),
        userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
      },
      headers: {
        'access_token': sessionStorage.getItem('access_token')
      },
      success: function (result) {
        console.log('获得的主分类列表: ', result)
        that.classification_list = result.content
        $.extend(that.classification_list1, result.content)
        // 提取主分类id用来获取次分类
        that.parUqId = result.content[0].uqId
        that.class_name = result.content[0].cateName + '0'
        that.get_chilidren_info()
        // that.set_parent_info = result.content
        // that.module_number_info.goodsId = result.content
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.client_classification {
  min-width: 1200px;
  .modal-body{
    text-align:left;height:400px;overflow:auto !important;
    .menu{
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
  }
  .client_classification_content {
    margin: 20px 0px 0px 42px;
  }
  .classification_parent {
    float: left;
    width: 150px;
    height: 740px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #E5E5E5;
    ul {
      padding: 0px;
      li {
        font-size: 12px;
        color: #777777;
        padding-left: 23px;
        list-style: none;
        line-height: 40px;
        cursor: pointer;
        position: relative;
        .li_active {
          display: none;
          position: absolute;
          left: 0px;
          width: 3px;
          height: 40px;
          background: rgba(24, 220, 246, 1);
        }
      }
      .li_hover {
        color: #000000;
        background: #E1EEF6;
        font-weight: 700;
      }
      .li_hover_active {
        display: block;
      }
      // li:hover {
      //   background: #E1EEF6;
      //   color: #000000;
      //   font-weight: 700;
      // }
      // li:hover .li_active {
      //   display: block;
      // }
    }
    .classification_parent_edit {
      margin-left: 23px;
      width: 60px;
      height: 24px;
      border-radius: 2px;
      border: 1px solid #0078E4;
      color: #0078E4;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;
    }
  }
  .classification_parent::-webkit-scrollbar {
    display: none
  }
  /*IE10,IE11,IE12*/
  .classification_parent {
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
  .classification_content {
    overflow: auto;
    float: left;
    width: 390px;
    height: 740px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #E5E5E5;
    // text-align: center;
    position: relative;
    .add_button_class {
       width:296px;
       height:40px; 
       background:#6C83BC url('../../../../../static/images/businessManage/icon-add.png') 70px no-repeat;
       font-size:12px;
       border:none;
       color:#fff;
       padding-left: 40px;
       margin-bottom: 40px;
       margin-left: 45px;
    }
    .banner_img {
      width: 350px;
      height: 140px;
      background: #F2F1F1;
      margin: 20px;
      position: relative;
      // 遮罩层新增/编辑按钮
      .public_btn_add {
        display: none;
        width: 90px;
        height: 30px;
        background: #DFE9F6;
        border: 1px solid #0078E4;
        border-radius: 4px;
        font-size: 12px;
        color: #0086FF;
        position: absolute;
        margin: auto;
        z-index: 5;
      }
    }
    .banner_img:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 140px;
        background: #6C83BC;
        // padding: 14px 18px;
        position: absolute; // top: 46px;
        width: 350px;
        // left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        left: 0;
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .banner_img:hover:before {
        width: 350px;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .banner_img:hover button {
        display: block;
      }
    .classification_title {
      color: #777777;
      font-size: 12px;
      text-align: center;
      position: relative;
      height: 20px;
      .public_title_left {
        background: #E5E5E5;
        width: 29px;
        height: 2px;
        position: absolute;
        top: 8px;
        left: 130px;
      }
      .public_title_right {
        background: #E5E5E5;
        width: 29px;
        height: 2px;
        position: absolute;
        top: 8px;
        right: 130px;
      }
      .classification_children {
        cursor: pointer;
        text-align: center;
        width: 40px;
        height: 20px;
        background: rgba(225, 238, 246, 1);
        border-radius: 2px;
        color: #0078E4;
        font-size: 12px;
        line-height: 20px;
        position: absolute;
        right: 30px;
        top: 0px;
      }
    }
    .public_c_children {
      width: 60px;
      height: 70px;
      margin: 20px 15px 10px 45px;
      // float: left;
      display: inline-block;
      text-align: center;
      .public_c_content {
        width: 60px;
        height: 60px;
        // background: #ECECEC;
        margin-bottom: 9px;
      }
      span {
        font-weight: 700;
        color: #000000;
        font-size: 12px;
      }
    }
  }
  .classification_content::-webkit-scrollbar {
      display: none
    }
  /*IE10,IE11,IE12*/
  .classification_content {
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
  .classification_edit {
    margin-left: 21px;
    float: left;
    width: 390px;
    height: 740px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #E5E5E5;
    .rename_class {
      position:absolute;
      top:10px;
      left:12px;
      width:68px;
      height:20px;
      padding:0px;
      padding-left:8px;
      background: #F5F5F5;
      border: none;
    }
    .rename_class_edit {
      background: #fff;
      border: 1px solid #BFC1CB;
    }
    .classification_e_content {
      width: 320px;
      height: 670px;
      border: 1px solid #BFC1CB;
      margin: 30px 37px 40px 33px;
      ul {
        padding: 0px;
        font-size: 12px;
        margin: 0px;
        li {
          list-style: none;
          height: 40px;
          background: #F5F5F5;
          border-bottom: 1px solid #BFC1CB;
          line-height: 40px;
          color: #777777;
          padding-left: 20px;
          span {
            cursor: pointer;
          }
          .public_span_l {
            margin-left: 160px;
            color: #0086FF;
          }
          .public_span_m {
            margin-left: 10px;
            color: #11D2EB;
          }
          .public_span_r {
            margin-left: 10px;
            color: #F56C6C;
          }
        }
      }
      button {
        width: 319px;
        height: 40px;
        background: #6C83BC;
        border: none;
        color: #fff;
        position: relative;
        .button_style {
          width: 16px;
          height: 16px;
          background: url('../../../../../static/images/businessManage/icon-add.png') no-repeat -1.7px -1px;
          position: absolute;
          top: 12px;
          left: 108px;
        }
      }
    }
    .classification_e_content::-webkit-scrollbar {
      display: none
    }
    /*IE10,IE11,IE12*/
    .classification_e_content {
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
  }
  .classification_submit {
    float: left;
    width: 160px;
    height: 740px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid #E5E5E5;
    text-align: center;
    margin-left: -1px;
    button {
      width: 110px;
      height: 40px;
      border: none;
      color: #fff;
    }
    .button_top {
      margin-top: 70px;
      width: 110px;
      height: 40px;
      background: rgba(17, 210, 235, 1);
      border-radius: 2px;
    }
    .button_bottom {
      margin-top: 20px;
      width: 110px;
      height: 40px;
      background: rgba(183, 201, 225, 1);
      border-radius: 2px;
    }
  }
  .classification_children_edit {
    float: left;
    width:360px;
    height:740px;
    margin-left: 21px;
    background:rgba(255,255,255,1);
    border: 1px solid #E5E5E5;
    text-align: center;
    padding-left: 20px; 
    position: relative;
    p {
      margin: 27px 0px 19px 0px;
      font-size: 14px;
      font-weight: 700;
      margin-left: -30px;
      text-align: center;
    }
    button {
      padding: 0px;
      width: 70px;
      height: 24px; 
      background:rgba(108,131,188,0.1);
      border-radius: 2px;
      font-size: 12px;
      border: none;
      margin-right: 10px;
      margin-bottom: 29px;
    }
    .button_rename_style {
      box-shadow: 0px 0px 0.5px 0.5px #B5C3E5;
      background: #F0F2F8;
      color: #6C83BC;
    }
    .button_delete {
      box-shadow: 0px 0px 0.5px 0.5px #E8BEBE;
      background: #FDF0F0;
      color: #F56C6C;
    }
    .public_classification_content {
      height: 567px;
      .public_classification_children {
        font-size: 12px;
        width:100px;
        height:130px; 
        border: 1px solid #E5E5E5;
        margin-right: 10px;
        margin-bottom: 10px;
        float: left;
        position: relative;
        .classification_children_img {
          width:49.4px;
          height:49.4px;
          // background: #ECECEC;
          margin: 16px 24px 6px 24px;
        }
        button {
          margin: 10px 1px 0px 2px;
          width: 38px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid #BFC1CB;
          background: #fff;
          color: #777777;
        }
        .button_edit {
          border: 1px solid #0078E4;
          color: #0078E4;
        }
        .add_class_children {
          background: #6C83BC url('../../../../../static/images/businessManage/icon-add.png') center no-repeat;
        }
      }
    }
    .public_classification_tips {
      color: #BFC1CB;
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .classification_children_submit {

  }
   // 模态框设置
  .frame_layer {
    .frame {
      width: 870px;
      height: 700px;
      // padding-left: 20px;
      // padding-right: 20px;
      .frame_left {
        width: 123px;
        height: 621px;
        float: left;
        border: 1px solid #E5E5E5;
        background: #F5F5F5;
        padding-left: 27px;
        position: absolute;
        left: 0px;
        top: 0px;
        span {
          font-size: 12px;
          font-weight: 700;
          margin: 18px 0px 6px 0px;
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
        // label {
        //   font-weight: 500;
        // }
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
  /*选择品类*/
  .category_layer{
    .category_goodchoose{
      width: 720px;
      height: 380px;
      background: #fff;
      .modal-header{
        width: 100%;
        height: 40px;
        text-align: center;
        background: #DFE9F6;
        font-size: 12px;
        position: relative;
        span{
          line-height: 40px;
          display: inline-block;
        }
        .guanb{
          width: 40px!important;
          height: 40px!important;
          position: absolute;
          cursor: pointer;
          color: #fff;
          background: #B7C9E1 url('../../../../../static/images/businessManage/ico_close.png') no-repeat 9px;
          right:0px;
          top:0px;
        }
      }
      .modal-body{
        float: left;
        padding-top: 20px;
        padding-left: 50px;
        width: 300px;
        height: 260px;;
        max-height: 520px;
        border-right: 1px solid #e5e5e5;
        .wrapper{
          position: relative;
          .triangle{
            width:0;
            height:0;
            border-width:6px 6px 0;
            border-style:solid;
            border-color:#D8D8D8 transparent transparent;/*灰 透明 透明 */
            position: absolute;
            left: -25px;
            top: 8px;
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
          .input_check+label {
            display: inline-block;
            width:10px;
            height:10px;
            border-radius: 2px ;
            border: 1px solid #BFC1CB;
          }
          .input_check:checked+label {
            display: inline-block;
            width:10px;
            height:10px;
            background: url('../../../../../static/images/businessManage/icon-selected.png') no-repeat center;
          }
        }
        .tit{
          font-size: 12px;
        }
      }
      .modal-body-right {
        float: left;
        width: 420px;
        height: 260px;
      }
      .footer{
        width:720px;
        height:80px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        border-top:1px solid #e5e5e5;
        .btn{
          width:110px!important;
          height:40px;
          border-radius: 2px;
          color: #fff;
          width:28px;
          font-size:14px;
          text-align: center;
          line-height: 40px;
          display: inline-block;
          padding: 0px;
          margin-right: 20px;
          margin-top: 10px;
        }
        .gravity{
          background: #B7C9E1;
        }
        .confirm{
          margin-left: 235px;
          background: #11D2EB;
        }
      }
    }
  }
  // 商品描述公共类
  .public_description {
    font-size: 7px;
    font-weight: 700;
    line-height: 20px;
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
  /*选择品类*/
  .chose_goods_cate {
    padding-top: 20px;
    height: 563px;;
    overflow: auto;
    text-align:left;
    .menu1_b{font-size:150%;font-weight:bold;display:inline-block;vertical-align:middle;}
    .menu_parent{
      margin-left: 40px;
      padding-right:23px;
      .menu1_a,.menu2_a{
        display:inline-block;vertical-align:middle;
        .menu1_a1,.menu1_a2{display:inline-block;vertical-align:middle;margin-right:5px}
      }
    }
    .menu_child {
      padding-left:63px;
      .menu2_a{
        .menu2_a1,.menu2_a2{display:inline-block;vertical-align:middle;margin-right:5px}
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
  .goods_category_layer_chose {
    position: absolute;
    top: 0px;
    left: 0px;
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
        max-height: 340px;
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
        height: 80px;
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
  .date_style {
    margin-left: 200px;
  }
}
.modal-open{
  .modal {height:100%}
  #add_modify,#forbid,#modify_group{display:flex}
  #add_modify.in,#forbid.in,#modify_group.in,#myModal.in,#delete_module_class.in,#delete_class.in,#delete_class_children.in{z-index:2000}
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
