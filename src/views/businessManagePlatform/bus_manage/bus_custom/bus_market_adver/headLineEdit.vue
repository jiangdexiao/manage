<template>
  <div class="list">
    <el-tabs v-model="form.topLineType" @tab-click="handleClick">
      <div class="box" v-if ="type == 'add'" style="text-align: center;">
        <el-tab-pane label="超链接" name="2" > </el-tab-pane>
        <el-tab-pane label="图文消息" name="1" ></el-tab-pane>
      </div>
      <div class="box" v-if ="type == 'edit' && form.topLineType == '1'">
        <el-tab-pane label="图文消息" name="1" ></el-tab-pane>
      </div>
      <div class="box" v-if ="type == 'edit' && form.topLineType == '2'">
        <el-tab-pane label="超链接" name="2" > </el-tab-pane>
      </div>
      
    </el-tabs>
    <div class="headlineTime" v-show="form.topLineType== '1'">
      <el-form :inline="true"  class="demo-form-inline" >
        <el-form-item label="标题设置" class="halfwidth">
          <el-input v-model="form.headLine" placeholder="请输入标题,最多15个字，必填" :maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="展示时间" class="headlineTime">
           <el-date-picker
            v-model="form.startTime"
            :editable = 'false'
            type="datetime"
            :picker-options = "beforToday"
            placeholder="选择开始日期时间"
             @change="checkEndTime">
					</el-date-picker>-&nbsp;&nbsp;
          <el-date-picker
            v-model="form.endTime"
            :editable = 'false'
            type="datetime"
            :picker-options = "beforToday"
            placeholder="选择结束日期时间"
             @change="checkEndTime">
					</el-date-picker>
        </el-form-item>
      </el-form>
      <div class="info">
        <UE :defaultMsg="defaultMsg" :config="config" ref="ue" ></UE>
      </div>
      
    </div>
    <div class="link" v-show="form.topLineType == '2'">
      <el-form  label-width="80px" >
        <el-form-item label="输入网址">
          <!--<el-input v-model="form.content"></el-input>-->
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入网址"
            v-model="form.content">
          </el-input>
        </el-form-item>
        <el-form-item label="标题设置" class="fullwidth">
          <el-input v-model="form.headLine" :maxlength="15" placeholder="请输入标题,最多15个字，必填"></el-input>
        </el-form-item>
        <el-form-item label="展示时间">
          <el-date-picker
            v-model="form.startTime"
            :editable = 'false'
            type="datetime"
            :picker-options = "beforToday"
            placeholder="选择开始日期时间"
            @change="checkEndTime">
					</el-date-picker>-
          <el-date-picker
            v-model="form.endTime"
            :editable = 'false'
            type="datetime"
            :picker-options = "beforToday"
            placeholder="选择结束日期时间"
            @change="checkEndTime">
					</el-date-picker>
          <!--<el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>-->
        </el-form-item>
      </el-form>
    </div>
        
     
    <div class="footer">
			<button class="button_left" v-if = "type == 'add'" @click="save_add">保存</button>
			<button class="button_left" v-if = "type == 'edit'" @click="save_edit">保存</button>
			<button @click="goback">返回</button>
		</div>
  </div>
</template>
<script>
import UE from '../../../../../components/ueditor/ue.vue'
// import { mapState } from 'vuex'
export default {
  	components: {UE},
  data() {
    return {
      beforToday: {
        disabledDate(time){
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      type:'',
      form: {
        topLineType:'1',
        headLine: '',
        content:'',
        startTime:null,
        endTime:null
      },
      defaultMsg:'',
      config: {
				initialFrameWidth: null,
				initialFrameHeight: 450
			},
    };
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
    goback () {
      this.$confirm('是否离开该页，内容不会保存, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.goto('/m/marketAdvertise/headLine')
      }).catch(() => {     
      });
    },
    handleClick () {
      this.form = {
        topLineType:this.form.topLineType,
        headLine: '',
        content:'',
        // time:[],
        startTime:null,
        endTime:null
      }
      if (this.$refs.ue) {
        this.$refs.ue.setUEContent('')
      }
    },
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
        this.form = res.content
        console.log('this.form',this.form)
        this.form.topLineType += ''
        // this.form.time = [res.content.startTime,res.content.endTime]
        this.defaultMsg = this.form.content
        // if (this.form.topLineType=='1'){
        //   console.log('富文本',this.form.content)
        //   setTimeout(()=>{
        //     if (this.$refs.ue) {
        //       this.$refs.ue.setUEContent(this.form.content)
        //     }
        //   },100)
        // }
      })
    },
    checkEndTime () {
      if (this.form.endTime && this.form.endTime < this.form.startTime) {
        this.$message({
          message: '结束时间必须大于开始时间！',
          type: 'warning'
        });
      }
    },
    save_add () {
      this.form.headLine = this.tool.str.trim(this.form.headLine)
      if (!this.form.headLine) {
        this.$message({
          message: '标题不能为空！',
          type: 'warning'
        });
        return 
      }
      if (!this.form.startTime) {
        this.$message({
          message: '展示开始日期必填！',
          type: 'warning'
        });
        return 
      }
      if (this.form.endTime ) {
        if (this.form.endTime < this.form.startTime) {
          this.$message({
            message: '结束时间必须大于开始时间！',
            type: 'warning'
          });
          return
        }
      }
      if (this.form.topLineType == 1) {
        this.form.content = this.$refs.ue.getUEContent()
      }
      if (!this.form.content) {
        if (this.form.topLineType == 1) {
          this.$message({
            message: '图文消息内容不能为空！',
            type: 'warning'
          });
        } else {
          this.$message({
            message: '跳转网址不能为空！',
            type: 'warning'
          });
        }
        return 
      }
      this.form.startTime = (this.form.startTime).valueOf()
      this.form.endTime = this.form.endTime ? (this.form.endTime).valueOf() :null
      this.api_businessManagePlatform_addHeadLine({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          topLineType:this.form.topLineType,
          headLine:this.form.headLine,
          content:this.form.content,
          startTime:this.form.startTime,
          endTime:this.form.endTime
        })
      }).then(res => {
        this.$message({
          message: '新增成功',
          type: 'success'
        });
        this.goto('/m/marketAdvertise/headLine')
      })
    },
    save_edit () {
      this.form.headLine = this.tool.str.trim(this.form.headLine)
      if (!this.form.headLine) {
        this.$message({
          message: '标题不能为空！',
          type: 'warning'
        });
        return 
      }
      if (!this.form.startTime) {
        this.$message({
          message: '展示开始日期必填！',
          type: 'warning'
        });
        return 
      }
      if (this.form.endTime ) {
        if (this.form.endTime < this.form.startTime) {
          this.$message({
            message: '结束时间必须大于开始时间！',
            type: 'warning'
          });
          return
        }
      }
      if (this.form.topLineType == 1) {
        this.form.content = this.$refs.ue.getUEContent()
      }
      if (!this.form.content) {
        if (this.form.topLineType == 1) {
          this.$message({
            message: '图文消息内容不能为空！',
            type: 'warning'
          });
        } else {
          this.$message({
            message: '跳转网址不能为空！',
            type: 'warning'
          });
        }
        return 
      }
      this.form.startTime = (this.form.startTime).valueOf()
      this.form.endTime = this.form.endTime ? (this.form.endTime).valueOf() :null
      this.api_businessManagePlatform_editHeadLine({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token,
          topLineId:this.form.topLineId,
          headLine:this.form.headLine,
          content:this.form.content,
          startTime:this.form.startTime,
          endTime:this.form.endTime
        })
      }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.goto('/m/marketAdvertise/headLine')
      })
    }
  },
  created(){
    this.type =  sessionStorage.getItem('headLineType')
    console.log('类型',this.type)
    if (this.type == 'edit') {
      this.init()
    }
    if (this.type == 'add') {
      this.form.topLineType = '1'
    }
  },
  mounted () {
    
  }
};
</script>

<style lang="scss" scoped>
.list {
  background-color: #fff;
  padding-bottom: 20px;
  min-width:920px;
  .info {
    width:875px;
    padding:0 0 0 15px;
  }
  .link {
    width: 600px;
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


