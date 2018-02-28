<template>
  <div class="list">
    <div class="title">
      <p>{{title}}</p>
      <span>摘要：</span>  
      <span>{{remark}}</span>
    </div>
    <div class="push_msg_content" v-html="ue_content"></div>
    <div class="footer">
			<button @click="goto('/m/pushMessage')">返回</button>
		</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ue_content: JSON.parse(sessionStorage.getItem('PushSeeInfo')).content,
      title: JSON.parse(sessionStorage.getItem('PushSeeInfo')).title,
      remark: JSON.parse(sessionStorage.getItem('PushSeeInfo')).remark
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
    goto () {
			this.$router.push({path: '/m/pushMessage/recordPush'})
    },
    send () {
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
		console.log('用户信息', JSON.parse(sessionStorage.getItem('PushSeeInfo')))
  }
};
</script>

<style lang="scss" scoped>
.list {
	height:100%;
  background-color: #fff;
	margin: 10px 0px 0 0;
	box-sizing: border-box;
  .title {
    height: 97px;
    border-bottom: 1px solid #E6E8F2;
    padding: 30px 47px;
    box-sizing: border-box;
    p {
      font-size: 18px;
      color: #333333;
    }
    span {
      display: inline-block;
      font-size: 12px;
      color: #999999;
      margin-top: 10px;
    }
  }
  .push_msg_content {
    padding: 30px 47px;
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
      margin-left: -215px;
		}
	}
}
</style>


