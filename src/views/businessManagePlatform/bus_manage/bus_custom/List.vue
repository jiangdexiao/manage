<template>
  <div class="m91gj">
    <p class="gj_bt">你可以选择需要的功能，丰富运营能力及体验</p>
    <div class="tool_box">
      <div class="tools" @click="goto('/m/clientFunManage/search')">
        <div class="tools_top tools_bg01">
        </div>
        <div class="tools_body">
          <div class="tools_body_left">
            <div class="tools_heading">搜索</div>
            <p>我是搜索功能的简单介绍<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
      <div class="tools" @click="goto('/m/clientFunManage/classification')">
        <div class="tools_top tools_bg02">
        </div>
        <div class="tools_body">
          <div class="tools_body_left" >
            <div class="tools_heading">分类</div>
            <p>我是分类功能的简单介绍<br>和新增平台优惠券<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
      <div class="tools" @click="goto('/m/clientFunManage/mapTreasureHunt')">
        <div class="tools_top tools_bg03">
        </div>
        <div class="tools_body">
          <div class="tools_body_left" >
            <div class="tools_heading">寻宝地图</div>
            <p>我是寻宝地图的简单介绍<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
      <div class="tools" @click="goto('/m/clientFunManage/specialPrice')">
        <div class="tools_top tools_bg04">
        </div>
        <div class="tools_body">
          <div class="tools_body_left" >
            <div class="tools_heading">特惠价</div>
            <p>可以统一修改全平台<br>特惠价商品的角标<i class="tools_in ml10"></i></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      goto (path) {
        this.$router.push({path: path})
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
    margin-top: 10px;
    .gj_bt{
			font-size:14px;
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
        height: 260px;
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
        	 background:url('../../../../../static/images/businessManage/icon_search.png') no-repeat center;
        }
        .tools_bg02{
        	 background:url('../../../../../static/images/businessManage/icon_order.png') no-repeat center;
        }
        .tools_bg03{
        	 background:url('../../../../../static/images/businessManage/icon_map.png') no-repeat center;
        }
        .tools_bg04{
        	 background:url('../../../../../static/images/businessManage/icon_discount.png') no-repeat center;
        }
        .tools_body{
        	width: 100%;
        	height: 110px;
          position: relative;
          text-align: center;
          background:rgba(199,225,255,0.15);
          border-top:1px dotted #E6E8F2;
          /*padding-top: 10px;*/
          .tools_heading{
            line-height: 40px;
            font-size: 16px;
            font-weight: bold;
            padding-top:7px;
          }
          p{
            font-size: 14px;
						color:rgba(153,153,153,1);
						padding-right: 10px;
    				line-height: 20px;
          }

          .tools_in{
            width:8px;
            height: 14px;
   					display: inline-block;
            background: url('../../../../../static/images/businessManage/icon_into.png');
          }
        }
      }
    }

  }
</style>
