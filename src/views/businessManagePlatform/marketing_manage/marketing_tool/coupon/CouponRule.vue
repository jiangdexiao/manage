<template>
	<div class="Issuing_coupons_container">
		<el-col :span="24" class="toolbar">
			<div class="Issuing_coupons poi1">
				<!--切换栏-->
				<div class="nav_container">
					<div class="navli">
						<a :class="showactive=='success'?'f_active':''" @click="show_active('success')">支付成功优惠券领取规则</a>
					</div>
					<div class="navli">
						<a :class="showactive=='share'?'f_active':''" @click="show_active('share')">推荐好友注册成功优惠券领取规则</a>
					</div>
					<div class="navli">
						<a :class="showactive=='hand'?'f_active':''" @click="show_active('hand')">手动发放优惠券</a>
					</div>
				</div>
				<!--支付成功优惠券领取规则-->
				<div class="Issuingcen01" v-show="showactive=='success'">
					<div class="Issuing_bt">
						<span class="mr5">付款后优惠券领取规则设置</span>
						<el-tooltip placement="right">
							<div slot="content">
								1.若有多条订单限定重复的规则，则用户每次达到条件，随机采取一条<br/> 2.无领取规则设置,用户支付完成后，无优惠券领取
								<br/> 3.优惠券分享最多领取多少张，决定于分享后可以被领取多少张
								<br/>
							</div>
							<i class="icon-intro"></i>
						</el-tooltip>
					</div>
					<div class="Issuing_ct clear02 ">
						<div class="add_button fl">
							<el-button class="mr20 hght50" type="primary" plain @click="NewaddReceive">新增领取规则</el-button>
						</div>
						<div class="range hght50">
							<span class="mr5">优惠券分享最多领取</span>
							<el-input placeholder="" v-model="constant.maxShareUser" class="widnone mr20 mt5">
								<i slot="suffix" class="el-input__icon fontstyle">人</i>
							</el-input>
							<span class="greycolor mr10">最少1人，最多15人</span>
							<span class="mr5">相同订单金额最高发</span>
							<el-input placeholder="" v-model="constant.maxNumOfRule" class="widnone mt5">
								<i slot="suffix" class="el-input__icon fontstyle">张</i>
							</el-input>
							<span class="greycolor">最少1张，最多5张</span>
							<el-button class="mr20 fr mt5" type="primary" @click="edit_constant">确定</el-button>
						</div>
					</div>
					<div class="Issuing_table">
						<el-table :data="paid_coupon_list" slot="empty" stripe style="width: 100%; margin-top: 20px">
							<el-table-column label="操作" width="100">
								<template slot-scope="scope">
									<el-button @click="suc_edit(scope.row)" type="text" size="small">编辑</el-button>
									<el-button @click="suc_del(scope.row)" type="text" style="color: red;" size="small">删除</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="ruleName" label="规则名称" width="180">
							</el-table-column>
							<el-table-column prop="ruleNo" label="规则编号">
							</el-table-column>
							<el-table-column prop="couponName" label="优惠券名称">
							</el-table-column>
							<el-table-column prop="couponValue" label="优惠券面值">
								<template slot-scope="scope">
									<span>{{scope.row.couponValue}}{{scope.row.couponForm == 1 ? '元':'折'}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="limit" label="领取条件" width="250">
								<template slot-scope="scope">
									<span v-if="scope.row.limit === '无限制'">{{scope.row.limit}}</span>
									<span v-if="scope.row.limit !== '无限制'">{{scope.row.limit}}元</span>
								</template>
							</el-table-column>
							<el-table-column label="已领取/总数" width="250">
								<template slot-scope="scope">
									<span>{{scope.row.couponTotal-scope.row.couponRemain}}/{{scope.row.couponTotal}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="创建时间" width="250">
							</el-table-column>
						</el-table>
					</div>
				</div>
				<!--新增领取规则  请做判断,此弹窗有多处可复用-->
				<div class="poi2 newaddReceive" v-show="newaddReceive">
					<div class="newadd01">
						<span class="newaddspan mr5">规则名称</span>
						<input class="newaddinput el-input__inner fs14" v-show="showactive=='success'" v-model="paid_coupon_rule.rule_name" placeholder="请输入您需要新增的规则名称(1-15位)" @blur="nameRule" :maxlength="15" />
						<input class="newaddinput el-input__inner fs14" v-show="showactive=='share'" v-model="recommend_coupon_rule.rule_name" placeholder="请输入您需要新增的规则名称(1-15位)" @blur="nameRule" :maxlength="15" />
					</div>
					<div class="newadd01 mt20 clear02">
						<!--<span class="newaddspan mr5 fl">优惠券选择</span>-->
						<span class="newaddspan mr5 fl">优惠券<br/> 选择
						</span>
						<!--<div v-show="add_show" class="add_quan fl mr5" @click="centerDialogVisible = true">-->
						<div v-show="add_show" class="add_quan fl mr5" @click="open_up">
							<div class="jiahao fl">
								+
							</div>
							<span class="c_jh fl">选择</span>
						</div>
						<div class="edit_quan fl mr5 ml10" v-if="!add_show && showactive == 'share'" @click="centerDialogVisible = true">
							<div class="Select_box f-active">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h" v-if="sel_coupon.share.same == 1">{{sel_coupon.share.faceValue}}{{sel_coupon.share.couponForm == 1 ? '元':'折'}}</span>
										<span class="tit_s_s tit_s_h" v-if="sel_coupon.share.same == 0 && (sel_coupon.share.minValue.length + sel_coupon.share.maxValue.length <= 6)">{{sel_coupon.share.minValue}}~{{sel_coupon.share.maxValue}}{{sel_coupon.share.couponForm == 1 ? '元':'折'}}</span>
										<div v-if="sel_coupon.share.same == 0 && (sel_coupon.share.minValue.length + sel_coupon.share.maxValue.length > 6)">
											<p class="tit_s_s tit_h">{{sel_coupon.share.minValue}}{{sel_coupon.share.couponForm == 1 ? '元':'折'}}</p>
											<p class="tit_s_s tit_h">~</p>
											<p class="tit_s_s tit_h">{{sel_coupon.share.maxValue}}{{sel_coupon.share.couponForm == 1 ? '元':'折'}}</p>
										</div>
									</div>
									<div class="tit_s_s ">
										{{sel_coupon.share.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{sel_coupon.share.couponName}}</div>
									<div class="tit02">{{sel_coupon.share.rangeContent}}</div>
									<div class="tit02">{{sel_coupon.share.expirationTimeStart}} - {{sel_coupon.share.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
						<div class="edit_quan fl mr5 ml10" v-if="!add_show && showactive == 'success'" @click="centerDialogVisible = true">
							<div class="Select_box f-active">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h" v-if="sel_coupon.success.same == 1">{{sel_coupon.success.faceValue}}{{sel_coupon.success.couponForm == 1 ? '元':'折'}}</span>
										<span class="tit_s_s tit_s_h" v-if="sel_coupon.success.same == 0 && (sel_coupon.success.minValue.length + sel_coupon.success.maxValue.length <= 6)">{{sel_coupon.success.minValue}}~{{sel_coupon.success.maxValue}}{{sel_coupon.success.couponForm == 1 ? '元':'折'}}</span>
										<div v-if="sel_coupon.success.same == 0 && (sel_coupon.success.minValue.length + sel_coupon.success.maxValue.length > 6)">
											<p class="tit_s_s tit_h">{{sel_coupon.success.minValue}}{{sel_coupon.success.couponForm == 1 ? '元':'折'}}</p>
											<p class="tit_s_s tit_h">~</p>
											<p class="tit_s_s tit_h">{{sel_coupon.success.maxValue}}{{sel_coupon.success.couponForm == 1 ? '元':'折'}}</p>
										</div>
									</div>
									<div class="tit_s_s ">
										{{sel_coupon.success.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{sel_coupon.success.couponName}}</div>
									<div class="tit02">{{sel_coupon.success.rangeContent}}</div>
									<div class="tit02">{{sel_coupon.success.expirationTimeStart}} - {{sel_coupon.success.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
						<!--支付成功优惠券领取规则-->
						<div class="add_tit fl" v-show="showactive=='success'">
							该操作旨在设置用户支付完成后可领取的优惠券。若设置了领取条件门槛，则必须大于或等于该金额区间，才可领取该优惠券。
						</div>
						<!--推荐好友注册成功优惠券领取规则-->
						<div class="add_tit fl" v-show="showactive=='share'">
							该操作旨在设置用户推荐好友，对方注册后可领取的优惠券，每个用户均可享受一次。
						</div>
					</div>
					<div class="newadd01 mt20 " v-show="showactive=='success'">
						<span class="newaddspan mr5">领取条件</span>
						<el-radio-group v-model="paid_coupon_rule.rule_limit_status">
							<el-radio label="1">限制领取订单金额</el-radio>
							<el-radio label="2">不限制</el-radio>
						</el-radio-group>
					</div>
					<div class="newadd01 mt20" v-show="showactive=='success' && paid_coupon_rule.rule_limit_status == '1'">
						<span class="newaddspan mr5"></span>
						<el-input placeholder="" v-model="paid_coupon_rule.rule_limit_min" @blur="amount_limit" class="widnone" :maxlength="9">
							<i slot="suffix" class="el-input__icon fontstyle">元</i>
						</el-input>
						<span>~</span>
						<el-input placeholder="" v-model="paid_coupon_rule.rule_limit_max" @blur="amount_limit" class="widnone" :maxlength="9">
							<i slot="suffix" class="el-input__icon fontstyle">元</i>
						</el-input>
					</div>
					<div class="footer">
						<el-button type="primary" @click="addReceive">确定</el-button>
						<el-button @click="cancleAddReceive">取 消</el-button>
					</div>
				</div>
				<!--新增优惠券--优惠券选择-请做判断,此弹窗有多处可复用-->
				<el-dialog title="选择优惠券" :beforeClose='coupon_select_cancle' :visible.sync="centerDialogVisible" width="920px" center>
					<div class="Select_coupons">
						<div class="Select_coupons_t">
							<div class="pt3 mr20">
								<el-input v-if="showactive != 'hand'" v-model="share_list_parmas.coupon_name" class="" placeholder="请输入优惠券名称进行搜索"></el-input>
								<el-input v-if="showactive == 'hand'" v-model="cashAndDiscount_parmas.coupon_name" class="" placeholder="请输入优惠券名称进行搜索"></el-input>
							</div>
							<!--<input placeholder="" class=" el-input__inner" />-->
							<div class="pt3 mr20">
								<el-input v-if="showactive != 'hand'" v-model="share_list_parmas.coupon_no" class="mr20" placeholder="请输入优惠券编号进行搜索"></el-input>
								<el-input v-if="showactive == 'hand'" v-model="cashAndDiscount_parmas.coupon_no" class="mr20" placeholder="请输入优惠券编号进行搜索"></el-input>
							</div>
							<div class="pt3">
								<el-button type="primary" v-if="showactive != 'hand'" @click="get_share_list" plain>查询</el-button>
								<el-button type="primary" v-if="showactive == 'hand'" @click="get_cashAndDiscount" plain>查询</el-button>
								<el-button type="primary" @click="reset" plain>重置查询条件</el-button>
							</div>
						</div>
						<div class="Select_coupons_b clear02" v-if="showactive != 'hand'" @scroll="lazyload">
							<!--控制class名字f-active出现时为选中效果-->
							<div v-for="(item,i) in coupon_list" :key='i' class="fl mr10 Select_box" :class="pre_sel_coupon.couponId == item.couponId?'f-active':''" @click="Selectcouponsactive(item)">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h" v-if="item.same == 1">{{item.faceValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<span class="tit_s_s tit_s_h" v-if="item.same == 0 && (item.minValue.length + item.maxValue.length <= 6)">{{item.minValue}}~{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
										<div v-if="item.same == 0 && (item.minValue.length + item.maxValue.length > 6)">
											<p class="tit_s_s tit_h">{{item.minValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
											<p class="tit_s_s tit_h">~</p>
											<p class="tit_s_s tit_h">{{item.maxValue}}{{item.couponForm == 1 ? '元':'折'}}</p>
										</div>
									</div>
									<div class="tit_s_s ">
										{{item.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div>{{item.couponName}}</div>
									<div class="tit02">{{item.rangeContent}}</div>
									<div class="tit02">{{item.expirationTimeStart}} - {{item.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
						<div class="Select_coupons_b clear02" v-if="showactive == 'hand'" @scroll="lazyload">
							<div v-for="(item,i) in cashAndDiscount_list" :key='i' class="fl mr10 Select_box" :class="pre_sel_coupon.couponId == item.couponId?'f-active':''" @click="Selectcouponsactive(item)">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{item.faceValue}}{{item.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{item.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div>{{item.couponName}}</div>
									<div class="tit02">{{item.rangeContent}}</div>
									<div class="tit02">{{item.expirationTimeStart}} - {{item.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="coupon_selected">确 定</el-button>
						<el-button @click="coupon_select_cancle">取 消</el-button>
						<!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
					</span>
				</el-dialog>
				<!--推荐好友注册成功优惠券领取规则-->
				<div class="Issuingcen02" v-show="showactive=='share'">
					<div class="Issuing_bt">
						<span class="mr5">推荐好友注册优惠券规则设置</span>
						<el-tooltip placement="right">
							<div slot="content">
								1.无推荐规则设置则客户端推荐无优惠券领取功能<br/> 2.每个用户限制只能享受一次
								<br/> 3.双方获得的优惠券相同
								<br/> 4.生效的规则只能有一条，可以手动生效其他规则，原生效规则将自动失效
								<br/>
							</div>
							<i class="icon-intro"></i>
						</el-tooltip>
					</div>
					<div class="Issuing_ct clear02 ">
						<div class="add_button fl">
							<el-button class="mr20 hght50" type="primary" plain @click="NewaddReceive">新增领取规则</el-button>
						</div>
					</div>
					<div class="Issuing_table">
						<el-table :data="recommend_coupon_list" slot="empty" stripe style="width: 100%; margin-top: 20px">
							<el-table-column label="操作" width="130">
								<template slot-scope="scope">
									<el-button @click="share_edit(scope.row)" type="text" size="small">编辑</el-button>
									<el-button @click="share_del(scope.row)" type="text" size="small" style="color:red">删除</el-button>
									<el-button v-if="scope.row.ruleStatus == 0" @click="share_effect(scope.row)" type="text" size="small" style="color:#80D7EE;">生效</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="ruleName" label="规则名称" width="180">
							</el-table-column>
							<el-table-column prop="ruleNo" label="规则编号">
							</el-table-column>
							<el-table-column label="状态">
								<template slot-scope="scope">
									<span>{{scope.row.ruleStatus == 0? '未生效':'已生效'}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="couponName" label="优惠券名称">
							</el-table-column>
							<el-table-column prop="couponValue" label="优惠券面值">
								<template slot-scope="scope">
									<span>{{scope.row.couponValue}}{{scope.row.couponForm == 1 ? '元':'折'}}</span>
								</template>
							</el-table-column>
							<el-table-column label="已领取/总数" width="250">
								<template slot-scope="scope">
									<span>{{scope.row.couponSendNum}}/{{scope.row.couponTotal==0?'无限制':scope.row.couponTotal}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="createTime" label="创建时间" width="250">
							</el-table-column>
						</el-table>
					</div>
				</div>
				<!--手动发放优惠券-->
				<div class="Issuingcen03" v-show="showactive=='hand'">
					<!--已发送记录-->
					<div class="Is03_t_b">
						<div class="Is03_user">
							<div class="Is03_user_top">
								已选择发放
								<span class="bluecolor02">{{sel_user.total}}</span>
								位用户
							</div>
							<div class="Is03_user_btn">
								<!--无数据-->
								<div class="Is03_user_boxnone" v-if="sel_user.total==0">
									当前暂无已选择发放的用户
								</div>
								<!--有数据-->
								<div class="Is03_user_box" v-if="sel_user.total>0">
									{{sel_user.mobiles}}
									<span v-show="sel_user.total>23" class="totaluser">......共{{sel_user.total}}位用户</span>
								</div>
							</div>
						</div>
						<div class="Is03_user02 ">
							<el-button @click="goto('/m/marketTool/couponList/couponRule/couponSendRecord')">
								查看发放记录
							</el-button>
						</div>
					</div>
					<div class="Is03_t_b02">
						<!--左边表格-->
						<div class="Is03_t_b02_l">
							<div class="form_top">
								<el-form :inline="true" class="demo-form-inline">
									<el-form-item label="选择发放人群">
										<el-input v-model="user_list_parmas.mobileOrUserId" placeholder="请输入手机号/账号/用户编号"></el-input>
									</el-form-item>
									<el-form-item label="注册">
										<div class="search_cell">
											<el-date-picker v-model="time" width="350" :editable="false" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
											</el-date-picker>
										</div>
									</el-form-item>
									<el-form-item>
										<el-button type="primary" @click="get_user_list">查询</el-button>
										<el-button type="" @click="reset_user_params">清空查询条件</el-button>
									</el-form-item>
								</el-form>
							</div>
							<div class="table">
								<!--<el-table  border style="width: 100%" @selection-change="handleSelectionChange"  ref="multipleTable" :data="tableData3" tooltip-effect="dark">-->
								<el-table :data="user_list" slot="empty" stripe ref="multipleTable" @select-all="sel_all" @select="sel" :row-key="get_key" style="width: 100%; margin-top: 20px">
									<el-table-column type="selection" :reserve-selection="rem_seleted" width="55">
									</el-table-column>
									<el-table-column prop="mobile" label="手机号/账号">
									</el-table-column>
									<el-table-column prop="userId" label="用户编号">
									</el-table-column>
									<el-table-column prop="createdDate" label="新增时间" width="250">
										<template slot-scope="scope">
											<span>{{tool.date.format(new Date(scope.row.createdDate),'yy-MM-dd hh:mm:ss')}}</span>
										</template>
									</el-table-column>
								</el-table>
								<div class=" mt10">
									<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[5,10, 20, 50, 100]" :page-size="pagination.rows" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
									</el-pagination>
								</div>
							</div>
						</div>
						<!--右边选择优惠券-->
						<div class="Is03_t_b02_r">
							<div class="">发放优惠券选择</div>
							<!--无优惠券显示+,点击+会出现新增优惠券弹出窗-->
							<!--<div class="mt10 Selection_of_couponsbox"  @click="centerDialogVisible = true" style="display: none;">+</div>-->
							<div class="mt10 Selection_of_couponsbox" @click="reselect" v-show="hand_add_show">
								<span class="tit10 fl ml110" style="font-size: 30px;">+</span>
								<span class="tit10">选择</span>
							</div>
							<!--已选择优惠券显示优惠券-->
							<div class="Select_box mt10 f-active" v-show="!hand_add_show ">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{hand_edit_coupon.faceValue}}{{hand_edit_coupon.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{hand_edit_coupon.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{hand_edit_coupon.couponName}}</div>
									<div class="tit02">{{hand_edit_coupon.rangeContent}}</div>
									<div class="tit02">{{hand_edit_coupon.expirationTimeStart}} - {{hand_edit_coupon.expirationTimeEnd}}</div>
								</div>
							</div>
							<div class="mt10">
								<!--<a class="greycolor02  mr10" @click="goto('couponList')">新增优惠券</a>-->
								<a class="greycolor02  mr10" @click="new_coupons= true">新增优惠券</a>
								<a class="bluecolor02" v-show="!hand_add_show" @click="reselect">重新选择优惠券</a>
							</div>
						</div>
					</div>
					<!--底部按钮-->
					<div class="b_button">
						<div class="marauto wid280">
							<el-button type="primary" @click="send">发放</el-button>
							<el-button @click="click_send">导入批量发放</el-button>
						</div>
					</div>
				</div>
				<!--点击批量发放-->
				<el-dialog title="导入批量发放" :visible.sync="centerDialogVisible02" width="890px" center>
					<div class="addquan_c">
						<div class="addquan_c_t">已选择发放的优惠券</div>
						<div class="addquan_c_b">
							<!--已选择的优惠券-->
							<div class="Is03_user_boxnone" v-if="hand_add_show">
								当前暂无已选择发放的优惠券
							</div>
							<div class="Select_box mt10 f-active fl mr10" v-show="hand_edit_coupon.couponId && !hand_add_show ">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{hand_edit_coupon.faceValue}}{{hand_edit_coupon.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{hand_edit_coupon.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{hand_edit_coupon.couponName}}</div>
									<div class="tit02">{{hand_edit_coupon.rangeContent}}</div>
									<div class="tit02">{{hand_edit_coupon.expirationTimeStart}} - {{hand_edit_coupon.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class=" mt30">
						<span class="mr10">导入需要发放优惠券的用户</span>
						<!--判断-未导入时候上传批量发放表-->
						<span v-show="excel_file == ''">
							<el-button @click="sel_file"> 上传批量发放表</el-button>
						</span>
						<input type="file" id="upload" style="display:none" @change="file_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
						<span v-show="excel_file != ''">
							<el-button class="mr10 yellowcolor" @click="sel_file">重新上传</el-button>
							<span class="bluecolor02">已导入{{send_num}}位用户</span>
						</span>
					</div>
					<div class="mt10">
						<span class="tit11 mr10">批量发放表的格式必须同模板一致，仅一列，第一行命名为手机号</span>
						<el-button @click="download">下载模板</el-button>
					</div>
					<span slot="footer" class="dialog-footer mt30">
						<el-button type="primary" @click="excel_send">确定发放</el-button>
						<el-button @click="centerDialogVisible02 = false">取消发放</el-button>
						<span class="fr addquan_t poi2">发送后将不可以撤销，请认真核对发送信息</span>
					</span>
				</el-dialog>
				<!--点击发放-->
				<el-dialog title="确认发放" :visible.sync="centerDialogVisible03" width="890px" center>
					<div class="addquan_c">
						<div class="addquan_c_t">已选择发放的优惠券</div>
						<div class="addquan_c_b">
							<!--已选择的优惠券-->
							<div class="Is03_user_boxnone" v-if="hand_add_show">
								当前暂无已选择发放的优惠券
							</div>
							<div class="Select_box mt10 f-active fl mr10" v-show="hand_edit_coupon.couponId && !hand_add_show ">
								<i class="icon_selected"></i>
								<div class="fl s-t_b">
									<div>
										<span class="tit_s tit_s_h">{{hand_edit_coupon.faceValue}}{{hand_edit_coupon.couponForm == 1 ? '元':'折'}}</span>
									</div>
									<div class="tit_s_s ">
										{{hand_edit_coupon.content}}
									</div>
								</div>
								<div class="fl s-t_b02">
									<div class="mt10">{{hand_edit_coupon.couponName}}</div>
									<div class="tit02">{{hand_edit_coupon.rangeContent}}</div>
									<div class="tit02">{{hand_edit_coupon.expirationTimeStart}} - {{hand_edit_coupon.expirationTimeEnd}}</div>
								</div>
							</div>
						</div>
					</div>
					<div class="Is03_user">
						<div class="Is03_user_top">
							已选择发放
							<span class="bluecolor02">{{sel_user.total}}</span>
							位用户
						</div>
						<div class="Is03_user_btn">
							<!--无数据-->
							<div class="Is03_user_boxnone" v-if="sel_user.total==0">
								当前暂无已选择发放的用户
							</div>
							<!--有数据-->
							<div class="phone_box" v-if="sel_user.total>0">
								{{sel_user.mobiles}}
								<span v-show="sel_user.total>23" class="totaluser">......共{{sel_user.total}}位用户</span>
							</div>
						</div>
					</div>
					<span slot="footer" class="dialog-footer mt30">
						<el-button type="primary" @click="sure_send">确定发放</el-button>
						<el-button @click="centerDialogVisible03 = false">取消发放</el-button>
						<span class="fr addquan_t poi2">发送后将不可以撤销，请认真核对发送信息</span>
					</span>
				</el-dialog>

				<!--编辑优惠券-->
				<el-dialog title="编辑领取规则" :visible.sync="eidt_rule" width="650px" center>
					<div class="editReceive">
						<div class="newadd01">
							<span class="newaddspan mr5">规则名称</span>
							<input class="newaddinput el-input__inner fs14" v-model="edit_paid_coupon.ruleName" placeholder="请输入您需要新增的规则名称(1-15位)" @blur="nameRule" />
						</div>
						<div class="newadd01 mt20 clear02">
							<!--<span class="newaddspan mr5 fl">优惠券选择</span>-->
							<span class="newaddspan mr5 fl">优惠券<br/> 选择
							</span>
							<div class="edit_quan fl mr5 ml10" @click="centerDialogVisible = true">
								<div class="Select_box f-active">
									<i class="icon_selected"></i>
									<div class="fl s-t_b">
										<div>
											<span class="tit_s tit_s_h" v-if="edit_coupon.same == 1">{{edit_coupon.faceValue}}{{edit_coupon.couponForm == 1 ? '元':'折'}}</span>
											<span class="tit_s_s tit_s_h" v-if="edit_coupon.same == 0 && (edit_coupon.minValue.length + edit_coupon.maxValue.length <= 6)">{{edit_coupon.minValue}}~{{edit_coupon.maxValue}}{{edit_coupon.couponForm == 1 ? '元':'折'}}</span>
											<div v-if="edit_coupon.same == 0 && (edit_coupon.minValue.length + edit_coupon.maxValue.length > 6)">
												<p class="tit_s_s tit_h">{{edit_coupon.minValue}}{{edit_coupon.couponForm == 1 ? '元':'折'}}</p>
												<p class="tit_s_s tit_h">~</p>
												<p class="tit_s_s tit_h">{{edit_coupon.maxValue}}{{edit_coupon.couponForm == 1 ? '元':'折'}}</p>
											</div>
										</div>
										<div class="tit_s_s ">
											{{edit_coupon.content}}
										</div>
									</div>
									<div class="fl s-t_b02">
										<div class="mt10">{{edit_coupon.couponName}}</div>
										<div class="tit02">{{edit_coupon.rangeContent}}</div>
										<div class="tit02">{{edit_coupon.expirationTimeStart}} - {{edit_coupon.expirationTimeEnd}}</div>
									</div>
								</div>
							</div>
							<!--支付成功优惠券领取规则-->
							<div class="add_tit fl" v-show="showactive=='success'">
								该操作旨在设置用户支付完成后可领取的优惠券。若设置了领取条件门槛，则必须大于或等于该金额区间，才可领取该优惠券。
							</div>
							<!--推荐好友注册成功优惠券领取规则-->
							<div class="add_tit fl" v-show="showactive=='share'">
								该操作旨在设置用户推荐好友，对方注册后可领取的优惠券，每个用户均可享受一次。
							</div>
						</div>
						<div class="newadd01 mt20 ">
							<span class="newaddspan mr5">领取条件</span>
							<el-radio-group v-model="edit_paid_coupon.ruleLimitStatus">
								<el-radio label="1">限制领取订单金额</el-radio>
								<el-radio label="2">不限制</el-radio>
							</el-radio-group>
						</div>
						<div class="newadd01 mt20" v-show=" edit_paid_coupon.ruleLimitStatus == 1">
							<span class="newaddspan mr5"></span>
							<el-input placeholder="" v-model="edit_paid_coupon.ruleLimitMin" @blur="amount_limit" class="widnone">
								<i slot="suffix" class="el-input__icon fontstyle">元</i>
							</el-input>
							<span>~</span>
							<el-input placeholder="" v-model="edit_paid_coupon.ruleLimitMax" @blur="amount_limit" class="widnone">
								<i slot="suffix" class="el-input__icon fontstyle">元</i>
							</el-input>
						</div>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="cancle_edit">取 消</el-button>
						<el-button type="primary" @click="suc_edit_sur">确定</el-button>
					</div>
				</el-dialog>
				<!--确认发送结果-->
				<el-dialog :visible.sync="result" width="650px" center>
					<div class="send_suc">
						<!--<el-progress v-if="send_result.sendSuccess != 0" type="circle" :percentage="100" :width="136"  status="success"></el-progress>
							<el-progress v-if="send_result.sendSuccess == 0" type="circle" :percentage="100" :width="136" status="exception"></el-progress>-->
						<img src="../../../../../../static/images/businessManage/pic_success.png" v-if="send_result.sendSuccess != 0" class="">
						<img src="../../../../../../static/images/businessManage/pic_false.png" v-if="send_result.sendSuccess == 0" class="">
					</div>
					<div class="cen">总共发送{{send_result.sendTotal}}位用户 </div>
					<div class="cen">
						<span>发送成功{{send_result.sendSuccess}}位</span>
						<span>{{send_result.sendfail}}位用户发送失败</span>
						<el-button type="primary" plain class="dre" v-if="send_result.sendfail != 0" @click="export_fail(send_result.sendRecordId)">导出失败用户</el-button>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="send_success">确定</el-button>
					</div>
				</el-dialog>
				<!--新增优惠券-->
				<el-dialog title="选择需要新增的优惠券的类型" :visible.sync="new_coupons" width="50%" center>
					<div class="add_xzyh clear02">
						<div :class="['add_xbox', 'fl', 'mr60', create_flag == 'cash' ? 'c_active' : '']" @click="create_flag = 'cash'">
							<div class="add_xbox_bg"></div>
							<div class="tit">代金券</div>
							<div class="tit01">用户使用该优惠券减对 应金额，可后台发放</div>
							<!--选中的时候请做出判断出现icon_selected-->
							<i class="icon_selected" v-if="create_flag == 'cash'"></i>
						</div>
						<div :class="['add_xbox', 'fl', 'mr60', create_flag == 'discount' ? 'c_active' : '']" @click="create_flag = 'discount'">
							<div class="add_xbox_bg"></div>
							<div class="tit">折扣券</div>
							<div class="tit01">用户使用该优惠券减对 应折扣，可后台发放</div>
							<i class="icon_selected" v-if="create_flag == 'discount'"></i>
						</div>
					</div>
					<span slot="footer" class="dialog-footer">
						<el-button type="primary" @click="gotoCreateVue()">下一步</el-button>
						<el-button @click="new_coupons = false">取 消</el-button>
					</span>
				</el-dialog>
			</div>
		</el-col>
	</div>
</template>
<script>
import { tool } from '../../../../../utils/'
export default {
	data() {
		return {
			constant:{maxShareUser:'',maxNumOfRule:''},
			test_constant:{maxShareUser:'',maxNumOfRule:''},
			new_coupons: false,
			result: false,
			// 发送结果
			send_result: '',
			excel_file: '',
			// 发送人数
			send_num: 0,
			time: '',
			// 记住选择
			rem_seleted: true,
			// tab栏切换
			showactive: 'success',
			// 选中的用户
			sel_user: { mobiles: '', total: 0 },
			sel_user_mobiles: [],
			//  查询用户列表参数
			user_list_parmas: { mobileOrUserId: '', startTime: '', endTime: '' },
			// 用户列表  分页
			pagination: { rows: 5, pageNum: 1, total: 0 },
			//  查询分享优惠券列表参数
			share_list_parmas: { coupon_no: '', coupon_name: '', page_no: 1, page_size: 15 },
			// 查询代金或折扣券列表参数
			cashAndDiscount_parmas: { coupon_no: '', coupon_name: '', page_no: 1, page_size: 15 },
			// 新增支付成功优惠券领取规则参数
			paid_coupon_rule: {
				coupon_id: '',
				rule_id: '',
				rule_type: '1',
				rule_name: '',
				rule_limit_status: '1',
				rule_limit_max: '',
				rule_limit_min: ''
			},
			// 新增推荐优惠券领取规则参数
			recommend_coupon_rule: { coupon_id: '', rule_id: '', rule_name: '' },
			coupon_list: [],
			// 优惠券请求页数
			pre: 1,
			// 操作类型
			handle_type: '',
			// 支付成功
			paid_coupon_list: [],
			// 推荐
			recommend_coupon_list: [],
			// 用户列表
			user_list: [],
			// 代金或折扣券列表
			cashAndDiscount_list: [],
			//  控制新增规则弹框
			centerDialogVisible: false,
			//  是否有选中的优惠券
			coupon: { sucess: true, share: true },
			// 点击的优惠券
			pre_sel_coupon: {},
			// 编辑的规则
			pre_rule: {},
			// 手动发放选择的优惠券
			hand_edit_coupon: {},
			// 编辑的优惠规则
			edit_paid_coupon: {},
			// 编辑的优惠规则的优惠券
			edit_coupon: {},
			// 选中的优惠券
			sel_coupon: { sucess: '', share: '' },
			// 显示加号
			add_show: true,
			// 手动发放的加号
			hand_add_show: true,
			// 编辑优惠券规则弹框
			eidt_rule: false,
			// 选择优惠券弹窗
			newaddReceive: false,
			centerDialogVisible02: false,
			centerDialogVisible03: false,
			// 搜索优惠券列表参数另存，解决查询和懒加载冲突问题
			share_search: { name: '', no: '' },
			// 搜索代金或折扣券列表参数另存，解决查询和懒加载冲突问题
			cashAndDiscount_search: { name: '', no: '' },
			create_flag: 'cash'
		}
	},
	watch: {
		'time': {
			handler(val, oldVal) {
				let that = this
				if (!oldVal) return
				if (val == oldVal) return
				if (!val) {
					that.user_list_parmas.startTime = ''
					that.user_list_parmas.endTime = ''
				}
			},
			deep: true
		},
		'centerDialogVisible02': {
			handler(val, oldVal) {
				if (!val) {
					document.querySelector('#upload').value = ''
					this.excel_file = ''
					this.send_num = 0
				}
			},
			deep: true
		},
		'paid_coupon_rule.rule_limit_status': {
			handler(val) {
				if (val == 2) {
					this.paid_coupon_rule.rule_limit_max = 0
					this.paid_coupon_rule.rule_limit_min = 0
				} else if (val == 1) {
					this.paid_coupon_rule.rule_limit_max = ''
					this.paid_coupon_rule.rule_limit_min = ''
				}
			},
			deep: true
		},

	},
	methods: {
		// 支付成功常量查询
		get_constant() {
			this.api_businessManagePlatform_constantInfo({
			}).then(res => {
				this.constant = res.content
				this.test_constant =Object.assign({},res.content)
			})
		},
		edit_constant () {
			if (this.constant.maxShareUser == this.test_constant.maxShareUser && this.constant.maxNumOfRule == this.test_constant.maxNumOfRule){
				return
			}
			let deg = /^([1-9]\d?)$/
			console.log(deg.test(this.constant.maxShareUser))
			if (!(deg.test(this.constant.maxShareUser)  && this.constant.maxShareUser <= 15)) {
				this.$message({
          message: '优惠券分享领取最少一人，最多15人',
          type: 'warning'
        });
				console.log('另存的一份',this.test_constant)
				this.constant = Object.assign({},this.test_constant)
				return
			}
			if (!/^[1-5]$/.test(this.constant.maxNumOfRule)) {
				this.$message({
          message: '相同订单金额最少发一张，最多发五张',
          type: 'warning'
        });
				console.log('另存的一份',this.test_constant)
				this.constant = Object.assign({},this.test_constant)
				return
			}
			this.api_businessManagePlatform_constantEdit({
				data:JSON.stringify({
					max_share_user: this.constant.maxShareUser,
					max_num_of_rule: this.constant.maxNumOfRule
				}),
        headers:{'Content-Type': 'application/json;'}
			}).then(res => {
				this.test_constant = Object.assign({},this.constant)
				this.$message({
          message: '编辑成功',
          type: 'success'
        })
			})
		},
		// 点击发送
		send() {
			if (this.hand_edit_coupon.couponId == undefined) {
				this.$message.error('请选择优惠券！')
				return
			}
			if (this.sel_user.mobiles == '') {
				this.$message.error('请选择发放用户')
				return
			}
			this.centerDialogVisible03 = true
		},
		// 确定发送
		sure_send() {
			let that = this
			let formDate = {
				coupon_id: that.hand_edit_coupon.couponId,
				mobiles: that.sel_user.mobiles
			}
			// 发送选定优惠券给选定用户
			// this.api_businessManagePlatform_sendSelected ({
			// 	data: {
			// 		token: sessionStorage.getItem('access_token')
			// 	},
			// }).then(res => {
			// })
			$.ajax({
				method: 'post',
				url: that.BASE_URL + 'm2c.market/admin/coupon/platform/batch/send/user',
				contentType: 'application/json; charset=utf-8',
        headers: {'access_token': sessionStorage.getItem('access_token')},
				dataType: 'json',
				data: JSON.stringify(formDate),
				success: function(res) {
					if (res.status == 200) {
						console.log('发放结果', res.content)
						that.send_result = res.content
					} else {
						that.$message.error('发送失败');
					}
					that.result = true
				}
			})
		},
		// 点击导入批量发放
		click_send() {
			if (this.hand_edit_coupon.couponId == undefined) {
				this.$message.error('请选择优惠券！')
				return
			} else {
				this.centerDialogVisible02 = true
			}
		},
		// excel批量发放
		excel_send() {
			let that = this
			console.log(that.hand_edit_coupon)
			if (that.excel_file === '') {
				this.$message.error('请选择批量发送用户文件')
				return
			}
			this.$confirm('确定发放, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				that.centerDialogVisible02 = false
				let formData = new FormData()
				formData.append('upfile', that.excel_file)
				formData.append('coupon_id', that.hand_edit_coupon.couponId)
				// this.api_businessManagePlatform_sendSelected ({
				// 	data: {
				// 		token: sessionStorage.getItem('access_token')
				// 	},
				// }).then(res => {
				// })
				$.ajax({
					method: 'post',
					url: that.BASE_URL + 'm2c.market/admin/coupon/platform/read/excel/batch/send',
          headers: {'access_token': sessionStorage.getItem('access_token')},
					// contentType: 'application/json; charset=utf-8',
					// dataType: 'json',
					contentType: false,
					data: formData,
					processData: false,
					success: function(res) {
						if (res.status == 200) {
							console.log('发放结果', res.content)
							that.send_result = res.content
						} else {
							that.$message.error('发送失败')
						}
						that.result = true
					}
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消发放'
				})
			})
		},
		// 跳转创建优惠券页面
		gotoCreateVue() {
			let _this = this
			if (_this.create_flag === 'cash') { // 创建代金券
				_this.$router.push({ path: '/m/marketTool/couponList/couponCashCreate' })
			}
			if (_this.create_flag === 'discount') { // 创建折扣券
				_this.$router.push({ path: '/m/marketTool/couponList/couponDiscountCreate' })
			}
			_this.centerDialogVisible = false
		},
		open_up() {
			if (this.coupon_list.length == 0) {
				this.get_share_list()
			}
			this.centerDialogVisible = true
		},
		//   tab页切换
		show_active(type) {
			this.showactive = type
			this.cancleAddReceive()
		},
		// 获取分享优惠券列表
		get_share_list() {
			let that = this
			let name = this.share_list_parmas.coupon_name
			let no = this.share_list_parmas.coupon_no
			if ((name != '' || no != '') && (this.share_search.name == name && this.share_search.no == no)) return
			if (this.share_search.name != name || this.share_search.no != no || (name == '' && no == '')) {
				this.share_search.name = name
				this.share_search.no = no
				this.coupon_list = []
				this.share_list_parmas.page_no = 1
				this.share_list_parmas.page_size = 15
				this.pre = 1
			}
			this.api_businessManagePlatform_shareList({
				data: this.share_list_parmas,
			}).then(res => {
				this.coupon_list = that.coupon_list.concat(res.content)
			})
		},
		// 获取代金或折扣券列表
		get_cashAndDiscount() {
			let that = this
			let name = this.cashAndDiscount_parmas.coupon_name
			let no = this.cashAndDiscount_parmas.coupon_no
			if ((name != '' || no != '') && (this.cashAndDiscount_search.name == name && this.cashAndDiscount_search.no == no)) return
			if (this.cashAndDiscount_search.name != name || this.cashAndDiscount_search.no != no) {
				this.cashAndDiscount_search.name = name
				this.cashAndDiscount_search.no = no
				this.cashAndDiscount_list = []
				this.cashAndDiscount_parmas.page_no = 1
				this.cashAndDiscount_parmas.page_size = 15
				this.hand_pre = 1
				//  page_no: 1, page_size: 15
			}
			this.api_businessManagePlatform_cashAndDiscountList({
				          data: this.cashAndDiscount_parmas,
			        }).then(res => {
				this.cashAndDiscount_list = res.content
			        })
		},
		// 懒加载分享优惠券列表
		lazyload(e) {
			let box = document.getElementsByClassName('Select_coupons_b')[0]
			// let now = 0    // 现在加载的第几页
			if (this.showactive != 'hand') {
				if (box.scrollTop > 90 * this.pre) {
					this.pre++
					this.share_list_parmas.page_no = 4 + this.pre
					this.share_list_parmas.page_size = 3
					this.get_share_list()
				}
			} else if (this.showactive == 'hand') {
				if (box.scrollTop > 90 * this.pre) {
					this.hand_pre++
					this.cashAndDiscount_parmas.page_no = 4 + this.hand_pre++
					this.cashAndDiscount_parmas.page_size = 3
					this.get_cashAndDiscount()
				}
			}
		},
		// 取消编辑
		cancle_edit() {
			console.log('取消编辑')
			this.eidt_rule = false
			// this.edit_paid_coupon = null
			this.pre_sel_coupon = {}
			console.log('this.edit_paid_coupon', this.edit_paid_coupon)
		},
		// 给表格唯一的KEY
		get_key(row) {
			return row.userId
		},
		sel_file() {
			document.querySelector('#upload').click()
		},
		// 文件上传
		file_upload(event) {
			let that = this
			let target = event.target
			let obj = window.URL.createObjectURL(target.files[0])
			console.log('文件', obj)
			var formData = new FormData()
			formData.append('upfile', target.files[0])
			// 存一次上传的文件
			this.excel_file = target.files[0]
			$.ajax({
				url: `${this.BASE_URL}m2c.market/admin/coupon/read/user/excel/count`,
        headers: {'access_token': sessionStorage.getItem('access_token')},
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
				success: function(res) {
					if (res.status == '200') {
						// alert("上传成功！")
						that.$message({
							message: '上传成功！',
							type: 'success'
						})
						that.send_num = res.content.rows
					} else {
						that.$message.error('上传失败');
					}
				},
				error: function() {
					console.log('上传内容格式错误，请下载模板参照！')
					that.$message.error('上传内容格式错误，请下载模板参照！')
				}
			})
		},
		// 下载
		download() {
			location.href = `${this.BASE_URL}m2c.market/coupon/import/user/excel/template`
		},
		export_fail(id) {
			console.log('id --', id)
			location.href = `${this.BASE_URL}m2c.market/coupon/export/send/fail/record/${id}`
		},
		// 发送成功后点击确定刷新页面
		send_success() {
			// 清空表格选择项
			this.$refs.multipleTable.clearSelection()
			this.sel_user = { mobiles: '', total: 0 }
			this.hand_add_show = true
			this.hand_edit_coupon = {}
			this.result = false
			this.sel_user_mobiles = []
			this.centerDialogVisible03 = false
		},
		// 重置搜索查询条件
		reset() {
			this.share_list_parmas.coupon_no = ''
			this.share_list_parmas.coupon_name = ''
			this.cashAndDiscount_parmas.coupon_no = ''
			this.cashAndDiscount_parmas.coupon_name = ''
		},
		suc_edit(item) {
			let that = this
			// this.centerDialogVisible = true
			// 为了在优惠券列表中选中编辑的优惠券
			this.pre_sel_coupon = item
			this.edit_paid_coupon = item
			this.edit_paid_coupon.ruleLimitStatus += ''
			this.eidt_rule = true
			this.handle_type = 'edit'
			console.log('success', '编辑', this.edit_paid_coupon)
			// 查询优惠券页面内容详情
			this.api_businessManagePlatform_ruleCouponDetail({ data: { couponIds: this.edit_paid_coupon.couponId } }).then(res => {
				this.edit_coupon = res.content[0]
			        })
		},
		suc_edit_sur() {
			let that = this
			let formDate = {
				coupon_id: that.pre_sel_coupon.couponId,
				rule_id: that.edit_paid_coupon.ruleId,
				rule_name: that.edit_paid_coupon.ruleName,
				rule_limit_status: parseInt(that.edit_paid_coupon.ruleLimitStatus),
				rule_limit_max: that.edit_paid_coupon.ruleLimitMax,
				rule_limit_min: that.edit_paid_coupon.ruleLimitMin
			}
			console.log('数据', formDate)
			$.ajax({
				url: that.BASE_URL + 'm2c.market/admin/coupon/rule/paid/modify',
				method: 'POST',
				contentType: 'application/json; charset=utf-8',
        headers: {'access_token': sessionStorage.getItem('access_token')},
				dataType: 'json',
				data: JSON.stringify(formDate),
				// data: formDate,
				success: function(result) {
					if (result.status == 200) {
						that.$message({
							message: '修改成功',
							type: 'success'
						})
						that.get_paid()
					} else {
						that.$message.error('修改失败');
					}
					that.eidt_rule = false
				}
			})
		},
		suc_del(item) {
			this.$confirm('是否确认删除本条规则？删除后用户将无法通过支付成功来领取该优惠券了，已领取的不受影响?', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.api_businessManagePlatform_delPaidRule({ pathParams: `/${item.ruleId}`, }).then(res => {
					this.$message({
						type: 'success',
						message: '删除成功'
					})
					this.get_paid()
				        })
			}).catch(() => {
				this.$message({
					message: '取消删除'
				})
			})
		},
		share_edit(item) {
			this.centerDialogVisible = true
			this.pre_rule = item
			this.handle_type = 'edit'
			this.pre_sel_coupon = item
			console.log('share', '编辑', item)
		},
		share_del(item) {
			console.log('share', '删除')
			let that = this
			that.$confirm('是否确认删除本条规则？删除后用户将无法通过推荐好友来领取该优惠券了，已领取的不受影响?', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.api_businessManagePlatform_delRecommendRule({
					data: { rule_id: item.ruleId },
					pathParams: `/${item.ruleId}`,
				}).then(res => {
					this.$message({
						type: 'success',
						message: '删除成功'
					})
					this.get_recommend()
				})
			}).catch(() => {
				this.$message({
					type: 'warn',
					message: '取消删除'
				})
			})
		},
		share_effect(item) {
			console.log('share', '生效')
			let that = this
			that.$confirm('是否确认生效本条规则？', '', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.api_businessManagePlatform_effectRecommendRule({
					data: { rule_id: item.ruleId },
					pathParams: `/${item.ruleId}`,
				}).then(res => {
					this.$message({
						type: 'success',
						message: '生效成功'
					})
					this.get_recommend()
				})
			}).catch(() => {
				this.$message({
					type: 'warn',
					message: '取消生效'
				})
			})
		},
		// 分页功能
		handleSizeChange(val) {
			console.log(`每页 ${val} 条`)
			this.pagination.rows = val
			this.get_user_list()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`)
			this.pagination.pageNum = val
			this.get_user_list()
		},
		sel_all(val) {
			console.log('全选的', val)
			this.sel_user_mobiles = []
			val.map(item => {
				this.sel_user_mobiles.push(item.mobile)
			})
			this.sel_user.total = this.sel_user_mobiles.length
			this.sel_user.mobiles = this.sel_user_mobiles.join(' , ')
		},
		//   点击表格选择
		sel(selection, row) {
			let len = this.sel_user_mobiles.length
			let lenc = selection.length
			if (lenc > len) {
				this.sel_user_mobiles.push(row.mobile)
			} else {
				this.sel_user_mobiles.some((item, i) => {
					if (item == row.mobile) {
						this.sel_user_mobiles.splice(i, 1)
					}
				})
			}
			this.sel_user.total = this.sel_user_mobiles.length
			this.sel_user.mobiles = this.sel_user_mobiles.join(' , ')
		},
		// 点击新增领取规则按钮
		NewaddReceive() {
			if (this.showactive == 'success') {
				if (this.paid_coupon_list.length == 10) {
					this.$message.error('该规则最多只能创建十条！')
				} else {
					this.handle_type = 'add'
					this.newaddReceive = true
				}
			} else if (this.showactive == 'share') {
				if (this.recommend_coupon_list.length == 7) {
					this.$message.error('该规则最多只能创建七条！')
				} else {
					this.handle_type = 'add'
					this.newaddReceive = true
				}
			}
		},
		// 重新选择优惠券
		reselect() {
			this.handle_type = 'edit'
			this.centerDialogVisible = true
			this.pre_sel_coupon = this.hand_edit_coupon
			if (this.cashAndDiscount_list.length == 0) {
				this.get_cashAndDiscount()
			}
		},
		goto(path) {
			let that = this
			if (that.active_path === path) {
				that.$router.go(0)
				return
			}
			that.$router.push({ path: path })
		},
		// 新增领取规则名称验证
		nameRule() {
			// 只能填写数字，英文字母
			let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
			let name = ''
			if (this.showactive === 'success') {
				if (this.handle_type === 'add') {
					name = this.paid_coupon_rule.rule_name
				} else if (this.handle_type === 'edit') {
					name = this.edit_paid_coupon.ruleName
				}
				// edit_paid_coupon.ruleName
			} else if (this.showactive === 'share') {
				name = this.recommend_coupon_rule.rule_name
			}
			if (name) {
				name = name.replace(/(^\s*)|(\s*$)/g, '')
				if ((!deg.test(name) || name.length > 15)) {
					this.$message.error('规则名称只能输入1-15位中英文和数字！')
					return
				}
			}
			// 去掉标题首尾空格
			//   that.add_modify_delete_params.title = that.add_modify_delete_params.title.replace(/(^\s*)|(\s*$)/g, '')
		},
		// 新增领取规则金额验证
		amount_limit() {
			let min = 0
			let max = 0
			if (this.handle_type === 'add') {
				min = this.paid_coupon_rule.rule_limit_min
				max = this.paid_coupon_rule.rule_limit_max
			} else if (this.handle_type === 'edit') {
				min = this.edit_paid_coupon.ruleLimitMin
				max = this.edit_paid_coupon.ruleLimitMax
			}
			console.log('最大值', max)
			console.log('最小值', min)
			let reg = /^([1-9][\d]{0,5}|0)(\.[\d]{1,2})?$/
			if (min && !reg.test(min)) {
				if (!reg.test(min)) {
					this.$message.error('金额最小值只能是0-999999.99的两位小数！')
					return
				} else if (max && (min - max > 0)) {
					this.$message.error('金额范围为0-999999.99,最大值不小于最小值')
					return
				}
			} else if (max) {
				console.log('最大值', max)
				console.log('最小值', min)
				if (!reg.test(max)) {
					this.$message.error('金额最大值只能是0-999999.99的两位小数！')
					return
				}
				if (min && (min - max > 0)) {
					this.$message.error('金额范围为0-999999.99,最大值不小于最小值')
					return
				}
			}
		},
		// 点击优惠券
		Selectcouponsactive(item) {
			// this.couponId = item.couponId
			this.pre_sel_coupon = item
			// console.log('-----------',this.pre_sel_coupon)
		},
		// 确认选择优惠券
		coupon_selected() {
			let that = this
			if (this.showactive != 'hand' && this.pre_sel_coupon.couponId == undefined) {
				this.centerDialogVisible = false
				return
			}
			if (this.handle_type == 'add') {
				if (this.showactive == 'share') {
					this.sel_coupon.share = this.pre_sel_coupon
					this.recommend_coupon_rule.coupon_id = this.pre_sel_coupon.couponId
					// console.log('share', this.pre_sel_coupon)
				} else if (this.showactive == 'success') {
					this.sel_coupon.success = this.pre_sel_coupon
					this.paid_coupon_rule.coupon_id = this.pre_sel_coupon.couponId
				}
				this.add_show = false
				this.centerDialogVisible = false
			} else if (this.handle_type == 'edit') {
				this.centerDialogVisible = false
				if (this.showactive == 'share') {
					// 编辑支付领取规则
					$.ajax({
						url: `${this.BASE_URL}m2c.market/admin/coupon/rule/recommend/modify`,
						method: 'post',
						contentType: 'application/json; charset=utf-8',
            headers: {'access_token': sessionStorage.getItem('access_token')},
						dataType: 'json',
						data: JSON.stringify({
							coupon_id: that.pre_sel_coupon.couponId,
							rule_id: that.pre_rule.ruleId,
							rule_name: that.pre_rule.ruleName
						}),
						success: function(result) {
							if (result.status == 200) {
								that.cancleAddReceive()
								that.get_recommend()
								that.newaddReceive = false
							} else {
								this.$message.error('编辑失败！');
							}
						}
					})
				} else if (this.showactive == 'success') {
					console.log(' this.pre_sel_coupon', this.pre_sel_coupon)
					this.edit_coupon = this.pre_sel_coupon
					this.centerDialogVisible = false
				} else if (this.showactive == 'hand') {
					console.log('手动发放')
					this.hand_add_show = false
					this.hand_edit_coupon = this.pre_sel_coupon
					console.log('this.hand_edit_coupon', this.hand_edit_coupon)
				}
			}
		},
		// 取消选择优惠券
		coupon_select_cancle() {
			this.centerDialogVisible = false
			// if (this.handle_type == 'add') {
			this.pre_sel_coupon = {}
			this.reset()
			if (this.showactive != 'hand') {
				if (this.share_search.name != '' || this.share_search.no != '') {
					this.share_search.name = ''
					this.share_search.no = ''
					this.get_share_list()
				}
			} else if (this.showactive == 'hand') {
				if (this.cashAndDiscount_search.name != '' || this.cashAndDiscount_search.no != '') {
					this.cashAndDiscount_search.name = ''
					this.cashAndDiscount_search.no = ''
					this.get_cashAndDiscount()
				}
			}
		},
		// 确定新增领取规则
		addReceive() {
			let name = ''
			let id = ''
			let nameDeg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
			let reg = /^([1-9][\d]{0,5}|0)(\.[\d]{1,2})?$/
			if (this.showactive === 'success') {
				name = this.paid_coupon_rule.rule_name
				id = this.paid_coupon_rule.coupon_id
			} else if (this.showactive === 'share') {
				name = this.recommend_coupon_rule.rule_name
				id = this.recommend_coupon_rule.coupon_id
			}
			if (!name) {
				this.$message.error('标题不能为空！')
				return
			}
			if (name) {
				name = name.replace(/(^\s*)|(\s*$)/g, '')
				if ((!nameDeg.test(name) || name.length > 15)) {
					this.$message.error('规则名称只能输入1-15位中英文和数字！')
					return
				}
			}
			if (!id) {
				this.$message.error('请选择一个优惠券！')
				return
			}
			if (this.showactive === 'success' && this.paid_coupon_rule.rule_limit_status == 1) {
				let min = this.paid_coupon_rule.rule_limit_min
				let max = this.paid_coupon_rule.rule_limit_max
				if (!min || !max) {
					this.$message.error('限制领取订单金额填写不完整！')
					return
				}
				if (!reg.test(min)) {
					if (!reg.test(min)) {
						this.$message.error('金额最小值只能是0-999999.99的两位小数！')
						return
					} else if (max && (min - max > 0)) {
						this.$message.error('金额范围为0-999999.99,最大值不小于最小值')
						return
					}
				}
				if (!reg.test(max)) {
					this.$message.error('金额最大值只能是0-999999.99的两位小数！')
					return
				} else if (min && (min - max > 0)) {
					this.$message.error('金额范围为0-999999.99,最大值不小于最小值')
					return
				}
			}
			let that = this
			let url = ''
			let ruleData = ''
			if (this.showactive === 'success') {
				url = that.BASE_URL + 'm2c.market/admin/coupon/rule/paid/creation'
				that.paid_coupon_rule.rule_id = that.guid()
				ruleData = that.paid_coupon_rule
			} else if (this.showactive === 'share') {
				url = that.BASE_URL + 'm2c.market/admin/coupon/rule/recommend/creation'
				that.recommend_coupon_rule.rule_id = that.guid()
				ruleData = that.recommend_coupon_rule
			}
			console.log('data', ruleData)
			$.ajax({
				url: url,
				method: 'post',
				contentType: 'application/json; charset=utf-8',
        headers: {'access_token': sessionStorage.getItem('access_token')},
				dataType: 'json',
				data: JSON.stringify(ruleData),
				success: function(result) {
					if (result.status == 200) {
						if (that.showactive == 'success') {
							that.cancleAddReceive()
							that.get_paid()
						} else if (that.showactive == 'share') {
							that.cancleAddReceive()
							that.get_recommend()
						}
						that.newaddReceive = false
					} else {
						this.$message.error('新增规则失败');
					}

				}
			})
		},
		// 取消新增  清空参数
		cancleAddReceive() {
			this.newaddReceive = false
			this.sel_coupon = { sucess: '', share: '' }
			this.add_show = true
			this.paid_coupon_rule = {
				coupon_id: '',
				rule_id: '',
				rule_type: '1',
				rule_name: '',
				rule_limit_status: '1',
				rule_limit_max: '',
				rule_limit_min: ''
			}
			this.recommend_coupon_rule = { coupon_id: '', rule_id: '', rule_name: '' }
			// 点击的优惠券
			this.pre_sel_coupon = {}
		},
		// 获取推荐领取规则列表
		get_recommend() {
			let that = this
			this.api_businessManagePlatform_recommendList({
			}).then(res => {
				this.recommend_coupon_list = res.content
			})
		},
		// 获取支付成功规则列表
		get_paid() {
			let that = this
			this.api_businessManagePlatform_paidList({
			}).then(res => {
				this.paid_coupon_list = res.content
			})
		},
		// 获取用户列表
		get_user_list() {
			let that = this
			if (that.time !== null && that.time !== '') {
				that.user_list_parmas.startTime = that.tool.date.format(new Date(that.time[0]), "yyyy-MM-dd")
				that.user_list_parmas.endTime = that.tool.date.format(new Date(that.time[1]), "yyyy-MM-dd")
			}
			$.ajax({
				method: 'get',
				url: that.BASE_URL + 'm2c.users/user/getUserInfoByMobileAndCreateTime',
				data: Object.assign(that.user_list_parmas, that.pagination),
				success: function(res) {
					if (res.status == 200) {
						// if (res.content.length > 0) {
						that.user_list = res.content
						// }
						that.pagination.total = res.totalCount
						console.log('that.user_list', that.user_list)
					}
				}
			})
		},
		// reset_user_params
		reset_user_params() {
			this.user_list_parmas.mobileOrUserId = ''
			this.time = null
		},
		// 用于生成领取规则ID
		S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
		},
		guid() {
			return (this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4())
		}
	},
	mounted() {
		this.get_constant()
		this.get_share_list()
		this.get_recommend()
		this.get_paid()
		this.get_cashAndDiscount()
		this.get_user_list()
	}
}
</script>
<style lang="scss" scoped>
.phone_box {
	padding: 5px 20px 0 20px;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	line-height: 24px;
	word-wrap: break-word;
}

.Is03_user {
	// width: 908px;
	width: 100%; // min-width: 550px;
	height: 110px;
	border: 1px solid #E6E8F2;
	margin-top: 20px;
	.Is03_user_top {
		padding-left: 20px;
		font-size: 14px;
		background: #f9fafe;
		/*width: 100%;*/
		height: 30px;
		line-height: 30px;
		border-bottom: 1px solid #E6E8F2;
	}
	.Is03_user_btn {
		width: 100%;
		height: 80px;
		/*text-align: center;*/
		.Is03_user_boxnone {
			text-align: center;
			font-size: 14px;
			color: #999999;
			line-height: 80px;
		}
	}
}

.add_xzyh {
	height: 330px;
	border-bottom: 1px solid #E5E5E5;
	overflow: auto;
	.c_active {
		border: 1px solid #0086FF!important;
		position: relative;
		.tit {
			color: #0086FF!important;
		}
		.icon_selected {
			position: absolute;
			background: url(../../../../../../static/images/businessManage/icon_selected.png) no-repeat center;
			width: 18px;
			height: 18px;
			right: 0px;
			bottom: 0px;
		}
	}
	.add_xbox {
		width: 200px;
		height: 250px;
		border: 1px solid #E6E8F2;
		padding-top: 36px;
		margin-bottom: 20px;
		margin-left: 5%;
		cursor: pointer;
		.add_xbox_bg {
			width: 100px;
			height: 60px;
			background: url(../../../../../../static/images/businessManage/icon_quan.png) no-repeat center;
			margin: auto;
			margin-bottom: 27px;
		}
		.tit {
			font-size: 16px;
			font-family: PingFangSC-Medium;
			color: #333;
			line-height: 22px;
			margin-bottom: 20px;
			text-align: center;
		}
		.tit01 {
			width: 120px;
			font-size: 12px;
			font-family: PingFangSC-Light;
			color: rgba(51, 51, 51, 1);
			line-height: 20px;
			text-align: center;
			margin: auto;
		}
	}
} //  发送成功的样式
.send_suc {
	width: 136px;
	margin-left: 50%;
	transform: translateX(-50%); // font-size:18px;
	// i {
	// 	font-size: 36px;
	// }
	text-align: center;
	padding-bottom: 10px;
} // 导出按钮样式
.dre {
	position: absolute;
	top: -10px;
	right: 50px;
}

.cen {
	position: relative;
	text-align: center;
}

.Issuing_coupons {
	min-width: 1282px;
}

.Issuing_coupons_container {
	min-width: 910px;
	padding: 15px 26px;
	/*.Issuing_table {*/
	/*padding-right: 10px;*/
	/*}*/
	.tit11 {
		color: #CCCCCC;
	}
	.yellowcolor {
		background: #F5BD23;
		border-color: #F5BD23;
		color: #FFFFFF;
	}
	.greycolor {
		color: #CCCCCC;
		font-size: 12px;
	}
	.greycolor02 {
		color: #73A9E8;
		font-size: 12px;
	}
	.addquan_t {
		line-height: 40px;
		display: inline-block;
		color: #cccccc;
		font-size: 12px;
		right: 90px;
	}
	.addquan_c {
		width: 100%;
		/*height: 150px;*/
		border: 1px solid #E6E8F2;
		.addquan_c_t {
			// width: 100%;
			height: 30px;
			background: rgba(249, 250, 254, 1);
			border-radius: 3px 3px 0px 0px;
			line-height: 30px;
			border-bottom: 1px solid #E6E8F2;
			font-size: 14px;
			padding-left: 20px;
			color: #999999;
		}
		.addquan_c_b {
			padding: 10px;
			overflow-y: auto;
			height: 130px;
		}
	}
	.Select_box {
		width: 270px;
		height: 90px;
		margin-bottom: 10px;
		background: url(../../../../../../static/images/businessManage/icon_quan_gray.png) no-repeat center;
		cursor: pointer;
		.s-t_b {
			width: 85px;
			color: #878787;
			height: 100%;
			font-size: 12px;
			text-align: center;
			padding-top: 20px;
			.tit01 {
				font-size: 18px;
			}
			.tit_s {
				font-size: 16px;
			}
			.tit_s_s {
				font-size: 12px;
			}
			.tit_h {
				line-height: 14px;
				margin: 0;
			}
			.tit_s_h {
				line-height: 28px;
			}
		}
		.s-t_b02 {
			// width: 183px;
			width: 166px;
			height: 100%;
			padding: 7px;
			font-size: 12px;
			padding-left: 12px;
			.tit02 {
				color: #878787;
				line-height: 16px;
			}
		}
	}
	.f-active {
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
	}
	.b_button {
		padding-top: 20px;
		padding-bottom: 5px;
		margin-top: 10px;
		background: #fff;
		position: fixed;
		z-index: 99;
		bottom: 18px;
		width: 100%;
		left: 200px;
		border-top: 1px solid #E6E8F2;
	}
	.icon-intro {
		width: 15px;
		height: 15px;
		background: url(../../../../../../static/images/businessManage/icon-intro02.png) no-repeat center;
		display: inline-block;
	}
	.Issuing_coupons {
		background: #FFFFFF;
		min-height: 800px;
		.nav_container {
			width: 100%;
			height: 40px;
			line-height: 40px;
			display: flex;
			border-bottom: 1px solid #EDF0F7;
			.navli {
				width: 250px;
				height: 100%;
				text-align: center;
				a {
					text-decoration: none;
					display: inline-block;
					line-height: 38px;
					font-size: 16px;
					font-family: PingFangSC-Regular;
					color: rgba(102, 102, 102, 1);
				}
				.f_active {
					border-bottom: 2px solid #0086FF;
					color: #0086FF;
				}
			}
		}
		.Issuingcen01,
		.Issuingcen02 {
			padding-left: 30px;
			padding-right: 30px;
			.add_button {
				display: inline-block;
			}
			.Issuing_bt {
				margin-top: 20px;
				margin-bottom: 10px;
				font-size: 14px;
				font-family: PingFangSC-Regular;
				color: rgba(51, 51, 51, 1);
			}
			.Issuing_ct {
				width: 100%;
				padding-right: 10px;
			}
			.range {
				margin-left: 140px;
				padding: 0 20px;
				background-color: #F9FAFE;
				border: 1px solid #E6E8F2;
				min-width: 1060px;
			}
		}
		.Issuingcen03 {
			min-width: 910px;
			.Is03_t_b {
				padding-left: 10px;
				position: relative;
				padding-right: 360px;
				display: flex;
				.Is03_user {
					width: 908px; // width: 100%;
					// min-width: 550px;
					height: 110px;
					border: 1px solid #E6E8F2;
					margin-top: 20px;
					.Is03_user_top {
						padding-left: 20px;
						font-size: 14px;
						/*width: 100%;*/
						height: 30px;
						line-height: 30px;
						border-bottom: 1px solid #E6E8F2;
					}
					.Is03_user_btn {
						width: 100%;
						height: 80px;
						/*text-align: center;*/
						.Is03_user_boxnone {
							text-align: center;
							font-size: 14px;
							color: #999999;
							line-height: 80px;
						}
					}
				}
				.Is03_user02 {
					// position: absolute;
					// right: 0;
					// top: 0;
					// width: 350px;
					// float: right;
					// padding-left: 10px;
					margin-left: 20px;
					padding-top: 20px;
					button {
						color: #0086FF;
					}
				}
			}
			.Is03_t_b02 {
				/*width: 100%;*/
				background: #F3F4F9;
				min-height: 615px;
				padding: 10px 360px 0 0; // display: flex;
				margin: 18px 0 100px 0;
				position: relative;
				.Is03_t_b02_l {
					background: #fff;
					min-height: 550px;
					width: 100%;
					min-width: 930px;
					margin-right: 10px;
					padding-bottom: 10px;
					.form_top {
						min-width: 930px;
						padding: 10px;
						padding-bottom: initial;
						.el-form {
							min-width: 930px;
						}
					}
					.table {
						padding: 10px;
						padding-top: initial;
					}
				}
				.Is03_t_b02_r {
					position: absolute;
					background: #fff;
					width: 350px;
					min-height: 550px;
					padding: 10px;
					right: 0;
					top: 10px;
					.Selection_of_couponsbox {
						width: 270px;
						height: 90px;
						line-height: 90px;
						color: #879CB8;
						/*// font-size: 30px;*/
						/*text-align: center;*/
						border: 1px dotted #879CB8;
						cursor: pointer;
						.tit10 {
							display: inline-block;
							line-height: 90px;
						}
						.ml110 {
							margin-left: 110px;
						}
					}
				}
			}
		}
	}
	.newaddReceive {
		width: 560px; // height: 350px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		top: 145px;
		left: 30px;
		background: #FFFFFF;
		border: 1px solid #CCCCCC;
		z-index: 9;
		padding: 25px 25px 25px 15px;
		.newaddspan {
			display: inline-block;
			width: 60px;
			text-align: right;
			font-size: 14px;
		}
		.newaddinput {
			width: 300px!important;
			height: 32px!important;
		}
		.add_quan {
			width: 270px;
			height: 90px;
			background: rgba(255, 255, 255, 1);
			display: inline-block;
			border: 1px dotted #B7C9E1;
			text-align: center;
			margin-left: 10px;
			cursor: pointer;
			.jiahao {
				font-size: 35px;
				border-radius: 1px;
				color: rgba(135, 156, 184, 1);
				text-align: center;
				line-height: 80px;
				display: inline-block;
				margin-left: 100px;
			}
			.c_jh {
				font-size: 14px;
				color: rgba(204, 204, 204, 1);
				line-height: 85px;
				display: inline-block;
			}
		}
		.edit_quan {
			width: 270px;
			height: 90px;
			background: rgba(255, 255, 255, 1);
			display: inline-block;
			cursor: pointer;
		}
		.footer {
			width: 100%;
			border-top: 1px solid #CCCCCC;
			padding-top: 10px;
			margin-top: 20px;
			text-align: center;
		}
		.add_tit {
			font-size: 12px;
			font-family: PingFangSC-Regular;
			color: rgba(204, 204, 204, 1);
			width: 154px;
			margin-left: 10px;
		}
	}

	.editReceive {
		width: 560px; // height: 350px;
		// box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		// top: 145px;
		// left: 30px;
		// background: #FFFFFF;
		// border: 1px solid #CCCCCC;
		// z-index: 9;
		// padding: 25px 25px 25px 15px;
		.newaddspan {
			display: inline-block;
			width: 60px;
			text-align: right;
		}
		.newaddinput {
			width: 300px!important;
			height: 32px!important;
		}
		.add_quan {
			width: 270px;
			height: 90px;
			background: rgba(255, 255, 255, 1);
			display: inline-block;
			border: 1px dotted #B7C9E1;
			text-align: center;
			margin-left: 10px;
			cursor: pointer;
			.jiahao {
				font-size: 35px;
				border-radius: 1px;
				color: rgba(135, 156, 184, 1);
				text-align: center;
				line-height: 80px;
				display: inline-block;
				margin-left: 100px;
			}
			.c_jh {
				font-size: 14px;
				color: rgba(204, 204, 204, 1);
				line-height: 85px;
				display: inline-block;
			}
		}
		.edit_quan {
			width: 270px;
			height: 90px;
			background: rgba(255, 255, 255, 1);
			display: inline-block;
			cursor: pointer;
		}
		.footer {
			width: 100%;
			border-top: 1px solid #CCCCCC;
			padding-top: 10px;
			margin-top: 20px;
			text-align: center;
		}
		.add_tit {
			font-size: 12px;
			font-family: PingFangSC-Regular;
			color: rgba(204, 204, 204, 1);
			width: 154px;
			margin-left: 10px;
		}
	}
	.Select_coupons {
		width: 875px; // height: 470px;
		border: 1px solid #E6E8F2;
		.Select_coupons_t {
			/*width: 100%;*/
			/*height: 50px;*/
			background: rgba(249, 250, 254, 1);
			border-radius: 3px 3px 0px 0px;
			border-bottom: 1px solid #E6E8F2;
			padding: 10px;
			display: flex;
			.sort {
				width: 380px!important;
				height: 32px!important;
				margin-right: 10px;
			}
			.sort02 {
				width: 340px!important;
				height: 32px!important;
				margin-right: 10px;
			}
			.btn {
				width: 60px;
				height: 30px;
				background: rgba(255, 255, 255, 1);
				border-radius: 3px 2px 2px 3px;
				border: 1px solid #E6E8F2;
				background: #fff;
				color: #0086FF;
				font-size: 14px;
			}
		}
		.Select_coupons_b {
			width: 100%;
			height: 416px;
			overflow-y: auto;
			padding-top: 18px;
			padding-bottom: 18px;
			padding-left: 15px;
			.Select_box {
				width: 270px;
				height: 90px;
				margin-bottom: 10px;
				background: url(../../../../../../static/images/businessManage/icon_quan_gray.png) no-repeat center;
				cursor: pointer;
				.s-t_b {
					width: 85px;
					color: #878787;
					height: 100%;
					font-size: 12px;
					text-align: center;
					padding-top: 20px;
					.tit01 {
						font-size: 18px;
					}
				}
				.s-t_b02 {
					// width: 183px;
					width: 166px;
					height: 100%;
					padding: 7px;
					font-size: 12px;
					padding-left: 12px;
					.tit02 {
						color: #878787;
					}
				}
			}
			.f-active {
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
			}
		}
		.nomore {
			text-align: center;
		}
	}
}

.f-active {
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
}

.Is03_user_box {
	padding: 5px 20px 0 20px;
	width: 908px;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	line-height: 24px;
	word-wrap: break-word;
}

.totaluser {
	position: absolute;
	width: 160px;
	bottom: 5px;
	right: 22px;
	background-color: #fff;
}

.mt30 {
	margin-top: 30px;
}

.border_top {
	border-top: 1px solid #E5E5E5;
}

.pt3 {
	padding-top: 3px;
}

.marauto {
	margin: auto;
}

.widnone {
	width: initial!important;
}

.mr20 {
	margin-right: 20px;
}

.hght50 {
	height: 50px;
}

.mt5 {
	margin-top: 5px;
}

.wid180 {
	width: 180px;
}

.poi1 {
	position: relative;
}

.overflowy {
	overflow-y: auto;
}

.mb10 {
	margin-bottom: 10px;
}

.mr5 {
	margin-right: 5px;
}

.poi2 {
	position: absolute;
}

.poi3 {
	position: fixed;
}

.wose {
	white-space: nowrap;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
}

.wose02 {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.bluecolor {
	background: #0086FF;
	color: #FFFFFF;
}

.bluecolor02 {
	color: #0086FF;
}

.wid280 {
	width: 280px;
}

.fl {
	float: left;
}

.fr {
	float: right;
}

.clear02 {
	clear: both;
	overflow: hidden;
}

.mt10 {
	margin-top: 10px;
}

.mr10 {
	margin-right: 10px;
}

.mt20 {
	margin-top: 20px;
}

.ml10 {
	margin-left: 10px;
}

.ml100 {
	margin-left: 100px;
}

.ml75 {
	margin-left: 75px;
}

.linh35 {
	line-height: 35px;
	display: inline-block;
}

.ml60 {
	margin-left: 60px;
}

.mr10 {
	margin-right: 10px;
}

.fontstyle {
	font-style: normal;
}

.mobile {
	margin: 5px;
}

.wid290 {
	width: 290px;
}

.mt7 {
	margin-top: 7px;
}

.fs14 {
	font-size: 14px;
}

.mt14 {
	margin-top: 14px;
}
</style>
