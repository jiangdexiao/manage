<template>
  <div class="list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图文消息" name="first">
				<div class="title">
					<span>输入标题</span>
					<input type="text" placeholder="请输入标题，最多15个字，必填" maxlength="15"  v-model="send_params.title">
				</div>
				<div class="style_ue">
					<UE :defaultMsg="defaultMsg" :config="config" ref="ue"></UE>
				</div>
				<span class="abstract">摘要</span>
				<textarea name="" id="" placeholder="请输入摘要，最多50个字，必填" maxlength="50" style="color:#333333;"  v-model="send_params.remark"></textarea>
      </el-tab-pane>
      <el-tab-pane label="超链接" name="second">
				<div class="link">
					<span class="abstract">输入网址</span>
					<textarea name="" id="" placeholder="请输入需要跳转的网址，必填" v-model="send_params.content"></textarea>
				</div>
				<div class="title line_title">
					<span>输入标题</span>
					<input type="text" placeholder="请输入标题，最多15个字，必填" maxlength="15" v-model="send_params.title">
				</div>
				<div class="link">
					<span class="abstract abstract_link">摘要</span>
					<textarea name="" id="" placeholder="请输入摘要，最多50个字，必填" maxlength="50" v-model="send_params.remark"></textarea>
				</div>
			</el-tab-pane>
			
    </el-tabs>
    <div class="footer">
			<button class="button_left" @click="send">发送</button>
			<button @click="goto('/m/pushMessage')">返回</button>
		</div>
  </div>
</template>
<script>
import UE from '../../../../components/ueditor/ue.vue'
export default {
  	components: {UE},
  data() {
    return {
      type:'',
      activeName: 'first',
      defaultMsg:'',
      config: {
				initialFrameWidth: null,
				initialFrameHeight: 460
			},
			send_params: { title: '', content: '', pushType: '1', remark: '' }
    }
  },
  watch: {
  },
  computed:{
    // ...mapState(['headLineInfo','type'])
    // ...mapState({
    //   headLineInfo:state=>state.test.headLineInfo
    // })
  },
  methods: {
	  // tab栏切换清空数据
    handleClick (tab, event) {
			this.time = ''
			this.send_params = { title: '', content: '', pushType: '1', remark: '' }
			if (tab.name === 'first') {
				this.send_params.pushType = '1'
			} else {
				this.send_params.pushType = '2'
			}
		},
    goto (path) {
			this.$confirm('确认不发送该推送内容？该内容不会保存', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$router.push({path: path})
			}).catch(() => {    
			})
    },
    send () {
			if (this.activeName==='first') {
				if (this.send_params.title==='') {
					this.$message({type: 'warning', message: '标题为必填项哦'})
					return
				}
				if (this.$refs.ue.getUEContent()==='') {
					this.$message({type: 'warning', message: '内容为必填项哦'})
					return
				}
				if (this.send_params.remark==='') {
					this.$message({type: 'warning', message: '摘要为必填项哦'})
					return
				}
			}
			if (this.activeName==='second') {
				if (this.send_params.content==='') {
					this.$message({type: 'warning', message: '网址为必填项哦'})
					return
				}
				if (this.send_params.title==='') {
					this.$message({type: 'warning', message: '标题为必填项哦'})
					return
				}
				if (this.send_params.remark==='') {
					this.$message({type: 'warning', message: '摘要为必填项哦'})
					return
				}
			}
			(sessionStorage.getItem('targetType')==='1'?'所有用户':JSON.parse(sessionStorage.getItem('PushInfo')).length)
			let Numbers = 0
			if (sessionStorage.getItem('targetType')==='1') {
				Numbers = sessionStorage.getItem('PushNumber')
			} else if (sessionStorage.getItem('targetType')==='2') {
				Numbers = JSON.parse(sessionStorage.getItem('PushInfo')).length
			} else if (sessionStorage.getItem('targetType')==='3') {
				Numbers = sessionStorage.getItem('PushNumber')
			}
 			this.$confirm('确认发送该推送内容？推送人数： ' + Numbers + ' 。一旦发送将不可以撤销。', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let that = this
				$.ajax({
					type: 'post',
					url: that.BASE_URL + 'm2c.support/jpush/msg/add',
					data: JSON.stringify({
						pushNum: Numbers,
						title: this.send_params.title,
						remark: this.send_params.remark,
						content: this.send_params.pushType==='1'?this.$refs.ue.getUEContent():this.send_params.content,
						pushType: this.send_params.pushType,
						targetType: sessionStorage.getItem('targetType'),
						users: JSON.parse(sessionStorage.getItem('PushInfo')),
						userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
						userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
					}),
					headers: {
						'access_token': sessionStorage.getItem('access_token')
					},
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					success: function (result) {
						if (result.status === 200) {
							that.$message ({
								type: 'success',
								message: '推送成功!'
							})
							that.$router.push({path: '/m/pushMessage'})
						} else {
							that.$message ({
								type: 'error',
								message: result.errorMessage
							})
						}
					}
				})
			}).catch(() => {    
			})
		}
  },
  created(){
  },
  mounted () {
		console.log('用户信息', JSON.parse(sessionStorage.getItem('PushInfo')))
  }
};
</script>

<style lang="scss" scoped>
input::-webkit-input-placeholder {
	/* placeholder颜色  */
	color: #CCCCCC;
 }
 textarea::-webkit-input-placeholder {
	/* placeholder颜色  */
	color: #CCCCCC;
 }
.list {
	height:100%;
  background-color: #fff;
	margin: 10px 0px 0 0;
  padding: 0 20px;
	box-sizing: border-box;
	.title {
		color: #333333;
		font-size: 14px;
		margin-bottom: 20px;
		input {
			width: 400px;
			height: 30px; 
			border-radius: 3px;
			background: #fff;
			border: 1px solid #E6E8F2;
			color: #333333;
			padding-left: 10px;
			margin-left: 15px;
			outline: none;
		}
	}
	#editor {
		height: 540px;
	}
	.style_ue {
		width: 880px;
		margin-bottom: 20px;
	}
	.abstract {
		color: #333333;
		font-size: 14px;
		position: relative;
		top: -88px;
	}
	textarea {
		margin-left: 16px;
		width: 810px;
		height: 96px;
		border-radius: 3px;
		padding: 5px 10px;
		font-family: Helvetica Neue;
		color: #333333;
		border: 1px solid #E6E8F2;
		resize: none;
		outline: none;
	}
	.abstract_link {
		margin-left: 27px;
	}
	.link {
		textarea {
			width: 600px;
			height: 64px;
		}
		span {
			top: -56px;
		}
	}
	.line_title {
		margin-top: 4px;
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
			cursor: pointer;
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


