<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="电话/账号" v-model="search_params.mobile" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="姓名" v-model="search_params.userName" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.groupType" placeholder="选择用户组" clearable>
              <el-option label="普通用户" value="1"></el-option>
              <el-option label="促销员" value="2"></el-option>
              <el-option label="媒体" value="3"></el-option>
              <el-option label="经销商" value="4"></el-option>
            </el-select>
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
            <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onClickBtnAdd="onClickBtnAdd"
      @onClickBtnEdit="onClickBtnEdit"
      @onClickBtnForbid="onClickBtnForbid"
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @del="del"
      @forbid="forbid"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
    </list-data>
    <Edit :isShow="isShow" :data="data" :addModifyToggle="addModifyToggle" :imgSrc="imgSrc" :saveSuccess="Save_Success" ></Edit>
    <el-dialog
      title="禁用用户"
      custom-class='dialog_static'
      :visible.sync="forbid_show"
      :before-close="handleClose">
      <el-col :span="24" >
        <el-form ref="form" :model="forbid_params" label-width="100px">
          <el-form-item label="用户ID">
            {{forbid_params.userId}}
          </el-form-item>
          <el-form-item label="用户账号" prop="password">
            {{forbid_params.mobile}}
          </el-form-item>
          <el-form-item label="禁用时长" prop="groupType">
            <el-select v-model="forbid_params.forbidType" placeholder="请选择">
              <el-option label="24小时" :value="1"></el-option>
              <el-option label="终身禁用" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Edit from "./Edit.vue"
import { tool } from "../../../../utils/"
export default {
  components: {Edit},
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          {
            type: "operate",
            label: "操作",
            width: 130,
            btns: [
              { text: "修改", eventName: "edit" },
              { text: "禁用", eventName: "forbid", style: 'color:red' },
              { text: "解禁", eventName: "del", style: 'color:#5B8774' }
            ]
          },
          { key: "userId", label: "ID", tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.userId, 5)
          } },
          { key: "mobile", label: "电话/账号" },
          { key: "icon", label: "头像", type: "image", formatter:function(row,column,cellValue){
            if (row.icon != '' && row.icon != null) {
              return row.icon
            } else {
              return '-'
            }
          }},
          { key: "username", label: "姓名" },
          { key: "groupType", label: "用户组", formatter: function (row,column,cellValue) {
            return row.groupType === 1 ? '普通用户' : row.groupType === 2 ? '促销员' : row.groupType === 3 ? '媒体' : '经销商'
          }},
          { key: "forbidType", label: "禁用信息",formatter: function (row,column,cellValue) {
            let jinyongxinxi = {
              '0': '正常',
              '1': '禁用24小时',
              '2': '终身'
            }
            return jinyongxinxi[row.forbidType]
          }},
          { key: "successOrderNumber", label: "成交订单数", width: 90, },
          { key: "commentNum", label: "评价数" },
          { key: "sex", label: "性别", formatter: function (row,column,cellValue) {
            return row.sex === 1 ? '男' : row.sex === 0 ? '女' : '-'
          }},
          { key: "age", label: "年龄" },
          { label: "区域", formatter: function (row,column,cellValue) {
            return (row.areaProvince ? row.areaProvince : '') + ' ' + (row.areaDistrict ? row.areaDistrict : '')
          }},
          { label: "第三方账号", width: 120, type: 'html', formatter: function (row,column,cellValue) {
            if (row.bindWeChat && row.bindQQ) {
              return '微信：已绑定' + '<br>' + 'QQ：已绑定'
            } else if (row.bindWeChat && !row.bindQQ) {
              return '微信：已绑定' + '<br>' + 'QQ：/'
            } else if (!row.bindWeChat && row.bindQQ) {
              return '微信：/' + '<br>' + 'QQ：已绑定'
            } else if (!row.bindWeChat && !row.bindQQ) {
              return '微信：/' + '<br>' + 'QQ：/'
            }
          }},
          { key: "phoneModel", label: "机型", formatter:function(row,column,cellValue){
              if (row.phoneModel) {
              return row.phoneModel
            } else {
              return '-'
            }
          }},
          { key: "lastUpdatedDate", label: "最近活跃", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.lastUpdatedDate,'yyyy-MM-dd hh:mm')
          }},
          { key: "createdDate", label: "注册时间", width: 150, formatter:function(row,column,cellValue){
              return tool.date.format(row.createdDate,'yyyy-MM-dd hh:mm')
          }}
        ],
        ToolBar: [
          { text: "新增", eventName: "onClickBtnAdd" },
          { text: "修改", eventName: "onClickBtnEdit" },
          { text: "禁用", type: "danger", eventName: "onClickBtnForbid" },
          { text: "解禁", eventName: "onClickBtnDelete" }
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        }
      },
      form: {
      },
      add_modify_params: {versionNo: '', phoneType: '', upgTip: '', isMust: 0, fileUrl: '', isRedirect: 0, redirectUrl: ''},
      add_modify_toggle: '',
      goods_all: [],
      publish_params: {id: '', androidTitle: ''},
      file_change: false,
      // 等待上传文字显示
      wait_upload: false,
      // 限制多次点击按钮只提交一次
      isSuccess: true,
      time:'',
      // 搜索参数
      search_params: {mobile: '', userName: '', groupType: '', startTime: '', endTime: ''},
      // 禁用的数据
      forbid_params: {userId: '', mobile: '', username: '', forbidType: ''},
      addModifyToggle: '',
      isShow: false,
      data: null,
      imgSrc: false,
      forbid_show: false
    };
  },
  watch: {
    // 修改用户组时监控
    'add_modify_params.isRedirect': {
      handler (val, oldVal) {
        if (val === '') return
        if (val === oldVal) return
        if (parseInt(val) === 2) this.add_modify_params.redirectUrl = ''
      },
      deep: true
    },
    'add_modify_params.phoneType': {
      handler (val, oldVal) {
        if (val === '') return
        if (val === oldVal) return
        if (parseInt(val) === 1) {
          this.add_modify_params.isRedirect = 3
        }
      },
      deep: true
    },
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          this.search_params.publishDateStart = ''
          this.search_params.publishDateEnd = ''
        }
      },
      deep: true
    }
  },
  methods: {
    handleClose () {
      this.forbid_show = false
    },
    Save_Success() {
      console.log("保存成功");
    },
    onClickSearch() {
      this.init();
    },
    edit(opts, selectIems) {
      if (opts.data.upgStatus === 2) {
        this.$message({ type: "error", message: "目标已发布,无法修改" })
        return
      }
      this.data = opts.data
      this.isShow = true
      this.addModifyToggle = 'modify'
    },
    forbid(opts) {
      this.forbid_show = true
      this.forbid_params = {
        userId: opts.data.userId,
        mobile: opts.data.mobile,
        username: opts.data.username || '',
        forbidType: ''
      }
    },
    // 禁用
    save(opts) {
      this.api_businessManagePlatform_forbid ({ 
        data: Object.assign({}, {token: sessionStorage.getItem('access_token')}, this.forbid_params),
      }).then(res => {
        this.forbid_show = false
        this.init()
      })
    },
    //解禁
    del(opts) {
      this.$confirm(("确认禁用用户" + opts.data.mobile + " ？"), "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_unForbid ({ 
          data: {
            token: sessionStorage.getItem('access_token'),
            userId: opts.data.userId
          },
        }).then(res => {
          this.init()
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      }).catch(() => {})
    },
    //新增
    onClickBtnAdd(opts) {
      this.data = null
      this.isShow = true
      this.addModifyToggle = 'add'
      this.imgSrc = false
    },
    //修改
    onClickBtnEdit(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        this.edit({ data: selectItems.datas[0] });
      }
    },
    // 禁用
    onClickBtnForbid(opts, selectItems) {
      console.log(2)
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        this.forbid({ data: selectItems.datas[0] });
      }
    },
    //解禁
    onClickBtnDelete(opts, selectItems) {
      if (selectItems && selectItems.ids.length == 0) {
        this.$message({ type: "warning", message: "请选择一项" })
        return;
      } else if (selectItems.ids.length > 1) {
        this.$message({type:'warning',message:'只能选择一项'})
        return
      } else {
        this.del({ data: selectItems.datas[0] })
      }
    },
    onChangeCurPage(page) {
      this.datagrid.Pagination.current_page = page
      this.init()
    },
    onChangeCurPageSize(pageSize) {
      this.datagrid.Pagination.page_size = pageSize
      this.init()
    },
    init() {
      if (this.time !== null && this.time !== '') {
        this.search_params.startTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
        this.search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
      }
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNum = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_userListAll({ 
        data: Object.assign({} ,{
          token: JSON.parse(sessionStorage.getItem('userInfo')).token
        }, this.form, this.search_params)
      }).then(res => {
        this.datagrid.List = res.content
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted () {
    this.init();
  }
}
</script>

