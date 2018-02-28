<template>
  <div class="list">
    <div class="goodInfo changeGoodInfo">
      <p>
        <span><i class="red">*</i>品牌名称：</span>
        <el-input v-model="add_modify_params.brandName" :maxlength="30" placeholder="1-30字符"></el-input>
      </p>
      <p>
        <span>英文名称：</span>
        <el-input v-model="add_modify_params.brandNameEn"  :maxlength="20" placeholder="1-20字符"></el-input>
      </p>
      <div class="mb30">
        <span>品牌区域：</span>
        <select id="country_select" v-model="add_modify_params.firstAreaCode">
          <option value=""></option>
          <option v-for="(cell,index) in country_all_search" :key="index" :value="cell.code">
            {{cell.name}}
          </option>
        </select>
        <select id="province_select" v-model="add_modify_params.twoAreaCode" v-if="province_show">
          <option value=""></option>
          <option v-for="(cell,index) in province_all_search" :key="index" :value="cell.code">
            {{cell.name}}
          </option>
        </select>
        <select id="city_select" v-model="add_modify_params.threeAreaCode" v-if="city_show">
          <option value=""></option>
          <option v-for="(cell,index) in city_all_search" :key="index" :value="cell.code">
            {{cell.name}}
          </option>
        </select>
      </div>
      <div>
        <span class="fl">品牌LOGO：</span>
        <input type="file" id="m11yhgl_img_input" style="display:none" @change="upload_img()">
        <div class="img_up" onclick="document.querySelector('#m11yhgl_img_input').click()">
          <img width="100" height="100" v-show='imgshow' id="m11yhgl_img">
        </div>
        <span class="upload">请上传1M以内的图片</span>
      </div>
        <el-button type="primary" size="medium" @click="change_confirm()">保存</el-button>
        <el-button size="medium" style="margin-left:20px;margin-top:29px;" @click="goback">返回</el-button>
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
        handle_toggle:this.$route.query.handle_toggle,
        // 上传图片后返回的地址
        imgshow: false,
        add_modify_params_imgurl: '',
        // 新增/修改的数据
        add_modify_params: {approveId: '', brandId: '', brandName: '', brandNameEn: '', firstAreaCode: '', twoAreaCode: '', threeAreaCode: '', firstAreaName: '', twoAreaName: '', threeAreaName: '', brandLogo: ''},
        // 上传头像标识
        touxiang_change: false,
        // 所有的国家(供搜索使用)
        country_all_search: [],
        // 可选的省份(供搜索使用)
        province_all_search: [],
        // 所有的城市(供搜索使用)
        city_all_search: [],
        province_show: false,
        city_show: false,
      }
    },
    watch: {
      // 查询时监控国家
      'add_modify_params.firstAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.twoAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.api_sellerManagePlatform_getIntel({
              data:{
                parentCode: code
              }
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.province_all_search = result.content
                if (result.content.length > 0) {
                  that.province_show = true
                  that.city_show = false
                }
              }
            })
            // that.$.ajax({
            //   url: that.base + 'm2c.operate/address/getintel.web',
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     parentCode: code
            //   },
            //   success: function (result) {
            //     that.province_all_search = result.content
            //     if (result.content.length > 0) {
            //       that.province_show = true
            //       that.city_show = false
            //     }
            //   }
            // })
          }
        },
        deep: true
      },
      // 查询时监控省份
      'add_modify_params.twoAreaCode': {
        handler (code, oldCode) {
          let that = this
          if (code === '' || code === undefined) {
            that.add_modify_params.threeAreaCode = ''
            return
          }
          if (code !== oldCode) {
            that.api_sellerManagePlatform_getIntel({
              data:{
                parentCode: code
              }
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.city_all_search = result.content
                if (result.content.length > 0) {
                  that.city_show = true
                }
              }
            })
            // that.$.ajax({
            //   url: that.base + 'm2c.operate/address/getintel.web',
            //   data: {
            //     token: sessionStorage.getItem('mToken'),
            //     parentCode: code
            //   },
            //   success: function (result) {
            //     that.city_all_search = result.content
            //     if (result.content.length > 0) {
            //       that.city_show = true
            //     }
            //   }
            // })
          }
        },
        deep: true
      }
    },
    methods: {
      getBrandInfo(){
        let that = this
        that.area()
        if(that.handle_toggle==='modify'){
          that.touxiang_change = false
          that.api_sellerManagePlatform_getBrand({
            pathParams:'/' + that.$route.query.id
          }).then(result=>{
            that.add_modify_params = result.content
            /* 初始化图片 */
            document.querySelector('#m11yhgl_img').src = result.content.brandLogo ? result.content.brandLogo : ''
            if (result.content.brandLogo && result.content.brandLogo != '') {
              that.imgshow = true
            } else {
              that.imgshow = false
            }
          })
        }else{
          that.province_show = false
          that.city_show = false
          that.api_sellerManagePlatform_getBandId({}).then(result=>{
            if(result==undefined){
              return false
            }else if(result.status === 200){
              that.add_modify_params.brandId = result.content
            }
          })
        }
      },
      area () {
        let that = this
        // 获取省市区列表
        that.api_sellerManagePlatform_getIntel({}).then(result=>{
          if(result==undefined){
            return false
          }else if(result.status === 200){
            that.country_all_search = result.content
          }
        })
        // that.$.ajax({
        //   url: that.base + 'm2c.operate/address/getintel.web',
        //   data: {
        //     token: sessionStorage.getItem('mToken')
        //   },
        //   success: function (result) {
        //     that.country_all_search = result.content
        //   }
        // })
      },
      // 上传图片时获取本地地址
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
      // 上传图片
      upload_img () {
        let target = event.target
        let objUrl = this.getObjectURL(target.files[0])
        let size = target.files[0].size
        if (size >= 1024000)
        this.$message.error('图片超过1M了哦')
        else {
          if (objUrl) {
            // this.img_url = objUrl
            this.imgshow = true
            document.querySelector('#m11yhgl_img').src = objUrl
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
          formData.append('token', sessionStorage.getItem('mToken'))
          formData.append('imgGroup', 4)
          console.log('formData',formData)
          console.log('img',document.querySelector('#m11yhgl_img_input').files[0])
          // that.api_sellerManagePlatform_uploadImg({
          //   data:formData
          // }).then(result=>{
          //   if(result==undefined){
          //     return false
          //   }else if(result.status === 200){
          //     result = JSON.parse(result)
          //     if (result.errorMessage && result.errorMessage !== null) {
          //       that.$message({
          //         type:'warning',
          //         message:result.errorMessage
          //       })
          //       return
          //     }
          //     that.add_modify_params_imgurl = result.content.url
          //     callback()
          //   }
          // })
          $.ajax({
            type: 'post',
            url: that.BASE_URL + 'm2c.support/img/upload',
            data: formData,
            processData: false,
            contentType: false,
            success: function (result) {
              result = JSON.parse(result)
              if (result.errorMessage && result.errorMessage !== null) {
                that.$message.error(result.errorMessage)
                return
              }
              that.add_modify_params_imgurl = result.content.url
              callback()
            }
          })
        }
      },
      // 修改保存
      change_confirm () {
        let that = this
        console.log(that.handle_toggle)
        if (that.add_modify_params.brandName === '') {
          that.$message({
            type:'warning',
            message:'品牌名称不能为空'
          })
          return
        }
        // that.reset_add_modify_params_bind()
        that.add_modify_imgStep(function () {
          // 根据国家的code获取省份名字
          {
            let select = document.querySelector('#country_select')
            let options = select.options
            let index = select.selectedIndex
            if (index === -1) {
              that.add_modify_params.firstAreaName = ''
            } else {
              that.add_modify_params.firstAreaName = options[index].text
            }
          }
          // 根据省份code获取城市名字
          {
            let select = document.querySelector('#province_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.twoAreaName = ''
              } else {
                that.add_modify_params.twoAreaName = options[index].text
              }
            }
          }
          // 根据城市code获取区域名字
          {
            let select = document.querySelector('#city_select')
            if (select !== null) {
              let options = select.options
              let index = select.selectedIndex
              if (index === -1) {
                that.add_modify_params.threeAreaName = ''
              } else {
                that.add_modify_params.threeAreaName = options[index].text
              }
            }
          }
          if(that.handle_toggle === 'add'){
            that.api_sellerManagePlatform_modifyBrand({
              type:'post',
              data: Object.assign({
                token: sessionStorage.getItem('mToken')
              }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {})
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.$message({
                  type:'success',
                  message:'保存成功！'
                })
                that.$router.push({'name':'s_set_brand'})
              }else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
              }
            })
          }else{
            that.api_sellerManagePlatform_modifyBrand({
              type:'put',
              pathParams:'/'+that.add_modify_params.brandId,
              data: Object.assign({
                token: sessionStorage.getItem('mToken')
              }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {})
            }).then(result=>{
              if(result==undefined){
                return false
              }else if(result.status === 200){
                that.$message({
                  type:'success',
                  message:'保存成功！'
                })
                that.$router.push({'name':'s_set_brand'})
              }else{
                that.$message({
                  type:'warning',
                  message:result.errorMessage
                })
              }
            })
          }
          // that.$.ajax({
          //   type: that.handle_toggle === 'add' ? 'post' : 'put',
          //   url: that.handle_toggle === 'add' ? that.localbase + 'm2c.scm/brand/mng' : that.localbase + 'm2c.scm/brand/mng/' + that.add_modify_params.brandId,
          //   // data: Object.assign({}, that.add_modify_params, that.touxiang_change ? {icon: that.add_modify_params_imgurl} : {}, {
          //   data: Object.assign({
          //     token: sessionStorage.getItem('mToken')
          //   }, that.add_modify_params, that.touxiang_change ? {brandLogo: that.add_modify_params_imgurl} : {}),
          //   success: function (result) {
          //     if (result.status == '200' || result.status == 200) {
          //       that.get_comment_info()
          //       that.changeGoodShow = false
          //     } else {
          //       that.show_tip(result.errorMessage)
          //       return
          //     }
          //   }
          // })
        })
      },
      goback(){
        let that = this
        that.$router.push({'name':'s_set_brand'})
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
  /*详情*/
  #myTabContent{position:relative;}
  em.bread{position:fixed; top:80px;left:367px;font-style:normal;color:#333;z-index:9999;}
  .goodInfo{}
  .goodInfo p,.goodInfo div{margin-left:160px;margin-top:20px;line-height:36px;color:#333;font-size:14px;}
  .goodInfo button{margin-left:160px;margin-top:20px;}
  .goodInfo button.ml20{margin-left:20px;}
  .goodInfo div.img_up{margin-top:10;margin-left:6px;}
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
  /*修改/新增*/
  .changeGoodInfo input,.changeGoodInfo select{width:200px;line-height:34px;color:#666;}
</style>
