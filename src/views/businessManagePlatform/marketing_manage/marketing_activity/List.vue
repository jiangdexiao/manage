<template>
  <div class="m91gj" >
    <p class="gj_bt">你可以选择需要的功能，丰富运营能力及体验</p>
    <div class="tool_box">
      <div class="tools" @click="toGiftPacket()">
        <div class="tools_top tools_bg01">
        </div>
        <div class="tools_body">
          <div class="tools_body_left">
            <div class="tools_heading">新人礼包</div>
            <p>新人礼包将会在客户端用户登<br>录后首次展示，被关闭后存在<br>于个人中心，直到不可享受
						</p>
            <i class="tools_in ml10 poi2"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      toGiftPacket () {
        let _this = this
        _this.$router.push({path: '/m/marketActivity/giftPacketList'})
      }
    }
  }
</script>

<style lang="scss" scoped>
.ml10{
	margin-left: 10px;
}
  .m91gj {
    min-width: 1434px;
    padding-left: 32px;
    color:#000;
    max-width: 1200px;
    min-height: 700px;
    /*margin-left: 226px;*/
    margin-top: 10px;
    .gj_bt{
			font-size:14px;
			/*font-family:PingFangSC-Regular;*/
			color:rgba(153,153,153,1);
      margin-top: 10px;
      margin-bottom: 10px;
			line-height:25px;
    }
    .tool_box{
      width:1120px;
      display: flex;
      .tools{
        cursor: pointer;
        width: 240px;
        height: 270px;
        background: #fff;
        margin-bottom: 20px;
        border: 1px solid #E6E8F2;
        overflow: hidden;
        margin-right: 20px;
        .tools_top {
          width:100%;
          height:150px;
        }
        .tools_bg01{
        	 background:url(../../../../../static/images/businessManage/icon_gifts.png) no-repeat center;
        }
        .tools_body{
        	width: 100%;
        	height: 120px;
          /*padding-left:19px;*/
          position: relative;
          text-align: center;
          background:rgba(199,225,255,0.15);
          border-top:1px dotted #E6E8F2;
          /*padding-bottom: 10px;*/
          .tools_heading{
            line-height: 40px;
            font-size: 16px;
            font-weight: bold;
            padding-top:7px;
          }
          p{
            font-size: 12px;
						color:rgba(153,153,153,1);
						padding-right: 10px;
    				line-height: 20px;
    				width: 180px;
    				margin: auto;
          }

          .tools_in{
            width:8px;
            height: 14px;
   					display: inline-block;
            background: url(../../../../../static/images/businessManage/icon_into.png);
            right: 20px;
    				top: 70px;
          }
        }
      }
    }

  }
  .poi1{
  	position: relative;
  }
  .poi2{
  	position: absolute;
  }
  .poi3{
  	position: fixed;
  }
</style>
