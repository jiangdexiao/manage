<template>
  <div class="list">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true" :form="form" >
          <el-form-item>
            <el-input placeholder="请输入消息标题进行搜索" v-model="search_params.title" @keydown.enter="onClickSearch" class="form-input"></el-input>
          </el-form-item>
          <el-form-item>
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
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class='btn-search' @click="onClickSearch" >搜索</el-button>
          </el-form-item>
        </el-form>
    </el-col>
    <list-data
      ref='list-data'
			@goto="goto"
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
        	{ type: 'operate',label: '操作',
            btns:[
              { text: '查看', eventName:'goto', style: 'color:#0078E4;' },
            ]
          },
          { key: "pushNum", label: "发送人数" },
          { key: "title", label: "消息标题" },
          { key: "readedNum", label: "已读" },
					{ label: "未读", formatter:function(row,column,cellValue){
              return row.pushNum - row.readedNum
          }  },
					{ key: "pushDate", label: "发送时间", formatter:function(row,column,cellValue){
              return tool.date.format(row.pushDate,'yyyy-MM-dd hh:mm')
          } },
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
      search_params: {title: ''},
      search_params_staffPhone_staffName: '',
      time: ''
    };
  },
  watch: {
    'time': {
      handler (val, oldVal) {
        let that = this
        if (!oldVal) return
        if (val == oldVal) return
        if (!val) {
          that.search_params.startTime = ''
          that.search_params.endTime = ''
        }
      },
      deep: true
    }
  },
  methods: {
    onClickSearch () {
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
		goto (opts) {
			sessionStorage.setItem('PushSeeInfo', JSON.stringify(opts.data))
			this.$router.push({path: '/m/pushMessage/recordPush/recordSee'})
		},
    init () {
			if (this.time !== null && this.time !== '') {
        // this.search_params.startTime = this.tool.date.format(new Date(this.time[0]), "yyyy-MM-dd")
        // this.search_params.endTime = this.tool.date.format(new Date(this.time[1]), "yyyy-MM-dd")
        this.search_params.startTime =  this.time[0].getTime()
        this.search_params.endTime = this.time[1].getTime()
      }
      this.form.rows = this.datagrid.Pagination.page_size
      this.form.pageNumber = this.datagrid.Pagination.current_page
      this.api_businessManagePlatform_pushMsgList ({ 
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
    this.init()
  }
}
</script>

