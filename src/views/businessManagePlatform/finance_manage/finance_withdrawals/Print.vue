<template>
  <div class="print_voucher">
		<div class="print_btn" @click="printVoucher">打印</div>
		<p>拍获平台提现凭证</p>
		<div class="print_content">
			<table class="goods_table">
				<thead>
					<tr>
						<th class="text_center">客户名称</th>
						<th class="text_content text_padding">{{print_list.correlationName}}</th>
						<th class="text_center">角色</th>
						<th class="text_content text_padding">{{print_list.correlationType}}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="text_center">提现金额</td>
						<td class="text_padding">{{print_list.amount}}元</td>
						<td class="text_center">提现单号</td>
						<td class="text_padding">{{print_list.withdrawalId}}</td>
					</tr>
					<tr>
						<td class="text_center">提现申请时间</td>
						<td class="text_padding">{{print_list.applyTime}}</td>
						<td class="text_center">提现更新时间</td>
						<td class="text_padding">{{print_list.updatedTime}}</td>
					</tr>
					<tr>
						<td class="text_center">提现状态</td>
						<td class="text_padding">{{print_list.wdStatus}}</td>
						<td class="text_center"></td>
						<td></td>
					</tr>
					<tr>
						<td class="text_center text_remarks">申请备注</td>
						<td colspan="3" class="text_remarks" :style="print_list.applyComment===''?'padding-left:10px;':''">{{print_list.applyComment===''?'-':print_list.applyComment}}</td>
					</tr>
					<tr>
						<td class="text_center">财务备注</td>
						<td colspan="3" class="text_remarks" :style="print_list.comment===''?'padding-left:10px;':''">{{print_list.comment===''?'-':print_list.comment}}</td>
					</tr>
				</tbody>
			</table>
			<div style="margin-top:36px;margin-bottom:10px;">提现业务处理记录</div>
			<ul>
				<li v-for='(item,index) in print_list.operLoggerList' :key='index'>{{item.operDes}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{tool.date.format(item.operTime, 'yyyy-MM-dd hh:mm')}}</li>
			</ul>	
		</div>
		<button class="print_back" @click="printBack">返回</button>
  </div>
</template>

<script>
  import { tool } from "../../../../utils/"
  export default {
    name: '',
    data () {
      return {
				print_list: { withdrawalId: '', amount: '', applyComment: '', comment: '', applyTime: '', updatedTime: '', correlationName: '', correlationType: '', wdStatus: '', operLoggerList: [] },
				operLoggerList: []
      }
    },
    watch:{
    },
    methods: {
			printVoucher () {
				window.print()
				this.api_businessManagePlatform_printRecord ({ 
					data: {
						withdrawalId: sessionStorage.getItem('PrintVoucher')
					},
				}).then(res => {
				})
			},
			printBack () {
				this.$router.push({path: '/m/withdrawalManage'})
			}
    },
    mounted () {
			this.api_businessManagePlatform_getPrintDetail ({ 
				data: {
					withdrawalId: sessionStorage.getItem('PrintVoucher')
				},
			}).then(res => {
				this.print_list = res.content
				this.print_list.correlationType = res.content.correlationType === '1'?'促销员':res.content.correlationType === '2'?'商家':res.content.correlationType === '3'?'媒体':res.content.correlationType === '6'?'BD专员':''
				this.print_list.applyTime = tool.date.format(parseInt(res.content.applyTime), 'yyyy-MM-dd hh:mm')
				this.print_list.updatedTime = tool.date.format(parseInt(res.content.updatedTime), 'yyyy-MM-dd hh:mm')
				this.print_list.wdStatus = res.content.wdStatus === '1'?'待审批':res.content.wdStatus === '2'?'待转账':res.content.wdStatus === '3'?'不通过':res.content.wdStatus === '4'?'已转账':res.content.wdStatus === '5'?'作废':''
				// this.print_list.applyComment = res.content.applyComment === ''?'-':res.content.applyComment
				// this.print_list.comment = res.content.comment === ''?'-':res.content.comment
			})
    }
  }
</script>

<style lang="scss" scoped>
@media print {
	.print_voucher {
		position: fixed!important;
		left: -10px;
		top: -100px;
		width: 100%;
		z-index: 1000;
	}
	p {
		margin-top: 50px!important;
	}
	ul li {
		font-size: 12px!important;
	}
	.print_back {
		display: none!important;
	}
	table {
		th, td {
			font-size: 12px!important;
		}
	}
}
.print_voucher {
	// width: 100%;
	min-height: 100%;
	margin: 10px;
	padding-bottom: 20px;
	color: #000000;
	padding-top: 50px;
	background: #fff;
	position: relative;
	.print_btn {
		margin-left: 60px;
		width: 80px;
		color: #5F8AC0;
		font-size: 14px;
		cursor: pointer;
		text-align: center;
		background: url('../../../../../static/images/businessManage/ico_print.png') no-repeat;
	}
	p {
		font-size: 18px;
		text-align: center;
		line-height: 100px;
	}
	.text_center {
		width: 200px;
		background: #F0F0F0;
		text-align: center;
	}
	.text_padding {
		padding: 0 5px;
	}
	.text_content {
		width: 300px;
		text-align: left;
	}
	.text_remarks {
		padding: 5px 5px;
		line-height: 20px;
	}
	.print_content {
		max-width: 1000px;
		margin: 0 auto;
		ul {
			max-height: 500px;
			overflow: hidden;
			li {
				line-height:20px;
				font-size: 14px;
			}
		}
		li {
			line-height:20px;
			font-size: 14px;
		}
	}
	.print_back {
		cursor: pointer;
		width: 80px;
		height: 30px;
		background: #fff;
		border: 1px solid #878787;
		border-radius: 4px;
		margin-left: 60px;
		margin-top: 10px;
		// position: absolute;
		// bottom: 40px;
		// left: 60px;
	}
}
table {
	border-collapse:collapse;
	border: 1px solid #878787;
	th, td {
		height: 42px;
		line-height: 42px;
		font-size: 16px;
		font-weight: 500;
		border: 1px solid #878787;
	}
}

</style>
