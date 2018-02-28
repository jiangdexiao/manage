<template>
  <div class="list" v-model='SpecialPriceInfo'>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable" > 状态 </el-col>
      <el-col :span='9' class ="SpecialStatusStyle" >  {{SpecialPriceInfo.status==0?'未生效':SpecialPriceInfo.status==1?'已生效':SpecialPriceInfo.status==2?'已失效':'-'}}    </el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable" > 有效时间 </el-col>
      <el-col :span='9'>{{SpecialPriceInfo.startTime}} ~ {{SpecialPriceInfo.endTime}}</el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable"> 特惠商品 </el-col>
      <el-col :span='9'>{{SpecialPriceInfo.goodsName}}</el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable"> 特惠价 </el-col>
      <el-col :span='9'>
        <span v-if='SpecialPriceInfo.skuFlag==0'>{{SpecialPriceInfo.goodsSkuSpecials[0].specialPrice}}</span>
        <el-table
          :data="SpecialPriceInfo.goodsSkuSpecials"
          v-if='SpecialPriceInfo.skuFlag==1'>
          <el-table-column
            prop="skuName"
            label="规格"
            width="120">
          </el-table-column>
          <el-table-column
            prop="specialPrice"
            label="特惠价/元">
          </el-table-column>
            <el-table-column
            prop="supplyPrice"
            label="活动供货价/元" v-if="countMode==1">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter='20' v-if="countMode==1 && SpecialPriceInfo.skuFlag==0">
      <el-col :span='2' class="lable" > 活动供货价 </el-col>
      <el-col :span='9' >{{SpecialPriceInfo.goodsSkuSpecials[0].supplyPrice==''?'--':SpecialPriceInfo.goodsSkuSpecials[0].supplyPrice}}</el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable" > 祝贺语 </el-col>
      <el-col :span='9' >{{SpecialPriceInfo.congratulations==''?'--':SpecialPriceInfo.congratulations}}</el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2'  class="lable"> 活动说明 </el-col>
      <el-col :span='9' >{{SpecialPriceInfo.activityDescription=="" ?'--':SpecialPriceInfo.activityDescription}}</el-col>
    </el-row>
    <el-row :gutter='20'>
      <el-col :span='2' class="lable">&nbsp; </el-col>
      <el-col :span='9' > <el-button type="primary" size="medium" @click="goBack()" >返回</el-button></el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data (){
    return{
      SpecialPriceInfo:'', // 请求到的特惠信息
      countMode:1, // 1 按供货价 2 按服务费率
    }
  },
  methods:{
    // 获取到详情信息
    getSpecialPriceInfo(){
      let that = this
      that.api_sellerManagePlatform_getSpecialPriceInfo({
          pathParams:'/'+sessionStorage.getItem('specialId')
        }).then(result=>{
        console.log(result.content)
        if(result==undefined){
          return false
        }else if(result.status == '200'){
          // 展示金额 转换
          for(var i = 0 ;i < result.content.goodsSkuSpecials.length;i++){
            result.content.goodsSkuSpecials[i].specialPrice=(result.content.goodsSkuSpecials[i].specialPrice)
            result.content.goodsSkuSpecials[i].supplyPrice=(result.content.goodsSkuSpecials[i].supplyPrice)
          }
          // 时间戳 转换
          result.content.startTime = this.tool.date.format(new Date(result.content.startTime), 'yyyy-M-d').replace(/(.+?)\-(.+?)\-(.+)/,"$1年$2月$3日")
          result.content.endTime = this.tool.date.format(new Date(result.content.endTime), 'yyyy-M-d').replace(/(.+?)\-(.+?)\-(.+)/,"$1年$2月$3日")
          that.SpecialPriceInfo = result.content
        }
      })
    },
    // 根据商家ID 获取结算模式
    getCountMode(){
      let that = this
      this.api_sellerManagePlatform_getUserInfo({
        pathParams: '/' + sessionStorage.getItem('dealerId')
      }).then(res=>{
        if(res==undefined){
            return false
        }else if(res.status == '200'){
          that.countMode = res.content.countMode
        }
      })
    },
    // 返回特惠列表
    goBack() {
      window.history.go(-1)
      sessionStorage.removeItem("specialId");
      sessionStorage.removeItem("dealerId");
    },
  },
 mounted (){
   let that = this
  that.getSpecialPriceInfo()
  that.getCountMode()
  }
}

</script>
<style>
  body{
    font-size:14px;
    line-height:40px;
  }
  .lable{height-line:20px;color:#666;text-align:right }
  .SpecialStatusStyle {
    font-size:18px;
    color:#999;
  }
  .el-table__body-wrapper tbody{
      background:#f4f5fa;
  }
</style>
