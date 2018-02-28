<template>
   <div class="edit-form">
		<h5 >
			<span class="title">编辑主页开屏广告</span>
			<span class="tip">（该广告位展示于客户端的首页；一天同一用户只展示一次。）</span>
		</h5>
		<div class="con clearfix">
			<div class="img fl">
				<img width="180" height="304" src="" id="ad_img" v-show ="img_show">
				<i class="white iconfont icon-icon_pic" v-show ="!img_show"></i>
			</div>
			<div class="set fl">
				<input type="file" id="img_upload" style="display:none" @change="upload_img" accept="image/png;image/jpeg">
				<button @click="up_load" v-show ="!img_show">点击上传</button>
				<button @click="up_load" v-show ="img_show">重新上传</button>
				<p>尺寸1242px*1908px 格式PNG/RGB 文件大小600K以内</p>
				<div class="setForm">
					<el-form label-position="left" :model="ruleForm" label-width="100px" class="demo-ruleForm">
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
						<el-form-item label="跳转设置">
							<el-select v-model="ruleForm.jumpSet" placeholder="">
								<el-option label="不跳转" :value="0"></el-option>
								<el-option label="页面" :value="2"></el-option>
								<el-option label="商品" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label=""  v-show="ruleForm.jumpSet != 0">
							<el-input   v-show="ruleForm.jumpSet == 2" v-model="ruleForm.jump" placeholder="请输入跳转网址"></el-input>
							<el-select
							  class="jump"
								v-model="ruleForm.goodsName"
								v-show="ruleForm.jumpSet == 1" 
								filterable
								remote
								reserve-keyword
								placeholder="请输入商品名进行搜索"
								no-data-text="暂无搜索结果"
								@change = "select_goods"
								@clear = "clear_goods"
								:clearable = "true"
								:remote-method="get_goods"
								:loading="loading">
								<el-option
									v-for="item in goodsList"
									:key="item.value"
									:label="item.goodsName"
									:value="item.goodsId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="footer">
				<button class="button_left" @click="save">保存</button>
				<button @click="goto('/m/marketAdvertise')">返回</button>
			</div>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
			img_show:false,
			loading:false,
			ruleForm: {
				displayStatus:1,
				goodsId:null,
				goodsName:null,
				jump:null,
				jumpSet:null,
				picUrlCommon:null,
				timing :'',
				timingSet:''
			},
			goodsList:[]
		}
  },
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
		up_load () {
			document.querySelector('#img_upload').click()
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
		upload_img () {
			let that = this
			let target = event.target
			let objUrl = this.getObjectURL(target.files[0])
			let size = target.files[0].size
			let img = new Image()
			img.src = objUrl
			if (size >= 1024*600) {
				this.$message({
					message: '图片大小不超过600k',
					type: 'warning'
				});
				return
			}
			console.log('大小通过')
			if (objUrl) {
				// 上传图片
				let formData = new FormData()
				formData.append('img', document.querySelector('#img_upload').files[0])
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
						  // that.mediaObjUrl = res.content.url
							that.ruleForm.picUrlCommon = res.content.url
							that.img_show = true
							document.querySelector('#ad_img').src = res.content.url
					}
				})
			}
			
		},
		// 获取主页广告信息
		getInfo () {
			this.api_businessManagePlatform_advLocationSingle({ 
        data: {
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
					advType:2
        }
      }).then(res => {
				this.ruleForm = res.content
				this.img_show = this.ruleForm.picUrl ? true: false
				if (res.content.picUrlCommon) {
					this.ruleForm.picUrlCommon = res.content.picUrlCommon
					document.querySelector('#ad_img').src = res.content.picUrlCommon
					this.img_show = true
				}
      })
		},
		// 搜素商品
		get_goods (query) {
			if (query !== '') {
				this.api_businessManagePlatform_getGoodsList({ 
        data: {
		    	goodsName:query
        }
      }).then(res => {
				this.goodsList = res.content
      })
			} else {
				this.goodsList = [];
				// this.ruleForm.goodsId = ''
				// this.ruleForm.goodsName = ''
			}
		},
		select_goods(val){
			this.ruleForm.goodsId = val
			this.goodsList.some(item => {
				if (item.goodsId == val) {
					console.log('item',item)
					this.ruleForm.goodsName = item.goodsName
				}
			})
		},
		clear_goods () {
			this.ruleForm.goodsId = ''
			this.ruleForm.goodsName = ''
		},
		save() {
			console.log(this.ruleForm.jumpSet)
			// 判断跳转设置
		  if (this.ruleForm.jumpSet == 1 ) {
				if (this.ruleForm.goodsId=='') {
					this.$message({
						message: '请选择跳转商品',
						type: 'warning'
					});
					return
				}
			} else if (this.ruleForm.jumpSet == 2 ) {
				if (this.ruleForm.jump =='' || this.ruleForm.jump == null) {
					this.$message({
						message: '请填写页面跳转链接',
						type: 'warning'
					});
					return
				}
			} else {
					this.ruleForm.goodsId = ''
					this.ruleForm.goodsName = ''
					this.ruleForm.jump = ''
			}  

			// 判断有没有设置定时生效
			if (this.ruleForm.timingSet == 1) {
				if (this.ruleForm.timing) {
			  	this.ruleForm.timing = (this.ruleForm.timing).valueOf()
				}else {
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
					picUrlCommon:this.ruleForm.picUrlCommon,
					jumpSet:this.ruleForm.jumpSet,
					jump:this.ruleForm.jump,
					goodsId:this.ruleForm.goodsId,
					goodsName:this.ruleForm.goodsName
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
	min-width: 762px;
	background-color: #fff;
	padding:20px 0 76px 18px;
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
		.img{
			width:180px;
			height: 304px;
			background-color: #ECECEC ;
			margin-left:5px;
			text-align:center;
			.white {
				color:#fff;
				line-height: 304px;
				font-size:60px;
			}
		}
		.set {
			// width:800px;
			// height:400px;
			margin-left:20px;
			// background-color: #ECECEC ;
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
			.setForm {
				margin-top: 10px;
				width:100%;
				.el-form-item {
					margin-bottom: 0;
				}
				.el-select,.el-form-item__content{
					line-height: none;
				}
			}

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
