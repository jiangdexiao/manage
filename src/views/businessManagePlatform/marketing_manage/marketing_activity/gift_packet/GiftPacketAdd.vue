<template>
  <div class="addnewgift_container">
    <el-col :span="24" class="">
      <el-form :inline="true" class="demo-form-inline">
        <!--1-->
        <div class="addnewcon">
          <el-form-item class="clear02">
            <span class="mr20 fl con01 mt7">
              <div class="tit">新人礼包<br>名称</div>
            </span>
            <el-input class="fl input360 mr20 mt7" v-model="giftPacketParams.name" placeholder="不超过11个字" :maxlength="22" @blur="formValidator(1)"></el-input>
            <el-button class="mr20" type="primary" size="small" @click="addZone()">+ 添加专区</el-button>
            <span class="mr20 yellowcolor mt7">最多添加3个专区</span>
          </el-form-item>
          <div class="add_Area" v-if="giftPacketParams.zoneList.length > 0">
            <div class="bordert" v-for="(zone, index) in giftPacketParams.zoneList">
              <div class="add_a_top borderl">
                <b class="mr10">新增专区{{index + 1}}</b>
                <el-tooltip placement="top-start" effect="light">
                  <div slot="content">
                    1、可由中文、英文、数字、个别符号组成；
                    <br/> 2、中文、数字、符号可输11个字符，英文可输22个字符。
                    <br/>
                  </div>
                  <i class="icon-intro02 mr10"></i>
                </el-tooltip>
                <el-input v-model="zone.zone_name" placeholder="请输入专区名称" class="mt0" style="width: initial;" :maxlength="22" @blur="blurCheckZoneName(zone.zone_name)"></el-input>
                <i class="ico_del iconfont fr" @click="deleteZone(index)"></i>
              </div>
              <div class="add_a_btn">
                <div class="bt">优惠券选择</div>
                <div @click="openCouponDialog(index, zone.coupon_id)">
                  <!--未选择优惠券的时候-->
                  <div class="icon_quan" v-if="zone.coupon_id == ''">
                    <div class="jiahao">+</div>
                    <div>选择优惠券</div>
                  </div>
                  <!--已选择优惠券的时候-->
                  <div class="clear02 mr10 coupon_box f-active" v-if="zone.coupon_id != ''">
                    <i class="icon_selected"></i>
                    <div class="coupon_box_left fl">
                      <div class="tit01" v-if="zone.coupon_form == 1">{{zone.coupon_value}}元</div>
                      <div class="tit01" v-if="zone.coupon_form == 2">{{zone.coupon_value}}折</div>
                      <div class="tit02">{{zone.threshold_content}}</div>
                    </div>
                    <div class="coupon_box_right fl">
                      <div class="tit01 mb10">{{zone.coupon_name}}</div>
                      <div class="tit02">{{zone.range_content}}</div>
                      <div class="tit03">{{zone.coupon_timeStart}} - {{zone.coupon_timeEnd}}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <!--未选择商品或者店铺的时候-->
                  <div class="bt mt10" v-if="zone.coupon_id == ''">作用范围</div>
                  <div class="goods" v-if="zone.coupon_id == ''">
                    还未选择优惠券
                  </div>
                  <!--有作用商品/店铺的时候-->
                  <div class="bt mt10" v-if="zone.coupon_id != '' && zone.range_type == 1">作用店铺</div>
                  <div class="bt mt10" v-if="zone.coupon_id != '' && zone.range_type != 1">作用商品</div>
                  <!-- 商品列表 -->
                  <div class="goods_box clear02" v-if="zone.coupon_id != ''">
                    <div v-if="(index == 0 && all_show_0 == true) || (index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true)">
                      <div v-for="(range, index1) in zone.range_list">
                        <el-tooltip v-if="zone.range_type != 1" :content="range.goodsName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                        <el-tooltip v-if="zone.range_type == 1 && range.shopName" :content="range.shopName" placement="top-start" effect="light">
                          <!--<div class="img fl mr10 mb10">-->
                            <!--<img :src="range.shopIcon"/>-->
                          <!--</div>-->
                          <el-tag type="info" class="fl mr10 mb10">
                            {{range.shopName.length > 15 ? range.shopName.substring(0,15).concat('...') : range.shopName}}
                          </el-tag>
                        </el-tooltip>
                      </div>
                    </div>
                    <div v-if="(index == 0 && all_show_0 == false) || (index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false)">
                      <div v-for="(range, index1) in zone.range_list" v-if="index1 < 10">
                        <el-tooltip v-if="zone.range_type != 1" :content="range.goodsName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                        <el-tooltip v-if="zone.range_type == 1 && range.shopName" :content="range.shopName" placement="top-start" effect="light">
                          <!--<div class="img fl mr10 mb10">-->
                            <!--<img :src="range.shopIcon"/>-->
                          <!--</div>-->
                          <el-tag type="info" class="fl mr10 mb10">
                            {{range.shopName.length > 15 ? range.shopName.substring(0,15).concat('...') : range.shopName}}
                          </el-tag>
                        </el-tooltip>
                      </div>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1 mr10" v-if="zone.range_list != null && zone.range_list.length > 10" @click="changeAllShow(index)">
                      <div v-if="(index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true) || (index == 0 && all_show_0 == true)">收起全部</div>
                      <div v-if="(index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true) || (index == 0 && all_show_0 == true)"><i class="icon_open02"></i></div>
                      <div v-if="(index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false) || (index == 0 && all_show_0 == false)">展开全部</div>
                      <div v-if="(index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false) || (index == 0 && all_show_0 == false)"><i class="icon_open"></i></div>
                    </div>
                    <div class="img02 fl poi1" v-if="zone.range_count > 30 && zone.range_type != 1">
                      <div>等 <span class="bluecolor02">{{zone.range_count}}</span> 件商品</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="addnewcon mt10">
	         	<div>
		         	<el-form-item class="clear02">
		         		<span class="mr10 fl con01 mt7">
		         			<span>作用用户</span>
                  <el-tooltip placement="top-start" effect="light">
                    <div slot="content">
                      1、【不限制】即为全平台用户可享受该新人礼包；
                      <br/> 2、【一周内】即为距离生成时间7天内的用户可以享受（一个月=30天，3个月=90天，半年=180天）；
                      <br/> 3、该礼包生效后注册，即为该新人礼包生效后注册的用 户可享受；
                      <br/> 4、礼包生效时间为：专区优惠券按最早生效的一张优惠 券的生效时间。
                      <br/>
                    </div>
		         			  <i class="icon-intro02"></i>
                  </el-tooltip>
		         		</span>
		         		<el-select placeholder="不限制注册时间" v-model="giftPacketParams.effective" clearable>
						      <el-option key="1" value="1" label="不限制"></el-option>
						      <el-option key="2" value="2" label="一周内"></el-option>
						      <el-option key="3" value="3" label="一个月内"></el-option>
						      <el-option key="4" value="4" label="三个月内"></el-option>
						      <el-option key="5" value="5" label="半年内"></el-option>
						    	<el-option key="6" value="6" label="该礼包生效后注册"></el-option>
						    </el-select>
		         	</el-form-item>
	         	</div>
	         	<el-form-item>
		         	<span class="mr30 fl con01 mt7">
		         		<div class="tit">是否需要<br/>领取</div>
		         	</span>
		         	<span>
                <el-radio v-model="giftPacketParams.receiveType" label="0">不需要</el-radio>
		         	 	<el-radio v-model="giftPacketParams.receiveType" label="1">需要</el-radio>
		         	</span>
		  			</el-form-item>
	        </div>
        <div class="addnewcon mt10 ">
          <el-form-item class="clear02 coupon_input">
            <span class="mr20 fl con01 mt7">
              活动须知（用“；”换行，换行后将会自动出现“1、2、3、”的分段序号，可以点击预览查看效果）
            </span>
            <el-input v-model="giftPacketParams.tip" class="fl giftextarea mt0 clear02 ml80" type="textarea" placeholder="用“；”换行，换行后将会自动出现“1、2、3、”的分段序号，可以点击预览查看效果。" :maxlength="300"></el-input>
          </el-form-item>
        </div>
        <div class="addnewcon mt10 mb100">
          <div>
            <el-form-item class="clear02">
              <span class="mr30 con01">
                个性编辑
              </span>
              <span>
                <el-radio v-model="giftPacketParams.personalEdit" label="1">跟随通用样式</el-radio>
                <el-radio v-model="giftPacketParams.personalEdit" label="2">需要单独设置</el-radio>
                <!--选择单独设置的时候，出现按钮-->
                <el-button v-if="giftPacketParams.personalEdit == '2'" class="ml20" @click="settingDialogVisible = true" type="primary" size="small">点击设置</el-button>
              </span>
            </el-form-item>
          </div>
          <div>
            <el-form-item>
              <span class="mr20 con01">
                其他规则
              </span>
              <span>
                不可与满减共同使用
              </span>
            </el-form-item>
          </div>
        </div>
        <div class="b_button">
          	<div class="marauto wid280">
          	<el-form-item>
    					<el-button type="primary" size="medium" class="mt0 fl mr7" @click="postfrom()">保存</el-button>
    					<el-button class="preview mt0 fl" @click="preview()">预览</el-button>
    					<el-button size="medium" class="mt0 fl" @click="back()">返回</el-button>
  					</el-form-item>
  					</div>
  				</div>
      </el-form>
    </el-col>
    <!--选择优惠券弹窗-->
    <el-dialog title="选择优惠券" :visible.sync="couponDialogVisible" width="930px" center>
      <div class="poi2 yellowcolor tit04">仅领方式为活动专用的有效优惠券</div>
      <div class="Choice_coupon">
        <div class="Choice_coupon_t">
          <div class="couponinput01 mr10 mt7">
            <el-input placeholder="请输入优惠券名称进行搜索" class="mt0 wid100" v-model="couponParmas.coupon_name"></el-input>
          </div>
          <div class="couponinput01 mr10 mt7">
            <el-input placeholder="请输入优惠券编号进行搜索" class="mt0 wid100" v-model="couponParmas.coupon_no"></el-input>
          </div>
          <el-button size="small" @click="selectCoupon()">查询</el-button>
        </div>
        <div class="Choice_coupon_b clear02" v-if="couponList.length === 0">
          <img style="margin-top:130px;margin-left:395px;" src="../../../../../../static/images/businessManage/icon_none.png" />
          <p style="margin-left:330px;margin-top:20px;color:#CCCCCC;">暂时还没有商品可供选择哦</p>
        </div>
        <div class="Choice_coupon_b clear02" v-if="couponList.length !== 0">
          <div class="fl mr10 coupon_box" :class="chooseCouponId === coupon.couponId ? 'f-active' : ''" v-for="(coupon,index) in couponList" @click="chooseCoupon(coupon)">
            <i class="icon_selected" v-if="chooseCouponId === coupon.couponId"></i>
            <div class="coupon_box_left fl">
              <div class="tit01">{{coupon.faceValue}}{{coupon.couponForm == 1 ? '元':'折'}}</div>
              <div class="tit02">{{coupon.content}}</div>
            </div>
            <div class="coupon_box_right fl">
              <div class="tit01">{{coupon.couponName}}</div>
              <div class="tit02">{{coupon.rangeContent}}</div>
              <div class="tit03">{{coupon.expirationTimeStart}} - {{coupon.expirationTimeEnd}}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="couponDialogVisible = false">确 定</el-button>
        <el-button @click="couponDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--单独设置弹窗-->
    <el-dialog title="单独设置样式" :visible.sync="settingDialogVisible" width="700px" center>
		  <div class="single_setcontaner">
		  	<div>
			  	<div class="mt10">
			  		<b>拍摄页弹框设置</b>
			  	</div>
			  	<div class="mt10 downloadbox clear02">
			  		<div class="download mr20 fl">
              <img :src="giftPacketParams.dialogPreImg" v-if="giftPacketParams.dialogPreImg != ''"/>
            </div>
			  		<div class="download_tit fl">
			  			<div class="">拍摄页弹框图</div>
			  			<div class="greycolor">尺寸限制630px*750px，PNG/JPG模式，600K以内</div>
			  			<div class=""><el-button size="small" @click="selectDialogImg()">替换图片</el-button></div>
              <input type="file" ref="dialogImg" multiple="multiple" style="display: none;" @change="handleDialogImgChange"/>
			  		</div>
			  	</div>
		  	</div>
		  	<div>
			  	<div class="mt10">
			  		<b class="mr10">新人礼包领取弹框图</b>
			  		<span class="yellowcolor">具体领取页面可点击【预览】按钮查看</span>
			  	</div>
			  	<div class="mt10 downloadbox clear02">
			  		<div class="download02 mr20 fl">
              <img :src="giftPacketParams.bannerPreImg" v-if="giftPacketParams.bannerPreImg != ''"/>
            </div>
			  		<div class="download_tit fl">
			  			<div class="">专区banner</div>
			  			<div class="greycolor">尺寸限制750px*400px，PNG/JPG模式，600K以内</div>
			  			<div class=""><el-button size="small" @click="selectBannerImg()">替换图片</el-button></div>
              <input type="file" ref="bannerImg" multiple="multiple" style="display: none;" @change="handleBannerImgChange"/>
			  		</div>
			  	</div>
		  	</div>
		  	<div>
		  		<div class="mt10 downloadbox clear02 mb10">
			  		<div class="download03 mr20 fl">
              <img :src="giftPacketParams.backgroundPreImg" v-if="giftPacketParams.backgroundPreImg != ''"/>
            </div>
			  		<div class="download_tit fl">
			  			<div class="">新人礼包页背景图</div>
			  			<div class="greycolor">尺寸限制750px*1380px，PNG/JPG模式，600K以内</div>
			  			<div class=""><el-button size="small" @click="selectBackgroundImg()">替换图片</el-button></div>
              <input type="file" ref="backgroundImg" multiple="multiple" style="display: none;" @change="handleBackgroundImgChange"/>
			  		</div>
			  	</div>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="postUpload()">保 存</el-button>
		    <el-button @click="cancelSetting()">取 消</el-button>
		  </span>
		</el-dialog>
		<!--预览弹框-->
		<el-dialog title="客户端预览" :visible.sync="previewDialogVisible" width="600px" center>
		  <div class="ClientPreview gradient-wrap">
		  	<div class="banner">
          <img v-if="giftPacketParams.bannerPreImg != ''" :src="giftPacketParams.bannerPreImg" />
		  		<img v-if="giftPacketParams.bannerPreImg == ''" src="../../../../../../static/images/businessManage/image_set.png" />
		  	</div>
        <div v-if="giftPacketParams.zoneList != null && giftPacketParams.zoneList.length > 0">
          <div class="content01" v-for="(zone, index) in giftPacketParams.zoneList">
            <div class="content_t">
              {{zone.zone_name}}
            </div>
            <div class="content_b clear02 mb10" v-if="zone.range_list != null && zone.range_list.length > 0">
              <div class="content_box fl mt10 ml10" v-for="(range, ri) in zone.range_list" v-if="ri < 4">
                <div class="img" v-if="zone.range_type != 1"><img :src="range.goodsImageUrl"/></div>
                <div class="wose02 tit" v-if="zone.range_type != 1">{{range.goodsName}}</div>
                <div class="img" v-if="zone.range_type == 1"><img :src="range.shopIcon"/></div>
                <div class="wose02 tit" v-if="zone.range_type == 1">{{range.shopName}}</div>
              </div>
              <span class="more bluecolor02" v-if="zone.range_list != null && zone.range_list.length > 4">查看更多 ></span>
            </div>
          </div>
        </div>
		  	<div class="content01">
		  		<div class="content_t">
		  			活动须知
		  		</div>
		  		<div class="content_b02 clear02">
            <div class="mb10" v-for="(rule, index) in ruleList">
              <span class="crl">{{index + 1}}.</span>
              <span>{{rule}}</span>
            </div>
		  		</div>
		  	</div>
		  </div>
		</el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        all_show_1: false,
        all_show_2: false,
        all_show_0: false,
        couponDialogVisible: false,
        settingDialogVisible: false,
        previewDialogVisible: false,
        dialogFlag: false,
        bannerFlag: false,
        backgroundFlag: false,
        couponParmas: {coupon_name: '', coupon_no: '', page_no: 1, page_size: 50},
        couponList: [],
        chooseCouponId: '',
        currentZoneIndex: '',
        ruleList: [],
        giftPacketParams: {
          packetId: '',
          name: '',
          effective: '',
          receiveType: '0',
          withOtherCut: '0',
          tip: '',
          personalEdit: '1',
          zoneList: [],
          dialogImg: '',
          bannerImg: '',
          backgroundImg: '',
          dialogPreImg: '',
          bannerPreImg: '',
          backgroundPreImg: ''
        }
      }
    },
    created: function () {
      let _this = this
      _this.giftPacketParams.packetId = _this.guid()
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
      // 新增一个专区
      addZone () {
        let _this = this
        if (_this.giftPacketParams.zoneList.length < 3) {
          // {zone_id: _this.guid(), zone_name: '', coupon_id: '', coupon_name: '', range_content: '', coupon_timeStart: '',
          // coupon_timeEnd: '', coupon_form: '', coupon_value: '', threshold_content: '', range_type: '', range_list: []}
          let flag = true
          for (let i = 0, size = _this.giftPacketParams.zoneList.length; i < size; i++) {
            let zone = _this.giftPacketParams.zoneList[i]
            if (zone.coupon_id === '' || zone.zone_name === '') {
              flag = false
            }
          }
          if (flag === false) {
            _this.warning('还有专区没有选择优惠券或者没有填写专区名称')
          } else {
            let zoneJosn = {}
            zoneJosn.zone_id = _this.guid()
            zoneJosn.coupon_id = ''
            zoneJosn.zone_name = ''
            _this.giftPacketParams.zoneList.push(zoneJosn)
          }
        } else {
          _this.warning('最多新增3个专区')
        }
      },
      // 删除一个专区
      deleteZone (index) {
        let _this = this
        if (confirm('确认要删除该专区，删除后刚刚编辑的内容不会保存?')) {
          _this.giftPacketParams.zoneList.splice(index, 1)
        }
      },
      // 打开优惠券选择弹框
      openCouponDialog (index, couponId) {
        let _this = this
        _this.chooseCouponId = couponId
        _this.currentZoneIndex = index
        _this.couponDialogVisible = true
        _this.couponParmas.coupon_name = ''
        _this.couponParmas.coupon_no = ''
        _this.couponParmas.page_no = 1
        _this.selectCoupon()
      },
      // 查询优惠券
      selectCoupon () {
        let _this = this
        _this.api_businessManagePlatform_activityCouponPage({
          data: _this.couponParmas
        }).then(result => {
          _this.couponList = result.content
        })
//        $.ajax({
//          method: 'get',
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          url: _this.BASE_URL + 'm2c.market/admin/coupon/activity/coupon/page',
//          data: _this.couponParmas,
//          success: function (res) {
//            if (res.status == 200) {
//              _this.couponList = res.content
//            }
//          }
//        })
      },
      // 选择优惠券
      chooseCoupon (coupon) {
        let _this = this
        _this.chooseCouponId = coupon.couponId
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_id = coupon.couponId
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_name = coupon.couponName
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].range_type = coupon.rangeType
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].range_content = coupon.rangeContent
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_form = coupon.couponForm
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_value = coupon.faceValue
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].threshold_content = coupon.content
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_timeStart = coupon.expirationTimeStart
        _this.giftPacketParams.zoneList[_this.currentZoneIndex].coupon_timeEnd = coupon.expirationTimeEnd
        _this.couponRangList(coupon.couponId)
      },
      changeAllShow (index) {
        let _this = this
        if (index === 1) {
          if (_this.all_show_1 === false) {
            _this.all_show_1 = true
          } else {
            _this.all_show_1 = false
          }
        }
        if (index === 2) {
          if (_this.all_show_2 === false) {
            _this.all_show_2 = true
          } else {
            _this.all_show_2 = false
          }
        }
        if (index === 0) {
          if (_this.all_show_0 === false) {
            _this.all_show_0 = true
          } else {
            _this.all_show_0 = false
          }
        }
      },
      // 选择弹框图片
      selectDialogImg () {
        let _this = this
        _this.$refs.dialogImg.click()
      },
      handleDialogImgChange (e) {
        let _this = this
        let dialogDOM = _this.$refs.dialogImg
        // 通过DOM取文件数据
        let file = dialogDOM.files[0]
        _this.dialogFlag = _this.beforeUpload(file, 'dialogImg')
        // 这里就可以获取到文件的url
        if (_this.dialogFlag !== false) {
          _this.giftPacketParams.dialogPreImg = _this.getFileUrl(file)
        }
      },
      // 选择banner图片
      selectBannerImg () {
        let _this = this
        _this.$refs.bannerImg.click()
      },
      handleBannerImgChange (e) {
        let _this = this
        let bannerDOM = _this.$refs.bannerImg
        // 通过DOM取文件数据
        let file = bannerDOM.files[0]
        _this.bannerFlag = _this.beforeUpload(file, 'bannerImg')
        // 这里就可以获取到文件的url
        if (_this.bannerFlag !== false) {
          _this.giftPacketParams.bannerPreImg = _this.getFileUrl(file)
        }
      },
      // 选择背景图片
      selectBackgroundImg () {
        let _this = this
        _this.$refs.backgroundImg.click()
      },
      handleBackgroundImgChange (e) {
        let _this = this
        let backgroundDOM = _this.$refs.backgroundImg
        // 通过DOM取文件数据
        let file = backgroundDOM.files[0]
        _this.backgroundFlag = _this.beforeUpload(file, 'backgroundImg')
        // 这里就可以获取到文件的url
        if (_this.backgroundFlag === true) {
          _this.giftPacketParams.backgroundPreImg = _this.getFileUrl(file)
        }
      },
      // 上传前验证
      beforeUpload (file, flag) {
        let _this = this
        let suffix = file.name.split('.')
        let size = Math.floor(file.size / 1024)
        if (suffix[1] !== 'jpg' && suffix[1] !== 'png') {
          _this.warning('上传图片只能是 jpg/png 格式!')
          return false
        }
        if (size > 600) {
          _this.warning('上传图片大小最大600K!')
          return false
        }
        if (flag === 'dialogImg') {
          let imgInfo = _this.getFileWidthAndHeight(file)
          if (imgInfo.width !== 630 || imgInfo.height !== 750) {
            _this.warning('上传图片尺寸限制为630x750!')
            return false
          }
        }
        if (flag === 'bannerImg') {
          let imgInfo = _this.getFileWidthAndHeight(file)
          if (imgInfo.width !== 750 || imgInfo.height !== 400) {
            _this.warning('上传图片尺寸限制为750x400!')
            return false
          }
        }
        if (flag === 'backgroundImg') {
          let imgInfo = _this.getFileWidthAndHeight(file)
          if (imgInfo.width !== 750 || imgInfo.height !== 1380) {
            _this.warning('上传图片尺寸限制为750x1380!')
            return false
          }
        }
        return true
      },
      // 文件上传
      uploadFile (file, flag) {
        let _this = this
        let formData = new FormData()
        formData.append('img', file)
        formData.append('imgGroup', 5)
        $.ajax({
          url: this.BASE_URL + 'm2c.support/img/upload',
          type: 'POST',
          data: formData,
          /**
           *必须false才会自动加上正确的Content-Type
           */
          contentType: false,
          /**
           * 必须false才会避开jQuery对 formdata 的默认处理
           * XMLHttpRequest会对 formdata 进行正确的处理
           */
          processData: false,
          success: function (result) {
            result = JSON.parse(result)
            if (result.status === 200) {
              if (flag === 'dialogImg') {
                _this.giftPacketParams.dialogImg = result.content.fileKey
              }
              if (flag === 'bannerImg') {
                _this.giftPacketParams.bannerImg = result.content.fileKey
              }
              if (flag === 'backgroundImg') {
                _this.giftPacketParams.backgroundImg = result.content.fileKey
              }
            }
          },
          error: function () {
            console.log('上传内容格式错误，请下载模板参照！')
            _this.$message.error('上传图片错误！')
          }
        })
      },
      // 确认个性设置
      postUpload () {
        let _this = this
        if (_this.dialogFlag !== false) {
          let dialogDOM = _this.$refs.dialogImg
          let file = dialogDOM.files[0]
          _this.uploadFile(file, 'dialogImg')
        }
        if (_this.bannerFlag !== false) {
          let bannerDOM = _this.$refs.bannerImg
          let file = bannerDOM.files[0]
          _this.uploadFile(file, 'bannerImg')
        }
        if (_this.backgroundFlag !== false) {
          let backgroundDOM = _this.$refs.backgroundImg
          let file = backgroundDOM.files[0]
          _this.uploadFile(file, 'backgroundImg')
        }
        _this.settingDialogVisible = false
      },
      // 取消个性设置
      cancelSetting () {
        let _this = this
        if (confirm('确定放弃编辑吗?该内容不会保存')) {
          _this.giftPacketParams.dialogImg = ''
          _this.giftPacketParams.bannerImg = ''
          _this.giftPacketParams.backgroundImg = ''
          _this.giftPacketParams.dialogPreImg = ''
          _this.giftPacketParams.bannerPreImg = ''
          _this.giftPacketParams.backgroundPreImg = ''
          _this.settingDialogVisible = false
        }
      },
      // 拼接专区列表参数
      makeZoneList () {
        let _this = this
        let list = []
        if (_this.giftPacketParams.zoneList.length > 0) {
          for (let i = 0, size = _this.giftPacketParams.zoneList.length; i < size; i++) {
            let zone = {}
            zone.zoneId = _this.giftPacketParams.zoneList[i].zone_id
            zone.zoneName = _this.giftPacketParams.zoneList[i].zone_name
            zone.couponId = _this.giftPacketParams.zoneList[i].coupon_id
            list.push(zone)
          }
        }
        return list
      },
      blurCheckZoneName (name) {
        let _this = this
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{1,22}$/.test(name)) {
          _this.warning('专区名称只能为汉字数字英文特殊字符,不能为空')
        }
        let realLength = _this.getStrLength(name)
        if (realLength > 11) {
          _this.warning('专区名称不能超过11个字')
        }
      },
      // 提交验证
      formValidator (flag) {
        let _this = this
        // flag--1:礼包名称
        if (flag == 0 || flag == 1) {
          if (!/^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{1,22}$/.test(_this.giftPacketParams.name)) {
            _this.warning('礼包名称只能为汉字数字英文特殊字符,不能为空')
            return false
          }
          let realLength = _this.getStrLength(_this.giftPacketParams.name)
          if (realLength > 11) {
            _this.warning('新人礼包名称不能超过11个字')
            return false
          }
        }
        if (flag == 0) {
          if (_this.giftPacketParams.zoneList.length == 0) {
            _this.warning('还没有添加专区，至少添加1个，至多3个')
            return false
          }
          for (let i = 0, size = _this.giftPacketParams.zoneList.length; i < size; i++) {
            let zone = _this.giftPacketParams.zoneList[i]
            if (zone.coupon_id === '' || zone.zone_name === '') {
              _this.warning('还有专区没有选择优惠券或者没有填写专区名称')
              return false
            }
            if (!/^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{1,22}$/.test(zone.zone_name)) {
              _this.warning('专区名称只能为汉字数字英文特殊字符,不能为空')
              return false
            }
            let realLength = _this.getStrLength(zone.zone_name)
            if (realLength > 11) {
              _this.warning('专区名称不能超过11个字')
              return false
            }
          }
          if (_this.giftPacketParams.tip === '') {
            _this.warning('活动须知不能为空，需以;进项分割，中英文不限')
            return false
          }
          if (_this.giftPacketParams.effective === '') {
            _this.giftPacketParams.effective = '1'
          }
          return true
        }
      },
      // 提交请求
      postfrom () {
        let _this = this
        let flag = _this.formValidator(0)
        if (flag) {
          let list = _this.makeZoneList()
          let rebody = {
            packet_id: _this.giftPacketParams.packetId,
            packet_name: _this.giftPacketParams.name,
            effective_user: _this.giftPacketParams.effective,
            receive_type: _this.giftPacketParams.receiveType,
            with_other_cut: _this.giftPacketParams.withOtherCut,
            tip: _this.giftPacketParams.tip.replace('；', ';'),
            personal_edit: _this.giftPacketParams.personalEdit,
            page_url: _this.giftPacketParams.dialogImg,
            banner_url: _this.giftPacketParams.bannerImg,
            bg_pic_url: _this.giftPacketParams.backgroundImg,
            zone_json: JSON.stringify(list)
          }
          console.log('rebody:', JSON.stringify(rebody))
          _this.api_businessManagePlatform_packetCreation({
            data: JSON.stringify(rebody),
            headers: {'Content-Type': 'application/json'}
          }).then(result => {
            console.log('status:', result.status)
            _this.$router.push({path: '/m/marketActivity/giftPacketList'})
          })
//          $.ajax({
//            url: _this.BASE_URL + 'm2c.market/admin/packet/creation',
//            contentType: 'application/json', // 必须有
//            headers: {'access_token': sessionStorage.getItem('access_token')},
//            type: 'post',
//            data: JSON.stringify(rebody),
//            success: function (result) {
//              if (result.status == 200) {
//                console.log('status:', result.status)
//                _this.$router.push({path: '/m/marketActivity/giftPacketList'})
//              }
//            }
//          })
        }
      },
      // 返回列表
      back () {
        let _this = this
        _this.$router.push({path: '/m/marketActivity/giftPacketList'})
      },
      // 验证提示
      warning (msg) {
        let _this = this
        _this.$message.error(msg)
      },
      // 获取输入文本字数
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
      },
      // 获取上传文件页面缓存URL
      getFileUrl (file) {
        let url
        url = window.URL.createObjectURL(file)
        return url
      },
      // 获取上传文件长和宽
      getFileWidthAndHeight (file) {
        let imgInfo = {width: 0, height: 0}
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (theFile) {
          let image = new Image()
          image.src = theFile.target.result
          image.onload = function () {
            imgInfo.width = image.width
            imgInfo.height = image.height
          }
        }
        return imgInfo
      },
      // 预览
      preview () {
        let _this = this
        _this.giftPacketParams.tip = _this.giftPacketParams.tip.replace('；', ';')
        _this.ruleList = _this.giftPacketParams.tip.split(';')
        for (let i = _this.ruleList.length; i > 0; i--) {
          if (_this.ruleList[i - 1].trim() === '') {
            _this.ruleList.splice(i - 1, 1)
          }
        }
        _this.previewDialogVisible = true
      },
      // 获取优惠券作用商品/店铺
      couponRangList (couponId) {
        let _this = this
        let parmas = {couponId: couponId, pageNum: 1, rows: 30}
        _this.api_businessManagePlatform_couponApplyGoods({
          data: parmas
        }).then(result => {
          _this.giftPacketParams.zoneList[_this.currentZoneIndex].range_count = result.totalCount
          _this.giftPacketParams.zoneList[_this.currentZoneIndex].range_list = result.content
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
	.addnewgift_container{
    padding: 15px 26px;
    .addnewcon{
    	background: #FFFFFF;
    	padding-top: 22px;
    	padding-left: 18px;
    	padding-bottom: 3px;
    	.giftextarea{
    		width: 880px!important;
    	}
    	.con01{
    		text-align: right;
    		.tit{
    			line-height: 20px;
    		}
    	}
    	.input360{
    		width: 360px;
    	}
    	.add_Area{
    		width: 880px;
    		min-height: 260px;
    		border: 1px solid #E6E8F2;
    		margin-bottom: 20px;
    		margin-left: 75px;
    		.add_a_top{
    			padding-right: 20px;
    			height: 50px;
    			line-height:50px;
    			background:rgba(249,250,254,1);
					padding-left: 20px;
					border-bottom: 1px solid #E6E8F2;
    		}
    		.add_a_btn{
    			min-height: 155px;
    			padding: 10px;
    			.bt{
    				font-size: 12px;
    				margin-bottom: 10px;
    			}
    			.goods{
    				font-size:12px;
    				line-height: 28px;
    				height: 28px;
    				width: 100%;
    				background: #F9FAFE;
    				color: #CCCCCC;
            margin-top: 10px;
    				/*padding-left: 30px;*/
    			}
    			.goods_box,.shops_box{
    				min-height: 60px;
    				border: 1px solid #E6E8F2;
    				padding: 10px;
    				.tit{

    				}
    				.img{
    					width: 60px;
    					height: 60px;
    					img{
    						width: 100%;
    						height: 100%;
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
    			.icon_quan{
    				width: 260px;
    				height: 90px;
    				border: 1px dotted #B7C9E1;
    				text-align: center;
    				font-size: 12px;
    				color: #CCCCCC;
    				cursor: pointer;
    				.jiahao{
    					font-size: 32px;
    					color: #879CB8;
    					padding-top: 15px;
    				}
    			}
    		}
    		.ico_del{
    			margin-top: 15px;
    			width: 16px;
    			height: 20px;
    			display: inline-block;
    			background: url(../../../../../../static/images/businessManage/icon_delet02.png) no-repeat center;
    			display: inline-block;
    			cursor: pointer;
    		}
    	}
    }
    .icon-intro02{
	    width: 15px;
	    height: 15px;
	    background: url(../../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
	    display: inline-block;
	    cursor: pointer;
		}
		.preview{
			background: #11D2EB;
			border: 1px solid #11D2EB;
			color: #FFFFFF;
			height: 36px;
			/*line-height: 36px;*/
		}
		.b_button{
      padding-top: 20px;
      padding-bottom: 10px;
      margin-top: 10px;
      background: #fff;
      position: fixed;
      z-index: 99;
      bottom: 0px;
      width: 100%;
      left: 200px;
      border-top:1px solid #E6E8F2;
    }
  }
  .Choice_coupon{
  	width: 880px;
    border: 1px solid #E6E8F2;
    .Choice_coupon_t{
	    background: #f9fafe;
	    border-radius: 3px 3px 0px 0px;
	    border-bottom: 1px solid #E6E8F2;
	    padding: 10px;
	    display: -ms-flexbox;
	    display: flex;
	    .couponinput01{
	    	width: 350px;
	    }
    }
    .Choice_coupon_b{
    	width: 100%;
	    height: 416px;
	    overflow-y: auto;
	    padding-top: 18px;
	    padding-bottom: 18px;
	    padding-left: 15px;
    }
  }
  .tit04{
   	text-align: center;
    top: 55px;
    width: 880px;
  }
  .coupon_box{
	  width: 270px;
		height: 90px;
		margin-bottom: 10px;
		background: url(../../../../../../static/images/businessManage/icon_quan_gray.png) no-repeat center;
		cursor: pointer;
		.coupon_box_left{
		  width: 85px;
    	color: #878787;
    	height: 100%;
    	font-size: 12px;
    	text-align: center;
    	padding-top: 20px;
    	.tit01{
    		font-size: 16px;
    		line-height: 28px;
    	}
    	.tit02{
    		font-size: 12px;
    	}
		}
		.coupon_box_right{
		  width: 170px;
			height: 100%;
			padding: 7px;
			font-size: 12px;
			text-align: left;
			.tit02{
			  color: #878787;
			  }
		  }
	  }
  .f-active{
		background: url(../../../../../../static/images/businessManage/icon_quan_blue.png) no-repeat center!important;
		position: relative;
		.icon_selected {
			position: absolute;
			background: url(../../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
			width: 18px;
			height: 18px;
			right: 0px;
			bottom: 0px;
		}
		.coupon_box_left{
			.tit01{
				color: #0086FF;
			}
		}
	}
	.single_setcontaner{
		width: 100%;
		border-top:1px solid #E5E5E5;
		border-bottom:1px solid #E5E5E5;
		height: 400px;
		overflow-y: auto;
		.downloadbox{
			.download{
				width: 180px;
				height: 215px;
				background:rgba(236,236,236,1);
				cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
			}
			.download02{
				width: 300px;
				height: 80px;
				background:rgba(236,236,236,1);
				cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
			}
			.download03{
				width: 300px;
				height: 160px;
				background:rgba(236,236,236,1);
				cursor: pointer;
        img{
          width: 100%;
          height: 100%;
        }
			}
		}
		.download_tit{
			font-size: 12px;
			color: #666666;
			line-height: 25px;
			.greycolor{
				color:rgba(153,153,153,1);
			}
		}
	}
	.ClientPreview{
		width: 375px;
		margin: auto;
    background: #F0F0F0;
    padding-bottom: 5px;
		.banner{
			width: 100%;
			height: 200px;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.content01{
			width: 375px;
			/*margin-top: 10px;*/
			.content_t{
				width: 100%;
				height: 40px;
				background: url(../../../../../../static/images/businessManage/set_titlebar.png) no-repeat center;
				background-size:cover ;
				text-align: center;
				line-height: 40px;
				color: rgb(253,50,66);
				font-size: 15px;
			}
			.content_b{
				width: 365px;
				.content_box{
					padding: 5px;
					width:162px;
					height: 235px;
          background: #FFFFFF;
					.img{
						width: 100%;
						height: 165px;
						img{
							width: 100%;
							height: 100%;
						}
					}
					.tit{
						height: 40px;
						padding-left:20px;
						padding-right: 20px;
						text-align: center;
						font-size: 13px;
						color: rgb(51,51,51);
						padding-top: 10px;
						line-height: 20px;
					}
				}
			}
			.content_b02{
				padding: 15px;
        background: #FFFFFF;
        min-height: 100px;
        margin: 10px;
			}
		}
	}
  .bordert{
    border-top:1px solid #E6E8F2 ;
  }
  .borderl{
    border-left:1px solid #E6E8F2 ;
  }
  .mr20{
  	margin-right: 20px;
  }
  .mr30{
    margin-right: 30px;
  }
  .wid138{
    width: 138px;
  }
  .wid280{
  	width: 280px;
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
    color:#7C9BBF;
    font-size: 14px;
  }
  .bluecolor02{
    color: #0086FF;
  }
  .yellowcolor{
  	color: #F5BD23;
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
  .mt7{
    margin-top: 7px;
  }
  .mr7{
  	margin-right: 7px;
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
  .mr20{
  	margin-right: 20px;
  }
  .ml60{
    margin-left: 60px;
  }
  .ml20{
  	margin-left: 20px;
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
  .mt0{
  	margin-top: initial!important;
  }
  .wid100{
  	width: 100%!important;
  }
  .more{
    display: inline-block;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background: #f5f5f5;
  }
</style>

