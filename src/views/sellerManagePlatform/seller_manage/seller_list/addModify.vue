<template>
  <div class="list">
    <div class="message">
      <div class="mess">
        <el-row :gutter="20">
          <el-col :span="24">
            <h4>账号信息</h4>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>绑定管理员：</el-col>
          <el-col :span="9">
            <div v-if="Info.userId">
              <div class="inline">
                {{Info.userName == null?'':Info.userName}} {{Info.userPhone == null ?'':Info.userPhone}}
              </div>
              <input type="hidden" v-model="Info.userId" />
              <i class="inline modify bg-ico_compile" @click="userInfoShow()"></i>
            </div>
            <el-button type="primary" size="medium" v-if="!Info.userId" @click="userInfoShow()">绑定</el-button>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <h4>公司信息</h4>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>商家名称：</el-col>
          <el-col :span="9">
            <el-input :maxlength="15" placeholder="1-15字符" v-model="Info.dealerName"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight"><i class="red">*</i>商家类型：</el-col>
          <el-col :span="9">
            <el-cascader
              :options="dealerclassifySelect"
              :props="dealerclassifyprops" expand-trigger="hover"
              v-model="Info.dealerClassifyIds"
            ></el-cascader>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>合作方式：</el-col>
          <el-col :span="9">
            <select v-model="Info.cooperationMode">
              <option v-for="(cell,index) in cooperationModes" :key="index" :value="cell.cooperationMode">
                {{cell.cooperationMode==1?"包销":cell.cooperationMode==2?"代销":cell.cooperationMode==3?"经销":"入驻"}}
              </option>
            </select>
          </el-col>
          <el-col :span="3" class="alginRight"><i class="red">*</i>签约时间：</el-col>
          <el-col :span="9">
            <el-date-picker style="padding-bottom:1px;"
              v-model="time"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="yyyy-MM-dd"
              @change="timeCheck">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>所属区域：</el-col>
          <el-col :span="3">
            <select v-model="Info.dealerPcode" id="search_params_province_select" style="margin-bottom:5px;">
              <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
                {{cell.name}}
              </option>
            </select>
          </el-col>
          <el-col :span="3">
            <select v-model="Info.dealerCcode" id="search_params_city_select" style="margin-bottom:5px;">
              <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
                {{cell.name}}
              </option>
            </select>
          </el-col>
          <el-col :span="3">
            <select v-model="Info.dealerAcode" id="search_params_regionCode_select" style="margin-bottom:5px;">
              <option v-for="(cell,index) in area_all_search" :key="index" :value="cell.code">
                {{cell.name}}
              </option>
            </select>
          </el-col>
          <el-col :span="3" class="alginRight">详细地址：</el-col>
          <el-col :span="9">
            <el-input :maxlength="20" placeholder="1-20字符" v-model="Info.dealerDetailAddress"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>结算方式：</el-col>
          <el-col :span="9">
            <select v-model="Info.countMode" style="margin-bottom:5px;" :disabled="handle_toggle=='modify'">
              <option v-for="(cell,index) in countModesList" :key="index" :value="cell.countMode">
                {{cell.countMode==1?"按供货价":"按服务费率"}}
              </option>
            </select>
            <i class="red redTip">请按照合同的签约情况填写，一旦确认，不可修改</i>
          </el-col>
          <el-col :span="3" class="alginRight"><i class="red">*</i>平台押金：</el-col>
          <el-col :span="2" style="line-height:50px;">
            <el-radio v-model="Info.isPayDeposit" label="0" value=0 @change="depositHide()" >未缴纳</el-radio>
          </el-col>
          <el-col :span="2" style="line-height:50px;">
            <el-radio v-model="Info.isPayDeposit" label="1" value=1 @change="depositShow()">已缴纳</el-radio>
          </el-col>
          <el-col :span="5">
            <template v-if="isPay">
              <el-input type="number" placeholder="请填写" v-model="Info.deposit"><i slot="suffix" class="fr" style="font-style:normal;margin-right:10px;line-height:36px;">元</i></el-input>
            </template>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <h4>商家负责人信息</h4>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">姓名：</el-col>
          <el-col :span="9">
            <el-input type="text" placeholder="请填写" v-model="Info.managerName"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">手机：</el-col>
          <el-col :span="9">
            <el-input type="tel" :maxlength="11"  placeholder="请填写" v-model="Info.managerPhone"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">QQ：</el-col>
          <el-col :span="9">
            <el-input type="text" placeholder="请填写" v-model="Info.managerqq"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">微信：</el-col>
          <el-col :span="9">
            <el-input type="text" style="ime-mode:disabled;" :maxlength="20" placeholder="请填写" v-model="Info.managerWechat"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight">邮箱：</el-col>
          <el-col :span="9">
            <el-input type="email" placeholder="请填写" v-model="Info.managerEmail"></el-input>
          </el-col>
          <el-col :span="3" class="alginRight">所在部门：</el-col>
          <el-col :span="9">
            <el-input type="text" placeholder="请填写" v-model="Info.managerDepartment"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <h4>业务员信息</h4>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"><i class="red">*</i>招商业务员：</el-col>
          <el-col :span="9">
            <div class="select_box" @click="optionShow4">
              <span class="select_txt">
                {{Info.sellerName==''?"请选择" :Info.sellerName}}</span><a class="selet_open"><b></b></a>
              <div class="option" style="height:150px" v-if="sellerManShow">
                <a class="ellipsis" @click="goSalesmanList">新增业务员</a>
                <a class="ellipsis" v-for="(cell,index) in sellerIds" @click="changeSeller(cell)">
                  {{cell.sellerName}}
                </a>
              </div>
            </div>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3" class="alginRight"></el-col>
          <el-col :span="9" :offset="3">
            <el-button type="primary" size="medium" @click="submitModify()">保存</el-button>
            <router-link :to="{name:'s_dealer_list'}"><el-button size="medium">取消</el-button></router-link>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </div>

    </div>
    <div class="hptczp" v-if="userInfoBoxShow"></div>
    <div class="userInfoBox" id="userInfoBox" v-if="userInfoBoxShow">
      <h4>绑定管理员<a class="close bg-ico_close02" @click="closeuserInfoBoxShow()"></a></h4>
      <div class="search">
        <el-input type="text" class="inp" placeholder="输入姓名 / 手机号" v-model="userfilter">
        <el-button slot="append" icon="el-icon-search" @click="userInfoShow()"></el-button>
        </el-input>
        <a class="fr a" @click="newManager=!newManager" style="line-height:50px;font-size:14px;">新增并绑定</a>
      </div><br/>
      <span v-if="goodsCommentTotalCount == 0" style="margin:15px 0 0 40%;display: block">暂无数据</span>
      <ul id="userInfoList" v-if="ulIndex">
        <li v-for="(item,index) in userInfos" @click="checkUser(item,index)" :class="{'active':isactive==index}" >
          <p>{{item.username}}</p>
          <p><span>{{item.mobile}}</span></p>
        </li>
      </ul>
      <div class="block fl" style="margin-top:20px;margin-left:20px;">
        <el-pagination
          @current-change="goodsCommentHandleCurrentChange"
          :current-page="goodsCommentCurrentPage"
          :page-size="goodsCommentPageRows"
          layout="total, prev, pager, next, jumper"
          :total="goodsCommentTotalCount">
        </el-pagination>
      </div>
      <h6>只可选择一个管理员<el-button size="medium" class="button" @click="checked()">确定</el-button></h6>
    </div>
    <div class="userInfoBox newManager" v-if="newManager">
      <h4>新增并绑定管理员<a class="close bg-ico_close02" @click="closeNewManager()"></a></h4>
      <el-form :model="manager" :rules="rules" ref="manager" label-width="250px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="username">
          <el-input :maxlength="20" placeholder="1-20字符" v-model="manager.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="manager.mobile" @change="checkMobile" placeholder="11位数" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" style="margin-bottom:7px;">
          <el-radio-group v-model="manager.sex">
            <el-radio label="男" value="1"></el-radio>
            <el-radio label="女" value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属区域" class="lineHeight">
          <div class="width50">
            <el-form-item prop="provinceCode">
              <el-select v-model="manager.provinceCode" placeholder="请选择省" @change="province">
                <el-option v-for="(cell,index) in province_all" :label="cell.name" :value="cell.code" :key="cell.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="width50">
            <el-form-item prop="districtCode">
              <el-select v-model="manager.districtCode" placeholder="请选择市" @change="cityChange">
                <el-option v-for="(cell,index) in city_all" :label="cell.name" :value="cell.code" :key="cell.code"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="manager.password" :maxlength="16" :minlength="6" placeholder="6-16位密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordR">
          <el-input type="password" v-model="manager.passwordR" :maxlength="16" placeholder="6-16位密码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('manager')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {tool} from '../../../../utils/'
import md5 from 'md5'
import validate from '../../../../utils/tool/validate';
export default {
  data () {
    let validateMobile = (rule, value, callback) => {
      let reg=/^(13|14|15|17|18)[0-9]{9}$/
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        }
        callback();
      }
    };
    let validateSex = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择性别！'));
      }
      callback();
    };
    var validatePro = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback();
      }else{
        this.$refs.manager.validateField('districtCode');
        callback();
      }
    };
    var validateCity = (rule, value, callback) => {
      if(this.manager.provinceCode!==''){
        if (value === '' || value === undefined) {
          callback(new Error('请选择区域！'));
        }
         callback();
      }else{
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }else if(value.length < 6 || value.length > 16){
        callback(new Error('请输入6-16位密码'));
      } else {
        if (this.manager.passwordR !== '') {
          this.$refs.manager.validateField('passwordR');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.manager.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      addSellerId: '',
      isRunning:false,
      adddealerId:'',
      // 新增绑定管理员
      manager: {
        username: '',
        mobile: '',
        sex: '',
        provinceCode: '',
        districtCode: '',
        password: '',
        passwordR: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        sex: [
        //  { validator: validateSex, trigger: 'blur' }
          { message: '请选择性别', trigger: 'change' }
        ],
        provinceCode: [
          { message: '请选择省份',validator: validatePro, trigger: 'change' }
        ],
        districtCode: [
          // {  trigger: 'blur' }
          { validator: validateCity, trigger: 'change' }
        ],
        password: [
          { required: true,validator: validatePass, trigger: 'blur' }
        ],
        passwordR: [
          { required: true,validator: validatePass2, trigger: 'blur' }
        ]
      },
      newManager:false, // 新增管理员
      selectedOptions:[''],
      dealerclassifySelect: [], // 商家类别一级
      dealerclassifyprops: {
        value: 'dealerClassifyId',
        children: 'child',
        label:'dealerClassifyName',
      }, // element 级联选择器
      Info: {'startSignDate':'','endSignDate':''},
      cooperationModes:[{'cooperationMode':'1'},{'cooperationMode':'2'},{'cooperationMode':'3'},{'cooperationMode':'4'}],// 合作模式
      countModesList: [{countMode: 1}, {countMode: 2}], // 结算模式
      isPayDeposits:[{value:'',label:'押金缴纳'},{value:'0',label:'已缴纳'},{value:'1',label:'未缴纳'}],// 是否缴纳
      time:[],
      // startTime: '',
      // endTime: '',
      province_all_search: [], // 省份
      city_all_search: [], // 市
      area_all_search: [], // 区
      isPay: false, // 缴纳押金
      handle_toggle: this.$route.query.handle_toggle, // 区别新增还是修改
      sellerName:'', // 业务员名字
      userInfo: [], // 选择未确定 暂存管理员信息
      userInfoBoxShow:false, // 管理员弹层
      sellerIds:[], // 业务员列表
      newManager:false, // 新增并绑定管理员弹层
      userfilter:'', // 管理员搜索关键字
      isactive:null, //首次进入选中状态
      ulIndex:false, // 管理员ul
      indexLi:0, // 选择未确定 暂存当前index
      indexPage:0, // 选择未确定 暂存当前页码
      goodsCommentTotalCount:0,
      goodsCommentCurrentPage:1,// 默认首页
      goodsCommentPageRows:12, // 一页显示条数
      sellerManShow:false, // 业务员select
      // 所有的省份-新增管理员
      province_all: [],
      // 可选的城市-新增管理员
      city_all: [],
      dealerId: this.$route.query.dealerId == undefined ? '' : this.$route.query.dealerId, //修改进入时的dealerId
      userInfos: [],//管理员列表
    }
  },
  methods: {
    checkMobile(){
      let that = this
      let reg = /^[1-9]\d*$/;
      if(!reg.test(that.manager.mobile)){
        that.manager.mobile = ''
      }
    },
    province(){
      let that = this
      console.log(that.manager.provinceCode)
      for(var i=0;i<that.province_all.length;i++){
        if(that.province_all[i].code == that.manager.provinceCode){
          that.manager.areaProvince = that.province_all[i].name
          console.log(that.manager.areaProvince)
        }
      }
    },
    cityChange(){
      let that = this
      for(var j=0;j<that.city_all.length;j++){
        if(that.city_all[j].code == that.manager.districtCode){
          that.manager.areaDistrict = that.city_all[j].name
          console.log(that.manager.areaDistrict)
        }
      }
      console.log(that.manager.districtCode)
    },
    // 关闭新增绑定管理员界面
    closeNewManager(){
      let that = this
      that.newManager = false,
      that.manager = {provinceCode:'',districtCode:''}
    },
    // 新增绑定管理员
    submitForm(formName) {
      let that = this
      that.isAddManager = true
      // console.log('that.$refs[formName].validate',that.$refs[formName].validate)
      that.$refs[formName].validate((valid) => {
        if (valid) {
          this.api_sellerManagePlatform_addManager({
            data: {
              token: sessionStorage.getItem('userInfo'),
              mobile: that.manager.mobile,
              username: that.manager.username,
              password: md5(that.manager.password),
              sex: that.manager.sex == '男' ? '1': that.manager.sex == '女' ? '0':'',
              provinceCode:that.manager.provinceCode,
              districtCode:that.manager.districtCode,
              areaProvince:that.manager.areaProvince,
              areaDistrict:that.manager.areaDistrict
            }
          }).then(res=>{
            if(res==undefined){
                return false
              }else if(res.status == '200'){
                that.Info.userName = that.manager.username
                that.Info.userPhone = that.manager.mobile
                that.newManager = false,
                that.manager = {provinceCode:'',districtCode:''}
                that.userInfoShow ()
              }
          })
        } else {
          // that.$message('您有未完善的信息');
          return false;
        }
      });
    },
    // 时间赋值
    timeCheck () {
      let that = this
      if (that.time != null) {
        that.Info.startSignDate = that.time[0]
        that.Info.endSignDate = that.time[1]
      } else {
        that.Info.startSignDate = ''
        that.Info.endSignDate = ''
      }
    },
    // 管理员选择显示
    userInfoShow () {
      let that = this
      that.userInfoBoxShow = true
      that.ulIndex=false
      that.api_sellerManagePlatform_userInfoShow({
        data: {
          token: '1111',
          groupType: '4',
          mobile: that.userfilter,
          rows: that.goodsCommentPageRows,                          // 每页多少条数据
          pageNum: that.goodsCommentCurrentPage     // 请求第几页
        }
      }).then(res=>{
        if(res==undefined){
            return false
          }else if(res.status == '200'){
            that.ulIndex=true
            that.userInfos = res.content
            if(that.userfilter!=''){
              that.isactive = null
            }
            if(that.isAddManager){
              that.userInfo.userId = that.userInfos[0].userId
              that.userInfo.userName = that.userInfos[0].username
              that.userInfo.userPhone = that.userInfos[0].mobile
              that.checked()
            }
            that.goodsCommentTotalCount = res.totalCount
            that.goodsCommentPageRows = res.rows
            that.$nextTick(()=>{
              if(that.Info.userId != ''){
                for(let i = 0; i<that.userInfos.length; i++){
                  if(that.Info.userId == that.userInfos[i].userId){
                    that.indexLi = that.isactive = i
                    that.userInfo.userName = that.userInfos[i].username
                    that.userInfo.userId = that.userInfos[i].userId
                    that.userInfo.userPhone = that.userInfos[i].mobile
                    console.log(that.userInfo)
                  }
                }
              }
            })
          }
      })
    },
    // 管理员
    checkUser (item, index) {
      let that = this
      that.userInfo.userName = item.username
      that.userInfo.userId = item.userId
      that.userInfo.userPhone = item.mobile
      that.indexLi = that.isactive = index
      that.indexPage = that.currentPage
    },
    // 选择管理员
    checked () {
      let that = this
      console.log(that.userInfo.username!=undefined)
      if(that.userInfo.userName!=undefined || that.isAddManager){
        that.Info.userName = that.userInfo.userName
        that.Info.userId = that.userInfo.userId
        that.Info.userPhone = that.userInfo.userPhone
        that.isAdd = false
        that.isAddManager = false
        that.userInfoBoxShow = false
      }else{
        this.$message({
          message: '您还没有选中任何管理员',
          type: 'warning'
        });
        that.userInfoBoxShow = true
      }
      //that.userInfoBoxShow = false
    },
    // 切换页码
    goodsCommentHandleCurrentChange (val) {
      let that = this
      that.goodsCommentCurrentPage = val
      that.isactive = null
      that.userInfoShow()
      if(that.goodsCommentCurrentPage === that.indexPage){
        that.isactive = that.indexLi
      }
    },
    // 关闭管理员弹层
    closeuserInfoBoxShow () {
      let that = this
      that.userInfoBoxShow = !that.userInfoBoxShow
      that.userfilter = ''
      that.goodsCommentCurrentPage=1//重置首页
      // that.goodsCommentPageRows=5//重置每页5条数据
      that.goodsCommentTotalCount=0//总数
      that.indexLi = that.isactive = null
    },
    // 缴纳金额input隐藏
    depositHide () {
      let that = this
      that.isPay = false
      that.Info.deposit = 0
    },
    // 缴纳金额input显示
    depositShow () {
      let that = this
      that.isPay = true
    },
    // 重置
    reset_add_modify_params () {
      this.Info = {}
    },
    // 获取商家分类
    getDealerclassify(){
      this.api_sellerManagePlatform_getDealerclassify({}).then(res=>{
        if(res==undefined){
            return false
          }else if(res.status == '200'){
            this.dealerclassifySelect = res.content
          }
      })
    },
    // 获取详细信息
    goto () {
      let that = this
      if(that.handle_toggle == 'modify'){
        // that.isChange = 1>0
        // if(that.$route.query.addModify)(
        //   that.isChange = false
        // )
        // if(that.$route.query.dealerId != ''){
        //   that.isChange = true
        // }
        that.isAdd = false
        //that.sellerName = row.sellerName
        this.api_sellerManagePlatform_getUserInfo({
            data: {
              token: sessionStorage.getItem('userInfo')
            },
            pathParams: '/'+that.dealerId
        }).then(res=>{
          if(res==undefined){
              return false
          }else if(res.status == '200'){
            console.log('详情结果', res.content)
            that.Info = res.content
            that.time.push(res.content.startSignDate,res.content.endSignDate)
            //that.dealerId = res.content.dealerId
            //that.Info.sellerName =  res.content.sellerName
            that.Info.isPayDeposit =  res.content.isPayDeposit.toString()
            //that.sellerName = res.content.sellerName
            that.userInfo.userId = res.content.userId
            that.userInfos.userName = res.content.userName
            that.userInfos.userPhone = res.content.userPhone
            that.addModify = true
            that.handle_toggle = 'modify'
            console.log(res.content.isPayDeposit == '1')
            if (res.content.isPayDeposit == '1') {
              that.isPay = true
            } else {
              return
            }
          }
        })
        // 获取省市区列表
        this.api_sellerManagePlatform_getProvs({
          data:{
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          }
        }).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            that.province_all = res.content
          }
        })
      }else{
        that.isAdd = true
        if ( that.isAdd) {
          that.sellerName = ''
        }
        that.addModify = true
        that.handle_toggle = 'add'
        that.reset_add_modify_params()
        // 生成id
        this.api_sellerManagePlatform_getDealerId({}).then(res=>{
          if(res==undefined){
            return false
          }else if(res.status == '200'){
            that.adddealerId = res.content
          }
        })
      }

      that.getDealerclassify ()
      // 获取省市区列表
      this.api_sellerManagePlatform_getProvs({
        data:{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token
        }
      }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.province_all_search = res.content
          that.province_all = res.content
        }
      })
      // 获取业务员列表
      this.api_sellerManagePlatform_getSeller({
          data:{
            rows: 500,    // 每页多少条数据
            pageNum: 1    // 请求第几页
          }
        }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.sellerIds = res.content
        }
      })

    },
    // 新增业务员 跳转
    goSalesmanList () {
        let that = this
          // 商家列表新增入口 add    商家列表详情入口 modify   
        // if(that.handle_toggle == 'add'){
          sessionStorage.setItem('Info', JSON.stringify(that.Info))
          console.log('新增业业务员',that.Info)
        // }
        let tempDealerId=(that.dealerId==''?that.adddealerId:that.dealerId)
        that.$router.push({name:'s_salesman_addModify', query: {isAdd:true,addModify: true,from:'dealer',fromDealerId:tempDealerId,handleToggle:that.handle_toggle}})
      },
    // 商家分类
    // handleItemChange(){
    //   this.search_params.dealerClassify=this.selectedOptions[this.selectedOptions.length-1]
    //   //console.log(this.search_params.dealerClassify)
    // },
    // 业务员
    optionShow4 () {
      let that = this
      console.log(that.sellerManShow)
      if(that.sellerManShow){
        that.sellerManShow = false
      }else{
        that.sellerManShow = true
      }
    },
    getStyle(ele) {
      var style = null
      if(window.getComputedStyle) {
          style = window.getComputedStyle(ele, null)
      }else{
          style = ele.currentStyle
      }
      return style
    },
    // 选中业务员
    changeSeller (cell) {
      let that = this
      that.Info.sellerId = cell.sellerId
      that.Info.sellerName = cell.sellerName

      that.Info.sellerPhone = cell.sellerPhone
      that.sellerName = cell.sellerName
      // console.log(that.sellerName)
      // console.log(that.Info.sellerName)
    },
    // 提交保存
    submitModify () {
      let that = this
      console.log(that.Info.startSignDate)
      if (that.Info.userId == null || that.Info.userId.trim()=="" || that.Info.userId==undefined) {
        that.$message("请选择用户");
        return;
      }
      if (that.Info.dealerName  == null || that.Info.dealerName.trim() =="" || that.Info.dealerName ==undefined) {
        that.$message("经销商名称不能为空");
        return;
      }
      if( that.Info.dealerClassifyIds!=null && that.Info.dealerClassifyIds!=undefined){
        that.Info.dealerClassify = that.Info.dealerClassifyIds[(that.Info.dealerClassifyIds.length)-1]
      }
      if (that.Info.dealerClassify == null || that.Info.dealerClassify == "" ||that.Info.dealerClassify==undefined) {
        that.$message("请选择商家类型");
        return;
      }
      if (that.Info.cooperationMode == null || that.Info.cooperationMode =="" || that.Info.cooperationMode==undefined) {
        that.$message("请选择合作模式");
        return;
      }
      if (that.Info.dealerAcode == null || that.Info.dealerAcode == "" ||that.Info.dealerAcode==undefined) {
        that.$message("请选择区信息");
        return;
      }
      if (that.Info.startSignDate== null || that.Info.startSignDate == "" ||that.Info.startSignDate==undefined) {
        that.$message("请选择签约开始时间");
        return;
      }
      if (that.Info.endSignDate== null || that.Info.endSignDate == "" ||that.Info.endSignDate==undefined) {
        that.$message("请选择签约结束时间");
        return;
      }
      if (that.Info.countMode== null || that.Info.countMode==undefined || that.Info.countMode == '全部' || that.Info.countMode=='') {
        that.$message("请选择结算方式");
        return;
      }
      if (that.Info.isPayDeposit== null || that.Info.isPayDeposit==undefined) {
        that.$message("请选择是否缴费");
        return;
      }
      if (that.Info.sellerId== null || that.Info.sellerId == "" ||that.Info.sellerId==undefined) {
        that.$message("请选择业务员");
        return;
      }
      if(that.Info.managerEmail != ''&& that.Info.managerEmail!=undefined){
        let reg=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
        if(!reg.test(that.Info.managerEmail))
        {
          that.$message("请输入正确的邮箱地址")
          return false;
        }
      }
      if (that.Info.managerPhone != '' && that.Info.managerPhone !=undefined) {
        let reg=/^(13|14|15|17|18)[0-9]{9}$/;
        if(!reg.test(that.Info.managerPhone))
        {
          that.$message("请输入正确的手机号码")
          return false;
        }
      }
      if (that.Info.managerqq != '' && that.Info.managerqq !=undefined) {
        let reg=/[1-9]{1}[0-9]{4,14}/;
        if(!reg.test(that.Info.managerqq))
        {
          that.$message("请输入正确的QQ号")
          return false;
        }
      }
      if (that.Info.managerWechat != '' && that.Info.managerWechat !=undefined) {
        let reg=/^[a-zA-Z\d_]{5,}$/;
        if(!reg.test(that.Info.managerWechat))
        {
          that.$message("请输入正确的微信号")
          return false;
        }
      }
      {
        let select = document.querySelector('#search_params_province_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.Info.dealerProvince = ''
        } else {
          // console.log('所选省份名称: ', options[index].text)
          that.Info.dealerProvince = options[index].text
        }
      }
      // 根据城市code获取城市名字
      {
        let select = document.querySelector('#search_params_city_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.Info.dealerCity = ''
        } else {
          // console.log('所选城市名称: ', options[index].text)
          that.Info.dealerCity = options[index].text
        }
      }
      // 根据区域code获取区域名字
      {
        let select = document.querySelector('#search_params_regionCode_select')
        let options = select.options
        let index = select.selectedIndex
        if (index === -1) {
          that.Info.dealerArea = ''
        } else {
          console.log('所选区域名称: ', options[index].text)
          that.Info.dealerArea = options[index].text
        }
      }
      if(that.isRunning){
        return
      }
      that.isRunning = true
      console.log(that.handle_toggle)
      let dealerId = that.handle_toggle == 'add' ? that.adddealerId : that.dealerId
      let type = that.handle_toggle == 'add' ? 'post' : 'put'
      console.log(dealerId)
      this.api_sellerManagePlatform_dealerModify({type:type,
          data: Object.assign({
            token: sessionStorage.getItem('userInfo'),
            dealerId: dealerId
          }, that.Info)
        }).then(res=>{
        if(res==undefined){
          return false
        }else if(res.status == '200'){
          that.$router.push({name:'s_dealer_list'})
        }
      })
      // that.$.ajax({
      //   type: that.handle_toggle == 'add' ? 'post' : 'put',
      //   url: that.localbase + 'm2c.scm/dealer/sys/mng',
      //   data: Object.assign({
      //     token: sessionStorage.getItem('mToken'),
      //     dealerId: that.handle_toggle == 'add' ? that.adddealerId : that.dealerId
      //   }, that.Info),
      //   success: function (res) {
      //     if(res.status === 200){
      //       that.isModify = false
      //       that.addModify = false
      //       that.get_good_info()
      //       console.log(res)
      //       that.dealerId = ''
      //       that.time2=[]
      //       that.isPay = false
      //     }else {
      //       that.$message(res.errorMessage);
      //     }
      //     that.isRunning = false
      //   }
      // })
    },
  },
  mounted () {
    this.getDealerclassify()
    this.goto()
    // 业务员新增修改  保存取消
    if (this.$route.query.addModify == true) {
      console.log('sessionStorage存储值不为商家的值',sessionStorage.getItem('Info'))
       this.Info=JSON.parse(sessionStorage.getItem( 'Info'))
       if(this.$route.query.handleToggle=='modify'){
          this.time.push(this.Info.startSignDate,this.Info.endSignDate)
          this.addModify = true
          this.handle_toggle='modify'
          if (this.Info.isPayDeposit == '1') {
            this.isPay = true
          } else {
            return
          }
       }
    }
  },
  watch: {
    // 监控省份变化 新增管理员
    'manager.provinceCode': {
      handler (code, oldCode) {
        let that = this
        if (code === '' || code === undefined) {
          that.manager.dealerCity = ''
          return
        }
        if (code !== oldCode) {
          that.city_all = []
          that.manager.districtCode = ''
          this.api_sellerManagePlatform_getCitys({
              data: {
                token: sessionStorage.getItem('userInfo'),
                province: code
              }
            }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.city_all = res.content
            }
          })
        }
      },
      deep: true
    },
    // 查询时监控省份
    'Info.dealerPcode': {
      handler (code, oldCode) {
        let that = this
        if (code === '' || code === undefined) {
          that.Info.dealerCity = ''
          return
        }
        if (code !== oldCode) {
          //console.log('(查询)省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
          that.area_all_search = []
          this.api_sellerManagePlatform_getCitys({
              data: {
                token: sessionStorage.getItem('userInfo'),
                province: code
              }
            }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.city_all_search = res.content
            }
          })
        }
      },
      deep: true
    },

    // 查询时监控城市
    'Info.dealerCcode': {
      handler (code, oldCode) {
        let that = this
        if (code === '' || code === undefined) {
          that.Info.dealerArea = ''
          return
        }
        if (code !== oldCode) {
          this.api_sellerManagePlatform_getAreas({
              data: {
                token: sessionStorage.getItem('userInfo'),
                city: code
              }
            }).then(res=>{
            if(res==undefined){
              return false
            }else if(res.status == '200'){
              that.area_all_search = res.content
            }
          })
        }
      },
      deep: true
    }
  },
}
</script>
<style lang="scss" scoped>
 @import "../../../../../static/css/main.sellerManage.css";
  //业务员
  .select_box{float:left;border:solid 1px #d8dce5;color:#333;position:relative;cursor:pointer;width:100%;font-size:14px;height:34px;line-height:34px;border-radius:3px;margin-top:7px;}
  .selet_open{display:inline-block;position:absolute;right:0;top:0;width:30px;height:34px;
  background: url('../../../../../static/images/sellerManage/ico_arrows.png') no-repeat scroll right center transparent;
  }
  .select_txt{display:inline-block;padding-left:10px;width:100%;line-height:34px;height:34px;cursor:text;overflow-x:hidden;color:#5a5e66;}
  .option{width:100%;background:#fff;border:solid 1px #d8dce5;position:absolute;top:33px;left:-1px;z-index:2;overflow-x:hidden;}
  .option a{display:block;height:24px;line-height:24px;text-align:left;padding:0 10px;width:100%;background:#fff;color:#333;}
  .option a:hover{background:#409eff; color:#fff;}
  .message{
    position: relative;
    width: 100%;
    min-height: 888px;
    background-color: #fff;
    z-index:3;
    top: 0;
    left: 0;
    .mess{
      margin-top:0px;padding:0px 40px;padding-bottom:50px;background:#fff;
      .el-input{width:100%;margin:10px 0;}
      h4{
        line-height:50px;
        margin-bottom:10px;
        font-size:16px;
        color:#333;
        font-weight: normal;
      }
      .inline{display:inline-block;line-height:50px;}
      .modify{
        margin-left:10px;line-height:50px;width:16px;height:16px;
        }
    }
  }
  .newManager .el-form-item__error {
    color: #fa5555;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute
    !important;
    top: 22%
    !important;
    left: 40%
    !important;
  }
  .lineHeight label{line-height:46px;}
  .demo-ruleForm{
    margin-top:30px;line-height: 40px;
    .width50{width:196px;height:48px;display: inline-block;margin-right:10px;margin-top:-10px;}
    .el-form-item{
      margin-bottom:16px;
      .el-form-item__label,.el-radio-group .el-radio{line-height:40px;}
      .el-radio-group .el-radio{line-height:40px;}
      .el-input{margin:0;}
    }
  }
  .el-date-editor .el-range-input{margin-top:-2px;}
  .alginRight{text-align: right; line-height:50px;color:#666;font-size:14px;}
  .hptczp{
      width: 100%;
      height: 100%;
      display: block;
      position: fixed;
      left: 0px;
      top: 0px;
      background: #000;
      z-index: 999;
      opacity: 0.5;
    }
    .userInfoBox{width:780px;height:510px;position:fixed;top:50%;left:50%;margin-top:-250px;margin-left:-390px;
      background:#fff;border-radius:5px;z-index: 999;
      h4{background:#DFE9F6;width:100%;height:50px;line-height: 50px;text-indent: 1.5em;color:#666;font-size:16px;}
      a.close{display:inline-block;width:50px; height:50px;position:absolute;top:0; right:0;opacity:1;}
      h6{background:#F5F5F5;width:100%;height:50px;line-height: 50px;text-indent:20px;color:#FD3242;font-size:12px;position:absolute;bottom:0px;}
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
        height:auto; list-style:none;
        li{
          float:left;width:160px;height:80px;border:1px solid #E5E5E5;margin:5px 10px;padding:10px;border-radius:3px; box-sizing:border-box;
          p{
            line-height:28px;width:128px;overflow: hidden;font-size:18px;
            text-overflow:ellipsis;
            white-space: nowrap;
            span{
              font-size:14px;
            }
          }
        }
        li.active{background:#409eff;color:#fff;}
        li.active p,li.active span{color:#fff;}
      }
      .button{position:absolute;right:20px;bottom:6px;}
    }
</style>

