<template>
  <div>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="form">
          <el-form-item>
            <el-date-picker
              v-model="periodic"
              :picker-options="pickerOptions0"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="init" class='btn-search'>查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <list-data
      ref='list-data'
      @onChangeCurrentPage="onChangeCurPage"
      @onChangePageSize="onChangeCurPageSize"
      :DataGrid = 'datagrid'></list-data>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      return {
        form: {},
        periodic: [new Date(new Date().getTime() - 20 * 24 * 3600000), new Date(new Date().getTime() - 24 * 3600000)],
        startTime: '',
        endTime: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        datagrid: {
          List: [],
          FieldList: [
            { key:'num', label:'序号',width: '100px'},
            { key:'keyword', label:'关键词'},
            { key:'cnt', label:'搜索次数'},

          ],
          Pagination: {
            current_page: 1,
            page_size:10,
            total: 0
          },
          Checkbox:false,
        },

      }
    },
    mounted () {
      this.init()

    },
    methods: {
      onChangeCurPage(page) {
        this.datagrid.Pagination.current_page = page
        this.init()
      },
      onChangeCurPageSize(pageSize) {
        this.datagrid.Pagination.page_size  = pageSize
        this.init()
      },
      init(){
        this.startTime = this.periodic[0];
        this.endTime = this.periodic[1];
        this.api_biManagePlatform_keywords({data:{
          rows: this.datagrid.Pagination.page_size,
          pageNo: this.datagrid.Pagination.current_page,
          startTime: this.startTime ? this.startTime : '',
          endTime: this.endTime ? this.endTime : '',
        }}).then(res=>{
          this.datagrid.List = res.content ? res.content : []
          this.datagrid.Pagination.total= res.totalCount
          this.datagrid.List.forEach((item,i)=>{
            item.num= res.rows * (res.pageNumber-1) +i+1;
          })

        })

      }
    },

  }
</script>

<style>

</style>
