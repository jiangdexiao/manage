<template>
  <div class="m10jsgl">
    <div class="history_list" >
      <h5>导出历史</h5>
      <div class="tableBox clearfix">
        <el-table
            :data="tableData"
            :show-header = "header"
            style="width: 100%">
            <el-table-column
                prop="reportName"
                label="报表名称"
                >
            </el-table-column>
            <el-table-column
                prop="exportTime"
                label="导出时间"
                :formatter="export_time"
                width="300">
            </el-table-column>
            <el-table-column
                label="导出状态"
                width="200">
                <template slot-scope="scope">
                <span v-if="scope.row.reportStatus== 1">导出中...</span>
                <el-button plain  class="derive" v-if="scope.row.reportStatus== 2" @click="download(scope.row.reportLink)">下载</el-button>
                <span v-show="scope.row.reportStatus== -1" class="fail">失败</span><el-button plain  class="derive" v-if="scope.row.reportStatus== -1" @click="re_download(scope.row.reportId)">重新导出</el-button>
                </template>
                
            </el-table-column>
        </el-table>
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
    </div>
     <div class="back" @click="goto" path="/m/settlementDetail">返回</div>

  </div>
</template>

<script>
import { tool } from "../../../../utils/"
export default {
  name: "",
  data() {
    return {
      // 搜索参数
      inout_search_params: { inoutType: "", startDate: "", endDate: "" },
      input2: "",
      input21: "",
      value: "",
      // 加载图层
      loading: false,
      ruleForm: {
        status: "",
        date1: "",
        date2: ""
      },
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        date1: [
          { type: "date", required: true, message: "请选择日期", trigger: "change" }
          // { range:' date1 > ' message: '选择时间有误，不可选择将来的时间', trigger: 'change' }
        ],
        date2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ]
      },
      tableData: [],
      // 隐藏表格头部
      header: false,
      pagination: { pageNo: 1, pageSize: 10 },
      pageCount: 0
    };
  },
  watch: {},
  methods: {
    goto(event) {
      let that = this;
      let path = event.target.getAttribute("path");
      if (!path) return;
      if (that.active_path === path) {
        that.$router.go(0);
        return;
      }
      that.$router.push({path: path})
    },
    // 分页功能
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagination.pageSize = val;
      this.get_hisdate();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagination.pageNo = val;
      this.get_hisdate();
    },
    export_time(row, column) {
      return this.tool.date.format(
        new Date(row[column.property]),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    // 下载
    download(link) {
      location.href = link;
    },
    // 获取表格数据
    get_hisdate() {
      this.api_businessManagePlatform_getSettleList ({ 
        data: {
          pageNumber: this.pagination.pageNo,
          rows: this.pagination.pageSize,
          type: "1"
        },
      }).then(res => {
        this.tableData = res.content
        this.pageCount = res.totalCount
        this.pagination.pageNo = res.pageNumber
      })
    },
    // 重新导出
    re_download(id) {
      this.api_businessManagePlatform_resExportSettle ({ 
        data: {
          reportId: id
        },
      }).then(res => {
        this.get_hisdate()
      })
    }
  },
  mounted() {
    this.get_hisdate()
  },
}
</script>

<style lang="scss" scoped>
.m10jsgl {
  .history_list {
    margin: 20px 0 0 30px;
    width: 95%;
    padding: 10px 20px;
    // background: #fff;
    h5 {
      font-size: 14px;
      font-weight: bold;
      line-height: 28px;
      border-bottom: 2px solid #b7c9e1;
      color: #333;
    }
    .derive {
      margin-right: 20%;
      width: 80px;
      height: 30px;
      line-height: 3px;
      padding: 0;
      text-align: center;

      // background: #fff;
      // border: 1px solid #ccc;
    }
    .fail {
      color: red;
      margin-right: 10px;
    }
    .bot {
      border-bottom: 1px solid #e6e8f2;
    }
    .tableBox {
      text-align: left;
      margin-bottom: 10px;
    }
  }
  .back {
    width: 110px;
    line-height: 40px;
    border-radius: 2px;
    background: #b7c9e1;
    color: #fff;
    text-align: center;
    cursor: pointer;
    margin: 60px 0 0 30px;
  }
}
.modal-open {
  #build {
    display: flex;
  }
  #build.in {
    z-index: 2000;
  }
}
</style>
