<template>
  <div class="edit-form">
    <el-dialog
      :title="addModifyToggle==='add'?'新增用户':'修改用户'"
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form" :rules="formRules"  label-width="100px">
            <el-form-item label="用户组" prop="groupType">
              <el-select v-model="form.groupType" placeholder="请选择">
                <el-option label="普通用户" :value="1" v-show="Number(form.groupType)===1"></el-option>
                <el-option label="促销员" :value="2" v-show="Number(form.groupType)===2"></el-option>
                <el-option label="媒体" :value="3" v-show="Number(form.groupType)===3"></el-option>
                <el-option label="经销商" :value="4" v-show="Number(form.groupType)===4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户账号" prop="mobile">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请使用手机号"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" :maxlength="16" placeholder="请输入6-16位密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
              <el-input v-model="form.username" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                  <el-radio  :label="1">男</el-radio>
                  <el-radio  :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" :maxlength="2" ></el-input>
            </el-form-item>
            <el-form-item label="区域"  prop="regionCode">
                <EleAreaProvinceCity :selectVal="areas" v-on:selected="EleAreaProvinceCity_CallBack"></EleAreaProvinceCity>
            </el-form-item>
            <el-form-item label="头像" prop="note">
              <input type="file" id="m11yhgl_img_input" style="display:none" @change="upload_img">
                <div class="img_up" style="width:60px;height:60px;border:1px solid #d8dce5;">
                  <i class="iconfont icon-icon_pic" style="font-size:50px;position:absolute;top:12px;left:4px;" v-show="img_src===false"></i>
                  <img width="60" height="60"  id="m11yhgl_img" :src="img_src" v-show="img_src!==false">
                </div>
                <span class="upload" onclick="document.querySelector('#m11yhgl_img_input').click()"><div style="color:#337ab7;cursor:pointer;display:inline;">点击上传(小于400KB)</div></span>
            </el-form-item>
            <el-form-item label="绑定媒体" prop="mresName" v-show="Number(form.groupType)===3">
              {{form.mresName}}
            </el-form-item>
          </el-form>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="save" >保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import rules from "../../../../utils/rules/"
import base64 from 'base-64'
import utf8 from 'utf8'
import md5 from "md5"
import { mapState } from "vuex"
import {  EleAreaProvinceCity  } from '../../../../components/business/'
export default {
  components:{EleAreaProvinceCity},
  data() {
    const rule_pwd = (rule,value,callback)=>{
      if(this.addModifyToggle === 'add') {
        if (!this.form.password) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkAge = (rule, value, callback) => {
      let deg = /^(?:[1-9]?\d|100)$/
      if (value && !deg.test(value)) {
        return callback(new Error('年龄范围为0-100的正整数'));
      } else {
        callback()
      }
    }
    return {
      form: {groupType: 1, mobile: '', password: '', username: '', sex: '', age: '', provinceCode: '', districtCode: '', areaProvince: '', areaDistrict: '', dealerId: '', dealerName: '', mediaId: '', mediaName: '', mresId: '', mresName: ''},
      formRules: {
        mobile: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [
          { validator: rule_pwd, trigger: 'blur' }
        ],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        age: [{trigger: "blur", validator: checkAge}]
      },
      areas:[],
      add_modify_params_imgurl: '',
      img_src: false,
    }
  },
  props: ["isShow", "data", "addModifyToggle", "imgSrc"],
  computed: {
    ...mapState(["prefix"])
  },
  methods: {
    handleClose() {
      this.$parent.isShow = false
      // this.$refs.form.resetFields()
      this.form = {groupType: 1, mobile: '', password: '', username: '', sex: '', age: '', provinceCode: '', districtCode: '', areaProvince: '', areaDistrict: '', dealerId: '', dealerName: '', mediaId: '', mediaName: '', mresId: '', mresName: ''}
      this.$parent.data = null
      this.img_src = false
    },
    // 上传头像时获取本地地址
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 上传头像
    upload_img (event) {
      let target = event.target
      let objUrl = this.getObjectURL(target.files[0])
      let size = target.files[0].size
      if (size >= 1024000 * 10) this.show_tip('图片超过10M了哦')
      else {
        if (objUrl) {
          // this.img_url = objUrl
          this.imgshow = true
          this.img_src = objUrl
          this.touxiang_change = true
        }
      }
    },
    // 新增/修改上传图片处理
    add_modify_imgStep (callback) {
      let that = this
      if (!that.touxiang_change) {
        callback()
      } else {
        let formData = new FormData()
        formData.append('img', document.querySelector('#m11yhgl_img_input').files[0])
        formData.append('token', sessionStorage.getItem('access_token'))
        formData.append('imgGroup', 1)
        $.ajax({
          type: 'post',
          url: that.BASE_URL + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (result) {
            result = JSON.parse(result)
            if (result.errorMessage && result.errorMessage !== '') {
              that.show_tip(result.errorMessage)
              that.touxiang_change = true
              return
            }
            // console.log('上传图片成功,返回结果是: ', result)
            that.add_modify_params_imgurl = result.content.url
            that.touxiang_change = false
            callback()
          }
        })
      }
    },
    EleAreaProvinceCity_CallBack(val){
        console.log('val', val)
        this.form.regionCode = val
    },
    save() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          if (that.addModifyToggle === 'add') {
            that.add_modify_imgStep(function () {
              that.api_businessManagePlatform_userAdd ({
                data: Object.assign({}, that.form, !that.touxiang_change ? {icon: that.add_modify_params_imgurl} : {}, {
                  token: sessionStorage.getItem('access_token'),
                  password: that.form.password ? md5(that.form.password).toLowerCase() : ''
                }),
              }).then(res => {
                that.handleClose()
                that.$parent.init()
                that.add_modify_params_imgurl = ''
              })
            })
          } else if (that.addModifyToggle === 'modify') {
            console.log(that.form.password)
            that.add_modify_imgStep(function () {
              that.api_businessManagePlatform_userEdit ({
                data: Object.assign({}, that.form, !that.touxiang_change ? {icon: that.add_modify_params_imgurl} : {}, {
                  token: sessionStorage.getItem('access_token'),
                  password: that.form.password ? md5(that.form.password).toLowerCase() : ''
                }),
              }).then(res => {
                that.handleClose()
                that.$parent.init()
                that.add_modify_params_imgurl = ''
              })
            })
          }
        }
      })
    }
  },
  watch: {
    isShow(v) {
      this.$parent.isShow = v
    },
    data(v) {
      if (v) {
        console.log('data', v)
        this.form = {...v}
      }
    },
    imgSrc (v) {
      console.log(v)
    }
  }
};
</script>
