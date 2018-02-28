<template>
  <div> 
    <el-col :span="24" class="">
        <div class="addcouponbox">
        	<el-form :inline="true" :form="form">
	        	<div class="bt_tit">
	        		<b v-if="couponshow == 'newadd' ">新增活动</b>
	        		<b v-if="couponshow == 'newedit'">编辑活动</b>
	        		<el-tooltip class="item" effect="dark" content="设置为惊喜的情况下，客户端将不会展示关键信息， 如“优惠券”“满200减100”等。" placement="top-start">
	     					<i class="icon-intro02"></i>
	    				</el-tooltip>
	        	</div>
	        	<div class="mt10">
		        <el-form-item label="活动标题" >
	              <el-input v-model="form.activity_name" placeholder="支持中英文，15个字符以内，不支持特殊符号" @blur="checkName"  :maxlength="15"  class="form-input activetitle"></el-input>
	            </el-form-item>
            </div>
            <div>
	            <el-form-item label="展示时间">
	               <el-date-picker
										v-model="time"
										width="360"
										height="50"
										:editable="false"
										type="daterange"
										range-separator="-"
										start-placeholder="开始日期" v-if="timeShow"
				            end-placeholder="结束日期" value-format="yyyy-MM-dd"
				            :picker-options="pickerBeginDateBefore"
				            @change="timeCheck">       
							</el-date-picker>
	            </el-form-item>
            </div>
            <div>
	            <el-form-item label="投放媒体">
	            	<div class="poi1">
	            		<div class="mediaName" @click="clickcmt">选择媒体</div>
	            		<div v-show="mediaNames">
		            		<div class="mediabox" v-if="mediaNames === '全部媒体'">
		            			<span>选择媒体：</span>
		            			<span>全部媒体</span>
		            		</div>
		            		<div class="mediabox" v-else>
		            			<span>选择媒体：</span>
		            			<span>{{fivemediaNames}}</span>
		            			<span class="lookwhole" v-show="surechosen_media.length> 5"  @click="Lookwhole">查看全部</span>
		            		</div>
	            		</div>
	            		<div v-show="neweditshow">
		            		<div class="mediabox" v-show="editdatas.mediaRangeType == 1">
		            			<span >
		            			<span>选择媒体：</span>
		            			<span>全部媒体</span>
		            			</span>
		            		</div>
		            		<div v-show="editdatas.mediaRangeType == 2">
		            		<div class="mediabox" >
		            			<span>已选择媒体：</span>
		            			<span v-for="list in mediashow" >{{list.mediaName}},</span>
		            		</div>
		            		<div class="mediabox" >
		            			<span>已选择广告位：</span>
		            			<span v-for="list in adsshow" >{{list.adsName}},</span>
		            		</div>
		            		</div>
	            		</div>
	            		<!--选择投放媒体下拉框-->
                	<div class="mediaN" v-show="toggle" tabindex="1">
                		<div class="clear02">
	                    <div class="left fl">
	                      <div class="form-group filtrate">
	                       	<select class="form-control area_select area_select3" v-model="search_params.province">
	                          <option value="" >所有地区</option>
	                          <option v-for="(cell,i) in mediaprovince" :value="cell.code" :key="i">{{cell.name}}</option>
	                        </select>
	                        <select class="form-control area_select area_select3" v-model="search_params.city">
	                          <option value="" >所有地区</option>
	                          <option v-for="(cell,i) in mediacity" :value="cell.code" :key="i">{{cell.name}}</option>
	                        </select>
	                      </div>
	                      <input class="form-control serInp" type="text" v-model="search_params.mediaName" @change="getmedialist"  placeholder="请输入媒体名称搜索" >
	                      <div class="all-media">
	                        <h5>全部媒体</h5>
	                        <ul>  
	                          <li class="checkbox" v-for="(cell,i) in media_list" :key="i" @click="choosemedia(cell)">	                          
	                          	<el-tooltip class="item" effect="dark" :content="cell.mediaName" placement="top-start">
	     														<label style="cursor: pointer;">{{cell.mediaName}}</label>
	    												</el-tooltip>
	                          </li>
	                        </ul>
	                      </div>
	                    </div>
	                    <div class="right fl">
		                    <div class="choosen" >
		                      <div v-if="toggleallmedia"><span class="choosen_list"><span class="text">全部媒体</span></span></div>
		                      <div> 
		                       	<span class="choosen_list" v-for="(cell,i) in choosen_medialist" :key="i">		                       		
		                       		<el-tooltip class="item" effect="dark" :content="cell.mediaName" placement="top-start">
	     														<span class="text" style="cursor: pointer;">{{cell.mediaName}}</span> 
	    												</el-tooltip>
		                        <span class="del" @click="delchoosemedia(cell,i)"></span></span></div>
		                    </div>
	                   	</div>
                   	</div>
                   	<div class="btn">
                   		<a class="sure" @click="suremedia">确定</a>
                   	</div>
                </div>
	            	</div>
	            </el-form-item>
	            <div>
	            <div>
	            <el-form-item v-show="AdvertisingTag">
	            	<div class="poi1 pl87">
	            		<div class="mediaName" @click="choseads">选择广告位</div>
	            		<div v-show = "showads == true">
		            		<div class="mediabox" v-if="mediads === '全部广告位'">
		            			<span>选择广告位：</span>
		            			<span>全部广告位</span>
		            		</div>
		            		<div class="mediabox" v-else>
		            			<span>选择广告位：</span>
		            			<span>{{fivemediads}}</span>
		            			<span class="lookwhole" v-show="surechosen_ads.length> 5" @click="Lookwhole02">查看全部</span>
		            		</div>
	            		</div>
	            		<!--选择投放媒体下拉框-->
                	<div class="mediaN" tabindex="1" v-show="Advertisetoggle">
                		<div class="clear02">
	                    <div class="left fl">
	                      <div class="form-group filtrate">
	                       	<select class="form-control area_select area_select3" v-model="ad_search_params.province">
	                          <option value="">所有地区</option>
	                          <option v-for="(cell,i) in mediaprovince" :value="cell.code" :key="i">{{cell.name}}</option>
	                        </select>
	                        <select class="form-control area_select area_select3" v-model="ad_search_params.city">
	                          <option value="" >所有地区</option>
	                          <option v-for="(cell,i) in mediacity" :value="cell.code" :key="i">{{cell.name}}</option>
	                        </select>
	                      </div>
	                      <input class="form-control serInp" type="text" placeholder="请输入广告位名称搜索"   @change="getadverlist" v-model="ad_search_params.mediaName">
	                      <div class="all-media">
	                        <h5>全部广告位</h5>
	                        <ul>  
	                          <li class="checkbox" v-for="(cell,i) in Advertising_list" :key="i">
	                          	<div class="text02" v-for="i in cell"  @click="Advertising(i)">	                          		
	                          		<el-tooltip class="item" effect="dark" :content="i.mresName" placement="top-start">
	     														<span style="cursor: pointer;">{{i.mresName}}</span>
	    													</el-tooltip>
	                          	</div>
	                          </li>
	                        </ul>
	                      </div>
	                    </div>
	                    <div class="right fl">
		                    <div class="choosen" >
		                      <div v-if="toggleallads">
		                      	<span class="choosen_list">
		                      	<span class="text">全部广告位</span>
		                      	</span></div>
		                      <div> 
		                       	<span class="choosen_list" v-for="(cell,i) in Advertising_choose" :key="i">		                       		
		                       		<el-tooltip class="item" effect="dark" :content="cell.mresName" placement="top-start">
	     														<span class="text" style="cursor: pointer;">{{cell.mresName}}</span>
	    												</el-tooltip>
		                        <span class="del" @click="delchooseads(cell,i)"></span></span></div>
		                    </div>
	                   	</div>
                   	</div>
                   	<div class="btn">
                   		<a class="sure" @click="sureads">确定</a>
                   	</div>
                </div>
	            	</div>
	            </el-form-item>
	            </div>
	            </div>
            </div>
            <div class="clear02">
            	<el-form-item>
            		<span class="tit fl">
            			<span>是否为</span>
            			<br> 
            			<el-tooltip class="item" effect="dark" content="设置为惊喜的情况下，客户端将不会展示关键信息， 如“优惠券”“满200减100”等。" placement="top-start">
	     					<i class="icon-intro02"></i>
	    				</el-tooltip>
	    				<span>惊喜</span>	    				
            		</span>
						    <el-radio-group class="mt5" v-model="form.surprise_type">
						      <el-radio :label="1">是</el-radio>
						      <el-radio :label="2">否</el-radio>
						    </el-radio-group>
  						</el-form-item>
            </div>
            <div class="clear02">
            	<el-form-item>
            		<span class="tit fl">选择优 
            			<br> 惠券</span>
						    <div class="fl" @click="DialogVisible()">
						    	<div v-show="couponshow == 'newadd'">
						    	<div class="couponbox" v-show="showtagcoupon == false">
							     <div class="fs30 mt10">
							     	+
							     </div>
							     <div>
							     	选择优惠券
							     </div>
						    	</div>
						    	</div>
						    	<div class="coupon_box f-active" v-show="showtagcoupon == true">
						  			<i class="icon_selected"></i>
						  			<div class="coupon_box_left fl">
						  				<div class="tit01">
						  					<span v-text="subcopon.faceValue"></span>
						  					<span>
							  					<span v-if="subcopon.couponForm==1">元</span>
							  					<span v-else>折</span>
						  					</span>
						  				</div>
						  				<div class="tit02">{{subcopon.content}}</div>
						  			</div>
						  			<div class="coupon_box_right fl">
						  					<div class="tit01">{{subcopon.couponName}}</div>
						  					<div class="tit02">{{subcopon.rangeContent}}</div>
						  					<div class="tit03">{{subcopon.expirationTimeStart}} - {{subcopon.expirationTimeEnd}}</div>
						  			</div>
			  					</div>
			  					
			  					<div class="coupon_box f-active" v-if="(couponshow == 'newedit') && (showtagcoupon == false)">
						  			<i class="icon_selected"></i>
						  			<div class="coupon_box_left fl">
						  				<div class="tit01">
						  					<span>{{editdatas.couponRepresentation.faceValue}}</span>
						  					<span>
							  					<span v-if="editdatas.couponRepresentation.couponForm==1">元</span>
							  					<span v-else>折</span>
						  					</span>
						  				</div>
						  				<div class="tit02">{{editdatas.couponRepresentation.content}}</div>
						  			</div>
						  			<div class="coupon_box_right fl">
						  					<div class="tit01">{{editdatas.couponRepresentation.couponName}}</div>
						  					<div class="tit02">{{editdatas.couponRepresentation.rangeContent}}</div>
						  					<div class="tit03">{{editdatas.couponRepresentation.expirationTimeStart}} - {{editdatas.couponRepresentation.expirationTimeEnd}}</div>
						  			</div>
			  					</div>
						    </div>
  						</el-form-item>
            </div>
        	</el-form>
        </div>
        <div class="poi3 foot">
        	<el-button type="primary" @click="save">保存</el-button>
        	<el-button @click="goback">返回</el-button>
        </div>
    </el-col>
  	<!--选择优惠券弹窗-->
    <el-dialog
			  title="选择优惠券"
			  :visible.sync="centerDialogVisible"
			  width="930px"
			  center>
			  <div class="poi2 text-title">仅领取方式为活动专用的有效优惠券</div>
			  <div class="Choice_coupon">
			  	<div class="Choice_coupon_t">
			  		<div class="couponinput01 mr10">
			  			<el-input placeholder="请输入优惠券名称进行搜索" class="mt0 input" v-model="couponname"></el-input>
			  		</div>
			  		<div class="couponinput01 mr10">
			  			<el-input placeholder="请输入优惠券编号进行搜索" class="mt0 input" v-model="couponid"></el-input>
			  		</div>
			  		<el-button size="small" class="sort mt5" @click="couponsort(couponname,couponid)">查询</el-button>
			  	</div>
			  	<div class="Choice_coupon_b clear02 scrollbar">
			  		<div class="force-overflow">
			  		<div class="fl mr10 coupon_box" v-if="couponshow == 'newadd'" :class="chooseCouponId === list.couponId ? 'f-active' : ''" v-for="list in coupon_list"  @click="chooseCoupon(list)">
			  			<i class="icon_selected"></i>
			  			<div class="coupon_box_left fl">
			  				<div class="tit01">
			  					<span>{{list.faceValue}}</span>
			  					<span>
				  					<span v-if="list.couponForm == 1">元</span>
				  					<span v-else>折</span>
			  					</span>
			  				</div>
			  				<div class="tit02">{{list.content}}</div>
			  			</div>
			  			<div class="coupon_box_right fl">
			  					<div class="tit01">{{list.couponName}}</div>
			  					<div class="tit02">{{list.rangeContent}}</div>
			  					<div class="tit03">{{list.expirationTimeStart}} - {{list.expirationTimeEnd}}</div>
			  			</div>
			  		</div>
			  		<div class="fl mr10 coupon_box" v-if="couponshow == 'newedit'" :class="(chooseCouponId === list.couponId ? 'f-active' : '') || (editdatas.couponRepresentation.couponId == list.couponId? 'f-active':'')"  v-for="list in coupon_list"  @click="chooseCoupon(list)">
			  			<i class="icon_selected"></i>
			  			<div class="coupon_box_left fl">
			  				<div class="tit01">
			  					<span>{{list.faceValue}}</span>
			  					<span>
				  					<span v-if="list.couponForm == 1">元</span>
				  					<span v-else>折</span>
			  					</span>
			  				</div>
			  				<div class="tit02">{{list.content}}</div>
			  			</div>
			  			<div class="coupon_box_right fl">
			  					<div class="tit01">{{list.couponName}}</div>
			  					<div class="tit02">{{list.rangeContent}}</div>
			  					<div class="tit03">{{list.expirationTimeStart}} - {{list.expirationTimeEnd}}</div>
			  			</div>
			  		</div>
			  		</div>
			  	</div>
			  </div>
			  <span slot="footer" class="dialog-footer">
			  	<el-button type="primary" @click="couponsubmint">确 定</el-button>
			    <el-button @click="centerDialogVisible = false">取 消</el-button>
			  </span>
		</el-dialog>  
  	<!--查看全部-->
  	<el-dialog
		  title="已选全部媒体"
		  :visible.sync="centerDialogVisible02"
		  width="980px"
			:before-close="cancelmedia"
		  center>
		  <div class="allbox">
		  	<span v-for="(list,i) in choosen_medialist" :key="i">
		  	<span class="mr10 fl allboxspan mb10" >
		  		<span class="text2">{{list.mediaName}}</span>
		  		<i class="icon_delet02 fr"  @click="delemedia(list,i)"></i>
		  	</span>
		  	</span>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="suredelmedia">确 定</el-button>
		    <el-button @click="cancelmedia">取 消</el-button>
		  </span>
		</el-dialog>
		<el-dialog
		  title="已选全部广告位"
		  :visible.sync="centerDialogVisible03"
		  width="980px"
		  :before-close="cancelads"
		  center>
		  <div class="allbox">
		  	<span v-for="(list,i) in Advertising_choose" :key="i">
		  	<span class="mr10 fl allboxspan mb10">
		  		<span class="text2">{{list.mresName}}</span>
		  		<i class="icon_delet02 fr" @click="deleads(list,i)"></i>
		  	</span>
		  	</span>
		  </div>
		  <span slot="footer" class="dialog-footer">
		  	<el-button type="primary" @click="suredelads">确 定</el-button>
		    <el-button @click="cancelads">取 消</el-button>
		  </span>
		</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
  	return {
  	centerDialogVisible:false,
  	centerDialogVisible02:false,
  	centerDialogVisible03:false,
  	couponshow: '',
  	time:null,
  	toggle: false,   // 媒体切换
  	Advertisetoggle: false,		//广告位切换
  	startTime: null,
  	timeShow: true,
  	adsItemsList: '',
  	togfalse: false,
  	showactive: false,
  	// 所有的省份
    mediaprovince: [],
 		// 可选的城市
    mediacity: [],
    media_list: [],
    choosen_medialist: [],
    surechosen_media:[], //确定的媒体数组
   	surechosen_ads: [], //确定的广告位数组
    medianamelist: [],
    toggleallmedia: true, // 切换全部媒体以及选中媒体
    fivemediaNames: '',
    toggleallads: true, // 切换全部广告位以及选中广告位
    AdvertisingTag: false , //广告位绑定
    resultads: '', // 选择全部的广告位
    neweditshow:'',
    medialist:[],
  	search_params: {
  		mediaName: '', province: '', city: '', regionCode: ''
  	},  								// 媒体查询城市列表
  	ad_search_params: {
  		mediaName: '', province: '', city: '', regionCode: ''
  	},									//广告位查询城市列表
  	pickerBeginDateBefore:{
        disabledDate : (time) => {
          let beginDateVal
          if(this.handle_toggle=='modify' && this.status == 1){
            beginDateVal = this.startTime
            if(beginDateVal){
              return time.getTime() < beginDateVal
            }
          }else{
            beginDateVal = new Date();
            if(beginDateVal){
              return time.getTime()+24*60*60*1000 < beginDateVal
            }
          }
        }
    },
    // 弹出窗
		couponname: '',
		couponid: '',
		coupon_list: [], // 优惠券列表
		chooseCouponId : '', // 选中的优惠券id
		subcopon: '', // 确定的优惠券
		showtagcoupon: false, //显示优惠券或者加上优惠券
//  content: '', link: 'http://'
		mediaNames: '',
		editdatas: '',
		Advertising_list: [], //广告位查询列表
		mediaids: '', //媒体id逗号隔开 
		Advertising_choose: [],  //选中的广告位
		mediads: '',
		fivemediads: '',
		contents: '',
		formarr: [{ mediaName: ''}],
		showads:'' ,
		mediashow: '',
		adsshow: '',
  		form: {activity_name: '', expiration_time_start: '', expiration_time_end: '',range_json: [],media_range_type: '',surprise_type: 2, coupon_id: '',coupon_name: '',ads_range_type:''},
  	}
  },
  watch:{
		// 绑定媒体资源时监控省份，获取城市数据
		'search_params.province': {
			handler (code, oldCode) {
				if (code === '' || code === undefined) {
          this.search_params.city = ''
          this.mediacity = []
          this.getmedialist ()
          return
        }
		if (code !== oldCode) {
		  this.search_params.city = ''
          this.api_businessManagePlatform_allCityList({ 
            data: {
              token: sessionStorage.getItem('access_token'),
              province: code
            },
          }).then(res => {
            this.mediacity = res.content
            console.log('城市',this.mediacity)
            this.getmedialist ()
          })
        }
			},
			deep: true
		},
		//监控城市
  	'search_params.city': {
      handler (code, oldCode) {
          this.getmedialist()
      },
      deep: true
    },
    'ad_search_params.province': {
    	handler (code, oldCode) {
				if (code === '' || code === undefined) {
          this.ad_search_params.city = ''
          this.mediacity = []
          this.getadverlist ()
          return
        }
		if (code !== oldCode) {
			this.ad_search_params.city = ''
          this.api_businessManagePlatform_allCityList({ 
            data: {
              token: sessionStorage.getItem('access_token'),
              province: code
            },
          }).then(res => {
            this.mediacity = res.content
            console.log('城市',this.mediacity)
            this.getadverlist ()
          })
        }
			},
			deep: true
    },
    //监控城市
  	'ad_search_params.city': {
      handler (code, oldCode) {
//        this.getmedialist()
      },
      deep: true
    },
// 是否为全部媒体
//		'form.media_range_type': {
//			if(this.mediaNames === ''){
//				this.form.media_range_type = 1
//			}
//		},
//  监听已选择媒体列表是否为空
    'choosen_medialist': {
      handler (code, oldCode) {
        let _this = this
        if (code.length !== 0) {
          _this.toggleallmedia = false
        } else {
          _this.toggleallmedia = true
        }
      },
      deep: true
    },
    //  监听已选择广告位列表是否为空
    'Advertising_choose': {
      handler (code, oldCode) {
        let _this = this
        if (code.length !== 0) {
          _this.toggleallads = false
        } else {
          _this.toggleallads = true
        }
      },
      deep: true
    },
//   'form.media_range_type': {
//    handler (code, oldCode) {
//      let _this = this
//      if (_this.form.media_range_type === 2) {
//        _this.getadverlist ()
//      }
//    },
//    deep: true
//  },
////  监控数据
//	'form': {
//		handler (code, oldCode) {
//      let _this = this
////      _this.editdata = sessionStorage.getItem('editdata')
//     	if (_this.editdata) {
////form: {activity_name: '', expiration_time_start: '', expiration_time_end: '',range_json: '',media_range_type: '',surprise_type: 1, coupon_id: '',coupon_name: ''},
//		_this.form.activity_name = _this.editdata.activityName
//		
//     	} else{
//     	
//     	}
//    },
//    deep: true
//	}
  },
  methods:{
  couponsort (name,id) {
  	this.getcouponlist(name,id)
//	
  },
	DialogVisible () {
		this.centerDialogVisible=true
		this.getcouponlist ()
		console.log('editdatas',this.editdatas)
	},
  getcouponlist(name,id) {
  	let _this = this
  	_this.api_businessManagePlatform_voucherlist({ 
        data: {
          coupon_no: id,
          coupon_name: name,
        },
      }).then(result => {
         _this.coupon_list = result.content
         console.log('优惠券列表',_this.coupon_list)
      })
  },
  chooseCoupon (coupon) {
  	let _this = this
  	_this.chooseCouponId = coupon.couponId
  	if (this.couponshow == 'newedit') {
  		this.editdatas.couponRepresentation.couponId = ''
  	}

  },
  clickcmt () {
  	this.toggle = !this.toggle
  	this.Advertisetoggle = false
//	choosen_medialist
  	if(this.neweditshow){
  		this.choosen_medialist = [...this.mediashow]
	}
  },
  couponsubmint () {
  	let _this = this
  	for (let i = 0; i < _this.coupon_list.length ; i++) {
  		if (_this.coupon_list[i].couponId == _this.chooseCouponId) {
			_this.subcopon = _this.coupon_list[i]
				console.log('确定的数据',_this.subcopon)
  		}
  	}
  	_this.form.coupon_id = _this.subcopon.couponId
  	_this.form.coupon_name = _this.subcopon.couponName
  	console.log(_this.form.coupon_id)
  	if (_this.subcopon === '') {
  		_this.showtagcoupon = false
  	} else{
  		_this.showtagcoupon = true
  	}
  	_this.centerDialogVisible = false	
  },
	choosemedia (message) {
		let _this = this
//		_this.choosen_medialist = []
      if (message.isCost == false) {
      		let chosen_media = {}
      		chosen_media.mediaId = message.mediaId
			  	chosen_media.mediaName = message.mediaName
			  	chosen_media.adsList = []
			  	chosen_media.mediachose = 0
			  	_this.choosen_medialist.push(chosen_media)
			  	message.isCost = true
			  	chosen_media.mediachose = 1
      }
      _this.medialist = [..._this.choosen_medialist]
     	let array = []
			for (var i = 0; i < _this.medialist.length; i++) {
				array.push(_this.medialist[i].mediaId)
			}
//			console.log('所有媒体ID', array)
			let arr = [] //一个新的临时数组 
			//遍历当前数组 
			for(var i = 0; i < array.length; i++) {
				//如果当前数组的第i已经保存进了临时数组，那么跳过， 
				//否则把当前项push到临时数组里面 
				if (arr.indexOf(array[i]) == -1) {
					arr.push(array[i])
				}
			}
			let arr_list = []
//			let n = 0
			for (let j = 0; j < arr.length; j++) {
//				n = 0
				arr_list[j] = {}
				arr_list[j].adsList = []
				for (let i = 0; i < _this.medialist.length; i++) {
					if (_this.medialist[i].mediaId === arr[j]) {
						arr_list[j].mediaId = _this.medialist[i].mediaId
						arr_list[j].mediaName = _this.medialist[i].mediaName
						arr_list[j].mediachose = _this.medialist[i].mediachose
						_this.choosen_medialist = [...arr_list]
					}
				}
			}
//			console.log("arr",arr_list)
      console.log('已选1',_this.choosen_medialist)
	},
	delchoosemedia (cell,index) {
		let _this = this
		_this.choosen_medialist.splice(index, 1)
		for (let i = 0; i < _this.media_list.length; i++) {
			if (_this.media_list[i].mediaId == cell.mediaId) {
				_this.media_list[i].isCost = false
			}
		}
	},
	// 选择全部媒体
  select_all_media () {
  	this.choosen_medialist = []
    this.toggleallmedia = true
  },
	//	确定选择的媒体
	suremedia () {
		let _this = this
		_this.mediaNames = ''
		_this.fivemediaNames = ''
		_this.form.range_json = []
		_this.neweditshow = false
		_this.surechosen_media = [..._this.choosen_medialist]
		console.log('确定的媒体选项',_this.surechosen_media)
		if (_this.toggleallmedia == true) {
			_this.mediaNames = '全部媒体'
			_this.form.media_range_type = 1
			_this.AdvertisingTag = false
			_this.form.ads_range_type = 1
			_this.toggle = false			
//			console.log('json',_this.form.range_json)
		}else{
			if(_this.mediads === '全部广告位'){
				for (var i = 0; i < _this.resultads.length; i++) {
				for (var j = 0; j < _this.resultads[i].adsList.length; j++) {
					_this.resultads[i].adsList[j].adsId =_this.resultads[i].adsList[j].mresId
					_this.resultads[i].adsList[j].adsName =_this.resultads[i].adsList[j].mresName
				}
			}
			_this.form.range_json = _this.resultads
			}
			_this.form.media_range_type = 2
			_this.AdvertisingTag = true
			_this.Advertising_list = []
			_this.mediaids = ''
			_this.Advertising_choose = []
			_this.fivemediads = ''
			_this.showads = false
			_this.mediads = ''
			_this.surechosen_media.forEach((item, i) => {
				if (i < 5 ) {
				_this.fivemediaNames += _this.surechosen_media[i].mediaName + ','
				}
					_this.mediaids += _this.surechosen_media[i].mediaId + ','
      		_this.mediaNames += _this.surechosen_media[i].mediaName + ','
          if (i === _this.surechosen_media.length - 1) {
            _this.toggle = false
          }
//        console.log("mediaids",_this.mediaids)
      	})
			_this.getadverlist ()
		}		
	},
	sureads () {
		let _this = this
		_this.Advertisetoggle = false
		_this.showads = true
		_this.mediads = ''
		_this.fivemediads = ''
//		let n = 0
		_this.surechosen_ads = [..._this.Advertising_choose]
		if (_this.toggleallads == true) {
			_this.mediads = '全部广告位'
			_this.form.ads_range_type = 1
			for (var i = _this.resultads.length-1; i > -1 ; i--) {	
				if (_this.resultads[i].adsList.length === 0) {
					console.log(i)
						_this.resultads.splice(i,1)
				}
			}
			for (var i = 0; i < _this.resultads.length; i++) {	
				for (var j = 0; j < _this.resultads[i].adsList.length; j++) {				
					_this.resultads[i].adsList[j].adsId =_this.resultads[i].adsList[j].mresId
					_this.resultads[i].adsList[j].adsName =_this.resultads[i].adsList[j].mresName					
				}
			}
			_this.form.range_json = _this.resultads
			console.log("全部广告位",_this.resultads)
		} else{
			let array = []
			for (var i = 0; i < _this.surechosen_ads.length; i++) {
				array.push(_this.surechosen_ads[i].mediaId)
			}
//			console.log('所有媒体ID', array)
			let arr = [] //一个新的临时数组 
			//遍历当前数组 
			for(var i = 0; i < array.length; i++) {
				//如果当前数组的第i已经保存进了临时数组，那么跳过， 
				//否则把当前项push到临时数组里面 
				if (arr.indexOf(array[i]) == -1) {
					arr.push(array[i])
				}
			}
//			console.log('去重', arr)
			let arr_list = []
			let n = 0
			for (let j = 0; j < arr.length; j++) {
				arr_list[j] = {}
				arr_list[j].adsList = []
				n = 0
				for (let i = 0; i < _this.surechosen_ads.length; i++) {
					if (_this.surechosen_ads[i].mediaId === arr[j]) {
						arr_list[j].mediaId = _this.surechosen_ads[i].mediaId
						arr_list[j].mediaName = _this.surechosen_ads[i].mediaName
						arr_list[j].adsList[n] = {}
						arr_list[j].adsList[n].adsId = _this.surechosen_ads[i].mresId
						arr_list[j].adsList[n].adsName = _this.surechosen_ads[i].mresName
						n++
					}
				}
			}
			_this.form.range_json = arr_list
			_this.form.ads_range_type = 2
//			console.log("广告位1",this.Advertising_choose)
//			console.log('广告位处理后', arr_list)
//			adsList
//			console.log("range_json",_this.form.range_json)
			_this.surechosen_ads.forEach((item, i) => {
				if (i < 5 ) {
				_this.fivemediads += _this.surechosen_ads[i].mresName + ','
				}
         	_this.mediads += _this.surechosen_ads[i].mresName + ','
          if (i === _this.surechosen_ads.length - 1) {
            _this.Advertisetoggle = false
          }
      })					
	}
	},
//	查看删除操作
	delemedia (list,index) {
		let _this = this
		_this.choosen_medialist.splice(index, 1)
		console.log('01',_this.surechosen_media)
		console.log('02',_this.choosen_medialist)
		
		for (let i = 0; i < _this.media_list.length; i++) {
			if (_this.media_list[i].mediaId == list.mediaId) {
				_this.media_list[i].isCost = false
			}
		}
	},
	
	deleads (list,index) {
		let _this = this
		_this.Advertising_choose.splice(index, 1)
		for (let i = 0; i < _this.Advertising_list.length; i++) {
			for (let j = 0; j < _this.Advertising_list[i].length; j++) {
				if (_this.Advertising_list[i][j].mresId == list.mresId) {
				_this.Advertising_list[i][j].icost = false				
				}
			}		
		}
	},
	suredelads () {
		let _this = this
		_this.centerDialogVisible03 = false		
		_this.Advertisetoggle = false
		_this.showads = true
		_this.mediads = ''
		_this.fivemediads = ''
		_this.surechosen_ads = [..._this.Advertising_choose]
		if (_this.toggleallads == true) {
			_this.mediads = '全部广告位'
			_this.form.ads_range_type = 1
			for (var i = 0; i < _this.resultads.length; i++) {
				for (var j = 0; j < _this.resultads[i].adsList.length; j++) {
					_this.resultads[i].adsList[j].adsId =_this.resultads[i].adsList[j].mresId
					_this.resultads[i].adsList[j].adsName =_this.resultads[i].adsList[j].mresName
				}
			}
			_this.form.range_json = _this.resultads
//			console.log("全部广告位",_this.resultads)
		} else{
			let array = []
			for (var i = 0; i < _this.surechosen_ads.length; i++) {
				array.push(_this.surechosen_ads[i].mediaId)
			}
//			console.log('所有媒体ID', array)
			let arr = [] //一个新的临时数组 
			//遍历当前数组 
			for(var i = 0; i < array.length; i++) {
				//如果当前数组的第i已经保存进了临时数组，那么跳过， 
				//否则把当前项push到临时数组里面 
				if (arr.indexOf(array[i]) == -1) {
					arr.push(array[i])
				}
			}
//			console.log('去重', arr)
			let arr_list = []
			let n = 0
			for (let j = 0; j < arr.length; j++) {
				arr_list[j] = {}
				arr_list[j].adsList = []
				n = 0
				for (let i = 0; i < _this.surechosen_ads.length; i++) {
					if (_this.surechosen_ads[i].mediaId === arr[j]) {
						arr_list[j].mediaId = _this.surechosen_ads[i].mediaId
						arr_list[j].mediaName = _this.surechosen_ads[i].mediaName
						arr_list[j].adsList[n] = {}
						arr_list[j].adsList[n].adsId = _this.surechosen_ads[i].mresId
						arr_list[j].adsList[n].adsName = _this.surechosen_ads[i].mresName
						n++
					}
				}
			}
			_this.form.range_json = arr_list
			_this.form.ads_range_type = 2
//			console.log("广告位1",this.Advertising_choose)
//			console.log('广告位处理后', arr_list)
//			adsList
//			console.log("range_json",_this.form.range_json)
			_this.surechosen_ads.forEach((item, i) => {
				if (i < 5 ) {
				_this.fivemediads += _this.surechosen_ads[i].mresName + ','
				}
         	_this.mediads += _this.surechosen_ads[i].mresName + ','
          if (i === _this.surechosen_ads.length - 1) {
            _this.Advertisetoggle = false
          }
      })					
	}
	},
	cancelads () {
		let _this = this
		_this.centerDialogVisible03 = false
		_this.Advertising_choose = [..._this.surechosen_ads]
	},
	suredelmedia () {
		let _this = this
		_this.mediaNames = ''
		_this.fivemediaNames = ''
		_this.form.range_json = []
		_this.neweditshow = false
		_this.centerDialogVisible02 = false
		_this.surechosen_media = [..._this.choosen_medialist]
		
		console.log('确定的媒体选项',_this.surechosen_media)
		if (_this.toggleallmedia == true) {
			_this.mediaNames = '全部媒体'
			_this.form.media_range_type = 1
			_this.AdvertisingTag = false
			_this.form.ads_range_type = 1
			_this.toggle = false			
//			console.log('json',_this.form.range_json)
		}else{
			if(_this.mediads === '全部广告位'){
				for (var i = 0; i < _this.resultads.length; i++) {
				for (var j = 0; j < _this.resultads[i].adsList.length; j++) {
					_this.resultads[i].adsList[j].adsId =_this.resultads[i].adsList[j].mresId
					_this.resultads[i].adsList[j].adsName =_this.resultads[i].adsList[j].mresName
				}
			}
			_this.form.range_json = _this.resultads
			}
			_this.form.media_range_type = 2
			_this.AdvertisingTag = true
			_this.Advertising_list = []
			_this.mediaids = ''
			_this.Advertising_choose = []
			_this.fivemediads = ''
			_this.showads = false
			_this.mediads = ''
			_this.surechosen_media.forEach((item, i) => {
				if (i < 5 ) {
				_this.fivemediaNames += _this.surechosen_media[i].mediaName + ','
				}
					_this.mediaids += _this.surechosen_media[i].mediaId + ','
      		_this.mediaNames += _this.surechosen_media[i].mediaName + ','
          if (i === _this.surechosen_media.length - 1) {
            _this.toggle = false
          }
//        console.log("mediaids",_this.mediaids)
      	})
			_this.getadverlist ()
		}				
	},
	cancelmedia () {
		this.centerDialogVisible02 = false
		this.choosen_medialist = [...this.surechosen_media]		
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
//		获取媒体列表
  	getmedialist () {
  		let _this = this
  		_this.search_params.regionCode = _this.search_params.city ? _this.search_params.city : _this.search_params.province
  		_this.api_businessManagePlatform_mediaList({ 
        data: {
          regionCode: _this.search_params.regionCode,
          mediaName: _this.search_params.mediaName,
          token: sessionStorage.getItem('access_token')
        },
      }).then(result => {
         _this.media_list = result.content
         for (let i = 0; i < _this.media_list.length; i++) {
         	_this.media_list[i].isCost = false
         }
//        console.log('媒体列表', _this.media_list)
      })
  	},
	//	获取广告位列表
	getadverlist () {
		let _this = this
		_this.ad_search_params.regionCode = _this.ad_search_params.city ? _this.ad_search_params.city : _this.ad_search_params.province		
		_this.api_businessManagePlatform_Advertisinglist({ 
        data: {
       		regionCode: _this.ad_search_params.regionCode,
       		mresName: _this.ad_search_params.mediaName,
          mediaIds: _this.mediaids,
          rows: 10,
          pageNumber: 1
        },
      }).then(result => {
//    	 let contents
         _this.contents = result.content
         _this.resultads = result.content
         _this.Advertising_list = []
//       console.log('广告位列表01', _this.contents)
         for (let i = 0; i < _this.contents.length; i++) {
         	for (let j = 0; j < _this.contents[i].adsList.length; j++) {
         		_this.contents[i].adsList[j].mediaId = _this.contents[i].mediaId
         		_this.contents[i].adsList[j].mediaName = _this.contents[i].mediaName
         		_this.contents[i].adsList[j].icost = false
         	}
         	 _this.Advertising_list.push(_this.contents[i].adsList)      	
         }
//       console.log('广告位列表02', _this.Advertising_list)
      })
	},
	Advertising (adver) {
//		console.log("xuzn",adver)
		  let _this = this
	      if (adver.icost == false) {
	      	adver.icost = true
	      	let chosen_ads = {}
      			chosen_ads.mresId = adver.mresId
			  	chosen_ads.mresName = adver.mresName
			  	chosen_ads.mediaId = adver.mediaId
			  	chosen_ads.mediaName = adver.mediaName
					chosen_ads.icost = adver.icost
			  	if (JSON.stringify(_this.Advertising_choose).indexOf(chosen_ads.mresId) !== -1) {
			  		return
			  	} else {
			  		_this.Advertising_choose.push(chosen_ads)
			  	}
	      }
	},
	delchooseads (cell,index) {
		let _this = this
		_this.Advertising_choose.splice(index, 1)
		for (let i = 0; i < _this.Advertising_list.length; i++) {
			for (let j = 0; j < _this.Advertising_list[i].length; j++) {
				if (_this.Advertising_list[i][j].mresId == cell.mresId) {
				_this.Advertising_list[i][j].icost = false				
				}
			}
			
		}
	},
	choseads () {
		this.Advertisetoggle = !this.Advertisetoggle
	},
  	// 获取省列表 列表
    get_addr () {
      this.api_businessManagePlatform_allProvList({ 
        data: {
          token: sessionStorage.getItem('access_token')
        },
      }).then(result => {
        this.mediaprovince = result.content
        this.getmedialist ()
//      console.log('省份',this.mediaprovince)
      })
    },
  	checkName () {
      let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
      let value = this.form.activity_name.replace(/(^\s*)|(\s*$)/g,"")
//    console.log('活动标题',value)
      if (!value) {
        return this.$message.error('活动标题不能为空');
      }
      if (!deg.test(value)) {
        return this.$message.error('支持中英文，15个字符以内，不支持特殊符号,中间不能有空格！');
      }
    },
  	coupontyle () {
    	this.couponshow = sessionStorage.getItem('coupontype')
//  	console.log('editdatas',this.editdatas)
			
		if (this.couponshow == 'newadd') {
				
//			form: {activity_name: '', expiration_time_start: '', expiration_time_end: '',range_json: '',media_range_type: '',surprise_type: 1, couponId: '',coupon_name: ''}
			this.form = {activity_name: '', expiration_time_start: '', expiration_time_end: '',range_json: '',media_range_type: '',surprise_type: 2, coupon_id: '',coupon_name: '',ads_range_type:''}
		} else if(this.couponshow == 'newedit'){
			this.time = []
			this.editdatas = JSON.parse(sessionStorage.getItem('editdata'))
			this.neweditshow = true
			this.form.activity_name = this.editdatas.activityName
			this.time[0] = this.editdatas.showTimeStart
			this.time[1] = this.editdatas.showTimeEnd
			this.time = [new Date(this.editdatas.showTimeStart),new Date(this.editdatas.showTimeEnd)]
			this.form.surprise_type = this.editdatas.surpriseType
			this.form.coupon_id = this.editdatas.couponRepresentation.couponId
			this.form.coupon_name = this.editdatas.couponRepresentation.couponName
			this.form.media_range_type = this.editdatas.mediaRangeType
			this.mediashow = this.editdatas.mediaItemsList
			this.adsshow = this.editdatas.adsItemsList
//			console.log('hah',this.adsshows)
//			for(var i = 0; i < this.editdatas.adsItemsList.length; i++) {
//				this.mediaids += this.editdatas.adsItemsList[i].mediaId + ','
//			}
			if ( this.editdatas.mediaRangeType == 1) {
				this.form.range_json = []
				this.form.ads_range_type = 1
			} else if(this.editdatas.mediaRangeType == 2){
				this.form.ads_range_type = 2
				this.form.range_json = this.adsItemsList
				console.log('form03',this.form.range_json)
			}
//			this.mediaNames
			this.timeCheck ()
//			console.log('editdatas',this.editdatas)
		}
  	},
  	getdetail () {
  		this.editdatas = JSON.parse(sessionStorage.getItem('editdata'))
  		this.api_businessManagePlatform_editdetailcoupon({ 
	          data:{
	          	systemAccessToken: sessionStorage.getItem('access_token'),
          		activity_id: this.editdatas.activityId
	          },
	        }).then(result => {
			  this.adsItemsList = result.content.mediaItemsList
			  this.form.range_json = this.adsItemsList
	        })
  	},
  	 // 时间赋值
    timeCheck () {
      let that = this
      if (that.time != null) {
        if(that.handle_toggle=='modify' && that.status == 1){
          if(that.time[0] != that.timeChecked[0]){
            that.$message({
              message: '开始日期不可更改',
              type: 'warning'
            });
            that.timeShow = false
            that.time = that.timeChecked
            that.form.expiration_time_start = that.time[0]
            that.form.expiration_time_end = that.time[1]
            that.$nextTick(()=>{
              that.timeShow = true
            })
          }else if(that.time[1] < that.date_format(new Date, 'yyyy-MM-dd')){
            that.$message({
              message: '结束日期不能小于今天',
              type: 'warning'
            });
            that.timeShow = false
            that.time = that.timeChecked
            that.form.expiration_time_start = that.time[0]
            that.form.expiration_time_end = that.time[1]
            that.$nextTick(()=>{
              that.timeShow = true
            })
          }else{
            that.form.expiration_time_start = that.time[0]
            that.form.expiration_time_end = that.time[1]
          }
        }else{
          that.form.expiration_time_start = that.time[0]
          that.form.expiration_time_end = that.time[1]
        }
      } else {
        that.form.expiration_time_start = ''
        that.form.expiration_time_end = ''
      }
    },
    // 用于生成uuid
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    guid () {
      return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
    },
    goto (path) {
        this.$router.push({path: path})
    },
    save () {
    	let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
    	let value = this.form.activity_name.replace(/(^\s*)|(\s*$)/g,"")
    	if (!value) {
        return this.$message.error('活动标题不能为空');
      	}
    	if (!deg.test(value)) {
        return this.$message.error('支持中英文，15个字符以内，不支持特殊符号,中间不能有空格！');
      	}
    	if (this.time == null) {
        return this.$message.error('展示时间不能为空！')
      }
//  	form: {activity_name: '', expiration_time_start: '', expiration_time_end: '',range_json: [],media_range_type: '',surprise_type: 1, coupon_id: '',coupon_name: '',ads_range_type:''},
    	if (this.form.surprise_type == '') {
        return this.$message.error('请选择惊喜！')
     	}
//  	console.log('newadd',this.form)
    	if(this.form.media_range_type == 2) {
    		if (JSON.stringify(this.form.range_json) == '[]') {
        	return this.$message.error('媒体广告位未操作！')
     	}
    	}    	
		if(this.form.media_range_type == '') {   		
        	return this.$message.error('媒体广告位未操作！')
    	}  
    	for (let i = 0; i < this.form.range_json.length; i++){
//			console.log('formrange_json',JSON.stringify(this.form.range_json[i].adsList))
    		if (JSON.stringify(this.form.range_json[i].adsList)  == '[]') {
    			return this.$message.error('媒体广告位未操作！')
    		}    		
    	}
    	if(this.form.coupon_id == '') {
    		return this.$message.error('选择优惠券未操作！')
    	}
    	if (this.couponshow == 'newadd') {
	    	this.api_businessManagePlatform_addcoupon({ 
	    	  headers:{'Content-Type':'application/json'},
	          data: Object.assign({}, this.form, {
	          	activity_id: this.guid(),
	          	range_json:JSON.stringify(this.form.range_json),
	            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
	            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
	            systemAccessToken: sessionStorage.getItem('access_token')
	          }),
	        }).then(result => {
			  	this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing?id=001')
	          this.choosen_medialist = []
	          this.time = null
	        })
    	} else if(this.couponshow == 'newedit'){
    		console.log('edit',this.form)
//  		 this.coupontyle ()
    		this.api_businessManagePlatform_editcoupon({ 
	    	  headers:{'Content-Type':'application/json'},
	          data: Object.assign({}, this.form, {
	          	activity_id: this.editdatas.activityId,
	          	range_json:JSON.stringify(this.form.range_json),
	            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
	            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
	            systemAccessToken: sessionStorage.getItem('access_token')
	          }),
	        }).then(result => {
			  this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing?id=001')
//	          this.choosen_medialist = []
//	          this.time = null
	        })
	       
    	}
    },
    goback () {
    	this.goto('/m/clientFunManage/mapTreasureHunt/treasureHuntMarketing?id=001')
    }
  },
  mounted () {
  	this.coupontyle()
  	if(this.couponshow == 'newedit'){
  		this.getdetail ()
  	}  	
  	this.get_addr()
  	this.getmedialist()
  }
}
</script>
<style lang="scss" scoped>  
.addcouponbox{
	width: 100%;
	min-height: 350px;
	background: #fff;
	margin-top: 10px;
	padding-left: 30px;
	padding-top: 20px;
	padding-bottom: 10px;
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
.icon-intro02{
		background: url(../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
		width: 15px;
	    height: 15px;
	    display: inline-block;
	    cursor: pointer;
		}
.icon_delet02{
      width: 16px;
      height: 20px;
      display: inline-block;
      background: url(../../../../../static/images/businessManage/icon_delet02.png) no-repeat center;
      margin-top: 20px;
      cursor: pointer;
      margin-top: 5px;
      margin-right: 5px;
}
.pl87{
	padding-left: 87px;
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
			  line-height: 15px;
			  }
			  .tit01{
			  	line-height: 25px;
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
        width:210px;
        border-right: 1px  solid  #BFC1CB ;
       	min-height: 417px;
       	max-height: 417px;
       	overflow: hidden;
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
                width: 100%;
			    overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
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
          width: 128px;
          max-height: 397px;
    			overflow: auto;
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
              max-width:98px;
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
		overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
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
.poi2{
	position: absolute;
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
.text-title{
	text-align: center;
	color: #F5BD23;
	font-size: 12px;
	top: 53px;
    left: 50%;
    margin-left: -96px;
}
.text2{
		display: inline-block;
    width: 178px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.text02{
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>