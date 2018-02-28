<template>
  <div class="list sp">
    <div class="countQueryDetail">
      <p><span>结算号</span>{{settleId}}</p>
      <p><span>订货号</span>{{dealerOrderId}}</p>
      <p><span>生成时间</span>{{createdTime}}</p>
      <p><span>结算状态</span>{{settleStatus == 1 ?'未结算':settleStatus == 2 ?'已结算':'-' }}</p>
    </div>
    <table>
      <tr>
        <th>客户名称</th>
        <th>角色</th>
        <th>销售分成/元
          <div class="icon">
            <div class="tips">
              <p>未参加平台优惠的分成</p>
            </div>
          </div>
        </th>
        <th>满减分摊/元
          <div class="icon">
            <div class="tips">
              <p>满减活动，需要承担的活动成本</p>
            </div>
          </div>
        </th>
         <th>优惠券分摊/元
          <div class="icon">
            <div class="tips">
              <p>使用优惠券，需要承担的活动成本</p>
            </div>
          </div>
        </th>
        <th>销售结算金额/元
          <div class="icon">
            <div class="tips">
              <p>该角色最终的结算金额</p>
            </div>
          </div>
        </th>
      </tr>
      <tr v-for="item in queryDetails">
        <td>{{item.correlationName}}</td>
        <td>{{item.correlationType}}</td>
        <td>{{(item.saleCutsAmount)}}</td>
        <td>{{(item.activityAmount)}}</td>
        <td>{{(item.couponShareAmount)}}</td>
        <td>{{(item.settleAmount)}}</td>
      </tr>
      <tr>
        <td colspan="6" class="sums">结算总额：{{sums}}</td>
      </tr>
    </table>
    <div style="height:20px">
    </div>
     <div class="return poi3">
      	<button class="r_fh" @click="goBack()">返回</button>
      </div>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
  export default {
    name: '',
    data () {
      return {
        queryDetails:[],
        sums:0,
        settleId:'',
        dealerOrderId:'',
        createdTime:this.$route.query.updateTime,
        settleStatus:''
      }
    },
    methods: {
      getQueryDetails () {
        let that = this
        that.api_sellerManagePlatform_getCountQueryDetail({
              data:{
                token:tool.cookie.getCookie('access_token'),
                settleId: that.settleId
              }
            }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.queryDetails = res.content;
              that.totalCount = res.totalCount;
              for(var i=0;i<that.queryDetails.length;i++){
                that.sums+=parseFloat(that.queryDetails[i].settleAmount)
                }
            }
          })
      },
      goBack () {
        this.$router.go(-1)
            },
    },
    mounted () {
      let that = this
      that.settleId=that.$route.query.settleId
      that.dealerOrderId = that.$route.query.dealerOrderId
      that.settleStatus = that.$route.query.settleStatus
      that.getQueryDetails()
    }
  }

</script>
<style lang="scss" scoped>
  .sp{
    padding:10px;
    height:auto;
    min-height:880px;
    background-color: #fff;
    .countQueryDetail{
      font-size:14px;padding:20px;width:1000px;float:left;
      p{line-height:30px;color:#333; display:inline-block;width:350px;float:left;margin-left:120px;
        span{display:inline-block;width:100px;margin-left:-100px;margin-right:20px;text-align:left;color:#666;}
      }
    }
    table{width:100%;border:none;margin:none;padding:0px;
 border-collapse:collapse;
      tr th,tr td{height:40px;background: #F4F5FA;box-shadow: 0 1px 0 0 #E5E5E5;line-height:40px;font-size: 14px;
      color: #666;text-indent: 3em;text-align: left;}
      tr:nth-child(odd):hover td{background: #DFE9F6;}
      tr th{background: #DFE9F6;font-weight:400;
        div.icon{width:16px;height:16px; display:inline-block; position:relative;
        background:url('../../../../../static/images/sellerManage/css_sprites.png') no-repeat -848px -50px;
          div.tips{display:none;width:100px;height:auto;background:#fff;border:1px solid #E5E5E5;border-radius: 4px;box-shadow: 0 1px 0 0 #E5E5E5;position: absolute;top:18px;left:0px; text-indent: 0;padding:6px;font-weight:normal;
            p{line-height:24px;font-size:12px; color:#666;}
          }
        }
        div.icon:hover div.tips{display:block;}
      }
      tr td.sums{
        text-align: right;
        padding-right:60px;
        height:50px;
      }
    }
  }
  .r_fh{
  			border: 1px solid #CCCCCC;
  			border-radius: 2px;
  			font-size: 14px;
  			color: #333333;
  			width: 80px;
  			height: 30px;
  			line-height: 30px;
  			background: #fff;
  		}
</style>
