<template>
  <div class='4scsykz' @click="cancel_class_chose">
    <div class="home_control">
      <!-- 获取图片宽高的中间dom -->
      <img src="" ref="upload_img_check" alt="" style="display:none">
      <div class="preview" v-loading="fullscreenLoading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="hsla(0,0%,100%,.9)">
        <span>预览专区</span>
        <div class="preview_content_parent">
          <div class="preview_content">
            <div class="preview_top"></div>
            <!-- 首页轮播 banner_number-->
            <div class="preview_banner">
              <img :src="banner_number?banner_number:''" style="width:234px;height:114px;"></img>
              <button class="public_btn_add" path='/m/bannerManage' @click="goto" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;">新增/编辑</button>
            </div>
            <!-- 功能导航 -->
            <div class="preview_nav">
              <ul>
                <li v-for="(cell,index) in set_home_info[0].pics" :key="index" v-if="Number(index) < Number(set_home_info[0].pics.length)?(set_home_info[0].pics[index].beHide==='N'&&(new Date(set_home_info[0].pics[index].effectTime).getTime()<new Date().getTime())):''">
                  <img :src="module_nav_img[index]?module_nav_img[index]:''" class="preview_nav_img" ></img>
                  <!-- <div class="preview_nav_des">{{module_nav_name[index]&&index!==9?module_nav_name[index]:'更多'}}</div> -->
                  <div class="preview_nav_des">{{module_nav_name[index]?module_nav_name[index]:'模块名'}}</div>
                </li>
              </ul>
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('navigation')">新增/编辑</button>
            </div>
            <div class="preview_public"></div>
            <!-- 推广位管理(四图推荐) -->
            <div class="preview_recommend" :style="set_home_info[1].pics.length===4?'height:147px':'height:77px'">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('recommend')">新增/编辑</button>
              <div v-for="(cell,index) in set_home_info[1].pics" :key="index">
                <img :src="module_recommend_img[index]?module_recommend_img[index]:''" class="preview_recommend_content" style="margin-top:7px;"></img>
              </div>
            </div>
            <div class="preview_public"></div>
            <!-- 专题广告 -->
            <div class="preview_select">
              精选专题
              <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:8px;right:31px;" v-if="set_home_info[2].pics.length===0">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('select')">新增/编辑</button>
              <div class="preview_select_content" v-for="(cell,index) in set_home_info[2].pics" :key="index" :style="index===module_select_img.length-1?'margin-bottom:0px;':''"> 
                <img :src="module_select_img[index]?module_select_img[index]:''" class="preview_select_content"></img>
              </div>
            </div>
            <div class="preview_public"></div>
            <!-- 商品横向管理 -->
            <div class="preview_life">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('life')">新增/编辑</button>
              <p style="text-align:center">品质生活</p>
              <div class="preview_life_content" v-for="(cell,index) in 3" :key="index">
                <img :src="module_life_img[index]?module_life_img[index]:''" class="preview_life_content" style="width:76px;height:64px;margin-left: 0px;"></img>
                <span class="goods_tag">标签</span>
                <div class="goods_name">{{module_life_name[index]}}</div>
                <div class="goods_description">{{module_life_goodsName2[index]}}</div>
                <div class="goods_price">￥{{(module_life_goodsPrice[index]/100).toFixed(2)}}</div>
              </div>
            </div>
            <div class="preview_public"></div>
            <!-- 三图推荐部分 -->
            <div class="preview_show">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('show')">新增/编辑</button>
              <div class="preview_show_left">
                <img :src="module_show_img[0]?module_show_img[0]:''" class="preview_show_left" style="margin:0px;">
              </div>
              <div class="preview_show_right">
                <img :src="module_show_img[1]?module_show_img[1]:''" class="preview_show_right" style="margin:0px;">
              </div>
              <div class="preview_show_right">
                <img :src="module_show_img[2]?module_show_img[2]:''" class="preview_show_right" style="margin:0px;">
              </div>
            </div>
            <div class="preview_public" ></div>
            <!-- 人气推荐 -->
            <div class="preview_popular">
              <p style="text-align:center;margin:0px;">人气推荐</p>
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('popular')">新增/编辑</button>
              <!-- <div class="preview_popular_br"></div> -->
              <hr>
              <div></div>
              <div class="preview_popular_content">
                <img :src="module_popular_img[0]?module_popular_img[0]:''">
                <div class="goods_name goods_des_position">{{module_popular_name[0]}}</div>
                <div class="goods_description goods_des_position">{{module_popular_goodsName2[0]}}</div>
                <span class="goods_tag goods_des_position">标签</span>
                <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[0]/100).toFixed(2)}}</div>
              </div>
              <div class="preview_popular_hr"></div>
              <div class="preview_popular_content">
                <img :src="module_popular_img[1]?module_popular_img[1]:''">
                <div class="goods_name goods_des_position">{{module_popular_name[1]}}</div>
                <div class="goods_description goods_des_position">{{module_popular_goodsName2[1]}}</div>
                <span class="goods_tag goods_des_position">标签</span>
                <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[1]/100).toFixed(2)}}</div>
              </div>
              <div class="preview_popular_hr"></div>
              <div class="preview_popular_content">
                <img :src="module_popular_img[2]?module_popular_img[2]:''">
                <div class="goods_name goods_des_position">{{module_popular_name[2]}}</div>
                <div class="goods_description goods_des_position">{{module_popular_goodsName2[2]}}</div>
                <span class="goods_tag goods_des_position">标签</span>
                <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[2]/100).toFixed(2)}}</div>
              </div>
            </div>
            <div class="preview_public"></div>
            <!-- 单图推荐 -->
            <div class="preview_subject">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('subject')">新增/编辑</button>
              <div class="preview_subject_content">
                <img :src="module_subject_img[0]?module_subject_img[0]:''" class="preview_subject_content" style="margin:0px;">
              </div>
            </div>
            <!-- <div class="preview_public"></div> -->
            <!-- 猜你喜欢 -->
            <!-- <div class="preview_like">
              <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('like')">新增/编辑</button>
              <p>猜你喜欢</p>
              <div class="preview_like_content"></div>
              <div class="preview_like_content"></div>
              <div class="preview_like_content"></div>
              <div class="preview_like_content"></div>
            </div> -->
            <!-- 底部菜单 -->
            <div class="preview_footer">
              <button class="public_btn_add" style="top:40%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('menu')">新增/编辑</button>
              <div class="public_footer"  v-for="(cell,index) in 5" :key="index" :style="index===3?'margin-left:60px;':''" v-if="index!==2">
                <!-- <div style="width:20px;height:20px;background:#ECECEC;"></div> -->
                <img :src="module_menu_img[index]?module_menu_img[index]:''" :id="index!=2?'menu_img_upload'+index:''">
                <span style="margin:0px;font-size:12px;">{{index===0?'商城':index===1?'分类':index===3?'购物车':'个人'}}</span>
              </div>
              <img :src="module_menu_img[2]" id="menu_img_upload2" style="width:40px;height:40px;position:absolute;top:-15px;left:103px;">
            </div>
          </div>
        </div>
      </div>
      <div class="preview_btn">
        <button class="public_btn btn_preview" @click="preview_app_home" data-toggle="modal" data-target="#myModal" data-backdrop="true">预览首页</button>
        <button class="public_btn btn_save" @click="set_home_confirm">发布设置</button>
      </div>

      <!-- 功能导航模块编辑 -->
      <div style="position:relative;">
        <div class="triangle_topright" v-if="module_click_toggle!==''"></div>
        <div class="triangle_topright1" v-if="module_click_toggle!==''"></div>
        <div class="edit_navigation_info" v-show="help_show===0">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.主页最多依序展示9个模块，更多模块则收入更多；<br>2.拖动模块可以调整位置；<br>3.模块名最多四个字；<br>4.icon规范：尺寸：60x60px，大小：小于300kb，格式：jpg、jpeg、png、gif<br>5.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序、<img src="../../../../../static/images/businessManage/icon-隐藏.png">该图标为已设置隐藏程序
          </div>
        <div class="set_navigation" v-if="module_click_toggle==='navigation'">
          <div class="edit_navigation">功能导航模块编辑
            <div class="set_navigation_help" @mouseover="help_show=0" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">

            <draggable v-model="set_home_info[0].pics" :move="getdata" @update="datadragEnd">
              <transition-group>
                <div class="module_navigation" v-for="(cell,index) in set_home_info[0].pics"  :key="index" style="display:inline-block;position:relative" :id="'module_parent'+index">
                  <div v-if="Number(index) < Number(set_home_info[0].pics.length)">
                    <el-tooltip placement="top"  v-if="Number(set_home_info[0].pics[index].effectStrategy)===1&&new Date(set_home_info[0].pics[index].effectTime).getTime()>new Date().getTime()">
                      <div slot="content" style="text-align:center;">定时生效时间<br/>{{Number(set_home_info[0].pics[index].effectStrategy)===1?set_home_info[0].pics[index].effectTime:''}}</div>
                      <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;top:4px;left:33px;">
                    </el-tooltip>
                    <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:4px;left:31px;" v-if="set_home_info[0].pics[index].beHide==='Y'">
                  </div>
                  <div>
                    <div>
                      <input type="file" :id="'m52sp_img_tk_input'+index" style="display:none" @change="upload_img">
                      <img :src="module_nav_img[index]?module_nav_img[index]:false" width="50" height="50" :id="'m52sp_img_tk'+index">
                      <div class="module_navigation_name" >{{module_nav_name[index]?module_nav_name[index]:'模块名'}}</div>
                      <button class="module_navigation_edit" @click="banner_edit('navigation',cell,index)">编辑</button>
                    </div>
                    <br>
                  </div>
                  <span v-if="index>4" @click="click_delete_navigation(index)" style="color:#777777;cursor:pointer;width:50px;position:absolute;bottom:-30px;left:15px;font-size:12px;">删除本条</span>
                </div>
              </transition-group>
            </draggable>

            <div class="module_navigation" style="display:inline-block;position:relative;border:none;">
              <div class="add_button" @click="add_new_nav">
                <div class="public_icon_top"></div>
                <div class="public_icon_left"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="set_navigation_btn" v-if="module_click_toggle==='navigation'">
        <button class="public_btn btn_confirm">确认</button>
        <button class="public_btn btn_cancel" @click="module_click_toggle=''">取消</button>
      </div> -->

      <!-- 推广位管理模块编辑(四图推荐模块) -->
      <div style="position:relative;">
        <div class="edit_navigation_info" v-if="help_show===1" style="top:105px;left:955px;">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.最多可4个，最少2个<br>2.icon规范：尺寸：344x190px，大小：小于300kb，格式：jpg、jpeg、png、gif<br>3.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。<br>4.如果都设置定时生效，则该模块自动隐藏
          </div>
        <div class="set_navigation" v-if="module_click_toggle==='recommend'">
          <div class="edit_navigation">四图推荐模块
            <div class="show_on_off" @click="set_home_info[1].moduleOnOff==='ON'?set_home_info[1].moduleOnOff='OFF':set_home_info[1].moduleOnOff='ON'">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[1].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[1].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" style="left:135px;" @mouseover="help_show=1" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_four"  v-for="(cell,index) in set_home_info[1].pics" style="display:inline-block;position:relative" :id="'module_parent1'+index" :key="index" module=true>
              <el-tooltip placement="top" v-if="index>module_recommend_number-1?false:Number(set_home_info[1].pics[index].effectStrategy)===1&&new Date(set_home_info[1].pics[index].effectTime).getTime()>new Date().getTime()">
                <div slot="content" style="text-align:center;">定时生效时间<br/>{{set_home_info[1].pics[index].effectTime}}</div>
                  <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:60px;bottom:-25px;">
              </el-tooltip>
              <div>
                <img :src="module_recommend_img[index]?module_recommend_img[index]:''" width="180" height="100" :id="'module_recommend'+index">
                <button @click="banner_edit('recommend',module_recommend_number[index],index)">编辑</button>
              </div>
              <br>
              <div @click="click_delete_list(index)" style="cursor:pointer;text-align:right;color:#777777;font-size:12px;position:absolute;right:5px;" v-if="(index+1)%2==0">删除本列</div>
            </div>
            <button class="edit_navigation_button" @click="add_navigation">新增推广(最多4个)</button>
          </div>
        </div>
      </div>

      <!-- 专题广告管理模块编辑 -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:122px;" v-if="help_show===2">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.最多可4个<br>2.icon规范：尺寸：710x292px，大小：小于300kb，格式：jpg、jpeg、png、gif<br>3.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。
          </div>
        <div class="set_navigation" v-if="module_click_toggle==='select'">
          <div class="edit_navigation">专题模块
            <div class="show_on_off" @click="set_home_info[2].moduleOnOff==='ON'?set_home_info[2].moduleOnOff='OFF':set_home_info[2].moduleOnOff='ON'" style="left:60px;">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[2].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[2].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" @mouseover="help_show=2" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_select" v-for="(cell,index) in set_home_info[2].pics" style="display:inline-block;position:relative" :id="'module_parent2'+index" :key="index" module=true>
              <el-tooltip placement="top" v-if="index>module_select_number-1?false:Number(set_home_info[2].pics[index].effectStrategy)===1&&new Date(set_home_info[2].pics[index].effectTime).getTime()>new Date().getTime()">
                <div slot="content" style="text-align:center;">定时生效时间<br/>{{set_home_info[2].pics[index].effectTime}}</div>
                <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:77px;bottom:7px;">
              </el-tooltip>
              <div>
                <img :src="module_select_img[index]?module_select_img[index]:''" width="240" height="110">
                <button @click="banner_edit('select',module_select_number[index],index)" class="edit_button">编辑</button>
                <button class="detele_button" @click="delete_select_click(index)">删除本条</button>
              </div>
              <br>
            </div>
            <div class="module_navigation_select"  style="display:inline-block;">
              <button class="edit_navigation_button" style="position:absulote;top:0px;left:0px;" @click="add_select_click" >新增专题(最多4个)</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品横向管理模块编辑（品质生活） -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:140px;left:970px;" v-if="help_show===3">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.最多新增9个商品，最少4个商品<br>2.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。
          </div>
        <div class="set_navigation" v-if="module_click_toggle==='life'">
          <div class="edit_navigation">商品横向展示模块
            <div class="show_on_off" @click="set_home_info[3].moduleOnOff==='ON'?set_home_info[3].moduleOnOff='OFF':set_home_info[3].moduleOnOff='ON'" style="left:105px;">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[3].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[3].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" style="left:150px;"  @mouseover="help_show=3" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_life" v-for="(cell,index) in set_home_info[3].pics" style="display:inline-block;position:relative;width:100px;height:166px;" :key="index" module=true>
              <div v-if="Number(index) < Number(set_home_info[3].pics.length)">
                <el-tooltip placement="top" v-if="index>module_life_number-1?false:Number(set_home_info[3].pics[index].effectStrategy)===1&&new Date(set_home_info[3].pics[index].effectTime).getTime()>new Date().getTime()">
                  <div slot="content" style="text-align:center;">定时生效时间<br/>{{index>module_life_number-1?'':set_home_info[3].pics[index].effectTime}}</div>
                    <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:5px;top:5px;">       
                </el-tooltip>
              </div>
              <div>
                <img :src="module_life_img[index]?module_life_img[index]:''" width="100px" height="99.2px"  @click="banner_edit('life',module_life_number[index],index)">
                <div class="module_navigation_des">{{module_life_name[index]?module_life_name[index]:''}}</div>
                <button style="font-size: 12px;" @click="delete_module_life(index)">删除</button>
              </div>
              <br>
            </div>
            <div class="module_navigation_life_add" style="display:inline-block;position:relative;top:-8px;left:-3.5px;width:100px;height:166px;" module=true>
              <div class="navigation_life_add" @click="add_module_life"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 三图推荐管理模块编辑 -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:105px;left:950px;" v-if="help_show===4">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.首个推荐图片icon规范：尺寸：344x400px，大小：小于300kb<br>2.其他推荐图片icon规范：尺寸：344x190px，大小：小于300kb<br>3.格式：jpg、jpeg、png、gif<br>4.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。
          </div>
        <div class="set_navigation" v-if="module_click_toggle==='show'">
          <div class="edit_navigation">三图推荐模块
            <div class="show_on_off" @click="set_home_info[4].moduleOnOff==='ON'?set_home_info[4].moduleOnOff='OFF':set_home_info[4].moduleOnOff='ON'" style="left:85px;">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[4].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[4].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" style="left:130px;"  @mouseover="help_show=4" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_four" v-for="(cell,index) in module_show_number" style="display:inline-block;position:relative" :id="'module_parent5'+index" :key="index" module=true>
              <el-tooltip placement="top" v-if="Number(set_home_info[4].pics[index].effectStrategy)===1&&new Date(set_home_info[4].pics[index].effectTime).getTime()>new Date().getTime()">
                <div slot="content" style="text-align:center;">定时生效时间<br/>{{set_home_info[4].pics[index].effectTime}}</div>
                  <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:77px;bottom:-25px;">
              </el-tooltip>
              <div>
                <img :src="module_show_img[index]?module_show_img[index]:''" width="180" height="100">
                <button @click="banner_edit('show',module_show_number[index],index)">编辑</button>
              </div>
              <br>
            </div>
          </div>
        </div>
      </div>

      <!-- 人气推荐管理模块编辑 -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:88px;left:928px;" v-if="help_show===5">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.最多新增20个，不配置则自动隐藏<br>2.banner推荐图片icon规范：尺寸：710x292px，大小：小于300kb<br>3.格式：jpg、jpeg、png、gif<br>4.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。<br>5.当设置商品超过3个时，客户端将展示banner
        </div>
        <div class="set_navigation" v-if="module_click_toggle==='popular'">
          <div class="edit_navigation">人气推荐
            <div class="show_on_off" @click="set_home_info[5].moduleOnOff==='ON'?set_home_info[5].moduleOnOff='OFF':set_home_info[5].moduleOnOff='ON'" style="left:60px;">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[5].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[5].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" style="left:108px;" @mouseover="help_show=5" @mouseout="help_show=-1"></div>
          </div>
          <div class="popular_banner">
            <p>新增banner</p>
            <div class="popular_banner_content">
              <input type="file" id="banner_img_popular" style="display:none" @change="upload_img" accept="image/jpg, image/jpeg, image/png, image/gif">
              <img width="230" height="100px" id="banner_popular" :src="set_home_info[5].moduleLogos[0].logoUrl?set_home_info[5].moduleLogos[0].logoUrl:false">
              <div style="width:200px;height:40px;font-size:12px;float:right;margin:10px">尺寸限制：710px*292px<br>格式：jpg、jpeg、png、gif <br>大小：300K以内</div>
              <button onclick="document.querySelector('#banner_img_popular').click()">点击上传</button>
            </div>
            <p>新增商品</p>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_life" v-for="(cell,index) in set_home_info[5].pics" style="display:inline-block;position:relative;width:100px;height:166px;" :key="index" module=true>
              <div v-if="Number(index) < Number(set_home_info[5].pics.length)">
                <el-tooltip placement="top" v-if="index>module_popular_number-1?false:Number(set_home_info[5].pics[index].effectStrategy)===1&&new Date(set_home_info[5].pics[index].effectTime).getTime()>new Date().getTime()">
                  <div slot="content" style="text-align:center;">定时生效时间<br/>{{index>module_popular_number-1?'':set_home_info[5].pics[index].effectTime}}</div>
                    <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:5px;top:5px;">       
                </el-tooltip>
              </div>
              <div>
                <img :src="module_popular_img[index]?module_popular_img[index]:''" width="100px" height="99.2px"  @click="banner_edit('popular',module_popular_number[index],index)">
                <div class="module_navigation_des">{{module_popular_name[index]?module_popular_name[index]:''}}</div>
                <button style="font-size: 12px;" @click="delete_popular_click(index)">删除</button>
              </div>
              <br>
            </div>
            <div class="module_add_select">
              <div class="module_add_select_button" @click="add_module_popular"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 单图推荐管理模块编辑 -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:105px;left:928px;" v-if="help_show===6">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.该广告位仅一个位置<br>2.icon规范：尺寸：710x292px，大小：小于300kb，格式：jpg、jpeg、png、gif<br>3.<img src="../../../../../static/images/businessManage/icon-倒计时.png">该图标为已设置定时程序。<br>
          </div>        
        <div class="set_navigation" v-if="module_click_toggle==='subject'">
          <div class="edit_navigation">单图推荐
            <div class="show_on_off" @click="set_home_info[6].moduleOnOff==='ON'?set_home_info[6].moduleOnOff='OFF':set_home_info[6].moduleOnOff='ON'" style="left:60px;">
              <img src="../../../../../static/images/businessManage/button-close.png" v-if="set_home_info[6].moduleOnOff==='OFF'">
              <img src="../../../../../static/images/businessManage/button-open.png" v-if="set_home_info[6].moduleOnOff==='ON'">
            </div>
            <div class="set_navigation_help" style="left:108px;" @mouseover="help_show=6"  @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="module_navigation_select" v-for="(cell,index) in module_subject_number" style="display:inline-block;position:relative" :id="'module_parent7'+index" :key="index" module=true>
              <el-tooltip placement="top" v-if="index>module_subject_number-1?false:Number(set_home_info[6].pics[index].effectStrategy)===1&&new Date(set_home_info[6].pics[index].effectTime).getTime()>new Date().getTime()">
                <div slot="content" style="text-align:center;">定时生效时间<br/>{{set_home_info[6].pics[index].effectTime}}</div>
                  <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;right:77px;bottom:7px;">
              </el-tooltip>
              <div>
                <img :src="module_subject_img[index]?module_subject_img[index]:''" width="238" height="110">
                <button @click="banner_edit('subject',module_subject_number[index],index)" class="edit_button">编辑</button>
              </div>
              <br>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部菜单模块编辑 -->
      <div style="position:relative;">
        <div class="edit_navigation_info" style="top:138px;left:890px;" v-if="help_show===7">
          <div class="triangle_topright_help"></div>
          <div class="triangle_topright_help1"></div>
          1.icon规范：尺寸：84x84px，大小：小于300kb，格式：jpg、jpeg、png、gif<br>2.建议区分选中和未选中图片效果
          </div>                
        <div class="set_navigation" v-if="module_click_toggle==='menu'">
          <div class="edit_navigation" style="margin-bottom:40px;">底部菜单栏
            <el-tooltip placement="top" v-if="new Date(menus_effectTime).getTime()>new Date().getTime()">
              <div slot="content" style="text-align:center;">定时生效时间<br/>{{menus_effectTime}}</div>
                <img src="../../../../../static/images/businessManage/icon-倒计时.png" style="position:absolute;top:-2px;left:200px;">
            </el-tooltip>
            <div @click="set_menu_time" style="position:absolute;bottom:32px;cursor:pointer;top:-2px;left:100px;width:85px;line-height:20px;height:20px;text-align:center;border-radius:2px;border:1px solid #BFC1CB;font-size:12px;color:#777777">设置定时生效</div>
            <!-- <div class="show_on_off" @click="set_home_info[7].moduleOnOff==='ON'?set_home_info[7].moduleOnOff='OFF':set_home_info[7].moduleOnOff='ON'" style="left:70px;">
              <img src="../../../../assets/images/businessManage/button-close.png" v-if="set_home_info[7].moduleOnOff==='OFF'">
              <img src="../../../../assets/images/businessManage/button-open.png" v-if="set_home_info[7].moduleOnOff==='ON'">
            </div> -->
            <div class="set_navigation_help" style="left:70px;" @mouseover="help_show=7" @mouseout="help_show=-1"></div>
          </div>
          <div class="edit_navigation_content">
            <div class="edit_navigation_content">
            <div style="font-size:12px;color:#777777;">选中状态</div>
            <div class="module_navigation" v-for="(cell,index) in module_menu_number"  :key="index" style="display:inline-block;position:relative;height:130px;margin-top:10px;" :id="'module_parent'+index">
              <div v-if="Number(index)===5" style="position:absolute;top:-28px;font-size:12px;color:#777777;">未选中状态</div>
              <div>
              </div>
              <div>
                <div>
                  <input type="file" :id="'menu_img_input'+index" style="display:none" @change="upload_img">
                  <img :id="'menu_img'+index" :src="module_menu_img[index]?module_menu_img[index]:''" width="50" height="50" style="top:15px;">
                  <div class="module_navigation_name" style="margin-top:70px;">{{index===0||index===5?'商城':index===1||index===6?'分类':index===2||index===7?'拍货':index===3||index===8?'购物车':'个人'}}</div>
                  <button class="module_navigation_edit" @click="menu_img_click('menu',index)" style="margin-top:5px;width:60px;padding:0px;">点击上传</button>
                </div>
                <br>
              </div>
            </div>
            
          </div>
          </div>
        </div>
      </div>
      <div class="set_navigation_btn" v-if="module_click_toggle!==''">
        <button class="public_btn btn_confirm" @click="set_client">确认</button>
        <button class="public_btn btn_cancel" @click="module_click_toggle=''">取消</button>
      </div>

      <!-- 选择商品界面 -->
      <el-dialog
        :custom-class='module_life?"dialog popular_goods":"dialog chose_goods"'
        :visible.sync="choose_show"
        :before-close="cancle_banner_edit">
          <div :class='["modal-dialog","frame",module_life?"module_life_style":""]'>
            <div class="frame_left" v-if="module_click_toggle!=='life' && module_click_toggle!=='popular'">
              <span>{{module_click_toggle==='navigation'?'图标上传':'图片上传'}}</span>
              <input type="file"  id="banner_img_input" style="display:none" v-if="upload_img_show" @change="upload_img" accept="image/jpg, image/jpeg, image/png, image/gif">
              <div class="img_banner" :style="module_click_toggle==='navigation'?'width:50px;height:50px;position:relative;':'width:90px;height:55px;position:relative;'">
                <i class="iconfont icon-icon_pic" style="font-size:55px;position:absolute;bottom:16px;" v-show="img_src===false"></i>
                <img :width="module_click_toggle==='navigation'?50:90" :height="module_click_toggle==='navigation'?50:55" id="banner_img" v-show="img_src!==false" :src="img_src">
              </div>
              <div class="banner_img_tips" v-if="module_click_toggle==='navigation'">尺寸限制60x60px 300K以内，格式：jpg、jpeg、png、gif</div>
              <div class="banner_img_tips" v-if="module_click_toggle==='recommend'">尺寸限制344x190px 300K以内，格式：jpg、jpeg、png、gif</div>
              <div class="banner_img_tips" v-if="module_click_toggle==='select'">尺寸限制710x292px 300K以内，格式：jpg、jpeg、png、gif</div>
              <!-- <div class="banner_img_tips" v-if="module_click_toggle==='life'">尺寸限制355x166px 300K以内，格式：jpg、jpeg、png、gif</div> -->
              <div class="banner_img_tips" v-if="module_click_toggle==='show'">尺寸限制344x400px 300K以内，格式：jpg、jpeg、png、gif</div>
              <!-- <div class="banner_img_tips" v-if="module_click_toggle==='popular'">尺寸限制355x146px 300K以内，格式：jpg、jpeg、png、gif</div> -->
              <div class="banner_img_tips" v-if="module_click_toggle==='subject'">尺寸限制710x292px 300K以内，格式：jpg、jpeg、png、gif</div>
              <button class="banner_upload_btn" onclick="document.querySelector('#banner_img_input').click()">点击上传</button>
              <span  v-if="module_click_toggle==='navigation'">{{module_click_toggle==='navigation'?'模块名':''}}</span>
              <input class="banner_upload_name" placeholder="请输入模块名" maxlength="4" v-model="module_add_info.title" v-if="module_click_toggle==='navigation'">
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
              <div class="banner_chose" v-if="module_click_toggle==='navigation'">
                <label class="bz">
                  <input type="radio" value='GOODS_CATE' v-model="module_add_info.linkType">商品品类
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
              <div v-if="module_click_toggle==='navigation'&&Number(module_add_info.effectStrategy)===0">
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
                <div class="chose_goods_cate">
                  <div style="height:40px;background:#F5F5F5;font-size:12px;color:#777777;line-height:40px;text-align:center;margin-bottom:30px;">品类选择</div>
                  <div v-for="(menu1,index) in classification_chose_list" :key="index" style="margin-left:30px;font-size:12px;font-weight:500;">
                    <div class="menu_parent">
                      <label class="menu1_a">
                        <input class="menu1_a1" type="radio" :value="menu1.classifyId" v-model="module_add_info.goodsCateId" :classifyName="menu1.classifyName" :parentClassifyId="menu1.parentClassifyId" @click='chose_parent_classificatio'>
                        <span class="menu1_a2">{{menu1.classifyName}}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <!-- <div class="chose_goods_select">
                  <div style="height:40px;background:#F5F5F5;font-size:12px;color:#777777;line-height:40px;text-align:center;">客户端品类名称</div>
                  <div style="margin:30px;font-size:12px;font-weight:700;">{{module_add_info.goodsCate}}</div>
                </div> -->
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
                <div v-if="module_click_toggle==='life' || module_click_toggle==='popular'" @click="manage_yunfei_show=true" style="position:absolute;bottom:32px;cursor:pointer;left:180px;width:85px;line-height:20px;height:20px;text-align:center;border-radius:2px;border:1px solid #BFC1CB;font-size:12px;color:#777777">设置定时生效</div>
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
                <div class="search_tit" style="margin-left:304px;" v-if="module_add_info.linkType==='SHOP'">商家分类列表</div>
                <div class="clear" v-if="module_add_info.linkType!=='LINK' && module_add_info.linkType!=='GOODS_CATE'" style="position:relative;height:50px;">
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
                <div class="merchant fl" v-if="module_add_info.linkType==='GOODS'&&module_goods.length>0" v-for="(cell,index) in module_goods" :key="index" @click="banner_goods_clecked(module_goods[index])">
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
                <div class="merchant fl" v-if="module_add_info.linkType==='SHOP'&&module_shops.length>0" v-for="(cell,index) in module_shops" :key="index" @click="banner_goods_clecked(module_shops[index])">
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
                <button type="button" class="btn cancel" @click="module_edit_confirm">确认</button>
                <button type="button" class="btn reset" @click="click_reset">重置</button>
                <button type="button" class="btn save" @click="cancle_banner_edit">取消</button>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </el-dialog>
      

      <!-- 设置时间 -->
      <el-dialog
        custom-class="dialog set_time"
        :visible.sync="manage_yunfei_show">
        <div class="modal-dialog frame" style="position:absolute;left:0px;top:0px;width:500px;height:260px;">
          <div class="modal-header">
            <div class="modal-title text-center" style="text-align:center;line-height:40px;background:#F5F5F5;color:#777777;">
              生效操作
            </div>
          </div>
          <div class="modal-body" style="height:140px;border-bottom:1px solid #E5E5E5;">
            <div class="tool_bar">
              <div class="banner_chose" style="display:inline-block;margin:30px 30px 0px 100px">
                <label>
                  <input type="radio" value=0 v-model="module_add_info.effectStrategy">立即生效
                </label>
              </div>
              <div class="banner_chose" style="display:inline-block;">
                <label class="bz">
                  <input type="radio" value=1 v-model="module_add_info.effectStrategy">定时生效
                </label>
              </div>
              <el-date-picker
                v-show="parseInt(module_add_info.effectStrategy) === 1"
                v-model="module_add_info.effectTime"
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
      </el-dialog>


      <!--商品筛选品类弹框s-->
      <el-dialog
        custom-class="dialog goods_classify"
        :visible.sync="goods_classify_show">
        <div class="goods_category_layer">
          <div class="modal-dialog category_goodchoose">
            <div class="shop_choose_center">
              <div class="modal-header">
                <div class="modal-title text-center">
                  <span>品类选择</span>
                  <!-- <div class="guanb" data-dismiss="modal" aria-hidden="true" @click="goods_classify_show=false"></div> -->
                </div>
              </div>
              <div class="modal-body">
                <div class="menu">
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

      <!-- 预览 -->
      <el-dialog
        custom-class="dialog preview_home"
        :visible.sync="preview_app">
        <!-- <div class="modal fade" id="myModal" style="display:none;" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> -->
          <div class="modal-dialog" style="width:350px;">
            <div class="modal-content">
              <div class="preview_hang">
                <span>预览专区</span>
                <div class="preview_content_parent">
                  <div class="preview_content">
                    <div class="preview_top"></div>
                    <!-- 首页轮播 banner_number-->
                    <div class="preview_banner">
                      <img :src="banner_number?banner_number:''" style="width:234px;height:114px;"></img>
                      <button class="public_btn_add" path='/m/bannerManage' @click="goto" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;">新增/编辑</button>
                    </div>
                    <!-- 功能导航 -->
                    <div class="preview_nav">
                      <ul>
                        <li v-for="(cell,index) in set_home_info[0].pics" :key="index" v-if="Number(index) < Number(set_home_info[0].pics.length)?(set_home_info[0].pics[index].beHide==='N'&&(new Date(set_home_info[0].pics[index].effectTime).getTime()<new Date().getTime())):''">
                          <img :src="module_nav_img[index]?module_nav_img[index]:''" class="preview_nav_img" ></img>
                          <!-- <div class="preview_nav_des">{{module_nav_name[index]&&index!==9?module_nav_name[index]:'更多'}}</div> -->
                          <div class="preview_nav_des">{{module_nav_name[index]?module_nav_name[index]:'模块名'}}</div>
                        </li>
                      </ul>
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('navigation')">新增/编辑</button>
                    </div>
                    <div class="preview_public" v-show="set_home_info[1].moduleOnOff==='ON'"></div>
                    <!-- 推广位管理 -->
                    <div class="preview_recommend" :style="set_home_info[1].pics.length===4?'height:147px':'height:77px'" v-show="set_home_info[1].moduleOnOff==='ON'">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('recommend')">新增/编辑</button>
                      <div v-for="(cell,index) in set_home_info[1].pics" :key="index">
                        <img :src="module_recommend_img[index]?module_recommend_img[index]:''" class="preview_recommend_content" style="margin-top:7px;"></img>
                      </div>
                    </div>
                    <div class="preview_public" v-if="set_home_info[2].pics.length>0" v-show="set_home_info[2].moduleOnOff==='ON'"></div>
                    <!-- 专题广告 -->
                    <div class="preview_select" v-if="set_home_info[2].pics.length>0" v-show="set_home_info[2].moduleOnOff==='ON'">
                      精选专题
                      <img src="../../../../../static/images/businessManage/icon-隐藏.png" style="position:absolute;top:8px;right:31px;" v-if="set_home_info[2].pics.length===0">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('select')">新增/编辑</button>
                      <div class="preview_select_content" v-for="(cell,index) in set_home_info[2].pics" :key="index" :style="index===module_select_img.length-1?'margin-bottom:0px;':''"> 
                        <img :src="module_select_img[index]?module_select_img[index]:''" class="preview_select_content"></img>
                      </div>
                    </div>
                    <div class="preview_public" v-show="set_home_info[3].moduleOnOff==='ON'"></div>
                    <!-- 商品横向管理 -->
                    <div class="preview_life" v-show="set_home_info[3].moduleOnOff==='ON'">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('life')">新增/编辑</button>
                      <p style="text-align:center">品质生活</p>
                      <div class="preview_life_content" v-for="(cell,index) in 3" :key="index">
                        <img :src="module_life_img[index]?module_life_img[index]:''" class="preview_life_content" style="width:76px;height:64px;margin-left: 0px;"></img>
                        <span class="goods_tag">标签</span>
                        <div class="goods_name">{{module_life_name[index]}}</div>
                        <div class="goods_description">{{module_life_goodsName2[index]}}</div>
                        <div class="goods_price">￥{{(module_life_goodsPrice[index]/100).toFixed(2)}}</div>
                      </div>
                    </div>
                    <div class="preview_public" v-show="set_home_info[4].moduleOnOff==='ON'"></div>
                    <!-- 三图推荐部分 -->
                    <div class="preview_show" v-show="set_home_info[4].moduleOnOff==='ON'">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('show')">新增/编辑</button>
                      <div class="preview_show_left">
                        <img :src="module_show_img[0]?module_show_img[0]:''" class="preview_show_left" style="margin:0px;">
                      </div>
                      <div class="preview_show_right">
                        <img :src="module_show_img[1]?module_show_img[1]:''" class="preview_show_right" style="margin:0px;">
                      </div>
                      <div class="preview_show_right">
                        <img :src="module_show_img[2]?module_show_img[2]:''" class="preview_show_right" style="margin:0px;">
                      </div>
                    </div>
                    <div class="preview_public" v-show="set_home_info[5].moduleOnOff==='ON'"></div>
                    <!-- 人气推荐 -->
                    <div class="preview_popular" v-show="set_home_info[5].moduleOnOff==='ON'">
                      <p style="text-align:center;margin:0px;">人气推荐</p>
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('popular')">新增/编辑</button>
                      <!-- <div class="preview_popular_br"></div> -->
                      <hr>
                      <div></div>
                      <div class="preview_popular_content">
                        <img :src="module_popular_img[0]?module_popular_img[0]:''">
                        <div class="goods_name goods_des_position">{{module_popular_name[0]}}</div>
                        <div class="goods_description goods_des_position">{{module_popular_goodsName2[0]}}</div>
                        <span class="goods_tag goods_des_position">标签</span>
                        <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[0]/100).toFixed(2)}}</div>
                      </div>
                      <div class="preview_popular_hr"></div>
                      <div class="preview_popular_content">
                        <img :src="module_popular_img[1]?module_popular_img[1]:''">
                        <div class="goods_name goods_des_position">{{module_popular_name[1]}}</div>
                        <div class="goods_description goods_des_position">{{module_popular_goodsName2[1]}}</div>
                        <span class="goods_tag goods_des_position">标签</span>
                        <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[1]/100).toFixed(2)}}</div>
                      </div>
                      <div class="preview_popular_hr"></div>
                      <div class="preview_popular_content">
                        <img :src="module_popular_img[2]?module_popular_img[2]:''">
                        <div class="goods_name goods_des_position">{{module_popular_name[2]}}</div>
                        <div class="goods_description goods_des_position">{{module_popular_goodsName2[2]}}</div>
                        <span class="goods_tag goods_des_position">标签</span>
                        <div class="goods_price goods_price_position">￥{{(module_popular_goodsPrice[2]/100).toFixed(2)}}</div>
                      </div>
                    </div>
                    <div class="preview_public" v-show="set_home_info[6].moduleOnOff==='ON'"></div>
                    <!-- 单图推荐 -->
                    <div class="preview_subject" v-show="set_home_info[6].moduleOnOff==='ON'">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('subject')">新增/编辑</button>
                      <div class="preview_subject_content">
                        <img :src="module_subject_img[0]?module_subject_img[0]:''" class="preview_subject_content" style="margin:0px;">
                      </div>
                    </div>
                    <!-- <div class="preview_public"></div> -->
                    <!-- 猜你喜欢 -->
                    <!-- <div class="preview_like">
                      <button class="public_btn_add" style="top:50%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('like')">新增/编辑</button>
                      <p>猜你喜欢</p>
                      <div class="preview_like_content"></div>
                      <div class="preview_like_content"></div>
                      <div class="preview_like_content"></div>
                      <div class="preview_like_content"></div>
                    </div> -->
                    <!-- 底部菜单 -->
                    <div class="preview_footer">
                      <button class="public_btn_add" style="top:40%;margin-top:-15px;left:50%;margin-left:-45px;z-index:3;" @click="preview_click('menu')">新增/编辑</button>
                      <div class="public_footer"  v-for="(cell,index) in 5" :key="index" :style="index===3?'margin-left:60px;':''" v-if="index!==2">
                        <!-- <div style="width:20px;height:20px;background:#ECECEC;"></div> -->
                        <img :src="module_menu_img[index]?module_menu_img[index]:''" :id="index!=2?'menu_img_upload'+index:''">
                        <span style="margin:0px;font-size:12px;">{{index===0?'商城':index===1?'分类':index===3?'购物车':'个人'}}</span>
                      </div>
                      <img :src="module_menu_img[2]" id="menu_img_upload2" style="width:40px;height:40px;position:absolute;top:-15px;left:103px;">
                    </div>
                  </div>
                </div>
                
              </div>
            </div><!-- /.modal-content -->
          </div><!-- /.modal -->
        <!-- </div> -->
      </el-dialog>

    </div>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { tool } from "../../../../utils/"
export default {
  name: '',
  components: {
　　draggable
  },
  data () {
    return {
      upload_img_show: false,
      // 上传图片携带参数
      imgGroup: { imgGroup: 5 , token: JSON.parse(sessionStorage.getItem('userInfo')).token },
      // 预览区域数据加载中...
      fullscreenLoading: false,
      // 预览
      preview_app: false,
      // 商品分类ID查询
      goodsClassifyId: '',
      // 时间设置
      manage_yunfei_show: false,
      // 控制图片是否改变标识
      picture_change: false,
      // banner列表
      banner_number: '',
      // 控制选择商品品类列表显示隐藏
      dealer_class_chose: false,
      // 控制帮助是否显示
      help_show: -1,
      // 功能导航模块数量
      module_number: '',
      // 控制分页参数是否显示
      pagination: {goods: false, shops: false},
      // 获取到的分类选择列表
      classification_chose_list: '',
      // 功能导航模块删除控制index
      module_number_index: '',
      // 四图推荐模块数量
      module_recommend_number: '',
      // 精选个专题模块数量
      module_select_number: '',
      // 商品横向展示模块数量
      module_life_number: '',
      // 商品横向展示模块数量
      module_life_goodsName: '',
      // 商品横向展示商品名
      module_life_goodsName2: [],
      // 商品横向展示商品价格
      module_life_goodsPrice: [],
      // 三图推荐模块数量
      module_show_number: 3,
      // 人气推荐模块数量
      module_popular_number: '',
      // 人气推荐商品名
      module_popular_goodsName2: [],
      // 人气推荐商品价格
      module_popular_goodsPrice: [],
      // 单图推荐模块数量
      module_subject_number: 1,
      // 底部菜单模块数量
      module_menu_number: 10,
      // 功能导航模块图片地址
      module_nav_img: [],
      // 四图推荐模块图片地址
      module_recommend_img: [],
      // 专题推荐模块图片地址
      module_select_img: [],
      // 商品横向展示图片地址
      module_life_img: [],
      // 三图推荐模块图片地址
      module_show_img: [],
      // 人气推荐模块图片地址
      module_popular_img: [],
      // 单图推荐模块图片地址
      module_subject_img: [],
      // 底部菜单模块图片地址
      module_menu_img: [],
      // 添加编辑参数
      add_modify_params: { gallery: '' },
      // 拖拽元素层级
      zIndex: 1,
      // 选择商品显示控制
      choose_show: false,
      // 控制商品横向展示新增模态框宽度
      module_life: false,
      // 商品品类选择
      goods_classify_show: false,
      // 商品模块数量
      module_goods: 1,
      // 功能导航模块名
      module_nav_name: [],
      // 商品横向展示商品名
      module_life_name: [],
      // 人气推荐商品名
      module_popular_name: [],
      // 店铺列表
      module_shops: 1,
      // 新增商品图片地址
      module_goods_img: [],
      // 新增店铺图片地址
      module_shops_img: [],
      // 商品搜索参数
      good_goodName: '',
      // 店铺搜索参数
      shop_shopName: '',
      // 新增修改图片模块参数
      module_add_info: {dealerId:'',logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''},
      // 选中店铺的参数
      choose_shops_checked_info: {dealerName: '', shopName: '', shopIcon: '', onSaleGoods: ''},
      // 控制选中商品是否显示
      choose_goods_checked: false,
      // 控制选中d店铺是否显示
      choose_shops_checked: false,
      // 选中商品的参数
      choose_goods_checked_info: {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''},
      // 功能导航点击
      module_click_toggle: '',
      // 功能导航模块显示隐藏
      // module_nav_show: '',
      goods_show: [],
      // 图片地址中转
      public_imgUrl: '',
      // 编辑的模块索引
      banner_edit_index: '',
      // 上传图片阈值
      upload_img_via: false,
      // 控制菜单图片宽高标识
      menu_width: false, 
      add_modify_toggle: '',
      // 新增翻页参数
      join_circle_params: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // 新增--店铺翻页参数
      join_circle_params_shop: {pageNo: '1', pageRows: '8', pageCount: '', pages: ''},
      // 首页设置保存参数
      set_home_info: [
        {
          moduleId: '1',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '功能导航',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '2',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '四图推荐',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '3',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '专题广告',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '4',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '品质生活',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '5',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '专题广告位',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '7',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '人气推荐',
          moduleOnOff: 'ON',
          pics: []
        },
        {
          moduleId: '8',
          moduleLogos: [{beHide: 'N', effectTime: '', logoUrl: '', moduleId: '', order: 0, title: ''}],
          moduleName: '专题广告位2',
          moduleOnOff: 'ON',
          pics: []
        }
      ],
      // 删除四图列index标识
      delete_list: '',
      // 删除专题广告index标识
      delete_select: '',
      // 删除商品横向展示(品质生活)
      delete_life: '',
      // 删除人气推荐index标识
      delete_popular: '',
      // 底部菜单点击标识
      menu_click: '',
      // 底部菜单点击索引
      menu_click_index: '',
      // 底部菜单图片改变标识
      gallery_change: {},
      // 底部菜单信息
      menus: '',
      // 记录底部菜单改变的ID
      menu_index: [],
      // 底部菜单时间
      menus_effectTime: '',
      // 控制图片显示
      img_src: false,
      // 店铺一级列表
      firstClassify_list: '',
      // 店铺二级列表
      secondClassify_list: '',
      // 店铺ID
      dealerClassify: '',
      // 分类名字参数
      dealerClassifyName: ''
    }
  },
  computed: {
    m_user_ID () {
      return this.$store.state.m_user_ID
    }
  },
  watch: {
  },
  methods: {
    goto (event) {
      let that = this
      let path = event.target.getAttribute('path')
      console.log(path)
      if (!path) return
      if (that.active_path === path) {
        $router.go(0)
        return
      }
      this.$router.push({path: path})
    },
    getdata (evt) {
      console.log(1)
    },
    datadragEnd (evt) {
      let that = this
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      that.module_nav_img = []
      that.module_nav_name = []
      console.log('拖动后数据', that.set_home_info[0].pics)
      that.set_home_info[0].pics.map(function (x) {
        that.module_nav_img.push(x.logoUrl)
      })
      that.set_home_info[0].pics.map(function (x) {
        that.module_nav_name.push(x.title)
      })
      for (let i = 0;i < that.set_home_info[0].pics.length;i++) {
        that.set_home_info[0].pics[i].order = i + 1
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 底部菜单点击
    menu_img_click (toggle,index) {
      this.menu_click_index = index
      this.menu_click = toggle
      document.querySelector('#menu_img_input' + index).click()
    },
    // 设置底部菜单定时
    set_menu_time () { 
      if (new Date(this.menus_effectTime).getTime()>new Date().getTime()) {
        this.module_add_info.effectStrategy = 1
      } else {
        this.module_add_info.effectStrategy = 0
      }
      this.module_add_info.effectTime = this.menus_effectTime
      this.manage_yunfei_show = true
    },
    // 菜单权限右边的加号按钮
    expand_menu_title (event) {
      let target = event.target
      console.log(1)
      let classifyId = target.getAttribute('classifyId')
      $(`[forMenuId="${classifyId}"]`).slideToggle(200)
    },
    // 品类选择保存
    set_classify () {
      let that = this
      if (that.goodsClassifyId==='') {
        that.$message({ type: "warning", message: "请选择商品品类" })
        return
      }
      that.get_goods_info()
      that.goods_classify_show = false
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
          this.$(`[forMenuId="${classifyId}"]`).slideDown(200)
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
          this.$(`[forMenuId="${parentClassifyId}"]`).slideDown(200)
        } else {
          parent.checked = false
        }
      }
    },
    // 功能导航新增
    add_new_nav () {
      let that = this
      console.log(that.set_home_info[0].pics.length)
      if (that.set_home_info[0].pics.length > 29) {
        that.$message({ type: "warning", message: "最多新增30个" })
        return
      }
      if (that.set_home_info[0].pics.length === 0) {
        that.set_home_info[0].pics.length+5
      } else {
        that.set_home_info[0].pics.length++
        that.banner_edit('navigation', '', that.set_home_info[0].pics.length-1)
        that.set_home_info[0].pics[that.set_home_info[0].pics.length-1] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      }
    },
    // 点击删除
    click_delete_navigation (index) {
      let that = this
      console.log('index', index)
      if (that.set_home_info[0].pics[index].beHide==='N' && new Date(that.set_home_info[0].pics[index].effectTime).getTime()<new Date().getTime()) {
        let arr = []
        for (let i = 0; i < that.set_home_info[0].pics.length; i++) {
          if (that.set_home_info[0].pics[i].beHide==='N') {
            if (Number(that.set_home_info[0].pics[i].effectStrategy)===0) {
              arr.push(that.set_home_info[0].pics[i].effectStrategy)
            } else if (Number(that.set_home_info[0].pics[i].effectStrategy)===1 && (new Date(that.set_home_info[0].pics[i].effectTime).getTime()<new Date().getTime())) {
              console.log('索引' + i + '时间' + that.module_add_info.effectTime)
              arr.push(that.set_home_info[0].pics[i].effectStrategy)
            }
          }
        }
        console.log('arr', arr)
        if (arr.length<6) {
          this.$message({ type: "warning", message: "删除失败，请检查模块数量是否可以排满5个" })
          return
        }
      }
      this.module_number_index = index
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.set_home_info[0].pics.splice(this.module_number_index, 1)
        // 导航模块名
        that.module_nav_name = []
        that.set_home_info[0].pics.map(function (x) {
          that.module_nav_name.push(x.title)
        })
        // 导航模块图片链接
        that.module_nav_img = []
        that.set_home_info[0].pics.map(function (x) {
          that.module_nav_img.push(x.logoUrl)
        })
      }).catch(() => {})
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
    // 预览首页
    preview_app_home () {
      this.preview_app = true
    },
    // 选择父分类右侧展示
    chose_parent_classificatio (event) {
      let that = this
      let target = event.target
      that.module_add_info.goodsCate = target.getAttribute('classifyName')
    },
    // 点击重置按钮
    click_reset () {
      // 新增初始化
      document.querySelector('#banner_img_input').value = ''
      // 清空商品、店铺搜索
      this.goodsClassifyId = ''
      this.good_goodName = ''
      this.shop_shopName = ''
      // 选中商品/店铺初始化话
      this.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
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
      let that = this
      this.upload_img_show = false
      this.choose_show = false
      that.upload_img_via = false
      if (that.add_modify_toggle === 'add' && that.module_click_toggle === 'navigation') {
        that.set_home_info[0].pics.length--
      } else if(that.add_modify_toggle === 'add' && that.module_click_toggle === 'recommend') {
        that.set_home_info[1].pics.length--
        that.set_home_info[1].pics.length--
      } else if(that.add_modify_toggle === 'add' && that.module_click_toggle === 'select') {
        that.set_home_info[2].pics.length--
      } else if(that.add_modify_toggle === 'add' && that.module_click_toggle === 'life') {
        that.set_home_info[3].pics.length--
      } else if(that.add_modify_toggle === 'add' && that.module_click_toggle === 'popular') {
        that.set_home_info[5].pics.length--
      }
      that.add_modify_toggle = ''
      that.picture_change = false
      
    },
    // 品质生活定时设置
    classification_parent_time () {
      if (parseInt(this.module_add_info.effectStrategy) === 1 && !this.module_add_info.effectTime) {
        this.$message({ type: "warning", message: "请设置具体生效时间" })
        return
      }
      if (parseInt(this.module_add_info.effectStrategy) === 0) {
        this.module_add_info.effectTime = this.tool.date.format(new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
      } else {
        this.module_add_info.effectTime =  this.tool.date.format(new Date(this.module_add_info.effectTime), 'yyyy-MM-dd')
      }
      if (this.module_click_toggle==='menu') {
        this.menus_effectTime = this.tool.date.format(new Date(this.module_add_info.effectTime), 'yyyy-MM-dd')
      }
      console.log(this.menus_effectTime)
      this.$message({ type: "success", message: "设置生效时间成功" })
      this.manage_yunfei_show = false
    },
    // 页面保存按钮
    set_client () {
      let that = this
      if (Object.values(that.gallery_change).filter(x => x === true).length > 0) {
        let keys = Object.keys(that.gallery_change)
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i]
          if (that.gallery_change[key] === false) continue
          let formData = new FormData()
          formData.append('img', document.querySelector('#' + key).files[0])
          formData.append('token', sessionStorage.getItem('access_token'))
          formData.append('imgGroup', 5)
          $.ajax({
            type: 'post',
            url: that.BASE_URL + 'm2c.support/img/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
              res = JSON.parse(res)
              if (res.errorMessage) {
                that.$message({ type: "error", message: '上传图库发生错误,错误信息:' + res.errorMessage })
                that.gallery_change[key] = true
                return
              }
              that.menus[that.menu_index[i]].logoUrl = res.content.url
              that.gallery_change[key] = false
            }
          })
        }
      }
      if (that.set_home_info[1].pics[1].logoUrl === '' || that.set_home_info[1].pics[3].logoUrl === '') {
        that.$message({ type: "warning", message: "有内容没有编辑完成，请完成编辑再保存" })
        return
      }
      that.$message({ type: "success", message: '页面保存成功' })
    },
    // 四图推荐新增
    add_navigation () {
      let that = this
      console.log('长度', that.set_home_info[1].pics.length)
      if (that.set_home_info[1].pics.length === 4) {
        this.$message({ type: "warning", message: '展示于客户端最多4个模块' })
        return
      }
      that.set_home_info[1].pics.length++
      console.log(that.set_home_info[1].pics)
      that.banner_edit('recommend', '', that.set_home_info[1].pics.length-1)
      that.set_home_info[1].pics.length++
      that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      that.set_home_info[1].pics[2] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      that.set_home_info[1].pics[3] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
    },
    // 删除四图导航列
    click_delete_list (index) {
      let that = this
      that.delete_list = index
      if (that.set_home_info[1].pics.length === 2) {
        this.$message({ type: "warning", message: '展示于客户端必须有2个或4个模块' })
        return
      }
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.set_home_info[1].pics.splice(this.delete_list, 1)
        that.set_home_info[1].pics.splice(this.delete_list -1, 1)
        that.module_recommend_img.splice(this.delete_list, 1)
        that.module_recommend_img.splice(this.delete_list -1, 1)
      }).catch(() => {})
    },
    // 专题广告新增
    add_select_click () {
      let that = this
      if (that.set_home_info[2].pics.length === 4) {
        this.$message({ type: "warning", message: '最多新增4个专题' })
        return
      }
      that.set_home_info[2].pics.length++
      console.log(that.set_home_info[2].pics)
      that.banner_edit('select', '', that.set_home_info[2].pics.length-1)
      that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      that.set_home_info[2].pics[that.set_home_info[2].pics.length-1] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
    },
    // 点击删除专题广告
    delete_select_click (index) {
      let that = this
      that.delete_select = index
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.set_home_info[2].pics.splice(that.delete_select, 1)
        that.module_select_img.splice(that.delete_select, 1)
      }).catch(() => {})
    },
    // 品质生活新增
    add_module_life () {
      let that = this
      if (that.set_home_info[3].pics.length === 9) {
        this.$message({ type: "warning", message: '最多新增9个商品' })
        return
      }
      that.set_home_info[3].pics.length++
      that.banner_edit('life', '', that.set_home_info[3].pics.length-1)
      that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      that.set_home_info[3].pics[that.set_home_info[3].pics.length-1] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
    },
    // 品质生活删除
    delete_module_life (index) {
      let that = this
      if (that.set_home_info[3].pics.length === 4) {
        this.$message({ type: "warning", message: '最少4个商品' })
        return
      }
      that.delete_life = index
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.set_home_info[3].pics.splice(that.delete_life, 1)
        that.module_life_img.splice(that.delete_life, 1)
        that.module_life_name.splice(that.delete_life, 1)
      }).catch(() => {})
    },
    // 人气推荐新增
    add_module_popular () {
      let that = this
      if (that.set_home_info[5].pics.length === 20) {
        this.$message({ type: "warning", message: '最多新增20个推荐' })
        return
      }
      that.set_home_info[5].pics.length++
      that.banner_edit('popular', '', that.set_home_info[5].pics.length-1)
      that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      that.set_home_info[5].pics[that.set_home_info[5].pics.length-1] = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
    },
    // 删除人气推荐
    delete_popular_click (index) {
      let that = this
      that.delete_popular = index
      this.$confirm('是否确认删除？', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        that.set_home_info[5].pics.splice(that.delete_popular, 1)
        that.module_popular_img.splice(that.delete_popular, 1)
        that.module_popular_name.splice(that.delete_popular, 1)
      }).catch(() => {})
    },
    // 用于生成uuid
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid () {
      return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
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
    // 编辑
    banner_edit (toggle, event, index) {
      let that = this
      // 初始化选中商品
      this.upload_img_show = true
      that.add_modify_toggle = ''
      that.choose_goods_checked = false
      that.choose_shops_checked = false
      that.banner_edit_index = index
      console.log('索引', that.banner_edit_index)
      that.choose_show = true
      // 清空商品、店铺搜索、页数
      that.join_circle_params_shop.pageNo = 1
      that.join_circle_params.pageNo = 1
      that.goodsClassifyId = ''
      that.good_goodName = ''
      that.shop_shopName = ''
      // if (that.module_click_toggle !== 'popular' && that.module_click_toggle !== 'life') {
      //   that.img_src = false
      //   document.querySelector('#banner_img_input').value = ''
      // }
      // 获取商品列表
      that.get_goods_info()
      // 获取分类详情
      that.get_class_info()
      // 获取店铺列表
      that.get_shops_info()
      // 获取店铺一级分类
      that.get_shops_firstClassify()
      // 编辑之前清空数据，防止不修改整体数据的话携带上一次编辑的数据过来
      that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      if (that.module_click_toggle === 'navigation') {
        if (that.set_home_info[0].pics[index]) { // 如果本模块存在则执行下面代码拿去性情 否则走else初始化编辑页面即清空编辑页面内容
          that.module_add_info = {...that.set_home_info[0].pics[index]}
          if (that.module_add_info.logoUrl!=='') {
            that.img_src = that.module_add_info.logoUrl
          }
        } else {
          console.log('新增导航')
          that.add_modify_toggle = 'add'
          if (that.module_add_info.logoUrl!=='') {
            that.img_src = that.module_add_info.logoUrl
          }
          that.img_src = false
          // document.querySelector('#banner_img').removeAttribute('src')
          that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
      } else if (that.module_click_toggle === 'recommend') {
        if (that.set_home_info[1].pics[index]) {
          that.module_add_info = {...that.set_home_info[1].pics[index]}
          that.img_src = that.module_add_info.logoUrl
          console.log('编辑详情', that.module_add_info)
        } else {
          console.log(555)
          that.add_modify_toggle = 'add'
          that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
      } else if (that.module_click_toggle === 'select') {
        if (that.set_home_info[2].pics[index]) {
          that.module_add_info = {...that.set_home_info[2].pics[index]}
          that.img_src = that.module_add_info.logoUrl
          console.log('编辑详情', that.module_add_info)
        } else {
          that.add_modify_toggle = 'add'
          that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
        
      } else if (that.module_click_toggle === 'life') {
        if (that.set_home_info[3].pics[index]) {
          that.module_add_info = {...that.set_home_info[3].pics[index]}
          console.log('编辑详情', that.module_add_info)
        } else {
          that.add_modify_toggle = 'add'
          that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
      } else if (that.module_click_toggle === 'show') {
        that.module_add_info = {...that.set_home_info[4].pics[index]}
        that.img_src = that.module_add_info.logoUrl
        console.log('编辑详情', that.module_add_info)
      } else if (that.module_click_toggle === 'popular') {
        if (that.set_home_info[5].pics[index]) {
          that.module_add_info = {...that.set_home_info[5].pics[index]}
          console.log('编辑详情', that.module_add_info)
        } else {
          that.add_modify_toggle = 'add'
          that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
        }
      } else if (that.module_click_toggle === 'subject') {
        if (that.set_home_info[6].pics[index]) {
          that.module_add_info = {...that.set_home_info[6].pics[index]}
          that.img_src = that.module_add_info.logoUrl
          console.log('编辑详情', that.module_add_info)
        }
      } else if (that.module_click_toggle === 'menu') {
        that.module_add_info = {...that.set_home_info[9].pics[index]}
        that.img_src = that.module_add_info.logoUrl
        console.log('编辑详情', that.module_add_info)
      }
      // 获取选中的商品详情
      if (that.module_add_info.linkType === 'GOODS' && that.module_add_info.goodsId) {
        that.choose_shops_checked = false
        this.api_businessManagePlatform_checkedGoods({ 
          data: {
            goodsId: that.module_add_info.goodsId
          }
        }).then(res => {
          that.choose_goods_checked_info.goodsName = res.content.goodsName
          that.choose_goods_checked_info.dealerName = res.content.dealerName
          that.choose_goods_checked_info.goodsPrice = res.content.goodsPrice / 100
          that.choose_goods_checked_info.goodsImageUrl = res.content.goodsImageUrl
          that.choose_goods_checked = true
        })
      } else if (that.module_add_info.linkType === 'SHOP' && that.module_add_info.shopId) { // 获取选中的店铺详情
        that.choose_goods_checked = false
        this.api_businessManagePlatform_checkedShop ({ 
          data: {
            dealerId: that.module_add_info.shopId
          }
        }).then(res => {
          that.choose_shops_checked_info = res.content
          that.choose_shops_checked = true
        })
      }
    },
    // 新增/编辑提交
    module_edit_confirm () {
      let that = this
      if (that.module_add_info.effectTime) {
        console.log(333333333333)
        that.module_add_info.effectTime = this.tool.date.format(that.module_add_info.effectTime, 'yyyy-MM-dd')
      }
      if (that.module_click_toggle === 'life') { // 商品横向展示（品质生活）
        that.set_home_info[3].pics[that.banner_edit_index] = that.module_add_info
        console.log('2222222', that.set_home_info[3].pics[that.banner_edit_index])
        that.choose_show = false
        return
      } else if (that.module_click_toggle === 'popular') { // 人气推荐
        that.set_home_info[5].pics[that.banner_edit_index] = that.module_add_info
        console.log('2222222', that.set_home_info[5].pics[that.banner_edit_index])
        that.choose_show = false
        return
      } else {
        if (that.add_modify_toggle === 'add') {
          if (!that.upload_img_via || that.img_src === false) {
            this.$message({ type: "warning", message: '图片未上传' })
            return
          }
        }
        let img = new Image()
        img.src = that.img_src
        console.log('宽', img.width, '高',img.height )
        if (that.module_click_toggle === 'navigation' && img.src && (img.width!==60 || img.height!==60)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        } else if (that.module_click_toggle === 'recommend' && img.src && (img.width!==344 || img.height!==190)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        } else if (that.module_click_toggle === 'select' && img.src && (img.width!==710 || img.height!==292)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        } else if (that.banner_edit_index !==0 && that.module_click_toggle === 'show' && img.src && (img.height!==190 || img.width!==344)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        } else if (that.banner_edit_index ===0 && that.module_click_toggle === 'show' && img.src && (img.height!==400 || img.width!==344)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        }  else if (that.module_click_toggle === 'subject' && img.src && (img.width!==710 || img.height!==292)) {
          this.$message({ type: "warning", message: '图片尺寸不符合，请重新上传' })
          return
        }
        if (that.module_click_toggle === 'navigation' && !that.module_add_info.title) {
          this.$message({ type: "warning", message: '请输入模块名' })
          return
        }
        if (!that.module_add_info.link && !that.module_add_info.goodsId && !that.module_add_info.shopId && !that.module_add_info.goodsCateId) {
          this.$message({ type: "warning", message: '跳转链接未设置' })
          return
        }
        if (Number(that.module_add_info.effectStrategy) === 1 && (new Date(that.module_add_info.effectTime).getTime() < new Date().getTime())) {
          this.$message({ type: "warning", message: '确认设置失败，当前模块已生效，请将生效时间改为“立即生效”' })
          return         
        }
        console.log('生效时间', that.module_add_info.effectTime)
        if (Number(that.module_add_info.effectStrategy) === 1 && !that.module_add_info.effectTime) {
          this.$message({ type: "warning", message: '未设置具体定时时间内容' })
          return
        }
        if (that.picture_change === true) {
          let formData = new FormData()
          formData.append('img', document.querySelector('#banner_img_input').files[0], document.querySelector('#banner_img_input').files[0].name)
          formData.append('token', JSON.parse(sessionStorage.getItem('userInfo')).token)
          formData.append('imgGroup', 5)
          $.ajax({
            type: 'post',
            url: that.BASE_URL + 'm2c.support/img/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
              res = JSON.parse(res)
              // document.querySelector('#m11yhgl_img').src = that.img_url
              // console.log('错误信息', res.errorMessage)
              if (res.errorMessage && res.errorMessage !== '' && res.errorMessage !== null) {
                that.show_tip(res.errorMessage)
                that.picture_change = true
                return
              }
              that.module_add_info.logoUrl = res.content.url
              that.upload_img_show = false
              // console.log('上传图片成功,返回结果是: ', res)
              // that.public_imgUrl = res.content.url
              if (that.module_click_toggle === 'navigation') { // 功能导航
                // 判断展示于页面的模块是否少于5个
                if (that.module_add_info.beHide==='Y' || (Number(that.module_add_info.effectStrategy)===1)) {
                  let arr = []
                  for (let i = 0; i < that.set_home_info[0].pics.length; i++) {
                    if (that.set_home_info[0].pics[i].beHide==='N' && i!==that.banner_edit_index) {
                      if (Number(that.set_home_info[0].pics[i].effectStrategy)===0) {
                        arr.push(that.set_home_info[0].pics[i].effectStrategy)
                      } else if (Number(that.set_home_info[0].pics[i].effectStrategy)===1 && (new Date(that.set_home_info[0].pics[i].effectTime).getTime()<new Date().getTime())) {
                        console.log('索引' + i + '时间' + that.module_add_info.effectTime)
                        arr.push(that.set_home_info[0].pics[i].effectStrategy)
                      }
                    }
                  }
                  console.log('arr', arr)
                  if (arr.length<5) {
                    that.show_tip(that.module_add_info.beHide==='Y'?'隐藏失败，请检查模块数量是否可以排满5个':'定时失败，请检查模块数量是否可以排满5个')
                    return
                  }
                }
                // 页面模块图片改变
                that.module_nav_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.module_nav_name[that.banner_edit_index] = that.module_add_info.title
                // 如果定时生效，默认不隐藏
                if (Number(that.module_add_info.effectStrategy)===1) {
                  that.module_add_info.beHide = 'N'
                } else if (Number(that.module_add_info.effectStrategy)===0) {
                  that.module_add_info.effectTime = that.tool.date.format(new Date(new Date().getTime()), 'yyyy-MM-dd')
                }
                that.set_home_info[0].pics[that.banner_edit_index] = that.module_add_info
                that.choose_show = false
              } else if (that.module_click_toggle === 'recommend') { // 四图推荐
                that.module_recommend_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.set_home_info[1].pics[that.banner_edit_index] = that.module_add_info
                if (that.banner_edit_index%2===0) {
                  that.set_home_info[1].pics[that.banner_edit_index+1].effectStrategy = that.set_home_info[1].pics[that.banner_edit_index].effectStrategy
                  that.set_home_info[1].pics[that.banner_edit_index+1].effectTime = that.set_home_info[1].pics[that.banner_edit_index].effectTime
                } else {
                  that.set_home_info[1].pics[that.banner_edit_index-1].effectStrategy = that.set_home_info[1].pics[that.banner_edit_index].effectStrategy
                  that.set_home_info[1].pics[that.banner_edit_index-1].effectTime = that.set_home_info[1].pics[that.banner_edit_index].effectTime
                }
                let arr = []
                for (let i = 0; i < that.set_home_info[1].pics.length; i++) {
                  if (Number(that.set_home_info[1].pics[i].effectStrategy) === 1 && (new Date(that.set_home_info[1].pics[i].effectTime).getTime()<new Date().getTime())) {
                    arr.push(that.set_home_info[1].pics[i].effectStrategy)
                  } else if (Number(that.set_home_info[1].pics[i].effectStrategy) === 0) {
                    arr.push(that.set_home_info[1].pics[i].effectStrategy)
                  }
                }
                console.log('arr', arr)
                if (arr.length === 0) {
                  that.set_home_info[1].moduleOnOff = 'OFF'
                } else {
                  that.set_home_info[1].moduleOnOff = 'ON'
                }
                that.choose_show = false
              } else if (that.module_click_toggle === 'select') { // 专题模块
                that.module_select_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.set_home_info[2].pics[that.banner_edit_index] = that.module_add_info
                that.choose_show = false
              } else if (that.module_click_toggle === 'show') { // 三图推荐模块
                that.module_show_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.set_home_info[4].pics[that.banner_edit_index] = that.module_add_info
                if (new Date(that.module_add_info.effectTime).getTime()>new Date().getTime() && Number(that.module_add_info.effectStrategy)=== 1) {
                  for(let i = 0; i < that.set_home_info[4].pics.length; i++) {
                    that.set_home_info[4].pics[i].effectStrategy = that.module_add_info.effectStrategy
                    that.set_home_info[4].pics[i].effectTime = that.module_add_info.effectTime
                  }
                  that.set_home_info[4].moduleOnOff = 'OFF'
                } else {
                  for(let i = 0; i < that.set_home_info[4].pics.length; i++) {
                    that.set_home_info[4].pics[i].effectStrategy = that.module_add_info.effectStrategy
                    that.set_home_info[4].pics[i].effectTime = that.module_add_info.effectTime
                  }
                  that.set_home_info[4].moduleOnOff = 'ON'
                }
                that.choose_show = false
              } else if (that.module_click_toggle === 'subject') { // 单图推荐模块
                that.module_subject_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.set_home_info[6].pics[that.banner_edit_index] = that.module_add_info
                if (new Date(that.module_add_info.effectTime).getTime()>new Date().getTime() && Number(that.module_add_info.effectStrategy)=== 1) {
                  that.set_home_info[6].moduleOnOff = 'OFF'
                } else {
                  that.set_home_info[6].moduleOnOff = 'ON'
                }
                that.choose_show = false
              } else if (that.module_click_toggle === 'menu') { // 单图推荐模块
                that.module_menu_img[that.banner_edit_index] = that.module_add_info.logoUrl
                that.set_home_info[7].pics[that.banner_edit_index] = that.module_add_info
                that.choose_show = false
              }
              that.picture_change = false
              that.add_modify_toggle = ''
              that.img_src = false
              // document.querySelector('#banner_img').removeAttribute('src')
            }
          })
        }
        else {
          if (that.module_click_toggle === 'navigation') { // 功能导航
            // 页面模块图片改变
            if (Number(that.module_add_info.effectStrategy)===1) {
              that.module_add_info.beHide = 'N'
            } else if (Number(that.module_add_info.effectStrategy)===0) {
              that.module_add_info.effectTime = that.tool.date.format(new Date(new Date().getTime()), 'yyyy-MM-dd')
            }
            // 判断展示于页面的模块是否少于5个
            if (that.module_add_info.beHide==='Y' || (Number(that.module_add_info.effectStrategy)===1)) {
              let arr = []
              for (let i = 0; i < that.set_home_info[0].pics.length; i++) {
                if (that.set_home_info[0].pics[i].beHide==='N' && i!==that.banner_edit_index) {
                  if (Number(that.set_home_info[0].pics[i].effectStrategy)===0) {
                    arr.push(that.set_home_info[0].pics[i].effectStrategy)
                  } else if (Number(that.set_home_info[0].pics[i].effectStrategy)===1 && (new Date(that.set_home_info[0].pics[i].effectTime).getTime()<new Date().getTime())) {
                    console.log('索引' + i + '时间' + that.module_add_info.effectTime)
                    arr.push(that.set_home_info[0].pics[i].effectStrategy)
                  }
                }
              }
              console.log('arr', arr)
              if (arr.length<5) {
                this.$message({ type: "warning", message: that.module_add_info.beHide==='Y'?'隐藏失败，请检查模块数量是否可以排满5个':'定时失败，请检查模块数量是否可以排满5个' })
                return
              }
            }
            that.set_home_info[0].pics[that.banner_edit_index] = that.module_add_info
            that.module_nav_img[that.banner_edit_index] = that.module_add_info.logoUrl
            that.module_nav_name[that.banner_edit_index] = that.module_add_info.title
            that.choose_show = false
          } else if (that.module_click_toggle === 'recommend') { // 四图推荐
            that.module_recommend_img[that.banner_edit_index] = that.module_add_info.logoUrl
            that.set_home_info[1].pics[that.banner_edit_index] = that.module_add_info
            if (that.banner_edit_index%2===0) {
              that.set_home_info[1].pics[that.banner_edit_index+1].effectStrategy = that.set_home_info[1].pics[that.banner_edit_index].effectStrategy
              that.set_home_info[1].pics[that.banner_edit_index+1].effectTime = that.set_home_info[1].pics[that.banner_edit_index].effectTime
            } else {
              that.set_home_info[1].pics[that.banner_edit_index-1].effectStrategy = that.set_home_info[1].pics[that.banner_edit_index].effectStrategy
              that.set_home_info[1].pics[that.banner_edit_index-1].effectTime = that.set_home_info[1].pics[that.banner_edit_index].effectTime
            }
            let arr = []
            for (let i = 0; i < that.set_home_info[1].pics.length; i++) {
              if (Number(that.set_home_info[1].pics[i].effectStrategy) === 1 && (new Date(that.set_home_info[1].pics[i].effectTime).getTime()<new Date().getTime())) {
                arr.push(that.set_home_info[1].pics[i].effectStrategy)
              } else if (Number(that.set_home_info[1].pics[i].effectStrategy) === 0) {
                arr.push(that.set_home_info[1].pics[i].effectStrategy)
              }
            }
            console.log('arr', arr)
            if (arr.length === 0) {
              that.set_home_info[1].moduleOnOff = 'OFF'
            } else {
              that.set_home_info[1].moduleOnOff = 'ON'
            }
            that.choose_show = false
          } else if (that.module_click_toggle === 'select') { // 专题模块
            that.module_select_img[that.banner_edit_index] = that.module_add_info.logoUrl
            that.set_home_info[2].pics[that.banner_edit_index] = that.module_add_info
            that.choose_show = false
          } else if (that.module_click_toggle === 'show') { // 三图推荐模块
            that.module_show_img[that.banner_edit_index] = that.module_add_info.logoUrl
            that.set_home_info[4].pics[that.banner_edit_index] = that.module_add_info
            if (new Date(that.module_add_info.effectTime).getTime()>new Date().getTime() && Number(that.module_add_info.effectStrategy)=== 1) {
              for(let i = 0; i < that.set_home_info[4].pics.length; i++) {
                that.set_home_info[4].pics[i].effectStrategy = that.module_add_info.effectStrategy
                that.set_home_info[4].pics[i].effectTime = that.module_add_info.effectTime
              }
              that.set_home_info[4].moduleOnOff = 'OFF'
            } else {
              for(let i = 0; i < that.set_home_info[4].pics.length; i++) {
                that.set_home_info[4].pics[i].effectStrategy = that.module_add_info.effectStrategy
                that.set_home_info[4].pics[i].effectTime = that.module_add_info.effectTime
              }
              that.set_home_info[4].moduleOnOff = 'ON'
            }
            that.choose_show = false
          } else if (that.module_click_toggle === 'subject') { // 单图推荐模块
            that.module_subject_img[that.banner_edit_index] = that.module_add_info.logoUrl
            that.set_home_info[6].pics[that.banner_edit_index] = that.module_add_info
            if (new Date(that.module_add_info.effectTime).getTime()>new Date().getTime() && Number(that.module_add_info.effectStrategy)=== 1) {
              that.set_home_info[6].moduleOnOff = 'OFF'
            } else {
              that.set_home_info[6].moduleOnOff = 'ON'
            }
            that.choose_show = false
          }
        }
        that.picture_change = false
        that.add_modify_toggle = ''
        that.img_src = false
        // that.module_add_info.logoUrl = ''
        // that.module_add_info = {logoUrl: '', title: '', linkType: 'GOODS', shopId: '', goodsId: '', link: '', effectStrategy: 0, effectTime: '', beHide: 'N', goodsCateId: '', goodsCate: ''}
      }
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
        that.choose_shops_checked_info = {dealerName:'', shopName: '', shopIcon: '', onSaleGoods: ''}
        that.choose_shops_checked = false
        console.log('获取到的商品信息', event)
        console.log('获取到的商品id', event.dealerId)
        if (that.module_click_toggle === 'life') {
          that.module_life_img[that.banner_edit_index] = that.choose_goods_checked_info.goodsImageUrl
          that.module_add_info.logoUrl = that.choose_goods_checked_info.goodsImageUrl
          that.module_life_name[that.banner_edit_index] = that.choose_goods_checked_info.goodsName
        }
        if (that.module_click_toggle === 'popular') {
          that.module_popular_img[that.banner_edit_index] = that.choose_goods_checked_info.goodsImageUrl
          that.module_add_info.logoUrl = that.choose_goods_checked_info.goodsImageUrl
          that.module_popular_name[that.banner_edit_index] = that.choose_goods_checked_info.goodsName
        }
      } else if (that.module_add_info.linkType === 'SHOP') {
        that.choose_shops_checked_info = {dealerName:'', shopName: '', shopIcon: '', onSaleGoods: ''}
        that.choose_shops_checked_info.dealerName = event.dealerName
        that.choose_shops_checked_info.shopName = event.shopName
        that.choose_shops_checked_info.shopIcon = event.shopIcon
        that.choose_shops_checked_info.onSaleGoods = event.onSaleGoods
        that.module_add_info.shopId = event.shopId
        that.module_add_info.dealerId = event.dealerId
        that.choose_shops_checked = true
        // 清空选中商品的参数
        that.choose_goods_checked_info = {goodsName: '', goodsImageUrl: '', dealerName: '', goodsPrice: ''}
        that.choose_goods_checked = false
      }
    },
    // 点击左侧展示遮罩层编辑显示右侧相应内容
    preview_click (toggle) {
      let that = this
      if (toggle!=='recommend' && (that.set_home_info[1].pics[1].logoUrl === '' || that.set_home_info[1].pics[3].logoUrl === '')) {
        that.$message({ type: "warning", message: "有内容没有编辑完成，请完成编辑再离开" })
        return
      }
      that.module_click_toggle = toggle
      if (toggle === 'life' || toggle === 'popular') {
        that.module_life = true
      } else {
        that.module_life = false
      }
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
      let that = this
      let target = event.target
      let objUrl = this.getObjectURL(target.files[0])
      let size = target.files[0].size
      if (size >= 1024 * 300) {
        that.$message({ type: "warning", message: "图片大小不符合" })
        return
      }
      console.log(that.module_click_toggle)
      if (that.module_click_toggle === 'menu') {
        console.log(that.$refs.upload_img_check.src)
        that.$refs.upload_img_check.src = objUrl
        setTimeout(() => {
          let img = new Image()
          img.src = this.$refs.upload_img_check.src
          console.log('宽', img.width, '高',img.height )
          if (img.src && (img.width!==84 || img.height!==84)) {
            that.$message({ type: "warning", message: "图片尺寸不符合，请重新上传" })
            return
          } else {
            that.gallery_change[target.getAttribute('id')] = true
            console.log(target.getAttribute('id'))
            that.menu_index.push(that.menu_click_index)
            document.querySelector('#menu_img' + that.menu_click_index).src = objUrl
            document.querySelector('#menu_img_upload' + that.menu_click_index).src = objUrl
          }
        }, 100)
      } else if (that.module_click_toggle === 'popular') {
        that.$refs.upload_img_check.src = objUrl
        setTimeout(() => {
          let img = new Image()
          img.src = that.$refs.upload_img_check.src
          console.log('宽', img.width, '高',img.height )
          if (img.src && (img.width!==710 || img.height!==292)) {
            that.$message({ type: "warning", message: "图片尺寸不符合，请重新上传" })
            return
          } else {
            document.querySelector('#banner_popular').src = objUrl
            let formData = new FormData()
            formData.append('img', document.querySelector('#banner_img_popular').files[0])
            formData.append('token', sessionStorage.getItem('access_token'))
            formData.append('imgGroup', 5)
            $.ajax({
              type: 'post',
              url: that.BASE_URL + 'm2c.support/img/upload',
              data: formData,
              processData: false,
              contentType: false,
              success: function (res) {
                res = JSON.parse(res)
                // document.querySelector('#m11yhgl_img').src = that.img_url
                if (res.errorMessage && res.errorMessage !== '' && res.errorMessage !== null) {
                  this.$message({ type: "warning", message: res.errorMessage })
                  that.picture_change = true
                  return
                }
                // console.log('上传图片成功,返回结果是: ', res)
                that.set_home_info[5].moduleLogos[0].logoUrl = res.content.url
                that.picture_change = false
              }
            })
          }
        }, 100)
      } else {
        if (objUrl) {
          that.img_src = objUrl
          that.picture_change = true
        }
      }
    },
    // 新增/修改上传图片处理
    add_modify_imgStep () {
      let that = this
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
        success: function (res) {
          res = JSON.parse(res)
          // document.querySelector('#m11yhgl_img').src = that.img_url
          if (res.errorMessage && res.errorMessage !== '' && res.errorMessage !== null) {
            that.$message({ type: "error", message: res.errorMessage })
            that.picture_change = true
            return
          }
          // console.log('上传图片成功,返回结果是: ', res)
          that.public_imgUrl = res.content.url
          that.picture_change = false
        }
      })
    },
    // 商城首页图文一键设置
    set_home_confirm () {
      let that = this
      if (that.set_home_info[1].pics[1].logoUrl === '' || that.set_home_info[1].pics[3].logoUrl === '') {
        that.$message({ type: "warning", message: "有内容没有编辑完成，请完成编辑再保存" })
        return
      }
      for (let i = 0;i < that.set_home_info[0].pics.length;i++) {
        that.set_home_info[0].pics[i].order = i + 1
      }
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/index/saveset.web',
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
        success: function (result) {
          if (result.status === 200) {
            that.$message ({
              type: 'success',
              message: '首页设置成功!'
            })
            that.get_home_info()
          }
        }
      })
      this.set_menu_info()
    },
    // 获取商品列表
    get_goods_info () {
      let that = this
      that.module_goods_img = []
      this.api_businessManagePlatform_goodsList ({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          pageNum: that.join_circle_params.pageNo,
          rows: 8,
          condition: that.good_goodName,
          goodsClassifyId: that.goodsClassifyId
        },
      }).then(res => {
        that.classification_chose_list = res.content
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
      })
    },
    // 获取分类详情
    get_class_info () {
      let that = this
      this.api_businessManagePlatform_goodsTree ({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          parentClassifyId: -1
        },
      }).then(res => {
        that.classification_chose_list = res.content
      })
    },
    // 获取店铺列表
    get_shops_info () {
      let that = this
      that.dealer_class_chose = false
      if (that.dealerClassifyName === '') {
        that.dealerClassify = ''
      }
      that.module_shops_img = []
      this.api_businessManagePlatform_getShop ({
        data: {
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          dealerName: that.shop_shopName,
          dealerClassify: that.dealerClassify,
          pageNum: that.join_circle_params_shop.pageNo,
          rows: 8
        },
      }).then(res => {
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
      })
    },
    // 商家一级分类列表
    get_shops_firstClassify () {
      let that = this
      this.api_businessManagePlatform_firstClassify ({
        data: {
        },
      }).then(res => {
        that.firstClassify_list = res.content
      })
    },
    // 查询展示的banner
    get_banner_show_info () {
      let that = this
      this.api_businessManagePlatform_getBannerShow ({
        data: JSON.stringify({
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName
        }),
      }).then(res => {
        that.banner_number = res.content[0].picUrl
      })
    },
    // 获取首页图文信息
    get_home_info () {
      let that = this
      that.module_nav_img = []
      that.module_recommend_img = []
      that.module_select_img = []
      that.module_life_name = []
      that.module_popular_name = []
      that.module_life_img = []
      that.module_show_img = []
      that.module_popular_img = []
      that.module_subject_img = []
      that.fullscreenLoading = true
      this.api_businessManagePlatform_getHome ({
        data: {
          systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
          userName: JSON.parse(sessionStorage.getItem('userInfo')).name
        }
      }).then(res => {
        that.fullscreenLoading = false
        console.log('商城首页', res)
        for (let i = 0; i < res.content.modules.length; i++) {
          if (Number(res.content.modules[i].moduleId) === 1) {
            that.set_home_info[0].pics = res.content.modules[i].picWords
            that.set_home_info[0].moduleOnOff = res.content.modules[i].onOff
            // 导航模块数量
            that.module_number = res.content.modules[i].picWords.length
            // 导航模块名
            res.content.modules[i].picWords.map(function (x) {
              that.module_nav_name.push(x.title)
            })
            // 导航模块图片链接
            res.content.modules[i].picWords.map(function (x) {
              that.module_nav_img.push(x.logoUrl)
            })
            // for (let i = 0;i < that.set_home_info[0].pics.length;i++) {
            //   that.set_home_info[0].pics[i].order = i + 1
            // }
            // console.log('查看排序', that.set_home_info[0].pics)
          } else if (Number(res.content.modules[i].moduleId) === 2) {
            that.set_home_info[1].pics = res.content.modules[i].picWords
            that.set_home_info[1].moduleOnOff = res.content.modules[i].onOff
            // 四图推荐块图片链接
            console.log('length', that.set_home_info[1].pics.length)
            that.module_recommend_number = res.content.modules[i].picWords.length
            console.log(res.content.modules[i].picWords)
            res.content.modules[i].picWords.map(function (x) {
              that.module_recommend_img.push(x.logoUrl)
            })
          } else if (Number(res.content.modules[i].moduleId) === 3) {
            that.set_home_info[2].pics = res.content.modules[i].picWords
            that.set_home_info[2].moduleOnOff = res.content.modules[i].onOff
            // 专题推荐模块数量
            that.module_select_number = res.content.modules[i].picWords.length
            // 专题推荐块图片链接
            console.log(res.content.modules[i].picWords)
            res.content.modules[i].picWords.map(function (x) {
              that.module_select_img.push(x.logoUrl)
            })
          } else if (Number(res.content.modules[i].moduleId) === 4) {
            that.set_home_info[3].pics = res.content.modules[i].picWords
            that.set_home_info[3].moduleOnOff = res.content.modules[i].onOff
            // 品质生活模块数量
            that.module_life_number = res.content.modules[i].picWords.length
            // 商品横向展示二级说明
            res.content.modules[i].picWords.map(function (x) {
              that.module_life_goodsName2.push(x.goodsName2)
            })
            // 商品横向展示商品价格
            res.content.modules[i].picWords.map(function (x) {
              that.module_life_goodsPrice.push(x.goodsPrice)
            })
            // 品质生活模块名
            res.content.modules[i].picWords.map(function (x) {
              that.module_life_name.push(x.goodsName)
            })
            // 商品横向展示图片链接
            console.log(res.content.modules[i].picWords)
            res.content.modules[i].picWords.map(function (x) {
              that.module_life_img.push(x.logoUrl)
            })
          } else if (Number(res.content.modules[i].moduleId) === 5) {
            that.set_home_info[4].pics = res.content.modules[i].picWords
            that.set_home_info[4].moduleOnOff = res.content.modules[i].onOff
            // 三图推荐模块图片地址
            res.content.modules[i].picWords.map(function (x) {
              that.module_show_img.push(x.logoUrl)
            })
          } else if (Number(res.content.modules[i].moduleId) === 7) {
            that.set_home_info[5].pics = res.content.modules[i].picWords
            that.set_home_info[5].moduleOnOff = res.content.modules[i].onOff
            // 人气推荐数量
            that.module_popular_number = res.content.modules[i].picWords.length
            // 人气推荐模块名
            res.content.modules[i].picWords.map(function (x) {
              that.module_popular_name.push(x.goodsName)
            })
            // 人气推荐二级说明
            res.content.modules[i].picWords.map(function (x) {
              that.module_popular_goodsName2.push(x.goodsName2)
            })
            // 人气推荐商品价格
            res.content.modules[i].picWords.map(function (x) {
              that.module_popular_goodsPrice.push(x.goodsPrice)
            })
            // 人气推荐模块图片地址
            that.set_home_info[5].moduleLogos[0].logoUrl = res.content.modules[i].moduleLogos[0].logoUrl
            console.log('人气推荐banner', res.content.modules[i].moduleLogos[0].logoUrl)
            res.content.modules[i].picWords.map(function (x) {
              that.module_popular_img.push(x.logoUrl)
            })
          } else if (Number(res.content.modules[i].moduleId) === 8) {
            that.set_home_info[6].pics = res.content.modules[i].picWords
            that.set_home_info[6].moduleOnOff = res.content.modules[i].onOff
            // 单图推荐模块图片地址
            res.content.modules[i].picWords.map(function (x) {
              that.module_subject_img.push(x.logoUrl)
            })
          }
        }
      })
    },
    // 获取菜单信息
    get_menu_info () {
      let that = this
      that.module_menu_img = []
      this.api_businessManagePlatform_getMenus ({
        data: JSON.stringify({
          systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
          userName: JSON.parse(sessionStorage.getItem('userInfo')).name
        }),
      }).then(res => {
        that.menus = res.content.menus
        that.menus_effectTime = res.content.effectTime
        // 底部菜单模块图片地址
        res.content.menus.map(function (x) {
          that.module_menu_img.push(x.logoUrl)
        })
      })
    },
    // 设置底部菜单
    set_menu_info () {
      let that = this
      $.ajax({
        type: 'post',
        url: that.BASE_URL + 'm2c.operate/index/setmenus.web',
        data: JSON.stringify({
          systemAccessToken: sessionStorage.getItem('access_token'),
          userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
          menus: that.menus,
          effectTime: that.menus_effectTime
        }),
        headers: {
          'access_token': sessionStorage.getItem('access_token')
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (result) {
          if (result.status === 200) {
            that.get_menu_info()
          }
        }
      })
    }
  },
  mounted () {
    this.get_banner_show_info()
    this.get_home_info()
    this.get_menu_info()
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../../static/css/main.businessManage.css";
.home_control {
  margin-top: 28px;
  // margin: 28px 50px 40px 20px;
  min-width: 1320px;
  // 预览吊起样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .preview_hang {
    float: left;
    width: 350px;
    height: 700px;
    background: rgba(230, 232, 242, 1);
    border: 1px solid #E5E5E5;
    overflow: hidden;
    position: absolute;
    top: 0px;
    left: 0px;
    span {
      font-size: 12px;
      color: #777777;
      line-height: 14px;
      display: block;
      margin: 26px 0px 30px 38px;
    }
    .preview_top {
      height: 47px;
      width: 250px;
      background: url('../../../../../static/images/businessManage/pic-appsucai.png');
    }
    .preview_content_parent {
      position: relative;
      top: 0px;
      width: 250px;
      // -moz-height: 589px;
      height: 589px;
      overflow: hidden;
      margin: auto;
    }
    .preview_content {
      position: relative; // left: 270px;
      // top: 0px;
      // overflow: hidden;
      max-height: 590px;
      -moz-height: 608px;
      // max-height:100%;
      overflow: auto; // text-align: center;
      margin: auto;
      width: 268px;
      background: #fff;
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
      }
      .preview_public {
        height: 7px;
        background: #ECECEC;
      }
      .preview_banner {
        height: 114px;
        // background: #ECECEC;
        margin: 0 8px;
        position: relative;
      }
      .preview_nav {
        position: relative;
        height: 120px; // margin-top: -10px;
        overflow: hidden;
        // padding-top: 10px;
        ul {
          list-style: none; // margin: 0px;
          height: 120px;
          padding-top: 10px;
          padding-left: 19px;
          li {
            padding-top: 32px;
            width: 25px;
            position: relative;
            margin-right: 21px;
            margin-bottom: 6px;
            float: left;
            .preview_nav_img {
              width: 25px;
              height: 25px;
              border-radius: 4px;
              position: absolute;
              top: 0px;
              left: 0px;
              // background: #ECECEC;
            }
            .preview_nav_des {
              // margin-top: 26px;
              width: 25px;
              height: 19px;
              overflow: hidden;
              font-size: 12px;
              color: #333333;
            }
          }
        }
      }
      .preview_recommend {
        // height: 146.7px;
        position: relative; // padding-left: 6.7px;
        .preview_recommend_content {
          float: left;
          margin-top: 4.7px;
          margin-left: 7px;
          width: 114.7px;
          height: 63.3px;
          background: #F2F1F1;
        }
      }
      .preview_select {
        width: 250px;
        // height: 243.3px;
        font-size: 12px;
        line-height: 28px;
        text-align: center;
        position: relative; // padding-top: 5.3px;
        padding-bottom: 7px;
        .preview_select_content {
          width: 236.7px;
          height: 96.7px;
          background: #F2F1F1;
          margin: auto;
          margin-bottom: 7px;
        }
      }
      // 品质生活样式
      .goods_tag {
        display: inline;
        padding: 0 5px;
        line-height: 15px;
        color: #FF7510;
        background:rgba(255,117,16,0.15);
        border-radius: 2px;
        margin: 0px 4px 0px 0px;
        margin-left: 5px;
      }
      .goods_name {
        font-size: 12px;
        line-height: 15px;
        height: 15px;
        overflow: hidden;
        color: #333333;
        padding-left: 5px;
      }
      .goods_description {
        line-height: 15px;
        height: 15px;
        overflow: hidden;
        color: #888888;
        padding-left: 5px;
      }
      .goods_price {
        padding-left: 15px;
        // margin-top: 5px;
        line-height: 15px;
        color: #FD3242;
      }
      .goods_price_position {
        position: absolute;
        bottom: 5px;
        right: 20px;
      }
      .goods_des_position {
        margin-left: 70px;
      }
      .preview_life {
        font-size: 12px;
        height: 190px;
        text-align: left;
        line-height: 28px;
        position: relative;
        p {
          margin: 0px;
        }
        .preview_life_content {
          border: 0.5px solid #F4F0F0;
          margin-left: 6.3px;
          float: left;
          width: 76.9px;
          height: 145px;
          font-size: 12px;
          // background: #F2F1F1;
        }
      }
      // 三图推荐
      .preview_show {
        height: 146.7px;
        position: relative;
        .preview_show_left {
          float: left;
          background: #F2F1F1;
          width: 120px;
          height: 134px;
          margin: 7px 6px 0px 6px;
        }
        .preview_show_right {
          float: left;
          background: #F2F1F1;
          width: 112px;
          height: 64px;
          margin-top: 7px;
        }
      }
      .preview_popular {
        font-size: 12px;
        line-height: 28px;
        text-align: left;
        height: 260px;
        position: relative;
        hr {
          margin: 0px;
          height: 0.5px;
          border-top: 0.5px solid #F5F5F5;
        }
        .preview_popular_content {
          height: 60px;
          // background: #F2F1F1;
          margin: 7.3px 6.4px;
          position: relative;
          img {
            width:60px;
            height:60px;
            margin:0px;
            position: absolute;
            left: 0px;
          }
        }
        .preview_popular_hr {
          width: 236.6px;
          border: 0.5px solid #F5F5F5;
        }
      }
      .preview_subject {
        // margin-top: -10px;
        // height:116px;
        position: relative;
        .preview_subject_content {
          width: 236.7px;
          height: 96px;
          margin: 10px 6px;
          background: #F2F1F1;
        }
      }
      .preview_like {
        font-size: 12px;
        height: 400px;
        text-align: center;
        line-height: 28px;
        overflow: hidden;
        position: relative;
        p {
          margin: 0;
        }
        .preview_like_content {
          float: left;
          width: 115px;
          height: 190px;
          background: #F2F1F1;
          margin-left: 6.4px;
          margin-bottom: 9.2px;
        }
      }
      // .preview_like:before {
      //   content: ""; // width: 0;
      //   // height: 100%;
      //   height: 400px;
      //   background: #6C83BC;
      //   position: absolute; // top: 46px;
      //   width: 250px;
      //   left: 0;
      //   z-index: 2;
      //   /* opacity: 0.5; */
      //   /* left: 50%; */
      //   opacity: 0;
      //   /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      // }
      // .preview_like:hover:before {
      //   width: 250px; // left: 0;
      //   // margin-left: -8px;
      //   opacity: 0.5;
      // }
      // .preview_like:hover button {
      //   display: block;
      // }
      .preview_footer {
        text-align: center;
        height: 44px;
        box-shadow: 0px -0.5px 4.5px 0.5px #B2B2B2;
        position: relative;
        .public_footer {
          margin-top: 5px;
          margin-left: 21px;
          float: left;
        }
        img {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        // background: yellow;
      }
    }
    .preview_content::-webkit-scrollbar {
      display: none
    }
    /*IE10,IE11,IE12*/
    .preview_content {
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
  .show_on_off {
    width: 34px;
    height: 17px;
    position: absolute;
    top: -2px;
    left: 85px;
    cursor: pointer;
  }
  // 预览样式
  .preview {
    float: left;
    width: 350px;
    height: 700px;
    background: rgba(230, 232, 242, 1);
    border: 1px solid #E5E5E5;
    overflow: hidden;
    span {
      font-size: 12px;
      color: #777777;
      line-height: 14px;
      display: block;
      margin: 26px 0px 30px 38px;
    }
    .preview_top {
      height: 47px;
      width: 250px;
      background: url('../../../../../static/images/businessManage/pic-appsucai.png');
    }
    .preview_content_parent {
      width: 250px;
      height: 589px;
      overflow: hidden;
      margin: auto;
    }
    .preview_content {
      position: relative; // left: 270px;
      // top: 0px;
      // overflow: hidden;
      -moz-height: 608px;
      height: 590px;
      // max-height:100%;
      overflow: auto; // text-align: center;
      margin: auto;
      width: 268px;
      background: #fff;
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
      }
      .preview_public {
        height: 7px;
        background: #ECECEC;
      }
      .preview_banner {
        height: 114px;
        // background: #ECECEC;
        margin: 0 8px;
        position: relative;
      }
      .preview_banner:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 114px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_banner:hover:before {
        width: 250px; // left: 0;
        margin-left: -8px;
        opacity: 0.5;
      }
      .preview_banner:hover button {
        display: block;
      }
      .preview_nav {
        position: relative;
        height: 120px; // margin-top: -10px;
        overflow: hidden;
        // padding-top: 10px;
        ul {
          list-style: none; // margin: 0px;
          height: 120px;
          padding-top: 10px;
          padding-left: 19px;
          li {
            padding-top: 32px;
            width: 25px;
            position: relative;
            margin-right: 21px;
            margin-bottom: 6px;
            float: left;
            .preview_nav_img {
              width: 25px;
              height: 25px;
              border-radius: 4px;
              position: absolute;
              top: 0px;
              left: 0px;
              // background: #ECECEC;
            }
            .preview_nav_des {
              // margin-top: 26px;
              width: 25px;
              height: 19px;
              overflow: hidden;
              font-size: 12px;
              color: #333333;
            }
          }
        }
      }
      .preview_nav:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 120px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_nav:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_nav:hover button {
        display: block;
      }
      .preview_recommend {
        // height: 146.7px;
        position: relative; // padding-left: 6.7px;
        .preview_recommend_content {
          float: left;
          margin-top: 4.7px;
          margin-left: 7px;
          width: 114.7px;
          height: 63.3px;
          background: #F2F1F1;
        }
      }
      .preview_recommend:before {
        content: ""; // width: 0;
        height: 100%;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_recommend:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_recommend:hover button {
        display: block;
      }
      .preview_select {
        width: 250px;
        // height: 243.3px;
        font-size: 12px;
        line-height: 28px;
        text-align: center;
        position: relative; // padding-top: 5.3px;
        padding-bottom: 7px;
        .preview_select_content {
          width: 236.7px;
          height: 96.7px;
          background: #F2F1F1;
          margin: auto;
          margin-bottom: 7px;
        }
      }
      .preview_select:before {
        content: ""; // width: 0;
        height: 100%;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_select:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_select:hover button {
        display: block;
      }
      // 品质生活样式
      .goods_tag {
        display: inline;
        padding: 0 5px;
        line-height: 15px;
        color: #FF7510;
        background:rgba(255,117,16,0.15);
        border-radius: 2px;
        margin: 0px 4px 0px 0px;
        margin-left: 5px;
      }
      .goods_name {
        font-size: 12px;
        line-height: 15px;
        height: 15px;
        overflow: hidden;
        color: #333333;
        padding-left: 5px;
      }
      .goods_description {
        line-height: 15px;
        height: 15px;
        overflow: hidden;
        color: #888888;
        padding-left: 5px;
      }
      .goods_price {
        padding-left: 15px;
        // margin-top: 5px;
        line-height: 15px;
        color: #FD3242;
      }
      .goods_price_position {
        position: absolute;
        bottom: 5px;
        right: 20px;
      }
      .goods_des_position {
        margin-left: 70px;
      }
      .preview_life {
        font-size: 12px;
        height: 190px;
        text-align: left;
        line-height: 28px;
        position: relative;
        p {
          margin: 0px;
        }
        .preview_life_content {
          border: 0.5px solid #F4F0F0;
          margin-left: 6.3px;
          float: left;
          width: 76.9px;
          height: 145px;
          font-size: 12px;
          // background: #F2F1F1;
        }
      }
      .preview_life:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 190px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_life:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_life:hover button {
        display: block;
      } // 三图推荐
      .preview_show {
        height: 146.7px;
        position: relative;
        .preview_show_left {
          float: left;
          background: #F2F1F1;
          width: 120px;
          height: 134px;
          margin: 7px 6px 0px 6px;
        }
        .preview_show_right {
          float: left;
          background: #F2F1F1;
          width: 112px;
          height: 64px;
          margin-top: 7px;
        }
      }
      .preview_show:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 146.7px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_show:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_show:hover button {
        display: block;
      }
      .preview_popular {
        font-size: 12px;
        line-height: 28px;
        text-align: left;
        height: 260px;
        position: relative;
        hr {
          margin: 0px;
          height: 0.5px;
          border-top: 0.5px solid #F5F5F5;
        }
        .preview_popular_content {
          height: 60px;
          // background: #F2F1F1;
          margin: 7.3px 6.4px;
          position: relative;
          img {
            width:60px;
            height:60px;
            margin:0px;
            position: absolute;
            left: 0px;
          }
        }
        .preview_popular_hr {
          width: 236.6px;
          border: 0.5px solid #F5F5F5;
        }
      }
      .preview_popular:before {
        content: ""; // width: 0;
        // height: 100%;
        height: 260px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_popular:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_popular:hover button {
        display: block;
      }
      .preview_subject {
        // margin-top: -10px;
        // height:116px;
        position: relative;
        .preview_subject_content {
          width: 236.7px;
          height: 96px;
          margin: 10px 6px;
          background: #F2F1F1;
        }
      }
      .preview_subject:before {
        content: ""; // width: 0;
        // height: 100%;
        margin-top: -10px;
        height: 116px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_subject:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_subject:hover button {
        display: block;
      }
      .preview_like {
        font-size: 12px;
        height: 400px;
        text-align: center;
        line-height: 28px;
        overflow: hidden;
        position: relative;
        p {
          margin: 0;
        }
        .preview_like_content {
          float: left;
          width: 115px;
          height: 190px;
          background: #F2F1F1;
          margin-left: 6.4px;
          margin-bottom: 9.2px;
        }
      }
      // .preview_like:before {
      //   content: ""; // width: 0;
      //   // height: 100%;
      //   height: 400px;
      //   background: #6C83BC;
      //   position: absolute; // top: 46px;
      //   width: 250px;
      //   left: 0;
      //   z-index: 2;
      //   /* opacity: 0.5; */
      //   /* left: 50%; */
      //   opacity: 0;
      //   /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      // }
      // .preview_like:hover:before {
      //   width: 250px; // left: 0;
      //   // margin-left: -8px;
      //   opacity: 0.5;
      // }
      // .preview_like:hover button {
      //   display: block;
      // }
      .preview_footer {
        text-align: center;
        height: 44px;
        box-shadow: 0px -0.5px 4.5px 0.5px #B2B2B2;
        position: relative;
        .public_footer {
          margin-top: 5px;
          margin-left: 21px;
          float: left;
        }
        img {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        // background: yellow;
      }
      .preview_footer:before {
        content: ""; // width: 0;
        // height: 100%;
        margin-top: -10px;
        height: 54px;
        background: #6C83BC;
        position: absolute; // top: 46px;
        width: 250px;
        left: 0;
        z-index: 2;
        /* opacity: 0.5; */
        /* left: 50%; */
        opacity: 0;
        /* transition: all 500ms cubic-bezier(0.47, 0, 0.745, 0.715) 0s; */
      }
      .preview_footer:hover:before {
        width: 250px; // left: 0;
        // margin-left: -8px;
        opacity: 0.5;
      }
      .preview_footer:hover button {
        display: block;
      }
    }
    .preview_content::-webkit-scrollbar {
      display: none
    }
    /*IE10,IE11,IE12*/
    .preview_content {
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
  } // 按钮公用样式
  .public_btn {
    width: 110px;
    height: 40px;
    border-radius: 2px;
    margin-left: 25px;
    color: #fff;
    border: none;
  }
  .triangle_topright {
      width: 0;
      height: 0;
      border-top: 12px solid #E5E5E5;
      border-left: 12px solid transparent;
      position: absolute;
      top: 0px;
      left: 533px;
    }
    .triangle_topright1 {
      width: 0;
      height: 0;
      border-top: 12px solid #fff;
      border-left: 12px solid transparent;
      position: absolute;
      top: 1px;
      left: 536px;
      z-index: 1;
    }
  .preview_btn {
    float: left;
    width: 170px;
    height: 700px;
    border: 1px solid #E5E5E5;
    background: #fff;
    .btn_preview {
      margin-top: 71px;
      background: #F5BD23;
    }
    .btn_save {
      margin-top: 20px;
      background: #11D2EB;
    }
  }
  .edit_navigation_info {
    padding:5px 12px;
    background:#EDF0F7;
    position: fixed;
    top: 87px;
    left: 925px;
    border-radius:4px;
    border:1px solid #BBD2F1;
    font-size:12px;
    color:#6C83BC;
    z-index: 10;
    .triangle_topright_help {
      width: 0;
      height: 0;
      border-bottom: 10px solid #BBD2F1;
      border-left: 10px solid transparent;
      position: absolute;
      bottom: -1px;
      left: -9px;
    }
    .triangle_topright_help1 {
      width: 0;
      height: 0;
      border-bottom: 10px solid #EDF0F7;
      border-left: 10px solid transparent;
      position: absolute;
      bottom: 0px;
      left: -7px;
      z-index: 2;
    }
  }
  .set_navigation {
    float: left;
    width: 550px;
    height: 700px;
    border: 1px solid #E5E5E5;
    margin-left: 20px;
    padding-left: 35px;
    background: #fff;
    position: relative;
    overflow: auto;
    p {
      color: #777777;
      font-size:12px;
    }
    .popular_banner {
      .popular_banner_content {
        position: relative;
        width:460px;
        height:100px;
        border: 1px solid #E5E5E5;
        margin-bottom: 24px;
        span {
          font-size: 12px;
          display: inline-block;
          width: 200px;
          height: 32px;
          color: #777777;
          margin-left: 15px;
        }
        button {
          position: absolute;
          top: 65px;
          right: 138px;
          width: 70px;
          height: 20px;
          border: 1px solid #0078E4;
          color: #0078E4;
          border-radius:2px; 
          font-size: 12px;
          background: #fff;
        }
      }
    }
    .module_add_select {
      display:inline-block;
      // border: 1px solid #E5E5E5;
      // position: relative;
      width:83px;
      height:150px;
      .module_add_select_button {
        cursor: pointer;
        // position: absolute;
        // top: 30px;
        width: 60px; 
        height: 60px; 
        background: #6C83BC url('../../../../../static/images/businessManage/icon-add.png') no-repeat center;
      }
    }
    .edit_navigation_button {
      width:230px;
      height:40px; 
      background: #6C83BC url('../../../../../static/images/businessManage/icon-add.png') no-repeat 40px;
      border:none;
      color: #fff;
      padding-left:30px;
    }
    .edit_navigation {
      font-size: 12px;
      color: #777777;
      margin: 24px 0px 30px 0px; // margin-top: 24px;
      position: relative;
      .set_navigation_help {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 1px;
        left: 105px;
        cursor: pointer;
        background: url('../../../../../static/images/businessManage/icon-intro.png') no-repeat;
      }
    }
    .module_navigation {
      width: 80px;
      height: 150px;
      border: 1px solid #E5E5E5;
      margin-right: 20px;
      margin-bottom: 40px;
      position: relative;
      text-align: center;
      .module_navigation_name {
        font-size: 12px;
        font-weight: 700;
        margin-top: 85px;
        // width: 50px;
        height: 20px;
        overflow: hidden;
        font-size: 12px;
        color: #333333;
        // padding-left: 26px;
      }
      .module_navigation_edit {
        width:50px;
        height:20px;
        border-radius: 4px;
        border: 1px solid #0078E4;
        color: #0078E4;
        background: #fff;
        font-size: 12px;
        margin-top: 10px;
      }
      img {
        position: absolute;
        top: 26.5px;
        left: 14px;
      }
    } // 功能导航新增按钮
    .add_button {
      width: 50px;
      height: 50px;
      background: #6C83BC;
      border: none;
      color: #fff;
      font-size: 12px;
      position: absolute;
      top: 37px;
      left: 50%; // margin-top: -25px;
      margin-left: -27px;
      display: inline-block;
      cursor: pointer; // top: 0px;
      // left: 0px;
      .public_icon_top {
        height: 20px;
        width: 1.5px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -0.75px;
        background: #fff;
      }
      .public_icon_left {
        height: 1.5px;
        width: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -0.75px;
        margin-left: -10px;
        background: #fff;
      }
    }
  }
  .set_navigation::-webkit-scrollbar {
    display: none
  }
    /*IE10,IE11,IE12*/
  .set_navigation {
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
  .set_navigation_btn {
    float: left;
    width: 170px;
    height: 700px;
    margin-left: -1px;
    border: 1px solid #E5E5E5;
    background: #fff;
    .btn_confirm {
      margin-top: 71px;
      background: #11D2EB;
    }
    .btn_cancel {
      margin-top: 20px;
      background: #B7C9E1;
    }
  } // 四图推荐内部样式
  .module_navigation_four {
    width: 180px;
    height: 150px;
    border: 1px solid #E5E5E5;
    margin-right: 76px;
    margin-bottom: 60px;
    button {
      width: 50px;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      outline: none;
      border: 1px solid #0078E4;
      color: #0078E4;
      background: #fff;
      margin-top: 16px;
      margin-left: 65px;
    }
  }
  .module_navigation_popular {
    display:inline-block;
    position:relative;
    width: 83px;
    height: 150px;
    border: 1px solid #E5E5E5;
    margin-right: 18px;
    margin-bottom: 30px;
    .edit_button {
      width: 50px;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      outline: none;
      border: 1px solid #0078E4;
      color: #0078E4;
      background: #fff;
      margin-top: 16px;
      margin-left: 10px;
    }
    .detele_button {
      width: 60px;
      height: 20px;
      border-radius: 4px;
      padding: 0px;
      font-size: 12px;
      outline: none;
      border: 1px solid #BFC1CB;
      color: #BFC1CB;
      background: #fff;
      margin-top: 16px;
      // margin-left: 65px;
    }
  }
  // 专题模块
  .module_navigation_select {
    width: 230px;
    height: 150px;
    // border: 1px solid #E5E5E5;
    margin-right: 22px;
    margin-bottom: 60px;
    .edit_button {
      width: 50px;
      height: 20px;
      border-radius: 4px;
      font-size: 12px;
      outline: none;
      border: 1px solid #0078E4;
      color: #0078E4;
      background: #fff;
      margin-top: 16px;
    }
    .detele_button {
      width: 60px;
      height: 20px;
      border-radius: 4px;
      padding: 0px;
      font-size: 12px;
      outline: none;
      border: 1px solid #BFC1CB;
      color: #BFC1CB;
      background: #fff;
      margin-top: 16px;
      margin-left: 10px;
      // margin-left: 65px;
    }
  }
  // 商品横向展示模块
  .module_navigation_life {
    width: 100px;
    height: 166px;
    border: 1px solid #E5E5E5;
    margin-right: 20.8px;
    margin-bottom: 10.2px;
    .module_navigation_des {
      text-align: center;
      margin: 10px 0px;
      // width: 86px;
      height: 18px;
      font-size: 12px;
      font-weight: 700;
      overflow: hidden;
    }
    button {
      width: 50px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #0078E4;
      color: #0078E4;
      background: #fff;
      margin-left: 25px;
    }
  }
  .module_navigation_life_add {
    border: none;
    cursor: pointer;
    // border: 1px solid #000;
  }
  // 商品横向展示新增按钮
  .navigation_life_add {
    // display: inline-block;
    // position: relative;
    width:100px;
    height:50px;
    background: #6C83BC url('../../../../../static/images/businessManage/icon-add.png') no-repeat 50% 50%;
    outline: none;
    border: none;
  }
  // 模态框设置
  .el-dialog__header {
    height: 0px;
    padding: 0;
  }
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
      height:45px;
      font-size:8px;
      font-family:PingFangSC-Regular;
      color:rgba(119,119,119,1);
      line-height:14px;
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
  .chose_goods_cate {
    float: left;
    width: 100%;
    height: 620px;
    border-right: 1px solid #E5E5E5;
  }
  .chose_goods_select {
    float: left;
    width: 396px;
    height: 620px;
  }
  .tc_shop {
    font-size: 12px;
    // width: 100%;
    height: 185px;
    border-bottom: 1px solid #E5E5E5;
    margin: 0px 24px;
    position: relative;
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
        width: 150px;
        margin: 0;
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
        margin-top: 3px;
        margin-left: 10px;
        margin-right: 5px;
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
      z-index: 1;
      top: -3px;
      right: -3px;
      width: 30px;
      height: 25px;
      background: rgba(216, 216, 216, 1);
      // font-size: 18px;
    }
    .modal-title {
      position: relative;
      // background: #fff;
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
      top: 0px;
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
        margin-top: 3px;
        margin-left: 10px;
        margin-right: 5px;
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
    height: 77px;
    border-top: 1px solid #E5E5E5;
    position: absolute;
    bottom: 0px;
    width: 100%;
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
      margin-top: 18px;
      background: rgba(17, 210, 235, 1);
    }
  }
  
  /*选择品类*/
  .category_layer, .goods_category_layer {
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
  .date_style {
    margin-left: 200px;
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
    top: 28px;
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
  // .modal-body{
  //   text-align:left;height:400px;overflow:auto !important;
    .menu {
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
  // }
}



// .4scsykz {
//   padding: 28px 50px 40px 20px;
// }
// .col-sm-8 a {line-height:30px;cursor:pointer}
.modal-open{
  .modal {height:100%}
  #add_modify,#forbid,#modify_group{display:flex}
  #add_modify.in,#forbid.in,#modify_group.in,#myModal.in,#nav_detele.in,#delete_list.in,#delete_select.in,#delete_life.in,#delete_popular.in{z-index:2000}
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
