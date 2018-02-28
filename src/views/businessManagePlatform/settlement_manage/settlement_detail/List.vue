<template>
  <div class="m10jsgl">
    <div class="_search settlement">
     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
       <el-form-item label="业务类型" prop="exportType">
          <el-select  v-model="ruleForm.exportType" placeholder="请选择业务类型" clearable>
            <!--<el-option label="全部" value=""></el-option>-->
            <el-option label="商城销售" value="1"></el-option>
            <el-option label="下载/注册分成" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算状态" prop="settleStatus">
          <el-select  v-model="ruleForm.settleStatus" placeholder="请选择结算状态" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待结算" value="1"></el-option>
            <el-option label="已结算" value="2"></el-option>
          </el-select>
        </el-form-item>
        <div style="chose_time_settlement">
          <el-form-item label="选择时间" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker :editable="false" type="date" placeholder="开始日期" v-model="ruleForm.date1"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-date-picker :editable="false" type="date" placeholder="结束日期" :picker-options="pickerBeginDateAfter" v-model="ruleForm.date2"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>
        <span class='warning'>为保证下载的良好体验，最大选择时间范围不超过31天</span>
        <el-form-item>
          <div style="position: absolute;bottom: -66px;">
            <el-button type="primary" @click="submitForm('ruleForm')">导出</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    
    </div>
    <div class="history" v-if="tableData.length > 0" >
     <h5>导出历史</h5>
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
           <span v-show="scope.row.reportStatus== 1" class="blue">导出中...</span>
           <el-button plain  class="derive" v-show="scope.row.reportStatus== 2" @click="download(scope.row.reportLink)">下载</el-button>
           <span v-show="scope.row.reportStatus== -1" style="color:red">失败</span><el-button plain  class="derive" v-show="scope.row.reportStatus== -1">重新导出</el-button>
        </template>
        
      </el-table-column>
    </el-table>
     <div class="more" @click="goto" path='/m/settlementDetail/exportHistory' v-if="pageCount > 5 ">查看更多></div>
    </div>

  </div>
</template>

<script>
import { tool } from "../../../../utils/"
export default {
  name: "",
  data() {
    return {
      // 表单验证
      ruleForm: {
        exportType: '',
        settleStatus: '',
        date1: '',
        date2: ''
      },
      rules: {
        exportType: [
          { required: true, message: '请选择结算状态', trigger: 'change' }
        ],
        date1: [
          { type: "date", required: true, message: "请选择日期", trigger: "change" }
        ],
        date2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ]
      },
      // 结束日期
      pickerBeginDateAfter: {
        disabledDate: time => {
          if (this.ruleForm.date1) {
            // 结束时间必须大于开始时间，且范围不超过31天
            if (
              time.getTime() < this.ruleForm.date1 ||
              (time.getTime() - this.ruleForm.date1) / 86400000 > 30
            ) {
              return true;
            }
          } else {
            return false;
          }
        }
      },
      tableData: [],
      pageCount: 0,
      header: false
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
    download(link) {
      location.href = link;
    },
    // 导出
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          this.api_businessManagePlatform_exportSettle ({
            data: {
              exportType: that.ruleForm.exportType,
              beginTime: that.ruleForm.date1 - 0,
              endTime: that.ruleForm.date2 - 0,
              settleStatus: that.ruleForm.settleStatus,
              userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
            }
          }).then(res => {
            that.get_hisdate()
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    export_time(row, column) {
      return this.tool.date.format(
        new Date(row[column.property]),
        "yyyy-MM-dd hh:mm:ss"
      );
    },
    // 获取表格数据
    get_hisdate() {
      this.api_businessManagePlatform_exportList ({
        data: {
          pageNumber: "1",
          rows: "5",
          type: "1"
        }
      }).then(res => {
        this.tableData = res.content;
        this.pageCount = res.totalCount;
      })
    }
  },
  mounted() {
    this.get_hisdate()
  },
  destroyed() {
    window.handle = null;
  }
};
</script>

<style lang="scss" scoped>
.m10jsgl {
  ._search {
    background-color: #fff;
    min-width: 800px;
    margin-top: 10px;
    padding: 20px 0 20px 20px;
    height: 270px;
    .el-form {
      float: left;
    }
    .demo-ruleForm {
      width: 40%;
      min-width: 618px;
      .line {
        // text-align: center;
        padding-left:17px;
      }
      position: relative;
      .warning {
        display: block;
        box-sizing: content-box;
        margin: 0px 0 2px 100px;
        color: #999;
        position: absolute;
        bottom: 0px;
        font-size: 14px;
      }
      .sel {
        width: 100%;
      }
      .sel.el-select input.el-input__inner,
      .sel.el-date-editor input.el-input__inner {
        width: 100% !important;
      }
    }
    .load {
      width: 15%;
      min-width: 160px;
      height: 100px;
      float: left;
      margin-top: 10%;
      margin-left: 20px;
      // transform: translateY(50%)
      // margin-left: 20px;
    }
  }
  .history {
    margin: 10px 0 0 0px;
    padding: 10px 20px;
    background: #fff;
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
    .bot {
      border-bottom: 1px solid #e6e8f2;
    }
    .more {
      line-height: 30px;
      background: #edf0f7;
      color: #0086ff;
      text-align: center;
      cursor: pointer;
    }
  }
}
.blue {
  color: #0086ff;
}
.el-col-2 {
  margin-top: 6px;
}
.el-col-11 {
  width: 43.83333%;
}
</style>
