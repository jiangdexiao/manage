<template>
  <div class="list">
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
    <Edit :isShow="isShow" :data="data" :isSuccess="isSuccess" :addModifyToggle="addModifyToggle" :saveSuccess="Save_Success" ></Edit>
  </div>
</template>
<script>
import Edit from "./Edit.vue"
import { tool } from "../../../../utils/"
import base64 from 'base-64'
import utf8 from 'utf8'
export default {
  components: {Edit, base64, utf8},
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
              { text: "删除", type: "danger", eventName: "del", style: 'color:red' }
            ]
          },
          { key: "wordId", label: "ID" },
          { key: "word", label: "关键词" },
          { key: "function", label: "作用", formatter: function (row,column,cellValue) {
              if (row.function === 'REPLACE_WITH_WHITESPACE') return '替换'
              else if (row.function === 'REFUSE_COMMIT') return '拒绝提交'
          }},
          { key: "createTime", label: "新增时间" }
        ],
        ToolBar: [
          { text: "新增", eventName: "onClickBtnAdd" },
          { text: "删除", type: "danger", eventName: "onClickBtnDelete" },
        ],
        Pagination: {
          current_page: 1,
          page_size: 10,
          total: 0
        }
      },
      form: {
      },
      add_modify_params: {words: '', function: ''},
      add_modify_toggle: '',
      addModifyToggle: '',
      isShow: false,
      data: null,
      isSuccess: true,
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
      console.log("保存成功")
    },
    onClickSearch() {
      this.init()
    },
    edit(opts, selectIems) {
      this.data = opts.data
      this.isShow = true
      this.addModifyToggle = 'modify'
    },
    //删除
    del(opts) {
      this.$confirm('确认删除吗?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.api_businessManagePlatform_forbidEdit ({
          data: Object.assign({}, {
            wordId: opts.data.wordId,
            userName: JSON.parse(sessionStorage.getItem('userInfo')).name,
            systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
            words: opts.data.word,
            function: opts.data.function === '拒绝提交' ? 'REFUSE_COMMIT' : 'REPLACE_WITH_WHITESPACE',
            action: 'D'
          }),
        }).then(res => {
          this.init()
        })
      }).catch(() => {})
    },
    //新增
    onClickBtnAdd(opts) {
      this.data = null
      this.isShow = true
      this.addModifyToggle = 'add'
      this.isSuccess = true
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
      this.form.pageRows = this.datagrid.Pagination.page_size
      this.form.pageNo = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_forbidList ({ 
        data: Object.assign({} ,{
          systemAccessToken: JSON.parse(sessionStorage.getItem('userInfo')).token,
          userName: JSON.parse(sessionStorage.getItem('userInfo')).name
        }, this.form)
      }).then(res => {
        this.datagrid.List = JSON.parse(utf8.decode(base64.decode(res.content)))
        this.datagrid.Pagination.total = res.totalCount
      })
    }
  },
  mounted () {
    console.log(JSON.parse(sessionStorage.getItem('userInfo')))
    this.init()
  }
};
</script>

