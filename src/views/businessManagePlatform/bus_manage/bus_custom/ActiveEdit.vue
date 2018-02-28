<template>
   <div class="edit-form">
    <el-dialog
      :title="btnType== 'add'? '新增活动':'编辑活动'"
      custom-class='dialog'
      :visible.sync="isShow"
      :before-close="handleClose">
        <el-col :span="24" >
          <el-form ref="form" :model="form"  label-width="100px">
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="form.title" :maxlength="30" @blur="checkName" placeholder="请输入活动标题"></el-input>
            </el-form-item>
            <el-form-item label="展示时间" prop="time">
							<el-date-picker
								v-model="time"
								width="360"
								height="50"
								:editable="false"
								type="daterange"
								range-separator="-"
								start-placeholder="开始日期" v-if="timeShow"
                end-placeholder="结束日期" value-format="yyyy-MM-dd"
                :picker-options="pickerBeginDateBefore"
                @change="timeCheck">
							</el-date-picker>
            </el-form-item>
						<el-form-item label="投放媒体" prop="mediaNames">
              <div class="box">
                <div class="mediaName" @click="toggle = !toggle">{{form.mediaNames}}</div>
                <!--选择投放媒体下拉框-->
                <div class="mediaN" v-show="toggle" tabindex="1">
                        <div class="left">
                          <div class="form-group  filtrate">
                              <select class="form-control area_select area_select3" v-model="bind_mtzy_search_params.province" id="areaProvince_select_bind_mtzy">
                                  <option value="" >所有地区</option>
                                  <option v-for="(cell,i) in province_all_bind_mtzy" :value="cell.code" :key="i">{{cell.name}}</option>
                              </select>
                              <select class="form-control area_select area_select3" v-model="bind_mtzy_search_params.city" id="areaCity_select_bind_mtzy">
                                  <option value="" >所有地区</option>
                                  <option v-for="(cell,i) in city_all_bind_mtzy" :value="cell.code" :key="i">{{cell.name}}</option>
                              </select>
                          </div>
                          <input class="form-control serInp" type="text" v-model="bind_mtzy_search_params.mediaName" placeholder="请输入媒体名称搜索" @keydown.enter="get_media_list">
                          <div class="all-media">
                            <h5 @click="select_all_media">全部媒体</h5>
                            <ul >  
                              <li v-for="(cell,i) in media_list" :key="i" class="checkbox" @click="addto_choosen_medialist(cell.mediaId,cell.mediaName)"><label>{{cell.mediaName}}</label><div class="add_med" ></div></li>
                            </ul>
                          </div>
                        </div>
                        <div class="right">
                          <div class="choosen" >
                            <div v-if="choosen_all_media"> <span class="choosen_list"><span class="text">全部媒体</span></span></div>
                            <div v-for="(cell,i) in choosen_medialist" :key="i"> <span class="choosen_list"><span class="text">{{cell.mediaName}}</span> <span class="del" @click="delfrom_choosen_medialist(cell.mediaId,cell.mediaName)"></span></span></div>
                          </div>
                            <a class="sure" @click="sure_select">确定</a>
                        </div>
                </div>
              </div>
							
						</el-form-item>
						<el-form-item label="展示内容" prop="type">
							<el-radio-group v-model="form.type">
								<el-radio :label="1">自定义</el-radio>
								<el-radio :label="2">链接</el-radio>
							</el-radio-group>
						</el-form-item>
            <el-form-item label="内容" v-show="form.type==1" prop="content">
              <div id="editor-container">
								<UE :defaultMsg="Msg" :config="config" ref="ue"></UE>
							</div>
            </el-form-item>
						<el-form-item label="链接" v-show="form.type==2">
							<el-input v-model="form.link"  placeholder="请输入活动链接"></el-input>
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
import UE from '../../../../components/ueditor/ue.vue'
export default {
	name: '',
	components: {UE},
  data() {
    return {
      startTime:null,
      pickerBeginDateBefore:{
        // 小于今天的有效期不能使用
        disabledDate : (time) => {
          let beginDateVal
          if(this.handle_toggle=='modify' && this.status == 1){
            beginDateVal = this.startTime
            if(beginDateVal){
              return time.getTime() < beginDateVal
            }
          }else{
            beginDateVal = new Date();
            if(beginDateVal){
              return time.getTime()+24*60*60*1000 < beginDateVal
            }
          }
        }
      },
      form: {title: '', sInvalidTime: '', eInvalidTime: '', mediaNames: '', mediaJson: '', content: '', link: 'http://',type: 1, activityId: ''},
			config: {
				initialFrameWidth: null,
				initialFrameHeight: 350
			},
      bind_mtzy_search_params: {mediaName: '', province: '', city: '', regionCode: ''},
      showType:'',
			time:[],
        // 选择媒体弹框
      media_select: false,
      // 所有的省份(供新增修改使用)
      province_all_bind_mtzy: [],
      // 可选的城市(供新增修改使用)
      city_all_bind_mtzy: [],
      // 已选择媒体列表
      choosen_medialist: [],
      // 可选的媒体列表
      media_list:[],
      // 是否选中全部媒体
      choosen_all_media: true,
      // 切换选择投放媒体面板显示
      toggle: false,
      timeShow:true,
      // 验证时间
      checktime:false,
      Msg:''
    };
  },
  props: ["isShow", "data", "btnType", "defaultMsg"],
  methods: {
    checkName () {
      let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
      let value = this.form.title.replace(/(^\s*)|(\s*$)/g,"")
      console.log('活动标题',value)
      if (!value) {
        return this.$message.error('活动标题不能为空');
      }
      if (!deg.test(value)) {
        return this.$message.error('支持中英文，30个字符以内，不支持特殊符号,中间不能有空格！');
      }
    },
    // 时间赋值
    timeCheck () {
      let that = this
      if (that.time != null) {
        if(that.handle_toggle=='modify' && that.status == 1){
          if(that.time[0] != that.timeChecked[0]){
            that.$message({
              message: '开始日期不可更改',
              type: 'warning'
            });
            that.timeShow = false
            that.time = that.timeChecked
            that.form.sInvalidTime = that.time[0]
            that.form.eInvalidTime = that.time[1]
            that.$nextTick(()=>{
              that.timeShow = true
              console.log(that.time)
            })
          }else if(that.time[1] < that.date_format(new Date, 'yyyy-MM-dd')){
            that.$message({
              message: '结束日期不能小于今天',
              type: 'warning'
            });
            that.timeShow = false
            that.time = that.timeChecked
            that.form.sInvalidTime = that.time[0]
            that.form.eInvalidTime = that.time[1]
            that.$nextTick(()=>{
              that.timeShow = true
              console.log(that.time)
            })
          }else{
            that.form.sInvalidTime = that.time[0]
            that.form.eInvalidTime = that.time[1]
          }
        }else{
          that.form.sInvalidTime = that.time[0]
          that.form.eInvalidTime = that.time[1]
        }
      } else {
        that.form.sInvalidTime = ''
        that.form.eInvalidTime = ''
      }
    },
    handleClose() {
      this.$parent.isShow = false
      this.$parent.defaultMsg = ''
      this.Msg = ''
			this.form =  {title: '', sInvalidTime: '', eInvalidTime: '', mediaNames: '', mediaJson: '', content: '', link: 'http://',type: 1, activityId: ''}
      this.$parent.data = null
      this.$refs.ue.setUEContent('')
      // this.$refs.form.resetFields()
      this.time = null
      this.toggle = false
      this.choosen_all_media = false
      this.choosen_medialist = []
		},
    // 添加到已选择媒体列表
    addto_choosen_medialist (id, name) {
      let that = this
      var index = 0
      if (that.choosen_medialist.length === 0) {
        that.choosen_medialist.push({
          mediaId: id,
          mediaName: name
        })
      } else {
        that.choosen_medialist.some((item, i) => {
          if (id === item.mediaId) {
            index++
            // that.show_tip('该媒体已选中！')
            return
          }
          if (i === that.choosen_medialist.length - 1 && index === 0) {
            that.choosen_medialist.push({
              mediaId: id,
              mediaName: name
            })
          }
        })
      }
      // console.log('已选择的媒体', that.choosen_medialist)
      // console.log('name', name)
    },
    // 选择全部媒体
    select_all_media () {
      this.choosen_all_media = true
      this.choosen_medialist = []
    },
    // 删除已选择媒体列表的媒体
    delfrom_choosen_medialist (id, name) {
      // console.log('要删除的id', id)
      let that = this
      that.choosen_medialist.some((item, i) => {
        if (id === item.mediaId) {
          // console.log('目标的id', item.mediaId)
          that.choosen_medialist.splice(i, 1)
          console.log(that.choosen_medialist)
          return
        }
        console.log(i)
      })
    },
    // 获取媒体列表
    get_media_list () {
      let that = this
      this.bind_mtzy_search_params.regionCode = this.bind_mtzy_search_params.city ? this.bind_mtzy_search_params.city : this.bind_mtzy_search_params.province
      this.api_businessManagePlatform_mediaList({ 
        data: {
          regionCode: that.bind_mtzy_search_params.regionCode,
          mediaName: that.bind_mtzy_search_params.mediaName,
          token: sessionStorage.getItem('access_token')
        },
      }).then(result => {
         this.media_list = result.content
          console.log('媒体列表', that.media_list)
      })
    },
    // 确定选择哪些媒体
    sure_select () {
      event.stopPropagation()
      let that = this
      that.form.mediaNames = ''
      // console.log('选择媒体列表', that.choosen_medialist)
      // 判断是否选择的全部媒体
      if (that.choosen_all_media) {
        that.form.mediaNames = '全部媒体'
        that.form.mediaJson = JSON.stringify(that.choosen_medialist)
        that.toggle = false
        return 
      } else {
        console.log( that.choosen_medialist)
         that.choosen_medialist.map((item, i) => {
          that.form.mediaNames += item.mediaName + ','
          if (i === that.choosen_medialist.length - 1) {
            that.form.mediaJson = JSON.stringify(that.choosen_medialist)
            that.toggle = false
          }
        })
      }
    },
    // 获取省列表
    get_addr () {
      console.log(111)
      this.api_businessManagePlatform_allProvList({ 
        data: {
          token: sessionStorage.getItem('access_token')
        },
      }).then(result => {
        this.province_all_bind_mtzy = result.content
      })
    },
    // 活动新增/修改提交
    save() {
      if (this.form.type == 1) {
        this.form.content = this.$refs.ue.getUEContent()
        console.log('内容',this.form.content)
      }
      let deg = /^([\u4e00-\u9fa5]|[0-9a-zA-Z]|[\x21-\x7e]])+$/
      let value = this.form.title.replace(/(^\s*)|(\s*$)/g,"")
      if (!value) {
        return this.$message.error('活动标题不能为空');
      }
      if (!deg.test(value)) {
        return this.$message.error('支持中英文，30个字符以内，不支持特殊符号,中间不能有空格！');
      }
      if (this.time == null) {
        return this.$message.error('展示时间不能为空！')
      }
      if (this.form.mediaNames == '') {
        return this.$message.error('投放媒体不能为空！')
      }
      if (parseInt(this.form.type) === 1 && !this.form.content) {
        return this.$message.error('内容不能为空！')
      } 
      if (parseInt(this.form.type) === 2 && this.form.link === 'http://') {
        return this.$message.error('链接不能为空！')
      }
      if (this.showType == 'add') {
        console.log('确认新增')
        this.api_businessManagePlatform_addActive({ 
          data: Object.assign({}, this.form, {
            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            isAllMedia: this.choosen_all_media ? 1 : 2,
            systemAccessToken: sessionStorage.getItem('access_token')
          }),
        }).then(result => {
          this. get_media_list()
          this.$parent.isShow = false 
          // 清空已选择媒体列表
          this.choosen_medialist = []
          this.time = null
          this.$parent.get_active_info()
        })
      } else if (this.showType == 'edit') {
        console.log('确认编辑')
        this.api_businessManagePlatform_editActive({ 
          data: Object.assign({}, this.form, {
            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            isAllMedia: this.choosen_all_media ? 1 : 2,
            systemAccessToken: sessionStorage.getItem('access_token')
          }),
        }).then(result => {
          this. get_media_list()
          this.$parent.isShow = false 
          // 清空已选择媒体列表
          this.choosen_medialist = []
          this.time = null
          this.$parent.get_active_info()
        })
      }
    }
  },
  computed:{

  },
  watch: {
    // 监听已选择媒体列表是否为空
    'choosen_medialist': {
      handler (code, oldCode) {
        let that = this
        if (code.length !== 0) {
          that.choosen_all_media = false
        } else {
          that.choosen_all_media = true
        }
      },
      deep: true
    },
    // 绑定媒体资源时监控省份
    'bind_mtzy_search_params.province': {
      handler (code, oldCode) {
        if (code === '' || code === undefined) {
          this.bind_mtzy_search_params.city = ''
          this.city_all_bind_mtzy = []
          this.get_media_list()
          return
        }
        if (code !== oldCode) {
          // console.log('绑定媒体资源栏省份选择变化,新的省份code:' + code + ',旧的省份code:' + oldCode)
          this.api_businessManagePlatform_allCityList({ 
            data: {
              token: sessionStorage.getItem('access_token'),
              province: code
            },
          }).then(res => {
            this.city_all_bind_mtzy = res.content
          })
          this.get_media_list()
        }
      },
      deep: true
    },
    'bind_mtzy_search_params.city': {
      handler (code, oldCode) {
          this.get_media_list()
      },
      deep: true
    },
    'time': {
      handler (val, oldVal) {
          if (!oldVal) return
          if (val == oldVal) return
          if (!val) {
              this.form.sInvalidTime = ''
              this.form.eInvalidTime = ''
          }
      },
      deep: true
    },
    'toggle': {
      handler (val, oldVal) {
        if (!val) {
          this.bind_mtzy_search_params = {mediaName: '', province: '', city: '', regionCode: ''}
        }
      },
      deep: true
    },
    isShow(v) {
      this.$parent.isShow = v
      if (v) {
          this.Msg = this.defaultMsg
      }
    },
    data(v) {
      if (v) {
        console.log('shuju--',v)
        this.form = v
				this.time = [new Date(v.sInvalidTime),new Date(v.eInvalidTime)]
				this.form.sInvalidTime = this.tool.date.format(new Date(v.sInvalidTime),'yyyy-MM-dd') 
				this.form.eInvalidTime = this.tool.date.format(new Date(v.eInvalidTime),'yyyy-MM-dd') 
				// this.form.title = v.title
				if (v.isAllMedia === 1) {
					this.form.mediaNames = '全部媒体'
				} else {
					this.form.mediaNames = v.mediaNames
          this.choosen_medialist = JSON.parse(v.mediaJson)
          console.log('已选媒体',this.choosen_medialist)
				}
        // this.form.activityId = v.activityId
				// this.form.type = v.type
        // this.form.isAllMedia = v.isAllMedia
      } else {
        this.form =  {title: '', sInvalidTime: '', eInvalidTime: '', mediaNames: '', mediaJson: [], content: '', link: 'http://',type: 1, activityId: ''}
      }
    },
    // defaultMsg(v) {
    //   if (v) {
    //     // if (this.$refs.ue !== undefined) {
    //     //   this.$refs.ue.setUEContent(v)
    //     // } 
    //     this.Msg = v
    //     console.log('this.Msg',this.Msg)
    //   }
    // },
    btnType(v) {
      if (v) {
        this.showType = v
        console.log(this.showType)
      }
    }
	},
  mounted () {
    this.showtime = false
    this.showtime = true
    this.get_addr()
    this.get_media_list()
  }
};
</script>

<style lang="scss" scoped>
.edit-form {
  .textarea_upgTip {
    height: 100px;
    resize: none;
    width: 200px;
	}
 
	/* 富文本输入框样式 */
	#editor-container {
		line-height: 20px!important;
	}
   
	.link {
		width:356px;
	}
  .box {
    position: relative;
    .mediaName {
      height:36px;
      width:340px;
      border-radius: 4px;
      border:1px solid #d8dce5;
      overflow: hidden;
      padding: 0 10px;
    }
    .mediaN{
      width:360px;
      // height: 100px;
      border: 1px  solid  #BFC1CB ;
      display: flex;
      position: absolute;
      top: 36px;
      // left:159px;
      z-index: 2001;
      border-radius: 2px;
      box-shadow: 1px 1px 4px 0 rgba(0,0,0,.3);
      background-color: #fff;
      outline: none;
      .left{
        width:220px;
        border-right: 1px  solid  #BFC1CB ;
        // background-color: red;
        .filtrate{
          padding: 8px 0 0 8px;
          .area_select3{
            width:86px;
            height:26px;
            border-radius: 2px;
          }
        }
        .serInp{
          width:190px;
          margin-left:8px;
          height:26px;
          border-radius: 2px;
        }
        .all-media{
          font-size: 12px;
          h5{
            line-height: 30px;
            background-color: #EDF0F7;
            font-size: 12px;
            padding:0 10px;
            margin-bottom:0;
          }
          ul{
            // padding-left:10px;
              .checkbox {
                line-height: 30px;
                margin:0;
                position: relative;
                label{
                  max-width:180px;
                  padding:0 10px;
                  box-sizing: border-box;
                }
                .add-med{
                  width:16px;
                  height: 16px;
                  background:url('../../../../../static/images/businessManage/icon_add2.png');
                  // background:url('../../../../assets/images/businessManage/icon_add2.png');
                  background-size: cover;
                  position: absolute;
                  top:8px;
                  right:5px;
                  display: none;
                }
              }
              .checkbox:hover {
                border-top:1px solid #DFE9F6;
                border-bottom:1px solid #DFE9F6;
                .add_med{
                  display: block;
                }
              }
              
            }
        }
      }
      .right{
        flex:1;
        position: relative;
        // background-color: blue;
        .choosen{
          width:100%;
          padding: 10px;
          .choosen_list{
            // width:90%;
            display: inline-block;
            height:24px;
            position: relative;
            margin-bottom:10px;
            box-sizing: border-box;
            font-size: 12px;
            padding:0 8px;
            border-radius: 4px;
            background-color: #DFE9F6;
            .text{
              display: inline-block;
              min-width: 50px;
              max-width:118px;
              // height:26px;
              line-height:22px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .del{
                width:14px;
                height: 14px;
                position: absolute;
               background:url("../../../../../static/images/businessManage/icon_delet.png");
                background-size: cover;
              //  border: 1px solid #DFE9F6;
                border-radius: 50%;
                right:-7px;
                top:-7px;
                display:none;
            }
          }
          .choosen_list:hover{
            .del{
              display: block;
            }
          }
        }
        .sure{
            width:80px;
            height: 26px;    
            display: block;    
            line-height: 26px;
            text-align: center;             
          //  position: absolute;
          //  bottom: 8px;
          //  right:8px;
          margin-left:50px;
            background: #11D2EB;
            color:#fff;
            border:1px solid transparent;
            box-sizing:border-box;
        }
      }
    }
  }
    
  
  
}
</style>
