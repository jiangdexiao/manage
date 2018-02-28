<template>
  <div> 
    <el-col :span="24" class="">
        <div class="addcouponbox">
        	<el-form :inline="true">
	        	<div class="bt_tit">
	        		<b>新增活动</b>
	        	</div>
	        	<div class="mt20 mb20">
		        	<label class="mr20">活动标题</label>
	            <span>{{detaildata.activityName}}</span>	            
            </div>
            <div class="mt20 mb20">
	            <label class="mr20">展示时间</label>
	            <span>{{detaildata.showTimeStart}} ~ {{detaildata.showTimeEnd}}</span>
            </div>
            <div>	           
	          <div class="clear02 mt20 mb20">	            		
	            <label class="mr20 fl mt10">投放媒体</label>
		          <div class="mediabox">
		            <span class="fl">选择媒体：</span> 
		            <span class="wid50_wose fl" v-if="detaildata.mediaRangeType == 2">
			            <span v-for="media in detaildata.mediaItemsList"><span>{{media.mediaName}},</span></span>
		            </span>
		            <span class="lookwhole" style="display:;" v-show="detaildata.mediaItemsList.length>5"   @click="Lookwhole">查看全部</span>
		            <span v-if="detaildata.mediaRangeType == 1">
		            	全部媒体
		            </span>
		          </div>
	          </div>
	          <div class="clear02 mt20 mb20" v-if="detaildata.mediaRangeType == 2">	            		
	            <label class="mr20 fl mt10">(广告位)</label>
		          <div class="mediabox">
		            <span class="fl">选择广告位：</span>
		            <span class="wid50_wose fl">
		            <span v-for="ads in detaildata.adsItemsList"><span>{{ads.adsName}},</span></span>
		            </span>
		            <span class="lookwhole" style="display:;" v-show="detaildata.adsItemsList.length > 5"   @click="Lookwhole02">查看全部</span>
		          </div>
	          </div>
            </div>
            <div class="clear02 mt20 mb20">
            	<label class="mr20">
            		<span class="">是否为惊喜</span>
            	</label>
						    <span class="mt5">
						      <span v-if="detaildata.surpriseType==1">是</span>
						      <span v-else>否</span>
						    </span>  						
            </div>
            <div class="clear02">
            	<div class="clear02 mt20 mb20">
            		<label>
	            		<span class="mr20 fl">选择优惠券</span>
            		</label>
						    <div class="coupon_box f-active fl" >
						  			<i class="icon_selected"></i>
						  			<div class="coupon_box_left fl">
						  				<div class="tit01">
						  					<span>{{detaildata.couponRepresentation.faceValue}}</span>
						  					<span>
							  					<span v-if="detaildata.couponRepresentation.couponForm==1">元</span>
							  					<span v-else>折</span>
						  					</span>
						  				</div>
						  				<div class="tit02">{{detaildata.couponRepresentation.content}}</div>
						  			</div>
						  			<div class="coupon_box_right fl">
						  					<div class="tit01">{{detaildata.couponRepresentation.couponName}}</div>
						  					<div class="tit02">{{detaildata.couponRepresentation.rangeContent}}</div>
						  					<div class="tit03">{{detaildata.couponRepresentation.expirationTimeStart}}~{{detaildata.couponRepresentation.expirationTimeEnd}}</div>
						  			</div>
			  					</div>
  						</div>
            </div>
        	</el-form>
        </div>
        <div class="poi3 foot">
        	<el-button @click="goback">返回</el-button>
        </div>
        
    </el-col>
    <el-dialog
		  title="已选全部媒体"
		  :visible.sync="centerDialogVisible02"
		  width="980px"
		  center>
		  <div class="allbox">
		  	<span v-for="media in detaildata.mediaItemsList">
		  	<span class="mr10 fl allboxspan mb10" >{{media.mediaName}}</span>
		  	</span>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="centerDialogVisible02 = false">确 定</el-button>
		    <el-button @click="centerDialogVisible02 = false">取 消</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="已选全部广告位"
		  :visible.sync="centerDialogVisible03"
		  width="980px"
		  center>
		  <div class="allbox">
		  	<span v-for="ads in detaildata.adsItemsList">
		  	<span class="mr10 fl allboxspan mb10" >{{ads.adsName}}</span>
		  	</span>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="centerDialogVisible03 = false">确 定</el-button>
		    <el-button @click="centerDialogVisible03 = false">取 消</el-button>
		  </span>
		</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
  	return {
		detaildata: {},
		detaildata: {
			couponRepresentation: {
				faceValue: ''
			}
		},
  	centerDialogVisible02: false,
  	centerDialogVisible03: false
  }
  },
  methods:{
   getdetail (){
   	let _this = this
   	_this.detaildata = JSON.parse(sessionStorage.getItem('detaildata'))
   	console.log("detaildata",_this.detaildata)
   },
   goto (path) {
        this.$router.push({path: path})
    },
		goback () {
    	this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing?id=001')
   },
		//	查看全部
	Lookwhole (){
		let _this = this
		this.centerDialogVisible02 = true
	},
	Lookwhole02 (){
		let _this = this
		this.centerDialogVisible03 = true
		
	},
  },
  mounted () {
  	this.getdetail ()
  }
}
</script>
<style lang="scss" scoped> 
.mr20{
	margin-right: 20px;
}
label{
	font-size:14px ;
} 
.fl{
	float: left;
}
.clear02{
	clear: both;
}
.fr{
	float: right;
}
.mb10{
	margin-bottom: 10px;
}
.mt20{
	margin-top: 20px;
}
.mb20{
	margin-bottom: 20px;
}
.wid50_wose{
	width: 80%;
	overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.coupon_box{
	  width: 270px;
		height: 90px;
		margin-bottom: 10px;
		background: url(../../../../../static/images/businessManage/icon_quan_gray.png) no-repeat center;
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
			  line-height: 15px;
			  }
			  .tit01{
			  	line-height: 25px;
			  }
		  }
}
.addcouponbox{
	width: 100%;
	min-height: 350px;
	background: #fff;
	margin-top: 10px;
	padding-left: 30px;
	padding-top: 20px;
	padding-bottom: 10px;
	font-size: 14px;
	.lookwhole{
		color: #0086FF; 
		cursor: pointer;
	}
	.mediaName{
		height: 36px;
    width: 340px;
    border-radius: 4px;
    border: 1px solid #d8dce5;
    overflow: hidden;
    padding: 0 10px;
    margin-top: 7px;
	}
	.mediabox{
		padding-top: 5px;
		padding-bottom: 5px;
		padding-left: 10px;
		padding-right: 10px;
		color: #7C9BBF;
		background: #F4F5FA;
		margin-top: 10px;
		margin-bottom: 10px;
		font-size: 12px;
		display: inline-block;
		width: 50%;
	}
	.bt_tit{
		font-size: 16px;
		.icon-intro02{
			background: url(../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
			width: 15px;
	    height: 15px;
	    display: inline-block;
	    cursor: pointer;
		}
	}
	.activetitle{
		width: 600px;
	}
	.tit{
    margin-left: 30px;
    margin-right: 20px;
    line-height: 20px;
    color: #5a5e66;
	}
	.couponbox{
		width: 260px;
		height: 90px;
		border: 1px dotted #B7C9E1;
		font-size:12px;
		color: #CCCCCC;
		text-align: center;
		cursor: pointer;
	}
}
.foot{
		width: 100%;
		background: #fff;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: center;
		bottom:0px;
	}	
.poi3{
	position: fixed;
}
.Choice_coupon{
  	width: 880px;
    border: 1px solid #E6E8F2;
    .sort{
    	width: 60px;
    	height: 36px;
    }
    .Choice_coupon_t{
	    background: #f9fafe;
	    border-radius: 3px 3px 0px 0px;
	    border-bottom: 1px solid #E6E8F2;
	    padding: 10px;
	    display: -ms-flexbox;
	    display: flex;
	    .couponinput01{
	    	width: 350px;
	    	.input{
	    		width: 350px;
	    	}
	    }
    }
    .Choice_coupon_b{
    	/*width: 100%;*/
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
		background: url(../../../../../static/images/businessManage/icon_quan_gray.png) no-repeat center;
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
		background: url(../../../../../static/images/businessManage/icon_quan_blue.png) no-repeat center!important;
		position: relative;
		.icon_selected {
			position: absolute;
			background: url(../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
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
	.mediaN{
      width:360px;
      border: 1px  solid  #BFC1CB ;
      /*display: flex;*/
      position: absolute;
      top: 44px;
      z-index: 2001;
      border-radius: 2px;
      box-shadow: 1px 1px 4px 0 rgba(0,0,0,.3);
      background-color: #fff;
      outline: none;
      .left{
        width:220px;
        border-right: 1px  solid  #BFC1CB ;
        .filtrate{
          padding: 8px 0 0 8px;
          .area_select3{
            width:86px;
            height:26px;
            border-radius: 2px;
          }
        }
        .serInp{
          width:190px;
          margin-left:8px;
          height:26px;
          border-radius: 2px;
        }
        .all-media{
          font-size: 12px;
          h5{
            line-height: 30px;
            background-color: #EDF0F7;
            font-size: 12px;
            padding:0 10px;
            margin-bottom:0;
          }
          ul{
              .checkbox {
                line-height: 30px;
                margin:0;
                position: relative;
                label{
                  max-width:180px;
                  padding:0 10px;
                  box-sizing: border-box;
                }
                .add-med{
                  width:16px;
                  height: 16px;
                  background:url('../../../../../static/images/businessManage/icon_add2.png');
                  background-size: cover;
                  position: absolute;
                  top:8px;
                  right:5px;
                  display: none;
                }
              }
              .checkbox:hover {
                border-top:1px solid #DFE9F6;
                border-bottom:1px solid #DFE9F6;
                .add_med{
                  display: block;
                }
              }
              
            }
        }
      }
      .right{
        flex:1;
        position: relative;
        .choosen{
          padding: 10px;
          width: 118px;
          .choosen_list{
            display: inline-block;
            height:24px;
            position: relative;
            margin-bottom:10px;
            box-sizing: border-box;
            font-size: 12px;
            padding:0 8px;
            border-radius: 4px;
            background-color: #DFE9F6;
            .text{
              display: inline-block;
              min-width: 50px;
              max-width:118px;
              line-height:22px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .del{
                width:14px;
                height: 14px;
                position: absolute;
               	background:url("../../../../../static/images/businessManage/icon_delet.png");
                background-size: cover;
                border-radius: 50%;
                right:-7px;
                top:-7px;
                display:none;
            }
          }
          .choosen_list:hover{
            .del{
              display: block;
            }
          }
        }        
      }
      .btn{
      	width: 100%;
      	height: 50px;
      	border-top:1px solid #BFC1CB;
      	text-align: center;
      	.sure{
            width:80px;
            height: 26px;    
            display: block;    
            line-height: 26px;
            text-align: center;             
          	margin-top: 10px;
    				margin-left: 130px;
            background: #11D2EB;
            color:#fff;
            border:1px solid transparent;
            box-sizing:border-box;
        }
      }
      
    }
.allbox{
	width: 900px;
	height: 380px;
	border: 1px solid #E6E8F2;
	padding: 10px;
	overflow: auto;
	.allboxspan{
		width:200px;
		height:28px; 
		background:rgba(245,245,245,1);
		border-radius: 2px ; 
		color:rgba(0,0,0,1);
		font-size: 12px;
		display: inline-block;
		line-height: 28px;
		padding-left: 10px;
	}
}
.fs14{
	font-size: 14px;
}
.fs30{
	font-size: 30px;
}
.clear02{
	clear: both;
	overflow: hidden;
}
.fl{
	float: left;
}  
.fr{
	float: right;
}
.mr5{
	margin-right: 5px;
}
.mr10{
	margin-right: 10px;
}
.ml10{
	margin-left: 10px;
}
.mt10{
	margin-top: 10px;
}
.mt5{
	margin-top: 5px;
}
.mb10{
	margin-bottom: 10px;
}
</style>