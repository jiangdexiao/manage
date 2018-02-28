<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="版本号" v-model="search_params.versionNo" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search_params.phoneType" placeholder="选择终端" clearable>
              <el-option label="iOS手机" value=1></el-option>
              <el-option label="Android手机" value=2></el-option>
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
      @onClickBtnDelete="onClickBtnDelete"
      @edit="edit"
      @del="del"
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
    <Edit :isShow="isShow" :data="data" :isSuccess="isSuccess" :fileChange="fileChange" :addModifyToggle="addModifyToggle" :saveSuccess="Save_Success" ></Edit>
  </div>
</template>
<script>
import Edit from "./Edit.vue";
import { tool } from "../../../../utils/";
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
            width: 110,
            btns: [
              { text: "修改", eventName: "edit" },
              { text: "确认发布", type: "danger", eventName: "del", style: 'color:red' }
            ]
          },
          { key: "phoneType", label: "终端", formatter: function (row,column,cellValue) {
            return row.phoneType === 1 ? 'iOS手机' : row.phoneType === 2 ? 'Android手机' : ''
          }},
          { key: "versionNo", label: "版本号" },
          { key: "upgStatus", label: "状态", formatter: function (row,column,cellValue) {
            return row.upgStatus === 1 ? '待发布' : row.upgStatus === 2 ? '已发布' : ''
          } },
          { key: "upgTip", label: "更新提示" },
          { key: "isMust", label: "是否强制升级", formatter: function (row,column,cellValue) {
            return row.isMust === 1 ? '必须' : row.isMust === 0 ? '非必须' : ''
          }},
          { key: "isRedirect", label: "是否跳转", formatter: function (row,column,cellValue) {
            return row.isRedirect === 1 ? '需要跳转' : '不需要跳转'
          }},
          { key: "redirectUrl", label: "跳转地址", formatter: function (row,column,cellValue) {
            return row.redirectUrl === '' ? '-' : row.redirectUrl
          }},
          { key: "fileUrl", label: "文件地址", formatter: function (row,column,cellValue) {
            return row.fileUrl === '' ? '-' : row.fileUrl
          }},
          { key: "publishDate", label: "发布时间", formatter:function(row,column,cellValue){
              return tool.date.format(row.publishDate,'yyyy-MM-dd hh:mm')
          }},
          { key: "publisherName", label: "发布人" },
          { key: "createdDate", label: "创建时间", formatter:function(row,column,cellValue){
              return tool.date.format(row.createdDate,'yyyy-MM-dd hh:mm')
          }}
        ],
        ToolBar: [
          { text: "新增版本", eventName: "onClickBtnAdd" },
          { text: "确认发布", eventName: "onClickBtnDelete" },
          { text: "修改", eventName: "onClickBtnEdit" }
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
      fileChange: false,
      // 等待上传文字显示
      wait_upload: false,
      // 限制多次点击按钮只提交一次
      isSuccess: true,
      time:'',
      // 搜索参数
      search_params: {versionNo: '', phoneType: '',publishDateStart:'',publishDateEnd:''},
      addModifyToggle: '',
      isShow: false,
      data: null
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
          that.search_params.publishDateStart = ''
          that.search_params.publishDateEnd = ''
        }
      },
      deep: true
    }
  },
  methods: {
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
    //发布版本
    del(opts) {
      if (opts.data.upgStatus === 2) {
        this.$message({ type: "error", message: "目标已发布,无法再次发布" })
        return
      }
      let tip = ''
      if (opts.data.phoneType === 1) {
        tip = '确认发布IOS手机版本' + opts.data.versionNo + ' ?'
      } else if (opts.data.phoneType === 2) {
        tip = '确认发布Android手机版本' + opts.data.versionNo + ' ？'
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_pubVersion ({ 
          data: Object.assign({} ,{
            id: opts.data.upgId,
            userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
            token: JSON.parse(sessionStorage.getItem('userInfo')).token
          }),
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
      this.fileChange = false
      this.isSuccess = true
      // document.querySelector('#add_modify_params_file').files[0] = ''
      document.querySelector('#add_modify_params_file').value = ''
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
    //发布
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
    // {type,data,dataIndex,list,btn,btnIndex}
    onChangeCurPage(page) {
      // this.$message('当前页是第' + page + '页')
      this.datagrid.Pagination.current_page = page
      this.init();
    },
    onChangeCurPageSize(pageSize) {
      // this.$message('当前每页显示 ' + pageSize + ' 条')
      this.datagrid.Pagination.page_size = pageSize
      this.init();
    },
    init() {
      if (this.time !== null && this.time !== '') {
        this.search_params.publishDateStart = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
        this.search_params.publishDateEnd = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
      }
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_updateList({ 
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
};
</script>

