<template>
   <div class="edit-form">
		<h5 >
			<span class="title">编辑启动广告</span>
			<span class="tip">（该广告位展示于客户端启动时的启动页之后，3秒钟的展示时间，一天同一用户只展示一次。三张图片分别作用于iPhone、iPhone X、Android，需统一上传。）</span>
		</h5>
		<div class="con clearfix">
			<div class="fl box">
				<div class="img fl">
					<img width="200" height="308" src="" id="ad_img_ip" v-show ="show.ip">
					<i class="white iconfont icon-icon_pic" v-show ="!show.ip"></i>
				</div>
				<div class="set fl">
					<input type="file" id="ip_img_upload" style="display:none" @change="upload_img('ip')" accept="image/png;image/jpeg">
					<button @click="up_load ('ip')"  v-show ="!show.ip">点击上传</button>
					<button @click="up_load ('ip')"  v-show ="show.ip">重新上传</button>
					<p>尺寸1242px*1908px 格式PNG/RGB 文件大小600K以内</p>
				</div>
			</div>
			<div class="fl ml box">
				<div class="m_img img fl">
					<img width="180" height="304" src="" id="ad_img_ipx" v-show ="show.ipx">
					<i class="white iconfont icon-icon_pic" v-show ="!show.ipx"></i>
				</div>
				<div class="set fl">
					<input type="file" id="ipx_img_upload" style="display:none" @change="upload_img('ipx')" accept="image/png;image/jpeg ">
					<button @click="up_load ('ipx')" v-show ="!show.ipx">点击上传</button>
					<button @click="up_load ('ipx')" v-show ="show.ipx">重新上传</button>
					<p>尺寸1125px*1902px 格式PNG/RGB 文件大小600K以内</p>
				</div>
			</div>
			<div class="fl ml box">
				<div class="sm_img img fl">
					<img width="170" height="255" src="" id="ad_img_adnr" v-show ="show.andr">
					<i class="white iconfont icon-icon_pic" v-show ="!show.andr"></i>
				</div>
				<div class="set fl">
					<input type="file" id="andr_img_upload" style="display:none" @change="upload_img('andr')" accept="image/png;image/jpeg">
					<button @click="up_load ('andr')" v-show ="!show.andr">点击上传</button>
					<button @click="up_load ('andr')" v-show ="show.andr">重新上传</button>
					<p>尺寸1080px*1620px 格式PNG/RGB 文件大小600K以内</p>
				</div>
			</div>
		</div>
		<div class="setForm">
			<el-form label-position="left" :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="展示状态" >
					<el-select v-model="ruleForm.displayStatus" placeholder="" @change="setDisplay">
						<el-option label="展示" :value="1"></el-option>
						<el-option label="不展示" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="定时设置">
					<el-select v-model="ruleForm.timingSet" placeholder="" @change="timeSet">
						<el-option label="不设置" :value="2"></el-option>
						<el-option label="定时生效" :value="1"></el-option>
					</el-select>
					<el-date-picker
						v-model="ruleForm.timing"
						v-show="ruleForm.timingSet == 1"
						type="datetime"
						placeholder="选择日期时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
		</div>	
		<div class="footer">
			<button class="button_left" @click="save">保存</button>
			<button @click="goto('/m/marketAdvertise')">返回</button>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
			options4:[],
			show:{ip:false,ipx:false,andr:false},
			ruleForm: {
				displayStatus: '',
				jumpSet: '',
				jump: '',
				picUrl: '',
				timing: '',
				timingSet: '',
			},
		}
  },
  props: ["data"],
  methods: {
		setDisplay (val) {
			if (val == 1 && this.ruleForm.timingSet == 1) {
				this.ruleForm.timingSet = 2
			}
		},
		timeSet (val) {
			if (val == 1 && this.ruleForm.displayStatus == 1) {
				this.ruleForm.displayStatus = 2
			}
		},
		goto (path) {
       this.$router.push({path: path})
    },
		// 点击上传按钮
		up_load (type) {
			if (type== 'ip'){
				document.querySelector('#ip_img_upload').click()	
			} else if (type== 'ipx'){
				document.querySelector('#ipx_img_upload').click()	
			} else if (type== 'andr'){
				document.querySelector('#andr_img_upload').click()	
			}
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
		upload_img (type) {
			let that = this
			let target = event.target
			let objUrl = this.getObjectURL(target.files[0])
			let size = target.files[0].size
			let img = new Image()
			img.src = objUrl
			if (size >= 1024*600) {
				this.$message({
					message: '图片大小不超过10k',
					type: 'warning'
				});
				return
			}
			console.log('大小通过')
			if (objUrl) {
				// 上传图片
				let formData = new FormData()
				if (type== 'ip'){
					formData.append('img', document.querySelector('#ip_img_upload').files[0])
				} else if (type== 'ipx'){
					formData.append('img', document.querySelector('#ipx_img_upload').files[0])
				} else if (type== 'andr'){
					formData.append('img', document.querySelector('#andr_img_upload').files[0])
				}
				formData.append('img', objUrl)
				formData.append('token', sessionStorage.getItem('access_token'))
				formData.append('imgGroup', 5)
				$.ajax({
					type: 'post',
					url: that.BASE_URL + 'm2c.support/img/upload',
					data: formData,
					processData: false,
					contentType: false,
					success: function (res) {
						res = JSON.parse(res)
						if (res.errorMessage && res.errorMessage !== '') {
							that.$message({ type: "error", message: res.errorMessage })
							return
						}
						console.log('图片地址',res.content.url)
						that.ruleForm.picUrl = res.content.url
						if (type== 'ip'){
							that.show.ip = true
							document.querySelector('#ad_img_ip').src = res.content.url
              that.ruleForm.picUrlIphone = res.content.url
						} else if (type== 'ipx'){
							that.show.ipx = true
							document.querySelector('#ad_img_ipx').src = res.content.url
              that.ruleForm.picUrlIphoneX = res.content.url
						} else if (type== 'andr'){
							that.show.andr = true
							document.querySelector('#ad_img_adnr').src = res.content.url
              that.ruleForm.picUrlAndroid = res.content.url
						}
					}
				})
			}
			
		},
		remoteMethod() {
		},
		getInfo () {
			this.api_businessManagePlatform_advLocationSingle({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          advType:1
        }
      }).then(res => {
        this.ruleForm = res.content
        if (res.content.picUrlIphone){
          this.show.ip = true
          document.querySelector('#ad_img_ip').src = res.content.picUrlIphone
        } 
        if (res.content.picUrlIphoneX){
          this.show.ipx = true
          document.querySelector('#ad_img_ipx').src = res.content.picUrlIphoneX
        } 
        if (res.content.picUrlAndroid){
          this.show.andr = true
          document.querySelector('#ad_img_adnr').src = res.content.picUrlAndroid
        }
      })
		},
		save() {
			if (!this.ruleForm.picUrlIphone || !this.ruleForm.picUrlIphoneX || !this.ruleForm.picUrlAndroid) {
				this.$message({
					message: 'iPhone、iPhone X、Android图片，需统一上传!',
					type: 'warning'
				});
				return 
			}
			// 判断有没有设置定时生效
			if (this.ruleForm.timingSet == 1) {
				if(this.ruleForm.timing ) {
					this.ruleForm.timing = (this.ruleForm.timing).valueOf()
				} else {
					this.$message({
						message: '请设置时间！',
						type: 'warning'
					});
					return 
				}
			}
			this.api_businessManagePlatform_advLocationEdit({ 
        data: {
		    	token:JSON.parse(sessionStorage.getItem('userInfo')).token,
					advName:this.ruleForm.advName,
					advType:this.ruleForm.advType,
					displayStatus:this.ruleForm.displayStatus,
					timing:this.ruleForm.timing,
					timingSet:this.ruleForm.timingSet,
					picUrlIphone:this.ruleForm.picUrlIphone,
					picUrlIphoneX:this.ruleForm.picUrlIphoneX,
					picUrlAndroid:this.ruleForm.picUrlAndroid
        }
      }).then(res => {
				this.$message({
          message: '保存成功',
          type: 'success'
        });
				this.goto('/m/marketAdvertise')
      })
		}
  },
  computed:{

  },
  watch: {
  },
  mounted () {
		this.getInfo()
  }
};
</script>

<style lang="scss" scoped>
.edit-form {
	background-color: #fff;
	padding:20px 0 76px 18px;
	min-width: 1080px;
	h5{
		.title {
			font-size:16px;
			color:#777777 ;
		}
		.tip {
			font-size:12px;
			color:#999999 ;
			font-weight: normal;
			padding-left:10px;
		}
	}
	.con {
		margin-top:15px;
		.box {
			height:310px;
		}
		.img{
			width:200px;
			height: 308px;
			background-color: #ECECEC ;
			margin-left:5px;
			text-align:center;
			.white {
				color:#fff;
				line-height: 304px;
				font-size:60px;
			}
		}
		.m_img {
			width:180px;
			height: 304px;
		}
		.sm_img {
			width:170px;
			height: 255px;
		}
		.set {
			margin-left:20px;
			button{
				width: 80px;
				height: 32px;
				border: 1px solid #E6E8F2 ;
				background: #F9FAFE ;
				color: #0086FF;
				font-size:14px;
				text-align: center;
				line-height: 32px;
				border-radius: 2px;
			}
			p {
				width: 110px;
				height: 50px;
				font-size:12px;
				color:#999999 ;
				margin-top:20px;
			}

		}
		.ml {
			margin-left: 20px;
		}	
	}
	.setForm {
		margin-top: 10px;
		width:100%;
		.el-form-item {
			margin-bottom: 0;
		}
		.el-select,.el-form-item__content{
			line-height: none;
		}
		.el-form-item__label {
			line-height: 54px;
		}
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
        background-color: #fff;
        border:1px solid #ccc;
        margin-top:15px;
      }
      .button_left {
        margin-left: -215px;
        margin-right: 30px;
        background: #0086FF;
        color: #fff;
        border:none;
      }
	}
}
</style>
