<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="客服电话/姓名" v-model="search_params.staff" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="search_params.ym"
              :editable="false"
              type="month"
              placeholder="选择月份">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>
<script>
import { tool } from "../../../../utils/";
export default {
  data() {
    return {
      datagrid: {
        List: [],
        FieldList: [
          { key: "reportId", label: "ID", tooltip: true, formatter:function(row,column,cellValue){
            return tool.str.textLength(row.reportId, 5)
          } },
          { key: "staffName", label: "客服" },
          { key: "ym", label: "日期" },
          { key: "complaintNum", label: "处理投诉量" },
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        },
        Checkbox: false
      },
      form: {
      },
      search_params: {staff: '', ym: ''},
      search_params_staffPhone_staffName: ''
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
    onClickSearch () {
      this.init()
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
      if (this.search_params.ym !== null && this.search_params.ym !== '') {
        this.search_params.ym =  this.tool.date.format(new Date(this.search_params.ym),"yyyy-MM")
      }
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_getAchievement({ 
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

