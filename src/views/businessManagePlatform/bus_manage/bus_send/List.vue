<template>
  <div class="list">
    <!--工具条-->
    <div class="search_tool">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="search_params" ref="numberValidateForm" :rules="formRules" class="demo-ruleForm">
          <el-form-item prop="userName">
            <el-input placeholder="手机号/账号" v-model.number="search_params.userName" :maxlength="11" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              unlink-panels
              v-model="time"
              width="350"
              :editable="false"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.tagId" placeholder="全部用户标签" clearable>
              <el-option v-for="(cell,index) in tag_list" :key="index" :label="cell.tagName" :value="cell.tagId"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" @click="add_tag_head_click">新建标签</el-button>
            <div class="add_tag_head" v-if="add_tag_head_show">
              <div class="add_tag_head_content">
                <span>标签名称</span>
                <input type="text" placeholder="请输入您需要新增的标签名称" :maxlength="6" v-model="tagName">
              </div>
              <button class="tag_button_left" @click="add_tag_all">确认</button>
              <button class="tag_button_right" @click="add_tag_head_cancel">取消</button>
            </div>
            <el-button type="primary" size="medium" class='btn-search' @click="init">搜索</el-button>
            <el-button plain size="medium" @click="reset">重置搜索条件</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <el-col :span="24">
      <div class="search">
        <div class="search_cell">
            批量操作
          <el-select v-model="batch_edit_value" class="batch" @change="batch_edit">
            <el-option label="推送" value="0"> </el-option>
            <el-option label="打标签" value="1"></el-option>
          </el-select>
          <button class="import" @click="import_user_list">导入批量推送</button>
          <button class="import_all" @click="push_all">全部用户批量推送</button>
          <button class="check" @click="RecordCheck">查看发放记录</button>
          <div class="import_label" v-show="tagShow">
            <div class="import_label_top">
              <p style="margin-bottom: 10px;">打标签</p>
              <button v-if="!add_tag_show" @click="add_tag_show=!add_tag_show">新建标签</button>
              <div class="add_tag" v-if="add_tag_show">
                <input type="text" placeholder="请输入要添加的标签名" v-model="tagName" :maxlength="6">
                <span class="span_left" @click="add_tag_all">添加</span>
                <span class="span_right" @click="cancel_tag">取消</span>
              </div>
            </div>
            <div class="import_label_content">
              <el-tree
                :data="tag_list"
                :default-checked-keys="tag_list_checked"
                show-checkbox
                default-expand-all
                node-key="tagId"
                ref="tags"
                highlight-current
                :props="defaultProps">
              </el-tree>
            </div>
            <button class="font_label font_label_left" @click="set_all_tag">确定</button>
            <button class="font_label font_label_right" @click="tag_cancel">取消</button>
          </div>
          <div class="import_users" v-show="import_show" @click="import_close_canle">
            <span>导入批量推送名单</span>
            <br>
            <span class="span_tips">导入xls、xlsx后缀名的文件；第一列为手机号/账号，添加其他内容，会导致导入失败；</span>
            <input type="file" ref="uplod_files" style="display:none" @change="file_upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
            <button class="upload_button" @click="sel_file" v-show="import_result.totalNum == ''">上传批量发放表</button>
            <button class="reupload_button" @click="sel_file" v-show="import_result.totalNum != ''">重新上传</button>
            <button class="down_button"  @click="download_module"><i class="iconfont icon-xiazai"></i>下载批量推送导入模块</button>
            <div class="upload_result" v-show="import_result.totalNum!==''">
              <p>本次已导入用户{{import_result.totalNum}}个，成功{{import_result.successNum}}个，失败{{import_result.errorNum}}个</p>
              <a @click="download_fail" v-show="import_result.errorNum!==0">下载导入失败的用户名单</a>
            </div>
            <div class="import_users_footer">
              <button :class="['edit_button', import_result.totalNum!=='' ? 'checked_button' : '']" @click="push_import">编辑推送内容</button>
              <button class="cancel_button" @click="cancel_push">取消</button>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <div class="tableBox" style="margin-left:0px;">
      <el-table
      :data="user_list"
      @selection-change="handleSelectionChange"
      stripe
      style="width: 100%; margin-top: 20px">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-popover
            ref="popover4"
            placement="bottom"
            width="234"
            height="480"
            trigger="click"
            v-model="scope.row.visible2">
            <div class="import_label">
              <div class="import_label_top">
                <p style="margin-bottom: 10px;">打标签</p>
                <button v-if="!add_tag_show" @click="add_tag_show=!add_tag_show">新建标签</button>
                <div class="add_tag" v-if="add_tag_show">
                  <input type="text" placeholder="请输入要添加的标签名" v-model="tagName" :maxlength="6" style="color:#333333;">
                  <span class="span_left" @click="add_tag_all">添加</span>
                  <span class="span_right" @click="cancel_tag">取消</span>
                </div>
              </div>
              <div class="import_label_content">
                <el-tree
                  :data="tag_list"
                  :default-checked-keys="tag_list_checked"
                  show-checkbox
                  default-expand-all
                  node-key="tagId"
                  :ref="'tagsTree'+scope.$index"
                  highlight-current
                  :props="defaultProps">
                </el-tree>
              </div>
              <button class="font_label font_label_left"  @click="set_tag">确定</button>
              <button class="font_label font_label_right" @click="scope.row.visible2=false">取消</button>
            </div>
          </el-popover>
          <el-button @click="goto(scope.row)" type="text" size="small" style='color:#0078E4;'>推送内容</el-button>
          <el-button v-popover:popover4 @click="handleEdit(scope.row, scope.$index)" type="text" size="small" style='color:#11D2EB;'>打标签</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号/账号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="头像">
        <template slot-scope="scope">
          <img v-bind:src="scope.row.icon" style="width: 50px;height: 50px;" v-show="scope.row.icon!=''&&scope.row.icon!=null">
          <div v-show="scope.row.icon==''||scope.row.icon==null" style="text-algin:center;padding-left:22px;">-</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="tagName"
        label="标签">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.tagName" placement="top" v-if="scope.row.tagName!==''">
            <div>{{scope.row.tagName===''?'-':scope.row.tagName.split(',')[2]?(scope.row.tagName.split(',')[0]+ ',' +scope.row.tagName.split(',')[1]+'...'):scope.row.tagName}}</div>
          </el-tooltip>
          <div v-if="scope.row.tagName===''">{{'-'}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdDate"
        label="注册时间"
        :formatter="timeMethod">
      </el-table-column>
    </el-table>
    </div>
    
    <el-pagination class= "pages"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNo"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount">
    </el-pagination>
  </div>
</template>
<script>
import { tool } from "../../../../utils/"
// import rules from "../../../../utils/rules/"
export default {
  data() {
    const ruleMobile = (rule,value,callback)=>{
      if( this.search_params.userName && !((/^1[34578]\d{9}$/).test(this.search_params.userName))){
        callback(new Error('手机号/账号格式不正确'))
      }else{
        callback()
      }
    }
    return {
      formRules: {
        userName: [{trigger: "blur", validator: ruleMobile}]
      },
      form: {
      },
      search_params: { tagId: '', userName: '', startTime: '', endTime: ''},
      time: '',
      batch_edit_value: '',
      // data: null,
      excel_file: '',
      import_result: { totalNum: '', successNum: '', errorNum: '', url: '' },
      // 控制批量导入用户显示隐藏
      import_show: false,
      settleIdList: [],
      tagShow: false,
      user_list: [],
      tag_list: [],
      pageCount: 0,
      // 标签树结构选中项列表
      tag_list_checked: [],
      // 分页参数
      pagination: {pageNum:1, rows: 10},
      defaultProps: {
        children: 'sysMenuNodes',
        label: 'tagName'
      },
      visible2: false,
      userId: '',
      // 点击行的index
      index: 0,
      add_tag_show: false,
      tagName: '',
      add_tag_head_show: false
    };
  },
  watch: {
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          this.search_params.startTime = ''
          this.search_params.endTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 点击顶部新增标签
    add_tag_head_click () {
      this.add_tag_head_show = true
      this.tagName = ''
    },
    // 顶部新增标签取消按钮
    add_tag_head_cancel () {
      this.add_tag_head_show = false
      this.tagName = ''
    },
    // 点击标签
    handleEdit(row, index) {
      console.log('index', index)
      this.tagName = ''
      this.index = index
      this.userId = row.userId
      this.add_tag_show = false
      this.api_businessManagePlatform_getTagList ({ 
        data: Object.assign({} ,{
          userId: row.userId,
          })
      }).then(res => {
        this.tag_list = res.content
        this.tag_list_checked = []
        this.tag_list.map((item, i) => {
          if (item.checked === 1) {
            this.tag_list_checked.push(item.tagId)
          }
          item.sysMenuNodes = []
        })
      })
      console.log(this.tag_list)
    },
    add_tag_all () {
      if (this.tagName==='') {
        this.$message({ type: "warning", message: "请输入标签名" })
        return
      }
      if (!((/^[A-Za-z0-9\u4e00-\u9fa5]+$/).test(this.tagName))) {
        this.$message({ type: "warning", message: "标签必须为6个字以内，中文、英文、数字组成" })
        return
      }
      // ^[A-Za-z0-9\u4e00-\u9fa5]+$
      this.api_businessManagePlatform_addTag ({ 
        data: {
          tagName: this.tagName,
          },
      }).then(res => {
        this.get_tag_list()
        this.tag_list_checked.push(res.content)
        this.tagName = ''
        this.add_tag_show = false
        this.add_tag_head_show = false
        this.$message({ type: "success", message: "新建标签成功" })
      })
    },
    // 批量设置标签
    set_all_tag () {
      console.log(this.settleIdList)
      this.userId = []
      this.settleIdList.map((item, i) => {
        this.userId.push(item.userId)
      })
      this.tag_list_checked = this.$refs.tags.getCheckedKeys()
      console.log('ID', this.$refs.tags.getCheckedKeys())
      this.api_businessManagePlatform_setTag ({ 
        data: {
          tagIds: this.tag_list_checked.join(','),
          userIds: this.userId.join(','),
          optType: '2'
        },
      }).then(res => {
        this.init()
        this.tag_cancel()
      })
    },
    cancel_tag () {
      this.tagName = ''
      this.add_tag_show=!this.add_tag_show
    },
    // 单个用户设置标签
    set_tag () {
      // let aaa = 'tagsTree' + this.index
      this.tag_list_checked = this.$refs['tagsTree'+this.index].getCheckedKeys()
      console.log('ID', this.tag_list_checked)
      console.log('获取的node', this.$refs['tagsTree'+this.index].getCheckedNodes())
      this.api_businessManagePlatform_setTag ({ 
        data: {
          tagIds: this.tag_list_checked.join(','),
          userIds: this.userId,
          optType: '1'
        },
      }).then(res => {
        this.init()
      })
    },
    // 列表时间格式处理
    timeMethod (row, column) {
      return this.tool.date.format(row[column.property],'yyyy-MM-dd hh:mm')
    },
    // 分页功能
    handleSizeChange(val) {
      this.pagination.rows = val
      this.init()
    },
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.init()
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size = pageSize
      this.init()
    },
    // 批量选中
    handleSelectionChange(val) {
      this.settleIdList = val
    },
    // 标签列表
    get_tag_list () {
    this.api_businessManagePlatform_getTagList ({ 
      data: Object.assign({} ,{
        }, this.form, this.search_params)
      }).then(res => {
        this.tag_list = res.content
      })
    },
    // 打标签取消
    tag_cancel () {
      this.tagShow = false
      this.tagName = ''
      this.batch_edit_value = ''
      this.add_tag_show = false
      this.tag_list_checked = []
      this.init()
    },
    // 批量打标签
    batch_edit (val) {
      console.log('val', this.settleIdList)
			if (this.settleIdList.length === 0) {
				this.$message({
					message: '请选择至少一项',
					type: 'warning'
				})
				this.batch_edit_value = ''
				return 
      }
      if (this.batch_edit_value==='0') {
        sessionStorage.setItem('targetType', '2')
        sessionStorage.setItem('PushInfo', JSON.stringify(this.settleIdList, ['mobile', 'userId', 'username', 'deviceSn', 'terminalType', 'deviceState']))
        this.$router.push({path: '/m/pushMessage/messagePushEdit'})
      } else if (this.batch_edit_value==='1') {
        console.log(this.settleIdList.length)
        if (this.settleIdList.length>1) {
          this.tagShow = true
          this.get_tag_list()
          this.tag_list_checked = []
        } else if (this.settleIdList.length===1) {
          console.log(233)
          this.tagShow = true
          this.handleEdit(this.settleIdList[0], 5)
        }
      }
		},
    goto (opts) {
      console.log(opts)
      sessionStorage.setItem('targetType', '2')
      sessionStorage.setItem('PushInfo', JSON.stringify([opts], ['mobile', 'userId', 'username', 'deviceSn', 'terminalType', 'deviceState']))
      this.$router.push({path: '/m/pushMessage/messagePushEdit'})
    },
    push_all () {
      sessionStorage.setItem('targetType', '1')
      sessionStorage.setItem('PushInfo', JSON.stringify([]))
      sessionStorage.setItem('PushNumber', this.pageCount)
      this.$router.push({path: '/m/pushMessage/messagePushEdit'})
    },
    push_import () {
      if (this.import_result.totalNum==='') {
        this.$message({type: 'warning', message: '请导入用户'})
        return
      }
      sessionStorage.setItem('targetType', '3')
      sessionStorage.setItem('PushInfo', JSON.stringify([]))
      sessionStorage.setItem('PushNumber', this.import_result.successNum)
      this.$router.push({path: '/m/pushMessage/messagePushEdit'})
    },
    RecordCheck () {
      this.$router.push({path: '/m/pushMessage/recordPush'})
    },
    download_module () {
      location.href = 'https://dl.m2c2017.com/excel/bach_jpush_users.xlsx'
    },
    // 点击推送取消
    cancel_push () {
      if (this.import_result.totalNum==='') {
        this.import_close()
        return
      }
      this.$confirm('确认取消本次导入吗？导入的内容不会保存', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.import_close()
      }).catch(() => {})
    },
    import_close () {
      // 清空内容
      this.import_result = { totalNum: '', successNum: '', errorNum: '', url: '' }
      this.$refs.uplod_files.value = ''
      this.import_show = false
    },
    // 点击导入用户模板内部，禁止关闭
    import_close_canle (e) {
      e.stopPropagation()
    },
    // 点击导入用户列表
    import_user_list (e) {
      this.import_show = true
      e.stopPropagation()
    },
    download_fail () {
      location.href = this.import_result.url
    },
    sel_file () {
      this.$refs.uplod_files.click()
    },
    // 文件上传
    file_upload (event) {
      let that = this
      let target = event.target
      let obj = window.URL.createObjectURL(target.files[0])
      var formData = new FormData()
      formData.append('file', target.files[0])
      formData.append('userId', JSON.parse(sessionStorage.getItem('userInfo')).userId)
      console.log('cs--',formData)
      // 存一次上传的文件
      this.excel_file = target.files[0]
      $.ajax({
        url: `${this.BASE_URL}m2c.users/user/importUser`,
        type: 'POST',
        data: formData,
        /**
         *必须false才会自动加上正确的Content-Type
          */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        success: function (res) {
          // if (res.content==='') {
          //   that.$refs.uplod_files.value = ''
          // }
          if (res.status === 200) {
            that.$message({
              message: '上传成功！',
              type: 'success'
            })
            that.import_result = res.content
          } else {
            that.$refs.uplod_files.value = ''
            that.$message.error(res.errorMessage)
          }
        },
        error: function () {
          that.$message.error('上传内容格式错误，请下载模板参照！')
        }
      })
    },
    importUserList () {
      this.api_businessManagePlatform_importUserList ({ 
        data: Object.assign({} ,{
        }, this.form, this.search_params)
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    },
    reset () {
      this.search_params = { tagId: '', userName: '', startTime: '', endTime: ''}
      this.time = ''
    },
    init () {
      if (this.search_params.userName!='') {
        this.$refs.numberValidateForm.validate((valid) => {
          if (valid) {
            if (this.time !== null && this.time !== '') {
              this.search_params.startTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
              this.search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
            }
            this.api_businessManagePlatform_getUserByTag ({ 
              data: Object.assign({} ,{
              }, this.pagination, this.search_params)
            }).then(res => {
              this.user_list = res.content
              this.pageCount = res.totalCount
            })
          }
        })
      } else {
        if (this.time !== null && this.time !== '') {
          this.search_params.startTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
          this.search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        }
        this.api_businessManagePlatform_getUserByTag ({ 
          data: Object.assign({} ,{
          }, this.pagination, this.search_params)
        }).then(res => {
          this.user_list = res.content
          this.pageCount = res.totalCount
        })
      }
    }
  },
  mounted () {
    this.init()
    this.get_tag_list()
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-input-placeholder {
	/* placeholder颜色  */
	color: #CCCCCC;
 }
/*表格样式*/
.tableBox{
  text-align: center;
}
.tableBox .el-table th{
  text-align: center;
}
.tableBox .pages{
  float: right;
}
  .search_tool {
    height: 80px;
    .add_tag_head {
      width: 400px;
      height: 140px;
      background: #fff;
      position: absolute;
      z-index: 2;
      border-radius: 3px;
      border: 1px solid #CCCCCC;
      .add_tag_head_content {
        height: 80px;
        border-bottom: 1px solid #CCCCCC;
        line-height: 80px;
        span {
          margin: 0 16px;
          font-size: 14px;
          color: #333333;
        }
        input {
          width:280px;
          height:32px;
          background:rgba(255,255,255,1);
          border-radius: 3px;
          border: 1px solid #E6E8F2;
          box-sizing: border-box;
          padding-left: 10px;
          color: #333333;
          outline: none;
        }
      }
      button {
        width:80px;
        height:30px;
        border-radius: 2px;
        margin-top: 15px;
        cursor: pointer;
      }
      .tag_button_left {
        border: none;
        background:#11D2EB;
        color: #fff;
        margin-left: 100px;
        margin-right: 40px;
      }
      .tag_button_right {
        border: 1px solid #CCCCCC;
        color: #333333;
        background: #fff;
      }
    }
  }
  .search {
    background: #fff;
    padding-left: 10px;
    color: #333333;
    position: relative;
    button {
      height: 30px;
      padding: 0 13px;
      margin-right: 6px;
      border: none;
      border-radius: 2px;
      color: #fff;
      cursor: pointer;
    }
    .import_label {
      width: 260px;
      height: 480px;
      background: #fff;
      position: absolute;
      // bottom: 0px;
      left: 87px;
      z-index: 11;
      border: 1px solid #CCCCCC;
      border-radius: 3px;
      box-shadow: 1px #CCCCCC;
      .import_label_top {
        height: 85px;
        color: #777777;
        font-size: 14px;
        text-align: center;
        box-sizing: border-box;
        padding-top: 15px;
        .add_tag {
          text-align: left;
          input {
            width:160px;
            height:32px; 
            border-radius: 2px;
            border: 1px solid #E6E8F2;
            color: #333333;
            font-size: 12px;
            padding-left: 6px;
            margin-left: 21px;
            margin-right: 3px;
            box-sizing: border-box;
            outline: none;
          }
          span {
            font-size: 12px;
            margin-left: 3px;
            cursor: pointer;
          }
          .span_left {
            color: #0086FF;
          }
          .span_right {
            color: #999999;
          }
        }
        p {
          margin-bottom: 10px;
        }
        button {
          width:120px;
          height:32px; 
          background:#F9FAFE;
          border-radius: 2px; 
          color: #0086FF;
          border: 1px solid #E6E8F2;
        }
      }
      .import_label_content {
        height: 333px;
        border-top: 1px solid #E6E8F2;
        border-bottom: 1px solid #E6E8F2;
        padding-top: 10px;
        box-sizing: border-box;
        overflow: auto;
      }
      .font_label {
        width: 80px;
        height: 30px; 
        background: #0086FF;
        border-radius: 2px;
        color: #fff;
        margin-top: 13px;
      }
      .font_label_left {
        margin-left: 30px;
        margin-right: 36px;
      }
      .font_label_right {
        background: #fff;
        border: 1px solid #CCCCCC;
        color: #333333;
      }
    }
    .import_users {
      width: 450px;
      min-height: 200px;
      border: 1px solid #cccccc;
      border-radius: 3px;
      background: #fff;
      padding: 30px 0 0 27px;
      box-sizing: border-box;
      position: absolute;
      // bottom: 0px;
      left: 86px;
      z-index: 11;
      span {
        font-size: 14px;
      }
      .span_tips {
        width: 167px;
        display: inline-block;
        font-size: 12px;
        color: #cccccc;
        margin-top: 10px;
        margin-bottom: 15px;
      }
      button {
        width:180px;
        height:30px; 
        background:#F9FAFE;
        border-radius: 2px; 
        border: 1px solid #E6E8F2;
        color: #0086FF;
        position: absolute;
      }
      .upload_button {
        top: 30px;
        right: 30px;
      }
      .reupload_button {
        padding: 0px;
        top: 30px;
        right: 131px;
        width:80px;
        height:30px; 
        background:rgba(245,189,35,1);
        border: none;
        border-radius: 2px;
        color: #fff;
      }
      .down_button {
        top: 70px;
        right: 30px;
        i {
          font-size: 12px;
          margin-right: 3px;
        }
      }
      .upload_result {
        width: 410px;
        background: #E6E8F2;
        opacity: 50;
        margin-left: -7px;
        padding: 15px 0;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        p {
          color: #666666;
        }
        a {
          display: inline-block;
          text-decoration: underline;
          margin-top: 3px;
          color: #88BAF4;
        }
      }
      .import_users_footer {
        height: 60px;
        border-top: 1px solid #cccccc;
        margin-top: 15px;
        margin-left: -27px;
        .edit_button {
          width:110px;
          height:30px; 
          background:#BDDBF6;
          border-radius: 2px;
          color: #fff;
          bottom: 15px;
          left: 120px;
        }
        .checked_button {
          background: #0086FF;
        }
        .cancel_button {
          width:80px;
          height:30px; 
          background:#fff;
          border: 1px solid #cccccc;
          color: #333333;
          border-radius: 2px;
          bottom: 15px;
          left: 250px;
        }
      }
    }
    .import {
      background: #11D2EB;
      margin-left: 30px;
    }
    .import_all {
      background: #0086FF;
    }
    .check {
      border: 1px solid #E6E8F2;
      color: #0086FF;
      background: #F9FAFE;
    }
  }
</style>
