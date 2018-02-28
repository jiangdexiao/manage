<template>
  <div style="margin-top:10px;">
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'>
      </list-data>
  </div>
</template>

<script>
  import { tool } from "../../../../utils/";
  export default {
    name: '',
    data() {
      return {
        datagrid: {
          List: [],
          FieldList: [
            { key: "userGroupId", label: "ID", tooltip: true, formatter:function(row,column,cellValue){
              return tool.str.textLength(row.userGroupId, 5)
            }},
            { key: "userGroupName", label: "用户组" },
            { key: "userGroupPrivilege", label: "权限" },
            { key: "userCount", label: "用户数" },
            { key: "createDate", label: "添加时间", formatter: function (row,column,cellValue) {
                return tool.date.format(row.createDate, 'yyyy-MM-dd hh:mm')
            }}
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
        addModifyToggle: '',
        isShow: false,
        data: null
      };
    },
    methods: {
      onChangeCurPage(page) {
        // this.$message('当前页是第' + page + '页')
        this.datagrid.Pagination.current_page = page;
        this.init();
      },
      onChangeCurPageSize(pageSize) {
        // this.$message('当前每页显示 ' + pageSize + ' 条')
        this.datagrid.Pagination.page_size = pageSize;
        this.init();
      },
      init() {
        this.form.pageRows = this.datagrid.Pagination.page_size
        this.form.pageNo = this.datagrid.Pagination.current_page
        this.api_businessManagePlatform_userGroupList({ 
          data: {
            token: sessionStorage.getItem('access_token')
          },
        }).then(res => {
          this.datagrid.List = res.content
          this.datagrid.Pagination.total = res.totalCount
        })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
