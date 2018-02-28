<template>
  <div class="list clear">
    <div class="message">
      <div class="mess">
        <el-row :gutter="20">
          <el-col :span="24">
            <h4>基本信息</h4>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if='hideStaffStatus' >
          <el-col :span="3" class="alginRight">状态：</el-col>
          <el-col :span="9"  class="tinyGrey">  
              <span  v-if='salemanInfo.sellerCondition===2'>已离职 <i >(在职时间从{{salemanInfo.createdDate|date_format('yyyy-MM-dd')}}至 {{salemanInfo.sellerDimissionTime|date_format('yyyy-MM-dd')}})</i></span> 
               <!-- <span  v-if='salemanInfo.sellerCondition===2'>已离职 <i >(在职时间从 {{salemanInfo.createdDate}}至 {{salemanInfo.sellerDimissionTime}})</i></span>  -->
              <span v-if='salemanInfo.sellerCondition===1'> 在职中<i >(在职时间从 {{salemanInfo.createdDate|date_format('yyyy-MM-dd') }}至今)</i></span> 
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class='red'>*</i> 姓名：</el-col>
          <el-col :span="9">
            <el-input :maxlength="20" placeholder="1-20字符" v-model="salemanInfo.sellerName" @blur="checkUserName(salemanInfo.sellerName)"></el-input>
            <i class="redTip red" v-if="userNameCheck">请输入1-20字符</i>
          </el-col>
          <el-col :span="3" class="alginRight"><i class='red'>*</i> 手机号：</el-col>
          <el-col :span="9">
            <el-input :maxlength="11" placeholder="11位数" v-model="salemanInfo.sellerPhone" @change="checkMobile"  @blur="checkTel(salemanInfo.sellerPhone)"></el-input><i class="redTip red" v-if="telCheck">请填写正确的手机号</i>
          </el-col>
        </el-row>
          <el-row :gutter="20">
            <el-col :span="3" class="alginRight"><i class='red'>*</i> 性别：</el-col>
            <el-col :span="9" class='gender' >
              <el-radio-group  v-model="salemanInfo.sellerSex">
                <el-radio :label="1"   style="margin-top:18px">男</el-radio>
                <el-radio :label="2"  style="border:0px  #F4F5FA" >女</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="3" class="alginRight">编号：</el-col>
              <el-col :span="9">
              <el-input :maxlength="20" placeholder="请填写" v-model="salemanInfo.sellerNo" @blur="checkSellNo(salemanInfo.sellerNo)"></el-input>
                <i class="redTip red" v-if="checkNo">请输入数字、或字母+数字组合</i>
            </el-col>
          </el-row>
        <el-row :gutter="20"  >
          <el-col :span="3" class="alginRight"><i v-show='hidePassINP'   class='red'>*</i> 登录密码：</el-col>
          <el-col :span="9"  >
            <el-input  type="password"  :maxlength="16" :minlength="6"  placeholder="6-16位密码" v-model="salemanInfo.sellerPass" @blur="checkPass(salemanInfo.sellerPass)"></el-input><i class="redTip red" v-if="passCheck">请输入6-16位密码</i>
          </el-col>
          <el-col :span="3" class="alginRight"><i   v-show='hidePassINP'  class='red'>*</i> 重复密码：</el-col>
          <el-col :span="9"  >
            <el-input  type="password"  :maxlength="16" :minlength="6"  placeholder="6-16位密码" v-model="salemanInfo.sellerConfirmPass" @blur="checkPass2(salemanInfo.sellerConfirmPass)"></el-input><i class="redTip red" v-if="passCheck2">重复密码与密码不一致</i>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class='red'>*</i> 所属区域：</el-col>
            <el-col :span="3"  >
              <select v-model="salemanInfo.sellerPcode" class="formControlor" id="search_params_province_select" style="margin-bottom:5px;">
                <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
                  {{cell.name}}
                </option>
              </select>
            </el-col>
          <el-col :span="3">
            <select v-model="salemanInfo.sellerCcode" class="formControlor" id="search_params_city_select" style="margin-bottom:5px;">
              <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
                {{cell.name}}
              </option>
            </select>
          </el-col>
          <el-col :span="3">
            <select v-model="salemanInfo.sellerAcode" class="formControlor" value="salemanInfo.sellerArea" id="search_params_regionCode_select" @blur="checkEmpty(salemanInfo.sellerPcode,salemanInfo.sellerCcode,salemanInfo.sellerAcode)"  style="margin-bottom:5px;">
              <option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
                {{cell.name}}
              </option>
            </select>
            <i class="redTip red istyle" v-if="cityCheck" >请选择省市区</i>
          </el-col>
            <el-col :span="3" class="alginRight">QQ：</el-col>
            <el-col :span="9"  >
              <el-input   :maxlength="20"   placeholder="请填写" v-model="salemanInfo.sellerqq" @blur="checkQQNo(salemanInfo.sellerqq)"
              ></el-input> <i class="redTip red" v-if="checkQQ">请输入正确的QQ号码</i>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">备注：</el-col>
          <el-col :span="9"  style='margin-top:10px' >
            <el-input
              type="textarea"
              :rows="5"
              :maxlength="100"
              placeholder="请填写"
              v-model="salemanInfo.sellerRemark">
            </el-input>
          </el-col>
          <el-col :span="3" class="alginRight">微信：</el-col>
          <el-col :span="9"  >
            <el-input   :maxlength="20"  @blur="checkWeChatNo(salemanInfo.sellerWechat)"  placeholder="请填写" v-model="salemanInfo.sellerWechat" ></el-input>
            <i class="redTip red" v-if="checkWeChat">请输入正确的微信号码</i>
          </el-col>
        </el-row>
           <!--保存取消-->
       <el-row :gutter="20">
          <el-col :span="3" class="alginRight"></el-col>
          <el-col :span="9" :offset="3">
            <el-button type="primary " size="medium"  @click="submitModify()">保存</el-button>
                <el-button  size="medium"  @click="goBack()">取消</el-button>
          </el-col>
        <el-col :span="12"></el-col>
      </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
import md5 from "md5"
  export default {
    data () {
      return {
        passwordtmp:'',
        passwordComfirmtmp:'',
        isRunning:false,
        hideStaffStatus:false,//显示 状态行
        hidePassINP:false,
        salesmanData:[],
        salemanInfo: [],
        isAdd:'',   // 新增标识
        addSellerId:'', // 新增id
        sellerId: '', // 详情id
        // 所有的省份(供搜索使用)
        province_all_search: [],
        // 可选的城市(供搜索使用)
        city_all_search: [],
        // 所有的区(供搜索使用)
        area_all_search: [],
        userNameCheck: false, // 验证用户名长度
        passCheck: false, // 验证密码长度
        passCheck2: false, // 验证密码是否一致
        cityCheck: false,
        telCheck: false,
        checkNo: false,  // 校验编码
        checkQQ: false,
        checkWeChat:false,
      }
    },
    watch: {
      // 查询时监控省份
      'salemanInfo.sellerPcode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.salemanInfo.sellerCity = ''
            return
          }
          if (code !== oldCode) {
            that.area_all_search = []
          fetch(that.BASE_URL + 'm2c.support/regn/cits?province='+code+'&token='+tool.cookie.getCookie('access_token')).then(function(response) {
            return response.json()
            }).then(function(result) {
            that.city_all_search = result.content
            }).catch(function(e) {
            console.log("Oops, error");
            });
          }
        },
        deep: true
      },
      // 查询时监控城市
      'salemanInfo.sellerCcode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.salemanInfo.sellerArea = ''
            return
          }
          if (code !== oldCode) {
            //console.log('(查询)城市选择变化,新的城市code:' + code + ',旧的城市code:' + oldCode)
            fetch(that.BASE_URL + 'm2c.support/regn/areas?city='+code+'&token='+tool.cookie.getCookie('access_token')).then(function(response) {
            return response.json()
            }).then(function(result) {
            that.area_all_search=result.content
            }).catch(function(e) {
            console.log("Oops, error");
            });
          }
        },
        deep: true
      },
      // 新增修改删除时监控用户省份   ?? 页面上没有使用到
      'add_modify_params_user.provinceCode': {
        handler (code, oldCode) {
          if (code === '' || code === undefined) return
          let that = this
          if (code !== oldCode) {
            console.log('(增删改:用户)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
            that.$.ajax({
              url: that.base + 'm2c.support/regn/cits',
              data: {
                token: sessionStorage.getItem('mToken'),
                province: code
              },
              success: function (result) {
                // // console.log('(用户)获得的市信息列表: ', result)
                that.city_all_add_modify_1 = result.content
                that.add_modify_params_user.districtCode = that.city_all_add_modify_1[0].code
              }
            })
          }
        },
        deep: true
      }
    },
    methods: {
      getCityName (code) {
        let that = this
          let parameter ={
          token:tool.cookie.getCookie('access_token'),
          province: code
            }
          that.api_sellerManagePlatform_getCitys({data:parameter}).then(res=>{
          if(res==undefined){ return false
          }else if(res.status == '200'){
            // console.log('(查询)获得的市信息列表: ', result)
          that.city_all_search = res.content
            }
        })

      },
        //时间赋值
      checkMobile(){
        let that = this
        let reg = /^[1-9]\d*$/;
        if(!reg.test(that.salemanInfo.sellerPhone)){
          that.salemanInfo.sellerPhone = ''
        }
      },
      checkTel(val){
        var re = /^(13|14|15|17|18)[0-9]{9}$/
        if (!re.test(val)) {
          this.telCheck = true
        } else {
          this.telCheck = false
        }
      },
      // 校验空
      checkEmpty(val,val2,val3){
        if (val && val2 && val3) {
          this.cityCheck = false
        } else {
          this.cityCheck = true
        }
      },
      checkUserName (val) {
        if (val && val.length < 21 && val.length > 0) {
          this.userNameCheck = false
        } else {
          this.userNameCheck = true
        }
      },
      checkSellNo(val){
        var re=/^[A-Za-z0-9]+$/
        if(!re.test(val)){
          this.checkNo = true
        }else {
          this.checkNo = false
        }
      },
      checkQQNo(val){
        var re = RegExp(/^[1-9][0-9]{4,9}$/).test(val)
          if(re){
               this.checkQQ = false
          }else{
              this.checkQQ = true
          }
      },
      checkWeChatNo(val){
        var re = RegExp(/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/).test(val)
          if(re){
               this.checkWeChat = false
          }else{
              this.checkWeChat = true
          }
      },
      checkPass (val) {
        if (val && val.length < 17 && val.length > 5) {
          this.passCheck = false
        } else {
          this.passCheck = true
        }
      },
      checkPass2 (val) {
        if(val!=this.salemanInfo.sellerPass){
          this.passCheck2 = true
        } else {
          this.passCheck2 = false
        }
      },
      goBack () {
        let that = this
        if(that.$route.query.from == 'dealer'){
          that.$router.push({name:'s_dealer_addModify',query:{addModify:true,dealerId:that.$route.query.fromDealerId,handleToggle:that.$route.query.handleToggle}})
        }else{
          that.$router.push({name:'s_salesman_list'})
        }
      },
      // 提交保存
      submitModify () {
        let that = this
        var methodStr = "post";
        if (that.salemanInfo.sellerName=='' || that.salemanInfo.sellerName==undefined) {
            that.$message('请输入姓名')
          return
        }
         if (that.salemanInfo.sellerPhone == '' || that.salemanInfo.sellerPhone == undefined){
           that.$message( '请输入11位数手机号')
          return
        }
        if (!((/^(13|14|15|17|18)[0-9]{9}$/).test(that.salemanInfo.sellerPhone))) {
           that.$message('请输入正确的手机号码')
          return
        }
        if (that.salemanInfo.sellerSex==undefined) {
            that.$message('请选择性别')
          return
        }

        if(that.isAdd === true){
        if (that.salemanInfo.sellerPass=='' || that.salemanInfo.sellerPass==undefined) {
            that.$message('请设置登录密码')
          return
        }
        }
        if (that.salemanInfo.sellerAcode == '' || that.salemanInfo.sellerAcode == undefined){
          that.$message('请选择区域')
          return
        }
       
        /* if (that.salemanInfo.sellerNo == '' || that.salemanInfo.sellerNo == undefined){
           that.show_tip('业务员编号不能为空  ')
           return
         }*/
       if(that.isAdd){
        if (that.salemanInfo.sellerConfirmPass == '' || that.salemanInfo.sellerConfirmPass == undefined){
            that.$message('请输入重复密码')
          return
        }
        if(that.salemanInfo.sellerPass.length < 6 || that.salemanInfo.sellerPass.length >16 ){
          that.$message('请输入6-16位密码')
          return
        }
        {
          that.passwordtmp =  md5(that.salemanInfo.sellerPass).toLowerCase()
          that.passwordComfirmtmp =  md5(that.salemanInfo.sellerConfirmPass).toLowerCase()
        }
        if(that.salemanInfo.sellerPass!=that.salemanInfo.sellerConfirmPass){
          that.$message( '两次密码不一致')
          return
        }
       }
      
        if (typeof (that.sellerId) != 'undefined' && that.sellerId != '') {
          //如果是修改功能，则对用户密码做如下校验
          methodStr = "put";
          if (methodStr=='post'){
            //如果是新增功能就对用户密码做校验
            if(that.salemanInfo.sellerPass.length < 6 ){
              that.$message('请输入6-16位密码')
              return
            }
            //密码加密
            // {
              that.passwordtmp =  md5(that.salemanInfo.sellerPass).toLowerCase()
              that.passwordComfirmtmp =  md5(that.salemanInfo.sellerConfirmPass).toLowerCase()
            // }
          }

          if (that.salemanInfo.sellerPass!='' && that.salemanInfo.sellerPass!=undefined) {
            if (that.salemanInfo.sellerPass != that.salemanInfo.sellerConfirmPass){
              that.$message({
              type: 'info',
              message: '业务员密码输入不一致'
              })
              return
            }
            if(that.salemanInfo.sellerPass.length < 6 ){
              that.$message({
              type: 'info',
              message: '请输入6-16位密码'
              })
              return
            }
            //密码加密
            {
              that.passwordtmp =  md5(that.salemanInfo.sellerPass).toLowerCase()
              that.passwordComfirmtmp =  md5(that.salemanInfo.sellerConfirmPass).toLowerCase()
            }
          }
        }
        // 根据省份的code获取省份名字
        {
          let select = document.querySelector('#search_params_province_select')
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.salemanInfo.sellerProvince = ''
          } else {
            // console.log('所选省份名称: ', options[index].text)
            that.salemanInfo.sellerProvince = options[index].text
          }
        }
        // 根据城市code获取城市名字
        {
          let select = document.querySelector('#search_params_city_select')
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.salemanInfo.sellerCity = ''
          } else {
            // console.log('所选城市名称: ', options[index].text)
            that.salemanInfo.sellerCity = options[index].text
          }
        }
        // 根据区域code获取区域名字
        {
          let select = document.querySelector('#search_params_regionCode_select')
          let options = select.options
          let index = select.selectedIndex
          if (index === -1) {
            that.salemanInfo.sellerArea = ''
          } else {
            // console.log('所选区域名称: ', options[index].text)
            that.salemanInfo.sellerArea = options[index].text
          }
        }
        // console.log('that.isAdd----',that.isAdd)
        // console.log('加密后',md5(that.salemanInfo.sellerPass===undefined?'':that.salemanInfo.sellerPass).toLowerCase())
        // console.log('加密后临时',this.passwordtmp)
        // console.log('加密后临时',this.passwordComfirmtmp)
       // 保存业务员信息 
        let parameters = Object.assign({
            token:tool.cookie.getCookie('access_token'),
            sellerId: (that.isAdd ? that.addSellerId : that.sellerId),
            sellerPass: md5(that.salemanInfo.sellerPass===undefined?'':that.salemanInfo.sellerPass).toLowerCase(),
            sellerConfirmPass : md5(that.salemanInfo.sellerConfirmPass===undefined?'':that.salemanInfo.sellerConfirmPass).toLowerCase(),
          }, that.salemanInfo)
          parameters.sellerPass=this.passwordtmp
          parameters.sellerConfirmPass=this.passwordComfirmtmp
        that.api_sellerManagePlatform_saveSalesmanInfo({type:methodStr,data:parameters}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
                // 如果由商家列表跳转 保存后回商家列表页面 
                if(that.$route.query.from == 'dealer'){
                  that.$router.push({name:'s_dealer_addModify',query:{addModify:true,dealerId:that.$route.query.fromDealerId,handleToggle:that.$route.query.handleToggle}})
                }else{
                  // 返回业务员列表
                  that.hidePassINP =false;
                  that.$router.push({name:'s_salesman_list'})
                }
                that.isAdd = ''
            }else{
              console.log('res.errorMessage',res.errorMessage)
              that.$message({
              type: 'info',
              message: res.errorMessage
              })
              }
        })
      }
    },
    mounted () {
      let that = this
      // 获取省市区列表(供搜索使用)
      that.api_sellerManagePlatform_getProvs({data:{
        token:tool.cookie.getCookie('access_token')
      }}).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
        that.province_all_search = res.content
          }
      })
      // 新增（商品列表+业务员列表）入口 
    if(that.$route.query.isAdd === true ) {
        // 生成业务员id
      that.hidePassINP = true
      that.api_sellerManagePlatform_getSalesmanId({
        data: {token:tool.cookie.getCookie('access_token')}
      }).then(res=>{
        if(res==undefined){ return false
        }else if(res.status == '200'){
          that.addSellerId = res.content
          console.log('addSellerId---------------',that.sellerId)
          }
      })
      that.isAdd = true
      console.log('that.addSellerId---',that.addSellerId)
    }
      // 业务员详情（编辑）入口    拿到id 获取数据
      if(that.$route.query.isAdd === false ){
        that.hideStaffStatus= true
        that.sellerId = that.$route.query.fromSellerId
        that.isAdd = false
        that.api_sellerManagePlatform_getSalesmanList({
          data: {token:tool.cookie.getCookie('access_token')},
          pathParams: '/'+that.sellerId 
        }).then(res=>{
          if(res==undefined){ return false
          }else if(res.status == '200'){
              that.$nextTick(()=>{
                that.salemanInfo = res.content
                console.log('that.salemanInfo',that.salemanInfo)
              })
            }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../../../static/css/main.sellerManage.css";
.tinyGrey i{
   color:rbg(204, 204, 204);
   font-size: 12px;
   font-style:normal;
   line-height: 50px;
}
.istyle{position:absolute; left:210px;  top:32px }
    .message{
      position: absolute;
      width: 100%;
      height:880px;
      background-color:#fff;
      z-index:99;
      top: 0;
      left: 0;
      padding: 20px;
      .mess{
        margin-top: 30px;
        .alginRight{text-align: right; line-height:50px;color:#666;}
        .formControlor{ margin-top:10px;}
        .left{
          display: inline-block;
          button{
            width: 136px;
            height: 41px;
            margin-top: 80px;
            margin-left: 60px;
          }
          button,.save{
            margin-right: 60px;
          }
        }
        .right{
          display: inline-block;
          .img_up{
            width: 100px;
            height: 100px;
            background-size: 100px 100px;
          }
          .form-group{
            height: 40px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .search{
      display: inline-block;
      position: relative;
      .inp{
        width: 200px;
        height: 36px;
        color:black;
        border:1px solid   rgb(216, 220, 228) ;
        border-radius:5px;
        text-indent:1em;
      }
      input::-webkit-input-placeholder{
        color:rgb(205, 200, 213);
      }
      input:-moz-placeholder{
        color:rgb(205, 200, 213);
      }
      input::-ms-input-placeholder{
        color:rgb(205, 200, 213);
      }
      i{
        width: 50px;
        height: 39px;
        line-height: 39px;
        text-align: center;
        border: 1px solid #ccc;
        background-color: rgba(242, 242, 242, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    span{
      cursor: pointer;
    }
    .good_info {
      background: #fff;
      margin-top: 10px;
      position: relative;
    }

</style>