<template>
  <div class="addnewgift_container">
      <el-col :span="24" class="">
        <el-form :inline="true" class="demo-form-inline">
        	<div class="addnewcon">
	         	<div class="clear02 detailtit mb10">
		         	<b class="mr20 fl con01">
		         		{{giftPacketInfo.packetName}}
		         	</b>
		  			</div>
		  			<div class="add_Area" v-if="giftPacketInfo.zonelist != null && giftPacketInfo.zonelist.length > 0">
              <div class="bordert" v-for="(zone, index) in giftPacketInfo.zonelist">
                <div class="add_a_top borderl" >
                  <b class="mr10">专区{{index + 1}}</b>
                  <span>{{zone.zoneName}}</span>
                </div>
		  				  <div class="add_a_btn">
		  					<div class="bt">优惠券选择</div>
		  					<div>
		  						<div class="clear02 mr10 coupon_box f-active">
						  			<i class="icon_selected"></i>
						  			<div class="coupon_box_left fl">
                      <div class="tit01" v-if="zone.couponDetailRepresentation.couponForm == 1">{{zone.couponDetailRepresentation.value}}元</div>
                      <div class="tit01" v-if="zone.couponDetailRepresentation.couponForm == 2">{{zone.couponDetailRepresentation.value}}折</div>
						  				<div class="tit02">{{zone.couponDetailRepresentation.thresholdContent}}</div>
						  			</div>
						  			<div class="coupon_box_right fl">
						  					<div class="tit01 mb10">{{zone.couponDetailRepresentation.couponName}}</div>
						  					<div class="tit02">{{zone.couponDetailRepresentation.rangeContent}}</div>
						  					<div class="tit03">{{zone.couponDetailRepresentation.expirationTimeStart}} - {{zone.couponDetailRepresentation.expirationTimeEnd}}</div>
						  			</div>
			  					</div>
		  					</div>
		  					<div>
                  <!--未选择商品或者店铺的时候-->
                  <div class="bt mt10" v-if="zone.couponId == ''">作用范围</div>
                  <div class="goods" v-if="zone.couponId == ''">还未选择优惠券</div>
                  <!--有作用商品/店铺的时候-->
		  						<div class="bt mt10" v-if="zone.couponId != '' && zone.couponDetailRepresentation.rangeType != 1">作用商品</div>
		  						<div class="bt mt10" v-if="zone.couponId != '' && zone.couponDetailRepresentation.rangeType == 1">作用店铺</div>
		  						<div class="goods_box clear02" v-if="zone.couponId != ''">
                    <div v-if="(index == 0 && all_show_0 == true) || (index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true)">
                      <div v-for="range in zone.rangeList">
                        <el-tooltip v-if="zone.couponDetailRepresentation.rangeType != 1" :content="range.goodsName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                        <el-tooltip v-if="zone.couponDetailRepresentation.rangeType == 1" :content="range.shopName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.shopIcon"/>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <div v-if="(index == 0 && all_show_0 == false) || (index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false)">
                      <div v-for="(range, index1) in zone.rangeList" v-if="index1 < 10">
                        <el-tooltip v-if="zone.couponDetailRepresentation.rangeType != 1" :content="range.goodsName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.goodsImageUrl"/>
                          </div>
                        </el-tooltip>
                        <el-tooltip v-if="zone.couponDetailRepresentation.rangeType == 1" :content="range.shopName" placement="top-start" effect="light">
                          <div class="img fl mr10 mb10">
                            <img :src="range.shopIcon"/>
                          </div>
                        </el-tooltip>
                      </div>
                    </div>
                    <!--当商品超过盒子宽度的时候，控制出现展开全部-->
                    <div class="img02 fl poi1" v-if="zone.rangeList != null && zone.rangeList.length > 10" @click="changeAllShow(index)">
                      <div v-if="(index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true) || (index == 0 && all_show_0 == true)">收起全部</div>
                      <div v-if="(index == 1 && all_show_1 == true) || (index == 2 && all_show_2 == true) || (index == 0 && all_show_0 == true)"><i class="icon_open02"></i></div>
                      <div v-if="(index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false) || (index == 0 && all_show_0 == false)">展开全部</div>
                      <div v-if="(index == 1 && all_show_1 == false) || (index == 2 && all_show_2 == false) || (index == 0 && all_show_0 == false)"><i class="icon_open"></i></div>
                    </div>
		  						</div>
		  					</div>
		  				</div>
              </div>
		  			</div>
	       	</div>
	        <div class="addnewcon mt10">
	         	<div>
		         	<div class="clear02 detailtit mb10">
		         		<span class="mr20 fl con01">
		         			<span>作用用户</span>
		         		</span>
		         		<span v-if="giftPacketInfo.effectiveUser == 1">不限制注册时间</span>
                <span v-if="giftPacketInfo.effectiveUser == 2">一周内注册</span>
                <span v-if="giftPacketInfo.effectiveUser == 3">一个月内注册</span>
                <span v-if="giftPacketInfo.effectiveUser == 4">三个月内注册</span>
                <span v-if="giftPacketInfo.effectiveUser == 5">半年内注册</span>
                <span v-if="giftPacketInfo.effectiveUser == 6">该礼包生效后注册</span>
		         	</div>
	         	</div>
	         	<div class="detailtit mb10 clear02">
		         	<span class="mr20 fl con01">
		         		<div class="tit">是否需要 </div>
		         		<div class="tit">领取</div>
		         	</span>
              <span v-if="giftPacketInfo.receiveType == 1">需要领取</span>
              <span v-if="giftPacketInfo.receiveType == 0">不需要领取</span>
		  			</div>
	        </div>
	        <div class="addnewcon mt10">
	         	<div class="clear02 detailtit mb10">
		         	<span class="mr20 fl con01">
		         		活动须知
		         	</span>
		          <span class="active_rlue">
		          	<div class="word_break" v-for="(rule, index) in ruleList">
		          		{{index + 1}}、{{rule}}
		          	</div>
		          </span>
		  			</div>
	       	</div>
	       	<div class="addnewcon mt10 mb100">
	       		<div>
		         	<div class="clear02 detailtit mb10">
			         	<span class="mr20 con01">个性编辑</span>
                <span v-if="giftPacketInfo.personalEdit == 1">跟随通用样式</span>
			         	<span v-if="giftPacketInfo.personalEdit == 2">需要单独设置</span>
			  			</div>
		  			</div>
		  			<div>
			        <div class="detailtit mb10">
			        	<span class="mr20 con01">
			         		其他规则
			         	</span>
			         	<span>不可与满减共同使用</span>
			        </div>
	       		</div>
	       	</div>
	       	<div class="b_button">
          	<div class="marauto wid280">
          	<el-form-item>
    					<el-button class="preview mt0 fl" @click="preview()">预览</el-button>
    					<el-button size="medium" class="mt0 fl" @click="back()">返回</el-button>
  					</el-form-item>
  					</div>
  				</div>
        </el-form>
      </el-col>
		<!--预览弹框-->
		<el-dialog title="客户端预览" :visible.sync="centerDialogVisible" width="600px" center>
		  <div class="ClientPreview">
		  	<div class="banner">
          <img v-if="giftPacketInfo.bannerUrl != ''" :src="giftPacketInfo.bannerUrl" />
          <img v-if="giftPacketInfo.bannerUrl == ''" src="../../../../../../static/images/businessManage/image_set.png" />
		  	</div>
        <div v-if="giftPacketInfo.zonelist != null && giftPacketInfo.zonelist.length > 0">
          <div class="content01" v-for="(zone, index) in giftPacketInfo.zonelist">
            <div class="content_t">
              {{zone.zoneName}}
            </div>
            <div class="content_b clear02" v-if="zone.rangeList != null && zone.rangeList.length > 0">
              <div class="content_box fl mt10 ml10" v-for="(range, ri) in zone.rangeList" v-if="ri < 4">
                <div class="img" v-if="zone.couponDetailRepresentation.rangeType != 1"><img :src="range.goodsImageUrl"/></div>
                <div class="wose02 tit" v-if="zone.couponDetailRepresentation.rangeType != 1">{{range.goodsName}}</div>
                <div class="img" v-if="zone.couponDetailRepresentation.rangeType == 1"><img :src="range.shopIcon"/></div>
                <div class="wose02 tit" v-if="zone.couponDetailRepresentation.rangeType == 1">{{range.shopName}}</div>
              </div>
            </div>
            <span class="more bluecolor02" v-if="zone.rangeList != null && zone.rangeList.length > 4">查看更多 ></span>
          </div>
        </div>
		  	<div class="content01">
		  		<div class="content_t">
		  			活动须知
		  		</div>
		  		<div class="content_b02 clear02">
		  			<div class="word_break" v-for="(rule, index) in ruleList">
              {{index + 1}}.{{rule}}
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
        all_show_0: false,
        all_show_1: false,
        all_show_2: false,
        centerDialogVisible: false,
        giftPacketInfo: '',
        ruleList: []
      }
    },
    mounted () {
      let _this = this
      _this.api_businessManagePlatform_packetDetail({
        pathParams: `/${sessionStorage.getItem('packet_id')}`
      }).then(result => {
        _this.giftPacketInfo = result.content
        _this.giftPacketInfo.tip = _this.giftPacketInfo.tip.replace('；', ';')
        _this.ruleList = _this.giftPacketInfo.tip.split(';')
        for (let i = _this.ruleList.length; i > 0; i--) {
          if (_this.ruleList[i - 1].trim() === '') {
            _this.ruleList.splice(i - 1, 1)
          }
        }
      })
//      $.ajax({
//        url: _this.BASE_URL + 'm2c.market/admin/packet/detail/' + sessionStorage.getItem('packet_id'),
//        headers: {'access_token': sessionStorage.getItem('access_token')},
//        success: function (result) {
//          _this.giftPacketInfo = result.content
//          _this.giftPacketInfo.tip = _this.giftPacketInfo.tip.replace('；', ';')
//          _this.ruleList = _this.giftPacketInfo.tip.split(';')
//          for (let i = _this.ruleList.length; i > 0; i--) {
//            if (_this.ruleList[i - 1].trim() === '') {
//              _this.ruleList.splice(i - 1, 1)
//            }
//          }
//        }
//      })
    },
    methods: {
      // 返回列表
      back () {
        let _this = this
        _this.$router.push({path: '/m/marketActivity/giftPacketList'})
      },
      // 预览
      preview () {
        let _this = this
        _this.giftPacketInfo.tip = _this.giftPacketInfo.tip.replace('；', ';')
        _this.ruleList = _this.giftPacketInfo.tip.split(';')
        for (let i = _this.ruleList.length; i > 0; i--) {
          if (_this.ruleList[i - 1].trim() === '') {
            _this.ruleList.splice(i - 1, 1)
          }
        }
        _this.centerDialogVisible = true
      },
      // 展开收起
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
    	.detailtit{
    		font-size: 14px;
    	}
    	.active_rlue{
    		width: 840px;
    		min-height: 130px;
    		padding: 20px;
    		font-size: 13px;
				background:rgba(249,250,254,1);
  			border-radius: 3px ;
    		display: inline-block;
    		line-height: 25px;
    	}
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
    		.add_a_top{
    			padding-right: 20px;
    			height: 50px;
    			line-height:50px;
    			background:rgba(249,250,254,1);
					padding-left: 20px;
					border-bottom: 1px solid #E6E8F2;
    		}
    		.add_a_btn{
    			min-height: 210px;
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
    				padding-left: 30px;
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
  .ClientPreview{
		width: 375px;
		margin: auto;
    background: #f0f0f0;
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
        background: #fff;
        min-height: 100px;
        margin: 10px;
			}
		}
	}
  .Choice_coupon{
  	width: 880px;
    border: 1px solid #E6E8F2;
    .Choice_coupon_t{
    	width: 100%;
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
		  width: 165px;
			height: 100%;
			padding: 7px;
			font-size: 12px;
			padding-left: 12px;
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
			}
			.download02{
				width: 300px;
				height: 80px;
				background:rgba(236,236,236,1);
				cursor: pointer;
			}
			.download03{
				width: 300px;
				height: 160px;
				background:rgba(236,236,236,1);
				cursor: pointer;
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
  .mt5{
    margin-top: 6px;
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
  .more{
    display: inline-block;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background: #f5f5f5;
  }
  .word_break {
    word-break: break-all;
  }
</style>
