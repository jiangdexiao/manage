<template>
  <div class="list">
    <div class="head">
      <h5>{{data.headLine}}</h5>
      <p>展示时间：{{data.startTime}} ~ {{data.endTime}}</p>
    </div>
    <div class="cont" v-html="data.content">

    </div>
    <div class="footer">
			<!--<button class="button_left">完成</button>-->
			<button @click="goto('/m/marketAdvertise/headLine')">返回</button>
		</div>
  </div>
</template>
<script>
// import UE from '../../../../../components/ueditor/ue.vue'
export default {
  	// components: {UE},
  data() {
    return {
      activeName: 'first',
      data:{},
      config: {
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
    };
  },
  watch: {
  },
  methods: {
    goto (path) {
        this.$router.push({path: path})
    },
    init() {
      this.api_businessManagePlatform_HeadLineInfo({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          topLineId:sessionStorage.getItem('headLineId')
        })
      }).then(res => {
        console.log('详情',res.content)
        this.data = res.content
      })
    }
  },
  mounted () {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  .head {
    padding: 30px 0 0 47px;
    height: 98px;
    border-bottom:1px solid #E6E8F2;
    box-sizing: border-box;
    h5{
      color:#333;
      font-size:18px;
    }
    p{
      color:#999;
      font-size:12px;
      line-height: 32px;
    }
  }
  .cont {
    // height: 300px;
    padding:10px 0 72px 47px;
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
        margin-top:15px;
        width:80px;
        height:30px;
        background-color: #fff;
        border:1px solid #ccc;
      }
	}
}
</style>


