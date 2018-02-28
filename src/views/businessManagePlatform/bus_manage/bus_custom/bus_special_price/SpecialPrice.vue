<template>
  <div class="special_price">
		<img src="" ref="upload_img_check" alt="" style="display:none">
		<div class="main_img">
			<div class="img_tip">
				角标图片
				<img width="88" height="30" v-show="img_src!==false" :src="img_src">
			</div>
			<i class="iconfont icon-icon_pic"></i>
		</div>
		<div class="des_words">
			<p>该功能为设置特惠价的商品，主图的左上角展示的角标，如若未上传，客户端将采用默认图片。</p>
			<p class="des_p">尺寸限制88px*30px，PNG/JPG模式，100K以内</p>
			<input type="file" ref="click_upload" style="display:none" @change="upload_img" accept="image/jpg, image/jpeg, image/png">
			<button @click="upload">点击上传角标图片</button>
		</div>
    <div class="footer">
			<button class="button_left" @click="set_icon">完成</button>
			<button @click="goto">返回</button>
		</div>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
			img_src: false,
			picture_change: false,
			configValue: ''
    }
  },
  watch: {
  },
  methods: {
		goto () {
      this.$router.push({path: '/m/clientFunManage'})
    },
		upload () {
			this.$refs.click_upload.click()
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
      if (url !== null) {
        this.upload_img_via = true
      }
      return url
    },
		// 上传图片
    upload_img (event) {
      let target = event.target
      console.log(target.files)
      let objUrl = this.getObjectURL(target.files[0])
      console.log(objUrl)
      let size = target.files[0].size
      if (size >= 1024000 * 10) this.$message({ type: "warning", message: "图片超过10M了哦" })
      else {
        if (objUrl) {
					this.$refs.upload_img_check.src = objUrl
					setTimeout(() => {
						let img = new Image()
						img.src = this.$refs.upload_img_check.src
						console.log('宽', img.width, '高',img.height )
						if (!(target.files[0].type == 'image/jpeg' || target.files[0].type == 'image/png')) {
							this.$message({
								message: '图片格式不正确,请重新上传',
								type: 'warning'
							})
							return
						}
						if (img.src && (img.width!==88 || img.height!==30)) {
							this.$message({ type: "warning", message: "图片尺寸不符合，请重新上传" })
							return
						} else {
							this.img_src = objUrl
          		this.picture_change = true
						}
					}, 100)
        }
      }
		},
		// 新增/修改上传图片处理
    add_modify_imgStep (callback) {
      let that = this
      if (!that.picture_change) {
        callback()
      } else {
        let formData = new FormData()
        formData.append('img', this.$refs.click_upload.files[0])
        formData.append('token', sessionStorage.getItem('access_token'))
        formData.append('imgGroup', 1)
        $.ajax({
          type: 'post',
          url: that.BASE_URL + 'm2c.support/img/upload',
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            res = JSON.parse(res)
            // document.querySelector('#m11yhgl_img').src = that.img_url
            if (res.errorMessage && res.errorMessage !== '') {
              that.$message({ type: "error", message: res.errorMessage })
              that.picture_change = true
              return
            }
            // console.log('上传图片成功,返回结果是: ', res)
            that.configValue = res.content.url
            that.picture_change = false
            callback()
          }
        })
      }
		},
		set_icon () {
			let that = this
			let img = new Image()
			img.src = that.img_src
			console.log('宽', img.width, '高',img.height )
			if (img.src && (img.width!==88 || img.height!==30)) {
				that.$message({ type: "warning", message: "上传图片规格有误，请重新上传" })
				return
			}
			this.api_businessManagePlatform_getIcon ({
				pathParams: `/SCM_GOODS_SPECIAL_IMAGE`
			}).then(res => {
				if (res.content === '') {
					that.add_modify_imgStep(function () {
						that.api_businessManagePlatform_setIcon ({ 
							data: {
								configKey: 'SCM_GOODS_SPECIAL_IMAGE',
								configValue: that.configValue
							},
						}).then(res => {
							that.$message({ type: "success", message: "特惠价角标更新成功" })
						})
					})
				} else {
					that.add_modify_imgStep(function () {
						that.api_businessManagePlatform_editIcon ({ 
							data: {
								configOldValue: that.img_src,
								configKey: 'SCM_GOODS_SPECIAL_IMAGE',
								configValue: that.configValue
							},
							pathParams: `/SCM_GOODS_SPECIAL_IMAGE`
						}).then(res => {
							that.$message({ type: "success", message: "特惠价角标更新成功" })
						})
					})
				}
			})
		}
  },
  mounted () {
		// 查询特惠价角标
		this.api_businessManagePlatform_getIcon ({
			pathParams: `/SCM_GOODS_SPECIAL_IMAGE`
		}).then(res => {
			this.img_src = true
			this.img_src = res.content.configValue
		})
  }
}
</script>

<style lang="scss" scoped>
.special_price {
	width: 100%;
	height: 100%;
	margin-top: 10px;
	padding-bottom: 22px;
	background: #fff;
	padding-top: 60px;
	.main_img {
		width: 280px;
		height: 280px;
		border: 1px solid #CCCCCC;
		margin: 0px auto;
		margin-bottom: 20px;
		position: relative;
		overflow: hidden;
		background: #F2F1F1;
		.img_tip {
			position: absolute;
			z-index: 1;
			width: 88px;
			height: 30px;
			background: #CCCCCC;
			line-height: 30px;
			text-align: center;
			font-size: 12px;
			color: #fff;
			img {
				position: absolute;
				top: 0px;
				left: 0px;
			}
		}
		i {
			font-size: 200px;
			position: absolute;
			top: 40px;
			left: 40px;
			color: #fff;
			background: #F2F1F1;
		}
	}
	.des_words {
		width: 280px;
		margin: 0px auto;
	}
	p {
		font-size: 12px;
		color: #666666;
	}
	.des_p {
		color: #999999;
		margin-top: 10px;
	}
	button {
		border: 1px solid #E6E8F2;
		color: #0086FF;
		width: 140px;
		height: 32px;
		background: #fff;
		border-radius: 2px;
		margin-top: 15px;
		cursor: pointer;
	}
	.footer {
		width: 100%;
		height: 60px;
		position: fixed;
		bottom: 0px;
		left: 200px;
		right: 18px;
		background: #fff;
		border-top: 1px solid #E6E8F2;
		text-align: center;
		button {
			width:80px;
			height:30px;
		}
		.button_left {
			margin-left: -215px;
			margin-right: 30px;
			background: #0086FF;
			color: #fff;
		}
	}
}
</style>