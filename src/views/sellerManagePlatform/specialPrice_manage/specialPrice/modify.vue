<template>
  <div class="list">
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight"><i class="red">*</i>有效时间</el-col>
      <el-col :span="9" class="inline">
        <el-date-picker style="padding-bottom:1px;"
          v-model="time"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期" v-if="timeShow"
          end-placeholder="结束日期" value-format="yyyy-MM-dd"
          :picker-options="pickerBeginDateBefore"
          @change="timeCheck">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight"><i class="red">*</i>特惠商品</el-col>
      <el-col :span="9" class="inline">
        <a @click="chooseGood()" v-if="goodsName == '' && handle_toggle == 'add'" class="a">选择商品</a>
        <p style="display:inline-block;margin-right:20px;" v-if="goodsName != ''">{{goodsName}}</p>
        <el-button size="medium" @click="chooseGood()" v-if="goodsName != '' && handle_toggle == 'add'">修改</el-button>
        <em>只能选择已通过审核且已经绑定广告图的商品</em>
      </el-col>
    </el-row>
    <!--按供货价时-->
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight"><i class="red">*</i>特惠价</el-col>
      <el-col :span="9" v-if="specialPriceInfo.skuFlag == -1">
        <template>
          <el-input type="number" placeholder="请填写" :disabled="goodsName == ''"><i slot="suffix" class="fr" style="font-style:normal;margin-right:10px;line-height:36px;">元</i></el-input>
        </template>
      </el-col>
      <el-col :span="9" v-if="specialPriceInfo.skuFlag == 0">
        <template v-for="item in goodsSkuList">
          <el-input type="number" placeholder="请填写" v-model="item.specialPrice"><i slot="suffix" class="fr" style="font-style:normal;margin-right:10px;line-height:36px;">元</i></el-input>
          <em>商品拍获价{{(item.goodsSkuPrice)}}元<template v-if="countMode==1">，供货价{{(item.goodsSupplyPrice)}}元</template></em>
        </template>
      </el-col>
      <el-col :span="16" v-if="specialPriceInfo.skuFlag == 1">
        <div id="table">
          <el-table class="table"
            :data="goodsSkuList"
            tooltip-effect="dark" :width="widthTable"
            style="margin-bottom:20px;">
            <el-table-column
              prop="goodsSkuName"
              label="规格值" width="200"
              >
            </el-table-column>
            <el-table-column
              label="拍获价/元" width="200"
              >
              <template slot-scope="scope">
                {{(scope.row.goodsSkuPrice)}}
              </template>
            </el-table-column>
            <el-table-column
              label="供货价/元" width="200"
              v-if="countMode==1"
              >
              <template slot-scope="scope">
                {{(scope.row.goodsSupplyPrice)}}
              </template>
            </el-table-column>
            <el-table-column
              label="*特惠价/元" width="200"
              >
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.specialPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="*活动供货价/元" width="200"
              v-if="countMode==1"
              >
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.supplyPrice"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="countMode==1 && specialPriceInfo.skuFlag == 0">
      <el-col :span="3" class="alginRight"><i class="red">*</i>活动供货价</el-col>
      <el-col :span="9">
        <template v-for="item in goodsSkuList">
          <el-input type="number" placeholder="请填写" v-model="item.supplyPrice"><i slot="suffix" class="fr" style="font-style:normal;margin-right:10px;line-height:36px;">元</i></el-input>
        </template>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight"><i class="red">*</i>祝贺语</el-col>
      <el-col :span="9">
        <el-input placeholder="拍照购物限时特价资格" v-model="specialPriceInfo.congratulations" :maxlength="15"><i slot="prepend" class="fl" style="font-style:normal;line-height:34px;">恭喜您获得</i></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight">活动说明</el-col>
      <el-col :span="9" style="margin-top:7px;">
        <el-input type="textarea"
          :rows="3"
          placeholder="请输入内容,1-100个字符"
          v-model="specialPriceInfo.activityDescription" :maxlength="100">
        </el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3" class="alginRight"></el-col>
      <el-col :span="9" :offset="3" class="inline">
        <el-button type="primary" size="medium" @click="submitModify()">保存</el-button>
        <router-link :to="{name:'s_specialPrice_list'}"><el-button size="medium">取消</el-button></router-link>
      </el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <div class="hptczp" v-if="chooseGoodShow"></div>
    <div class="infoBox" v-if="chooseGoodShow">
      <h4>选择商品<a class="close" @click="close()"></a></h4>
      <div class="search">
        <el-input type="text" class="inp" v-model="searchCondition" placeholder="输入商家名称/商品名称" >
        <el-button slot="append" icon="el-icon-search" @click="infoShow()"></el-button>
        </el-input>
      </div>
      <div class="line"></div>
      <ul v-if="goodInfos.length != 0">
        <li v-for="(item,index) in goodInfos" @click="checkGood(item,index)" :class="{'active':isactive==index}" >
          <h4 class="ellipsis">{{item.dealerName}}</h4>
          <div class="infoLi">
            <img :src="item.goodsImageUrl"/>
            <a class="ellipsis2">{{item.goodsName}}</a>
            <p>{{(item.goodsPrice)}}元</p>
          </div>
          <i></i>
        </li>
      </ul>
      <h5 v-if="goodInfos.length == 0">暂无数据</h5>
      <div class="block fl" style="margin-top:20px;margin-left:20px;">
        <el-pagination
          @current-change="currentChange"
          :current-page="currentPage"
          :page-size="pageRows"
          layout="total, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
        <h6 class="fr">只可选择一个商品</h6>
      </div>
      <div class="block fl" style="text-align:center;">
        <el-button type="primary" size="medium" @click="checked()">确定</el-button>
        <el-button size="medium" @click="close()">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        startTime:null,
        widthTable:this.countMode == 1?'1000':'600',
        pickerBeginDateBefore:{
          // 小于今天的有效期不能使用
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
        countMode:1,// 1 按供货价 2 按服务费率
        canInput:true,
        time:[],//时间
        timeChecked:[], // 修改进入 对比开始时间
        timeShow:true,
        status:this.$route.query.status==undefined?'':this.$route.query.status, // 如果是修改进入获取status 否则默认空
        currentPage:1,//当前页码
        pageRows:9,//每页展示条数
        totalCount:0,//总条数
        specialPriceInfo: { activityDescription: '', startTime: '', endTime: '', congratulations: '拍照购物限时特价资格',skuFlag:-1},//特惠价信息 上送字段
        chooseGoodShow:false,//选择商品弹层
        searchCondition:'',//搜索条件
        goodInfos:[],//请求到的商品列表
        goodsSkuList:[],//商品规格库
        good:{}, // 选中但未确认时暂存数据
        goodsName:'',
        goodsId:'',
        dealerId:'',
        dealerName:'',
        isactive:null,//当前选中样式
        indexPage:0,//当前选中页面暂存
        indexLi:null,
        handle_toggle:this.$route.query.handle_toggle, //区别是新增还是修改进入
        specialId:this.$route.query.specialId==undefined?'':this.$route.query.specialId, // 如果是修改进入获取specialId 否则默认空
      }
    },
    methods: {
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
              that.specialPriceInfo.startTime = that.time[0]
              that.specialPriceInfo.endTime = that.time[1]
              that.$nextTick(()=>{
                that.timeShow = true
                console.log(that.time)
              })
            }else if(that.time[1] < that.date_format(new Date, 'yyyy-MM-dd')){
              that.$message({
                message: '结束日期不能小于今天',
                type: 'warning'
              });
              that.timeShow = false
              that.time = that.timeChecked
              that.specialPriceInfo.startTime = that.time[0]
              that.specialPriceInfo.endTime = that.time[1]
              that.$nextTick(()=>{
                that.timeShow = true
                console.log(that.time)
              })
            }else{
              that.specialPriceInfo.startTime = that.time[0]
              that.specialPriceInfo.endTime = that.time[1]
            }
          }else{
            that.specialPriceInfo.startTime = that.time[0]
            that.specialPriceInfo.endTime = that.time[1]
          }
        } else {
          that.specialPriceInfo.startTime = ''
          that.specialPriceInfo.endTime = ''
        }
      },
      // 显示条数
      sizeChange(val){
        let that = this
        that.pageRows = val
        that.infoShow()
      },
      // 显示页码
      currentChange(val){
        let that = this
        that.currentPage = val
        that.isactive = null
        that.infoShow()
        if(that.currentPage === that.indexPage){
          that.isactive = that.indexLi
        }
      },
      // 选择商品按钮
      chooseGood(){
        let that = this
        that.chooseGoodShow = true
        that.infoShow()
        that.$nextTick(()=>{
          if(that.goodsId != ''){
            for(let i = 0; i<that.goodInfos.length; i++){
              if(that.goodsId == that.goodInfos[i].goodsId){
                that.indexLi = that.isactive = i
                that.good = that.goodInfos[i]
              }
            }
          }
        })
      },
      // 显示商品
      infoShow() {
        let that = this
        that.api_sellerManagePlatform_getRecognized({
          data:{
            rows: that.pageRows, // 每页多少条数据
            pageNum: that.currentPage, // 请求第几页
            condition: that.searchCondition // 请求条件
          }
        }).then(result=>{
          console.log(result.content)
          if(result==undefined){
            return false
          }else if(result.status == '200'){
            that.goodInfos = result.content
            that.totalCount = result.totalCount
          }
        })
        // that.$.ajax({
        //   type: 'get',
        //   url: that.localbase + 'm2c.scm/goods/choice/recognized',
        //   data: {
        //     token: sessionStorage.getItem('mToken'),
        //     rows: that.pageRows, // 每页多少条数据
        //     pageNum: that.currentPage, // 请求第几页
        //     condition: that.searchCondition // 请求条件
        //   },
        //   success: function (result) {
        //     that.goodInfos = result.content
        //     that.totalCount = result.totalCount
        //   }
        // })
      },
      // 选择商品
      checkGood (item, index) {
        let that = this
        that.good = item
        that.indexLi = that.isactive = index
        that.indexPage = that.currentPage
      },
      // 选择商品 确定按钮
      checked () {
        let that = this
        if(that.good.goodsName != undefined){
          that.goodsSkuList = that.good.goodsSkuList
          that.goodsName = that.good.goodsName
          that.specialPriceInfo.skuFlag = that.good.skuSingleFlag
          that.chooseGoodShow = false
          that.goodsId = that.good.goodsId,
          that.dealerId = that.good.dealerId,
          that.dealerName = that.good.dealerName
          let dealerId = that.dealerId
          that.getCountMode(dealerId)
        }else{
          that.$message({
            type:'warning',
            message:'您还没有选中商品'
          })
          that.chooseGoodShow = true
        }
      },
      // 根据商家ID 获取结算模式
      getCountMode(dealerId){
        let that = this
        console.log(dealerId)
        this.api_sellerManagePlatform_getUserInfo({
          pathParams: '/' + dealerId
        }).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status == '200'){
            that.$nextTick(()=>{
              that.countMode = result.content.countMode
              console.log(result)
              if(that.specialPriceInfo.skuFlag == 1){
                console.log("多规格")
                if(that.countMode == 1){
                  document.getElementById("table").style.width="1000px";
                }else if(that.countMode == 2){
                  document.getElementById("table").style.width="600px";
                }else{
                  document.getElementById("table").style.width="600px";
                }
              }
            })
          }
        })
        // that.$.ajax({
        //   type: 'get',
        //   url: that.localbase + 'm2c.scm/dealer/sys/' + dealerId,
        //   data:{
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     that.$nextTick(()=>{
        //       that.countMode = result.content.countMode
        //       console.log(that.countMode)
        //       if(that.specialPriceInfo.skuFlag == 1){
        //         console.log("多规格")
        //         if(that.countMode == 1){
        //           document.getElementById("table").style.width="1000px";
        //         }else if(that.countMode == 2){
        //           document.getElementById("table").style.width="600px";
        //         }else{
        //           document.getElementById("table").style.width="600px";
        //         }
        //       }
        //     })
        //   }
        // })
      },
      // 选择商品 取消
      close(){
        let that = this
        that.chooseGoodShow = false
        that.indexLi = that.isactive = null
        that.searchCondition = ''
      },
      // 请求新增的specialId
      getSpecialId() {
        let that = this
        this.api_sellerManagePlatform_getSpecialId({}).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status == '200'){
            that.specialId = result.content
          }
        })
        // that.$.ajax({
        //   type: 'get',
        //   url: that.localbase + 'm2c.scm/goods/special/id',
        //   data: {
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     that.specialId = result.content
        //   }
        // })
      },
      // 编辑进入请求详情
      getSpecialPriceInfo(){
        let that = this
        that.api_sellerManagePlatform_getSpecialPriceInfo({
          pathParams:'/'+sessionStorage.getItem('specialId')
        }).then(result=>{
          console.log(result.content)
          if(result==undefined){
            return false
          }else if(result.status == '200'){
            that.specialPriceInfo.activityDescription = result.content.activityDescription
            that.specialPriceInfo.congratulations = result.content.congratulations
            that.startTime = result.content.startTime
            let ds = this.tool.date.format(new Date(result.content.startTime), 'yyyy-MM-dd')
            let de = this.tool.date.format(new Date(result.content.endTime), 'yyyy-MM-dd')
            that.specialPriceInfo.startTime = ds
            that.specialPriceInfo.endTime = de
            that.time.push(ds,de)
            that.timeChecked.push(ds,de)
            that.goodsName = result.content.goodsName
            that.specialPriceInfo.skuFlag = result.content.skuFlag
            that.goodsSkuList = result.content.goodsSkuSpecials
            let dealerId = result.content.dealerId
            that.getCountMode(dealerId)
            for(var i=0;i<result.content.goodsSkuSpecials.length;i++){
              that.goodsSkuList[i].specialPrice = (result.content.goodsSkuSpecials[i].specialPrice)
              that.goodsSkuList[i].goodsSkuId = result.content.goodsSkuSpecials[i].skuId
              that.goodsSkuList[i].goodsSkuName = result.content.goodsSkuSpecials[i].skuName
              if(that.countMode==1){
                that.goodsSkuList[i].supplyPrice = (result.content.goodsSkuSpecials[i].supplyPrice)
              }
            }
          }
        })
        // that.$.ajax({
        //   type:"get",
        //   url: that.base + 'm2c.scm/goods/special/'+that.specialId,
        //   data: {
        //     token: sessionStorage.getItem('mToken'),
        //   },
        //   success: function (result) {
        //     console.log(result.content)
        //     that.specialPriceInfo.activityDescription = result.content.activityDescription
        //     that.specialPriceInfo.congratulations = result.content.congratulations
        //     that.startTime = result.content.startTime
        //     let ds = this.tool.date.format(new Date(result.content.startTime), 'yyyy-MM-dd')
        //     let de = this.tool.date.format(new Date(result.content.endTime), 'yyyy-MM-dd')
        //     that.specialPriceInfo.startTime = ds
        //     that.specialPriceInfo.endTime = de
        //     that.time.push(ds,de)
        //     that.timeChecked.push(ds,de)
        //     that.goodsName = result.content.goodsName
        //     that.specialPriceInfo.skuFlag = result.content.skuFlag
        //     that.goodsSkuList = result.content.goodsSkuSpecials
        //     let dealerId = result.content.dealerId
        //     that.getCountMode(dealerId)
        //     for(var i=0;i<result.content.goodsSkuSpecials.length;i++){
        //       that.goodsSkuList[i].specialPrice = (result.content.goodsSkuSpecials[i].specialPrice)
        //       that.goodsSkuList[i].goodsSkuId = result.content.goodsSkuSpecials[i].skuId
        //       that.goodsSkuList[i].goodsSkuName = result.content.goodsSkuSpecials[i].skuName
        //       if(that.countMode==1){
        //         that.goodsSkuList[i].supplyPrice = (result.content.goodsSkuSpecials[i].supplyPrice)
        //       }
        //     }
        //   }
        // })
      },
      //提交保存
      submitModify(){
        let that = this
        if (that.specialPriceInfo.startTime == '') {
          that.$message({
            type:'warning',
            message:'请选择有效时间'
          });
          return;
        }
        if (that.goodsName == '') {
          that.$message({
            type:'warning',
            message:'请选择特惠商品'
          });
          return;
        }
        console.log(that.countMode)
        if(that.countMode == '1'){
          for(var i=0;i<that.goodsSkuList.length;i++){
            if (that.goodsSkuList[i].specialPrice == undefined || that.goodsSkuList[i].specialPrice == '' || that.goodsSkuList[i].specialPrice <= 0 ) {
              that.$message({
                type:'warning',
                message:'特惠价需大于0且不能为空'
              })
              return;
            }
            if (that.goodsSkuList[i].specialPrice > 999999.99) {
              that.$message({
                type:'warning',
                message:'特惠价不能大于999999.99'
              })
              return;
            }
            if (that.goodsSkuList[i].supplyPrice == undefined || that.goodsSkuList[i].supplyPrice == '' || that.goodsSkuList[i].supplyPrice <= 0) {
              that.$message({
                type:'warning',
                message:'活动供货价需大于0且不能为空'
              })
              return;
            }
            if (that.goodsSkuList[i].supplyPrice > 999999.99) {
              that.$message({
                type:'warning',
                message:'活动供货价不能大于999999.99'
              })
              return;
            }
          }
        }else if(that.countMode == '2'){
          for(var i=0;i<that.goodsSkuList.length;i++){
            if (that.goodsSkuList[i].specialPrice == undefined || that.goodsSkuList[i].specialPrice == ''|| that.goodsSkuList[i].specialPrice <= 0 ) {
              that.$message({
                type:'warning',
                message:'特惠价需大于0且不能为空'
              })
              return;
            }
            if (that.goodsSkuList[i].specialPrice > 999999.99) {
              that.$message({
                type:'warning',
                message:'特惠价不能大于999999.99'
              })
              return;
            }
          }
        }
        if (that.specialPriceInfo.congratulations == '') {
          that.$message({
            type:'warning',
            message:'请填写祝贺语'
          })
          return;
        }
        let goodsSkuSpecial = []
        for(var i=0;i<that.goodsSkuList.length;i++){
          goodsSkuSpecial.push({skuId:'',skuName:'',specialPrice:'',supplyPrice:''})
          goodsSkuSpecial[i].skuId = that.goodsSkuList[i].goodsSkuId
          goodsSkuSpecial[i].skuName = that.goodsSkuList[i].goodsSkuName
          goodsSkuSpecial[i].specialPrice = that.goodsSkuList[i].specialPrice
          if(that.countMode==1){
            goodsSkuSpecial[i].supplyPrice = that.goodsSkuList[i].supplyPrice
          }
        }
        console.log(goodsSkuSpecial)
        let a = {
          token: sessionStorage.getItem('mToken'),
          goodsSkuSpecials:JSON.stringify(goodsSkuSpecial),
          goodsName:that.goodsName,
          specialId: that.specialId,
          goodsId:that.goodsId,
          dealerId:that.dealerId,
          dealerName:that.dealerName
        }
        if(that.handle_toggle == 'add'){
          this.api_sellerManagePlatform_postSpecial({
            type:'post',
            data: Object.assign(that.specialPriceInfo,a)
          }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.$message("保存成功！")
              that.$router.push({name:'s_specialPrice_list'})
            }else{
              that.$message(res.errorMessage)
            }
          })
        }else{
          this.api_sellerManagePlatform_postSpecial({
            type:'put',
            data: Object.assign(that.specialPriceInfo,a),
            pathParams:'/'+that.specialId
          }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.$message("保存成功！")
              that.$router.push({name:'s_specialPrice_list'})
            }else{
              that.$message(res.errorMessage)
            }
          })
        }
      }
    },
    mounted () {
      let that = this
      console.log(that.$route.query.handle_toggle)
      if(that.handle_toggle=='add'){
        that.getSpecialId()
      }else if(that.handle_toggle=='modify'){
        that.getSpecialPriceInfo()
      }
    }
  }
</script>

<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
ul{list-style: none;}
  #table{overflow-x:hidden}
  .el-date-table tr{background:#fff;}
  .alginRight{text-align: right; line-height:50px;color:#666;}
  .inline{display:inline-block;line-height:50px;}
  .line{width:100%;margin:4px auto;height:1px;background:#eee;}
  .block{display:block;width:94%;}
  .el-pagination{display:inline-block;}
  .el-input,.el-date-editor--daterange.el-input__inner{width:100%;}
  .table .el-input{width:100px;}
  em{display:block;font-style:normal;line-height:20px;color:#999;margin-bottom:10px;font-size:12px;}
    .infoBox{width:900px;height:680px;position:fixed;top:50%;left:50%;margin-top:-340px;margin-left:-450px;
      background:#fff;border-radius:5px;z-index: 1000;
      h5{font-size:16px;color:#666;
        padding-top:240px;
        line-height:40px;
        margin:74px 0;
        text-align: center;
        background:url('../../../../../static/images/sellerManage/image_repair.png') no-repeat center top;
      }
      h4{background:#DFE9F6;width:100%;height:50px;line-height: 50px;text-indent: 1.5em;color:#666;font-size:16px;}
      a.close{display:inline-block;width:50px; height:50px;position:absolute;top:0; right:0;background: url(' ../../../../../static/images/sellerManage/css_sprites.png') -294px -326px no-repeat;opacity:1;}
      h6{height:40px;line-height: 40px;text-indent:20px;color:#FD3242;font-size:12px;display:inline-block;}
      .search{
        display: inline-block;
        position: relative;margin-left:20px;margin-top:10px;
        .inp{
          width: 380px;
          height: 36px;
          color: #444444;
        }
        i{
          width: 50px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border: 1px solid #ccc;
          background-color: rgba(242, 242, 242, 1);
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      ul{
        display: block;
        width:100%;padding:20px;
        height:438px;padding-bottom:0px; 
        li{
          float:left;width:280px;height:130px;border:1px solid #E5E5E5;margin:3px;padding:10px;border-radius:3px; box-sizing:border-box;
          position: relative; transition: all 0.3s ease;
          h4{background:#F4F5FA;height:30px;line-height: 30px;text-indent:10px;float:left;margin-left:-10px;margin-top:-10px;width:278px;}
          .infoLi{float:left;margin-top:10px;height:80px;
            img{width:80px;height:80px;float:left;margin-right:10px;}
            a,p{line-height:24px;width:230px;}
            a{margin-bottom:10px;height:48px;width:160px;}
          }
          i{
            position: absolute;bottom:0px;right:0px;width:20px;height:20px;background: url('../../../../../static/images/sellerManage/css_sprites.png') -410px -716px no-repeat;display: none;
          }
        }
        li.active{
          border-color:#409eff; box-shadow: 0px 0px 1px #409eff;
          i{display:block;}
        }
      }

    }
</style>
