<template>
  <div class="recordsedit_container">
      <el-col :span="24" class="">
      	<div class="recordsedit_bt">
      		该设置仅针对于分享券，所有内容不设置则跟随默认设置，有设置将按设置的生效。
      	</div>
      </el-col>
      <el-col :span="24" class="mt10 toolbar">
        <el-form :inline="true" class="demo-form-inline">
      		<div class="recordsedit_cen">
      			<div class="tit">分享设置</div>
      			<div>
              <el-form-item label="分享标题" class="">
                <el-input v-model="formInline.title" placeholder="不超过11个字" :maxlength="22" @blur="formValidator(1)"></el-input>
              </el-form-item>
              <span class="name_style">可用英文数字，汉字，特殊字符，一个中文数字符号=1个字，一个英文=半个字
              </span>
  					</div>
  					<div>
              <el-form-item label="分享图标" class="mt10">
                <span class="banner mr10" @click="selectIcon()" v-if="formInline.iconUrl != null && formInline.iconUrl !== ''">
                  <img :src="formInline.iconPreUrl" style="width: 100%; height: 100%"/>
                </span>
                <span class="banner mr10" @click="selectIcon()" v-if="formInline.iconUrl === ''">
                  <div class="banner_jia">+</div>
                  <div class="greycolor banner_s">上传icon</div>
                </span>
                <!--<el-button class="mr10" type="primary" size="small" @click="selectIcon">上传</el-button>-->
                <input type="file" ref="icon" multiple="multiple" style="display: none;" @change="handleIconChange"/>
                <span class="greycolor">支持jpg、png格式，108px*108px，文件最大30K，默认取APPlogo。</span>
  					  </el-form-item>
  					</div>
  					<div>
  					<el-form-item label="分享描述" class="mt10">
    					<el-input type="textarea" class="wid600" v-model="formInline.text" placeholder="最多30个字，在展示时，若展示不全将会省略" :maxlength="60" @blur="formValidator(2)"></el-input>
  					</el-form-item>
  					</div>
      		</div>
      		<div class="recordsedit_cen mt20">
      			<div class="tit">领取页面设置</div>
      			<div>
  					<el-form-item class="mt10">
    					<span class="bt01 mr10">
    						<div>
    							<i class="icon-intro poi1 mr5" v-popover:popover1>
    							<el-popover
                    ref="popover1"
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    content="该banner为领取页面顶部的展示图片，领取页面背景将会采用页面banner的中色值">
									</el-popover>
    							</i>
    						<span>页面</span>
    						</div>
    						<div>banner</div>
    					</span>
    					<span class="banner mr10" @click="selectBanner()" v-if="formInline.bannerUrl != null && formInline.bannerUrl !== ''">
    						<img :src="formInline.bannerPreUrl" style="width: 100%; height: 100%"/>
    					</span>
              <span class="banner mr10" @click="selectBanner()" v-if="formInline.bannerUrl === ''">
    						<div class="banner_jia">+</div>
    						<div class="greycolor banner_s">上传banner</div>
    					</span>
              <input type="file" ref="banner" multiple="multiple" style="display: none;" @change="handleBannerChange"/>
    					<span class="greycolor">支持jpg、png格式，750px*400px，文件最大300K。</span>
  					</el-form-item>
  					</div>
  					<div>
  					</div>
  					<div>
  					<el-form-item label="活动细则" class="mt10">
    					<el-input type="textarea" class="wid600" placeholder="温馨提示：用“；”换行，换行后将会自动出现“1、2、3、”的分段序号，可以点击预览查看效果。"  v-model="formInline.ruletext" :maxlength="300"></el-input>
  					</el-form-item>
  					</div>
      		</div>
      		<div class="b_button">
          	<div class="marauto wid280">
          	<el-form-item>
    					<el-button type="primary" size="small" @click="postfrom()">保存</el-button>
    					<el-button size="small" @click="preview()">预览</el-button>
              <el-button type="warning" size="small" @click="reset()">重置</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
        <el-dialog :visible.sync="dialogVisible" width="450px" :before-close="handleClose">
				  	<div class="couponcontainer">
							<div class="banner" v-if="formInline.bannerUrl != ''">
								<img :src="formInline.bannerPreUrl" data-adaptive-background="1"/>
							</div>
              <div class="banner" v-if="formInline.bannerUrl == ''">
                <img src="../../../../../../static/images/businessManage/banner.png" data-adaptive-background="1"/>
              </div>
						  <div class="center">
							  <!--如果优惠券被领完的情况 不显示优惠券-->
							  <div class="mb20">
                  <div class="poi1">
                    <div class="poi2 opacitybg"></div>
                    <div class="coupon01">
                      <div class="coupon01bg clear">
                        <div class="couponleft fl">
                          <div class="tit01">
                            <span>￥</span>
                            <span class="bigsize">50</span>
                          </div>
                          <div class="tit02">满200元可用</div>
                        </div>
                        <div class="couponright fl">
                          <div class="tit01">双十一啦啦啦全平台优惠券</div>
                          <div class="tit02">全场可用（部分商品除外）</div>
                          <div class="tit02">2017.12.01-2017.12.12</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class=""><div class="line"></div></div>
                <div class="">
                  <div class="active_rlue">
                    <div class="rluetop">— 活动细则 —</div>
                    <div class="rluebtm">
                      <div class="mb10" v-for="(rule, index) in ruleList" :key="index">
                        <span class="crl">{{index + 1}}</span>
                        <span>{{rule}}</span>
                      </div>
                    </div>
                  </div>
                </div>
							  <div class="poi1 foot">本活动最终解释权归拍获所有</div>
						  </div>
					  </div>
				</el-dialog>
      </el-col>
  </div>
</template>
<script>
import '../../../../../../static/js/jquery.adaptive-backgrounds.js'
export default {
  data () {
    return {
      ruleList: [],
      dialogVisible: false,
      formInline: {
        title: '',
        iconPreUrl: '',
        iconUrl: '',
        text: '',
        bannerPreUrl: '',
        bannerUrl: '',
        ruletext: ''
      }
    }
  },
  methods: {
    // 关闭预览弹框
    handleClose () {
      let _this = this
      _this.dialogVisible = false
    },
    // 预览
    preview () {
      let _this = this
      _this.formInline.ruletext = _this.formInline.ruletext.replace('；', ';')
      _this.ruleList = _this.formInline.ruletext.split(';')
      for (let i = _this.ruleList.length; i > 0; i--) {
        if (_this.ruleList[i - 1].trim() === '') {
          _this.ruleList.splice(i - 1, 1)
        }
      }
      setTimeout(() => {
        $.adaptiveBackground.run()
        $('.banner>img').on('ab-color-found', function (ev, payload) {
          $('.couponcontainer').css('background', payload.color)
        })
      }, 100)
      _this.dialogVisible = true
    },
    // 点击icon选择按钮
    selectIcon () {
      let _this = this
      _this.$refs.icon.click()
    },
    // 点击banner选择按钮
    selectBanner () {
      let _this = this
      _this.$refs.banner.click()
    },
    getFileUrl (file) {
      let url
      url = window.URL.createObjectURL(file)
      return url
    },
    handleIconChange (e) {
      let _this = this
      let iconDOM = _this.$refs.icon
      // 通过DOM取文件数据
      let file = iconDOM.files[0]
      _this.beforeUpload(file, 'icon')
      // 这里就可以获取到文件的url
//      if (flag !== false) {
//        _this.formInline.iconPreUrl = _this.getFileUrl(file)
//        _this.uploadFile(file, 'icon')
//      }
    },
    handleBannerChange (e) {
      let _this = this
      let bannerDOM = _this.$refs.banner
      // 通过DOM取文件数据
      let file = bannerDOM.files[0]
      _this.beforeUpload(file, 'banner')
      // 这里就可以获取到文件的url
//      if (flag !== false) {
//        _this.formInline.bannerPreUrl = _this.getFileUrl(file)
//        _this.uploadFile(file, 'banner')
//      }
    },
    beforeUpload (file, flag) {
      let _this = this
      let suffix = file.name.split('.')
      let size = Math.floor(file.size / 1024)
      if (suffix[1] !== 'jpg' && suffix[1] !== 'png') {
        _this.$message.error('上传图片只能是 jpg/png 格式!')
        return false
      }
      if (flag === 'icon' && size > 30) {
        _this.$message.error('上传图片大小最大30K!')
        return false
      }
      if (flag === 'banner' && size > 300) {
        _this.$message.error('上传图片大小最大30K!')
        return false
      }
      let image = new Image()
      image.src = _this.getFileUrl(file)
      image.onload = function () {
        console.log('width:' + image.width)
        console.log('height:' + image.height)
        if (flag === 'icon') {
          if (image.width !== 108 || image.height !== 108) {
            _this.$message.error('上传图片尺寸限制为108x108!')
          } else {
            _this.formInline.iconPreUrl = _this.getFileUrl(file)
            _this.uploadFile(file, 'icon')
          }
        }
        if (flag === 'banner') {
          if (image.width !== 750 || image.height !== 400) {
            _this.$message.error('上传图片尺寸限制为750x400!')
          } else {
            _this.formInline.bannerPreUrl = _this.getFileUrl(file)
            _this.uploadFile(file, 'banner')
          }
        }
      }
    },
    // 文件上传
    uploadFile (file, flag) {
      let _this = this
      console.log('文件', file)
      let formData = new FormData()
      formData.append('img', file)
      formData.append('imgGroup', 1)
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
            _this.$message({message: '上传成功！', type: 'success'})
            if (flag === 'icon') {
              _this.formInline.iconUrl = result.content.fileKey
            }
            if (flag === 'banner') {
              _this.formInline.bannerUrl = result.content.fileKey
            }
          }
        },
        error: function () {
          console.log('上传内容格式错误，请下载模板参照！')
          _this.$message.error('上传图片错误！')
        }
      })
    },
    formValidator (flag) {
      let _this = this
      // flag--1:标题，2：描述
      if (flag == 0 || flag == 1) {
        if (_this.formInline.title !== '' && !/^[\u4e00-\u9fa5a-zA-Z0-9·~！@#￥%……【】—_，。、？、|：“”/]{1,22}$/.test(_this.formInline.title)) {
          _this.warning('分享标题只能为汉字数字英文特殊字符')
          return false
        }
        let realLength = _this.getStrLength(_this.formInline.title)
        if (realLength > 11) {
          _this.warning('分享标题不能超过11个字')
          return false
        }
      }
      if (flag == 0 || flag == 2) {
        if (_this.formInline.text !== '' && !/^[\u4e00-\u9fa5a-zA-Z0-9·~！@#￥%……【】—_，。、？、|：“”/]{1,60}$/.test(_this.formInline.text)) {
          _this.warning('分享描述只能为汉字数字英文特殊字符,不能为空')
          return false
        }
        let realLength = _this.getStrLength(_this.formInline.text)
        if (realLength > 30) {
          _this.warning('分享描述不能超过30个字')
          return false
        }
      }
//      if (flag == 0) {
//        if (_this.formInline.iconUrl === '') {
//          _this.warning('分享图标不能为空')
//          return false
//        }
//        if (_this.formInline.bannerUrl === '') {
//          _this.warning('分享banner不能为空')
//          return false
//        }
//        if (_this.formInline.rule === '') {
//          _this.warning('分享规则不能为空')
//          return false
//        }
//      }
      return true
    },
    postfrom () {
      let _this = this
      let flag = _this.formValidator(0)
      if (flag) {
        let rebody = {
          share_title: _this.formInline.title,
          share_icon_url: _this.formInline.iconUrl,
          share_describe: _this.formInline.text,
          page_banner_url: _this.formInline.bannerUrl,
          activity_rule: _this.formInline.ruletext
        }
        console.log('rebody:', JSON.stringify(rebody))
        _this.api_businessManagePlatform_editSettings({
          data: JSON.stringify(rebody),
          headers: {'Content-Type': 'application/json'}
        }).then(result => {
          console.log('status:', result.status)
          _this.$message({message: '保存编辑成功！', type: 'success'})
        })
//        $.ajax({
//          url: _this.BASE_URL + 'm2c.market/admin/coupon/share/edit/settings',
//          contentType: 'application/json', // 必须有
//          headers: {'access_token': sessionStorage.getItem('access_token')},
//          type: 'post',
//          data: JSON.stringify(rebody),
//          success: function (result) {
//            if (result.status == 200) {
//              console.log('status:', result.status)
//              _this.$message({message: '保存编辑成功！', type: 'success'})
//            }
//          }
//        })
      }
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
    },
    warning (msg) {
      let _this = this
      _this.$message.error(msg)
    },
    reset () {
      let _this = this
      if (confirm('确定要重置个性化设置?')) {
        _this.formInline = {
          title: '',
          iconPreUrl: '',
          iconUrl: '',
          text: '',
          bannerPreUrl: '',
          bannerUrl: '',
          ruletext: ''
        }
        _this.postfrom()
      }
    }
  },
  created () {
    let _this = this
    _this.api_businessManagePlatform_querySettings({
      data: {}
    }).then(result => {
      console.log('优惠券个性化设置:', result.content)
      _this.formInline.title = result.content.shareTitle
      _this.formInline.iconPreUrl = result.content.shareIconUrl
      _this.formInline.iconUrl = result.content.shareIconUrlPlus
      _this.formInline.text = result.content.shareDescribe
      _this.formInline.bannerPreUrl = result.content.pageBannerUrl
      _this.formInline.bannerUrl = result.content.pageBannerUrlPlus
      _this.formInline.ruletext = result.content.activityRule
    })
  }
}
</script>

<style lang="scss" scoped>
.recordsedit_container{
	padding: 15px 26px;
	.recordsedit_bt{
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 16px;
		color: #F5A623;
		background: #FFF9EE;
		padding-left: 20px;
	}
	.b_button{
  	padding-top: 20px;
    padding-bottom: 5px;
    margin-top: 10px;
    background: #fff;
    position: fixed;
    z-index: 99;
    bottom: 0px;
    width: 100%;
    left: 200px;
    border-top:1px solid #E6E8F2;
  }
	.recordsedit_cen{
		width: 100%;
		/*height: 240px;*/
		background: #FFFFFF;
		padding-top: 12px;
		padding-bottom: 20px;
		padding-left: 20px;
		.tit{
		font-size:16px;
		font-family:PingFangSC-Medium;
		color:rgba(0,0,0,1);
		line-height:25px;
		}
		.share_img{
			width: 60px;
			height: 60px;
			display: inline-block;
			img{
				width: 100%;
				height: 100%;
			}
		}
		.banner{
			width: 130px;
			height: 60px;
			display: inline-block;
			background: #F9FAFE 100%;
			border: 1px dotted #B7C9E1;
			text-align: center;
			.banner_jia{
				font-size: 30px;
				color: #879CB8;
				line-height: 35px;
			}
			.banner_s{
				line-height: 20px;
			}
		}
		.bt01{
			display: inline-block;
			line-height: 20px;
			margin-left: 20px;
		}
		.icon-intro{
    width: 15px;
    height: 15px;
    background: url(../../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
    display: inline-block;
  	}
		.greycolor{
			color: #CCCCCC;
			font-size: 12px;
		}
		.wid600{
			width: 600px;
		}
	}
}
.couponcontainer{
	width: 375px;
	margin: auto;
	/*background: rgb(238, 76, 36);*/
	.foot{
		text-align: center;
		margin-top: 20px;
	}
}
.couponcontainer .banner{
	height: 200px;
	width: 375px;
}
.couponcontainer .banner img{
	width: 100%;
	height: 100%;
}
.couponcontainer .center{
	width: 92%;
	padding-top: 20px;
	padding-bottom: 10px;
	padding-left: 15px;
	padding-right: 15px;
}
.couponcontainer .coupon01 .coupon01bg{
	width: 320px;
	height: 90px;
	background: url(../../../../../../static/images/businessManage/coupon.png) no-repeat;
	background-size:cover ;
	margin: auto;
}
.couponcontainer .couponleft{
	width:100px;
	height: 100%;
	padding-top: 18px;
}
.couponcontainer .couponleft .tit01{
	font-size: 13px;
	color: rgb(253,50,66);
	text-align: center;
}
.couponcontainer .couponleft .tit02{
	font-size: 10px;
	color: rgb(51,51,51);
	text-align: center;
}
.bigsize{
	font-size:30px;
	font-weight: 600;
}
.couponcontainer .active_rlue{
	width: 345px;
	min-height: 175px;
	background: #FFFFFF;
	border-radius:8px;
	padding-bottom: 10px;
	margin-top: 20px;
}
.couponcontainer .rluetop{
	background: rgb(243,232,232);
	height:40px;
	line-height: 40px;
	text-align: center;
	font-size: 12px;
	color: rgb(253,50,66);
	border-bottom: 1px solid #E5E5E5;
	border-top-left-radius:8px;
	border-top-right-radius:8px;
}
.couponcontainer .nocoupon{
	text-align: center;
	font-size: 14px;
	color: #fff;
	margin-top: 10px;
	margin-bottom: 20px;
}
.couponcontainer .crl{
	width: 24px;
	height: 24px;
	background:rgb(254,196,200) ;
	color: #FFFFFF;
	line-height: 24px;
	text-align: center;
	display: inline-block;
	border-radius:50% ;
	margin-right: 5px;
}
.couponcontainer .rluebtm{
	/*padding-left: 0.3rem;*/
	font-size: 12px;
	width: 100%;
	/*height: 3.66rem;*/
	padding: 15px;
}
.couponcontainer .couponright{
	width:215px;
	height: 100%;
	padding-top: 15px;
	padding-left: 10px;
}
.couponcontainer .couponright .tit01{
	font-size: 14px;
	color: rgb(51,51,51);
}
.couponcontainer .couponright .tit02{
	font-size: 10px;
	color: rgb(102,102,102);
}
.mt30{
	margin-top: 30px;
}
.border_top{
	border-top: 1px solid #E5E5E5;
}
.pt3{
	padding-top: 3px;
}
.marauto{
	margin: auto;
}
.widnone{
	width: initial!important;
}
.mr20{
	margin-right: 20px;
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
.mr5{
	margin-right: 5px;
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
.wid280{
	width: 280px;
}
.name_style{
  display:  inline-block;
  line-height: 20px;
  color:  #ccc;
  width:  260px;
  margin-top: 10px;
  font-size: 12px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clear{
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
</style>
