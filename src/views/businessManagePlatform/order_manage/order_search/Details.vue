<template>
  <div class="order_detail">
    <div class="order_base">
			<p>订单基础信息</p>
			<ul class="ul_left">
				<li><span class="span_left">订单状态</span><span>{{order_list.orderStatusStr}}</span></li>
				<li><span class="span_left">商家订单号</span><span>{{order_list.dealerOrderId}}</span></li>
			</ul>
			<ul>
				<li><span class="span_right">订单号</span><span>{{order_list.orderId}}</span></li>
				<li><span class="span_right">下单时间</span><span>{{order_list.createTime}}</span></li>
			</ul>
		</div>
		<div class="order_user_info">
			<p>订单用户信息</p>
			<ul class="ul_left">
				<li><span class="span_left">下单用户名/账号</span><span>{{order_list.userName}}</span></li>
				<li><span class="span_left">收货人</span><span>{{order_list.revPerson}}</span></li>
				<li><span class="span_left">评论状态</span><span>{{order_list.commentStatus===0?'待评论':order_list.commentStatus===1?'已评论':''}}</span></li>
			</ul>
			<ul>
				<li><span class="span_right">收货地址</span>
					<span>
						{{order_list.province}}
						{{order_list.city}}
						{{order_list.areaCounty}}
						{{order_list.streetAddress}}
					</span>
				</li>
				<li><span class="span_right">联系电话</span><span>{{order_list.revPhone}}</span></li>
				<li><span class="span_right">买家留言</span><span>{{order_list.noted}}</span></li>
			</ul>
		</div>
		<div class="order_business_info">
			<p>商家商品信息</p>
			<ul class="ul_left">
				<li><span class="span_left">商家名称</span><span>{{order_list.dealerName}}</span></li>
			</ul>
			<ul>
				<li><span class="span_right">店铺名称</span><span>{{order_list.shopName}}</span></li>
			</ul>
			<div class="details_table">
				<el-table
					:data="order_list.dtlList"
					stripe>
					<el-table-column
						type="index"
						width="50">
					</el-table-column>
					<el-table-column
						prop="goodsName "
						label="商品信息"
						width="300">
						<template slot-scope="scope"><img v-bind:src="scope.row.goodsIcon" style="width: 60px;height: 60px;"/>
							<a class="ellipsis2" :title="scope.row.goodsName">{{scope.row.goodsName}}<br><span style="font-size:12px;color:#999999;">{{scope.row.skuName?'规格:':''}}{{scope.row.skuName}}</span></a>
						</template>
					</el-table-column>
					<el-table-column
						label="媒体信息"
						align="center">
						<template slot-scope="scope">
							{{scope.row.mediaName}}
							<br>
							{{scope.row.mediaId}}
						</template>
					</el-table-column>
					<el-table-column
						prop="mediaResId"
						align="center"
						label="广告位信息"
						:formatter="mediaResId">
					</el-table-column>
					<el-table-column
						prop="sellNum"
						align="center"
						label="数量">
					</el-table-column>
					<el-table-column
						prop="goodsUnit"
						align="center"
						label="单位">
					</el-table-column>
					<el-table-column
						prop="price"
						align="center"
						label="单价（元）"
						width="150">
						<template slot-scope="scope">
							<div v-if="scope.row.isSpecial==1">特惠价{{(scope.row.specialPrice)}}</div>
							<div :class="{'lineThrough':scope.row.isSpecial==1}">{{scope.row.price}}</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="goodsAmount"
						align="center"
						label="商品金额（元）">
					</el-table-column>
					<el-table-column
						prop="freight"
						align="center"
						label="运费（元）">
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="order_acapital_info">
			<p>资金信息</p>
			<ul class="ul_left">
				<li><span class="span_left">支付状态</span><span>{{order_list.payStatusStr}}</span></li>
				<li><span class="span_left">支付单号</span><span>{{order_list.payNo}}</span></li>
			</ul>
			<ul>
				<li><span class="span_right">支付方式</span><span>{{order_list.payWay===1?'支付宝':order_list.payWay===2?'微信':''}}</span></li>
				<li><span class="span_right">发票信息</span><span>{{order_list.invoiceName}}{{order_list.invoiceCode}}</span></li>
			</ul>
		</div>
		<div class="order_acapital_amount">
			<ul>
				<li><span class="span_amount_left">商品总额</span><span class="span_amount_right">{{order_list.goodsAmount}}</span></li>
				<li><span class="span_amount_left">运费</span><span class="span_amount_right">{{order_list.orderFreight}}</span></li>
				<li><span class="span_amount_left">满减</span><span class="span_amount_right">{{order_list.FullCutDiscount}}</span></li>
				<li><span class="span_amount_left">优惠券</span><span class="span_amount_right">{{order_list.couponDiscount}}</span></li>
				<li><span class="span_amount_left">订单总额</span><span class="span_amount_right total_style">{{order_list.orderMoney}}</span></li>
			</ul>
		</div>
  </div>
</template>

<script>
  import { tool } from "../../../../utils/"
  export default {
    name: '',
    data () {
      return {
				order_list: {
					orderId: '',
					dealerOrderId: '',
					createTime: '',
					orderStatusStr: '',
					userName: '',
					province: '',
					city: '',
					areaCounty: '',
					streetAddress: '',
					revPerson: '',
					revPhone: '',
					noted: '',
					commentStatus: '',
					dealerName: '',
					shopName: '',
					invoiceHeader: '',
					invoiceType: '',
					invoiceName: '',
					invoiceCode: '',
					dtlList: [],
					payStatusStr: '',
					payWay: '',
					payNo: '',
					goodsAmount: '',
					orderFreight: '',
					FullCutDiscount: '',
					couponDiscount: '',
					orderMoney: ''
				}
      }
    },
    watch:{
    },
    methods: {
			mediaInfo (row, column) {
				console.log(row)
				if ((row.mediaId !== null || row.mediaName !== null) && row.mediaName !== undefined) {
					return row.mediaId + row.mediaName
				} else {
					return '-'
				}
			},
			mediaResId (row, column) {
				console.log(row)
				if (row.mediaResId !== null) {
					return row.mediaResId
				} else {
					return '-'
				}
			},
    },
    mounted () {
			this.api_businessManagePlatform_getOrderList ({ 
				data: {
					dealerOrderId: sessionStorage.getItem("dealerOrderId")
				},
				pathParams: `/${sessionStorage.getItem("dealerOrderId")}`
			}).then(res => {
				this.order_list = res.content
			})
    }
  }
</script>

<style lang="scss" scoped>
.order_detail {
	width: 100%;
	margin-top: 10px;
	padding-bottom: 22px;
	background: #fff;
	color: #000;
	.lineThrough{text-decoration:line-through;font-size:12px;color:#999;font-weight: 500;}
	p {
		font-size: 16px;
		font-weight: 700;
		margin: 0 33px;
		line-height: 50px;
	}
	.ul_left {
		width: 400px;
	}
	ul {
		display: inline-block;
		// margin-right: 105px;
		li {
			line-height: 36px;
			font-size: 14px;
		}
	}
	.span_left {
		display: inline-block;
		width: 140px;
		text-align: right;
		margin-right: 21px; 
	}
	.span_right {
		display: inline-block;
		width: 80px;
		text-align: right;
		margin-right: 21px; 
	}
	.order_base {
	}
	.order_user_info {
		margin: 18px 0; 
	}
	.order_acapital_amount {
		margin: 10px 20px;
		height: 180px;
		background: #F4F5FA;
		color: #333333;
		ul {
			margin-top: 10px;
			li {
				line-height: 32px;
			}
		}
	}
	.span_amount_left {
		display: inline-block;
		width: 120px;
		text-align: right;
		margin-right: 21px; 
	}
	.span_amount_right {
		display: inline-block;
		width: 100px;
		text-align: right;
	}
	.total_style {
		font-size: 16px;
		color: #FD3242;
	}
	.details_table {
		margin: 0 20px;
		// text-align: center;
		// .el-table th.is-leaf {
		// 	text-align: center;
		// }
	}
	a.ellipsis2 {
		line-height: 20px;
		text-align: left;
    width: 180px;
		height: 60px;
    color: #333333;
    margin-left: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    position: relative;
		display: inline-block;
  }
}
</style>
