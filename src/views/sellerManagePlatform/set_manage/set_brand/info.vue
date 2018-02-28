<template>
  <div class="list">
    <!--详情-->
    <div class="goodInfo">
      <p><span>品牌名称：</span>{{goodInfo.brandName==''?'--':goodInfo.brandName}}</p>
      <p><span>英文名称：</span>{{goodInfo.brandNameEn==''?'--':goodInfo.brandNameEn}}</p>
      <p><span>品牌区域：</span>
        <template v-if="goodInfo.firstAreaName=='' && goodInfo.twoAreaName=='' && goodInfo.threeAreaName==''">--</template>
        <template v-if="goodInfo.firstAreaName != '' || goodInfo.twoAreaName!='' || goodInfo.threeAreaName!=''">
          {{goodInfo.firstAreaName==''?'':goodInfo.firstAreaName}}
          {{goodInfo.twoAreaName=='' ? '': ','+ goodInfo.twoAreaName}}
          {{goodInfo.threeAreaName==''? '': ',' + goodInfo.threeAreaName}}</template>
      </p>
      <div>
        <span class="fl">品牌LOGO：</span>
        <template v-if="goodInfo.brandLogo != ''"><img :src="goodInfo.brandLogo" /></template>
        <template v-if="goodInfo.brandLogo == ''">--</template>
      </div>
      <span v-show="activeName=='second'">
        <p v-show="goodInfo.rejectReason!==''"><span>拒绝原因：</span>{{goodInfo.rejectReason}}</p>
        <el-button v-show="goodInfo.approveStatus!==2" type="primary" size="medium" @click="agree_confirm(goodInfo.approveId)">同意</el-button>
        <el-button v-show="goodInfo.approveStatus!==2" type="danger" size="medium" style="margin-left:20px;margin-top:26px;" @click="rejectGoodShow(goodInfo.approveId)">拒绝</el-button>
      </span>
      <el-button size="medium" v-show="goodInfo.approveStatus!==2&&activeName=='second'" class="ml20" @click="goback">返回</el-button>
      <el-button size="medium" v-show="goodInfo.approveStatus==2" @click="goback">返回</el-button>
      <el-button size="medium" v-show="activeName!='second'" @click="goback">返回</el-button>
    </div>
    
    <!--拒绝弹层-->
    <div class="hptczp" v-show="rejectGood===true" ></div>
    <div class="hptczp_content"  v-show="rejectGood===true">
      <div class="hptczp_header">
        <h4>拒绝原因<span class="fr" @click="rejectGoodHide()"></span></h4>
      </div>
      <div class="hptczp_body">
        <textarea placeholder="请填写100字符以内内容" v-model="rejectReason" :maxlength="100"></textarea>
      </div>
      <div class="hptczp_footer">
        <el-button type="primary" size="medium" class="btn save" @click="reject_confirm()" :disabled="rejectReason=='' || noDoubleClickD" >确认</el-button>
        <button type="button" class="btn cancel" @click="rejectGoodHide()" >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        noDoubleClick:false, //禁止同意按钮多次点击
        noDoubleClickD:false, //禁止拒绝按钮多次点击
        activeName: this.$route.query.activeName,
        goodInfo: [],
        handle_toggle: '',
        rejectReason:'',
        rejectGood:false,
        approveId:''
      }
    },
    methods: {
     getBrandInfo(){
        let that = this
        if (that.activeName == 'first') {
          that.api_sellerManagePlatform_getBrand({
            pathParams:'/' + that.$route.query.id
          }).then(result=>{
            that.goodInfo = result.content
          })
        } else {
          that.api_sellerManagePlatform_getApprove({
            pathParams:'/' + that.$route.query.id
          }).then(result=>{
            that.goodInfo = result.content
          })
        }
     },
     goback(){
       let that = this
       that.$router.push({'name':'s_set_brand'})
     },
     // 审核同意
      agree_confirm (n) {
        let that = this
        this.$confirm('是否同意品牌审核', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          that.api_sellerManagePlatform_approveAgree({
            data:{approveId:n}
          }).then(result=>{
            if(result==undefined){
              return false
            }else if(result.status === 200){
              that.$message({
                type:'success',
                message:'操作成功'
              })
              that.$router.push({'name':'s_set_brand'})
            }
          })
        }).catch(() => {
          return
        });
      },
      rejectGoodShow (n) {
        var that = this
        that.approveId = n
        that.rejectGood = true
      },
      // 审核拒绝
      reject_confirm () {
        let that = this
        if (that.rejectReason == '') {
          return
        }
        that.api_sellerManagePlatform_approveReject({
          data:{
            approveId: that.approveId,
            rejectReason: that.rejectReason
          }
        }).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            that.$message({
              type:'success',
              message:'操作成功'
            })
          }
        })
        that.rejectGoodHide()
        that.$router.push({'name':'s_set_brand'})
      },
      rejectGoodHide () {
        var that = this
        that.rejectReason='',
        that.rejectGood = false
        that.noDoubleClickD = false
      }
    },
    mounted () {
      let that = this
      that.getBrandInfo()
    }
  }
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
  .goodInfo{}
  .goodInfo p,.goodInfo div{margin-left:160px;margin-top:20px;line-height:36px;color:#333;font-size:14px;}
  .goodInfo button{margin-left:160px;margin-top:20px;}
  .goodInfo button.ml20{margin-left:20px;}
  .goodInfo div img{width:100px;height:100px; display:inline-block;}
  .goodInfo .goodInfop
  {
    width:400px;
    word-break:break-all;
  }
  .goodInfo p span,.goodInfo div span{
    margin-left: -160px; display:inline-block;width:160px;padding-right:20px;text-align: right;
  }
  .goodInfo div span.upload{display: block;margin-left:0px;color:#999;}
  .goodInfo p div,.goodInfo div div{margin-left:0;}
</style>
